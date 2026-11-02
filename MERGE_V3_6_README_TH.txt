Guardian of Finance V3.6 — Integration Candidate (local test only)

Baseline: V2.7 Magical School Audio Test
Imported from senior V3.5.2: result reveal animation, magic circle, fog, particles, and card flip sound.
Preserved: 3-scene music, V2.6 audio engine, sound toggle, sliders, game questions, scoring, cards and PNG export.
No Hedwig theme file is used or copied into this build.

Test with: py -m http.server 8000
Visit: http://localhost:8000/play.html?audioDebug=1
Verify: scenes 1-3, volume controls, reveal, card flip, PNG front/back, restart, mobile layout.
Browser runtime testing remains required; static checks do not guarantee animation compatibility.
