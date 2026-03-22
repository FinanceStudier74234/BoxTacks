'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { useAppStore } from '@/store/appStore';
import { categoryColors, categoryIcons } from '@/data/sampleData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewCategoryModal({ isOpen, onClose }: Props) {
  const { addCategory, setNotification } = useAppStore();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#6366F1');
  const [selectedIcon, setSelectedIcon] = useState('📦');

  const handleSubmit = () => {
    if (!name.trim()) return;
    addCategory(name.trim(), selectedColor, selectedIcon);
    setNotification({ type: 'success', message: `Category "${name}" created!` });
    setName('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Category" size="sm">
      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Category Name
          </label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="e.g. Apparel, Packaging, Stationery..."
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 text-slate-800 placeholder-slate-400 transition-all"
          />
        </div>

        {/* Icon */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Icon
          </label>
          <div className="grid grid-cols-8 gap-1.5">
            {categoryIcons.map((icon) => (
              <button
                key={icon}
                onClick={() => setSelectedIcon(icon)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
                  selectedIcon === icon
                    ? 'bg-indigo-100 ring-2 ring-indigo-300'
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {categoryColors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-7 h-7 rounded-lg transition-all ${
                  selectedColor === color ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="p-3 bg-slate-50 rounded-xl">
          <p className="text-xs text-slate-400 mb-2">Preview</p>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-sm"
              style={{ backgroundColor: `${selectedColor}20` }}
            >
              {selectedIcon}
            </div>
            <span className="text-sm font-semibold text-slate-700">{name || 'Category Name'}</span>
          </div>
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
            disabled={!name.trim()}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create Category
          </button>
        </div>
      </div>
    </Modal>
  );
}
