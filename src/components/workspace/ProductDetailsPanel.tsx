'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package, Tag, Hash, Clock, User, Edit3, Plus, X, Check
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import StatusBadge from '@/components/ui/StatusBadge';
import { getRelativeTime } from '@/lib/utils';
import type { ProductItem, ProductStatus } from '@/types';

const ALL_STATUSES: ProductStatus[] = [
  'idea', 'designing', 'sample-ordered', 'in-revision', 'approved', 'production-ready',
];

interface Props {
  item: ProductItem;
}

export default function ProductDetailsPanel({ item }: Props) {
  const { updateItem, updateItemStatus } = useAppStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [newTag, setNewTag] = useState('');
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const handleSaveName = () => {
    if (editName.trim()) updateItem(item.id, { name: editName.trim() });
    setIsEditingName(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !item.tags.includes(newTag.trim())) {
      updateItem(item.id, { tags: [...item.tags, newTag.trim().toLowerCase()] });
    }
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    updateItem(item.id, { tags: item.tags.filter((t) => t !== tag) });
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-5">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setIsEditingName(false); }}
                    className="text-xl font-bold text-slate-900 border-b-2 border-indigo-400 focus:outline-none bg-transparent flex-1"
                  />
                  <button onClick={handleSaveName} className="text-emerald-500 hover:text-emerald-600"><Check size={16} /></button>
                  <button onClick={() => setIsEditingName(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 truncate">{item.name}</h1>
                  <button
                    onClick={() => { setIsEditingName(true); setEditName(item.name); }}
                    className="text-slate-300 hover:text-slate-500 transition-colors"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-sm text-slate-500 font-mono bg-slate-50 px-2 py-0.5 rounded-md text-xs">{item.sku}</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-400">{item.type}</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-400">Updated {getRelativeTime(item.updatedAt)}</span>
              </div>
            </div>

            {/* Status selector */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="hover:opacity-80 transition-opacity"
              >
                <StatusBadge status={item.status} size="md" />
              </button>
              {showStatusMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStatusMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden py-1">
                    {ALL_STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => { updateItemStatus(item.id, s); setShowStatusMenu(false); }}
                        className={`w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors flex items-center gap-2 ${s === item.status ? 'bg-indigo-50' : ''}`}
                      >
                        <StatusBadge status={s} size="sm" />
                        {s === item.status && <Check size={12} className="text-indigo-500 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full group"
              >
                #{tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="opacity-0 group-hover:opacity-100 text-indigo-400 hover:text-indigo-600 transition-all ml-0.5"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add tag..."
                className="text-xs px-2 py-1 border border-dashed border-slate-300 rounded-full focus:outline-none focus:border-indigo-300 text-slate-500 w-24"
              />
              {newTag && (
                <button onClick={handleAddTag} className="text-indigo-500 hover:text-indigo-700">
                  <Plus size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Specs */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Package size={14} className="text-indigo-400" /> Product Specifications
            </h3>
            <div className="space-y-3">
              <EditableField
                label="Materials"
                value={item.materials || ''}
                placeholder="e.g. 400gsm Cotton Fleece..."
                onSave={(v) => updateItem(item.id, { materials: v })}
              />
              <EditableField
                label="Dimensions"
                value={item.dimensions || ''}
                placeholder="e.g. S / M / L / XL / XXL"
                onSave={(v) => updateItem(item.id, { dimensions: v })}
              />
              <EditableField
                label="Weight"
                value={item.weight || ''}
                placeholder="e.g. 400g"
                onSave={(v) => updateItem(item.id, { weight: v })}
              />
            </div>
          </div>

          {/* Print & Brand Notes */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Tag size={14} className="text-purple-400" /> Print & Brand Notes
            </h3>
            <div className="space-y-3">
              <EditableTextArea
                label="Print Notes"
                value={item.printNotes || ''}
                placeholder="Print placement, technique, colors..."
                onSave={(v) => updateItem(item.id, { printNotes: v })}
              />
              <EditableTextArea
                label="Brand Notes"
                value={item.brandNotes || ''}
                placeholder="Brand guidelines, usage notes..."
                onSave={(v) => updateItem(item.id, { brandNotes: v })}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Product Description</h3>
          <EditableTextArea
            label=""
            value={item.description || ''}
            placeholder="Describe this product — features, positioning, usage..."
            onSave={(v) => updateItem(item.id, { description: v })}
            rows={4}
          />
        </div>

        {/* Manufacturing Notes */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Hash size={14} className="text-orange-400" /> Manufacturing Notes
          </h3>
          <EditableTextArea
            label=""
            value={item.manufacturingNotes || ''}
            placeholder="Manufacturing requirements, quality notes, special instructions..."
            onSave={(v) => updateItem(item.id, { manufacturingNotes: v })}
            rows={3}
          />
        </div>

        {/* Revision History */}
        {item.revisionHistory && item.revisionHistory.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Clock size={14} className="text-slate-400" /> Revision History
            </h3>
            <div className="space-y-3">
              {item.revisionHistory.map((rev, i) => (
                <div key={rev.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                      {rev.version.replace('v', '')}
                    </div>
                    {i < (item.revisionHistory!.length - 1) && (
                      <div className="w-px h-5 bg-slate-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-700">{rev.version}</span>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                      <span className="text-[10px] text-slate-400">by {rev.author}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{rev.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Editable Fields
// ------------------------------------------------------------------
function EditableField({
  label, value, placeholder, onSave,
}: {
  label: string;
  value: string;
  placeholder: string;
  onSave: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);

  const handleSave = () => {
    onSave(val);
    setEditing(false);
  };

  return (
    <div>
      {label && <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>}
      {editing ? (
        <div className="flex items-center gap-1.5">
          <input
            autoFocus
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }}
            placeholder={placeholder}
            className="flex-1 text-sm px-3 py-1.5 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 text-slate-700"
          />
          <button onClick={handleSave} className="text-emerald-500"><Check size={14} /></button>
          <button onClick={() => setEditing(false)} className="text-slate-400"><X size={14} /></button>
        </div>
      ) : (
        <button
          onClick={() => { setEditing(true); setVal(value); }}
          className="w-full text-left text-sm text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors group"
        >
          {value || <span className="text-slate-300 italic text-xs">{placeholder}</span>}
          <Edit3 size={11} className="inline ml-1.5 opacity-0 group-hover:opacity-40 transition-opacity" />
        </button>
      )}
    </div>
  );
}

function EditableTextArea({
  label, value, placeholder, onSave, rows = 3,
}: {
  label: string;
  value: string;
  placeholder: string;
  onSave: (v: string) => void;
  rows?: number;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);

  const handleSave = () => {
    onSave(val);
    setEditing(false);
  };

  return (
    <div>
      {label && <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>}
      {editing ? (
        <div className="space-y-1.5">
          <textarea
            autoFocus
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full text-sm px-3 py-2 border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 text-slate-700 resize-none"
          />
          <div className="flex gap-1.5 justify-end">
            <button onClick={() => setEditing(false)} className="px-3 py-1 text-xs text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-3 py-1 text-xs bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">Save</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => { setEditing(true); setVal(value); }}
          className="w-full text-left text-sm text-slate-600 hover:text-slate-800 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group whitespace-pre-wrap"
        >
          {value || <span className="text-slate-300 italic text-xs">{placeholder}</span>}
          <Edit3 size={11} className="inline ml-1.5 opacity-0 group-hover:opacity-40 transition-opacity" />
        </button>
      )}
    </div>
  );
}
