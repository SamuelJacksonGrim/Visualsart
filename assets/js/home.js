/**
 * Visualart — Home page
 * Renders the hero backdrop, featured masonry strip and collection cards
 * from the live catalog.
 */
(function () {
  "use strict";
  const { $, $$, el, loadCatalog, CFG, escapeHtml, hydrateIcons } = window.VA;

  const COLLECTION_ORDER = [
    "Landscape",
    "Seascape",
    "Urban",
    "Architecture",
    "Nature",
    "Abstract",
    "Monochrome",
    "Night",
  ];

  function tileMarkup(photo) {
    const price = CFG.priceRange(photo.sizes);
    const badge = photo.limited
      ? `<span class="tile__badge tile__badge--limited">Limited</span>`
      : photo.featured
      ? `<span class="tile__badge">Featured</span>`
      : "";
    return `
      <a class="tile" href="product.html?id=${encodeURIComponent(photo.id)}" data-id="${photo.id}">
        ${badge}
        <div class="tile__img-wrap">
          <img class="tile__img" data-src="${photo.thumb}" alt="${escapeHtml(photo.title)} — ${escapeHtml(photo.collection)} photography" width="${photo.width}" height="${photo.height}" loading="lazy" />
        </div>
        <div class="tile__overlay">
          <span class="tile__title">${escapeHtml(photo.title)}</span>
          <span class="tile__sub">
            <span>${escapeHtml(photo.collection)}</span>
            <span class="tile__price">${price}</span>
          </span>
        </div>
      </a>`;
  }

  function renderFeatured(photos) {
    const grid = $("#featured-grid");
    if (!grid) return;
    // Prefer flagged featured pieces; pad with a varied selection.
    const featured = photos.filter((p) => p.featured);
    const pool = featured.length >= 8 ? featured : featured.concat(photos.filter((p) => !p.featured));
    const seen = new Set();
    const picks = [];
    for (const p of pool) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      picks.push(p);
      if (picks.length >= 8) break;
    }
    grid.innerHTML = picks.map(tileMarkup).join("");
    // Stagger reveal
    $$(".tile", grid).forEach((t, i) => {
      setTimeout(() => t.classList.add("is-in"), 60 * i);
    });
    window.VA.observeLazy(grid);
  }

  function renderCollections(photos) {
    const grid = $("#collections-grid");
    if (!grid) return;
    const byCollection = {};
    photos.forEach((p) => {
      (byCollection[p.collection] = byCollection[p.collection] || []).push(p);
    });

    const cards = COLLECTION_ORDER.filter((name) => byCollection[name]).map((name) => {
      const items = byCollection[name];
      // Use a landscape-ish cover when possible for nicer cards.
      const cover = items.find((p) => p.orientation !== "portrait") || items[0];
      const slug = encodeURIComponent(name.toLowerCase());
      return `
        <a class="collection-card" href="gallery.html?collection=${slug}" aria-label="${escapeHtml(name)} collection — ${items.length} works">
          <img data-src="${cover.thumb}" alt="" aria-hidden="true" />
          <span class="collection-card__arrow" data-icon="arrowUpRight"></span>
          <div class="collection-card__body">
            <span class="collection-card__title">${escapeHtml(name)}</span>
            <span class="collection-card__meta">
              <span class="collection-card__count">${items.length} works</span>
            </span>
          </div>
        </a>`;
    });

    grid.innerHTML = cards.join("");
    hydrateIcons(grid);
    window.VA.observeLazy(grid);
  }

  function renderHero(photos) {
    const img = $("#hero-img");
    if (!img) return;
    // A wide, atmospheric piece for the backdrop.
    const wide = photos.filter((p) => p.orientation === "landscape");
    const pick = (wide.length ? wide : photos)[Math.floor(Math.random() * (wide.length || photos.length))];
    // Use the full-res source for the hero.
    img.src = pick.src;
    img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
    if (img.complete && img.naturalWidth) img.classList.add("is-loaded");
  }

  function setStats(photos) {
    const pieces = $("#stat-pieces");
    if (pieces) {
      const target = photos.length;
      // Count-up animation
      const dur = 900;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        pieces.textContent = Math.round(eased * target).toLocaleString();
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
    const colls = $("#stat-collections");
    if (colls) {
      const n = new Set(photos.map((p) => p.collection)).size;
      colls.textContent = n;
    }
  }

  loadCatalog()
    .then((photos) => {
      renderHero(photos);
      renderFeatured(photos);
      renderCollections(photos);
      setStats(photos);
    })
    .catch(() => {
      const grid = $("#collections-grid");
      if (grid)
        grid.innerHTML =
          '<p style="color:var(--text-muted)">The gallery is taking a moment to load. Please refresh.</p>';
    });
})();
