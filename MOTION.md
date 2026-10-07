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

Links use a 180–220ms underline / color response and a small directional-arrow shift. Work imagery can scale by 1.015 inside its own crop when its actual link is hovered. No card tilt, moving padding, magnetic button, glow or important content hidden on hover.

Mobile menu uses a brief 180ms opacity response without animated layout height. It remains a real keyboard-operable disclosure. Navigation is usable before animation initialization.

## Reduced motion, mobile, lifecycle

`prefers-reduced-motion: reduce`: no entrance transforms, no scroll-triggered scale, no pointer motion; all content paints in its final state. CSS smooth scroll is disabled. The mark uses the static locally rendered poster; no WebGL is loaded.

Mobile / coarse pointer: poster by default, no WebGL download and no scroll parallax. Preserve normal touch scrolling. Tablet with a fine pointer can use WebGL if its layout allows it.

Desktop WebGL: capped DPR 1.5, render on demand, IntersectionObserver stops updates when the hero leaves the viewport, Page Visibility suspends hidden tabs. Remove observers / listeners and dispose geometry, materials, environment, PMREM generator and renderer on unmount. WebGL creation failure / context loss falls back to the same poster. Context is not used for content or interaction.

## Validation

Inspect arrival, mid-scroll, pointer movement, hover and mobile disclosure in Chromium at 1440 × 900, 1920 × 1080, 820 × 1180 and 390 × 844. Repeat with reduced motion and WebGL disabled. Check content visibility and every navigation / legal route with browser assertions. Keep screenshot evidence and a QA report in the repo; generated raw captures remain ignored.
