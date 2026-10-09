# Published asset provenance

- `lanepilot-{control,baseline}-{480,960,1920}.{avif,webp}`: authentic [LanePilot simulation](https://github.com/AppSolves/LanePilot/blob/5919b899de988ac8e7766acf0503b0139c980ada/assets/github/metrics.png). Source-faithful 1920 x 960 crops retain the road, vehicles and diagnostic values, removing oversized source titles and empty bottom margins. `lanepilot-simulation-full.webp` preserves the unchanged full comparison losslessly. Different steps and vehicle counts make this illustrative evidence, not a controlled benchmark. Historical perception derivatives are no longer served.
- `tagvault-01-1080.webp`: actual [TagVault home screen](https://tagvault.appsolves.dev/tagvault/screens/1.jpg), retained at its original 1080 × 2214 resolution for the phone display, with WebP quality 95 without altering the interface. Owned by AppSolves. Unused flat-phone derivatives were removed; original captures remain outside public.
- `brand-object{,-dark}.{avif,webp}`: transparent 1440 × 1440 compositor captures of the production Three.js scene, using the exact official AppSolves contours, chrome sides and violet enamel on both front faces. Used for mobile, reduced motion and WebGL failure.
- `tagvault-phone.{avif,webp}`: transparent 1600 × 1600 compositor capture of the original TagVault product model, using its actual screen mapping and screenshot. See [phone provenance](../../assets/sources/tagvault-phone/README.md).
- `../social-preview.png`: fixed warm-paper 1200 × 630 share composition, generated with the light scene, official violet mark and self-hosted fonts.

Original captures and exact SVG source remain outside the served directory in [assets/sources](../../assets/sources/README.md). `scripts/optimize-assets.mjs` generates image derivatives and transparent violet icons. `scripts/render-assets.mjs` generates posters and the social preview. Rebuild after regeneration.

Fidan's source example preserves the real single-line action signature from the [language README](https://github.com/fidan-lang/fidan#actions-functions). It is a specimen, not a running compiler. No measurements are inferred from assets. No percentage improvements are claimed for LanePilot; diagnostics visible in the source are not treated as a controlled evaluation.

Manrope and Newsreader are self-hosted under the SIL Open Font License; licenses live in `../fonts/`. LanePilot's repository license remains applicable to its imagery.

- `fidan-icon.webp`: lossless 256 × 256 derivative of the [official Fidan icon](https://github.com/fidan-lang/fidan/blob/82a317178994785823368b213c873ba9492b91d8/assets/icons/icon.png). Transparent margins are trimmed and square padding restored for optical sizing; artwork is unchanged. Source and upstream license remain in `assets/sources/fidan/`.
