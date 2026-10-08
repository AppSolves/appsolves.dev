import { expect, test } from "@playwright/test";

test("two-line hero keeps its actions inside shorter first viewports", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const theme of ["light", "dark"]) {
    await page.addInitScript(
      (theme) => localStorage.setItem("appsolves-theme", theme),
      theme,
    );
    for (const [width, height] of [
      [1920, 600],
      [1440, 650],
      [1280, 600],
      [1100, 600],
      [960, 600],
    ]) {
      await page.setViewportSize({ width, height });
      await page.goto("/");
      await page.locator("h1").waitFor();
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(page.locator(".hero-line")).toHaveText([
        "I build software",
        "from the inside out.",
      ]);
      for (const selector of [".hero-actions .text-link", ".hero-context"]) {
        const box = (await page.locator(selector).boundingBox())!;
        expect(box.y).toBeGreaterThan(0);
        expect(box.y + box.height).toBeLessThanOrEqual(height - 24);
      }
      const fits = await page.locator(".hero-line").evaluateAll((lines) =>
        lines.every((line) => {
          const range = document.createRange();
          range.selectNodeContents(line);
          return (
            range.getClientRects().length === 1 &&
            range.getBoundingClientRect().right <=
              line.getBoundingClientRect().right
          );
        }),
      );
      expect(fits).toBe(true);
      await page.screenshot({
        path: testInfo.outputPath(`hero-${theme}-${width}-${height}.png`),
      });
    }
  }
});

test("editorial surfaces share the positioning and link to the verified shipped app", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".hero-description")).toHaveText(
    "I develop AI systems for edge hardware and ship software products, including Fidan, my own programming language and compiler. My goal is to turn that work into an AI company.",
  );
  await expect(page.locator(".specimen-label")).toHaveText("Fidan source");
  const description =
    "I’m Kaan Gönüldinc, a Computer Science student at TUM. I develop AI systems and software products under AppSolves, with the goal of building an AI company.";
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
  await expect(page.locator(".lane-figure figcaption")).toHaveText(
    "Illustrative simulation snapshots with speed, braking, and collision diagnostics. The panels show different steps and vehicle counts, rather than a controlled benchmark. No public-road validation.",
  );
  await expect(page.locator("#about-title")).toHaveText("BehindAppSolves");
  await expect(page.locator(".recognition-list")).toContainText(
    "Award for outstanding achievement in STEM subjects",
  );
});

test("footer social rows stay balanced at wrap boundaries and retain accessible destinations", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const links = page.locator(".contact-socials a");
  await expect(links).toHaveCount(6);
  const mark = page
    .locator(".contact-socials a")
    .filter({ hasText: "Google Play" })
    .locator("svg use");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(mark).toHaveAttribute("href", "/icons/google-play.svg#mark");
  await expect(page.locator(".contact-email")).toHaveAttribute(
    "href",
    "mailto:contact@appsolves.dev",
  );
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
    expect(layout.rows, `row distribution at ${width}px`).toEqual([3, 3]);
    expect(layout.fits, `social labels at ${width}px`).toBe(true);
    expect(layout.overflow).toBe(false);
    if ([1101, 960, 320].includes(width)) {
      await page
        .locator("#contact")
        .screenshot({ path: testInfo.outputPath(`footer-wrap-${width}.png`) });
    }
  }
});

test("selective arrivals stay readable, finish once and revert under reduced motion", async ({
  page,
}, testInfo) => {
  // Exercise the real poster fallback so SwiftShader cannot starve GSAP's
  // animation frames. Live scenes have their own quality/lifecycle checks.
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type.startsWith("webgl")) return null;
      return Reflect.apply(getContext, this, [type, ...args]);
    } as typeof getContext;
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const arrivals = page.locator(
    ".section-heading, .about-title, .recognition-list > div, .source-list li, .contact-composition h2",
  );
  for (const element of await arrivals.all()) {
    expect(
      await element.evaluate((element) =>
        Number(getComputedStyle(element).opacity),
      ),
    ).toBeGreaterThan(0.6);
  }
  for (const selector of [
    ".section-heading",
    ".about-title",
    ".recognition-list",
    ".source-list",
    ".contact-composition h2",
  ]) {
    const target = page.locator(selector);
    await target.evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
    await expect
      .poll(() =>
        target.evaluate((element) =>
          [element, ...element.querySelectorAll<HTMLElement>("[style]")].every(
            (element) => {
              const style = (element as HTMLElement).style;
              return !style.opacity && !style.transform;
            },
          ),
        ),
      )
      .toBe(true);
    await target.screenshot({
      path: testInfo.outputPath(
        `arrival-${selector.replace(/[^a-z]/g, "")}.png`,
      ),
    });
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect
    .poll(() =>
      arrivals.evaluateAll((elements) =>
        elements.every((element) => !(element as HTMLElement).style.opacity),
      ),
    )
    .toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await arrivals.evaluateAll((elements) =>
      elements.every((element) => {
        const style = (element as HTMLElement).style;
        return !style.opacity && !style.transform;
      }),
    ),
  ).toBe(true);
});
