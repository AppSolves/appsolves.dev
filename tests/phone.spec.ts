import { expect, test } from "@playwright/test";

test("TagVault loads near its section, responds to drag, and preserves a fallback", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const models: string[] = [];
  await page.addInitScript(() => {
    const counters = window as typeof window & { phoneDraws: number };
    counters.phoneDraws = 0;
    const draw = WebGL2RenderingContext.prototype.drawElements;
    WebGL2RenderingContext.prototype.drawElements = function (...args) {
      if ((this.canvas as HTMLCanvasElement).className === "phone-canvas")
        counters.phoneDraws++;
      return Reflect.apply(draw, this, args);
    };
  });
  page.on("request", (request) => {
    if (request.url().endsWith(".glb")) models.push(request.url());
  });
  await page.goto("/");
  await expect(page.locator(".brand-scene")).toHaveAttribute(
    "data-rendered",
    "true",
  );
  expect(models).toEqual([]);
  await page.locator("#tagvault").scrollIntoViewIfNeeded();
  await expect(page.locator(".phone-scene")).toHaveAttribute(
    "data-rendered",
    "true",
  );
  expect(models).toHaveLength(1);
  const canvas = page.locator(".phone-canvas");
  expect(
    await canvas.evaluate(
      (element) =>
        (element as HTMLCanvasElement)
          .getContext("webgl2")
          ?.getContextAttributes()?.preserveDrawingBuffer,
    ),
  ).toBe(false);
  const initial = await canvas.screenshot();
  const box = (await canvas.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    box.x + box.width / 2 + 90,
    box.y + box.height / 2 + 20,
    { steps: 10 },
  );
  await expect(page.locator(".phone-scene")).toHaveAttribute(
    "data-dragging",
    "true",
  );
  await expect.poll(() => canvas.screenshot()).not.toEqual(initial);
  await page.screenshot({ path: testInfo.outputPath("tagvault-drag.png") });
  await page.mouse.up();
  await expect(page.locator(".phone-scene")).not.toHaveAttribute(
    "data-dragging",
  );
  await page.locator("#contact").scrollIntoViewIfNeeded();
  // Let IntersectionObserver receive the new geometry before measuring actual GPU submissions.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  const offscreenDraws = await page.evaluate(async () => {
    const counters = window as typeof window & { phoneDraws: number };
    const initial = counters.phoneDraws;
    await new Promise<void>((resolve) => {
      let frames = 0;
      const sample = () => {
        if (++frames === 20) resolve();
        else requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
    return counters.phoneDraws - initial;
  });
  expect(offscreenDraws).toBe(0);
  await page.locator("#tagvault").scrollIntoViewIfNeeded();
  await canvas.evaluate((element) =>
    (element as HTMLCanvasElement)
      .getContext("webgl2")
      ?.getExtension("WEBGL_lose_context")
      ?.loseContext(),
  );
  await expect(page.locator(".phone-poster")).toBeVisible();
  await expect(canvas).toBeHidden();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(canvas).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Meet TagVault" })).toBeVisible();
});

test("mobile poster skips both WebGL imports under reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const models: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith(".glb")) models.push(request.url());
  });
  await page.goto("/#tagvault");
  await expect(page.locator(".phone-poster img")).toHaveJSProperty(
    "complete",
    true,
  );
  expect(
    await page
      .locator(".phone-poster img")
      .evaluate((image) => (image as HTMLImageElement).naturalWidth),
  ).toBeGreaterThan(0);
  expect(models).toEqual([]);
  await expect(page.locator("canvas")).toHaveCount(0);
  expect(
    await page
      .locator(".phone-scene")
      .evaluate((element) => getComputedStyle(element).touchAction),
  ).toBe("pan-y");
});
