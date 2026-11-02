/* Keep the existing Supabase host_users authentication and show_state schema. */
(()=>{
 'use strict';
 const cfg=window.GUARDIAN_SHOW_CONFIG||{},url=String(cfg.SUPABASE_URL||'').replace(/\/$/,''),key=cfg.SUPABASE_ANON_KEY||'';
 const online=!!(url&&key),localKey='guardian_show_state',sessionKey='guardian_host_session';
 let channel;try{channel=new BroadcastChannel('guardian-show')}catch{}
 const subscribers=new Set();
 function session(){try{return JSON.parse(sessionStorage.getItem(sessionKey)||'null')}catch{return null}}
 async function request(path,{method='GET',body,token=key}={}){
  const r=await fetch(url+path,{method,headers:{apikey:key,Authorization:'Bearer '+token,'Content-Type':'application/json',Prefer:'return=representation'},body:body?JSON.stringify(body):undefined,cache:'no-store',signal:AbortSignal.timeout(10000)});
  if(!r.ok)throw Error('HTTP '+r.status);
  const text=await r.text();return text?JSON.parse(text):null;
 }
 async function read(){if(!online){try{return JSON.parse(localStorage.getItem(localKey)||'null')}catch{return null}}return (await request('/rest/v1/show_state?id=eq.1&select=scene,subtitle,updated_at'))?.[0]||null}
 async function write(state){
  const row=window.GuardianStage46.encode(state);
  if(online){const s=session();if(!s?.access_token)throw Error('กรุณาเข้าสู่ระบบ MC ก่อน');const rows=await request('/rest/v1/show_state?id=eq.1',{method:'PATCH',token:s.access_token,body:row});if(!rows?.length)throw Error('ไม่ได้อัปเดตสถานะ กรุณาตรวจสิทธิ์ MC')}
  else{localStorage.setItem(localKey,JSON.stringify({...row,updated_at:new Date().toISOString()}));channel?.postMessage('stage-updated')}
 }
 async function login(email,password){
  const s=await request('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password}});
  if(!s?.access_token)throw Error('เข้าสู่ระบบไม่สำเร็จ');
  const allowed=await request('/rest/v1/host_users?user_id=eq.'+encodeURIComponent(s.user.id)+'&select=user_id',{token:s.access_token});
  if(!allowed?.length)throw Error('บัญชีนี้ไม่ได้รับสิทธิ์ MC');
  sessionStorage.setItem(sessionKey,JSON.stringify(s));
 }
 function notify(){subscribers.forEach(fn=>fn())}
 if(channel)channel.onmessage=notify;
 addEventListener('storage',e=>{if(e.key===localKey)notify()});
 window.GuardianStageService46={online,read,write,login,session,logout:()=>sessionStorage.removeItem(sessionKey),subscribe:fn=>subscribers.add(fn),pollMs:Math.max(1500,Number(cfg.POLL_MS)||2500)};
})();
