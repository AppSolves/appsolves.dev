import { expect, test, type Locator, type Page } from "@playwright/test";

async function translation(arrow: Locator) {
  return arrow.evaluate((element) => {
    const matrix = new DOMMatrix(getComputedStyle(element).transform);
    return [matrix.m41, matrix.m42];
  });
}

async function checkAction(
  page: Page,
  link: Locator,
  direction: string,
  delta: number[],
) {
  const arrow = link.locator(`[data-arrow-motion="${direction}"]`);
  // Keyboard focus can enqueue native smooth scrolling after positioning,
  // moving the target out from under the pointer. Isolate arrow interpolation;
  // the navigation suite exercises scrolling and sticky-header clearance.
  await page.evaluate(() =>
    document.documentElement.style.setProperty(
      "scroll-behavior",
      "auto",
      "important",
    ),
  );
  await link.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await link.hover();
  expect(await link.evaluate((element) => element.matches(":hover"))).toBe(
    true,
  );
  await expect.poll(() => translation(arrow)).toEqual(delta);
  await page.mouse.move(0, 0);
  await expect.poll(() => translation(arrow)).toEqual([0, 0]);
  await page.keyboard.press("Tab");
  await link.evaluate((element) => {
    element.scrollIntoView({ block: "center", behavior: "instant" });
    (element as HTMLElement).focus({ preventScroll: true });
  });
  expect(
    await link.evaluate((element) => element.matches(":focus-visible")),
  ).toBe(true);
  await expect.poll(() => translation(arrow)).toEqual(delta);
  await expect(arrow).toHaveCSS("transition-duration", "0.2s");
  await link.evaluate((element) => (element as HTMLElement).blur());
}

test("directional arrows share semantic hover and keyboard focus motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  // Exercise CSS/input independently of expensive software WebGL captures.
  // The separate render/lifecycle suite keeps real scenes at full quality.
  await page.route(/\/(?:brand|phone)-scene-[^/]+\.js$/, (route) =>
    route.abort(),
  );
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".hero-actions")).toHaveCSS("transform", "none");
  const arrows = page.locator('svg[class*="lucide-arrow"]');
  for (const arrow of await arrows.all())
    await expect(arrow).toHaveAttribute(
      "data-arrow-motion",
      /external|down|up|left/,
    );
  await checkAction(
    page,
    page.getByRole("link", { name: "Explore the work", exact: true }),
    "down",
    [0, 3],
  );
  await checkAction(
    page,
    page.getByRole("link", { name: "Explore Fidan", exact: true }),
    "external",
    [2.5, -2.5],
  );
  await checkAction(
    page,
    page.locator(".hero-index a").first(),
    "down",
    [0, 3],
  );
  await checkAction(
    page,
    page.locator(".source-list a").first(),
    "external",
    [2.5, -2.5],
  );
  await checkAction(
    page,
    page.locator(".contact-email"),
    "external",
    [2.5, -2.5],
  );
  await checkAction(
    page,
    page.getByRole("link", { name: "Back to top", exact: true }),
    "up",
    [0, -3],
  );
  const social = page
    .locator(".contact-socials")
    .getByRole("link", { name: "YouTube" });
  await social.hover();
  await expect(social.locator("svg")).toHaveCSS("transform", "none");
  await expect(
    page.locator(
      ".contact-socials [data-arrow-motion], .contact-support [data-arrow-motion]",
    ),
  ).toHaveCount(0);
  await page.goto("/privacy_policy");
  await checkAction(
    page,
    page.getByRole("link", { name: "Back home", exact: true }),
    "left",
    [-3, 0],
  );
  await page.goto("/missing-page");
  await checkAction(
    page,
    page.getByRole("link", { name: "Back to AppSolves", exact: true }),
    "left",
    [-3, 0],
  );
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await checkAction(
    page,
    page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link")
      .first(),
    "down",
    [0, 3],
  );
});

test("reduced motion keeps focus feedback without translating arrows", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const name of ["Explore the work", "Explore Fidan", "Back to top"]) {
    const link = page.getByRole("link", { name, exact: true });
    await link.hover();
    await expect(link.locator("[data-arrow-motion]")).toHaveCSS(
      "transform",
      "none",
    );
    await page.mouse.move(0, 0);
    await page.keyboard.press("Tab");
    await link.focus();
    await expect(link.locator("[data-arrow-motion]")).toHaveCSS(
      "transform",
      "none",
    );
    expect(
      await link.evaluate((element) => getComputedStyle(element).outlineStyle),
    ).not.toBe("none");
  }
});
