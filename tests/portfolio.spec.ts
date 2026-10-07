import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";

const sizes = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "wide", width: 1920, height: 1080 },
  { name: "tablet", width: 820, height: 1180 },
  { name: "mobile", width: 390, height: 844 },
  { name: "small-mobile", width: 320, height: 568 },
];

for (const size of sizes) {
  test(`${size.name}: content, layout, assets and accessibility`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(size);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Deep thinking.Real things.",
    );
    await expect(page.locator("#fidan-title")).toHaveText("Fidan");
    await expect(page.locator("#lanepilot-title")).toHaveText("LanePilot");
    await expect(page.locator("#tagvault-title")).toHaveText("TagVault");
    await expect(page.locator(".source-list li")).toHaveCount(5);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    expect(overflow).toBe(false);
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
      ["contact", "#contact"],
    ]) {
      await page
        .locator(selector)
        .evaluate((element) =>
          element.scrollIntoView({ block: "start", behavior: "instant" }),
        );
      await page.screenshot({
        path: testInfo.outputPath(`${size.name}-${name}.png`),
      });
    }
  });
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

for (const [route, title] of [
  ["privacy_policy", "Privacy Policy"],
  ["terms_and_conditions", "Terms and Conditions"],
]) {
  test(`${route}: direct entry, full document, accessible navigation and static deployment file`, async ({
    page,
    request,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const response = await request.get(`/${route}/`);
    expect(response.status()).toBe(200);
    await page.goto(`/${route}`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(title);
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

test("real project links, contact, metadata and Pages artifacts are preserved", async ({
  page,
}) => {
  await page.goto("/");
  for (const [label, href] of [
    ["Explore Fidan", "https://fidan.dev"],
    ["Source code", "https://github.com/fidan-lang/fidan"],
    ["Explore the system", "https://github.com/AppSolves/LanePilot"],
    ["Meet TagVault", "https://tagvault.appsolves.dev"],
  ]) {
    await expect(
      page.getByRole("link", { name: label, exact: true }),
    ).toHaveAttribute("href", href);
    await expect(
      page.getByRole("link", { name: label, exact: true }),
    ).toHaveAttribute("rel", "noopener noreferrer");
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
  expect(sitemap.match(/<loc>/g)).toHaveLength(3);
  expect(sitemap).toContain("https://appsolves.dev/privacy_policy");
});

test("desktop WebGL responds to pointer and falls back after context loss", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".brand-scene")).toHaveAttribute(
    "data-rendered",
    "true",
  );
  const canvas = page.locator(".brand-canvas");
  const initial = await canvas.evaluate((element) =>
    (element as HTMLCanvasElement).toDataURL(),
  );
  await canvas.hover({ position: { x: 30, y: 30 } });
  await expect
    .poll(() =>
      canvas.evaluate((element) => (element as HTMLCanvasElement).toDataURL()),
    )
    .not.toBe(initial);
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

test("unknown routes have an accessible route home", async ({ page }) => {
  await page.goto("/does-not-exist");
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
  await page.getByRole("link", { name: "Back to AppSolves" }).click();
  await expect(page).toHaveURL(/\/$/);
});
