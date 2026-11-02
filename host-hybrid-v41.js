(()=>{'use strict';const $=id=>document.getElementById(id);if(!$('hybridAuto'))return;
const cfg=window.GUARDIAN_SHOW_CONFIG||{},url=String(cfg.SUPABASE_URL||'').replace(/\/$/,'');const key=cfg.SUPABASE_ANON_KEY||'';
const msg=t=>{$('hybridFeedback').textContent=t};
async function send(scene,subtitle){const s={id:1,scene,subtitle,updated_at:new Date().toISOString()};
 if(!url||!key){localStorage.setItem('guardian_show_state',JSON.stringify(s));try{const bc=new BroadcastChannel('guardian-show');bc.postMessage(s);bc.close()}catch{}return}
 let ses;try{ses=JSON.parse(sessionStorage.getItem('guardian_host_session')||'null')}catch{}
 if(!ses?.access_token)throw Error('กรุณาเข้าสู่ระบบ MC ก่อน');
 const r=await fetch(url+'/rest/v1/show_state?id=eq.1',{method:'PATCH',headers:{apikey:key,Authorization:'Bearer '+ses.access_token,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({scene,subtitle})});
 if(!r.ok)throw Error('HTTP '+r.status+': '+(await r.text()).slice(0,160));
}
let busy=false;async function act(mode,scene){if(busy)return;busy=true;try{
 const secs=Number($('hybridInterval').value)||18;
 const name={welcome:'Discover Your Financial Guardian',questions:'The choices shape your financial future',results:'Your guardian awaits',library:'Discover the magic'};
 const text=(mode==='auto'?`[[GOF_AUTO:${secs}]]`:'[[GOF_MANUAL]]')+name[scene];
 await send(scene==='library'?'welcome':scene,scene==='library'?'[[GOF_LIBRARY]]'+name[scene]:text);msg(mode==='auto'?`✓ Auto Loop เริ่มแล้ว · ${secs} วินาที/ภาพ · ไม่ส่งคำสั่งทุกครั้งที่เปลี่ยนภาพ`:`✓ Manual · ${scene} · ค้างภาพจนกว่า MC จะสั่งใหม่`);
 }catch(e){msg('ไม่สำเร็จ: '+e.message)}finally{busy=false}}
$('hybridAuto').onclick=()=>act('auto','welcome');
$('hybridManual').onclick=()=>act('manual','welcome');
$('hybridLibrary').onclick=()=>act('manual','library');
})();