// Validates the manifest and packages extension/ into the zip uploaded to the Chrome Web Store.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { validateManifest } from "./lib/manifest.mjs";
import { pngSize } from "./lib/png.mjs";
import { createZip } from "./lib/zip.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const EXTENSION_DIR = join(ROOT, "extension");
const DIST_DIR = join(ROOT, "dist");

function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith("."))
    .flatMap((entry) => (entry.isDirectory() ? listFiles(join(dir, entry.name)) : [join(dir, entry.name)]));
}

const manifest = JSON.parse(readFileSync(join(EXTENSION_DIR, "manifest.json"), "utf8"));
const errors = validateManifest(manifest, {
  fileExists: (path) => existsSync(join(EXTENSION_DIR, path)),
  pngSizeOf: (path) => pngSize(readFileSync(join(EXTENSION_DIR, path))),
});
if (errors.length) {
  console.error(`extension/manifest.json is not ready to publish:\n  - ${errors.join("\n  - ")}`);
  process.exit(1);
}

const files = listFiles(EXTENSION_DIR)
  .map((path) => ({ name: relative(EXTENSION_DIR, path).split(sep).join("/"), data: readFileSync(path) }))
  .sort((a, b) => (a.name < b.name ? -1 : 1));
const zip = createZip(files);

mkdirSync(DIST_DIR, { recursive: true });
const out = join(DIST_DIR, `meeting-timer-overlay-${manifest.version}.zip`);
writeFileSync(out, zip);
console.log(`${relative(ROOT, out)}: ${files.length} files, ${(zip.length / 1024).toFixed(1)} KiB`);
