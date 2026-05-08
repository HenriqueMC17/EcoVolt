import React from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download,
  User,
  Clock,
  Shield,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import DataTable from '../../../components/shared/DataTable';
import './Auditoria.css';

interface AuditLog {
  id: string;
  user: string;
  action: string;
  module: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
  details: string;
}

const auditLogs: AuditLog[] = [
  { id: 'LOG-8821', user: 'Carlos Andrade', action: 'Aprovação de Proposta', module: 'Comercial', timestamp: '10/05/2024 14:30', severity: 'info', details: 'Proposta #PR-2024-05 aprovada para SolarGrid.' },
  { id: 'LOG-8820', user: 'Sistema', action: 'Alerta de Consumo', module: 'Operação', timestamp: '10/05/2024 12:15', severity: 'warning', details: 'Pico de carga detectado no Medidor MT-03 (Food Park).' },
  { id: 'LOG-8819', user: 'Ana Paula', action: 'Edição de Contrato', module: 'Comercial', timestamp: '10/05/2024 10:05', severity: 'info', details: 'Cláusula de rescisão alterada no contrato #CTR-459.' },
  { id: 'LOG-8818', user: 'Roberto Silva', action: 'Tentativa de Login Falha', module: 'Segurança', timestamp: '09/05/2024 22:45', severity: 'critical', details: 'Múltiplas tentativas de acesso com credenciais inválidas.' },
  { id: 'LOG-8817', user: 'Carlos Andrade', action: 'Exclusão de Rascunho', module: 'Operação', timestamp: '09/05/2024 16:20', severity: 'info', details: 'Simulação de demanda removida permanentemente.' },
];

const Auditoria: React.FC = () => {
  const columns = [
    { 
      header: 'Horário', 
      accessor: 'timestamp',
      render: (row: AuditLog) => (
        <div className="flex-center gap-2 text-muted">
          <Clock size={14} />
          <span>{row.timestamp}</span>
        </div>
      )
    },
    { 
      header: 'Usuário', 
      accessor: 'user',
      render: (row: AuditLog) => (
        <div className="flex-center gap-2">
          <div className="avatar-sm"><User size={12} /></div>
          <span className="font-medium">{row.user}</span>
        </div>
      )
    },
    { header: 'Ação', accessor: 'action' },
    { 
      header: 'Módulo', 
      accessor: 'module',
      render: (row: AuditLog) => <span className="module-tag">{row.module}</span>
    },
    { 
      header: 'Severidade', 
      accessor: 'severity',
      render: (row: AuditLog) => (
        <span className={`severity-dot ${row.severity}`}>
          {row.severity.toUpperCase()}
        </span>
      )
    },
    { 
      header: 'Ações', 
      accessor: 'id',
      render: () => (
        <button className="text-primary hover:underline flex-center gap-1">
          Detalhes <ChevronRight size={14} />
        </button>
      )
    }
  ];

  return (
    <div className="auditoria-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Trilha de Auditoria</h1>
          <p className="page-subtitle">Logs de eventos, segurança e governança operacional.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary flex-center gap-2">
            <Shield size={18} />
            Exportar Relatório de Compliance
          </button>
          <button className="btn btn-primary">Configurar Alertas</button>
        </div>
      </div>

      <div className="audit-stats">
        <div className="stat-box glass">
          <p className="label">Total de Logs (24h)</p>
          <h3>1.240</h3>
        </div>
        <div className="stat-box glass">
          <p className="label">Alertas Críticos</p>
          <h3 className="text-critical">3</h3>
        </div>
        <div className="stat-box glass">
          <p className="label">Integridade do Ledger</p>
          <h3 className="text-success">100%</h3>
        </div>
        <div className="stat-box glass">
          <p className="label">Uptime de Governança</p>
          <h3>99.9%</h3>
        </div>
      </div>

      <div className="audit-filters glass">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Filtrar por usuário, ação ou detalhe..." />
        </div>
        <div className="actions">
          <button className="filter-btn"><Filter size={18} /> Filtrar</button>
          <button className="export-btn"><Download size={18} /> Exportar CSV</button>
        </div>
      </div>

      <div className="audit-table">
        <DataTable 
          title="Histórico de Atividades"
          columns={columns}
          data={auditLogs}
        />
      </div>

      <div className="audit-footer glass">
        <div className="info">
          <History size={20} className="text-primary" />
          <div>
            <h4>Retenção de Dados</h4>
            <p>Seus logs de auditoria estão configurados para retenção de <strong>24 meses</strong> para fins de conformidade legal.</p>
          </div>
        </div>
        <button className="btn btn-secondary flex-center gap-2">
          Ver Política de Retenção <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
};

export default Auditoria;
