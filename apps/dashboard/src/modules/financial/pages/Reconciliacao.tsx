import React from 'react';
import { 
  Scale, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Download,
  FileText,
  Zap,
  TrendingUp,
  ShieldCheck,
  FileSearch,
  AlertTriangle
} from 'lucide-react';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import type { StatusType } from '../../../components/shared/StatusBadge';
import './Reconciliacao.css';

interface ReconciliationItem {
  id: string;
  event: string;
  provider: string;
  estimatedKwh: number;
  actualKwh: number;
  difference: number;
  status: 'reconciled' | 'pending' | 'disputed' | 'analyzing';
  date: string;
}

const reconciliationData: ReconciliationItem[] = [
  { id: 'REC-001', event: 'Tomorrowland Brasil', provider: 'SolarGrid', estimatedKwh: 15000, actualKwh: 14850, difference: -1, status: 'reconciled', date: '12/10/2024' },
  { id: 'REC-002', event: 'Rock in Rio', provider: 'WindFlow', estimatedKwh: 85000, actualKwh: 89200, difference: 4.9, status: 'pending', date: '25/09/2024' },
  { id: 'REC-003', event: 'Lollapalooza', provider: 'BioEnergy', estimatedKwh: 42000, actualKwh: 45000, difference: 7.1, status: 'disputed', date: '15/08/2024' },
  { id: 'REC-004', event: 'Web Summit Rio', provider: 'CleanPower', estimatedKwh: 12000, actualKwh: 11900, difference: -0.8, status: 'reconciled', date: '05/07/2024' },
  { id: 'REC-005', event: 'Virada Cultural', provider: 'SolarGrid', estimatedKwh: 28000, actualKwh: 31000, difference: 10.7, status: 'pending', date: '20/06/2024' },
  { id: 'REC-006', event: 'Festival Gastronômico', provider: 'EcoPower', estimatedKwh: 5000, actualKwh: 5200, difference: 4.0, status: 'analyzing', date: '30/10/2024' },
];

const Reconciliacao: React.FC = () => {
  const columns = [
    { 
      header: 'ID / Processo', 
      accessor: 'id' as keyof ReconciliationItem,
      sortable: true,
      render: (row: ReconciliationItem) => (
        <span className="id-badge">{row.id}</span>
      )
    },
    { 
      header: 'Evento', 
      accessor: 'event' as keyof ReconciliationItem,
      sortable: true,
      render: (row: ReconciliationItem) => (
        <div className="entity-cell">
          <span className="entity-name">{row.event}</span>
          <span className="entity-sub">{row.date}</span>
        </div>
      )
    },
    { 
      header: 'Provedor', 
      accessor: 'provider' as keyof ReconciliationItem,
      sortable: true,
      render: (row: ReconciliationItem) => (
        <div className="flex-center gap-2">
          <div className="provider-icon-mini">
            <Zap size={12} />
          </div>
          <span className="font-medium text-main">{row.provider}</span>
        </div>
      )
    },
    { 
      header: 'Consumo (Est. vs Real)', 
      accessor: 'estimatedKwh' as keyof ReconciliationItem,
      sortable: true,
      render: (row: ReconciliationItem) => (
        <div className="metrics-cell">
          <div className="metric-row">
            <span className="text-muted">Est:</span>
            <span className="font-medium">{row.estimatedKwh.toLocaleString()} kWh</span>
          </div>
          <div className="metric-row">
            <span className="text-muted">Real:</span>
            <span className="font-bold text-primary-main">{row.actualKwh.toLocaleString()} kWh</span>
          </div>
        </div>
      )
    },
    { 
      header: 'Divergência', 
      accessor: 'difference' as keyof ReconciliationItem,
      sortable: true,
      render: (row: ReconciliationItem) => {
        const isHigh = Math.abs(row.difference) > 5;
        const isNegative = row.difference < 0;
        return (
          <div className="flex-center gap-2">
            <span className={`diff-badge ${isHigh ? 'critical' : 'normal'} ${isNegative ? 'neg' : 'pos'}`}>
              {row.difference > 0 ? '+' : ''}{row.difference}%
            </span>
            {isHigh && <AlertTriangle size={14} className="text-error-main animate-pulse" />}
          </div>
        );
      }
    },
    { 
      header: 'Status', 
      accessor: 'status' as keyof ReconciliationItem,
      sortable: true,
      render: (row: ReconciliationItem) => {
        const statusMap: Record<ReconciliationItem['status'], { type: StatusType; label: string }> = {
          reconciled: { type: 'success', label: 'Conciliado' },
          pending: { type: 'warning', label: 'Pendente' },
          disputed: { type: 'error', label: 'Disputa' },
          analyzing: { type: 'info', label: 'Analisando' }
        };
        const config = statusMap[row.status];
        return <StatusBadge status={config.type} label={config.label} size="sm" />;
      }
    },
  ];

  return (
    <div className="reconciliacao-page module-page">
      <header className="module-header">
        <div className="header-content">
          <h1 className="module-title">Reconciliação & Audit</h1>
          <p className="module-description">
            Validação técnica e financeira entre geração estimada e consumo real de telemetria.
          </p>
        </div>
        <div className="header-actions">
          <button className="btn-enterprise secondary">
            <Download size={18} />
            <span>Exportar Relatório</span>
          </button>
          <button className="btn-enterprise primary">
            <FileSearch size={18} />
            <span>Novo Processo Audit</span>
          </button>
        </div>
      </header>

      <div className="intelligence-banner">
        <div className="banner-icon">
          <ShieldCheck size={24} />
        </div>
        <div className="banner-content">
          <h3 className="banner-title">Monitoramento de Acurácia Operacional</h3>
          <p className="banner-text">
            Detectamos <strong>3 divergências acima de 10%</strong> nos eventos de Outubro. 
            Recomendamos revisão das faturas dos provedores SolarGrid e WindFlow.
          </p>
        </div>
        <button className="banner-action">
          <span>Revisar Divergências</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card-enterprise">
          <div className="kpi-icon-wrapper success">
            <Scale size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Volume Reconciliado</span>
            <div className="kpi-value-container">
              <h2 className="kpi-value">R$ 458.2k</h2>
              <span className="kpi-trend positive">
                <TrendingUp size={12} />
                +12%
              </span>
            </div>
            <p className="kpi-subtitle">Total processado este mês</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-icon-wrapper error">
            <AlertCircle size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Divergências Críticas</span>
            <div className="kpi-value-container">
              <h2 className="kpi-value">14</h2>
              <span className="kpi-trend negative">Ação Necessária</span>
            </div>
            <p className="kpi-subtitle">Aguardando evidências técnicas</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-icon-wrapper primary">
            <CheckCircle2 size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Acurácia de Previsão</span>
            <div className="kpi-value-container">
              <h2 className="kpi-value">98.2%</h2>
              <span className="kpi-trend positive">Meta 95%</span>
            </div>
            <p className="kpi-subtitle">Consumo real vs estimado</p>
          </div>
        </div>
      </div>

      <div className="content-card-enterprise">
        <DataTable 
          title="Processos de Auditoria Energética"
          columns={columns}
          data={reconciliationData}
          searchPlaceholder="Filtrar por evento, provedor ou status..."
          onRowClick={(row) => console.log('Audit details for:', row.id)}
        />
      </div>

      <div className="audit-workflow-cta">
        <div className="cta-content">
          <div className="cta-icon">
            <FileText size={24} />
          </div>
          <div className="cta-text">
            <h3>Centro de Resolução de Disputas</h3>
            <p>Gerencie evidências e contestações de medições de telemetria em um só lugar.</p>
          </div>
        </div>
        <button className="btn-enterprise primary outline">
          <span>Acessar Dispute Inbox</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Reconciliacao;


