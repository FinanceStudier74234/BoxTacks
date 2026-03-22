'use client';

import { Factory, Globe, Package, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import type { ProductItem, ManufacturingData } from '@/types';

const DEFAULT_MFG: ManufacturingData = {
  supplierName: '',
  moq: 0,
  leadTime: '',
  productionNotes: '',
  country: '',
  sampleStatus: 'not-started',
  revisionApproval: '',
  packagingRequirements: '',
  contactEmail: '',
};

const SAMPLE_STATUSES = [
  { id: 'not-started', label: 'Not Started', color: '#9CA3AF', icon: XCircle },
  { id: 'requested', label: 'Requested', color: '#F59E0B', icon: Clock },
  { id: 'received', label: 'Received', color: '#3B82F6', icon: Package },
  { id: 'approved', label: 'Approved', color: '#10B981', icon: CheckCircle },
  { id: 'rejected', label: 'Rejected', color: '#EF4444', icon: AlertCircle },
];

const COUNTRIES = [
  'China', 'Bangladesh', 'Vietnam', 'India', 'Turkey',
  'Portugal', 'Italy', 'USA', 'Mexico', 'Cambodia',
  'Pakistan', 'Indonesia', 'South Korea', 'Taiwan', 'Other',
];

interface Props {
  item: ProductItem;
}

export default function ManufacturingPanel({ item }: Props) {
  const { updateItemManufacturing } = useAppStore();
  const mfg = item.manufacturing || DEFAULT_MFG;

  const update = (key: keyof ManufacturingData, value: string | number) => {
    updateItemManufacturing(item.id, { ...mfg, [key]: value });
  };

  const currentSampleStatus = SAMPLE_STATUSES.find((s) => s.id === mfg.sampleStatus);

  return (
    <div className="p-4 space-y-5">
      {/* Sample Status */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Sample Status</p>
        <div className="space-y-1.5">
          {SAMPLE_STATUSES.map(({ id, label, color, icon: Icon }) => (
            <button
              key={id}
              onClick={() => update('sampleStatus', id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                mfg.sampleStatus === id
                  ? 'border-2 shadow-sm'
                  : 'border border-transparent bg-slate-50 hover:bg-slate-100'
              }`}
              style={mfg.sampleStatus === id ? { borderColor: color, backgroundColor: `${color}10` } : {}}
            >
              <Icon size={14} style={{ color }} />
              <span className="text-xs font-medium text-slate-700">{label}</span>
              {mfg.sampleStatus === id && (
                <span className="ml-auto w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: color }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Supplier */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Supplier</p>
        <div className="space-y-2">
          <div>
            <p className="text-[10px] text-slate-400 mb-1">Supplier Name</p>
            <input
              type="text"
              value={mfg.supplierName}
              onChange={(e) => update('supplierName', e.target.value)}
              placeholder="e.g. Alliance Garments Co."
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-200 text-slate-700 placeholder-slate-400"
            />
          </div>

          <div>
            <p className="text-[10px] text-slate-400 mb-1">Country / Source</p>
            <select
              value={mfg.country}
              onChange={(e) => update('country', e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none bg-white text-slate-700"
            >
              <option value="">Select country...</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <p className="text-[10px] text-slate-400 mb-1">Contact Email</p>
            <input
              type="email"
              value={mfg.contactEmail || ''}
              onChange={(e) => update('contactEmail', e.target.value)}
              placeholder="supplier@example.com"
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-200 text-slate-700 placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Production Details */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Production Details</p>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] text-slate-400 mb-1">MOQ</p>
              <input
                type="number"
                value={mfg.moq || ''}
                onChange={(e) => update('moq', parseInt(e.target.value) || 0)}
                placeholder="e.g. 100"
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-200 text-slate-700"
              />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 mb-1">Lead Time</p>
              <input
                type="text"
                value={mfg.leadTime}
                onChange={(e) => update('leadTime', e.target.value)}
                placeholder="e.g. 18-22 days"
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-200 text-slate-700"
              />
            </div>
          </div>

          <div>
            <p className="text-[10px] text-slate-400 mb-1">Production Notes</p>
            <textarea
              value={mfg.productionNotes}
              onChange={(e) => update('productionNotes', e.target.value)}
              placeholder="Quality requirements, special instructions..."
              rows={3}
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-200 text-slate-700 placeholder-slate-400 resize-none"
            />
          </div>

          <div>
            <p className="text-[10px] text-slate-400 mb-1">Packaging Requirements</p>
            <textarea
              value={mfg.packagingRequirements}
              onChange={(e) => update('packagingRequirements', e.target.value)}
              placeholder="Individual polybags, branded stickers..."
              rows={2}
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-200 text-slate-700 placeholder-slate-400 resize-none"
            />
          </div>

          <div>
            <p className="text-[10px] text-slate-400 mb-1">Revision Approval</p>
            <input
              type="text"
              value={mfg.revisionApproval}
              onChange={(e) => update('revisionApproval', e.target.value)}
              placeholder="e.g. v3 approved by Brand Director"
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-200 text-slate-700 placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Summary card */}
      {mfg.supplierName && (
        <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
          <div className="flex items-center gap-2 mb-2">
            <Factory size={13} className="text-indigo-500" />
            <p className="text-xs font-semibold text-indigo-700">Supplier Summary</p>
          </div>
          <div className="space-y-1">
            {mfg.supplierName && <p className="text-xs text-indigo-600">🏭 {mfg.supplierName}</p>}
            {mfg.country && <p className="text-xs text-indigo-600">🌍 {mfg.country}</p>}
            {mfg.moq > 0 && <p className="text-xs text-indigo-600">📦 MOQ: {mfg.moq} units</p>}
            {mfg.leadTime && <p className="text-xs text-indigo-600">⏱ {mfg.leadTime}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
