'use client';

import { motion } from 'framer-motion';
import {
  Pencil, Package, DollarSign, Factory, Image, X
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import DesignTabPanel from './DesignTabPanel';
import ProductSettingsPanel from './ProductSettingsPanel';
import CostingPanel from './CostingPanel';
import ManufacturingPanel from './ManufacturingPanel';
import AssetLibraryPanel from './AssetLibraryPanel';
import EmptyState from '@/components/ui/EmptyState';

const TABS = [
  { id: 'design', label: 'Design', icon: Pencil },
  { id: 'product', label: 'Product', icon: Package },
  { id: 'costing', label: 'Costing', icon: DollarSign },
  { id: 'mfg', label: 'Mfg.', icon: Factory },
  { id: 'assets', label: 'Assets', icon: Image },
];

export default function RightInspector() {
  const {
    activeRightTab, setActiveRightTab,
    getActiveItem, setRightPanelExpanded,
  } = useAppStore();

  const activeItem = getActiveItem();

  return (
    <motion.aside
      initial={{ width: 0 }}
      animate={{ width: 280 }}
      exit={{ width: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="bg-white border-l border-slate-100 flex flex-col overflow-hidden flex-shrink-0"
      style={{ height: 'calc(100vh - 56px)' }}
    >
      {/* Tab Bar */}
      <div className="flex-shrink-0 border-b border-slate-100 bg-white">
        <div className="flex items-center">
          <div className="flex flex-1 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeRightTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveRightTab(tab.id)}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1 text-[10px] font-medium transition-all border-b-2 ${
                    isActive
                      ? 'text-indigo-600 border-indigo-500'
                      : 'text-slate-400 border-transparent hover:text-slate-600 hover:border-slate-200'
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setRightPanelExpanded(false)}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-colors rounded-lg mr-1"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {!activeItem ? (
          <EmptyState
            icon="🎨"
            title="No product selected"
            description="Select a product from the sidebar to see its design and settings."
          />
        ) : (
          <>
            {activeRightTab === 'design' && <DesignTabPanel item={activeItem} />}
            {activeRightTab === 'product' && <ProductSettingsPanel item={activeItem} />}
            {activeRightTab === 'costing' && <CostingPanel item={activeItem} />}
            {activeRightTab === 'mfg' && <ManufacturingPanel item={activeItem} />}
            {activeRightTab === 'assets' && <AssetLibraryPanel />}
          </>
        )}
      </div>
    </motion.aside>
  );
}
