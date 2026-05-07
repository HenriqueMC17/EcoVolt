"use client";
import React, { useState } from 'react';
import { Sidebar } from './sidebar/ui/Sidebar';
import { TopNav } from './top-nav/ui/TopNav';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/lib/utils';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 selection:text-emerald-500 overflow-x-hidden">
      {/* Cinematic Overlays Global */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.05)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.05)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[120px]" />
        
        {/* Grain Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" 
             style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
      </div>

      {/* Sidebar handling */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transition-transform duration-500 lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <Sidebar />
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}
      
      <div className={cn(
        "transition-all duration-700 min-h-screen",
        "lg:pl-80"
      )}>
        <TopNav onMenuClick={toggleSidebar} />
        
        <main className="pt-24 min-h-screen relative">
          <AnimatePresence mode="wait">
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
          
          {/* Subtle Global Scanline */}
          <div className="fixed inset-0 scanline opacity-[0.01] pointer-events-none z-50" />
        </main>
      </div>
    </div>
  );
};
