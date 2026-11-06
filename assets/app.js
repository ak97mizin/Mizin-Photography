/* MIZIN PHOTOGRAPHY — single-page app: home (hero + series), series page, lightbox, support. */
(function () {
  "use strict";
  var CFG = window.SITE_CONFIG || {};
  var SERIES = window.SERIES || [];
  var BASE = window.PHOTO_BASE || "";

  /* ---------------- i18n ---------------- */
  var T = {
    ru: {
      "nav.series": "Серии",
      "home.series": "Серии",
      "home.scroll": "Листайте вниз",
      "hero.from": "Фото из серии",
      "support.short": "Поддержать",
      "support.eyebrow": "Поддержать автора",
      "support.title": "Буду вам очень благодарен, если поддержите моё творчество!",
      "support.sub": "Все фотографии можно смотреть и скачивать бесплатно. Если они вам понравились, можно поддержать финансово, а также отметить в инстаграме.",
      "support.or": "или можете скопировать номер карты",
      "support.copy": "Копировать",
      "support.copied": "Номер карты скопирован",
      "support.soon": "Здесь будет ваша ссылка на оплату (config.js)",
      "series.back": "Все серии",
      "series.zip": "Скачать все фото · ZIP",
      "series.zipping": "Готовим архив…",
      "series.started": "Архив скачивается. Если фото пригодились, поддержите автора.",
      "series.zipfail": "Не получилось скачать архив. Попробуйте ещё раз.",
      "series.next": "Другие серии",
      "series.support": "Поддержать автора",
      "photos": "фото",
      "mb": "МБ",
      "foot.rights": "Все права защищены",
      "lb.close": "Закрыть", "lb.prev": "Предыдущее фото", "lb.next": "Следующее фото"
    },
    en: {
      "nav.series": "Series",
      "home.series": "Series",
      "home.scroll": "Scroll down",
      "hero.from": "From the series",
      "support.short": "Support",
      "support.eyebrow": "Support the author",
      "support.title": "I'd be very grateful if you supported my work!",
      "support.sub": "All photos are free to view and download. If you liked them, you can support me financially or tag me on Instagram.",
      "support.or": "or copy the card number",
      "support.copy": "Copy",
      "support.copied": "Card number copied",
      "support.soon": "Your payment link goes here (config.js)",
      "series.back": "All series",
      "series.zip": "Download all · ZIP",
      "series.zipping": "Preparing archive…",
      "series.started": "Your download has started. If the photos were useful, consider supporting the author.",
      "series.zipfail": "The archive could not be downloaded. Please try again.",
      "series.next": "More series",
      "series.support": "Support the author",
      "photos": "photos",
      "mb": "MB",
      "foot.rights": "All rights reserved",
      "lb.close": "Close", "lb.prev": "Previous photo", "lb.next": "Next photo"
    },
    hy: {
      "nav.series": "Շարքեր",
      "home.series": "Շարքեր",
      "home.scroll": "Թերթեք ներքև",
      "hero.from": "Լուսանկարը շարքից",
      "support.short": "Աջակցել",
      "support.eyebrow": "Աջակցել հեղինակին",
      "support.title": "Շատ շնորհակալ կլինեմ, եթե աջակցեք իմ ստեղծագործությանը։",
      "support.sub": "Բոլոր լուսանկարները կարելի է անվճար դիտել և ներբեռնել։ Եթե դրանք ձեզ դուր եկան, կարող եք աջակցել ֆինանսապես, ինչպես նաև նշել ինձ Instagram-ում։",
      "support.or": "կամ կարող եք պատճենել քարտի համարը",
      "support.copy": "Պատճենել",
      "support.copied": "Քարտի համարը պատճենված է",
      "support.soon": "Այստեղ կլինի վճարման հղումը (config.js)",
      "series.back": "Բոլոր շարքերը",
      "series.zip": "Ներբեռնել բոլորը · ZIP",
      "series.zipping": "Պատրաստում ենք արխիվը…",
      "series.started": "Արխիվը ներբեռնվում է։ Եթե լուսանկարները օգտակար եղան, աջակցեք հեղինակին։",
      "series.zipfail": "Չհաջողվեց ներբեռնել արխիվը։ Փորձեք կրկին։",
      "series.next": "Այլ շարքեր",
      "series.support": "Աջակցել հեղինակին",
      "photos": "լուսանկար",
      "mb": "ՄԲ",
      "foot.rights": "Բոլոր իրավունքները պաշտպանված են",
      "lb.close": "Փակել", "lb.prev": "Նախորդ լուսանկարը", "lb.next": "Հաջորդ լուսանկարը"
    }
  };
  var LANGS = ["ru", "en", "hy"];

  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }
  function detectLang() {
    var saved = store("mizin.lang");
    if (LANGS.indexOf(saved) >= 0) return saved;
    var nav = (navigator.languages || [navigator.language || ""]).map(function (l) { return String(l).slice(0, 2).toLowerCase(); });
    for (var i = 0; i < nav.length; i++) if (LANGS.indexOf(nav[i]) >= 0) return nav[i];
    return LANGS.indexOf(CFG.defaultLang) >= 0 ? CFG.defaultLang : "en";
  }
  var lang = detectLang();
  function t(k) { return (T[lang] && T[lang][k]) || T.en[k] || k; }
  function L(obj) { if (!obj) return ""; if (typeof obj === "string") return obj; return obj[lang] || obj.en || obj.ru || ""; }

  /* ---------------- helpers ---------------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function src(s, p, size) { return BASE + "photos/" + s.slug + "/" + size + "/" + p.id + ".jpg"; }
  function srcset(s, p) { return src(s, p, "sm") + " 960w, " + src(s, p, "lg") + " 2560w"; }
  function photo(s, id) { for (var i = 0; i < s.photos.length; i++) if (s.photos[i].id === id) return s.photos[i]; return s.photos[0]; }
  function bySlug(slug) { for (var i = 0; i < SERIES.length; i++) if (SERIES[i].slug === slug) return SERIES[i]; return null; }
  function metaLine(s) {
    return [L(s.place), s.date, s.photos.length + " " + t("photos")].filter(Boolean).join(" · ");
  }
  function onLoaded(root) {
    (root || document).querySelectorAll("img.lazy").forEach(function (img) {
      if (img.complete && img.naturalWidth) img.classList.add("loaded");
      else img.addEventListener("load", function () { img.classList.add("loaded"); }, { once: true });
    });
  }
  var ARROW = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>';

  function card(s, sizes) {
    var p = photo(s, s.cover);
    return '<a class="s-card zoom" href="#' + s.slug + '" style="--c:' + p.color + '">' +
      '<img class="lazy" loading="lazy" decoding="async" src="' + src(s, p, "sm") + '" srcset="' + srcset(s, p) + '" sizes="' + sizes + '" alt="' + esc(L(s.title)) + '">' +
      '<div class="s-cap"><h3>' + esc(L(s.title)) + '</h3><p>' + esc(metaLine(s)) + '</p></div></a>';
  }

  /* ---------------- views ---------------- */
  var view = $("#view");
  var current = { slug: null };
  var heroPick = null;

  function pickHero() {
    if (heroPick) return heroPick;
    var pool = [];
    SERIES.forEach(function (s) {
      var ids = s.hero && s.hero.length ? s.hero : [s.cover];
      ids.forEach(function (id) { pool.push({ s: s, p: photo(s, id) }); });
    });
    if (!pool.length) return null;
    var portrait = window.innerHeight > window.innerWidth * 1.15;
    // on tall screens prefer vertical frames when there are any
    var fitting = pool.filter(function (x) { return portrait ? x.p.h > x.p.w : x.p.w >= x.p.h; });
    if (fitting.length >= 2) pool = fitting;
    var last = store("mizin.hero");
    var choices = pool.filter(function (x) { return x.s.slug + "/" + x.p.id !== last; });
    if (!choices.length) choices = pool;
    heroPick = choices[Math.floor(Math.random() * choices.length)];
    store("mizin.hero", heroPick.s.slug + "/" + heroPick.p.id);
    return heroPick;
  }

  function renderHome() {
    document.body.classList.add("is-home");
    var h = pickHero();
    var hero = h ? (
      '<section class="hero" style="--hero-bg:' + h.p.color + '">' +
        '<img id="hero-img" src="' + src(h.s, h.p, "lg") + '" alt="' + esc(L(h.s.title)) + '" fetchpriority="high">' +
        '<div class="hero-content">' +
          '<h1 class="wordmark" aria-label="MIZIN PHOTOGRAPHY"><b>MIZIN</b><span aria-hidden="true">' + "PHOTOGRAPHY".split("").map(function (c) { return "<i>" + c + "</i>"; }).join("") + '</span></h1>' +
          '<div class="hero-caption"><small>' + t("hero.from") + '</small><a href="#' + h.s.slug + '">' + esc(L(h.s.title)) + ' →</a></div>' +
        '</div>' +
        '<a class="scroll-cue" href="#" data-scroll="series" aria-label="' + t("home.scroll") + '"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M5 9l7 7 7-7" stroke="currentColor" stroke-width="1.4" fill="none"/></svg></a>' +
      '</section>') : "";
    var cards = SERIES.map(function (s, i) {
      return card(s, i === 0 ? "100vw" : "(max-width: 760px) 100vw, 50vw");
    }).join("");
    view.innerHTML = hero +
      '<div class="section-head wrap" id="series"><h2>' + t("home.series") + '</h2><span class="count">' + SERIES.length + '</span></div>' +
      '<div class="series-grid">' + cards + '</div>';
    var img = $("#hero-img");
    if (img) {
      if (img.complete && img.naturalWidth) img.classList.add("loaded");
      else img.addEventListener("load", function () { img.classList.add("loaded"); }, { once: true });
    }
    onLoaded(view);
    document.title = "MIZIN PHOTOGRAPHY";
    onScroll();
    fitWordmark();
  }

  function renderSeries(s) {
    document.body.classList.remove("is-home", "scrolled");
    var zipLabel = t("series.zip") + (s.zipSize ? " · " + Math.max(1, Math.round(s.zipSize / 1e6)) + " " + t("mb") : "");
    var items = s.photos.map(function (p, i) {
      var ar = (p.w / p.h).toFixed(4);
      return '<a class="ph zoom" href="#' + s.slug + '--' + (i + 1) + '" data-i="' + i + '" style="--ar:' + ar + ';--c:' + p.color + '">' +
        '<img class="lazy" loading="lazy" decoding="async" src="' + src(s, p, "sm") + '" srcset="' + srcset(s, p) + '" sizes="(max-width: 560px) 70vw, 40vw" alt="' + esc(L(s.title)) + ' — ' + (i + 1) + '"></a>';
    }).join("");
    var others = SERIES.filter(function (x) { return x !== s; });
    var idx = SERIES.indexOf(s);
    // next series first (wrapping), then one more
    var next = [];
    for (var k = 1; k <= Math.min(2, others.length); k++) next.push(SERIES[(idx + k) % SERIES.length]);
    view.innerHTML =
      '<section class="s-head wrap">' +
        '<a class="back" href="#"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M20 12H5M11 6l-6 6 6 6" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>' + t("series.back") + '</a>' +
        '<div class="s-title"><h1>' + esc(L(s.title)) + '</h1><p class="s-meta">' + esc(metaLine(s)) + '</p>' +
          (L(s.text) ? '<p class="s-lead">' + esc(L(s.text)) + '</p>' : '') + '</div>' +
        '<div class="s-actions">' +
          '<button type="button" class="btn btn-ghost" id="zip-btn"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" stroke="currentColor" stroke-width="1.6" fill="none"/></svg><span>' + zipLabel + '</span></button>' +
          '<a class="btn btn-accent" href="#support" data-scroll="support">' + t("series.support") + '</a>' +
        '</div>' +
      '</section>' +
      '<div class="gallery">' + items + '</div>' +
      (next.length ? '<div class="s-foot wrap"><p class="eyebrow label">' + t("series.next") + '</p>' + next.map(function (x) { return card(x, "(max-width: 760px) 100vw, 50vw"); }).join("") + '</div>' : '');
    onLoaded(view);
    $("#zip-btn").addEventListener("click", function () { downloadZip(s, this); });
    document.title = L(s.title) + " — MIZIN PHOTOGRAPHY";
  }


  /* PHOTOGRAPHY по ширине видимых букв MIZIN (без боковых отступов шрифта) */
  var measureCtx = document.createElement("canvas").getContext("2d");
  function ink(text, el) {
    var cs = getComputedStyle(el);
    measureCtx.font = cs.fontStyle + " " + cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily;
    var m = measureCtx.measureText(text);
    return { left: -m.actualBoundingBoxLeft, right: m.actualBoundingBoxRight, adv: m.width };
  }
  function fitWordmark() {
    var b = document.querySelector(".wordmark b"), sp = document.querySelector(".wordmark span");
    if (!b || !sp) return;
    var big = ink("MIZIN", b), p = ink("P", sp), y = ink("Y", sp);
    var bearP = p.left, bearY = y.adv - y.right;          // пустота слева у P и справа у Y
    sp.style.marginLeft = (big.left - bearP) + "px";
    sp.style.width = (big.right - big.left + bearP + bearY) + "px";
  }
  window.addEventListener("resize", fitWordmark);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitWordmark);

  /* ---------------- router ---------------- */
  // #            → home
  // #slug        → series
  // #slug--5     → series + lightbox on photo 5
  function parse() {
    var h = decodeURIComponent(location.hash.replace(/^#/, ""));
    var m = h.match(/^(.+?)--(\d+)$/);
    var slug = m ? m[1] : h;
    var s = bySlug(slug);
    if (!s) return { home: true, anchor: h };
    return { s: s, n: m ? Math.min(Math.max(+m[2], 1), s.photos.length) : 0 };
  }
  function route() {
    var r = parse();
    if (r.home) {
      if (r.anchor && document.getElementById(r.anchor) && current.slug !== null) { /* stay */ }
      closeLightbox(true);
      if (current.slug !== "") { current.slug = ""; renderHome(); window.scrollTo(0, 0); view.classList.remove("view-in"); void view.offsetWidth; view.classList.add("view-in"); }
      if (r.anchor && document.getElementById(r.anchor)) document.getElementById(r.anchor).scrollIntoView();
      return;
    }
    if (current.slug !== r.s.slug) {
      current.slug = r.s.slug; renderSeries(r.s);
      window.scrollTo(0, 0); view.classList.remove("view-in"); void view.offsetWidth; view.classList.add("view-in");
    }
    if (r.n) openLightbox(r.s, r.n - 1); else closeLightbox(true);
  }
  window.addEventListener("hashchange", route);

  // in-page anchors (#support, #series) scroll without changing the route
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-scroll]");
    if (!a) return;
    var id = a.getAttribute("data-scroll");
    var el = document.getElementById(id);
    if (!el) { // e.g. "Series" link from a series page → go home first
      e.preventDefault(); location.hash = ""; setTimeout(function () { var x = document.getElementById(id); if (x) x.scrollIntoView({ behavior: "smooth" }); }, 60); return;
    }
    e.preventDefault();
    closeLightbox();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* ---------------- header state ---------------- */
  function onScroll() {
    var hero = document.querySelector(".hero");
    var y = window.scrollY || 0;
    document.body.classList.toggle("scrolled", !hero || y > hero.offsetHeight * 0.55);
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------- lightbox ---------------- */
  var lb = $("#lightbox"), lbImg = $("#lb-img"), lbState = null;
  function openLightbox(s, i) {
    lbState = { s: s, i: i };
    lb.hidden = false; document.body.classList.add("lb-open");
    showLb();
  }
  function showLb() {
    var s = lbState.s, i = lbState.i, p = s.photos[i];
    lbImg.classList.add("fading");
    var next = new Image();
    next.onload = function () { if (lbState && lbState.i === i) { lbImg.src = next.src; lbImg.classList.remove("fading"); } };
    next.src = src(s, p, "lg");
    lbImg.alt = L(s.title) + " — " + (i + 1);
    $("#lb-count").textContent = (i + 1) + " / " + s.photos.length;
    $("#lb-title").textContent = L(s.title);
    [i + 1, i - 1].forEach(function (j) { if (s.photos[j]) { var im = new Image(); im.src = src(s, s.photos[j], "lg"); } });
  }
  function step(d) {
    if (!lbState) return;
    var n = lbState.s.photos.length;
    lbState.i = (lbState.i + d + n) % n;
    try { history.replaceState(null, "", "#" + lbState.s.slug + "--" + (lbState.i + 1)); } catch (e) {}
    showLb();
  }
  function closeLightbox(fromRoute) {
    if (lb.hidden) return;
    lb.hidden = true; document.body.classList.remove("lb-open");
    var s = lbState && lbState.s, i = lbState ? lbState.i : 0;
    lbState = null; lbImg.removeAttribute("src");
    if (!fromRoute && s) {
      try { history.replaceState(null, "", "#" + s.slug); } catch (e) { location.hash = s.slug; }
    }
    if (s) { var el = document.querySelector('.ph[data-i="' + i + '"]'); if (el) { var r = el.getBoundingClientRect(); if (r.top < 0 || r.bottom > innerHeight) el.scrollIntoView({ block: "center" }); } }
  }
  $("#lb-close").addEventListener("click", function () { closeLightbox(); });
  $("#lb-prev").addEventListener("click", function () { step(-1); });
  $("#lb-next").addEventListener("click", function () { step(1); });
  $("#lb-stage").addEventListener("click", function (e) {
    if (e.target === lbImg) { var r = lbImg.getBoundingClientRect(); step(e.clientX < r.left + r.width / 3 ? -1 : 1); }
    else closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
  });
  (function swipe() {
    var x0 = null, y0 = null;
    lb.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
      else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) closeLightbox();
      x0 = null;
    }, { passive: true });
  })();

  /* ---------------- zip download ---------------- */
  function triggerDownload(href, name) {
    var a = document.createElement("a");
    a.href = href; a.download = name; a.rel = "noopener";
    document.body.appendChild(a); a.click(); a.remove();
  }
  function loadScript(u) {
    return new Promise(function (res, rej) { var sc = document.createElement("script"); sc.src = u; sc.onload = res; sc.onerror = rej; document.head.appendChild(sc); });
  }
  function downloadZip(s, btn) {
    var name = "MIZIN_" + s.slug + ".zip";
    if (s.zip && /^https?:/.test(s.zip)) { // архив лежит на внешнем диске
      var ext = document.createElement("a"); ext.href = s.zip; ext.target = "_blank"; ext.rel = "noopener";
      document.body.appendChild(ext); ext.click(); ext.remove();
      toast(t("series.started"), true);
      return;
    }
    if (s.zip) {
      triggerDownload(BASE + s.zip, name);
      toast(t("series.started"), true);
      return;
    }
    // no prebuilt archive on the server → build it in the browser from the large versions
    var label = btn.querySelector("span"), old = label.textContent;
    btn.disabled = true; label.textContent = t("series.zipping");
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js").then(function () {
      var zip = new window.JSZip(), done = 0;
      return Promise.all(s.photos.map(function (p, i) {
        return fetch(src(s, p, "lg")).then(function (r) { if (!r.ok) throw 0; return r.blob(); }).then(function (b) {
          zip.file("MIZIN_" + s.slug + "_" + String(i + 1).padStart(2, "0") + "_" + p.id + ".jpg", b);
          done++; label.textContent = t("series.zipping") + " " + Math.round(done / s.photos.length * 100) + "%";
        });
      })).then(function () { return zip.generateAsync({ type: "blob", compression: "STORE" }); });
    }).then(function (blob) {
      var u = URL.createObjectURL(blob);
      triggerDownload(u, name);
      setTimeout(function () { URL.revokeObjectURL(u); }, 60000);
      toast(t("series.started"), true);
    }).catch(function () { toast(t("series.zipfail")); })
      .then(function () { btn.disabled = false; label.textContent = old; });
  }

  /* ---------------- toast ---------------- */
  var toastEl = $("#toast"), toastTimer;
  function toast(msg, withCta) {
    $("#toast-text").textContent = msg;
    $("#toast-cta").hidden = !withCta;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, withCta ? 12000 : 3500);
  }
  $("#toast-x").addEventListener("click", function () { toastEl.hidden = true; });
  $("#toast-cta").addEventListener("click", function () { toastEl.hidden = true; });

  /* ---------------- support block ---------------- */
  function renderSupport() {
    var links = (CFG.payLinks || []).filter(function (l) { return l.url || CFG.previewEmptyLinks; });
    $("#pay-links").innerHTML = links.map(function (l) {
      return l.url
        ? '<a class="btn btn-accent" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(L(l.label)) + '</a>'
        : '<button type="button" class="btn btn-accent" data-soon>' + esc(L(l.label)) + '</button>';
    }).join("");
    $("#pay-links").hidden = !links.length;
    var num = (CFG.card && CFG.card.number) || "";
    $("#card-block").hidden = !num;
    $("#card-num").textContent = num;
    $("#card-holder").textContent = (CFG.card && CFG.card.holder) || "";
    $("#card-holder").hidden = !(CFG.card && CFG.card.holder);
    $("#card-block .or").hidden = !links.length;

    var c = CFG.contacts || {}, f = [];
    var ig = $("#support-ig");
    if (ig) { ig.hidden = !c.instagram; if (c.instagram) { ig.href = c.instagram; $("#support-ig-name").textContent = "@" + c.instagram.replace(/\/+$/, "").split("/").pop(); } }
    if (c.instagram) f.push('<a class="foot-ig" href="' + esc(c.instagram) + '" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa-brands fa-instagram" aria-hidden="true"></i>@' + esc(c.instagram.replace(/\/+$/, "").split("/").pop()) + '</a>');
    if (c.telegram) f.push('<a href="' + esc(c.telegram) + '" target="_blank" rel="noopener">Telegram</a>');
    if (c.email) f.push('<a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a>');
    $("#foot-links").innerHTML = f.join("");
  }
  document.addEventListener("click", function (e) { if (e.target.closest("[data-soon]")) toast(t("support.soon")); });
  $("#copy-card").addEventListener("click", function () {
    var btn = this, raw = ((CFG.card && CFG.card.number) || "").replace(/\s+/g, "");
    function ok() { btn.classList.add("done"); toast(t("support.copied")); setTimeout(function () { btn.classList.remove("done"); }, 1800); }
    function fallback() {
      var r = document.createRange(); r.selectNodeContents($("#card-num"));
      var sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
      try { if (document.execCommand("copy")) return ok(); } catch (e) {}
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(raw).then(ok, fallback);
    else fallback();
  });

  /* ---------------- language ---------------- */
  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-lang]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang)); });
    $("#lb-close").setAttribute("aria-label", t("lb.close"));
    $("#lb-prev").setAttribute("aria-label", t("lb.prev"));
    $("#lb-next").setAttribute("aria-label", t("lb.next"));
    $("#copy-card").setAttribute("aria-label", t("support.copy"));
    renderSupport();
  }
  document.querySelectorAll("[data-lang]").forEach(function (b) {
    b.addEventListener("click", function () {
      lang = b.getAttribute("data-lang"); store("mizin.lang", lang);
      applyLang();
      var y = window.scrollY; var keep = current.slug; current.slug = null;
      if (keep) { current.slug = keep; renderSeries(bySlug(keep)); } else { current.slug = ""; renderHome(); }
      window.scrollTo(0, y);
      if (lbState) { $("#lb-title").textContent = L(lbState.s.title); }
    });
  });

  // series gallery click → open lightbox (keep normal link behaviour for new tab)
  view.addEventListener("click", function (e) {
    var a = e.target.closest(".ph");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    var s = bySlug(current.slug); if (!s) return;
    var i = +a.getAttribute("data-i");
    openLightbox(s, i);
    try { history.replaceState(null, "", "#" + s.slug + "--" + (i + 1)); } catch (err) {}
  });

  $("#year").textContent = new Date().getFullYear();
  applyLang();
  route();
})();
