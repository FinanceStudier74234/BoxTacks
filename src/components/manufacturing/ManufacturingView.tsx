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
  const { getAllItems, categories, setActiveItem, setCurrentView, setActiveNavTab, updateItemStatus } = useAppStore();
  const [activeStage, setActiveStage] = useState<'design' | 'sampling' | 'production'>('design');

  const allItems = getAllItems();

  // Build category lookup map
  const categoryMap = useMemo(() => {
    const map: Record<string, { name: string; color: string }> = {};
    for (const cat of categories) {
      map[cat.id] = { name: cat.name, color: cat.color };
    }
    return map;
  }, [categories]);

  const stages = {
    design: {
      label: 'Design',
      statuses: ['idea', 'designing'] as ProductStatus[],
      emoji: '✏️',
      color: '#6366F1',
      nextStatus: 'sample-ordered' as ProductStatus,
      nextLabel: 'Move to Sampling',
    },
    sampling: {
      label: 'Sampling',
      statuses: ['sample-ordered', 'in-revision'] as ProductStatus[],
      emoji: '📬',
      color: '#F97316',
      nextStatus: 'approved' as ProductStatus,
      nextLabel: 'Move to Production',
    },
    production: {
      label: 'Production',
      statuses: ['approved', 'production-ready'] as ProductStatus[],
      emoji: '🚀',
      color: '#10B981',
      nextStatus: null,
      nextLabel: null,
    },
  };

  const stageItems = allItems.filter((i) =>
    (stages[activeStage].statuses as string[]).includes(i.status)
  );

  const stageCounts = {
    design: allItems.filter((i) => (stages.design.statuses as string[]).includes(i.status)).length,
    sampling: allItems.filter((i) => (stages.sampling.statuses as string[]).includes(i.status)).length,
    production: allItems.filter((i) => (stages.production.statuses as string[]).includes(i.status)).length,
  };

  function handleOpenItem(id: string) {
    setActiveItem(id);
    setCurrentView('workspace');
    setActiveNavTab('Workspace');
  }

  const currentStage = stages[activeStage];

  return (
    <div style={{ background: '#F8F9FF' }}>
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

        {/* ── Stage tab bar ── */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-2 bg-white rounded-2xl border border-slate-100 p-1.5"
          style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)', width: 'fit-content' }}
        >
          {(Object.entries(stages) as [keyof typeof stages, typeof stages[keyof typeof stages]][]).map(([key, stage]) => {
            const isActive = activeStage === key;
            const count = stageCounts[key];
            return (
              <button
                key={key}
                onClick={() => setActiveStage(key)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                style={
                  isActive
                    ? { background: stage.color, color: '#ffffff', boxShadow: `0 4px 12px ${stage.color}44` }
                    : { background: 'transparent', color: '#64748b' }
                }
              >
                <span>{stage.emoji}</span>
                {stage.label}
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
                  style={
                    isActive
                      ? { background: 'rgba(255,255,255,0.25)', color: '#ffffff' }
                      : { background: `${stage.color}18`, color: stage.color }
                  }
                >
                  {count}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* ── Items grid ── */}
        <motion.div
          key={activeStage}
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
        >
          {stageItems.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed border-slate-200 text-center"
              style={{ background: '#ffffff' }}
            >
              <span className="text-4xl mb-3 opacity-50">{currentStage.emoji}</span>
              <p className="font-semibold text-slate-500 text-sm">No products in {currentStage.label} stage</p>
              <p className="text-slate-400 text-xs mt-1">
                {activeStage === 'design'
                  ? 'Add a new product to get started'
                  : `Move products from the previous stage`}
              </p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {stageItems.map((item) => {
                const cat = categoryMap[item.categoryId] || { name: 'Unknown', color: '#94a3b8' };
                const statusCfg = STATUS_CONFIG[item.status];
                const emoji = PRODUCT_TYPE_EMOJI[item.type] || '📦';
                return (
                  <motion.div
                    key={item.id}
                    variants={cardVariant}
                    className="bg-white rounded-xl border border-slate-100 overflow-hidden"
                    style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
                  >
                    {/* Left accent + content */}
                    <div
                      className="flex gap-3 p-3"
                      style={{ borderLeft: `3px solid ${currentStage.color}` }}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex-none flex items-center justify-center text-xl"
                        style={{ background: `${currentStage.color}18` }}
                      >
                        {emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate leading-tight">{item.name}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                            style={{ background: `${cat.color}18`, color: cat.color }}
                          >
                            {cat.name}
                          </span>
                          <span className="text-slate-400 text-[10px]">{item.type}</span>
                        </div>
                        {item.manufacturing?.supplierName && (
                          <p className="text-slate-500 text-[11px] mt-1.5 flex items-center gap-1">
                            <Factory className="w-3 h-3 flex-none text-slate-400" />
                            <span className="truncate">{item.manufacturing.supplierName}</span>
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: `${statusCfg.color}18`, color: statusCfg.color }}
                          >
                            {statusCfg.label}
                          </span>
                          <button
                            onClick={() => handleOpenItem(item.id)}
                            className="text-[10px] font-semibold text-indigo-500 hover:text-indigo-700 flex items-center gap-0.5 transition-colors"
                          >
                            Open <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Action button */}
                    {currentStage.nextStatus ? (
                      <button
                        onClick={() => updateItemStatus(item.id, currentStage.nextStatus!)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-all hover:opacity-80"
                        style={{
                          background: `${currentStage.color}0d`,
                          color: currentStage.color,
                          borderTop: `1px solid ${currentStage.color}22`,
                        }}
                      >
                        {currentStage.nextLabel} <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <div
                        className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold"
                        style={{
                          background: `${currentStage.color}0d`,
                          color: currentStage.color,
                          borderTop: `1px solid ${currentStage.color}22`,
                        }}
                      >
                        <CheckCircle className="w-3 h-3" /> In Production
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>

        {/* Bottom spacer */}
        <div className="h-4" />
      </div>
    </div>
  );
}
