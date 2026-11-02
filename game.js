const ids=['lion','owl','raven','turtle','fox'];const guardians={lion:{name:'THE GOLDEN LION',emoji:'🦁',trait:'ผู้นำ กล้าตัดสินใจ คิดเชิงกลยุทธ์',career:'Corporate Finance / Investment Banking'},owl:{name:'THE WISE OWL',emoji:'🦉',trait:'ช่างวิเคราะห์ รอบรู้ มองการณ์ไกล',career:'Investment Analyst / Portfolio Manager'},raven:{name:'THE ARCANE RAVEN',emoji:'🐦‍⬛',trait:'คิดเป็นระบบ ชอบข้อมูลและนวัตกรรม',career:'FinTech Developer / Quantitative Analyst'},turtle:{name:'THE SHIELD TORTOISE',emoji:'🐢',trait:'รอบคอบ มั่นคง บริหารความเสี่ยง',career:'Risk Analyst / Financial Planner'},fox:{name:'THE MYSTIC FOX',emoji:'🦊',trait:'สร้างสรรค์ มองเห็นโอกาส ปรับตัวเก่ง',career:'Venture Capital / Entrepreneurship'}};
const questions=[['คุณได้รับเงิน 10,000 บาทจากสภาจอมเวท จะทำอย่างไร?',['ลงทุนในธุรกิจที่มีโอกาสเติบโต','ศึกษาข้อมูลสินทรัพย์ก่อนลงทุน','พัฒนาเครื่องมือการเงินดิจิทัล','เก็บเงินสำรองไว้ก่อน','ทดลองสร้างธุรกิจเล็ก ๆ']],['หากตลาดการลงทุนผันผวนรุนแรง คุณจะทำอย่างไร?',['ปรับกลยุทธ์และตัดสินใจอย่างเด็ดขาด','วิเคราะห์ข้อมูลและแนวโน้มตลาด','ใช้แบบจำลองคำนวณความเสี่ยง','ตรวจสอบและลดความเสี่ยงของพอร์ต','ค้นหาโอกาสจากความเปลี่ยนแปลง']],['ได้รับมอบหมายให้บริหารคลังสมบัติ คุณจะเริ่มจากอะไร?',['กำหนดเป้าหมายและนำทีม','ตรวจสอบข้อมูลรายรับรายจ่าย','สร้างระบบจัดการเงินอัตโนมัติ','วางระบบควบคุมความเสี่ยง','หาแนวทางเพิ่มรายได้ใหม่']],['ถ้าเลือกเรียนเวทมนตร์การเงินได้หนึ่งวิชา จะเลือกอะไร?',['กลยุทธ์บริหารองค์กร','ศาสตร์วิเคราะห์การลงทุน','เทคโนโลยีและอัลกอริทึมการเงิน','การบริหารความเสี่ยง','การสร้างธุรกิจแห่งอนาคต']],['เพื่อนชวนร่วมทำธุรกิจใหม่ คุณจะรับบทบาทใด?',['ผู้นำและผู้เจรจาหาเงินทุน','นักวิเคราะห์ความเป็นไปได้','ผู้พัฒนาระบบเทคโนโลยี','ผู้วางแผนการเงินและควบคุมความเสี่ยง','ผู้คิดผลิตภัณฑ์และโอกาสทางตลาด']],['เมื่อสำเร็จการศึกษา คุณอยากสร้างอะไร?',['องค์กรการเงินที่ประสบความสำเร็จ','กลยุทธ์ลงทุนที่มีเหตุผลรองรับ','นวัตกรรมการเงินที่เปลี่ยนโลก','ความมั่นคงทางการเงินให้ผู้คน','ธุรกิจใหม่ที่สร้างคุณค่า']]];

const CONFIG=window.GUARDIAN_CONFIG;const $=id=>document.getElementById(id);
const A='assets/audio/';
const tracks={welcome:'guardian_original_wizard_theme.mp3',quiz:'guardian_original_wizard_theme.mp3',result:'guardian_original_wizard_theme.mp3'};
const effects={start:'magic_door_open.mp3',open:'question_open.mp3',answer:'answer_select.mp3',transition:'question_transition.mp3',summon:'guardian_summon.mp3',reveal:'guardian_reveal.mp3',flip:'card_flip.mp3',download:'card_download_success.mp3',click:'ui_button_click.mp3'};
let soundOn=false,scene='welcome',index=0,answers=[],winner=null,locked=false,revealToken=0;
const audioEngine=window.GuardianAudioEngine.create({base:A,tracks,effects,debug:new URLSearchParams(location.search).has('audioDebug')});
function sfx(name){audioEngine.effect(name);}
function setScene(next){scene=next;document.querySelectorAll('.scene').forEach(el=>el.classList.toggle('active',el.id===next));audioEngine.scene(next);window.scrollTo({top:0,behavior:'instant'});}
const soundBtn=$('soundBtn');
soundBtn.addEventListener('click',()=>{soundOn=!soundOn;audioEngine.enabled(soundOn);soundBtn.textContent=soundOn?'♫ ปิดเสียง':'♪ เปิดเสียง';soundBtn.setAttribute('aria-pressed',String(soundOn));});
// Non-gameplay UI clicks only; gameplay buttons already have dedicated effects.
['prevBtn','restartBtn','courseLink'].forEach(id=>{const el=$(id);if(el)el.addEventListener('click',()=>sfx('click'));});
// Optional music/SFX sliders are added alongside the existing mute button.
const audioControls=document.createElement('span');audioControls.className='audio-v26-controls';
audioControls.innerHTML='<label title="ระดับเสียงเพลง">เสียงเพลง <input type="range" aria-label="ระดับเสียงเพลง" min="0" max="100" value="25"></label>';
soundBtn.insertAdjacentElement('afterend',audioControls);

const sliders=audioControls.querySelectorAll('input');
sliders[0].addEventListener('input',e=>audioEngine.musicVolume(Number(e.target.value)/100));
// Player effects stay at their existing fixed settings; stage visual density is controlled by MC.
function start(){index=0;answers=[];winner=null;locked=false;sfx('start');setScene('quiz');render();}
function render(){if(document.activeElement?.classList?.contains('option'))document.activeElement.blur();locked=false;const q=questions[index];$('counter').textContent=`บททดสอบที่ ${index+1} / ${questions.length}`;$('percent').textContent=Math.round((index+1)/questions.length*100)+'%';$('bar').style.width=((index+1)/questions.length*100)+'%';$('question').textContent=q[0];$('options').replaceChildren();q[1].forEach((txt,i)=>{const b=document.createElement('button');b.type='button';b.className='option';const letter=document.createElement('span');letter.className='letter';letter.textContent=String.fromCharCode(65+i);const label=document.createElement('span');label.textContent=txt;b.append(letter,label);b.onclick=()=>choose(i);$('options').append(b);});sfx('open');}
function choose(i){if(locked)return;locked=true;/* Release touch/click focus before the next question renders. */if(document.activeElement?.classList?.contains('option'))document.activeElement.blur();sfx('answer');answers[index]=ids[i];if(index===questions.length-1){setTimeout(finish,250);}else{index++;setTimeout(()=>{render()},220);}}
function previous(){if(locked)return;if(index>0){index--;render();}else setScene('welcome');}
function finish(){const scores=Object.fromEntries(ids.map(id=>[id,0]));answers.forEach(id=>scores[id]++);winner=ids.reduce((a,b)=>scores[b]>scores[a]?b:a,ids[0]);const g=guardians[winner];$('guardianName').textContent=g.name;$('guardianTrait').textContent=g.trait;$('guardianCareer').textContent=g.career;$('card').classList.remove('flipped');$('art').src=`assets/cards/${winner}.jpg`;$('art').alt=g.name;$('art').onerror=()=>{$('art').onerror=null;$('art').src='assets/cards/guardian-placeholder.svg';};$('backArt').src='assets/cards/card-back.png';$('courseLink').href=CONFIG.COURSE_URL;$('downloadStatus').textContent='';setScene('result');const token=++revealToken;
 window.GuardianResultMagic?.reveal();sfx('summon');
 setTimeout(()=>{if(token===revealToken&&scene==='result')sfx('reveal');},3200);}
function flip(){if($('result').classList.contains('reveal-running')){ $('downloadStatus').textContent='กรุณารอการเปิดเผยผู้พิทักษ์สักครู่';return;}sfx('flip');$('card').classList.toggle('flipped');window.GuardianResultMagic?.flip();}
function loadImg(src){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src;});}
function cover(ctx,img,w,h){const k=Math.max(w/img.width,h/img.height);ctx.drawImage(img,(w-img.width*k)/2,(h-img.height*k)/2,img.width*k,img.height*k);}
function downloadCanvas(canvas,filename){return new Promise((resolve,reject)=>{canvas.toBlob(blob=>{if(!blob){reject(new Error('ไม่สามารถสร้าง PNG ได้'));return;}const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);resolve();},'image/png');});}
async function exportPNG(back){
 if(!winner)return;
 const status=$('downloadStatus');status.textContent='กำลังสร้างภาพ PNG…';
 try{
  const src=back?'assets/cards/card-back.png':`assets/cards/${winner}.jpg`;
  const img=await loadImg(src);
  const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
  c.getContext('2d').drawImage(img,0,0);
  await downloadCanvas(c,`Guardian_${winner}_${back?'back':'front'}.png`);
  sfx('download');status.textContent='สร้าง PNG แล้ว หากใช้ iPad ให้ตรวจสอบ Downloads ใน Safari';
 }catch(err){console.error(err);status.textContent='ไม่สามารถสร้างภาพได้ กรุณาเปิดผ่านเว็บไซต์ HTTPS แล้วลองอีกครั้ง';}
}

$('startBtn').onclick=start;$('prevBtn').onclick=previous;$('card').onclick=flip;$('flipBtn').onclick=flip;$('saveFront').onclick=()=>exportPNG(false);$('saveBack').onclick=()=>exportPNG(true);$('restartBtn').onclick=()=>{revealToken++;window.GuardianResultMagic?.reset();setScene('welcome');};
