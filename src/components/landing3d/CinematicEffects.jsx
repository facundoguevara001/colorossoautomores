import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { GTAOPass } from "three/addons/postprocessing/GTAOPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import { readFacadeDiagnostics } from "./facadeDiagnostics";

// Local postproduction: contact occlusion and antialiasing, without an external runtime.
export default function CinematicEffects({ capture = null }) {
  const { gl, scene, camera, size, invalidate } = useThree();
  const pipeline = useRef();
  useEffect(() => {
    const composer = new EffectComposer(gl);
    composer.setPixelRatio(1);
    composer.renderTarget1.samples = 4;
    composer.renderTarget2.samples = 4;
    const render = new RenderPass(scene, camera);
    const ao = new GTAOPass(scene, camera, 640, 400);
    ao.enabled = readFacadeDiagnostics().ao;
    ao.updateGtaoMaterial({ radius: 0.3, thickness: 0.3, distanceFallOff: 1, samples: 16, scale: 1 });
    ao.updatePdMaterial({ samples: 8, radius: 4 });
    ao.blendIntensity = 0.4;
    const output = new OutputPass();
    const fxaa = new ShaderPass(FXAAShader);
    composer.addPass(render);
    composer.addPass(ao);
    composer.addPass(output);
    composer.addPass(fxaa);
    pipeline.current = { composer, ao, fxaa };
    invalidate();
    return () => {
      pipeline.current = null;
      ao.dispose(); output.dispose(); fxaa.dispose(); composer.dispose();
    };
  }, [gl, scene, camera, invalidate]);
  useEffect(() => {
    if (!pipeline.current) return;
    const { composer, ao, fxaa } = pipeline.current;
    composer.setSize(size.width, size.height);
    ao.setSize(Math.ceil(size.width * 0.65), Math.ceil(size.height * 0.65));
    fxaa.uniforms.resolution.value.set(1 / size.width, 1 / size.height);
    invalidate();
  }, [size.width, size.height, invalidate]);
  useEffect(() => {
    if (!capture) return;
    capture.draw = (progress) => new Promise((resolve) => {
      capture.progress.current = progress;
      capture.pending = resolve;
      invalidate();
    });
    return () => { delete capture.draw; };
  }, [capture, invalidate]);
  useFrame((_, delta) => {
    if (!pipeline.current) return;
    pipeline.current.composer.render(capture ? 1 / 60 : delta);
    if (capture?.pending) {
      gl.getContext().finish();
      const resolve = capture.pending;
      capture.pending = null;
      resolve(gl.domElement.toDataURL("image/png"));
    }
  }, 1);
  return null;
}

