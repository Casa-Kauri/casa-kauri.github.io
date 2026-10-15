/* Croquis interactivo de cómo llegar a Casa Kauri (15 oct 2026). Calles trazadas sobre los mapas de la guía vieja de Canva
   (que son de Google Maps): la carretera, la entrada por Higueras a la altura del módulo de seguridad, la calle de la casa
   (Google la llama Amapa), Mi Canasta sobre Capomo y el camino de terracería a Playa El Naranjo. Escala: 1 px del mapa = 0.86 m,
   calibrada con el largo de Calle Monterrey en OpenStreetMap (322 m); el camino a la playa se ajustó a los 750 m reales.
   Es ilustrativo: lo dice la nota junto al croquis. Lee window.__motion (full | soft | off), __dpr, __adapt, __lowfx. */
(function(){
  var cv=document.getElementById("croquis-cv");
  if(!cv||!window.THREE)return;
  var T=THREE,reduce=window.__motion==="off",r;
  try{r=new T.WebGLRenderer({canvas:cv,antialias:!window.__lowfx,alpha:true});}catch(e){return;}
  if(!r.getContext())return;
  document.documentElement.classList.add("cq-live");
  r.setPixelRatio(window.__dpr?window.__dpr():1);
  r.outputEncoding=T.sRGBEncoding;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.05;
  function L(h){return new T.Color(h).convertSRGBToLinear();}
  function M(c,o){var m=new T.MeshStandardMaterial(Object.assign({roughness:.9,metalness:0},o||{}));m.color=L(c);return m;}
  var scene=new T.Scene(),cam=new T.PerspectiveCamera(38,1,1,4000);
  scene.add(new T.HemisphereLight(L(0xfff1dc),L(0x6b7a63),.95));
  var sun=new T.DirectionalLight(L(0xffd29a),1.6);sun.position.set(-300,400,200);scene.add(sun);

  /* mapa → mundo: x al este, z al sur (el norte queda arriba de la pantalla) */
  function P(px,py){return [(px-430)*.86,(py-565)*.86];}
  function poly(a){var o=[];for(var i=0;i<a.length;i+=2)o.push(P(a[i],a[i+1]));return o;}
  /* Las calles de norte a sur corren paralelas (x = x0 - 0.6·(y - y0) en px del mapa); la de la casa pasa por la ruta
     punteada del mapa viejo, (340,712) → (430,565). Los cruces salen de esa geometría, no a ojo. */
  function NS(x0,y0,y1){return poly([x0,y0,x0-.6*(y1-y0),y1]);}
  var streets=[
    {n:"Higueral",p:poly([175,287,830,467]),w:7},
    {n:"Capomo",p:NS(330,318,760),w:7},
    {n:"Huanacaxtle",p:NS(440,355,1040),w:7},
    {n:"casa",p:NS(537,386,1040),w:7},
    {n:"Chihuahua",p:NS(668,428,1040),w:7},
    {n:"Higueras",p:poly([60,500,152,615,340,712,576,845,760,950]),w:8},
    {n:"cruce",p:poly([195,543,379,650]),w:6}   /* la primera a la derecha bajando de la casa: derecho hasta Capomo (corrección de Dalí, 15 oct) */,
    {n:"Tule",p:poly([70,940,175,1020]),w:7},
    {n:"carretera",p:poly([827,430,576,845,397,1140]),w:16}
  ];
  var dirt=poly([60,500,-40,440,-80,300,-95,225]);                 // terracería a la playa (cierra los 750 m)
  var COAST=P(-140,0)[0],SAND=P(-104,0)[0];

  /* suelo, mar y arena */
  var ground=new T.Mesh(new T.PlaneGeometry(1400,1300),M(0xDCD6C6));ground.rotation.x=-Math.PI/2;ground.position.set(0,-.2,40);scene.add(ground);
  var MX=P(70,0)[0],monte=new T.Mesh(new T.PlaneGeometry(MX-SAND,1300),M(0xB9C3A2));monte.rotation.x=-Math.PI/2;monte.position.set((MX+SAND)/2,-.15,40);scene.add(monte);   // monte entre el pueblo y la playa
  var sand=new T.Mesh(new T.PlaneGeometry(SAND-COAST,1300),M(0xEADCBE));sand.rotation.x=-Math.PI/2;sand.position.set((SAND+COAST)/2,-.1,40);scene.add(sand);
  var seaM=new T.MeshStandardMaterial({roughness:.25,metalness:.1,transparent:true,opacity:.95});seaM.color=L(0x3E8FB0);
  var sea=new T.Mesh(new T.PlaneGeometry(700,1300,30,60),seaM);sea.rotation.x=-Math.PI/2;sea.position.set(COAST-350,-.05,40);scene.add(sea);
  var foam=new T.Mesh(new T.PlaneGeometry(6,1300),new T.MeshBasicMaterial({color:0xF4F8FA,transparent:true,opacity:.8}));foam.rotation.x=-Math.PI/2;foam.position.set(COAST+1,0,40);scene.add(foam);

  /* listones de calle */
  function ribbon(pts,w,mat,y){
    var g=new T.BufferGeometry(),v=[],idx=[],k=0;
    for(var i=0;i<pts.length-1;i++){var a=pts[i],b=pts[i+1],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz)||1,nx=-dz/l*w/2,nz=dx/l*w/2;
      v.push(a[0]+nx,y,a[1]+nz,a[0]-nx,y,a[1]-nz,b[0]+nx,y,b[1]+nz,b[0]-nx,y,b[1]-nz);idx.push(k,k+2,k+1,k+1,k+2,k+3);k+=4;}
    g.setAttribute("position",new T.Float32BufferAttribute(v,3));g.setIndex(idx);g.computeVertexNormals();
    var m=new T.Mesh(g,mat);scene.add(m);return m;}
  var asph=M(0x8D9196),road=M(0x5F6469);
  streets.forEach(function(s){ribbon(s.p,s.w,s.n==="carretera"?road:asph,.05);});
  ribbon(dirt,5,M(0xC7A982),.04);
  var cl=streets[streets.length-1].p;ribbon(cl,.7,new T.MeshBasicMaterial({color:0xE8C87A}),.1);   // raya de la carretera

  /* casas y árboles con instancias (pocas mallas: va fluido en un celular) */
  function segDist(x,z,a,b){var dx=b[0]-a[0],dz=b[1]-a[1],t=((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz);t=Math.max(0,Math.min(1,t));return Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz);}
  function near(x,z){var m=1e9;streets.concat([{p:dirt}]).forEach(function(s){for(var i=0;i<s.p.length-1;i++)m=Math.min(m,segDist(x,z,s.p[i],s.p[i+1]));});return m;}
  var seed=7;function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647;}
  var houseG=new T.BoxGeometry(1,1,1),houseM=M(0xF3EEE6,{roughness:.8}),roofM=M(0xC98A5E,{roughness:.8});
  var H=[],dummy=new T.Object3D(),x0=P(80,0)[0],x1=P(760,0)[0],z0=P(0,300)[1],z1=P(0,1040)[1];
  for(var i=0;i<900&&H.length<240;i++){var x=x0+rnd()*(x1-x0),z=z0+rnd()*(z1-z0),d=near(x,z);if(d<9||d>40)continue;var hq=P(414,566);if(Math.hypot(x-hq[0],z-hq[1])<20)continue;H.push([x,z,6+rnd()*6,6+rnd()*7,3+rnd()*(rnd()<.2?5:2.5),rnd()*.3-.15]);}
  var hm=new T.InstancedMesh(houseG,houseM,H.length),rm=new T.InstancedMesh(houseG,roofM,H.length);
  H.forEach(function(h,i){dummy.position.set(h[0],h[4]/2,h[1]);dummy.rotation.set(0,-.52+h[5],0);dummy.scale.set(h[2],h[4],h[3]);dummy.updateMatrix();hm.setMatrixAt(i,dummy.matrix);
    dummy.position.y=h[4]+.3;dummy.scale.set(h[2]+.6,.6,h[3]+.6);dummy.updateMatrix();rm.setMatrixAt(i,dummy.matrix);});
  scene.add(hm);scene.add(rm);
  var treeG=new T.ConeGeometry(1,1,7),treeM=M(0x4E7F45),trunkG=new T.CylinderGeometry(.25,.35,1,6),trunkM=M(0x7A5C41);
  var TR=[];for(var j=0;j<1400&&TR.length<330;j++){var tx=SAND+8+rnd()*(x0-SAND+40),tz=-330+rnd()*760;if(near(tx,tz)<6)continue;if(tx>x0&&rnd()<.85)continue;TR.push([tx,tz,5+rnd()*6]);}
  var tm=new T.InstancedMesh(treeG,treeM,TR.length),km=new T.InstancedMesh(trunkG,trunkM,TR.length);
  TR.forEach(function(t,i){dummy.rotation.set(0,0,0);dummy.position.set(t[0],t[2]*.75+1.5,t[1]);dummy.scale.set(t[2]*.45,t[2]*1.1,t[2]*.45);dummy.updateMatrix();tm.setMatrixAt(i,dummy.matrix);
    dummy.position.set(t[0],1,t[1]);dummy.scale.set(1,2,1);dummy.updateMatrix();km.setMatrixAt(i,dummy.matrix);});
  scene.add(tm);scene.add(km);
  /* palmeras en la arena */
  var palmM=M(0x2F7444,{side:T.DoubleSide});for(var p2=-320;p2<420;p2+=34){var px=SAND-6-rnd()*14,pz=p2+rnd()*16,g=new T.Group();
    var tr=new T.Mesh(new T.CylinderGeometry(.3,.45,9,6),trunkM);tr.position.y=4.5;g.add(tr);
    for(var l=0;l<6;l++){var lf=new T.Mesh(new T.ConeGeometry(.9,6,4,1,true),palmM);lf.scale.z=.25;lf.rotation.z=-1.2;lf.position.set(2.5,0,0);var a=new T.Group();a.rotation.y=l/6*Math.PI*2;a.add(lf);a.position.y=9;g.add(a);}
    g.position.set(px,0,pz);scene.add(g);}

  /* Casa Kauri: la maqueta en chico, con su jardín y portón al frente */
  var kauri=new T.Group();
  var kb=new T.Mesh(new T.BoxGeometry(13,6,26),M(0xFBFAF7,{roughness:.7}));kb.position.set(-3,3,0);kauri.add(kb);
  var pool=new T.Mesh(new T.BoxGeometry(5,.4,14),new T.MeshStandardMaterial({color:L(0x1AA9C4),emissive:L(0x0A6A80),emissiveIntensity:.5,roughness:.2}));pool.position.set(6,.3,-1);kauri.add(pool);
  var yard=new T.Mesh(new T.BoxGeometry(14,.3,8),M(0x6E9E5A));yard.position.set(3,.2,11);kauri.add(yard);
  kauri.rotation.y=-.54;var hp=P(414,566);kauri.position.set(hp[0],0,hp[1]);scene.add(kauri);

  /* marcadores con etiqueta HTML */
  var stage=cv.parentNode,EN=document.documentElement.getAttribute("data-l")==="en";
  var marks=[
    {p:P(414,566),y:20,t:"Casa Kauri",cls:"home"},
    {p:P(203,528),y:10,t:"Mi Canasta",cls:""},
    {k:"modulo",p:P(590,835),y:10,t:EN?"Security booth":"Módulo de seguridad",cls:""},
    {p:P(-95,225),y:8,t:"Playa El Naranjo",cls:"beach"},
    {k:"tepic",p:P(790,500),y:4,t:EN?"To Tepic and Guadalajara":"A Tepic y Guadalajara",cls:"road"},{k:"vallarta",p:P(450,1050),y:4,t:EN?"To Puerto Vallarta":"A Puerto Vallarta",cls:"road"},
    {p:P(395,742),y:3,t:"Higueras",cls:"road"},{p:P(530,660),y:3,t:"Chihuahua",cls:"road"},{p:P(245,450),y:3,t:"Capomo",cls:"road"},{p:P(330,540),y:3,t:"Huanacaxtle",cls:"road"}
  ];
  marks.forEach(function(m){m.el=document.createElement("span");m.el.className="cq-tag "+m.cls;m.el.textContent=m.t;stage.appendChild(m.el);
    if(m.cls!=="road"){var pin=new T.Mesh(new T.CylinderGeometry(.6,.6,m.y,8),new T.MeshBasicMaterial({color:m.cls==="home"?0xE8C87A:0x1F2F54}));pin.position.set(m.p[0],m.y/2,m.p[1]);scene.add(pin);}});

  /* recorridos */
  var routes={
    gdl:{tags:["Casa Kauri","Higueras","Chihuahua","tepic","modulo"],pts:[P(800,475),P(576,845),P(458,779),P(340,712),P(430,565)],w:10,col:0xE09A2B,speed:80},
    auto:{tags:["Casa Kauri","Higueras","Chihuahua","vallarta","modulo"],pts:[P(450,1052),P(576,845),P(458,779),P(340,712),P(430,565)],w:10,col:0xE09A2B,speed:70},
    playa:{tags:["Casa Kauri","Higueras","Playa El Naranjo"],pts:[P(430,565),P(340,712),P(253,667),P(152,615),P(60,500),P(-40,440),P(-80,300),P(-95,225)],w:9,col:0xD9603B,speed:110},
    tienda:{tags:["Casa Kauri","Mi Canasta","Capomo","Huanacaxtle","Higueras"],pts:[P(430,565),P(379,650),P(195,543)],w:9,col:0x2E4A8C,speed:70}
  };
  function sample(pts){var o=[pts[0]],L2=0;for(var i=0;i<pts.length-1;i++){var a=pts[i],b=pts[i+1],l=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.round(l/2));for(var k=1;k<=n;k++)o.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n]);L2+=l;}o.len=L2;return o;}
  Object.keys(routes).forEach(function(k){var R=routes[k];R.s=sample(R.pts);R.mesh=ribbon(R.s,R.w,new T.MeshBasicMaterial({color:R.col,side:T.DoubleSide,toneMapped:false}),.6);R.mesh.visible=false;
    var xs=R.s.map(function(p){return p[0];}),zs=R.s.map(function(p){return p[1];});R.c=[(Math.min.apply(0,xs)+Math.max.apply(0,xs))/2,(Math.min.apply(0,zs)+Math.max.apply(0,zs))/2];R.span=Math.max(Math.max.apply(0,xs)-Math.min.apply(0,xs),Math.max.apply(0,zs)-Math.min.apply(0,zs));});
  var walker=new T.Mesh(new T.SphereGeometry(6,18,14),new T.MeshBasicMaterial({color:0xffffff,toneMapped:false}));scene.add(walker);var wcore=new T.Mesh(new T.SphereGeometry(3.6,16,12),new T.MeshBasicMaterial({color:0x1F2F54,toneMapped:false}));walker.add(wcore);wcore.position.y=1.5;walker.scale.set(1,.5,1);
  var halo=new T.Mesh(new T.RingGeometry(8,11,32),new T.MeshBasicMaterial({color:0xE8C87A,transparent:true,opacity:.7,side:T.DoubleSide}));halo.rotation.x=-Math.PI/2;scene.add(halo);

  /* cámara: encuadra el recorrido elegido; se gira arrastrando */
  var cur=null,prog=1,yaw=0,goalYaw=0,ctr=[0,0],goalCtr=[0,0],dist=520,goalDist=520,down=false,lx=0;
  function size(){var w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();}
  addEventListener("resize",size);size();
  var adapt=window.__adapt?window.__adapt(r,size):null;
  function pick(k){cur=routes[k];Object.keys(routes).forEach(function(n){routes[n].mesh.visible=n===k;});prog=reduce?1:0;
    goalCtr=cur.c.slice();goalDist=Math.max(330,cur.span*1.95/Math.min(1,cam.aspect*.9));if(reduce){ctr=goalCtr.slice();dist=goalDist;}}
  window.__croquis={pick:pick};
  cv.addEventListener("pointerdown",function(e){down=true;lx=e.clientX;});
  addEventListener("pointerup",function(){down=false;});
  addEventListener("pointermove",function(e){if(!down)return;goalYaw+=(e.clientX-lx)*.006;lx=e.clientX;});

  var v3=new T.Vector3(),vis=true,last=performance.now();
  if("IntersectionObserver" in window)new IntersectionObserver(function(es){var was=vis;vis=es[0].isIntersecting;if(vis&&!was)requestAnimationFrame(loop);}).observe(cv);
  function draw(now){
    var dt=Math.min(.05,(now-last)/1000);last=now;
    if(cur&&prog<1){prog=Math.min(1,prog+dt*cur.speed/cur.s.len*(window.__motion==="soft"?.8:1));}
    ctr[0]+=(goalCtr[0]-ctr[0])*.06;ctr[1]+=(goalCtr[1]-ctr[1])*.06;dist+=(goalDist-dist)*.06;yaw+=(goalYaw-yaw)*.1;
    var el=.95;cam.position.set(ctr[0]+Math.sin(yaw)*dist*Math.cos(el),dist*Math.sin(el),ctr[1]+Math.cos(yaw)*dist*Math.cos(el));cam.lookAt(ctr[0],0,ctr[1]);
    if(cur){var n=Math.max(1,Math.floor((cur.s.length-1)*prog));cur.mesh.geometry.setDrawRange(0,n*6);var p=cur.s[n];walker.position.set(p[0],3,p[1]);halo.position.set(p[0],.6,p[1]);
      var t=now/1000;halo.scale.setScalar(reduce?1:1+(t%1)*.8);halo.material.opacity=reduce?.7:.7*(1-t%1);}
    seaM.opacity=.92+Math.sin(now/900)*.03;
    r.render(scene,cam);
    var w=cv.clientWidth,h=cv.clientHeight;
    marks.forEach(function(m){v3.set(m.p[0],m.y+3,m.p[1]).project(cam);var on=v3.z<1&&Math.abs(v3.x)<1.05&&Math.abs(v3.y)<1.05&&(!cur||cur.tags.indexOf(m.k||m.t)>=0);
      m.el.style.transform="translate("+((v3.x+1)/2*w)+"px,"+((1-v3.y)/2*h)+"px) translate(-50%,-100%)";m.el.style.opacity=on?1:0;});
  }
  function loop(now){if(adapt)adapt(now);draw(now);if(vis)requestAnimationFrame(loop);}
  var first=document.querySelector(".cq-routes [aria-pressed=true]");pick(first?first.getAttribute("data-r"):"auto");
  requestAnimationFrame(loop);
})();
