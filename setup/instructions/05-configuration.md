# 05 · Configuration — `config.js` explained

**One file controls all your business details:** `assets/js/config.js`. This is
the file you'll edit most. Nothing in it is secret, so it's safe to keep in your
code and publish.

Open it in any text editor (Notepad, TextEdit, VS Code). Below is every setting,
what it does, and what to change.

> 🛟 **Golden rule:** only change the text **inside the quotes** `"like this"`.
> Keep the commas and curly braces where they are. If something breaks, you can
> always copy the original back.

---

## Brand
```js
brand: {
  name: "Visualart",                                   // shown in the logo & footer
  studio: "Visualart Studio",                          // full studio name
  tagline: "Where your photographs become canvas art.",// shown in the footer
  artist: "the artist",                                // used on the About page
  established: 2021,
  location: "United States",
},
```
👉 Change `name`, `studio`, and `tagline` to your real brand. See
[06 · Branding](06-branding.md).

---

## Order delivery
```js
order: {
  transport: "emailjs",                       // "emailjs" or "formsubmit"
  fulfillmentEmail: "orders@visualart.studio",// ← where orders are emailed
  emailjs: {
    publicKey:  "",
    serviceId:  "",
    templateId: "",
  },
},
```
👉 Set `fulfillmentEmail` to the brother's inbox. To use EmailJS, fill in the
three keys (full walkthrough in [02 · Email & Orders](02-email-and-orders.md)).
Leave the keys blank to use the no-setup FormSubmit fallback.

---

## Payments
```js
payments: {
  paypal:  { enabled: true,  handle: "visualartstudio", email: "pay@visualart.studio" },
  cashapp: { enabled: true,  handle: "visualartstudio" },
  chime:   { enabled: false, handle: "" },
},
```
👉 Put your real **PayPal.me handle** and **Cash App $Cashtag** (without the `$`).
Turn methods on/off with `enabled`. Details in [03 · Payments](03-payments.md).

---

## Pricing 💰
```js
pricing: {
  currency: "USD",
  currencySymbol: "$",
  basePrice: 39,
  pricePerSqInch: 0.22,
  surcharges: {
    "40x60": 35,
    "36x36": 18,
    "45x30": 20,
  },
  finishes: ["Gallery-Wrapped Canvas", "1.5\" Solid Wood Frame", "Ready to Hang"],
},
```

**How the price is calculated for each size:**
```
price = basePrice + (width × height × pricePerSqInch) + optional surcharge
```

Example for a 16×24 canvas:
```
39 + (16 × 24 × 0.22) + 0   =  39 + 84.48  =  $123  (rounded)
```

**How to price your work:**
1. Find out what **Pictorem charges you** to print each size (your cost).
2. Decide your **markup** (your profit per piece).
3. Adjust `basePrice` and `pricePerSqInch` until the calculated prices comfortably
   cover *Pictorem cost + PayPal fees + your profit*.
4. Use `surcharges` to add extra to specific big/expensive sizes.

> ✅ **Tip:** raise `basePrice` to lift the floor on small pieces; raise
> `pricePerSqInch` to make large pieces cost more. Test by opening a product page
> and checking the numbers look right.

`finishes` are just the bullet points shown on the product page — edit the
wording to match what Pictorem actually delivers.

---

## Contact
```js
contact: {
  email: "hello@visualart.studio",     // shown on Contact page & footer
  instagram: "",                       // your IG handle, e.g. "visualart.studio"
  formEmail: "hello@visualart.studio", // where contact-form messages go
},
```
👉 Add your real contact email and Instagram handle (leave IG blank to hide it).

---

## Gallery behavior
```js
gallery: {
  catalogUrl: "data/photos.json",  // don't change unless you move the file
  pageSize: 18,                    // how many photos load per scroll batch
},
```
👉 You can usually leave these alone. Increase `pageSize` to load more at once.

---

## After any change

1. **Save** the file.
2. **Re-deploy:** if you drag-and-drop to Netlify, drop the updated folder again.
   If you use GitHub, commit/push and it updates automatically.
3. **Refresh** the site (you may need a hard refresh: Ctrl/Cmd + Shift + R).

➡️ Next: [06 · Branding](06-branding.md)
