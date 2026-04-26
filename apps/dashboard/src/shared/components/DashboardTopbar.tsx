import React from 'react';
import { Search, Bell, Plus, User as UserIcon, Settings } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';
import { motion } from 'framer-motion';

export const DashboardTopbar: React.FC = () => {
  const { user } = useUser();

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'admin': return 'text-primary border-primary/20 bg-primary/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
      case 'event_company': return 'text-blue-400 border-blue-400/20 bg-blue-400/10 shadow-[0_0_15px_rgba(96,165,250,0.1)]';
      case 'provider': return 'text-amber-400 border-amber-400/20 bg-amber-400/10 shadow-[0_0_15px_rgba(251,191,36,0.1)]';
      default: return 'text-text-muted border-white/10 bg-white/5';
    }
  };

  return (
    <header className="fixed top-0 right-0 left-64 h-20 glass border-b border-white/5 px-8 flex items-center justify-between z-40">
      {/* Left Section: Search */}
      <div className="flex items-center gap-8 flex-1">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors duration-300" size={18} />
          <input 
            type="text" 
            placeholder="Buscar dados, ativos ou contratos..." 
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary/40 focus:bg-white/[0.07] focus:shadow-[0_0_20px_rgba(16,185,129,0.05)] transition-all duration-300 placeholder:text-text-muted/50"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-text-muted font-bold tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-6">
        <motion.button 
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-hover text-black rounded-xl text-xs font-black uppercase tracking-wider hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all"
        >
          <Plus size={16} strokeWidth={3} />
          <span>Nova Ação</span>
        </motion.button>

        <div className="flex items-center gap-3 px-1 border-r border-white/5">
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.05)' }}
            className="p-2.5 text-text-muted hover:text-white rounded-xl transition-all relative"
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-bg-surface ring-2 ring-red-500/20" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.05)' }}
            className="p-2.5 text-text-muted hover:text-white rounded-xl transition-all"
          >
            <Settings size={20} />
          </motion.button>
        </div>

        <div className={cn(
          "flex items-center gap-2.5 px-4 py-2 border rounded-xl text-[10px] font-black tracking-[0.15em] uppercase transition-all duration-500",
          getRoleColor(user?.role)
        )}>
          <div className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
          <span>{user?.role?.replace('_', ' ') || 'Guest'}</span>
        </div>
      </div>
    </header>
  );
};
