'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, Plus, Search,
  Pencil, Trash2, Copy, Home, Sparkles
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { STATUS_COLOR } from '@/constants/statusConfig';
import type { Category, ProductItem } from '@/types';

export default function LeftSidebar() {
  const {
    categories, activeItemId,
    sidebarExpanded,
    setActiveItem, toggleCategoryExpanded,
    openNewCategoryModal, openNewItemModal,
    deleteCategory, deleteItem, duplicateItem,
    currentView, setCurrentView, setActiveNavTab,
    searchQuery, setSearchQuery,
  } = useAppStore();

  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    type: 'category' | 'item';
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  if (!sidebarExpanded) return null;

  const filteredCategories = searchQuery
    ? categories.map((cat) => ({
        ...cat,
        items: cat.items.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((cat) => cat.items.length > 0 || cat.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : categories;

  const handleItemClick = (item: ProductItem) => {
    setActiveItem(item.id);
  };

  const handleContextMenu = (
    e: React.MouseEvent,
    type: 'category' | 'item',
    id: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ type, id, x: e.clientX, y: e.clientY });
  };

  const closeContext = () => setContextMenu(null);

  return (
    <>
      <motion.aside
        initial={{ width: 260 }}
        animate={{ width: 260 }}
        className="h-full bg-white border-r border-slate-100 flex flex-col flex-shrink-0 overflow-hidden"
      >
        {/* Sidebar Header */}
        <div className="px-3 pt-3 pb-2 flex-shrink-0">
          {/* Home / Dashboard link */}
          <button
            onClick={() => { setCurrentView('dashboard'); setActiveNavTab('home'); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all mb-2 group ${
              currentView === 'dashboard'
                ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
              currentView === 'dashboard'
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm'
                : 'bg-slate-100 group-hover:bg-indigo-100'
            }`}>
              <Home size={12} className={currentView === 'dashboard' ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'} />
            </div>
            <span>Home</span>
            {currentView === 'dashboard' && (
              <Sparkles size={11} className="ml-auto text-indigo-400" />
            )}
          </button>

          {/* Search */}
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200 text-slate-600 placeholder-slate-400 transition-all"
            />
          </div>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-3">
          {/* Section label */}
          <div className="flex items-center justify-between py-2 mb-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1">
              Product Categories
            </span>
            <button
              onClick={openNewCategoryModal}
              className="w-5 h-5 rounded-md flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              <Plus size={12} />
            </button>
          </div>

          <AnimatePresence initial={false}>
            {filteredCategories.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-slate-400">No results found</p>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <CategoryGroup
                  key={category.id}
                  category={category}
                  activeItemId={activeItemId}
                  onItemClick={handleItemClick}
                  onToggle={() => toggleCategoryExpanded(category.id)}
                  onAddItem={() => openNewItemModal(category.id)}
                  onContextMenu={(e, type, id) => handleContextMenu(e, type, id)}
                  hoveredItemId={hoveredItemId}
                  setHoveredItemId={setHoveredItemId}
                  editingId={editingId}
                  editingName={editingName}
                  setEditingId={setEditingId}
                  setEditingName={setEditingName}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Add Category Button */}
        <div className="px-3 pb-4 flex-shrink-0 border-t border-slate-50 pt-3">
          <button
            onClick={openNewCategoryModal}
            className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all"
          >
            <Plus size={13} />
            Add Category
          </button>
        </div>
      </motion.aside>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <>
            <div className="fixed inset-0 z-50" onClick={closeContext} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ top: contextMenu.y, left: contextMenu.x }}
              className="fixed z-50 bg-white border border-slate-100 rounded-xl shadow-xl py-1 w-44 overflow-hidden"
            >
              {contextMenu.type === 'item' && (
                <>
                  <button
                    onClick={() => { duplicateItem(contextMenu.id); closeContext(); }}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Copy size={13} className="text-slate-400" />
                    Duplicate
                  </button>
                  <div className="h-px bg-slate-100 my-1" />
                  <button
                    onClick={() => { deleteItem(contextMenu.id); closeContext(); }}
                    className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </>
              )}
              {contextMenu.type === 'category' && (
                <>
                  <button
                    onClick={() => { openNewItemModal(contextMenu.id); closeContext(); }}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Plus size={13} className="text-slate-400" />
                    Add Product
                  </button>
                  <div className="h-px bg-slate-100 my-1" />
                  <button
                    onClick={() => { deleteCategory(contextMenu.id); closeContext(); }}
                    className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 size={13} />
                    Delete Category
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ------------------------------------------------------------------
// Category Group Component
// ------------------------------------------------------------------
interface CategoryGroupProps {
  category: Category;
  activeItemId: string | null;
  onItemClick: (item: ProductItem) => void;
  onToggle: () => void;
  onAddItem: () => void;
  onContextMenu: (e: React.MouseEvent, type: 'category' | 'item', id: string) => void;
  hoveredItemId: string | null;
  setHoveredItemId: (id: string | null) => void;
  editingId: string | null;
  editingName: string;
  setEditingId: (id: string | null) => void;
  setEditingName: (name: string) => void;
}

function CategoryGroup({
  category, activeItemId, onItemClick, onToggle,
  onAddItem, onContextMenu, hoveredItemId, setHoveredItemId,
}: CategoryGroupProps) {
  const { updateCategory } = useAppStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);

  const handleRenameSubmit = () => {
    if (editName.trim()) {
      updateCategory(category.id, { name: editName.trim() });
    }
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="mb-1"
    >
      {/* Category Header */}
      <div
        className="group flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-all"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onContextMenu={(e) => onContextMenu(e, 'category', category.id)}
      >
        {/* Expand arrow */}
        <button onClick={onToggle} className="flex-shrink-0">
          <motion.div
            animate={{ rotate: category.isExpanded ? 90 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <ChevronRight size={13} className="text-slate-400" />
          </motion.div>
        </button>

        {/* Color dot + icon */}
        <div
          className="w-5 h-5 rounded-md flex items-center justify-center text-[11px] flex-shrink-0"
          style={{ backgroundColor: `${category.color}20` }}
        >
          <span>{category.icon}</span>
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0" onClick={onToggle}>
          {isEditing ? (
            <input
              autoFocus
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={(e) => { if (e.key === 'Enter') handleRenameSubmit(); if (e.key === 'Escape') setIsEditing(false); }}
              className="w-full text-xs font-semibold text-slate-800 bg-transparent border-b border-indigo-300 focus:outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="text-xs font-semibold text-slate-700 truncate block">
              {category.name}
            </span>
          )}
        </div>

        {/* Item count */}
        <span className="text-[10px] text-slate-400 font-medium flex-shrink-0">
          {category.items.length}
        </span>

        {/* Actions */}
        <div className={`flex items-center gap-0.5 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); setEditName(category.name); }}
            className="w-5 h-5 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Pencil size={10} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onAddItem(); }}
            className="w-5 h-5 rounded-md flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
          >
            <Plus size={11} />
          </button>
        </div>
      </div>

      {/* Items List */}
      <AnimatePresence initial={false}>
        {category.isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="ml-4 pl-3 border-l-2 mt-0.5 mb-1" style={{ borderColor: `${category.color}40` }}>
              {category.items.length === 0 ? (
                <div className="py-2 px-2">
                  <p className="text-[11px] text-slate-400 italic">No products yet</p>
                </div>
              ) : (
                category.items.map((item) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    isActive={activeItemId === item.id}
                    isHovered={hoveredItemId === item.id}
                    categoryColor={category.color}
                    onHover={(id) => setHoveredItemId(id)}
                    onClick={onItemClick}
                    onContextMenu={(e) => onContextMenu(e, 'item', item.id)}
                  />
                ))
              )}

              {/* Add Item button */}
              <button
                onClick={onAddItem}
                className="w-full flex items-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] text-slate-400 hover:text-indigo-500 hover:bg-indigo-50/60 transition-all mt-0.5"
              >
                <Plus size={11} />
                Add product
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ------------------------------------------------------------------
// Sidebar Item Row
// ------------------------------------------------------------------
interface SidebarItemProps {
  item: ProductItem;
  isActive: boolean;
  isHovered: boolean;
  categoryColor: string;
  onHover: (id: string | null) => void;
  onClick: (item: ProductItem) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

function SidebarItem({ item, isActive, isHovered, categoryColor, onHover, onClick, onContextMenu }: SidebarItemProps) {
  return (
    <motion.div
      layout
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
      onContextMenu={onContextMenu}
      onClick={() => onClick(item)}
      className={`group flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all ${
        isActive
          ? 'bg-indigo-50 border border-indigo-100'
          : 'hover:bg-slate-50'
      }`}
    >
      {/* Color indicator */}
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: isActive ? categoryColor : '#CBD5E1' }}
      />

      {/* Name */}
      <span className={`text-xs flex-1 truncate font-medium transition-colors ${
        isActive ? 'text-indigo-700' : 'text-slate-600 group-hover:text-slate-800'
      }`}>
        {item.name}
      </span>

      {/* Status dot */}
      <div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-70"
        style={{
          backgroundColor: STATUS_COLOR[item.status as keyof typeof STATUS_COLOR] || '#9CA3AF'
        }}
      />
    </motion.div>
  );
}
