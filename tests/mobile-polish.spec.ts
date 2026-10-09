import { expect, test } from "@playwright/test";

test("mobile navigation expands, collapses and morphs its icon", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 430, height: 650 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const nav = page.locator("#mobile-navigation");
  for (const open of [true, false]) {
    const samples = await page.evaluate(async () => {
      const nav = document.querySelector<HTMLElement>("#mobile-navigation")!;
      const toggle = document.querySelector<HTMLButtonElement>(".menu-toggle")!;
      nav.getBoundingClientRect();
      toggle.click();
      // React commits the disclosure state before CSS transitions are sampled.
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve()),
      );
      const path = toggle.querySelector("path")!;
      const animations = [...nav.getAnimations(), ...path.getAnimations()];
      const frames: { height: number; transform: string }[] = [];
      let frame = 0;
      const sample = () => {
        frames.push({
          height: nav.getBoundingClientRect().height,
          transform: getComputedStyle(path).transform,
        });
        frame = requestAnimationFrame(sample);
      };
      frame = requestAnimationFrame(sample);
      await Promise.all(animations.map((animation) => animation.finished));
      cancelAnimationFrame(frame);
      return frames;
    });
    expect(samples.length).toBeGreaterThan(2);
    expect(
      new Set(samples.map((sample) => sample.height)).size,
    ).toBeGreaterThan(2);
    expect(
      new Set(samples.map((sample) => sample.transform)).size,
    ).toBeGreaterThan(2);
    if (open) {
      expect(samples.at(-1)!.height).toBeGreaterThan(samples[0].height);
      await expect(nav).not.toHaveAttribute("inert");
      await page.screenshot({
        path: testInfo.outputPath("mobile-menu-open.png"),
      });
    } else {
      expect(samples.at(-1)!.height).toBeLessThan(samples[0].height);
      await expect(nav).toHaveAttribute("inert", "");
      await expect(nav).toBeHidden();
    }
  }
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
  await expect(nav).toHaveAttribute("inert", "");
});

test("reduced motion applies mobile navigation immediately", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  expect(
    await page
      .locator("#mobile-navigation, .menu-icon path")
      .evaluateAll(
        (elements) =>
          elements.flatMap((element) => element.getAnimations()).length,
      ),
  ).toBe(0);
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-navigation")).toBeHidden();
});
