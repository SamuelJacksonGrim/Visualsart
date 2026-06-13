# 01 · Domain & Hosting

This is how your website gets a real web address (like `vizualstudio.com`) and
gets put online. Two separate things:

- **Domain** = the address people type. You *rent* it (yearly).
- **Hosting** = the computer that serves your website files. We'll use a **free** one.

---

## Part A — Buy a domain name

### Step 1: Pick the name
Decide this first (see [Branding](06-branding.md)). Have 2–3 backups ready in case
your first choice is taken.

Example ideas from the original plan:
- `vizualstudio.com`
- `vizualstudioart.com`
- `vizualstudiogallery.com`

> 💡 **Tip:** `.com` is the most trusted and memorable. Get it if you can.
> `.art`, `.studio`, and `.gallery` are nice fits too and are fine alternatives.

### Step 2: Choose a registrar (where you buy it)

| Registrar | Why | Price/yr |
| --- | --- | --- |
| **Cloudflare** (recommended) | Sells domains at cost, no markup, great security | ~$10 |
| **Namecheap** | Beginner-friendly, good support | ~$10–13 |
| **Porkbun** | Cheap, friendly, free privacy | ~$10 |

Avoid GoDaddy if you can — lots of upsells and higher renewal prices.

### Step 3: Buy it
1. Go to the registrar's site and search your name.
2. Add the `.com` to cart (skip the extra add-ons they push — you don't need
   "premium DNS," "email hosting," etc. yet).
3. **Turn ON "WHOIS privacy" / "domain privacy"** (usually free) so your home
   address isn't public.
4. Pay. Consider **auto-renew ON** so you never accidentally lose the name.

✅ **You now own the address.** Hosting comes next; you connect them at the end.

---

## Part B — Host the website (free)

You have three good free options. **We recommend Netlify** — it's the easiest for
non-technical owners and connects a domain in a few clicks.

### Option 1 — Netlify ⭐ (recommended)

**Easiest path (drag-and-drop):**
1. Create a free account at [netlify.com](https://www.netlify.com).
2. Download the website files (the whole project folder) to your computer.
3. In Netlify, go to **Sites → Add new site → Deploy manually**.
4. **Drag the project folder** onto the upload box. Done — it's live at a
   temporary address like `random-name-123.netlify.app`.

**Better path (auto-updates from GitHub):**
1. Push this project to a GitHub repository (it already lives in one).
2. In Netlify: **Add new site → Import an existing project → GitHub**.
3. Pick the repository. **Build command:** leave blank. **Publish directory:** `.`
   (a single dot). Click **Deploy**.
4. Now every time the files change on GitHub, Netlify updates the site
   automatically.

### Option 2 — GitHub Pages (free, already wired up)
This project includes an automatic deploy file (`.github/workflows/deploy.yml`).
1. Push the project to GitHub.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to the `main` branch publishes the site to
   `yourusername.github.io/reponame`.

### Option 3 — Vercel (free, fastest)
1. Create an account at [vercel.com](https://vercel.com).
2. **Add New → Project → Import** the GitHub repo.
3. Framework preset: **Other**. No build command. Deploy.
The included `vercel.json` handles the rest.

> All three give you **free automatic HTTPS** (the padlock 🔒 in the browser).
> You don't have to configure anything for security.

---

## Part C — Connect your domain to the host

After the site is live on a temporary address, point your real domain at it.

### On Netlify
1. In your site: **Domain management → Add a domain** → type your domain.
2. Netlify shows you either **nameservers** or **DNS records** to add.
3. **Easiest method:** in your domain registrar, set the **nameservers** to the
   ones Netlify gives you. (Registrar → your domain → "Nameservers" → Custom →
   paste Netlify's values → save.)
4. Wait 5 minutes to a few hours. Netlify auto-issues the HTTPS certificate.

### On GitHub Pages
1. Repo **Settings → Pages → Custom domain** → type your domain → Save.
2. In your registrar's DNS settings, add these records:
   - Four `A` records pointing to: `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
   - One `CNAME` record for `www` pointing to `yourusername.github.io`
3. Back in GitHub Pages, tick **Enforce HTTPS** once it becomes available.

### On Vercel
1. Project **Settings → Domains → Add** → type your domain.
2. Follow the on-screen DNS instructions (Vercel walks you through it).

> 🌐 **DNS changes can take a few hours to spread worldwide.** This is normal.
> If the site doesn't load on your domain immediately, wait and try again later.

---

## Quick reference

| You want to… | Where to go |
| --- | --- |
| Change the web address shown to customers | Your registrar + host domain settings |
| See if the site is live | Visit your `.netlify.app` / `.vercel.app` / `github.io` URL |
| Update the website content | Edit the files → re-deploy (drag-drop) or push to GitHub (auto) |
| Renew the domain | Your registrar account (turn on auto-renew!) |

➡️ Next: [02 · Email & Orders](02-email-and-orders.md)
