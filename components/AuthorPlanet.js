// components/AuthorPlanet.js
import React from 'react';
import * as THREE from 'three';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

/* ───────── планета без аватаров ───────── */
export default function AuthorPlanet() {
  const coreTexture = useLoader(
    THREE.TextureLoader,
    '/branding/core-texture.png'
  );

  return (
    <Canvas
      style={{ width: '100%', height: 500 }}
      camera={{ position: [0, 3, 12], fov: 50 }}
      dpr={[1, 1.5]}
      powerPreference="high-performance"
      gl={{ preserveDrawingBuffer: true }}
      onContextLost={e => e.preventDefault()}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <Stars radius={60} depth={40} count={4000} factor={4} fade />

      {/* ядро‐сфера */}
      <mesh>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial map={coreTexture} roughness={1} metalness={0} />
      </mesh>

      <OrbitControls enablePan={false} />
    </Canvas>
  );
}