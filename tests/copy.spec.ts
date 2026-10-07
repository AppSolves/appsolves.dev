import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

const ornamentalPunctuation = /[—–→↗←·]/;

test("production copy uses plain punctuation outside preserved legal documents", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of ["/", "/copy-audit-missing"]) {
    await page.goto(route);
    await expect(page.locator("main h1")).toBeVisible();
    const copy = await page.evaluate(() => {
      const root = document.querySelector("#root")!;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const text: string[] = [document.title];
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.parentElement?.closest("pre, code, script, style"))
          text.push(node.textContent ?? "");
      }
      for (const element of document.querySelectorAll(
        "meta[content], [alt], [aria-label], [title]",
      ))
        for (const name of ["content", "alt", "aria-label", "title"])
          text.push(element.getAttribute(name) ?? "");
      return text.join("\n");
    });
    expect(copy).not.toMatch(ornamentalPunctuation);
  }
  // The no-JavaScript fallback and social metadata also survive into every shell.
  for (const path of [
    "index.html",
    "404.html",
    "privacy_policy/index.html",
    "terms_and_conditions/index.html",
  ]) {
    const html = await readFile(`dist/${path}`, "utf8");
    const copy = await page.evaluate((html) => {
      const document = new DOMParser().parseFromString(html, "text/html");
      document.querySelectorAll("script, style, pre, code").forEach((element) =>
        element.remove(),
      );
      return [
        document.body.textContent,
        document.title,
        ...[...document.querySelectorAll("meta[content]")].map((element) =>
          element.getAttribute("content"),
        ),
      ].join("\n");
    }, html);
    expect(copy).not.toMatch(ornamentalPunctuation);
  }
});
