/* One independent, closeable fullscreen control per page. */
(()=>{
 'use strict';
 const button=document.getElementById('guardianFullscreenButton'),note=document.getElementById('guardianFullscreenNote');if(!button||!note)return;
 note.replaceChildren();
 const text=document.createElement('span'),close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','ปิดข้อความแจ้งเตือน');note.append(text,close);
 let timer,busy=false;
 function dismiss(){clearTimeout(timer);note.hidden=true}
 close.onclick=dismiss;
 function message(value){clearTimeout(timer);text.textContent=value;note.hidden=false;timer=setTimeout(dismiss,5000)}
 const current=()=>document.fullscreenElement||document.webkitFullscreenElement;
 function update(){const active=!!current();button.textContent=active?'⤢ กลับขนาดปกติ':'⛶ เต็มจอ';button.setAttribute('aria-pressed',String(active));button.title=active?'กลับขนาดปกติ · Esc':'เปิดเต็มจอ';if(!active)dismiss()}
 button.onclick=async()=>{
  if(busy)return;busy=true;button.disabled=true;
  try{
   const root=document.documentElement,enter=root.requestFullscreen||root.webkitRequestFullscreen,exit=document.exitFullscreen||document.webkitExitFullscreen;
   if(current()){if(exit)await exit.call(document);dismiss()}
   else if(!enter||(document.fullscreenEnabled??document.webkitFullscreenEnabled)===false){message('อุปกรณ์นี้ไม่รองรับเต็มจอ · เล่นต่อในขนาดปกติได้');return}
   else{await enter.call(root);dismiss()}
  }catch{message('เบราว์เซอร์นี้ไม่อนุญาตเต็มจอ · เล่นต่อได้ตามปกติ')}
  finally{busy=false;button.disabled=false;const active=!!current();button.textContent=active?'⤢ กลับขนาดปกติ':'⛶ เต็มจอ';button.setAttribute('aria-pressed',String(active))}
 };
 document.addEventListener('fullscreenchange',update);document.addEventListener('webkitfullscreenchange',update);
 document.addEventListener('keydown',e=>{if(e.key==='Escape')dismiss()});update();
})();
