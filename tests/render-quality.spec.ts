import { expect, test } from "@playwright/test";
import { scenePixelRatio } from "../src/components/scene-quality";

test("render quality policy preserves a 2x floor under zoom and bounds GPU density", () => {
  for (const dpr of [0.5, 0.75, 1, 1.5, 2, 2.25, 3, 4]) {
    expect(scenePixelRatio(dpr, false)).toBe(Math.min(2.25, Math.max(2, dpr)));
    expect(scenePixelRatio(dpr, true)).toBe(2);
  }
});

for (const theme of ["light", "dark"] as const) {
  for (const dpr of [1, 2]) {
    test(`${theme} DPR ${dpr}: actual hero and phone backing resolution and closeups`, async ({
      browser,
      baseURL,
    }, testInfo) => {
      // CI traces show ~10s for one high-DPI software compositor capture.
      // This case captures five views; retain every quality assertion.
      test.slow(Boolean(process.env.CI));
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: dpr,
      });
      const page = await context.newPage();
      try {
        await page.addInitScript(
          (value) => localStorage.setItem("appsolves-theme", value),
          theme,
        );
        await page.goto(baseURL!);
        const report: Record<string, unknown> = { theme, dpr };
        for (const [name, selector] of [
          ["hero", ".brand-scene"],
          ["phone", ".phone-scene"],
        ]) {
          const scene = page.locator(selector);
          await scene.scrollIntoViewIfNeeded();
          await expect(scene).toHaveAttribute("data-rendered", "true");
          const backing = await scene
            .locator("canvas")
            .evaluate((canvas: HTMLCanvasElement) => ({
              width: canvas.width,
              height: canvas.height,
              cssWidth: canvas.getBoundingClientRect().width,
              cssHeight: canvas.getBoundingClientRect().height,
            }));
          report[name] = backing;
          expect(backing.width / backing.cssWidth).toBeGreaterThanOrEqual(1.99);
          expect(backing.height / backing.cssHeight).toBeGreaterThanOrEqual(
            1.99,
          );
          expect(backing.width / backing.cssWidth).toBeLessThanOrEqual(2.26);
          await scene.screenshot({
            path: testInfo.outputPath(`${name}-${theme}-dpr${dpr}-closeup.png`),
          });
          if (name === "phone") {
            const box = (await scene.boundingBox())!;
            await page.mouse.move(
              box.x + box.width / 2,
              box.y + box.height / 2,
            );
            await page.mouse.down();
            await page.mouse.move(
              box.x + box.width / 2 + 90,
              box.y + box.height / 2 + 20,
              { steps: 10 },
            );
            await expect(scene).toHaveAttribute("data-dragging", "true");
            await scene.screenshot({
              path: testInfo.outputPath(
                `phone-rotated-${theme}-dpr${dpr}-closeup.png`,
              ),
            });
            await page.mouse.up();
          }
        }
        await testInfo.attach("canvas-backing-resolution", {
          body: JSON.stringify(report, null, 2),
          contentType: "application/json",
        });
        await page.evaluate(() => {
          Object.defineProperty(window, "devicePixelRatio", {
            configurable: true,
            value: 0.75,
          });
          window.dispatchEvent(new Event("resize"));
        });
        for (const selector of [".brand-canvas", ".phone-canvas"])
          await expect
            .poll(() =>
              page
                .locator(selector)
                .evaluate(
                  (canvas: HTMLCanvasElement) =>
                    canvas.width / canvas.getBoundingClientRect().width,
                ),
            )
            .toBeGreaterThanOrEqual(1.99);
        await page.locator(".fidan-stage").scrollIntoViewIfNeeded();
        await page.locator(".fidan-stage").screenshot({
          path: testInfo.outputPath(`fidan-${theme}-dpr${dpr}-stage.png`),
        });
        await page.locator(".fidan-editor").screenshot({
          path: testInfo.outputPath(
            `fidan-${theme}-dpr${dpr}-syntax-closeup.png`,
          ),
        });
      } finally {
        await context.close();
      }
    });
  }
}

test("Fidan shows its official icon and exact five-line source without desktop wrapping", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const expected =
    'action greet with (certain name oftype string) returns string {\n    return "Hello, {name}!"\n}\n\nprint(greet("Fidan"))';
  expect(await page.locator(".fidan-specimen code").textContent()).toBe(
    expected,
  );
  await expect(page.locator(".code-line-numbers span")).toHaveText([
    "1",
    "2",
    "3",
    "4",
    "5",
  ]);
  await expect(page.locator(".code-line-numbers")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await expect(page.locator(".code-line-numbers")).toHaveCSS(
    "user-select",
    "none",
  );
  await page.locator(".fidan-stage").scrollIntoViewIfNeeded();
  const logo = page.locator(".fidan-lockup img");
  await expect(logo).toHaveJSProperty("complete", true);
  await expect(logo).toHaveJSProperty("naturalWidth", 256);
  for (const width of [1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.locator(".fidan-specimen pre")).toHaveCSS(
      "white-space",
      "pre",
    );
    expect(
      await page
        .locator(".fidan-specimen pre")
        .evaluate((element) => element.scrollWidth <= element.clientWidth),
    ).toBe(true);
  }
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page
        .locator(".fidan-specimen pre")
        .evaluate((element) => element.scrollWidth > element.clientWidth),
    ).toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(await page.locator(".fidan-specimen code").textContent()).toBe(
      expected,
    );
  }
});
