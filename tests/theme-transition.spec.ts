import { expect, test } from "@playwright/test";
import sharp from "sharp";

for (const width of [1440, 390]) {
  for (const initial of ["light", "dark"] as const) {
    test(`${width}px ${initial}: theme reveal contains both snapshots at its midpoint`, async ({
      page,
    }, testInfo) => {
      const next = initial === "light" ? "dark" : "light";
      const nextLabel = next === "light" ? "Light" : "Dark";
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.addInitScript((theme) => {
        localStorage.setItem("appsolves-theme", theme);
        const start = document.startViewTransition.bind(document);
        document.startViewTransition = (update) => {
          const transition = start(async () => {
            if (typeof update === "function") await update();
            document.documentElement.dataset.snapshotTheme =
              document.documentElement.dataset.theme;
          });
          void transition.ready.then(() => {
            const animation = document
              .getAnimations()
              .find(
                (animation) =>
                  animation instanceof CSSAnimation &&
                  animation.animationName === "theme-circle",
              )!;
            animation.pause();
            animation.currentTime = 0;
          });
          return transition;
        };
      }, initial);
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      if (width < 768) {
        await page.getByRole("button", { name: "Open navigation" }).click();
        await page.getByRole("radio", { name: nextLabel, exact: true }).click();
      } else {
        await page.getByRole("button", { name: "Choose color theme" }).click();
        await page
          .getByRole("menuitemradio", { name: nextLabel, exact: true })
          .click();
      }
      await page.waitForFunction(() =>
        document
          .getAnimations()
          .some(
            (animation) =>
              animation instanceof CSSAnimation &&
              animation.animationName === "theme-circle" &&
              animation.playState === "paused",
          ),
      );
      // The resolved DOM must already be updated before the new snapshot.
      await expect(page.locator("html")).toHaveAttribute(
        "data-snapshot-theme",
        next,
      );
      const pixels: number[][][] = [];
      for (const time of [0, 240, 480]) {
        const duration = await page.evaluate(async (time) => {
          const animation = document
            .getAnimations()
            .find(
              (animation) =>
                animation instanceof CSSAnimation &&
                animation.animationName === "theme-circle",
            )!;
          animation.currentTime = time;
          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          );
          return animation.effect!.getTiming().duration;
        }, time);
        expect(duration).toBe(480);
        const capture = await page.screenshot({
          path: testInfo.outputPath(`theme-${width}-${initial}-${time}ms.png`),
        });
        const { data, info } = await sharp(capture)
          .removeAlpha()
          .raw()
          .toBuffer({ resolveWithObject: true });
        pixels.push(
          [
            [4, 4],
            [info.width - 5, 4],
            [4, info.height - 5],
            [info.width - 5, info.height - 5],
            [4, Math.floor(info.height / 2)],
            [info.width - 5, Math.floor(info.height / 2)],
          ].map(([x, y]) => [
            ...data.subarray(
              (y * info.width + x) * 3,
              (y * info.width + x) * 3 + 3,
            ),
          ]),
        );
      }
      const near = (a: number[], b: number[]) =>
        a.every((value, i) => Math.abs(value - b[i]) < 5);
      expect(pixels[0].every((pixel, i) => !near(pixel, pixels[2][i]))).toBe(
        true,
      );
      expect(pixels[1].some((pixel, i) => near(pixel, pixels[0][i]))).toBe(
        true,
      );
      expect(pixels[1].some((pixel, i) => near(pixel, pixels[2][i]))).toBe(
        true,
      );
      await page.evaluate(() =>
        document
          .getAnimations()
          .find(
            (animation) =>
              animation instanceof CSSAnimation &&
              animation.animationName === "theme-circle",
          )!
          .finish(),
      );
      await expect(page.locator("html")).not.toHaveClass(/theme-reveal/);
      await expect(page.locator("html")).toHaveAttribute("data-theme", next);
    });
  }
}

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

test("automatic, same-color and hidden-tab changes bypass the reveal", async ({
  page,
}) => {
  await page.emulateMedia({
    colorScheme: "light",
    reducedMotion: "no-preference",
  });
  await page.addInitScript(() => {
    const start = document.startViewTransition.bind(document);
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        document.documentElement.dataset.transitionCount = "0";
      },
      { once: true },
    );
    document.startViewTransition = (update) => {
      document.documentElement.dataset.transitionCount = String(
        Number(document.documentElement.dataset.transitionCount) + 1,
      );
      return start(update);
    };
  });
  await page.goto("/");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("html")).toHaveAttribute(
    "data-transition-count",
    "0",
  );
  for (const [label, resolved, count] of [
    ["Dark", "dark", "0"],
    ["Light", "light", "1"],
  ]) {
    await page.getByRole("button", { name: "Choose color theme" }).click();
    await page.getByRole("menuitemradio", { name: label, exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", resolved);
    await expect(page.locator("html")).toHaveAttribute(
      "data-transition-count",
      count,
    );
    await expect(page.locator("html")).not.toHaveClass(/theme-reveal/);
  }
  await page.evaluate(() =>
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    }),
  );
  await page.getByRole("button", { name: "Choose color theme" }).click();
  await page.getByRole("menuitemradio", { name: "Dark", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("html")).toHaveAttribute(
    "data-transition-count",
    "1",
  );
  await expect(page.locator("html")).not.toHaveClass(/theme-reveal/);
});
