// components/AuthorPlanet.js
import React, { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Billboard, Stars } from '@react-three/drei';

/* ---------- helper: создаём 1-пиксельную матовую текстуру-заглушку ---------- */
function makeFallbackTexture(colour = '#593CCB') {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 2;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.arc(1, 1, 1, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.Texture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/* ---------- кастом-хук: грузим текстуры с graceful-fallback ---------- */
function useAvatarTextures(ids) {
  const [textures, setTextures] = useState([]);
  const urls = useMemo(() => ids.map(id => `/collections/${id}/avatar.png`), [ids]);

  useEffect(() => {
    let mounted = true;
    const loader = new THREE.TextureLoader();
    Promise.all(
      urls.map(
        url =>
          new Promise(resolve => {
            loader.load(
              url,
              tex => resolve(tex),          // success
              undefined,
              () => resolve(makeFallbackTexture()) // onError → заглушка
            );
          })
      )
    ).then(texArr => {
      if (mounted) setTextures(texArr);
    });
    return () => { mounted = false };
  }, [urls]);

  return textures;
}

/* ---------- кольцо аватаров ---------- */
function AvatarRing({ authors, radius = 6, tilt = 0.5, speed = 0.2, y = 0 }) {
  const group = useRef();
  useFrame(({ clock }) => {
    group.current.rotation.y = clock.elapsedTime * speed;
  });

  const textures = useAvatarTextures(authors);   // ← безопасно

  if (textures.length !== authors.length) return null; // ещё грузится – ничего не рисуем

  return (
    <group ref={group} rotation={[tilt, 0, 0]} position={[0, y, 0]}>
      {authors.map((id, i) => {
        const angle = (i / authors.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <Billboard key={id} position={[x, 0, z]}>
            <mesh>
              <circleGeometry args={[1.25, 32]} />
              <meshBasicMaterial map={textures[i]} transparent />
            </mesh>
          </Billboard>
        );
      })}
    </group>
  );
}

/* ---------- сама «планета» ---------- */
export default function AuthorPlanet({ authors }) {
  const coreTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load('/branding/core-texture.png');
  }, []);

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

      {/* ядро */}
      <mesh>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial map={coreTexture} roughness={1} metalness={0} />
      </mesh>

      {/* кольца */}
      <AvatarRing authors={authors} radius={6} tilt={ 0.45} speed={0.20} />
      <AvatarRing authors={authors} radius={8} tilt={-0.30} speed={0.14} y={-0.5} />

      <OrbitControls enablePan={false} />
    </Canvas>
  );
}