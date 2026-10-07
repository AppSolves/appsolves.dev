# Published asset provenance

- `lanepilot-{640,960,1288}.{avif,webp}`: real [LanePilot vehicle-perception capture](https://github.com/AppSolves/LanePilot/blob/v2/assets/github/vehicle_detection.png), cropped to its existing perception viewport. No model output or detection overlays were fabricated.
- `tagvault-{01,02}-{320,540,800}.{avif,webp}`: actual [TagVault home screen](https://tagvault.appsolves.dev/tagvault/screens/1.jpg) and [scanning screen](https://tagvault.appsolves.dev/tagvault/screens/2.jpg), resized and encoded without altering the interface. Owned by AppSolves.
- `brand-object.png`, `brand-object-dark.png`: transparent 900 × 900 compositor captures of the production Three.js scene, using the exact official AppSolves contours, graphite / chrome and violet enamel. Used for mobile, reduced motion and WebGL failure.
- `../social-preview.png`: fixed warm-paper 1200 × 630 share composition, generated with the light scene, official violet mark and self-hosted fonts.

Original captures and exact SVG source remain outside the served directory in [assets/sources](../../assets/sources/README.md). `scripts/optimize-assets.mjs` generates image derivatives and transparent violet icons. `scripts/render-assets.mjs` generates posters and the social preview. Rebuild after regeneration.

Fidan's source example is adapted only for line wrapping from the [language README](https://github.com/fidan-lang/fidan#actions-functions). It is a specimen, not a running compiler. No measurements are inferred from assets. LanePilot's displayed impact figures are supplied simulation results, explicitly qualified in the page.

Manrope and Newsreader are self-hosted under the SIL Open Font License; licenses live in `../fonts/`. LanePilot's repository license remains applicable to its imagery.
