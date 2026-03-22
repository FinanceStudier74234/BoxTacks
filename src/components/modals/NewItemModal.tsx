'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { useAppStore } from '@/store/appStore';
import { generateSKU } from '@/lib/utils';
import type { ProductStatus } from '@/types';

const PRODUCT_TYPES = [
  'Hoodie', 'T-Shirt', 'Sweatshirt', 'Jacket', 'Shorts',
  'Notebook', 'Planner', 'Card Set', 'Poster', 'Sticker',
  'Mailer Box', 'Hang Tag', 'Insert Card', 'Gift Box', 'Label',
  'Desk Mat', 'Tote Bag', 'Hat / Cap', 'Mug', 'Custom',
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewItemModal({ isOpen, onClose }: Props) {
  const { categories, addItem, pendingCategoryId, setNotification } = useAppStore();

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(pendingCategoryId || categories[0]?.id || '');
  const [productType, setProductType] = useState('T-Shirt');
  const [status, setStatus] = useState<ProductStatus>('idea');

  const handleSubmit = () => {
    if (!name.trim() || !categoryId) return;
    const cat = categories.find((c) => c.id === categoryId);
    const sku = generateSKU(cat?.name || 'PRD', name);
    addItem({
      name: name.trim(),
      categoryId,
      sku,
      status,
      type: productType,
      tags: [],
      designData: {
        elements: [],
        background: '#FFFFFF',
        width: 500,
        height: 600,
        currentView: 'front',
      },
    });
    setNotification({ type: 'success', message: `"${name}" added to ${cat?.name}!` });
    setName('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Product" size="md">
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Name</label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="e.g. Premium Hoodie, Signature Tee..."
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 text-slate-800 placeholder-slate-400 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white text-slate-800 transition-all"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Type</label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white text-slate-800 transition-all"
            >
              {PRODUCT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Initial Status</label>
          <div className="flex flex-wrap gap-2">
            {(['idea', 'designing', 'sample-ordered'] as ProductStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  status === s
                    ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Start from template prompt */}
        <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
          <p className="text-xs text-indigo-700 font-medium">💡 Want to start from a template?</p>
          <p className="text-xs text-indigo-500 mt-0.5">You can choose a template after creating the product.</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !categoryId}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create Product
          </button>
        </div>
      </div>
    </Modal>
  );
}
