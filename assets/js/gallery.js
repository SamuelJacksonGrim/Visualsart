/**
 * Visualart — Gallery
 * ===================
 * Masonry gallery with live search, collection filtering, sorting,
 * infinite scroll, and a keyboard-navigable lightbox. Reads ?collection,
 * ?tag, ?sort, ?q from the URL so links and the back button behave.
 */
(function () {
  "use strict";
  const { $, $$, el, loadCatalog, CFG, escapeHtml, hydrateIcons, observeLazy, getParam } = window.VA;

  const state = {
    all: [],
    filtered: [],
    collection: "all",
    query: "",
    sort: "curated",
    rendered: 0,
    pageSize: CFG.gallery.pageSize,
  };

  const grid = $("#gallery-grid");
  const empty = $("#gallery-empty");
  const loader = $("#gallery-loader");
  const sentinel = $("#gallery-sentinel");
  const countEl = $("#result-count");
  const searchInput = $("#gallery-search");
  const sortSelect = $("#sort-select");
  const chipsWrap = $("#filter-chips");

  /* ---------------------------------------------------------------- *
   * Tile markup
   * ---------------------------------------------------------------- */
  function tileMarkup(photo, index) {
    const price = CFG.priceRange(photo.sizes);
    const badge = photo.limited
      ? `<span class="tile__badge tile__badge--limited">Limited Edition</span>`
      : photo.featured
      ? `<span class="tile__badge">Featured</span>`
      : "";
    return `
      <a class="tile" href="product.html?id=${encodeURIComponent(photo.id)}"
         data-id="${photo.id}" data-index="${index}">
        ${badge}
        <div class="tile__img-wrap">
          <img class="tile__img" data-src="${photo.thumb}"
               alt="${escapeHtml(photo.title)} — ${escapeHtml(photo.collection)} photograph"
               width="${photo.width}" height="${photo.height}" loading="lazy" />
        </div>
        <div class="tile__overlay">
          <span class="tile__title">${escapeHtml(photo.title)}</span>
          <span class="tile__sub">
            <span>${escapeHtml(photo.collection)} · ${photo.year}</span>
            <span class="tile__price">${price}</span>
          </span>
        </div>
      </a>`;
  }

  /* ---------------------------------------------------------------- *
   * Filtering & sorting
   * ---------------------------------------------------------------- */
  function applyFilters() {
    const q = state.query.trim().toLowerCase();
    state.filtered = state.all.filter((p) => {
      const matchCollection =
        state.collection === "all" || p.collection.toLowerCase() === state.collection;
      if (!matchCollection) return false;
      if (!q) return true;
      const haystack = `${p.title} ${p.collection} ${p.tags.join(" ")} ${p.id}`.toLowerCase();
      return haystack.includes(q);
    });

    sortFiltered();
    state.rendered = 0;
    grid.innerHTML = "";
    renderNextPage();
    updateCount();
    empty.classList.toggle("hide", state.filtered.length > 0);
    grid.classList.toggle("hide", state.filtered.length === 0);
  }

  function sortFiltered() {
    const byPrice = (p) => Math.min(...p.sizes.map(CFG.priceFor));
    const cmp = {
      curated: (a, b) => state.all.indexOf(a) - state.all.indexOf(b),
      featured: (a, b) => Number(b.featured) - Number(a.featured) || a.title.localeCompare(b.title),
      title: (a, b) => a.title.localeCompare(b.title),
      "price-asc": (a, b) => byPrice(a) - byPrice(b),
      "price-desc": (a, b) => byPrice(b) - byPrice(a),
      newest: (a, b) => b.year - a.year || a.title.localeCompare(b.title),
    }[state.sort];
    if (cmp) state.filtered.sort(cmp);
  }

  function updateCount() {
    const n = state.filtered.length;
    countEl.textContent = `${n} ${n === 1 ? "work" : "works"}`;
  }

  /* ---------------------------------------------------------------- *
   * Rendering (paged for infinite scroll)
   * ---------------------------------------------------------------- */
  function renderNextPage() {
    const slice = state.filtered.slice(state.rendered, state.rendered + state.pageSize);
    if (!slice.length) {
      loader.classList.add("hide");
      return;
    }
    const frag = document.createElement("div");
    frag.innerHTML = slice.map((p, i) => tileMarkup(p, state.rendered + i)).join("");
    const tiles = Array.from(frag.children);
    tiles.forEach((t) => grid.appendChild(t));
    state.rendered += slice.length;

    observeLazy(grid);
    // Stagger the entrance
    tiles.forEach((t, i) => setTimeout(() => t.classList.add("is-in"), Math.min(i * 45, 400)));

    loader.classList.toggle("hide", state.rendered >= state.filtered.length);
  }

  /* ---------------------------------------------------------------- *
   * Filter chips
   * ---------------------------------------------------------------- */
  function buildChips() {
    const collections = Array.from(new Set(state.all.map((p) => p.collection)));
    const items = [["all", "All"], ...collections.map((c) => [c.toLowerCase(), c])];
    chipsWrap.innerHTML = items
      .map(
        ([value, label]) =>
          `<button class="chip" data-collection="${value}" aria-pressed="${
            value === state.collection
          }">${escapeHtml(label)}</button>`
      )
      .join("");

    chipsWrap.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      state.collection = chip.dataset.collection;
      $$(".chip", chipsWrap).forEach((c) =>
        c.setAttribute("aria-pressed", String(c === chip))
      );
      syncUrl();
      applyFilters();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------------- *
   * URL sync (shareable, back-button friendly)
   * ---------------------------------------------------------------- */
  function syncUrl() {
    const params = new URLSearchParams();
    if (state.collection !== "all") params.set("collection", state.collection);
    if (state.query) params.set("q", state.query);
    if (state.sort !== "curated") params.set("sort", state.sort);
    const qs = params.toString();
    history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
  }

  function readUrl() {
    const collection = (getParam("collection") || "all").toLowerCase();
    const tag = getParam("tag");
    state.collection = collection;
    state.query = getParam("q") || (tag ? tag : "");
    state.sort = getParam("sort") || "curated";
    if (searchInput) searchInput.value = state.query;
    if (sortSelect) sortSelect.value = state.sort;
  }

  function updateTitle() {
    const titleEl = $("#gallery-title");
    if (!titleEl) return;
    if (state.collection !== "all") {
      const name = state.all.find((p) => p.collection.toLowerCase() === state.collection)?.collection;
      titleEl.textContent = name || "The Gallery";
    } else {
      titleEl.textContent = "The Gallery";
    }
  }

  /* ---------------------------------------------------------------- *
   * Lightbox
   * ---------------------------------------------------------------- */
  const lb = {
    root: $("#lightbox"),
    img: $("#lb-img"),
    title: $("#lb-title"),
    meta: $("#lb-meta"),
    cta: $("#lb-cta"),
    index: -1,
    lastFocus: null,
  };

  function openLightbox(index) {
    const photo = state.filtered[index];
    if (!photo) return;
    lb.index = index;
    lb.lastFocus = document.activeElement;
    lb.img.classList.remove("is-loaded");
    lb.img.style.opacity = "0";
    lb.img.src = photo.src;
    lb.img.alt = `${photo.title} — ${photo.collection}`;
    lb.img.onload = () => (lb.img.style.opacity = "1");
    lb.title.textContent = photo.title;
    lb.meta.textContent = `${photo.collection} · ${photo.year} · from ${CFG.formatPrice(
      Math.min(...photo.sizes.map(CFG.priceFor))
    )}`;
    lb.cta.href = `product.html?id=${encodeURIComponent(photo.id)}`;
    lb.root.classList.add("is-open");
    document.body.style.overflow = "hidden";
    $("#lb-close").focus();
  }

  function closeLightbox() {
    lb.root.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lb.lastFocus) lb.lastFocus.focus();
  }

  function stepLightbox(dir) {
    let next = lb.index + dir;
    if (next < 0) next = state.filtered.length - 1;
    if (next >= state.filtered.length) next = 0;
    openLightbox(next);
  }

  function wireLightbox() {
    $("#lb-close").addEventListener("click", closeLightbox);
    $("#lb-prev").addEventListener("click", () => stepLightbox(-1));
    $("#lb-next").addEventListener("click", () => stepLightbox(1));
    lb.root.addEventListener("click", (e) => {
      if (e.target === lb.root) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (!lb.root.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") stepLightbox(-1);
      else if (e.key === "ArrowRight") stepLightbox(1);
    });

    // Open on tile click — but let the title/price area still navigate.
    // We intercept the whole tile: single click opens lightbox, the CTA inside
    // the lightbox goes to the product page. This keeps browsing fast.
    grid.addEventListener("click", (e) => {
      const tile = e.target.closest(".tile");
      if (!tile) return;
      // Allow modifier-clicks / middle-clicks to open product page normally.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      openLightbox(Number(tile.dataset.index));
    });
  }

  /* ---------------------------------------------------------------- *
   * Wiring
   * ---------------------------------------------------------------- */
  function debounce(fn, ms) {
    let id;
    return (...args) => {
      clearTimeout(id);
      id = setTimeout(() => fn(...args), ms);
    };
  }

  function wireControls() {
    searchInput.addEventListener(
      "input",
      debounce((e) => {
        state.query = e.target.value;
        syncUrl();
        applyFilters();
      }, 180)
    );

    sortSelect.addEventListener("change", (e) => {
      state.sort = e.target.value;
      syncUrl();
      applyFilters();
    });

    $("#clear-filters").addEventListener("click", () => {
      state.collection = "all";
      state.query = "";
      state.sort = "curated";
      searchInput.value = "";
      sortSelect.value = "curated";
      $$(".chip", chipsWrap).forEach((c) =>
        c.setAttribute("aria-pressed", String(c.dataset.collection === "all"))
      );
      syncUrl();
      applyFilters();
    });

    // Infinite scroll
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && state.rendered < state.filtered.length) {
            renderNextPage();
          }
        },
        { rootMargin: "600px 0px" }
      );
      io.observe(sentinel);
    }

    window.addEventListener("popstate", () => {
      readUrl();
      $$(".chip", chipsWrap).forEach((c) =>
        c.setAttribute("aria-pressed", String(c.dataset.collection === state.collection))
      );
      updateTitle();
      applyFilters();
    });
  }

  /* ---------------------------------------------------------------- *
   * Boot
   * ---------------------------------------------------------------- */
  function showSkeletons() {
    const ratios = [1.4, 1, 0.75, 1.2, 0.85, 1.5, 1, 0.7];
    grid.innerHTML = Array.from({ length: 12 })
      .map((_, i) => {
        const h = 220 * ratios[i % ratios.length];
        return `<div class="tile tile--skeleton"><div class="sk" style="height:${h}px"></div></div>`;
      })
      .join("");
  }

  showSkeletons();

  loadCatalog()
    .then((photos) => {
      state.all = photos;
      readUrl();
      buildChips();
      wireControls();
      wireLightbox();
      updateTitle();
      applyFilters();
    })
    .catch(() => {
      grid.innerHTML = "";
      empty.classList.remove("hide");
      $("#gallery-empty h3").textContent = "We couldn't load the gallery";
      $("#gallery-empty p").textContent =
        "Please check your connection and refresh the page.";
    });
})();
