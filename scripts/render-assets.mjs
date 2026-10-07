import { chromium } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";

// Run against `npm run dev`; the poster is rendered from the production scene.
const baseURL = process.env.PREVIEW_URL || "http://127.0.0.1:8080";
const mark = await readFile("public/mark.svg", "utf8");
const monochromeMark = mark
  .replace(/#6A5CE3|#695BE3/g, "#242622")
  .replace(/#09090B/g, "#f5f3ed");
await writeFile("public/mark-mono.svg", monochromeMark);
await writeFile("public/favicon.svg", monochromeMark);
const browser = await chromium.launch({
  executablePath: process.env.BROWSER_PATH || undefined,
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  await page.goto(baseURL);
  await page.locator(".brand-scene[data-rendered]").waitFor();
  await page.locator(".brand-scene").evaluate((element) => {
    element.style.width = "900px";
    element.style.height = "900px";
  });
  await page.waitForFunction(
    () => document.querySelector(".brand-canvas")?.width === 900,
  );
  const render = await page
    .locator(".brand-canvas")
    .evaluate((canvas) => canvas.toDataURL("image/png"));
  await mkdir("public/images", { recursive: true });
  await writeFile(
    "public/images/brand-object.png",
    Buffer.from(render.split(",")[1], "base64"),
  );
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(`<!doctype html><html lang="en"><head><style>
    @font-face{font-family:Manrope;src:url('${baseURL}/fonts/manrope-latin-variable.woff2')}
    @font-face{font-family:Newsreader;src:url('${baseURL}/fonts/newsreader-latin-italic-variable.woff2');font-style:italic}
    *{box-sizing:border-box}body{margin:0;background:#f5f3ed;color:#242622;font-family:Manrope,sans-serif;padding:54px 64px}
    .brand{font-size:25px;font-weight:650;letter-spacing:-1px}h1{font-size:86px;line-height:1.05;font-weight:500;letter-spacing:-6px;margin:96px 0 35px;position:relative;z-index:1}em{font-family:Newsreader,serif;color:#b7432a;font-size:100px;font-weight:450;letter-spacing:-5px}
    p{font-size:19px;line-height:1.7;position:relative;z-index:1}img{position:absolute;right:-12px;top:45px;width:590px;height:590px}footer{position:absolute;bottom:40px;font-size:15px}
    </style></head><body><div class="brand">AppSolves.</div><h1>Deep thinking.<br><em>Real things.</em></h1><p>Kaan Gönüldinc<br>AI systems, compilers & software products.</p><img src="${render}" alt=""><footer>appsolves.dev</footer></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "public/social-preview.png" });
  console.log(
    "Rendered brand-object.png (900 × 900) and social-preview.png (1200 × 630).",
  );
} finally {
  await browser.close();
}
