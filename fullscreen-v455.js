/* Guardian of Finance V4.5.5 — independent fullscreen control */
(()=>{'use strict';
 const button=document.getElementById('guardianFullscreenButton');
 const note=document.getElementById('guardianFullscreenNote');
 if(!button)return;
 const fullscreenElement=()=>document.fullscreenElement||document.webkitFullscreenElement||null;
 const supported=()=>!!(document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen);
 const update=()=>{const active=!!fullscreenElement();button.textContent=active?'⤢ ออกจากเต็มจอ':'⛶ เต็มจอ';button.setAttribute('aria-pressed',String(active));button.title=active?'ออกจากโหมดเต็มจอ':'ขยายหน้าจอเต็มจอ';};
 const message=t=>{if(!note)return;note.textContent=t;note.hidden=false;};
 button.addEventListener('click',async()=>{
  try{
   if(!supported()){
    message('เบราว์เซอร์นี้ไม่รองรับการขยายหน้าเว็บแบบ Fullscreen โดยตรง บน iPad/iPhone ให้ใช้ Safari > แชร์ > เพิ่มไปยังหน้าจอโฮม แล้วเปิดจากไอคอนที่เพิ่มไว้ (อาจขึ้นอยู่กับรุ่นและการตั้งค่า)');return;
   }
   if(fullscreenElement()){
    const exit=document.exitFullscreen||document.webkitExitFullscreen;
    if(exit)await exit.call(document);
   }else{
    const enter=document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen;
    await enter.call(document.documentElement);
   }
   if(note)note.hidden=true;
  }catch(e){message('ไม่สามารถเข้าสู่โหมดเต็มจอได้บนเบราว์เซอร์นี้ ลองเปิดใน Safari/Chrome โดยตรง หรือเพิ่มเว็บไซต์ไปยังหน้าจอโฮม');console.warn('Fullscreen unavailable:',e)}
  update();
 });
 document.addEventListener('fullscreenchange',update);
 document.addEventListener('webkitfullscreenchange',update);
 update();
})();
