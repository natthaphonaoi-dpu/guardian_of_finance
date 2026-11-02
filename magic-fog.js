/* Guardian of Finance V3 — textured volumetric ground smoke. No oval sprites. */
(()=>{'use strict';
const scenes=[...document.querySelectorAll('main .scene')];
const motion=matchMedia('(prefers-reduced-motion:reduce)');
const rand=(n)=>{let x=Math.sin(n*127.1+78.233)*43758.5453;return x-Math.floor(x)};
// Coherent multiscale field, giving smoke-like irregular edges instead of geometric blobs.
function texture(seed){const cw=384,ch=154,c=document.createElement('canvas');c.width=cw;c.height=ch;const ctx=c.getContext('2d');const image=ctx.createImageData(cw,ch);const scales=[14,31,68,137];const grids=scales.map((s,k)=>{const w=Math.ceil(cw/s)+2,h=Math.ceil(ch/s)+2;return{scale:s,w,h,v:Float32Array.from({length:w*h},(_,i)=>rand(i*2.7+seed*47+k*19))}});
const interp=(a,b,t)=>a+(b-a)*(t*t*(3-2*t));
function noise(g,x,y){const xx=x/g.scale, yy=y/g.scale;const ix=Math.floor(xx),iy=Math.floor(yy),fx=xx-ix,fy=yy-iy;let p=(x,y)=>g.v[Math.max(0,Math.min(g.h-1,y))*g.w+Math.max(0,Math.min(g.w-1,x))];return interp(interp(p(ix,iy),p(ix+1,iy),fx),interp(p(ix,iy+1),p(ix+1,iy+1),fx),fy)}
for(let y=0;y<ch;y++)for(let x=0;x<cw;x++){let value=0,weight=0;[.12,.19,.3,.39].forEach((w,i)=>{value+=noise(grids[i],x,y)*w;weight+=w});value/=weight;
 const vertical=y/ch; const edge=Math.pow(Math.max(0,Math.min(1,(vertical-.13)*1.48)),1.36); const feather=Math.pow(Math.min(1,x/25,(cw-x)/25),.48);
 const alpha=Math.min(205,Math.max(0,(value-.35)*450))*edge*feather;const j=(y*cw+x)*4;image.data[j]=202;image.data[j+1]=214;image.data[j+2]=230;image.data[j+3]=alpha;
}
ctx.putImageData(image,0,0);return c;}
const sheets=[texture(11),texture(27),texture(42)];
const items=scenes.map(scene=>{const canvas=document.createElement('canvas');canvas.className='magic-fog-canvas';canvas.setAttribute('aria-hidden','true');scene.append(canvas);return{scene,canvas,ctx:canvas.getContext('2d'),w:0,h:0}});
function setup(s){const r=s.scene.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1);s.w=Math.max(1,r.width);s.h=Math.max(1,r.height);s.canvas.width=Math.ceil(s.w*dpr);s.canvas.height=Math.ceil(s.h*dpr);s.ctx.setTransform(dpr,0,0,dpr,0,0);}
let last=0;
function frame(t){requestAnimationFrame(frame);if(document.hidden||t-last<83)return;last=t;
 for(const s of items){if(!s.scene.classList.contains('active'))continue;if(!s.w||Math.abs(s.scene.clientWidth-s.w)>2||Math.abs(s.scene.clientHeight-s.h)>2)setup(s);
 const g=s.ctx,w=s.w,h=s.h;g.clearRect(0,0,w,h);const high=s.scene.id==='result';const depth=high?.46:.34;
 for(let i=0;i<3;i++){const img=sheets[i],drift=motion.matches?0:t*(i%2?-.006:.008)*(1+i*.17);const bandH=h*(depth+.075*i);const y=h-bandH+h*(i*.03);const offset=((drift%(w*.52))+(w*.52))%(w*.52);g.globalAlpha=high?[.53,.38,.29][i]:[.43,.32,.23][i];
 // Textures overlap horizontally, producing continuous shifting smoky filaments.
 g.drawImage(img,-w*.51+offset,y,w*1.52,bandH);g.drawImage(img,w*1.01+offset,y,w*1.52,bandH);
 }
 g.globalAlpha=1;
 const floor=g.createLinearGradient(0,h*.77,0,h);floor.addColorStop(0,'rgba(194,206,226,0)');floor.addColorStop(.75,'rgba(193,207,225,.035)');floor.addColorStop(1,high?'rgba(192,207,228,.13)':'rgba(192,207,228,.075)');g.fillStyle=floor;g.fillRect(0,h*.77,w,h*.23);
 }}
addEventListener('resize',()=>items.forEach(s=>s.w=0),{passive:true});requestAnimationFrame(frame);
})();
