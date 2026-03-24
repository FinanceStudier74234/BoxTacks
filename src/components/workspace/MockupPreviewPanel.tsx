'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, Sliders, Eye } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import type { ProductItem } from '@/types';

// Predefined product color options
const PRODUCT_COLORS = [
  { name: 'Black', hex: '#1E293B' },
  { name: 'White', hex: '#F8FAFC' },
  { name: 'Indigo', hex: '#6366F1' },
  { name: 'Navy', hex: '#1E3A5F' },
  { name: 'Stone', hex: '#78716C' },
  { name: 'Coral', hex: '#F97316' },
  { name: 'Forest', hex: '#166534' },
  { name: 'Burgundy', hex: '#7F1D1D' },
];

interface Props {
  item: ProductItem;
}

export default function MockupPreviewPanel({ item }: Props) {
  const [productColor, setProductColor] = useState(item.color || '#1E293B');
  const [bgStyle, setBgStyle] = useState<'clean' | 'gradient' | 'studio'>('studio');
  const { setNotification } = useAppStore();

  const isApparel = ['Hoodie', 'T-Shirt', 'Sweatshirt', 'Jacket'].includes(item.type);
  const isNotebook = ['Notebook', 'Planner'].includes(item.type);
  const isPackaging = ['Mailer Box', 'Gift Box', 'Hang Tag', 'Insert Card'].includes(item.type);
  const isPoster = item.type === 'Poster';
  const isDeskMat = item.type === 'Desk Mat';

  const bgStyles = {
    clean: 'bg-white',
    gradient: 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50',
    studio: 'bg-gradient-to-b from-slate-100 to-slate-200',
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Preview Area */}
      <div className={`flex-1 flex flex-col items-center justify-center ${bgStyles[bgStyle]} p-8 relative overflow-hidden`}>
        {/* Background decoration */}
        {bgStyle === 'studio' && (
          <>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-white/40" />
              <div
                className="absolute bottom-1/3 left-0 right-0 h-px"
                style={{ boxShadow: '0 0 40px 20px rgba(0,0,0,0.08)' }}
              />
            </div>
          </>
        )}

        {/* Product Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          {isApparel && <ApparelMockup color={productColor} item={item} />}
          {isNotebook && <NotebookMockup color={productColor} item={item} />}
          {isPackaging && <PackagingMockup color={productColor} item={item} />}
          {isPoster && <PosterMockup color={productColor} item={item} />}
          {isDeskMat && <DeskMatMockup color={productColor} item={item} />}
          {!isApparel && !isNotebook && !isPackaging && !isPoster && !isDeskMat && (
            <GenericMockup color={productColor} item={item} />
          )}
        </motion.div>

        {/* Product label */}
        <div className="relative z-10 mt-6 text-center">
          <p className="text-sm font-semibold text-slate-700">{item.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{item.sku} · {item.type}</p>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="w-60 bg-white border-l border-slate-100 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <Eye size={14} className="text-slate-400" />
            <p className="text-sm font-semibold text-slate-700">Mockup Controls</p>
          </div>
        </div>

        <div className="p-4 space-y-5 flex-1">
          {/* Product Color */}
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2.5">Product Color</p>
            <div className="grid grid-cols-4 gap-2">
              {PRODUCT_COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setProductColor(c.hex)}
                  title={c.name}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div
                    className={`w-10 h-10 rounded-xl transition-all ${
                      productColor === c.hex
                        ? 'ring-2 ring-indigo-500 ring-offset-2 scale-105'
                        : 'hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: c.hex,
                      border: c.hex === '#F8FAFC' ? '1px solid #E2E8F0' : 'none',
                    }}
                  />
                  <span className="text-[9px] text-slate-400">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Background */}
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2.5">Background</p>
            <div className="space-y-2">
              {[
                { id: 'clean' as const, label: 'Clean White', desc: 'Product only' },
                { id: 'gradient' as const, label: 'Soft Gradient', desc: 'Brand aesthetic' },
                { id: 'studio' as const, label: 'Studio', desc: 'Professional look' },
              ].map(({ id, label, desc }) => (
                <button
                  key={id}
                  onClick={() => setBgStyle(id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all ${
                    bgStyle === id
                      ? 'bg-indigo-50 border border-indigo-100'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-md flex-shrink-0 border border-slate-200 ${
                      id === 'clean' ? 'bg-white' :
                      id === 'gradient' ? 'bg-gradient-to-br from-indigo-100 to-purple-100' :
                      'bg-gradient-to-b from-slate-200 to-slate-300'
                    }`}
                  />
                  <div>
                    <p className="text-xs font-medium text-slate-700">{label}</p>
                    <p className="text-[10px] text-slate-400">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom color input */}
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
        </div>

        {/* Export */}
        <div className="p-4 border-t border-slate-50 space-y-2">
          <button
            onClick={() => {
              // Export the mockup SVG as PNG
              const svgEl = document.querySelector('.relative.z-10 svg') as SVGSVGElement | null;
              if (svgEl) {
                const svgData = new XMLSerializer().serializeToString(svgEl);
                const canvas = document.createElement('canvas');
                canvas.width = 1200;
                canvas.height = 1600;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.fillStyle = bgStyle === 'clean' ? '#FFFFFF' : bgStyle === 'gradient' ? '#EEF2FF' : '#E2E8F0';
                  ctx.fillRect(0, 0, 1200, 1600);
                  const img = new window.Image();
                  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  img.onload = () => {
                    const scale = Math.min(1000 / img.width, 1400 / img.height);
                    const w = img.width * scale;
                    const h = img.height * scale;
                    ctx.drawImage(img, (1200 - w) / 2, (1600 - h) / 2, w, h);
                    URL.revokeObjectURL(url);
                    const link = document.createElement('a');
                    link.download = `${item.name.replace(/\s+/g, '-').toLowerCase()}-mockup.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                    setNotification({ type: 'success', message: `Exported "${item.name}" mockup` });
                  };
                  img.src = url;
                }
              } else {
                setNotification({ type: 'info', message: 'Could not find mockup to export' });
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold rounded-xl shadow-sm hover:opacity-90 transition-all"
          >
            <Download size={13} />
            Export Mockup
          </button>
          <button
            onClick={() => {
              setProductColor(item.color || '#1E293B');
              setNotification({ type: 'success', message: 'Mockup refreshed' });
            }}
            className="w-full flex items-center justify-center gap-2 py-2 border border-slate-200 text-slate-600 text-xs font-medium rounded-xl hover:bg-slate-50 transition-colors"
          >
            <RefreshCw size={12} />
            Refresh Preview
          </button>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// Mockup Illustrations (SVG-based product silhouettes)
// =====================================================================

function ApparelMockup({ color, item }: { color: string; item: ProductItem }) {
  const isHoodie = item.type === 'Hoodie';
  const textColor = isLightColor(color) ? '#1E293B' : '#FFFFFF';

  return (
    <div className="relative" style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))' }}>
      <svg
        viewBox="0 0 280 320"
        width="280"
        height="320"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* T-shirt / hoodie shape */}
        <path
          d={isHoodie
            ? "M100 20 L60 40 L20 80 L55 95 L55 300 L225 300 L225 95 L260 80 L220 40 L180 20 Q140 45 100 20 Z"
            : "M100 20 L55 40 L20 75 L55 90 L55 300 L225 300 L225 90 L260 75 L225 40 L180 20 Q140 5 100 20 Z"
          }
          fill={color}
          stroke={isLightColor(color) ? '#CBD5E1' : 'transparent'}
          strokeWidth="1"
        />
        {/* Hoodie hood */}
        {isHoodie && (
          <path
            d="M100 20 Q140 70 180 20 Q160 0 140 0 Q120 0 100 20 Z"
            fill={adjustColor(color, -15)}
          />
        )}
        {/* Pocket for hoodie */}
        {isHoodie && (
          <rect
            x="100"
            y="200"
            width="80"
            height="55"
            rx="8"
            fill={adjustColor(color, -10)}
          />
        )}
        {/* Logo/text overlay */}
        <text
          x="140"
          y="155"
          textAnchor="middle"
          fill={textColor}
          fontSize="13"
          fontFamily="Inter, system-ui"
          fontWeight="700"
          opacity="0.8"
        >
          {item.name.slice(0, 12).toUpperCase()}
        </text>
        {/* Small brand mark */}
        <circle cx="140" cy="120" r="18" fill={textColor} opacity="0.15" />
        <text
          x="140"
          y="126"
          textAnchor="middle"
          fill={textColor}
          fontSize="12"
          fontFamily="Inter"
          fontWeight="800"
          opacity="0.6"
        >
          BT
        </text>
      </svg>
    </div>
  );
}

function NotebookMockup({ color, item }: { color: string; item: ProductItem }) {
  const textColor = isLightColor(color) ? '#1E293B' : '#FFFFFF';
  return (
    <div style={{ filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.25)) perspective(600px) rotateY(-8deg)' }}>
      <svg viewBox="0 0 220 290" width="220" height="290">
        {/* Cover */}
        <rect x="20" y="10" width="180" height="270" rx="6" fill={color}
          stroke={isLightColor(color) ? '#CBD5E1' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
        {/* Spine */}
        <rect x="20" y="10" width="18" height="270" rx="3" fill={adjustColor(color, -20)} />
        {/* Lines decoration */}
        {[50, 70, 90].map((y) => (
          <line key={y} x1="50" y1={y} x2="185" y2={y} stroke={textColor} strokeWidth="0.5" opacity="0.15" />
        ))}
        {/* Title */}
        <text x="120" y="150" textAnchor="middle" fill={textColor} fontSize="11" fontFamily="Inter" fontWeight="700" opacity="0.85">
          {item.name.toUpperCase().slice(0, 14)}
        </text>
        {/* Logo mark */}
        <rect x="102" y="110" width="36" height="26" rx="4" fill={textColor} opacity="0.12" />
        <text x="120" y="128" textAnchor="middle" fill={textColor} fontSize="10" fontFamily="Inter" fontWeight="800" opacity="0.7">
          BT
        </text>
        {/* Elastic */}
        <line x1="200" y1="10" x2="200" y2="280" stroke={adjustColor(color, -30)} strokeWidth="3" />
        {/* Ribbon */}
        <rect x="155" y="278" width="6" height="16" fill={textColor} opacity="0.4" />
      </svg>
    </div>
  );
}

function PackagingMockup({ color, item }: { color: string; item: ProductItem }) {
  const textColor = isLightColor(color) ? '#1E293B' : '#FFFFFF';
  const isHangTag = item.type === 'Hang Tag';

  if (isHangTag) {
    return (
      <div style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.3))' }}>
        <svg viewBox="0 0 130 190" width="130" height="190">
          <rect x="15" y="30" width="100" height="150" rx="8" fill={color}
            stroke={isLightColor(color) ? '#CBD5E1' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
          <circle cx="65" cy="30" r="8" fill={adjustColor(color, -20)} />
          <circle cx="65" cy="30" r="4" fill="#E2E8F0" />
          {/* Gold foil effect */}
          <text x="65" y="95" textAnchor="middle" fill={textColor} fontSize="14" fontFamily="Georgia" fontStyle="italic" opacity="0.7">
            {item.name.slice(0, 8)}
          </text>
          <line x1="30" y1="110" x2="100" y2="110" stroke={textColor} strokeWidth="0.5" opacity="0.3" />
          <text x="65" y="130" textAnchor="middle" fill={textColor} fontSize="8" fontFamily="Inter" opacity="0.5">
            {item.sku}
          </text>
          {/* String */}
          <line x1="65" y1="22" x2="65" y2="0" stroke="#78716C" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  return (
    <div style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}>
      <svg viewBox="0 0 280 220" width="280" height="220">
        {/* Box front */}
        <rect x="40" y="50" width="160" height="150" rx="4" fill={color}
          stroke={isLightColor(color) ? '#CBD5E1' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
        {/* Box top */}
        <path d="M40 50 L80 10 L240 10 L200 50 Z" fill={adjustColor(color, 15)} />
        {/* Box right side */}
        <path d="M200 50 L240 10 L240 160 L200 200 Z" fill={adjustColor(color, -20)} />
        {/* Logo */}
        <text x="120" y="135" textAnchor="middle" fill={isLightColor(color) ? '#1E293B' : '#FFFFFF'} fontSize="12" fontFamily="Inter" fontWeight="700" opacity="0.8">
          {item.name.slice(0, 12).toUpperCase()}
        </text>
        <text x="120" y="115" textAnchor="middle" fill={isLightColor(color) ? '#1E293B' : '#FFFFFF'} fontSize="9" fontFamily="Inter" opacity="0.4">
          {item.type.toUpperCase()}
        </text>
      </svg>
    </div>
  );
}

function PosterMockup({ color, item }: { color: string; item: ProductItem }) {
  const textColor = isLightColor(color) ? '#1E293B' : '#FFFFFF';
  return (
    <div style={{ filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.25))' }}>
      <svg viewBox="0 0 220 300" width="220" height="300">
        <rect x="10" y="10" width="200" height="280" rx="4" fill={color}
          stroke={isLightColor(color) ? '#CBD5E1' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
        <rect x="24" y="24" width="172" height="252" rx="2" fill="none"
          stroke={textColor} strokeWidth="0.5" opacity="0.2" />
        <text x="110" y="140" textAnchor="middle" fill={textColor} fontSize="20" fontFamily="Georgia" fontWeight="bold" opacity="0.9">
          {item.name.toUpperCase().slice(0, 10)}
        </text>
        <line x1="50" y1="165" x2="170" y2="165" stroke={textColor} strokeWidth="0.5" opacity="0.3" />
        <text x="110" y="185" textAnchor="middle" fill={textColor} fontSize="9" fontFamily="Inter" opacity="0.5" letterSpacing="3">
          BOXTACKS STUDIO
        </text>
      </svg>
    </div>
  );
}

function DeskMatMockup({ color, item }: { color: string; item: ProductItem }) {
  const textColor = isLightColor(color) ? '#1E293B' : '#FFFFFF';
  return (
    <div style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.2))' }}>
      <svg viewBox="0 0 380 200" width="380" height="200">
        <rect x="10" y="30" width="360" height="140" rx="8" fill={color}
          stroke={isLightColor(color) ? '#CBD5E1' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
        {/* Stitched edge */}
        <rect x="18" y="38" width="344" height="124" rx="5" fill="none"
          stroke={textColor} strokeWidth="1" strokeDasharray="6 4" opacity="0.2" />
        {/* Design area */}
        <text x="190" y="105" textAnchor="middle" fill={textColor} fontSize="18" fontFamily="Inter" fontWeight="800" opacity="0.6">
          {item.name.toUpperCase().slice(0, 12)}
        </text>
      </svg>
    </div>
  );
}

function GenericMockup({ color, item }: { color: string; item: ProductItem }) {
  const textColor = isLightColor(color) ? '#1E293B' : '#FFFFFF';
  return (
    <div style={{ filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.2))' }}>
      <svg viewBox="0 0 240 240" width="240" height="240">
        <rect x="20" y="20" width="200" height="200" rx="20" fill={color}
          stroke={isLightColor(color) ? '#CBD5E1' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
        <text x="120" y="120" textAnchor="middle" dominantBaseline="middle"
          fill={textColor} fontSize="14" fontFamily="Inter" fontWeight="700" opacity="0.8">
          {item.type.toUpperCase()}
        </text>
        <text x="120" y="145" textAnchor="middle"
          fill={textColor} fontSize="11" fontFamily="Inter" opacity="0.5">
          {item.name.slice(0, 16)}
        </text>
      </svg>
    </div>
  );
}

// Color utility functions
function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

function adjustColor(hex: string, amount: number): string {
  const c = hex.replace('#', '');
  const r = Math.min(255, Math.max(0, parseInt(c.substr(0, 2), 16) + amount));
  const g = Math.min(255, Math.max(0, parseInt(c.substr(2, 2), 16) + amount));
  const b = Math.min(255, Math.max(0, parseInt(c.substr(4, 2), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
