import { expect, test } from "@playwright/test";
import { readFile, stat, readdir } from "node:fs/promises";
import sharp from "sharp";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { MeshoptDecoder } from "meshoptimizer";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

test("brand geometry is unchanged and the cutout is truly transparent", async () => {
  const original = await readFile("assets/sources/mark-original.svg", "utf8");
  const final = await readFile("public/mark.svg", "utf8");
  const contours = (svg: string) =>
    [...svg.matchAll(/\bd="([^"]+)"/g)].map((match) => match[1]);
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
  expect(pixel(36, 145)).toEqual([106, 92, 227, 255]);
  expect((await stat("public/apple-touch-icon.png")).size).toBeLessThan(20_000);
  const ico = await readFile("public/favicon.ico");
  expect(ico.readUInt16LE(2)).toBe(1);
  expect(ico.readUInt16LE(4)).toBe(2);
  expect(ico.length).toBeLessThan(5_000);
});

test("official Fidan derivative and full-resolution phone screen retain source detail", async () => {
  const original = await readFile("assets/sources/fidan/icon-original.png");
  const blob = Buffer.concat([
    Buffer.from(`blob ${original.length}\0`),
    original,
  ]);
  expect(createHash("sha1").update(blob).digest("hex")).toBe(
    "78ad84b20fcc0010fd1a3e119397458e6c2dd8af",
  );
  const logo = await sharp("public/images/fidan-icon.webp").metadata();
  expect([logo.width, logo.height, logo.hasAlpha]).toEqual([256, 256, true]);
  const screen = await sharp("public/images/tagvault-01-1080.webp").metadata();
  const source = await sharp("assets/sources/tagvault-01.jpg").metadata();
  expect([screen.width, screen.height]).toEqual([1080, 2214]);
  expect([screen.width, screen.height]).toEqual([source.width, source.height]);
});

test("phone optimization is reproducible with original geometry and 2048px material detail", async ({
  request,
}, testInfo) => {
  const deployed = await request.get("/models/tagvault-phone.glb");
  expect(deployed.ok()).toBe(true);
  expect(await deployed.body()).toEqual(
    await readFile("public/models/tagvault-phone.glb"),
  );
  const output = testInfo.outputPath("reproduced-phone.glb");
  execFileSync(process.execPath, ["scripts/optimize-phone.mjs", output], {
    timeout: 20000,
  });
  expect(await readFile(output)).toEqual(
    await readFile("public/models/tagvault-phone.glb"),
  );
  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({ "meshopt.decoder": MeshoptDecoder });
  const original = await io.read("assets/sources/tagvault-phone/original.glb");
  const optimized = await io.read(output);
  expect(optimized.getRoot().listMeshes()).toHaveLength(21);
  for (const mesh of original.getRoot().listMeshes()) {
    const actual = optimized
      .getRoot()
      .listMeshes()
      .find((value) => value.getName() === mesh.getName())!;
    expect(actual).toBeDefined();
    expect(actual.listPrimitives()).toHaveLength(mesh.listPrimitives().length);
    for (const [index, primitive] of mesh.listPrimitives().entries()) {
      const result = actual.listPrimitives()[index];
      expect(result.getIndices()!.getCount()).toBe(
        primitive.getIndices()!.getCount(),
      );
      for (const semantic of primitive.listSemantics()) {
        const before = primitive.getAttribute(semantic)!;
        const after = result.getAttribute(semantic)!;
        // Reorder changes vertex order, not the exact attribute values.
        expect(after.getCount()).toBe(before.getCount());
        const rows = (accessor: typeof before) =>
          Array.from({ length: accessor.getCount() }, (_, i) =>
            accessor.getElement(i, []).join(","),
          ).sort();
        expect(rows(after)).toEqual(rows(before));
      }
    }
  }
  for (const texture of optimized.getRoot().listTextures()) {
    expect(texture.getMimeType()).toBe("image/webp");
    const meta = await sharp(texture.getImage()!).metadata();
    expect([meta.width, meta.height]).toEqual([2048, 2048]);
  }
});

test("responsive derivatives decode at their intended widths and retain bounded payloads", async () => {
  for (const name of ["lanepilot-control", "lanepilot-baseline"]) {
    for (const width of [480, 960, 1920])
      for (const format of ["avif", "webp"]) {
        const file = `public/images/${name}-${width}.${format}`;
        expect((await sharp(file).metadata()).width).toBe(width);
        expect((await stat(file)).size).toBeLessThan(100_000);
      }
  }
  expect(
    (await sharp("public/images/tagvault-01-1080.webp").metadata()).width,
  ).toBe(1080);
  expect((await stat("public/images/tagvault-01-1080.webp")).size).toBeLessThan(
    180_000,
  );
  for (const format of ["avif", "webp"]) {
    const poster = await sharp(
      `public/images/tagvault-phone.${format}`,
    ).metadata();
    expect([poster.width, poster.height, poster.hasAlpha]).toEqual([
      1600,
      1600,
      true,
    ]);
    expect(
      (await stat(`public/images/tagvault-phone.${format}`)).size,
    ).toBeLessThan(220_000);
    const { channels } = await sharp(
      `public/images/tagvault-phone.${format}`,
    ).stats();
    expect(channels[3].min).toBe(0);
    expect(channels[3].max).toBe(255);
  }
  for (const theme of ["", "-dark"]) {
    for (const format of ["avif", "webp"]) {
      const poster = sharp(`public/images/brand-object${theme}.${format}`);
      const meta = await poster.metadata();
      expect([meta.width, meta.height, meta.hasAlpha]).toEqual([
        1440,
        1440,
        true,
      ]);
      const { channels } = await poster.stats();
      expect(channels[3].min).toBe(0);
      expect(channels[3].max).toBe(255);
    }
  }
});

test("LanePilot preserves the complete original simulation comparison and each panel", async () => {
  const source = await readFile("assets/sources/lanepilot-simulation.png");
  expect(
    createHash("sha1")
      .update(Buffer.concat([Buffer.from(`blob ${source.length}\0`), source]))
      .digest("hex"),
  ).toBe("674cbc09538b49f8602085705f99cb3304268f21");
  const full = "public/images/lanepilot-simulation-full.webp";
  // Lossless WebP can discard invisible RGB beneath zero-alpha pixels.
  for (const background of ["#ffffff", "#171a17"]) {
    const pixels = (input: string | Buffer) =>
      sharp(input).flatten({ background }).raw().toBuffer();
    const hash = (buffer: Buffer) =>
      createHash("sha256").update(buffer).digest("hex");
    expect(hash(await pixels(full))).toBe(hash(await pixels(source)));
  }
  expect((await stat(full)).size).toBeLessThan(500_000);
  for (const name of ["control", "baseline"])
    for (const format of ["avif", "webp"]) {
      const image = await sharp(
        `public/images/lanepilot-${name}-1920.${format}`,
      ).metadata();
      expect([image.width, image.height]).toEqual([1920, 1508]);
    }
});

test("monochrome Google Play retains the official prism contours", async () => {
  const source = await readFile(
    "assets/sources/google-play-original.svg",
    "utf8",
  );
  const mark = await readFile("public/icons/google-play.svg", "utf8");
  const paths = (svg: string) =>
    [...svg.matchAll(/\bd="([^"]+)"/g)].map((match) => match[1]);
  expect(paths(mark)).toEqual(paths(source));
  expect(mark).toContain('id="mark" stroke="currentColor"');
  expect(mark).not.toMatch(/fill="#[A-Fa-f0-9]+"/);
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
  expect(html).not.toContain("'unsafe-eval'");
  expect(html).toContain("'wasm-unsafe-eval'");
  expect(html).not.toContain("twitter:site");
  for (const path of [
    "mark.svg",
    "favicon.svg",
    "favicon.ico",
    "apple-touch-icon.png",
    "fonts/manrope-latin-variable.woff2",
    "fonts/newsreader-latin-italic-variable.woff2",
    "images/brand-object.avif",
    "images/brand-object.webp",
    "images/brand-object-dark.avif",
    "images/brand-object-dark.webp",
    "images/fidan-icon.webp",
    "images/lanepilot-control-1920.avif",
    "images/lanepilot-baseline-1920.avif",
    "images/lanepilot-simulation-full.webp",
    "images/tagvault-01-1080.webp",
    "images/tagvault-phone.avif",
    "images/tagvault-phone.webp",
    "models/tagvault-phone.glb",
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
  const notFound = await readFile("dist/404.html", "utf8");
  expect(notFound).toContain("<title>Page not found | AppSolves</title>");
  expect(notFound).toContain('content="noindex, follow"');
  expect(notFound).not.toContain('rel="canonical"');
  expect(notFound).not.toContain('property="og:url"');
  expect(html).not.toContain('name="keywords"');
  expect(await readFile("dist/robots.txt", "utf8")).toBe(
    "User-agent: *\nAllow: /\n\nSitemap: https://appsolves.dev/sitemap.xml\n",
  );
});
