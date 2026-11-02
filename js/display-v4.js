// Main Display player link is relative to the current deployed site. Static QR PNG targets GitHub Pages /play.html.
(()=>{'use strict';
const link=document.getElementById('playerLink');
if(link){const playerUrl=new URL('play.html',location.href).href;link.href=playerUrl;link.title='เปิดเกมบนมือถือ: '+playerUrl;}
})();
