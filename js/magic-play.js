/* Guardian of Finance: enchanted lightning-bolt particle field. */
(function () {
  'use strict';
  const root = document.getElementById('magicHeart');
  if (!root || root.dataset.initialized || !window.THREE || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const host = root.querySelector('.magic-heart-canvas');
  if (!host) return;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({alpha:true, antialias:false, powerPreference:'low-power'}); }
  catch (e) { return; }
  root.dataset.initialized = 'true';
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42,1,.1,1000);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,1.5));
  renderer.setClearColor(0x000000,0);
  host.appendChild(renderer.domElement);

  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = textureCanvas.height = 128;
  const ctx = textureCanvas.getContext('2d');
  const grad = ctx.createRadialGradient(64,64,0,64,64,64);
  grad.addColorStop(0,'rgba(255,255,255,1)');
  grad.addColorStop(.13,'rgba(255,251,212,1)');
  grad.addColorStop(.35,'rgba(255,218,100,.78)');
  grad.addColorStop(.7,'rgba(238,153,26,.12)');
  grad.addColorStop(1,'rgba(255,174,20,0)');
  ctx.fillStyle = grad; ctx.fillRect(0,0,128,128);
  const texture = new THREE.CanvasTexture(textureCanvas);

  // Zigzag silhouette: points travel around the perimeter of a lightning bolt.
  const outline = [
    [-3.3,20.0],[8.5,20.0],[1.3,5.0],[10.6,5.0],
    [-8.0,-20.0],[-3.5,-3.8],[-11.0,-3.8]
  ];
  function inside(x,y) {
    let hit = false;
    for (let i=0,j=outline.length-1;i<outline.length;j=i++) {
      const a=outline[i],b=outline[j];
      if (((a[1]>y)!==(b[1]>y)) && x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]) hit=!hit;
    }
    return hit;
  }
  const count = window.innerWidth < 768 ? 1700 : 3500;
  const positions = new Float32Array(count*3);
  const colors = new Float32Array(count*3);
  const phases = new Float32Array(count);
  const palette = ['#FFFDEB','#FFF1B6','#FFE077','#FFD057','#EAB246','#FFFFFF'].map(x=>new THREE.Color(x));
  for (let i=0;i<count;i++) {
    let x=0,y=0;
    for (let tries=0;tries<200;tries++) {
      x=(Math.random()-.5)*24; y=(Math.random()-.5)*43;
      if (inside(x,y)) break;
    }
    const k=i*3,c=palette[Math.floor(Math.random()*palette.length)];
    positions[k]=x; positions[k+1]=y; positions[k+2]=(Math.random()-.5)*5;
    colors[k]=c.r; colors[k+1]=c.g; colors[k+2]=c.b;
    phases[i]=Math.random()*Math.PI*2;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
  const material = new THREE.PointsMaterial({size:.47,map:texture,vertexColors:true,transparent:true,opacity:.94,blending:THREE.AdditiveBlending,depthWrite:false,sizeAttenuation:true});
  const bolt = new THREE.Points(geometry,material); scene.add(bolt);

  // Gold sparks orbit the bolt and make the edges feel electrically charged.
  const sparkCount = window.innerWidth < 768 ? 100 : 220;
  const sparkPositions = new Float32Array(sparkCount*3);
  for (let i=0;i<sparkCount;i++) {
    const k=i*3;
    sparkPositions[k]=(Math.random()-.5)*42;
    sparkPositions[k+1]=(Math.random()-.5)*48;
    sparkPositions[k+2]=(Math.random()-.5)*16;
  }
  const sparkGeometry=new THREE.BufferGeometry();
  sparkGeometry.setAttribute('position',new THREE.BufferAttribute(sparkPositions,3));
  const sparkMaterial=new THREE.PointsMaterial({color:'#FFE9A6',size:.2,map:texture,transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false});
  const sparks=new THREE.Points(sparkGeometry,sparkMaterial);scene.add(sparks);

  let visible=true,last=0,raf=0,targetRotation=0;
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});observer.observe(root);
  root.addEventListener('pointermove',e=>{
    const rect=root.getBoundingClientRect();
    targetRotation=((e.clientX-rect.left)/rect.width-.5)*.3;
  });
  root.addEventListener('pointerleave',()=>{targetRotation=0;});
  function resize(){
    const w=host.clientWidth,h=host.clientHeight;
    if (!w||!h)return;
    camera.aspect=w/h;
    camera.position.z=w<600?100:82;
    camera.updateProjectionMatrix();
    renderer.setSize(w,h,false);
  }
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);resize();
  function animate(ms){
    raf=requestAnimationFrame(animate);
    const welcome=document.getElementById('welcome');
    if (!visible||document.hidden||!welcome||!welcome.classList.contains('active'))return;
    if (ms-last<32)return;
    last=ms;
    const t=ms/1000;
    // Electrical pulses: irregular bright flashes rather than a heartbeat.
    const flash=Math.pow(Math.max(0,Math.sin(t*7.3)*Math.sin(t*2.1+.7)),5);
    material.opacity=.76+flash*.22;
    bolt.scale.setScalar(1+flash*.018);
    const desired=Math.sin(t*.25)*.09+targetRotation;
    bolt.rotation.y+=(desired-bolt.rotation.y)*.035;
    bolt.rotation.z=Math.sin(t*.31)*.035;
    sparks.rotation.z=t*.015;
    sparks.rotation.y=t*.024;
    sparkMaterial.opacity=.28+flash*.36+.08*Math.sin(t*1.8);
    renderer.render(scene,camera);
  }
  raf=requestAnimationFrame(animate);
  window.addEventListener('pagehide',()=>{
    cancelAnimationFrame(raf);observer.disconnect();resizeObserver.disconnect();
    geometry.dispose();sparkGeometry.dispose();material.dispose();sparkMaterial.dispose();texture.dispose();renderer.dispose();
  },{once:true});
})();
