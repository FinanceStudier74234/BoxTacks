'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, ChevronDown, Plus, Download, Save,
  Check, LayoutDashboard, Package, BookTemplate, Factory,
  Database, Image, BarChart3, Menu, X
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';

const NAV_TABS = [
  { id: 'Workspace', label: 'Workspace', icon: LayoutDashboard },
  { id: 'Products', label: 'Products', icon: Package },
  { id: 'Templates', label: 'Templates', icon: BookTemplate },
  { id: 'Manufacturing', label: 'Manufacturing', icon: Factory },
  { id: 'Inventory', label: 'Inventory', icon: Database },
  { id: 'Brand Assets', label: 'Brand Assets', icon: Image },
  { id: 'Analytics', label: 'Analytics', icon: BarChart3 },
];

export default function TopNavigation() {
  const {
    activeNavTab, setActiveNavTab,
    setCurrentView, currentView,
    searchQuery, setSearchQuery,
    isDirty, lastSaved, triggerSave,
    setNotification,
    openNewCategoryModal, openNewItemModal,
    sidebarExpanded, setSidebarExpanded,
  } = useAppStore();

  const [showNewMenu, setShowNewMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleNavClick = (tabId: string) => {
    setActiveNavTab(tabId);
    if (tabId === 'Workspace') {
      setCurrentView('workspace');
    } else if (tabId === 'Templates') {
      setCurrentView('templates');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleSave = () => {
    triggerSave();
  };

  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center px-4 gap-3 z-40 relative shadow-sm flex-shrink-0">
      {/* Sidebar Toggle + Logo */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {sidebarExpanded ? <X size={16} /> : <Menu size={16} />}
        </button>

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => { setCurrentView('dashboard'); setActiveNavTab('Workspace'); }}
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xs">BT</span>
          </div>
          <span className="font-bold text-slate-900 text-sm hidden sm:block">Boxtacks</span>
        </div>

        <div className="w-px h-5 bg-slate-200 mx-1 hidden md:block" />

        {/* Project name */}
        <span className="text-sm text-slate-500 font-medium hidden md:block truncate max-w-32">
          My Brand Studio
        </span>
      </div>

      {/* Nav Tabs - center */}
      <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center overflow-x-auto">
        {NAV_TABS.slice(0, 5).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeNavTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleNavClick(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-44 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 text-slate-700 placeholder-slate-400 transition-all focus:w-56"
          />
        </div>

        {/* Save Status */}
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isDirty
              ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200'
              : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
          }`}
        >
          {isDirty ? (
            <>
              <Save size={12} />
              <span className="hidden sm:block">Save</span>
            </>
          ) : (
            <>
              <Check size={12} />
              <span className="hidden sm:block">Saved</span>
            </>
          )}
        </button>

        {/* New Button */}
        <div className="relative">
          <button
            onClick={() => setShowNewMenu(!showNewMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow-brand hover:opacity-95 transition-all"
          >
            <Plus size={13} />
            <span>New</span>
            <ChevronDown size={11} />
          </button>
          <AnimatePresence>
            {showNewMenu && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.97 }}
                className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-100 rounded-xl shadow-lg z-50 overflow-hidden"
              >
                <button
                  onClick={() => { openNewCategoryModal(); setShowNewMenu(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-2"
                >
                  <div className="w-5 h-5 rounded-md bg-indigo-100 flex items-center justify-center">
                    <Plus size={11} className="text-indigo-600" />
                  </div>
                  New Category
                </button>
                <button
                  onClick={() => { openNewItemModal(); setShowNewMenu(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-2"
                >
                  <div className="w-5 h-5 rounded-md bg-purple-100 flex items-center justify-center">
                    <Package size={11} className="text-purple-600" />
                  </div>
                  New Product
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {showNewMenu && (
            <div className="fixed inset-0 z-40" onClick={() => setShowNewMenu(false)} />
          )}
        </div>

        {/* Export */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <Download size={13} />
            <span className="hidden sm:block">Export</span>
          </button>
          <AnimatePresence>
            {showExportMenu && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.97 }}
                className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-100 rounded-xl shadow-lg z-50 overflow-hidden"
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
          {showExportMenu && (
            <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
          )}
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        {/* Profile */}
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm"
        >
          A
        </button>
        {showProfileMenu && (
          <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
        )}
      </div>
    </header>
  );
}
