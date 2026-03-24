'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import TopNavigation from './TopNavigation';
import LeftSidebar from './LeftSidebar';
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
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        useAppStore.getState().triggerSave();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <motion.div key="dashboard" className="flex-1 overflow-hidden flex flex-col" {...viewTransition}>
            <DashboardView />
          </motion.div>
        );
      case 'workspace':
        return (
          <motion.div key="workspace" className="flex flex-1 overflow-hidden" {...viewTransition}>
            <MainWorkspace />
            {rightPanelExpanded && <RightInspector />}
          </motion.div>
        );
      case 'templates':
        return (
          <motion.div key="templates" className="flex-1 overflow-hidden flex flex-col" {...viewTransition}>
            <TemplateGallery />
          </motion.div>
        );
      case 'manufacturing':
        return (
          <motion.div key="manufacturing" className="flex-1 overflow-hidden flex flex-col" {...viewTransition}>
            <ManufacturingView />
          </motion.div>
        );
      case 'inventory':
        return (
          <motion.div key="inventory" className="flex-1 overflow-hidden flex flex-col" {...viewTransition}>
            <InventoryView />
          </motion.div>
        );
      case 'analytics':
        return (
          <motion.div key="analytics" className="flex-1 overflow-hidden flex flex-col" {...viewTransition}>
            <AnalyticsView />
          </motion.div>
        );
      case 'brand-assets':
        return (
          <motion.div key="brand-assets" className="flex-1 overflow-hidden flex flex-col" {...viewTransition}>
            <BrandAssetsView />
          </motion.div>
        );
      default:
        return (
          <motion.div key="dashboard-default" className="flex-1 overflow-hidden flex flex-col" {...viewTransition}>
            <DashboardView />
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
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
