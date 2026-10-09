import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile, readdir } from "node:fs/promises";

const testContact = "http://127.0.0.1:4174/contact/";
const api = "http://127.0.0.1:8787/contact/submit";

async function mockVerification(page: Page) {
  await page.route(
    "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit",
    (route) =>
      route.fulfill({
        contentType: "application/javascript",
        body: `const widgets=new Map();let sequence=0;window.turnstile={render(el, options){const id=String(++sequence);widgets.set(id,el);window.contactChallenge=options;el.dataset.action=options.action;el.innerHTML='<button type="button">Verify test challenge</button>';el.firstChild.onclick=()=>options.callback('fresh-test-token');return id;},remove(id){widgets.get(id)?.replaceChildren();widgets.delete(id);}};`,
      }),
  );
}
async function fill(page: Page) {
  await page.getByLabel("Name (optional)").fill("Visitor");
  await page.getByLabel("Email", { exact: true }).fill("visitor@example.org");
  await page.getByLabel("Subject (optional)").fill("A question");
  await page
    .getByLabel("Message", { exact: true })
    .fill("Hello Kaan, I have a project question.");
}
async function verify(page: Page) {
  await page.getByRole("button", { name: "Verify test challenge" }).click();
}

for (const theme of ["light", "dark"]) {
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1280, 800],
    [960, 900],
    [820, 1180],
    [390, 844],
    [320, 568],
  ]) {
    test(`Contact and Impressum ${theme} ${width}x${height}`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript(
        (theme) => localStorage.setItem("appsolves-theme", theme),
        theme,
      );
      await mockVerification(page);
      await page.goto(testContact);
      await expect(page.locator("h1")).toHaveText("Let’s talk.");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(page.locator(".contact-verification > div")).toHaveAttribute(
        "data-action",
        "contact",
      );
      expect(
        await page.evaluate(
          () =>
            (window as unknown as { contactChallenge: { size: string } })
              .contactChallenge.size,
        ),
      ).toBe(width === 320 ? "compact" : "flexible");
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await expect(
        page.getByRole("button", { name: "Send message", exact: true }),
      ).toBeEnabled();
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
      await page.screenshot({
        path: testInfo.outputPath(`form-${theme}-${width}.png`),
        fullPage: true,
      });
      await page
        .getByRole("button", { name: "Send message", exact: true })
        .click();
      await expect(page.getByLabel("Email", { exact: true })).toBeFocused();
      await expect(page.locator("#email-error")).toHaveText(
        "Please enter your email.",
      );
      await expect(page.locator("#message-error")).toHaveText(
        "Please enter your message.",
      );
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
      // Native invalid-field focus scrolls; full-page capture would misplace sticky/fixed UI.
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.screenshot({
        path: testInfo.outputPath(`errors-${theme}-${width}.png`),
        fullPage: true,
      });
      await page.goto("/impressum/");
      await expect(page.locator("h1")).toHaveText("Impressum");
      await expect(page.locator("main")).toHaveAttribute("lang", "de");
      await expect(page.locator("main")).toContainText(
        "Massenhausener Straße 17",
      );
      await expect(page.locator("main")).toContainText(
        "85375 Neufahrn bei Freising",
      );
      await expect(page.locator("main")).toContainText("Deutschland");
      await expect(page.locator("main")).not.toContainText(
        /GmbH|USt-ID|Handelsregister|Schlichtungsstelle/,
      );
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
      await page.screenshot({
        path: testInfo.outputPath(`impressum-${theme}-${width}.png`),
        fullPage: true,
      });
    });
  }
}

test("contact submission requires verification, preserves failed text, and confirms only acceptance", async ({
  page,
}, testInfo) => {
  await mockVerification(page);
  let response = { status: 502, code: "SEND_FAILED" };
  let calls = 0;
  await page.route(api, async (route) => {
    calls++;
    const body = route.request().postDataJSON();
    expect(body.email).toBe("visitor@example.org");
    expect(body.token).toBe("fresh-test-token");
    expect(body).not.toHaveProperty("recipient");
    await route.fulfill({
      status: response.status,
      contentType: "application/json",
      body: JSON.stringify({ code: response.code }),
    });
  });
  await page.goto(testContact);
  await fill(page);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".form-status")).toContainText(
    "complete the verification",
  );
  expect(calls).toBe(0);
  await verify(page);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".form-status")).toContainText("could not be sent");
  await expect(page.getByLabel("Message", { exact: true })).toHaveValue(
    "Hello Kaan, I have a project question.",
  );
  await page.screenshot({
    path: testInfo.outputPath("provider-error.png"),
    fullPage: true,
  });
  response = { status: 200, code: "SEND_FAILED" };
  const rejected = page.waitForResponse(api);
  await verify(page);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await rejected;
  await expect(
    page.getByRole("button", { name: "Send message", exact: true }),
  ).toBeEnabled();
  await expect(page.locator(".form-success")).toHaveCount(0);
  response = { status: 200, code: "ACCEPTED" };
  await verify(page);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".form-success")).toHaveText(
    /accepted for sending/,
  );
  await expect(page.locator(".form-status")).toBeFocused();
  await expect(page.locator("form")).toHaveCount(0);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.screenshot({
    path: testInfo.outputPath("accepted.png"),
    fullPage: true,
  });
});

test("expired challenge, provider-verification rejection and duplicate submits", async ({
  page,
}) => {
  await mockVerification(page);
  await page.goto(testContact);
  await fill(page);
  await verify(page);
  await page.evaluate(() =>
    (
      window as unknown as { contactChallenge: Record<string, () => void> }
    ).contactChallenge["expired-callback"](),
  );
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".form-status")).toContainText(
    "complete the verification",
  );
  await page.route(api, (route) =>
    route.fulfill({
      status: 400,
      contentType: "application/json",
      body: '{"code":"VERIFICATION_FAILED"}',
    }),
  );
  await verify(page);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".form-status")).toContainText(
    "Verification expired or failed",
  );
  await page.unroute(api);
  let calls = 0;
  let release!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(api, async (route) => {
    calls++;
    await pending;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"code":"ACCEPTED"}',
    });
  });
  await verify(page);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByRole("button", { name: "Sending…" })).toBeDisabled();
  await page.locator("form").dispatchEvent("submit");
  expect(calls).toBe(1);
  release();
  await expect(page.locator(".form-success")).toBeVisible();
});

test("unconfigured production form fails safely; all direct routes retain legal navigation", async ({
  page,
  request,
}) => {
  for (const path of [
    "/",
    "/contact/",
    "/impressum/",
    "/privacy_policy/",
    "/terms_and_conditions/",
    "/404/",
  ]) {
    const direct = await request.get(path);
    expect(direct.ok()).toBe(true);
    await page.goto(path);
    await expect(page.locator("main")).toBeVisible();
    for (const [label, href] of [
      ["Contact", "/contact"],
      ["Impressum", "/impressum"],
      ["Privacy policy", "/privacy_policy"],
      ["Terms & conditions", "/terms_and_conditions"],
    ]) {
      await expect(
        page
          .locator(".legal-links")
          .getByRole("link", { name: label, exact: true }),
      ).toHaveAttribute("href", href);
    }
    if (path !== "/" && path !== "/404/") {
      expect(await direct.text()).toContain(
        `href="https://appsolves.dev${path.slice(0, -1)}"`,
      );
    }
  }
  await page.goto("/contact/");
  await expect(
    page.getByRole("button", { name: "Send message", exact: true }),
  ).toBeDisabled();
  await expect(page.locator(".form-availability")).toContainText(
    "send an email",
  );
  await page.goto("/impressum/");
  await page
    .locator("main")
    .getByRole("link", { name: "appsolves.dev/contact" })
    .click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://appsolves.dev/contact",
  );
});

test("legal operator addresses, route artifacts and browser bundle exclude private configuration", async () => {
  for (const name of ["privacy_policy", "terms_and_conditions", "impressum"]) {
    const text = await readFile(`public/legal/${name}.md`, "utf8");
    expect(text).toContain("Massenhausener Straße 17");
    expect(text).toContain("85375 Neufahrn bei Freising");
    expect(text).not.toMatch(/Riegelstraße|73760|Ostfildern/);
  }
  const policy = await readFile("public/legal/privacy_policy.md", "utf8");
  expect(policy).toContain("Article 6(1)(f)");
  expect(policy).toContain("Article 6(1)(b)");
  for (const route of ["contact", "impressum", "404"])
    expect(await readFile(`dist/${route}/index.html`, "utf8")).toContain(
      "AppSolves",
    );
  const sitemap = await readFile("dist/sitemap.xml", "utf8");
  expect(sitemap).toContain("/contact");
  expect(sitemap).toContain("/impressum");
  for (const file of await readdir("dist/assets")) {
    if (file.endsWith(".js"))
      expect(await readFile(`dist/assets/${file}`, "utf8")).not.toMatch(
        /MAILJET_API_KEY|MAILJET_SECRET_KEY|TURNSTILE_SECRET_KEY|RATE_LIMIT_SECRET|test-secret-key|test-api-key/,
      );
  }
  const html = await readFile("dist/index.html", "utf8");
  expect(html).toContain("frame-src https://challenges.cloudflare.com");
  expect(html).toContain("script-src 'self' https://challenges.cloudflare.com");
  expect(html).not.toContain("connect-src *");
});

test("contact form can be completed by keyboard and survives verification/network failures", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await mockVerification(page);
  await page.goto(testContact);
  await expect(page.locator("main")).toBeFocused();
  await page.keyboard.press("Tab"); // Main email alternative.
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Name (optional)")).toBeFocused();
  await page.keyboard.insertText("Visitor");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Email", { exact: true })).toBeFocused();
  await page.keyboard.insertText("visitor@example.org");
  await page.keyboard.press("Tab");
  await page.keyboard.insertText("Keyboard inquiry");
  await page.keyboard.press("Tab");
  await page.keyboard.insertText(
    "Hello Kaan, this message was entered by keyboard.",
  );
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Verify test challenge" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await page.evaluate(() =>
    (
      window as unknown as { contactChallenge: Record<string, () => void> }
    ).contactChallenge["error-callback"](),
  );
  await expect(page.locator(".contact-verification")).toContainText(
    "Verification is unavailable",
  );
  await page.getByRole("button", { name: "Retry verification" }).click();
  await verify(page);
  await page.route(api, (route) => route.abort("failed"));
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".form-status")).toContainText("could not confirm");
  await expect(page.getByLabel("Message", { exact: true })).toHaveValue(
    "Hello Kaan, this message was entered by keyboard.",
  );
  expect(errors).toEqual([]);
});

test("Turnstile uses its compact layout on narrow containers and renews verification after resizing", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockVerification(page);
  await page.goto(testContact);
  await fill(page);
  await verify(page);
  await page.setViewportSize({ width: 320, height: 568 });
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { contactChallenge: { size: string } })
            .contactChallenge.size,
      ),
    )
    .toBe("compact");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".form-status")).toContainText(
    "Please complete the verification",
  );
  await expect(page.getByLabel("Message", { exact: true })).toHaveValue(
    "Hello Kaan, I have a project question.",
  );
  await verify(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { contactChallenge: { size: string } })
            .contactChallenge.size,
      ),
    )
    .toBe("flexible");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".form-status")).toContainText(
    "Please complete the verification",
  );
});
