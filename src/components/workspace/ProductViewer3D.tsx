'use client';

import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, Box, Cylinder, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { RotateCcw, Lightbulb, Palette } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import type { ProductItem } from '@/types';

// Product colors
const COLORS_3D = [
  { name: 'Jet Black', hex: '#1E293B' },
  { name: 'Off White', hex: '#F8FAFC' },
  { name: 'Indigo', hex: '#6366F1' },
  { name: 'Navy', hex: '#1E3A5F' },
  { name: 'Coral', hex: '#F97316' },
  { name: 'Forest', hex: '#166534' },
  { name: 'Stone', hex: '#78716C' },
  { name: 'Burgundy', hex: '#881337' },
];

interface Props {
  item: ProductItem;
}

export default function ProductViewer3D({ item }: Props) {
  const [productColor, setProductColor] = useState(item.color || '#1E293B');
  const [autoRotate, setAutoRotate] = useState(true);
  const [envPreset, setEnvPreset] = useState<'city' | 'sunset' | 'warehouse'>('city');

  return (
    <div className="h-full flex overflow-hidden">
      {/* 3D Canvas */}
      <div className="flex-1 bg-gradient-to-b from-slate-800 to-slate-900 relative">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true }}
          shadows
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[5, 8, 5]}
              intensity={1.2}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <directionalLight position={[-5, 3, -5]} intensity={0.4} />
            <pointLight position={[0, -3, 3]} intensity={0.5} color="#8B5CF6" />

            {/* Product model */}
            <ProductModel
              item={item}
              color={productColor}
              autoRotate={autoRotate}
            />

            <ContactShadows
              position={[0, -2.2, 0]}
              opacity={0.5}
              scale={10}
              blur={2.5}
              far={4}
            />

            <OrbitControls
              autoRotate={autoRotate}
              autoRotateSpeed={2}
              enableZoom={true}
              enablePan={false}
              minDistance={2.5}
              maxDistance={8}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 1.8}
            />
          </Suspense>
        </Canvas>

        {/* Overlay Labels */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <p className="text-xs text-white font-medium">{item.name}</p>
          </div>
          <div className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <p className="text-[10px] text-white/70">{item.type} · 3D Preview</p>
          </div>
        </div>

        {/* Controls hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <p className="text-[10px] text-white/60 text-center">Drag to rotate · Scroll to zoom</p>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="w-56 bg-white border-l border-slate-100 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <Palette size={14} className="text-slate-400" />
            <p className="text-sm font-semibold text-slate-700">3D Controls</p>
          </div>
        </div>

        <div className="p-4 space-y-5 flex-1">
          {/* Color */}
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2.5">Product Color</p>
            <div className="grid grid-cols-4 gap-2">
              {COLORS_3D.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setProductColor(c.hex)}
                  title={c.name}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className={`w-9 h-9 rounded-xl transition-all ${
                      productColor === c.hex ? 'ring-2 ring-indigo-500 ring-offset-2 scale-110' : 'hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: c.hex,
                      border: c.hex === '#F8FAFC' ? '1px solid #E2E8F0' : 'none',
                    }}
                  />
                  <span className="text-[9px] text-slate-400 truncate w-full text-center">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Auto rotate */}
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2">Rotation</p>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                autoRotate
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  : 'bg-slate-50 text-slate-600 border border-transparent hover:bg-slate-100'
              }`}
            >
              <RotateCcw size={13} />
              {autoRotate ? 'Auto-rotating' : 'Auto-rotate off'}
            </button>
          </div>

          {/* Custom color */}
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2">Custom Color</p>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={productColor}
                onChange={(e) => setProductColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-1"
              />
              <input
                type="text"
                value={productColor}
                onChange={(e) => setProductColor(e.target.value)}
                className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-200"
              />
            </div>
          </div>

          {/* Product info */}
          <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Product Info</p>
            <p className="text-xs text-slate-600 font-medium">{item.name}</p>
            {item.dimensions && (
              <p className="text-[11px] text-slate-400">📐 {item.dimensions}</p>
            )}
            {item.materials && (
              <p className="text-[11px] text-slate-400">🧵 {item.materials.slice(0, 40)}...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 3D Product Models
// ------------------------------------------------------------------
function ProductModel({
  item,
  color,
  autoRotate,
}: {
  item: ProductItem;
  color: string;
  autoRotate: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const threeColor = new THREE.Color(color);

  const isHoodie = item.type === 'Hoodie' || item.type === 'T-Shirt' || item.type === 'Sweatshirt';
  const isNotebook = item.type === 'Notebook' || item.type === 'Planner';
  const isBox = item.type === 'Mailer Box' || item.type === 'Gift Box';
  const isDeskMat = item.type === 'Desk Mat';

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {isHoodie && <HoodieMesh color={threeColor} item={item} />}
      {isNotebook && <NotebookMesh color={threeColor} item={item} />}
      {isBox && <BoxMesh color={threeColor} item={item} />}
      {isDeskMat && <DeskMatMesh color={threeColor} item={item} />}
      {!isHoodie && !isNotebook && !isBox && !isDeskMat && (
        <DefaultProductMesh color={threeColor} item={item} />
      )}
    </group>
  );
}

function HoodieMesh({ color, item }: { color: THREE.Color; item: ProductItem }) {
  const meshRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.85,
    metalness: 0,
  });

  return (
    <group ref={meshRef}>
      {/* Body */}
      <mesh receiveShadow castShadow material={mat}>
        <boxGeometry args={[2.2, 2.6, 0.35]} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-1.55, 0.3, 0]} rotation={[0, 0, 0.15]} receiveShadow castShadow material={mat}>
        <boxGeometry args={[0.85, 1.8, 0.32]} />
      </mesh>
      {/* Right arm */}
      <mesh position={[1.55, 0.3, 0]} rotation={[0, 0, -0.15]} receiveShadow castShadow material={mat}>
        <boxGeometry args={[0.85, 1.8, 0.32]} />
      </mesh>
      {/* Hood */}
      <mesh position={[0, 1.6, -0.05]} receiveShadow castShadow material={mat}>
        <sphereGeometry args={[0.7, 16, 10, 0, Math.PI * 2, 0, Math.PI / 1.5]} />
      </mesh>
      {/* Logo plate */}
      <mesh position={[0, 0.3, 0.18]}>
        <planeGeometry args={[0.8, 0.4]} />
        <meshStandardMaterial color="white" opacity={0.15} transparent />
      </mesh>
    </group>
  );
}

function NotebookMesh({ color, item }: { color: THREE.Color; item: ProductItem }) {
  const coverMat = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0 });
  const pageMat = new THREE.MeshStandardMaterial({ color: new THREE.Color('#F5F5DC'), roughness: 0.9 });
  const spineMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(0.7), roughness: 0.7 });

  return (
    <group rotation={[-0.1, 0.4, 0.05]}>
      {/* Back cover */}
      <mesh position={[0, 0, -0.12]} receiveShadow castShadow material={coverMat}>
        <boxGeometry args={[2, 2.6, 0.06]} />
      </mesh>
      {/* Pages */}
      <mesh position={[0, 0, 0]} receiveShadow material={pageMat}>
        <boxGeometry args={[1.95, 2.55, 0.2]} />
      </mesh>
      {/* Front cover */}
      <mesh position={[0, 0, 0.13]} receiveShadow castShadow material={coverMat}>
        <boxGeometry args={[2, 2.6, 0.06]} />
      </mesh>
      {/* Spine */}
      <mesh position={[-0.98, 0, 0]} receiveShadow material={spineMat}>
        <boxGeometry args={[0.08, 2.6, 0.44]} />
      </mesh>
      {/* Elastic band */}
      <mesh position={[1.0, 0, 0]}>
        <boxGeometry args={[0.04, 2.6, 0.44]} />
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.5)} />
      </mesh>
    </group>
  );
}

function BoxMesh({ color, item }: { color: THREE.Color; item: ProductItem }) {
  return (
    <group rotation={[0.2, 0.6, 0]}>
      {/* Main box */}
      <RoundedBox args={[2.4, 1.4, 1.6]} radius={0.05} smoothness={4} receiveShadow castShadow>
        <meshStandardMaterial color={color} roughness={0.7} metalness={0} />
      </RoundedBox>
      {/* Lid */}
      <RoundedBox args={[2.42, 0.32, 1.62]} radius={0.04} position={[0, 0.86, 0]} receiveShadow castShadow>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.1)} roughness={0.65} />
      </RoundedBox>
      {/* Logo on front */}
      <mesh position={[0, 0, 0.82]}>
        <planeGeometry args={[1.2, 0.5]} />
        <meshStandardMaterial color="white" opacity={0.12} transparent />
      </mesh>
    </group>
  );
}

function DeskMatMesh({ color, item }: { color: THREE.Color; item: ProductItem }) {
  return (
    <group rotation={[-0.3, 0.2, 0]}>
      <mesh receiveShadow castShadow>
        <boxGeometry args={[4, 0.05, 2.5]} />
        <meshStandardMaterial color={color} roughness={0.9} metalness={0} />
      </mesh>
      {/* Stitched border */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[3.8, 0.01, 2.3]} />
        <meshStandardMaterial color="white" opacity={0.1} transparent />
      </mesh>
    </group>
  );
}

function DefaultProductMesh({ color, item }: { color: THREE.Color; item: ProductItem }) {
  return (
    <RoundedBox args={[2, 2, 0.4]} radius={0.15} smoothness={4} receiveShadow castShadow>
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
    </RoundedBox>
  );
}
