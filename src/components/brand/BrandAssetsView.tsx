'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Search,
  Copy,
  Check,
  Palette,
  Type,
  Image,
  Star,
  Grid3X3,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import type { Asset } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const BRAND_PALETTE = [
  { hex: '#1e293b', name: 'Midnight' },
  { hex: '#4f46e5', name: 'Indigo' },
  { hex: '#7c3aed', name: 'Violet' },
  { hex: '#ec4899', name: 'Pink' },
  { hex: '#f59e0b', name: 'Amber' },
  { hex: '#10b981', name: 'Emerald' },
  { hex: '#0ea5e9', name: 'Sky' },
  { hex: '#f97316', name: 'Orange' },
];

const ASSET_TYPE_EMOJI: Record<Asset['type'], string> = {
  logo: '🎯',
  graphic: '🎨',
  pattern: '🔷',
  font: 'Aa',
  icon: '⭐',
};

const ASSET_TYPE_GRADIENT: Record<Asset['type'], string> = {
  logo: 'linear-gradient(135deg, #1e293b 0%, #4f46e5 100%)',
  graphic: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
  pattern: 'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)',
  font: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
  icon: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)',
};

const TYPE_FILTERS = ['All', 'Logo', 'Graphic', 'Pattern', 'Font', 'Icon'] as const;
type TypeFilter = (typeof TYPE_FILTERS)[number];

const TYPOGRAPHY_SAMPLES = [
  {
    id: 'font-primary',
    name: 'Inter',
    weight: 'Bold',
    weightValue: 700,
    sample: 'The quick brown fox',
    size: 'text-2xl',
  },
  {
    id: 'font-secondary',
    name: 'Inter',
    weight: 'Medium',
    weightValue: 500,
    sample: 'The quick brown fox jumps',
    size: 'text-xl',
  },
  {
    id: 'font-body',
    name: 'Inter',
    weight: 'Regular',
    weightValue: 400,
    sample: 'The quick brown fox jumps over the lazy dog',
    size: 'text-base',
  },
];

const SPACING_TOKENS = [
  { name: '2xs', value: '4px', size: 4 },
  { name: 'xs', value: '8px', size: 8 },
  { name: 'sm', value: '12px', size: 12 },
  { name: 'md', value: '16px', size: 16 },
  { name: 'lg', value: '24px', size: 24 },
  { name: 'xl', value: '32px', size: 32 },
];

const RADIUS_TOKENS = [
  { name: 'none', value: '0px', radius: 0 },
  { name: 'sm', value: '4px', radius: 4 },
  { name: 'md', value: '8px', radius: 8 },
  { name: 'lg', value: '12px', radius: 12 },
  { name: 'xl', value: '16px', radius: 16 },
  { name: '2xl', value: '24px', radius: 24 },
];

// Placeholder assets shown when the store has fewer than 6
const PLACEHOLDER_ASSETS = [
  { id: 'ph-1', name: 'Upload Logo', type: 'logo' as Asset['type'] },
  { id: 'ph-2', name: 'Upload Graphic', type: 'graphic' as Asset['type'] },
  { id: 'ph-3', name: 'Upload Pattern', type: 'pattern' as Asset['type'] },
  { id: 'ph-4', name: 'Upload Icon', type: 'icon' as Asset['type'] },
  { id: 'ph-5', name: 'Upload Font', type: 'font' as Asset['type'] },
  { id: 'ph-6', name: 'Upload Asset', type: 'graphic' as Asset['type'] },
];

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const stagger = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, delay: i * 0.05 },
});

// ─────────────────────────────────────────────────────────────────────────────
// COLOR SWATCH
// ─────────────────────────────────────────────────────────────────────────────
interface ColorSwatchProps {
  hex: string;
  name: string;
  onCopy: (hex: string) => void;
}

function ColorSwatch({ hex, name, onCopy }: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(hex).catch(() => {});
    setCopied(true);
    onCopy(hex);
    setTimeout(() => setCopied(false), 2000);
  }

  const isLight = (() => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
  })();

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className="flex flex-col items-center gap-2 cursor-pointer group"
      onClick={handleCopy}
      title={`Copy ${hex}`}
    >
      {/* Swatch */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200 relative overflow-hidden"
        style={{ backgroundColor: hex }}
      >
        <AnimatePresence>
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Check
                className="w-5 h-5"
                style={{ color: isLight ? '#000000aa' : '#ffffffaa' }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0 }}
              whileHover={{ opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="group-hover:opacity-100"
            >
              <Copy
                className="w-4 h-4"
                style={{ color: isLight ? '#000000aa' : '#ffffffaa' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Hex + name */}
      <div className="text-center">
        <p className="text-[10px] font-mono text-slate-600 font-medium">{hex}</p>
        <p className="text-[9px] text-slate-400">{name}</p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ASSET CARD (real asset)
// ─────────────────────────────────────────────────────────────────────────────
interface AssetCardProps {
  asset: Asset;
  index: number;
  onUse: (asset: Asset) => void;
}

function AssetCard({ asset, index, onUse }: AssetCardProps) {
  const [hovered, setHovered] = useState(false);
  const emoji = ASSET_TYPE_EMOJI[asset.type];
  const gradient = ASSET_TYPE_GRADIENT[asset.type];
  const isFont = asset.type === 'font';
  const visibleTags = asset.tags.slice(0, 2);

  return (
    <motion.div
      {...stagger(index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 group"
    >
      {/* Preview area */}
      <div
        className="relative flex items-center justify-center"
        style={{ height: 120, background: gradient }}
      >
        <span
          className={`font-bold select-none text-white drop-shadow ${
            isFont ? 'text-3xl' : 'text-4xl'
          }`}
          style={{ fontWeight: isFont ? 700 : undefined }}
        >
          {emoji}
        </span>

        {/* Hover overlay with Use button */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 flex items-center justify-center bg-black/30"
            >
              <button
                onClick={() => onUse(asset)}
                className="flex items-center gap-1.5 bg-white text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors shadow-sm"
              >
                <ExternalLink className="w-3 h-3" />
                Use
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card body */}
      <div className="p-3">
        <p className="text-xs font-semibold text-slate-800 truncate mb-1">{asset.name}</p>
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-[10px] font-medium px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full capitalize">
            {asset.type}
          </span>
          {visibleTags.map((tag) => (
            <span key={tag} className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PLACEHOLDER CARD (upload slot)
// ─────────────────────────────────────────────────────────────────────────────
interface PlaceholderCardProps {
  label: string;
  type: Asset['type'];
  index: number;
  onUpload: () => void;
}

function PlaceholderCard({ label, type, index, onUpload }: PlaceholderCardProps) {
  const gradient = ASSET_TYPE_GRADIENT[type];

  return (
    <motion.div
      {...stagger(index)}
      onClick={onUpload}
      className="bg-white rounded-2xl border border-dashed border-slate-200 overflow-hidden cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all duration-200 group"
    >
      {/* Preview area */}
      <div
        className="relative flex items-center justify-center"
        style={{ height: 120, background: `${gradient}` }}
      >
        <div className="w-full h-full absolute inset-0 opacity-10" style={{ background: gradient }} />
        <div className="flex flex-col items-center gap-1.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Plus className="w-5 h-5 text-white/70" />
          </div>
          <span className="text-[10px] text-white/70 font-medium">Upload</span>
        </div>
      </div>
      <div className="p-3">
        <p className="text-xs font-semibold text-slate-400 truncate">{label}</p>
        <span className="text-[10px] font-medium px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded-full capitalize mt-1 inline-block">
          {type}
        </span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHY CARD
// ─────────────────────────────────────────────────────────────────────────────
interface TypographyCardProps {
  name: string;
  weight: string;
  weightValue: number;
  sample: string;
  size: string;
  index: number;
}

function TypographyCard({ name, weight, weightValue, sample, size, index }: TypographyCardProps) {
  return (
    <motion.div
      {...stagger(index)}
      className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-700">{name}</p>
          <p className="text-xs text-slate-400">{weight} · {weightValue}</p>
        </div>
        <Type className="w-4 h-4 text-slate-300" />
      </div>
      <p
        className={`text-slate-800 leading-snug ${size}`}
        style={{ fontWeight: weightValue }}
      >
        {sample}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <div className="h-px flex-1 bg-slate-100" />
        <span className="text-[10px] font-mono text-slate-400">{name} / {weightValue}</span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPACING TOKEN
// ─────────────────────────────────────────────────────────────────────────────
function SpacingToken({ name, value, size }: { name: string; value: string; size: number }) {
  return (
    <div className="flex flex-col items-start gap-2 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-1.5">
        <div
          className="bg-indigo-500 rounded-sm flex-shrink-0"
          style={{ width: Math.min(size * 3, 48), height: 8 }}
        />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-700">{name}</p>
        <p className="text-[10px] font-mono text-slate-400">{value}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RADIUS TOKEN
// ─────────────────────────────────────────────────────────────────────────────
function RadiusToken({ name, value, radius }: { name: string; value: string; radius: number }) {
  return (
    <div className="flex flex-col items-start gap-2 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
      <div
        className="w-10 h-10 border-2 border-indigo-400 bg-indigo-50"
        style={{ borderRadius: radius }}
      />
      <div>
        <p className="text-xs font-semibold text-slate-700">{name}</p>
        <p className="text-[10px] font-mono text-slate-400">{value}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN BRAND ASSETS VIEW
// ─────────────────────────────────────────────────────────────────────────────
export default function BrandAssetsView() {
  const { assets, addAsset, setNotification, setActiveItem, setCurrentView } = useAppStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');

  // Filtered real assets
  const filteredAssets = useMemo(() => {
    let result = [...assets];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (typeFilter !== 'All') {
      result = result.filter(
        (a) => a.type === typeFilter.toLowerCase()
      );
    }
    return result;
  }, [assets, search, typeFilter]);

  // Ensure at least 6 cards shown (fill with placeholders)
  const displayAssets = filteredAssets;
  const placeholderCount = Math.max(0, 6 - displayAssets.length);
  const placeholders = PLACEHOLDER_ASSETS.slice(0, placeholderCount);

  function handleCopyColor(hex: string) {
    setNotification({ type: 'success', message: `Copied ${hex} to clipboard!` });
  }

  function handleUpload() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        addAsset({
          name: file.name.replace(/\.[^/.]+$/, ''),
          type: file.name.endsWith('.svg') ? 'icon' : 'graphic',
          src: reader.result as string,
          tags: [file.name.split('.').pop() || 'image'],
        });
        setNotification({ type: 'success', message: `Uploaded "${file.name}"` });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  }

  function handleUseAsset(asset: Asset) {
    setNotification({ type: 'info', message: `"${asset.name}" added to workspace` });
    if (useAppStore.getState().activeItemId) {
      setCurrentView('workspace');
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFBFF]">
      <input type="file" ref={fileInputRef} accept="image/*,.svg" multiple onChange={handleFileChange} className="hidden" />
      <div className="max-w-screen-2xl mx-auto px-6 py-6">

        {/* ── Top Bar ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-start justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-0.5">
              Brand Assets
            </h1>
            <p className="text-sm text-slate-500">
              Your logos, graphics, and design elements
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleUpload}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors duration-150 shadow-sm shadow-indigo-200 flex-shrink-0"
          >
            <Upload className="w-4 h-4" />
            Upload Asset
          </motion.button>
        </motion.div>

        {/* ── Color Palette Section ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Palette className="w-4 h-4 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-800">Brand Colors</h2>
            <span className="text-xs text-slate-400 ml-1">Click to copy hex</span>
          </div>
          <div className="flex flex-wrap gap-5">
            {BRAND_PALETTE.map((color) => (
              <ColorSwatch
                key={color.hex}
                hex={color.hex}
                name={color.name}
                onCopy={handleCopyColor}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Filter Row ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="flex flex-wrap items-center gap-3 mb-5"
        >
          {/* Search */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets…"
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors"
            />
          </div>

          {/* Type filter pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {TYPE_FILTERS.map((type) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setTypeFilter(type)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 border"
                style={
                  typeFilter === type
                    ? { backgroundColor: '#6366f1', color: '#fff', borderColor: '#6366f1' }
                    : { backgroundColor: '#fff', color: '#64748b', borderColor: '#e2e8f0' }
                }
              >
                {type}
              </motion.button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-400">
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>{displayAssets.length + placeholders.length} assets</span>
          </div>
        </motion.div>

        {/* ── Asset Grid ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8"
        >
          <AnimatePresence mode="popLayout">
            {displayAssets.map((asset, i) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                index={i}
                onUse={handleUseAsset}
              />
            ))}
            {placeholders.map((ph, i) => (
              <PlaceholderCard
                key={ph.id}
                label={ph.name}
                type={ph.type}
                index={displayAssets.length + i}
                onUpload={handleUpload}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ── Typography Section ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-4 h-4 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-800">Typography</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TYPOGRAPHY_SAMPLES.map((font, i) => (
              <TypographyCard
                key={font.id}
                name={font.name}
                weight={font.weight}
                weightValue={font.weightValue}
                sample={font.sample}
                size={font.size}
                index={i}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Design System Section ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.25 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-800">Design System</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Spacing tokens */}
            <div>
              <p className="text-sm font-semibold text-slate-600 mb-3">Spacing Scale</p>
              <div className="grid grid-cols-3 gap-2.5">
                {SPACING_TOKENS.map((token) => (
                  <SpacingToken
                    key={token.name}
                    name={token.name}
                    value={token.value}
                    size={token.size}
                  />
                ))}
              </div>
            </div>

            {/* Radius tokens */}
            <div>
              <p className="text-sm font-semibold text-slate-600 mb-3">Border Radius</p>
              <div className="grid grid-cols-3 gap-2.5">
                {RADIUS_TOKENS.map((token) => (
                  <RadiusToken
                    key={token.name}
                    name={token.name}
                    value={token.value}
                    radius={token.radius}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
