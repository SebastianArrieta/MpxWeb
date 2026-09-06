(function () {
  const KEY_AUD = "mpx-audiencia";
  const KEY_LANG = "mpx-lang";
  const KEY_VISITS = "mpx-visitas-local";

  function getAudience() {
    return localStorage.getItem(KEY_AUD) || null;
  }
  function setAudience(v) {
    localStorage.setItem(KEY_AUD, v);
  }
  function getLang() {
    return localStorage.getItem(KEY_LANG) || "es";
  }
  function setLang(v) {
    localStorage.setItem(KEY_LANG, v);
  }
  function bumpCounter() {
    const n = Number(localStorage.getItem(KEY_VISITS) || "0") + 1;
    localStorage.setItem(KEY_VISITS, String(n));
    return n;
  }
  function readCounter() {
    return Number(localStorage.getItem(KEY_VISITS) || "0");
  }

  window.MpxShell = {
    getAudience,
    setAudience,
    getLang,
    setLang,
    bumpCounter,
    readCounter,
    ensureAudienceOrGate(gateUrl) {
      if (!getAudience()) {
        location.href = gateUrl || "entrada.html";
        return false;
      }
      return true;
    },
    mount(opts) {
      const audience = getAudience() || "visitante";
      const lang = getLang();
      const chip = document.querySelector("[data-audience-chip]");
      const menu = document.querySelector("[data-audience-menu]");
      const langBtn = document.querySelector("[data-lang-toggle]");
      const menuBtn = document.querySelector("[data-menu-btn]");
      const mobileNav = document.querySelector("[data-nav-mobile]");
      const counters = document.querySelectorAll("[data-visit-count]");

      if (opts && opts.countVisit !== false) bumpCounter();
      const visits = readCounter();
      counters.forEach((el) => {
        el.textContent = String(visits);
      });

      if (chip) {
        chip.textContent = audience === "momposino" ? "Momposino" : "Visitante";
        chip.addEventListener("click", () => {
          if (!menu) return;
          const open = menu.classList.toggle("open");
          chip.setAttribute("aria-expanded", open ? "true" : "false");
        });
      }
      if (menu) {
        menu.querySelectorAll("button[data-set-audience]").forEach((btn) => {
          const val = btn.getAttribute("data-set-audience");
          btn.setAttribute("aria-checked", val === audience ? "true" : "false");
          btn.addEventListener("click", () => {
            setAudience(val);
            menu.classList.remove("open");
            location.reload();
          });
        });
      }
      if (langBtn) {
        langBtn.textContent = lang === "es" ? "ES | EN" : "EN | ES";
        langBtn.setAttribute("aria-pressed", lang === "en" ? "true" : "false");
        langBtn.addEventListener("click", () => {
          setLang(lang === "es" ? "en" : "es");
          // Maquetado: solo persiste; copy EN llega después
          langBtn.textContent = getLang() === "es" ? "ES | EN" : "EN | ES";
          langBtn.setAttribute("aria-pressed", getLang() === "en" ? "true" : "false");
        });
      }
      if (menuBtn && mobileNav) {
        menuBtn.addEventListener("click", () => {
          mobileNav.classList.toggle("open");
        });
      }

      document.documentElement.dataset.audience = audience;
      document.querySelectorAll("[data-show-audience]").forEach((el) => {
        const want = el.getAttribute("data-show-audience");
        el.classList.toggle("hidden", want !== audience);
      });
      document.querySelectorAll("[data-home-order]").forEach((root) => {
        const orderAttr =
          audience === "momposino"
            ? root.getAttribute("data-order-momposino")
            : root.getAttribute("data-order-visitante");
        if (!orderAttr) return;
        const order = orderAttr.split(",").map((s) => s.trim());
        order.forEach((id) => {
          const block = root.querySelector(`[data-block="${id}"]`);
          if (block) root.appendChild(block);
        });
      });
    },
  };
})();
