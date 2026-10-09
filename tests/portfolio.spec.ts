import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";

const sizes = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "wide", width: 1920, height: 1080 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "compact-desktop", width: 1100, height: 900 },
  { name: "landscape-tablet", width: 960, height: 900 },
  { name: "tablet", width: 820, height: 1180 },
  { name: "mobile", width: 390, height: 844 },
  { name: "small-mobile", width: 320, height: 568 },
];

for (const theme of ["light", "dark"] as const) {
  for (const size of sizes) {
    test(`${theme} ${size.name}: content, layout, assets and accessibility`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize(size);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript(
        (theme) => localStorage.setItem("appsolves-theme", theme),
        theme,
      );
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "I build software from the inside out.",
      );
      await expect(page.locator(".hero-line")).toHaveText([
        "I build software",
        "from the inside out.",
      ]);
      const headline = await page.locator(".hero-line").evaluateAll((lines) =>
        lines.map((line) => {
          const text = document.createRange();
          text.selectNodeContents(line);
          const box = text.getBoundingClientRect();
          return {
            left: box.left,
            right: box.right,
            top: box.top,
            bottom: box.bottom,
            columnRight: line.getBoundingClientRect().right,
          };
        }),
      );
      for (const line of headline) {
        expect(line.left).toBeGreaterThanOrEqual(0);
        expect(line.right).toBeLessThanOrEqual(size.width);
        expect(line.right).toBeLessThanOrEqual(line.columnRight);
      }
      expect(headline[1].top).toBeGreaterThan(headline[0].top);
      const actions = (await page.locator(".hero-actions").boundingBox())!;
      expect(actions.y + actions.height).toBeLessThanOrEqual(size.height - 24);
      const index = (await page.locator(".hero-index").boundingBox())!;
      expect(index.y).toBeGreaterThanOrEqual(size.height);
      if (size.width < 768) {
        const object = (await page.locator(".hero-object").boundingBox())!;
        // Keep the mark close to the action row even on short phones.
        expect(object.y - (actions.y + actions.height)).toBeLessThanOrEqual(32);
        expect(object.y - (actions.y + actions.height)).toBeGreaterThanOrEqual(
          24,
        );
      }
      await expect(page.locator("#fidan-title")).toHaveText("Fidan");
      await expect(page.locator("#lanepilot-title")).toHaveText("LanePilot");
      await expect(page.locator("#tagvault-title")).toHaveText("TagVault");
      await expect(page.locator(".source-list li")).toHaveCount(5);
      await expect(
        page
          .locator(".source-list")
          .getByRole("link", { name: /appscreen-mcp/ }),
      ).toHaveAttribute("href", "https://github.com/AppSolves/appscreen-mcp");
      await expect(page.locator(".source-list")).toContainText(
        "built on YuzuHub’s app screenshot generator",
      );
      await expect(page.locator(".focus-line p")).toHaveText(
        "AI & Deep Learning / Software Engineering / Products & Entrepreneurship",
      );
      await expect(page.locator(".lane-comparison img")).toHaveCount(2);
      await expect(page.locator("#lanepilot")).not.toContainText(
        "Simulation evaluation",
      );
      await expect(
        page.getByRole("link", { name: "Full-resolution comparison" }),
      ).toHaveAttribute("href", "/images/lanepilot-simulation-full.webp");
      for (const panel of await page.locator(".lane-crop").all()) {
        const framing = await panel.evaluate((element) => ({
          radius: parseFloat(getComputedStyle(element).borderRadius),
          width: element.getBoundingClientRect().width,
          height: element.getBoundingClientRect().height,
        }));
        expect(framing.radius).toBe(size.width < 768 ? 12 : 14);
        expect(framing.width / framing.height).toBeCloseTo(1920 / 960, 2);
        await expect(panel.locator("img")).toHaveCSS("object-fit", "contain");
      }
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(page.locator(".lane-stage-heading")).toContainText(
        "Traffic simulation",
      );
      await expect(page.locator(".lane-stage-footer")).toContainText(
        "not public-road measurements",
      );
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      );
      expect(overflow).toBe(false);
      const wordmarkFits = await page
        .locator(".fidan-wordmark")
        .evaluate((element) => {
          const text = document.createRange();
          text.selectNodeContents(element);
          return (
            text.getBoundingClientRect().right <
            element.closest(".fidan-stage")!.getBoundingClientRect().right - 12
          );
        });
      expect(wordmarkFits).toBe(true);
      await expect(page.locator(".brand-poster")).toBeVisible();
      await expect(page.locator(".brand-canvas")).toHaveCount(0);
      expect(
        await page.evaluate(() =>
          performance
            .getEntriesByType("resource")
            .some((entry) => entry.name.includes("brand-scene-")),
        ),
      ).toBe(false);
      for (const image of await page.locator("main img").all()) {
        await image.scrollIntoViewIfNeeded();
        await expect(image).toHaveJSProperty("complete", true);
        expect(
          await image.evaluate(
            (element) => (element as HTMLImageElement).naturalWidth,
          ),
        ).toBeGreaterThan(0);
      }
      const accessibility = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(accessibility.violations).toEqual([]);
      expect(errors).toEqual([]);
      for (const [name, selector] of [
        ["top", ".hero"],
        ["work", ".fidan-stage"],
        ["lane", ".lane-stage"],
        ["tag", ".tag-stage"],
        ["about", ".about-section"],
        ["open-source", ".open-source-section"],
        ["contact", "#contact"],
      ]) {
        await page
          .locator(selector)
          .evaluate((element) =>
            element.scrollIntoView({ block: "start", behavior: "instant" }),
          );
        await page.screenshot({
          path: testInfo.outputPath(`${theme}-${size.name}-${name}.png`),
        });
      }
      if (["desktop", "tablet", "mobile"].includes(size.name)) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({
          path: testInfo.outputPath(`${theme}-${size.name}-fullpage.png`),
          fullPage: true,
        });
      }
    });
  }
}

test("mobile disclosure closes with Escape, selects anchors, and resets at desktop width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open navigation" });
  await toggle.click();
  await expect(
    page.getByRole("button", { name: "Close navigation" }),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(page).toHaveURL(/#about$/);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("keyboard skip link reaches the main landmark", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("featured project anchors clear the sticky header without a doubled scroll offset", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const headerHeight = await page
    .locator(".site-header")
    .evaluate((element) => element.getBoundingClientRect().height);
  for (const [name, id] of [
    ["Fidan", "#fidan"],
    ["LanePilot", "#lanepilot"],
    ["TagVault", "#tagvault"],
  ]) {
    await page
      .getByRole("navigation", { name: "Featured projects" })
      .getByRole("link", { name: new RegExp(name) })
      .click();
    const top = await page
      .locator(id)
      .evaluate((element) => element.getBoundingClientRect().top);
    expect(top).toBeGreaterThan(headerHeight);
    expect(top).toBeLessThan(headerHeight + 56);
  }
});

for (const theme of ["light", "dark"] as const) {
  for (const [route, title] of [
    ["privacy_policy", "Privacy Policy"],
    ["terms_and_conditions", "Terms and Conditions"],
  ]) {
    test(`${theme} ${route}: direct entry, full document, accessible navigation and static deployment file`, async ({
      page,
      request,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript(
        (theme) => localStorage.setItem("appsolves-theme", theme),
        theme,
      );
      const response = await request.get(`/${route}/`);
      expect(response.status()).toBe(200);
      await page.goto(`/${route}`);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        title,
      );
      await expect(page.locator("main")).toContainText("contact@appsolves.dev");
      await expect(page.locator("main h2")).not.toHaveCount(0);
      await expect(page).toHaveTitle(/AppSolves/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://appsolves.dev/${route}`,
      );
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
      const entry = await readFile(`dist/${route}/index.html`, "utf8");
      expect(entry).toContain(`https://appsolves.dev/${route}`);
      await page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "Work", exact: true })
        .click();
      await expect(page).toHaveURL(/\/#work$/);
      await expect(page.locator("#work-title")).toBeVisible();
    });
  }
}

test("real project links, contact, metadata and Pages artifacts are preserved", async ({
  page,
}) => {
  await page.goto("/");
  for (const [label, href] of [
    ["Explore Fidan", "https://fidan.dev"],
    ["Source code", "https://github.com/fidan-lang/fidan"],
    ["Explore the system", "https://github.com/AppSolves/LanePilot"],
    ["TagVault website", "https://tagvault.appsolves.dev"],
  ]) {
    await expect(
      page.getByRole("link", { name: label, exact: true }),
    ).toHaveAttribute("href", href);
    await expect(
      page.getByRole("link", { name: label, exact: true }),
    ).toHaveAttribute("rel", "noopener noreferrer");
  }
  for (const [label, href] of [
    ["GitHub", "https://github.com/AppSolves"],
    ["LinkedIn", "https://linkedin.com/in/kaangoenueldinc"],
    ["X", "https://x.com/AppSolves"],
    ["Instagram", "https://instagram.com/appsolves.dev"],
    ["YouTube", "https://youtube.com/@appsolvesdev"],
    [
      "Google Play",
      "https://play.google.com/store/apps/dev?id=6007461154397933888",
    ],
  ]) {
    await expect(
      page
        .locator(".contact-socials")
        .getByRole("link", { name: label, exact: true }),
    ).toHaveAttribute("href", href);
  }
  for (const [label, href] of [
    ["Sponsor the work", "https://github.com/sponsors/AppSolves"],
    ["Buy me a coffee", "https://www.buymeacoffee.com/AppSolves"],
  ]) {
    await expect(
      page.getByRole("link", { name: label, exact: true }),
    ).toHaveAttribute("href", href);
  }
  await expect(
    page.getByRole("link", { name: "contact@appsolves.dev" }),
  ).toHaveAttribute("href", "mailto:contact@appsolves.dev");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://appsolves.dev/social-preview.png",
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  expect(await readFile("dist/CNAME", "utf8")).toBe(
    await readFile("CNAME", "utf8"),
  );
  expect(await readFile("dist/app-ads.txt", "utf8")).toBe(
    await readFile("public/app-ads.txt", "utf8"),
  );
  expect(await readFile("dist/404.html", "utf8")).toContain(
    '<div id="root"></div>',
  );
  const sitemap = await readFile("dist/sitemap.xml", "utf8");
  expect(sitemap.match(/<loc>/g)).toHaveLength(5);
  expect(sitemap).toContain("https://appsolves.dev/privacy_policy");
});

test("desktop WebGL responds to pointer and falls back after context loss", async ({
  page,
}) => {
  test.slow(Boolean(process.env.CI));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".brand-scene")).toHaveAttribute(
    "data-rendered",
    "true",
  );
  const canvas = page.locator(".brand-canvas");
  expect(
    await canvas.evaluate(
      (element) =>
        (element as HTMLCanvasElement)
          .getContext("webgl2")
          ?.getContextAttributes()?.preserveDrawingBuffer,
    ),
  ).toBe(false);
  if (!process.env.CI) {
    // Real GPU/compositor runs can reliably verify the subtle pointer response
    // via pixels. SwiftShader in GitHub Actions renders the scene correctly,
    // but its screenshot output can remain identical across tiny rotations.
    const initial = await canvas.screenshot();
    await canvas.hover({ position: { x: 30, y: 30 } });
    await expect.poll(() => canvas.screenshot()).not.toEqual(initial);
  } else {
    await canvas.hover({ position: { x: 30, y: 30 } });
    await expect(canvas).toBeVisible();
  }
  await canvas.evaluate((element) => {
    const context = (element as HTMLCanvasElement).getContext("webgl2");
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  });
  await expect(page.locator(".brand-poster")).toBeVisible();
  await expect(canvas).toBeHidden();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("reduced motion preference changes dispose and recreate the scene", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".brand-scene")).toHaveAttribute(
    "data-rendered",
    "true",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".brand-canvas")).toHaveCount(0);
  await expect(page.locator(".brand-poster")).toBeVisible();
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".brand-canvas")).toHaveCount(1);
  await expect(page.locator(".brand-scene")).toHaveAttribute(
    "data-rendered",
    "true",
  );
});

test("unavailable WebGL preserves the poster and all content", async ({
  page,
}) => {
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
  await page.goto("/");
  await expect(page.locator(".brand-poster")).toBeVisible();
  await expect(page.locator(".brand-canvas")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Explore the work" }),
  ).toBeVisible();
});

for (const theme of ["light", "dark"] as const) {
  test(`${theme} unknown routes have an accessible route home`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    await page.goto("/does-not-exist");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, follow",
    );
    await expect(
      page.locator('link[rel="canonical"],meta[property="og:url"]'),
    ).toHaveCount(0);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.getByRole("link", { name: "Back to AppSolves" }).click();
    await expect(page).toHaveURL(/\/$/);
  });
}
