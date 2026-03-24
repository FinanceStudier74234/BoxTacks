'use client';

import { useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { RotateCcw, Palette, Layers } from 'lucide-react';
import type { ProductItem } from '@/types';

// --------------------------------------------------------------------------
// Color palette
// --------------------------------------------------------------------------
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

type EnvPreset = 'apartment' | 'studio' | 'city';
const ENV_OPTIONS: { label: string; value: EnvPreset }[] = [
  { label: 'Flat', value: 'apartment' },
  { label: 'Studio', value: 'studio' },
  { label: 'Outdoor', value: 'city' },
];

interface Props {
  item: ProductItem;
}

// --------------------------------------------------------------------------
// Main component
// --------------------------------------------------------------------------
export default function ProductViewer3D({ item }: Props) {
  const [productColor, setProductColor] = useState(item.color || '#1E293B');
  const [autoRotate, setAutoRotate] = useState(true);
  const [envPreset, setEnvPreset] = useState<EnvPreset>('apartment');

  return (
    <div className="h-full flex overflow-hidden">
      {/* 3D Canvas */}
      <div className="flex-1 bg-gradient-to-b from-slate-800 to-slate-900 relative">
        <Canvas camera={{ position: [0, 0, 6], fov: 42 }} gl={{ antialias: true }} shadows>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[5, 8, 5]}
              intensity={1.5}
              castShadow
              shadow-mapSize={[2048, 2048]}
            />
            <directionalLight position={[-3, 3, -3]} intensity={0.6} color="#b0c4ff" />
            <pointLight position={[0, -2, 4]} intensity={0.8} color="#ffffff" />
            <spotLight position={[0, 8, 0]} intensity={0.4} angle={0.4} />

            <Environment preset={envPreset} />

            <ProductModel item={item} color={productColor} />

            <ContactShadows
              position={[0, -2.4, 0]}
              opacity={0.55}
              scale={12}
              blur={2.5}
              far={5}
            />

            <OrbitControls
              autoRotate={autoRotate}
              autoRotateSpeed={1.8}
              enableZoom
              enablePan={false}
              minDistance={3}
              maxDistance={9}
              minPolarAngle={Math.PI / 8}
              maxPolarAngle={Math.PI / 1.8}
            />
          </Suspense>
        </Canvas>

        {/* Overlay labels */}
        <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
          <div className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <p className="text-xs text-white font-medium">{item.name}</p>
          </div>
          <div className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <p className="text-[10px] text-white/70">{item.type} · 3D Preview</p>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 pointer-events-none">
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
          {/* Color swatches */}
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
                      productColor === c.hex
                        ? 'ring-2 ring-indigo-500 ring-offset-2 scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: c.hex,
                      border: c.hex === '#F8FAFC' ? '1px solid #E2E8F0' : 'none',
                    }}
                  />
                  <span className="text-[9px] text-slate-400 truncate w-full text-center">
                    {c.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Auto-rotate */}
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

          {/* Surface preset */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Layers size={12} className="text-slate-400" />
              <p className="text-xs font-semibold text-slate-600">Surface</p>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {ENV_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setEnvPreset(opt.value)}
                  className={`px-2 py-2 rounded-lg text-[10px] font-medium transition-all ${
                    envPreset === opt.value
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-slate-50 text-slate-500 border border-transparent hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom color picker */}
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
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Product Info
            </p>
            <p className="text-xs text-slate-600 font-medium">{item.name}</p>
            {item.dimensions && (
              <p className="text-[11px] text-slate-500">Dimensions: {item.dimensions}</p>
            )}
            {item.materials && (
              <p className="text-[11px] text-slate-400">
                {item.materials.length > 50
                  ? item.materials.slice(0, 50) + '...'
                  : item.materials}
              </p>
            )}
            {item.weight && (
              <p className="text-[11px] text-slate-400">Weight: {item.weight}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// ProductModel – dispatches to the right mesh component
// --------------------------------------------------------------------------
function ProductModel({ item, color }: { item: ProductItem; color: string }) {
  const c = new THREE.Color(color);
  const t = item.type;

  return (
    <group position={[0, -0.5, 0]}>
      {(t === 'Hoodie' || t === 'Sweatshirt') && <HoodieMesh color={c} />}
      {t === 'T-Shirt' && <TShirtMesh color={c} />}
      {(t === 'Notebook' || t === 'Planner') && <NotebookMesh color={c} />}
      {(t === 'Mailer Box' || t === 'Gift Box') && <BoxMesh color={c} />}
      {t === 'Desk Mat' && <DeskMatMesh color={c} />}
      {t === 'Hang Tag' && <HangTagMesh color={c} />}
      {t === 'Card Set' && <CardSetMesh color={c} />}
      {![
        'Hoodie', 'Sweatshirt', 'T-Shirt', 'Notebook', 'Planner',
        'Mailer Box', 'Gift Box', 'Desk Mat', 'Hang Tag', 'Card Set',
      ].includes(t) && <DefaultProductMesh color={c} />}
    </group>
  );
}

// --------------------------------------------------------------------------
// HoodieMesh
// Tapered cylinder sleeves, half-torus hood, kangaroo pocket, ribbed hem/cuffs
// --------------------------------------------------------------------------
function HoodieMesh({ color }: { color: THREE.Color }) {
  const groupRef = useRef<THREE.Group>(null);

  const ribColor  = color.clone().multiplyScalar(0.75);
  const hoodColor = color.clone().multiplyScalar(1.04);
  const pocketColor = color.clone().multiplyScalar(0.92);

  return (
    <group ref={groupRef}>
      {/* Torso */}
      <RoundedBox
        args={[2.4, 2.8, 0.5]}
        radius={0.12}
        smoothness={4}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial
          color={color}
          roughness={0.85}
          metalness={0}
          envMapIntensity={0.2}
        />
      </RoundedBox>

      {/* Left sleeve – tapered cylinder */}
      <mesh position={[-1.55, 0.2, 0]} rotation={[0, 0, 0.3]} receiveShadow castShadow>
        <cylinderGeometry args={[0.28, 0.22, 2.0, 12]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0} envMapIntensity={0.2} />
      </mesh>

      {/* Right sleeve */}
      <mesh position={[1.55, 0.2, 0]} rotation={[0, 0, -0.3]} receiveShadow castShadow>
        <cylinderGeometry args={[0.28, 0.22, 2.0, 12]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0} envMapIntensity={0.2} />
      </mesh>

      {/* Hood – half torus (rolled collar shape) */}
      <mesh position={[0, 1.6, -0.1]} rotation={[-0.3, 0, 0]} receiveShadow castShadow>
        <torusGeometry args={[0.6, 0.28, 8, 24, Math.PI]} />
        <meshStandardMaterial color={hoodColor} roughness={0.85} metalness={0} envMapIntensity={0.2} />
      </mesh>

      {/* Hood back panel */}
      <mesh position={[0, 1.85, -0.36]} rotation={[0.15, 0, 0]} castShadow>
        <boxGeometry args={[1.1, 0.78, 0.22]} />
        <meshStandardMaterial color={hoodColor} roughness={0.85} metalness={0} />
      </mesh>

      {/* Kangaroo pocket */}
      <RoundedBox
        args={[1.2, 0.7, 0.08]}
        radius={0.06}
        smoothness={4}
        position={[0, -0.6, 0.28]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial color={pocketColor} roughness={0.88} metalness={0} />
      </RoundedBox>

      {/* Pocket top seam */}
      <mesh position={[0, -0.25, 0.33]}>
        <boxGeometry args={[1.22, 0.014, 0.012]} />
        <meshStandardMaterial color={ribColor} roughness={0.95} />
      </mesh>

      {/* Ribbed hem band */}
      <mesh position={[0, -1.55, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.25, 1.25, 0.2, 16]} />
        <meshStandardMaterial color={ribColor} roughness={0.9} metalness={0} />
      </mesh>

      {/* Left cuff */}
      <mesh position={[-1.54, -0.82, 0]} rotation={[0, 0, 0.3]} receiveShadow castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.18, 12]} />
        <meshStandardMaterial color={ribColor} roughness={0.9} metalness={0} />
      </mesh>

      {/* Right cuff */}
      <mesh position={[1.54, -0.82, 0]} rotation={[0, 0, -0.3]} receiveShadow castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.18, 12]} />
        <meshStandardMaterial color={ribColor} roughness={0.9} metalness={0} />
      </mesh>

      {/* Zipper pull */}
      <mesh position={[0, 0.1, 0.27]}>
        <boxGeometry args={[0.04, 0.35, 0.04]} />
        <meshStandardMaterial color="#888" roughness={0.4} metalness={0.7} />
      </mesh>
    </group>
  );
}

// --------------------------------------------------------------------------
// TShirtMesh
// Shorter sleeves, crew collar, no pocket/hood
// --------------------------------------------------------------------------
function TShirtMesh({ color }: { color: THREE.Color }) {
  const groupRef = useRef<THREE.Group>(null);
  const ribColor = color.clone().multiplyScalar(0.78);

  return (
    <group ref={groupRef}>
      {/* Torso */}
      <RoundedBox args={[2.3, 2.6, 0.45]} radius={0.1} smoothness={4} receiveShadow castShadow>
        <meshStandardMaterial color={color} roughness={0.85} metalness={0} envMapIntensity={0.2} />
      </RoundedBox>

      {/* Left short sleeve */}
      <mesh position={[-1.45, 0.55, 0]} rotation={[0, 0, 0.55]} receiveShadow castShadow>
        <cylinderGeometry args={[0.3, 0.25, 1.3, 12]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0} envMapIntensity={0.2} />
      </mesh>

      {/* Right short sleeve */}
      <mesh position={[1.45, 0.55, 0]} rotation={[0, 0, -0.55]} receiveShadow castShadow>
        <cylinderGeometry args={[0.3, 0.25, 1.3, 12]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0} envMapIntensity={0.2} />
      </mesh>

      {/* Crew neck collar torus */}
      <mesh position={[0, 1.4, 0]} receiveShadow castShadow>
        <torusGeometry args={[0.52, 0.14, 8, 24]} />
        <meshStandardMaterial color={ribColor} roughness={0.9} metalness={0} />
      </mesh>

      {/* Hem band */}
      <mesh position={[0, -1.38, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.18, 16]} />
        <meshStandardMaterial color={ribColor} roughness={0.9} metalness={0} />
      </mesh>

      {/* Left sleeve cuff */}
      <mesh position={[-1.43, 0.0, 0]} rotation={[0, 0, 0.55]} receiveShadow castShadow>
        <cylinderGeometry args={[0.255, 0.255, 0.12, 12]} />
        <meshStandardMaterial color={ribColor} roughness={0.9} metalness={0} />
      </mesh>

      {/* Right sleeve cuff */}
      <mesh position={[1.43, 0.0, 0]} rotation={[0, 0, -0.55]} receiveShadow castShadow>
        <cylinderGeometry args={[0.255, 0.255, 0.12, 12]} />
        <meshStandardMaterial color={ribColor} roughness={0.9} metalness={0} />
      </mesh>

      {/* Chest graphic placeholder */}
      <mesh position={[0, 0.35, 0.24]}>
        <planeGeometry args={[0.9, 0.55]} />
        <meshStandardMaterial color="white" opacity={0.12} transparent roughness={0.6} />
      </mesh>
    </group>
  );
}

// --------------------------------------------------------------------------
// NotebookMesh
// Bookmark ribbon, ruled page-edge lines, embossed logo, elastic band
// --------------------------------------------------------------------------
function NotebookMesh({ color }: { color: THREE.Color }) {
  const spineColor   = color.clone().multiplyScalar(0.7);
  const elasticColor = color.clone().multiplyScalar(0.5);
  const logoHiColor  = color.clone().multiplyScalar(1.3);
  const logoBorderC  = color.clone().multiplyScalar(0.85);
  const foldLineC    = color.clone().multiplyScalar(0.72);

  // Ruled line Y-positions on right page edge
  const lineYs = [-0.9, -0.55, -0.2, 0.15, 0.5, 0.85];

  return (
    <group rotation={[-0.08, 0.45, 0.04]}>
      {/* Back cover */}
      <mesh position={[0, 0, -0.14]} receiveShadow castShadow>
        <boxGeometry args={[2.05, 2.7, 0.07]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0} envMapIntensity={0.15} />
      </mesh>

      {/* Page block */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[2.0, 2.65, 0.22]} />
        <meshStandardMaterial color="#EEE8D5" roughness={0.95} metalness={0} />
      </mesh>

      {/* Ruled lines on fore-edge */}
      {lineYs.map((y, i) => (
        <mesh key={i} position={[1.01, y, 0]}>
          <boxGeometry args={[0.03, 0.04, 0.22]} />
          <meshStandardMaterial color="#C8C0A8" roughness={0.9} />
        </mesh>
      ))}

      {/* Front cover */}
      <mesh position={[0, 0, 0.155]} receiveShadow castShadow>
        <boxGeometry args={[2.05, 2.7, 0.07]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0} envMapIntensity={0.15} />
      </mesh>

      {/* Embossed logo border (behind) */}
      <mesh position={[0, 0.5, 0.197]}>
        <planeGeometry args={[0.95, 0.33]} />
        <meshStandardMaterial color={logoBorderC} roughness={0.55} />
      </mesh>

      {/* Embossed logo face */}
      <mesh position={[0, 0.5, 0.198]}>
        <planeGeometry args={[0.9, 0.28]} />
        <meshStandardMaterial color={logoHiColor} roughness={0.45} metalness={0.08} />
      </mesh>

      {/* Spine */}
      <mesh position={[-1.0, 0, 0]} receiveShadow>
        <boxGeometry args={[0.09, 2.7, 0.48]} />
        <meshStandardMaterial color={spineColor} roughness={0.7} />
      </mesh>

      {/* Elastic band */}
      <mesh position={[1.04, 0, 0]}>
        <boxGeometry args={[0.04, 2.7, 0.48]} />
        <meshStandardMaterial color={elasticColor} roughness={0.6} />
      </mesh>

      {/* Bookmark ribbon body */}
      <mesh position={[0.4, 1.52, 0.06]}>
        <boxGeometry args={[0.1, 0.45, 0.018]} />
        <meshStandardMaterial color="#E74C3C" roughness={0.6} />
      </mesh>

      {/* Bookmark tail notch hint */}
      <mesh position={[0.4, 1.3, 0.06]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.07, 0.07, 0.019]} />
        <meshStandardMaterial color="#C0392B" roughness={0.65} />
      </mesh>
    </group>
  );
}

// --------------------------------------------------------------------------
// BoxMesh
// Lid, fold lines, interior colour, label/logo area
// --------------------------------------------------------------------------
function BoxMesh({ color }: { color: THREE.Color }) {
  const lidColor  = color.clone().multiplyScalar(1.08);
  const foldColor = color.clone().multiplyScalar(0.72);

  return (
    <group rotation={[0.15, 0.55, 0]}>
      {/* Main body */}
      <RoundedBox args={[2.4, 1.5, 1.7]} radius={0.06} smoothness={4} receiveShadow castShadow>
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.05} envMapIntensity={0.25} />
      </RoundedBox>

      {/* Interior floor visible from top */}
      <mesh position={[0, 0.78, 0]}>
        <planeGeometry args={[2.32, 1.62]} />
        <meshStandardMaterial color="#E8DDD0" roughness={0.9} side={THREE.BackSide} />
      </mesh>

      {/* Lid */}
      <RoundedBox
        args={[2.46, 0.34, 1.76]}
        radius={0.05}
        smoothness={4}
        position={[0, 0.94, 0]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial color={lidColor} roughness={0.55} metalness={0.05} envMapIntensity={0.25} />
      </RoundedBox>

      {/* Fold lines – front face */}
      <mesh position={[0, 0.38, 0.86]}>
        <boxGeometry args={[2.38, 0.012, 0.012]} />
        <meshStandardMaterial color={foldColor} roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.38, 0.86]}>
        <boxGeometry args={[2.38, 0.012, 0.012]} />
        <meshStandardMaterial color={foldColor} roughness={0.8} />
      </mesh>

      {/* Fold lines – side face */}
      <mesh position={[1.21, 0.38, 0]}>
        <boxGeometry args={[0.012, 0.012, 1.68]} />
        <meshStandardMaterial color={foldColor} roughness={0.8} />
      </mesh>
      <mesh position={[1.21, -0.38, 0]}>
        <boxGeometry args={[0.012, 0.012, 1.68]} />
        <meshStandardMaterial color={foldColor} roughness={0.8} />
      </mesh>

      {/* Label border */}
      <mesh position={[0, 0, 0.873]}>
        <planeGeometry args={[1.46, 0.7]} />
        <meshStandardMaterial color={foldColor} opacity={0.25} transparent roughness={0.5} />
      </mesh>

      {/* Label face */}
      <mesh position={[0, 0, 0.874]}>
        <planeGeometry args={[1.4, 0.65]} />
        <meshStandardMaterial color="white" opacity={0.14} transparent roughness={0.5} />
      </mesh>
    </group>
  );
}

// --------------------------------------------------------------------------
// DeskMatMesh
// Flat surface, stitched border strips, slight corner-lift hint
// --------------------------------------------------------------------------
function DeskMatMesh({ color }: { color: THREE.Color }) {
  const stitchColor = color.clone().multiplyScalar(0.7);

  return (
    <group rotation={[-0.28, 0.18, 0]}>
      {/* Mat surface */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[4.2, 0.055, 2.7]} />
        <meshStandardMaterial color={color} roughness={0.9} metalness={0} />
      </mesh>

      {/* Stitched border strips */}
      <mesh position={[0, 0.035, 1.25]}>
        <boxGeometry args={[4.2, 0.018, 0.06]} />
        <meshStandardMaterial color={stitchColor} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.035, -1.25]}>
        <boxGeometry args={[4.2, 0.018, 0.06]} />
        <meshStandardMaterial color={stitchColor} roughness={0.85} />
      </mesh>
      <mesh position={[-2.05, 0.035, 0]}>
        <boxGeometry args={[0.06, 0.018, 2.7]} />
        <meshStandardMaterial color={stitchColor} roughness={0.85} />
      </mesh>
      <mesh position={[2.05, 0.035, 0]}>
        <boxGeometry args={[0.06, 0.018, 2.7]} />
        <meshStandardMaterial color={stitchColor} roughness={0.85} />
      </mesh>

      {/* Corner curl suggestion */}
      <mesh position={[1.95, 0.04, 1.2]} rotation={[0.18, 0, 0.12]}>
        <boxGeometry args={[0.35, 0.025, 0.35]} />
        <meshStandardMaterial color={color} roughness={0.88} />
      </mesh>
    </group>
  );
}

// --------------------------------------------------------------------------
// HangTagMesh
// Card with hole, metal eyelet, string loop
// --------------------------------------------------------------------------
function HangTagMesh({ color }: { color: THREE.Color }) {
  const groupRef = useRef<THREE.Group>(null);
  const lineColor = color.clone().multiplyScalar(0.75);

  return (
    <group ref={groupRef} rotation={[0, 0.3, 0.08]}>
      {/* Card body */}
      <RoundedBox
        args={[1.6, 2.4, 0.04]}
        radius={0.1}
        smoothness={4}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial
          color={color}
          roughness={0.65}
          metalness={0}
          envMapIntensity={0.2}
          side={THREE.DoubleSide}
        />
      </RoundedBox>

      {/* Back-face text lines */}
      {[-0.55, -0.25, 0.05, 0.35, 0.65].map((y, i) => (
        <mesh key={i} position={[0, y, -0.024]}>
          <planeGeometry args={[1.1, 0.045]} />
          <meshStandardMaterial color={lineColor} roughness={0.7} />
        </mesh>
      ))}

      {/* Hole – black discs front and back */}
      <mesh position={[0, 1.0, 0.026]}>
        <circleGeometry args={[0.1, 16]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.0, -0.026]}>
        <circleGeometry args={[0.1, 16]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>

      {/* Metal eyelet ring */}
      <mesh position={[0, 1.0, 0]}>
        <torusGeometry args={[0.1, 0.025, 8, 20]} />
        <meshStandardMaterial color="#C0B060" roughness={0.35} metalness={0.75} />
      </mesh>

      {/* String – vertical section */}
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.9, 6]} />
        <meshStandardMaterial color="#D4C8A8" roughness={0.9} />
      </mesh>

      {/* String – loop at top */}
      <mesh position={[0, 2.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.015, 6, 14, Math.PI]} />
        <meshStandardMaterial color="#D4C8A8" roughness={0.9} />
      </mesh>

      {/* Front design area */}
      <mesh position={[0, -0.2, 0.022]}>
        <planeGeometry args={[1.25, 1.2]} />
        <meshStandardMaterial color="white" opacity={0.1} transparent roughness={0.5} />
      </mesh>
    </group>
  );
}

// --------------------------------------------------------------------------
// CardSetMesh
// Stacked fanned cards emerging from a printed sleeve
// --------------------------------------------------------------------------
function CardSetMesh({ color }: { color: THREE.Color }) {
  const groupRef = useRef<THREE.Group>(null);
  const sleeveDark = color.clone().multiplyScalar(0.65);

  const cardOffsets = [
    { x: 0.0,  y: 0.0,  rz: 0.0  },
    { x: 0.06, y: 0.03, rz: 0.04 },
    { x: 0.12, y: 0.07, rz: 0.08 },
    { x: 0.18, y: 0.10, rz: 0.13 },
  ];

  return (
    <group ref={groupRef} rotation={[-0.1, 0.5, 0]}>
      {/* Card sleeve */}
      <RoundedBox
        args={[2.1, 2.9, 0.55]}
        radius={0.07}
        smoothness={4}
        position={[-0.15, -0.05, 0]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial color={color} roughness={0.65} metalness={0.05} envMapIntensity={0.2} />
      </RoundedBox>

      {/* Sleeve top opening line */}
      <mesh position={[-0.15, 1.47, 0]}>
        <boxGeometry args={[2.1, 0.015, 0.56]} />
        <meshStandardMaterial color={sleeveDark} roughness={0.7} />
      </mesh>

      {/* Fanned card stack */}
      {cardOffsets.map((off, i) => (
        <mesh
          key={i}
          position={[-0.15 + off.x, 1.38 + off.y + i * 0.025, 0]}
          rotation={[0, 0, off.rz]}
          receiveShadow
          castShadow
        >
          <boxGeometry args={[1.95, 1.2, 0.045]} />
          <meshStandardMaterial color="#F5F0E8" roughness={0.75} metalness={0} />
        </mesh>
      ))}

      {/* Card stack fore-edge */}
      <mesh position={[0.88, 1.5, 0]}>
        <boxGeometry args={[0.06, 1.0, 0.2]} />
        <meshStandardMaterial color="#E0DAD0" roughness={0.8} />
      </mesh>

      {/* Logo on sleeve front */}
      <mesh position={[-0.15, 0.1, 0.285]}>
        <planeGeometry args={[1.3, 0.7]} />
        <meshStandardMaterial color="white" opacity={0.13} transparent roughness={0.5} />
      </mesh>
    </group>
  );
}

// --------------------------------------------------------------------------
// DefaultProductMesh – fallback
// --------------------------------------------------------------------------
function DefaultProductMesh({ color }: { color: THREE.Color }) {
  return (
    <RoundedBox args={[2, 2, 0.45]} radius={0.14} smoothness={4} receiveShadow castShadow>
      <meshStandardMaterial
        color={color}
        roughness={0.7}
        metalness={0.08}
        envMapIntensity={0.25}
      />
    </RoundedBox>
  );
}
