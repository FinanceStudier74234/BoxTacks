'use client';

import { STATUS_COLOR, STATUS_LABEL, STATUS_BG } from '@/constants/statusConfig';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = Object.fromEntries(
  Object.keys(STATUS_COLOR).map((key) => [
    key,
    { label: STATUS_LABEL[key as keyof typeof STATUS_LABEL], color: STATUS_COLOR[key as keyof typeof STATUS_COLOR], bg: STATUS_BG[key as keyof typeof STATUS_BG] },
  ])
);
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
