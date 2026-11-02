GUARDIAN OF FINANCE — V4.5 INTEGRATED NETLIFY TEST

Sources:
- Player: V4.5 Player Audio Balance Fix (includes V4.2 answer highlight fix)
- MC Console and Main Display: V4.1 Hybrid Main Display

Entry points (all at ZIP root):
- / or /index.html — landing page
- /play.html — mobile player
- /host.html — MC console
- /display.html — stage display

Deploy: Upload THIS ZIP directly to Netlify. Do not upload only play.html.
The files are at the ZIP root; no nested site folder is required.

Important: This is an integration package, not a verified end-to-end deployment.
Before multi-player testing, verify player, sound, PNG export, MC authentication,
manual mode, auto loop, QR destination, and full-screen display on the deployed URL.
Check the configured Supabase project in js/show-config.js and the published URL
for the QR code. Avoid posting host credentials publicly.

No gameplay logic or visual assets have been intentionally modified in this merge.
Only the three player files differing between V4.1 and V4.5 were replaced.
