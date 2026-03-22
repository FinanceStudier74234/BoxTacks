'use client';

import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
    >
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-3xl mb-4 shadow-sm">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-700 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-xs mb-6 leading-relaxed">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-xl shadow-brand hover:shadow-lg hover:opacity-90 transition-all"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
