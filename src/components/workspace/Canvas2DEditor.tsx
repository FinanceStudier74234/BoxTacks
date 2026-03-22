'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Circle, Line, Transformer, Image as KonvaImage } from 'react-konva';
import Konva from 'konva';
import { motion } from 'framer-motion';
import {
  Type, Square, Circle as CircleIcon, Minus, MousePointer2,
  Trash2, Lock, Unlock, Eye, EyeOff, Copy, ZoomIn, ZoomOut,
  RotateCcw, RotateCw, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Upload, ChevronDown, Layers
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import type { ProductItem, DesignElement, ProductView } from '@/types';

// Tool types
type ToolType = 'select' | 'text' | 'rect' | 'circle' | 'line';

const VIEWS: { id: ProductView; label: string }[] = [
  { id: 'front', label: 'Front' },
  { id: 'back', label: 'Back' },
  { id: 'sleeve', label: 'Sleeve' },
  { id: 'side', label: 'Side' },
];

const FONTS = ['Inter', 'Georgia', 'Courier New', 'Arial', 'Impact', 'Helvetica Neue'];
const COLORS = [
  '#FFFFFF', '#000000', '#EF4444', '#F97316', '#F59E0B',
  '#10B981', '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6',
  '#EC4899', '#1E293B', '#64748B', '#CBD5E1',
];

interface Props {
  item: ProductItem;
}

export default function Canvas2DEditor({ item }: Props) {
  const {
    addDesignElement, updateDesignElement, deleteDesignElement,
    selectedElementId, setSelectedElement,
    updateItemDesign,
  } = useAppStore();

  const [tool, setTool] = useState<ToolType>('select');
  const [zoom, setZoom] = useState(1);
  const [currentView, setCurrentView] = useState<ProductView>(
    item.designData?.currentView || 'front'
  );
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [bgColor, setBgColor] = useState(item.designData?.background || '#FFFFFF');
  const [showLayersPanel, setShowLayersPanel] = useState(false);

  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const layerRef = useRef<Konva.Layer>(null);

  const designData = item.designData || {
    elements: [],
    background: '#FFFFFF',
    width: 500,
    height: 600,
    currentView: 'front' as ProductView,
  };

  const elements = designData.elements;

  // Update transformer when selection changes
  useEffect(() => {
    if (!transformerRef.current || !layerRef.current) return;
    if (selectedElementId) {
      const node = layerRef.current.findOne(`#${selectedElementId}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    } else {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedElementId, elements]);

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage() || e.target.name() === 'background') {
      setSelectedElement(null);
    }

    if (tool === 'text') {
      const stage = stageRef.current;
      if (!stage) return;
      const pos = stage.getPointerPosition();
      if (!pos) return;
      addDesignElement(item.id, {
        type: 'text',
        x: pos.x / zoom,
        y: pos.y / zoom,
        content: 'Double click to edit',
        fontSize: 24,
        fontFamily: 'Inter',
        fill: selectedColor,
        rotation: 0,
        width: 200,
        visible: true,
        locked: false,
      });
      setTool('select');
    } else if (tool === 'rect') {
      const stage = stageRef.current;
      if (!stage) return;
      const pos = stage.getPointerPosition();
      if (!pos) return;
      addDesignElement(item.id, {
        type: 'rect',
        x: pos.x / zoom - 50,
        y: pos.y / zoom - 40,
        width: 100,
        height: 80,
        fill: selectedColor,
        stroke: 'transparent',
        strokeWidth: 0,
        rotation: 0,
        visible: true,
        locked: false,
      });
      setTool('select');
    } else if (tool === 'circle') {
      const stage = stageRef.current;
      if (!stage) return;
      const pos = stage.getPointerPosition();
      if (!pos) return;
      addDesignElement(item.id, {
        type: 'circle',
        x: pos.x / zoom,
        y: pos.y / zoom,
        width: 80,
        height: 80,
        fill: selectedColor,
        rotation: 0,
        visible: true,
        locked: false,
      });
      setTool('select');
    }
  };

  const handleElementClick = (elementId: string) => {
    if (tool === 'select') {
      setSelectedElement(elementId);
    }
  };

  const handleDragEnd = (elementId: string, e: Konva.KonvaEventObject<DragEvent>) => {
    updateDesignElement(item.id, elementId, {
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = (elementId: string, e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    updateDesignElement(item.id, elementId, {
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * node.scaleX()),
      height: Math.max(5, node.height() * node.scaleY()),
      rotation: node.rotation(),
    });
    node.scaleX(1);
    node.scaleY(1);
  };

  const selectedEl = elements.find((el) => el.id === selectedElementId);

  const handleDeleteSelected = () => {
    if (selectedElementId) {
      deleteDesignElement(item.id, selectedElementId);
    }
  };

  const handleUpdateSelected = (updates: Partial<DesignElement>) => {
    if (selectedElementId) {
      updateDesignElement(item.id, selectedElementId, updates);
    }
  };

  const handleViewChange = (view: ProductView) => {
    setCurrentView(view);
    updateItemDesign(item.id, { ...designData, currentView: view });
  };

  const handleBgChange = (color: string) => {
    setBgColor(color);
    updateItemDesign(item.id, { ...designData, background: color });
  };

  // Canvas dimensions
  const canvasW = designData.width || 500;
  const canvasH = designData.height || 600;
  const scaledW = canvasW * zoom;
  const scaledH = canvasH * zoom;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Toolbar */}
      <div className="w-12 bg-white border-r border-slate-100 flex flex-col items-center py-3 gap-1 flex-shrink-0">
        {/* Tools */}
        {[
          { id: 'select' as ToolType, icon: MousePointer2, label: 'Select' },
          { id: 'text' as ToolType, icon: Type, label: 'Text' },
          { id: 'rect' as ToolType, icon: Square, label: 'Rectangle' },
          { id: 'circle' as ToolType, icon: CircleIcon, label: 'Circle' },
          { id: 'line' as ToolType, icon: Minus, label: 'Line' },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            title={label}
            onClick={() => setTool(id)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              tool === id
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Icon size={16} />
          </button>
        ))}

        <div className="w-6 h-px bg-slate-100 my-1" />

        {/* Color swatch */}
        <button
          title="Fill Color"
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="w-9 h-9 rounded-xl border-2 border-slate-200 shadow-sm"
          style={{ backgroundColor: selectedColor }}
        />

        <div className="w-6 h-px bg-slate-100 my-1" />

        {/* Layers */}
        <button
          title="Layers"
          onClick={() => setShowLayersPanel(!showLayersPanel)}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            showLayersPanel ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Layers size={16} />
        </button>

        {/* Upload placeholder */}
        <button
          title="Upload Image"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
          onClick={() => alert('Image upload — connect to file input')}
        >
          <Upload size={16} />
        </button>

        <div className="flex-1" />

        {/* Zoom */}
        <button onClick={() => setZoom((z) => Math.min(z + 0.1, 3))} className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">
          <ZoomIn size={15} />
        </button>
        <button onClick={() => setZoom((z) => Math.max(z - 0.1, 0.3))} className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">
          <ZoomOut size={15} />
        </button>
        <span className="text-[9px] text-slate-400 font-medium">{Math.round(zoom * 100)}%</span>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar: views + tools */}
        <div className="flex-shrink-0 bg-white border-b border-slate-100 px-3 py-1.5 flex items-center gap-2">
          {/* View buttons */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                onClick={() => handleViewChange(v.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  currentView === v.id
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* BG color */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400">BG</span>
            <div className="flex items-center gap-1">
              {['#FFFFFF', '#000000', '#1E293B', '#6366F1', '#F97316', '#10B981'].map((c) => (
                <button
                  key={c}
                  onClick={() => handleBgChange(c)}
                  className={`w-5 h-5 rounded-md transition-all ${bgColor === c ? 'ring-2 ring-indigo-400 ring-offset-1' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c, border: c === '#FFFFFF' ? '1px solid #E2E8F0' : 'none' }}
                />
              ))}
            </div>
          </div>

          {/* Selected element actions */}
          {selectedEl && (
            <div className="flex items-center gap-1 border-l border-slate-100 pl-2 ml-1">
              <button
                onClick={() => handleUpdateSelected({ locked: !selectedEl.locked })}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {selectedEl.locked ? <Lock size={12} /> : <Unlock size={12} />}
              </button>
              <button
                onClick={() => handleUpdateSelected({ visible: !selectedEl.visible })}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {selectedEl.visible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
              <button
                onClick={handleDeleteSelected}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Canvas + properties */}
        <div className="flex flex-1 overflow-hidden">
          {/* Canvas */}
          <div
            className="flex-1 overflow-auto flex items-center justify-center p-6"
            style={{ background: 'repeating-conic-gradient(#e2e8f0 0% 25%, #f1f5f9 0% 50%) 0 0 / 20px 20px' }}
          >
            <div
              className="relative shadow-2xl rounded-sm overflow-hidden"
              style={{ width: scaledW, height: scaledH }}
            >
              <Stage
                ref={stageRef}
                width={scaledW}
                height={scaledH}
                scaleX={zoom}
                scaleY={zoom}
                onClick={handleStageClick}
                style={{ cursor: tool === 'select' ? 'default' : 'crosshair' }}
              >
                <Layer ref={layerRef}>
                  {/* Background */}
                  <Rect
                    name="background"
                    x={0}
                    y={0}
                    width={canvasW}
                    height={canvasH}
                    fill={bgColor}
                  />

                  {/* Elements */}
                  {elements.map((el) => {
                    if (!el.visible && el.visible !== undefined && el.visible === false) return null;

                    const commonProps = {
                      key: el.id,
                      id: el.id,
                      x: el.x,
                      y: el.y,
                      rotation: el.rotation || 0,
                      draggable: tool === 'select' && !el.locked,
                      onClick: () => handleElementClick(el.id),
                      onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => handleDragEnd(el.id, e),
                      onTransformEnd: (e: Konva.KonvaEventObject<Event>) => handleTransformEnd(el.id, e),
                    };

                    if (el.type === 'text') {
                      return (
                        <Text
                          {...commonProps}
                          text={el.content || ''}
                          fontSize={el.fontSize || 24}
                          fontFamily={el.fontFamily || 'Inter'}
                          fill={el.fill || '#000000'}
                          width={el.width}
                          align={el.align as Konva.TextConfig['align'] || 'left'}
                          fontStyle={el.fontStyle || 'normal'}
                        />
                      );
                    }

                    if (el.type === 'rect') {
                      return (
                        <Rect
                          {...commonProps}
                          width={el.width || 100}
                          height={el.height || 80}
                          fill={el.fill || '#6366F1'}
                          stroke={el.stroke || 'transparent'}
                          strokeWidth={el.strokeWidth || 0}
                          cornerRadius={4}
                        />
                      );
                    }

                    if (el.type === 'circle') {
                      return (
                        <Circle
                          {...commonProps}
                          radius={(el.width || 80) / 2}
                          fill={el.fill || '#6366F1'}
                        />
                      );
                    }

                    return null;
                  })}

                  {/* Transformer */}
                  <Transformer
                    ref={transformerRef}
                    borderStroke="#6366F1"
                    borderStrokeWidth={1.5}
                    anchorStroke="#6366F1"
                    anchorFill="#FFFFFF"
                    anchorSize={8}
                    anchorCornerRadius={2}
                    rotateAnchorOffset={20}
                    enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right']}
                  />
                </Layer>
              </Stage>
            </div>
          </div>

          {/* Properties Panel */}
          {selectedEl && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 200, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex-shrink-0 bg-white border-l border-slate-100 overflow-y-auto"
            >
              <div className="p-3 space-y-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Properties</p>

                {/* Type indicator */}
                <div className="px-2 py-1.5 bg-slate-50 rounded-lg">
                  <p className="text-[10px] text-slate-400">Type: {selectedEl.type}</p>
                </div>

                {/* Color */}
                <div>
                  <p className="text-xs font-medium text-slate-600 mb-1.5">Color</p>
                  <div className="grid grid-cols-7 gap-1">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleUpdateSelected({ fill: c })}
                        className={`w-6 h-6 rounded-md ${selectedEl.fill === c ? 'ring-2 ring-indigo-400 ring-offset-1' : ''}`}
                        style={{ backgroundColor: c, border: c === '#FFFFFF' ? '1px solid #E2E8F0' : 'none' }}
                      />
                    ))}
                  </div>
                </div>

                {/* Text specific */}
                {selectedEl.type === 'text' && (
                  <>
                    <div>
                      <p className="text-xs font-medium text-slate-600 mb-1.5">Text</p>
                      <textarea
                        value={selectedEl.content || ''}
                        onChange={(e) => handleUpdateSelected({ content: e.target.value })}
                        className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-200 resize-none"
                        rows={3}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-600 mb-1.5">Font Size</p>
                      <input
                        type="range"
                        min={8}
                        max={120}
                        value={selectedEl.fontSize || 24}
                        onChange={(e) => handleUpdateSelected({ fontSize: Number(e.target.value) })}
                        className="w-full accent-indigo-500"
                      />
                      <p className="text-[10px] text-slate-400 text-right">{selectedEl.fontSize || 24}px</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-600 mb-1.5">Font</p>
                      <select
                        value={selectedEl.fontFamily || 'Inter'}
                        onChange={(e) => handleUpdateSelected({ fontFamily: e.target.value })}
                        className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-200 bg-white"
                      >
                        {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>

                    <div className="flex gap-1">
                      {[
                        { style: 'bold', icon: Bold },
                        { style: 'italic', icon: Italic },
                      ].map(({ style, icon: Icon }) => (
                        <button
                          key={style}
                          onClick={() => handleUpdateSelected({ fontStyle: selectedEl.fontStyle === style ? 'normal' : style })}
                          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center text-xs transition-all ${
                            selectedEl.fontStyle === style ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          <Icon size={13} />
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-1">
                      {[
                        { align: 'left', icon: AlignLeft },
                        { align: 'center', icon: AlignCenter },
                        { align: 'right', icon: AlignRight },
                      ].map(({ align, icon: Icon }) => (
                        <button
                          key={align}
                          onClick={() => handleUpdateSelected({ align })}
                          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center text-xs transition-all ${
                            selectedEl.align === align ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          <Icon size={13} />
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Position */}
                <div>
                  <p className="text-xs font-medium text-slate-600 mb-1.5">Position</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div>
                      <p className="text-[10px] text-slate-400 mb-0.5">X</p>
                      <input
                        type="number"
                        value={Math.round(selectedEl.x)}
                        onChange={(e) => handleUpdateSelected({ x: Number(e.target.value) })}
                        className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-200"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 mb-0.5">Y</p>
                      <input
                        type="number"
                        value={Math.round(selectedEl.y)}
                        onChange={(e) => handleUpdateSelected({ y: Number(e.target.value) })}
                        className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Rotation */}
                <div>
                  <p className="text-xs font-medium text-slate-600 mb-1.5">Rotation</p>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={selectedEl.rotation || 0}
                    onChange={(e) => handleUpdateSelected({ rotation: Number(e.target.value) })}
                    className="w-full accent-indigo-500"
                  />
                  <p className="text-[10px] text-slate-400 text-right">{selectedEl.rotation || 0}°</p>
                </div>

                {/* Delete */}
                <button
                  onClick={handleDeleteSelected}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={12} />
                  Delete Element
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Layers Panel */}
      {showLayersPanel && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 180, opacity: 1 }}
          className="bg-white border-l border-slate-100 flex-shrink-0 overflow-y-auto"
        >
          <div className="p-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Layers</p>
            {[...elements].reverse().map((el, i) => (
              <button
                key={el.id}
                onClick={() => setSelectedElement(el.id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all mb-0.5 ${
                  selectedElementId === el.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span className="text-[10px] text-slate-400 w-4">{elements.length - i}</span>
                <span className="text-xs flex-1 truncate capitalize">{el.type} {el.type === 'text' ? `"${(el.content || '').slice(0, 10)}"` : ''}</span>
                {el.locked && <Lock size={9} className="text-slate-300" />}
                {!el.visible && <EyeOff size={9} className="text-slate-300" />}
              </button>
            ))}
            {elements.length === 0 && (
              <p className="text-xs text-slate-400 py-4 text-center">No layers yet</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Color Picker Popup */}
      {showColorPicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowColorPicker(false)} />
          <div className="fixed left-14 top-40 z-50 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 w-52">
            <p className="text-xs font-semibold text-slate-600 mb-2">Pick Color</p>
            <div className="grid grid-cols-7 gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => { setSelectedColor(c); setShowColorPicker(false); }}
                  className={`w-7 h-7 rounded-lg ${selectedColor === c ? 'ring-2 ring-indigo-400 ring-offset-1' : ''}`}
                  style={{ backgroundColor: c, border: c === '#FFFFFF' ? '1px solid #E2E8F0' : 'none' }}
                />
              ))}
            </div>
            <div className="mt-3">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full h-8 rounded-lg cursor-pointer border border-slate-200"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
