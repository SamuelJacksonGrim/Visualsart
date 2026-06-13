# 10 · Maintenance

The site is static (just files), so there's very little to maintain — no servers,
no databases, no security patches. Here's the small amount of ongoing care it
needs.

---

## Routine tasks

| How often | Task |
| --- | --- |
| **Each order** | Run the [fulfillment routine](07-fulfillment-pictorem.md) |
| **When Mom has new photos** | Add them to the catalog → [04](04-photos-and-catalog.md) |
| **Monthly** | Glance at the order inbox & payment accounts; reconcile the log |
| **Yearly** | Confirm the **domain auto-renewed** (don't lose the name!) |
| **As needed** | Tweak pricing/branding in `config.js` |

---

## Updating the website

**If you deploy from GitHub (recommended):**
1. Edit the files (locally or right in GitHub's web editor).
2. Commit/push.
3. The host (Netlify/Vercel/GitHub Pages) rebuilds and publishes automatically in
   a minute or two.

**If you drag-and-drop to Netlify:**
1. Edit the files on your computer.
2. Drag the whole folder onto Netlify again to replace the live version.

> 🔄 After updating, do a **hard refresh** (Ctrl/Cmd + Shift + R) to bypass your
> browser's cache and see changes.

---

## Backups

Everything is just files, so backups are easy:
- **GitHub is your backup.** As long as the project lives in a GitHub repo, your
  whole site and catalog are version-controlled and safe. You can roll back any
  change.
- Keep a **separate folder of the original full-resolution photos** (Google
  Drive/Dropbox). The website only needs web-sized images; the originals are what
  Pictorem prints from — guard them.
- Export your **order log** periodically.

---

## Analytics (know your traffic) — optional

To see how many people visit and what they look at, add a privacy-friendly
analytics tool:

- **Plausible** or **Fathom** — simple, privacy-friendly, paid (~$9/mo).
- **Google Analytics** — free, more complex, requires a cookie/consent notice.
- **Cloudflare Web Analytics** — free and privacy-friendly if you use Cloudflare.

Setup is the same for all: they give you a small `<script>` snippet to paste into
the `<head>` of each `.html` page (or just the ones you care about). Ask your
maintainer to add it once.

---

## Monitoring (optional)

Want to be told if the site ever goes down? Free uptime monitors like
**UptimeRobot** will ping your site every few minutes and email you if it's
unreachable. Nice peace of mind, totally optional.

---

## Keeping costs in check

- Domain renews yearly (~$12). That's the main recurring cost.
- Hosting stays free unless you get **huge** traffic (a good problem).
- EmailJS free tier = 200 order emails/month. If you ever exceed it, their paid
  tier is cheap, or switch to FormSubmit.

➡️ Next: [11 · Growth & Marketing](11-growth-and-marketing.md)
