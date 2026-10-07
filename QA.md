# AppSolves redesign — verification record

Review branch: `redesign/portfolio-2026`. Verification date: 7 October 2026. No merge into `main`, deployment or release was performed.

## Direction and implementation

Warm paper, graphite, forest and vermilion; Manrope with restrained Newsreader italic. The opening pairs specific positioning with a solid extrusion of the existing AppSolves mark. Fidan leads the work, LanePilot demonstrates intelligent systems, and TagVault demonstrates a shipped commercial product. Smaller engineering work remains a text index. The cofounder venture is context, not an agency pitch.

React / Vite / TypeScript / Tailwind are retained. Runtime additions are `three`, `gsap` and `@gsap/react`; verification additions are Playwright, axe and Three.js types. No smooth-scroll engine, React Three Fiber, shader framework, remote HDR, analytics or external font request is needed.

Changed areas: homepage composition and copy, navigation / footer, responsive CSS, the lazy brand scene, legal-page presentation, metadata / social assets, font and project assets, static route generation, build verification and browser tests. Three unused scaffold components (`calendar`, `chart`, `resizable`) had incompatible installed-library APIs and no callers; they were removed when the previously empty application typecheck was corrected. Existing legal Markdown, CNAME and advertising verification content are unchanged.

## Checks

- `npm run check`: application / config / test type checks, ESLint and production build pass. The typecheck now follows project references rather than checking an empty root project.
- Browser regression suite: **14 passed**, zero configured retries. Actual Chromium 147 against the production build.
- Axe WCAG 2 A / AA and 2.1 AA: zero detected violations at all five viewport sizes and on both legal pages. This is automated evidence, not a claim of complete accessibility certification.
- No horizontal document overflow at 1440 × 900, 1920 × 1080, 820 × 1180, 390 × 844 or 320 × 568. Images load and decode. Core positioning, all three projects and five open-source entries are present.
- Mobile disclosure: open / close, Escape and focus return, anchor selection, and resize to desktop / back. Keyboard skip link reaches the main landmark.
- Legal routes: direct entry, full bundled source document, canonical URL, accessible navigation back to work, generated static entry and HTTP 200.
- Correct project / email destinations, external-link safety attributes, Open Graph / Twitter image, 404 output, sitemap, CNAME and app-ads preservation.
- Real WebGL: pointer movement changes the rendered image; context loss restores the poster; reduced-motion changes dispose and recreate the scene; unavailable WebGL preserves content. Mobile and reduced motion do not request the Three.js scene chunk.

## Visual refinement

The current site and the required reference sites were inspected before implementation. First implementation captures were reviewed across desktop, wide desktop, tablet and mobile. Subsequent passes reviewed the production build's opening, Fidan, LanePilot, TagVault, about / recognition, open source and contact, including hover and mobile-menu states.

Refinements included restoring the actual LanePilot perception crop without editor chrome, improving the mark's graphite / chrome materials and shadow, balancing project spacing, removing an unsupported registration symbol, keeping the contact headline / email readable on 320px screens, and removing a redundant mark caption that overlapped the shadow at tablet width. A preference-toggle test caught ScrollTrigger restoring inline smooth scrolling; the reduced-motion CSS rule now takes precedence.

The final live-scene capture pass reported no browser errors or warnings. Render instrumentation counted zero WebGL draw calls during 60 idle animation frames and zero during 60 frames with the hero offscreen; pointer input produced renders. This verifies the on-demand rendering behavior locally, not a battery / GPU benchmark.

One concurrent verification run stalled on a local stylesheet request. The same test passed in isolation; a fresh production preview passed the full suite and the separate manual capture pass. No timeout increase, retry or weakened assertion was added. The original test-managed preview's shutdown was also constrained by this Windows sandbox; the recorded suite used an independently running preview through `PREVIEW_URL`.

Browser tests save 25 section screenshots in ignored `test-results/`. Manual reference, first-render and final live-scene captures remain in ignored `.cache/`; they are review evidence, not production assets. Re-run the suite to regenerate screenshots.

## Performance and accessibility decisions

- Initial application, React vendor and runtime JavaScript total approximately **127 kB gzip**; CSS approximately **15.4 kB gzip**. Legal Markdown / renderer load separately. The optional desktop scene is approximately **155 kB gzip** and is never required for content.
- Fonts total approximately **89 kB**, self-hosted and preloaded. The brand poster is approximately **92 kB**. Project images total approximately **3.48 MB**, lazy-loaded below the hero; the original captures retain full quality. Smaller responsive derivatives would be a useful subsequent bandwidth improvement.
- One scene, capped DPR 1.5, low-power hint, render on demand, offscreen / hidden-tab suspension, local environment lighting, and resource disposal. Mobile / reduced motion / WebGL failure use the matching poster.
- Semantic landmarks and headings, visible focus, real anchors / buttons, decorative canvas hidden from assistive technology, descriptive project-image alternatives, and content available independently of animation. Native scrolling is retained.
- `npm audit --omit=dev`: **0 vulnerabilities**. Full dependency audit still reports **15 development-toolchain advisories** (11 high, 4 moderate), including the retained Tailwind 3 and deployment / file-glob tooling. These are not resolved by the redesign; a separate dependency maintenance pass is warranted. No claim of a complete security audit is made.

## Limits

Verified locally in Chromium, including software-rendered WebGL and simulated viewport / motion preferences. Safari, Firefox, physical iOS / Android devices, real integrated GPUs, deployed HTTP headers, indexing, social-platform caches and production network performance have not been verified. No Lighthouse / field Core Web Vitals score is claimed. Font fallbacks, WebGL fallback and legal static entries are implemented; deployment remains for the owner's review workflow.
