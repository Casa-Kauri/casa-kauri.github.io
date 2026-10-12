/* Maqueta 3D de Casa Kauri (11 oct 2026). Copiada de las fotos: casa de patio con alberca larga al centro, ala de dos
   plantas con pórtico de columnas y pasillo-balcón, ala del fondo con terraza, jardín tropical, celosía y cochera.
   La escala y los colores son ilustrativos (lo dice la nota junto a la maqueta). Se carga solo cuando la sección se acerca.
   Lee el modo central de <head>: window.__motion (full | soft | off), __dpr, __adapt, __lowfx. */
(function(){
  var cv=document.getElementById("casa3d-cv");
  if(!cv||!window.THREE)return;
  var T=THREE,reduce=window.__motion==="off",r;
  try{r=new T.WebGLRenderer({canvas:cv,antialias:!window.__lowfx,alpha:true});}catch(e){return;}
  if(!r.getContext())return;
  document.documentElement.classList.add("c3-live");
  r.setPixelRatio(window.__dpr?window.__dpr():1);
  /* v2 "lo más parecido al prompt": tono de cine, colores en sRGB, sombras suaves (no en equipos modestos) */
  r.outputEncoding=T.sRGBEncoding;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.05;
  var SH=!window.__lowfx;if(SH){r.shadowMap.enabled=true;r.shadowMap.type=T.PCFSoftShadowMap;}
  var scene=new T.Scene(),cam=new T.PerspectiveCamera(34,1,.1,200);
  function L(h){return new T.Color(h).convertSRGBToLinear();}
  scene.add(new T.HemisphereLight(L(0xffe9cc),L(0x5d6f5a),.85));
  var sun=new T.DirectionalLight(L(0xffc98a),2.4);sun.position.set(-10,8.5,6);scene.add(sun);          // sol bajo de atardecer
  var fill=new T.DirectionalLight(L(0x9fc4ff),.45);fill.position.set(9,6,-7);scene.add(fill);
  if(SH){sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);var sc0=sun.shadow.camera;sc0.left=-9;sc0.right=9;sc0.top=9;sc0.bottom=-9;sc0.near=1;sc0.far=40;sun.shadow.radius=5;sun.shadow.bias=-.0008;}
  /* cielo de atardecer convertido en mapa de reflejos para el agua y los vidrios */
  try{var es=new T.Scene(),ec=document.createElement("canvas");ec.width=4;ec.height=64;var ex=ec.getContext("2d"),eg=ex.createLinearGradient(0,0,0,64);
    eg.addColorStop(0,"#8fb7d9");eg.addColorStop(.42,"#ffd7a0");eg.addColorStop(.52,"#f2a65e");eg.addColorStop(1,"#6d7b62");ex.fillStyle=eg;ex.fillRect(0,0,4,64);
    var et=new T.CanvasTexture(ec);et.encoding=T.sRGBEncoding;es.add(new T.Mesh(new T.SphereGeometry(10,32,16),new T.MeshBasicMaterial({map:et,side:T.BackSide})));
    var pm=new T.PMREMGenerator(r);scene.environment=pm.fromScene(es,.04).texture;pm.dispose();}catch(e){}
  function M(c,o){var m=new T.MeshStandardMaterial(Object.assign({roughness:.75,metalness:.02,envMapIntensity:.5},o||{}));m.color=L(c);if(o&&o.emissive!==undefined)m.emissive=L(o.emissive);return m;}
  function box(w,h,d,m,x,y,z,g){var b=new T.Mesh(new T.BoxGeometry(w,h,d),m);b.position.set(x,y,z);(g||root).add(b);return b;}

  var root=new T.Group();scene.add(root);

  /* v3 (11 oct 2026): copiada de las fotos reales. Casa de patio: alberca larga al centro; ala de dos plantas a la
     izquierda (pórtico de columnas blancas abajo, recámaras y pasillo-balcón con barandal negro arriba, bóvedas de
     ladrillo bajo los aleros); ala del fondo con balcón; cochera al frente; jardín tropical a la derecha; celosía de
     madera oscura; foquitos sobre el patio. */
  var base=new T.Mesh(new T.CylinderGeometry(7.6,7.8,.5,96),M(0xE6D6B8,{roughness:.95}));base.position.y=-.25;root.add(base);
  var lawn=new T.Mesh(new T.BoxGeometry(8.2,.06,12.4),M(0xD8D3C8,{roughness:.95}));lawn.position.y=.03;root.add(lawn);   // piso del patio
  var sc=document.createElement("canvas");sc.width=sc.height=128;var g2=sc.getContext("2d"),gr=g2.createRadialGradient(64,64,6,64,64,64);
  gr.addColorStop(0,"rgba(30,40,60,.4)");gr.addColorStop(1,"rgba(30,40,60,0)");g2.fillStyle=gr;g2.fillRect(0,0,128,128);
  var sh=new T.Mesh(new T.PlaneGeometry(11,15),new T.MeshBasicMaterial({map:new T.CanvasTexture(sc),transparent:true,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.set(-1,.07,-.5);root.add(sh);

  var wall=M(0xF5F2EC),trim=M(0xE4DED3),wood=M(0x8A5A36,{roughness:.7}),dark=M(0x23272B,{roughness:.6}),slat=M(0x3A2E26,{roughness:.8}),grass=M(0x5E8E4E,{roughness:1}),paver=M(0xC9C4B8,{roughness:.95}),brick=M(0xB4643C,{roughness:.9,side:T.DoubleSide}),glassM=M(0x2E3A44,{roughness:.2,metalness:.3});
  function vaults(x0,x1,z0,z1,top,alongZ){               // bóvedas de ladrillo: arcos rebajados pegados bajo la losa (se ven desde abajo)
    var n=Math.max(2,Math.round((alongZ?(z1-z0):(x1-x0))/.55)),r0=alongZ?(z1-z0)/n/2:(x1-x0)/n/2;
    for(var i=0;i<n;i++){var t=(i+.5)/n,len=alongZ?(x1-x0):(z1-z0),c=new T.Mesh(new T.CylinderGeometry(r0,r0,len,14,1,true,0,Math.PI),brick),g=new T.Group();
      c.rotation.z=Math.PI/2;if(!alongZ)g.rotation.y=Math.PI/2;g.add(c);
      var w=new T.Group();w.add(g);w.scale.y=.4;w.position.set(alongZ?(x0+x1)/2:x0+t*(x1-x0),top-r0*.4,alongZ?z0+t*(z1-z0):(z0+z1)/2);root.add(w);}
  }
  function railing(x0,z0,x1,z1,y){                      // barandal negro: postes + pasamanos
    var L=Math.hypot(x1-x0,z1-z0),n=Math.round(L/.45);
    for(var i=0;i<=n;i++){var t=i/n;box(.035,.42,.035,dark,x0+t*(x1-x0),y+.21,z0+t*(z1-z0));}
    var r=box(x1===x0?.035:L,.035,z1===z0?.035:L,dark,(x0+x1)/2,y+.42,(z0+z1)/2);
    box(x1===x0?.025:L,.025,z1===z0?.025:L,dark,(x0+x1)/2,y+.22,(z0+z1)/2);
  }

  /* ala larga de dos plantas (izquierda), x -4…-1.6, z -6…3.4 */
  box(1.0,1.4,9.4,wall,-3.5,.72,-1.3);                                // recámaras / cocina al fondo del pórtico
  for(var z=-5.2;z<=3.0;z+=1.65){box(.16,1.4,.16,M(0xFBFAF7),-1.72,.72,z);}   // columnas blancas del pórtico
  box(2.6,.12,9.6,trim,-2.8,1.48,-1.3);                               // losa entre plantas
  vaults(-3.0,-1.62,-6.0,3.4,1.42,true);                              // bóvedas del pórtico
  box(1.35,1.3,9.4,wall,-3.33,2.2,-1.3);                              // planta alta: recámaras
  for(var z2=-5.0;z2<=2.6;z2+=1.9){box(.05,.8,.42,wood,-2.64,2.0,z2);box(.05,.55,.5,glassM,-2.64,2.15,z2+.75);}   // puertas de madera y ventanas
  railing(-1.66,-6.0,-1.66,3.4,1.54);                                 // pasillo-balcón con barandal negro
  box(2.7,.12,9.8,trim,-2.85,2.92,-1.3);                              // azotea
  vaults(-2.6,-1.55,-6.0,3.4,2.86,true);                              // bóvedas del pasillo de arriba
  /* ala del fondo, x -1.6…4, z -6…-4.6, también de dos plantas con balcón */
  box(5.6,1.4,.9,wall,1.2,.72,-5.55);
  for(var x=-.8;x<=3.6;x+=1.5){box(.42,.8,.05,wood,x,.42,-5.08);}
  box(5.7,.12,1.6,trim,1.15,1.48,-5.2);
  box(5.6,1.3,.9,wall,1.2,2.2,-5.55);
  for(var x2=-.6;x2<=3.6;x2+=1.6){box(.42,.8,.05,wood,x2,2.0,-5.08);}
  railing(-1.6,-4.42,4.0,-4.42,1.54);
  box(5.8,.12,1.8,trim,1.1,2.92,-5.15);
  vaults(-1.6,4.0,-5.05,-4.4,2.86,false);vaults(-1.6,4.0,-5.05,-4.4,1.42,false);
  [[1.1,-4.75],[1.6,-4.75]].forEach(function(p){box(.26,.26,.26,dark,p[0],1.68,p[1]);});   // sillas de la terraza de arriba

  /* pórtico: sala, comedor y asador */
  box(1.0,.06,.6,M(0x7A5234),-2.4,.6,-1.6);box(.08,.48,.08,dark,-2.4,.33,-1.6);    // comedor
  box(.7,.22,.45,M(0xD9D2C3),-2.5,.2,.6);box(.45,.22,.45,M(0xD9D2C3),-2.1,.2,1.3);  // sillones
  box(.55,.6,.45,brick,-3.0,.36,2.4);box(.45,.08,.35,dark,-3.0,.7,2.4);            // asador de ladrillo

  /* cochera al frente del ala, con portón */
  box(2.4,.03,2.4,M(0xB8B2A6),-2.8,.07,4.7);
  box(2.4,.1,2.5,trim,-2.8,1.48,4.65);box(.16,1.4,.16,M(0xFBFAF7),-1.72,.72,5.8);
  box(2.2,1.2,.06,slat,-2.8,.66,5.95);                                 // portón de madera oscura

  /* alberca larga al centro, con chapoteadero y fuente */
  box(2.7,.14,7.4,M(0x8E9499,{roughness:.6}),1.3,.1,-.2);             // borde de piedra gris
  var water=new T.Mesh(new T.PlaneGeometry(2.2,6.9,12,40),new T.MeshPhysicalMaterial({color:L(0x1AA9C4),roughness:.1,metalness:0,clearcoat:.6,clearcoatRoughness:.08,envMapIntensity:.55,emissive:L(0x0A6A80),emissiveIntensity:.45}));
  water.rotation.x=-Math.PI/2;water.position.set(1.3,.18,-.2);root.add(water);
  var kid=new T.Mesh(new T.BoxGeometry(2.2,.03,.9),new T.MeshPhysicalMaterial({color:L(0x4FCBDA),roughness:.1,clearcoat:.5,envMapIntensity:.5,emissive:L(0x0F7484),emissiveIntensity:.35}));kid.position.set(1.3,.2,-3.15);root.add(kid);   // chapoteadero (escalón)
  var jet=new T.Mesh(new T.CylinderGeometry(.02,.05,.6,8),new T.MeshBasicMaterial({color:0xDFF6FA,transparent:true,opacity:.55}));jet.position.set(1.3,.5,-3.55);root.add(jet);   // fuente

  /* andador de losetas en el pasto, entre pórtico y alberca */
  box(1.2,.05,9.0,grass,-.6,.07,-.2);
  for(var zp=-4.2;zp<=3.8;zp+=.75){box(.62,.06,.42,paver,-.6,.1,zp);}
  /* jardín tropical a la derecha: palmeras y plátanos */
  box(1.5,.08,10.2,grass,3.3,.08,.3);
  function palm(x,z,hgt,lean){
    var p=new T.Group(),seg=6,trunkM=M(0x8C6A4A,{roughness:.95}),leafM=M(0x2F7444,{roughness:.8,side:T.DoubleSide});
    for(var s=0;s<seg;s++){var t=new T.Mesh(new T.CylinderGeometry(.08-s*.006,.1-s*.006,hgt/seg,8),trunkM);t.position.set(Math.sin(s/seg*1.2)*lean,hgt/seg*(s+.5),0);p.add(t);}
    var top=new T.Group();top.position.set(Math.sin(1.2)*lean,hgt,0);p.add(top);
    for(var l=0;l<9;l++){var leaf=new T.Mesh(new T.ConeGeometry(.2,1.35,4,1,true),leafM);leaf.scale.set(1,1,.25);var arm=new T.Group();arm.rotation.y=l/9*Math.PI*2;leaf.rotation.z=-1.15;leaf.position.set(.6,.05,0);arm.add(leaf);top.add(arm);}
    p.position.set(x,0,z);root.add(p);return top;
  }
  function banana(x,z,s){                                // planta de plátano: hojas grandes
    var g=new T.Group(),lm=M(0x3E8A4C,{roughness:.75,side:T.DoubleSide});
    for(var i=0;i<6;i++){var lf=new T.Mesh(new T.SphereGeometry(.5,10,6),lm);lf.scale.set(.25,.08,1);var a=new T.Group();a.rotation.y=i/6*Math.PI*2;lf.position.set(0,0,.45);lf.rotation.x=-.5;a.add(lf);a.position.y=.9*s;g.add(a);}
    var st=new T.Mesh(new T.CylinderGeometry(.06,.08,.9*s,8),M(0x6E8C4A));st.position.y=.45*s;g.add(st);
    g.position.set(x,0,z);g.scale.setScalar(s);root.add(g);return g;
  }
  var tops=[palm(3.2,3.6,2.9,.3),palm(3.5,1.0,3.3,-.25),palm(3.1,-1.6,2.7,.2),palm(3.6,-3.6,3.1,-.3),palm(-.6,4.9,2.4,.25)];
  banana(3.0,2.4,1.1);banana(3.6,-.4,1.2);banana(3.0,-2.8,1.0);banana(3.4,4.6,1.0);

  /* celosía de madera oscura: muro derecho y frente */
  for(var i2=0;i2<7;i2++){box(.06,.11,12.2,slat,4.08,.25+i2*.24,0);}
  for(var i3=0;i3<5;i3++){box(5.4,.11,.06,slat,1.35,.25+i3*.24,6.08);}

  /* foquitos sobre el patio (de la terraza de arriba al frente) */
  var bulbM=new T.MeshBasicMaterial({color:0xFFE3A3});
  [[-1.6,-4.4,4.0,5.6],[-1.6,-1.0,4.0,2.6]].forEach(function(c){
    var n=14;for(var k=0;k<=n;k++){var t=k/n,x3=c[0]+t*(c[2]-c[0]),z3=c[1]+t*(c[3]-c[1]),y3=2.55-Math.sin(t*Math.PI)*.35;var bb=new T.Mesh(new T.SphereGeometry(.045,8,6),bulbM);bb.position.set(x3,y3,z3);root.add(bb);}
  });

  root.traverse(function(o){if(o.isMesh&&o!==base&&o!==lawn&&o!==sh&&o.material!==bulbM){o.castShadow=SH;o.receiveShadow=SH;}});
  base.receiveShadow=lawn.receiveShadow=SH;

  /* marcadores (orden = botones): alberca, pórtico y asador, recámaras de arriba, terraza de arriba, jardín, cochera */
  var spots=[[1.3,.45,-.2],[-2.4,.95,.4],[-3.0,2.45,-1.5],[1.4,2.05,-4.8],[3.3,.7,1.2],[-2.8,.5,4.7]];
  var markM=new T.MeshBasicMaterial({color:0xE8C87A}),mark=new T.Mesh(new T.SphereGeometry(.13,18,14),markM);root.add(mark);
  var halo=new T.Mesh(new T.RingGeometry(.2,.3,32),new T.MeshBasicMaterial({color:0xE8C87A,transparent:true,opacity:.8,side:T.DoubleSide}));root.add(halo);

  /* cámara, tamaño y adaptación */
  var dist=23,elev=12;
  /* encuadre: la base mide ~15 unidades; con fov 36 a ~24 de distancia el cuadro mide ~17.6 de ancho (cabe con aire) */
  function size(){var w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;r.setSize(w,h,false);cam.aspect=w/h;var mob=w<560;var k=Math.max(1,1.15/cam.aspect);dist=(mob?24:23)*k;elev=(mob?13:12)*k;cam.fov=mob?38:36;cam.updateProjectionMatrix();}
  addEventListener("resize",size);size();
  function noShadows(){if(!r.shadowMap.enabled)return;r.shadowMap.enabled=false;scene.traverse(function(o){if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){m.needsUpdate=true;});});}
  var adapt=window.__adapt?window.__adapt(r,size,noShadows):null;

  /* interacción: girar con el dedo o el mouse; los botones llevan la parte al frente */
  var rot=-.5,goal=-.5,auto=true,down=false,lx=0,idleAt=0,cur=0;
  function face(i){var s=spots[i];goal=-Math.atan2(s[0],s[2]);auto=false;idleAt=performance.now();cur=i;
    while(goal-rot>Math.PI)goal-=Math.PI*2;while(goal-rot<-Math.PI)goal+=Math.PI*2;}
  window.__casa3d={face:face};
  cv.addEventListener("pointerdown",function(e){down=true;lx=e.clientX;auto=false;idleAt=performance.now();});
  addEventListener("pointerup",function(){down=false;idleAt=performance.now();});
  addEventListener("pointermove",function(e){if(!down)return;var d=(e.clientX-lx)*.008;rot+=d;goal=rot;lx=e.clientX;});

  var vis=true,t0=performance.now();
  if("IntersectionObserver" in window)new IntersectionObserver(function(es){var was=vis;vis=es[0].isIntersecting;if(vis&&!was&&!reduce)requestAnimationFrame(loop);}).observe(cv);
  var wp=water.geometry.attributes.position,base0=wp.array.slice();
  function draw(now){
    var t=((now||performance.now())-t0)/1000;
    if(!reduce){
      for(var k=0;k<wp.count;k++){var x=base0[k*3],y=base0[k*3+1];wp.array[k*3+2]=Math.sin(x*3+t*1.8)*.025+Math.cos(y*4+t*1.3)*.02;}
      wp.needsUpdate=true;water.material.emissiveIntensity=.42+Math.sin(t*1.1)*.06;
      tops.forEach(function(tp,i){tp.rotation.z=Math.sin(t*1.2+i)*.05;tp.rotation.x=Math.cos(t*.9+i)*.04;});
      if(!down&&!auto&&performance.now()-idleAt>7000)auto=true;
      if(auto&&!down)goal+=.0018;
    }
    rot+=(goal-rot)*.06;root.rotation.y=reduce?-.5:rot;
    var s=spots[cur];mark.position.set(s[0],s[1]+(reduce?0:Math.sin(t*3)*.08),s[2]);halo.position.copy(mark.position);halo.lookAt(cam.position);halo.scale.setScalar(reduce?1:1+((t*1.2)%1)*.9);halo.material.opacity=reduce?.8:.8*(1-((t*1.2)%1));
    cam.position.set(0,elev,dist);cam.lookAt(0,1.1,0);
    r.render(scene,cam);
  }
  function loop(now){if(adapt)adapt(now);draw(now);if(vis&&!reduce)requestAnimationFrame(loop);}
  draw();if(!reduce)requestAnimationFrame(loop);
})();
