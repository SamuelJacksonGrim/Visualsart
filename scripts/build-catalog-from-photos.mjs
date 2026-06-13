/**
 * Visualart — Build catalog from real local photos
 * =================================================
 * When the studio's actual photographs are dropped into
 * /assets/photos/full and /assets/photos/thumbs, this script scans them and
 * (re)generates data/photos.json so the gallery shows the real work.
 *
 * Filenames become IDs. A matching thumbnail in /thumbs is used if present,
 * otherwise the full image is reused as its own thumbnail.
 *
 * Optionally, a sidecar JSON (same name as the image, e.g. IMG_001.json) can
 * provide { title, collection, tags, sizes } to override the defaults.
 *
 * Run: npm run catalog:local
 */
import { readdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, extname, basename } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const fullDir = join(root, "assets/photos/full");
const thumbDir = join(root, "assets/photos/thumbs");
const out = join(root, "data/photos.json");

const IMG_RE = /\.(jpe?g|png|webp)$/i;
const DEFAULT_SIZES = ["12x18", "16x24", "24x36"];

const titleCase = (s) =>
  s
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

if (!existsSync(fullDir)) {
  console.error(`✗ No folder at ${fullDir}. Create it and add your photos.`);
  process.exit(1);
}

const files = readdirSync(fullDir).filter((f) => IMG_RE.test(f));
if (!files.length) {
  console.error(`✗ No images found in ${fullDir}.`);
  console.error("  Add .jpg/.png/.webp files (or keep using the demo catalog: npm run catalog).");
  process.exit(1);
}

const photos = files.sort().map((file, i) => {
  const id = basename(file, extname(file));
  const thumbPath = existsSync(join(thumbDir, file))
    ? `assets/photos/thumbs/${file}`
    : `assets/photos/full/${file}`;

  // Optional sidecar metadata
  const sidecar = join(fullDir, `${id}.json`);
  const meta = existsSync(sidecar) ? JSON.parse(readFileSync(sidecar, "utf8")) : {};

  return {
    id,
    title: meta.title || titleCase(id),
    collection: meta.collection || "Gallery",
    orientation: meta.orientation || "landscape",
    blurb: meta.blurb || "An original photograph from the Visualart collection.",
    src: `assets/photos/full/${file}`,
    thumb: thumbPath,
    width: meta.width || 1600,
    height: meta.height || 1100,
    tags: meta.tags || ["original"],
    sizes: meta.sizes || DEFAULT_SIZES,
    featured: meta.featured ?? i < 6,
    limited: meta.limited ?? false,
    year: meta.year || new Date().getFullYear(),
  };
});

writeFileSync(out, JSON.stringify(photos, null, 2) + "\n", "utf8");
console.log(`✓ Built catalog from ${photos.length} local photo(s) → ${out}`);
