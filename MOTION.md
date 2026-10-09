# AppSolves — motion with weight

## Principles

The object feels solid; text feels editorial. Movement reveals hierarchy or material, never compensates for weak content. Native scrolling remains intact. No Lenis / smooth-scroll engine, custom cursor, route curtain, preload percentage, perpetual marquee or mandatory scroll pin.

## Arrival

One GSAP timeline scoped to the homepage: identity / introduction settles over 600ms, the two headline lines enter from a clipped baseline over 850ms with a 90ms separation, description follows at 180ms. Supporting copy moves 16px; headline travel follows the height of its clipping mask. Ease `power3.out`; no bounce, overshoot or elastic timing.

The mark appears as soon as a poster can paint. Desktop WebGL replaces that same composition when ready; no blank canvas or skeleton flash. No content depends on loading Three.js.

## Scroll

Desktop mark turns approximately 0.15 radians across the hero's scroll distance. This is camera / object orientation, not a rotating UI stack. No pinning. Frame updates happen only after pointer or scroll input and stop once the interpolation settles.

Fidan's source settles horizontally by 18px over 700ms, starting at .7 opacity. LanePilot and TagVault media settle vertically by 20px over 800ms, also starting at .7 opacity. No field scales, so live canvas dimensions remain stable. Project details enter by 18px over 700ms with `power3.out`; paired text columns have an 80ms offset and individual triggers, so stacked mobile content arrives when it actually enters view. The TagVault phone's independent drag remains unchanged; legal text stays static.

Three quiet patterns supplement those project entrances: Selected Work and Contact headings settle 16px vertically over 650ms with `power2.out`; About's heading settles 16px horizontally with the same timing; recognition uses opacity only, 450ms `power1.out` and 70ms stagger. Each source row has its own once-only trigger and a 12px horizontal settle over 500ms, rather than completing all rows when only the first is visible. Initial opacity remains at least .65 on these additions, so offscreen content is still readable before its trigger. Each completed entrance clears owned inline transforms/opacity. There is no pin, character splitting, image hover zoom or repeated whole-page fade-up.

ScrollTriggers use once-only entrances. Refresh after font loading because typography changes layout. React `useGSAP` / matchMedia scopes and reverts all animations on unmount or when preferences change.

## Pointer and hover

Within the hero object region, pointer position offsets horizontal and vertical orientation by no more than 0.08 radians. Ease toward the input; reset on pointer leave. No cursor chasing elsewhere. The object is decorative, labelled through the adjacent brand, and has no misleading button affordance.

Links keep underline / color and focus feedback. Only directional arrows move: external (+2.5px, -2.5px), down (0, 3px), up (0, -3px) and home/return (-3px, 0). One data-attribute CSS system applies the same 200ms cubic-bezier(.2,.65,.3,1) transition to hover and keyboard focus-visible. Reduced motion removes translation; platform, support and utility icons stay still. No card tilt, moving padding, magnetic button, glow or important content hidden on hover. Project-image settling belongs to scroll entrances, not a fake interactive visual.

Mobile menu opens as a straightforward disclosure without animated layout height. It remains a real keyboard-operable disclosure. Navigation is usable before animation initialization.

Fidan’s overflowing source keeps native horizontal scrolling, keyboard access and selection; a static narrow-screen cue appears only when needed. Footer rows and platform icons stay static. Phone camera/scale/posters remain unchanged after size comparisons. Media has a stronger theme-aware resting shadow; fine-pointer hover and keyboard focus within the field deepen it over 300ms without translating, scaling or changing its cursor. Source links have a tonal background and 2px horizontal movement over 250ms on fine-pointer hover or keyboard focus. Touch does not inherit hover movement; reduced motion retains tonal/focus feedback without spatial transitions.

## Theme changes

System is the default; explicit choices persist. A parser-time script sets `data-theme`, `color-scheme` and theme-color before React, so even a delayed application does not paint the wrong background. next-themes owns runtime OS / persistence behavior. Only an explicit selection that changes the resolved color starts a View Transition. The new root reveals in a circle from the control to the farthest viewport corner over 480ms, easing cubic-bezier(.4,0,.2,1). CSS variables carry the control origin/radius; the native `::view-transition-new(root)` owns the CSS animation. The DOM update remains flush-synchronized inside the snapshot callback. Root snapshot blending is disabled. Initialization, OS changes, same-color choices, hidden tabs, unsupported browsers and reduced motion apply immediately. Entrances do not replay.

The Radix radio menu supports arrows, selection, Escape and focus return. On mobile, appearance is a native radio fieldset in the navigation; Escape closes the disclosure and returns focus to its toggle. Theme changes update the existing Three.js renderer's exposure, retaining its geometry, shaders and GPU context. Its next draw waits until native snapshots are released; a late lazy-load also defers GPU setup during an active transition. Rebuilding the scene blocks Firefox's animation frames, while competing draws can stall software-rendered snapshots. Its matching poster remains available throughout; both posters use identical framing and the same violet enamel. Superseded native transitions are skipped; preference generations reject stale snapshot callbacks, and the root class is cleaned on completion/unmount. A skipped snapshot still leaves the requested theme usable.

Below 768px, navigation expands/collapses through a 240ms grid-row transition with a 200ms opacity settle. The hamburger's outer strokes rotate into a close icon over 220ms while its middle stroke fades. Closing immediately makes its contents inert and removes them from the accessibility tree, then finishes the visual collapse. CSS handles rapid reversals without timers; reduced motion applies both states immediately. Desktop navigation and styling are unchanged.

## Reduced motion, mobile, lifecycle

`prefers-reduced-motion: reduce`: no entrance transforms, no scroll-triggered scale, no pointer motion; all content paints in its final state. CSS smooth scroll is disabled. The mark uses the static locally rendered poster; no WebGL is loaded.

Mobile / coarse pointer: the hero uses its poster, without hero WebGL or scroll parallax. Preserve normal touch scrolling. Tablet with a fine pointer can use WebGL if its layout allows it.

Desktop WebGL: fine pointer, at least 900px, 2x minimum backing density / 2.25x desktop ceiling, low-power hint, render on demand. IntersectionObserver stops updates when the hero leaves the viewport; Page Visibility suspends hidden tabs. Production does not preserve the drawing buffer. Tests and asset generation capture the browser compositor. Remove observers / listeners and dispose geometry, materials, environment and renderer on unmount or when the scene becomes ineligible; PMREM generation resources are released immediately after setup. Theme changes reuse the renderer. WebGL creation failure / context loss falls back to the matching poster. The hero context is decorative.

TagVault uses the existing Three.js runtime rather than another React 3D architecture. A 240px proximity observer loads the 3.09 MB GLB and one screenshot only near the section. Original normalization, mesh selection, UV mapping and pointer coefficients are reused: offsets clamp to ±.35 / ±.55 radians; velocities damp by .92 and offsets by .965 until settled. A drag holds its view; release eases home. Original perpetual Float motion and screenshot preloads are omitted. Backing density uses the shared 2x floor and 2.25x desktop / 2x coarse-pointer cap and drawing buffers are not preserved. Resize observers and window resize (including zoom), visibility and intersection observers control rendering; context loss returns to the actual phone poster. All owned textures, bitmaps, geometries, materials, listeners and renderer resources are released. `touch-action: pan-y` preserves mobile scrolling; cancellation/lost capture ends a drag. Reduced motion skips both phone code and model.

## Validation

Inspect arrival, mid-scroll, pointer movement, hover and mobile / theme menus in both themes at 1440 × 900, 1920 × 1080, 1280 × 800, 1100 × 900, 960 × 900, 820 × 1180, 390 × 844 and 320 × 568. Repeat with reduced motion and WebGL disabled. Check content visibility and every navigation / legal route with browser assertions. Theme regression captures 0/240/480ms in both directions and desktop/mobile; midpoint pixels must contain both old and new themes. Firefox's automated capture omits native transition overlays, so verify its actual QA window separately. Detailed evidence and limitations belong in QA.md. Generated raw captures remain ignored. Local frame instrumentation verifies zero idle / offscreen draw calls in both themes without claiming a hardware energy benchmark.
