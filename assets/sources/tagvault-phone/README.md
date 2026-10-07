# Original TagVault phone

Source: https://github.com/AppSolves/TagVault/tree/e17d6df11a6d1251b6f395c067ef6a82f50b5992/website

The model is website/public/tagvault/iphone16-black-3d-005.glb. PhoneMockup3D.tsx supplies the camera, normalization, screen selection/UV mapping and bounded drag response. Copyright/license from that repository is retained in LICENSE.md. The model has no additional author/license metadata in its glTF asset header; no third-party attribution is invented here.

The owner explicitly authorized reuse. Original binary is preserved here, outside the deployed public directory. Run `node scripts/optimize-phone.mjs` to produce the 2.1 MB public GLB: lossless meshopt compression/reordering, no mesh simplification, all 21 meshes, embedded texture resized and WebP encoded. Runtime uses the existing Three.js dependency and its bundled decoder. It does not preload the model or other TagVault screenshots.
