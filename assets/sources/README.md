# Preserved source assets

These files are inputs to asset generation, not publicly served files.

- `mark-original.svg`: the original official AppSolves mark from this branch before refinement. All three path contours are preserved verbatim. The generator joins the outer / inset paths using `evenodd`, replacing the background-colored inset with true transparency, and keeps the secondary curve. No coordinates are redrawn.
- `lanepilot-detection.png`: original 3839 × 2159 [LanePilot perception screenshot](https://github.com/AppSolves/LanePilot/blob/v2/assets/github/vehicle_detection.png). The published crop is left 169, top 225, width 1288, height 720 — the same viewport previously selected by CSS. It removes editor chrome, not detection information from that viewport.
- `tagvault-01.jpg`, `tagvault-02.jpg`: original 1080 × 2214 product captures from [TagVault screen 1](https://tagvault.appsolves.dev/tagvault/screens/1.jpg) and [screen 2](https://tagvault.appsolves.dev/tagvault/screens/2.jpg).

- `tagvault-phone/`: original GLB, source license and pinned provenance from the TagVault repository. `node scripts/optimize-phone.mjs` reproduces the compressed public model.

The mark and TagVault assets belong to AppSolves. LanePilot's repository license remains applicable. Run `npm run assets:optimize` to reproduce responsive AVIF / WebP files, the transparent mark, favicon and 180px touch icon. Run `npm run assets:render` against the local site to capture matching light / dark 3D posters and the social card. Generated production assets are committed under `public/`; originals remain here for reproducibility.

- `fidan/`: the official high-resolution icon, pinned to Fidan commit `82a317178994785823368b213c873ba9492b91d8`, and its upstream license. The optimized derivative trims transparent margins and fits the original artwork into a transparent 256px square with lossless WebP.
