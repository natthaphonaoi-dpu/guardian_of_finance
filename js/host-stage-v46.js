(()=>{
 'use strict';
 const $=id=>document.getElementById(id),M=window.GuardianStage46,S=window.GuardianStageService46;
 let state=M.clean({...M.defaults,epoch:Date.now()}),last='',dirty=false,busy=false,reading=false;
 function authUI(){const logged=!S.online||!!S.session()?.access_token;$('loginPanel').classList.toggle('hide',logged);$('controls').classList.toggle('hide',!logged);$('mode').textContent=S.online?'ONLINE · ใช้บัญชี MC เดิม':'LOCAL DEMO · ควบคุมเฉพาะเบราว์เซอร์เดียวกัน'}
 function feedback(text){$('feedback').textContent=text}
 function draw(){
  const id=M.current(state);$('currentStage').textContent=(state.mode==='auto'?'▶ AUTO · ':'Ⅱ MANUAL · ')+M.scenes.find(x=>x.id===id).title;
  document.querySelectorAll('[data-stage]').forEach(b=>{const active=b.dataset.stage===id;b.classList.toggle('is-selected',active);b.setAttribute('aria-pressed',String(active))});
 }
 function sync(){if(!dirty){$('stageDensity').value=state.density;$('densityValue').textContent=state.density+'%';$('stageMessage').value=state.message;$('stageInterval').value=state.interval}draw()}
 async function poll(){if(reading)return;reading=true;try{const row=await S.read(),sig=JSON.stringify(row);if(sig!==last){const parsed=M.decode(row);if(!parsed)throw Error('อ่านสถานะไม่ได้');state=parsed;last=sig;sync()}$('stageConnection').textContent=S.online?'● เชื่อมต่อจอหลัก':'● โหมดจำลอง'}catch{$('stageConnection').textContent='● เชื่อมต่อไม่ได้ · ยังใช้สถานะล่าสุด'}finally{reading=false}}
 async function send(next){
  if(busy)return;busy=true;document.querySelectorAll('[data-stage],[data-command],#applyStageSettings').forEach(b=>b.disabled=true);
  try{await S.write(next);state=M.clean(next);dirty=false;sync();feedback('✓ ส่งการตั้งค่าแล้ว · ตรวจผลที่จอหลัก')}catch(e){feedback('ส่งคำสั่งไม่สำเร็จ: '+e.message)}
  finally{busy=false;document.querySelectorAll('[data-stage],[data-command],#applyStageSettings').forEach(b=>b.disabled=false)}
 }
 $('login').onclick=async()=>{try{await S.login($('email').value.trim(),$('password').value);$('password').value='';authUI();feedback('เข้าสู่ระบบสำเร็จ')}catch(e){feedback(e.message)}};
 $('logout').onclick=()=>{S.logout();authUI();feedback('ออกจากระบบแล้ว')};
 document.querySelectorAll('[data-stage]').forEach(b=>b.onclick=()=>send(M.command(state,b.dataset.stage)));
 document.querySelectorAll('[data-command]').forEach(b=>b.onclick=()=>send(M.command(state,b.dataset.command)));
 $('stageDensity').oninput=()=>{dirty=true;$('densityValue').textContent=$('stageDensity').value+'%';feedback('ปรับค่าแล้ว · กดอัปเดตเพื่อใช้กับจอหลัก')};
 $('stageInterval').onchange=$('stageMessage').oninput=()=>{dirty=true};
 $('applyStageSettings').onclick=()=>{
  const interval=+$('stageInterval').value,reset=interval!==state.interval;
  send(M.clean({...state,scene:reset?M.current(state):state.scene,epoch:reset?Date.now():state.epoch,interval,density:+$('stageDensity').value,message:$('stageMessage').value}));
 };
 authUI();sync();poll();setInterval(poll,S.pollMs);S.subscribe(poll);setInterval(draw,500);
})();
