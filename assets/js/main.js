/**
 * Realy.si — rendering + micro-interactions.
 * All content comes from window.REALY_DATA (assets/js/data.js).
 */
(function () {
  "use strict";

  const D = window.REALY_DATA;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const TICK = '<svg class="tick" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.3l2.3 2.2 4.7-4.8"/></svg>';
  const MARK = '<svg viewBox="0 0 100 100" aria-hidden="true"><use href="#realy-mark"/></svg>';

  /* ------------------------------------------------------------ formatting */
  function fmt(value, format, suffix = "") {
    let out;
    switch (format) {
      case "currency": out = "$" + Math.round(value).toLocaleString("en-US"); break;
      case "percent": out = Math.round(value) + "%"; break;
      case "percent1": out = value.toFixed(1) + "%"; break;
      default: out = Math.round(value).toLocaleString("en-US");
    }
    return out + suffix;
  }

  function countUp(el, target, format, suffix, duration = 1100) {
    if (reduced) { el.textContent = fmt(target, format, suffix); return; }
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - t, 3);
      el.textContent = fmt(target * e, format === "percent1" ? "percent1" : format, suffix);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(target, format, suffix);
    };
    requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------- links */
  function applyLinks() {
    $$("[data-link]").forEach((a) => {
      const href = D.links[a.dataset.link];
      if (href) a.href = href;
    });
  }

  /* -------------------------------------------------------------- nav */
  function initNav() {
    const nav = $("#nav");
    const toggle = $(".nav__toggle");
    const menu = $("#mobile-menu");
    const sticky = $("#sticky-cta");
    const hero = $(".hero");

    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle("is-scrolled", y > 8);
      if (sticky && hero) {
        const pastHero = y > hero.offsetTop + hero.offsetHeight - 120;
        const nearEnd = window.innerHeight + y > document.body.scrollHeight - 520;
        sticky.classList.toggle("is-on", pastHero && !nearEnd);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const close = () => { toggle.setAttribute("aria-expanded", "false"); menu.hidden = true; };
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.hidden = open;
    });
    $$("a", menu).forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    window.addEventListener("resize", () => { if (window.innerWidth > 1080) close(); });
  }

  /* ------------------------------------------------------------- hero */
  function renderHero() {
    const h = D.hero;
    $("#hv-company").textContent = h.company;
    $("#hv-pct").textContent = h.launchProgress + "%";
    $("#hv-bar").style.setProperty("--v", h.launchProgress + "%");
    $("#hv-agents").innerHTML = h.agents.map((a) => `
      <li>
        <span class="role"><span class="role__icon">${MARK}</span>${esc(a.role)}</span>
        <span class="pill pill--${a.tone}"><i></i>${esc(a.status)}</span>
      </li>`).join("");

    // Subtle depth on pointer move (desktop only)
    const vis = $("[data-parallax]");
    if (!vis || reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const layers = [[".hv-main", 6], [".hv-float--a", 14], [".hv-float--b", 12]].map(([s, d]) => [$(s, vis), d]);
    const hero = $(".hero");
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      layers.forEach(([el, d]) => { if (el) el.style.transform = `translate3d(${(-x * d).toFixed(2)}px, ${(-y * d).toFixed(2)}px, 0)`; });
    });
    hero.addEventListener("pointerleave", () => layers.forEach(([el]) => el && (el.style.transform = "")));
  }

  /* ------------------------------------------------------- dashboard */
  function chartSVG(series) {
    const W = 600, H = 180, P = 6;
    const max = Math.max(...series) * 1.1, min = Math.min(...series) * 0.8;
    const pts = series.map((v, i) => [
      (i / (series.length - 1)) * W,
      P + (1 - (v - min) / (max - min)) * (H - P * 2),
    ]);
    const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
    const area = line + ` L ${W} ${H} L 0 ${H} Z`;
    const grid = [0.25, 0.5, 0.75].map((g) => `<line x1="0" x2="${W}" y1="${H * g}" y2="${H * g}"/>`).join("");
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#1764ff" stop-opacity=".14"/><stop offset="1" stop-color="#1764ff" stop-opacity="0"/>
      </linearGradient></defs>
      <g class="grid">${grid}</g>
      <path class="area" d="${area}"/>
      <path class="line" d="${line}"/>
    </svg>`;
  }

  function renderDashboard() {
    const nav = $("#dash-nav");
    const panel = $("#dash-panel");
    const views = D.dashboard.views;
    $("#dash-company").textContent = D.dashboard.company;

    nav.innerHTML = views.map((v, i) => `
      <button class="app__tab" role="tab" id="tab-${v.id}" aria-controls="dash-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-view="${v.id}">
        <span class="ico"></span>${esc(v.label)}
      </button>`).join("");

    let animated = false;
    const show = (id, animate) => {
      const v = views.find((x) => x.id === id) || views[0];
      $$(".app__tab", nav).forEach((t) => {
        const on = t.dataset.view === v.id;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
      });
      panel.setAttribute("aria-labelledby", "tab-" + v.id);
      const hasChart = Array.isArray(v.series) && v.series.length > 1;
      panel.innerHTML = `
        <div class="fade-swap">
          <div class="dash__head">
            <div><h3 class="dash__title">${esc(v.title)}</h3><p class="dash__sub">${esc(v.subtitle)}</p></div>
            <span class="pill pill--live"><i></i>Live</span>
          </div>
          <div class="metrics">
            ${v.metrics.map((m) => `
              <div class="metric">
                <div class="metric__k">${esc(m.label)}</div>
                <div class="metric__v" data-v="${m.value}" data-f="${m.format}" data-s="${esc(m.suffix || "")}">${fmt(m.value, m.format, m.suffix || "")}</div>
                <div class="metric__d ${/^\+/.test(m.delta) ? "up" : ""}">${esc(m.delta)}</div>
              </div>`).join("")}
          </div>
          <div class="dash__body ${hasChart ? "" : "dash__body--single"}">
            ${hasChart ? `<div class="chart"><div class="chart__k"><span>${esc(v.seriesLabel || "")}</span><span class="mono">16w</span></div>${chartSVG(v.series)}</div>` : ""}
            <ul class="rows">
              <li class="rows__k" style="border:0;padding:0 0 4px"><span>${hasChart ? "Activity" : "Overview"}</span></li>
              ${v.rows.map((r) => `
                <li><span class="txt"><span class="who">${esc(r.who)}</span><span class="what">${esc(r.what)}</span></span>
                <span class="pill pill--${r.tone}">${r.tone === "live" ? "<i></i>" : ""}${esc(r.meta)}</span></li>`).join("")}
            </ul>
          </div>
        </div>`;

      if (animate) {
        $$(".metric__v", panel).forEach((el) => countUp(el, parseFloat(el.dataset.v), el.dataset.f, el.dataset.s));
        const line = $(".chart .line", panel);
        if (line && !reduced) {
          const len = line.getTotalLength ? Math.ceil(line.getTotalLength()) : 1200;
          line.style.setProperty("--len", len);
          line.classList.add("draw");
        }
      }
    };

    nav.addEventListener("click", (e) => {
      const b = e.target.closest(".app__tab");
      if (b) show(b.dataset.view, true);
    });
    nav.addEventListener("keydown", (e) => {
      if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
      const tabs = $$(".app__tab", nav);
      const i = tabs.indexOf(document.activeElement);
      let n = i;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") n = (i + 1) % tabs.length;
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
      if (e.key === "Home") n = 0;
      if (e.key === "End") n = tabs.length - 1;
      e.preventDefault();
      tabs[n].focus();
      show(tabs[n].dataset.view, true);
    });

    show(views[0].id, false);
    onceVisible($("#dashboard"), () => { if (!animated) { animated = true; show(views[0].id, true); } });
  }

  /* ---------------------------------------------------- company setup */
  function renderJurisdictions() {
    const wrap = $("#jur-chips");
    const list = D.jurisdictions;
    wrap.innerHTML = list.map((j, i) => `<button class="chip" role="radio" aria-checked="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-id="${j.id}">${esc(j.name)}</button>`).join("");
    const select = (id, focus) => {
      const j = list.find((x) => x.id === id);
      $$(".chip", wrap).forEach((c) => {
        const on = c.dataset.id === id;
        c.setAttribute("aria-checked", String(on));
        c.tabIndex = on ? 0 : -1;
        if (on && focus) c.focus();
      });
      const ent = $("#jur-entity"), note = $("#jur-note");
      ent.textContent = j.entity; note.textContent = j.note;
      [ent, note].forEach((el) => { el.classList.remove("fade-swap"); void el.offsetWidth; el.classList.add("fade-swap"); });
    };
    wrap.addEventListener("click", (e) => { const c = e.target.closest(".chip"); if (c) select(c.dataset.id); });
    wrap.addEventListener("keydown", (e) => {
      const chips = $$(".chip", wrap);
      const i = chips.findIndex((c) => c.getAttribute("aria-checked") === "true");
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); select(list[(i + 1) % list.length].id, true); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); select(list[(i - 1 + list.length) % list.length].id, true); }
    });
    select(list[0].id);
  }

  /* --------------------------------------------- product development */
  function renderScale() {
    const items = D.products;
    $("#scale-list").innerHTML = items.map((p, i) => {
      const t = i / (items.length - 1);
      const h = Math.round(28 + Math.pow(t, 1.35) * 212);
      const w = Math.round(16 + Math.pow(t, 1.35) * 84);
      return `<li class="scale__item" tabindex="0">
        <span class="scale__bar" style="--h:${h}px;--w:${w}px;--o:${(0.06 + t * 0.22).toFixed(2)};transition-delay:${i * 70}ms" aria-hidden="true"></span>
        <div><div class="scale__name">${esc(p.name)}</div><div class="scale__scope">${esc(p.scope)}</div></div>
      </li>`;
    }).join("");
  }

  /* ----------------------------------------------------- marketplace */
  function renderMarketplace() {
    const M = D.marketplace;
    $("#mkt-total").textContent = M.total;
    const filters = $("#mkt-filters");
    const grid = $("#mkt-grid");
    const cats = ["All", ...M.categories];
    filters.innerHTML = cats.map((c, i) => `<button class="chip" aria-pressed="${i === 0}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");

    const draw = (cat) => {
      const items = cat === "All" ? M.items : M.items.filter((x) => x.category === cat);
      grid.innerHTML = items.map((p, i) => `
        <li class="prod" style="animation-delay:${Math.min(i, 8) * 35}ms">
          <div class="prod__top"><span class="prod__glyph" aria-hidden="true">${esc(p.name.split(" ").map((w) => w[0]).join("").slice(0, 2))}</span><span class="prod__cat">${esc(p.category)}</span></div>
          <div class="prod__name">${esc(p.name)}</div>
          <div class="prod__desc">${esc(p.desc)}</div>
          <div class="prod__foot"><span>White-label · Ready to launch</span><b aria-hidden="true">→</b></div>
        </li>`).join("");
    };
    filters.addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      $$(".chip", filters).forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
      draw(b.dataset.cat);
    });
    draw("All");
  }

  /* ---------------------------------------------------- AI employees */
  function renderOrg() {
    const O = D.org;
    const chart = $("#org-chart");
    const card = (role, task, extra = "") => `
      <div class="oc ${extra}" data-task="${esc(task)}">
        <div class="oc__top"><span class="oc__role">${esc(role)}</span><span class="oc__dot"></span></div>
        <div class="oc__task">Idle</div>
      </div>`;
    // Connector SVG: one parent at center fanning out to n children.
    const link = (n) => {
      const paths = Array.from({ length: n }, (_, i) => {
        const x = ((i + 0.5) / n) * 100;
        return `<path d="M50 0 V50 H${x.toFixed(2)} V100"/>`;
      }).join("");
      return `<div class="oc-link" aria-hidden="true"><svg viewBox="0 0 100 100" preserveAspectRatio="none">${paths}</svg></div>`;
    };
    chart.innerHTML = `
      <div class="oc-row oc-row--ceo">${card(O.ceo.role, O.ceo.task, "oc--ceo")}</div>
      ${link(O.executives.length)}
      <div class="oc-row oc-row--exec">${O.executives.map((e) => card(e.role, e.task)).join("")}</div>
      ${link(3)}
      <div class="oc-row oc-row--dept">${O.departments.map((d) => card(d.name, d.task)).join("")}</div>`;

    const cmdEl = $("#org-cmd");
    const log = $("#org-log");
    const runBtn = $("#org-run");
    const ceo = $(".oc--ceo", chart);
    const execs = $$(".oc-row--exec .oc", chart);
    const depts = $$(".oc-row--dept .oc", chart);
    const links = $$(".oc-link path", chart);
    let timers = [];
    let t0 = 0;

    const clear = () => { timers.forEach(clearTimeout); timers = []; };
    const at = (ms, fn) => timers.push(setTimeout(fn, reduced ? 0 : ms));
    const stamp = () => { const s = ((performance.now() - t0) / 1000).toFixed(1); return ("00" + s).slice(-4) + "s"; };
    const say = (who, msg, ok) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="t">${stamp()}</span><span><span class="a">${esc(who)}</span> ${esc(msg)}${ok ? ' <span class="ok">' + TICK + "</span>" : ""}</span>`;
      log.appendChild(li);
      while (log.children.length > 12) log.removeChild(log.firstChild);
    };
    const set = (el, state, text) => {
      el.classList.remove("is-on", "is-done");
      if (state) el.classList.add(state);
      $(".oc__task", el).textContent = text;
    };

    const run = () => {
      clear();
      t0 = performance.now();
      log.innerHTML = "";
      [ceo, ...execs, ...depts].forEach((el) => set(el, "", "Idle"));
      links.forEach((p) => p.classList.remove("hot"));
      cmdEl.textContent = "";

      // Type the founder's command
      const cmd = O.command;
      if (reduced) cmdEl.textContent = cmd;
      else [...cmd].forEach((ch, i) => at(300 + i * 45, () => { cmdEl.textContent += ch; }));
      let t = reduced ? 0 : 300 + cmd.length * 45 + 350;

      at(t, () => { say("founder", "→ " + cmd); set(ceo, "is-on", "Planning launch…"); });
      t += 900;
      at(t, () => { say("ai-ceo", "Plan ready · delegating to executives"); set(ceo, "is-on", O.ceo.task); links.slice(0, execs.length).forEach((p) => p.classList.add("hot")); });
      execs.forEach((el, i) => at(t + 250 + i * 220, () => set(el, "is-on", O.executives[i].task)));
      t += 250 + execs.length * 220 + 500;
      at(t, () => { say("orchestrator", `Routing ${depts.length} workstreams`); links.slice(execs.length).forEach((p) => p.classList.add("hot")); });
      depts.forEach((el, i) => {
        at(t + 300 + i * 260, () => set(el, "is-on", "Working…"));
        at(t + 1500 + i * 330, () => { set(el, "is-done", O.departments[i].task); say(O.departments[i].name.toLowerCase(), O.departments[i].task, true); });
      });
      t += 1500 + depts.length * 330 + 300;
      at(t, () => {
        execs.forEach((el) => set(el, "is-done", $(".oc__task", el).textContent));
        links.forEach((p) => p.classList.remove("hot"));
        set(ceo, "is-done", "Launch underway");
        say("ai-ceo", "Week 1 plan approved · reporting to founder", true);
      });
    };

    runBtn.addEventListener("click", run);
    onceVisible($("#org"), run, 0.35);
  }

  /* ----------------------------------------------------------- pricing */
  function renderPricing() {
    const signup = D.links.signup;
    $("#pricing-grid").innerHTML = D.pricing.map((p) => `
      <article class="card plan reveal ${p.recommended ? "plan--rec" : ""}">
        ${p.recommended ? '<span class="plan__badge">Recommended</span>' : ""}
        <h3 class="plan__name">${esc(p.name)}</h3>
        <div class="plan__price"><strong>${esc(p.price)}</strong>${p.period ? `<span>${esc(p.period)}</span>` : ""}</div>
        <p class="plan__blurb">${esc(p.blurb)}</p>
        <ul>${p.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
        <a class="btn ${p.recommended ? "btn--primary" : "btn--ghost"}" href="${esc(signup)}?plan=${encodeURIComponent(p.plan)}">${esc(p.cta || "Start Building")}</a>
      </article>`).join("");
  }

  /* -------------------------------------------------- visibility utils */
  function onceVisible(el, fn, threshold = 0.25) {
    if (!el) return;
    if (!("IntersectionObserver" in window)) { fn(); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { io.disconnect(); fn(); } });
    }, { threshold });
    io.observe(el);
  }

  function initReveals() {
    const els = $$(".reveal, .arch, .flow, .scale, .hero__visual");
    if (reduced || !("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("is-in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        // Stagger siblings that reveal together
        const sibs = el.parentElement ? $$(":scope > .reveal", el.parentElement) : [];
        const idx = Math.max(0, sibs.indexOf(el));
        el.style.transitionDelay = Math.min(idx, 5) * 70 + "ms";
        el.classList.add("is-in");
        setTimeout(() => { el.style.transitionDelay = ""; }, 1200);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach((el) => io.observe(el));
  }

  /* -------------------------------------------------------------- boot */
  function render() {
    applyLinks();
    renderHero();
    renderDashboard();
    renderJurisdictions();
    renderScale();
    renderMarketplace();
    renderOrg();
    renderPricing();
  }

  window.Realy = { render };
  render();
  initNav();
  initReveals();
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
