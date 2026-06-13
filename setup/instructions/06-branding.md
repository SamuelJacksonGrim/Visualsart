# 06 · Branding

The look and name are what make this feel like *Mom's* studio. Here's how to make
it hers.

---

## Choosing the name

The original plan suggested **VizualStudio**. It's brandable and modern, but note
it's close to "Visual Studio" (a Microsoft product) and leans a little techy. A
few directions to consider with Mom:

| Style | Examples |
| --- | --- |
| Her name | "Jane Doe Photography", "Doe & Light" |
| Evocative | "Field & Frame", "Quiet Light Studio", "North Light" |
| The plan's pick | "Vizual Studio" (pair with a grounding tagline) |

**A tagline grounds any name.** Example:
> *Vizual Studio — Where your photographs become canvas art.*

> 💡 Whatever you choose, check the **`.com` is available** (see
> [01 · Domain & Hosting](01-domain-and-hosting.md)) and the **Instagram handle**
> is free, before committing.

### Where to put the name
In `assets/js/config.js`:
```js
brand: {
  name: "Vizual Studio",
  studio: "Vizual Studio",
  tagline: "Where your photographs become canvas art.",
  ...
}
```
The name appears automatically in the header logo, the footer, and the browser
tab. (The page titles like "Gallery — Visualart" live in each `.html` file's
`<title>` tag if you want to update those too — optional.)

---

## Colors

The whole site is themed from a small set of colors at the top of
`assets/css/styles.css` (the `:root` section). The signature accent is a warm
champagne gold:
```css
--gold: #c8a24a;        /* the accent color (buttons, highlights) */
```
To change the accent, replace that hex value (and `--gold-soft` /`--gold-deep`
for its lighter/darker variants). Some palette ideas:

| Mood | Accent hex |
| --- | --- |
| Champagne gold (default) | `#c8a24a` |
| Terracotta / clay | `#c2683f` |
| Sage green | `#7e9b6e` |
| Dusty rose | `#c08497` |
| Slate blue | `#6c83a8` |

The site has both a **dark** and **light** theme; visitors can toggle between
them, and the choice is remembered. You don't need to design both — they're
already built.

> 🎨 Pick **one** accent color and let it breathe. The neutral ink/ivory base is
> intentionally restrained so the *photographs* are the stars.

---

## The logo

The default logo is a small mountain/triangle mark next to the name. It lives as
inline artwork (so it's crisp at any size) in two places:
- `assets/js/app.js` — search for `logo:` (used in the header & footer)
- `assets/img/favicon.svg` — the little icon in the browser tab

**If Mom has a real logo:**
- Simplest: replace the favicon file `assets/img/favicon.svg` with her icon
  (keep the same filename), and we can swap the header mark too.
- If it's a PNG, that works for the favicon; an SVG stays sharpest.
- Not comfortable editing these? Note it down — it's a quick change for whoever
  maintains the site.

---

## Fonts

The site uses two Google Fonts, loaded automatically:
- **Fraunces** — the elegant serif for headings
- **Inter** — the clean sans-serif for body text

These suit a fine-art gallery well. If you want different fonts, they're set in
`assets/css/styles.css`:
```css
--font-display: "Fraunces", Georgia, serif;   /* headings */
--font-sans: "Inter", system-ui, sans-serif;  /* body */
```
(Changing fonts also means updating the Google Fonts link in each `.html` `<head>`
— note it for the maintainer.)

---

## Photography is the brand

The most powerful branding move costs nothing: **lead with the strongest
images.** Mark the best 6–10 photos as `"featured": true` in the catalog so they
headline the home page and gallery. First impressions sell.

➡️ Next: [07 · Fulfillment (Pictorem)](07-fulfillment-pictorem.md)
