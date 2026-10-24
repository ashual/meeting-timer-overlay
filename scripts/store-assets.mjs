// Renders the Chrome Web Store screenshots and promo tiles into store/assets/ using the
// extension's real overlay and popup code (store/templates/stage.html) and a local Chrome,
// driven over the DevTools protocol pipe. Set CHROME_PATH if Chrome isn't found automatically.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { delimiter, dirname, extname, join, normalize, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { pngSize } from "./lib/png.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STAGE = "store/templates/stage.html";
const ASSETS_DIR = join(ROOT, "store", "assets");

// Sizes are the ones the store accepts. Slideshow scenes render a 960x600 screen at 4/3 pixel
// density, so the overlay is legible at the size the store shows screenshots. The compact scene
// waits out the overlay's 5-second idle timer.
const SLIDESHOW = { width: 1280, height: 800, scale: 4 / 3 };
const ASSETS = [
  { scene: "overlay", out: "screenshot-1-overlay.png", ...SLIDESHOW },
  { scene: "compact", out: "screenshot-2-compact.png", ...SLIDESHOW, waitMs: 6500 },
  { scene: "setup", out: "screenshot-3-setup.png", width: 1280, height: 800 },
  { scene: "wrapup", out: "screenshot-4-wrap-up.png", ...SLIDESHOW },
  { scene: "promo-small", out: "promo-small-440x280.png", width: 440, height: 280 },
  { scene: "promo-marquee", out: "promo-marquee-1400x560.png", width: 1400, height: 560 },
];
const SETTLE_MS = 800;

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
};

const CHROME_CANDIDATES = {
  darwin: ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Chromium.app/Contents/MacOS/Chromium"],
  win32: [
    join(process.env.PROGRAMFILES || "C:\\Program Files", "Google\\Chrome\\Application\\chrome.exe"),
    join(process.env["PROGRAMFILES(X86)"] || "C:\\Program Files (x86)", "Google\\Chrome\\Application\\chrome.exe"),
    join(process.env.LOCALAPPDATA || "", "Google\\Chrome\\Application\\chrome.exe"),
  ],
};
const CHROME_COMMANDS = ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "chrome"];

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  for (const candidate of CHROME_CANDIDATES[process.platform] || []) if (existsSync(candidate)) return candidate;
  for (const dir of (process.env.PATH || "").split(delimiter)) {
    for (const command of CHROME_COMMANDS) if (existsSync(join(dir, command))) return join(dir, command);
  }
  throw new Error("Chrome not found. Set CHROME_PATH to a Chrome or Chromium executable.");
}

function serveRepo() {
  const server = createServer((request, response) => {
    const path = normalize(join(ROOT, decodeURIComponent(new URL(request.url, "http://x").pathname)));
    if (!path.startsWith(ROOT + sep) || !existsSync(path)) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { "content-type": CONTENT_TYPES[extname(path)] || "application/octet-stream" });
    response.end(readFileSync(path));
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

// Minimal DevTools protocol client over --remote-debugging-pipe: NUL-separated JSON on fds 3 and 4.
function launchChrome(executable, profile) {
  const child = spawn(
    executable,
    [
      "--headless",
      "--remote-debugging-pipe",
      `--user-data-dir=${profile}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      "--hide-scrollbars",
      ...(process.env.CHROME_FLAGS ? process.env.CHROME_FLAGS.split(" ") : []),
      "about:blank",
    ],
    { stdio: ["ignore", "ignore", "ignore", "pipe", "pipe"] },
  );
  let nextId = 1;
  const pending = new Map();
  const listeners = new Set();
  let buffer = "";
  child.stdio[4].on("data", (data) => {
    buffer += data.toString("utf8");
    let end;
    while ((end = buffer.indexOf("\0")) >= 0) {
      const message = JSON.parse(buffer.slice(0, end));
      buffer = buffer.slice(end + 1);
      if (message.id && pending.has(message.id)) {
        const { resolve, reject } = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
      } else {
        for (const listener of listeners) listener(message);
      }
    }
  });
  const exited = new Promise((resolve) => child.on("exit", resolve));
  child.on("exit", (code) => {
    for (const { reject } of pending.values()) reject(new Error(`Chrome exited with code ${code}`));
  });

  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject });
      child.stdio[3].write(`${JSON.stringify({ id, method, params, sessionId })}\0`);
    });
  const once = (method, sessionId) =>
    new Promise((resolve) => {
      const listener = (message) => {
        if (message.method === method && message.sessionId === sessionId) {
          listeners.delete(listener);
          resolve(message.params);
        }
      };
      listeners.add(listener);
    });
  return { send, once, exited };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function capture(browser, url, { width, height, scale = 1, waitMs = 0 }) {
  const { targetId } = await browser.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await browser.send("Target.attachToTarget", { targetId, flatten: true });
  const send = (method, params) => browser.send(method, params, sessionId);
  await send("Emulation.setDeviceMetricsOverride", {
    width: Math.round(width / scale),
    height: Math.round(height / scale),
    deviceScaleFactor: scale,
    mobile: false,
  });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await send("Page.enable");
  const loaded = browser.once("Page.loadEventFired", sessionId);
  await send("Page.navigate", { url });
  await loaded;
  await sleep(SETTLE_MS + waitMs);
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  await browser.send("Target.closeTarget", { targetId });
  return Buffer.from(data, "base64");
}

const server = await serveRepo();
const base = `http://127.0.0.1:${server.address().port}`;
const profile = mkdtempSync(join(tmpdir(), "mto-store-assets-"));
const browser = launchChrome(findChrome(), profile);
try {
  mkdirSync(ASSETS_DIR, { recursive: true });
  for (const asset of ASSETS) {
    const png = await capture(browser, `${base}/${STAGE}?scene=${asset.scene}`, asset);
    const { width, height } = pngSize(png);
    if (width !== asset.width || height !== asset.height) {
      throw new Error(`${asset.out} is ${width}x${height}, expected ${asset.width}x${asset.height}`);
    }
    writeFileSync(join(ASSETS_DIR, asset.out), png);
    console.log(relative(ROOT, join(ASSETS_DIR, asset.out)));
  }
  await browser.send("Browser.close");
  await browser.exited;
} finally {
  server.close();
  rmSync(profile, { recursive: true, force: true });
}
