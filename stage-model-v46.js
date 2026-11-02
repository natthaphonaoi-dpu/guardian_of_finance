/* Shared pure stage model; QR targets are fixed assets, never supplied by remote text. */
(()=>{
 'use strict';
 const scenes=[
  {id:'welcome',title:'THE GRAND HALL',subtitle:'Discover Your Financial Guardian',bg:'grand-hall-clean-v20.webp'},
  {id:'questions',title:'CHAMBER OF DECISIONS',subtitle:'The choices shape your financial future',bg:'chamber-of-decisions-v22.webp'},
  {id:'results',title:'THE GUARDIAN VAULT',subtitle:'Your guardian awaits',bg:'guardian-vault-approved-v25.webp'},
  {id:'library',title:'THE ENCHANTED LIBRARY',subtitle:'Discover the magic',bg:'grand-hall.webp'},
  {id:'wealth',title:'THE PATH OF WEALTH',subtitle:'Scan to play The Path of Wealth',bg:'the-path-of-wealth-ledger-v462.png'}
 ];
 const defaults={v:46,mode:'auto',scene:'welcome',interval:18,epoch:0,density:45,message:''};
 const clamp=(x,min,max,fallback)=>Number.isFinite(Number(x))?Math.max(min,Math.min(max,Number(x))):fallback;
 function clean(s={}){return {...defaults,mode:s.mode==='manual'?'manual':'auto',scene:scenes.some(x=>x.id===s.scene)?s.scene:'welcome',interval:[10,18,30].includes(+s.interval)?+s.interval:18,epoch:clamp(s.epoch,0,Number.MAX_SAFE_INTEGER,Date.now()),density:Math.round(clamp(s.density,0,100,45)),message:String(s.message||'').slice(0,180)}}
 function decode(row){
  if(!row)return clean({...defaults,epoch:Date.now()});
  const raw=String(row.subtitle||'');
  if(raw.startsWith('[[GOF46]]')){try{return clean(JSON.parse(raw.slice(9)))}catch{return null}}
  const auto=raw.match(/^\[\[GOF_AUTO:(\d+)\]\]/),library=raw.startsWith('[[GOF_LIBRARY]]');
  return clean({mode:auto?'auto':'manual',interval:auto?+auto[1]:18,scene:library?'library':row.scene,epoch:Date.parse(row.updated_at)||Date.now(),message:''});
 }
 function current(s,now=Date.now()){const i=Math.max(0,scenes.findIndex(x=>x.id===s.scene));return s.mode==='manual'?s.scene:scenes[(i+Math.floor(Math.max(0,now-s.epoch)/(s.interval*1000)))%scenes.length].id}
 function command(s,action,now=Date.now()){
  const id=current(s,now),i=scenes.findIndex(x=>x.id===id);
  if(action==='pause')return clean({...s,scene:id,mode:'manual',epoch:now});
  if(action==='auto')return clean({...s,scene:id,mode:'auto',epoch:now});
  if(action==='next'||action==='prev')return clean({...s,scene:scenes[(i+(action==='next'?1:-1)+scenes.length)%scenes.length].id,mode:'manual',epoch:now});
  return clean({...s,scene:action,mode:'manual',epoch:now});
 }
 function encode(s){s=clean(s);return {scene:['welcome','questions','results'].includes(s.scene)?s.scene:'welcome',subtitle:'[[GOF46]]'+JSON.stringify(s)}}
 window.GuardianStage46=Object.freeze({scenes,defaults,clean,decode,current,command,encode});
})();
