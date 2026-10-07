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
  prune(),
  dedup(),
  reorder({ encoder: MeshoptEncoder, target: "size" }),
  textureCompress({
    encoder: sharp,
    targetFormat: "webp",
    quality: 85,
    resize: [1024, 1024],
  }),
);
document
  .createExtension(EXTMeshoptCompression)
  .setRequired(true)
  .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });
await mkdir("public/models", { recursive: true });
await io.write("public/models/tagvault-phone.glb", document);
if (document.getRoot().listMeshes().length !== meshCount)
  throw new Error("Phone mesh count changed");
console.log({
  meshes: meshCount,
  bytes: (await stat("public/models/tagvault-phone.glb")).size,
});
