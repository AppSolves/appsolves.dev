import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const scheme of ["light", "dark"] as const) {
  test(`System defaults to ${scheme} OS preference`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", scheme);
    expect(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).colorScheme,
      ),
    ).toBe(scheme);
    await page.getByRole("button", { name: "Choose color theme" }).click();
    await expect(
      page.getByRole("menuitemradio", { name: "System" }),
    ).toHaveAttribute("aria-checked", "true");
  });

  test(`${scheme} choice persists and overrides the OS`, async ({ page }) => {
    await page.emulateMedia({
      colorScheme: scheme === "light" ? "dark" : "light",
      reducedMotion: "reduce",
    });
    await page.goto("/");
    await page.getByRole("button", { name: "Choose color theme" }).click();
    await page
      .getByRole("menuitemradio", {
        name: scheme === "light" ? "Light" : "Dark",
      })
      .click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", scheme);
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", scheme);
    expect(
      await page.evaluate(() => localStorage.getItem("appsolves-theme")),
    ).toBe(scheme);
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      scheme === "dark" ? "#11120f" : "#f5f3ed",
    );
  });

  test(`System applies ${scheme} before React can execute`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.route("**/assets/*.js", (route) => route.abort());
    await page.goto("/");
    await expect(page.locator("#root")).toBeEmpty();
    await expect(page.locator("html")).toHaveAttribute("data-theme", scheme);
    expect(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).backgroundColor,
      ),
    ).toBe(scheme === "dark" ? "rgb(17, 18, 15)" : "rgb(245, 243, 237)");
  });

  test(`${scheme} theme is applied before React can execute`, async ({
    page,
  }) => {
    await page.emulateMedia({
      colorScheme: scheme === "light" ? "dark" : "light",
    });
    await page.addInitScript(
      (scheme) => localStorage.setItem("appsolves-theme", scheme),
      scheme,
    );
    await page.route("**/assets/*.js", (route) => route.abort());
    await page.goto("/");
    await expect(page.locator("#root")).toBeEmpty();
    await expect(page.locator("html")).toHaveAttribute("data-theme", scheme);
    expect(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).backgroundColor,
      ),
    ).toBe(scheme === "dark" ? "rgb(17, 18, 15)" : "rgb(245, 243, 237)");
  });

  test(`${scheme} mobile menu and theme picker remain accessible`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
    await page.goto("/");
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.getByRole("group", { name: "Appearance" })).toBeVisible();
    await expect(page.getByRole("menu", { name: "Color theme" })).toHaveCount(
      0,
    );
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.screenshot({
      path: testInfo.outputPath(`${scheme}-mobile-menus.png`),
    });
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "Open navigation" }),
    ).toBeFocused();
    await expect(
      page.getByRole("navigation", { name: "Mobile navigation" }),
    ).toBeHidden();
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page
      .getByRole("radio", {
        name: scheme === "light" ? "Dark" : "Light",
        exact: true,
      })
      .check();
    await expect(page.locator("html")).toHaveAttribute(
      "data-theme",
      scheme === "light" ? "dark" : "light",
    );
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "Work", exact: true })
      .click();
    await expect(page).toHaveURL(/#work$/);
  });
}

test("System responds to OS changes after an explicit choice", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("/");
  const choose = async (name: string) => {
    await page.getByRole("button", { name: "Choose color theme" }).click();
    await page.getByRole("menuitemradio", { name, exact: true }).click();
  };
  await choose("Dark");
  await choose("System");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator(".brand-poster")).toHaveAttribute(
    "src",
    "/images/brand-object-dark.png",
  );
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    "content",
    "#11120f",
  );
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("theme picker supports arrows, selection, Escape and focus return", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Choose color theme" });
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("menuitemradio", { name: "System" }),
  ).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("menuitemradio", { name: "Light", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("menuitemradio", { name: "Dark", exact: true }),
  ).toBeFocused();
  await page.screenshot({
    path: testInfo.outputPath("desktop-theme-menu.png"),
  });
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Space");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("theme changes replace one WebGL scene without retaining its drawing buffer", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".brand-scene")).toHaveAttribute(
    "data-rendered",
    "true",
  );
  const previous = await page.locator(".brand-canvas").elementHandle();
  await page.getByRole("button", { name: "Choose color theme" }).click();
  await page.getByRole("menuitemradio", { name: "Dark", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect
    .poll(() => previous!.evaluate((element) => element.isConnected))
    .toBe(false);
  await expect(page.locator(".brand-scene")).toHaveAttribute(
    "data-rendered",
    "true",
  );
  await expect(page.locator(".brand-canvas")).toHaveCount(1);
  expect(
    await page
      .locator(".brand-canvas")
      .evaluate(
        (element) =>
          (element as HTMLCanvasElement)
            .getContext("webgl2")
            ?.getContextAttributes()?.preserveDrawingBuffer,
      ),
  ).toBe(false);
});

test("corrupt theme storage recovers to System", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("appsolves-theme", "unknown"),
  );
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Choose color theme" }).click();
  await expect(
    page.getByRole("menuitemradio", { name: "System" }),
  ).toHaveAttribute("aria-checked", "true");
});

test("blocked persistent storage preserves System behavior and in-page choice", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException("Storage disabled", "SecurityError");
    };
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage disabled", "SecurityError");
    };
  });
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Choose color theme" }).click();
  await page.getByRole("menuitemradio", { name: "Light", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
