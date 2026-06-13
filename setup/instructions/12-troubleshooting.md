# 12 · Troubleshooting

Quick fixes for the most common hiccups. Find your symptom in the left column.

---

## Website

| Symptom | Likely cause & fix |
| --- | --- |
| **The gallery is empty / "couldn't load"** | The catalog file didn't load. Make sure `data/photos.json` exists and `npm run validate` passes. If viewing locally by double-clicking the HTML file, use `npm run dev` instead (browsers block file loading otherwise). |
| **Images don't show (broken icons)** | The image paths in `photos.json` don't match the files in `assets/photos/`. Check spelling, capitalization, and the `.jpg`/`.png` extension. |
| **My changes aren't showing up** | Re-deploy (drag-drop again, or push to GitHub), then **hard refresh**: Ctrl/Cmd + Shift + R. |
| **The site looks unstyled / broken layout** | The CSS didn't load. Make sure `assets/css/styles.css` is uploaded alongside the HTML files (deploy the **whole** folder, not single files). |
| **Domain doesn't load but the host URL does** | DNS is still propagating (can take a few hours) or records are wrong. Re-check the steps in [01 · Domain & Hosting](01-domain-and-hosting.md). |
| **No padlock 🔒 / "not secure"** | HTTPS certificate is still being issued (wait) or the domain isn't fully connected. On Netlify/Vercel/GitHub Pages this becomes automatic once the domain verifies. |

---

## Orders & email

| Symptom | Likely cause & fix |
| --- | --- |
| **Order emails aren't arriving** | If using **FormSubmit**, the first submission requires clicking a **one-time activation email** — check the fulfillment inbox (and spam) for it. If using **EmailJS**, double-check the `publicKey`, `serviceId`, and `templateId` in `config.js` match your EmailJS dashboard. |
| **Order email arrives but fields are blank** | (EmailJS) Your template variable names must match (e.g. `{{photo_title}}`, `{{total}}`). Copy the template from [02 · Email & Orders](02-email-and-orders.md) exactly. |
| **The screenshot isn't attached** | (EmailJS) Add a **Variable Attachment** named `proof` in the template. (FormSubmit attaches files automatically.) |
| **Order emails go to spam** | Mark one as "not spam" and add the sender to contacts. Using a real business email and EmailJS reduces this. |
| **Contact form doesn't send** | Check `contact.formEmail` in `config.js` and complete FormSubmit's activation for that address too. |

---

## Payments

| Symptom | Likely cause & fix |
| --- | --- |
| **Pay button goes to the wrong account** | Fix `paypal.handle` / `cashapp.handle` in `config.js`. The PayPal handle is the part after `paypal.me/`; the Cash App handle is your `$Cashtag` **without** the `$`. |
| **PayPal amount isn't pre-filled** | Make sure you claimed a **PayPal.me** link for that handle. Some regions limit PayPal.me amounts — the customer can still enter it manually. |
| **A method shows that shouldn't (or is missing)** | Toggle `enabled: true/false` for that method in `config.js`. |
| **Customer says they paid but I can't find it** | **Don't print.** Ask for the transaction ID, check both PayPal and Cash App, and confirm the exact amount before fulfilling. |

---

## Pricing

| Symptom | Likely cause & fix |
| --- | --- |
| **Prices look too high/low** | Adjust `basePrice` and `pricePerSqInch` in `config.js`. Remember: `price = basePrice + (w × h × pricePerSqInch) + surcharge`. |
| **A specific big size needs to cost more** | Add it to `surcharges` in `config.js`, e.g. `"40x60": 35`. |
| **A size customers want isn't offered** | Add it to that photo's `sizes` list in `photos.json` (make sure Pictorem prints it). |

---

## "I edited a file and now something's broken"

1. The most common cause is a missing **comma** or **quote** in `config.js` or
   `photos.json`. Every setting needs to keep its quotes and commas intact.
2. Run `npm run validate` — it points to catalog problems.
3. If stuck, **undo your change** (or restore the file from GitHub) and try again
   more carefully, changing only the text inside the quotes.

---

## Still stuck?

- Re-read the specific guide for that step in this `setup/` folder.
- Check the project's main [`README.md`](../../README.md) for technical notes.
- The site is designed with **safe fallbacks** — e.g. if EmailJS isn't set up, it
  uses FormSubmit; if a thumbnail is missing, it uses the full image. It keeps
  working while you sort out the fancy parts.

⬅️ Back to the [Setup overview](../README.md)
