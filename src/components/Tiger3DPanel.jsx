// src/components/Tiger3DPanel.jsx
import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

function PlaceholderBox() {
  const ref = useRef();
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
      ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.5) * 0.03;
    }
  });
  return (
    <mesh ref={ref} position={[0, -0.4, 0]}>
      <boxGeometry args={[1.6, 0.9, 0.8]} />
      <meshStandardMaterial color={"#FF9E2C"} />
    </mesh>
  );
}

function ModelRenderer({ model }) {
  const group = useRef();
  useEffect(() => {
    if (!group.current || !model?.scene) return;
    const obj = group.current;
    obj.clear();
    obj.add(model.scene);
    const box = new THREE.Box3().setFromObject(model.scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = (2.2 / maxDim);
    obj.scale.setScalar(scale);
    obj.position.set(-center.x * scale, -center.y * scale - 0.02, -center.z * scale);
  }, [model]);

  return <group ref={group} />;
}

export default function Tiger3DPanel() {
  const [state, setState] = useState({
    loading: true, error: null, model: null, animNames: [], info: null
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const loader = new GLTFLoader();
        try {
          const draco = new DRACOLoader();
          draco.setDecoderConfig({ type: 'js' });
          loader.setDRACOLoader(draco);
        } catch (dracoErr) {
          console.warn("Draco loader setup failed or not needed", dracoErr);
        }
        const url = "https://threejs.org/examples/models/gltf/Duck/glTF-Binary/Duck.glb";
        loader.load(url, (gltf) => {
          if (cancelled) return;
          const animNames = (gltf.animations || []).map(a => a.name);
          setState(s => ({ ...s, loading: false, model: { scene: gltf.scene, animations: gltf.animations }, animNames, info: 'loaded' }));
        }, undefined, (err) => {
          console.error("[TigerPanel] loader error:", err);
          if (!cancelled) setState(s => ({ ...s, loading: false, error: String(err) }));
        });
      } catch (err) {
        console.error("[TigerPanel] unexpected error:", err);
        if (!cancelled) setState(s => ({ ...s, loading: false, error: String(err) }));
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (state.error) {
    return (
      <div style={{ color: "#fff", background: "#111", padding: 16 }}>
        <h3 style={{ color: "#ffb4b4" }}>Tiger GLB load error</h3>
        <pre style={{ whiteSpace: "pre-wrap", color: "#ddd" }}>{state.error}</pre>
        <div style={{ marginTop: 8 }}><button onClick={() => location.reload()}>Reload</button></div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 360, background: "black", borderRadius: 12, overflow: "hidden" }}>
      <Canvas camera={{ position: [3, 2, 4], fov: 45 }} style={{ background: "black" }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 2]} intensity={1.2} castShadow />
        {state.loading && <PlaceholderBox />}
        {!state.loading && state.model && <ModelRenderer model={state.model} />}
        {!state.loading && !state.model && <PlaceholderBox />}
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.9} />
      </Canvas>
      <div style={{ position: "absolute", right: 12, bottom: 12, color: "#ddd", fontSize: 12 }}>
        {state.loading ? "loading..." : state.model ? `animations: ${state.animNames.join(", ") || "none"}` : "placeholder"}
      </div>
    </div>
  );
}
