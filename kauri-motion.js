/* Movimiento de Casa Kauri (11 oct 2026), según la skill diseno-web. Lee el modo central de <head>:
   window.__motion = full | soft | off. Sin JS o con "off", todo queda visible y quieto. */
(function(){
  var M=window.__motion||"full",reduce=M==="off",soft=M==="soft",fine=window.matchMedia&&matchMedia("(pointer: fine)").matches;
  var $=function(s,c){return (c||document).querySelector(s);},$$=function(s,c){return [].slice.call((c||document).querySelectorAll(s));};
  var G=window.gsap,ST=window.ScrollTrigger;if(G&&ST)G.registerPlugin(ST);
  var anim=!reduce&&G&&ST;

  /* encabezado y WhatsApp: un solo listener de scroll, pasivo, con rAF (leer y luego escribir) */
  var header=$("#site-header"),wa=$(".wa-float"),tick=false;
  function onScroll(){if(tick)return;tick=true;requestAnimationFrame(function(){var y=scrollY;
    if(header){header.classList.toggle("solid",y>80);}
    if(wa)wa.classList.toggle("visible",y>420);tick=false;});}
  addEventListener("scroll",onScroll,{passive:true});onScroll();

  /* tarjetas que se voltean (funcionan sin animación) */
  $$(".flip").forEach(function(f){f.addEventListener("click",function(){f.setAttribute("aria-pressed",f.getAttribute("aria-pressed")==="true"?"false":"true");});});

  /* maqueta: botones de cada parte + carga diferida de three.js */
  /* los textos de cada parte vienen de la página (<script type="application/json" id="c3-data">) y el modelo de data-model */
  var info=[];try{info=JSON.parse(($("#c3-data")||{}).textContent||"[]");}catch(e){}
  var spots=$$(".c3-spots button"),ib=$(".c3-info b"),ip=$(".c3-info p");
  function pick(i){spots.forEach(function(b,k){b.setAttribute("aria-pressed",k===i?"true":"false");});
    if(ib&&info[i]){ib.textContent=info[i][0];ip.textContent=info[i][1];}
    if(window.__casa3d)window.__casa3d.face(i);
    if(anim)G.fromTo([ib,ip],{y:10,opacity:0},{y:0,opacity:1,duration:.45,ease:"power3.out",stagger:.05,overwrite:true});}
  spots.forEach(function(b,i){b.addEventListener("click",function(){pick(i);});});
  if(spots.length)pick(0);
  var stage=$("#casa3d-cv");
  function load3d(){if(load3d.done)return;load3d.done=true;
    function go(){var s=document.createElement("script");s.src=(stage.getAttribute("data-model")||"casa3d.js")+"?v=2";s.onload=function(){var cur=spots.findIndex(function(b){return b.getAttribute("aria-pressed")==="true";});if(window.__casa3d&&cur>0)window.__casa3d.face(cur);};document.body.appendChild(s);}
    if(window.THREE)go();else{var t=document.createElement("script");t.src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";t.onload=go;document.body.appendChild(t);}}
  if(stage){if("IntersectionObserver" in window){var o=new IntersectionObserver(function(es){if(es[0].isIntersecting){load3d();o.disconnect();}},{rootMargin:"700px 0px"});o.observe(stage);}else load3d();}

  if(anim){
    /* entrada del hero */
    G.from($$(".hero .place,.hero h1,.hero .sub,.hero .cta-row,.hero .qb"),{y:soft?0:26,opacity:0,duration:.95,ease:"power3.out",stagger:.09,delay:.1,clearProps:"opacity,transform"});

    /* frases de capítulo: palabra por palabra con el scroll */
    $$(".k-statement p").forEach(function(p){
      var out="";p.innerHTML.replace(/(<[^>]+>)|([^<\s]+)|(\s+)/g,function(m,tag,word){if(tag)out+=tag;else if(word)out+='<span class="sw">'+word+'</span>';else out+=" ";return m;});
      p.innerHTML=out;
      G.fromTo($$(".sw",p),soft?{opacity:.14}:{opacity:.14,rotateX:-70,y:"0.3em",transformPerspective:600,transformOrigin:"50% 100%"},
        {opacity:1,rotateX:0,y:0,ease:"none",stagger:.12,scrollTrigger:{trigger:p,start:"top 85%",end:"bottom 42%",scrub:.7}});
    });

    /* entradas de tarjetas (en 3D si el modo es completo) */
    var rise=$$(".card,.room-card,.review-card,.am-group,.flip,.step3,.dist-row .d,.c3-copy,.gallery-slide").filter(function(el){return el.getBoundingClientRect().top>innerHeight;});
    G.set(rise,soft?{opacity:0,y:16}:{opacity:0,y:56,rotateX:22,transformPerspective:900,transformOrigin:"50% 100%"});
    ST.batch(rise,{start:"top 92%",once:true,onEnter:function(b){G.to(b,{opacity:1,y:0,rotateX:0,duration:.95,ease:"power3.out",stagger:.08,overwrite:true,clearProps:"transform,opacity"});}});

    /* cifras que cuentan */
    $$(".facts-band .num").forEach(function(el){var txt=el.textContent.trim(),n=parseFloat(txt),dec=(txt.split(".")[1]||"").length;if(!isFinite(n))return;
      var o={v:0};ST.create({trigger:el,start:"top 92%",once:true,onEnter:function(){G.to(o,{v:n,duration:1.3,ease:"power2.out",onUpdate:function(){el.textContent=dec?o.v.toFixed(dec):Math.round(o.v);},onComplete:function(){el.textContent=txt;}});}});});

    /* fotos de "Reúnete": parallax suave (solo modo completo) */
    if(!soft)$$(".gather,.spaces .photo").forEach(function(el){G.fromTo(el,{backgroundPosition:"50% 35%"},{backgroundPosition:"50% 65%",ease:"none",scrollTrigger:{trigger:el,start:"top bottom",end:"bottom top",scrub:true}});});

    /* inclinación con el cursor (laptop, modo completo) */
    if(fine&&!soft)$$(".card,.flip,.room-card").forEach(function(c){
      c.addEventListener("pointermove",function(e){var b=c.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;c.style.transform="perspective(1000px) rotateX("+(-y*6)+"deg) rotateY("+(x*7)+"deg) translateY(-3px)";});
      c.addEventListener("pointerleave",function(){c.style.transform="";});});
    addEventListener("load",function(){ST.refresh();});
  }

  /* carrusel 3D de fotos y de "lo que conviene saber" en celular (deslizar con el dedo) */
  var mq=matchMedia("(max-width: 700px)");
  $$(".gallery-track,.flips").forEach(function(row){
    var items=$$(".gallery-slide,.flip",row),raf=0;
    function upd(){raf=0;if(!row.classList.contains("cf"))return;var r=row.getBoundingClientRect(),cx=r.left+r.width/2;
      items.forEach(function(it){var b=it.getBoundingClientRect(),o=((b.left+b.width/2)-cx)/r.width;o=Math.max(-1.2,Math.min(1.2,o));
        it.style.setProperty("--ry",(-o*30)+"deg");it.style.setProperty("--sc",(1-Math.abs(o)*.12).toFixed(3));it.style.setProperty("--op",(1-Math.abs(o)*.4).toFixed(3));});}
    function setMode(){var on=mq.matches&&!reduce;row.classList.toggle("cf",on);if(on&&G){G.killTweensOf(items);G.set(items,{clearProps:"transform,opacity"});}upd();}
    row.addEventListener("scroll",function(){if(!raf)raf=requestAnimationFrame(upd);},{passive:true});
    if(mq.addEventListener)mq.addEventListener("change",setMode);setMode();
  });
})();

/* botón de animaciones (solo con "Reducir movimiento") y diagnóstico #diag */
(function(){
  var m=window.__motion||"full",os=!!window.__osReduce,pref=null;try{pref=localStorage.getItem("anim");}catch(e){}
  if(os||pref){var b=document.createElement("button");b.type="button";b.className="motion-toggle";
    b.textContent=m==="full"?"Reducir animaciones":"✨ Activar todas las animaciones";
    b.addEventListener("click",function(){try{if(m==="full"){if(os)localStorage.removeItem("anim");else localStorage.setItem("anim","off");}else localStorage.setItem("anim","full");}catch(e){}location.reload();});
    document.body.appendChild(b);}
  function diag(){if(!/diag/.test(location.hash)||document.querySelector(".diag"))return;
    var gl=false;try{var c=document.createElement("canvas");gl=!!(c.getContext("webgl")||c.getContext("experimental-webgl"));}catch(e){}
    var box=document.createElement("div");box.className="diag";document.body.appendChild(box);var fps=0,n=0,t0=performance.now();
    function show(){box.innerHTML='<button type="button">Cerrar</button><b>Diagnóstico</b>\n'+"Reducir movimiento: "+(os?"SÍ":"no")+"\nModo: "+m+"\nWebGL: "+(gl?"sí":"NO")+"\nMaqueta 3D activa: "+(document.documentElement.classList.contains("c3-live")?"sí":"no")+"\nGSAP: "+(window.gsap?"sí":"NO")+" · Three: "+(window.THREE?"sí":"(se carga al llegar a la maqueta)")+"\nPantalla: "+innerWidth+"×"+innerHeight+" · densidad "+(window.devicePixelRatio||1)+"\nCuadros por segundo: "+(fps||"midiendo…")+"\nNavegador: "+navigator.userAgent+"\nErrores: "+((window.__errs&&window.__errs.length)?window.__errs.join(" | "):"ninguno");box.querySelector("button").onclick=function(){box.remove();};}
    show();(function f(now){n++;if(now-t0>=2000){fps=Math.round(n*1000/(now-t0));show();return;}requestAnimationFrame(f);})(t0);}
  diag();addEventListener("hashchange",diag);
})();
