'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  ArrowRight,
  Clock,
  Star,
  Sparkles,
  Package,
  CheckCircle,
  Zap,
  Layers,
  BarChart3,
  Factory,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { getRelativeTime } from '@/lib/utils';
import { STATUS_COLOR as STATUS_COLORS, STATUS_LABEL as STATUS_LABELS } from '@/constants/statusConfig';
import type { ProductItem } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT TYPE CATALOG
// ─────────────────────────────────────────────────────────────────────────────
const PRODUCT_TYPES = [
  {
    id: 'Hoodie',
    label: 'Hoodie',
    emoji: '🧥',
    description: 'Fleece & pullover styles',
    gradientFrom: '#1e293b',
    gradientTo: '#0f172a',
    category: 'Apparel',
    badge: 'Popular',
  },
  {
    id: 'T-Shirt',
    label: 'T-Shirt',
    emoji: '👕',
    description: 'Classic & fitted cuts',
    gradientFrom: '#4f46e5',
    gradientTo: '#7c3aed',
    category: 'Apparel',
    badge: 'Best Seller',
  },
  {
    id: 'Notebook',
    label: 'Notebook',
    emoji: '📒',
    description: 'Lined & dotted pages',
    gradientFrom: '#059669',
    gradientTo: '#0d9488',
    category: 'Stationery',
    badge: null,
  },
  {
    id: 'Mailer Box',
    label: 'Mailer Box',
    emoji: '📦',
    description: 'Custom branded shipping',
    gradientFrom: '#0284c7',
    gradientTo: '#6366f1',
    category: 'Packaging',
    badge: null,
  },
  {
    id: 'Hang Tag',
    label: 'Hang Tag',
    emoji: '🏷️',
    description: 'Labels & price tags',
    gradientFrom: '#78716c',
    gradientTo: '#44403c',
    category: 'Packaging',
    badge: null,
  },
  {
    id: 'Poster',
    label: 'Poster',
    emoji: '🖼️',
    description: 'Wall art & prints',
    gradientFrom: '#e11d48',
    gradientTo: '#a855f7',
    category: 'Print',
    badge: null,
  },
  {
    id: 'Planner',
    label: 'Planner',
    emoji: '📅',
    description: 'Daily & weekly layouts',
    gradientFrom: '#d97706',
    gradientTo: '#dc2626',
    category: 'Stationery',
    badge: null,
  },
  {
    id: 'Insert Card',
    label: 'Insert Card',
    emoji: '💌',
    description: 'Thank you & promo cards',
    gradientFrom: '#db2777',
    gradientTo: '#e11d48',
    category: 'Packaging',
    badge: null,
  },
  {
    id: 'Desk Mat',
    label: 'Desk Mat',
    emoji: '🖥️',
    description: 'Large-format surface',
    gradientFrom: '#7c3aed',
    gradientTo: '#4f46e5',
    category: 'Accessories',
    badge: null,
  },
  {
    id: 'Tote Bag',
    label: 'Tote Bag',
    emoji: '👜',
    description: 'Canvas & reusable bags',
    gradientFrom: '#16a34a',
    gradientTo: '#15803d',
    category: 'Accessories',
    badge: null,
  },
  {
    id: 'Sweatshirt',
    label: 'Sweatshirt',
    emoji: '🥋',
    description: 'Crew & zip-up styles',
    gradientFrom: '#0891b2',
    gradientTo: '#0d9488',
    category: 'Apparel',
    badge: null,
  },
  {
    id: 'Custom',
    label: 'Custom',
    emoji: '✨',
    description: 'Start from scratch',
    gradientFrom: '#d946ef',
    gradientTo: '#f97316',
    category: 'Custom',
    badge: 'Blank Canvas',
  },
];

const CATEGORY_FILTERS = ['All', 'Apparel', 'Packaging', 'Stationery', 'Accessories', 'Print'];

const QUICK_PICKS = ['Hoodie', 'T-Shirt', 'Mailer Box', 'Poster', 'Notebook', 'Tote Bag'];

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────
const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────────────────────────────────────
function ProductTypeCard({
  product,
  onSelect,
}: {
  product: (typeof PRODUCT_TYPES)[0];
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={cardVariant}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
      className="relative cursor-pointer rounded-2xl overflow-hidden"
      style={{ aspectRatio: '3 / 4' }}
      animate={{
        scale: hovered ? 1.03 : 1,
        boxShadow: hovered
          ? `0 20px 50px -10px ${product.gradientFrom}88, 0 8px 24px -6px ${product.gradientTo}55`
          : '0 2px 12px 0 rgba(0,0,0,0.08)',
      }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(145deg, ${product.gradientFrom}, ${product.gradientTo})`,
        }}
      />

      {/* Decorative blurred blobs */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-30 blur-2xl"
        style={{ background: product.gradientFrom }}
      />
      <div
        className="absolute -bottom-8 -left-4 w-28 h-28 rounded-full opacity-25 blur-3xl"
        style={{ background: product.gradientTo }}
      />

      {/* Badge top-left */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.22)',
              backdropFilter: 'blur(8px)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            {product.badge === 'Best Seller' ? '⭐ ' : product.badge === 'Popular' ? '🔥 ' : ''}
            {product.badge}
          </span>
        </div>
      )}

      {/* Category pill top-right */}
      <div className="absolute top-3 right-3 z-10">
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: 'rgba(0,0,0,0.28)',
            backdropFilter: 'blur(6px)',
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          {product.category}
        </span>
      </div>

      {/* Emoji centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-[56px] select-none leading-none"
          animate={{ scale: hovered ? 1.15 : 1, rotate: hovered ? 5 : 0 }}
          transition={{ duration: 0.22 }}
        >
          {product.emoji}
        </motion.span>
      </div>

      {/* Bottom gradient overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
          padding: '24px 14px 14px',
        }}
      >
        <p className="text-white font-bold text-sm leading-tight">{product.label}</p>
        <p className="text-white/70 text-[11px] mt-0.5 leading-tight">{product.description}</p>
      </div>

      {/* Hover: "Create" overlay */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 z-20 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)' }}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xl">
                <Plus className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-white font-semibold text-sm">Create</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RECENT DESIGN CARD
// ─────────────────────────────────────────────────────────────────────────────
function RecentCard({ item, onOpen }: { item: ProductItem; onOpen: () => void }) {
  const statusColor = STATUS_COLORS[item.status] || '#94a3b8';
  const statusLabel = STATUS_LABELS[item.status] || item.status;

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 12px 32px -8px rgba(99,102,241,0.18)' }}
      transition={{ duration: 0.2 }}
      onClick={onOpen}
      className="flex-none w-56 cursor-pointer bg-white rounded-xl border border-slate-100 overflow-hidden"
      style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
    >
      {/* Color header */}
      <div
        className="h-24 flex items-center justify-center text-4xl"
        style={{ background: `linear-gradient(135deg, ${statusColor}22, ${statusColor}44)` }}
      >
        {PRODUCT_TYPES.find((p) => p.id === item.type)?.emoji || '📦'}
      </div>
      <div className="p-3">
        <p className="font-semibold text-slate-800 text-sm truncate">{item.name}</p>
        <p className="text-slate-400 text-[11px] mt-0.5">{item.type}</p>
        <div className="flex items-center justify-between mt-2">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${statusColor}22`, color: statusColor }}
          >
            {statusLabel}
          </span>
          <span className="text-slate-400 text-[10px] flex items-center gap-0.5">
            <Clock className="w-3 h-3" />
            {getRelativeTime(item.updatedAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE CARD
// ─────────────────────────────────────────────────────────────────────────────
function TemplateCard({ template }: { template: { id: string; name: string; category: string; description: string; color: string; icon: string; isPremium: boolean } }) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 12px 32px -8px rgba(99,102,241,0.2)' }}
      transition={{ duration: 0.2 }}
      className="flex-none w-48 cursor-pointer bg-white rounded-xl border border-slate-100 overflow-hidden"
      style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
    >
      <div
        className="h-28 flex items-center justify-center text-4xl"
        style={{ background: `${template.color}18` }}
      >
        <span className="text-5xl">{template.icon}</span>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-1">
          <p className="font-semibold text-slate-800 text-sm leading-tight">{template.name}</p>
          {template.isPremium && (
            <span className="flex-none text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600">
              PRO
            </span>
          )}
        </div>
        <p className="text-slate-400 text-[11px] mt-0.5 line-clamp-2">{template.description}</p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardView() {
  const { categories, getAllItems, templates, setActiveItem, openNewItemModal, setCurrentView, setActiveNavTab, isDemoMode } =
    useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const allItems = getAllItems();

  const recentItems = useMemo(
    () =>
      [...allItems]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 8),
    [allItems]
  );

  const filteredProductTypes = useMemo(() => {
    const byCategory =
      activeCategory === 'All'
        ? PRODUCT_TYPES
        : PRODUCT_TYPES.filter((p) => p.category === activeCategory);

    if (!searchQuery.trim()) return byCategory;
    const q = searchQuery.toLowerCase();
    return byCategory.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [activeCategory, searchQuery]);

  const totalProducts = allItems.length;
  const productionReadyCount = allItems.filter((i) => i.status === 'production-ready').length;
  const categoriesCount = categories.length;

  function handleSelectProductType(productType: string) {
    openNewItemModal(undefined, productType);
  }

  function handleOpenItem(item: ProductItem) {
    setActiveItem(item.id);
    setCurrentView('workspace');
    setActiveNavTab('Workspace');
  }

  return (
    <div className="" style={{ background: '#FAFBFF' }}>
      {/* ── Rainbow gradient strip ── */}
      <div
        className="h-1 w-full"
        style={{
          background:
            'linear-gradient(to right, #6366f1, #8b5cf6, #ec4899, #f97316)',
        }}
      />

      {/* ── Hero Section ── */}
      <div className="relative overflow-hidden" style={{ background: '#ffffff' }}>
        {/* Soft radial gradient blobs */}
        <div
          className="absolute top-0 left-0 w-[480px] h-[480px] rounded-full opacity-40 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #eef2ff 0%, transparent 70%)',
            transform: 'translate(-30%, -30%)',
          }}
        />
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #faf5ff 0%, transparent 70%)',
            transform: 'translate(25%, -25%)',
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 w-[320px] h-[320px] rounded-full opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #eef2ff 0%, transparent 70%)',
            transform: 'translate(-50%, 50%)',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-10">
          {/* Greeting */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              {getGreeting()}, Designer
            </p>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="text-4xl font-extrabold text-slate-800 tracking-tight leading-tight mb-3"
          >
            What will you{' '}
            <span
              style={{
                background: 'linear-gradient(to right, #6366f1, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              create today?
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.14 }}
            className="text-slate-400 text-base mb-6 max-w-xl"
          >
            Design, build, and manage your entire product line — all in one place.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="relative max-w-xl mb-5"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search product types, templates, categories…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-5 py-3.5 rounded-2xl text-sm text-slate-700 placeholder-slate-400 outline-none transition-all"
              style={{
                background: '#F1F5F9',
                border: '2px solid transparent',
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = '2px solid #6366f133';
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.boxShadow = '0 0 0 4px #6366f10f';
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = '2px solid transparent';
                e.currentTarget.style.background = '#F1F5F9';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </motion.div>

          {/* Quick pick pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.26 }}
            className="flex flex-wrap gap-2"
          >
            <span className="text-slate-400 text-xs font-medium self-center mr-1">Quick start:</span>
            {QUICK_PICKS.map((qp) => {
              const pt = PRODUCT_TYPES.find((p) => p.id === qp);
              return (
                <button
                  key={qp}
                  onClick={() => handleSelectProductType(qp)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: 'rgba(99,102,241,0.08)',
                    color: '#6366f1',
                    border: '1px solid rgba(99,102,241,0.18)',
                  }}
                >
                  <span>{pt?.emoji}</span>
                  {qp}
                </button>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* ── Getting Started Banner ── */}
      <div style={{ background: '#F0F4FF' }} className="border-b border-indigo-100">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center flex-none">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-base">Getting Started</h2>
              <p className="text-slate-500 text-sm">Follow these steps to build your first product</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { step: 1, icon: '📁', title: 'Create Category', desc: 'Organize by type (Apparel, Packaging…)', action: 'Add Category', onClick: () => useAppStore.getState().openNewCategoryModal() },
              { step: 2, icon: '➕', title: 'Add Product', desc: 'Pick a product type and give it a name', action: 'New Product', onClick: () => openNewItemModal() },
              { step: 3, icon: '🎨', title: 'Design It', desc: 'Use the 2D canvas to add your artwork', action: 'Open Workspace', onClick: () => { setCurrentView('workspace'); setActiveNavTab('Workspace'); } },
              { step: 4, icon: '📬', title: 'Order Sample', desc: 'Track supplier and sample status', action: 'Manufacturing', onClick: () => { setCurrentView('manufacturing'); setActiveNavTab('manufacturing'); } },
              { step: 5, icon: '🚀', title: 'Go to Production', desc: 'Approve and launch your product line', action: 'View Pipeline', onClick: () => { setCurrentView('manufacturing'); setActiveNavTab('manufacturing'); } },
            ].map((s) => (
              <button
                key={s.step}
                onClick={s.onClick}
                className="text-left bg-white rounded-xl p-3 border border-indigo-100 hover:border-indigo-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center flex-none">{s.step}</span>
                  <span className="text-lg leading-none">{s.icon}</span>
                </div>
                <p className="font-semibold text-slate-800 text-xs leading-tight">{s.title}</p>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-tight">{s.desc}</p>
                <div className="flex items-center gap-0.5 mt-2 text-indigo-500 text-[10px] font-semibold group-hover:gap-1.5 transition-all">
                  {s.action} <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">

        {/* ── Category filter tabs ── */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
        >
          <div
            className="inline-flex items-center gap-1 p-1 rounded-2xl"
            style={{ background: '#F1F5F9' }}
          >
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                style={
                  activeCategory === cat
                    ? {
                        background: '#ffffff',
                        color: '#6366f1',
                        boxShadow: '0 2px 8px rgba(99,102,241,0.12)',
                      }
                    : {
                        background: 'transparent',
                        color: '#64748b',
                      }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Product Type Grid ── */}
        <section>
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-between mb-4"
          >
            <h2 className="text-lg font-bold text-slate-800">
              {activeCategory === 'All' ? 'All Product Types' : activeCategory}
              <span className="ml-2 text-sm font-normal text-slate-400">
                ({filteredProductTypes.length})
              </span>
            </h2>
          </motion.div>

          <AnimatePresence mode="wait">
            {filteredProductTypes.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 text-slate-400"
              >
                <Sparkles className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm font-medium">No product types match your search.</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                  className="mt-3 text-indigo-500 text-sm font-semibold hover:underline"
                >
                  Clear filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={activeCategory + searchQuery}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              >
                {filteredProductTypes.map((pt) => (
                  <ProductTypeCard
                    key={pt.id}
                    product={pt}
                    onSelect={() => handleSelectProductType(pt.id)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── Continue your work ── */}
        {recentItems.length > 0 && (
          <motion.section variants={fadeUpVariant} initial="hidden" animate="visible">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                Continue your work
              </h2>
              <button
                onClick={() => { setCurrentView('inventory'); setActiveNavTab('Inventory'); }}
                className="flex items-center gap-1 text-indigo-500 text-sm font-semibold hover:text-indigo-700 transition-colors"
              >
                View all
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
              {recentItems.map((item) => (
                <RecentCard
                  key={item.id}
                  item={item}
                  onOpen={() => handleOpenItem(item)}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* ── Start from a template ── */}
        {templates.length > 0 && (
          <motion.section variants={fadeUpVariant} initial="hidden" animate="visible">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                Start from a template
              </h2>
              <button
                onClick={() => { setCurrentView('templates'); setActiveNavTab('Templates'); }}
                className="flex items-center gap-1 text-indigo-500 text-sm font-semibold hover:text-indigo-700 transition-colors"
              >
                Browse all
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
              {templates.map((tmpl) => (
                <TemplateCard key={tmpl.id} template={tmpl} />
              ))}
            </div>
          </motion.section>
        )}

        {/* ── Build & Manage stats section ── */}
        <motion.section variants={fadeUpVariant} initial="hidden" animate="visible">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            Build &amp; Manage
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Total products */}
            <motion.div
              whileHover={{ y: -3, boxShadow: '0 16px 40px -10px rgba(99,102,241,0.18)' }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-slate-100 p-5 cursor-pointer"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
              onClick={() => { setCurrentView('inventory'); setActiveNavTab('Inventory'); }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#eef2ff' }}>
                  <Package className="w-5 h-5 text-indigo-500" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-3xl font-extrabold text-slate-800">{totalProducts}</p>
              <p className="text-slate-500 text-sm font-medium mt-0.5">Total Products</p>
              <p className="text-slate-400 text-xs mt-2">
                {productionReadyCount} production-ready
              </p>
            </motion.div>

            {/* Category health */}
            <motion.div
              whileHover={{ y: -3, boxShadow: '0 16px 40px -10px rgba(16,185,129,0.16)' }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-slate-100 p-5 cursor-pointer"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
              onClick={() => { setCurrentView('inventory'); setActiveNavTab('Inventory'); }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#ecfdf5' }}>
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-3xl font-extrabold text-slate-800">{categoriesCount}</p>
              <p className="text-slate-500 text-sm font-medium mt-0.5">Categories</p>
              <div className="mt-2 flex gap-1 flex-wrap">
                {categories.slice(0, 4).map((cat) => (
                  <span
                    key={cat.id}
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${cat.color}18`, color: cat.color }}
                  >
                    {cat.icon} {cat.name}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Workspace tools */}
            <motion.div
              whileHover={{ y: -3, boxShadow: '0 16px 40px -10px rgba(99,102,241,0.16)' }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-slate-100 p-5"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#fdf4ff' }}>
                  <Zap className="w-5 h-5 text-purple-500" />
                </div>
              </div>
              <p className="text-slate-700 text-sm font-bold mb-3">Workspace Tools</p>
              <div className="space-y-1.5">
                {[
                  { label: 'Manufacturing Pipeline', icon: Factory, view: 'manufacturing', nav: 'Manufacturing' },
                  { label: 'Product Inventory', icon: Package, view: 'inventory', nav: 'Inventory' },
                  { label: 'Analytics', icon: BarChart3, view: 'analytics', nav: 'Analytics' },
                ].map(({ label, icon: Icon, view, nav }) => (
                  <button
                    key={label}
                    onClick={() => {
                      setCurrentView(view as Parameters<typeof setCurrentView>[0]);
                      setActiveNavTab(nav);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-sm text-slate-600 font-medium transition-all hover:bg-indigo-50 hover:text-indigo-700 group"
                  >
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    {label}
                    <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-300 group-hover:text-indigo-400 transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ── Pro Tip Banner ── */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
            boxShadow: '0 8px 32px -8px rgba(99,102,241,0.35)',
          }}
        >
          <div className="px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-none"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Pro Tip</p>
                <p className="text-indigo-200 text-sm mt-0.5 max-w-lg">
                  Start with a Hoodie or T-Shirt — our most popular product types. Use the Manufacturing Pipeline to track sample orders and approvals end-to-end.
                </p>
              </div>
            </div>
            <button
              onClick={() => { setCurrentView('manufacturing'); setActiveNavTab('Manufacturing'); }}
              className="flex-none flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              Open Pipeline
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Bottom spacer */}
        <div className="h-8" />
      </div>
    </div>
  );
}
