# AppSolves

Kaan Gönüldinc's builder / founder portfolio. React, TypeScript, Vite and Tailwind; Manrope / Newsreader, warm paper / graphite, restrained GSAP, violet enamel on the official brand object, and the original interactive TagVault phone. Work stays on `redesign/portfolio-2026`; existing review is [PR #1](https://github.com/AppSolves/appsolves.dev/pull/1).

## Develop and verify

Use Node 22 and npm.

```sh
npm ci
npm run dev
npm run check
npx playwright install --with-deps chromium firefox webkit
npm test
```

Development defaults to 8080. `check` runs TypeScript, ESLint and the production build. `test` builds and runs **58 browser / asset checks**: comprehensive Chromium regression at seven sizes in both themes plus a small Firefox / WebKit smoke suite. Real screenshots, menus, accessibility, theme transitions, phone interaction / offscreen GPU submissions, metadata, legal routes and 404 output are covered. Results and captures go to ignored `test-results/`.

`BROWSER_PATH` overrides only Chromium. `PREVIEW_URL` selects an independently running production preview; otherwise Playwright starts 4173.

```powershell
$env:BROWSER_PATH = 'C:/path/to/chrome.exe'
$env:PREVIEW_URL = 'http://127.0.0.1:4173'
npm test
```

On a Windows display with high DPI, the bundled WebKit may report a CSS viewport smaller than requested. The smoke suite asserts the actual width. For that local environment only, `$env:__COMPAT_LAYER = 'DPIUNAWARE'` was verified to restore exact CSS sizes. Linux CI does not need this setting. Firefox needs permission to launch its tab subprocesses in a restricted tool environment.

## Design and assets

[DESIGN.md](DESIGN.md), [STORYBOARD.md](STORYBOARD.md), [MOTION.md](MOTION.md) and [QA.md](QA.md) describe the actual direction and verification.

System is the default. The parser-time theme bootstrap prevents a wrong-color initial paint. Desktop has a keyboard-accessible radio dropdown; mobile has native appearance radios inside the navigation. Explicit color changes use a 480ms radial View Transition; unsupported browsers, reduced motion, initialization and OS changes apply immediately.

Fonts are self-hosted with OFL licenses. Real imagery and original contours remain in [assets/sources](assets/sources/README.md); published provenance is in [public/images](public/images/README.md). TagVault's original model, source commit and license are preserved in [phone provenance](assets/sources/tagvault-phone/README.md).

```sh
npm run assets:optimize
node scripts/optimize-phone.mjs
npm run assets:render
npm run build
```

Optimization produces responsive LanePilot imagery, the phone's actual screen texture, and all transparent icons from the same canonical SVG. Phone compression keeps all 21 original meshes without simplification. Render generation needs a running development site (default 8080; accepts `PREVIEW_URL` / `BROWSER_PATH`). It captures both hero posters, the phone poster and the 1200 × 630 social card through Chromium's compositor. These generated public assets are committed.

Hero WebGL is limited to a fine pointer, ≥900px and no reduced motion. TagVault loads its code / 2.1 MB model only near its section, with bounded pointer drag and on-demand rendering. Both scenes cap DPR at 1.5, pause offscreen / hidden and preserve no drawing buffer. Mobile hero, reduced motion and WebGL failure use authored posters. The phone preserves vertical touch scrolling. No runtime dependencies were added; four glTF / meshopt development dependencies make model optimization reproducible.

## Review without a checkout

A push to the redesign branch starts [Redesign preview artifact](https://github.com/AppSolves/appsolves.dev/actions/workflows/preview-artifact.yml). Manual dispatch is also available on that branch. PR events are omitted to avoid duplicate runs. The workflow uses Node 22, `npm ci`, typecheck, lint, build, browser installation and all browser checks. It has read-only contents permission and no deployment step.

A successful run provides two artifacts, retained seven days:

- `appsolves-preview-<full SHA>`: complete `dist/`, including fonts, imagery, model, JS/CSS, CNAME, app-ads and legal entries.
- `appsolves-visual-review-<full SHA>`: actual rendered screenshots at seven sizes, both themes, full-page desktop / tablet / mobile, seven scroll stages, menus and interaction captures.

Download and extract the preview ZIP. Serve the directory containing `index.html` with Python's standard library; no repository or npm dependencies are needed:

```sh
python -m http.server 4173 --bind 127.0.0.1 --directory /path/to/extracted-artifact
```

Open `http://127.0.0.1:4173/`. Review themes, work, menus, `/privacy_policy/`, `/terms_and_conditions/`, and `/404.html`. `file://` cannot serve the module application. The basic Python server returns its own response for unknown paths; GitHub Pages serves the generated custom `404.html` for those paths.

The predecessor at `187198c` already has a [successful GitHub build/browser/artifact run](https://github.com/AppSolves/appsolves.dev/actions/runs/37653633687). Current launch-pass evidence is recorded in QA.md; no placeholder or claim that CI has never run remains.

## Deployment compatibility

Existing GitHub Pages output and deployment command remain. Static legal entries, truthful 404 metadata, CNAME, app-ads, sitemap, favicons and social cards survive the build. Legal Markdown is unchanged. The artifact workflow builds for review; it does not deploy or merge main.
