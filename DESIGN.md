# AppSolves — things with substance

## Focused visual-quality pass

Keep the editorial composition and approved hero headline. The final prose review is recorded in [EDITORIAL.md](EDITORIAL.md): remove repetitive slogans, explain projects with verified facts, and identify Kaan and the long-running AppSolves brand directly. Use a single semantic arrow system: outward 2.5px right/up, section links 3px down, return-to-top 3px up and home returns 3px left. All use 200ms ease-out on hover and keyboard focus; reduced motion keeps existing color/focus feedback without translation. Social/platform icons stay still.

Both scenes spend more pixels while visible: minimum 2x backing density, desktop ceiling 2.25x, coarse-pointer ceiling 2x, recalculated on resize/zoom. Hero curves use 64 segments, bevels eight and a 2048px shadow map with equivalent world-space softness. Keep the official contours, materials and on-demand lifecycle. Render matching transparent 1440px hero and 1600px phone posters, with high-quality AVIF/WebP encoding. Preserve the original phone's 2048px material texture at WebP quality 95; its actual 1080px screenshot supplies the live screen with mipmaps and anisotropy.

Fidan gains its official repository icon, locally optimized without changing artwork. A compact horizontal icon/wordmark identity sits beside a wider code area. At desktop, give the code about two thirds of the usable field so the real 61-character signature fits at a readable monospace size. At tablet/mobile, stack identity and specimen; keep source whitespace and allow horizontal scrolling. Five real source lines get a separate nonselectable number gutter. Orchid keywords, blue functions, coral identifiers/interpolation, gold types, green strings and warm neutral punctuation contrast against an integrated forest inset. No terminal chrome, fake window or new card treatment.

The stage now uses only the identity, source and simple “Fidan source” label. Miniature technical slogans are removed. Real code overflow gets a small narrow-screen scroll hint, without covering the source. The footer balances seven social links in 4 + 3 desktop rows and 2 + 2 + 3 compact rows; its Google Play prism is the original storefront artwork at icon size. The phone’s current framing is retained after +15%/+25% comparisons showed less breathing room and bottom clipping. LanePilot retains the physical detection output over weaker promotional/concept alternatives. Neither scene’s quality or lifecycle changes.

## Thesis

An independent builder's body of work, presented with the precision of a technical publication and the material presence of an industrial design studio. The first impression is warm, quiet and physical. The second is specific: a Rust compiler, deployed computer vision, and a commercial Android product. AppSolves is Kaan Gönüldinc's umbrella brand, not an agency.

The signature is the official AppSolves mark turned into a solid object: violet front surfaces, metal sides and bevels. This is brand material, not an illustration of a fictitious system. Beside it, **“Think deeply. Build real things.”** connects a deliberate engineering approach to usable work. The name, TUM context and explicit AI / compiler / product positioning remain in the first viewport. The official wordmark has no trailing period.

## Launch-polish decisions

Four requested headline candidates were rendered in the actual hero at 1440 × 900 and 390 × 844 before implementation; ignored evidence is in `.cache/headline-study/`. “Deep thinking. Real things.” has the strongest compact rhythm but asks the viewer to infer its meaning. “Think deeply. Build real things.” is the chosen refinement: active, immediately understandable, and broad enough for a language, edge system and shipped app. “Deep engineering. Real products.” is narrower and its first line is too wide. “Hard problems. Real systems.” is credible but interchangeable with many systems portfolios. No scribble is added.

Reduce the first-content gap through a shorter header, viewport-aware hero height and a bounded object, rather than squeezing the text. Give the two headline baselines clear optical separation. Narrow phones keep three project names with useful tap targets and omit categories.

Large media surfaces share a 24px radius (20px on mobile); reading fields and text rows remain flat. Open source loses its repeated large italic gesture. Mobile integrates native theme radios into the disclosure; desktop retains a quieter dropdown. Explicit theme changes use a restrained 480ms radial View Transition from the control, with immediate unsupported / reduced-motion fallback and no animation for OS changes.

TagVault reuses its own GLB, camera, screen mapping and bounded drag / inertia from `AppSolves/TagVault/website/src/components/PhoneMockup3D.tsx`, pinned at `e17d6df11a6d1251b6f395c067ef6a82f50b5992`. Port to the existing Three.js runtime; preserve the phone rather than drawing another mockup. Lazy-load near its section, render on input and settle, pause offscreen / hidden, and provide a locally rendered poster for reduced motion / WebGL failure. Compress the original model without redesigning or simplifying its geometry. Preserve source / license provenance.

## Reference study, October 2026

References were opened in Chromium, inspected at 1440 × 900, and captured at the hero and after scrolling. Temporary research captures live in ignored `.cache/references/`.

- [Ankush Ahuja](https://ahuja.app/): the continuous material image makes an otherwise simple introduction memorable. Borrow the confidence of one large visual. Reject glass navigation, pill CTAs, generic personal greeting, and its agency emphasis.
- [Stone Studio](https://stone-studio.de/): wide whitespace, economical navigation and large work imagery establish hierarchy. Borrow the open horizontal rhythm and the space given to projects. Reject the dot grid, centered sales hero, equal-weight project tiles and service sections.
- [Studio Alphonse](https://www.studioalphonse.com/), [2025 SOTD](https://www.awwwards.com/sites/studio-alphonse): an unusually coherent illustrated identity and cinematic imagery. Borrow the commitment to a single identity and changes in visual scale. Reject loading spectacle and animation that delays access to content.
- [BlueYard](https://blueyard.com/): one physical visual dominates a sparse opening; editorial typography and narrative pacing give the technology a point of view. Borrow restraint around the object and real thematic continuity. Do not borrow the particle system or its philosophical copy.
- [Bruno Simon](https://bruno-simon.com/): an authored spatial world, materials, lighting and interaction rather than floating UI. Borrow the care given to geometry and material. A full game would obstruct this portfolio's purpose; use one restrained object instead.

Additional searches surveyed 2025/2026 portfolio, studio and technology work. Igloo's live page was unavailable to the local browser; no claim of inspecting its interaction is made.

### Generic AI design research

Reviewed [InterfaceKit's analysis](https://blog.interfacekit.io/why-ai-generated-websites-all-look-the-same) and [Designpixil's visual-pattern discussion](https://designpixil.com/blog/ai-slop-design). These are design commentary, not a reliable test of authorship. The actionable observation is convergence on the same composition: centered marketing headline, interchangeable proof cards, purple gradients, floating interfaces and generic content. Merely changing accent color does not fix that.

Our countermeasure is content-specific composition: actual language syntax for Fidan, actual perception output for LanePilot, actual product screens for TagVault. Three projects get three different presentations. Smaller work is a quiet text index. No invented technical graphics.

## Typography

- **Manrope variable**, self-hosted WOFF2, weights 400–650. Its deliberate geometric shapes, broad counters and compact headlines give the brand a clean engineering voice without the standard Inter/Geist SaaS look.
- **Newsreader italic variable**, self-hosted WOFF2, used only for the second hero line, brief editorial emphasis and Fidan's project specimen. It provides a human counterpoint to the geometric sans, not a second competing identity.
- System monospace is confined to the real Fidan source specimen. No decorative terminal chrome, fake output, or floods of tiny metadata.
- Hero approximately 102px at 1440; section display 64–80px; body 17–20px; utility text 13–15px. Fluid sizing, deliberate line breaks, generous line height. Mobile hero approximately 51px at 390.
- Fonts ship with their OFL licenses. No third-party font request or analytics dependency.

## Color and materials

- Paper `#f5f3ed`: primary page and hero background.
- Ink `#242622`: headings and reading text.
- Muted ink `#63665d`: supporting text, always tested for contrast.
- AppSolves violet `#6a5ce3`: official brand mark, typography emphasis and wayfinding. On paper, use a slightly deeper `#5f51cc` for small text / focus contrast; dark mode uses `#a398ff` for accessible text accents. The mark itself retains the official violet.
- Forest `#203c32`: Fidan's single large project field, paired with warm paper text.
- Pale mineral `#e6e8e0`: LanePilot image framing.
- Warm sand `#e8e1d3`: TagVault product stage.

No gradient page backgrounds, glow, glass, card shadows or universal rounded corners. Flat editorial fields support imagery; material lighting belongs to the actual mark and the reused product phone. Thin rules only separate meaningful lists, project details and footer utilities.

## Layout and whitespace

Max content width 1680px. At 1440, 64px gutters; at 1920, generous centered outer margins; mobile 22px gutters. Twelve-column conceptual grid, implemented with simple CSS grid: hero roughly 7/5, project detail 5/7, about 5/7. No visible grid art.

Sections use a shared rhythm of 12 / 20 / 28 / 40 / 56 / 80 / 112 / 144px, with optical exceptions for type and image framing. Work is a sequence of large compositions, never three matching cards. Wide Fidan first; LanePilot's technical image second; TagVault's real mobile surface third. About and the open-source index are calmer reading stages. Contact closes with deep graphite, warm paper type and a violet serif gesture.

### Two material systems, one brand

Light remains print-like: paper `#f5f3ed`, ink `#242622`, neutral secondary text. Dark is authored graphite: base `#11120f`, surface `#181a16`, warm foreground `#efede7`, secondary `#a3a59c`, quiet rules `#35382f`. Forest, mineral and sand are local project surfaces; they do not become global accents. Dark LanePilot / TagVault frames use subdued mineral / sand materials rather than a literal color inversion. Fidan retains its forest field and fixed warm text.

The existing violet mark's exact path geometry is retained with a true transparent compound-path cutout. Navigation, favicon and touch icon use that identity. Both front surfaces of the 3D object use violet enamel; sides and bevels remain metal. Light and dark each receive a matching poster / scene lighting treatment.

Theme defaults to System. A parser-time bootstrap applies the saved choice or OS preference before the application loads. The installed next-themes provider owns runtime persistence, OS changes and cross-tab updates. A small navigation icon opens a Radix radio menu for System / Light / Dark; it is keyboard and touch operable. Mobile uses an integrated native radio fieldset. Explicit color changes use a 480ms radial reveal; OS changes and reduced motion remain immediate.

## 3D and imagery

Three.js directly, dynamically imported. Extrude the real SVG mark, including its cutout and secondary curve. Bevel the edges, use violet physical enamel with clearcoat on both front faces, chrome sides, a warm studio environment and soft directional light. Dark mode gently adjusts exposure while retaining the same material identity. Orthographic framing avoids exaggerated perspective. Pointer movement changes the viewing angle by only a few degrees; scroll turns the object modestly. No auto-spinning product, particles, nodes, wireframes or postprocessing pile-up.

The scene renders only when its state changes, only while visible, and suspends in background tabs. Backing density stays between 2x and 2.25x on desktop, capped at 2x on coarse-pointer devices. Production uses the default `preserveDrawingBuffer: false`; asset generation and tests capture the browser compositor. Reduced motion, mobile and WebGL failure use a matching transparent light or dark poster. All essential content exists outside the canvas. Geometry, environment maps, renderer, observers and listeners are disposed on unmount or theme change.

LanePilot imagery comes from its repository, cropped to the actual perception viewport. TagVault uses the original 21-mesh phone, its screen selection and bounded drag response, with an actual published Android screenshot mapped to the display. The perspective camera is slightly widened from 23 to 26 degrees so the model clears its media edge. Responsive AVIF / WebP derivatives are generated from preserved originals outside `public/`; provenance is recorded with both. Fidan syntax is sourced from its published documentation and labelled as a language specimen, not a live compiler. LanePilot's approximate −39% hard-braking / +29% average-speed figures are labelled twice as simulation results, with no public-road claim.

## Functional boundaries

Retain React / Vite / TypeScript / Tailwind and GitHub Pages output, CNAME, ad verification, robots and both legal URLs. Legal document contents remain authoritative and unedited. Legal and 404 pages share the theme system, accessible reading surfaces and reliable home links. Legal entries have route-specific metadata. No contact form or unnecessary backend. Contact is direct email; public proof links open their real destinations.

## Reject explicitly

CSS card stacks, fake graph art, compiler wireframes, generic bento features, pill navigation, excessive tags, ornamental grids, fake counters, fabricated claims, agency services, generic “passionate” copy, cursor replacements, scroll hijacking, arbitrary border decoration and repetitive fade-up effects. Every visual must identify the brand or show the work.
