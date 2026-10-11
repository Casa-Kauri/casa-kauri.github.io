/* Maqueta 3D del Departamento Kauri (11 oct 2026). Lo real: loft de 3 niveles sobre una tienda de víveres, balcón al
   andador principal, nivel 2 bajo bóvedas de ladrillo, rooftop privado SIN muebles (teja en una parte, medio baño,
   fregadero y regadera exterior) y el mar a 100 m. Escala ilustrativa. Misma interfaz que casa3d.js (window.__casa3d.face). */
(function(){
  var cv=document.getElementById("casa3d-cv");
  if(!cv||!window.THREE)return;
  var T=THREE,reduce=window.__motion==="off",r;
  try{r=new T.WebGLRenderer({canvas:cv,antialias:!window.__lowfx,alpha:true});}catch(e){return;}
  if(!r.getContext())return;
  document.documentElement.classList.add("c3-live");
  r.setPixelRatio(window.__dpr?window.__dpr():1);
  r.outputEncoding=T.sRGBEncoding;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.05;
  var SH=!window.__lowfx;if(SH){r.shadowMap.enabled=true;r.shadowMap.type=T.PCFSoftShadowMap;}
  function L(h){return new T.Color(h).convertSRGBToLinear();}
  var scene=new T.Scene(),cam=new T.PerspectiveCamera(36,1,.1,200);
  scene.add(new T.HemisphereLight(L(0xffe9cc),L(0x5d6f5a),.85));
  var sun=new T.DirectionalLight(L(0xffc98a),2.3);sun.position.set(-9,10,7);scene.add(sun);
  var fill=new T.DirectionalLight(L(0x9fc4ff),.45);fill.position.set(9,6,-7);scene.add(fill);
  if(SH){sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);var c0=sun.shadow.camera;c0.left=-9;c0.right=9;c0.top=9;c0.bottom=-9;c0.near=1;c0.far=40;sun.shadow.radius=5;sun.shadow.bias=-.0008;}
  try{var es=new T.Scene(),ec=document.createElement("canvas");ec.width=4;ec.height=64;var ex=ec.getContext("2d"),eg=ex.createLinearGradient(0,0,0,64);
    eg.addColorStop(0,"#8fb7d9");eg.addColorStop(.42,"#ffd7a0");eg.addColorStop(.52,"#f2a65e");eg.addColorStop(1,"#6d7b62");ex.fillStyle=eg;ex.fillRect(0,0,4,64);
    var et=new T.CanvasTexture(ec);et.encoding=T.sRGBEncoding;es.add(new T.Mesh(new T.SphereGeometry(10,32,16),new T.MeshBasicMaterial({map:et,side:T.BackSide})));
    var pm=new T.PMREMGenerator(r);scene.environment=pm.fromScene(es,.04).texture;pm.dispose();}catch(e){}
  function M(c,o){var m=new T.MeshStandardMaterial(Object.assign({roughness:.75,metalness:.02,envMapIntensity:.5},o||{}));m.color=L(c);if(o&&o.emissive!==undefined)m.emissive=L(o.emissive);return m;}
  var root=new T.Group();scene.add(root);
  function box(w,h,d,m,x,y,z,g){var b=new T.Mesh(new T.BoxGeometry(w,h,d),m);b.position.set(x,y,z);(g||root).add(b);return b;}

  /* base: medio pueblo, medio playa */
  var base=new T.Mesh(new T.CylinderGeometry(7.4,7.6,.5,96),M(0xE6D6B8,{roughness:.95}));base.position.y=-.25;root.add(base);
  var street=new T.Mesh(new T.CylinderGeometry(6.9,6.9,.06,96,1,false,Math.PI*.8,Math.PI*1.4),M(0xCFC2A6,{roughness:1}));street.position.y=.03;root.add(street);
  /* el mar al fondo del andador: un gajo azul con su franja de arena */
  var sand=new T.Mesh(new T.CylinderGeometry(6.9,6.9,.07,96,1,false,Math.PI*.2,Math.PI*.6),M(0xEAD9B0,{roughness:1}));sand.position.y=.035;root.add(sand);
  var sea=new T.Mesh(new T.CylinderGeometry(6.9,6.9,.09,96,1,false,Math.PI*.3,Math.PI*.4),new T.MeshPhysicalMaterial({color:L(0x1C8FB0),roughness:.1,clearcoat:.6,envMapIntensity:.6,emissive:L(0x0B5A73),emissiveIntensity:.4}));
  sea.position.y=.05;sea.scale.set(1,1,1);root.add(sea);
  /* el andador: franja peatonal que lleva al mar */
  var walkM=M(0xE9E1CF,{roughness:.95});box(9.4,.05,1.8,walkM,.3,.08,2.0);   // el andador corre frente al edificio y termina en la playa (derecha)

  /* edificio: tienda abajo y el loft de tres niveles arriba */
  var B=new T.Group();B.position.set(-1.2,0,-.2);root.add(B);   // el frente (+z) da al andador
  var wallA=M(0xF2E6D3),wallB=M(0xE8D9C2),trim=M(0xD6C7AE),glassM=M(0x9FC3D6,{roughness:.15,metalness:.2}),dark=M(0x3B4652),brick=M(0xB5673F,{roughness:.9}),tile=M(0xB4542E,{roughness:.8});
  box(2.6,1.0,3.0,wallB,0,.55,0,B);                                       // planta baja: tienda
  for(var s=0;s<7;s++)box(.37,.06,.6,s%2?M(0xF4F1EA):M(0x2F7F8C),-1.1+s*.37,1.06,1.75,B).rotation.x=.35;   // toldo a rayas
  box(1.6,.6,.05,glassM,-.35,.5,1.52,B);                                  // aparador
  box(.5,.8,.05,M(0x6E5136),.85,.45,1.52,B);                              // entrada privada
  box(2.7,1.0,3.1,wallA,0,1.6,0,B);                                       // nivel 1: convivencia
  box(2.2,.05,.7,M(0x9A6B45),0,1.13,1.85,B);                              // balcón
  for(var b=0;b<9;b++)box(.03,.4,.03,dark,-1.05+b*.26,1.35,2.18,B);
  box(2.2,.03,.03,dark,0,1.55,2.18,B);
  box(1.2,.6,.05,glassM,0,1.65,1.56,B);
  box(2.7,1.0,3.1,wallB,0,2.62,0,B);                                      // nivel 2: descanso (bóvedas)
  [-.75,0,.75].forEach(function(x){var a=new T.Mesh(new T.CylinderGeometry(.24,.24,.05,20,1,false,0,Math.PI),glassM);a.rotation.x=Math.PI/2;a.rotation.z=Math.PI/2;a.position.set(x,2.75,1.56);B.add(a);box(.48,.42,.05,glassM,x,2.55,1.56,B);});
  for(var v=0;v<4;v++){var vault=new T.Mesh(new T.CylinderGeometry(.36,.36,2.6,16,1,false,0,Math.PI),brick);vault.rotation.z=Math.PI/2;vault.position.set(0,3.12,-1.15+v*.77);B.add(vault);}   // bóvedas de ladrillo
  box(2.7,.1,3.1,trim,0,3.18,0,B);                                        // piso del rooftop
  box(2.7,.35,.07,trim,0,3.4,1.52,B);box(2.7,.35,.07,trim,0,3.4,-1.52,B);box(.07,.35,3.1,trim,-1.32,3.4,0,B);box(.07,.35,3.1,trim,1.32,3.4,0,B);   // pretil
  /* rooftop: teja en una parte, el resto cielo abierto; medio baño, fregadero y regadera exterior. Sin muebles. */
  [[-1.2,-1.3],[1.2,-1.3],[-1.2,-.1],[1.2,-.1]].forEach(function(p){box(.08,.9,.08,M(0x7A5A3E),p[0],3.7,p[1],B);});
  var roof=box(2.6,.08,1.5,tile,0,4.18,-.7,B);roof.rotation.x=-.12;
  box(.7,.8,.7,wallA,.9,3.6,-1.15,B);                                     // medio baño
  box(.5,.3,.3,M(0xDADFE3),-.8,3.38,-1.2,B);                              // fregadero
  box(.05,.95,.05,dark,.95,3.72,.9,B);box(.22,.05,.1,dark,.86,4.18,.9,B); // regadera exterior

  /* vecinos: el centro del pueblo */
  var nb=[[2.2,1.4,-2.6,1.8,2.2,M(0xE7C9A8)],[-4.3,1.1,-2.0,1.9,1.9,M(0xDCE3E6)],[-4.4,.9,.0,1.6,1.4,M(0xEBD7B5)]];
  nb.forEach(function(n){box(n[3],n[1]*2,n[4],n[5],n[0],n[1],n[2]);});

  /* palmeras del andador */
  function palm(x,z,hgt,lean){
    var p=new T.Group(),seg=6,trunkM=M(0x8C6A4A,{roughness:.95}),leafM=M(0x2F7444,{roughness:.8,side:T.DoubleSide});
    for(var q=0;q<seg;q++){var t=new T.Mesh(new T.CylinderGeometry(.09-q*.006,.11-q*.006,hgt/seg,8),trunkM);t.position.set(Math.sin(q/seg*1.2)*lean,hgt/seg*(q+.5),0);p.add(t);}
    var top=new T.Group();top.position.set(Math.sin(1.2)*lean,hgt,0);p.add(top);
    for(var l=0;l<9;l++){var leaf=new T.Mesh(new T.ConeGeometry(.22,1.5,4,1,true),leafM);leaf.scale.set(1,1,.25);var arm=new T.Group();arm.rotation.y=l/9*Math.PI*2;leaf.rotation.z=-1.15;leaf.position.set(.65,.05,0);arm.add(leaf);top.add(arm);}
    p.position.set(x,0,z);root.add(p);return top;
  }
  var tops=[palm(-3.2,3.2,2.5,.3),palm(-.6,3.2,2.8,-.25),palm(2.0,3.2,2.4,.2),palm(4.1,-1.9,2.6,-.3)];

  root.traverse(function(o){if(o.isMesh&&o!==base&&o!==street&&o!==sand&&o!==sea){o.castShadow=SH;o.receiveShadow=SH;}});
  base.receiveShadow=street.receiveShadow=sand.receiveShadow=SH;

  /* marcadores (orden = botones de la página): nivel 1, nivel 2, rooftop, entrada y tienda, andador, mar */
  var spots=[[-1.2,1.45,1.7],[-1.2,2.6,1.45],[-1.2,3.75,-.3],[-.35,.55,1.4],[1.6,.35,2.0],[5.9,.3,0]];   // coordenadas reales de cada parte
  var mark=new T.Mesh(new T.SphereGeometry(.13,18,14),new T.MeshBasicMaterial({color:0xE8C87A}));root.add(mark);
  var halo=new T.Mesh(new T.RingGeometry(.2,.3,32),new T.MeshBasicMaterial({color:0xE8C87A,transparent:true,opacity:.8,side:T.DoubleSide}));root.add(halo);

  var dist=22,elev=10.5;
  function size(){var w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;r.setSize(w,h,false);cam.aspect=w/h;var mob=w<560;dist=mob?22.5:22;elev=mob?11:10.5;cam.fov=mob?38:36;cam.updateProjectionMatrix();}
  addEventListener("resize",size);size();
  function noShadows(){if(!r.shadowMap.enabled)return;r.shadowMap.enabled=false;scene.traverse(function(o){if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){m.needsUpdate=true;});});}
  var adapt=window.__adapt?window.__adapt(r,size,noShadows):null;

  var rot=-.35,goal=-.35,auto=true,down=false,lx=0,idleAt=0,cur=0;
  function face(i){var s=spots[i];goal=-Math.atan2(s[0],s[2]);auto=false;idleAt=performance.now();cur=i;
    while(goal-rot>Math.PI)goal-=Math.PI*2;while(goal-rot<-Math.PI)goal+=Math.PI*2;}
  window.__casa3d={face:face};
  cv.addEventListener("pointerdown",function(e){down=true;lx=e.clientX;auto=false;idleAt=performance.now();});
  addEventListener("pointerup",function(){down=false;idleAt=performance.now();});
  addEventListener("pointermove",function(e){if(!down)return;var d=(e.clientX-lx)*.008;rot+=d;goal=rot;lx=e.clientX;});

  var vis=true,t0=performance.now();
  if("IntersectionObserver" in window)new IntersectionObserver(function(es2){var was=vis;vis=es2[0].isIntersecting;if(vis&&!was&&!reduce)requestAnimationFrame(loop);}).observe(cv);
  function draw(now){
    var t=((now||performance.now())-t0)/1000;
    if(!reduce){
      sea.material.emissiveIntensity=.38+Math.sin(t*1.2)*.07;
      tops.forEach(function(tp,i){tp.rotation.z=Math.sin(t*1.2+i)*.05;tp.rotation.x=Math.cos(t*.9+i)*.04;});
      if(!down&&!auto&&performance.now()-idleAt>7000)auto=true;
      if(auto&&!down)goal+=.0018;
    }
    rot+=(goal-rot)*.06;root.rotation.y=reduce?-.3:rot;
    var s=spots[cur];mark.position.set(s[0],s[1]+(reduce?0:Math.sin(t*3)*.08),s[2]);halo.position.copy(mark.position);halo.lookAt(cam.position);
    var ph=(t*1.2)%1;halo.scale.setScalar(reduce?1:1+ph*.9);halo.material.opacity=reduce?.8:.8*(1-ph);
    cam.position.set(0,elev,dist);cam.lookAt(0,1.6,0);
    r.render(scene,cam);
  }
  function loop(now){if(adapt)adapt(now);draw(now);if(vis&&!reduce)requestAnimationFrame(loop);}
  draw();if(!reduce)requestAnimationFrame(loop);
})();
