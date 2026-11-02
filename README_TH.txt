GUARDIAN OF FINANCE 2.0 — PHASE 1 / MOBILE FREE PLAY

วิธีเริ่มใช้งาน
1. แตก ZIP ก่อน (อย่าเปิด index.html จากภายใน ZIP)
2. สำหรับทดสอบในเครื่อง เปิด index.html ด้วยเบราว์เซอร์ แต่บางเบราว์เซอร์จำกัดการโหลดภาพ SVG และดาวน์โหลด PNG จาก file://
3. แนะนำให้อัปโหลดโฟลเดอร์ทั้งหมดขึ้น Static Hosting ผ่าน HTTPS เช่น Netlify หรือ Replit
4. QR ที่ผู้เล่นสแกนเพื่อเข้าเกม ต้องชี้ไปยัง URL เว็บไซต์ที่ Deploy แล้ว เช่น https://example.netlify.app/play (หากตั้งค่า route) หรือ https://example.netlify.app/

โครงสร้างไฟล์
index.html        หน้าสำหรับผู้เข้าร่วมเท่านั้น ไม่มีเมนูแก้ไข URL
css/style.css     ธีมมือถือ Responsive
js/game.js        คำถาม 6 ข้อ + คำนวณผู้พิทักษ์ + การ์ด + ดาวน์โหลด PNG
js/config.js      ค่า URL หลักสูตร (ปัจจุบันเป็น https://www.dpu.ac.th/ ชั่วคราว)
assets/cards/     ภาพการ์ดและ QR ในเครื่อง
assets/audio/     เสียง 12 ไฟล์จากเกมเดิม

สำคัญ: ภาพสัตว์จริงจาก ZIP ต้นทางมีเฉพาะ raven.png
ภาพ lion.svg, owl.svg, turtle.svg และ fox.svg เป็นภาพตราสัญลักษณ์สำรอง (PLACEHOLDER) ไม่ใช่ภาพสัตว์จริง
เมื่อได้ภาพจากเพื่อน ให้ใส่ lion.jpg/owl.jpg/turtle.jpg/fox.jpg หรือ PNG แล้วแก้ส่วน art.src ใน js/game.js ให้ตรงกับนามสกุลไฟล์
ไฟล์ raven.svg เป็นตัวห่อ raven.png สำหรับการแสดงผลบนเว็บ หากพบปัญหา Safari ให้แก้ art.src ไปยัง raven.png โดยตรง

QR หลังการ์ดเป็น QR แบบ Local ไม่เรียก API ภายนอก จึงลดปัญหา canvas taint
ขณะนี้ชี้ไปยังหน้าแรก DPU ไม่ใช่หน้าหลักสูตรเฉพาะ
ก่อนใช้งานจริง ต้องแก้ COURSE_URL ใน js/config.js และสร้าง assets/cards/dpu-course-qr.png ใหม่ให้ชี้ URL เดียวกัน
ห้ามแก้ URL เฉพาะใน config.js โดยไม่สร้าง QR ใหม่ เพราะภาพ QR จะยังเป็นลิงก์เดิม

Phase 1 เป็นเว็บสาธารณะแบบ static และไม่มีหน้าผู้ดูแล จึงไม่มีช่องกรอกแก้ URL บนหน้าผู้เล่น
อย่างไรก็ตาม การป้องกันการแก้ไขการตั้งค่ากลางโดย Admin ต้องทำใน Phase 3 ด้วย backend/auth

การคิดคะแนน: คำตอบ A-E เทียบกับ Lion/Owl/Raven/Turtle/Fox ตามลำดับ ตอบ 6 ข้อ นับคะแนนสูงสุด
กรณีคะแนนเท่ากัน ใช้ลำดับ Lion, Owl, Raven, Turtle, Fox ตามโค้ดเดิม

ยังไม่มีการทดสอบบน Safari iPad จริงและยังไม่มี load test จำนวนผู้ใช้พร้อมกัน


UPDATED CARDS: lion.jpg, owl.jpg, raven.jpg, turtle.jpg, fox.jpg และ card-back.png; ดาวน์โหลด PNG ภาพเต็มใบ.
ข้อควรระวัง: QR ฝังอยู่ใน card-back.png จึงไม่เปลี่ยนตาม COURSE_URL; ตรวจสอบปลายทาง QR ก่อนเผยแพร่.
