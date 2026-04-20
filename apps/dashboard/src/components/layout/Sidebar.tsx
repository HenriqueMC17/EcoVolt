import React from 'react';
import { NavLink } from 'react-router-dom';
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
  Leaf,
  ChevronDown,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Visão Geral', path: '/', roles: ['admin', 'event_company', 'provider', 'operator'] },
  { icon: Calendar, label: 'Eventos', path: '/eventos', roles: ['admin', 'event_company', 'provider'] },
  { icon: Zap, label: 'Estimativas', path: '/estimativas', roles: ['admin', 'event_company'] },
  { icon: Users, label: 'Provedores', path: '/provedores', roles: ['admin', 'event_company'] },
  { icon: FileText, label: 'Propostas', path: '/propostas', roles: ['admin', 'event_company', 'provider'] },
  { icon: ClipboardCheck, label: 'Contratos', path: '/contratos', roles: ['admin', 'event_company', 'provider', 'operator'] },
  { icon: BarChart3, label: 'Consumo', path: '/consumo', roles: ['admin', 'event_company', 'provider', 'operator'] },
  { icon: DollarSign, label: 'Financeiro', path: '/financeiro', roles: ['admin', 'event_company', 'provider', 'operator'] },
  { icon: ShieldCheck, label: 'Documentos', path: '/documentos', roles: ['admin', 'event_company', 'provider', 'operator'] },
  { icon: PieChart, label: 'Relatórios', path: '/relatorios', roles: ['admin', 'operator'] },
  { icon: Settings, label: 'Configurações', path: '/configuracoes', roles: ['admin'] },
];

const Sidebar: React.FC = () => {
  const { user, switchUser, logout } = useUser();
  const allUsers = useQuery(api.users.getUsers);
  const [isSwitcherOpen, setIsSwitcherOpen] = React.useState(false);

  const filteredItems = menuItems.filter(item => 
    user?.role === 'admin' || (user && item.roles.includes(user.role))
  );

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'event_company': return 'Empresa de Eventos';
      case 'provider': return 'Provedor';
      case 'operator': return 'Operador Fin/Jur';
      default: return role;
    }
  };

  return (
    <aside className="glass" style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      borderRight: '1px solid var(--glass-border)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0 8px 32px',
        color: 'var(--primary)'
      }}>
        <Leaf size={32} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>EcoVolt</h1>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              textDecoration: 'none',
              color: isActive ? 'white' : 'var(--text-muted)',
              background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              transition: 'all 0.2s ease',
              border: isActive ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent'
            })}
          >
            <item.icon size={20} />
            <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Switcher / Profile Section */}
      <div style={{ position: 'relative', marginTop: 'auto' }}>
        <AnimatePresence>
          {isSwitcherOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                right: 0,
                background: '#1e293b',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '8px',
                marginBottom: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                zIndex: 110
              }}
            >
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '8px 12px' }}>Simular como:</p>
              {allUsers?.map((u) => (
                <button
                  key={u._id}
                  onClick={() => { switchUser(u.email); setIsSwitcherOpen(false); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '8px 12px',
                    background: user?.email === u.email ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{u.name}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{getRoleLabel(u.role)}</span>
                </button>
              ))}
              <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />
              <button
                onClick={() => { logout(); setIsSwitcherOpen(false); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'var(--error)',
                  cursor: 'pointer'
                }}
              >
                <LogOut size={14} />
                <span style={{ fontSize: '0.85rem' }}>Sair (Reset)</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div 
          onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
          style={{
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: 'white'
          }}>
            {user?.name.substring(0, 2).toUpperCase() || '??'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Desconhecido'}
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {user ? getRoleLabel(user.role) : 'Nenhum'}
            </p>
          </div>
          <ChevronDown size={16} color="var(--text-muted)" style={{ transform: isSwitcherOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
