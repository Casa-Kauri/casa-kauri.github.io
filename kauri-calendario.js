/* Calendario de disponibilidad, v4 (11 oct 2026): un solo estado alimenta tres piezas.
   1) La barra de búsqueda del inicio, estilo Airbnb (Llegada | Salida | Huéspedes | Buscar) con calendario desplegable.
   2) El calendario grande de la sección #disponibilidad.
   3) La franja "Próximo fin de semana libre".
   Datos: disponibilidad.json (un proceso de GitHub lo actualiza cada 3 h desde el iCal de Airbnb; solo fechas).
   Reglas: mínimo 2 noches; la salida puede caer en un día ocupado (es la mañana); sin sincronización no se marca nada
   como ocupado y se dice que la disponibilidad se confirma por WhatsApp.
   Configuración en .cal o .qb: data-prop (casa|depa), data-max, data-wa, data-nombre. */
(function(){
  var sec=document.querySelector(".cal"),qb=document.querySelector(".qb");if(!sec&&!qb)return;
  var cfg=sec||qb,prop=cfg.dataset.prop,max=+cfg.dataset.max||8,wa=cfg.dataset.wa,nombre=cfg.dataset.nombre||"Casa Kauri";
  var MIN=2;
  var MES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  var MESC=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  var DIA=["L","M","M","J","V","S","D"];
  var busy={},synced=false,today=new Date();today.setHours(0,0,0,0);
  var last=new Date(today);last.setMonth(last.getMonth()+14);
  var S={a:null,b:null,hov:null,guests:Math.min(4,max)};
  var mainView=new Date(today.getFullYear(),today.getMonth(),1),popView=new Date(mainView);
  var anim=window.gsap&&window.__motion!=="off";

  function k(d){return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);}
  function add(d,n){var x=new Date(d);x.setDate(x.getDate()+n);return x;}
  function nights(x,y){return Math.round((y-x)/864e5);}
  function freeBetween(x,y){for(var d=new Date(x);d<y;d=add(d,1))if(busy[k(d)])return false;return true;}
  function mobile(){return matchMedia("(max-width: 700px)").matches;}
  function fmt(d,yr){return d.getDate()+" de "+MES[d.getMonth()]+(yr?" de "+d.getFullYear():"");}
  function short(d){return d.getDate()+" "+MESC[d.getMonth()];}
  function pd(s){var p=s.split("-");return new Date(+p[0],p[1]-1,+p[2]);}
  function people(){return S.guests+(S.guests===1?" persona":" personas");}
  function resURL(){return "apartar.html?p="+prop+"&in="+k(S.a)+"&out="+k(S.b)+"&g="+S.guests;}
  function precio(){return (window.kauriPrecio&&S.a&&S.b)?window.kauriPrecio(prop,S.a,S.b,0,{busy:synced?busy:null},S.guests):null;}
  function precioHTML(P){if(!P)return "";return ' · Total <b>'+kauriMoneda(P.total)+'</b>'+(P.especial&&P.ancla?' <span class="qb-esp">Precio especial</span>':'');}
  function waURL(){
    var m=(S.a&&S.b)?"Hola, vi la página de "+nombre+". ¿Está disponible del "+fmt(S.a)+" al "+fmt(S.b,true)+" ("+nights(S.a,S.b)+" noches) para "+people()+"?"
                   :"Hola, vi la página de "+nombre+" y quiero consultar fechas.";
    return "https://wa.me/"+wa+"?text="+encodeURIComponent(m);
  }

  /* ---------- meses (la misma pieza para el calendario grande y el desplegable) ---------- */
  function monthsHTML(view,n){
    var html="";
    for(var m=0;m<n;m++){
      var first=new Date(view.getFullYear(),view.getMonth()+m,1),days=new Date(first.getFullYear(),first.getMonth()+1,0).getDate(),lead=(first.getDay()+6)%7;
      html+='<div class="cal-month"><div class="cal-title">'+MES[first.getMonth()]+" "+first.getFullYear()+'</div><div class="cal-grid">';
      DIA.forEach(function(d){html+='<span class="cal-dow" aria-hidden="true">'+d+"</span>";});
      for(var i=0;i<lead;i++)html+="<span></span>";
      for(var dd=1;dd<=days;dd++){
        var d=new Date(first.getFullYear(),first.getMonth(),dd),key=k(d),past=d<today||d>last,isBusy=!!busy[key];
        var end=S.b||(S.a&&S.hov&&nights(S.a,S.hov)>=MIN&&freeBetween(S.a,S.hov)?S.hov:null);
        var cls=["cal-d"];if(past)cls.push("past");if(isBusy)cls.push("busy");if(+d===+today)cls.push("today");
        if(S.a&&+d===+S.a)cls.push("sel","start");if(end&&+d===+end)cls.push("sel","end");if(S.a&&end&&d>S.a&&d<end)cls.push("in");
        var canEnd=S.a&&!S.b&&d>S.a&&nights(S.a,d)>=MIN&&freeBetween(S.a,d);
        var tooShort=S.a&&!S.b&&d>S.a&&nights(S.a,d)<MIN&&!isBusy;
        if(tooShort)cls.push("short");
        var dis=past||(isBusy&&!canEnd);
        html+='<button type="button" class="'+cls.join(" ")+'" data-k="'+key+'"'+(dis?" disabled":"")+(isBusy?' title="Ocupado"':tooShort?' title="Mínimo 2 noches"':"")+' aria-label="'+fmt(d,true)+(isBusy?", ocupado":"")+'" aria-pressed="'+(cls.indexOf("sel")>-1)+'">'+dd+"</button>";
      }
      html+="</div></div>";
    }
    return html;
  }
  function pick(d){
    if(!S.a||S.b||d<=S.a){if(busy[k(d)])return;S.a=d;S.b=null;}
    else if(nights(S.a,d)<MIN){flash("Mínimo 2 noches");return;}
    else if(freeBetween(S.a,d))S.b=d;
    else{S.a=busy[k(d)]?null:d;S.b=null;}
    S.hov=null;renderAll();
    if(S.a&&S.b&&pop&&!pop.hidden&&!mobile())setTimeout(closePop,380);
  }
  function wire(g){
    g.addEventListener("click",function(e){var t=e.target.closest(".cal-d");if(!t||t.disabled)return;e.stopPropagation();pick(pd(t.dataset.k));});
    g.addEventListener("mouseover",function(e){var t=e.target.closest(".cal-d");if(!t||!S.a||S.b)return;var h=pd(t.dataset.k);if(S.hov&&+h===+S.hov)return;S.hov=h;renderAll();});
    g.addEventListener("mouseleave",function(){if(S.hov){S.hov=null;renderAll();}});
  }

  /* ---------- 2) calendario grande ---------- */
  var grid,prev,next,sum,go,st,gn;
  if(sec){
    grid=sec.querySelector(".cal-months");prev=sec.querySelector(".cal-prev");next=sec.querySelector(".cal-next");
    sum=sec.querySelector(".cal-sum");go=sec.querySelector(".cal-go");st=sec.querySelector(".cal-status");gn=sec.querySelector(".cal-g b");
    wire(grid);
    prev.addEventListener("click",function(){mainView=new Date(mainView.getFullYear(),mainView.getMonth()-1,1);renderAll();});
    next.addEventListener("click",function(){mainView=new Date(mainView.getFullYear(),mainView.getMonth()+1,1);renderAll();});
    sec.querySelector(".cal-minus").addEventListener("click",function(){S.guests=Math.max(1,S.guests-1);renderAll();});
    sec.querySelector(".cal-plus").addEventListener("click",function(){S.guests=Math.min(max,S.guests+1);renderAll();});
    sec.querySelector(".cal-clear").addEventListener("click",function(){S.a=S.b=null;renderAll();});
  }

  /* ---------- 1) barra de búsqueda del inicio ---------- */
  var pop=null,popGrid,res,fIn,fOut,qgn,popT,msg;
  var openPop=function(){pop.hidden=false;qb.classList.add("open");popView=S.a?new Date(S.a.getFullYear(),S.a.getMonth(),1):new Date(today.getFullYear(),today.getMonth(),1);renderAll();
    if(anim)gsap.fromTo(pop,{y:mobile()?40:-8,opacity:0},{y:0,opacity:1,duration:.35,ease:"power3.out"});};
  function closePop(){if(!pop||pop.hidden)return;pop.hidden=true;qb.classList.remove("open");renderAll();}
  if(qb){
    pop=qb.querySelector(".qb-pop");popGrid=qb.querySelector(".qb-months");res=qb.querySelector(".qb-res");
    fIn=qb.querySelector(".qb-in b");fOut=qb.querySelector(".qb-out b");qgn=qb.querySelector(".qb-g b");popT=qb.querySelector(".qb-pop-t");msg=qb.querySelector(".qb-msg");
    wire(popGrid);
    qb.querySelector(".qb-in").addEventListener("click",function(e){e.stopPropagation();if(S.b){S.a=null;S.b=null;}openPop();});
    qb.querySelector(".qb-out").addEventListener("click",function(e){e.stopPropagation();openPop();});
    qb.querySelector(".qb-close").addEventListener("click",closePop);
    qb.querySelector(".qb-done").addEventListener("click",function(){closePop();if(S.a&&S.b)search();});
    qb.querySelector(".qb-clear").addEventListener("click",function(e){e.stopPropagation();S.a=S.b=null;renderAll();});
    qb.querySelector(".qb-prev").addEventListener("click",function(e){e.stopPropagation();popView=new Date(popView.getFullYear(),popView.getMonth()-1,1);renderAll();});
    qb.querySelector(".qb-next").addEventListener("click",function(e){e.stopPropagation();popView=new Date(popView.getFullYear(),popView.getMonth()+1,1);renderAll();});
    qb.querySelector(".qb-minus").addEventListener("click",function(){S.guests=Math.max(1,S.guests-1);renderAll();});
    qb.querySelector(".qb-plus").addEventListener("click",function(){S.guests=Math.min(max,S.guests+1);renderAll();});
    qb.addEventListener("submit",function(e){e.preventDefault();search();});
    document.addEventListener("click",function(e){if(pop&&!pop.hidden&&!qb.contains(e.target))closePop();});
    document.addEventListener("keydown",function(e){if(e.key==="Escape")closePop();});
  }
  var flashT;function flash(t){if(!msg)return;msg.textContent=t;clearTimeout(flashT);flashT=setTimeout(function(){msg.textContent="";},2200);}
  function search(){
    if(!S.a||!S.b){openPop();return;}
    closePop();
    var n=nights(S.a,S.b),ok=freeBetween(S.a,S.b);
    res.hidden=false;
    res.innerHTML=(synced?(ok?'<span class="qb-ok"><i class="ph ph-check-circle" aria-hidden="true"></i> Libre</span>':'<span class="qb-no">Ocupado</span>'):'<span class="qb-ok"><i class="ph ph-calendar-check" aria-hidden="true"></i> Te confirmamos al momento</span>')+
      '<span class="qb-what"><b>'+fmt(S.a)+' al '+fmt(S.b)+'</b> · '+n+' noches · '+people()+precioHTML(precio())+'</span>'+
      '<span class="qb-acts"><a class="btn-primary" href="'+resURL()+'">Reservar</a><a class="qb-cal" href="'+waURL()+'" target="_blank" rel="noopener">o pregúntanos por WhatsApp</a></span>';
    if(anim)gsap.fromTo(res,{y:10,opacity:0},{y:0,opacity:1,duration:.45,ease:"power3.out"});
  }

  /* ---------- pintar todo desde el mismo estado ---------- */
  function renderAll(){
    if(sec){
      grid.innerHTML=monthsHTML(mainView,mobile()?1:2);
      prev.disabled=mainView<=new Date(today.getFullYear(),today.getMonth(),1);
      gn.textContent=S.guests;
      if(S.a&&S.b){sum.innerHTML="<b>"+fmt(S.a)+" al "+fmt(S.b)+"</b> · "+nights(S.a,S.b)+" noches · "+people()+precioHTML(precio());go.classList.remove("off");go.href=resURL();}
      else{sum.textContent=S.a?"Ahora elige el día de salida (mínimo 2 noches).":"Elige el día de llegada.";go.classList.add("off");go.href="#disponibilidad";}
      var cw=sec.querySelector(".cal-wa");if(cw)cw.href=waURL();
    }
    if(qb){
      fIn.textContent=S.a?short(S.a):"Agregar fecha";fOut.textContent=S.b?short(S.b):"Agregar fecha";
      qb.querySelector(".qb-in").classList.toggle("set",!!S.a);qb.querySelector(".qb-out").classList.toggle("set",!!S.b);
      qgn.textContent=S.guests;
      if(!pop.hidden){
        popGrid.innerHTML=monthsHTML(popView,mobile()?1:2);
        popT.textContent=!S.a?"Elige tu llegada":!S.b?"Ahora tu salida (mínimo 2 noches)":fmt(S.a)+" al "+fmt(S.b)+" · "+nights(S.a,S.b)+" noches";
        qb.querySelector(".qb-prev").disabled=popView<=new Date(today.getFullYear(),today.getMonth(),1);
      }
      if(!res.hidden&&!(S.a&&S.b))res.hidden=true;
    }
  }

  /* ---------- 3) franja "próximo fin de semana libre" ---------- */
  function nextFree(){
    var el=document.querySelector(".next-free");if(!el)return;
    if(!synced){el.hidden=true;return;}
    var d=new Date(today);while(d.getDay()!==5)d=add(d,1);
    for(var i=0;i<26;i++,d=add(d,7)){
      if(!busy[k(d)]&&!busy[k(add(d,1))]){var fri=new Date(d),sun=add(d,2);
        el.querySelector(".nf-d").textContent="viernes "+fri.getDate()+(fri.getMonth()!==sun.getMonth()?" de "+MES[fri.getMonth()]:"")+" al domingo "+sun.getDate()+" de "+MES[sun.getMonth()];
        el.hidden=false;
        el.onclick=function(){S.a=fri;S.b=sun;mainView=new Date(fri.getFullYear(),fri.getMonth(),1);renderAll();};
        return;}
    }
    el.hidden=true;
  }
  function apply(data){
    busy={};((data&&data[prop])||[]).forEach(function(x){for(var d=pd(x[0]),e=pd(x[1]);d<e;d=add(d,1))busy[k(d)]=1;});
    synced=!!(data&&data.sincronizado&&data.sincronizado[prop]);
    if(st){if(synced&&data.actualizado){st.textContent="Sincronizado con Airbnb · último cambio el "+fmt(new Date(data.actualizado))+". Te confirmamos al momento por WhatsApp.";st.classList.add("ok");}
      else st.textContent="Calendario en conexión con Airbnb: elige tus fechas y te confirmamos la disponibilidad al momento por WhatsApp.";}
    nextFree();renderAll();
  }
  addEventListener("resize",function(){clearTimeout(renderAll.t);renderAll.t=setTimeout(renderAll,150);});
  renderAll();
  /* Airbnb (vía GitHub) + reservas directas del servidor de cobros, si ya está conectado */
  var SRV=(window.KAURI_TARIFAS&&window.KAURI_TARIFAS.servidor)||"";
  function conDirectas(d){if(!SRV||!d)return d;return fetch(SRV+"/ocupado?p="+prop).then(function(r){return r.json();}).then(function(x){d[prop]=(d[prop]||[]).concat(x.ocupado||[]);return d;}).catch(function(){return d;});}
  fetch("https://raw.githubusercontent.com/Casa-Kauri/casa-kauri.github.io/main/disponibilidad.json?t="+Date.now(),{cache:"no-store"})
    .then(function(r){if(!r.ok)throw 0;return r.json();}).then(conDirectas).then(apply)
    .catch(function(){fetch("disponibilidad.json?t="+Date.now()).then(function(r){return r.json();}).then(apply).catch(function(){apply(null);});});
})();
