// ============================================================
// Boxtacks - Shared Status & Design Token Constants
// ============================================================
import type { ProductStatus } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// STATUS PIPELINE CONFIG
// ─────────────────────────────────────────────────────────────────────────────
export interface StatusEntry {
  label: string;
  color: string;
  bg: string;
  border: string;
  headerBg: string;
}

export const STATUS_COLOR: Record<ProductStatus, string> = {
  idea: '#94a3b8',
  designing: '#3b82f6',
  'sample-ordered': '#f59e0b',
  'in-revision': '#f97316',
  approved: '#10b981',
  'production-ready': '#6366f1',
};

export const STATUS_LABEL: Record<ProductStatus, string> = {
  idea: 'Idea',
  designing: 'Designing',
  'sample-ordered': 'Sample Ordered',
  'in-revision': 'In Revision',
  approved: 'Approved',
  'production-ready': 'Production Ready',
};

export const STATUS_BG: Record<ProductStatus, string> = {
  idea: '#f1f5f9',
  designing: '#eff6ff',
  'sample-ordered': '#fffbeb',
  'in-revision': '#fff7ed',
  approved: '#ecfdf5',
  'production-ready': '#eef2ff',
};

export const STATUS_CONFIG: Record<ProductStatus, StatusEntry> = {
  idea: {
    label: 'Idea',
    color: '#94a3b8',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    headerBg: 'bg-slate-100',
  },
  designing: {
    label: 'Designing',
    color: '#3b82f6',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    headerBg: 'bg-blue-50',
  },
  'sample-ordered': {
    label: 'Sample Ordered',
    color: '#f59e0b',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    headerBg: 'bg-amber-50',
  },
  'in-revision': {
    label: 'In Revision',
    color: '#f97316',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    headerBg: 'bg-orange-50',
  },
  approved: {
    label: 'Approved',
    color: '#10b981',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    headerBg: 'bg-emerald-50',
  },
  'production-ready': {
    label: 'Production Ready',
    color: '#6366f1',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    headerBg: 'bg-indigo-50',
  },
};

export const ALL_STATUSES: ProductStatus[] = [
  'idea',
  'designing',
  'sample-ordered',
  'in-revision',
  'approved',
  'production-ready',
];

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT TYPE EMOJI MAP
// ─────────────────────────────────────────────────────────────────────────────
export const PRODUCT_TYPE_EMOJI: Record<string, string> = {
  Hoodie: '🧥',
  'T-Shirt': '👕',
  Sweatshirt: '👕',
  Jacket: '🧥',
  'Mailer Box': '📦',
  'Hang Tag': '🏷️',
  'Insert Card': '💌',
  'Gift Box': '🎁',
  Notebook: '📒',
  Planner: '📅',
  'Card Set': '🃏',
  Poster: '🖼️',
  'Desk Mat': '🖥️',
  Sticker: '⭐',
  Cap: '🧢',
  Tote: '👜',
};

// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE STATUS CONFIG (manufacturing)
// ─────────────────────────────────────────────────────────────────────────────
export const SAMPLE_STATUS_COLORS: Record<string, string> = {
  'not-started': '#94a3b8',
  requested: '#f59e0b',
  received: '#3b82f6',
  approved: '#10b981',
  rejected: '#ef4444',
};

export const SAMPLE_STATUS_LABELS: Record<string, string> = {
  'not-started': 'Not Started',
  requested: 'Requested',
  received: 'Received',
  approved: 'Approved',
  rejected: 'Rejected',
};

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN PALETTE COLORS
// ─────────────────────────────────────────────────────────────────────────────
export const DESIGN_PALETTE = [
  '#FFFFFF', '#000000', '#EF4444', '#F97316', '#F59E0B',
  '#10B981', '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6',
  '#EC4899', '#1E293B', '#64748B', '#CBD5E1',
];

export const PRODUCT_COLORS = [
  { name: 'Black', hex: '#1E293B' },
  { name: 'White', hex: '#F8FAFC' },
  { name: 'Indigo', hex: '#6366F1' },
  { name: 'Navy', hex: '#1E3A5F' },
  { name: 'Stone', hex: '#78716C' },
  { name: 'Coral', hex: '#F97316' },
  { name: 'Forest', hex: '#166534' },
  { name: 'Burgundy', hex: '#7F1D1D' },
];
