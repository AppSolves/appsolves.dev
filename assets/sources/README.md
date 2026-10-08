# Preserved source assets

These files are inputs to asset generation, not publicly served files.

- `mark-original.svg`: the original official AppSolves mark from this branch before refinement. All three path contours are preserved verbatim. The generator joins the outer / inset paths using `evenodd`, replacing the background-colored inset with true transparency, and keeps the secondary curve. No coordinates are redrawn.
- `lanepilot-detection.png`: preserved historical 3839 × 2159 [perception screenshot](https://github.com/AppSolves/LanePilot/blob/v2/assets/github/vehicle_detection.png). Its former crop/derivatives are no longer published.
- `lanepilot-simulation.png`: unchanged 3840 × 1508 [simulation comparison](https://github.com/AppSolves/LanePilot/blob/5919b899de988ac8e7766acf0503b0139c980ada/assets/github/metrics.png), upstream `v2` commit `5919b899de988ac8e7766acf0503b0139c980ada`, Git blob `674cbc09538b49f8602085705f99cb3304268f21`. Split exactly at x=1920 into two complete panels, with AVIF/WebP widths 480/960/1920 and quality 90. The full comparison is a lossless WebP. No diagnostic, label, vehicle count or simulation step is altered. The two snapshots have different steps/counts and cannot establish a controlled benchmark. `metrics_evaluation.png` is not used.
- `google-play-original.svg`: original official storefront prism, preserved before monochrome conversion. The generator keeps every path and creates a currentColor outline for the small footer icon; no runtime hotlink.
- `tagvault-01.jpg`, `tagvault-02.jpg`: original 1080 × 2214 product captures from [TagVault screen 1](https://tagvault.appsolves.dev/tagvault/screens/1.jpg) and [screen 2](https://tagvault.appsolves.dev/tagvault/screens/2.jpg).

- `tagvault-phone/`: original GLB, source license and pinned provenance from the TagVault repository. `node scripts/optimize-phone.mjs` reproduces the compressed public model.

The mark and TagVault assets belong to AppSolves. LanePilot's repository license remains applicable. Run `npm run assets:optimize` to reproduce responsive AVIF / WebP files, the transparent mark, monochrome Play icon, favicon and 180px touch icon. Run `npm run assets:render` against the local site to capture matching light / dark 3D posters and the social card. `npm run assets:render -- --social-only` updates social typography using the existing high-resolution poster, without changing either scene's fallbacks. Generated production assets are committed under `public/`; originals remain here for reproducibility.

- `fidan/`: the official high-resolution icon, pinned to Fidan commit `82a317178994785823368b213c873ba9492b91d8`, and its upstream license. The optimized derivative trims transparent margins and fits the original artwork into a transparent 256px square with lossless WebP.
