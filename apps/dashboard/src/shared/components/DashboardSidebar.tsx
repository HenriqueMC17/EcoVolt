import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Zap, 
  Users, 
  FileText, 
  ClipboardCheck, 
  BarChart3, 
  DollarSign, 
  ShieldCheck, 
  PieChart, 
  Settings,
  ChevronDown,
  LogOut,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';
import { useUser } from '@/context/UserContext'; 

const menuItems = [
  { icon: LayoutDashboard, label: 'Control Room', path: '/dashboard', roles: ['admin', 'event_company', 'provider', 'operator'] },
  { icon: Calendar, label: 'Live Events', path: '/dashboard/eventos', roles: ['admin', 'event_company', 'provider'] },
  { icon: Zap, label: 'Grid Estimates', path: '/dashboard/estimativas', roles: ['admin', 'event_company'] },
  { icon: Users, label: 'Supply Chain', path: '/dashboard/provedores', roles: ['admin', 'event_company'] },
  { icon: FileText, label: 'Proposals', path: '/dashboard/propostas', roles: ['admin', 'event_company', 'provider'] },
  { icon: ClipboardCheck, label: 'Registry', path: '/dashboard/contratos', roles: ['admin', 'event_company', 'provider', 'operator'] },
  { icon: BarChart3, label: 'Telemetria', path: '/dashboard/consumo', roles: ['admin', 'event_company', 'provider', 'operator'] },
  { icon: DollarSign, label: 'Settlement', path: '/dashboard/financeiro', roles: ['admin', 'event_company', 'provider', 'operator'] },
  { icon: ShieldCheck, label: 'Audit Logs', path: '/dashboard/documentos', roles: ['admin', 'event_company', 'provider', 'operator'] },
  { icon: Settings, label: 'Protocol Settings', path: '/dashboard/configuracoes', roles: ['admin'] },
];

export const DashboardSidebar: React.FC = () => {
  const { user, logout } = useUser();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const filteredItems = menuItems.filter(item => 
    user?.role === 'admin' || (user && item.roles.includes(user.role))
  );

  return (
    <aside className="fixed left-0 top-0 h-screen w-80 glass-thick border-r border-white/5 flex flex-col z-50">
      {/* High-Tech Branding */}
      <div className="p-10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50" />
        
        <div 
          className="flex items-center gap-5 cursor-pointer relative z-10" 
          onClick={() => navigate('/')}
        >
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-[1.25rem] bg-slate-950 flex items-center justify-center border border-white/10 shadow-[0_0_40px_rgba(16,185,129,0.15)] relative group-hover:border-primary/40 transition-all duration-700"
          >
            <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <Zap className="text-primary relative z-10 animate-pulse" size={30} strokeWidth={2.5} />
          </motion.div>
          
          <div className="space-y-1">
            <Typography variant="h4" className="text-2xl font-black tracking-[-0.05em] leading-none text-white uppercase italic">
              ECO<span className="text-primary">VOLT</span>
            </Typography>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <Typography className="text-[9px] font-black tracking-[0.4em] text-slate-500 uppercase">
                Enterprise OS
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Ledger */}
      <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar pt-4">
        <div className="mb-6 px-4 flex items-center justify-between">
          <Typography className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black">
            System Protocols
          </Typography>
          <Sparkles size={12} className="text-primary/40" />
        </div>
        
        {filteredItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative group block"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 + 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "nav-link-premium min-h-[56px] px-5",
                  isActive ? "text-white" : "text-slate-400 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-bg"
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-l-2 border-primary rounded-r-2xl -z-10"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.8 }}
                  />
                )}
                
                <item.icon 
                  size={22} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={cn(
                    "transition-all duration-500",
                    isActive ? "text-primary drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "group-hover:text-primary group-hover:scale-110"
                  )} 
                />
                
                <span className={cn(
                  "text-xs font-black uppercase tracking-[0.1em] transition-all duration-500",
                  isActive ? "translate-x-1" : "group-hover:translate-x-1"
                )}>
                  {item.label}
                </span>

                {isActive && (
                  <motion.div 
                    layoutId="active-nav-glow"
                    className="absolute right-4 w-1 h-1 rounded-full bg-primary shadow-[0_0_12px_rgba(16,185,129,1)]"
                  />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Profile & Security Vault */}
      <div className="p-8 border-t border-white/5 relative overflow-hidden bg-slate-950/20">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
        
        <div className="relative">
          <motion.button 
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="w-full flex items-center gap-4 p-4 rounded-3xl bg-slate-900/60 border border-white/5 hover:border-white/10 transition-all text-left shadow-2xl backdrop-blur-xl group"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 flex items-center justify-center font-black text-primary shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                {user?.name.substring(0, 2).toUpperCase() || '??'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-950 shadow-lg" />
            </div>
            
            <div className="flex-1 min-w-0">
              <Typography className="text-sm font-black truncate text-white tracking-tight uppercase italic leading-none mb-1">
                {user?.name || 'Authorized'}
              </Typography>
              <Typography className="text-[9px] font-black tracking-[0.2em] text-primary uppercase opacity-70">
                {user?.role?.replace('_', ' ') || 'Protocol Guest'}
              </Typography>
            </div>
            
            <ChevronDown size={14} className={cn("text-slate-500 transition-transform duration-700", isSwitcherOpen && "rotate-180")} />
          </motion.button>

          <AnimatePresence>
            {isSwitcherOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.9 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute bottom-full left-0 right-0 mb-6 glass-thick rounded-[2.5rem] p-4 border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] z-[60]"
              >
                <div className="px-5 py-3 mb-2">
                  <Typography className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black">
                    Security Session
                  </Typography>
                </div>
                
                <div className="space-y-1">
                  <button 
                    onClick={() => { logout(); setIsSwitcherOpen(false); }}
                    className="w-full flex items-center justify-between px-6 py-4 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all duration-300 text-[10px] font-black uppercase tracking-widest group"
                  >
                    <span>Terminate Session</span>
                    <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
};
