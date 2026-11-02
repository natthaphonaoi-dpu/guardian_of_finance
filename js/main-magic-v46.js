/* Stage-only ambient magic. Player effects keep their existing fixed settings. */
(()=>{
 'use strict';
 const scene=document.getElementById('scene'),canvas=document.getElementById('mainMagicCanvas');
 if(!scene||!canvas)return;
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let density=45,particles=[],w=0,h=0,last=0,dirty=true;
 function reset(){
  const r=scene.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.4);w=r.width;h=r.height;
  canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  const count=density===0?0:Math.min(reduced.matches?12:160,Math.round((innerWidth<700?80:150)*density/100));
  particles=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,r:.6+Math.random()*1.5,v:.12+Math.random()*.35,p:Math.random()*6.28,c:Math.random()>.83?'148,218,239':'255,215,145'}));
  canvas.dataset.particleCount=String(count);canvas.dataset.density=String(density);dirty=true;
 }
 function setDensity(value){
  const n=Math.max(0,Math.min(100,Math.round(Number(value)||0)));if(n===density&&w)return;
  density=n;scene.style.setProperty('--main-fog',String(n/100*.35));scene.style.setProperty('--main-rune',String(n/100*.16));
  scene.classList.toggle('main-fx-off',n===0);reset();
 }
 function draw(t){
  requestAnimationFrame(draw);if(document.hidden||t-last<40||(!dirty&&(reduced.matches||density===0)))return;
  const dt=Math.min(2,(t-last)/40||1);last=t;if(!w||Math.abs(scene.clientWidth-w)>2||Math.abs(scene.clientHeight-h)>2)reset();
  ctx.clearRect(0,0,w,h);
  for(const p of particles){
   if(!reduced.matches){p.y-=p.v*dt;p.x+=Math.sin(t*.0004+p.p)*.12*dt;if(p.y< -15){p.y=h+15;p.x=Math.random()*w}}
   const a=reduced.matches?.45:.35+Math.sin(t*.001+p.p)*.2;
   const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*5);g.addColorStop(0,'rgba('+p.c+','+a+')');g.addColorStop(1,'rgba('+p.c+',0)');
   ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.r*5,0,Math.PI*2);ctx.fill();
   if(p.r>1.65){ctx.strokeStyle='rgba('+p.c+','+a*.65+')';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(p.x-4,p.y);ctx.lineTo(p.x+4,p.y);ctx.moveTo(p.x,p.y-4);ctx.lineTo(p.x,p.y+4);ctx.stroke()}
  }dirty=false;
 }
 addEventListener('resize',()=>{w=0;dirty=true},{passive:true});
 reduced.addEventListener?.('change',()=>{reset()});
 window.GuardianStageFX46={setDensity};
 density=-1;setDensity(45);requestAnimationFrame(draw);
})();
