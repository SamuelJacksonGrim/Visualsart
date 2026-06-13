/**
 * Visualart — Order intake
 * ========================
 * Builds the order summary, drives payment method selection with live
 * PayPal/Cash App links, validates the form, and delivers the order by email.
 *
 * Transport priority:
 *   1. EmailJS  — used when fully configured in config.js (no page reload).
 *   2. FormSubmit — automatic fallback; posts to a hidden iframe so screenshot
 *      attachments work and the page never navigates away.
 */
(function () {
  "use strict";
  const { $, $$, el, loadCatalog, CFG, escapeHtml, hydrateIcons, getParam, toast } = window.VA;

  const order = {
    photo: null,
    size: null,
    qty: 1,
    method: null,
    file: null,
  };

  const form = $("#order-form");

  /* ---------------------------------------------------------------- *
   * Summary
   * ---------------------------------------------------------------- */
  function unitPrice() {
    return CFG.priceFor(order.size);
  }
  function total() {
    return unitPrice() * order.qty;
  }

  function paintSummary() {
    const p = order.photo;
    $("#summary-img").src = p.thumb;
    $("#summary-img").alt = p.title;
    $("#summary-title").textContent = p.title;
    $("#summary-id").textContent = `${p.id} · ${p.collection}`;
    $("#summary-size").textContent = `${order.size.replace("x", "″ × ")}″`;
    $("#summary-unit").textContent = CFG.formatPrice(unitPrice());
    $("#summary-qty").textContent = order.qty;
    $("#summary-total").textContent = CFG.formatPrice(total());
    $("#back-to-product").href = `product.html?id=${encodeURIComponent(p.id)}&size=${encodeURIComponent(
      order.size
    )}`;
    paintPayInstructions();
  }

  /* ---------------------------------------------------------------- *
   * Payment methods
   * ---------------------------------------------------------------- */
  function availableMethods() {
    const m = [];
    const pay = CFG.payments;
    if (pay.paypal.enabled)
      m.push({
        key: "paypal",
        name: "PayPal",
        desc: "Most trusted · buyer protection",
        logo: '<svg viewBox="0 0 24 24" width="46" height="20" fill="none"><text x="0" y="16" font-family="Inter,sans-serif" font-size="15" font-weight="700" fill="currentColor">Pay</text><text x="30" y="16" font-family="Inter,sans-serif" font-size="15" font-weight="700" fill="var(--accent)">Pal</text></svg>',
      });
    if (pay.cashapp.enabled)
      m.push({
        key: "cashapp",
        name: "Cash App",
        desc: "Fast &amp; simple",
        logo: '<svg viewBox="0 0 24 24" width="24" height="24"><rect width="24" height="24" rx="6" fill="#00C244"/><path d="M15.5 9.2c.3.3.8.3 1 0l.7-.7c.3-.3.3-.7 0-1A5 5 0 0014 6.2l.2-1c.05-.3-.16-.5-.45-.5h-1.1c-.24 0-.45.17-.5.42l-.18.9c-1.7.1-3.1 1-3.1 2.7 0 1.5 1.16 2.16 2.62 2.66 1.16.42 1.74.66 1.74 1.26 0 .6-.6.96-1.42.96-.78 0-1.6-.3-2.2-.84-.27-.24-.7-.24-.95.02l-.74.74c-.3.3-.28.78.03 1.05.6.52 1.34.88 2.13 1.04l-.18.92c-.06.3.16.55.45.55h1.1c.24 0 .46-.18.5-.42l.18-.9c1.9-.13 3.22-1.15 3.22-2.85 0-1.5-1.18-2.18-2.74-2.7-1.04-.38-1.66-.62-1.66-1.2 0-.56.56-.88 1.3-.88.72 0 1.4.28 1.9.72z" fill="#fff"/></svg>',
      });
    if (pay.chime.enabled)
      m.push({ key: "chime", name: "Chime", desc: "Fallback option", logo: '<strong style="font-size:1rem">Chime</strong>' });
    return m;
  }

  function buildMethods() {
    const methods = availableMethods();
    const wrap = $("#pay-methods");
    wrap.innerHTML = methods
      .map(
        (m, i) => `
      <label class="pay-method">
        <input type="radio" name="payment_method" value="${m.key}" ${i === 0 ? "checked" : ""} />
        <span class="pay-method__check" data-icon="check"></span>
        <span class="pay-method__logo">${m.logo}</span>
        <span class="pay-method__name">${m.name}</span>
        <span class="pay-method__desc">${m.desc}</span>
      </label>`
      )
      .join("");
    hydrateIcons(wrap);
    order.method = methods[0]?.key || null;
    wrap.addEventListener("change", (e) => {
      if (e.target.name === "payment_method") {
        order.method = e.target.value;
        paintPayInstructions();
      }
    });
  }

  function payLink() {
    const amt = total();
    if (order.method === "paypal") {
      const h = CFG.payments.paypal.handle;
      return { url: `https://www.paypal.com/paypalme/${h}/${amt}`, label: `paypal.me/${h}` };
    }
    if (order.method === "cashapp") {
      const h = CFG.payments.cashapp.handle;
      return { url: `https://cash.app/$${h}/${amt}`, label: `$${h}` };
    }
    if (order.method === "chime") {
      return { url: "", label: CFG.payments.chime.handle || "Chime" };
    }
    return { url: "", label: "" };
  }

  function paintPayInstructions() {
    const panel = $("#pay-instructions");
    const amt = CFG.formatPrice(total());
    const link = payLink();
    const methodName =
      order.method === "paypal" ? "PayPal" : order.method === "cashapp" ? "Cash App" : "Chime";

    const linkBtn = link.url
      ? `<a class="pay-link" href="${link.url}" target="_blank" rel="noopener">
           ${window.VA.ICONS.arrowUpRight} Pay ${amt} with ${methodName}
         </a>`
      : `<p style="margin-top:1rem;color:var(--text-dim)">Send <span class="amount-callout">${amt}</span> to <strong>${escapeHtml(
          link.label
        )}</strong> and note your order ID.</p>`;

    panel.innerHTML = `
      <h4>${window.VA.ICONS.sparkle} Pay <span class="amount-callout">${amt}</span> via ${methodName}</h4>
      <ol>
        <li>Tap the button below to open ${methodName} pre-filled with your total.</li>
        <li>Send the payment to <strong>${escapeHtml(link.label)}</strong>.</li>
        <li>Copy the transaction ID (or screenshot the receipt) and add it below.</li>
        <li>Submit this form — the studio verifies payment, then places your print order.</li>
      </ol>
      ${linkBtn}`;
    hydrateIcons(panel);
  }

  /* ---------------------------------------------------------------- *
   * File upload
   * ---------------------------------------------------------------- */
  function wireUpload() {
    const zone = $("#upload-zone");
    const input = $("#proof");
    const preview = $("#upload-preview");
    const previewImg = $("#preview-img");
    const previewName = $("#preview-name");
    const proofError = $("#proof-error");
    const MAX = 5 * 1024 * 1024;

    function handleFile(file) {
      proofError.classList.remove("is-shown");
      if (!file) return;
      if (!/^image\/(png|jpeg)$/.test(file.type)) {
        proofError.textContent = "Please upload a PNG or JPG image.";
        proofError.classList.add("is-shown");
        return;
      }
      if (file.size > MAX) {
        proofError.textContent = "That file is over 5MB. Please choose a smaller image.";
        proofError.classList.add("is-shown");
        return;
      }
      order.file = file;
      previewName.textContent = `${file.name} · ${(file.size / 1024).toFixed(0)} KB`;
      const reader = new FileReader();
      reader.onload = (e) => (previewImg.src = e.target.result);
      reader.readAsDataURL(file);
      preview.classList.add("is-shown");
    }

    input.addEventListener("change", (e) => handleFile(e.target.files[0]));

    ["dragover", "dragenter"].forEach((ev) =>
      zone.addEventListener(ev, (e) => {
        e.preventDefault();
        zone.classList.add("is-drag");
      })
    );
    ["dragleave", "drop"].forEach((ev) =>
      zone.addEventListener(ev, (e) => {
        e.preventDefault();
        zone.classList.remove("is-drag");
      })
    );
    zone.addEventListener("drop", (e) => {
      const file = e.dataTransfer.files[0];
      if (file) {
        input.files = e.dataTransfer.files;
        handleFile(file);
      }
    });

    $("#preview-remove").addEventListener("click", (e) => {
      e.preventDefault();
      order.file = null;
      input.value = "";
      preview.classList.remove("is-shown");
    });
  }

  /* ---------------------------------------------------------------- *
   * Validation
   * ---------------------------------------------------------------- */
  const REQUIRED = ["name", "email", "phone", "address1", "city", "region", "postal", "country"];

  function setError(field, msg) {
    const wrap = field.closest(".field");
    const err = wrap ? wrap.querySelector(".field__error") : null;
    field.classList.toggle("is-invalid", !!msg);
    if (err) {
      err.textContent = msg || "";
      err.classList.toggle("is-shown", !!msg);
    }
    return !msg;
  }

  function validate() {
    let ok = true;
    let firstInvalid = null;

    REQUIRED.forEach((name) => {
      const field = form.elements[name];
      const val = field.value.trim();
      let msg = "";
      if (!val) msg = "This field is required.";
      else if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
        msg = "Enter a valid email address.";
      else if (name === "phone" && val.replace(/\D/g, "").length < 7)
        msg = "Enter a valid phone number.";
      if (!setError(field, msg) && !firstInvalid) firstInvalid = field;
      if (msg) ok = false;
    });

    // Need either a transaction ID or an uploaded screenshot.
    const txid = form.elements.txid;
    if (!txid.value.trim() && !order.file) {
      setError(txid, "Add a transaction ID or upload a payment screenshot.");
      if (!firstInvalid) firstInvalid = txid;
      ok = false;
    } else {
      setError(txid, "");
    }

    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalid.focus({ preventScroll: true });
    }
    return ok;
  }

  // Clear errors as the user fixes them
  form.addEventListener("input", (e) => {
    if (e.target.classList.contains("is-invalid")) setError(e.target, "");
  });

  /* ---------------------------------------------------------------- *
   * Build computed hidden fields shared by both transports
   * ---------------------------------------------------------------- */
  function injectHiddenFields() {
    $$(".va-hidden", form).forEach((n) => n.remove());
    const p = order.photo;
    const link = payLink();
    const fields = {
      _subject: `New Visualart order — ${p.title} (${p.id})`,
      _template: "table",
      _captcha: "false",
      order_id: p.id,
      photo_title: p.title,
      collection: p.collection,
      photo_url: p.src,
      canvas_size: `${order.size.replace("x", " x ")} in`,
      unit_price: CFG.formatPrice(unitPrice()),
      total: CFG.formatPrice(total()),
      payment_to: link.label,
      to_email: CFG.order.fulfillmentEmail,
      submitted_at: new Date().toLocaleString(),
    };
    Object.entries(fields).forEach(([name, value]) => {
      const input = el("input", { type: "hidden", name, value, class: "va-hidden" });
      form.appendChild(input);
    });
  }

  /* ---------------------------------------------------------------- *
   * Transports
   * ---------------------------------------------------------------- */
  function emailjsReady() {
    const e = CFG.order.emailjs;
    return (
      CFG.order.transport === "emailjs" &&
      window.emailjs &&
      e.publicKey &&
      e.serviceId &&
      e.templateId
    );
  }

  function sendViaEmailJS() {
    const e = CFG.order.emailjs;
    window.emailjs.init({ publicKey: e.publicKey });
    return window.emailjs.sendForm(e.serviceId, e.templateId, form);
  }

  function sendViaFormSubmit() {
    // Post the real form (incl. file) into a hidden iframe so the page never
    // navigates and attachments are supported.
    return new Promise((resolve, reject) => {
      let iframe = $("#fs-sink");
      if (!iframe) {
        iframe = el("iframe", { id: "fs-sink", name: "fs-sink", style: "display:none" });
        document.body.appendChild(iframe);
      }
      const email = CFG.order.fulfillmentEmail;
      const prevAction = form.action;
      const prevTarget = form.target;
      const prevMethod = form.method;
      form.action = `https://formsubmit.co/${encodeURIComponent(email)}`;
      form.method = "POST";
      form.enctype = "multipart/form-data";
      form.target = "fs-sink";

      let settled = false;
      const onLoad = () => {
        if (settled) return;
        settled = true;
        iframe.removeEventListener("load", onLoad);
        resolve();
      };
      iframe.addEventListener("load", onLoad);
      // Safety timeout — assume success if the iframe is slow (no-cors opacity).
      setTimeout(() => {
        if (!settled) {
          settled = true;
          resolve();
        }
      }, 4000);

      HTMLFormElement.prototype.submit.call(form);

      // Restore attributes for any subsequent submit.
      form.action = prevAction;
      form.target = prevTarget;
      form.method = prevMethod;
    });
  }

  /* ---------------------------------------------------------------- *
   * Submit
   * ---------------------------------------------------------------- */
  function setSubmitting(on) {
    const btn = $("#submit-btn");
    btn.disabled = on;
    btn.innerHTML = on
      ? '<span class="spinner" style="width:18px;height:18px;border-width:2px"></span> Sending…'
      : 'Submit Order <span class="btn__icon btn__icon--arrow"></span>';
    if (!on) hydrateIcons(btn.parentElement);
  }

  function showSuccess() {
    const p = order.photo;
    $("#order-root").innerHTML = `
      <div class="order-success">
        <div class="order-success__icon">${window.VA.ICONS.checkCircle}</div>
        <h1>Order received</h1>
        <p>Thank you${form.elements.name.value ? ", " + escapeHtml(form.elements.name.value.split(" ")[0]) : ""} — your order for
          <strong>${escapeHtml(p.title)}</strong> (${order.size.replace("x", "″ × ")}″) has been sent to the studio.</p>
        <p>We'll verify your payment and place the canvas into production, then email you a confirmation. Orders are typically produced within a few business days.</p>
        <div class="hero__actions" style="justify-content:center;margin-top:2rem">
          <a class="btn btn--primary btn--lg" href="gallery.html">Browse more work
            <span class="btn__icon btn__icon--arrow"></span>
          </a>
          <a class="btn btn--ghost btn--lg" href="index.html">Back home</a>
        </div>
      </div>`;
    hydrateIcons($("#order-root"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function wireSubmit() {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validate()) {
        toast("Please complete the highlighted fields.", "error");
        return;
      }
      injectHiddenFields();
      setSubmitting(true);
      try {
        if (emailjsReady()) {
          await sendViaEmailJS();
        } else {
          await sendViaFormSubmit();
        }
        showSuccess();
        toast("Order sent to the studio.", "success");
      } catch (err) {
        console.error(err);
        setSubmitting(false);
        toast("Something went wrong sending your order. Please try again or email us.", "error");
      }
    });
  }

  /* ---------------------------------------------------------------- *
   * Qty changes
   * ---------------------------------------------------------------- */
  function wireQty() {
    form.elements.qty.addEventListener("change", (e) => {
      order.qty = parseInt(e.target.value, 10) || 1;
      paintSummary();
    });
  }

  /* ---------------------------------------------------------------- *
   * Boot
   * ---------------------------------------------------------------- */
  const id = getParam("id");
  const sizeParam = getParam("size");

  if (!id) {
    $("#order-root").innerHTML = `
      <div class="empty">
        <div class="empty__icon">${window.VA.ICONS.frame}</div>
        <h3>No piece selected</h3>
        <p>Choose a photograph from the gallery to start your order.</p>
        <a class="btn btn--primary" href="gallery.html" style="margin-top:1.5rem">Open the Gallery</a>
      </div>`;
    return;
  }

  loadCatalog()
    .then((photos) => {
      const photo = photos.find((p) => p.id === id);
      if (!photo) throw new Error("not found");
      order.photo = photo;
      order.size = photo.sizes.includes(sizeParam) ? sizeParam : photo.sizes[0];
      order.qty = 1;

      paintSummary();
      buildMethods();
      paintPayInstructions();
      wireUpload();
      wireQty();
      wireSubmit();
      hydrateIcons(document);
    })
    .catch(() => {
      $("#order-root").innerHTML = `
        <div class="empty">
          <div class="empty__icon">${window.VA.ICONS.image}</div>
          <h3>We couldn't load that piece</h3>
          <p>Please return to the gallery and try again.</p>
          <a class="btn btn--primary" href="gallery.html" style="margin-top:1.5rem">Open the Gallery</a>
        </div>`;
    });
})();
