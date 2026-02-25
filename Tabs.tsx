'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TabsProps {
  tabs: { id: string; label: string; icon?: ReactNode }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-black/80 backdrop-blur-xl border-t border-white/10',
        'safe-area-inset-bottom',
        className
      )}
    >
      <div className="flex items-center justify-around px-2 py-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200',
              activeTab === tab.id
                ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-cyan-400'
                : 'text-gray-400 hover:text-white'
            )}
          >
            {tab.icon && <div className="text-2xl">{tab.icon}</div>}
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
