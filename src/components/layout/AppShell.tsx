'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import TopNavigation from './TopNavigation';
import LeftSidebar from './LeftSidebar';
import DashboardView from '@/components/dashboard/DashboardView';
import MainWorkspace from '@/components/workspace/MainWorkspace';
import TemplateGallery from '@/components/templates/TemplateGallery';
import RightInspector from '@/components/inspector/RightInspector';
import NewCategoryModal from '@/components/modals/NewCategoryModal';
import NewItemModal from '@/components/modals/NewItemModal';
import { useAppStore } from '@/store/appStore';

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

  // Keyboard shortcuts
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
        return <DashboardView />;
      case 'workspace':
        return (
          <div className="flex flex-1 overflow-hidden">
            <MainWorkspace />
            {rightPanelExpanded && <RightInspector />}
          </div>
        );
      case 'templates':
        return <TemplateGallery />;
      default:
        return <DashboardView />;
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
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="flex-shrink-0 overflow-hidden"
              style={{ height: 'calc(100vh - 56px)' }}
            >
              <LeftSidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {renderMainContent()}
        </div>
      </div>

      {/* Modals */}
      <NewCategoryModal
        isOpen={isNewCategoryModalOpen}
        onClose={closeNewCategoryModal}
      />
      <NewItemModal
        isOpen={isNewItemModalOpen}
        onClose={closeNewItemModal}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
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
