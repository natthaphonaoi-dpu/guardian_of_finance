/* Move music controls away from the top-right fullscreen target. */
(()=>{
 'use strict';
 const header=document.querySelector('header.top'),sound=document.getElementById('soundBtn'),controls=document.querySelector('.audio-v26-controls');if(!header||!sound||!controls)return;
 document.body.classList.add('player-layout-v46');
 const panel=document.createElement('section');panel.className='player-audio-panel';panel.setAttribute('aria-label','เสียงเพลงของเกม');
 panel.append(sound,controls);header.after(panel);
})();
