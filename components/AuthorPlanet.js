// components/AuthorPlanet.js
import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Billboard } from '@react-three/drei';

/* ─── заглушка, если нет PNG ─── */
function fallbackTex() {
  const c = document.createElement('canvas'); c.width = c.height = 2;
  const ctx = c.getContext('2d'); ctx.fillStyle = '#6B4FC8'; ctx.fillRect(0,0,2,2);
  const t = new THREE.Texture(c); t.needsUpdate = true; return t;
}

function useTextures(ids) {
  const urls = useMemo(() => ids.map(id=>`/collections/${id}/avatar.png`), [ids]);
  const loader = useMemo(() => new THREE.TextureLoader(), []);
  return useMemo(() => urls.map(u => loader.load(u, undefined, undefined, () => fallbackTex())), [urls,loader]);
}

function AvatarRing({ ids, r = 6, speed = .2 }) {
  const g = useRef(); useFrame(({clock}) => g.current.rotation.y = clock.elapsedTime*speed);
  const tex = useTextures(ids);
  return (
    <group ref={g}>
      {ids.map((id,i)=>(
        <Billboard key={id} position={[
          Math.cos(i/ids.length*2*Math.PI)*r, 0,
          Math.sin(i/ids.length*2*Math.PI)*r
        ]}>
          <mesh>
            <circleGeometry args={[1.2,32]} />
            <meshBasicMaterial map={tex[i]} transparent/>
          </mesh>
        </Billboard>
      ))}
    </group>
  );
}

export default function AuthorPlanet({ authors }) {
  const core = useMemo(()=>new THREE.TextureLoader().load('/branding/core-texture.png'),[]);
  return (
    <Canvas
      style={{ width:'100%', height:500 }}
      camera={{ position:[0,3,12], fov:50 }}
      gl={{ antialias:false }}             /* ↓ меньше памяти   */
      dpr={[1,1.3]}                        /* ↓ ещё меньше DPR  */
      frameloop="demand"                   /* рисуем только при изменении */
      powerPreference="high-performance"
      onContextLost={e=>e.preventDefault()}
    >
      <ambientLight intensity={.6}/>
      <directionalLight position={[5,5,5]} intensity={.5}/>
      {/* ядро */}
      <mesh>
        <sphereGeometry args={[3,64,64]}/>
        <meshStandardMaterial map={core} roughness={1}/>
      </mesh>
      {/* одно кольцо */}
      <AvatarRing ids={authors.slice(0,30)} r={6}/>
      <OrbitControls enablePan={false}/>
    </Canvas>
  );
}