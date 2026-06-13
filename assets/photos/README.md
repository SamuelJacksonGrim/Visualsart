# Local Photo Storage

This is where the studio's **real** photographs live once they're ready.

```
/assets/photos
  /full     ← full-resolution images (shown on the product page & lightbox)
  /thumbs   ← optimized thumbnails (shown in the gallery grid)
```

## How the gallery finds them

The gallery is driven entirely by [`/data/photos.json`](../../data/photos.json).
Each entry has a `src` (full image) and a `thumb` (thumbnail). For the live demo
these point at picsum.photos so the site looks real immediately.

To switch to your own photos:

1. Drop full images into `/assets/photos/full/` and thumbnails into
   `/assets/photos/thumbs/`.
2. In `photos.json`, set each entry's paths, e.g.

   ```json
   {
     "id": "IMG_001",
     "src":   "assets/photos/full/IMG_001.jpg",
     "thumb": "assets/photos/thumbs/IMG_001.jpg"
   }
   ```

That's it — no code changes required.

## Making good thumbnails

Keep thumbnails around 600–800px on the long edge and full images under ~2000px
for fast loading. Any image tool works; a one-liner with ImageMagick:

```bash
# generate a 700px-wide thumbnail
magick full/IMG_001.jpg -resize 700x thumbs/IMG_001.jpg
```
