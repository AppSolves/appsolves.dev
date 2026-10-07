import { NodeIO } from "@gltf-transform/core";
import {
  ALL_EXTENSIONS,
  EXTMeshoptCompression,
} from "@gltf-transform/extensions";
import {
  prune,
  dedup,
  reorder,
  textureCompress,
} from "@gltf-transform/functions";
import { MeshoptEncoder, MeshoptDecoder } from "meshoptimizer";
import sharp from "sharp";
import { dirname } from "node:path";
import { mkdir, stat } from "node:fs/promises";

// Original TagVault geometry, lossless mesh compression; no simplification.
await MeshoptEncoder.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    "meshopt.encoder": MeshoptEncoder,
    "meshopt.decoder": MeshoptDecoder,
  });
const document = await io.read("assets/sources/tagvault-phone/original.glb");
const meshCount = document.getRoot().listMeshes().length;
await document.transform(
  prune({ keepAttributes: true, keepIndices: true }),
  dedup(),
  reorder({ encoder: MeshoptEncoder, target: "size" }),
  textureCompress({
    encoder: sharp,
    targetFormat: "webp",
    quality: 95,
    resize: [2048, 2048],
  }),
);
document
  .createExtension(EXTMeshoptCompression)
  .setRequired(true)
  .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });
const output = process.argv[2] || "public/models/tagvault-phone.glb";
await mkdir(dirname(output), { recursive: true });
await io.write(output, document);
if (document.getRoot().listMeshes().length !== meshCount)
  throw new Error("Phone mesh count changed");
console.log({
  meshes: meshCount,
  bytes: (await stat(output)).size,
});
