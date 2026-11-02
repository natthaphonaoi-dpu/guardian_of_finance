GUARDIAN OF FINANCE — PHASE 2 (MC + MAIN DISPLAY)

มีไฟล์ Phase 1 เดิมครบ: index.html / play.html, css/style.css, js/game.js, assets/audio, assets/cards
หน้าใหม่: host.html (MC), display.html (จอหลัก)

DEMO MODE: อัปโหลดทั้งโฟลเดอร์ขึ้น Netlify แล้วเปิด host.html กับ display.html ในเบราว์เซอร์เดียวกัน (คนละแท็บ). เปลี่ยนฉากที่ host.html และดู display.html. Demo ใช้ localStorage/BroadcastChannel จึงไม่ซิงก์ข้ามอุปกรณ์และไม่มีล็อกอินจริง.

ONLINE MODE สำหรับ MC บน iPad และจอหลักคนละเครื่อง:
1. สร้าง Supabase project ที่ https://supabase.com
2. วาง SQL ใน supabase_setup.sql ลง SQL Editor แล้ว Run
3. ใน Authentication > Users สร้างผู้ใช้ MC (อีเมล/รหัสผ่าน) และปิด public signup ตามต้องการ
4. นำ user UUID มาใส่ในคำสั่ง insert into public.host_users(user_id) values ('UUID'); แล้ว Run
5. จาก Supabase Project Settings > API คัดลอก Project URL และ anon/publishable key ใส่ใน js/show-config.js (ห้ามใส่ service_role/secret key)
6. Deploy ทั้งโฟลเดอร์ขึ้น Netlify (ควรทำให้ site เป็น Public ก่อนแจก QR)
7. เปิด https://your-site.netlify.app/host.html บน iPad ของ MC; ล็อกอิน; เปิด /display.html บนคอมต่อจอหลัก; แจก /play.html ให้ผู้เข้าร่วม
8. ระบบ Display ตรวจสถานะทุก ~2.5 วินาที. MC เปลี่ยนฉากไม่กระทบ Player

ข้อจำกัด: Phase 2 เป็นจอ Presentation แยก; ไม่ได้ซิงก์คำตอบของผู้เล่น ไม่แสดงจำนวนผู้เล่นจริง ไม่มีระบบ Admin สำหรับแก้คำถาม/QR. QR ที่ฝังในภาพด้านหลังไม่เปลี่ยนตาม URL.
หากใช้ Netlify site ที่ตั้งค่า Private ผู้เข้าร่วมอาจเปิด /play.html ไม่ได้ ให้ตรวจสิทธิ์ก่อนวันงาน.
