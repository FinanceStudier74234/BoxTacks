'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import StatusBadge from '@/components/ui/StatusBadge';
import type { ProductItem, ProductStatus } from '@/types';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size', 'Custom'];
const PRODUCT_TYPES = [
  'Hoodie', 'T-Shirt', 'Sweatshirt', 'Jacket', 'Shorts', 'Pants',
  'Notebook', 'Planner', 'Card Set', 'Poster', 'Sticker', 'Label',
  'Mailer Box', 'Hang Tag', 'Insert Card', 'Gift Box', 'Tote Bag',
  'Desk Mat', 'Hat / Cap', 'Mug', 'Phone Case', 'Custom',
];
const PRINT_ZONES = ['Front Chest', 'Back', 'Sleeve', 'Side', 'Full Print', 'Neck Label', 'Hem', 'Pocket'];

interface Props {
  item: ProductItem;
}

export default function ProductSettingsPanel({ item }: Props) {
  const { updateItem } = useAppStore();
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    item.dimensions?.split('/').map((s) => s.trim()) || ['S', 'M', 'L', 'XL']
  );
  const [colorInput, setColorInput] = useState(item.color || '#1E293B');
  const [selectedPrintZones, setSelectedPrintZones] = useState<string[]>(['Front Chest']);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleZone = (zone: string) => {
    setSelectedPrintZones((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]
    );
  };

  return (
    <div className="p-4 space-y-5">
      {/* Product Type */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Product Type</p>
        <select
          value={item.type}
          onChange={(e) => updateItem(item.id, { type: e.target.value })}
          className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-200 bg-white text-slate-700"
        >
          {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* SKU */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">SKU</p>
        <input
          type="text"
          value={item.sku}
          onChange={(e) => updateItem(item.id, { sku: e.target.value })}
          className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-200 font-mono text-slate-700"
          placeholder="e.g. APP-TEE-001"
        />
      </div>

      {/* Color */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Product Color</p>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={colorInput}
            onChange={(e) => { setColorInput(e.target.value); updateItem(item.id, { color: e.target.value }); }}
            className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0.5"
          />
          <input
            type="text"
            value={colorInput}
            onChange={(e) => { setColorInput(e.target.value); updateItem(item.id, { color: e.target.value }); }}
            className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-200 font-mono"
          />
        </div>
      </div>

      {/* Status */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Status</p>
        <div className="space-y-1.5">
          {(['idea', 'designing', 'sample-ordered', 'in-revision', 'approved', 'production-ready'] as ProductStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => updateItem(item.id, { status: s })}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                item.status === s ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <StatusBadge status={s} size="sm" />
              {item.status === s && (
                <span className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Size Options */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Size Options</p>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedSizes.includes(size)
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Print Zones */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Print Zones</p>
        <div className="flex flex-wrap gap-1.5">
          {PRINT_ZONES.map((zone) => (
            <button
              key={zone}
              onClick={() => toggleZone(zone)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedPrintZones.includes(zone)
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {/* Dimensions */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Dimensions</p>
        <input
          type="text"
          value={item.dimensions || ''}
          onChange={(e) => updateItem(item.id, { dimensions: e.target.value })}
          placeholder="e.g. 30cm x 22cm x 8cm"
          className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-200 text-slate-700 placeholder-slate-400"
        />
      </div>

      {/* Materials */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Materials</p>
        <textarea
          value={item.materials || ''}
          onChange={(e) => updateItem(item.id, { materials: e.target.value })}
          placeholder="e.g. 400gsm Heavyweight Cotton Fleece..."
          rows={2}
          className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-200 text-slate-700 placeholder-slate-400 resize-none"
        />
      </div>
    </div>
  );
}
