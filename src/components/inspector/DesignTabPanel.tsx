'use client';

import { useState, useRef } from 'react';
import {
  Type, Square, Circle, Minus, Upload,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  AlignHorizontalJustifyStart, AlignHorizontalJustifyCenter, AlignHorizontalJustifyEnd,
  Bold, Italic, Underline
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { DESIGN_PALETTE as COLORS } from '@/constants/statusConfig';
import type { ProductItem } from '@/types';

const FONTS = [
  'Inter', 'Georgia', 'Times New Roman', 'Courier New',
  'Arial', 'Impact', 'Helvetica Neue', 'Garamond',
];

interface Props {
  item: ProductItem;
}

export default function DesignTabPanel({ item }: Props) {
  const { addDesignElement, setWorkspaceMode } = useAppStore();
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setWorkspaceMode('2d');
      addDesignElement(item.id, {
        type: 'image',
        x: 100,
        y: 100,
        width: 200,
        height: 200,
        src: dataUrl,
        visible: true,
        locked: false,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddText = () => {
    setWorkspaceMode('2d');
    addDesignElement(item.id, {
      type: 'text',
      x: 100,
      y: 100,
      content: 'Your Text Here',
      fontSize: 32,
      fontFamily: 'Inter',
      fill: selectedColor,
      width: 300,
      visible: true,
      locked: false,
      align: 'left',
    });
  };

  const handleAddShape = (type: 'rect' | 'circle') => {
    setWorkspaceMode('2d');
    addDesignElement(item.id, {
      type,
      x: 150,
      y: 150,
      width: type === 'rect' ? 120 : 80,
      height: type === 'rect' ? 90 : 80,
      fill: selectedColor,
      visible: true,
      locked: false,
    });
  };

  return (
    <div className="p-4 space-y-5">
      <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageUpload} className="hidden" />
      {/* Quick Add Tools */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Add Elements</p>
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Type, label: 'Text', action: handleAddText },
            { icon: Square, label: 'Rect', action: () => handleAddShape('rect') },
            { icon: Circle, label: 'Circle', action: () => handleAddShape('circle') },
            { icon: Upload, label: 'Image', action: () => imageInputRef.current?.click() },
          ].map(({ icon: Icon, label, action }) => (
            <button
              key={label}
              onClick={action}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-500 transition-all group"
            >
              <Icon size={16} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Color Palette */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Color</p>
        <div className="grid grid-cols-7 gap-1.5 mb-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedColor(c)}
              className={`w-8 h-8 rounded-lg transition-all ${
                selectedColor === c ? 'ring-2 ring-indigo-400 ring-offset-1 scale-110' : 'hover:scale-105'
              }`}
              style={{
                backgroundColor: c,
                border: c === '#FFFFFF' ? '1px solid #E2E8F0' : 'none',
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5"
          />
          <input
            type="text"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="flex-1 text-xs px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-200 font-mono"
          />
        </div>
      </div>

      {/* Typography */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Typography</p>
        <div className="space-y-2">
          <select className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-200 bg-white text-slate-700">
            {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <p className="text-[10px] text-slate-400 mb-1">Size</p>
              <input
                type="number"
                defaultValue={24}
                min={8}
                max={200}
                className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-200"
              />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-slate-400 mb-1">Weight</p>
              <select className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none bg-white">
                {['300', '400', '500', '600', '700', '800', '900'].map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-1">
            {[
              { icon: Bold, label: 'B' },
              { icon: Italic, label: 'I' },
              { icon: Underline, label: 'U' },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                className="flex-1 py-1.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center"
              >
                <Icon size={14} />
              </button>
            ))}
          </div>

          <div className="flex gap-1">
            {[
              { icon: AlignLeft },
              { icon: AlignCenter },
              { icon: AlignRight },
              { icon: AlignJustify },
            ].map(({ icon: Icon }, i) => (
              <button
                key={i}
                className="flex-1 py-1.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center"
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alignment */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Alignment</p>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { icon: AlignHorizontalJustifyStart, label: 'Left' },
            { icon: AlignHorizontalJustifyCenter, label: 'Center' },
            { icon: AlignHorizontalJustifyEnd, label: 'Right' },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex flex-col items-center gap-1 py-2 rounded-lg bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all text-[10px] font-medium"
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Settings */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Canvas</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <p className="text-[10px] text-slate-400 mb-1">Width</p>
              <input type="number" defaultValue={500} className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-slate-400 mb-1">Height</p>
              <input type="number" defaultValue={600} className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
