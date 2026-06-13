/**
 * Visualart — Global Configuration
 * ================================
 * This is the ONE file the studio edits to wire the site to real accounts.
 * Nothing here is secret: EmailJS public keys and PayPal/Cash App handles are
 * all safe to ship in a static, front-end-only site.
 *
 * Everything is namespaced under window.VISUALART so any page/script can read it.
 */
window.VISUALART = (function () {
  "use strict";

  const config = {
    /* ----------------------------------------------------------------- *
     * Brand
     * ----------------------------------------------------------------- */
    brand: {
      name: "Visualart",
      studio: "Visualart Studio",
      tagline: "Where your photographs become canvas art.",
      // The artist behind the lens (shown on About).
      artist: "the artist",
      established: 2021,
      location: "United States",
    },

    /* ----------------------------------------------------------------- *
     * Order intake
     * ----------------------------------------------------------------- *
     * Orders are delivered by email to the fulfillment manager, who places
     * the order through Pictorem using the customer's payment.
     *
     * Two transport options are supported out of the box:
     *   - "emailjs"    : send via EmailJS (no page reload, supports JS)
     *   - "formsubmit" : POST to formsubmit.co (zero config, just an email)
     * If EmailJS is not configured, the order form automatically falls back
     * to FormSubmit so the site is functional the moment it's deployed.
     */
    order: {
      transport: "emailjs", // "emailjs" | "formsubmit"
      // The inbox that receives every order. CHANGE THIS.
      fulfillmentEmail: "orders@visualart.studio",

      // --- EmailJS (https://www.emailjs.com) ---
      emailjs: {
        publicKey: "", // e.g. "AbCdEf12345"   ← paste your EmailJS public key
        serviceId: "", // e.g. "service_xxx"
        templateId: "", // e.g. "template_xxx"
      },
    },

    /* ----------------------------------------------------------------- *
     * Payments — no card data ever touches this site.
     * ----------------------------------------------------------------- */
    payments: {
      paypal: {
        enabled: true,
        // Your PayPal.me slug → paypal.me/<handle>
        handle: "visualartstudio",
        // Optional: a business email shown as a fallback.
        email: "pay@visualart.studio",
      },
      cashapp: {
        enabled: true,
        // Your $Cashtag without the leading $.
        handle: "visualartstudio",
      },
      // Chime is supported as a manual fallback only (not standard for business).
      chime: {
        enabled: false,
        handle: "",
      },
    },

    /* ----------------------------------------------------------------- *
     * Pricing
     * ----------------------------------------------------------------- *
     * Price is computed from canvas area so re-pricing the whole catalog is a
     * single-number change. Formula:
     *
     *     price = basePrice + (width_in * height_in * pricePerSqInch)
     *
     * rounded to the nearest .00 and presented with `currencySymbol`.
     * `surcharges` lets specific sizes carry a premium (e.g. oversized).
     */
    pricing: {
      currency: "USD",
      currencySymbol: "$",
      basePrice: 39,
      pricePerSqInch: 0.22,
      // Optional per-size flat surcharge (matched against the "WxH" key).
      surcharges: {
        "40x60": 35,
        "36x36": 18,
        "45x30": 20,
      },
      // Friendly labels for the canvas finish (informational only).
      finishes: ["Gallery-Wrapped Canvas", "1.5\" Solid Wood Frame", "Ready to Hang"],
    },

    /* ----------------------------------------------------------------- *
     * Contact / social
     * ----------------------------------------------------------------- */
    contact: {
      email: "hello@visualart.studio",
      instagram: "", // e.g. "visualart.studio"
      // FormSubmit endpoint for the contact page (falls back automatically).
      formEmail: "hello@visualart.studio",
    },

    /* ----------------------------------------------------------------- *
     * Gallery behavior
     * ----------------------------------------------------------------- */
    gallery: {
      catalogUrl: "data/photos.json",
      pageSize: 18, // items loaded per "page" (infinite scroll batches)
    },
  };

  /* --------------------------------------------------------------------- *
   * Derived helpers — available everywhere as VISUALART.priceFor(), etc.
   * --------------------------------------------------------------------- */

  function parseSize(size) {
    const [w, h] = String(size).split("x").map((n) => parseInt(n, 10));
    return { w: w || 0, h: h || 0 };
  }

  function priceFor(size) {
    const { w, h } = parseSize(size);
    const { basePrice, pricePerSqInch, surcharges } = config.pricing;
    const area = w * h;
    const raw = basePrice + area * pricePerSqInch + (surcharges[size] || 0);
    return Math.round(raw);
  }

  function formatPrice(value) {
    const { currencySymbol } = config.pricing;
    return `${currencySymbol}${Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }

  function priceRange(sizes) {
    if (!sizes || !sizes.length) return "";
    const prices = sizes.map(priceFor);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? formatPrice(min) : `${formatPrice(min)} – ${formatPrice(max)}`;
  }

  return Object.assign(config, { parseSize, priceFor, formatPrice, priceRange });
})();
