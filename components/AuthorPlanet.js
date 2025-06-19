// components/AuthorPlanet.js
import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Billboard, Stars } from '@react-three/drei';

/* ——— кольцо аватаров ——— */
function AvatarRing({ authors, radius = 6, tilt = 0.5, speed = 0.2, y = 0 }) {
  const group = useRef();
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.elapsedTime * speed;
  });

  return (
    <group ref={group} rotation={[tilt, 0, 0]} position={[0, y, 0]}>
      {authors.map((id, idx) => {
        const angle = (idx / authors.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const texture = useLoader(THREE.TextureLoader, `/collections/${id}/avatar.png`);
        return (
          <Billboard key={id} position={[x, 0, z]}>
            <mesh>
              <circleGeometry args={[1.2, 32]} />
              <meshBasicMaterial map={texture} transparent />
            </mesh>
          </Billboard>
        );
      })}
    </group>
  );
}

/* ——— сама «планета» ——— */
export default function AuthorPlanet({ authors }) {
  /* текстура для ядра */
  const coreTexture = useLoader(THREE.TextureLoader, '/branding/core-texture.png');

  return (
    <Canvas
      style={{ width: '100%', height: 500 }}
      camera={{ position: [0, 3, 12], fov: 50 }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <Stars radius={60} depth={40} count={4000} factor={4} fade />

      {/* ядро-сфера с картинкой */}
      <mesh>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial map={coreTexture} roughness={1} metalness={0} />
      </mesh>

      {/* два орбитальных кольца */}
      <AvatarRing authors={authors} radius={6} tilt={0.45} speed={0.2} />
      <AvatarRing authors={authors} radius={8} tilt={-0.3} speed={0.14} y={-0.5} />

      <OrbitControls enablePan={false} />
    </Canvas>
  );
}