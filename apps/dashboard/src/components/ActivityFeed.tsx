import React, { useState } from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { 
  PlusCircle, 
  RefreshCcw, 
  Trash2, 
  UserPlus, 
  UserMinus, 
  Building2, 
  FileText, 
  CreditCard,
  History,
  Activity,
  Filter,
  Download,
  X
} from 'lucide-react';

interface ActivityFeedProps {
  limit?: number;
  userEmail: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ limit = 20, userEmail }) => {
  const [entityType, setEntityType] = useState<string | undefined>(undefined);
  const activities = useQuery(api.activities.getRecentActivities, { 
    limit, 
    userEmail,
    entityType: entityType || undefined 
  });

  const exportToCSV = () => {
    if (!activities || activities.length === 0) return;

    const headers = ['Data', 'Usuário', 'Ação', 'Entidade', 'Detalhes'];
    const rows = activities.map(a => [
      new Date(a.createdAt).toLocaleString('pt-BR'),
      a.userName,
      a.action,
      a.entityType,
      typeof a.details === 'object' 
        ? (a.details.summary || JSON.stringify(a.details)).replace(/,/g, ';')
        : a.details.replace(/,/g, ';')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ecovolt_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getIcon = (action: string) => {
    if (action.includes('CREATE')) return <PlusCircle size={16} />;
    if (action.includes('UPDATE')) return <RefreshCcw size={16} />;
    if (action.includes('REMOVE') || action.includes('DELETE')) return <Trash2 size={16} />;
    if (action.includes('USER')) return <UserPlus size={16} />;
    if (action.includes('COMPANY')) return <Building2 size={16} />;
    if (action.includes('FINANCIAL')) return <CreditCard size={16} />;
    if (action.includes('EVENT')) return <Activity size={16} />;
    return <History size={16} />;
  };

  const getColor = (action: string) => {
    if (action.includes('CREATE')) return 'var(--success)';
    if (action.includes('UPDATE')) return 'var(--primary)';
    if (action.includes('REMOVE') || action.includes('DELETE')) return 'var(--error)';
    return 'var(--text-muted)';
  };

  const filterOptions = [
    { label: 'Todos', value: undefined },
    { label: 'Eventos', value: 'event' },
    { label: 'Consumo', value: 'consumption' },
    { label: 'Financeiro', value: 'financials' },
    { label: 'Contratos', value: 'contracts' },
    { label: 'Usuários', value: 'users' },
    { label: 'Empresas', value: 'companies' },
    { label: 'Propostas', value: 'proposals' },
    { label: 'Documentos', value: 'documents' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '0 4px',
        marginBottom: '4px',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          overflowX: 'auto', 
          paddingBottom: '8px', 
          flex: 1,
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}>
          {filterOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setEntityType(opt.value)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: '1px solid var(--border)',
                background: entityType === opt.value ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                color: entityType === opt.value ? 'white' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (entityType !== opt.value) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (entityType !== opt.value) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        
        <button
          onClick={exportToCSV}
          disabled={!activities || activities.length === 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '10px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border)',
            color: 'var(--text-main)',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: activities?.length ? 'pointer' : 'not-allowed',
            opacity: activities?.length ? 1 : 0.5,
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            if (activities?.length) {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.background = 'var(--bg-surface-elevated)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Download size={14} />
          Exportar Auditoria
        </button>
      </div>

      {activities === undefined ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '64px', borderRadius: '14px' }} />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          background: 'rgba(255, 255, 255, 0.01)', 
          borderRadius: '20px', 
          border: '1px dashed var(--border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <History size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.2 }} />
          <h3 style={{ color: 'var(--text-main)', fontSize: '1rem', marginBottom: '8px' }}>Sem Histórico</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px' }}>
            Nenhuma atividade registrada para os filtros selecionados até o momento.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activities.map((activity: any) => (
            <ActivityItem key={activity._id} activity={activity} getColor={getColor} getIcon={getIcon} />
          ))}
        </div>
      )}
    </div>
  );
};

const JsonDiffViewer = ({ details }: { details: any }) => {
  const { previous, updated, data, deletedRecord } = details;

  const renderSection = (title: string, obj: any, color: string) => {
    if (!obj) return null;
    
    // Filter out internal Convex fields and summary
    const filtered = Object.entries(obj)
      .filter(([key]) => !key.startsWith('_') && key !== 'summary')
      .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {});

    if (Object.keys(filtered).length === 0) return null;

    return (
      <div style={{ flex: 1, minWidth: '200px' }}>
        <p style={{ 
          fontSize: '0.65rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em', 
          color: color, 
          fontWeight: 700,
          marginBottom: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }}></span>
          {title}
        </p>
        <div style={{ 
          padding: '10px', 
          background: 'rgba(0, 0, 0, 0.25)', 
          borderRadius: '6px',
          borderLeft: `3px solid ${color}`,
          fontSize: '0.75rem',
          fontFamily: 'JetBrains Mono, SFMono-Regular, Consolas, monospace',
          color: 'rgba(255, 255, 255, 0.8)',
          lineHeight: '1.5'
        }}>
          {Object.entries(filtered).map(([key, val]: [string, any]) => (
            <div key={key} style={{ marginBottom: '2px' }}>
              <span style={{ color: 'var(--primary)', opacity: 0.8 }}>{key}:</span>{" "}
              <span>{typeof val === 'object' ? JSON.stringify(val) : String(val)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      marginTop: '12px', 
      display: 'flex', 
      flexDirection: 'row', 
      gap: '12px', 
      flexWrap: 'wrap',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      {renderSection('Estado Anterior', previous, 'var(--error)')}
      {renderSection('Novos Dados / Alterações', updated || data, 'var(--success)')}
      {renderSection('Registro Removido', deletedRecord, 'var(--error)')}
    </div>
  );
};

const ActivityItem = ({ activity, getColor, getIcon }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasStructuredDetails = typeof activity.details === 'object';
  const summary = hasStructuredDetails ? activity.details.summary : activity.details;

  return (
    <div 
      style={{ 
        display: 'flex', 
        gap: '14px', 
        padding: '16px', 
        borderRadius: '16px', 
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        alignItems: 'flex-start',
        cursor: hasStructuredDetails ? 'pointer' : 'default',
        boxShadow: isExpanded ? '0 8px 32px rgba(0,0,0,0.2)' : 'none',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={() => hasStructuredDetails && setIsExpanded(!isExpanded)}
      onMouseEnter={(e) => {
        if (!isExpanded) {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
          e.currentTarget.style.transform = 'translateY(-2px) translateX(2px)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isExpanded) {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
          e.currentTarget.style.transform = 'translateY(0) translateX(0)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
        }
      }}
    >
      <div style={{ 
        padding: '10px', 
        borderRadius: '12px', 
        background: `${getColor(activity.action)}15`,
        color: getColor(activity.action),
        marginTop: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 0 15px ${getColor(activity.action)}10`,
        border: `1px solid ${getColor(activity.action)}20`
      }}>
        {getIcon(activity.action)}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{activity.userName}</p>
            <span style={{ 
              fontSize: '0.65rem', 
              color: 'var(--text-muted)', 
              background: 'rgba(255, 255, 255, 0.08)', 
              padding: '2px 8px', 
              borderRadius: '6px',
              textTransform: 'uppercase',
              fontWeight: 800,
              letterSpacing: '0.04em',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              {activity.entityType}
            </span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', opacity: 0.6 }}>
            {new Date(activity.createdAt).toLocaleString('pt-BR', { 
              day: '2-digit', 
              month: '2-digit', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
        <p style={{ 
          fontSize: '0.85rem', 
          color: 'var(--text-main)', 
          opacity: 0.9, 
          lineHeight: '1.6',
          fontWeight: 400
        }}>
          {summary}
        </p>
        
        {isExpanded && hasStructuredDetails && (
          <JsonDiffViewer details={activity.details} />
        )}
      </div>
      
      {hasStructuredDetails && (
        <div style={{ 
          position: 'absolute', 
          right: '16px', 
          bottom: '12px', 
          fontSize: '0.65rem', 
          color: 'var(--primary)',
          opacity: isExpanded ? 0.9 : 0.5,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {isExpanded ? (
            <>Recolher <X size={10} /></>
          ) : (
            <>Ver detalhes <PlusCircle size={10} /></>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;

export default ActivityFeed;
