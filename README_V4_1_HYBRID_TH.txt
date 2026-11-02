Guardian of Finance V4.1 — Hybrid Main Display

ฐาน: V4.0 Main Display; ไม่แก้ play.html, game.js, cards, audio, host auth.
ภาพ 4: Grand Hall / Chamber / Guardian Vault / Enchanted Library (ภาพที่ 4 ใช้ grand-hall.webp เดิมเป็นภาพชั่วคราว; ยังไม่ใช่ภาพ Library จริง)
Auto 18s default, optional 10/30s. Crossfade 1.5s. Manual controls in host.html.
Auto runs locally in Display; Supabase only used to transmit mode changes from MC, not per slide.
To test: python -m http.server 8000 then /display.html?displayDebug=1 and /host.html on same browser.
With Supabase configured, MC login required. Offline fallback uses same-browser localStorage.
Scene 04 Manual encodes Library in subtitle metadata while keeping scene=welcome for compatibility with existing Supabase constraints. No database migration required.
QR points to existing deployed play.html. No Netlify deployment needed for local test.
