// Chrome Web Store limits: https://developer.chrome.com/docs/extensions/reference/manifest
const MAX_NAME_LENGTH = 75;
const MAX_DESCRIPTION_LENGTH = 132;
const VERSION_PATTERN = /^(0|[1-9]\d{0,4})(\.(0|[1-9]\d{0,4})){0,3}$/;

function referencedFiles(manifest) {
  const files = [];
  if (manifest.background?.service_worker) files.push(manifest.background.service_worker);
  if (manifest.action?.default_popup) files.push(manifest.action.default_popup);
  for (const script of manifest.content_scripts || []) files.push(...(script.js || []), ...(script.css || []));
  return files;
}

function iconEntries(manifest) {
  const entries = Object.entries(manifest.icons || {});
  for (const [size, path] of Object.entries(manifest.action?.default_icon || {})) entries.push([size, path]);
  return entries;
}

// `fileExists(path)` and `pngSizeOf(path)` resolve paths relative to the extension root.
export function validateManifest(manifest, { fileExists, pngSizeOf }) {
  const errors = [];
  if (manifest.manifest_version !== 3) errors.push("manifest_version must be 3");
  if (!manifest.name || manifest.name.length > MAX_NAME_LENGTH) {
    errors.push(`name must be 1-${MAX_NAME_LENGTH} characters`);
  }
  if (!manifest.description || manifest.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.push(`description must be 1-${MAX_DESCRIPTION_LENGTH} characters (now ${manifest.description?.length ?? 0})`);
  }
  const versionParts = String(manifest.version || "").split(".").map(Number);
  if (!VERSION_PATTERN.test(manifest.version || "") || versionParts.some((part) => part > 65535)) {
    errors.push("version must be 1-4 dot-separated integers between 0 and 65535");
  }
  if (!manifest.icons?.["128"]) errors.push("icons must include a 128x128 icon for the store");

  for (const path of referencedFiles(manifest)) {
    if (!fileExists(path)) errors.push(`missing file: ${path}`);
  }
  for (const [size, path] of iconEntries(manifest)) {
    if (!fileExists(path)) {
      errors.push(`missing icon: ${path}`);
      continue;
    }
    const { width, height } = pngSizeOf(path);
    if (width !== Number(size) || height !== Number(size)) {
      errors.push(`icon ${path} is ${width}x${height}, expected ${size}x${size}`);
    }
  }
  return errors;
}
