// Static publication checks. No dependencies or network requests.
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('docs');
const base = 'https://ashual.github.io/meeting-timer-overlay/';
const pages = (await readdir(root)).filter(name => name.endsWith('.html'));
const urls = [];
for (const name of pages) {
  const html = await readFile(path.join(root, name), 'utf8');
  const expected = base + (name === 'index.html' ? '' : name);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${name}: exactly one h1`);
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /<meta name="description" content="[^"]+"/);
  assert.ok(html.includes(`<link rel="canonical" href="${expected}">`), `${name}: canonical`);
  assert.ok(html.includes(`<meta property="og:url" content="${expected}">`), `${name}: Open Graph URL`);
  urls.push(expected);
  for (const m of html.matchAll(/<(?:a|link|img)\b[^>]*(?:href|src)="([^"]+)"/g)) {
    const ref = m[1];
    if (/^(?:https?:|mailto:|#)/.test(ref)) continue;
    const file = path.resolve(root, ref.split('#')[0]);
    assert.ok(file.startsWith(root + path.sep), `${name}: local path inside site`);
    assert.ok((await stat(file)).isFile(), `${name}: missing ${ref}`);
  }
  for (const m of html.matchAll(/<img\b([^>]+)>/g)) assert.match(m[1], /\balt="[^"]*"/);
}
const home = await readFile(path.join(root, 'index.html'), 'utf8');
const schema = JSON.parse(home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
assert.equal(schema['@type'], 'SoftwareApplication');
assert.equal(schema.offers.price, '0');
assert.equal(schema.url, base);
assert.equal(schema.aggregateRating, undefined);
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
assert.deepEqual(locations.sort(), urls.sort());
const policy = await readFile('PRIVACY.md', 'utf8');
const escaped = policy.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
assert.ok((await readFile(path.join(root, 'privacy.html'), 'utf8')).includes(escaped), 'privacy policy remains verbatim');
console.log(`Site checks passed: ${pages.length} pages, local links/assets, metadata, sitemap, schema, privacy copy.`);
