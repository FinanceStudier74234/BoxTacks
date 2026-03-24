'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, ArrowRight, Zap, BookTemplate } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { generateSKU } from '@/lib/utils';
import type { Template, TemplateCategory } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

const CATEGORIES: TemplateCategory[] = ['Apparel', 'Packaging', 'Stationery', 'Poster', 'Business'];

export default function TemplateGallery() {
  const { templates, addItem, categories, openNewItemModal, setNotification, setCurrentView } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const filtered = templates.filter((t) => {
    const matchCat = activeCategory === 'All' || t.category === activeCategory;
    const matchSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const handleUseTemplate = (template: Template) => {
    const defaultCategory =
      categories.find((c) => c.id === 'cat-apparel') || categories[0];
    if (!defaultCategory) return;

    addItem({
      name: template.name,
      type: template.category,
      sku: generateSKU(template.category, template.name),
      status: 'designing',
      tags: template.tags,
      designData: {
        elements: template.designData?.elements || [],
        background: template.designData?.background || '#FFFFFF',
        width: template.designData?.width || 500,
        height: template.designData?.height || 600,
        currentView: template.designData?.currentView || 'front',
      },
      categoryId: defaultCategory.id,
    });

    setNotification({ type: 'success', message: `Template "${template.name}" applied!` });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BookTemplate size={18} className="text-indigo-500" />
                <h1 className="text-xl font-bold text-slate-900">Template Library</h1>
              </div>
              <p className="text-sm text-slate-500">
                {templates.length} professional templates for products, packaging, and more
              </p>
            </div>
          </div>

          {/* Search + Category filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 text-slate-700"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {(['All', ...CATEGORIES] as (TemplateCategory | 'All')[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-indigo-500 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Template Grid */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-sm">No templates found for &quot;{searchQuery}&quot;</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filtered.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onUse={handleUseTemplate}
                onPreview={setSelectedTemplate}
              />
            ))}
          </motion.div>
        )}

        {/* Featured section */}
        {activeCategory === 'All' && !searchQuery && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Star size={14} className="text-amber-400" />
              <p className="text-sm font-semibold text-slate-700">Premium Templates</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {templates.filter((t) => t.isPremium).map((template) => (
                <motion.div
                  key={template.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                >
                  <TemplateCard
                    template={template}
                    onUse={handleUseTemplate}
                    onPreview={setSelectedTemplate}
                    featured
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setSelectedTemplate(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden z-10"
            >
              {/* Preview graphic */}
              <div
                className="h-56 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${selectedTemplate.color}20, ${selectedTemplate.color}40)` }}
              >
                <div
                  className="w-28 h-28 rounded-2xl flex items-center justify-center text-5xl shadow-xl"
                  style={{ backgroundColor: selectedTemplate.color }}
                >
                  {selectedTemplate.icon}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{selectedTemplate.name}</h2>
                    <p className="text-sm text-slate-500 mt-0.5">{selectedTemplate.category} Template</p>
                  </div>
                  {selectedTemplate.isPremium && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-full border border-amber-200">
                      <Star size={10} /> Premium
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-600 mb-4">{selectedTemplate.description}</p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {selectedTemplate.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-slate-50 text-slate-500 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { handleUseTemplate(selectedTemplate); setSelectedTemplate(null); }}
                    className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <Zap size={14} />
                    Use Template
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ------------------------------------------------------------------
// Template Card
// ------------------------------------------------------------------
function TemplateCard({
  template, onUse, onPreview, featured = false,
}: {
  template: Template;
  onUse: (t: Template) => void;
  onPreview: (t: Template) => void;
  featured?: boolean;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className={`group bg-white rounded-2xl border overflow-hidden cursor-pointer card-hover ${
        featured ? 'border-amber-200' : 'border-slate-100'
      }`}
      onClick={() => onPreview(template)}
    >
      {/* Card visual */}
      <div
        className="h-32 flex items-center justify-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${template.color}18 0%, ${template.color}35 100%)` }}
      >
        {/* Decorative background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 80% 80%, ${template.color}, transparent 60%)`,
          }}
        />

        <span className="text-4xl relative z-10 group-hover:scale-110 transition-transform duration-200">
          {template.icon}
        </span>

        {template.isPremium && (
          <div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-400 text-white text-[9px] font-bold rounded-full">
            <Star size={8} />
            PRO
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="px-3 py-1.5 bg-white rounded-lg shadow-lg text-xs font-semibold text-slate-700">
              Preview
            </div>
          </div>
        </div>
      </div>

      <div className="p-3">
        <p className="text-sm font-semibold text-slate-800 truncate">{template.name}</p>
        <p className="text-[11px] text-slate-400 mt-0.5 truncate">{template.description}</p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-1">
            {template.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="px-1.5 py-0.5 bg-slate-50 text-slate-400 text-[9px] rounded-md">
                #{tag}
              </span>
            ))}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onUse(template); }}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-semibold rounded-lg hover:opacity-90 transition-all shadow-sm"
          >
            Use <ArrowRight size={9} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
