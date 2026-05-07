"use client";
import React from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTopbar } from './DashboardTopbar';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 selection:text-emerald-500">
      {/* Cinematic Overlays Global */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.05)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.05)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[120px]" />
      </div>

      <DashboardSidebar />
      
      <div className="pl-80 transition-all duration-700">
        <DashboardTopbar />
        
        <main className="pt-32 px-12 pb-20 max-w-[1920px] mx-auto min-h-screen relative">
          <AnimatePresence mode="wait">
            <motion.div
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
