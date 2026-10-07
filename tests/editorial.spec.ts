import { expect, test } from "@playwright/test";

test("editorial surfaces share the positioning and link to the verified shipped app", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".hero-description")).toHaveText(
    "I build AI systems, compilers, and software products.",
  );
  await expect(page.locator(".specimen-label")).toHaveText("Fidan source");
  const description =
    "I’m Kaan Gönüldinc. I build AI systems, compilers, and software products under AppSolves, and study Computer Science at TUM.";
  for (const selector of [
    'meta[name="description"]',
    'meta[property="og:description"]',
    'meta[name="twitter:description"]',
  ]) {
    await expect(page.locator(selector)).toHaveAttribute(
      "content",
      description,
    );
  }
  await expect(
    page
      .locator("#tagvault")
      .getByRole("link", { name: "Google Play", exact: true }),
  ).toHaveAttribute(
    "href",
    "https://play.google.com/store/apps/details?id=dev.appsolves.tag_vault",
  );
  await expect(page.locator("#lanepilot")).not.toContainText(/39\s*%|29\s*%/);
  await expect(page.locator(".simulation-description")).toHaveText(
    "Lane-change decisions are evaluated in a traffic simulation using average speed, hard-braking events, and collisions.",
  );
  await expect(page.locator(".simulation-results")).toContainText(
    "Simulation evaluation, not public-road measurements.",
  );
  await expect(page.locator("#about-title")).toHaveText("BehindAppSolves");
  await expect(page.locator(".recognition-list")).toContainText(
    "Award for outstanding STEM achievement in the Abitur",
  );
});

test("footer social rows stay balanced at wrap boundaries and retain accessible destinations", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const links = page.locator(".contact-socials a");
  await expect(links).toHaveCount(7);
  const mark = page
    .locator(".contact-socials a")
    .filter({ hasText: "Google Play" })
    .locator("img");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(mark).toHaveJSProperty("complete", true);
  expect(
    await mark.evaluate((img: HTMLImageElement) => img.naturalWidth),
  ).toBeGreaterThan(0);
  for (const width of [
    1920, 1440, 1280, 1101, 1100, 1024, 960, 900, 899, 820, 768, 767, 390, 320,
  ]) {
    await page.setViewportSize({ width, height: 900 });
    const layout = await links.evaluateAll((elements) => {
      const rows = new Map<number, number>();
      let fits = true;
      for (const element of elements) {
        const rect = element.getBoundingClientRect();
        const top = Math.round(rect.top);
        rows.set(top, (rows.get(top) ?? 0) + 1);
        fits &&=
          element.scrollWidth <= element.clientWidth &&
          rect.left >= 0 &&
          rect.right <= innerWidth;
      }
      return {
        rows: [...rows.values()],
        fits,
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    expect(layout.rows, `row distribution at ${width}px`).toEqual(
      width > 1100 ? [4, 3] : [2, 2, 3],
    );
    expect(layout.fits, `social labels at ${width}px`).toBe(true);
    expect(layout.overflow).toBe(false);
    if ([1101, 960, 320].includes(width)) {
      await page
        .locator("#contact")
        .screenshot({ path: testInfo.outputPath(`footer-wrap-${width}.png`) });
    }
  }
});
