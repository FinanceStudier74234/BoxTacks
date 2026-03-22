'use client';

import { statusConfig } from '@/data/sampleData';
import type { ProductStatus } from '@/types';

interface StatusBadgeProps {
  status: ProductStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig['idea'];
  const paddingClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${paddingClass}`}
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full inline-block"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
}
