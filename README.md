# GSFCU Voice — Portal Countdown Launch

## Run the launch
1. Extract the ZIP file.
2. Keep `index.html`, `style.css`, `script.js`, and the `assets` folder together.
3. Open `index.html` in a modern browser. For local development, VS Code + Live Server is convenient.

## Experience
- Start screen with **START COUNTDOWN**.
- Click to start or press **Enter**.
- A holographic portal powers up with a countdown from **10 to 1**.
- At 1, the GSFCU Voice profile emblem materializes above the portal.
- The full GSFCU Voice logo appears on the finale screen with a **VISIT GSFCU VOICE** link.
- Press **R** or click **REPLAY LAUNCH** to restart.
- Press **Space** during the countdown to skip to the logo reveal.
- Use **FULLSCREEN** for presentation mode; press **Esc** to exit fullscreen.

## IMPORTANT: Add the real app link
Open `script.js` and replace:
`const APP_URL = "YOUR_APP_URL_HERE";`
with your actual website URL, including `https://`, for example:
`const APP_URL = "https://your-real-domain.example";`

Do not leave the example value in place. The link intentionally won't navigate until the real URL is configured.

## Branding
- The logo and profile image supplied by you are included in `assets/`.
- The reference portal image is included as `assets/portal-visual-reference.png` for your reference.
- Main colors are CSS variables near the top of `style.css`.

## Notes
The countdown is a visual presentation sequence. It does not start or diagnose real app services. The final link opens the real application once you add its URL.


## Refined launch effects
- Countdown numbers trigger a locally synthesized electronic tick using the Web Audio API (the browser may require the initial Start button click to enable audio).
- The final count triggers a cyan energy flash, expanded portal glow, and particle burst.
- The emblem rises from below the portal into the center of the holographic column.
- The beam is now a wide, layered cyan light column with a bright inner core.
- The application CTA remains configured for http://gsfcuvoice.gsfcuniversity.ac.in/.
\n\nSunrise center-rise update: the emblem rises slowly from the portal horizon toward the screen center, holds for 3 seconds after completing its 5.2-second ascent, then transitions to the finale. The emblem halo is circular to match the logo.\n