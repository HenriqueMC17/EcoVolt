"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Bell, 
  Globe, 
  ChevronDown,
  User,
  Monitor,
  Menu
} from 'lucide-react';
import { Typography } from '@/shared/ui/typography';

interface TopNavProps {
  onMenuClick?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 lg:left-80 right-0 h-24 bg-black/30 backdrop-blur-md border-b border-white/5 px-6 lg:px-10 flex items-center justify-between z-40">
      {/* Mobile Menu Trigger */}
      <button 
        onClick={onMenuClick}
        className="p-2 mr-4 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-colors lg:hidden"
      >
        <Menu size={20} className="text-slate-400" />
      </button>
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="SEARCH_NEXUS_DATA_STREAM..." 
            className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 text-xs font-black tracking-widest text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all uppercase italic"
          />
        </div>
      </div>

      {/* System Actions */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-6 border-r border-white/10 pr-8">
          <motion.button whileHover={{ scale: 1.1 }} className="relative p-2 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-colors">
            <Bell size={20} className="text-slate-400" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,1)]" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} className="p-2 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-colors">
            <Globe size={20} className="text-slate-400" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} className="p-2 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-colors">
            <Monitor size={20} className="text-slate-400" />
          </motion.button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="flex flex-col items-end">
            <Typography variant="small" className="text-white leading-none mb-1">Henrique_MC17</Typography>
            <Typography variant="small" className="text-[9px] text-emerald-500 tracking-[0.2em]">ADMIN_AUTH</Typography>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-800 p-0.5 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
              <User size={24} className="text-emerald-500" />
            </div>
          </div>
          <ChevronDown size={16} className="text-slate-600 group-hover:text-emerald-500 transition-colors" />
        </div>
      </div>
    </header>
  );
};
