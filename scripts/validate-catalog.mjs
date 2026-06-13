/**
 * Visualart — Catalog validator
 * Fails loudly if data/photos.json is malformed, so a bad edit never ships.
 * Run: npm run validate
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const path = fileURLToPath(new URL("../data/photos.json", import.meta.url));
const REQUIRED = ["id", "title", "collection", "src", "thumb", "sizes"];
const SIZE_RE = /^\d{1,3}x\d{1,3}$/;

let photos;
try {
  photos = JSON.parse(readFileSync(path, "utf8"));
} catch (e) {
  console.error("✗ photos.json is not valid JSON:", e.message);
  process.exit(1);
}

if (!Array.isArray(photos) || photos.length === 0) {
  console.error("✗ photos.json must be a non-empty array.");
  process.exit(1);
}

const ids = new Set();
const errors = [];

photos.forEach((p, i) => {
  const where = `entry #${i} (${p && p.id ? p.id : "no id"})`;
  REQUIRED.forEach((key) => {
    if (p[key] === undefined || p[key] === null || p[key] === "")
      errors.push(`${where}: missing "${key}"`);
  });
  if (p.id) {
    if (ids.has(p.id)) errors.push(`${where}: duplicate id "${p.id}"`);
    ids.add(p.id);
  }
  if (Array.isArray(p.sizes)) {
    if (!p.sizes.length) errors.push(`${where}: "sizes" is empty`);
    p.sizes.forEach((s) => {
      if (!SIZE_RE.test(s)) errors.push(`${where}: bad size "${s}" (expected WxH like 16x24)`);
    });
  } else {
    errors.push(`${where}: "sizes" must be an array`);
  }
});

if (errors.length) {
  console.error(`✗ Catalog has ${errors.length} problem(s):`);
  errors.slice(0, 50).forEach((e) => console.error("  - " + e));
  process.exit(1);
}

const collections = new Set(photos.map((p) => p.collection));
console.log(`✓ Catalog OK — ${photos.length} works across ${collections.size} collections.`);
