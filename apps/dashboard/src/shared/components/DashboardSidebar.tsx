import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';
// Note: We'll assume UserContext exists as per legacy code
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
  const { user, switchUser, logout } = useUser();
  const [isSwitcherOpen, setIsSwitcherOpen] = React.useState(false);
  const navigate = useNavigate();

  const filteredItems = menuItems.filter(item => 
    user?.role === 'admin' || (user && item.roles.includes(user.role))
  );

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass border-r border-white/5 flex flex-col p-6 z-50">
      <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <Zap className="text-black" size={24} />
        </div>
        <Typography variant="h4" className="text-xl font-bold tracking-tighter">
          ECOVOLT
        </Typography>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              isActive 
                ? "bg-primary/10 border border-primary/20 text-white" 
                : "text-text-muted hover:text-white hover:bg-white/5 border border-transparent"
            )}
          >
            <item.icon size={20} className={cn("transition-colors", "group-hover:text-primary")} />
            <span className="text-sm font-semibold">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="mt-auto relative pt-6 border-t border-white/5">
        <button 
          onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
          className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white shadow-lg">
            {user?.name.substring(0, 2).toUpperCase() || '??'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{user?.name || 'User'}</p>
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold">
              {user?.role || 'Guest'}
            </p>
          </div>
          <ChevronDown size={16} className={cn("text-text-muted transition-transform", isSwitcherOpen && "rotate-180")} />
        </button>

        <AnimatePresence>
          {isSwitcherOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-0 right-0 mb-4 glass rounded-2xl p-2 border border-white/10 shadow-2xl z-[60]"
            >
              <button 
                onClick={() => { logout(); setIsSwitcherOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors text-sm font-bold"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};
