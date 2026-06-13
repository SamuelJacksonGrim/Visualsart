# Visualart — Setup Guide

Welcome! This folder is your complete, plain-English playbook for turning the
Visualart website into a real, live online business. No prior tech experience
needed — every step is written to be followed click-by-click.

There are three people in this business:

| Role | Who | What they do |
| --- | --- | --- |
| **The Artist** | Mom | Takes the photographs, picks which ones to sell, sets the vibe. |
| **The Builder** | You (Samuel) | Sets up the website, domain, accounts, and keeps it running. |
| **Fulfillment** | Brother | Receives each order by email and places the print order on Pictorem. |

---

## The big picture (how the business actually works)

```
 Customer browses the gallery  →  picks a photo + canvas size
                                        │
                                        ▼
        Pays with PayPal or Cash App (directly, securely)
                                        │
                                        ▼
   Fills out the order form (address + payment proof)  →  EMAIL
                                        │
                                        ▼
     Brother gets the email  →  logs into Pictorem  →  places the print
                                        │
                                        ▼
            Pictorem prints & ships the canvas to the customer
```

**There is no server to run and no code to write.** The website is just files.
Money goes straight to your payment accounts. Orders arrive as emails.

---

## 📋 The master checklist

Work top to bottom. Each item links to detailed instructions. Print
[`checklist.md`](checklist.md) if you'd like a paper copy with checkboxes.

### Phase 1 — Gather information *(do this with Mom & Brother)*
- [ ] Decide the **business name** and tagline → [Branding](instructions/06-branding.md)
- [ ] Collect Mom's **photographs** (the ones she wants to sell)
- [ ] Get a **business email address** → [Email & Orders](instructions/02-email-and-orders.md)
- [ ] Confirm **payment handles** (PayPal.me + Cash App $Cashtag) → [Payments](instructions/03-payments.md)
- [ ] Brother creates a **Pictorem account** → [Fulfillment](instructions/07-fulfillment-pictorem.md)
- [ ] Decide **pricing** (or use the built-in formula) → [Configuration](instructions/05-configuration.md)

### Phase 2 — Set up the accounts
- [ ] Buy a **domain name** → [Domain & Hosting](instructions/01-domain-and-hosting.md)
- [ ] Create a **hosting account** (Netlify recommended) → [Domain & Hosting](instructions/01-domain-and-hosting.md)
- [ ] Set up **order delivery** (EmailJS or FormSubmit) → [Email & Orders](instructions/02-email-and-orders.md)
- [ ] Set up **PayPal.me** and **Cash App** for business → [Payments](instructions/03-payments.md)

### Phase 3 — Make it yours
- [ ] Add Mom's real **photos** → [Photos & Catalog](instructions/04-photos-and-catalog.md)
- [ ] Edit **`config.js`** with all your real details → [Configuration](instructions/05-configuration.md)
- [ ] Apply **branding** (name, colors, logo) → [Branding](instructions/06-branding.md)
- [ ] Add **legal pages** (privacy & refund policy) → [Legal & Business](instructions/08-legal-and-business.md)

### Phase 4 — Launch
- [ ] Run the **pre-launch checklist** → [Going Live](instructions/09-going-live.md)
- [ ] Connect the **domain** to hosting → [Domain & Hosting](instructions/01-domain-and-hosting.md)
- [ ] **Place a test order** end-to-end → [Going Live](instructions/09-going-live.md)
- [ ] Announce it! → [Growth & Marketing](instructions/11-growth-and-marketing.md)

### Phase 5 — Keep it running
- [ ] Learn the **fulfillment routine** → [Fulfillment](instructions/07-fulfillment-pictorem.md)
- [ ] Set up **backups & analytics** → [Maintenance](instructions/10-maintenance.md)
- [ ] Bookmark **troubleshooting** → [Troubleshooting](instructions/12-troubleshooting.md)

---

## 📚 All the instruction files

| # | Guide | What it covers |
| --- | --- | --- |
| 01 | [Domain & Hosting](instructions/01-domain-and-hosting.md) | Buying a domain, choosing a host, deploying, HTTPS |
| 02 | [Email & Orders](instructions/02-email-and-orders.md) | Where orders go, EmailJS vs FormSubmit, business email |
| 03 | [Payments](instructions/03-payments.md) | PayPal.me, Cash App, verifying payments safely |
| 04 | [Photos & Catalog](instructions/04-photos-and-catalog.md) | Adding real photos, thumbnails, the catalog file |
| 05 | [Configuration](instructions/05-configuration.md) | Every setting in `config.js`, explained line by line |
| 06 | [Branding](instructions/06-branding.md) | Name, tagline, logo, colors, fonts |
| 07 | [Fulfillment (Pictorem)](instructions/07-fulfillment-pictorem.md) | The brother's step-by-step order routine |
| 08 | [Legal & Business](instructions/08-legal-and-business.md) | Privacy policy, refunds, taxes, business basics |
| 09 | [Going Live](instructions/09-going-live.md) | Pre-launch QA + launch day |
| 10 | [Maintenance](instructions/10-maintenance.md) | Backups, updates, analytics, monitoring |
| 11 | [Growth & Marketing](instructions/11-growth-and-marketing.md) | Instagram, SEO, getting first customers |
| 12 | [Troubleshooting](instructions/12-troubleshooting.md) | Fixes for the most common problems |

---

## 💵 What this costs (roughly)

| Thing | Typical cost | Notes |
| --- | --- | --- |
| Domain name | **$10–15 / year** | The only required cost. |
| Website hosting | **$0** | Netlify / GitHub Pages / Vercel free tiers are plenty. |
| Order email (EmailJS) | **$0** | Free tier = 200 emails/month. |
| PayPal | **$0 to start** | Small % fee per sale (~2.9% + 30¢). |
| Cash App | **$0** | Business accounts may have a small fee. |
| Business email | **$0–6 / month** | Free with forwarding, or Google Workspace. |
| Pictorem prints | **Pay per order** | Paid from the customer's payment; your margin is the difference. |

**Bottom line: you can launch for about the price of a domain (~$12/year).**

---

## ⏱️ How long will this take?

- **Gathering info from Mom & Brother:** an afternoon.
- **Setting up accounts (domain, host, email, payments):** 2–3 hours.
- **Adding photos & config:** depends on how many photos — an hour for the setup,
  plus time to upload images.
- **Launch:** 30 minutes once everything above is done.

You do **not** have to do it all in one sitting. Follow the phases in order.

---

## 🆘 If you get stuck

1. Check [Troubleshooting](instructions/12-troubleshooting.md).
2. Re-read the specific guide for that step — they're written to be followed exactly.
3. The website keeps working even if one piece (like a fancy email service) isn't
   set up yet — it has safe fallbacks built in.

You've got this. 🖼️
