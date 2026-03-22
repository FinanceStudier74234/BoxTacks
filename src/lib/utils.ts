import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { CostingData } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function calcTotalCost(costing: CostingData): number {
  return (
    costing.unitCost +
    costing.packagingCost +
    costing.shippingCost +
    costing.laborCost +
    costing.overheadCost
  );
}

export function calcMargin(sellingPrice: number, totalCost: number): number {
  if (sellingPrice === 0) return 0;
  return ((sellingPrice - totalCost) / sellingPrice) * 100;
}

export function calcMarkup(sellingPrice: number, totalCost: number): number {
  if (totalCost === 0) return 0;
  return ((sellingPrice - totalCost) / totalCost) * 100;
}

export function calcProfit(sellingPrice: number, totalCost: number): number {
  return sellingPrice - totalCost;
}

export function truncate(str: string, len = 30): string {
  return str.length > len ? str.slice(0, len) + '…' : str;
}

export function generateSKU(categoryName: string, productName: string): string {
  const catCode = categoryName.slice(0, 3).toUpperCase();
  const prodCode = productName.slice(0, 3).toUpperCase();
  const num = Math.floor(Math.random() * 900) + 100;
  return `${catCode}-${prodCode}-${num}`;
}

export function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}
