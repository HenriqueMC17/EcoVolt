import { Search, Bell, Plus, User as UserIcon } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const Topbar: React.FC = () => {
  const { user } = useUser();

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'admin': return { label: 'ADMIN', color: 'var(--primary)' };
      case 'event_company': return { label: 'EVENTOS', color: '#6366f1' };
      case 'provider': return { label: 'PROVEDOR', color: '#f59e0b' };
      case 'operator': return { label: 'OPERADOR', color: '#ec4899' };
      default: return { label: 'USER', color: 'var(--text-muted)' };
    }
  };

  const badge = getRoleBadge(user?.role);

  return (
    <header className="glass" style={{
      height: 'var(--topbar-height)',
      position: 'fixed',
      top: 0,
      right: 0,
      left: 'var(--sidebar-width)',
      zIndex: 90,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      borderBottom: '1px solid var(--glass-border)'
    }}>
      <div style={{ position: 'relative', width: '400px' }}>
        <Search size={18} style={{ 
          position: 'absolute', 
          left: '16px', 
          top: '50%', 
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)'
        }} />
        <input 
          type="text" 
          placeholder="Buscar eventos, contratos, provedores..." 
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '10px 16px 10px 48px',
            color: 'white',
            outline: 'none',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {user?.role === 'event_company' && (
          <button className="btn btn-primary">
            <Plus size={18} />
            <span>Novo Evento</span>
          </button>
        )}

        <div style={{ position: 'relative', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <Bell size={20} />
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '8px',
            height: '8px',
            background: 'var(--error)',
            borderRadius: '50%',
            border: '2px solid var(--bg-main)'
          }} />
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 12px',
          background: `${badge.color}10`,
          borderRadius: '8px',
          border: `1px solid ${badge.color}20`,
          fontSize: '0.75rem',
          fontWeight: 600,
          color: badge.color
        }}>
          <UserIcon size={14} />
          <span>{badge.label}</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
