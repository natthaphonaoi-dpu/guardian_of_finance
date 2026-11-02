/* V3.3: no envelope. Lightweight flash and centered-to-layout card motion. */
(()=>{'use strict';
const result=document.getElementById('result');
const stage=result?.querySelector('.card-stage');
const grid=result?.querySelector('.result-grid');
const info=result?.querySelector('.result-info');
if(!result||!stage||!grid||!info)return;
const ns='http://www.w3.org/2000/svg';
function el(tag,attrs,parent){const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));parent.appendChild(n);return n}
const svg=el('svg',{viewBox:'0 0 500 500','aria-hidden':'true'},document.createElementNS(ns,'g'));
function ring(group,rs){rs.forEach((r,i)=>el('circle',{cx:250,cy:250,r,opacity:i%2?.43:.82},group))}
const out=el('g',{class:'sigil-outer'},svg),inner=el('g',{class:'sigil-inner'},svg),center=el('g',{class:'sigil-center'},svg);
ring(out,[236,223,205]);ring(inner,[180,166,142]);ring(center,[119,101,74,50]);
for(let i=0;i<48;i++){let a=i*Math.PI/24;let major=i%4===0;el('line',{x1:250+Math.cos(a)*(major?206:224),y1:250+Math.sin(a)*(major?206:224),x2:250+Math.cos(a)*235,y2:250+Math.sin(a)*235,opacity:major?.9:.33},out)}
for(let i=0;i<8;i++){const p=[0,120,240].map(d=>{let a=(d+i*45)*Math.PI/180;return [250+142*Math.cos(a),250+142*Math.sin(a)].join(',')}).join(' ');el('polygon',{points:p,opacity:i%2?.24:.45},inner)}
for(let i=0;i<10;i++){let a=i*Math.PI/5;el('circle',{cx:250+183*Math.cos(a),cy:250+183*Math.sin(a),r:4.5,opacity:.8},out)}
const sigil=document.createElement('div');sigil.className='arcane-sigil';sigil.setAttribute('aria-hidden','true');sigil.appendChild(svg);stage.prepend(sigil);
const flash=document.createElement('div');flash.className='arcane-flash';flash.setAttribute('aria-hidden','true');stage.append(flash);
// Short-lived light dust; the permanent magic circle does not participate in the burst.
const sparks=document.createElement('div');sparks.className='arcane-sparks';sparks.setAttribute('aria-hidden','true');
for(let i=0;i<24;i++){const d=document.createElement('i');d.style.setProperty('--angle',`${i*137.508%360}deg`);d.style.setProperty('--distance',`${65+(i%7)*20}px`);d.style.setProperty('--size',`${2+(i%3)*1.1}px`);d.style.setProperty('--delay',`${(i%8)*.12}s`);sparks.append(d)}stage.append(sparks);

const card=stage.querySelector('.card');
const title=result.querySelector('.result-title');
const eyebrow=result.querySelector('.result-wrap > .eyebrow');
const hint=stage.querySelector('.flip-hint');
const prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const DURATION=7200;
let running=[],timer=null,token=0;
function cancel(){if(timer){clearTimeout(timer);timer=null}for(const a of running)a.cancel();running=[]}
function animate(node,frames,options){if(!node)return;running.push(node.animate(frames,{fill:'both',...options}))}
function offsetToCenter(){
 const sr=stage.getBoundingClientRect(),gr=grid.getBoundingClientRect();
 if(window.matchMedia('(max-width:690px)').matches)return 0;
 return gr.left+gr.width/2-(sr.left+sr.width/2);
}
function prepare(){
 token++;cancel();result.classList.remove('reveal-finished');result.classList.add('reveal-running');
 stage.classList.remove('flip-animate');
 card.classList.remove('flipped');
}
function reveal(){
 prepare();const own=token;
 // Layout is never altered mid-animation: all stages stay in their final grid positions.
 const dx=offsetToCenter();
 if(prefersReduced.matches){
   // Accessibility setting: show the result without flashing.
   finish(own);
   return;
 }
 const ease='cubic-bezier(.22,1,.36,1)';
 // 0–3.0: centered card materializes in a single gentle, continuous motion.
 animate(card,[
  {opacity:0,transform:'translate3d(0,32px,0) scale(.90)',filter:'brightness(1.5)',offset:0},
  {opacity:.26,transform:'translate3d(0,24px,0) scale(.93)',filter:'brightness(1.38)',offset:.25},
  {opacity:1,transform:'translate3d(0,0,0) scale(1)',filter:'brightness(1)',offset:1}
 ],{duration:3000,easing:'cubic-bezier(.38,0,.22,1)'});
 animate(flash,[
  {opacity:0,transform:'scale(.65)',offset:0},
  {opacity:.24,transform:'scale(.80)',offset:.27},
  {opacity:.85,transform:'scale(1)',offset:.56},
  {opacity:.28,transform:'scale(1.16)',offset:.82},
  {opacity:0,transform:'scale(1.28)',offset:1}
 ],{duration:3000,easing:'ease-in-out'});
 for(const [i,p] of [...sparks.children].entries()){
  animate(p,[
   {opacity:0,transform:'rotate(var(--angle)) translateX(0px) scale(.4)',offset:0},
   {opacity:.65,offset:.42},
   {opacity:0,transform:'rotate(var(--angle)) translateX(var(--distance)) scale(.2)',offset:1}
  ],{duration:2300,delay:650+i%6*60,easing:'ease-out'});
 }
 // Move with ONE keyframed transform, instead of competing CSS transitions.
 animate(stage,[
  {transform:`translate3d(${dx}px,0,0)`,offset:0},
  {transform:`translate3d(${dx}px,0,0)`,offset:3000/DURATION,easing:'cubic-bezier(.45,0,.18,1)'},
  {transform:'translate3d(0,0,0)',offset:5550/DURATION},
  {transform:'translate3d(0,0,0)',offset:1}
 ],{duration:DURATION,easing:'linear'});
 // Fade the sigil in independently AFTER the light; not part of the flash.
 animate(sigil,[{opacity:0},{opacity:.69}],{duration:2000,delay:3100,easing:'ease-in-out'});
 const ir=info.getBoundingClientRect(),sr=stage.getBoundingClientRect();
 const mobile=matchMedia('(max-width:690px)').matches;
 const origin=mobile?0:Math.max(-240,Math.min(-35,(sr.left+sr.width/2)-(ir.left+ir.width/2)));
 // Information grows from near the card, and arrives gradually over 2.5 sec.
 animate(info,[
  {opacity:0,transform:`translate3d(${origin}px,18px,0)`,offset:0},
  {opacity:.12,transform:`translate3d(${origin*.81}px,16px,0)`,offset:.23},
  {opacity:.64,transform:`translate3d(${origin*.27}px,6px,0)`,offset:.71},
  {opacity:1,transform:'translate3d(0,0,0)',offset:1}
 ],{duration:2500,delay:4650,easing:'cubic-bezier(.42,0,.22,1)'});
 for(const [node,delay] of [[eyebrow,3750],[title,3980],[hint,5700]]){
  animate(node,[{opacity:0,transform:'translate3d(0,10px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:1900,delay,easing:ease});
 }
 timer=setTimeout(()=>finish(own),DURATION+60);
}
function finish(own){if(own!==token)return;
 // Set base-state FIRST, then discard forward-filled compositor animations.
 result.classList.add('reveal-finished');result.classList.remove('reveal-running');
 cancel();
}
function flip(){stage.classList.remove('flip-animate');void stage.offsetWidth;stage.classList.add('flip-animate');setTimeout(()=>stage.classList.remove('flip-animate'),1100)}
function reset(){token++;cancel();result.classList.remove('reveal-running','reveal-finished');stage.classList.remove('flip-animate')}
window.GuardianResultMagic={prepare,reveal,flip,reset,duration:DURATION};
})();
