'use client';

import { useState, useRef } from 'react';
import { Upload, Search, Image, Tag, Grid, List, Trash2, X } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import EmptyState from '@/components/ui/EmptyState';

const ASSET_TYPES = ['All', 'Logos', 'Icons', 'Graphics', 'Patterns'];

// Visual representations for asset types
const ASSET_TYPE_ICONS: Record<string, { letter: string; color: string }> = {
  logo: { letter: 'BT', color: '#6366F1' },
  icon: { letter: '✦', color: '#8B5CF6' },
  graphic: { letter: '⬡', color: '#1E293B' },
  pattern: { letter: '▪▪', color: '#06B6D4' },
  font: { letter: 'Aa', color: '#F97316' },
};

export default function AssetLibraryPanel() {
  const { assets, addAsset, deleteAsset, setNotification, addDesignElement, getActiveItem } = useAppStore();
  const [activeType, setActiveType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = assets.filter((a) => {
    const matchType = activeType === 'All' || a.type === activeType.toLowerCase().replace(/s$/, '') as typeof a.type;
    const matchSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchType && matchSearch;
  });

  const getAssetVisual = (type: string) => {
    return ASSET_TYPE_ICONS[type] || ASSET_TYPE_ICONS.graphic;
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      // Determine asset type from file
      const isImage = file.type.startsWith('image/');
      const isSvg = file.type === 'image/svg+xml' || file.name.endsWith('.svg');
      const isFont = file.name.match(/\.(woff2?|ttf|otf|eot)$/i);

      let assetType: 'logo' | 'graphic' | 'pattern' | 'font' | 'icon' = 'graphic';
      if (isFont) assetType = 'font';
      else if (isSvg) assetType = 'icon';
      else if (isImage) assetType = 'graphic';

      // Read file as data URL for local storage
      const reader = new FileReader();
      reader.onload = () => {
        addAsset({
          name: file.name.replace(/\.[^/.]+$/, ''),
          type: assetType,
          src: reader.result as string,
          tags: [assetType, file.name.split('.').pop() || ''],
        });
        setNotification({ type: 'success', message: `Uploaded "${file.name}"` });
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const handleAssetClick = (asset: typeof assets[0]) => {
    const activeItem = getActiveItem();
    if (activeItem) {
      // Add asset as an image element on the canvas
      addDesignElement(activeItem.id, {
        type: 'image',
        x: 100,
        y: 100,
        width: 120,
        height: 120,
        src: asset.src,
        name: asset.name,
        opacity: 1,
        visible: true,
        locked: false,
      });
      setNotification({ type: 'success', message: `Added "${asset.name}" to canvas` });
    } else {
      setNotification({ type: 'info', message: 'Open a product in Workspace to add assets to canvas' });
    }
  };

  const handleDeleteAsset = (e: React.MouseEvent, assetId: string) => {
    e.stopPropagation();
    deleteAsset(assetId);
    setNotification({ type: 'info', message: 'Asset deleted' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.svg,.woff,.woff2,.ttf,.otf"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

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
            {filtered.map((asset) => {
              const visual = getAssetVisual(asset.type);
              const isDataUrl = asset.src.startsWith('data:');
              return (
                <button
                  key={asset.id}
                  onClick={() => handleAssetClick(asset)}
                  className="group aspect-square rounded-xl overflow-hidden hover:ring-2 hover:ring-indigo-300 transition-all relative"
                  style={{ backgroundColor: isDataUrl ? '#F8FAFC' : `${visual.color}20` }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    {isDataUrl ? (
                      <img src={asset.src} alt={asset.name} className="w-full h-full object-contain p-1.5" />
                    ) : (
                      <span
                        className="text-xl font-bold group-hover:scale-110 transition-transform"
                        style={{ color: visual.color }}
                      >
                        {visual.letter}
                      </span>
                    )}
                  </div>
                  {/* Delete button on hover */}
                  <button
                    onClick={(e) => handleDeleteAsset(e, asset.id)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((asset) => {
              const visual = getAssetVisual(asset.type);
              const isDataUrl = asset.src.startsWith('data:');
              return (
                <div
                  key={asset.id}
                  className="group w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
                >
                  <button
                    onClick={() => handleAssetClick(asset)}
                    className="flex items-center gap-2.5 flex-1 min-w-0"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 overflow-hidden"
                      style={{ backgroundColor: isDataUrl ? '#F1F5F9' : `${visual.color}20`, color: visual.color }}
                    >
                      {isDataUrl ? (
                        <img src={asset.src} alt={asset.name} className="w-full h-full object-contain" />
                      ) : (
                        visual.letter
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 truncate">{asset.name}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{asset.type}</p>
                    </div>
                  </button>
                  <button
                    onClick={(e) => handleDeleteAsset(e, asset.id)}
                    className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload */}
      <div className="p-3 border-t border-slate-50">
        <button
          onClick={handleUpload}
          className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-xs text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all"
        >
          <Upload size={13} />
          Upload Asset
        </button>
      </div>
    </div>
  );
}
