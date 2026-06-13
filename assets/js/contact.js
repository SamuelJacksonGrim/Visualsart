/**
 * Visualart — Contact page
 * Accordion FAQ + a contact form that delivers via FormSubmit (AJAX),
 * with graceful validation and a toast on success.
 */
(function () {
  "use strict";
  const { $, $$, CFG, escapeHtml, toast, hydrateIcons } = window.VA;

  /* ---- Email link ---- */
  const emailLink = $("#contact-email");
  if (emailLink) {
    emailLink.textContent = CFG.contact.email;
    emailLink.href = `mailto:${CFG.contact.email}`;
  }

  /* ---- FAQ accordion ---- */
  $$(".faq__item").forEach((item) => {
    const q = item.querySelector(".faq__q");
    const a = item.querySelector(".faq__a");
    q.addEventListener("click", () => {
      const open = item.classList.toggle("is-open");
      a.style.maxHeight = open ? a.scrollHeight + "px" : "0px";
      // Close siblings for a clean single-open accordion
      if (open) {
        $$(".faq__item").forEach((other) => {
          if (other !== item && other.classList.contains("is-open")) {
            other.classList.remove("is-open");
            other.querySelector(".faq__a").style.maxHeight = "0px";
          }
        });
      }
    });
  });

  /* ---- Contact form ---- */
  const form = $("#contact-form");
  if (!form) return;

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

  form.addEventListener("input", (e) => {
    if (e.target.classList.contains("is-invalid")) setError(e.target, "");
  });

  function validate() {
    let ok = true;
    const name = form.elements.name;
    const email = form.elements.email;
    const message = form.elements.message;
    if (!name.value.trim()) ok = setError(name, "Please tell us your name.") && ok;
    if (!email.value.trim()) ok = setError(email, "We need an email to reply.") && ok;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()))
      ok = setError(email, "Enter a valid email.") && ok;
    if (!message.value.trim()) ok = setError(message, "Add a short message.") && ok;
    return ok;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast("Please complete the highlighted fields.", "error");
      return;
    }
    const btn = $("#c-submit");
    btn.disabled = true;
    const original = btn.innerHTML;
    btn.innerHTML = '<span class="spinner" style="width:18px;height:18px;border-width:2px"></span> Sending…';

    const data = new FormData(form);
    data.append("_subject", `Visualart contact — ${form.elements.subject.value || "New message"}`);
    data.append("_captcha", "false");

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(CFG.contact.formEmail)}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      toast("Message sent — we'll be in touch soon.", "success");
    } catch (err) {
      console.error(err);
      toast("Couldn't send just now. Please email us directly.", "error");
    } finally {
      btn.disabled = false;
      btn.innerHTML = original;
      hydrateIcons(btn.parentElement);
    }
  });
})();
