/* Maqueta 3D de Casa Kauri (11 oct 2026). Solo lo que la casa tiene de verdad: dos plantas, alberca climatizada con
   chapoteadero, terraza con asador de ladrillo, terraza superior con vista, jardín cercado, entrada privada y palmeras.
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

  /* base: terreno redondo de maqueta, pasto y andadores */
  var base=new T.Mesh(new T.CylinderGeometry(7.4,7.6,.5,96),M(0xE6D6B8,{roughness:.95}));base.position.y=-.25;base.receiveShadow=SH;root.add(base);
  var lawn=new T.Mesh(new T.CylinderGeometry(6.9,6.9,.06,96),M(0x6F9A5E,{roughness:1}));lawn.position.y=.03;lawn.receiveShadow=SH;root.add(lawn);

  /* sombra suave bajo la casa */
  var sc=document.createElement("canvas");sc.width=sc.height=128;var g2=sc.getContext("2d"),gr=g2.createRadialGradient(64,64,6,64,64,64);
  gr.addColorStop(0,"rgba(30,40,60,.45)");gr.addColorStop(1,"rgba(30,40,60,0)");g2.fillStyle=gr;g2.fillRect(0,0,128,128);
  var sh=new T.Mesh(new T.PlaneGeometry(9,7),new T.MeshBasicMaterial({map:new T.CanvasTexture(sc),transparent:true,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.set(-.6,.07,-1.2);root.add(sh);

  /* la casa: planta baja abierta, planta alta con recámaras, azotea plana con pretil */
  var wall=M(0xF4F1EA),trim=M(0xD8D2C4),glassM=M(0x9FC3D6,{roughness:.15,metalness:.2,transparent:true,opacity:.85}),wood=M(0x9A6B45,{roughness:.8}),dark=M(0x3B4652);
  var H=new T.Group();H.position.set(-.6,0,-1.4);root.add(H);
  box(4.6,1.5,3.2,wall,0,.82,0,H);                                   // planta baja
  box(3.0,.06,1.3,glassM,-.4,.85,1.62,H);                           // ventanales al jardín
  box(4.9,.14,3.5,trim,0,1.62,0,H);                                 // losa
  box(3.6,1.35,3.0,wall,.5,2.37,-.1,H);                             // planta alta (4 recámaras)
  [[-0.6,2.4],[0.5,2.4],[1.6,2.4]].forEach(function(p){box(.62,.5,.05,glassM,p[0],p[1],1.43,H);});
  box(3.8,.12,3.2,trim,.5,3.1,-.1,H);                               // azotea
  box(3.8,.22,.08,trim,.5,3.27,1.46,H);box(3.8,.22,.08,trim,.5,3.27,-1.66,H);   // pretil
  box(.08,.22,3.2,trim,-1.36,3.27,-.1,H);box(.08,.22,3.2,trim,2.36,3.27,-.1,H);
  /* terraza superior con vista (sobre la losa, al frente izquierdo) con barandal */
  box(1.15,.05,1.6,wood,-1.85,1.72,.75,H);
  for(var bi=0;bi<6;bi++)box(.04,.4,.04,dark,-2.4,1.95,.05+bi*.28,H);
  box(.04,.04,1.6,dark,-2.4,2.15,.75,H);
  /* puerta y escalones */
  box(.55,.95,.06,wood,1.35,.55,1.62,H);

  /* terraza de planta baja con comedor y asador de ladrillo */
  var deck=box(3.2,.08,1.5,wood,-1.4,.1,1.15);
  box(1.0,.05,.6,M(0x6E5136),-1.6,.6,1.15);box(.06,.45,.06,dark,-1.6,.36,1.15);   // mesa
  var brick=M(0xB5573A,{roughness:.9});box(.7,.75,.55,brick,-2.75,.5,1.2);box(.55,.12,.4,dark,-2.75,.92,1.2);   // asador

  /* alberca climatizada con chapoteadero y camastros */
  var poolEdge=box(3.9,.16,2.5,M(0xEDE7DA),2.2,.1,1.9);
  var water=new T.Mesh(new T.PlaneGeometry(3.4,2.0,24,14),new T.MeshPhysicalMaterial({color:L(0x13A3BD),roughness:.1,metalness:0,clearcoat:.6,clearcoatRoughness:.08,envMapIntensity:.55,emissive:L(0x0A6A80),emissiveIntensity:.45}));
  water.rotation.x=-Math.PI/2;water.position.set(2.2,.19,1.9);root.add(water);
  var kid=new T.Mesh(new T.CylinderGeometry(.55,.55,.04,32),new T.MeshPhysicalMaterial({color:L(0x3CC4D6),roughness:.1,clearcoat:.5,envMapIntensity:.5,emissive:L(0x0F7484),emissiveIntensity:.4}));kid.position.set(.55,.2,2.55);root.add(kid);   // chapoteadero
  var lounger=M(0xF7F7F2);[[3.0,3.55],[1.9,3.55]].forEach(function(p){box(.42,.08,.9,lounger,p[0],.2,p[1]);box(.42,.25,.08,lounger,p[0],.33,p[1]-.42).rotation.x=-.5;});

  /* palmeras */
  function palm(x,z,hgt,lean){
    var p=new T.Group(),seg=6,trunkM=M(0x8C6A4A,{roughness:.95}),leafM=M(0x2F7444,{roughness:.8,side:T.DoubleSide});
    for(var s=0;s<seg;s++){var t=new T.Mesh(new T.CylinderGeometry(.09-s*.006,.11-s*.006,hgt/seg,8),trunkM);t.position.set(Math.sin(s/seg*1.2)*lean,hgt/seg*(s+.5),0);p.add(t);}
    var top=new T.Group();top.position.set(Math.sin(1.2)*lean,hgt,0);p.add(top);
    for(var l=0;l<9;l++){var leaf=new T.Mesh(new T.ConeGeometry(.22,1.5,4,1,true),leafM);leaf.scale.set(1,1,.25);leaf.position.y=.05;var arm=new T.Group();arm.rotation.y=l/9*Math.PI*2;leaf.rotation.z=-1.15;leaf.position.x=.65;arm.add(leaf);top.add(arm);}
    p.position.set(x,0,z);root.add(p);return top;
  }
  var tops=[palm(4.6,3.6,2.6,.35),palm(5.2,.4,3.0,-.3),palm(-4.4,2.9,2.4,.25),palm(-3.9,-3.6,2.8,-.2)];

  /* jardín cercado: postes y barda baja alrededor */
  var fenceM=M(0xCFC6B4);
  for(var f=0;f<64;f++){var a=f/64*Math.PI*2;if(a>5.15&&a<5.55)continue;   // hueco de la entrada
    box(.07,.42,.07,fenceM,Math.cos(a)*6.75,.25,Math.sin(a)*6.75);}
  var rail=new T.Mesh(new T.TorusGeometry(6.75,.025,6,160,Math.PI*2-.4),fenceM);rail.rotation.x=Math.PI/2;rail.rotation.z=5.55;   // el arco empieza en 5.55 rad y deja libre el hueco de la entrada (5.15–5.55)
 rail.position.y=.42;root.add(rail);
  /* entrada privada y estacionamiento */
  box(1.7,.04,2.4,M(0xBDB6A8,{roughness:1}),3.6,.06,-3.4);
  box(.08,.7,.08,dark,4.05,.38,-5.25);box(.08,.7,.08,dark,2.95,.38,-5.6);

  root.traverse(function(o){if(o.isMesh&&o!==base&&o!==lawn&&o!==sh){o.castShadow=SH;o.receiveShadow=SH;}});

  /* marcadores de cada parte (los botones de la sección) */
  var spots=[[2.2,.5,1.9],[-2.2,1.0,1.2],[0,2.9,-1.4],[-2.5,2.1,-.65],[-4.6,.6,-1.8],[3.6,.6,-3.4]];
  var markM=new T.MeshBasicMaterial({color:0xE8C87A}),mark=new T.Mesh(new T.SphereGeometry(.13,18,14),markM);root.add(mark);
  var halo=new T.Mesh(new T.RingGeometry(.2,.3,32),new T.MeshBasicMaterial({color:0xE8C87A,transparent:true,opacity:.8,side:T.DoubleSide}));root.add(halo);

  /* cámara, tamaño y adaptación */
  var dist=22,elev=10.5;
  /* encuadre: la base mide ~15 unidades; con fov 36 a ~24 de distancia el cuadro mide ~17.6 de ancho (cabe con aire) */
  function size(){var w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;r.setSize(w,h,false);cam.aspect=w/h;var mob=w<560;dist=mob?22.5:22;elev=mob?11:10.5;cam.fov=mob?38:36;cam.updateProjectionMatrix();}
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
