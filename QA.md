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

Refinement passes corrected the phone's edge clearance, the 320px Fidan wordmark clipping, footer-support contrast, stale phone entrance selectors and Radix pointer hover retaining a keyboard-style outline. The wordmark has a regression assertion for its real text bounds. No random technical artwork, extra card system, global glass or decorative 3D was added. Internal arrows and touch targets are coherent. Final captures have no horizontal overflow or page errors at any of the seven sizes.

Raw local evidence is ignored under `.cache/launch-qa/` and `test-results/`. CI uploads the rendered review captures, rather than placeholder images. The new phone drag pixel comparison also passes with SwiftShader, including CI. The inherited hero test keeps its established CI handling because its much smaller pointer offsets can yield identical software-rendered captures.

## Payload and lifecycle

- Initial application / React / runtime JS is approximately **156 kB gzip**; CSS approximately **8.94 kB gzip**. Optional shared Three.js is approximately **151 kB gzip** plus a 35 kB shared helper chunk. Brand code is approximately 11 kB gzip; phone-specific loader / interaction code approximately 23 kB gzip. Code splitting keeps both optional scenes out of reduced-motion initial loading.
- At 390px / DPR 1, LanePilot's AVIF plus the matching phone poster total roughly **23 kB**. The active phone's 540px screen texture is requested only with its model near the section. AVIF phone poster is 10,263 bytes; WebP fallback 13,262 bytes. These are asset sizes, not whole-page Core Web Vitals claims.
- Both scenes cap DPR at 1.5, request low-power rendering, keep `preserveDrawingBuffer: false`, and stop after settling. Local instrumentation measured zero idle GPU draw submissions for both scenes in both themes. The phone regression measures zero offscreen submissions after the intersection handoff; one previously queued frame during that handoff is excluded by synchronizing with browser frames.
- The original model is 2.1 MB only when its section approaches. Reduced motion avoids its module and model. Context failure returns to a real rendered poster. Pointer capture, cancellation, resize / visibility observers, geometries, materials, textures, image bitmaps and renderer resources have explicit cleanup.

## Review artifacts and GitHub evidence

Launch implementation `ebd9a71a012c80fcf87b1ee11406c5240cd2fd06` has a [successful GitHub run](https://github.com/AppSolves/appsolves.dev/actions/runs/37676045521): clean install, typecheck, lint, build, all 58 Chromium / Firefox / WebKit checks, complete preview and real visual-review artifacts. The older predecessor at `187198c` produced duplicate push/PR runs; the launch workflow removes that PR trigger.

The updated workflow runs only on redesign pushes and manual dispatch on that branch. It uploads `appsolves-preview-<full SHA>` (complete dist) and `appsolves-visual-review-<full SHA>` (real captures), retains seven days, uses read-only contents permissions and never deploys. README documents downloading and serving the extracted artifact with Python's standard library independently of the checkout.

The final pointer-hover commit `f20cda5` passed build checks and produced a standalone preview that was downloaded and verified with both real WebGL scenes, legal routes, 404 metadata and zero page errors. Its [CI run](https://github.com/AppSolves/appsolves.dev/actions/runs/37676999528) timed out before tests because `azure.archive.ubuntu.com` stalled during Playwright's apt dependency installation. The workflow now uses the official version-matched Playwright container, with browsers and OS dependencies already installed, instead of weakening checks or extending the timeout. The container runs as its documented UID 1001 so Firefox's process and home-directory ownership agree; an initial root-container run passed 54 checks but Firefox refused launch before page load. All 58 checks also passed locally on the final application commit with one worker; a two-worker local run had a traced Chromium `ERR_NO_BUFFER_SPACE` resource failure, and its two affected checks passed separately. Assertions and application behavior were unchanged.

## Limits

Playwright WebKit / Firefox checks were run; physical Safari / iOS / Android devices, real field Core Web Vitals, production server headers, search indexing and social-platform caches were not verified. No Lighthouse score, GPU energy-consumption claim or full security-audit claim is made. The model's source license is preserved; its original GLB header contains no additional author/license attribution to invent.

## Copy punctuation audit

The copy pass covers every portfolio section, navigation and theme labels, footer, image captions and alt text, 404, metadata, the no-JavaScript fallback and the social-preview generator/image. Removed ornamental em dashes from social alt text and fallback prose, the LanePilot text arrow, and all portfolio middle-dot separators. Award details use normal wording; compact technology labels use slashes. Simplified repeated "from X to Y" framing and generic slogans in the hero description, LanePilot, TagVault, open source and contact. The headline and specific About examples remain.

The production text scan for `—`, `–`, `→`, `↗` and `←` found only 15 intentionally retained em dashes in pre-existing legal source documents. Each was reviewed: privacy policy line 1 (heading); lines 49, 51, 53, 55, 57 and 59 (purpose/legal-basis separators); lines 83, 84 and 85 (provider explanations); line 103 (two parenthetical delimiters); line 137 (two consent-clause delimiters). Terms line 1 retains its heading separator. These legal documents were not introduced by the redesign and remain byte-for-byte unchanged. Their copied Markdown and bundled rendered text are intentionally retained; no dependency or generated JavaScript was edited to eliminate search hits.

Also retained: `≈` and the mathematical minus `−` in approximate simulation results, percentages, `+29%`, compact technical slashes, ordinary hyphens, code syntax, natural apostrophes and the copyright symbol. Lucide/SVG directional icons remain navigation controls, not marketing punctuation. Real product screenshots are unchanged. The social card has no raw arrows or dash separators and needs no image regeneration because its visible text is unchanged.

`tests/copy.spec.ts` checks rendered homepage/404 text, accessible labels and social metadata, plus every production HTML shell including the no-JavaScript fallback. It excludes scripts, styles and code examples and does not enforce a punctuation ban on legal documents.

Copy-pass validation: typecheck, lint and production build passed; all 59 local browser checks passed (Chromium, Firefox and WebKit). Fresh desktop/mobile captures were inspected for headline/description wrapping, the longer open-source heading at 320px, LanePilot captions, recognition and footer copy. The unchanged social image was inspected directly. No layout/style or dependency change was needed.

## Focused visual / interaction quality pass

Baseline: `ec65ba35b3bea3d63be4305951a29d6d6f12becf`, synced from origin with a fast-forward-only pull. This pass preserves all approved prose and the existing PR. YouTube now points to `https://youtube.com/@appsolvesdev`; exact regression assertions cover all seven social destinations and both support links.

### Signature rendering changes

| Setting                | Before                        | After                                                                                     |
| ---------------------- | ----------------------------- | ----------------------------------------------------------------------------------------- |
| Both canvases          | Native DPR capped at 1.5      | Shared 2x floor; 2.25x desktop / 2x coarse-pointer ceiling, refreshed on resize           |
| Hero curves / bevels   | 24 / 5 segments               | 64 / 8, unchanged official contours and bevel dimensions                                  |
| Hero shadow            | 1024 square, radius 8         | 2048 square, radius 16 to retain softness                                                 |
| Hero posters           | 900 square PNG                | 1440 square transparent AVIF / WebP, quality 82 / 95                                      |
| Phone material texture | 1024 square, WebP 85          | Original 2048 square, WebP 95, no upscaling                                               |
| Phone live screen      | 540 × 1107, WebP 88           | Original 1080 × 2214, WebP 95; trilinear mipmaps and device-supported anisotropy up to 16 |
| Phone poster           | 640 square, AVIF 65 / WebP 88 | 1600 square, AVIF 82 / WebP 95                                                            |
| Phone GLB              | 2,096,792 bytes               | 3,086,584 bytes; all 21 meshes and original vertex attributes retained                    |

Actual backing measurements at 1440 × 900, CSS hero 560 square / phone 677 × 492: DPR 1 changes 560 square / 677 × 492 to **1120 square / 1354 × 984**. DPR 2 changes 840 square / 1015 × 738 to the same **1120 square / 1354 × 984**. Additional actual browser contexts at DPR .75 preserve the 2x floor; DPR 2.5 / 3 reach the 2.25x ceiling (hero 1260 square / phone 1523 × 1107). Resize tests simulate a zoom-driven DPR change and assert the live backing floor. Physical Retina hardware and browser chrome zoom were not separately tested.

Original and optimized phone models were rendered at DPR 2, front and bounded rotation. Frame, buttons, glass and screen were compared directly. A reproducibility regression regenerates the entire GLB and compares bytes. It also checks exact original attribute values after vertex reordering, index counts, mesh count and embedded texture dimensions. The old optimizer pruned unused UVs; this pass explicitly preserves them instead of weakening the geometry check. No simplify or quantize transform is used.

Higher density costs 4x the former canvas pixels at DPR 1 and about 1.78x at DPR 2. The shadow map and material texture each have 4x as many pixels. Screen pixels increase 4x, with mipmaps adding roughly one third to texture storage. The lazy model gains about 0.99 MB, the screen about 87 KB, and the AVIF phone poster about 29 KB. Hero AVIFs are about 43 KB each versus 52–53 KB PNGs previously. No dependency or postprocessing was added. On-demand rendering, proximity loading, offscreen / hidden suspension, default non-preserved buffers, context-loss fallback and full disposal remain intact. Instrumented 30-frame samples at DPR 2 in both themes recorded **zero draw submissions** while idle, offscreen and under a simulated hidden-tab signal. This is lifecycle evidence, not a hardware power benchmark.

### Interaction and Fidan

Only actual directional SVG arrows receive `data-arrow-motion`: external (+2.5, -2.5), down (0, 3), up (0, -3), return/home (-3, 0). One CSS rule uses 200ms cubic-bezier(.2,.65,.3,1) for hover and focus-visible. Reduced motion removes translation while retaining existing underline/color/focus feedback. Platform, mail, support, menu and theme icons stay still. Compact footer home actions use a left arrow. Regression checks cover all directional SVG annotations and representative hover/focus actions, including the mobile menu and legal/404 returns. Tests wait for real fonts and the hero entrance to settle before positioning the pointer.

The official [Fidan icon](https://github.com/fidan-lang/fidan/blob/82a317178994785823368b213c873ba9492b91d8/assets/icons/icon.png) is preserved at its pinned commit, with its license, and locally derived to a 256px lossless WebP. The desktop field changes from 1.12fr / 1fr to **0.65fr / 1.35fr**, with 48px horizontal padding and a 32px gap. Code is sized between 13px and 16px, with a defined forest inset. At <=1100px the identity/specimen stack. The 320px lockup was optically resized after its original large wordmark failed the existing clipping assertion.

Keywords are orchid, functions blue, identifiers/interpolation coral, types gold, strings soft green, punctuation warm neutral and numbers muted neutral. The exact requested greet example has five source lines and an unbroken desktop signature. A separate aria-hidden, nonselectable number gutter does not contaminate copied code. Narrow screens retain preformatted source and horizontal keyboard-accessible scrolling. No fake title bar or terminal controls were added.

### Validation and review evidence

TypeScript, ESLint, production build, actionlint and `git diff --check` pass. **69 browser / asset checks pass locally**, up from 59: Chromium comprehensive suite and four smoke cases each in Firefox/WebKit. Existing assertions remain intact; asset dimension/budget assertions now describe the deliberately higher-resolution outputs. New checks cover social destinations, arrow semantics/focus/reduced motion, both actual canvas ratios at DPR 1/2, resize density policy, full-resolution assets, official Fidan source hash, five-line code and desktop/mobile layout, and model geometry/reproducibility. Axe reports zero violations across both themes at all seven widths and existing legal/menu/404 checks. One local WebKit font-check timing failure passed unchanged on the focused and final full runs.

Visual review covers **1920 × 1080, 1440 × 900, 1280 × 800, 960 × 900, 820 × 1180, 390 × 844 and 320 × 568**, both themes. DPR 1/2 close-ups show the hero cutout, secondary curve, silhouette/bevels/shadow, phone front/held drag, and Fidan stage/syntax. High-resolution poster fallbacks were reviewed separately. Lazy posters are awaited before screenshots; full-page crops avoid sticky-header overlap on elements taller than the viewport. Local comparison, density and lifecycle evidence stays ignored in `.cache/quality-pass/`.

The existing CI workflow is unchanged and uploads `appsolves-preview-<SHA>` and `appsolves-visual-review-<SHA>`. Added browser captures put high-DPI hero, Fidan stage/syntax, phone front and rotated close-ups in the visual artifact. No merge or deployment is part of this workflow.

CI capture follow-up: the first quality-pass run had seven timeouts under parallel SwiftShader rendering (62 checks passed). Trace evidence measured roughly 10 seconds per high-DPI compositor capture. CI now runs one worker; only the six live GPU interaction/capture cases declare Playwright's 3x slow-test budget in CI. Ordinary checks retain 30 seconds and retries remain zero. All backing, pixel-response, lifecycle and accessibility assertions remain unchanged. Arrow CSS tests load the existing poster fallback while the separate real-scene suite exercises full-quality WebGL. Explicit instant target positioning avoids native smooth-scroll/focus races before hover measurements; the test now also verifies actual hover state.

## Final editorial and micro-polish pass, 2026-10-08

Started from a clean, synchronized `a26a6f58d5d7b0c0614e7090a1121c2158916057` on `redesign/portfolio-2026`. [EDITORIAL.md](EDITORIAL.md) records every meaningful before/after copy change, every reviewed/retained public text surface, source revisions, factual limits, and the visual decisions. Hero headline, themes/type/colors, source example/syntax, both scenes and quality policies, original assets/posters, arrow motion and theme transition remain unchanged. Legal source text, dependencies and workflow are untouched.

### Regression coverage

The suite contains **71 checks**, up from 69. Two focused checks cover consistent public descriptions/positioning and the verified direct TagVault listing, plus all seven social labels fitting balanced rows at fourteen widths (1920, 1440, 1280, 1101, 1100, 1024, 960, 900, 899, 820, 768, 767, 390, 320). The footer case captures 1101/960/320px review views. The existing exact-source regression also checks the real overflow hint, its accessible description, native scrolling via keyboard and absence on desktop. Existing website-link assertions now use the edited label, preserving href/rel and lifecycle assertions. No assertion is removed, skipped or loosened, and no retries/timeouts/config changes are introduced.

Typecheck, ESLint and production build pass. A full local Windows run passed **70/71**; the 1920px light navigation stalled with the Newsreader preload pending in its network trace (`status: -1`, no response). The identical focused case passed unchanged and produced the missing screenshot. This is the same intermittent local navigation/font issue documented in the prior pass, not a claim of a single green local full run. Chromium 153 also stalled during the first comparison navigation; Chromium 147 completed the captures. Firefox/WebKit smoke checks passed; local WebKit used the existing process-only DPIUNAWARE setting. Final GitHub Actions remains the gate for an uninterrupted complete suite, production preview and visual-review artifacts; its exact final run/SHA are reported with the delivered branch.

Axe reports zero WCAG 2 A/AA and 2.1 AA violations across both themes at all seven viewport sizes, legal/404 routes and the existing menu/theme checks. The native code cue is outside selected source, identified via aria-describedby and backed by a disposed ResizeObserver; social links retain 44px minimum targets. Scene backing/DPR, idle/offscreen drawing, context loss, touch scrolling and reduced-motion assertions passed unchanged. Asset/model reproduction checks remain green.

### Actual visual review

Reviewed all seven scroll stages and both themes at **1920 × 1080, 1440 × 900, 1280 × 800, 960 × 900, 820 × 1180, 390 × 844 and 320 × 568** using actual production browser captures, assembled into fourteen contact sheets under ignored `.cache/editorial/sheets`. Full-page desktop/tablet/mobile views and focused Fidan/footer/phone views supplement those sheets. Shorter hero/About copy and project paragraphs fit the established grids without spacer filler or typography changes. The existing selected-work hierarchy and media-to-text alignment remain deliberate.

Initial focused checks found a 1px Google Play label overflow at 320px; the compact grid’s column gap was refined from 8px to 6px, retaining 12px labels and balanced 2 + 2 + 3 rows. The exact width assertions now pass. The native scrollbar was visually too subtle in Chromium; add the small, conditional “Scroll horizontally” cue rather than an overlay or large swipe label. Desktop code remains unchanged.

Real DPR 2 phone comparisons at current, +15% and +25% projected size were captured front/dragged in both themes. +25% clips the bottom, +15% approaches the edge under rotation, so retain current scene and poster framing. The existing high-DPI front/held-drag artifact captures remain available. LanePilot’s repository GIF and HUD concept were visually inspected; the current physical test/detection image remains stronger actual evidence, so its crop/assets are unchanged. See EDITORIAL.md for the qualified simulation-evidence limitation.

No new GPU work, continuous animation, texture/model loading, postprocessing or asset-budget increase is introduced. Google Play is a small local SVG, without an external runtime request. The only new runtime measurement is the source overflow observer.

## Pre-merge cleanup, 2026-10-08

Synchronized the clean redesign branch at `5c5aaa86696759251cf2c8c08ac4fd52c327c1fb`. Removed the two unsupported LanePilot simulation percentages after inspecting both upstream branch trees/documentation, evaluator/environment/configuration, old dataset archive and release assets. Replaced the numerical block with the documented simulation measures and explicit public-road qualification. Removed the About heading's period and verified the concise Abitur award description against Porsche's official announcement. The evidence and exact copy changes are recorded in EDITORIAL.md; current DESIGN.md/STORYBOARD.md now match the implementation. No other visual or public-copy changes.

Typecheck, ESLint and production build pass. All **71 browser/asset checks passed in one local run** (44.1 seconds), including Firefox/WebKit smoke and Axe checks across the existing viewport/theme matrix. Existing editorial regression now rejects the withdrawn percentages and asserts the qualitative evaluation, exact About heading and award wording; the 14 viewport/theme checks retain their simulation/public-road distinction. No tests are skipped or loosened and no test count, retry or timing policy changes. Actual LanePilot/About screenshots were reviewed in light desktop and dark mobile views; no responsive layout changes are required beyond removing unused metric styling. Final pushed CI and artifact status are reported with the delivered SHA; no merge/deployment is authorized.
