(()=>{'use strict';
const scenes=[
 {id:'welcome',name:'THE GRAND HALL',subtitle:'Discover Your Financial Guardian',bg:'assets/backgrounds/grand-hall-clean-v20.webp'},
 {id:'questions',name:'CHAMBER OF DECISIONS',subtitle:'The choices shape your financial future',bg:'assets/backgrounds/chamber-of-decisions-v22.webp'},
 {id:'results',name:'THE GUARDIAN VAULT',subtitle:'Your guardian awaits',bg:'assets/backgrounds/guardian-vault-approved-v25.webp'},
 {id:'library',name:'THE ENCHANTED LIBRARY',subtitle:'Discover the magic',bg:'assets/backgrounds/grand-hall.webp'}
];
const sceneEl=document.getElementById('scene'), front=sceneEl?.querySelector('.display-backdrop'), back=sceneEl?.querySelector('.hybrid-backdrop-next');
if(!sceneEl||!front||!back)return;
const cfg=window.GUARDIAN_SHOW_CONFIG||{};const base=String(cfg.SUPABASE_URL||'').replace(/\/$/,'');const key=cfg.SUPABASE_ANON_KEY||'';
const connected=Boolean(base&&key);const fallbackKey='guardian_show_state';
let mode='auto',seconds=18,index=0,cycle=null,lastRemote='',transitionTimer=null,initialRemote=true;
const params=new URLSearchParams(location.search);const debug=params.has('displayDebug');
const log=(...a)=>{if(debug)console.info('[HybridDisplay]',...a)};
const preload=scenes.map(s=>{const img=new Image();img.src=s.bg;img.onerror=()=>console.warn('[HybridDisplay] Missing background:',s.bg);return img});
function show(i){index=(i+scenes.length)%scenes.length;const s=scenes[index];
 back.style.backgroundImage=`url("${s.bg}")`;back.classList.add('hybrid-visible');
 if(transitionTimer)clearTimeout(transitionTimer);
 transitionTimer=setTimeout(()=>{front.style.backgroundImage=`url("${s.bg}")`;back.classList.remove('hybrid-visible');},1500);
 sceneEl.className='scene '+s.id;document.getElementById('title').textContent=s.name;
 document.getElementById('subtitle').textContent=s.subtitle;
 log('scene',s.id,'mode',mode);
}
function schedule(){if(cycle)clearInterval(cycle);cycle=null;if(mode==='auto')cycle=setInterval(()=>show(index+1),seconds*1000)}
function applyState(s){if(!s)return;const raw=String(s.subtitle||'');const auto=raw.match(/^\[\[GOF_AUTO:(\d+)\]\]/);const manual=raw.startsWith('[[GOF_MANUAL]]')||raw.startsWith('[[GOF_LIBRARY]]');
 const signature=JSON.stringify([s.updated_at,s.scene,raw]);if(signature===lastRemote)return;lastRemote=signature;const wasInitial=initialRemote;initialRemote=false;
 if(auto){mode='auto';seconds=[10,18,30].includes(+auto[1])?+auto[1]:18;index=Math.max(0,scenes.findIndex(x=>x.id===s.scene));show(index);schedule();log('remote AUTO',seconds);return}
 if(manual){mode='manual';const i=raw.startsWith('[[GOF_LIBRARY]]')?3:scenes.findIndex(x=>x.id===s.scene);if(i>=0)show(i);schedule();log('remote MANUAL');return}
 // Old MC clients: manual selection. On initial default state, retain auto.
 if(!wasInitial && s.updated_at && s.subtitle && s.scene && !String(s.updated_at).startsWith('1970')){
  const i=scenes.findIndex(x=>x.id===s.scene);if(i>=0){mode='manual';show(i);schedule()}
 }
}
async function poll(){try{if(connected){const r=await fetch(base+'/rest/v1/show_state?id=eq.1&select=id,scene,subtitle,updated_at',{headers:{apikey:key,Authorization:'Bearer '+key},cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);applyState((await r.json())[0])}else{const v=localStorage.getItem(fallbackKey);if(v)applyState(JSON.parse(v))}}catch(e){log('offline: continue current slideshow',e.message)}}
// Start in auto mode, independent of Supabase connectivity.
show(0);schedule();poll();setInterval(poll,Math.max(1500,Number(cfg.POLL_MS)||2500));
window.addEventListener('storage',e=>{if(e.key===fallbackKey)poll()});
try{const bc=new BroadcastChannel('guardian-show');bc.onmessage=()=>poll()}catch{}
window.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){mode='manual';show(index+1);schedule()}if(e.key==='ArrowLeft'){mode='manual';show(index-1);schedule()}});
window.GUARDIAN_HYBRID_DISPLAY={getState:()=>({mode,seconds,scene:scenes[index].id})};
})();