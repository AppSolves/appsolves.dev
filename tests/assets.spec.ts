import { expect, test } from "@playwright/test";
import { readFile, stat, readdir } from "node:fs/promises";
import sharp from "sharp";

test("brand geometry is unchanged and the cutout is truly transparent", async () => {
  const original = await readFile("assets/sources/mark-original.svg", "utf8");
  const final = await readFile("public/mark.svg", "utf8");
  const contours = (svg: string) =>
    [...svg.matchAll(/d="([^"]+)"/g)].map((match) => match[1]);
  const source = contours(original);
  expect(contours(final)).toEqual([source[0] + source[1], source[2]]);
  expect(final).toContain('fill-rule="evenodd"');
  expect(final).not.toContain("#09090B");
  expect(final.match(/fill="#6A5CE3"/g)).toHaveLength(2);
  expect(await readFile("public/favicon.svg", "utf8")).toBe(final);
  const { data, info } = await sharp("public/apple-touch-icon.png")
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  expect([info.width, info.height]).toEqual([180, 180]);
  const pixel = (x: number, y: number) => [
    ...data.subarray((y * info.width + x) * 4, (y * info.width + x) * 4 + 4),
  ];
  expect(pixel(89, 89)[3]).toBe(0);
  expect(pixel(30, 158)).toEqual([106, 92, 227, 255]);
  expect((await stat("public/apple-touch-icon.png")).size).toBeLessThan(20_000);
  const ico = await readFile("public/favicon.ico");
  expect(ico.readUInt16LE(2)).toBe(1);
  expect(ico.readUInt16LE(4)).toBe(1);
  expect(ico.length).toBeLessThan(5_000);
});

test("responsive derivatives decode at their intended widths and retain bounded payloads", async () => {
  for (const [name, widths] of [
    ["lanepilot", [640, 960, 1288]],
    ["tagvault-01", [320, 540, 800]],
    ["tagvault-02", [320, 540, 800]],
  ] as const) {
    for (const width of widths)
      for (const format of ["avif", "webp"]) {
        const file = `public/images/${name}-${width}.${format}`;
        expect((await sharp(file).metadata()).width).toBe(width);
        expect((await stat(file)).size).toBeLessThan(100_000);
      }
  }
  for (const theme of ["", "-dark"]) {
    const poster = sharp(`public/images/brand-object${theme}.png`);
    const meta = await poster.metadata();
    expect([meta.width, meta.height, meta.hasAlpha]).toEqual([900, 900, true]);
    const { channels } = await poster.stats();
    expect(channels[3].min).toBe(0);
    expect(channels[3].max).toBe(255);
  }
});

test("build artifact contains complete assets and legal entries without original megabyte captures", async () => {
  const html = await readFile("dist/index.html", "utf8");
  const graph = JSON.parse(
    html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1],
  )["@graph"];
  expect(graph.map((entry: { "@type": string }) => entry["@type"])).toEqual([
    "Person",
    "Organization",
  ]);
  expect(graph[1].founder["@id"]).toBe(graph[0]["@id"]);
  expect(html).not.toContain("unsafe-eval");
  expect(html).not.toContain("twitter:site");
  for (const path of [
    "mark.svg",
    "favicon.svg",
    "apple-touch-icon.png",
    "fonts/manrope-latin-variable.woff2",
    "fonts/newsreader-latin-italic-variable.woff2",
    "images/brand-object.png",
    "images/brand-object-dark.png",
    "images/lanepilot-1288.avif",
    "images/tagvault-01-800.webp",
    "privacy_policy/index.html",
    "terms_and_conditions/index.html",
    "CNAME",
    "app-ads.txt",
    "404.html",
    "sitemap.xml",
  ]) {
    expect((await stat(`dist/${path}`)).size).toBeGreaterThan(0);
  }
  expect(
    (await readdir("dist/assets")).some(
      (file) => file.startsWith("brand-scene-") && file.endsWith(".js"),
    ),
  ).toBe(true);
  expect(await readdir("dist/images")).not.toContain("lanepilot-detection.png");
  expect(await readdir("dist")).not.toContain("favicon.png");
});
