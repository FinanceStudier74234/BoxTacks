'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, Plus, Download, Save, Check,
  LayoutDashboard, Package, Layers, Factory,
  Image, BarChart3, BookTemplate, Menu, X,
  ChevronDown, Sparkles, Home
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';

const NAV_TABS = [
  { id: 'home',          label: 'Home',          icon: Home,          view: 'dashboard'      },
  { id: 'Workspace',     label: 'Workspace',     icon: LayoutDashboard, view: 'workspace'    },
  { id: 'Templates',     label: 'Templates',     icon: BookTemplate,  view: 'templates'      },
  { id: 'Manufacturing', label: 'Manufacturing', icon: Factory,       view: 'dashboard'      },
  { id: 'Inventory',     label: 'Inventory',     icon: Package,       view: 'dashboard'      },
  { id: 'Brand Assets',  label: 'Brand Assets',  icon: Image,         view: 'dashboard'      },
  { id: 'Analytics',     label: 'Analytics',     icon: BarChart3,     view: 'dashboard'      },
];

export default function TopNavigation() {
  const {
    activeNavTab, setActiveNavTab,
    setCurrentView, currentView,
    searchQuery, setSearchQuery,
    isDirty, triggerSave,
    openNewCategoryModal, openNewItemModal,
    sidebarExpanded, setSidebarExpanded,
    getActiveItem, setNotification,
  } = useAppStore();

  const [showNewMenu, setShowNewMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const activeItem = getActiveItem();

  const handleNavClick = (tab: typeof NAV_TABS[0]) => {
    setActiveNavTab(tab.id);
    setCurrentView(tab.view as any);
  };

  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center px-3 gap-2 z-40 relative shadow-sm flex-shrink-0">

      {/* ── Sidebar toggle + Logo ── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {sidebarExpanded ? <X size={16} /> : <Menu size={16} />}
        </button>

        {/* Logo — always navigates home */}
        <button
          onClick={() => { setCurrentView('dashboard'); setActiveNavTab('home'); }}
          className="flex items-center gap-2 group"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm group-hover:shadow-brand transition-shadow">
            <span className="text-white font-extrabold text-xs">BT</span>
          </div>
          <span className="font-extrabold text-slate-900 text-sm hidden sm:block tracking-tight">
            Boxtacks
          </span>
        </button>

        {/* Workspace breadcrumb (shown when in workspace view) */}
        {currentView === 'workspace' && activeItem && (
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 ml-1 border-l border-slate-100 pl-3">
            <span className="font-medium text-slate-600 truncate max-w-28">{activeItem.name}</span>
          </div>
        )}
      </div>

      {/* ── Nav tabs (center, hidden on small screens) ── */}
      <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
        {NAV_TABS.slice(0, 5).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeNavTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleNavClick(tab)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon size={13} />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute -bottom-[9px] left-0 right-0 h-0.5 bg-indigo-500 rounded-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Right Controls ── */}
      <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">

        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            size={13}
            className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${searchFocused ? 'text-indigo-400' : 'text-slate-400'}`}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search products..."
            className={`pl-8 pr-3 py-1.5 text-xs bg-slate-50 border rounded-xl focus:outline-none text-slate-700 placeholder-slate-400 transition-all ${
              searchFocused
                ? 'w-52 ring-2 ring-indigo-200 border-indigo-300 bg-white'
                : 'w-40 border-slate-200 hover:border-slate-300'
            }`}
          />
        </div>

        {/* Save indicator */}
        <button
          onClick={triggerSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isDirty
              ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200'
              : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
          }`}
        >
          {isDirty ? <Save size={12} /> : <Check size={12} />}
          <span className="hidden sm:block">{isDirty ? 'Save' : 'Saved'}</span>
        </button>

        {/* ── NEW button ── */}
        <div className="relative">
          <button
            onClick={() => setShowNewMenu(!showNewMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-brand hover:opacity-95 transition-all"
          >
            <Plus size={13} />
            <span className="hidden sm:block">Create</span>
            <ChevronDown size={10} className="hidden sm:block opacity-70" />
          </button>

          <AnimatePresence>
            {showNewMenu && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden py-2"
              >
                {/* New design CTA */}
                <div className="px-4 pt-1 pb-2 border-b border-slate-50">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Start designing</p>
                </div>
                <button
                  onClick={() => {
                    setCurrentView('dashboard');
                    setActiveNavTab('home');
                    setShowNewMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-3"
                >
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={12} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs">New design</p>
                    <p className="text-[10px] text-slate-400">Pick a product type</p>
                  </div>
                </button>
                <button
                  onClick={() => { openNewItemModal(); setShowNewMenu(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-3"
                >
                  <div className="w-7 h-7 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Package size={12} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs">Blank product</p>
                    <p className="text-[10px] text-slate-400">Start from scratch</p>
                  </div>
                </button>
                <button
                  onClick={() => { openNewCategoryModal(); setShowNewMenu(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-3"
                >
                  <div className="w-7 h-7 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <Layers size={12} className="text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs">New category</p>
                    <p className="text-[10px] text-slate-400">Organise products</p>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {showNewMenu && <div className="fixed inset-0 z-40" onClick={() => setShowNewMenu(false)} />}
        </div>

        {/* Export */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <Download size={13} />
            <span className="hidden sm:block">Export</span>
          </button>
          <AnimatePresence>
            {showExportMenu && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                className="absolute right-0 top-full mt-2 w-40 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1"
              >
                {['Export PNG', 'Export PDF', 'Export Mockup', 'Export Specs'].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setNotification({ type: 'info', message: `${item} — coming soon!` });
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {showExportMenu && <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />}
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-400 rounded-full" />
        </button>

        {/* Avatar */}
        <button className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm">
          A
        </button>
      </div>
    </header>
  );
}
