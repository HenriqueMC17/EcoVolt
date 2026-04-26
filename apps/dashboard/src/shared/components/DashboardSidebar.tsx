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
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';
import { useUser } from '@/context/UserContext'; 

const menuItems = [
  { icon: LayoutDashboard, label: 'Visão Geral', path: '/dashboard', roles: ['admin', 'event_company', 'provider', 'operator'] },
  { icon: Calendar, label: 'Eventos', path: '/dashboard/eventos', roles: ['admin', 'event_company', 'provider'] },
  { icon: Zap, label: 'Estimativas', path: '/dashboard/estimativas', roles: ['admin', 'event_company'] },
  { icon: Users, label: 'Provedores', path: '/dashboard/provedores', roles: ['admin', 'event_company'] },
  { icon: FileText, label: 'Propostas', path: '/dashboard/propostas', roles: ['admin', 'event_company', 'provider'] },
  { icon: ClipboardCheck, label: 'Contratos', path: '/dashboard/contratos', roles: ['admin', 'event_company', 'provider', 'operator'] },
  { icon: BarChart3, label: 'Consumo', path: '/dashboard/consumo', roles: ['admin', 'event_company', 'provider', 'operator'] },
  { icon: DollarSign, label: 'Financeiro', path: '/dashboard/financeiro', roles: ['admin', 'event_company', 'provider', 'operator'] },
  { icon: ShieldCheck, label: 'Documentos', path: '/dashboard/documentos', roles: ['admin', 'event_company', 'provider', 'operator'] },
  { icon: PieChart, label: 'Relatórios', path: '/dashboard/relatorios', roles: ['admin', 'operator'] },
  { icon: Settings, label: 'Configurações', path: '/dashboard/configuracoes', roles: ['admin'] },
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
    <aside className="fixed left-0 top-0 h-screen w-64 glass border-r border-white/5 flex flex-col z-50">
      {/* Brand Section */}
      <div className="p-8">
        <div 
          className="flex items-center gap-4 cursor-pointer group" 
          onClick={() => navigate('/')}
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.25)] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Zap className="text-white relative z-10" size={26} />
          </motion.div>
          <div>
            <Typography variant="h4" className="text-xl font-black tracking-tighter leading-none mb-1">
              ECOVOLT
            </Typography>
            <div className="h-0.5 w-8 bg-primary rounded-full group-hover:w-full transition-all duration-500" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <div className="mb-4 px-4">
          <Typography variant="small" className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-black">
            Menu Principal
          </Typography>
        </div>
        
        {filteredItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative group"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 + 0.2 }}
                className={cn(
                  "nav-link-premium",
                  isActive ? "text-white" : "text-text-muted hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-bg"
                    className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl -z-10 shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <item.icon 
                  size={20} 
                  className={cn(
                    "transition-all duration-300",
                    isActive ? "text-primary scale-110" : "group-hover:text-primary group-hover:scale-110"
                  )} 
                />
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
                
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-indicator"
                    className="absolute left-[-1rem] w-1.5 h-6 bg-primary rounded-r-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* User & Settings Section */}
      <div className="p-6 border-t border-white/5 bg-white/[0.02] backdrop-blur-md">
        <div className="relative">
          <motion.button 
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-bg-surface-elevated to-white/10 border border-white/10 flex items-center justify-center font-black text-primary shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {user?.name.substring(0, 2).toUpperCase() || '??'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black truncate text-white">{user?.name || 'User'}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-[9px] uppercase tracking-widest text-primary font-black">
                  {user?.role?.replace('_', ' ') || 'Guest'}
                </p>
              </div>
            </div>
            <ChevronDown size={14} className={cn("text-text-muted transition-transform duration-500", isSwitcherOpen && "rotate-180")} />
          </motion.button>

          <AnimatePresence>
            {isSwitcherOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-full left-0 right-0 mb-4 glass rounded-2xl p-2 border border-white/10 shadow-2xl z-[60] overflow-hidden"
              >
                <div className="px-3 py-2 mb-1">
                  <Typography variant="small" className="text-[10px] uppercase tracking-widest text-text-muted font-bold">
                    Conta
                  </Typography>
                </div>
                <button 
                  onClick={() => { logout(); setIsSwitcherOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors text-xs font-black group"
                >
                  <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
                  <span>Encerrar Sessão</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
};
