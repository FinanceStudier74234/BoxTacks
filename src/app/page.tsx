'use client';

import dynamic from 'next/dynamic';

// Dynamically import AppShell to avoid SSR issues with Konva/Three.js
const AppShell = dynamic(() => import('@/components/layout/AppShell'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-slate-100">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">BT</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="text-sm text-slate-400 font-medium">Loading Boxtacks...</p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  return <AppShell />;
}
