import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const MAX_DPR = 1.5;
const SETTLE_THRESHOLD = 0.0001;

export async function mountBrandScene(
  container: HTMLDivElement,
  signal: AbortSignal,
  dark: boolean,
) {
  const response = await fetch(`${import.meta.env.BASE_URL}mark.svg`, {
    signal,
  });
  if (!response.ok) throw new Error(`Brand asset: ${response.status}`);
  const source = await response.text();
  signal.throwIfAborted();
  const svg = new SVGLoader().parse(source);
  // The official compound SVG uses evenodd. Preserve its exact two contours.
  const outer = new THREE.Shape();
  outer.curves = svg.paths[0].subPaths[0].curves;
  outer.holes.push(svg.paths[0].subPaths[1]);
  const shapes = [outer];
  const signatureShapes = svg.paths[1].toShapes();
  // Normalize the original mark before extrusion so bevels have physical dimensions.
  const normalized = new Set<THREE.Vector2>();
  for (const shape of [...shapes, ...signatureShapes]) {
    for (const path of [shape, ...shape.holes]) {
      for (const curve of path.curves) {
        for (const key of ["v0", "v1", "v2", "v3"] as const) {
          const point = (curve as unknown as Record<string, THREE.Vector2>)[
            key
          ];
          if (point && !normalized.has(point)) {
            normalized.add(point);
            point.x = (point.x - 747) / 115;
            point.y = -(point.y - 506) / 115;
          }
        }
      }
    }
  }
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_DPR));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = dark ? 1.05 : 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-3, 3, 3, -3, 0.1, 40);
  camera.position.set(0, 1.2, 12);
  camera.lookAt(0, 0, 0);
  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentMap = pmrem.fromScene(environment, 0.04);
  scene.environment = environmentMap.texture;
  environment.dispose();
  pmrem.dispose();
  const extrusion = {
    depth: 0.42,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 1,
    bevelSize: 0.055,
    bevelThickness: 0.055,
    curveSegments: 24,
  };
  const geometry = new THREE.ExtrudeGeometry(shapes, extrusion);
  geometry.translate(0, 0, -0.21);
  const face = new THREE.MeshPhysicalMaterial({
    color: "#6a5ce3",
    metalness: 0.42,
    roughness: 0.28,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
  });
  const edge = new THREE.MeshStandardMaterial({
    color: "#b5b6ab",
    metalness: 0.98,
    roughness: 0.2,
  });
  const object = new THREE.Mesh(geometry, [face, edge]);
  object.rotation.set(-0.2, -0.38, -0.09);
  object.castShadow = true;
  const signatureGeometry = new THREE.ExtrudeGeometry(
    signatureShapes,
    extrusion,
  );
  signatureGeometry.translate(0, 0, -0.21);
  const signature = new THREE.Mesh(signatureGeometry, [face, edge]);
  signature.castShadow = true;
  object.add(signature);
  scene.add(object);
  const key = new THREE.DirectionalLight("#fff3df", 2.8);
  key.position.set(-3, 7, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -5;
  key.shadow.camera.right = 5;
  key.shadow.camera.top = 5;
  key.shadow.camera.bottom = -5;
  key.shadow.normalBias = 0.03;
  key.shadow.radius = 8;
  key.shadow.blurSamples = 12;
  scene.add(key);
  const rim = new THREE.DirectionalLight("#ffffff", 2.5);
  rim.position.set(4, 2, -2);
  scene.add(rim);
  const floorGeometry = new THREE.PlaneGeometry(200, 200);
  const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.12 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -2.25;
  floor.receiveShadow = true;
  scene.add(floor);
  const canvas = renderer.domElement;
  canvas.className = "brand-canvas";
  canvas.setAttribute("aria-hidden", "true");
  container.appendChild(canvas);
  let frame = 0;
  let visible = true;
  let disposed = false;
  let contextLost = false;
  const target = { x: -0.2, y: -0.38 };
  let pointerX = 0;
  let pointerY = 0;
  let scrollProgress = 0;
  const render = () => {
    frame = 0;
    if (disposed || contextLost || !visible || document.hidden) return;
    object.rotation.x = THREE.MathUtils.lerp(object.rotation.x, target.x, 0.12);
    object.rotation.y = THREE.MathUtils.lerp(object.rotation.y, target.y, 0.12);
    renderer.render(scene, camera);
    container.dataset.rendered = "true";
    if (
      Math.abs(object.rotation.x - target.x) +
        Math.abs(object.rotation.y - target.y) >
      SETTLE_THRESHOLD
    )
      frame = requestAnimationFrame(render);
  };
  const requestRender = () => {
    if (!frame && visible && !document.hidden && !disposed && !contextLost)
      frame = requestAnimationFrame(render);
  };
  const updateTarget = () => {
    target.x = -0.2 + pointerY * 0.08;
    target.y = -0.38 + pointerX * 0.08 + scrollProgress * 0.15;
    requestRender();
  };
  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    const aspect = width / height;
    camera.left = -2.65 * aspect;
    camera.right = 2.65 * aspect;
    camera.top = 2.65;
    camera.bottom = -2.65;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    requestRender();
  };
  const pointer = (event: PointerEvent) => {
    const bounds = container.getBoundingClientRect();
    pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    updateTarget();
  };
  const leave = () => {
    pointerX = pointerY = 0;
    updateTarget();
  };
  const scroll = () => {
    if (!visible) return;
    const hero = container.closest(".hero");
    if (hero) {
      const bounds = hero.getBoundingClientRect();
      scrollProgress = Math.min(1, Math.max(0, -bounds.top / bounds.height));
      updateTarget();
    }
  };
  const visibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else requestRender();
  };
  const lostContext = () => {
    contextLost = true;
    cancelAnimationFrame(frame);
    frame = 0;
    canvas.hidden = true;
    delete container.dataset.rendered;
  };
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) {
      scroll();
      requestRender();
    } else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  });
  intersection.observe(container);
  container.addEventListener("pointermove", pointer);
  container.addEventListener("pointerleave", leave);
  window.addEventListener("scroll", scroll, { passive: true });
  document.addEventListener("visibilitychange", visibility);
  canvas.addEventListener("webglcontextlost", lostContext);
  resize();
  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    intersection.disconnect();
    container.removeEventListener("pointermove", pointer);
    container.removeEventListener("pointerleave", leave);
    window.removeEventListener("scroll", scroll);
    document.removeEventListener("visibilitychange", visibility);
    canvas.removeEventListener("webglcontextlost", lostContext);
    geometry.dispose();
    signatureGeometry.dispose();
    face.dispose();
    edge.dispose();
    floorGeometry.dispose();
    floorMaterial.dispose();
    key.shadow.dispose();
    environmentMap.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
    delete container.dataset.rendered;
  };
}
