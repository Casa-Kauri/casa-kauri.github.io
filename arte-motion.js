/* Movimiento de arte.html (27 oct 2026), según la skill diseno-web.
   Lee el modo central del <head>: window.__motion = full | soft | off.
   full: apertura, máscaras, parallax, Lenis. soft: lo mismo pero solo con opacidad, sin
   parallax ni scroll suave. off o sin GSAP: todo visible y quieto.
   Solo se animan transform y opacity. */
(function(){
  var M = window.__motion || "full", off = M === "off", soft = M === "soft";
  var fine = window.matchMedia && matchMedia("(pointer: fine)").matches;
  var $ = function(s, c){ return (c || document).querySelector(s); };
  var $$ = function(s, c){ return [].slice.call((c || document).querySelectorAll(s)); };
  var G = window.gsap, ST = window.ScrollTrigger;
  if (G && ST) G.registerPlugin(ST);
  var anim = !off && G && ST;
  var root = document.documentElement;
  var movil = matchMedia("(max-width: 700px)");

  /* ---------- aros de cuentas (apertura y halo del hero) ---------- */
  var COL = ["#D6336C", "#F59F00", "#FFFFFF", "#1C7ED6", "#15AABF", "#2B8A3E"];
  function aro(n, r, rb, cls){
    var out = [];
    for (var i = 0; i < n; i++){
      var a = i / n * Math.PI * 2 - Math.PI / 2;
      out.push('<circle class="' + cls + '" cx="' + (100 + Math.cos(a) * r).toFixed(2) + '" cy="' + (100 + Math.sin(a) * r).toFixed(2) + '" r="' + rb + '" fill="' + COL[i % COL.length] + '"/>');
    }
    return out.join("");
  }
  var ring = $(".io-ring");
  if (ring) ring.innerHTML = '<svg viewBox="0 0 200 200">' + aro(36, 86, 6.2, "b1") + aro(24, 62, 5.2, "b2") + aro(12, 38, 4.6, "b3") + '<circle cx="100" cy="100" r="9" fill="#F59F00"/></svg>';
  var halo = $(".hero-art .halo");
  if (halo) halo.innerHTML = '<svg viewBox="0 0 200 200"><g class="giro">' + aro(60, 96, 2.3, "h") + aro(44, 90, 1.6, "h") + '</g></svg>';

  /* ---------- palabras con máscara (títulos) ---------- */
  function partir(el){
    if (!el || el.__partido) return [];
    el.__partido = true;
    var out = "";
    el.innerHTML.replace(/(<[^>]+>)|([^<\s]+)|(\s+)/g, function(m, tag, word){
      if (tag) out += tag; else if (word) out += '<span class="w"><span>' + word + "</span></span>"; else out += " ";
      return m;
    });
    el.innerHTML = out;
    return $$(".w>span", el);
  }

  /* ---------- encabezado, WhatsApp y barra de progreso: un solo listener ---------- */
  var header = $("#site-header"), wa = $(".wa-float"), bar = $(".progreso i"), tick = false, alto = 1;
  function medir(){ alto = Math.max(1, root.scrollHeight - innerHeight); }
  medir(); addEventListener("resize", medir); addEventListener("load", medir);
  function onScroll(){
    if (tick) return; tick = true;
    requestAnimationFrame(function(){
      var y = scrollY;
      if (header) header.classList.toggle("solid", y > 60);
      if (wa) wa.classList.toggle("visible", y > innerHeight * .8);
      if (bar) bar.style.transform = "scaleX(" + Math.min(1, y / alto).toFixed(4) + ")";
      tick = false;
    });
  }
  addEventListener("scroll", onScroll, {passive:true}); onScroll();

  /* ---------- tarjetas que se voltean (funcionan sin animación) ---------- */
  $$(".flip").forEach(function(f){ f.addEventListener("click", function(){ f.setAttribute("aria-pressed", f.getAttribute("aria-pressed") === "true" ? "false" : "true"); }); });

  /* ---------- carrusel 3D con el dedo en celular ---------- */
  $$(".gallery-track,.flips").forEach(function(row){
    var items = $$(".gallery-slide,.flip", row), raf = 0;
    function upd(){ raf = 0; if (!row.classList.contains("cf")) return; var r = row.getBoundingClientRect(), cx = r.left + r.width / 2;
      items.forEach(function(it){ var b = it.getBoundingClientRect(), o = ((b.left + b.width / 2) - cx) / r.width; o = Math.max(-1.2, Math.min(1.2, o));
        it.style.setProperty("--ry", (-o * 30) + "deg"); it.style.setProperty("--sc", (1 - Math.abs(o) * .12).toFixed(3)); it.style.setProperty("--op", (1 - Math.abs(o) * .4).toFixed(3)); }); }
    function modo(){ var on = movil.matches && !off; row.classList.toggle("cf", on); upd(); }
    row.addEventListener("scroll", function(){ if (!raf) raf = requestAnimationFrame(upd); }, {passive:true});
    if (movil.addEventListener) movil.addEventListener("change", modo); modo();
  });

  if (!anim){ root.classList.remove("intro"); return; }

  /* ---------- scroll suave (solo completo y equipo capaz) ---------- */
  var lenis = null;
  if (!soft && !window.__lowfx && window.Lenis){
    lenis = new Lenis({lerp:.14});
    lenis.on("scroll", ST.update);
    G.ticker.add(function(t){ lenis.raf(t * 1000); });
    G.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(function(a){ a.addEventListener("click", function(e){ var t = $(a.getAttribute("href")); if (!t) return; e.preventDefault(); lenis.scrollTo(t, {offset:-70}); }); });
  }

  var E = "power3.out", D = soft ? 0 : 1;
  /* desde dónde entra cada cosa: en soft todo es solo opacidad */
  function de(o){ if (!soft) return o; var r = {opacity:o.opacity === undefined ? 0 : o.opacity}; return r; }

  /* ---------- 1. apertura ---------- */
  var heroH1 = partir($(".hero h1"));
  var heroTl = G.timeline({paused:true, defaults:{ease:E}});
  heroTl
    .from(".hero .place", de({opacity:0, y:14, letterSpacing:".5em"}), 0)
    .from(heroH1, soft ? {opacity:0, stagger:.05, duration:.6} : {yPercent:115, rotate:4, stagger:.07, duration:1}, .05)
    .from(".hero .sub", de({opacity:0, y:22}), .45)
    .from(".hero .cta-row>*", de({opacity:0, y:18, scale:.96}), .55)
    .from(".hero-art img", soft ? {opacity:0, duration:.8} : {opacity:0, scale:1.14, rotate:-6, y:30, duration:1.4, ease:"expo.out"}, 0)
    .from(".hero-art .halo .h", soft ? {opacity:0, duration:.6} : {opacity:0, scale:0, transformOrigin:"50% 50%", stagger:{each:.008, from:"start"}, duration:.5, ease:"back.out(3)"}, .2);

  var intro = root.classList.contains("intro") ? $(".intro-ov") : null;
  if (intro){
    try { sessionStorage.setItem("arteVisto", "1"); } catch(e) {}
    var it = G.timeline({defaults:{ease:E}});
    var heroYa = false;
    function abre(){ if (heroYa) return; heroYa = true; heroTl.play(0); }
    function cierra(){ root.classList.remove("intro"); if (intro.parentNode) intro.remove(); ST.refresh(); }
    it.from(".io-ring .b3,.io-ring .b2,.io-ring .b1", {scale:0, opacity:0, svgOrigin:"100 100", stagger:.005, duration:.3, ease:"back.out(2.5)"})
      .from(".io-t", {opacity:0, y:10, duration:.4}, "-=.3")
      .to(".io-ring svg", soft ? {opacity:0, duration:.3} : {rotate:90, scale:.6, opacity:0, duration:.4, ease:"power2.in"}, "+=.05")
      .to(".io-t", {opacity:0, duration:.25}, "<")
      .to(intro, soft ? {opacity:0, duration:.4} : {yPercent:-100, duration:.7, ease:"expo.inOut"}, "-=.1")
      .add(abre, "-=.5")
      .add(cierra);
    /* seguro: en un equipo saturado la apertura nunca debe tapar la portada más de 2.6 s */
    setTimeout(function(){ if (!heroYa){ it.kill(); cierra(); abre(); } }, 2600);
  } else {
    root.classList.remove("intro");
    heroTl.play(0);
  }

  /* el hero se aleja al bajar (solo completo) */
  if (!soft){
    /* el alejamiento va en el contenedor: la foto ya tiene su propia entrada y el cursor */
    G.to(".hero-art", {y:90, scale:.9, ease:"none", scrollTrigger:{trigger:".hero", start:"top top", end:"bottom top", scrub:.6}});
    G.to(".hero-art .halo", {rotate:40, scale:1.15, opacity:.4, ease:"none", scrollTrigger:{trigger:".hero", start:"top top", end:"bottom top", scrub:.6}});
    G.to(".hero>div:first-child", {y:-50, opacity:.25, ease:"none", scrollTrigger:{trigger:".hero", start:"30% top", end:"bottom top", scrub:.6}});
    if (fine){
      var art = $(".hero-art"), img = $(".hero-art img"), hl = $(".hero-art .halo");
      var qx = G.quickTo(img, "x", {duration:.8, ease:"power3"}), qy = G.quickTo(img, "rotationY", {duration:.8, ease:"power3"});
      var hx = G.quickTo(hl, "x", {duration:1, ease:"power3"}), hy = G.quickTo(hl, "y", {duration:1, ease:"power3"});
      $(".hero").addEventListener("pointermove", function(e){
        var b = art.getBoundingClientRect(), x = (e.clientX - (b.left + b.width / 2)) / innerWidth, y = (e.clientY - (b.top + b.height / 2)) / innerHeight;
        qx(x * 22); qy(x * 14); hx(-x * 30); hy(-y * 24);
      });
    }
  }

  /* ---------- 2. frases de capítulo: palabra por palabra con el scroll ---------- */
  $$(".k-statement p").forEach(function(p){
    var out = "";
    p.innerHTML.replace(/(<[^>]+>)|([^<\s]+)|(\s+)/g, function(m, tag, word){ if (tag) out += tag; else if (word) out += '<span class="sw">' + word + "</span>"; else out += " "; return m; });
    p.innerHTML = out;
    G.fromTo($$(".sw", p), soft ? {opacity:.14} : {opacity:.14, rotateX:-70, y:"0.3em", transformPerspective:600, transformOrigin:"50% 100%"},
      {opacity:1, rotateX:0, y:0, ease:"none", stagger:.12, scrollTrigger:{trigger:p, start:"top 85%", end:"bottom 42%", scrub:.7}});
  });

  /* ---------- 3. entrada de cada sección ---------- */
  function entra(trigger, build, start){
    var tl = G.timeline({paused:true, defaults:{ease:E, duration:.9}});
    build(tl);
    ST.create({trigger:trigger, start:start || "top 78%", once:true, onEnter:function(){ tl.play(); }});
  }
  function titulos(sec, tl, at){
    var where = $(".where,.pr-k", sec), h2 = $("h2", sec), lead = $$(".lead,.pieza-head p", sec);
    if (where) tl.from(where, de({opacity:0, x:-24, letterSpacing:".4em"}), at || 0);
    if (h2) tl.from(partir(h2), soft ? {opacity:0, stagger:.04, duration:.5} : {yPercent:115, stagger:.05, duration:.85}, (at || 0) + .08);
    if (lead.length) tl.from(lead, de({opacity:0, y:24}), (at || 0) + .3);
  }

  /* el regalo */
  var saber = $("#saber");
  if (saber) entra(saber, function(tl){
    tl.from(".saber .divider", soft ? {opacity:0} : {scaleX:0, transformOrigin:"50% 50%", duration:1.1, ease:"expo.out"}, 0);
    titulos(saber, tl, .15);
    var flips = $(".saber .flips");
    if (movil.matches) tl.from(flips, de({opacity:0, x:80}), .5);
    else tl.from(".saber .flip", soft ? {opacity:0, stagger:.12} : {opacity:0, y:70, rotateX:30, rotateY:-8, transformPerspective:1000, transformOrigin:"50% 100%", stagger:.13, duration:1.05, clearProps:"transform"}, .5);
  });

  /* la escena de la chaquira: el escenario crece al llegar */
  var proc = $("#proceso");
  if (proc) entra(proc, function(tl){
    tl.from(".pr-stage", soft ? {opacity:0} : {opacity:0, scale:.8, rotate:-20, duration:1.2, ease:"expo.out"}, 0)
      .from(".pr-steps", de({opacity:0, x:40}), .25);
  }, "top 70%");

  /* la prueba */
  var prueba = $(".prueba");
  if (prueba) entra(prueba, function(tl){
    tl.from(".prueba img", soft ? {opacity:0} : {opacity:0, x:-80, rotate:-12, scale:.9, duration:1.2, ease:"expo.out"}, 0);
    titulos(prueba, tl, .2);
    tl.from(".prueba p", de({opacity:0, y:20}), .45)
      .from(".sellos span", soft ? {opacity:0, stagger:.1} : {opacity:0, scale:.6, y:10, stagger:.1, ease:"back.out(2.5)", duration:.6}, .7);
  });

  /* las tres piezas */
  $$(".pieza").forEach(function(sec){
    entra(sec, function(tl){
      titulos(sec, tl, 0);
      var bands = $$(".pulsera-art .band", sec);
      if (bands.length){
        tl.from(".pulsera-art", de({opacity:0, y:40}), .2);
        bands.forEach(function(b, i){ tl.from(b, soft ? {opacity:0} : {opacity:0, xPercent:i % 2 ? 60 : -60, duration:1.2, ease:"expo.out"}, .35 + i * .12); });
      }
      var track = $(".gallery-track", sec);
      if (track){
        if (movil.matches) tl.from(track, de({opacity:0, x:90}), .3);
        else tl.from($$(".gallery-slide", track), soft ? {opacity:0, stagger:.08} : {opacity:0, x:90, rotateY:-14, transformPerspective:1200, stagger:.09, duration:1, clearProps:"transform"}, .3);
      }
      var cards = $$(".menu3 .card", sec);
      if (cards.length){
        tl.from(cards, soft ? {opacity:0, stagger:.1} : {opacity:0, y:50, rotateX:24, transformPerspective:900, transformOrigin:"50% 100%", stagger:.12, clearProps:"transform"}, .55)
          .from($$(".chip", sec), soft ? {opacity:0, stagger:.03} : {opacity:0, scale:.5, stagger:.035, duration:.45, ease:"back.out(2.5)"}, .9);
      }
      tl.from($$(".regalo,.nota,.precio:not([hidden])", sec), de({opacity:0, y:18}), .6)
        .from($$(".pieza-cta .btn", sec), soft ? {opacity:0} : {opacity:0, y:16, scale:.94, duration:.6, ease:"back.out(2)"}, .7);
    });
    /* parallax suave dentro de cada foto (solo completo, laptop) */
    if (!soft && !movil.matches) $$(".gallery-slide img", sec).forEach(function(img){
      G.fromTo(img, {yPercent:-5, scale:1.12}, {yPercent:5, scale:1.12, ease:"none", scrollTrigger:{trigger:img, start:"top bottom", end:"bottom top", scrub:true}});
    });
  });

  /* las preguntas */
  var faq = $(".faq");
  if (faq) entra(faq, function(tl){
    titulos(faq, tl, 0);
    tl.from(".faq details", soft ? {opacity:0, stagger:.06} : {opacity:0, x:-30, stagger:.07, duration:.6}, .2);
  });

  /* el plan */
  var plan = $(".plan");
  if (plan) entra(plan, function(tl){
    titulos(plan, tl, 0);
    tl.from(".pasos .card", soft ? {opacity:0, stagger:.12} : {opacity:0, y:60, scale:.94, stagger:.14, clearProps:"transform"}, .2)
      .from(".pasos .n", soft ? {opacity:0} : {scale:0, rotate:-30, stagger:.14, duration:.6, ease:"back.out(3)"}, .45);
  });

  /* el cierre */
  var cierre = $(".cierre");
  if (cierre) entra(cierre, function(tl){
    titulos(cierre, tl, 0);
    tl.from(".cierre p", de({opacity:0, y:20}), .35)
      .from(".cierre .btn", soft ? {opacity:0, stagger:.1} : {opacity:0, y:20, scale:.9, stagger:.1, ease:"back.out(2)", duration:.7}, .5)
      .from(".cierre .fondo", {opacity:0, duration:1.2}, .2);
  });

  /* ---------- 4. botones magnéticos e inclinación (laptop, modo completo) ---------- */
  if (fine && !soft){
    $$(".btn-main").forEach(function(b){
      var qx = G.quickTo(b, "x", {duration:.5, ease:"power3"}), qy = G.quickTo(b, "y", {duration:.5, ease:"power3"});
      b.addEventListener("pointermove", function(e){ var r = b.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * .25); qy((e.clientY - r.top - r.height / 2) * .35); });
      b.addEventListener("pointerleave", function(){ qx(0); qy(0); });
    });
    $$(".gallery-slide,.pasos .card,.menu3 .card").forEach(function(c){
      c.addEventListener("pointermove", function(e){ var b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
        G.to(c, {rotateX:-y * 6, rotateY:x * 7, y:-3, transformPerspective:1000, duration:.4, overwrite:"auto"}); });
      c.addEventListener("pointerleave", function(){ G.to(c, {rotateX:0, rotateY:0, y:0, duration:.6, overwrite:"auto"}); });
    });
  }

  addEventListener("load", function(){ medir(); ST.refresh(); });
})();

/* botón de animaciones (solo con "Reducir movimiento" o si el usuario eligió) y diagnóstico #diag */
(function(){
  var m = window.__motion || "full", os = !!window.__osReduce, pref = null;
  try { pref = localStorage.getItem("anim"); } catch(e) {}
  if (os || pref){
    var b = document.createElement("button"); b.type = "button"; b.className = "motion-toggle";
    b.textContent = m === "full" ? "Reducir animaciones" : "✨ Activar todas las animaciones";
    b.addEventListener("click", function(){ try { if (m === "full"){ if (os) localStorage.removeItem("anim"); else localStorage.setItem("anim", "off"); } else localStorage.setItem("anim", "full"); } catch(e) {} location.reload(); });
    document.body.appendChild(b);
  }
  function diag(){
    if (!/diag/.test(location.hash) || document.querySelector(".diag")) return;
    var box = document.createElement("div"); box.className = "diag"; document.body.appendChild(box);
    var fps = 0, n = 0, t0 = performance.now();
    function show(){ box.innerHTML = '<button type="button">Cerrar</button><b>Diagnóstico</b>\n' + "Reducir movimiento: " + (os ? "SÍ" : "no") + "\nModo: " + m + "\nGSAP: " + (window.gsap ? "sí" : "NO") + " · Lenis: " + (window.Lenis ? "sí" : "NO") + "\nPantalla: " + innerWidth + "×" + innerHeight + " · densidad " + (window.devicePixelRatio || 1) + "\nCuadros por segundo: " + (fps || "midiendo…") + "\nNavegador: " + navigator.userAgent + "\nErrores: " + ((window.__errs && window.__errs.length) ? window.__errs.join(" | ") : "ninguno"); box.querySelector("button").onclick = function(){ box.remove(); }; }
    show(); (function f(now){ n++; if (now - t0 >= 2000){ fps = Math.round(n * 1000 / (now - t0)); show(); return; } requestAnimationFrame(f); })(t0);
  }
  diag(); addEventListener("hashchange", diag);
})();
