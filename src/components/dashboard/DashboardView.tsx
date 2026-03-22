'use client';

import { motion } from 'framer-motion';
import {
  Package, Layers, TrendingUp, Factory, CheckCircle,
  Clock, ArrowRight, Plus, Zap, BarChart3, Star
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatCurrency, calcTotalCost, calcMargin, getRelativeTime } from '@/lib/utils';
import type { ProductItem } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function DashboardView() {
  const {
    categories, getAllItems, setActiveItem,
    openNewCategoryModal, openNewItemModal, setCurrentView, setActiveNavTab,
  } = useAppStore();

  const allItems = getAllItems();
  const totalProducts = allItems.length;
  const totalCategories = categories.length;
  const productionReady = allItems.filter((i) => i.status === 'production-ready').length;
  const inProgress = allItems.filter((i) => ['designing', 'sample-ordered', 'in-revision'].includes(i.status)).length;

  const recentItems = [...allItems]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const statusBreakdown = [
    { label: 'Idea', status: 'idea', count: allItems.filter((i) => i.status === 'idea').length, color: '#9CA3AF' },
    { label: 'Designing', status: 'designing', count: allItems.filter((i) => i.status === 'designing').length, color: '#3B82F6' },
    { label: 'Sample', status: 'sample-ordered', count: allItems.filter((i) => i.status === 'sample-ordered').length, color: '#F59E0B' },
    { label: 'In Revision', status: 'in-revision', count: allItems.filter((i) => i.status === 'in-revision').length, color: '#F97316' },
    { label: 'Approved', status: 'approved', count: allItems.filter((i) => i.status === 'approved').length, color: '#10B981' },
    { label: 'Production', status: 'production-ready', count: allItems.filter((i) => i.status === 'production-ready').length, color: '#6366F1' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto px-6 py-6 space-y-6"
      >
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Good morning 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {totalProducts} products across {totalCategories} categories · {productionReady} production ready
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openNewCategoryModal}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-white hover:shadow-sm transition-all"
            >
              <Plus size={14} />
              Category
            </button>
            <button
              onClick={() => openNewItemModal()}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-brand hover:opacity-90 transition-all"
            >
              <Plus size={14} />
              New Product
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Products"
            value={totalProducts}
            icon={<Package size={18} />}
            gradient="from-indigo-500 to-purple-600"
            change="+3 this month"
          />
          <StatCard
            label="Categories"
            value={totalCategories}
            icon={<Layers size={18} />}
            gradient="from-cyan-500 to-blue-500"
            change={`${categories.map(c => c.items.length).reduce((a, b) => a + b, 0)} items total`}
          />
          <StatCard
            label="Production Ready"
            value={productionReady}
            icon={<CheckCircle size={18} />}
            gradient="from-emerald-500 to-teal-500"
            change={`${Math.round((productionReady / totalProducts) * 100)}% of catalog`}
          />
          <StatCard
            label="In Progress"
            value={inProgress}
            icon={<Clock size={18} />}
            gradient="from-orange-400 to-rose-500"
            change="Needs attention"
          />
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Recent Products */}
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-slate-400" />
                <h2 className="font-semibold text-slate-800 text-sm">Recent Products</h2>
              </div>
              <button
                onClick={() => { setCurrentView('workspace'); setActiveNavTab('Products'); }}
                className="text-xs text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight size={12} />
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {recentItems.map((item) => (
                <RecentProductRow
                  key={item.id}
                  item={item}
                  categoryName={categories.find((c) => c.id === item.categoryId)?.name || ''}
                  categoryColor={categories.find((c) => c.id === item.categoryId)?.color || '#6366F1'}
                  onClick={() => setActiveItem(item.id)}
                />
              ))}
            </div>
          </motion.div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Status Overview */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={15} className="text-slate-400" />
                <h2 className="font-semibold text-slate-800 text-sm">Product Status</h2>
              </div>
              <div className="space-y-2.5">
                {statusBreakdown.map(({ label, count, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-xs text-slate-600 flex-1">{label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: totalProducts ? `${(count / totalProducts) * 100}%` : '0%',
                            backgroundColor: color,
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-500 w-4 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={15} className="text-slate-400" />
                <h2 className="font-semibold text-slate-800 text-sm">Quick Actions</h2>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Browse Templates', icon: Star, action: () => { setCurrentView('templates'); setActiveNavTab('Templates'); } },
                  { label: 'Add New Product', icon: Plus, action: () => openNewItemModal() },
                  { label: 'New Category', icon: Layers, action: openNewCategoryModal },
                ].map(({ label, icon: Icon, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                      <Icon size={13} className="text-indigo-500" />
                    </div>
                    {label}
                    <ArrowRight size={12} className="ml-auto text-slate-300 group-hover:text-indigo-400 transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Categories Overview */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <div className="flex items-center gap-2">
              <Layers size={15} className="text-slate-400" />
              <h2 className="font-semibold text-slate-800 text-sm">Categories Overview</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-y divide-slate-50">
            {categories.map((cat) => {
              const productionCount = cat.items.filter((i) => i.status === 'production-ready').length;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (cat.items[0]) setActiveItem(cat.items[0].id);
                  }}
                  className="p-5 text-left hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      {cat.icon}
                    </div>
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                  </div>
                  <p className="font-semibold text-sm text-slate-800">{cat.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{cat.items.length} products</p>
                  <div className="mt-2">
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: cat.items.length ? `${(productionCount / cat.items.length) * 100}%` : '0%',
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{productionCount}/{cat.items.length} ready</p>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Cost Summary */}
        <motion.div variants={itemVariants}>
          <CostSummary items={allItems} />
        </motion.div>
      </motion.div>
    </div>
  );
}

// ------------------------------------------------------------------
// Stat Card
// ------------------------------------------------------------------
function StatCard({
  label, value, icon, gradient, change,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  change: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-4 overflow-hidden relative">
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-full bg-gradient-to-br ${gradient} opacity-[0.07] -translate-y-4 translate-x-4`} />
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-3 shadow-sm`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{change}</p>
    </div>
  );
}

// ------------------------------------------------------------------
// Recent Product Row
// ------------------------------------------------------------------
function RecentProductRow({
  item, categoryName, categoryColor, onClick,
}: {
  item: ProductItem;
  categoryName: string;
  categoryColor: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors group text-left"
    >
      {/* Color swatch */}
      <div
        className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-sm"
        style={{
          background: item.color
            ? item.color
            : `linear-gradient(135deg, ${categoryColor}, ${categoryColor}88)`,
        }}
      >
        {item.name.slice(0, 2).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
            {item.name}
          </p>
          <StatusBadge status={item.status} size="sm" />
        </div>
        <p className="text-xs text-slate-400 mt-0.5 truncate">
          {categoryName} · {item.sku} · {getRelativeTime(item.updatedAt)}
        </p>
      </div>

      <div className="flex-shrink-0 text-right">
        {item.costing && (
          <p className="text-xs font-semibold text-slate-700">
            {formatCurrency(item.costing.retailPrice)}
          </p>
        )}
        <p className="text-xs text-slate-400">{item.type}</p>
      </div>

      <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
    </button>
  );
}

// ------------------------------------------------------------------
// Cost Summary
// ------------------------------------------------------------------
function CostSummary({ items }: { items: ProductItem[] }) {
  const itemsWithCost = items.filter((i) => i.costing && i.costing.retailPrice > 0);
  const avgMargin = itemsWithCost.length > 0
    ? itemsWithCost.reduce((sum, i) => {
        const cost = calcTotalCost(i.costing!);
        return sum + calcMargin(i.costing!.retailPrice, cost);
      }, 0) / itemsWithCost.length
    : 0;
  const totalRetailValue = itemsWithCost.reduce((sum, i) => sum + (i.costing?.retailPrice || 0), 0);
  const avgUnitCost = itemsWithCost.length > 0
    ? itemsWithCost.reduce((sum, i) => sum + calcTotalCost(i.costing!), 0) / itemsWithCost.length
    : 0;

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-5 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full -translate-y-24 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-16 -translate-x-8" />
      </div>
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-indigo-200" />
          <h2 className="font-semibold text-sm text-indigo-100">Cost & Margin Snapshot</h2>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-2xl font-bold">{Math.round(avgMargin)}%</p>
            <p className="text-xs text-indigo-200 mt-0.5">Avg. Margin</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{formatCurrency(avgUnitCost)}</p>
            <p className="text-xs text-indigo-200 mt-0.5">Avg. Unit Cost</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{itemsWithCost.length}</p>
            <p className="text-xs text-indigo-200 mt-0.5">Products Priced</p>
          </div>
        </div>
      </div>
    </div>
  );
}
