# Guardian of Finance — GitHub Pages V4.6.2

DPU Open House — Guardian of Finance, Player / MC Console / Main Display.

## Live URLs (after Pages deployment)
- Player: https://natthaphonaoi-dpu.github.io/guardian_of_finance/
- Player explicit: https://natthaphonaoi-dpu.github.io/guardian_of_finance/play.html
- MC Console: https://natthaphonaoi-dpu.github.io/guardian_of_finance/host.html
- Main Display: https://natthaphonaoi-dpu.github.io/guardian_of_finance/display.html

## Deploy
1. Extract this ZIP. Do not upload the ZIP itself as the website.
2. Upload the extracted files and folders to the repository root (where `index.html` resides).
3. Settings > Pages > Build and deployment > Deploy from a branch > main > /(root) > Save.
4. Check Actions / Pages deployment success, then test all three pages and QR scans on real devices.

## Changes from V4.6.2
- Replaced only Guardian of Finance player QR asset with one targeting the GitHub Pages `play.html` URL.
- Kept the partner The Path of Wealth QR and link targeting https://peppy-toffee-ff9e18.netlify.app.
- Added `.nojekyll`, this README, and Thai migration notes.
- Kept Supabase URL and public publishable key unchanged; no credentials added.
- Game logic, visual effects, audio, and partner scene remain unchanged.

## Warnings
- Do not commit Supabase service_role / secret keys or MC passwords to a public repository.
- Verify Supabase authentication, host authorization, RLS, and cross-device synchronization on the deployed domain.
- Do not retire Netlify until GitHub Pages works reliably in the event environment.
- GitHub Pages serves static files; Supabase remains the backend for MC / Main Display.
- Do not treat local ZIP checks as a live website test.
