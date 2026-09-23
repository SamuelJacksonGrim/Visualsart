## License

This project is dual-licensed under **AGPL-3.0-only** OR a commercial license.

- [LICENSE](LICENSE) — GNU AGPL-3.0-only (the free track)
- [LICENSING.md](LICENSING.md) — how the two tracks work
- [COMMERCIAL-LICENSE.md](COMMERCIAL-LICENSE.md) — the commercial agreement
- [NOTICE](NOTICE) — copyright, SPDX identifier, and provenance

<div align="center">

# Visualart

[![License: AGPL-3.0-only](https://img.shields.io/badge/license-AGPL--3.0--only-blue)](LICENSE)
[![dual-license](https://img.shields.io/badge/dual--license-AGPL--3.0--only%20or%20commercial-blueviolet)](LICENSING.md)
[![CI](https://github.com/SamuelJacksonGrim/Visualsart/actions/workflows/deploy.yml/badge.svg)](https://github.com/SamuelJacksonGrim/Visualsart/actions/workflows/deploy.yml)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)


### Where your photographs become canvas art.

A curated, performant gallery for original photography — browse, choose a
gallery-wrapped canvas size, pay securely, and order. **No backend required.**

[Live Gallery](gallery.html) · [The Studio](about.html) · [Contact](contact.html)

</div>

---

## What this is

Visualart is a **front-end gallery + order-intake pipeline** with **manual
fulfillment**. It's a complete, buildless static site:

- A dynamic, JSON-driven gallery that scales to thousands of photos
- Live search, collection filters, sorting, infinite scroll, and a lightbox
- Product pages with live per-size pricing
- A guided checkout that emails the order (with payment proof) to the studio
- Secure payment via **PayPal** and **Cash App** — no card data ever touches the site
- Deployable to **GitHub Pages, Netlify, or Vercel** with zero configuration

The studio receives each order by email and places the print order through
[Pictorem](https://www.pictorem.com) using the customer's payment.

> 🚀 **Setting up the actual business?** Start with the non-technical, step-by-step
> playbook in **[`setup/README.md`](setup/README.md)** — domain, hosting, email,
> payments, going live, and more.

---

## Quick start

No tooling is required to view the site — but a tiny dev server avoids browser
`file://` restrictions when loading the catalog:

```bash
npm run dev      # → http://localhost:5173
```

Or use anything that serves static files (`python3 -m http.server`, the VS Code
Live Server extension, etc.).

### Useful scripts

| Command                  | What it does                                                       |
| ------------------------ | ----------------------------------------------------------------- |
| `npm run dev`            | Start the zero-dependency static dev server                       |
| `npm run catalog`        | (Re)generate the **demo** catalog (`data/photos.json`)            |
| `npm run catalog:local`  | Build the catalog from **your** photos in `/assets/photos`        |
| `npm run validate`       | Validate `photos.json` (CI runs this before every deploy)         |

---

## Project structure

```
/
├── index.html              Home — hero, featured strip, collections, process
├── gallery.html            The gallery — search / filter / sort / lightbox
├── product.html            A single piece — sizes, live price, related work
├── order.html              Checkout — details, shipping, payment, proof
├── about.html              Studio story + process
├── contact.html            Contact form + FAQ accordion
├── 404.html                Friendly not-found page
│
├── assets/
│   ├── css/styles.css      The full design system (themeable, one file)
│   ├── js/
│   │   ├── config.js       ← THE ONE FILE YOU EDIT (email, payments, pricing)
│   │   ├── app.js          Shared chrome: header/footer, theme, toasts, icons
│   │   ├── home.js         Home-page rendering
│   │   ├── gallery.js      Gallery: filtering, infinite scroll, lightbox
│   │   ├── product.js      Product detail + pricing
│   │   ├── order.js        Order intake + payment + delivery
│   │   └── contact.js      Contact form + FAQ
│   ├── img/favicon.svg
│   └── photos/             Your real photos go here (full/ and thumbs/)
│
├── data/photos.json        The master catalog that drives everything
└── scripts/                Catalog generator, validator, dev server
```

---

## Configuration — one file

Everything site-specific lives in **`assets/js/config.js`**. Nothing in it is
secret (EmailJS public keys and payment handles are safe to ship publicly).

```js
order: {
  transport: "emailjs",                    // or "formsubmit"
  fulfillmentEmail: "orders@visualart.studio",  // ← where orders are sent
  emailjs: { publicKey: "", serviceId: "", templateId: "" },
},
payments: {
  paypal:  { enabled: true, handle: "visualartstudio" },   // paypal.me/<handle>
  cashapp: { enabled: true, handle: "visualartstudio" },   // $<handle>
},
pricing: {
  basePrice: 39,
  pricePerSqInch: 0.22,    // price = basePrice + area × this (+ surcharges)
},
```

### Order delivery

Orders are emailed to `fulfillmentEmail`. Two transports work out of the box:

1. **FormSubmit (default fallback, zero setup).** If EmailJS isn't configured,
   the order form posts to [formsubmit.co](https://formsubmit.co) — including
   the payment screenshot as a real attachment. The first submission triggers a
   one-time confirmation email to activate your address.

2. **EmailJS (recommended).** Create a free [EmailJS](https://www.emailjs.com)
   account, then paste your `publicKey`, `serviceId`, and `templateId` into
   `config.js`. Orders send instantly with no page reload.

Each order email contains: photo ID & title, canvas size, unit price & total,
the customer's contact + shipping details, the chosen payment method, the
transaction ID / screenshot, and any notes.

### Payments

Customers pay **directly through PayPal or Cash App** — the site only generates
a pre-filled payment link and collects proof. No card data is entered here, so
there is no PCI surface and no payment backend to run.

---

## Using your own photos

The demo catalog uses [picsum.photos](https://picsum.photos) so the gallery
looks real immediately. To switch to the studio's real work:

1. Drop full images into `assets/photos/full/` and thumbnails into
   `assets/photos/thumbs/` (see [`assets/photos/README.md`](assets/photos/README.md)).
2. Run `npm run catalog:local` to scan them into `data/photos.json`
   (or hand-edit the JSON — each entry needs `id`, `title`, `collection`,
   `src`, `thumb`, `sizes`).
3. `npm run validate` to confirm it's well-formed.

Optional per-photo metadata can live in a sidecar JSON next to each image
(`IMG_001.json` → `{ "title": "...", "collection": "...", "sizes": [...] }`).

---

## Pricing model

Price is derived from canvas area so re-pricing the whole catalog is a single
number change in `config.js`:

```
price = basePrice + (width × height × pricePerSqInch) + optional surcharge
```

---

## Deployment

The site is plain static files — deploy the repo root anywhere.

<details>
<summary><strong>GitHub Pages</strong></summary>

A workflow is included at `.github/workflows/deploy.yml`. In your repo:
**Settings → Pages → Build and deployment → Source: GitHub Actions.** Every push
to `main` validates the catalog and deploys.
</details>

<details>
<summary><strong>Netlify</strong></summary>

Connect the repo — `netlify.toml` publishes the root with sensible caching and a
404 fallback. No build command needed.
</details>

<details>
<summary><strong>Vercel</strong></summary>

Import the repo — `vercel.json` handles clean URLs and caching. Framework
preset: **Other**. No build step.
</details>

---

## Tech notes

- **No framework, no build step.** Vanilla HTML/CSS/JS — fast, durable, and easy
  for anyone to maintain.
- **Performance:** thumbnails lazy-load via `IntersectionObserver`; full images
  load only on the product page and in the lightbox; the catalog is fetched once
  and cached.
- **Accessibility:** semantic landmarks, keyboard-navigable lightbox and menus,
  visible focus rings, `prefers-reduced-motion` support, and live regions for
  search results and toasts.
- **Theming:** a full dark/light system via CSS custom properties; the choice is
  remembered in `localStorage`.
- **SEO:** per-page titles/descriptions, Open Graph tags, `sitemap.xml`,
  `robots.txt`, and structured data on the home page.

---

## Roadmap ideas

Favorites / wishlist · customer accounts · richer tag search · an artist journal ·
automated Pictorem fulfillment if an API becomes available.

---

<div align="center">
<sub>Built as a scalable, professional gallery system with a clean manual
fulfillment pipeline. Original photographs, made to live on walls.</sub>
</div>
