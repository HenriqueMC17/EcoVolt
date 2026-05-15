'use client';

import React from 'react';
import { Sidebar } from '../../widgets/Sidebar/Sidebar';
import { Topbar } from '../../widgets/Topbar/Topbar';
import { useLayoutStore } from '../../store/useLayoutStore';
import { cn } from '../../shared/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useLayoutStore();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden flex relative">
      {/* Background Blobs for Enterprise Cinematic UX */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      <Sidebar />
      <Topbar />

      <main 
        className={cn(
          "flex-1 transition-all duration-300 pt-16 h-screen overflow-y-auto relative z-10",
          isSidebarOpen ? "ml-[260px]" : "ml-[80px]"
        )}
      >
        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
