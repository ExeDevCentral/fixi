import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mesh2Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.2;
    }
    if (mesh2Ref.current) {
      mesh2Ref.current.rotation.x -= delta * 0.1;
      mesh2Ref.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} color="#22c55e" />

      <Float speed={1.8} rotationIntensity={1.2} floatIntensity={1.5}>
        <mesh ref={meshRef} position={[2.5, 0.5, -2]}>
          <icosahedronGeometry args={[1.5, 2]} />
          <MeshDistortMaterial
            color="#22c55e"
            roughness={0.2}
            metalness={0.8}
            distort={0.35}
            speed={1.5}
            wireframe
          />
        </mesh>
      </Float>

      <Float speed={1.4} rotationIntensity={1} floatIntensity={1.2}>
        <mesh ref={mesh2Ref} position={[-2.8, -0.8, -3]}>
          <torusGeometry args={[1.1, 0.25, 16, 32]} />
          <meshStandardMaterial color="#10b981" roughness={0.1} metalness={0.9} wireframe />
        </mesh>
      </Float>
    </>
  );
}

export const HeroScene3D: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
      <FloatingScene />
    </Canvas>
  );
};

export default HeroScene3D;