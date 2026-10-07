import { expect, test } from "@playwright/test";

test("explicit choices use a radial transition and rapid choices keep the latest preference", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: "light" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("radio", { name: "Dark", exact: true }).click();
  await expect(
    page.getByRole("radio", { name: "Dark", exact: true }),
  ).toBeChecked();
  await expect(page.locator("html")).toHaveClass(/theme-reveal/);
  await expect
    .poll(() =>
      page.evaluate(() =>
        document
          .getAnimations()
          .some(
            (animation) =>
              animation.effect instanceof KeyframeEffect &&
              animation.effect.pseudoElement ===
                "::view-transition-new(root)" &&
              animation.effect
                .getKeyframes()
                .some((frame) => String(frame.clipPath).startsWith("circle(")),
          ),
      ),
    )
    .toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("theme-radial-reveal.png"),
  });
  await expect(page.locator("html")).not.toHaveClass(/theme-reveal/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  // Simulate a burst of real input events before snapshot callbacks have completed.
  await page.evaluate(() => {
    for (const value of ["light", "dark", "light"])
      document
        .querySelector<HTMLInputElement>(`input[value="${value}"]`)!
        .click();
  });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("html")).not.toHaveClass(/theme-reveal/);
  expect(
    await page.evaluate(() => localStorage.getItem("appsolves-theme")),
  ).toBe("light");
  expect(errors).toEqual([]);
});

for (const fallback of ["reduced-motion", "unsupported"] as const) {
  test(`${fallback} applies choices immediately without a transition`, async ({
    page,
  }) => {
    if (fallback === "reduced-motion")
      await page.emulateMedia({ reducedMotion: "reduce" });
    else
      await page.addInitScript(() => {
        Object.defineProperty(document, "startViewTransition", {
          value: undefined,
        });
      });
    await page.goto("/");
    await page.getByRole("button", { name: "Choose color theme" }).click();
    await page
      .getByRole("menuitemradio", { name: "Dark", exact: true })
      .click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("html")).not.toHaveClass(/theme-reveal/);
    expect(
      await page.evaluate(
        () =>
          document
            .getAnimations()
            .filter(
              (animation) =>
                animation.effect instanceof KeyframeEffect &&
                animation.effect.pseudoElement,
            ).length,
      ),
    ).toBe(0);
  });
}
