import React from 'react';
import { 
  Download,
  User,
  Clock,
  Shield,
  ChevronRight,
  Filter,
  Search,
  Activity,
  AlertTriangle,
  Lock,
  TrendingUp
} from 'lucide-react';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import type { StatusType } from '../../../components/shared/StatusBadge';
import '../../../styles/enterprise-components.css';
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
  const getSeverityInfo = (severity: AuditLog['severity']): { type: StatusType; label: string } => {
    switch (severity) {
      case 'info':
        return { type: 'info', label: 'INFORMAÇÃO' };
      case 'warning':
        return { type: 'warning', label: 'AVISO' };
      case 'critical':
        return { type: 'error', label: 'CRÍTICO' };
      default:
        return { type: 'neutral', label: severity };
    }
  };

  const columns = [
    { 
      header: 'Horário', 
      accessor: 'timestamp' as keyof AuditLog,
      sortable: true,
      render: (row: AuditLog) => (
        <div className="flex items-center gap-2 text-muted">
          <Clock size={14} />
          <span className="font-mono text-xs">{row.timestamp}</span>
        </div>
      )
    },
    { 
      header: 'Usuário', 
      accessor: 'user' as keyof AuditLog,
      sortable: true,
      render: (row: AuditLog) => (
        <div className="flex items-center gap-2">
          <div className="user-avatar">
            <User size={12} />
          </div>
          <span className="font-medium text-sm">{row.user}</span>
        </div>
      )
    },
    { 
      header: 'Ação Realizada', 
      accessor: 'action' as keyof AuditLog,
      sortable: true,
      render: (row: AuditLog) => (
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{row.action}</span>
          <span className="text-xs text-muted truncate max-w-[200px]">{row.details}</span>
        </div>
      )
    },
    { 
      header: 'Módulo', 
      accessor: 'module' as keyof AuditLog,
      sortable: true,
      render: (row: AuditLog) => <span className="module-badge">{row.module}</span>
    },
    { 
      header: 'Severidade', 
      accessor: 'severity' as keyof AuditLog,
      sortable: true,
      render: (row: AuditLog) => {
        const { type, label } = getSeverityInfo(row.severity);
        return <StatusBadge status={type} label={label} variant="glass" size="sm" />;
      }
    },
    { 
      header: 'Ações', 
      accessor: 'id' as keyof AuditLog,
      render: () => (
        <button className="btn-icon-link">
          Detalhes <ChevronRight size={14} />
        </button>
      )
    }
  ];

  return (
    <div className="auditoria-page animate-fade-in">
      <div className="module-header">
        <div className="header-content">
          <div className="header-badge">Governança & Rastreabilidade</div>
          <h1 className="header-title">Trilha de Auditoria</h1>
          <p className="header-subtitle">Logs imutáveis de eventos, segurança e ações administrativas.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary flex items-center gap-2">
            <Shield size={18} />
            Compliance
          </button>
          <button className="btn btn-primary flex items-center gap-2">
            <Search size={18} />
            Busca Avançada
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box info">
              <Activity size={20} />
            </div>
            <div className="kpi-trend positive">
              <TrendingUp size={14} />
              <span>+8% vol.</span>
            </div>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Logs Total (24h)</p>
            <h3 className="kpi-value">1,240</h3>
            <p className="kpi-desc">Volume processado normal</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box error">
              <AlertTriangle size={20} />
            </div>
            <div className="kpi-trend negative">
              <span>Ação requerida</span>
            </div>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Alertas Críticos</p>
            <h3 className="kpi-value text-error">03</h3>
            <p className="kpi-desc">Incidentes de segurança</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box success">
              <Lock size={20} />
            </div>
            <div className="kpi-trend positive">
              <span>Sincronizado</span>
            </div>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Integridade Ledger</p>
            <h3 className="kpi-value">100%</h3>
            <p className="kpi-desc">Consistência de dados OK</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box primary">
              <Shield size={20} />
            </div>
            <div className="kpi-trend positive">
              <span>Excelente</span>
            </div>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Compliance Score</p>
            <h3 className="kpi-value">A+</h3>
            <p className="kpi-desc">Padrão ISO 27001</p>
          </div>
        </div>
      </div>

      <div className="audit-table-container">
        <div className="content-card-enterprise">
          <div className="card-header">
            <div className="header-info">
              <h3>Registro de Atividades</h3>
              <p>Histórico completo de ações realizadas no sistema</p>
            </div>
            <div className="header-actions">
              <div className="flex gap-2">
                <button className="btn btn-secondary btn-sm flex items-center gap-2">
                  <Filter size={16} /> Filtrar
                </button>
                <button className="btn btn-secondary btn-sm flex items-center gap-2">
                  <Download size={16} /> Exportar
                </button>
              </div>
            </div>
          </div>
          <div className="card-body">
            <DataTable 
              columns={columns}
              data={auditLogs}
              searchPlaceholder="Pesquisar por usuário, ação ou módulo..."
            />
          </div>
        </div>
      </div>

      {/* Intelligence Banner */}
      <div className="intelligence-banner glass animate-fade-in">
        <div className="banner-icon">
          <Shield size={24} className="text-secondary" />
        </div>
        <div className="banner-content">
          <span className="ai-badge-mini">Governança & Compliance</span>
          <h4>Política de Retenção de Dados</h4>
          <p>Em conformidade com a LGPD e normas regulatórias (ISO 27001), todos os logs são mantidos por <strong>24 meses</strong> em storage imutável com criptografia de ponta.</p>
        </div>
        <div className="banner-actions">
          <button className="btn btn-secondary btn-sm">Termos de Uso</button>
          <button className="icon-btn-glass"><ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
};

export default Auditoria;
