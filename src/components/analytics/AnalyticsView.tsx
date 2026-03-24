'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  CheckCircle,
  Zap,
  Clock,
  ArrowRight,
  Sparkles,
  Info,
  AlertCircle,
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import type { ProductStatus } from '@/types';
import { calcTotalCost, calcMargin, getRelativeTime } from '@/lib/utils';
import { STATUS_COLOR, STATUS_LABEL, STATUS_BG, ALL_STATUSES } from '@/constants/statusConfig';

const PIPELINE_STATUSES: ProductStatus[] = ['designing', 'sample-ordered', 'in-revision'];

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.22 },
};

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.22, delay: i * 0.07 },
});

// ─────────────────────────────────────────────────────────────────────────────
// KPI CARD
// ─────────────────────────────────────────────────────────────────────────────
interface KpiCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
  trend: string;
  trendUp: boolean;
  index: number;
}

function KpiCard({ icon, iconBg, iconColor, value, label, trend, trendUp, index }: KpiCardProps) {
  return (
    <motion.div
      {...stagger(index)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          <div style={{ color: iconColor }}>{icon}</div>
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
            trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
          }`}
        >
          {trendUp ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {trend}
        </span>
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-800 leading-none mb-1">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
      <p className="text-[11px] text-slate-400">vs last month</p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STACKED BAR
// ─────────────────────────────────────────────────────────────────────────────
interface StackedBarProps {
  counts: Record<ProductStatus, number>;
  total: number;
}

function StackedBar({ counts, total }: StackedBarProps) {
  if (total === 0) {
    return (
      <div className="h-6 bg-slate-100 rounded-full w-full flex items-center justify-center text-xs text-slate-400">
        No data
      </div>
    );
  }

  return (
    <div className="flex h-6 w-full rounded-full overflow-hidden gap-px">
      {ALL_STATUSES.map((status) => {
        const count = counts[status] || 0;
        const pct = (count / total) * 100;
        if (pct === 0) return null;
        return (
          <motion.div
            key={status}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="h-full flex items-center justify-center overflow-hidden relative group cursor-default"
            style={{ backgroundColor: STATUS_COLOR[status], minWidth: pct > 5 ? undefined : 4 }}
            title={`${STATUS_LABEL[status]}: ${count}`}
          >
            {pct > 8 && (
              <span className="text-[10px] font-bold text-white/90 select-none">{count}</span>
            )}
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] font-medium px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {STATUS_LABEL[status]}: {count}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY HEALTH CARD
// ─────────────────────────────────────────────────────────────────────────────
interface CategoryHealthCardProps {
  name: string;
  icon: string;
  color: string;
  itemCount: number;
  productionReadyCount: number;
  avgMargin: number | null;
  index: number;
}

function CategoryHealthCard({
  name,
  icon,
  color,
  itemCount,
  productionReadyCount,
  avgMargin,
  index,
}: CategoryHealthCardProps) {
  const pct = itemCount > 0 ? Math.round((productionReadyCount / itemCount) * 100) : 0;

  return (
    <motion.div
      {...stagger(index)}
      className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ backgroundColor: `${color}18` }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{name}</p>
          <p className="text-xs text-slate-400">
            {itemCount} product{itemCount !== 1 ? 's' : ''}
          </p>
        </div>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${color}18`, color }}
        >
          {pct}%
        </span>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-slate-400">Production ready</span>
          <span className="text-[10px] font-semibold text-slate-600">
            {productionReadyCount}/{itemCount}
          </span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.7, delay: 0.1 + index * 0.08, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>

      {/* Avg margin */}
      {avgMargin !== null && avgMargin > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <TrendingUp className="w-3 h-3 text-emerald-500" />
          <span>
            Avg margin:{' '}
            <span className="font-semibold text-emerald-600">{avgMargin.toFixed(1)}%</span>
          </span>
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY ITEM
// ─────────────────────────────────────────────────────────────────────────────
interface ActivityItemProps {
  name: string;
  status: ProductStatus;
  updatedAt: string;
  index: number;
}

function ActivityItem({ name, status, updatedAt, index }: ActivityItemProps) {
  return (
    <motion.div
      {...stagger(index)}
      className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-b-0"
    >
      <div
        className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5"
        style={{ backgroundColor: STATUS_COLOR[status] }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700 truncate">{name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: STATUS_BG[status], color: STATUS_COLOR[status] }}
          >
            {STATUS_LABEL[status]}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
        <Clock className="w-3 h-3" />
        {getRelativeTime(updatedAt)}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INSIGHT CARD
// ─────────────────────────────────────────────────────────────────────────────
interface InsightCardProps {
  icon: React.ReactNode;
  text: string;
  bg: string;
  iconColor: string;
  borderColor: string;
  index: number;
}

function InsightCard({ icon, text, bg, iconColor, borderColor, index }: InsightCardProps) {
  return (
    <motion.div
      {...stagger(index)}
      className="rounded-2xl border p-4 flex items-start gap-3"
      style={{ backgroundColor: bg, borderColor }}
    >
      <div style={{ color: iconColor, marginTop: 2 }}>{icon}</div>
      <p className="text-sm text-slate-700 leading-relaxed">{text}</p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ANALYTICS VIEW
// ─────────────────────────────────────────────────────────────────────────────
export default function AnalyticsView() {
  const { categories, getAllItems } = useAppStore();

  const allItems = getAllItems();

  // ── Derived analytics ────────────────────────────────────────────────────
  const analytics = useMemo(() => {
    const totalProducts = allItems.length;

    // Status counts
    const statusCounts: Record<ProductStatus, number> = {
      idea: 0,
      designing: 0,
      'sample-ordered': 0,
      'in-revision': 0,
      approved: 0,
      'production-ready': 0,
    };
    for (const item of allItems) {
      statusCounts[item.status]++;
    }

    // Production ready count
    const productionReadyCount = statusCounts['production-ready'];

    // Active pipeline count
    const activePipelineCount = PIPELINE_STATUSES.reduce(
      (acc, s) => acc + statusCounts[s],
      0
    );

    // In revision count
    const inRevisionCount = statusCounts['in-revision'];

    // Avg margin
    const itemsWithCosting = allItems.filter(
      (item) => item.costing && item.costing.targetSellingPrice > 0
    );
    let avgMargin: number | null = null;
    if (itemsWithCosting.length > 0) {
      const margins = itemsWithCosting.map((item) => {
        const totalCost = calcTotalCost(item.costing!);
        return calcMargin(item.costing!.targetSellingPrice, totalCost);
      });
      avgMargin = margins.reduce((a, b) => a + b, 0) / margins.length;
    }

    // Category health
    const categoryHealth = categories.map((cat) => {
      const catItems = cat.items;
      const prodReadyCount = catItems.filter((i) => i.status === 'production-ready').length;
      const catItemsWithCosting = catItems.filter(
        (i) => i.costing && i.costing.targetSellingPrice > 0
      );
      let catAvgMargin: number | null = null;
      if (catItemsWithCosting.length > 0) {
        const margins = catItemsWithCosting.map((i) => {
          const tc = calcTotalCost(i.costing!);
          return calcMargin(i.costing!.targetSellingPrice, tc);
        });
        catAvgMargin = margins.reduce((a, b) => a + b, 0) / margins.length;
      }
      return {
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        itemCount: catItems.length,
        productionReadyCount: prodReadyCount,
        avgMargin: catAvgMargin,
      };
    });

    // Recent activity: 8 most recently updated items
    const recentActivity = [...allItems]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 8);

    return {
      totalProducts,
      statusCounts,
      productionReadyCount,
      activePipelineCount,
      inRevisionCount,
      avgMargin,
      categoryHealth,
      recentActivity,
    };
  }, [allItems, categories]);

  const avgMarginDisplay =
    analytics.avgMargin !== null ? `${analytics.avgMargin.toFixed(1)}%` : 'N/A';

  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      <div className="max-w-screen-2xl mx-auto px-6 py-6">

        {/* ── Page Header ─────────────────────────────────────────────── */}
        <motion.div {...fadeUp} className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-0.5">
              Analytics
            </h1>
            <p className="text-sm text-slate-500">Business overview at a glance</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-semibold text-slate-700">March 2026</span>
          </div>
        </motion.div>

        {/* ── KPI Cards ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard
            index={0}
            icon={<Package className="w-5 h-5" />}
            iconBg="#eef2ff"
            iconColor="#6366f1"
            value={String(analytics.totalProducts)}
            label="Total Products"
            trend="+3 this month"
            trendUp={true}
          />
          <KpiCard
            index={1}
            icon={<TrendingUp className="w-5 h-5" />}
            iconBg="#ecfdf5"
            iconColor="#10b981"
            value={avgMarginDisplay}
            label="Avg Gross Margin"
            trend="+2.1% vs last month"
            trendUp={true}
          />
          <KpiCard
            index={2}
            icon={<CheckCircle className="w-5 h-5" />}
            iconBg="#eef2ff"
            iconColor="#6366f1"
            value={String(analytics.productionReadyCount)}
            label="Production Ready"
            trend="+1 this month"
            trendUp={true}
          />
          <KpiCard
            index={3}
            icon={<Zap className="w-5 h-5" />}
            iconBg="#fffbeb"
            iconColor="#f59e0b"
            value={String(analytics.activePipelineCount)}
            label="Active Pipeline"
            trend="-1 vs last month"
            trendUp={false}
          />
        </div>

        {/* ── Two-Column Layout ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Pipeline Status — 2 cols wide */}
          <motion.div
            {...stagger(0)}
            className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-slate-800">Pipeline Status</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {analytics.totalProducts} products across all stages
                </p>
              </div>
            </div>

            {/* Stacked bar */}
            <StackedBar
              counts={analytics.statusCounts}
              total={analytics.totalProducts}
            />

            {/* Legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-5">
              {ALL_STATUSES.map((status) => {
                const count = analytics.statusCounts[status];
                const pct =
                  analytics.totalProducts > 0
                    ? Math.round((count / analytics.totalProducts) * 100)
                    : 0;
                return (
                  <div key={status} className="flex items-center gap-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: STATUS_COLOR[status] }}
                    />
                    <span className="text-xs text-slate-600">
                      {STATUS_LABEL[status]}{' '}
                      <span className="text-slate-400">
                        ({count} · {pct}%)
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Status breakdown rows */}
            <div className="mt-6 space-y-3">
              {ALL_STATUSES.map((status) => {
                const count = analytics.statusCounts[status];
                const pct =
                  analytics.totalProducts > 0
                    ? (count / analytics.totalProducts) * 100
                    : 0;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <div className="w-28 flex-shrink-0">
                      <span
                        className="text-xs font-medium"
                        style={{ color: STATUS_COLOR[status] }}
                      >
                        {STATUS_LABEL[status]}
                      </span>
                    </div>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: STATUS_COLOR[status] }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 w-6 text-right flex-shrink-0">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity — 1 col wide */}
          <motion.div
            {...stagger(1)}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800">Recent Activity</h2>
              <Clock className="w-4 h-4 text-slate-300" />
            </div>
            <div>
              {analytics.recentActivity.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No recent activity</p>
              ) : (
                analytics.recentActivity.map((item, i) => (
                  <ActivityItem
                    key={item.id}
                    name={item.name}
                    status={item.status}
                    updatedAt={item.updatedAt}
                    index={i}
                  />
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Category Health ──────────────────────────────────────────── */}
        <motion.div {...stagger(2)} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800">Category Health</h2>
            <p className="text-xs text-slate-400">Production-ready progress per category</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {analytics.categoryHealth.map((cat, i) => (
              <CategoryHealthCard
                key={cat.id}
                name={cat.name}
                icon={cat.icon}
                color={cat.color}
                itemCount={cat.itemCount}
                productionReadyCount={cat.productionReadyCount}
                avgMargin={cat.avgMargin}
                index={i}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Insights Panel ───────────────────────────────────────────── */}
        <motion.div {...stagger(3)} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold text-slate-800">Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InsightCard
              index={0}
              icon={<AlertCircle className="w-4 h-4" />}
              text={
                analytics.inRevisionCount > 0
                  ? `${analytics.inRevisionCount} product${analytics.inRevisionCount !== 1 ? 's are' : ' is'} stuck in revision. Review and approve samples to keep your pipeline moving.`
                  : 'No products are currently in revision. Your pipeline is flowing smoothly!'
              }
              bg="#fff7ed"
              iconColor="#f97316"
              borderColor="#fed7aa"
            />
            <InsightCard
              index={1}
              icon={<Info className="w-4 h-4" />}
              text={
                analytics.avgMargin !== null
                  ? `Your average margin is ${analytics.avgMargin.toFixed(1)}% — industry average is 45%. ${analytics.avgMargin >= 45 ? 'Great work!' : 'Consider reviewing your pricing or reducing costs.'}`
                  : 'Add costing data to your products to see your average margin performance.'
              }
              bg="#eff6ff"
              iconColor="#3b82f6"
              borderColor="#bfdbfe"
            />
            <InsightCard
              index={2}
              icon={<Zap className="w-4 h-4" />}
              text={
                analytics.productionReadyCount > 0
                  ? `${analytics.productionReadyCount} product${analytics.productionReadyCount !== 1 ? 's are' : ' is'} production-ready and waiting to launch. Consider scheduling your next drop!`
                  : 'No products are production-ready yet. Keep pushing through your pipeline!'
              }
              bg="#ecfdf5"
              iconColor="#10b981"
              borderColor="#a7f3d0"
            />
          </div>
        </motion.div>

        {/* ── More Analytics Coming Soon ───────────────────────────────── */}
        <motion.div {...stagger(4)}>
          <div className="bg-white rounded-2xl shadow-sm border border-dashed border-slate-200 p-10 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
              <BarChart3 className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-base font-bold text-slate-700 mb-1.5">More Analytics Coming Soon</h3>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Revenue forecasts, supplier scorecards, seasonal trend analysis, and export reports are on the roadmap.
            </p>
            <div className="flex items-center gap-1.5 mt-4 text-xs text-indigo-500 font-semibold">
              Stay tuned
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
