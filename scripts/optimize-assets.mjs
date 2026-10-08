import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";

await mkdir("public/images", { recursive: true });
const originalMark = await readFile("assets/sources/mark-original.svg", "utf8");
const paths = [
  ...originalMark.matchAll(/<path d="([^"]+)" fill="([^"]+)"\s*\/>/g),
];
if (paths.length !== 3 || paths[1][2] !== "#09090B")
  throw new Error("Unexpected original AppSolves mark");
// Keep every original coordinate; evenodd makes the original inset transparent.
const mark = Buffer.from(
  `<svg viewBox="525 286 440 440" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path d="${paths[0][1]}${paths[1][1]}" fill="#6A5CE3" fill-rule="evenodd"/>\n  <path d="${paths[2][1]}" fill="#6A5CE3"/>\n</svg>\n`,
);
await writeFile("public/mark.svg", mark);
await sharp("assets/sources/tagvault-01.jpg")
  .resize({ width: 1080, withoutEnlargement: true })
  .webp({ quality: 95, effort: 6 })
  .toFile("public/images/tagvault-01-1080.webp");
// Preserve both complete panels, including diagnostics, steps and vehicle counts.
for (const [panel, left] of [
  ["control", 0],
  ["baseline", 1920],
]) {
  for (const width of [480, 960, 1920]) {
    const image = sharp("assets/sources/lanepilot-simulation.png")
      .extract({ left, top: 0, width: 1920, height: 1508 })
      .resize({ width, withoutEnlargement: true });
    for (const format of ["avif", "webp"]) {
      await image
        .clone()
        [format]({ quality: 90, effort: 6, chromaSubsampling: "4:4:4" })
        .toFile(`public/images/lanepilot-${panel}-${width}.${format}`);
    }
  }
}
await sharp("assets/sources/lanepilot-simulation.png")
  .webp({ lossless: true, effort: 6 })
  .toFile("public/images/lanepilot-simulation-full.webp");
const play = await readFile("assets/sources/google-play-original.svg", "utf8");
await writeFile(
  "public/icons/google-play.svg",
  play
    .replace(
      "<g>",
      '<g id="mark" stroke="currentColor" stroke-width="2.7" stroke-linejoin="round">',
    )
    .replace(/fill="#[A-Fa-f0-9]+"/g, 'fill="none"'),
);
await writeFile("public/favicon.svg", mark);
await sharp(mark)
  .resize(180, 180, { fit: "contain" })
  .png()
  .toFile("public/apple-touch-icon.png");
const pngs = await Promise.all(
  [16, 32].map((size) => sharp(mark).resize(size, size).png().toBuffer()),
);
const ico = Buffer.alloc(38);
ico.writeUInt16LE(1, 2);
ico.writeUInt16LE(2, 4);
let offset = 38;
for (const [index, png] of pngs.entries()) {
  const entry = 6 + index * 16;
  ico[entry] = ico[entry + 1] = [16, 32][index];
  ico.writeUInt16LE(1, entry + 4);
  ico.writeUInt16LE(32, entry + 6);
  ico.writeUInt32LE(png.length, entry + 8);
  ico.writeUInt32LE(offset, entry + 12);
  offset += png.length;
}
await writeFile("public/favicon.ico", Buffer.concat([ico, ...pngs]));
console.log(
  "Generated responsive project images and transparent violet brand icons.",
);

// Official Fidan artwork; trim transparent margins without altering the mark.
await sharp("assets/sources/fidan/icon-original.png")
  .trim()
  .resize({
    width: 256,
    height: 256,
    fit: "contain",
    background: "#00000000",
    withoutEnlargement: true,
  })
  .webp({ lossless: true, effort: 6 })
  .toFile("public/images/fidan-icon.webp");
