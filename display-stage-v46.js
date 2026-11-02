(()=>{
 'use strict';
 const M=window.GuardianStage46,S=window.GuardianStageService46,$=id=>document.getElementById(id);
 const root=$('scene'),front=root.querySelector('.display-backdrop'),back=root.querySelector('.hybrid-backdrop-next');
 let state=M.clean({...M.defaults,epoch:Date.now()}),last='',current='',timer,localScene=null,reading=false;
 $('playerLink').href=new URL('play.html',location.href).href;
 function show(id){
  const scene=M.scenes.find(x=>x.id===id);if(!scene)return;
  const wealth=id==='wealth';
  // Exactly one scan panel is visible. Each panel retains its own QR + URL pair.
  $('guardianScanPanel').hidden=wealth;$('wealthScanPanel').hidden=!wealth;
  root.className='scene '+id;
  $('title').textContent=scene.title;
  $('subtitle').textContent=wealth?scene.subtitle:(state.message||scene.subtitle);
  $('displayThai').textContent=wealth?'สแกน QR code เพื่อเริ่มการผจญภัย':'ค้นพบสัตว์ผู้พิทักษ์และเส้นทางอาชีพทางการเงินที่เหมาะกับคุณ';
  $('stageEyebrow').textContent=wealth?'ANOTHER ADVENTURE AWAITS':'THE FINANCIAL MAGIC BEGINS';
  if(current!==id){
   clearTimeout(timer);back.style.backgroundImage='url("assets/backgrounds/'+scene.bg+'")';back.classList.add('hybrid-visible');
   timer=setTimeout(()=>{front.style.backgroundImage='url("assets/backgrounds/'+scene.bg+'")';back.classList.remove('hybrid-visible')},1500);
   current=id;
  }
 }
 function render(){show(localScene||M.current(state));window.GuardianStageFX46?.setDensity(state.density)}
 async function poll(){if(reading)return;reading=true;try{const row=await S.read(),sig=JSON.stringify(row);if(sig!==last){const next=M.decode(row);if(!next)throw Error('invalid state');state=next;last=sig;localScene=null}render();$('connection').textContent=S.online?'● LIVE':'● LOCAL DEMO'}catch{$('connection').textContent='● OFFLINE · ใช้สถานะล่าสุด'}finally{reading=false}}
 M.scenes.forEach(s=>{const i=new Image();i.src='assets/backgrounds/'+s.bg});
 for(const src of ['assets/cards/player-entry-qr-v4.png','assets/cards/the-path-of-wealth-qr.png']){const i=new Image();i.src=src}
 addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||e.target.matches('input,textarea,select'))return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const id=localScene||M.current(state),i=M.scenes.findIndex(s=>s.id===id);localScene=M.scenes[(i+(e.key==='ArrowRight'?1:-1)+M.scenes.length)%M.scenes.length].id;render()}});
 window.GUARDIAN_HYBRID_DISPLAY={getState:()=>({...state,scene:localScene||M.current(state)})};
 render();poll();setInterval(poll,S.pollMs);S.subscribe(poll);setInterval(render,250);
})();
