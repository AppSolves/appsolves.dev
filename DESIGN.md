# AppSolves — things with substance

## Focused visual-quality pass

Keep the editorial composition with the final positioning “I build software from the inside out.” Manrope carries “I build software”; violet Newsreader carries “from the” and “inside out.” Three deliberate lines retain readable scale, a complete first-viewport desktop action and a separate brand object. Supporting copy starts with AI and products, includes Fidan as engineering evidence, and describes an AI company as an ambition. The editorial record is in [EDITORIAL.md](EDITORIAL.md). One semantic arrow system remains unchanged: outward 2.5px right/up, section links 3px down, return-to-top 3px up and home returns 3px left. All use 200ms ease-out on hover and keyboard focus; reduced motion keeps color/focus feedback without translation. Platform icons stay still.

Both scenes spend more pixels while visible: minimum 2x backing density, desktop ceiling 2.25x, coarse-pointer ceiling 2x, recalculated on resize/zoom. Hero curves use 64 segments, bevels eight and a 2048px shadow map with equivalent world-space softness. Keep the official contours, materials and on-demand lifecycle. Render matching transparent 1440px hero and 1600px phone posters, with high-quality AVIF/WebP encoding. Preserve the original phone's 2048px material texture at WebP quality 95; its actual 1080px screenshot supplies the live screen with mipmaps and anisotropy.

Fidan retains its official repository icon, source colors and nonselectable number gutter. Its desktop identity now takes its intrinsic width beside a flexible specimen, with a 40–64px gap and a 108–144px wordmark. This resolves the cramped final letters without starving code; the real signature fits at 1280px and above. At <=1100px, stack identity and specimen. Narrow screens retain source whitespace, native horizontal scrolling and the accessible hint. No terminal chrome or new card treatment.

Six footer destinations form compact 3 + 3 content-sized rows; the prominent email above replaces its duplicate social entry. All icons are monochrome, optically matched at 16px with an 8px label gap. Google Play preserves its official prism paths as a currentColor outline. Support links remain separate. The phone’s current framing remains after earlier size comparisons; neither scene’s quality or lifecycle changes. LanePilot now presents both complete panels of the authentic simulation screenshot, full width on desktop and stacked on mobile, with a full-resolution link and an explicit unmatched-run qualification.

## Thesis

An independent builder's body of work, presented with the precision of a technical publication and the material presence of an industrial design studio. The first impression is warm, quiet and physical. The second is specific: a Rust compiler, deployed computer vision, and a commercial Android product. AppSolves is Kaan Gönüldinc's umbrella brand, not an agency.

The signature is the official AppSolves mark turned into a solid object: violet front surfaces, metal sides and bevels. This is brand material, not an illustration of a fictitious system. Beside it, **“I build software from the inside out.”** introduces engineering depth. Supporting copy connects AI and shipped products to the ambition of building an AI company, with Fidan as concrete evidence. The name and TUM context remain in the first viewport. The official wordmark has no trailing period.

## Launch-polish decisions

The earlier four-candidate headline study is retained in ignored `.cache/headline-study/`. Its former choice, “Think deeply. Build real things.”, is superseded by the user-approved positioning “I build software from the inside out.” The final three-line composition was reviewed at all eight requested widths in both themes. No scribble is added.

Reduce the first-content gap through a shorter header, viewport-aware hero height and a bounded object. The three headline baselines have deliberate optical spacing; supporting text is bounded at 530px and 16–18px on desktop, 14px on narrow phones. Narrow phones keep three project names with useful tap targets and omit categories.

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

Our countermeasure is content-specific composition: actual language syntax for Fidan, actual simulation output for LanePilot, actual product screens for TagVault. Three projects get three different presentations. Supporting work is a quiet text index. No invented technical graphics.

## Typography

- **Manrope variable**, self-hosted WOFF2, weights 400–650. Its deliberate geometric shapes, broad counters and compact headlines give the brand a clean engineering voice without the standard Inter/Geist SaaS look.
- **Newsreader italic variable**, self-hosted WOFF2, used for the emphasized hero phrase, brief editorial emphasis and Fidan's identity. It provides a human counterpoint to the geometric sans.
- System monospace is confined to the real Fidan source specimen. No decorative terminal chrome, fake output, or floods of tiny metadata.
- Hero approximately 86px at 1440 and 44px at 390; section display 64–80px; body 17–20px; utility text 13–15px. Fluid sizing, deliberate line breaks and generous line height.
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

LanePilot's preserved 3840 × 1508 simulation source is divided only at its panel boundary; each complete 1920 × 1508 panel has responsive AVIF/WebP derivatives. Original labels, diagnostics, steps and vehicle counts remain visible. A lossless full comparison supports closer inspection. The caption qualifies these as illustrative snapshots at different steps/counts, without a controlled benchmark or public-road validation. Unsupported percentages remain removed. TagVault retains its original 21-mesh phone, display mapping, 26-degree camera and bounded drag. Originals and licenses stay outside `public/`; generated assets are reproducible. Fidan remains an actual language specimen, not a live compiler.

Project media receive one restrained theme-aware shadow and inset edge. These noninteractive fields do not lift or gain a pointer cursor. Open-source links gain only a slight tonal hover/focus change. Selected Work and Contact arrive vertically, About horizontally, and recognition/source rows with a quiet opacity stagger. This creates selective life without a blanket fade-up pattern.

## Functional boundaries

Retain React / Vite / TypeScript / Tailwind and GitHub Pages output, CNAME, ad verification, robots and both legal URLs. Legal document contents remain authoritative and unedited. Legal and 404 pages share the theme system, accessible reading surfaces and reliable home links. Legal entries have route-specific metadata. No contact form or unnecessary backend. Contact is direct email; public proof links open their real destinations.

## Reject explicitly

CSS card stacks, fake graph art, compiler wireframes, generic bento features, pill navigation, excessive tags, ornamental grids, fake counters, fabricated claims, agency services, generic “passionate” copy, cursor replacements, scroll hijacking, arbitrary border decoration and repetitive fade-up effects. Every visual must identify the brand or show the work.
