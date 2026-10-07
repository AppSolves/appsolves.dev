# AppSolves refinement — verification record

Branch: `redesign/portfolio-2026`. Date: 7 October 2026. No merge into main, push, release or deployment was performed.

## Final implementation

The warm editorial / industrial direction remains. Official violet replaces the global orange accent; the original logo contours now have a transparent compound-path cutout. Navigation, optimized favicon / touch icon, social preview and the 3D signature share that identity. Dark mode is warm graphite with authored neutral surfaces, accessible violet text and a lighter graphite object face. Contact closes in graphite with warm type.

System / Light / Dark use next-themes, a parser-time bootstrap and an accessible Radix radio menu. Choice persists; System follows OS changes. Legal and 404 pages use the same provider. Theme metadata updates with the resolved preference. Blocked or corrupt storage has a tested fallback.

Copy now connects Kaan directly to AppSolves. Fidan explicitly explains native binaries and compiler-grounded tooling. LanePilot adds owner-supplied approximate −39% hard-braking / +29% average-speed figures, labelled as simulation results and explicitly excluding public-road measurements. TagVault uses NFC terminology and states the paid Pro tier directly. The unnamed SME sentence and derivative appscreen-mcp entry are removed. [Porsche's official 2026 announcement](https://newsroom.porsche.com/de/2026/unternehmen/porsche-ferry-porsche-preis-verleihung-2026-42448.html) supports the short STEM / Baden-Württemberg context.

Spacing uses 12 / 20 / 28 / 40 / 56 / 80 / 112 / 144px for major relationships, with optical exceptions. Tablet hero composition is dedicated at 768–959px; mobile object width is capped at 320px. The project index retains three useful direct links without repeated intro text. Anchor offsets were corrected to avoid doubling scroll padding.

React / Vite / TypeScript / Tailwind, GSAP and Three.js are retained. This refinement adds only Sharp as a development asset tool; next-themes and Radix were already installed. An import-graph audit of static / dynamic imports found all remaining application modules reachable and all ten runtime dependencies used. Cleanup removes 57 unreachable source files, obsolete CSS / logos, the unused scaffold configuration / stale Bun lockfile and 45 unused runtime dependencies. Strict application TypeScript and unused-variable checks are enabled. Legal Markdown, CNAME and advertising verification content remain unchanged.

## Validation

- Node **22.23.3**, npm **10.9.9**. Clean lockfile installation verified in an isolated workspace cache, avoiding replacement of dependencies held by Windows preview processes.
- `npm run check`: application / config / test type checks, ESLint and production build pass.
- Browser suite: **43 passed**, zero retries, actual Chromium 147 against the production output.
- Axe WCAG 2 A / AA and 2.1 AA: zero detected violations in light and dark at all six automated viewport sizes, both legal pages, 404 and mobile theme / navigation menus. Automated results are not complete accessibility certification.
- No document overflow at 1920 × 1080, 1440 × 900, 1280 × 800, 820 × 1180, 390 × 844 or 320 × 568. Separate capture checks also cover 900 × 1100 and 960 × 900 in both themes. All requested project images decode.
- Theme tests cover OS defaults, explicit persistence / override, runtime OS changes after choosing System, light / dark bootstrap before React can execute, arrow-key selection, Escape / focus return, mobile interaction, corrupt and blocked storage, scene replacement and exactly one live canvas.
- Navigation checks cover disclosure state, Escape / focus return, anchor selection, desktop resize reset, sticky-header clearance and keyboard skip link.
- Legal checks cover direct static entry, full source document, canonical, accessible navigation and emitted build files. Correct project / email links, OG / Twitter image, sitemap, CNAME, app-ads and 404 output are asserted.
- WebGL tests verify compositor pixels change on pointer input, `preserveDrawingBuffer === false`, context-loss poster fallback, unavailable-WebGL content, reduced-motion disposal / recreation, and no scene download on mobile / reduced motion.
- Asset checks verify exact original SVG coordinates, transparent inset, official violet pixels, icon dimensions / payloads, every responsive derivative, poster transparency and complete dist output without megabyte source captures.
- `actionlint 1.7.12`: preview workflow passes.

## Manual visual QA

Rendered screenshots were manually inspected in both themes across all six required viewport sizes, with additional 900 / 960px transition captures. Review included first viewport, Fidan, LanePilot, TagVault, About / recognition, open source, Contact, mobile navigation, theme menu, keyboard focus and live-scene hover / pointer states. Light and dark posters and the share card were inspected separately.

Multiple passes refined tablet headline space, mobile object pacing, project / section gaps, the quiet graphite ending, simulation typography, image crop / quality and global violet consistency. No filler diagrams, extra cards or new visual effects were added.

The separate eight-viewport / two-theme pass produced 112 section captures and reported zero overflow, browser errors or Axe violations. The regression suite produces 60 section captures plus menu screenshots. Evidence remains in ignored `.cache/refinement-qa/`, `.cache/refinement-live/` and `test-results/`; re-running the suite regenerates its screenshots.

Final live-scene instrumentation in each theme counted **zero draw calls during 60 idle frames** and **zero during 60 offscreen frames**. Pointer input produced 672 draw calls over the measured 60-frame interval; no browser error / warning was recorded. This verifies on-demand behavior locally, not GPU energy consumption.

## Payload and lifecycle

- Initial application / React / runtime JS: approximately **154 kB gzip**. The accessible theme menu adds runtime code relative to the preceding design. Optional Three.js scene remains separate at approximately **155 kB gzip**; legal renderer / documents are separate.
- CSS falls from approximately **15.4 to 8.45 kB gzip** after scaffold removal.
- Original project images total **3,477,229 bytes**. At 390px / DPR 1 Chromium selects three AVIF files totaling **32,891 bytes**, approximately **99% less source-image payload**. Largest AVIF derivatives total **90,614 bytes**, approximately **97% less**. These are asset-size comparisons, not whole-page network benchmarks.
- LanePilot derivatives are 640 / 960 / 1288px; TagVault derivatives 320 / 540 / 800px. AVIF is preferred, WebP is the fallback, with responsive sizes and lazy decoding. Originals are retained outside public.
- Matching posters are approximately **52 kB each**; only the active theme's poster is requested. Social preview is approximately **78 kB**. Touch icon is **4,633 bytes**, ICO **930 bytes**, replacing the 1.68 MB PNG. Fonts remain self-hosted, approximately **89 kB**, with licenses. The render script verifies the production typefaces before capturing the share card.
- One scene, capped DPR 1.5, low-power hint, default drawing-buffer behavior, local environment, on-demand rendering, offscreen / hidden-tab suspension and resource disposal. Scene changes cancel pending work and dispose the prior instance.
- Semantic landmarks / headings, real links / buttons, visible violet focus, theme-aware contrast, descriptive image alternatives and a decorative canvas independent of content. Native scrolling remains.

## SEO, CSP and preview workflow

JSON-LD now contains separate Person and Organization nodes linked through founder; TUM affiliation, GitHub, LinkedIn and relevant topics remain. The unverified Twitter account handle is removed while Twitter cards remain. Canonical, OG, robots, sitemap and legal static metadata are preserved.

Production works without `unsafe-eval`. The meta CSP retains inline script / style permissions for the early theme bootstrap, next-themes, structured data and GSAP inline styles. Ineffective meta representations of HTTP-only security headers were removed. A meta CSP is not equivalent to all server response headers; deployed HTTP headers have not been verified, and GitHub Pages does not offer arbitrary header configuration.

`.github/workflows/preview-artifact.yml` uses Node 22, clean npm installation, typecheck, lint, build and `actions/upload-artifact@v4`. It uploads complete dist as `appsolves-preview-${{ github.sha }}`, retained seven days. Read-only contents permission, disabled checkout credential persistence and a branch guard constrain it to redesign review. It has **not run on GitHub yet**; only local installation / equivalent build steps and actionlint are verified. No deployment job is added.

## Remaining limits

Production dependency audit: **0 vulnerabilities**. Full audit: **15 development-toolchain advisories** (11 high, 4 moderate), including retained Tailwind / deployment / glob tooling. Resolving these requires a separate toolchain maintenance change; no full security-audit claim is made.

Safari, Firefox, physical iOS / Android, real integrated GPUs, deployed headers, indexing, social caches and field Core Web Vitals remain unverified. Chromium uses locally available software WebGL; media preferences are simulated. No Lighthouse score is claimed. This Windows sandbox verification used an independently running preview through PREVIEW_URL because managed-preview shutdown had been constrained earlier.
