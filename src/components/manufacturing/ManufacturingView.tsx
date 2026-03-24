'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Factory,
  Package,
  CheckCircle,
  Clock,
  Zap,
  TrendingUp,
  Filter,
  ChevronRight,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import type { ProductItem, ProductStatus } from '@/types';
import {
  STATUS_CONFIG,
  ALL_STATUSES as STATUS_ORDER,
  PRODUCT_TYPE_EMOJI,
  SAMPLE_STATUS_COLORS,
  SAMPLE_STATUS_LABELS,
  type StatusEntry,
} from '@/constants/statusConfig';

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────
const fadeUpVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

// ─────────────────────────────────────────────────────────────────────────────
// KANBAN CARD
// ─────────────────────────────────────────────────────────────────────────────
function KanbanCard({
  item,
  statusCfg,
  categoryName,
  categoryColor,
  onOpen,
}: {
  item: ProductItem;
  statusCfg: StatusEntry;
  categoryName: string;
  categoryColor: string;
  onOpen: () => void;
}) {
  const emoji = PRODUCT_TYPE_EMOJI[item.type] || '📦';
  const sampleStatus = item.manufacturing?.sampleStatus || 'not-started';
  const sampleColor = SAMPLE_STATUS_COLORS[sampleStatus] || '#cbd5e1';
  const sampleLabel = SAMPLE_STATUS_LABELS[sampleStatus] || sampleStatus;

  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -2, boxShadow: `0 8px 24px -6px ${statusCfg.color}33` }}
      transition={{ duration: 0.18 }}
      className={`bg-white rounded-xl border ${statusCfg.border} overflow-hidden`}
      style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}
    >
      {/* Colored left accent bar */}
      <div
        className="flex gap-3 p-3"
        style={{ borderLeft: `3px solid ${statusCfg.color}` }}
      >
        {/* Emoji */}
        <div
          className="w-9 h-9 rounded-lg flex-none flex items-center justify-center text-xl"
          style={{ background: `${statusCfg.color}18` }}
        >
          {emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 text-sm truncate leading-tight">{item.name}</p>

          {/* Category */}
          <div className="flex items-center gap-1 mt-1">
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{ background: `${categoryColor}18`, color: categoryColor }}
            >
              {categoryName}
            </span>
            <span className="text-slate-400 text-[10px]">{item.type}</span>
          </div>

          {/* Manufacturing details */}
          {(item.manufacturing?.supplierName || item.manufacturing?.moq || item.manufacturing?.leadTime) && (
            <div className="mt-2 space-y-1">
              {item.manufacturing?.supplierName && (
                <p className="text-slate-500 text-[11px] flex items-center gap-1">
                  <Factory className="w-3 h-3 flex-none text-slate-400" />
                  <span className="truncate">{item.manufacturing.supplierName}</span>
                </p>
              )}
              <div className="flex items-center gap-3 flex-wrap">
                {item.manufacturing?.moq && (
                  <p className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Package className="w-3 h-3 text-slate-300" />
                    MOQ {item.manufacturing.moq}
                  </p>
                )}
                {item.manufacturing?.leadTime && (
                  <p className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-300" />
                    {item.manufacturing.leadTime}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Footer row */}
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100">
            {/* Sample status dot */}
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: sampleColor }}
              />
              <span className="text-[10px] text-slate-400 font-medium">{sampleLabel}</span>
            </div>

            {/* Status badge */}
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: `${statusCfg.color}18`,
                color: statusCfg.color,
              }}
            >
              {statusCfg.label}
            </span>
          </div>
        </div>
      </div>

      {/* Open button */}
      <button
        onClick={onOpen}
        className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-all hover:opacity-80 active:scale-98"
        style={{
          background: `${statusCfg.color}0d`,
          color: statusCfg.color,
          borderTop: `1px solid ${statusCfg.color}22`,
        }}
      >
        Open in Workspace
        <ExternalLink className="w-3 h-3" />
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KANBAN COLUMN
// ─────────────────────────────────────────────────────────────────────────────
function KanbanColumn({
  status,
  items,
  categoryMap,
  onOpenItem,
}: {
  status: ProductStatus;
  items: ProductItem[];
  categoryMap: Record<string, { name: string; color: string }>;
  onOpenItem: (id: string) => void;
}) {
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="flex-none w-64 flex flex-col" style={{ minHeight: 0 }}>
      {/* Column header */}
      <div
        className={`flex items-center justify-between px-3 py-2.5 rounded-xl mb-3 ${cfg.headerBg} border ${cfg.border}`}
      >
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full flex-none"
            style={{ background: cfg.color }}
          />
          <span className="text-sm font-bold text-slate-700">{cfg.label}</span>
        </div>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: `${cfg.color}22`, color: cfg.color }}
        >
          {items.length}
        </span>
      </div>

      {/* Cards list */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5" style={{ maxHeight: 'calc(100vh - 320px)' }}>
        <AnimatePresence>
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-xl border-2 border-dashed ${cfg.border} flex flex-col items-center justify-center py-8 text-center`}
              style={{ minHeight: 100 }}
            >
              <span className="text-2xl mb-1.5 opacity-40">
                {status === 'idea' ? '💡' : status === 'designing' ? '✏️' : status === 'sample-ordered' ? '📬' : status === 'in-revision' ? '🔄' : status === 'approved' ? '✅' : '🚀'}
              </span>
              <p className="text-[11px] font-medium text-slate-400">No products here yet</p>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-2.5"
            >
              {items.map((item) => {
                const cat = categoryMap[item.categoryId] || { name: 'Unknown', color: '#94a3b8' };
                return (
                  <KanbanCard
                    key={item.id}
                    item={item}
                    statusCfg={cfg}
                    categoryName={cat.name}
                    categoryColor={cat.color}
                    onOpen={() => onOpenItem(item.id)}
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accentColor,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accentColor: string;
}) {
  return (
    <motion.div
      variants={cardVariant}
      className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 overflow-hidden relative"
      style={{
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        borderLeft: `4px solid ${accentColor}`,
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex-none flex items-center justify-center"
        style={{ background: `${accentColor}15` }}
      >
        <Icon className="w-5 h-5" style={{ color: accentColor }} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-extrabold text-slate-800 leading-tight">{value}</p>
        <p className="text-slate-500 text-xs font-semibold mt-0.5">{label}</p>
        {sub && <p className="text-slate-400 text-[11px] mt-0.5">{sub}</p>}
      </div>
      {/* Decorative corner circle */}
      <div
        className="absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-10"
        style={{ background: accentColor }}
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function ManufacturingView() {
  const { categories, getAllItems, setActiveItem, setCurrentView, setActiveNavTab } = useAppStore();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>('all');

  const allItems = getAllItems();

  // Build category lookup map
  const categoryMap = useMemo(() => {
    const map: Record<string, { name: string; color: string }> = {};
    for (const cat of categories) {
      map[cat.id] = { name: cat.name, color: cat.color };
    }
    return map;
  }, [categories]);

  // Unique category names for filter dropdown
  const categoryOptions = useMemo(() => {
    const names = new Set(categories.map((c) => c.name));
    return ['all', ...Array.from(names)];
  }, [categories]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const catMatch =
        categoryFilter === 'all' ||
        (categoryMap[item.categoryId]?.name || '') === categoryFilter;
      const statusMatch = statusFilter === 'all' || item.status === statusFilter;
      return catMatch && statusMatch;
    });
  }, [allItems, categoryFilter, statusFilter, categoryMap]);

  // Group by status
  const itemsByStatus = useMemo(() => {
    const grouped: Record<ProductStatus, ProductItem[]> = {
      idea: [],
      designing: [],
      'sample-ordered': [],
      'in-revision': [],
      approved: [],
      'production-ready': [],
    };
    for (const item of filteredItems) {
      if (item.status in grouped) {
        grouped[item.status].push(item);
      }
    }
    return grouped;
  }, [filteredItems]);

  // Stat calculations
  const totalProducts = allItems.length;
  const inProduction = allItems.filter(
    (i) => i.status === 'sample-ordered' || i.status === 'in-revision' || i.status === 'designing'
  ).length;
  const readyToShip = allItems.filter((i) => i.status === 'production-ready').length;

  const avgLeadTime = useMemo(() => {
    const withLead = allItems.filter((i) => i.manufacturing?.leadTime);
    if (withLead.length === 0) return 'N/A';
    // Try to extract first number from lead time strings
    const days = withLead
      .map((i) => {
        const match = i.manufacturing?.leadTime?.match(/\d+/);
        return match ? parseInt(match[0], 10) : null;
      })
      .filter((d): d is number => d !== null);
    if (days.length === 0) return 'N/A';
    const avg = Math.round(days.reduce((a, b) => a + b, 0) / days.length);
    return `${avg}d`;
  }, [allItems]);

  function handleOpenItem(id: string) {
    setActiveItem(id);
    setCurrentView('workspace');
    setActiveNavTab('Workspace');
  }

  return (
    <div className="min-h-screen" style={{ background: '#F8F9FF' }}>
      {/* ── Page header ── */}
      <div
        className="px-6 pt-6 pb-5"
        style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}
      >
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
            >
              <Factory className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-800 leading-tight">
                Manufacturing Pipeline
              </h1>
              <p className="text-slate-400 text-xs font-medium">
                Track every product from concept to production-ready
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* ── Top stat cards ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            label="Total Products"
            value={totalProducts}
            sub={`across ${categories.length} categories`}
            icon={Package}
            accentColor="#6366f1"
          />
          <StatCard
            label="In Production"
            value={inProduction}
            sub="designing · sampling · revision"
            icon={Factory}
            accentColor="#3b82f6"
          />
          <StatCard
            label="Ready to Ship"
            value={readyToShip}
            sub="production-ready items"
            icon={CheckCircle}
            accentColor="#10b981"
          />
          <StatCard
            label="Avg Lead Time"
            value={avgLeadTime}
            sub="across sampled products"
            icon={Clock}
            accentColor="#f59e0b"
          />
        </motion.div>

        {/* ── Filter row ── */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center gap-3"
        >
          {/* Category dropdown */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2 rounded-xl text-sm font-semibold text-slate-700 border border-slate-200 outline-none transition-all cursor-pointer"
              style={{ background: '#ffffff' }}
            >
              {categoryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'all' ? 'All Categories' : opt}
                </option>
              ))}
            </select>
            <ChevronRight className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 rotate-90 pointer-events-none" />
          </div>

          {/* Status filter pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setStatusFilter('all')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={
                statusFilter === 'all'
                  ? { background: '#6366f1', color: '#ffffff' }
                  : { background: '#f1f5f9', color: '#64748b' }
              }
            >
              All Statuses
            </button>
            {STATUS_ORDER.map((s) => {
              const cfg = STATUS_CONFIG[s];
              const active = statusFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  style={
                    active
                      ? { background: cfg.color, color: '#ffffff' }
                      : { background: `${cfg.color}15`, color: cfg.color }
                  }
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full flex-none"
                    style={{ background: active ? 'rgba(255,255,255,0.7)' : cfg.color }}
                  />
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Item count */}
          <span className="ml-auto text-sm text-slate-400 font-medium">
            {filteredItems.length} product{filteredItems.length !== 1 ? 's' : ''}
          </span>
        </motion.div>

        {/* ── Kanban Board ── */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
        >
          <div
            className="flex gap-4 overflow-x-auto pb-6"
            style={{ minHeight: 420 }}
          >
            {STATUS_ORDER.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                items={itemsByStatus[status]}
                categoryMap={categoryMap}
                onOpenItem={handleOpenItem}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Summary footer ── */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl border border-slate-100 px-5 py-4"
          style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
        >
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-bold text-slate-700">Pipeline Overview</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {STATUS_ORDER.map((s) => {
                const cfg = STATUS_CONFIG[s];
                const count = itemsByStatus[s].length;
                return (
                  <div key={s} className="flex items-center gap-1.5">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ background: cfg.color }}
                    />
                    <span className="text-xs text-slate-500 font-medium">{cfg.label}</span>
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: `${cfg.color}18`, color: cfg.color }}
                    >
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => { setCurrentView('dashboard'); setActiveNavTab('Dashboard'); }}
              className="flex items-center gap-1.5 text-indigo-500 text-sm font-semibold hover:text-indigo-700 transition-colors"
            >
              Back to Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Bottom spacer */}
        <div className="h-4" />
      </div>
    </div>
  );
}
