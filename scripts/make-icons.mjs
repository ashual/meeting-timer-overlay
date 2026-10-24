// Draws the extension icon at every size Chrome uses and writes extension/icons/icon<size>.png.
// The motif mirrors the overlay: a countdown ring around the current-section dot on the card's
// navy. Shapes are rendered analytically with supersampling, so no image tooling is needed.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { encodePng } from "./lib/png.mjs";

const ICONS_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "extension", "icons");

// The store asks for 96x96 artwork inside the 128x128 icon; toolbar sizes use nearly the full square.
const PADDING = { 16: 0.5, 32: 1, 48: 3, 128: 16 };
const SUPERSAMPLE = 8;
const ARC_SWEEP = 0.72;

const TOP = [27, 53, 86];
const BOTTOM = [11, 24, 42];
const TRACK = [255, 255, 255, 0.18];
const ACCENT = [45, 212, 191, 1];
const DOT = [255, 255, 255, 1];

function roundedRectDistance(x, y, center, half, radius) {
  const qx = Math.abs(x - center) - half + radius;
  const qy = Math.abs(y - center) - half + radius;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - radius;
}

function over(base, [r, g, b, a]) {
  return [base[0] * (1 - a) + r * a, base[1] * (1 - a) + g * a, base[2] * (1 - a) + b * a, base[3] * (1 - a) + a];
}

function sampleColor(x, y, size, pad) {
  const art = size - 2 * pad;
  const center = size / 2;
  if (roundedRectDistance(x, y, center, art / 2, art * 0.23) > 0) return [0, 0, 0, 0];

  const t = (y - pad) / art;
  let color = [...TOP.map((top, i) => top + (BOTTOM[i] - top) * t), 1];

  const ringRadius = art * 0.29;
  const halfStroke = art * 0.0475;
  const dx = x - center;
  const dy = y - center;
  const distance = Math.hypot(dx, dy);
  if (Math.abs(distance - ringRadius) <= halfStroke) color = over(color, TRACK);

  const angle = (Math.atan2(dx, -dy) + 2 * Math.PI) % (2 * Math.PI);
  const sweep = ARC_SWEEP * 2 * Math.PI;
  const onArc = Math.abs(distance - ringRadius) <= halfStroke && angle <= sweep;
  const nearStart = Math.hypot(dx, dy + ringRadius) <= halfStroke;
  const nearEnd = Math.hypot(dx - ringRadius * Math.sin(sweep), dy + ringRadius * Math.cos(sweep)) <= halfStroke;
  if (onArc || nearStart || nearEnd) color = over(color, ACCENT);

  if (distance <= art * 0.085) color = over(color, DOT);
  return color;
}

function drawIcon(size) {
  const pad = PADDING[size];
  const rgba = Buffer.alloc(size * size * 4);
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let sy = 0; sy < SUPERSAMPLE; sy++) {
        for (let sx = 0; sx < SUPERSAMPLE; sx++) {
          const [cr, cg, cb, ca] = sampleColor(px + (sx + 0.5) / SUPERSAMPLE, py + (sy + 0.5) / SUPERSAMPLE, size, pad);
          r += cr * ca;
          g += cg * ca;
          b += cb * ca;
          a += ca;
        }
      }
      const i = (py * size + px) * 4;
      rgba[i] = a ? Math.round(r / a) : 0;
      rgba[i + 1] = a ? Math.round(g / a) : 0;
      rgba[i + 2] = a ? Math.round(b / a) : 0;
      rgba[i + 3] = Math.round((a / SUPERSAMPLE ** 2) * 255);
    }
  }
  return encodePng(size, size, rgba);
}

mkdirSync(ICONS_DIR, { recursive: true });
for (const size of Object.keys(PADDING).map(Number)) {
  writeFileSync(join(ICONS_DIR, `icon${size}.png`), drawIcon(size));
  console.log(`extension/icons/icon${size}.png`);
}
