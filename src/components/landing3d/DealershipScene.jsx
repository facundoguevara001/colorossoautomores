import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, MeshReflectorMaterial, useGLTF, useTexture } from "@react-three/drei";
import { ACESFilmicToneMapping, CatmullRomCurve3, CubeCamera, HalfFloatType, MathUtils, MeshPhysicalMaterial, PCFShadowMap, PMREMGenerator, Shape, Vector3, RepeatWrapping, SRGBColorSpace, WebGLCubeRenderTarget } from "three";
import CinematicEffects from "./CinematicEffects";
import { readFacadeDiagnostics } from "./facadeDiagnostics";

const MODEL_URL = "/models/colorosso-facade-v4.glb?v=20260924-ranger-limited-09";
// Human-height dolly, through the actual opening; no stops or cuts between chapters.
const route = new CatmullRomCurve3([
  new Vector3(29, 5, 20), new Vector3(20, 3.5, 9), new Vector3(14, 2.35, 1),
  new Vector3(11.5, 1.85, -1.5), new Vector3(9.5, 1.80, -4), new Vector3(6.8, 1.65, -10), new Vector3(4.2, 1.55, -15.2),
], false, "centripetal");
const aim = new CatmullRomCurve3([
  new Vector3(8, 2.6, -4), new Vector3(10.5, 2.7, -2), new Vector3(9, 2.2, -4),
  new Vector3(5, 1.9, -8), new Vector3(4, 1.65, -12), new Vector3(2, 1.2, -17), new Vector3(1.1, 1.0, -18.5),
], false, "centripetal");
// Move by travelled distance, keeping the access chapter at 52% of the journey.
// A continuous speed profile slows the dolly as it approaches the hero car.
route.arcLengthDivisions = 600;
const routeLengths = route.getLengths();
const accessDistance = routeLengths[300] / routeLengths[600];
const paceBias = (accessDistance - 0.52) / (0.52 * 0.48);

function CameraRoute({ progress, active, capture }) {
  const smooth = useRef(progress.current);
  const position = useMemo(() => new Vector3(), []);
  const target = useMemo(() => new Vector3(), []);
  const { invalidate, size } = useThree();
  useEffect(() => {
    const wake = () => invalidate();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    document.addEventListener("visibilitychange", wake);
    return () => { window.removeEventListener("scroll", wake); window.removeEventListener("resize", wake); document.removeEventListener("visibilitychange", wake); };
  }, [invalidate]);
  useFrame(({ camera }, delta) => {
    if (!active.current) return;
    const p = capture ? progress.current : MathUtils.damp(smooth.current, progress.current, 7, Math.min(delta, 0.05));
    smooth.current = Math.abs(p - progress.current) < 0.00002 ? progress.current : p;
    const distance = smooth.current + paceBias * smooth.current * (1 - smooth.current);
    const routeTime = route.getUtoTmapping(distance);
    route.getPoint(routeTime, position);
    aim.getPoint(routeTime, target);
    // Portrait needs a more frontal, wider final composition, reached gradually
    // from the same doorway rather than an extreme wide-angle lens.
    if (size.width < 700) {
      const portrait = MathUtils.smoothstep(routeTime, 0.5, 1);
      position.x -= 1.4 * portrait;
      position.z += 3.7 * portrait;
      position.y += 0.10 * portrait;
    }
    const fov = size.width < 700 ? 58 : 43;
    if (camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); }
    camera.position.copy(position);
    camera.lookAt(target);
    if (smooth.current !== progress.current) invalidate();
  });
  return null;
}

function BuildingModel({ onReady }) {
  const { scene } = useGLTF(MODEL_URL);
  const { gl, invalidate } = useThree();
  useEffect(() => {
    const anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    const glass = new MeshPhysicalMaterial({ name: "Reflective showroom glass", color: "#f4f7f6", metalness: 0, roughness: 0.09, transmission: 0.94, thickness: 0.012, ior: 1.5, envMapIntensity: 0.85 });
    const replacements = [];
    const tunedMaterials = new Map();
    scene.traverse((object) => {
      if (!object.isMesh) return;
      object.castShadow = true;
      object.receiveShadow = true;
      if (object.material?.name.startsWith("Reflective showroom glass")) { replacements.push([object, object.material]); object.material = glass; object.castShadow = false; }
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        for (const key of ["map", "normalMap", "roughnessMap"]) if (material[key]) material[key].anisotropy = anisotropy;
        if (material.name.startsWith("Vehicle /") && material.name.includes("tinted glass")) object.castShadow = false;
        if (tunedMaterials.has(material)) return;
        const previous = {};
        const tune = (values) => { for (const [key, value] of Object.entries(values)) { previous[key] = material[key]; material[key] = value; } };
        if (material.name === "Interior / fluorescent diffuser") tune({ emissiveIntensity: 2.2 });
        if (material.name.startsWith("Vehicle /")) {
          if (material.name.includes("Dark Horse matte black paint")) tune({ clearcoat: 0, roughness: 0.78, metalness: 0.08, envMapIntensity: 0.65 });
          else if (material.name.endsWith(" paint")) tune({ clearcoat: 0.85, clearcoatRoughness: 0.16, roughness: 0.28, envMapIntensity: 0.9 });
          // Parked cars: optical lenses should catch light, not glow like headlights.
          if (material.name.includes("daylight optics")) tune({ emissiveIntensity: 0.08 });
          if (material.name.includes("tinted glass")) tune({ roughness: 0.08, metalness: 0, depthWrite: false, envMapIntensity: 0.8 });
        }
        tunedMaterials.set(material, previous);
      });
    });
    invalidate();
    onReady();
    return () => {
      replacements.forEach(([object, material]) => { object.material = material; });
      tunedMaterials.forEach((values, material) => Object.assign(material, values));
      glass.dispose();
    };
  }, [scene, gl, onReady, invalidate]);
  return <primitive object={scene} />;
}

function ExteriorReflections() {
  const { gl, scene, invalidate } = useThree();
  const capture = useRef(null);
  useEffect(() => {
    capture.current = { pending: true, targets: [], materials: [] };
    invalidate();
    return () => {
      const state = capture.current;
      state.materials.forEach(([material, previous]) => { material.envMap = previous; material.needsUpdate = true; });
      state.targets.forEach((target) => target.dispose());
      capture.current = null;
    };
  }, [gl, scene, invalidate]);
  useFrame(() => {
    const state = capture.current;
    if (!state?.pending || !scene.environment) return;
    state.pending = false;
    // Static local probes: street in the glazing, ceiling/lamps in the car paint.
    const cube = new WebGLCubeRenderTarget(gl.domElement.clientWidth < 700 ? 128 : 256, { type: HalfFloatType });
    const camera = new CubeCamera(0.2, 160, cube);
    const pmrem = new PMREMGenerator(gl);
    const glazing = [];
    const vehicles = [];
    scene.traverse((object) => {
      if (object.isMesh) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        if (materials.some((material) => material.name.startsWith("Vehicle /"))) vehicles.push([object, object.visible]);
      }
      if (object.isMesh && (object.material?.name === "Reflective showroom glass" || object.name === "Polished showroom floor")) {
        glazing.push([object, object.visible]); object.visible = false;
      }
    });
    const autoClear = gl.autoClear;
    try {
      gl.autoClear = true;
      for (const [position, matches] of [
        [[13, 2.6, 0], (name) => name === "Reflective showroom glass"],
        [[1.1, 2.25, -18], (name) => name.startsWith("Vehicle /")],
      ]) {
        // Capture the room without the cars: the probe sits near the hero and
        // must not bake that car's own body into its paint reflections.
        if (position[2] < -10) vehicles.forEach(([object]) => { object.visible = false; });
        camera.position.set(...position);
        camera.update(gl, scene);
        const target = pmrem.fromCubemap(cube.texture);
        state.targets.push(target);
        scene.traverse((object) => {
          if (!object.isMesh) return;
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            if (!matches(material.name) || state.materials.some(([m]) => m === material)) return;
            state.materials.push([material, material.envMap]);
            material.envMap = target.texture;
            material.needsUpdate = true;
          });
        });
      }
    } finally {
      glazing.forEach(([object, visible]) => { object.visible = visible; });
      vehicles.forEach(([object, visible]) => { object.visible = visible; });
      gl.autoClear = autoClear;
      cube.dispose();
      pmrem.dispose();
    }
    invalidate();
  });
  return null;
}

function ShowroomFloor() {
  const outline = useMemo(() => new Shape([
    { x: -12.75, y: 0.2 }, { x: 8.8, y: 0.2 }, { x: 12.75, y: 4.15 },
    { x: 12.75, y: 33.9 }, { x: -12.75, y: 33.9 },
  ]), []);
  const source = useTexture("/cinematic/terrazzo.jpg");
  const texture = useMemo(() => {
    const t = source.clone();
    t.wrapS = t.wrapT = RepeatWrapping;
    t.repeat.set(0.5, 0.5);
    t.colorSpace = SRGBColorSpace;
    t.needsUpdate = true;
    return t;
  }, [source]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh name="Polished showroom floor" position={[0, 0.171, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
    <shapeGeometry args={[outline]} />
    <MeshReflectorMaterial map={texture} color="#c9cbc5" resolution={256} blur={[220, 100]} mixBlur={1} mixStrength={0.20} roughness={0.52} metalness={0} mirror={0.07} depthScale={0.15} minDepthThreshold={0.5} maxDepthThreshold={1.4} />
  </mesh>;
}

function ContextGuard({ onError }) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", onError);
    return () => canvas.removeEventListener("webglcontextlost", onError);
  }, [gl, onError]);
  return null;
}

export default function DealershipScene({ progress, active, onReady, onError, capture = null }) {
  const diagnostics = useMemo(readFacadeDiagnostics, []);
  return <div className="dealership-scene" aria-hidden="true" data-facade-revision="09-ranger-limited" data-facade-ao={diagnostics.ao ? "on" : "off"} data-facade-sun-shadow={diagnostics.sunShadow ? "on" : "off"}>
    <Canvas shadows={{ type: PCFShadowMap }} frameloop="demand" camera={{ position: [29, 5, 20], fov: 43, near: 0.08, far: 180 }} dpr={1} gl={{ antialias: true, powerPreference: "high-performance", toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.05 }} fallback={null}>
      <Suspense fallback={null}><color attach="background" args={["#c7d1d5"]} />
      <fog attach="fog" args={["#c7d1d5", 65, 150]} />
      <Environment files="/textures/colorosso-morning.hdr" background backgroundBlurriness={0.08} environmentIntensity={0.45} backgroundIntensity={0.85} environmentRotation={[0, 1.3, 0]} backgroundRotation={[0, 1.3, 0]} />
      <ambientLight intensity={0.10} />
      <hemisphereLight args={["#e2eafa", "#655c50", 0.30]} />
      <directionalLight position={[-14, 19, 16]} intensity={2.1} color="#fff3e4" castShadow={diagnostics.sunShadow} shadow-mapSize={[2048, 2048]} shadow-camera-left={-38} shadow-camera-right={38} shadow-camera-top={30} shadow-camera-bottom={-34} shadow-camera-far={110} shadow-normalBias={0.018} shadow-bias={-0.00015} />
      <rectAreaLight position={[-1, 2.7, -0.5]} width={19} height={2.7} intensity={2.4} color="#e5efff" />
      <rectAreaLight position={[12.6, 2.7, -13]} rotation={[0, Math.PI / 2, 0]} width={18} height={2.7} intensity={2.2} color="#edf4ff" />
      {[-8, 1, 9].flatMap((x) => [8, 25].map((z) => <rectAreaLight key={`${x}-${z}`} position={[x, 4.28, -z]} rotation={[-Math.PI / 2, 0, 0]} width={1.3} height={10} intensity={1.2} color="#e6efff" />))}
      <BuildingModel onReady={onReady} />
      <ExteriorReflections />
      <CameraRoute progress={progress} active={active} capture={capture} />
<ShowroomFloor />
<ContactShadows position={[0, 0.181, -18]} scale={[25, 33]} opacity={0.52} blur={1.5} far={3.2} resolution={512} frames={1} color="#18201b" />
<CinematicEffects capture={capture} />
      <ContextGuard onError={onError} /></Suspense>
    </Canvas>
  </div>;
}




