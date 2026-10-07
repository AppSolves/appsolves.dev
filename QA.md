# Launch-polish verification

Date: 7 October 2026. Branch: `redesign/portfolio-2026`. Existing review: [PR #1](https://github.com/AppSolves/appsolves.dev/pull/1). No merge, release or deployment.

## Result and design judgment

The warm editorial / industrial direction remains. Four headline options were rendered in the actual hero at 1440 × 900 and 390 × 844 before implementation. **Think deeply. Build real things.** won because its active phrasing connects engineering depth to usable output without narrowing the work to products alone. Optical line separation, a shorter header and viewport-aware object / hero sizing bring identity, positioning, CTA and TUM context into the desktop first viewport.

The official mark has unchanged contours and a true transparent cutout. A square, optically centered viewBox supplies the SVG favicon, 16px / 32px ICO entries and 180px touch icon. Both hero front surfaces use violet physical enamel with clearcoat; the sides remain metal. Matching light / dark posters and the social card were regenerated. The AppSolves wordmark has no trailing period.

TagVault reuses the real model and screen/drag logic from [its own repository at e17d6df](https://github.com/AppSolves/TagVault/tree/e17d6df11a6d1251b6f395c067ef6a82f50b5992/website). All 21 meshes remain; 8,957,824 source bytes become 2,096,792 public bytes through mesh compression and texture encoding, without geometry simplification. The original binary / license / provenance are retained outside public. The camera widens from 23 to 26 degrees to keep the phone clear of its media edge. The port uses existing Three.js, rather than adding a second 3D framework.

Mobile integrates native theme radios into navigation; desktop keeps a quiet dropdown. Explicit theme changes reveal radially over 480ms. Unsupported browsers / reduced motion apply immediately. Initial and OS changes do not animate. Latest-choice generations and transition cancellation avoid stale rapid-input callbacks.

Fidan's compiler-toolchain category and specimen caption are more precise. LanePilot's approximate −39% / +29% figures remain explicitly simulation-only. Recognition uses Competition. Open source uses a quieter sans heading. All three project media fields share 24px corners / 20px mobile. Real social and support destinations were restored from repository history beneath the main email action. Unused flat-phone CSS and eleven deployed screenshot derivatives were removed; source captures remain.

## Local validation

- Clean `npm ci` on Node 22.23.3, TypeScript, ESLint and production build: passed.
- **58 Playwright checks**: comprehensive Chromium plus four Firefox and four WebKit smoke cases; passed against the production preview. The suite covers both themes, accessibility, fonts, real links, navigation / focus, themes / storage / pre-paint, transition behavior, phone lazy loading / drag / context loss / reduced motion / offscreen GPU submissions, legal direct entries and static/runtime 404 behavior.
- Axe WCAG 2 A / AA and 2.1 AA: zero violations at all seven Chromium sizes / both themes, legal and 404 routes, menus, and smoke cases. Automated Axe is not a substitute for a full assistive-technology audit.
- actionlint 1.7.12: passed. Production dependency audit: **0 vulnerabilities**. Full dev-tool audit retains **15 advisories** (11 high / 4 moderate); no forced unrelated toolchain migration was made.
- Asset tests verify unchanged contours, real alpha, correct raster dimensions / ICO entries, bounded payloads, complete build assets and legal / 404 metadata. No JavaScript `unsafe-eval` is permitted; only the meshopt decoder's narrower `wasm-unsafe-eval` and local blob decoding were added to CSP.
- Clean installation initially found a Windows native-module lock held by local Vite servers. Closing those verified servers allowed the clean install. Firefox's Windows tab process required running browser QA outside the tool sandbox. WebKit on the high-DPI display initially divided CSS widths by three; a process-only DPI compatibility setting restored exact 1440px / 390px widths. Smoke tests now assert actual viewport width and explicitly synchronize font loading. No application layout workaround or weakened assertion was used for those environment issues.

## Visual review and refinement

The production page was captured and inspected in light and dark at **1920 × 1080, 1440 × 900, 1280 × 800, 960 × 900, 820 × 1180, 390 × 844 and 320 × 568**. Captures include hero, Fidan, LanePilot, TagVault, about, open source, contact, menus and full pages. Real WebGL, scroll / pointer response, phone drag and poster fallbacks were inspected separately from reduced-motion accessibility captures.

Refinement passes corrected the phone's edge clearance, the 320px Fidan wordmark clipping, footer-support contrast and stale phone entrance selectors. The wordmark has a regression assertion for its real text bounds. No random technical artwork, extra card system, global glass or decorative 3D was added. Internal arrows and touch targets are coherent. Final captures have no horizontal overflow or page errors at any of the seven sizes.

Raw local evidence is ignored under `.cache/launch-qa/` and `test-results/`. CI uploads the rendered review captures, rather than placeholder images. The new phone drag pixel comparison also passes with SwiftShader, including CI. The inherited hero test keeps its established CI handling because its much smaller pointer offsets can yield identical software-rendered captures.

## Payload and lifecycle

- Initial application / React / runtime JS is approximately **156 kB gzip**; CSS approximately **8.94 kB gzip**. Optional shared Three.js is approximately **151 kB gzip** plus a 35 kB shared helper chunk. Brand code is approximately 11 kB gzip; phone-specific loader / interaction code approximately 23 kB gzip. Code splitting keeps both optional scenes out of reduced-motion initial loading.
- At 390px / DPR 1, LanePilot's AVIF plus the matching phone poster total roughly **23 kB**. The active phone's 540px screen texture is requested only with its model near the section. AVIF phone poster is 10,263 bytes; WebP fallback 13,262 bytes. These are asset sizes, not whole-page Core Web Vitals claims.
- Both scenes cap DPR at 1.5, request low-power rendering, keep `preserveDrawingBuffer: false`, and stop after settling. Local instrumentation measured zero idle GPU draw submissions for both scenes in both themes. The phone regression measures zero offscreen submissions after the intersection handoff; one previously queued frame during that handoff is excluded by synchronizing with browser frames.
- The original model is 2.1 MB only when its section approaches. Reduced motion avoids its module and model. Context failure returns to a real rendered poster. Pointer capture, cancellation, resize / visibility observers, geometries, materials, textures, image bitmaps and renderer resources have explicit cleanup.

## Review artifacts and GitHub evidence

The predecessor `187198c81fe0c5ec624026795699e55c33e2a062` has a [successful GitHub run](https://github.com/AppSolves/appsolves.dev/actions/runs/37653633687) with build, browser checks and review artifacts. That older workflow produced duplicate push/PR runs; this pass removes the PR trigger.

The updated workflow runs only on redesign pushes and manual dispatch on that branch. It uploads `appsolves-preview-<full SHA>` (complete dist) and `appsolves-visual-review-<full SHA>` (real captures), retains seven days, uses read-only contents permissions and never deploys. README documents downloading and serving the extracted artifact with Python's standard library independently of the checkout.

## Limits

Playwright WebKit / Firefox checks were run; physical Safari / iOS / Android devices, real field Core Web Vitals, production server headers, search indexing and social-platform caches were not verified. No Lighthouse score, GPU energy-consumption claim or full security-audit claim is made. The model's source license is preserved; its original GLB header contains no additional author/license attribution to invent.
