# AppSolves

Kaan Gönüldinc's builder / founder portfolio. React, TypeScript, Vite and Tailwind, with GSAP motion and one lazily loaded Three.js brand object.

The redesign lives on `redesign/portfolio-2026`. Review it locally; this work does not deploy or merge into `main`.

## Development and review

Use Node 22.12+ (or 20.19+) and npm. The recorded verification used Node 26.5.0.

```sh
npm ci
npm run dev
```

Vite serves the development site on port 8080. Review the opening, all three projects, about, open source, contact, and both legal routes. The design decisions are in [DESIGN.md](DESIGN.md), the page sequence in [STORYBOARD.md](STORYBOARD.md), and motion / fallback behavior in [MOTION.md](MOTION.md). See [QA.md](QA.md) for the verification record and remaining limits.

```sh
npm run check
npx playwright install chromium
npm test
```

`check` runs the application, build-config and test TypeScript checks, ESLint, and the production build. Browser tests build the site and start a local production preview on port 4173. They verify content, responsive layout, accessibility, navigation, legal entries, metadata, deployment artifacts and WebGL fallbacks. Five viewport sizes produce section screenshots under ignored `test-results/`.

If using an existing Chromium installation, set `BROWSER_PATH` to its executable. To test an already running production preview, set `PREVIEW_URL`; otherwise the runner manages its own preview. For example, in PowerShell:

```powershell
$env:BROWSER_PATH = 'C:/path/to/chrome.exe'
$env:PREVIEW_URL = 'http://127.0.0.1:4173'
npm test
```

## Assets and rendering

Fonts are self-hosted with their SIL Open Font License files. Project images are actual AppSolves project / product captures; provenance is in [public/images/README.md](public/images/README.md).

`npm run assets:render` uses a running development site to regenerate the static 900 × 900 brand poster, monochrome mark, SVG favicon and 1200 × 630 social image from the production scene. It uses Playwright Chromium and accepts the same `BROWSER_PATH` / `PREVIEW_URL` variables. Run it after changing the mark, camera, materials or lighting, then rebuild. Generated assets are committed; visitors never need a render service.

The scene loads only on fine-pointer screens at least 900px wide without reduced motion. Mobile, reduced motion, unavailable WebGL and context loss use the same rendered poster. All content remains independent of the canvas.

## Deployment compatibility

The existing GitHub Pages configuration and deployment command are retained. A production build creates `404.html`, `privacy_policy/index.html` and `terms_and_conditions/index.html`, preserves `CNAME` and `app-ads.txt`, and emits the sitemap. Legal Markdown in `public/legal/` remains the source of truth and is bundled into the legal routes. No deployment is part of the redesign review.
