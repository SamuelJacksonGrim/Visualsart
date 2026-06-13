# 03 · Payments

Customers pay you **directly** through PayPal or Cash App. The website never
touches card numbers — it just shows a payment button pre-filled with the total,
then collects proof of payment. This keeps things simple, safe, and free of any
"payment processor" backend.

---

## How the money flows

1. Customer picks a photo + size → sees the total (e.g. **$87**).
2. On the order page they choose **PayPal** or **Cash App**.
3. The site shows a button like **"Pay $87 with PayPal"** that opens PayPal
   pre-filled with the amount, sent to your account.
4. They pay, copy the **transaction ID** (or screenshot the receipt), and submit
   the order form.
5. The brother **verifies the payment landed**, then orders the print.

> 🔒 No card data is ever entered on the website. There is nothing to secure or
> store. The money is in your PayPal/Cash App account before any print is ordered.

---

## Set up PayPal (primary, recommended)

1. Create or use a **PayPal account**. A **Business account** is best (free) — it
   looks professional and supports higher volumes. Upgrade under PayPal settings.
2. Set up your **PayPal.me** link: go to [paypal.me](https://www.paypal.me) and
   claim your handle, e.g. `paypal.me/vizualstudio`.
3. The part after `paypal.me/` is your **handle**. Put it in `config.js`:
   ```js
   payments: {
     paypal: {
       enabled: true,
       handle: "vizualstudio",        // ← from paypal.me/vizualstudio
       email: "you@yourdomain.com",   // shown as a backup
     },
   ```

The site automatically builds payment links like
`paypal.com/paypalme/vizualstudio/87` so the amount is pre-filled.

---

## Set up Cash App (secondary)

1. In the Cash App, set your **$Cashtag** (e.g. `$VizualStudio`).
2. Put it in `config.js` **without** the `$`:
   ```js
     cashapp: {
       enabled: true,
       handle: "VizualStudio",   // ← your $Cashtag, no dollar sign
     },
   ```

The site builds links like `cash.app/$VizualStudio/87`.

> 💡 Cash App has a **business** account type that's better for receiving money
> from many people. Personal accounts have weekly receiving limits until verified.

---

## Chime (optional fallback only)

Chime isn't built for business payments, so it's **off by default**. Only enable
it if you specifically need it:
```js
  chime: { enabled: false, handle: "" },
```

---

## Turning a method on or off

Set `enabled: true` or `enabled: false` for each. If you only want PayPal, set
Cash App to `false` and it disappears from the order page.

---

## ⚠️ The most important rule: verify before you print

Because payment and order arrive separately, the brother **must confirm the money
actually arrived** before placing the Pictorem order. Quick routine:

1. Order email comes in with a transaction ID / screenshot.
2. Open PayPal / Cash App and **find that exact payment and amount**.
3. Match the customer name and total.
4. Only then place the print order.

This prevents fake "I paid, I promise" orders. See
[07 · Fulfillment](07-fulfillment-pictorem.md) for the full routine.

---

## Fees to expect (so pricing makes sense)

- **PayPal:** roughly **2.9% + $0.30** per payment (US). On an $87 sale that's
  about **$2.82**.
- **Cash App business:** a small percentage per transaction.

Factor this into your pricing if you want to fully cover it — see
[05 · Configuration](05-configuration.md) for how pricing works.

➡️ Next: [04 · Photos & Catalog](04-photos-and-catalog.md)
