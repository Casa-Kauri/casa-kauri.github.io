/* Croquis interactivo de cómo llegar al Departamento Kauri (18 oct 2026). Hermano de croquis.js (Casa Kauri), pero aquí las
   calles no van trazadas a mano: salen de OpenStreetMap (datos.py → datos.json, inyectados por arma.py). Metros con origen en
   el pin de Google Maps del depa; x al este, z al sur (el norte queda arriba). Sentidos reales de OSM: Jacarandas entra desde la
   carretera y Av. del Sol Nuevo corre de un solo sentido hacia el sur, así que llegando por Jacarandas la vuelta es a la izquierda.
   El andador Colorines es peatonal: las zonas verdes son donde se estaciona en la calle. Ilustrativo: las casas no son las reales.
   Lee window.__motion (full | soft | off), __dpr, __adapt, __lowfx. No edites croquis-depa.js: edita esta plantilla y corre arma.py. */
(function(){
  var cv=document.getElementById("croquis-cv");
  if(!cv||!window.THREE)return;
  var D={"calles":[{"t":"residential","n":"Calle Jacaranda","p":[[324.8,16.3],[135.1,-144.6]]},{"t":"residential","n":"Avenida del Sol Nuevo","p":[[692.1,-348.6],[666.4,-329.7],[651.7,-322.3],[632.0,-318.1],[611.1,-320.7],[509.5,-342.8],[483.7,-341.4],[463.6,-327.7],[190.0,-86.6],[57.9,4.6],[20.6,28.0],[-118.2,101.1],[-312.0,190.3],[-335.8,195.5],[-496.0,203.2],[-622.2,184.7],[-681.6,167.8]]},{"t":"residential","n":"Avenida Guayabitos","p":[[-80.4,699.7],[-16.8,568.4],[7.4,526.1],[52.2,438.6],[78.6,396.7],[171.4,223.8],[201.5,158.6],[254.9,67.2],[290.3,-1.5],[511.5,-178.2],[516.8,-188.2],[514.3,-235.6],[521.0,-248.4],[534.5,-260.8],[568.7,-284.4],[572.9,-292.2],[579.2,-319.0]]},{"t":"residential","n":"Avenida Gardenias","p":[[-197.3,223.6],[-232.1,165.4]]},{"t":"residential","n":"Ciebas","p":[[-385.6,207.3],[-386.0,197.2]]},{"t":"residential","n":"Circulo Orquideas","p":[[-129.0,256.5],[-81.8,232.9],[-56.6,227.2],[-40.4,231.6],[-32.1,239.5],[-29.1,246.3],[-72.2,388.5],[-78.9,424.2],[-69.9,440.4],[-78.8,458.4],[-79.7,520.0],[-89.5,541.5],[-101.3,557.5],[-114.3,568.8],[-136.5,582.2]]},{"t":"residential","n":"Avenida Gardenias","p":[[-290.5,587.9],[-267.6,514.3],[-241.0,416.4],[-197.3,223.6],[-173.6,138.8]]},{"t":"residential","n":"Calle Jacaranda","p":[[128.3,-138.9],[320.2,23.6]]},{"t":"footway","n":"Andador Laureles","p":[[329.6,-317.1],[258.6,-379.3]]},{"t":"residential","n":"Andador Laureles","p":[[389.3,-260.6],[329.6,-317.1]]},{"t":"residential","n":"Calle Lirio Guayabitos","p":[[201.5,158.6],[132.1,109.1],[108.2,82.7],[61.3,10.0]]},{"t":"residential","n":"Calle del Loto","p":[[-371.0,196.6],[-361.7,280.3],[-336.8,313.3]]},{"t":"residential","n":"Retorno Jacarandas","p":[[226.6,-221.4],[128.3,-138.9],[-15.5,-40.8]]},{"t":"residential","n":"Retorno de Ceibas","p":[[-268.2,82.1],[-400.1,115.6],[-518.2,111.6],[-589.3,103.9]]},{"t":"residential","n":"Retorno Laureles","p":[[232.9,-227.3],[329.6,-317.1],[415.1,-403.7]]},{"t":"residential","n":"Retorno Tabachines","p":[[-15.5,-40.8],[-128.2,21.9],[-258.8,77.8]]},{"t":"footway","n":"Andador Tabachines","p":[[-128.2,21.9],[-174.6,-59.7]]},{"t":"residential","n":"Andador Tabachines","p":[[-96.4,89.8],[-128.2,21.9]]},{"t":"residential","n":"Calle Violetas","p":[[62.8,423.2],[57.2,388.7],[39.5,356.2],[29.1,343.9],[24.0,319.8],[21.5,284.6],[58.9,242.9],[86.0,199.6],[93.5,174.6],[95.3,156.2],[91.7,144.1],[82.4,132.1],[45.4,122.5],[-54.1,177.5],[-99.1,197.9],[-121.2,213.7],[-129.0,256.5],[-135.5,319.6],[-146.5,342.3],[-166.4,361.7]]},{"t":"footway","n":"Andador Cedros","p":[[420.2,-409.4],[348.7,-473.2]]},{"t":"footway","n":"Andador Jacarandas","p":[[45.2,-205.7],[133.0,-142.6]]},{"t":"footway","n":"Andador Huanacaxtle","p":[[-237.4,157.1],[-296.5,-5.1]]},{"t":"footway","n":"Andador Colorines","p":[[20.6,28.0],[-59.2,-123.0]]},{"t":"residential","n":"Calle Dalia","p":[[7.4,526.1],[-156.9,440.4],[-241.0,416.4],[-319.6,399.6]]},{"t":"footway","n":"Andador Mangles","p":[[283.8,-168.1],[229.7,-224.4],[163.2,-286.2]]},{"t":"footway","n":"Andador Ceiba","p":[[-409.1,29.3],[-400.1,115.6]]},{"t":"residential","n":"Calle del Loto","p":[[-336.8,313.3],[-329.3,329.4],[-322.8,352.5],[-316.6,421.6],[-315.0,480.5]]},{"t":"residential","n":"Andador Cedros","p":[[483.7,-341.4],[486.4,-345.6],[420.2,-409.4]]},{"t":"residential","n":"","p":[[676.9,-692.5],[664.6,-694.0]]},{"t":"residential","n":"Mesa","p":[[333.0,6.1],[342.9,20.3],[362.7,31.7],[368.4,37.1],[368.7,41.5],[366.6,48.0],[338.1,71.8],[333.2,80.9],[325.1,355.7],[328.2,378.1],[333.5,385.0],[344.1,388.4],[353.5,388.4],[386.1,378.4],[407.3,379.5]]},{"t":"track","n":"","p":[[-363.7,525.8],[-388.1,565.6],[-394.8,633.4],[-428.2,671.8],[-446.6,678.8],[-463.6,669.3],[-481.6,623.8],[-439.8,595.4],[-432.7,565.1],[-446.8,546.0],[-507.3,550.5],[-528.9,558.1],[-577.6,566.2],[-682.4,543.1]]},{"t":"residential","n":"","p":[[57.3,506.1],[139.7,560.3],[146.2,568.7],[138.2,621.7],[141.2,631.7],[147.7,637.1],[172.9,637.8],[180.2,632.3],[191.9,603.2],[195.5,583.5],[209.3,563.9]]},{"t":"residential","n":"","p":[[671.8,-323.0],[696.4,-283.4]]},{"t":"trunk","n":"Carretera Tepic-Puerto Vallarta","p":[[57.3,506.1],[183.0,268.8],[324.8,16.3]]},{"t":"residential","n":"Andador Mangles","p":[[289.8,-162.3],[340.5,-107.5]]},{"t":"residential","n":"Mangles","p":[[340.5,-107.5],[410.5,-164.1],[442.3,-193.4]]},{"t":"footway","n":"","p":[[340.5,-107.5],[313.1,-84.4]]},{"t":"residential","n":"Calle Caoba","p":[[579.1,-454.5],[536.6,-401.8],[486.4,-345.6]]},{"t":"residential","n":"Retorno Cedros","p":[[420.2,-409.4],[535.3,-541.8]]},{"t":"footway","n":"Andador Cocoteros","p":[[-622.2,184.7],[-561.1,35.0]]},{"t":"residential","n":"Privada Emilio M. Gonz\u00e1lez","p":[[535.3,-541.8],[571.5,-600.8],[579.0,-657.8],[598.5,-675.5]]},{"t":"residential","n":"Calle Mirasol","p":[[-581.0,363.5],[-577.2,367.9],[-495.1,390.9],[-482.6,399.7],[-475.1,413.5]]},{"t":"residential","n":"Retorno Miramar","p":[[-614.6,413.8],[-597.9,420.5],[-586.7,419.1],[-527.2,393.3],[-525.5,382.0]]},{"t":"trunk","n":"Carretera Tepic-Puerto Vallarta","p":[[696.4,-283.4],[586.5,-199.7],[440.4,-93.4],[343.4,-17.5],[318.0,9.6]]},{"t":"residential","n":"Retorno Sol Nuevo","p":[[-29.4,54.5],[-25.1,61.2]]},{"t":"residential","n":"","p":[[142.5,-55.5],[148.9,-48.2]]},{"t":"residential","n":"","p":[[337.3,-215.0],[343.0,-209.4]]},{"t":"residential","n":"","p":[[428.8,-296.3],[434.0,-290.7]]},{"t":"residential","n":"","p":[[539.6,-336.7],[538.4,-328.4]]},{"t":"residential","n":"Retorno Sol Nuevo","p":[[692.1,-348.6],[697.7,-341.8]]},{"t":"residential","n":"Avenida del Sol Nuevo","p":[[-684.1,174.8],[-614.0,193.9],[-495.7,212.8],[-320.7,202.2],[-251.7,174.6],[-173.6,138.8],[-92.0,98.1],[24.5,33.8],[75.1,1.2],[195.7,-81.1],[477.3,-328.5],[495.2,-335.3],[508.6,-335.2],[611.1,-311.9],[635.2,-309.2],[656.4,-314.1],[697.7,-341.8]]},{"t":"trunk","n":"Carretera Tepic-Puerto Vallarta","p":[[318.0,9.6],[255.2,120.7],[30.4,539.8],[-32.9,652.8]]},{"t":"residential","n":"Calle Clavel","p":[[-267.6,514.3],[-136.5,582.2],[-45.0,626.6]]},{"t":"residential","n":"Calle Miraflores","p":[[-566.1,330.6],[-533.7,333.4],[-467.7,351.3],[-453.6,358.6],[-441.2,371.9],[-438.6,385.1]]},{"t":"residential","n":"","p":[[-390.1,642.2],[-378.1,612.6],[-377.5,579.1],[-374.7,561.1],[-368.7,550.5],[-352.1,541.9]]},{"t":"residential","n":"","p":[[132.1,109.1],[150.4,62.4],[154.7,39.7]]},{"t":"residential","n":"","p":[[465.4,372.6],[469.5,379.5],[482.6,514.6]]},{"t":"service","n":"","p":[[-680.8,245.1],[-666.0,246.9],[-657.1,235.8],[-642.5,179.2]]},{"t":"residential","n":"","p":[[101.8,72.8],[175.9,26.5]]},{"t":"residential","n":"Retorno Sol Nuevo","p":[[-684.1,174.8],[-681.6,167.8]]},{"t":"residential","n":"","p":[[-565.6,202.7],[-563.6,193.8]]},{"t":"residential","n":"","p":[[-441.8,201.4],[-441.1,210.6]]},{"t":"service","n":"","p":[[-460.1,113.6],[-460.7,95.0],[-479.4,86.5],[-476.9,70.4],[-467.3,43.3]]},{"t":"residential","n":"","p":[[243.6,-133.0],[249.1,-127.1]]},{"t":"residential","n":"Calle Caoba","p":[[536.6,-401.8],[572.0,-372.0],[597.3,-354.4]]},{"t":"service","n":"","p":[[638.7,-266.1],[640.0,-296.7],[642.6,-301.8],[659.2,-307.2]]},{"t":"service","n":"","p":[[675.3,-267.4],[656.4,-314.1]]},{"t":"service","n":"","p":[[586.5,-199.7],[589.0,-218.5],[597.7,-233.4],[638.7,-266.1],[672.3,-274.8]]},{"t":"path","n":"Retorno Laureles","p":[[415.1,-403.7],[420.2,-409.4]]},{"t":"path","n":"Retorno Jacarandas","p":[[229.7,-224.4],[226.6,-221.4]]},{"t":"path","n":"Retorno Laureles","p":[[229.7,-224.4],[232.9,-227.3]]},{"t":"residential","n":"Calle 5 de Mayo","p":[[572.0,-372.0],[616.5,-424.6]]},{"t":"residential","n":"","p":[[407.3,379.5],[457.8,370.0],[465.4,372.6]]},{"t":"residential","n":"Mesa","p":[[407.3,379.5],[398.1,246.6],[404.5,228.3]]},{"t":"unclassified","n":"Calle Antonio Pinz\u00f3n","p":[[659.1,-241.2],[696.0,-189.4]]},{"t":"service","n":"","p":[[568.9,-175.6],[574.0,-156.5],[582.4,-144.6],[664.3,-111.1]]},{"t":"residential","n":"Andador Artesanal","p":[[175.9,26.5],[254.9,67.2]]},{"t":"footway","n":"Andador Artesanal","p":[[175.9,26.5],[134.9,-38.7]]},{"t":"residential","n":"Retorno Sol Nuevo","p":[[671.8,-323.0],[666.4,-329.7]]},{"t":"residential","n":"Andador La Higuera","p":[[91.7,144.1],[132.1,109.1]]},{"t":"residential","n":"Avenida Guayabitos","p":[[579.2,-319.0],[581.2,-327.0]]},{"t":"residential","n":"Calle Primavera","p":[[49.5,253.3],[-15.2,155.2]]},{"t":"residential","n":"Retorno Sol Nuevo","p":[[-622.2,184.7],[-624.3,191.2]]},{"t":"residential","n":"Ciebas","p":[[-386.0,197.2],[-400.1,115.6]]},{"t":"residential","n":"Avenida Gardenias","p":[[-232.1,165.4],[-237.4,157.1]]},{"t":"residential","n":"Avenida Gardenias","p":[[-173.6,138.8],[-179.1,129.7]]},{"t":"residential","n":"Loto","p":[[-336.8,313.3],[-313.8,328.9],[-166.4,361.7]]},{"t":"unclassified","n":"Calle Libramiento Los Ayala","p":[[-80.4,699.7],[-290.5,587.9],[-330.2,563.4],[-352.1,541.9],[-363.7,525.8],[-412.8,366.9],[-420.3,350.2],[-427.3,342.4],[-441.8,332.5],[-471.7,320.8],[-550.6,298.1],[-659.5,272.5]]},{"t":"residential","n":"","p":[[-69.9,440.4],[-55.6,443.7],[-30.4,443.6],[-19.2,439.4],[-12.0,429.6],[29.1,343.9]]},{"t":"residential","n":"Circulo Orqu\u00eddeas","p":[[-175.2,561.5],[-189.3,532.9],[-187.6,501.0],[-172.8,467.6],[-156.9,440.4],[-156.4,403.8],[-166.4,361.7]]},{"t":"residential","n":"Calle Agua Azul","p":[[-692.5,622.0],[-669.9,647.8],[-633.9,676.8]]},{"t":"residential","n":"Calle Mirador","p":[[-438.6,385.1],[-442.2,395.0],[-475.1,413.5],[-585.1,485.7]]},{"t":"residential","n":"Avenida Rinc\u00f3n de Miramar","p":[[-550.6,298.1],[-581.0,363.5]]},{"t":"footway","n":"","p":[[-268.2,82.1],[-258.8,77.8]]},{"t":"trunk","n":"Carretera Tepic-Puerto Vallarta","p":[[324.8,16.3],[351.0,-11.4],[387.8,-42.2],[659.1,-241.2]]},{"t":"service","n":"","p":[[609.1,-204.8],[639.9,-168.8]]},{"t":"service","n":"","p":[[375.3,-182.5],[401.1,-156.5]]}],"costa":[[591,-819],[546,-770],[535,-757],[504,-724],[384,-580],[171,-361],[79,-280],[-30,-195],[-166,-109],[-302,-44],[-403,-14],[-487,1],[-575,-5],[-625,-18],[-703,-52],[-765,-71],[-817,-95],[-844,-394],[-817,-426],[-810,-445],[-811,-454],[-820,-468],[-835,-477]],"playa":[[1297,-1654],[1297,-1654]],"ancho":{"trunk":13,"residential":7,"unclassified":7,"service":4.5,"footway":3.2,"path":2.5,"track":3}};
  var T=THREE,reduce=window.__motion==="off",r;
  try{r=new T.WebGLRenderer({canvas:cv,antialias:!window.__lowfx,alpha:true});}catch(e){return;}
  if(!r.getContext())return;
  document.documentElement.classList.add("cq-live");
  r.setPixelRatio(window.__dpr?window.__dpr():1);
  r.outputEncoding=T.sRGBEncoding;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.05;
  function L(h){return new T.Color(h).convertSRGBToLinear();}
  function M(c,o){var m=new T.MeshStandardMaterial(Object.assign({roughness:.9,metalness:0},o||{}));m.color=L(c);return m;}
  var scene=new T.Scene(),cam=new T.PerspectiveCamera(38,1,1,5000);
  scene.add(new T.HemisphereLight(L(0xfff1dc),L(0x6b7a63),.95));
  var sun=new T.DirectionalLight(L(0xffd29a),1.6);sun.position.set(300,400,300);scene.add(sun);

  /* mar abajo y tierra encima, recortada por la línea de costa (en OSM la tierra queda a la izquierda de la costa: al sureste) */
  var seaM=new T.MeshStandardMaterial({roughness:.25,metalness:.1,transparent:true,opacity:.95});seaM.color=L(0x3E8FB0);
  var sea=new T.Mesh(new T.PlaneGeometry(4000,4000),seaM);sea.rotation.x=-Math.PI/2;sea.position.y=-.4;scene.add(sea);
  function shape(pts){var s=new T.Shape();pts.forEach(function(p,i){i?s.lineTo(p[0],-p[1]):s.moveTo(p[0],-p[1]);});return s;}
  function flat(pts,mat,y){var m=new T.Mesh(new T.ShapeGeometry(shape(pts)),mat);m.rotation.x=-Math.PI/2;m.position.y=y;scene.add(m);return m;}
  var c0=D.costa[0],c1=D.costa[D.costa.length-1];
  var land=D.costa.concat([[-1100,c1[1]],[-1100,1100],[1100,1100],[1100,c0[1]]]);
  flat(land,M(0xD2D0BC),-.2);
  flat(D.playa,M(0xF3E2B8),-.1);

  /* listones de calle */
  function ribbon(pts,w,mat,y){
    var g=new T.BufferGeometry(),v=[],idx=[],k=0;
    for(var i=0;i<pts.length-1;i++){var a=pts[i],b=pts[i+1],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz)||1,nx=-dz/l*w/2,nz=dx/l*w/2;
      v.push(a[0]+nx,y,a[1]+nz,a[0]-nx,y,a[1]-nz,b[0]+nx,y,b[1]+nz,b[0]-nx,y,b[1]-nz);idx.push(k,k+2,k+1,k+1,k+2,k+3);k+=4;}
    g.setAttribute("position",new T.Float32BufferAttribute(v,3));g.setIndex(idx);g.computeVertexNormals();
    var m=new T.Mesh(g,mat);scene.add(m);return m;}
  ribbon(D.costa,5,new T.MeshBasicMaterial({color:0xF4F8FA,transparent:true,opacity:.8}),-.05);   // espuma
  var MAT={trunk:M(0x5F6469),residential:M(0x8D9196),unclassified:M(0x8D9196),service:M(0x9EA2A6),footway:M(0xE7D7B4),path:M(0xD8C7A2),track:M(0xC7A982)};
  var Y={trunk:.07,footway:.09,path:.03,track:.03};
  D.calles.forEach(function(s){ribbon(s.p,D.ancho[s.t],MAT[s.t],Y[s.t]||.05);});
  D.calles.forEach(function(s){if(s.t==="trunk")ribbon(s.p,.6,new T.MeshBasicMaterial({color:0xE8C87A}),.12);});   // raya de la carretera

  /* casas, hoteles y árboles con instancias (pocas mallas: va fluido en un celular) */
  function segDist(x,z,a,b){var dx=b[0]-a[0],dz=b[1]-a[1],t=((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz||1);t=Math.max(0,Math.min(1,t));return Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz);}
  function nearLine(x,z,p){var m=1e9;for(var i=0;i<p.length-1;i++)m=Math.min(m,segDist(x,z,p[i],p[i+1]));return m;}
  function near(x,z){var m=1e9;D.calles.forEach(function(s){if(s.t!=="track"&&s.t!=="path")m=Math.min(m,nearLine(x,z,s.p)-D.ancho[s.t]/2);});return m;}
  function inPoly(x,z,p){var c=false;for(var i=0,j=p.length-1;i<p.length;j=i++){if((p[i][1]>z)!==(p[j][1]>z)&&x<(p[j][0]-p[i][0])*(z-p[i][1])/(p[j][1]-p[i][1])+p[i][0])c=!c;}return c;}
  function onLand(x,z){return inPoly(x,z,land)&&!inPoly(x,z,D.playa)&&nearLine(x,z,D.costa)>45;}
  var seed=11;function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647;}
  var box=new T.BoxGeometry(1,1,1),wallM=M(0xF3EEE6,{roughness:.8}),roofM=M(0xC98A5E,{roughness:.8});
  var H=[],dummy=new T.Object3D();
  for(var i=0;i<4000&&H.length<520;i++){var x=-620+rnd()*1240,z=-620+rnd()*1240,d=near(x,z);if(d<3||d>26||!onLand(x,z))continue;if(Math.hypot(x-5,z+2)<16)continue;
    var hi=rnd()<.25?8+rnd()*8:3.5+rnd()*3.5;H.push([x,z,7+rnd()*8,7+rnd()*9,hi,rnd()*.4-.2]);}
  var hm=new T.InstancedMesh(box,wallM,H.length),rm=new T.InstancedMesh(box,roofM,H.length);
  H.forEach(function(h,i){dummy.position.set(h[0],h[4]/2,h[1]);dummy.rotation.set(0,.6+h[5],0);dummy.scale.set(h[2],h[4],h[3]);dummy.updateMatrix();hm.setMatrixAt(i,dummy.matrix);
    dummy.position.y=h[4]+.3;dummy.scale.set(h[2]+.6,.6,h[3]+.6);dummy.updateMatrix();rm.setMatrixAt(i,dummy.matrix);});
  scene.add(hm);scene.add(rm);
  var treeG=new T.ConeGeometry(1,1,7),treeM=M(0x4E7F45),trunkG=new T.CylinderGeometry(.25,.35,1,6),trunkM=M(0x7A5C41);
  var TR=[];for(var j=0;j<3000&&TR.length<260;j++){var tx=-620+rnd()*1240,tz=-620+rnd()*1240;if(!onLand(tx,tz)||near(tx,tz)<3)continue;TR.push([tx,tz,4+rnd()*5]);}
  var tm=new T.InstancedMesh(treeG,treeM,TR.length),km=new T.InstancedMesh(trunkG,trunkM,TR.length);
  TR.forEach(function(t,i){dummy.rotation.set(0,0,0);dummy.position.set(t[0],t[2]*.75+1.5,t[1]);dummy.scale.set(t[2]*.45,t[2]*1.1,t[2]*.45);dummy.updateMatrix();tm.setMatrixAt(i,dummy.matrix);
    dummy.position.set(t[0],1,t[1]);dummy.scale.set(1,2,1);dummy.updateMatrix();km.setMatrixAt(i,dummy.matrix);});
  scene.add(tm);scene.add(km);
  /* palmeras en la orilla de la arena, del lado del pueblo */
  var palmM=M(0x2F7444,{side:T.DoubleSide});
  for(var q=0;q<D.costa.length-1;q++){var a=D.costa[q],b=D.costa[q+1],len=Math.hypot(b[0]-a[0],b[1]-a[1]);
    for(var u=0;u<len;u+=38){var f=u/len,px=a[0]+(b[0]-a[0])*f,pz=a[1]+(b[1]-a[1])*f,nx=(b[1]-a[1])/len,nz=-(b[0]-a[0])/len;   // normal hacia tierra (con z al sur, la izquierda de OSM queda de este lado)
      px+=nx*(28+rnd()*10);pz+=nz*(28+rnd()*10);if(Math.abs(px)>650||Math.abs(pz)>650)continue;var g=new T.Group();
      var tr=new T.Mesh(new T.CylinderGeometry(.3,.45,9,6),trunkM);tr.position.y=4.5;g.add(tr);
      for(var l=0;l<6;l++){var lf=new T.Mesh(new T.ConeGeometry(.9,6,4,1,true),palmM);lf.scale.z=.25;lf.rotation.z=-1.2;lf.position.set(2.5,0,0);var ar=new T.Group();ar.rotation.y=l/6*Math.PI*2;ar.add(lf);ar.position.y=9;g.add(ar);}
      g.position.set(px,0,pz);scene.add(g);}}

  /* el depa: torre angosta de tres niveles con el rooftop y su techo de teja en una parte, alineada al andador */
  var HOME=[5,-2],depa=new T.Group(),white=M(0xFBFAF7,{roughness:.7});
  [[0,3.2],[3.4,3.2],[6.8,3.2]].forEach(function(n,i){var lv=new T.Mesh(new T.BoxGeometry(8,n[1]-.2,11),i===2?M(0xF1E7D6):white);lv.position.y=n[0]+n[1]/2;depa.add(lv);});
  var teja=new T.Mesh(new T.BoxGeometry(8.6,.5,5),M(0xC98A5E));teja.position.set(0,10.4,-3);depa.add(teja);
  var tienda=new T.Mesh(new T.BoxGeometry(8.2,1.1,.4),M(0xE8C87A));tienda.position.set(0,2.2,5.7);depa.add(tienda);
  depa.rotation.y=Math.atan2(-15.5-20.6,-40.8-28);depa.position.set(HOME[0],0,HOME[1]);scene.add(depa);

  /* zonas de estacionamiento en la calle: Av. del Sol Nuevo junto al andador y el Retorno del lado de la playa */
  var parkM=new T.MeshBasicMaterial({color:0x3E9B5B,transparent:true,opacity:.85,toneMapped:false,side:T.DoubleSide});
  /* Corrección de Dalí (18 oct): el Retorno NO cruza el andador frente al depa (ese tramo es andador) y la opción 2 es del otro
     lado, en el Retorno Tabachines; se llega por Sol Nuevo, pasando Colorines, a la derecha y otra vez a la derecha. */
  ribbon([[-1,-48.5],[-30,-33]],9.5,MAT.footway,.11);
  var zonas=[ribbon([[57.9,4.6],[20.6,28],[-40,61]],8.5,parkM,.5),ribbon([[-32,-31.9],[-128.2,21.9]],8,parkM,.5)];
  zonas.forEach(function(z){z.visible=false;});

  /* marcadores con etiqueta HTML */
  var stage=cv.parentNode,EN=document.documentElement.getAttribute("data-l")==="en";
  var marks=[
    {k:"home",p:HOME,y:18,t:EN?"Departamento Kauri":"Departamento Kauri",cls:"home"},
    {k:"p1",p:[28,21],y:7,t:EN?"P · Parking 1":"P · Estaciónate aquí",cls:"park"},
    {k:"p2",p:[-62,-14],y:7,t:EN?"P · Parking 2":"P · Opción 2",cls:"park"},
    {k:"izq",p:[300,-6],y:2,t:EN?"Turn left":"Vuelta a la izquierda",cls:"turn"},
    {k:"der",p:[300,-6],y:2,t:EN?"Turn right":"Vuelta a la derecha",cls:"turn"},
    {k:"izq2",p:[196,-92],y:2,t:EN?"Left on Sol Nuevo":"Izquierda en Sol Nuevo",cls:"turn"},
    {k:"playa",p:[-95,-150],y:6,t:EN?"Guayabitos beach":"Playa de Guayabitos",cls:"beach"},
    {k:"tepic",p:[560,-180],y:4,t:EN?"To Tepic and Guadalajara":"A Tepic y Guadalajara",cls:"road"},
    {k:"vallarta",p:[150,330],y:4,t:EN?"To Puerto Vallarta":"A Puerto Vallarta",cls:"road"},
    {k:"solnuevo",p:[-150,128],y:3,t:"Av. del Sol Nuevo",cls:"road"},
    {k:"jacarandas",p:[255,-40],y:3,t:"Calle Jacarandas",cls:"road"},
    {k:"colorines",p:[-40,-84],y:3,t:"Andador Colorines",cls:"road"},
    {k:"retorno",p:[-150,25],y:3,t:"Retorno Tabachines",cls:"road"}
  ];
  marks.forEach(function(m){m.el=document.createElement("span");m.el.className="cq-tag "+m.cls;m.el.textContent=m.t;stage.appendChild(m.el);
    if(m.cls==="home"||m.cls==="beach"||m.cls==="park"){var pin=new T.Mesh(new T.CylinderGeometry(.6,.6,m.y,8),new T.MeshBasicMaterial({color:m.cls==="home"?0xE8C87A:m.cls==="park"?0x3E9B5B:0x1F2F54}));pin.position.set(m.p[0],m.y/2,m.p[1]);scene.add(pin);}});

  /* recorridos: los puntos son nodos reales de OSM (carretera → Jacarandas → Sol Nuevo → andador) */
  var JAC=[[318,9.6],[296.9,-8.1],[201.9,-86.2],[196.2,-91.6]],SOL=[[142.5,-55.5],[57.9,4.6],[22,27]];
  var routes={
    auto:{tags:["home","izq","izq2","vallarta","jacarandas"],pts:[[140,350],[183,268.8],[234.2,178.4],[320.2,23.6],[324.8,16.3]].concat(JAC,SOL),w:12,col:0xE09A2B,speed:90},
    gdl:{tags:["home","der","izq2","tepic","jacarandas"],pts:[[586.5,-199.7],[440.4,-93.4],[343.4,-17.5],[325.7,.4]].concat(JAC,SOL),w:12,col:0xE09A2B,speed:90},
    estacionar:{tags:["home","p1","p2","solnuevo","jacarandas","colorines","retorno"],pts:[[142.5,-55.5],[57.9,4.6],[-96.4,89.8],[-128.2,21.9],[-62,-14]],w:7,col:0x2E4A8C,speed:60,zonas:true,view:{c:[-20,10],d:300}},
    playa:{tags:["home","playa","colorines"],pts:[[HOME[0],HOME[1]],[-15.5,-40.8],[-59.2,-123],[-83,-160]],w:7,col:0xD9603B,speed:45,view:{c:[-35,-75],d:240}}
  };
  function sample(pts){var o=[pts[0]],L2=0;for(var i=0;i<pts.length-1;i++){var a=pts[i],b=pts[i+1],l=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.round(l/2));for(var k=1;k<=n;k++)o.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n]);L2+=l;}o.len=L2;return o;}
  Object.keys(routes).forEach(function(k){var R=routes[k];R.s=sample(R.pts);R.mesh=ribbon(R.s,R.w,new T.MeshBasicMaterial({color:R.col,side:T.DoubleSide,toneMapped:false}),.7);R.mesh.visible=false;
    var xs=R.s.map(function(p){return p[0];}),zs=R.s.map(function(p){return p[1];});R.c=[(Math.min.apply(0,xs)+Math.max.apply(0,xs))/2,(Math.min.apply(0,zs)+Math.max.apply(0,zs))/2];R.span=Math.max(Math.max.apply(0,xs)-Math.min.apply(0,xs),Math.max.apply(0,zs)-Math.min.apply(0,zs));});
  var walker=new T.Mesh(new T.SphereGeometry(5,18,14),new T.MeshBasicMaterial({color:0xffffff,toneMapped:false}));scene.add(walker);var wcore=new T.Mesh(new T.SphereGeometry(3,16,12),new T.MeshBasicMaterial({color:0x1F2F54,toneMapped:false}));walker.add(wcore);wcore.position.y=1.5;walker.scale.set(1,.5,1);
  var halo=new T.Mesh(new T.RingGeometry(7,9.5,32),new T.MeshBasicMaterial({color:0xE8C87A,transparent:true,opacity:.7,side:T.DoubleSide}));halo.rotation.x=-Math.PI/2;scene.add(halo);

  /* cámara: encuadra el recorrido elegido; se gira arrastrando. Empieza mirando desde el sureste, con el mar al fondo */
  var cur=null,prog=1,yaw=.75,goalYaw=.75,ctr=[0,0],goalCtr=[0,0],dist=520,goalDist=520,down=false,lx=0;
  function size(){var w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();}
  addEventListener("resize",size);size();
  var adapt=window.__adapt?window.__adapt(r,size):null;
  function pick(k){cur=routes[k];Object.keys(routes).forEach(function(n){routes[n].mesh.visible=n===k;});zonas.forEach(function(z){z.visible=!!cur.zonas;});prog=reduce?1:0;
    goalCtr=cur.view?cur.view.c.slice():cur.c.slice();goalDist=cur.view?cur.view.d/Math.min(1,cam.aspect):Math.max(300,cur.span*1.45/Math.min(1,cam.aspect*.9));if(reduce){ctr=goalCtr.slice();dist=goalDist;}}
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
    if(cur){var n=Math.max(1,Math.floor((cur.s.length-1)*prog));cur.mesh.geometry.setDrawRange(0,n*6);var p=cur.s[n];walker.position.set(p[0],3,p[1]);halo.position.set(p[0],.8,p[1]);
      var t=now/1000;halo.scale.setScalar(reduce?1:1+(t%1)*.8);halo.material.opacity=reduce?.7:.7*(1-t%1);
      if(cur.zonas)parkM.opacity=reduce?.85:.7+Math.sin(now/400)*.15;}
    seaM.opacity=.92+Math.sin(now/900)*.03;
    r.render(scene,cam);
    var w=cv.clientWidth,h=cv.clientHeight;
    marks.forEach(function(m){v3.set(m.p[0],m.y+3,m.p[1]).project(cam);var on=v3.z<1&&Math.abs(v3.x)<1.05&&Math.abs(v3.y)<1.05&&(!cur||cur.tags.indexOf(m.k)>=0);
      m.el.style.transform="translate("+((v3.x+1)/2*w)+"px,"+((1-v3.y)/2*h)+"px) translate(-50%,-100%)";m.el.style.opacity=on?1:0;});
  }
  function loop(now){if(adapt)adapt(now);draw(now);if(vis)requestAnimationFrame(loop);}
  var first=document.querySelector(".cq-routes [aria-pressed=true]");pick(first?first.getAttribute("data-r"):"auto");
  requestAnimationFrame(loop);
})();
