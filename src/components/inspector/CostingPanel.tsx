'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { formatCurrency, calcTotalCost, calcMargin, calcMarkup, calcProfit } from '@/lib/utils';
import type { ProductItem, CostingData } from '@/types';

const DEFAULT_COSTING: CostingData = {
  unitCost: 0,
  packagingCost: 0,
  shippingCost: 0,
  laborCost: 0,
  overheadCost: 0,
  targetSellingPrice: 0,
  wholesalePrice: 0,
  retailPrice: 0,
  currency: 'USD',
};

interface Props {
  item: ProductItem;
}

export default function CostingPanel({ item }: Props) {
  const { updateItemCosting } = useAppStore();
  const costing = item.costing || DEFAULT_COSTING;

  const update = (key: keyof CostingData, value: number | string) => {
    updateItemCosting(item.id, { ...costing, [key]: value });
  };

  const totalCost = calcTotalCost(costing);
  const margin = calcMargin(costing.retailPrice, totalCost);
  const markup = calcMarkup(costing.retailPrice, totalCost);
  const profit = calcProfit(costing.retailPrice, totalCost);

  const marginColor =
    margin >= 60 ? 'text-emerald-600' :
    margin >= 40 ? 'text-blue-600' :
    margin >= 20 ? 'text-amber-600' :
    'text-red-600';

  const marginBg =
    margin >= 60 ? 'bg-emerald-50' :
    margin >= 40 ? 'bg-blue-50' :
    margin >= 20 ? 'bg-amber-50' :
    'bg-red-50';

  return (
    <div className="p-4 space-y-4">
      {/* Margin Summary */}
      {costing.retailPrice > 0 && (
        <div className={`${marginBg} rounded-2xl p-4`}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Margin</p>
              <p className={`text-2xl font-bold ${marginColor}`}>{margin.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Profit/Unit</p>
              <p className={`text-2xl font-bold ${marginColor}`}>{formatCurrency(profit)}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Cost</p>
              <p className="text-sm font-bold text-slate-700">{formatCurrency(totalCost)}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Markup</p>
              <p className="text-sm font-bold text-slate-700">{markup.toFixed(1)}%</p>
            </div>
          </div>

          {/* Margin bar */}
          <div className="mt-3">
            <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  margin >= 60 ? 'bg-emerald-500' :
                  margin >= 40 ? 'bg-blue-500' :
                  margin >= 20 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, margin))}%` }}
              />
            </div>
            <p className={`text-[10px] mt-1 font-medium ${marginColor}`}>
              {margin >= 60 ? '✓ Excellent margin' :
               margin >= 40 ? '✓ Good margin' :
               margin >= 20 ? '⚠ Low margin' : '✗ Below break-even risk'}
            </p>
          </div>
        </div>
      )}

      {/* Cost Inputs */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Cost Breakdown</p>
        <div className="space-y-2">
          {[
            { key: 'unitCost' as keyof CostingData, label: 'Unit Cost', placeholder: '0.00', icon: '🏭' },
            { key: 'packagingCost' as keyof CostingData, label: 'Packaging Cost', placeholder: '0.00', icon: '📦' },
            { key: 'shippingCost' as keyof CostingData, label: 'Shipping Cost', placeholder: '0.00', icon: '🚚' },
            { key: 'laborCost' as keyof CostingData, label: 'Labor Cost', placeholder: '0.00', icon: '👷' },
            { key: 'overheadCost' as keyof CostingData, label: 'Overhead', placeholder: '0.00', icon: '⚙️' },
          ].map(({ key, label, placeholder, icon }) => (
            <CostField
              key={key}
              icon={icon}
              label={label}
              value={costing[key] as number}
              placeholder={placeholder}
              onChange={(v) => update(key, v)}
            />
          ))}
        </div>

        {/* Total line */}
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-700">Total Cost</span>
          <span className="text-sm font-bold text-indigo-600">{formatCurrency(totalCost)}</span>
        </div>
      </div>

      {/* Pricing */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Pricing</p>
        <div className="space-y-2">
          {[
            { key: 'wholesalePrice' as keyof CostingData, label: 'Wholesale Price', icon: '🏪', color: 'blue' },
            { key: 'retailPrice' as keyof CostingData, label: 'Retail Price', icon: '🛍️', color: 'indigo' },
          ].map(({ key, label, icon, color }) => (
            <div key={key}>
              <p className="text-[10px] text-slate-400 mb-1">{icon} {label}</p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={costing[key] as number || ''}
                  onChange={(e) => update(key, parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className={`w-full pl-7 pr-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 font-medium ${
                    color === 'indigo'
                      ? 'border-indigo-200 focus:ring-indigo-100 text-indigo-700'
                      : 'border-slate-200 focus:ring-slate-100 text-slate-700'
                  }`}
                />
              </div>
              {(costing[key] as number) > 0 && (
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Margin: {calcMargin(costing[key] as number, totalCost).toFixed(1)}%
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Currency */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Currency</p>
        <select
          value={costing.currency}
          onChange={(e) => update('currency', e.target.value)}
          className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none bg-white text-slate-700"
        >
          {['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function CostField({
  icon, label, value, placeholder, onChange,
}: {
  icon: string;
  label: string;
  value: number;
  placeholder: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-500 truncate">{label}</span>
        </div>
      </div>
      <div className="relative w-24 flex-shrink-0">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
        <input
          type="number"
          step="0.01"
          min="0"
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          placeholder={placeholder}
          className="w-full pl-5 pr-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-200 text-right text-slate-700"
        />
      </div>
    </div>
  );
}
