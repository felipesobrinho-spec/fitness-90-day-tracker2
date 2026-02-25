'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const tabs = [
  { id: '/dashboard', label: 'Home', icon: '🏠' },
  { id: '/workout', label: 'Workout', icon: '💪' },
  { id: '/nutrition', label: 'Nutrition', icon: '🥗' },
  { id: '/history', label: 'History', icon: '📅' },
  { id: '/profile', label: 'Profile', icon: '👤' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isSetupComplete, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isSetupComplete) {
      router.push('/setup');
    } else if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isSetupComplete, isLoading, router]);

  if (isLoading || !isAuthenticated || !isSetupComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {children}
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 safe-area-inset-bottom z-50">
        <div className="flex items-center justify-around px-2 py-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => router.push(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                pathname === tab.id
                  ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-cyan-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
