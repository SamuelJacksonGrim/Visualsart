/**
 * Visualart — Photo Catalog Generator
 * -----------------------------------
 * Produces data/photos.json, the master catalog that drives the gallery.
 *
 * For this build the imagery is sourced from picsum.photos via stable seeds so
 * the gallery looks real out of the box. When the artist's true photographs are
 * ready, drop them into /assets/photos/{full,thumbs} and point each entry's
 * `src` / `thumb` at the local files — the rest of the site needs no changes.
 *
 * Run:  node scripts/generate-catalog.mjs
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

/* ----------------------------------------------------------------------- *
 * Vocabulary used to compose plausible, varied catalog entries.
 * ----------------------------------------------------------------------- */

const collections = {
  Landscape: {
    blurb: "Wide, quiet country — ridgelines, valleys and the long light.",
    adjectives: ["Golden", "Silent", "Distant", "Endless", "Windswept", "Amber", "Frozen", "Hidden"],
    nouns: ["Ridge", "Valley", "Meadow", "Highlands", "Plateau", "Pass", "Basin", "Range"],
    tags: ["mountains", "fields", "sunset", "wilderness"],
  },
  Seascape: {
    blurb: "Where water meets sky — tides, coastlines and open horizons.",
    adjectives: ["Restless", "Pale", "Breaking", "Glassy", "Stormbound", "Quiet", "Cobalt", "Drifting"],
    nouns: ["Tide", "Shoreline", "Cove", "Breakwater", "Horizon", "Surf", "Harbor", "Cape"],
    tags: ["ocean", "coast", "water", "horizon"],
  },
  Urban: {
    blurb: "The geometry of the city — streets, signals and quiet corners.",
    adjectives: ["Neon", "Rainslick", "Crowded", "Vacant", "Electric", "Hushed", "Midnight", "Chrome"],
    nouns: ["Avenue", "Crossing", "Rooftop", "Alley", "Platform", "Boulevard", "District", "Underpass"],
    tags: ["city", "street", "architecture", "night"],
  },
  Architecture: {
    blurb: "Built form and shadow — line, repetition and structure.",
    adjectives: ["Brutal", "Soaring", "Symmetric", "Weathered", "Modern", "Ancient", "Stark", "Carved"],
    nouns: ["Atrium", "Colonnade", "Facade", "Stairwell", "Span", "Vault", "Terrace", "Spire"],
    tags: ["architecture", "geometry", "structure", "lines"],
  },
  Nature: {
    blurb: "Close and living — forests, blooms and the small wild things.",
    adjectives: ["Verdant", "Dewlit", "Tangled", "Blooming", "Ancient", "Misted", "Wild", "Still"],
    nouns: ["Canopy", "Fern", "Grove", "Bloom", "Thicket", "Riverbed", "Wetland", "Trail"],
    tags: ["forest", "flora", "green", "wilderness"],
  },
  Abstract: {
    blurb: "Color and form set loose — texture, gradient and pure tone.",
    adjectives: ["Folded", "Liquid", "Fractured", "Saturated", "Soft", "Bold", "Layered", "Woven"],
    nouns: ["Field", "Gradient", "Study", "Form", "Motion", "Texture", "Composition", "Spectrum"],
    tags: ["abstract", "color", "texture", "minimal"],
  },
  Monochrome: {
    blurb: "Black, white and every gray between — light reduced to essentials.",
    adjectives: ["Silver", "Charcoal", "Stark", "Soft", "High-Contrast", "Faded", "Velvet", "Ashen"],
    nouns: ["Study", "Portrait", "Light", "Shadow", "Contour", "Silhouette", "Grain", "Frame"],
    tags: ["monochrome", "black-and-white", "contrast", "minimal"],
  },
  Night: {
    blurb: "After dark — stars, long exposures and the glow of distant light.",
    adjectives: ["Starlit", "Glowing", "Aurora", "Distant", "Deep", "Lunar", "Cobalt", "Burning"],
    nouns: ["Sky", "Trail", "Galaxy", "Horizon", "Reflection", "Exposure", "Field", "Watch"],
    tags: ["night", "stars", "astro", "long-exposure"],
  },
};

/* Canvas sizes shared across the catalog. Prices live in assets/js/config.js
 * so the artist can re-price everything in one place; here we only declare
 * which sizes a given piece can be printed at. */
const sizePools = [
  ["12x18", "16x24", "24x36"],
  ["12x18", "16x24", "24x36", "30x45"],
  ["16x16", "24x24", "36x36"],
  ["18x12", "24x16", "36x24", "45x30"],
  ["12x18", "20x30", "24x36", "40x60"],
];

const orientationForSizes = (sizes) => {
  const [w, h] = sizes[0].split("x").map(Number);
  if (w === h) return "square";
  return w > h ? "landscape" : "portrait";
};

/* Deterministic shuffle so re-runs are stable. */
let seed = 1337;
const rand = () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
};
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

const pad = (n) => String(n).padStart(3, "0");

const photos = [];
let counter = 0;

const collectionNames = Object.keys(collections);
const PER_COLLECTION = 11; // 8 collections * 11 ≈ 88 curated pieces

for (const name of collectionNames) {
  const c = collections[name];
  for (let i = 0; i < PER_COLLECTION; i++) {
    counter++;
    const id = `VA_${pad(counter)}`;
    const title = `${pick(c.adjectives)} ${pick(c.nouns)}`;
    const sizes = pick(sizePools);
    const orientation = orientationForSizes(sizes);

    // Dimensions tuned to orientation so picsum returns nicely-proportioned art.
    const dim =
      orientation === "square"
        ? { w: 1200, h: 1200, tw: 600, th: 600 }
        : orientation === "portrait"
        ? { w: 1200, h: 1600, tw: 600, th: 800 }
        : { w: 1600, h: 1100, tw: 800, th: 550 };

    const picsumSeed = id.toLowerCase();
    const grayscale = name === "Monochrome" ? "&grayscale" : "";

    // A spread of extra tags drawn from the collection vocabulary.
    const extraTags = [...c.tags].sort(() => rand() - 0.5).slice(0, 2 + Math.floor(rand() * 2));
    const tags = Array.from(new Set([name.toLowerCase(), ...extraTags]));

    // A few pieces are flagged as featured / limited for visual variety.
    const featured = rand() > 0.82;
    const limited = rand() > 0.88;

    photos.push({
      id,
      title,
      collection: name,
      orientation,
      blurb: c.blurb,
      src: `https://picsum.photos/seed/${picsumSeed}/${dim.w}/${dim.h}${grayscale ? "?grayscale" : ""}`,
      thumb: `https://picsum.photos/seed/${picsumSeed}/${dim.tw}/${dim.th}${grayscale ? "?grayscale" : ""}`,
      width: dim.w,
      height: dim.h,
      tags,
      sizes,
      featured,
      limited,
      year: 2021 + Math.floor(rand() * 5),
    });
  }
}

mkdirSync(join(root, "data"), { recursive: true });
const out = join(root, "data", "photos.json");
writeFileSync(out, JSON.stringify(photos, null, 2) + "\n", "utf8");

console.log(`Wrote ${photos.length} catalog entries → ${out}`);
console.log(`Collections: ${collectionNames.join(", ")}`);
