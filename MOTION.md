# AppSolves — motion with weight

## Principles

The object feels solid; text feels editorial. Movement reveals hierarchy or material, never compensates for weak content. Native scrolling remains intact. No Lenis / smooth-scroll engine, custom cursor, route curtain, preload percentage, perpetual marquee or mandatory scroll pin.

## Arrival

One GSAP timeline scoped to the homepage: identity / introduction settles over 600ms, the two headline lines enter from a clipped baseline over 850ms with a 90ms separation, description follows at 180ms. Maximum displacement 28px. Ease `power3.out`; no bounce, overshoot or elastic timing.

The mark appears as soon as a poster can paint. Desktop WebGL replaces that same composition when ready; no blank canvas or skeleton flash. No content depends on loading Three.js.

## Scroll

Desktop mark turns approximately 0.15 radians across the hero's scroll distance. This is camera / object orientation, not a rotating UI stack. No pinning. Frame updates happen only after pointer or scroll input and stop once the interpolation settles.

Fidan's source specimen gets one short horizontal settle / opacity entrance at the work stage. LanePilot and TagVault images receive at most a modest 1.025 → 1 scale settle as their frame enters. Text beneath remains readable immediately. About, open-source rows and legal text stay static. This avoids the repetitive whole-page fade-up pattern.

ScrollTriggers use once-only entrances. Refresh after font loading because typography changes layout. React `useGSAP` / matchMedia scopes and reverts all animations on unmount or when preferences change.

## Pointer and hover

Within the hero object region, pointer position offsets horizontal and vertical orientation by no more than 0.08 radians. Ease toward the input; reset on pointer leave. No cursor chasing elsewhere. The object is decorative, labelled through the adjacent brand, and has no misleading button affordance.

Links use a brief underline / violet color response and a small directional-arrow shift. No card tilt, moving padding, magnetic button, glow or important content hidden on hover. Project-image settling belongs to scroll entrances, not a fake interactive visual.

Mobile menu uses a brief 180ms opacity response without animated layout height. It remains a real keyboard-operable disclosure. Navigation is usable before animation initialization.

## Theme changes

System is the default; explicit choices persist. A parser-time script sets `data-theme`, `color-scheme` and theme-color before React, so even a delayed application does not paint the wrong background. next-themes owns runtime OS / persistence behavior. Theme changes are immediate and suppress CSS transition flashes; they do not replay entrance motion.

The Radix radio menu supports arrows, selection, Escape and focus return. Escape dismisses this menu before the underlying mobile disclosure. Theme changes dispose the old Three.js scene and create one scene with the appropriate graphite material. Its matching poster remains available throughout; both posters use identical framing and the same violet enamel. No color morph, orbit transition or duplicate live canvas is needed.

## Reduced motion, mobile, lifecycle

`prefers-reduced-motion: reduce`: no entrance transforms, no scroll-triggered scale, no pointer motion; all content paints in its final state. CSS smooth scroll is disabled. The mark uses the static locally rendered poster; no WebGL is loaded.

Mobile / coarse pointer: poster by default, no WebGL download and no scroll parallax. Preserve normal touch scrolling. Tablet with a fine pointer can use WebGL if its layout allows it.

Desktop WebGL: fine pointer, at least 900px, capped DPR 1.5, low-power hint, render on demand. IntersectionObserver stops updates when the hero leaves the viewport; Page Visibility suspends hidden tabs. Production does not preserve the drawing buffer. Tests and asset generation capture the browser compositor. Remove observers / listeners and dispose geometry, materials, environment and renderer on unmount or theme change; PMREM generation resources are released immediately after setup. WebGL creation failure / context loss falls back to the matching poster. Context is not used for content or interaction.

## Validation

Inspect arrival, mid-scroll, pointer movement, hover and mobile / theme menus in both themes at 1440 × 900, 1920 × 1080, 1280 × 800, 820 × 1180, 390 × 844 and 320 × 568. Also inspect the 900–960px transition. Repeat with reduced motion and WebGL disabled. Check content visibility and every navigation / legal route with browser assertions. Keep the QA report in the repo; generated raw captures remain ignored. Local frame instrumentation verifies zero idle / offscreen draw calls in both themes without claiming a hardware energy benchmark.
