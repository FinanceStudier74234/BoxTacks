'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import TopNavigation from './TopNavigation';
import LeftSidebar from './LeftSidebar';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import DashboardView from '@/components/dashboard/DashboardView';
import MainWorkspace from '@/components/workspace/MainWorkspace';
import TemplateGallery from '@/components/templates/TemplateGallery';
import ManufacturingView from '@/components/manufacturing/ManufacturingView';
import InventoryView from '@/components/inventory/InventoryView';
import AnalyticsView from '@/components/analytics/AnalyticsView';
import BrandAssetsView from '@/components/brand/BrandAssetsView';
import RightInspector from '@/components/inspector/RightInspector';
import NewCategoryModal from '@/components/modals/NewCategoryModal';
import NewItemModal from '@/components/modals/NewItemModal';
import { useAppStore } from '@/store/appStore';

const viewTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
};

export default function AppShell() {
  const {
    currentView,
    sidebarExpanded,
    rightPanelExpanded,
    isNewCategoryModalOpen,
    isNewItemModalOpen,
    closeNewCategoryModal,
    closeNewItemModal,
    notification,
    setNotification,
  } = useAppStore();

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = useAppStore.getState();
      const isInputFocused = ['INPUT', 'TEXTAREA', 'SELECT'].includes(
        (document.activeElement?.tagName || '')
      );

      // Ctrl/Cmd+S — Save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        state.triggerSave();
        return;
      }

      // Skip shortcuts if user is typing in an input
      if (isInputFocused) return;

      // Ctrl/Cmd+D — Duplicate active item
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        if (state.activeItemId) {
          state.duplicateItem(state.activeItemId);
          state.setNotification({ type: 'success', message: 'Item duplicated' });
        }
        return;
      }

      // Ctrl/Cmd+N — New item
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        state.openNewItemModal();
        return;
      }

      // Delete/Backspace — Delete selected design element
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (state.selectedElementId && state.activeItemId) {
          e.preventDefault();
          state.deleteDesignElement(state.activeItemId, state.selectedElementId);
        }
        return;
      }

      // Escape — Deselect element or close modals
      if (e.key === 'Escape') {
        if (state.selectedElementId) {
          state.setSelectedElement(null);
        } else if (state.isNewItemModalOpen) {
          state.closeNewItemModal();
        } else if (state.isNewCategoryModalOpen) {
          state.closeNewCategoryModal();
        }
        return;
      }

      // 1-7 — Quick view switch
      const viewKeys: Record<string, typeof state.currentView> = {
        '1': 'dashboard',
        '2': 'workspace',
        '3': 'templates',
        '4': 'manufacturing',
        '5': 'inventory',
        '6': 'brand-assets',
        '7': 'analytics',
      };
      if ((e.metaKey || e.ctrlKey) && viewKeys[e.key]) {
        e.preventDefault();
        state.setCurrentView(viewKeys[e.key]);
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <motion.div key="dashboard" className="flex-1 min-h-0 overflow-y-auto" {...viewTransition}>
            <ErrorBoundary fallbackTitle="Dashboard failed to load">
              <DashboardView />
            </ErrorBoundary>
          </motion.div>
        );
      case 'workspace':
        return (
          <motion.div key="workspace" className="flex flex-1 overflow-hidden" {...viewTransition}>
            <ErrorBoundary fallbackTitle="Workspace failed to load">
              <MainWorkspace />
            </ErrorBoundary>
            {rightPanelExpanded && (
              <ErrorBoundary fallbackTitle="Inspector failed to load">
                <RightInspector />
              </ErrorBoundary>
            )}
          </motion.div>
        );
      case 'templates':
        return (
          <motion.div key="templates" className="flex-1 min-h-0 overflow-y-auto" {...viewTransition}>
            <ErrorBoundary fallbackTitle="Templates failed to load">
              <TemplateGallery />
            </ErrorBoundary>
          </motion.div>
        );
      case 'manufacturing':
        return (
          <motion.div key="manufacturing" className="flex-1 min-h-0 overflow-y-auto" {...viewTransition}>
            <ErrorBoundary fallbackTitle="Manufacturing view failed to load">
              <ManufacturingView />
            </ErrorBoundary>
          </motion.div>
        );
      case 'inventory':
        return (
          <motion.div key="inventory" className="flex-1 min-h-0 overflow-y-auto" {...viewTransition}>
            <ErrorBoundary fallbackTitle="Inventory failed to load">
              <InventoryView />
            </ErrorBoundary>
          </motion.div>
        );
      case 'analytics':
        return (
          <motion.div key="analytics" className="flex-1 min-h-0 overflow-y-auto" {...viewTransition}>
            <ErrorBoundary fallbackTitle="Analytics failed to load">
              <AnalyticsView />
            </ErrorBoundary>
          </motion.div>
        );
      case 'brand-assets':
        return (
          <motion.div key="brand-assets" className="flex-1 min-h-0 overflow-y-auto" {...viewTransition}>
            <ErrorBoundary fallbackTitle="Brand Assets failed to load">
              <BrandAssetsView />
            </ErrorBoundary>
          </motion.div>
        );
      default:
        return (
          <motion.div key="dashboard-default" className="flex-1 min-h-0 overflow-y-auto" {...viewTransition}>
            <ErrorBoundary>
              <DashboardView />
            </ErrorBoundary>
          </motion.div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden">
      {/* Top Navigation */}
      <TopNavigation />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <AnimatePresence initial={false}>
          {sidebarExpanded && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="flex-shrink-0 overflow-hidden"
              style={{ height: 'calc(100vh - 56px)' }}
            >
              <LeftSidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area — animated view transitions */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait">
            {renderMainContent()}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      <NewCategoryModal isOpen={isNewCategoryModalOpen} onClose={closeNewCategoryModal} />
      <NewItemModal isOpen={isNewItemModalOpen} onClose={closeNewItemModal} />

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-xl max-w-sm"
          >
            {notification.type === 'success' && <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />}
            {notification.type === 'error' && <AlertCircle size={16} className="text-red-500 flex-shrink-0" />}
            {notification.type === 'info' && <Info size={16} className="text-blue-500 flex-shrink-0" />}
            <p className="text-sm text-slate-700 font-medium flex-1">{notification.message}</p>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard shortcut hint — only shown on first visit */}
      <div className="fixed bottom-6 left-6 z-40 hidden lg:block">
        <p className="text-[10px] text-slate-400">
          <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[9px] font-mono">⌘S</kbd> Save
          {' · '}
          <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[9px] font-mono">⌘D</kbd> Duplicate
          {' · '}
          <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[9px] font-mono">Del</kbd> Delete
          {' · '}
          <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[9px] font-mono">Esc</kbd> Deselect
        </p>
      </div>
    </div>
  );
}
