/**
 * Visualart — Shared App Layer
 * ============================
 * Renders the site chrome (header/footer), wires global UI (theme, mobile nav,
 * scroll reveal, toasts) and exposes a tiny helper namespace used by every page.
 *
 * Loaded on every page BEFORE the page-specific script.
 */
(function () {
  "use strict";

  const CFG = window.VISUALART;

  /* --------------------------------------------------------------- *
   * Icon set (inline SVG, stroke-based — inherits currentColor).
   * --------------------------------------------------------------- */
  const ICONS = {
    logo: '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M3 26L13 6l6 12 3-5 7 13H3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="22" cy="9" r="2.4" fill="currentColor"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrowUpRight: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevronLeft: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevronRight: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.6"/><path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 13A9 9 0 119 3a7 7 0 1012 10z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    checkCircle: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.4"/><path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.4"/><path d="M12 7v6M12 16.5v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="7" cy="18" r="1.8" stroke="currentColor" stroke-width="1.4"/><circle cx="17.5" cy="18" r="1.8" stroke="currentColor" stroke-width="1.4"/></svg>',
    frame: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="1" stroke="currentColor" stroke-width="1.4"/><rect x="8" y="8" width="8" height="8" rx="0.5" stroke="currentColor" stroke-width="1.2"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 16V5M8 9l4-4 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 16v3h14v-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M4 7l8 6 8-6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s7-5.2 7-11a7 7 0 10-14 0c0 5.8 7 11 7 11z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.4"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.4"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4.5" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3.4" stroke="currentColor" stroke-width="1.5"/><circle cx="17" cy="7" r="1" fill="currentColor"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    image: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><circle cx="8.5" cy="10" r="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M5 17l4.5-4 3 2.5L16 12l3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>',
  };

  function icon(name, cls) {
    const svg = ICONS[name] || "";
    if (!cls) return svg;
    return svg.replace("<svg ", `<svg class="${cls}" `);
  }

  /* --------------------------------------------------------------- *
   * Tiny DOM helpers
   * --------------------------------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const el = (tag, props = {}, html) => {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === "class") node.className = v;
      else if (k === "dataset") Object.assign(node.dataset, v);
      else if (k.startsWith("on") && typeof v === "function")
        node.addEventListener(k.slice(2).toLowerCase(), v);
      else if (v !== null && v !== undefined) node.setAttribute(k, v);
    });
    if (html !== undefined) node.innerHTML = html;
    return node;
  };
  const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  /* --------------------------------------------------------------- *
   * Navigation model
   * --------------------------------------------------------------- */
  const NAV = [
    { href: "gallery.html", label: "Gallery" },
    { href: "index.html#collections", label: "Collections" },
    { href: "about.html", label: "About" },
    { href: "contact.html", label: "Contact" },
  ];

  function currentPage() {
    const path = location.pathname.split("/").pop() || "index.html";
    return path;
  }

  /* --------------------------------------------------------------- *
   * Render header
   * --------------------------------------------------------------- */
  function renderHeader() {
    const mount = $("#site-header") || document.body.insertBefore(el("div", { id: "site-header" }), document.body.firstChild);
    const page = currentPage();

    const links = NAV.map((n) => {
      const isActive = n.href.split("#")[0] === page;
      return `<a class="nav__link" href="${n.href}"${isActive ? ' aria-current="page"' : ""}>${n.label}</a>`;
    }).join("");

    mount.outerHTML = `
      <header class="site-header" id="site-header">
        <div class="wrap">
          <nav class="nav" aria-label="Primary">
            <a class="brand" href="index.html" aria-label="${escapeHtml(CFG.brand.name)} — home">
              <span class="brand__mark">${ICONS.logo}</span>
              <span><strong>${escapeHtml(CFG.brand.name)}</strong><span class="brand__dot">.</span></span>
            </a>
            <div class="nav__links" id="nav-links">${links}</div>
            <div class="nav__actions">
              <button class="icon-btn" id="theme-toggle" aria-label="Toggle light and dark theme" title="Toggle theme">${ICONS.moon}</button>
              <a class="btn btn--primary btn--sm" href="gallery.html">Shop Prints ${icon("arrow", "btn__icon btn__icon--arrow")}</a>
              <button class="icon-btn nav__toggle" id="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav-links">${ICONS.menu}</button>
            </div>
          </nav>
        </div>
      </header>`;

    wireHeader();
  }

  function wireHeader() {
    const header = $(".site-header");
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Mobile menu
    const toggle = $("#nav-toggle");
    const links = $("#nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const open = links.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.innerHTML = open ? ICONS.close : ICONS.menu;
      });
      links.addEventListener("click", (e) => {
        if (e.target.closest("a")) {
          links.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.innerHTML = ICONS.menu;
        }
      });
    }

    // Theme
    const themeBtn = $("#theme-toggle");
    const syncThemeIcon = () => {
      const t = document.documentElement.getAttribute("data-theme") || "dark";
      themeBtn.innerHTML = t === "dark" ? ICONS.moon : ICONS.sun;
    };
    syncThemeIcon();
    themeBtn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") || "dark";
      const next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("va-theme", next);
      } catch (e) {}
      syncThemeIcon();
    });
  }

  /* --------------------------------------------------------------- *
   * Render footer
   * --------------------------------------------------------------- */
  function renderFooter() {
    const mount = $("#site-footer");
    if (!mount) return;
    const year = new Date().getFullYear();
    const ig = CFG.contact.instagram
      ? `<a href="https://instagram.com/${escapeHtml(CFG.contact.instagram)}" target="_blank" rel="noopener" aria-label="Instagram">${ICONS.instagram}</a>`
      : `<a href="contact.html" aria-label="Instagram">${ICONS.instagram}</a>`;

    mount.outerHTML = `
      <footer class="site-footer" id="site-footer">
        <div class="wrap">
          <div class="footer-grid">
            <div class="footer-brand">
              <a class="brand" href="index.html">
                <span class="brand__mark">${ICONS.logo}</span>
                <span><strong>${escapeHtml(CFG.brand.name)}</strong><span class="brand__dot">.</span></span>
              </a>
              <p>${escapeHtml(CFG.brand.tagline)} Gallery-wrapped, made to order, shipped ready to hang.</p>
            </div>
            <div class="footer-col">
              <h4>Explore</h4>
              <ul>
                <li><a href="gallery.html">Full Gallery</a></li>
                <li><a href="index.html#collections">Collections</a></li>
                <li><a href="gallery.html?sort=featured">Featured Work</a></li>
                <li><a href="about.html">The Studio</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>Support</h4>
              <ul>
                <li><a href="contact.html">Contact</a></li>
                <li><a href="contact.html#faq">FAQ</a></li>
                <li><a href="about.html#process">How It Works</a></li>
                <li><a href="contact.html#faq">Shipping &amp; Returns</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>Get In Touch</h4>
              <ul>
                <li><a href="mailto:${escapeHtml(CFG.contact.email)}">${escapeHtml(CFG.contact.email)}</a></li>
                <li><a href="about.html">Our Story</a></li>
              </ul>
              <div class="social" style="margin-top:1.2rem">${ig}<a href="mailto:${escapeHtml(CFG.contact.email)}" aria-label="Email">${ICONS.mail}</a></div>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© ${year} ${escapeHtml(CFG.brand.studio)}. All photographs are original works.</span>
            <span>Secure payment via PayPal &amp; Cash App · Printed by Pictorem</span>
          </div>
        </div>
      </footer>`;
  }

  /* --------------------------------------------------------------- *
   * Scroll reveal
   * --------------------------------------------------------------- */
  function initReveal() {
    const items = $$("[data-reveal]");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach((i) => i.classList.add("is-revealed"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-revealed");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((i) => io.observe(i));
  }

  /* --------------------------------------------------------------- *
   * Lazy image loader (shared) — sets .is-loaded on decode.
   * --------------------------------------------------------------- */
  function lazyImage(img) {
    const src = img.dataset.src;
    if (!src) return;
    img.src = src;
    if (img.complete && img.naturalWidth) {
      img.classList.add("is-loaded");
      return;
    }
    img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
    img.addEventListener(
      "error",
      () => {
        img.classList.add("is-loaded");
        img.style.opacity = "0.4";
      },
      { once: true }
    );
  }

  function observeLazy(root = document) {
    const imgs = $$("img[data-src]:not([data-observed])", root);
    if (!("IntersectionObserver" in window)) {
      imgs.forEach((img) => {
        img.dataset.observed = "1";
        lazyImage(img);
      });
      return;
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            lazyImage(e.target);
            obs.unobserve(e.target);
          }
        });
      },
      { rootMargin: "300px 0px" }
    );
    imgs.forEach((img) => {
      img.dataset.observed = "1";
      io.observe(img);
    });
  }

  /* --------------------------------------------------------------- *
   * Toast
   * --------------------------------------------------------------- */
  let toastTimer;
  function toast(message, type = "success") {
    let t = $(".toast");
    if (!t) {
      t = el("div", { class: "toast", role: "status", "aria-live": "polite" });
      document.body.appendChild(t);
    }
    t.className = `toast toast--${type}`;
    t.innerHTML = `${type === "error" ? ICONS.alert : ICONS.checkCircle}<span>${escapeHtml(message)}</span>`;
    requestAnimationFrame(() => t.classList.add("is-shown"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-shown"), 4200);
  }

  /* --------------------------------------------------------------- *
   * Catalog loader (cached promise)
   * --------------------------------------------------------------- */
  let catalogPromise = null;
  function loadCatalog() {
    if (catalogPromise) return catalogPromise;
    catalogPromise = fetch(CFG.gallery.catalogUrl, { cache: "default" })
      .then((r) => {
        if (!r.ok) throw new Error(`Catalog ${r.status}`);
        return r.json();
      })
      .catch((err) => {
        console.error("Failed to load catalog:", err);
        throw err;
      });
    return catalogPromise;
  }

  /* --------------------------------------------------------------- *
   * Misc helpers
   * --------------------------------------------------------------- */
  function getParam(name) {
    return new URLSearchParams(location.search).get(name);
  }

  function setYearTokens() {
    $$("[data-year]").forEach((n) => (n.textContent = new Date().getFullYear()));
  }

  // Hydrate declarative icons: <span data-icon="arrow"></span> and empty
  // arrow spans inside buttons get the inline SVG filled in.
  function hydrateIcons(root = document) {
    $$("[data-icon]", root).forEach((n) => {
      if (!n.dataset.iconDone) {
        n.innerHTML = ICONS[n.dataset.icon] || "";
        n.dataset.iconDone = "1";
      }
    });
    $$(".btn__icon--arrow:empty", root).forEach((n) => (n.innerHTML = ICONS.arrow));
  }

  /* --------------------------------------------------------------- *
   * Boot
   * --------------------------------------------------------------- */
  function boot() {
    renderHeader();
    renderFooter();
    hydrateIcons();
    initReveal();
    observeLazy();
    setYearTokens();
  }

  // Public API
  window.VA = {
    icon,
    ICONS,
    $,
    $$,
    el,
    escapeHtml,
    toast,
    loadCatalog,
    observeLazy,
    lazyImage,
    initReveal,
    hydrateIcons,
    getParam,
    CFG,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
