'use client';

import { useState } from 'react';
import { Upload, Search, Image, Tag, Grid, List } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import EmptyState from '@/components/ui/EmptyState';

const ASSET_TYPES = ['All', 'Logos', 'Icons', 'Graphics', 'Patterns'];

// Demo asset visual placeholders
const DEMO_ASSETS = [
  { id: 'a1', name: 'Main Logo', type: 'logo', color: '#6366F1', letter: 'BT' },
  { id: 'a2', name: 'Icon Mark', type: 'icon', color: '#8B5CF6', letter: '✦' },
  { id: 'a3', name: 'Brand Mark', type: 'graphic', color: '#1E293B', letter: '⬡' },
  { id: 'a4', name: 'Grid Pattern', type: 'pattern', color: '#06B6D4', letter: '▪▪' },
  { id: 'a5', name: 'Script Logo', type: 'logo', color: '#F97316', letter: 'P.' },
  { id: 'a6', name: 'Star Icon', type: 'icon', color: '#10B981', letter: '★' },
];

export default function AssetLibraryPanel() {
  const { setNotification } = useAppStore();
  const [activeType, setActiveType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = DEMO_ASSETS.filter((a) => {
    const matchType = activeType === 'All' || a.type === activeType.toLowerCase().replace('s', '');
    const matchSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-slate-50">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-200 text-slate-600"
          />
        </div>
      </div>

      {/* Filter tabs + view toggle */}
      <div className="px-3 py-2 flex items-center justify-between">
        <div className="flex gap-1 overflow-x-auto">
          {ASSET_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-2 py-1 rounded-md text-[10px] font-medium whitespace-nowrap transition-all ${
                activeType === type
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1 rounded-md transition-colors ${viewMode === 'grid' ? 'text-indigo-500 bg-indigo-50' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Grid size={12} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1 rounded-md transition-colors ${viewMode === 'list' ? 'text-indigo-500 bg-indigo-50' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <List size={12} />
          </button>
        </div>
      </div>

      {/* Asset Grid/List */}
      <div className="flex-1 overflow-y-auto p-3">
        {filtered.length === 0 ? (
          <EmptyState
            icon="🖼️"
            title="No assets found"
            description="Upload your brand logos and graphics to reuse them across products."
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-3 gap-2">
            {filtered.map((asset) => (
              <button
                key={asset.id}
                onClick={() => setNotification({ type: 'info', message: `"${asset.name}" copied to canvas` })}
                className="group aspect-square rounded-xl overflow-hidden hover:ring-2 hover:ring-indigo-300 transition-all"
                style={{ backgroundColor: `${asset.color}20` }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span
                    className="text-xl font-bold group-hover:scale-110 transition-transform"
                    style={{ color: asset.color }}
                  >
                    {asset.letter}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((asset) => (
              <button
                key={asset.id}
                onClick={() => setNotification({ type: 'info', message: `"${asset.name}" copied to canvas` })}
                className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: `${asset.color}20`, color: asset.color }}
                >
                  {asset.letter}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate">{asset.name}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{asset.type}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Upload */}
      <div className="p-3 border-t border-slate-50">
        <button
          onClick={() => setNotification({ type: 'info', message: 'Asset upload coming soon!' })}
          className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-xs text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all"
        >
          <Upload size={13} />
          Upload Asset
        </button>
      </div>
    </div>
  );
}
