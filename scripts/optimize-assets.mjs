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
  `<svg viewBox="540 292 405 420" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path d="${paths[0][1]}${paths[1][1]}" fill="#6A5CE3" fill-rule="evenodd"/>\n  <path d="${paths[2][1]}" fill="#6A5CE3"/>\n</svg>\n`,
);
await writeFile("public/mark.svg", mark);
const projects = [
  {
    name: "lanepilot",
    source: "lanepilot-detection.png",
    widths: [640, 960, 1288],
    // The original perception viewport: identical to the former CSS crop.
    crop: { left: 169, top: 225, width: 1288, height: 720 },
  },
  { name: "tagvault-01", source: "tagvault-01.jpg", widths: [320, 540, 800] },
  { name: "tagvault-02", source: "tagvault-02.jpg", widths: [320, 540, 800] },
];
for (const { name, source, widths, crop } of projects) {
  for (const width of widths) {
    const image = sharp(`assets/sources/${source}`);
    if (crop) image.extract(crop);
    image.resize({ width, withoutEnlargement: true });
    await image
      .clone()
      .avif({ quality: 65, effort: 6, chromaSubsampling: "4:4:4" })
      .toFile(`public/images/${name}-${width}.avif`);
    await image
      .webp({ quality: 88, effort: 6 })
      .toFile(`public/images/${name}-${width}.webp`);
  }
}
await writeFile("public/favicon.svg", mark);
await sharp(mark)
  .resize(180, 180, { fit: "contain" })
  .png()
  .toFile("public/apple-touch-icon.png");
const png = await sharp(mark)
  .resize(32, 32, { fit: "contain" })
  .png()
  .toBuffer();
const ico = Buffer.alloc(22);
ico.writeUInt16LE(1, 2);
ico.writeUInt16LE(1, 4);
ico[6] = ico[7] = 32;
ico.writeUInt16LE(1, 10);
ico.writeUInt16LE(32, 12);
ico.writeUInt32LE(png.length, 14);
ico.writeUInt32LE(22, 18);
await writeFile("public/favicon.ico", Buffer.concat([ico, png]));
console.log(
  "Generated responsive project images and transparent violet brand icons.",
);
