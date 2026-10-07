import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

// Capture the compositor, never retain the production WebGL drawing buffer.
const baseURL = process.env.PREVIEW_URL || "http://127.0.0.1:8080";
const browser = await chromium.launch({
  executablePath: process.env.BROWSER_PATH || undefined,
});
try {
  await mkdir("public/images", { recursive: true });
  let lightRender;
  for (const theme of ["light", "dark"]) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 1,
    });
    await page.addInitScript(
      (theme) => localStorage.setItem("appsolves-theme", theme),
      theme,
    );
    await page.goto(baseURL);
    await page.locator(`html[data-theme="${theme}"]`).waitFor();
    await page.locator(".brand-scene[data-rendered]").waitFor();
    await page.addStyleTag({
      content: `html,body{background:transparent!important}body{visibility:hidden}.brand-scene{visibility:visible;position:fixed!important;inset:0!important;width:900px!important;height:900px!important;margin:0!important;z-index:1000}.brand-poster{visibility:hidden!important}`,
    });
    await page.waitForFunction(
      () => document.querySelector(".brand-canvas")?.width === 900,
    );
    const render = await page
      .locator(".brand-canvas")
      .screenshot({ omitBackground: true });
    const { channels } = await sharp(render).metadata();
    if (channels !== 4)
      throw new Error("The brand poster must have a transparent background");
    await writeFile(
      `public/images/brand-object${theme === "dark" ? "-dark" : ""}.png`,
      render,
    );
    if (theme === "light") lightRender = render;
    await page.close();
  }
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  // Establish the local origin so the self-hosted fonts load without CORS fallback.
  await page.goto(baseURL);
  await page.setContent(`<!doctype html><html lang="en"><head><style>
    @font-face{font-family:Manrope;src:url('${baseURL}/fonts/manrope-latin-variable.woff2')}
    @font-face{font-family:Newsreader;src:url('${baseURL}/fonts/newsreader-latin-italic-variable.woff2');font-style:italic}
    *{box-sizing:border-box}html,body{margin:0;background:#f5f3ed;color:#242622;font-family:Manrope,sans-serif}body{padding:54px 64px}
    .brand{display:flex;align-items:center;gap:10px;font-size:25px;font-weight:650;letter-spacing:-1px}.brand img{width:30px;height:32px}
    h1{font-size:86px;line-height:1.05;font-weight:500;letter-spacing:-6px;margin:88px 0 35px;position:relative;z-index:1}em{font-family:Newsreader,serif;color:#6a5ce3;font-size:100px;font-weight:450;letter-spacing:-5px}
    p{font-size:19px;line-height:1.7;position:relative;z-index:1}.object{position:absolute;right:-12px;top:45px;width:590px;height:590px}footer{position:absolute;bottom:40px;font-size:15px}
    </style></head><body><div class="brand"><img src="${baseURL}/mark.svg" alt="">AppSolves.</div><h1>Deep thinking.<br><em>Real things.</em></h1><p>Kaan Gönüldinc / AppSolves<br>AI systems, compilers & software products.</p><img class="object" src="data:image/png;base64,${lightRender.toString("base64")}" alt=""><footer>appsolves.dev</footer></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  if (
    !(await page.evaluate(
      () =>
        document.fonts.check("20px Manrope") &&
        document.fonts.check("italic 20px Newsreader"),
    ))
  )
    throw new Error("The social image must use the production typefaces");
  const social = await page.screenshot();
  await sharp(social)
    .png({ compressionLevel: 9 })
    .toFile("public/social-preview.png");
  console.log(
    "Rendered light / dark brand posters and the violet 1200 × 630 social image.",
  );
} finally {
  await browser.close();
}
