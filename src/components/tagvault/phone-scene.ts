import * as THREE from "three";
import {
  Box3,
  Vector3,
  Mesh,
  BufferAttribute,
  type Object3D,
  type BufferGeometry,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";

// Ported from AppSolves/TagVault website/PhoneMockup3D.tsx at e17d6df.
// The original geometry, camera, screen mapping and bounded drag response remain.
export async function mountPhoneScene(
  container: HTMLDivElement,
  signal: AbortSignal,
) {
  const response = await fetch(
    `${import.meta.env.BASE_URL}models/tagvault-phone.glb`,
    { signal },
  );
  if (!response.ok) throw new Error(`Phone model: ${response.status}`);
  const data = await response.arrayBuffer();
  signal.throwIfAborted();
  const gltf = await new GLTFLoader()
    .setMeshoptDecoder(MeshoptDecoder)
    .parseAsync(data, "");
  const phone = gltf.scene;
  const geometry = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  phone.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    geometry.add(object.geometry);
    for (const material of Array.isArray(object.material)
      ? object.material
      : [object.material]) {
      materials.add(material);
      for (const value of Object.values(material))
        if (value instanceof THREE.Texture) textures.add(value);
    }
  });
  const releaseModel = () => {
    geometry.forEach((value) => value.dispose());
    materials.forEach((value) => value.dispose());
    textures.forEach((value) => {
      value.dispose();
      if (value.source.data instanceof ImageBitmap) value.source.data.close();
    });
  };
  let renderer: THREE.WebGLRenderer;
  try {
    signal.throwIfAborted();
    const bounds = new THREE.Box3().setFromObject(phone);
    const size = bounds.getSize(new THREE.Vector3());
    phone.position.sub(bounds.getCenter(new THREE.Vector3()));
    phone.scale.setScalar(2.75 / Math.max(size.x, size.y, size.z));
    phone.updateMatrixWorld(true);
    const screen = findPhoneScreenMesh(phone);
    const screenGeometry = screen.geometry.clone();
    geometry.add(screenGeometry);
    screen.geometry = screenGeometry;
    const generated = !screenGeometry.getAttribute("uv");
    if (generated) generatePlanarUVs(screenGeometry);
    const image = await fetch(
      `${import.meta.env.BASE_URL}images/tagvault-01-540.webp`,
      { signal },
    );
    if (!image.ok) throw new Error(`Phone screen: ${image.status}`);
    const bitmap = await createImageBitmap(await image.blob(), {
      imageOrientation: generated ? "flipY" : "none",
    });
    const texture = new THREE.Texture(bitmap);
    textures.add(texture);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = false; // ImageBitmap orientation is established at decode time.
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    const screenMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      toneMapped: false,
      side: THREE.DoubleSide,
    });
    materials.add(screenMaterial);
    screen.material = screenMaterial;
    screen.visible = true;
    screen.renderOrder = 10;
    signal.throwIfAborted();
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
  } catch (error) {
    releaseModel();
    throw error;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  // Slightly wider than TagVault's hero framing to leave breathing room in this media field.
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  camera.position.set(0, 0.1, 7.35);
  const group = new THREE.Group();
  group.position.set(0, 0.08, 0);
  group.add(phone);
  scene.add(group, new THREE.AmbientLight("#ffffff", 0.95));
  const accent = new THREE.PointLight("#22d3ee", 0.55, 3);
  accent.position.set(0.9, 0.5, 1.4);
  const key = new THREE.PointLight("#ffffff", 0.9, 5);
  key.position.set(-1.4, 1.2, 2.2);
  group.add(accent, key);
  const canvas = renderer.domElement;
  canvas.className = "phone-canvas";
  canvas.setAttribute("aria-hidden", "true");
  container.appendChild(canvas);
  let frame = 0;
  let visible = false;
  let disposed = false;
  let contextLost = false;
  let pointerId: number | undefined;
  let lastX = 0;
  let lastY = 0;
  const interaction = { offsetX: 0, offsetY: 0, velocityX: 0, velocityY: 0 };
  const render = () => {
    frame = 0;
    if (disposed || contextLost || !visible || document.hidden) return;
    if (pointerId === undefined) {
      interaction.offsetX += interaction.velocityX;
      interaction.offsetY += interaction.velocityY;
      interaction.velocityX *= 0.92;
      interaction.velocityY *= 0.92;
      interaction.offsetX *= 0.965;
      interaction.offsetY *= 0.965;
    }
    interaction.offsetX = THREE.MathUtils.clamp(
      interaction.offsetX,
      -0.35,
      0.35,
    );
    interaction.offsetY = THREE.MathUtils.clamp(
      interaction.offsetY,
      -0.55,
      0.55,
    );
    group.rotation.set(
      0.015 + interaction.offsetX,
      interaction.offsetY,
      0.015 - interaction.offsetY * 0.08,
    );
    renderer.render(scene, camera);
    container.dataset.rendered = "true";
    if (
      pointerId === undefined &&
      Object.values(interaction).some((value) => Math.abs(value) > 0.0001)
    )
      requestRender();
  };
  const requestRender = () => {
    if (!frame && visible && !document.hidden && !disposed && !contextLost)
      frame = requestAnimationFrame(render);
  };
  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    requestRender();
  };
  const down = (event: PointerEvent) => {
    if (!event.isPrimary || event.button !== 0 || contextLost) return;
    pointerId = event.pointerId;
    lastX = event.clientX;
    lastY = event.clientY;
    interaction.velocityX = interaction.velocityY = 0;
    container.setPointerCapture(pointerId);
    container.dataset.dragging = "true";
  };
  const move = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;
    interaction.offsetY += dx * 0.0042;
    interaction.offsetX += dy * 0.0034;
    interaction.velocityY = dx * 0.0009;
    interaction.velocityX = dy * 0.0007;
    requestRender();
  };
  const end = () => {
    const captured = pointerId;
    pointerId = undefined;
    delete container.dataset.dragging;
    if (captured !== undefined && container.hasPointerCapture(captured))
      container.releasePointerCapture(captured);
    requestRender();
  };
  const visibility = () => {
    if (document.hidden) {
      end();
      cancelAnimationFrame(frame);
      frame = 0;
    } else requestRender();
  };
  const lost = () => {
    contextLost = true;
    end();
    cancelAnimationFrame(frame);
    frame = 0;
    canvas.hidden = true;
    delete container.dataset.rendered;
  };
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) requestRender();
    else {
      end();
      cancelAnimationFrame(frame);
      frame = 0;
    }
  });
  intersection.observe(container);
  container.addEventListener("pointerdown", down);
  container.addEventListener("pointermove", move);
  container.addEventListener("pointerup", end);
  container.addEventListener("pointercancel", end);
  container.addEventListener("lostpointercapture", end);
  canvas.addEventListener("webglcontextlost", lost);
  document.addEventListener("visibilitychange", visibility);
  resize();
  return () => {
    disposed = true;
    end();
    cancelAnimationFrame(frame);
    observer.disconnect();
    intersection.disconnect();
    container.removeEventListener("pointerdown", down);
    container.removeEventListener("pointermove", move);
    container.removeEventListener("pointerup", end);
    container.removeEventListener("pointercancel", end);
    container.removeEventListener("lostpointercapture", end);
    canvas.removeEventListener("webglcontextlost", lost);
    document.removeEventListener("visibilitychange", visibility);
    releaseModel();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
    delete container.dataset.rendered;
  };
}

// Original TagVault screen-selection and UV helpers follow.

function getMeshLabel(mesh: Mesh) {
  const materials = Array.isArray(mesh.material)
    ? mesh.material
    : [mesh.material];

  const materialNames = materials
    .map((material) => material?.name)
    .filter(Boolean)
    .join(" ");

  return `${mesh.name} ${materialNames}`.trim();
}

function getWorldMeshArea(mesh: Mesh) {
  const box = new Box3().setFromObject(mesh);
  const size = new Vector3();

  box.getSize(size);

  return size.x * size.y;
}

function findPhoneScreenMesh(root: Object3D): Mesh {
  const meshes: Mesh[] = [];

  root.updateMatrixWorld(true);

  root.traverse((object) => {
    if (object instanceof Mesh) {
      meshes.push(object);
    }
  });

  if (meshes.length === 0) {
    throw new Error("The phone GLTF does not contain any meshes.");
  }

  /*
   * Prefer meshes or materials whose names clearly describe
   * the phone display.
   */
  const strongNamePattern = /(screen|display|oled|amoled|lcd|viewport)/i;

  const strongMatches = meshes.filter((mesh) =>
    strongNamePattern.test(getMeshLabel(mesh)),
  );

  if (strongMatches.length > 0) {
    return strongMatches.sort(
      (a, b) => getWorldMeshArea(b) - getWorldMeshArea(a),
    )[0];
  }

  /*
   * Secondary name detection for models that call the front
   * display surface "glass", "panel", or something similar.
   */
  const secondaryNamePattern =
    /(front.?glass|glass.?front|front.?panel|panel.?front)/i;

  const secondaryMatches = meshes.filter((mesh) =>
    secondaryNamePattern.test(getMeshLabel(mesh)),
  );

  if (secondaryMatches.length > 0) {
    return secondaryMatches.sort(
      (a, b) => getWorldMeshArea(b) - getWorldMeshArea(a),
    )[0];
  }

  /*
   * Geometric fallback:
   * Find a large, thin, portrait-shaped surface close to
   * the front of the phone.
   */
  const rootBox = new Box3().setFromObject(root);
  const rootSize = new Vector3();

  rootBox.getSize(rootSize);

  const scoredCandidates = meshes
    .map((mesh) => {
      const box = new Box3().setFromObject(mesh);
      const size = new Vector3();
      const center = new Vector3();

      box.getSize(size);
      box.getCenter(center);

      const widthRatio = size.x / Math.max(rootSize.x, 0.0001);

      const heightRatio = size.y / Math.max(rootSize.y, 0.0001);

      const depthRatio = size.z / Math.max(rootSize.z, 0.0001);

      const aspect = size.x / Math.max(size.y, 0.0001);

      const frontPosition =
        (center.z - rootBox.min.z) / Math.max(rootSize.z, 0.0001);

      const areaRatio =
        (size.x * size.y) / Math.max(rootSize.x * rootSize.y, 0.0001);

      const looksLikeDisplay =
        widthRatio >= 0.5 &&
        widthRatio <= 0.96 &&
        heightRatio >= 0.55 &&
        heightRatio <= 0.99 &&
        aspect >= 0.3 &&
        aspect <= 0.75;

      if (!looksLikeDisplay) {
        return {
          mesh,
          score: Number.NEGATIVE_INFINITY,
        };
      }

      const score =
        areaRatio * 10 +
        frontPosition * 5 -
        depthRatio * 8 -
        Math.abs(aspect - 0.46) * 3;

      return {
        mesh,
        score,
      };
    })
    .filter((candidate) => Number.isFinite(candidate.score))
    .sort((a, b) => b.score - a.score);

  const selected = scoredCandidates[0]?.mesh ?? meshes[0];

  return selected;
}

function generatePlanarUVs(geometry: BufferGeometry) {
  geometry.computeBoundingBox();

  const boundingBox = geometry.boundingBox;

  if (!boundingBox) return;

  const positions = geometry.getAttribute("position") as BufferAttribute;

  const width = Math.max(boundingBox.max.x - boundingBox.min.x, 0.0001);

  const height = Math.max(boundingBox.max.y - boundingBox.min.y, 0.0001);

  const uvs = new Float32Array(positions.count * 2);

  for (let index = 0; index < positions.count; index++) {
    const x = positions.getX(index);
    const y = positions.getY(index);

    uvs[index * 2] = (x - boundingBox.min.x) / width;

    uvs[index * 2 + 1] = (y - boundingBox.min.y) / height;
  }

  geometry.setAttribute("uv", new BufferAttribute(uvs, 2));
}
