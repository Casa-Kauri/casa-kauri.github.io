/* Calendario de disponibilidad (11 oct 2026). Lee disponibilidad.json (lo actualiza un proceso de GitHub cada
   3 horas desde el iCal de Airbnb) y deja elegir llegada, salida y personas; el botón arma el WhatsApp con las fechas.
   Configuración en la sección: data-prop (casa|depa), data-max, data-wa, data-nombre.
   Mientras no haya sincronización, no marca nada como ocupado y lo dice: la disponibilidad se confirma por WhatsApp. */
(function(){
  var sec=document.querySelector(".cal");if(!sec)return;
  var prop=sec.dataset.prop,max=+sec.dataset.max||8,wa=sec.dataset.wa,nombre=sec.dataset.nombre||"Casa Kauri";
  var MES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  var DIA=["L","M","M","J","V","S","D"];
  var grid=sec.querySelector(".cal-months"),prev=sec.querySelector(".cal-prev"),next=sec.querySelector(".cal-next");
  var sum=sec.querySelector(".cal-sum"),go=sec.querySelector(".cal-go"),st=sec.querySelector(".cal-status"),gn=sec.querySelector(".cal-g b");
  var busy={},synced=false,today=new Date();today.setHours(0,0,0,0);
  var view=new Date(today.getFullYear(),today.getMonth(),1),a=null,b=null,hov=null,guests=Math.min(4,max);
  var last=new Date(today);last.setMonth(last.getMonth()+14);

  function k(d){return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);}
  function add(d,n){var x=new Date(d);x.setDate(x.getDate()+n);return x;}
  function nights(x,y){return Math.round((y-x)/864e5);}
  function freeBetween(x,y){for(var d=new Date(x);d<y;d=add(d,1))if(busy[k(d)])return false;return true;}
  function months(){return matchMedia("(max-width: 700px)").matches?1:2;}
  function fmt(d,yr){return d.getDate()+" de "+MES[d.getMonth()]+(yr?" de "+d.getFullYear():"");}

  function render(){
    var n=months(),html="";
    for(var m=0;m<n;m++){
      var first=new Date(view.getFullYear(),view.getMonth()+m,1),days=new Date(first.getFullYear(),first.getMonth()+1,0).getDate(),lead=(first.getDay()+6)%7;
      html+='<div class="cal-month"><div class="cal-title">'+MES[first.getMonth()]+" "+first.getFullYear()+'</div><div class="cal-grid">';
      DIA.forEach(function(d){html+='<span class="cal-dow" aria-hidden="true">'+d+"</span>";});
      for(var i=0;i<lead;i++)html+="<span></span>";
      for(var dd=1;dd<=days;dd++){
        var d=new Date(first.getFullYear(),first.getMonth(),dd),key=k(d),past=d<today||d>last,isBusy=!!busy[key];
        var end=b||(a&&hov&&hov>a&&freeBetween(a,hov)?hov:null);
        var cls=["cal-d"];if(past)cls.push("past");if(isBusy)cls.push("busy");if(+d===+today)cls.push("today");
        if(a&&+d===+a)cls.push("sel","start");if(end&&+d===+end)cls.push("sel","end");if(a&&end&&d>a&&d<end)cls.push("in");
        var canEnd=a&&!b&&d>a&&freeBetween(a,d);                       // la salida puede caer en un día ocupado (es la mañana)
        var dis=past||(isBusy&&!canEnd);
        html+='<button type="button" class="'+cls.join(" ")+'" data-k="'+key+'"'+(dis?" disabled":"")+(isBusy?' title="Ocupado"':"")+' aria-label="'+fmt(d,true)+(isBusy?", ocupado":"")+'" aria-pressed="'+(cls.indexOf("sel")>-1)+'">'+dd+"</button>";
      }
      html+="</div></div>";
    }
    grid.innerHTML=html;
    prev.disabled=view<=new Date(today.getFullYear(),today.getMonth(),1);
    summary();
  }
  function summary(){
    gn.textContent=guests;
    var msg;
    if(a&&b){var n=nights(a,b);sum.innerHTML="<b>"+fmt(a)+" al "+fmt(b)+"</b> · "+n+(n===1?" noche":" noches")+" · "+guests+(guests===1?" persona":" personas");
      msg="Hola, vi la página de "+nombre+". ¿Está disponible del "+fmt(a)+" al "+fmt(b,true)+" ("+n+(n===1?" noche":" noches")+") para "+guests+(guests===1?" persona":" personas")+"?";
      go.classList.remove("off");}
    else{sum.textContent=a?"Ahora elige el día de salida.":"Elige el día de llegada.";
      msg="Hola, vi la página de "+nombre+" y quiero consultar fechas.";go.classList.add("off");}
    go.href="https://wa.me/"+wa+"?text="+encodeURIComponent(msg);
  }
  grid.addEventListener("click",function(e){var t=e.target.closest(".cal-d");if(!t||t.disabled)return;var p=t.dataset.k.split("-"),d=new Date(+p[0],p[1]-1,+p[2]);
    if(!a||b||d<=a){if(busy[k(d)])return;a=d;b=null;}else if(freeBetween(a,d))b=d;else{a=busy[k(d)]?null:d;b=null;}
    render();if(a&&b&&window.gsap&&window.__motion!=="off")gsap.fromTo(sum,{y:8,opacity:0},{y:0,opacity:1,duration:.4,ease:"power3.out"});});
  grid.addEventListener("mouseover",function(e){var t=e.target.closest(".cal-d");if(!t||!a||b)return;var p=t.dataset.k.split("-"),h=new Date(+p[0],p[1]-1,+p[2]);if(hov&&+h===+hov)return;hov=h;render();});
  grid.addEventListener("mouseleave",function(){if(hov){hov=null;render();}});
  prev.addEventListener("click",function(){view=new Date(view.getFullYear(),view.getMonth()-1,1);render();});
  next.addEventListener("click",function(){view=new Date(view.getFullYear(),view.getMonth()+1,1);render();});
  sec.querySelector(".cal-minus").addEventListener("click",function(){guests=Math.max(1,guests-1);summary();});
  sec.querySelector(".cal-plus").addEventListener("click",function(){guests=Math.min(max,guests+1);summary();});
  sec.querySelector(".cal-clear").addEventListener("click",function(){a=b=null;render();});
  addEventListener("resize",function(){clearTimeout(render.t);render.t=setTimeout(render,150);});

  function apply(data){
    var r=(data&&data[prop])||[];busy={};
    r.forEach(function(x){var p=x[0].split("-"),q=x[1].split("-"),d=new Date(+p[0],p[1]-1,+p[2]),e=new Date(+q[0],q[1]-1,+q[2]);for(;d<e;d=add(d,1))busy[k(d)]=1;});
    synced=!!(data&&data.sincronizado&&data.sincronizado[prop]);
    if(synced&&data.actualizado){var u=new Date(data.actualizado);st.textContent="Sincronizado con Airbnb · último cambio el "+fmt(u)+". Te confirmamos al momento por WhatsApp.";st.classList.add("ok");}
    else st.textContent="Calendario en conexión con Airbnb: elige tus fechas y te confirmamos la disponibilidad al momento por WhatsApp.";
    nextFree();
    render();
  }
  /* franja "próximo fin de semana libre": el siguiente viernes y sábado libres según Airbnb; al tocarla deja las fechas elegidas */
  function nextFree(){
    var el=document.querySelector(".next-free");if(!el)return;
    if(!synced){el.hidden=true;return;}
    var d=new Date(today);while(d.getDay()!==5)d=add(d,1);
    for(var i=0;i<26;i++,d=add(d,7)){
      if(!busy[k(d)]&&!busy[k(add(d,1))]){var fri=new Date(d),sun=add(d,2);
        el.querySelector(".nf-d").textContent="viernes "+fri.getDate()+(fri.getMonth()!==sun.getMonth()?" de "+MES[fri.getMonth()]:"")+" al domingo "+sun.getDate()+" de "+MES[sun.getMonth()];
        el.hidden=false;
        el.onclick=function(){a=fri;b=sun;view=new Date(fri.getFullYear(),fri.getMonth(),1);render();};
        return;}
    }
    el.hidden=true;
  }
  render();
  /* primero la copia del repo (siempre la más reciente, sin esperar a que se reconstruya el sitio); si falla, la local */
  fetch("https://raw.githubusercontent.com/Casa-Kauri/casa-kauri.github.io/main/disponibilidad.json?t="+Date.now(),{cache:"no-store"})
    .then(function(r){if(!r.ok)throw 0;return r.json();}).then(apply)
    .catch(function(){fetch("disponibilidad.json?t="+Date.now()).then(function(r){return r.json();}).then(apply).catch(function(){apply(null);});});
})();
