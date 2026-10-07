# Final editorial review

Baseline: `a26a6f58d5d7b0c0614e7090a1121c2158916057`. The redesign branch was clean and already up to date when synchronized. This pass changes prose and three local interaction/layout details, without changing the approved visual system.

## Meaningful copy changes

Line breaks in the following quotations are normalized to spaces; the actual source retains deliberate heading line breaks. No legal document text was edited.

| Surface | Before | After |
| --- | --- | --- |
| Hero support | I build AI systems, compilers, and software products. I work on the internals and carry the software through to release. | I build AI systems, compilers, and software products. |
| Selected Work introduction | Three projects. Different layers of the stack. | A language, a traffic system, and an Android app. |
| Fidan visual identity | Readable source. Native execution. | Removed. The real logo, wordmark and source example provide the identity. |
| Fidan specimen label | A small piece of the language | Fidan source |
| Fidan specimen caption | Static types. Native backends. | Removed. |
| Fidan lead | A language is only as useful as the system around it. I’m building both. | Fidan is a general-purpose programming language and compiler toolchain I’m developing in Rust. |
| Fidan compiler description | A general-purpose language and compiler toolchain written in Rust. Typed HIR and MIR, static checking and an interpreter. Cranelift provides JIT execution and AOT compilation to native binaries, with an optional LLVM AOT backend. An LSP, package tooling and concurrency primitives complete the workflow. | The compiler uses typed HIR and MIR for static checking and execution through an interpreter or selective Cranelift JIT. Cranelift AOT and an optional LLVM AOT backend compile programs to native binaries. |
| Fidan tools / AI description | Its AI tooling works with compiler-derived types and diagnostics, grounding assistance in what the program actually means. | The toolchain includes a language server, package tooling, and concurrency support. Its AI assistance uses compiler diagnostics and type information to explain code and suggest changes. |
| Fidan narrow-screen cue | None | Scroll horizontally (only when the code overflows; visible on narrow screens). |
| LanePilot lead | Traffic intelligence on edge hardware. | Adaptive traffic management with edge AI. |
| LanePilot purpose | Traffic perception and dynamic lane allocation, connecting computer vision with graph-based optimization and edge hardware. | LanePilot investigates how changing lane assignments can reduce congestion. Cameras detect and track vehicles, estimate their movement, and provide the state used to recommend lane changes. |
| LanePilot stack | YOLO11n-seg and PyTorch for perception. GATv2 with PyTorch Geometric for traffic intelligence. TensorRT / CUDA, NVIDIA Jetson and Raspberry Pi for deployment. | Perception uses YOLO11n-seg and PyTorch. I explored interactions between nearby vehicles with GATv2 in PyTorch Geometric, then moved to reinforcement learning to model the consequences of lane changes. NVIDIA Jetson runs inference with a CUDA / TensorRT deployment pipeline. A Raspberry Pi handles camera input and the physical prototype’s controls. (The deployment paragraph is separate.) |
| LanePilot image heading | Perception in practice | Prototype perception |
| LanePilot image footer | Detection and tracking. | Vehicle detection and tracking |
| LanePilot caption | Vehicle detection in the prototype test environment. Actual project output. | Vehicle detection in LanePilot’s physical test setup. |
| TagVault lead | NFC tools for everyday use. | Scan, manage, and automate NFC tags. |
| TagVault product description | An Android product for reading, writing and organizing NFC tags. Built end to end in Flutter, with encrypted local storage and biometric protection. | TagVault is an Android app I built and shipped in Flutter for people who use NFC tags in their own workflows. It reads and writes compatible tags and keeps saved data in encrypted local storage, with biometric protection for sensitive actions. |
| TagVault workflows / paid tier | Automations, webhooks, widgets and backups make it useful beyond the first scan. Available on Android with a paid Pro tier. | Tag scans can trigger automations and webhooks. Home-screen widgets provide quick access, and encrypted backups help move data between devices. A paid Pro tier adds further tools and backup options. |
| TagVault caption | TagVault on Android. Encrypted storage for NFC workflows. | The TagVault interface on Android. |
| TagVault website action | Meet TagVault | TagVault website |
| TagVault secondary action | None | Google Play, linked to the verified product listing. |
| About label | The builder behind it | About |
| About heading | Understand the system. Build the whole thing. | Behind AppSolves. |
| About introduction | I’m Kaan Gönüldinc. AppSolves is where I build. | I’m Kaan Gönüldinc, a Computer Science student at TUM. |
| About technical interests | I study Computer Science at TUM and work across machine intelligence, systems engineering and products. I’m interested in the parts that need real understanding: how a compiler represents a program, how a model behaves on edge hardware, how a product earns a place in someone’s day. | I want to understand the internals well enough to make useful decisions: how a compiler represents a program, how a model behaves on edge hardware, and what an app needs before someone can rely on it. |
| About brand | AppSolves is the umbrella for that work: open-source tools, AI systems, software products, experiments and commercial ventures. Different outputs, the same approach. Understand the constraints, build the difficult parts, and carry the work through to something usable. | AppSolves is my long-running software and product brand. It’s the name I publish that work under, whether it’s an open-source library or a commercial product. |
| Ferry Porsche context | STEM distinction in Baden-Württemberg | Porsche award for STEM achievement at school |
| Open Source introduction | Smaller projects for integration work and hardware research. | Libraries and tools I’ve published for Python, Flutter, and hardware research. |
| RC522 description | MIFARE Classic key-recovery research with MFRC522 hardware. | Read-only MIFARE Classic research using RC522 hardware and established recovery tools. |
| Footer introduction label | Have something in mind? | Contact |
| Description metadata | Kaan Gönüldinc builds AI systems, developer infrastructure, and software products. Computer Science at TUM and creator of Fidan. | I’m Kaan Gönüldinc. I build AI systems, compilers, and software products under AppSolves, and study Computer Science at TUM. |
| Open Graph description | AI systems, developer infrastructure, and software products. Computer Science at TUM and creator of Fidan. | Same new description as above. |
| Twitter description | AI systems, developer infrastructure, and software products. | Same new description as above. |

## Intentionally retained copy and complete coverage

The approved **Think deeply. Build real things.** headline remains the sole two-sentence editorial slogan, including the social preview. **Good problems welcome.** stays as the personal contact invitation. **Tools and infrastructure.** is a descriptive heading, not a rhetorical sentence pair. **Scan, manage, and automate NFC tags.** names three actual app actions rather than an arbitrary rhythmic list.

Reviewed and retained: navigation and theme labels; skip link; project-index categories; project numbers/categories/technology lines; Fidan website/source actions and exact five-line code; simulation labels, figures and public-road disclaimer; project-image alt text; education and Jugend forscht entries; focus areas; three other open-source descriptions; contact sentence and email CTA; social/support labels and destinations; copyright/legal links; 404 text and return action; legal-page titles/descriptions and utility navigation; document title, canonical/structured data, social image and its alt text; noscript fallback. These are already specific, useful, or appropriately functional. Legal source documents remain authoritative and untouched. No SME venture sentence was restored.

## Source verification

Retrieved 2026-10-07/08; revisions recorded to distinguish documentation evidence from benchmark validation:

- **Fidan**, [`82a317178994785823368b213c873ba9492b91d8`](https://github.com/fidan-lang/fidan/tree/82a317178994785823368b213c873ba9492b91d8): README, language examples and [engineering audit](https://github.com/fidan-lang/fidan/blob/82a317178994785823368b213c873ba9492b91d8/docs/ENGINEERING_AUDIT.md). The audit documents the Rust pipeline, typed HIR/MIR, interpreter/selective JIT with per-function fallback, both AOT paths, language server, package/concurrency tooling and compiler-grounded AI workflows. No universal parity, speed comparison, maturity or universal AI claim is introduced. No compiler test suite was run as part of this portfolio task.
- **LanePilot**, [`f628a3e8de5a468e26a613dd5b2b6321dc436925`](https://github.com/AppSolves/LanePilot/tree/f628a3e8de5a468e26a613dd5b2b6321dc436925): README, `Documentation.pdf` (especially pp. 12, 18–20), current inference configuration and TensorRT export code. The documentation describes graph attention experiments, their limitations, and the subsequent reinforcement-learning approach. Copy preserves that sequence and the Jetson/Pi split instead of implying GATv2 universally solves traffic optimization. TensorRT export exists in current code; this review did not benchmark its runtime. The approximately −39% / +29% simulation figures are retained from the explicitly approved user-supplied baseline. They are not independently reproducible from the inspected PDF, which does not state those particular figures. Their numerical interpretation and public-road qualification remain unchanged; no new result is inferred.
- **TagVault**: first-party website content/README inspected at its website asset revision `e17d6df11a6d1251b6f395c067ef6a82f50b5992`, and the live [Google Play listing](https://play.google.com/store/apps/details?id=dev.appsolves.tag_vault). Listing identifies AppSolves and links the same product website. NFC compatibility, encrypted storage, biometric protection for sensitive actions, automation/webhooks, widgets and optional encrypted backups are corroborated. Paid tiers are documented by the product. No traction metrics or universal NFC support claims were added. The private repository is not linked as public evidence.
- **fastapi-users-db-dynamodb**, [`671719fa29f3f0f701b7b4746484dec022d392d8`](https://github.com/AppSolves/fastapi-users-db-dynamodb/tree/671719fa29f3f0f701b7b4746484dec022d392d8): async DynamoDB adapter description matches README.
- **pylocalauth**, [`9d55b6437c82ba3660b706bcfe48375f14107799`](https://github.com/AppSolves/pylocalauth/tree/9d55b6437c82ba3660b706bcfe48375f14107799): local platform authentication description matches README; no expanded platform-maturity claim.
- **rc522-mfc-recovery**, [`6be74cf73fd1fc63eed6f32872fb3ecd9e672d6e`](https://github.com/AppSolves/rc522-mfc-recovery/tree/6be74cf73fd1fc63eed6f32872fb3ecd9e672d6e): read-only acquisition/recovery tooling, with credited Nested and Proxmark3 solvers. Updated description acknowledges established recovery tools. All four repositories report `fork: false`; no claim of inventing their underlying third-party libraries or algorithms is made.
- **flutter_event_log**, [`371a7b9ce95524d208de8ce5cec4fdbae9729def`](https://github.com/AppSolves/flutter_event_log/tree/371a7b9ce95524d208de8ce5cec4fdbae9729def): native Win32 Event Log access from Flutter corroborated by README.
- **Ferry Porsche Prize**: [Porsche’s 2026 announcement](https://newsroom.porsche.com/de/2026/unternehmen/porsche-ferry-porsche-preis-verleihung-2026-42448.html) describes school-leaving STEM achievement. Award receipt and student identity remain user-provided facts; no personal ranking, recipient statistic or new affiliation is claimed.
- **Social destinations**: all nine existing social/support destinations preserved, including `https://youtube.com/@appsolvesdev`. The product Play listing is a new separate action; the footer still points to the verified developer page.

## Visual decisions

- Retain warm light/dark themes, fonts, violet brand, scene quality/materials, project fields/radii, theme transition and semantic arrows. Shorter prose does not get padding filler. Remove unused slogan/line-break selectors; do not alter the hero headline or scene.
- Footer socials use controlled **4 + 3** rows above 1100px and **2 + 2 + 3** below, with 44px targets and no isolated Email row. At <=767px, labels are 12px and column gaps 6px; this resolves the measured 1px Google Play overflow at 320px. Support links remain quieter. The local 16px official prism preserves source geometry/colors; see [asset provenance](public/icons/README.md).
- Native narrow-code scrollbars alone were effectively invisible in the actual Chromium capture. Add the unobtrusive `Scroll horizontally` hint only when a ResizeObserver detects real source overflow. It is linked through `aria-describedby`, outside selectable code, with no overlay or scroll buttons. The observer is disposed on unmount. Desktop source and its syntax/line numbers remain unchanged.
- Phone comparison: actual DPR 2 captures in both themes, front and bounded dragged views, at current size and projected +15%/+25% framing. +25% clips the bottom; +15% approaches the bottom edge and loses comfortable breathing room under rotation. Keep the current 26-degree camera, phone scale and matching 1600px poster. No asset regeneration or GPU cost increase is warranted.
- LanePilot comparison: inspected the repository promotional GIF and navigation HUD concept alongside the existing physical vehicle-detection output. The former is less credible visual evidence, the latter an illustrative navigation concept rather than a stronger perception result. Keep the current real detection crop and responsive images; simplify its captions rather than invent a replacement.

Validation and environment caveats are recorded in [QA.md](QA.md).

## Pre-merge evidence cleanup, 2026-10-08

This follow-up supersedes the earlier decision to retain the user-supplied simulation percentages. Searched the website source/history, both published LanePilot branch trees, both versions of Documentation.pdf, release notes/assets, current evaluation/environment/configuration code and the v1 lane-allocation dataset archive. The v2 revision remains `f628a3e8de5a468e26a613dd5b2b6321dc436925`; v1 is `dacba114cc3390068b699ac16407065a8c378359`. No saved baseline-versus-model episode results, comparison calculation, or record stating the two claimed percentage improvements was found. The older archive contains 2,800 training, validation and test tensor samples, not comparative simulation reports. Releases provide no result assets; current evaluation code looks for checkpoints under untracked runtime/logs.

The current [evaluator](https://github.com/AppSolves/LanePilot/blob/f628a3e8de5a468e26a613dd5b2b6321dc436925/ai/lane_allocation/evaluate.py) aggregates per-episode average speed and hard-braking events, and sums collisions. Those definitions establish evaluation measures, not relative improvements. No new experiments or substitute figures are presented.

| Surface | Before | After |
| --- | --- | --- |
| LanePilot simulation | Simulation results; approximately −39% hard-braking events and +29% average traffic speed; Measured in simulation, not on public roads. | Simulation evaluation; Lane-change decisions are evaluated in a traffic simulation using average speed, hard-braking events, and collisions.; Simulation evaluation, not public-road measurements. |
| About heading | Behind AppSolves. | Behind AppSolves |
| Ferry Porsche context | Porsche award for STEM achievement at school | Award for outstanding STEM achievement in the Abitur |

Porsche's official 2026 announcement describes recognition of outstanding school-leaving achievement in mathematics, physics and technology among Baden-Württemberg Abitur graduates. The concise description reflects that scope without asserting recipient counts, personal rankings, or further affiliations. PR #1 is refreshed around the final editorial website, both themes/system mode, real brand/product scenes, performance lifecycle, accessibility, metadata/static routes and validated preview artifacts. All unrelated public copy and art direction remain unchanged.
