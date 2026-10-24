import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { inflateRawSync } from "node:zlib";
import { validateManifest } from "../scripts/lib/manifest.mjs";
import { encodePng, pngSize } from "../scripts/lib/png.mjs";
import { createZip } from "../scripts/lib/zip.mjs";
import { crc32 } from "../scripts/lib/crc32.mjs";

const EXTENSION_DIR = new URL("../extension/", import.meta.url).pathname;
const realFiles = {
  fileExists: (path) => existsSync(join(EXTENSION_DIR, path)),
  pngSizeOf: (path) => pngSize(readFileSync(join(EXTENSION_DIR, path))),
};

function readZip(zip) {
  const end = zip.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  const count = zip.readUInt16LE(end + 10);
  let at = zip.readUInt32LE(end + 16);
  const entries = [];
  for (let i = 0; i < count; i++) {
    const nameLength = zip.readUInt16LE(at + 28);
    const name = zip.toString("utf8", at + 46, at + 46 + nameLength);
    const local = zip.readUInt32LE(at + 42);
    const size = zip.readUInt32LE(at + 20);
    const dataStart = local + 30 + zip.readUInt16LE(local + 26) + zip.readUInt16LE(local + 28);
    const data = inflateRawSync(zip.subarray(dataStart, dataStart + size));
    assert.equal(crc32(data), zip.readUInt32LE(at + 16), `${name} checksum`);
    entries.push({ name, data: data.toString("utf8") });
    at += 46 + nameLength;
  }
  return entries;
}

test("the shipped manifest is ready for the store", () => {
  assert.deepEqual(validateManifest(JSON.parse(readFileSync(join(EXTENSION_DIR, "manifest.json"))), realFiles), []);
});

test("manifest validation reports store limits and missing files", () => {
  const errors = validateManifest(
    {
      manifest_version: 2,
      name: "x",
      description: "d".repeat(133),
      version: "1.02",
      icons: { 16: "icons/icon16.png" },
      background: { service_worker: "src/missing.js" },
    },
    realFiles,
  );
  assert.equal(errors.length, 5);
  assert.match(errors.join("\n"), /manifest_version/);
  assert.match(errors.join("\n"), /description must be 1-132 characters \(now 133\)/);
  assert.match(errors.join("\n"), /version/);
  assert.match(errors.join("\n"), /128x128/);
  assert.match(errors.join("\n"), /missing file: src\/missing.js/);
});

test("manifest validation checks icon dimensions", () => {
  const errors = validateManifest(
    { manifest_version: 3, name: "x", description: "d", version: "1", icons: { 128: "a.png" } },
    { fileExists: () => true, pngSizeOf: () => ({ width: 64, height: 64 }) },
  );
  assert.deepEqual(errors, ["icon a.png is 64x64, expected 128x128"]);
});

test("zips round-trip and are reproducible", () => {
  const files = [
    { name: "manifest.json", data: Buffer.from('{"a":1}') },
    { name: "src/ünïcode.js", data: Buffer.from("x".repeat(5000)) },
  ];
  const zip = createZip(files);
  assert.deepEqual(readZip(zip), files.map(({ name, data }) => ({ name, data: data.toString("utf8") })));
  assert.ok(createZip(files).equals(zip));
});

test("PNG encoding records the image size", () => {
  const png = encodePng(3, 2, Buffer.alloc(3 * 2 * 4, 255));
  assert.deepEqual(pngSize(png), { width: 3, height: 2 });
  assert.throws(() => pngSize(Buffer.from("not a png")), /not a PNG/);
});
