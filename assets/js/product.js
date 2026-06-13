/**
 * Visualart — Product page
 * Loads a single photograph by ?id, renders the detail view with live
 * per-size pricing, and links through to the order form with the choice baked
 * into the URL. Also renders related works from the same collection.
 */
(function () {
  "use strict";
  const { $, $$, el, loadCatalog, CFG, escapeHtml, hydrateIcons, observeLazy, getParam, toast } =
    window.VA;

  const root = $("#product-root");
  const id = getParam("id");

  function notFound() {
    root.innerHTML = `
      <div class="empty">
        <div class="empty__icon">${window.VA.ICONS.image}</div>
        <h3>We couldn't find that piece</h3>
        <p>It may have moved. Browse the full gallery to find your next canvas.</p>
        <a class="btn btn--primary" href="gallery.html" style="margin-top:1.5rem">Open the Gallery</a>
      </div>`;
  }

  function featureItems() {
    return CFG.pricing.finishes
      .map((f) => `<li>${window.VA.ICONS.check}<span>${escapeHtml(f)}</span></li>`)
      .join("");
  }

  function sizeButtons(photo, selected) {
    return photo.sizes
      .map((size) => {
        const price = CFG.priceFor(size);
        const [w, h] = size.split("x");
        return `
        <button class="size-option" data-size="${size}" aria-pressed="${size === selected}">
          <div class="size-option__dim">${w}″ × ${h}″</div>
          <div class="size-option__price">${CFG.formatPrice(price)}</div>
        </button>`;
      })
      .join("");
  }

  function render(photo, photos) {
    const preselect = getParam("size");
    const selected = photo.sizes.includes(preselect) ? preselect : photo.sizes[0];

    document.title = `${photo.title} — Visualart`;
    const og = $("#og-image");
    if (og) og.setAttribute("content", photo.src);

    root.innerHTML = `
      <div class="product">
        <div class="product__media" data-reveal>
          <div class="product__frame">
            <img id="product-img" src="${photo.src}" alt="${escapeHtml(photo.title)} — ${escapeHtml(
      photo.collection
    )} photograph" width="${photo.width}" height="${photo.height}" />
          </div>
          <div class="tag-row" id="product-tags"></div>
        </div>

        <div class="product__panel" data-reveal data-reveal-delay="1">
          <nav class="breadcrumb">
            <a href="gallery.html">Gallery</a>
            <span data-icon="chevronRight"></span>
            <a href="gallery.html?collection=${encodeURIComponent(photo.collection.toLowerCase())}">${escapeHtml(
      photo.collection
    )}</a>
          </nav>
          <p class="product__collection" style="margin-top:1rem">${escapeHtml(photo.collection)} · ${photo.year}${
      photo.limited ? " · Limited Edition" : ""
    }</p>
          <h1 class="product__title">${escapeHtml(photo.title)}</h1>
          <p class="product__blurb">${escapeHtml(photo.blurb)}</p>

          <div class="product__price">
            <span class="amount" id="price-amount">${CFG.formatPrice(CFG.priceFor(selected))}</span>
            <span class="note">gallery-wrapped · ready to hang</span>
          </div>

          <div class="field-label"><span>Canvas Size</span><span id="size-hint">${selected.replace(
            "x",
            "″ × "
          )}″</span></div>
          <div class="size-grid" id="size-grid">${sizeButtons(photo, selected)}</div>

          <ul class="feature-list">${featureItems()}</ul>

          <div class="product__cta">
            <a class="btn btn--primary btn--lg btn--block" id="order-btn"
               href="order.html?id=${encodeURIComponent(photo.id)}&size=${encodeURIComponent(selected)}">
              Order This Canvas
              <span class="btn__icon btn__icon--arrow"></span>
            </a>
          </div>

          <div class="trust">
            <span class="trust__item">${window.VA.ICONS.shield}Secure PayPal / Cash App</span>
            <span class="trust__item">${window.VA.ICONS.truck}Made to order &amp; shipped</span>
            <span class="trust__item">${window.VA.ICONS.frame}1.5″ solid wood frame</span>
          </div>
        </div>
      </div>`;

    // Tags
    const tagRow = $("#product-tags");
    tagRow.innerHTML = photo.tags
      .map(
        (t) =>
          `<a class="tag" href="gallery.html?q=${encodeURIComponent(t)}">#${escapeHtml(t)}</a>`
      )
      .join("");

    hydrateIcons(root);
    window.VA.initReveal();

    const img = $("#product-img");
    if (img.complete && img.naturalWidth) img.classList.add("is-loaded");
    else img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });

    // Size selection → live price + order link
    let current = selected;
    const priceAmount = $("#price-amount");
    const sizeHint = $("#size-hint");
    const orderBtn = $("#order-btn");
    $("#size-grid").addEventListener("click", (e) => {
      const btn = e.target.closest(".size-option");
      if (!btn) return;
      current = btn.dataset.size;
      $$(".size-option", root).forEach((b) =>
        b.setAttribute("aria-pressed", String(b === btn))
      );
      const price = CFG.priceFor(current);
      priceAmount.textContent = CFG.formatPrice(price);
      sizeHint.textContent = `${current.replace("x", "″ × ")}″`;
      orderBtn.href = `order.html?id=${encodeURIComponent(photo.id)}&size=${encodeURIComponent(
        current
      )}`;
      // Subtle price pulse
      priceAmount.animate(
        [{ transform: "translateY(4px)", opacity: 0.4 }, { transform: "translateY(0)", opacity: 1 }],
        { duration: 280, easing: "cubic-bezier(0.16,1,0.3,1)" }
      );
    });

    renderRelated(photo, photos);
  }

  function renderRelated(photo, photos) {
    const related = photos
      .filter((p) => p.collection === photo.collection && p.id !== photo.id)
      .slice(0, 6);
    if (!related.length) return;
    const section = $("#related-section");
    const grid = $("#related-grid");
    $("#related-all").href = `gallery.html?collection=${encodeURIComponent(
      photo.collection.toLowerCase()
    )}`;
    grid.innerHTML = related
      .map(
        (p) => `
      <a class="tile is-in" href="product.html?id=${encodeURIComponent(p.id)}">
        <div class="tile__img-wrap">
          <img class="tile__img" data-src="${p.thumb}" alt="${escapeHtml(p.title)}" width="${p.width}" height="${p.height}" loading="lazy" />
        </div>
        <div class="tile__overlay">
          <span class="tile__title">${escapeHtml(p.title)}</span>
          <span class="tile__sub"><span>${escapeHtml(p.collection)}</span><span class="tile__price">${CFG.priceRange(
          p.sizes
        )}</span></span>
        </div>
      </a>`
      )
      .join("");
    section.hidden = false;
    observeLazy(grid);
  }

  if (!id) {
    notFound();
    return;
  }

  loadCatalog()
    .then((photos) => {
      const photo = photos.find((p) => p.id === id);
      if (!photo) return notFound();
      render(photo, photos);
    })
    .catch(notFound);
})();
