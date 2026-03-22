'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pencil, Eye, Box, FileText, ChevronRight,
  RotateCcw, RotateCw, ZoomIn, ZoomOut, Maximize2,
  Layers, PanelRight
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import ProductDetailsPanel from './ProductDetailsPanel';
import MockupPreviewPanel from './MockupPreviewPanel';
import type { WorkspaceMode } from '@/types';

// Dynamic imports for heavy components
const Canvas2DEditor = dynamic(() => import('./Canvas2DEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-slate-100">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-400">Loading canvas...</p>
      </div>
    </div>
  ),
});

const ProductViewer3D = dynamic(() => import('./ProductViewer3D'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-slate-100">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-400">Loading 3D viewer...</p>
      </div>
    </div>
  ),
});

const MODES: { id: WorkspaceMode; label: string; icon: React.ElementType; description: string }[] = [
  { id: '2d', label: '2D Design', icon: Pencil, description: 'Design canvas' },
  { id: 'mockup', label: 'Mockup', icon: Eye, description: 'Preview' },
  { id: '3d', label: '3D View', icon: Box, description: '3D preview' },
  { id: 'details', label: 'Details', icon: FileText, description: 'Product info' },
];

export default function MainWorkspace() {
  const {
    workspaceMode, setWorkspaceMode,
    activeItemId, getActiveItem,
    openNewItemModal, openNewCategoryModal,
    setActiveRightTab,
    rightPanelExpanded, setRightPanelExpanded,
    categories,
  } = useAppStore();

  const activeItem = getActiveItem();

  if (!activeItemId || !activeItem) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50">
        <EmptyState
          icon="🎨"
          title="Select a product to start designing"
          description="Choose a product from the sidebar or create a new one to open the workspace."
          action={{ label: 'Create your first product', onClick: () => openNewItemModal() }}
        />
      </div>
    );
  }

  const activeCat = categories.find((c) => c.id === activeItem.categoryId);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-100">
      {/* Workspace Toolbar */}
      <div className="flex-shrink-0 bg-white border-b border-slate-100 px-4 py-2.5 flex items-center gap-3">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
          <span
            className="font-medium cursor-pointer hover:text-indigo-500 transition-colors flex-shrink-0"
            style={{ color: activeCat?.color }}
          >
            {activeCat?.icon} {activeCat?.name}
          </span>
          <ChevronRight size={12} className="flex-shrink-0" />
          <span className="font-semibold text-slate-800 truncate">{activeItem.name}</span>
          <span className="text-slate-400 hidden sm:inline truncate">· {activeItem.sku}</span>
        </div>

        <StatusBadge status={activeItem.status} size="sm" />

        <div className="flex-1" />

        {/* Mode Switcher */}
        <div className="flex items-center bg-slate-100 rounded-xl p-0.5 gap-0.5">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            const isActive = workspaceMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setWorkspaceMode(mode.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon size={13} />
                <span className="hidden sm:block">{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right panel toggle */}
        <button
          onClick={() => setRightPanelExpanded(!rightPanelExpanded)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            rightPanelExpanded ? 'text-indigo-500 bg-indigo-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
        >
          <PanelRight size={15} />
        </button>
      </div>

      {/* Mode Content */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={workspaceMode}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            {workspaceMode === '2d' && <Canvas2DEditor item={activeItem} />}
            {workspaceMode === 'mockup' && <MockupPreviewPanel item={activeItem} />}
            {workspaceMode === '3d' && <ProductViewer3D item={activeItem} />}
            {workspaceMode === 'details' && <ProductDetailsPanel item={activeItem} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
