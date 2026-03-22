'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Check } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useAppStore } from '@/store/appStore';
import { generateSKU } from '@/lib/utils';
import type { ProductStatus } from '@/types';

// Full product type catalog with emoji + gradient for visual step
const PRODUCT_TYPES_VISUAL = [
  { id: 'Hoodie',      emoji: '🧥', gradient: 'from-slate-700 to-slate-900',         glow: '#475569' },
  { id: 'T-Shirt',     emoji: '👕', gradient: 'from-indigo-500 to-purple-700',         glow: '#6366F1' },
  { id: 'Sweatshirt',  emoji: '🥋', gradient: 'from-cyan-500 to-teal-600',             glow: '#06B6D4' },
  { id: 'Notebook',    emoji: '📒', gradient: 'from-emerald-500 to-teal-600',          glow: '#10B981' },
  { id: 'Planner',     emoji: '📅', gradient: 'from-amber-400 to-orange-500',          glow: '#F59E0B' },
  { id: 'Poster',      emoji: '🖼️', gradient: 'from-rose-400 to-fuchsia-600',          glow: '#F43F5E' },
  { id: 'Mailer Box',  emoji: '📮', gradient: 'from-sky-500 to-indigo-600',            glow: '#0EA5E9' },
  { id: 'Hang Tag',    emoji: '🏷️', gradient: 'from-stone-500 to-neutral-800',         glow: '#78716C' },
  { id: 'Insert Card', emoji: '💌', gradient: 'from-pink-400 to-rose-500',             glow: '#EC4899' },
  { id: 'Desk Mat',    emoji: '🖥️', gradient: 'from-violet-500 to-indigo-700',         glow: '#8B5CF6' },
  { id: 'Tote Bag',    emoji: '👜', gradient: 'from-lime-500 to-emerald-600',           glow: '#84CC16' },
  { id: 'Sticker',     emoji: '⭐', gradient: 'from-yellow-400 to-amber-500',          glow: '#EAB308' },
  { id: 'Label',       emoji: '🔖', gradient: 'from-indigo-400 to-blue-600',           glow: '#6366F1' },
  { id: 'Gift Box',    emoji: '🎁', gradient: 'from-red-400 to-rose-600',              glow: '#F87171' },
  { id: 'Hat / Cap',   emoji: '🧢', gradient: 'from-sky-600 to-blue-700',              glow: '#0284C7' },
  { id: 'Custom',      emoji: '✨', gradient: 'from-fuchsia-500 via-pink-500 to-orange-400', glow: '#D946EF' },
];

const STATUSES: { id: ProductStatus; label: string; desc: string; color: string }[] = [
  { id: 'idea',            label: 'Idea',           desc: 'Just conceptual',        color: '#9CA3AF' },
  { id: 'designing',       label: 'Designing',      desc: 'Actively working on it', color: '#6366F1' },
  { id: 'sample-ordered',  label: 'Sample Ordered', desc: 'Waiting for sample',     color: '#F59E0B' },
];

const CANVAS_SIZES: Record<string, { w: number; h: number }> = {
  'Hoodie': { w: 500, h: 600 }, 'T-Shirt': { w: 500, h: 600 }, 'Sweatshirt': { w: 500, h: 600 },
  'Notebook': { w: 400, h: 560 }, 'Planner': { w: 420, h: 560 },
  'Poster': { w: 420, h: 560 }, 'Mailer Box': { w: 500, h: 420 }, 'Gift Box': { w: 500, h: 420 },
  'Hang Tag': { w: 300, h: 480 }, 'Insert Card': { w: 420, h: 300 },
  'Desk Mat': { w: 600, h: 260 }, 'Tote Bag': { w: 500, h: 560 },
  'Sticker': { w: 400, h: 400 }, 'Label': { w: 350, h: 200 },
  'Hat / Cap': { w: 500, h: 400 }, 'Custom': { w: 500, h: 600 },
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewItemModal({ isOpen, onClose }: Props) {
  const { categories, addItem, pendingCategoryId, pendingProductType, setNotification } = useAppStore();

  // Multi-step state
  const [step, setStep] = useState<1 | 2>(pendingProductType ? 2 : 1);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(pendingCategoryId || categories[0]?.id || '');
  const [productType, setProductType] = useState(pendingProductType || 'T-Shirt');
  const [status, setStatus] = useState<ProductStatus>('designing');
  const [hoveredType, setHoveredType] = useState<string | null>(null);

  // Sync when modal opens with a pre-picked type from home screen
  useEffect(() => {
    if (isOpen) {
      if (pendingProductType) {
        setProductType(pendingProductType);
        setStep(2);
      } else {
        setStep(1);
      }
      setCategoryId(pendingCategoryId || categories[0]?.id || '');
      setName('');
      setStatus('designing');
    }
  }, [isOpen, pendingProductType, pendingCategoryId, categories]);

  const selectedTypeVisual = PRODUCT_TYPES_VISUAL.find((t) => t.id === productType)
    || PRODUCT_TYPES_VISUAL[0];

  const handleSubmit = () => {
    if (!name.trim() || !categoryId) return;
    const cat = categories.find((c) => c.id === categoryId);
    const sku = generateSKU(cat?.name || 'PRD', name);
    const size = CANVAS_SIZES[productType] || { w: 500, h: 600 };

    addItem({
      name: name.trim(),
      categoryId,
      sku,
      status,
      type: productType,
      tags: [],
      designData: {
        elements: [],
        background: '#FFFFFF',
        width: size.w,
        height: size.h,
        currentView: 'front',
      },
    });
    setNotification({ type: 'success', message: `"${name}" created — let's design!` });
    setName('');
    onClose();
  };

  const handleClose = () => {
    setStep(pendingProductType ? 2 : 1);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="" size="lg">
      <div className="-mt-2">
        <AnimatePresence mode="wait">

          {/* ── STEP 1: PICK PRODUCT TYPE ───────────────────────────────── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-5">
                <h2 className="text-lg font-bold text-slate-900">What are you making?</h2>
                <p className="text-sm text-slate-400 mt-0.5">Choose a product type to get started</p>
              </div>

              {/* Product type grid */}
              <div className="grid grid-cols-4 gap-2.5 mb-6 max-h-72 overflow-y-auto pr-1">
                {PRODUCT_TYPES_VISUAL.map((type) => {
                  const isSelected = productType === type.id;
                  const isHov = hoveredType === type.id;
                  return (
                    <button
                      key={type.id}
                      onMouseEnter={() => setHoveredType(type.id)}
                      onMouseLeave={() => setHoveredType(null)}
                      onClick={() => { setProductType(type.id); setStep(2); }}
                      className="relative group flex flex-col items-center justify-end text-center rounded-xl overflow-hidden transition-all duration-200"
                      style={{
                        aspectRatio: '1 / 1.15',
                        boxShadow: isSelected
                          ? `0 0 0 2px ${selectedTypeVisual.glow}, 0 4px 16px rgba(0,0,0,0.12)`
                          : isHov ? '0 4px 16px rgba(0,0,0,0.10)' : '0 1px 4px rgba(0,0,0,0.06)',
                        transform: isHov || isSelected ? 'translateY(-3px)' : 'none',
                      }}
                    >
                      {/* BG gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient}`} />

                      {/* Check */}
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow">
                          <Check size={11} style={{ color: type.glow }} />
                        </div>
                      )}

                      {/* Emoji */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className="text-3xl drop-shadow transition-transform duration-200"
                          style={{ transform: isHov || isSelected ? 'scale(1.12) translateY(-2px)' : 'scale(1)' }}
                        >
                          {type.emoji}
                        </span>
                      </div>

                      {/* Label */}
                      <div className="relative z-10 w-full pb-2 px-1.5 bg-gradient-to-t from-black/45 to-transparent">
                        <p className="text-white font-semibold text-[10px] leading-tight">{type.id}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleClose}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-500 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
                >
                  Continue with {productType} <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: NAME + DETAILS ──────────────────────────────────── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25 }}
            >
              {/* Selected type banner */}
              <div
                className={`-mx-6 -mt-2 mb-5 px-6 py-4 bg-gradient-to-r ${selectedTypeVisual.gradient} flex items-center gap-3`}
              >
                <span className="text-3xl drop-shadow">{selectedTypeVisual.emoji}</span>
                <div>
                  <p className="text-white font-bold text-sm">{productType}</p>
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 text-white/70 text-xs hover:text-white transition-colors mt-0.5"
                  >
                    <ArrowLeft size={10} /> Change type
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Name your design
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && name.trim() && handleSubmit()}
                    placeholder={`e.g. Premium ${productType}, Signature Collection...`}
                    className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 text-slate-800 placeholder-slate-400 transition-all font-medium"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setCategoryId(cat.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          categoryId === cat.id
                            ? 'text-white shadow-sm'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent'
                        }`}
                        style={categoryId === cat.id ? { backgroundColor: cat.color } : {}}
                      >
                        <span>{cat.icon}</span>
                        {cat.name}
                        {categoryId === cat.id && <Check size={10} className="text-white/80" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Where are you at?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {STATUSES.map(({ id, label, desc, color }) => (
                      <button
                        key={id}
                        onClick={() => setStatus(id)}
                        className={`flex flex-col items-start p-3 rounded-xl text-left border-2 transition-all ${
                          status === id ? 'shadow-sm' : 'border-transparent bg-slate-50 hover:bg-slate-100'
                        }`}
                        style={status === id ? { borderColor: color, backgroundColor: `${color}14` } : {}}
                      >
                        <div className="w-2.5 h-2.5 rounded-full mb-2" style={{ backgroundColor: color }} />
                        <p className="text-xs font-bold text-slate-800">{label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Design zones hint */}
                <div className="flex items-start gap-3 p-3.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100/80">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles size={15} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-indigo-700">
                      Smart design zones ready for {productType}
                    </p>
                    <p className="text-xs text-indigo-500 mt-0.5 leading-relaxed">
                      Once created, the 2D editor will suggest common placement zones for this product type automatically.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft size={13} /> Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!name.trim() || !categoryId}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-bold rounded-xl shadow-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Sparkles size={14} />
                    Create & Start Designing
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
