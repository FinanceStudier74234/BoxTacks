'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ArrowRight, Plus, Star, Clock,
  Sparkles, TrendingUp, Package, Layers,
  CheckCircle, BarChart3, ChevronRight, Zap,
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatCurrency, calcTotalCost, calcMargin, getRelativeTime } from '@/lib/utils';
import type { ProductItem } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT TYPE CATALOG — every tile on the home screen
// ─────────────────────────────────────────────────────────────────────────────
const PRODUCT_TYPE_CATALOG = [
  {
    id: 'Hoodie',
    label: 'Hoodie',
    emoji: '🧥',
    description: 'Fleece & pullover styles',
    gradient: 'from-slate-700 via-slate-800 to-slate-900',
    glow: 'rgba(71,85,105,0.45)',
    category: 'Apparel',
    popular: true,
    tag: 'Most Popular',
  },
  {
    id: 'T-Shirt',
    label: 'T-Shirt',
    emoji: '👕',
    description: 'Crew neck & v-neck',
    gradient: 'from-indigo-500 via-indigo-600 to-purple-700',
    glow: 'rgba(99,102,241,0.45)',
    category: 'Apparel',
    popular: true,
    tag: 'Best Seller',
  },
  {
    id: 'Notebook',
    label: 'Notebook',
    emoji: '📒',
    description: 'Journals & hardcovers',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    glow: 'rgba(16,185,129,0.4)',
    category: 'Stationery',
    popular: true,
    tag: '',
  },
  {
    id: 'Mailer Box',
    label: 'Mailer Box',
    emoji: '📮',
    description: 'Shipping & gift mailers',
    gradient: 'from-sky-500 via-blue-500 to-indigo-600',
    glow: 'rgba(14,165,233,0.4)',
    category: 'Packaging',
    popular: false,
    tag: '',
  },
  {
    id: 'Hang Tag',
    label: 'Hang Tag',
    emoji: '🏷️',
    description: 'Premium labels & tags',
    gradient: 'from-stone-500 via-stone-600 to-neutral-800',
    glow: 'rgba(120,113,108,0.4)',
    category: 'Packaging',
    popular: false,
    tag: '',
  },
  {
    id: 'Poster',
    label: 'Poster',
    emoji: '🖼️',
    description: 'Art prints & promos',
    gradient: 'from-rose-400 via-pink-500 to-fuchsia-600',
    glow: 'rgba(244,63,94,0.4)',
    category: 'Poster',
    popular: false,
    tag: '',
  },
  {
    id: 'Planner',
    label: 'Planner',
    emoji: '📅',
    description: 'Annual & weekly spreads',
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    glow: 'rgba(245,158,11,0.4)',
    category: 'Stationery',
    popular: false,
    tag: '',
  },
  {
    id: 'Insert Card',
    label: 'Insert Card',
    emoji: '💌',
    description: 'Thank you & gift inserts',
    gradient: 'from-pink-400 via-rose-500 to-red-400',
    glow: 'rgba(236,72,153,0.4)',
    category: 'Packaging',
    popular: false,
    tag: '',
  },
  {
    id: 'Desk Mat',
    label: 'Desk Mat',
    emoji: '🖥️',
    description: 'Extended mouse pads',
    gradient: 'from-violet-500 via-purple-600 to-indigo-700',
    glow: 'rgba(139,92,246,0.4)',
    category: 'Accessories',
    popular: false,
    tag: '',
  },
  {
    id: 'Tote Bag',
    label: 'Tote Bag',
    emoji: '👜',
    description: 'Canvas carry-all bags',
    gradient: 'from-lime-500 via-green-500 to-emerald-600',
    glow: 'rgba(132,204,22,0.4)',
    category: 'Accessories',
    popular: false,
    tag: '',
  },
  {
    id: 'Sweatshirt',
    label: 'Sweatshirt',
    emoji: '🥋',
    description: 'Crewneck & zip-up',
    gradient: 'from-cyan-500 via-teal-500 to-green-600',
    glow: 'rgba(6,182,212,0.4)',
    category: 'Apparel',
    popular: false,
    tag: '',
  },
  {
    id: 'Custom',
    label: 'Custom',
    emoji: '✨',
    description: 'Start from scratch',
    gradient: 'from-fuchsia-500 via-pink-500 to-orange-400',
    glow: 'rgba(217,70,239,0.4)',
    category: 'Custom',
    popular: false,
    tag: 'Blank Canvas',
  },
];

const CATEGORIES = ['All', 'Apparel', 'Packaging', 'Stationery', 'Accessories', 'Poster'];

// Animation variants
const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.35 } },
};

// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardView() {
  const {
    categories, getAllItems, templates,
    setActiveItem, openNewItemModal,
    setCurrentView, setActiveNavTab,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [hoveredType, setHoveredType] = useState<string | null>(null);

  const allItems = getAllItems();
  const recentItems = [...allItems]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  // Filter product types based on search + category
  const filteredTypes = PRODUCT_TYPE_CATALOG.filter((t) => {
    const matchSearch =
      !searchQuery ||
      t.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = activeFilter === 'All' || t.category === activeFilter;
    return matchSearch && matchFilter;
  });

  // Business snapshot numbers
  const totalProducts = allItems.length;
  const productionReady = allItems.filter((i) => i.status === 'production-ready').length;
  const inProgress = allItems.filter((i) =>
    ['designing', 'sample-ordered', 'in-revision'].includes(i.status)
  ).length;

  const handlePickType = (typeId: string) => {
    openNewItemModal(undefined, typeId);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F7F8FC]">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-violet-800 px-6 pt-10 pb-12">

        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-purple-400 opacity-20 blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
          <div className="absolute top-8 left-1/3 w-48 h-48 rounded-full bg-cyan-400 opacity-15 blur-2xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />
          <div className="absolute -bottom-16 left-8 w-64 h-64 rounded-full bg-indigo-300 opacity-20 blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
          <div className="absolute top-4 right-1/4 w-32 h-32 rounded-full bg-pink-400 opacity-15 blur-2xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Hero content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full border border-white/20 text-white/90 text-xs font-medium mb-5">
            <Sparkles size={11} className="text-yellow-300" />
            Your creative workspace is ready
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] tracking-tight mb-4">
            What will you{' '}
            <span className="relative">
              <span className="relative z-10">create today?</span>
              <span
                className="absolute -bottom-1 left-0 right-0 h-3 opacity-30 rounded-sm"
                style={{ background: 'linear-gradient(90deg,#f59e0b,#ec4899)' }}
              />
            </span>
          </h1>

          <p className="text-white/70 text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            From clothing to packaging — design products, manage manufacturing,
            and build your brand in one place.
          </p>

          {/* Search bar */}
          <div className="relative max-w-lg mx-auto mb-6">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product types, templates..."
              className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl text-sm text-slate-700 placeholder-slate-400 shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category filter pills */}
          <div className="flex items-center justify-center flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeFilter === cat
                    ? 'bg-white text-indigo-700 shadow-md'
                    : 'bg-white/15 text-white/80 hover:bg-white/25 border border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">

        {/* ── PRODUCT TYPE GRID ────────────────────────────────────────────── */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex items-center justify-between mb-5"
          >
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {searchQuery ? `Results for "${searchQuery}"` : 'Start a new design'}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">
                {filteredTypes.length} product type{filteredTypes.length !== 1 ? 's' : ''} available
              </p>
            </div>
            {!searchQuery && (
              <button
                onClick={() => openNewItemModal()}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-semibold rounded-xl hover:bg-indigo-100 transition-colors"
              >
                <Plus size={14} />
                Blank product
              </button>
            )}
          </motion.div>

          {filteredTypes.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-medium text-slate-600">No product types match &quot;{searchQuery}&quot;</p>
              <button onClick={() => setSearchQuery('')} className="mt-3 text-sm text-indigo-500 hover:underline">
                Clear search
              </button>
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3"
            >
              {filteredTypes.map((type) => (
                <ProductTypeCard
                  key={type.id}
                  type={type}
                  isHovered={hoveredType === type.id}
                  onHover={setHoveredType}
                  onPick={handlePickType}
                />
              ))}
            </motion.div>
          )}
        </section>

        {/* ── RECENT DESIGNS ───────────────────────────────────────────────── */}
        {recentItems.length > 0 && (
          <section>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between mb-5"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Clock size={15} className="text-amber-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Continue where you left off</h2>
                  <p className="text-sm text-slate-400">{allItems.length} products in your workspace</p>
                </div>
              </div>
              <button
                onClick={() => { setCurrentView('workspace'); setActiveNavTab('Products'); }}
                className="flex items-center gap-1.5 text-sm text-indigo-500 font-semibold hover:text-indigo-700 transition-colors"
              >
                View all <ArrowRight size={14} />
              </button>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
            >
              {recentItems.map((item) => {
                const cat = categories.find((c) => c.id === item.categoryId);
                return (
                  <RecentDesignCard
                    key={item.id}
                    item={item}
                    categoryName={cat?.name || ''}
                    categoryColor={cat?.color || '#6366F1'}
                    categoryIcon={cat?.icon || '📦'}
                    onClick={() => setActiveItem(item.id)}
                  />
                );
              })}

              {/* "Add new" tile */}
              <motion.button
                variants={fadeUp}
                onClick={() => openNewItemModal()}
                className="group aspect-[3/4] bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all duration-200 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                  <Plus size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </div>
                <span className="text-xs text-slate-400 group-hover:text-indigo-500 font-medium transition-colors">
                  New design
                </span>
              </motion.button>
            </motion.div>
          </section>
        )}

        {/* ── EMPTY STATE (no products yet) ────────────────────────────────── */}
        {allItems.length === 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 text-center"
          >
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Ready when you are</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6 leading-relaxed">
              Pick a product type above to create your first design, or start with
              a template to hit the ground running.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => openNewItemModal()}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:opacity-90 transition-all"
              >
                Create first product
              </button>
              <button
                onClick={() => { setCurrentView('templates'); setActiveNavTab('Templates'); }}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
              >
                Browse templates
              </button>
            </div>
          </motion.section>
        )}

        {/* ── TEMPLATES ROW ────────────────────────────────────────────────── */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between mb-5"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                <Sparkles size={15} className="text-purple-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Start with a template</h2>
                <p className="text-sm text-slate-400">{templates.length} ready-to-use layouts</p>
              </div>
            </div>
            <button
              onClick={() => { setCurrentView('templates'); setActiveNavTab('Templates'); }}
              className="flex items-center gap-1.5 text-sm text-indigo-500 font-semibold hover:text-indigo-700 transition-colors"
            >
              Browse all <ArrowRight size={14} />
            </button>
          </motion.div>

          {/* Horizontal scroll row */}
          <div className="relative">
            <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin" style={{ scrollSnapType: 'x mandatory' }}>
              {templates.slice(0, 10).map((tpl, i) => (
                <motion.button
                  key={tpl.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.04 }}
                  onClick={() => { setCurrentView('templates'); setActiveNavTab('Templates'); }}
                  className="group flex-shrink-0 w-44 bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 text-left"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  {/* Template color preview */}
                  <div
                    className="h-28 flex items-center justify-center relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${tpl.color}22 0%, ${tpl.color}50 100%)` }}
                  >
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{ background: `radial-gradient(circle at 70% 70%, ${tpl.color}, transparent 65%)` }}
                    />
                    <span className="text-4xl relative z-10 group-hover:scale-110 transition-transform duration-200">
                      {tpl.icon}
                    </span>
                    {tpl.isPremium && (
                      <span className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-400 text-white text-[9px] font-bold rounded-full">
                        <Star size={7} />PRO
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-slate-800 truncate">{tpl.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{tpl.category}</p>
                  </div>
                </motion.button>
              ))}

              {/* "View all" end card */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                onClick={() => { setCurrentView('templates'); setActiveNavTab('Templates'); }}
                className="flex-shrink-0 w-44 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 flex flex-col items-center justify-center gap-2 hover:shadow-card-hover transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <ChevronRight size={18} className="text-indigo-500" />
                </div>
                <span className="text-xs font-semibold text-indigo-600">View all templates</span>
              </motion.button>
            </div>

            {/* Fade out right edge */}
            <div className="absolute right-0 top-0 bottom-3 w-16 bg-gradient-to-l from-[#F7F8FC] to-transparent pointer-events-none" />
          </div>
        </section>

        {/* ── BUSINESS SNAPSHOT (compact) ──────────────────────────────────── */}
        {allItems.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                <BarChart3 size={15} className="text-indigo-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Workspace at a glance</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <SnapCard
                label="Total products"
                value={totalProducts}
                sub={`Across ${categories.length} categories`}
                icon={<Package size={16} />}
                gradient="from-indigo-500 to-purple-600"
              />
              <SnapCard
                label="Production ready"
                value={productionReady}
                sub={totalProducts ? `${Math.round((productionReady / totalProducts) * 100)}% of catalog` : '—'}
                icon={<CheckCircle size={16} />}
                gradient="from-emerald-500 to-teal-500"
              />
              <SnapCard
                label="In progress"
                value={inProgress}
                sub="Designing, sampling, revision"
                icon={<Zap size={16} />}
                gradient="from-amber-400 to-orange-500"
              />
              <SnapCard
                label="Categories"
                value={categories.length}
                sub={`${totalProducts} items total`}
                icon={<Layers size={16} />}
                gradient="from-sky-500 to-cyan-500"
              />
            </div>

            {/* Category health strips */}
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((cat) => {
                const ready = cat.items.filter((i) => i.status === 'production-ready').length;
                const pct = cat.items.length ? (ready / cat.items.length) * 100 : 0;
                return (
                  <button
                    key={cat.id}
                    onClick={() => cat.items[0] && setActiveItem(cat.items[0].id)}
                    className="bg-white rounded-2xl border border-slate-100 p-3.5 text-left hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{cat.icon}</span>
                      <span className="text-xs font-semibold text-slate-700 truncate flex-1">{cat.name}</span>
                      <span className="text-[10px] text-slate-400">{cat.items.length}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: cat.color }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{ready}/{cat.items.length} production ready</p>
                  </button>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* ── INSPIRATION BANNER ───────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-7 flex items-center justify-between"
        >
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 50%, #8b5cf6 0%, transparent 50%)',
          }} />
          <div className="relative z-10">
            <p className="text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-1">Pro Tip</p>
            <p className="text-white font-bold text-lg mb-1">
              Build smarter with Design Zones
            </p>
            <p className="text-slate-400 text-sm max-w-md">
              Open any product in 2D Design mode and enable Zones — the system will guide
              you to the right placement areas for your product type automatically.
            </p>
          </div>
          <button
            onClick={() => { setCurrentView('workspace'); setActiveNavTab('Workspace'); }}
            className="relative z-10 flex-shrink-0 ml-4 flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg"
          >
            Open Workspace <ArrowRight size={14} />
          </button>
        </motion.section>

        {/* bottom padding */}
        <div className="h-4" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT TYPE CARD
// ─────────────────────────────────────────────────────────────────────────────
function ProductTypeCard({
  type, isHovered, onHover, onPick,
}: {
  type: typeof PRODUCT_TYPE_CATALOG[0];
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onPick: (id: string) => void;
}) {
  return (
    <motion.button
      variants={fadeUp}
      onMouseEnter={() => onHover(type.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onPick(type.id)}
      className="group relative flex flex-col items-center justify-end text-center rounded-2xl overflow-hidden cursor-pointer transition-all duration-250"
      style={{
        aspectRatio: '3/4',
        boxShadow: isHovered
          ? `0 16px 40px -8px ${type.glow}, 0 4px 12px rgba(0,0,0,0.12)`
          : '0 1px 4px rgba(0,0,0,0.06)',
        transform: isHovered ? 'translateY(-5px) scale(1.02)' : 'translateY(0) scale(1)',
      }}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient}`} />

      {/* Subtle inner texture */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 10px)',
        }}
      />

      {/* Popular/tag badge */}
      {type.tag && (
        <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-[9px] font-bold uppercase tracking-wide border border-white/25">
          {type.tag}
        </div>
      )}

      {/* Emoji */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-5xl transition-transform duration-300 drop-shadow-lg"
          style={{ transform: isHovered ? 'scale(1.15) translateY(-4px)' : 'scale(1)' }}
        >
          {type.emoji}
        </span>
      </div>

      {/* Bottom info strip */}
      <div className="relative z-10 w-full px-3 pb-3 pt-6 bg-gradient-to-t from-black/50 to-transparent">
        <p className="text-white font-bold text-xs leading-tight">{type.label}</p>
        <p className="text-white/60 text-[9px] mt-0.5 leading-tight">{type.description}</p>
      </div>

      {/* Hover CTA overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] transition-opacity duration-200 rounded-2xl"
        style={{ opacity: isHovered ? 1 : 0 }}
      >
        <div className="flex flex-col items-center gap-1.5 -mt-4">
          <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <Plus size={16} className="text-slate-800" />
          </div>
          <span className="text-white text-[11px] font-bold drop-shadow">Create</span>
        </div>
      </div>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RECENT DESIGN CARD
// ─────────────────────────────────────────────────────────────────────────────
function RecentDesignCard({
  item, categoryName, categoryColor, categoryIcon, onClick,
}: {
  item: ProductItem;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      variants={fadeUp}
      onClick={onClick}
      className="group text-left bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Color preview header */}
      <div
        className="h-24 relative overflow-hidden flex items-center justify-center"
        style={{
          background: item.color
            ? `linear-gradient(135deg, ${item.color}dd, ${item.color}88)`
            : `linear-gradient(135deg, ${categoryColor}cc, ${categoryColor}55)`,
        }}
      >
        {/* Decorative blob */}
        <div
          className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-30"
          style={{ backgroundColor: item.color || categoryColor }}
        />
        {/* Initials */}
        <span className="relative z-10 text-white font-extrabold text-xl drop-shadow">
          {item.name.slice(0, 2).toUpperCase()}
        </span>

        {/* Category icon badge */}
        <div
          className="absolute top-2 left-2 w-6 h-6 rounded-lg flex items-center justify-center text-sm"
          style={{ backgroundColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)' }}
        >
          {categoryIcon}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
          {item.name}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: categoryColor }} />
          <span className="text-[10px] text-slate-400 truncate">{categoryName}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <StatusBadge status={item.status} size="sm" />
          <span className="text-[10px] text-slate-400">{getRelativeTime(item.updatedAt)}</span>
        </div>
      </div>

      {/* Hover arrow */}
      <div className="px-3 pb-3 opacity-0 group-hover:opacity-100 transition-opacity -mt-1">
        <div className="flex items-center gap-1 text-[10px] text-indigo-500 font-semibold">
          Continue editing <ArrowRight size={9} />
        </div>
      </div>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SNAPSHOT STAT CARD
// ─────────────────────────────────────────────────────────────────────────────
function SnapCard({
  label, value, sub, icon, gradient,
}: {
  label: string;
  value: number;
  sub: string;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 hover:shadow-card-hover transition-shadow">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xl font-extrabold text-slate-900 leading-none">{value}</p>
        <p className="text-[11px] text-slate-500 mt-0.5 font-medium leading-tight">{label}</p>
        <p className="text-[10px] text-slate-400 mt-0.5 leading-tight truncate">{sub}</p>
      </div>
    </div>
  );
}
