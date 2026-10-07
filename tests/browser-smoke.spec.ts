import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const theme of ["light", "dark"] as const) {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    test(`${theme} ${viewport.width}: fonts, navigation, themes and content`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto("/");
      expect(await page.evaluate(() => innerWidth)).toBe(viewport.width);
      await expect(page.locator("h1")).toHaveText(
        "Think deeply.Build real things.",
      );
      const loadedFonts = await page.evaluate(async () => {
        const faces = await Promise.all([
          document.fonts.load("20px Manrope"),
          document.fonts.load("italic 20px Newsreader"),
        ]);
        await document.fonts.ready;
        return faces.map((fonts) => fonts.length);
      });
      expect(loadedFonts).toEqual([1, 1]);
      expect(
        await page.evaluate(
          () =>
            document.fonts.check("20px Manrope") &&
            document.fonts.check("italic 20px Newsreader"),
        ),
      ).toBe(true);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      if (viewport.width < 768) {
        await page.getByRole("button", { name: "Open navigation" }).click();
        await page
          .getByRole("radio", {
            name: theme === "light" ? "Dark" : "Light",
            exact: true,
          })
          .check();
        await page.keyboard.press("Escape");
        await expect(
          page.getByRole("button", { name: "Open navigation" }),
        ).toBeFocused();
      } else {
        await page.getByRole("button", { name: "Choose color theme" }).click();
        await page
          .getByRole("menuitemradio", {
            name: theme === "light" ? "Dark" : "Light",
            exact: true,
          })
          .click();
      }
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        theme === "light" ? "dark" : "light",
      );
      await page
        .getByRole("navigation", { name: "Featured projects" })
        .getByRole("link", { name: /TagVault/ })
        .click();
      await expect(page.locator("#tagvault")).toContainText("paid Pro tier");
      await expect(page.locator(".phone-poster img")).toHaveJSProperty(
        "complete",
        true,
      );
      expect(
        await page
          .locator(".phone-poster img")
          .evaluate((image) => (image as HTMLImageElement).naturalWidth),
      ).toBeGreaterThan(0);
      await expect(
        page.getByRole("link", { name: "Meet TagVault" }),
      ).toHaveAttribute("href", "https://tagvault.appsolves.dev");
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
      await page.screenshot({
        path: testInfo.outputPath(
          `${testInfo.project.name}-${theme}-${viewport.width}.png`,
        ),
        fullPage: true,
      });
      expect(errors).toEqual([]);
    });
  }
}
