import React from 'react';
import { Search, Bell, Plus, User as UserIcon } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';

export const DashboardTopbar: React.FC = () => {
  const { user } = useUser();

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'admin': return 'text-primary border-primary/20 bg-primary/10';
      case 'event_company': return 'text-blue-400 border-blue-400/20 bg-blue-400/10';
      case 'provider': return 'text-amber-400 border-amber-400/20 bg-amber-400/10';
      default: return 'text-text-muted border-white/10 bg-white/5';
    }
  };

  return (
    <header className="fixed top-0 right-0 left-64 h-20 glass border-b border-white/5 px-8 flex items-center justify-between z-40">
      <div className="relative w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search energy data, assets, contracts..." 
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/40 focus:bg-white/10 transition-all"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-95">
          <Plus size={18} />
          <span>New Action</span>
        </button>

        <div className="relative cursor-pointer text-text-muted hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-bg-main" />
        </div>

        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 border rounded-lg text-[10px] font-black tracking-widest uppercase",
          getRoleColor(user?.role)
        )}>
          <UserIcon size={12} />
          <span>{user?.role || 'Guest'}</span>
        </div>
      </div>
    </header>
  );
};
