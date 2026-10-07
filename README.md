# AppSolves

Kaan Gönüldinc's builder / founder portfolio. React, TypeScript, Vite and Tailwind, with Manrope / Newsreader, restrained GSAP motion and one lazy Three.js brand object. Warm paper and graphite themes share the official AppSolves violet identity.

Review branch: `redesign/portfolio-2026`. This work does not merge into main or deploy.

## Development and verification

Use Node 22 (22.23.3 was verified) and npm.

```sh
npm ci
npm run dev
npm run check
npx playwright install chromium
npm test
```

Development defaults to port 8080. `check` runs application / config / test TypeScript checks, ESLint and a production build. `npm test` builds first, then runs 43 checks against a production preview. Tests cover six viewport sizes in both themes, Axe, navigation, legal / 404 routes, metadata, assets, themes and WebGL lifecycle. Screenshots are saved under ignored `test-results/`.

An existing Chromium can be selected with `BROWSER_PATH`. Use `PREVIEW_URL` for an independently running production preview; otherwise Playwright starts port 4173. PowerShell example:

```powershell
$env:BROWSER_PATH = 'C:/path/to/chrome.exe'
$env:PREVIEW_URL = 'http://127.0.0.1:4173'
npm test
```

The actual direction, sequence and motion are documented in [DESIGN.md](DESIGN.md), [STORYBOARD.md](STORYBOARD.md) and [MOTION.md](MOTION.md). [QA.md](QA.md) records validation and limits.

## Themes and assets

System is the default. A parser-time bootstrap sets the initial background before React; next-themes handles persistence and OS changes. A small accessible radio menu offers System / Light / Dark on every route.

Fonts are self-hosted with OFL licenses. Project imagery is actual AppSolves work. Preserved originals live outside the served directory in [assets/sources](assets/sources/README.md); published provenance is in [public/images/README.md](public/images/README.md).

```sh
npm run assets:optimize
npm run assets:render
npm run build
```

`assets:optimize` uses Sharp to produce responsive AVIF / WebP derivatives and transparent violet brand icons. `assets:render` needs a running development site (default port 8080; accepts `PREVIEW_URL` / `BROWSER_PATH`) and captures the production scene through Chromium's compositor. It generates separate transparent 900 × 900 posters and the 1200 × 630 social card. Generated production assets are committed; visitors need no render service.

The scene loads only with a fine pointer, width ≥900px and no reduced-motion preference. Mobile, reduced motion and WebGL failure use the matching theme poster. Production does not preserve its drawing buffer.

## Downloadable review artifact

[preview-artifact.yml](.github/workflows/preview-artifact.yml) runs on pushes to the redesign branch, PRs from that branch targeting main, and manual dispatch on the redesign branch. Node 22 runs clean installation, typecheck, lint and build. `actions/upload-artifact@v4` uploads all of `dist/` as `appsolves-preview-<full commit SHA>`, retained for seven days. Permissions are `contents: read`; there is no deployment step.

After an authorized branch push, open GitHub Actions → **Redesign preview artifact** → successful run → artifact. Extract its ZIP and serve the directory containing `index.html` with a local HTTP static server. For example, from this checkout:

```sh
npm run preview -- --outDir /path/to/extracted-artifact --host 127.0.0.1
```

Review both themes, project sections, menus and legal routes. Opening HTML with `file://` will not load the module application correctly. The workflow has been validated locally with actionlint; it has not run on GitHub as part of this local refinement.

## Deployment compatibility

The existing GitHub Pages deployment command is retained. Production builds create `404.html`, `privacy_policy/index.html` and `terms_and_conditions/index.html`, preserve CNAME / app-ads, and emit the sitemap. Legal Markdown remains the unchanged source of truth. Downloading a preview artifact does not deploy the site.
