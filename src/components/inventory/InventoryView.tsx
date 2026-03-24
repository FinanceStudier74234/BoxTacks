'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Grid3X3,
  List,
  Filter,
  Package,
  Tag,
  DollarSign,
  Clock,
  ArrowRight,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import type { ProductItem, Category, ProductStatus } from '@/types';
import { formatCurrency, calcTotalCost, getRelativeTime } from '@/lib/utils';
import { STATUS_COLOR, STATUS_LABEL, STATUS_BG, ALL_STATUSES } from '@/constants/statusConfig';

type SortKey = 'name' | 'date' | 'status';
type ViewMode = 'grid' | 'list';

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BADGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function InlineStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
      style={{
        backgroundColor: STATUS_BG[status],
        color: STATUS_COLOR[status],
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: STATUS_COLOR[status] }}
      />
      {STATUS_LABEL[status]}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SELECT DROPDOWN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
}

function Select({ value, onChange, options, placeholder, className = '' }: SelectProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 cursor-pointer"
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT GRID CARD
// ─────────────────────────────────────────────────────────────────────────────
interface ProductCardProps {
  item: ProductItem;
  category: Category | undefined;
  onOpen: () => void;
}

function ProductGridCard({ item, category, onOpen }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);

  const cardColor = item.color || category?.color || '#6366f1';
  const initials = item.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const totalCost = item.costing ? calcTotalCost(item.costing) : null;
  const visibleTags = item.tags.slice(0, 2);
  const extraTagCount = item.tags.length - 2;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.18 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
      className="relative bg-white rounded-2xl overflow-hidden border border-slate-100 cursor-pointer group"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
    >
      {/* Colored top strip */}
      <div
        className="h-2 w-full"
        style={{ backgroundColor: cardColor }}
      />

      {/* Card body */}
      <div className="p-4">
        {/* Top badges row */}
        <div className="flex items-start justify-between mb-3">
          {/* Category badge */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5">
            <span className="text-xs">{category?.icon || '📦'}</span>
            <span className="text-xs text-slate-500 font-medium truncate max-w-[80px]">
              {category?.name || 'Uncategorized'}
            </span>
          </div>
          {/* Status badge */}
          <InlineStatusBadge status={item.status} />
        </div>

        {/* Large initials circle */}
        <div className="flex justify-center mb-3">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-sm"
            style={{ backgroundColor: cardColor }}
          >
            {initials}
          </div>
        </div>

        {/* Product name */}
        <h3 className="font-semibold text-slate-800 text-sm text-center truncate mb-0.5">
          {item.name}
        </h3>

        {/* SKU */}
        <p className="text-xs text-slate-400 font-mono text-center mb-3">
          {item.sku}
        </p>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center mb-3">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5 text-xs text-slate-500"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
            {extraTagCount > 0 && (
              <span className="inline-flex items-center bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5 text-xs text-slate-400">
                +{extraTagCount} more
              </span>
            )}
          </div>
        )}

        {/* Costing */}
        {totalCost !== null && totalCost > 0 && (
          <div className="flex items-center justify-center gap-1 text-xs text-slate-500 mb-3">
            <DollarSign className="w-3 h-3" />
            <span className="font-medium text-slate-700">
              {formatCurrency(item.costing!.unitCost)}
            </span>
            <span>unit cost</span>
          </div>
        )}

        {/* Open button */}
        <button
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150"
          style={{
            backgroundColor: hovered ? cardColor : '#f8fafc',
            color: hovered ? '#fff' : '#64748b',
            border: `1px solid ${hovered ? cardColor : '#e2e8f0'}`,
          }}
        >
          Open in Workspace
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Hover overlay */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${cardColor}08, ${cardColor}14)`,
              border: `1.5px solid ${cardColor}40`,
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT LIST ROW
// ─────────────────────────────────────────────────────────────────────────────
interface ListRowProps {
  item: ProductItem;
  category: Category | undefined;
  onOpen: () => void;
  index: number;
}

function ProductListRow({ item, category, onOpen, index }: ListRowProps) {
  const cardColor = item.color || category?.color || '#6366f1';
  const visibleTags = item.tags.slice(0, 2);
  const extraTagCount = item.tags.length - 2;
  const totalCost = item.costing ? calcTotalCost(item.costing) : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ delay: index * 0.03, duration: 0.18 }}
      onClick={onOpen}
      className="flex items-center gap-4 px-4 py-3 bg-white border-b border-slate-50 hover:bg-slate-50/70 cursor-pointer group transition-colors duration-100"
    >
      {/* Color indicator */}
      <div
        className="w-1 h-10 rounded-full flex-shrink-0"
        style={{ backgroundColor: cardColor }}
      />

      {/* Product name + SKU */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 text-sm truncate">{item.name}</p>
        <p className="text-xs text-slate-400 font-mono">{item.sku}</p>
      </div>

      {/* Category */}
      <div className="hidden sm:flex items-center gap-1 w-28 flex-shrink-0">
        <span className="text-sm">{category?.icon || '📦'}</span>
        <span className="text-xs text-slate-500 truncate">{category?.name || '—'}</span>
      </div>

      {/* Status */}
      <div className="hidden md:block w-36 flex-shrink-0">
        <InlineStatusBadge status={item.status} />
      </div>

      {/* Type */}
      <div className="hidden lg:block w-24 flex-shrink-0">
        <span className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5">
          {item.type}
        </span>
      </div>

      {/* Tags */}
      <div className="hidden xl:flex items-center gap-1 w-36 flex-shrink-0 flex-wrap">
        {visibleTags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-slate-50 border border-slate-100 text-slate-500 rounded-full px-1.5 py-0.5"
          >
            {tag}
          </span>
        ))}
        {extraTagCount > 0 && (
          <span className="text-xs text-slate-400">+{extraTagCount}</span>
        )}
      </div>

      {/* Unit cost */}
      <div className="hidden lg:block w-24 text-right flex-shrink-0">
        {totalCost !== null && item.costing!.unitCost > 0 ? (
          <span className="text-sm font-medium text-slate-700">
            {formatCurrency(item.costing!.unitCost)}
          </span>
        ) : (
          <span className="text-xs text-slate-300">—</span>
        )}
      </div>

      {/* Updated date */}
      <div className="hidden xl:flex items-center gap-1 w-28 flex-shrink-0">
        <Clock className="w-3 h-3 text-slate-300" />
        <span className="text-xs text-slate-400">{getRelativeTime(item.updatedAt)}</span>
      </div>

      {/* Actions */}
      <button
        onClick={(e) => { e.stopPropagation(); onOpen(); }}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0"
      >
        Open
        <ArrowRight className="w-3 h-3" />
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────
function EmptyInventory({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 px-8 text-center"
    >
      <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-5 shadow-sm">
        <span className="text-4xl">📦</span>
      </div>
      <h3 className="text-xl font-bold text-slate-700 mb-2">No products found</h3>
      <p className="text-sm text-slate-400 max-w-xs mb-6 leading-relaxed">
        Your inventory is empty or no products match your current filters. Start by adding your first product.
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors duration-150 shadow-sm shadow-indigo-200"
      >
        <Plus className="w-4 h-4" />
        Add First Product
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT PILL
// ─────────────────────────────────────────────────────────────────────────────
function StatPill({ status, count, active, onClick }: { status: ProductStatus; count: number; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 focus:outline-none"
      style={
        active
          ? {
              backgroundColor: STATUS_COLOR[status],
              borderColor: STATUS_COLOR[status],
              color: '#fff',
            }
          : {
              backgroundColor: STATUS_BG[status],
              borderColor: `${STATUS_COLOR[status]}30`,
              color: STATUS_COLOR[status],
            }
      }
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: active ? '#ffffff80' : STATUS_COLOR[status] }}
      />
      <span>{STATUS_LABEL[status]}</span>
      <span
        className="font-bold ml-0.5 px-1.5 py-0.5 rounded-full text-[10px]"
        style={
          active
            ? { backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff' }
            : { backgroundColor: STATUS_COLOR[status], color: '#fff' }
        }
      >
        {count}
      </span>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN INVENTORY VIEW
// ─────────────────────────────────────────────────────────────────────────────
export default function InventoryView() {
  const {
    categories,
    getAllItems,
    setActiveItem,
    openNewItemModal,
    setCurrentView,
    setActiveNavTab,
  } = useAppStore();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<ProductStatus | ''>('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const allItems = getAllItems();

  // Category map for quick lookup
  const categoryMap = useMemo(() => {
    const map: Record<string, Category> = {};
    for (const cat of categories) {
      map[cat.id] = cat;
    }
    return map;
  }, [categories]);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<ProductStatus, number> = {
      idea: 0,
      designing: 0,
      'sample-ordered': 0,
      'in-revision': 0,
      approved: 0,
      'production-ready': 0,
    };
    for (const item of allItems) {
      counts[item.status]++;
    }
    return counts;
  }, [allItems]);

  // Filtered + sorted items
  const filteredItems = useMemo(() => {
    let result = [...allItems];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filterStatus) {
      result = result.filter((item) => item.status === filterStatus);
    }

    if (filterCategory) {
      result = result.filter((item) => item.categoryId === filterCategory);
    }

    result.sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name);
      if (sortKey === 'status') return a.status.localeCompare(b.status);
      // date: most recently updated first
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return result;
  }, [allItems, search, filterStatus, filterCategory, sortKey]);

  function handleOpenItem(id: string) {
    setActiveItem(id);
    setCurrentView('workspace');
    setActiveNavTab('Workspace');
  }

  const categoryOptions = categories.map((c) => ({ label: c.name, value: c.id }));
  const statusOptions = ALL_STATUSES.map((s) => ({ label: STATUS_LABEL[s], value: s }));
  const sortOptions: { label: string; value: SortKey }[] = [
    { label: 'Name', value: 'name' },
    { label: 'Date', value: 'date' },
    { label: 'Status', value: 'status' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Product Inventory
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {allItems.length} {allItems.length === 1 ? 'product' : 'products'} across{' '}
              {categories.length} {categories.length === 1 ? 'category' : 'categories'}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openNewItemModal()}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors duration-150 shadow-sm shadow-indigo-200"
          >
            <Plus className="w-4 h-4" />
            New Product
          </motion.button>
        </div>

        {/* ── Filter / Sort Row ────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, SKU, tags…"
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
            />
          </div>

          {/* Status filter */}
          <Select
            value={filterStatus}
            onChange={(v) => setFilterStatus(v as ProductStatus | '')}
            options={statusOptions}
            placeholder="All Status"
          />

          {/* Category filter */}
          <Select
            value={filterCategory}
            onChange={setFilterCategory}
            options={categoryOptions}
            placeholder="All Categories"
          />

          {/* Sort */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <Select
              value={sortKey}
              onChange={(v) => setSortKey(v as SortKey)}
              options={sortOptions}
              placeholder="Sort by"
            />
          </div>

          <div className="ml-auto flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            {/* Grid view toggle */}
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all duration-150 ${
                viewMode === 'grid'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-label="Grid view"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            {/* List view toggle */}
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all duration-150 ${
                viewMode === 'list'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Stats Strip ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mt-4">
          {ALL_STATUSES.map((status) => (
            <StatPill
              key={status}
              status={status}
              count={statusCounts[status]}
              active={filterStatus === status}
              onClick={() => setFilterStatus(filterStatus === status ? '' : status)}
            />
          ))}
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="px-6 py-6">
        <AnimatePresence mode="wait">
          {filteredItems.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyInventory onAdd={() => openNewItemModal()} />
            </motion.div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <motion.div
              key="grid"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <ProductGridCard
                    key={item.id}
                    item={item}
                    category={categoryMap[item.categoryId]}
                    onOpen={() => handleOpenItem(item.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* LIST VIEW */
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm"
            >
              {/* List header */}
              <div className="flex items-center gap-4 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                <div className="w-1 flex-shrink-0" />
                <div className="flex-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Product
                </div>
                <div className="hidden sm:block w-28 text-xs font-semibold text-slate-400 uppercase tracking-wider flex-shrink-0">
                  Category
                </div>
                <div className="hidden md:block w-36 text-xs font-semibold text-slate-400 uppercase tracking-wider flex-shrink-0">
                  Status
                </div>
                <div className="hidden lg:block w-24 text-xs font-semibold text-slate-400 uppercase tracking-wider flex-shrink-0">
                  Type
                </div>
                <div className="hidden xl:block w-36 text-xs font-semibold text-slate-400 uppercase tracking-wider flex-shrink-0">
                  Tags
                </div>
                <div className="hidden lg:block w-24 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider flex-shrink-0">
                  Unit Cost
                </div>
                <div className="hidden xl:block w-28 text-xs font-semibold text-slate-400 uppercase tracking-wider flex-shrink-0">
                  Updated
                </div>
                <div className="w-20 flex-shrink-0" />
              </div>
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, idx) => (
                  <ProductListRow
                    key={item.id}
                    item={item}
                    category={categoryMap[item.categoryId]}
                    onOpen={() => handleOpenItem(item.id)}
                    index={idx}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
