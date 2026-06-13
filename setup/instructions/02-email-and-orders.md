# 02 · Email & Orders

When a customer finishes the order form, the website **emails the order** to your
fulfillment inbox. This page sets up that email pipeline.

---

## Step 1 — Get a business email address

Don't use a personal Gmail forever — get an address that looks professional and
that the **brother (fulfillment)** can access.

**Easiest (free):** create a dedicated Gmail like `visualart.orders@gmail.com`.

**More professional (optional, ~$6/mo):** Google Workspace gives you
`orders@yourdomain.com`. Or many registrars offer free **email forwarding** so
`orders@yourdomain.com` lands in a normal Gmail inbox.

Whatever you pick, this is your **fulfillment inbox** — write it down, you'll
paste it into the site settings.

---

## Step 2 — Choose how orders are delivered

The site supports two methods. Both are free. You only need **one**.

| Method | Setup effort | Best for |
| --- | --- | --- |
| **FormSubmit** | Almost none | Getting live fast, zero accounts |
| **EmailJS** ⭐ | ~15 min | A polished, reliable long-term setup |

The website is pre-set to **try EmailJS, and automatically fall back to
FormSubmit** if EmailJS isn't configured. So if you do nothing, FormSubmit is
used.

---

## Option A — FormSubmit (zero signup)

1. Open the settings file: `assets/js/config.js`.
2. Find `fulfillmentEmail` and set it to your fulfillment inbox:
   ```js
   order: {
     transport: "formsubmit",
     fulfillmentEmail: "visualart.orders@gmail.com",
   ```
3. **Activate it once:** the very first time a real order is submitted,
   FormSubmit sends a one-time **"activate your form"** email to that inbox.
   Click the button in that email. After that, all orders arrive normally.

> ✅ Tip: do a test order yourself right after launch to trigger and complete
> the activation, so a real customer never hits it.

**Note on screenshots:** FormSubmit *can* receive the payment screenshot as a
file attachment. The website handles this automatically.

---

## Option B — EmailJS ⭐ (recommended)

EmailJS sends order emails instantly with no page reload and a clean template.

### 1. Create the account & connect an inbox
1. Sign up free at [emailjs.com](https://www.emailjs.com).
2. **Email Services → Add New Service** → pick Gmail (or your provider) → connect
   your fulfillment inbox. Note the **Service ID** (looks like `service_ab12cd`).

### 2. Create the email template
1. **Email Templates → Create New Template.**
2. Set the **To Email** to your fulfillment inbox (or use `{{to_email}}`).
3. Set the **Subject** to: `{{_subject}}`
4. Paste this into the content body:
   ```
   NEW VISUALART ORDER

   Photo: {{photo_title}} ({{order_id}})
   Collection: {{collection}}
   Canvas size: {{canvas_size}}
   Unit price: {{unit_price}}
   Quantity: {{qty}}
   TOTAL: {{total}}

   --- Customer ---
   Name: {{name}}
   Email: {{email}}
   Phone: {{phone}}

   --- Ship to ---
   {{address1}} {{address2}}
   {{city}}, {{region}} {{postal}}
   {{country}}

   --- Payment ---
   Method: {{payment_method}}
   Pay to: {{payment_to}}
   Transaction/Proof: {{txid}}

   --- Notes ---
   {{notes}}

   Submitted: {{submitted_at}}
   Photo image: {{photo_url}}
   ```
5. *(Optional, to receive the uploaded screenshot)* In the template's
   **Attachments**, add a **Variable Attachment** with parameter name `proof`.
6. Save. Note the **Template ID** (looks like `template_xy34ef`).

### 3. Get your Public Key
**Account → General → Public Key** (looks like `AbCdEfGhIj123`).

### 4. Put the three values into the site
Open `assets/js/config.js` and fill in:
```js
order: {
  transport: "emailjs",
  fulfillmentEmail: "visualart.orders@gmail.com",
  emailjs: {
    publicKey:  "AbCdEfGhIj123",
    serviceId:  "service_ab12cd",
    templateId: "template_xy34ef",
  },
},
```
Save and re-deploy. Done!

> These keys are **safe to be public** — that's how EmailJS is designed. Anyone
> abusing them can only send to *your* template/inbox, and EmailJS has limits.

---

## What the order email contains

Every order delivers:
- Photo ID & title, collection
- Canvas size, unit price, quantity, **total**
- Customer name, email, phone
- Full shipping address
- Payment method + who it was sent to
- **Transaction ID and/or payment screenshot** (the proof)
- Any customer notes
- A link to the photo image (so the brother knows exactly which one)

This is everything the brother needs to verify payment and place the Pictorem
order.

---

## The contact form

The **Contact page** form works the same way and uses FormSubmit. Set its inbox
in `config.js`:
```js
contact: {
  email: "hello@yourdomain.com",
  formEmail: "hello@yourdomain.com",   // where contact messages go
},
```

➡️ Next: [03 · Payments](03-payments.md)
