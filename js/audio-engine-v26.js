(function(){
'use strict';
function create({base,tracks,effects,debug=false}){
 let selectedTracks={...tracks};
 let on=false,musicLevel=.25,sfxLevel=.14,currentScene=null,fadeId=0;
 // Per-effect balance: question UI sounds are intentionally quieter than the music.
 const effectGain={start:.55,open:.28,answer:.42,transition:.22,summon:.65,reveal:.60,flip:.50,download:.40,click:.30};
 const quizEffects=new Set(['open','answer','transition']);
 let currentQuizEffect=null;
 const channels=[new Audio(),new Audio()];let active=0;
 channels.forEach(a=>{a.loop=true;a.preload='none';});
 const sfxPool=new Map();
 function warn(event,error){if(debug)console.warn('[GuardianAudio]',event,error);window.dispatchEvent(new CustomEvent('guardian:audio-error',{detail:{event,message:String(error&&error.message||error)}}));}
 function tryPlay(a,event){try{const p=a.play();if(p&&p.catch)p.catch(e=>warn(event,e));}catch(e){warn(event,e);}}
 function emit(event,detail={}){window.dispatchEvent(new CustomEvent('guardian:audio-event',{detail:{event,...detail}}));}
 function fadeTo(scene){
  currentScene=scene;const file=selectedTracks[scene];if(!file){warn('scene',new Error('Unknown scene: '+scene));return;}
  const id=++fadeId,old=channels[active],next=channels[1-active];active=1-active;
  next.pause();next.src=base+file;next.currentTime=0;next.volume=0;
  if(!on){old.pause();old.removeAttribute('src');return;}
  tryPlay(next,'music:'+scene);
  const started=performance.now(),duration=700,oldVolume=old.volume;
  function tick(now){if(id!==fadeId)return;const t=Math.min(1,(now-started)/duration);old.volume=Math.max(0,oldVolume*(1-t));next.volume=Math.max(0,Math.min(1,musicLevel*t));if(t<1)requestAnimationFrame(tick);else{old.pause();old.removeAttribute('src');}}
  requestAnimationFrame(tick);
  emit('scene:music',{scene});
 }
 function effect(name){emit('sfx:'+name);if(!on)return;const file=effects[name];if(!file){warn('sfx',new Error('Unknown effect: '+name));return;}
  let pool=sfxPool.get(name);if(!pool){pool=[];sfxPool.set(name,pool);}
  // Only one quiz sound at a time: avoid answer/open/transition stacking.
  if(quizEffects.has(name)&&currentQuizEffect){currentQuizEffect.pause();try{currentQuizEffect.currentTime=0;}catch(e){}}
  let a=pool.find(x=>x.paused||x.ended);if(!a){if(pool.length>=3){a=pool[0];a.pause();}else{a=new Audio(base+file);a.preload='auto';pool.push(a);}}
  a.volume=Math.max(0,Math.min(1,sfxLevel*(effectGain[name]??1)));
  if(quizEffects.has(name))currentQuizEffect=a;
  try{a.currentTime=0;}catch(e){}tryPlay(a,'sfx:'+name);
 }
 function enabled(value){on=!!value;emit('audio:toggle',{enabled:on});if(!on){++fadeId;channels.forEach(a=>a.pause());sfxPool.forEach(pool=>pool.forEach(a=>a.pause()));}else if(currentScene){fadeTo(currentScene);}}
 function musicVolume(value){musicLevel=Math.max(0,Math.min(1,value));channels[active].volume=musicLevel;emit('audio:music-volume',{value:musicLevel});}
 function sfxVolume(value){sfxLevel=Math.max(0,Math.min(1,value));sfxPool.forEach((pool,name)=>pool.forEach(a=>{a.volume=Math.max(0,Math.min(1,sfxLevel*(effectGain[name]??1)));}));emit('audio:sfx-volume',{value:sfxLevel});}
 function setTracks(newTracks){selectedTracks={...newTracks};if(currentScene)fadeTo(currentScene);}
 return {scene:fadeTo,effect,enabled,musicVolume,sfxVolume,setTracks};
}
window.GuardianAudioEngine={create};
})();
