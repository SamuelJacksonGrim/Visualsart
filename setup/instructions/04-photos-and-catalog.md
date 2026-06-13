# 04 · Photos & Catalog

Right now the gallery shows **demo photos** (placeholder images) so you can see
how everything looks. This page shows how to swap in Mom's **real photographs**.

---

## How the gallery works (in one breath)

There's a single file — **`data/photos.json`** — that lists every photo: its
title, which collection it's in, the image files, and the canvas sizes offered.
The gallery, product pages, and order form all read from this one list. Change
the list → the whole site updates.

Each photo also needs two image files:
- a **full** image (shown big on the product page and in the lightbox)
- a **thumbnail** (a smaller version shown in the gallery grid — keeps it fast)

They live in:
```
assets/photos/full/      ← full images
assets/photos/thumbs/    ← thumbnails
```

---

## The easy way (recommended): let the computer build the list

There's a helper that scans your photo folders and writes `photos.json` for you.

### Step 1 — Prepare the images
- Put full-size images in `assets/photos/full/`
- Put matching thumbnails (same filename) in `assets/photos/thumbs/`
- Keep filenames simple and consistent, e.g. `sunset-over-ridge.jpg`,
  `IMG_001.jpg`. **The filename becomes the photo's ID and title** (you can refine
  titles later).

> **Making thumbnails:** thumbnails should be ~600–800 pixels on the long side so
> the gallery loads fast. Any photo editor (even Preview on Mac or Photos on
> Windows) can resize and "export." If you skip thumbnails, the site will reuse
> the full image — it just loads a bit slower.

### Step 2 — Run the builder
On a computer with [Node.js](https://nodejs.org) installed, open a terminal in
the project folder and run:
```bash
npm run catalog:local
```
This creates/updates `data/photos.json` from your photos. Then:
```bash
npm run validate     # checks the file is correct
npm run dev          # preview at http://localhost:5173
```

### Step 3 — Add nicer titles, collections, sizes (optional)
You can give any photo proper details with a small "sidecar" file next to the
image. For `assets/photos/full/sunset-over-ridge.jpg`, create
`assets/photos/full/sunset-over-ridge.json`:
```json
{
  "title": "Sunset Over the Ridge",
  "collection": "Landscape",
  "tags": ["mountains", "sunset", "golden hour"],
  "sizes": ["12x18", "16x24", "24x36"],
  "orientation": "landscape",
  "featured": true,
  "limited": false,
  "year": 2024
}
```
Re-run `npm run catalog:local` and those details are used.

---

## The manual way: edit the list by hand

If you're comfortable, you can edit `data/photos.json` directly. Each photo looks
like this:
```json
{
  "id": "IMG_001",
  "title": "Sunset Over the Ridge",
  "collection": "Landscape",
  "orientation": "landscape",
  "blurb": "Golden light spilling over the far ridgeline.",
  "src":   "assets/photos/full/IMG_001.jpg",
  "thumb": "assets/photos/thumbs/IMG_001.jpg",
  "width": 1600,
  "height": 1100,
  "tags": ["mountains", "sunset"],
  "sizes": ["12x18", "16x24", "24x36"],
  "featured": false,
  "limited": false,
  "year": 2024
}
```

**Field guide:**
| Field | What it is | Required? |
| --- | --- | --- |
| `id` | A unique code for the photo (no spaces) | ✅ |
| `title` | The display name | ✅ |
| `collection` | Group name (Landscape, Urban, etc.) | ✅ |
| `src` / `thumb` | Paths to the images | ✅ |
| `sizes` | Canvas sizes offered, as `WidthxHeight` in inches | ✅ |
| `orientation` | `landscape`, `portrait`, or `square` | optional |
| `blurb` | One-line description on the product page | optional |
| `tags` | Words people can search/filter by | optional |
| `featured` | `true` puts it in the featured strip | optional |
| `limited` | `true` shows a "Limited" badge | optional |
| `year` | Year taken (for sorting/labels) | optional |

After editing, **always run** `npm run validate` to catch typos.

---

## Collections

The collection names you use become the **filter chips** and the **home page
collection cards** automatically. Use consistent spelling (e.g. always
"Landscape", not sometimes "landscapes"). The demo uses: Landscape, Seascape,
Urban, Architecture, Nature, Abstract, Monochrome, Night — keep, rename, or
replace these freely.

---

## Sizes & pricing

You list which **sizes** each photo can be printed at. The **price** for each
size is calculated automatically from its dimensions (see
[05 · Configuration](05-configuration.md)) — you don't write prices in the photo
list. Just make sure the sizes you offer are ones **Pictorem actually prints**
(check Pictorem's canvas size options).

---

## How many photos can it handle?

Thousands. Thumbnails load lazily (only as you scroll) and the gallery loads in
batches, so a big catalog stays fast. Just keep image files reasonably sized
(full images under ~2000px wide, thumbnails ~700px).

➡️ Next: [05 · Configuration](05-configuration.md)
