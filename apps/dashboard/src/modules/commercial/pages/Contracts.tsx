import React from 'react';
import { 
  Filter, 
  Plus, 
  FileCheck, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Search,
  Building2,
  Calendar,
  DollarSign,
  ShieldCheck,
  FileText
} from 'lucide-react';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import type { StatusType } from '../../../components/shared/StatusBadge';
import '../../../styles/enterprise-components.css';
import './Contracts.css';

interface ContractRow {
  id: string;
  event: string;
  provider: string;
  value: string;
  status: 'active' | 'pending' | 'processing' | 'closed';
  date: string;
}

const contractsData: ContractRow[] = [
  { id: 'CON-2024-001', event: 'Eco Festival SP', provider: 'SolarTech Energia', value: 'R$ 45.000', status: 'active', date: '12/05/2024' },
  { id: 'CON-2024-002', event: 'Congresso Sustentável', provider: 'WindFlow', value: 'R$ 12.500', status: 'pending', date: '15/05/2024' },
  { id: 'CON-2024-003', event: 'Maratona Verde', provider: 'BioGen', value: 'R$ 8.900', status: 'processing', date: '20/05/2024' },
  { id: 'CON-2024-004', event: 'Exposição EcoArt', provider: 'SolarTech Energia', value: 'R$ 32.000', status: 'processing', date: '22/05/2024' },
  { id: 'CON-2024-005', event: 'Show de Verão', provider: 'WindFlow', value: 'R$ 150.000', status: 'closed', date: '05/04/2024' },
];

const Contracts: React.FC = () => {
  const columns = [
    { 
      header: 'ID Contrato', 
      accessor: 'id' as keyof ContractRow, 
      sortable: true, 
      render: (row: ContractRow) => (
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-muted" />
          <span className="id-badge">{row.id}</span> 
        </div>
      )
    },
    { 
      header: 'Evento', 
      accessor: 'event' as keyof ContractRow, 
      sortable: true,
      render: (row: ContractRow) => (
        <div className="flex flex-col">
          <span className="event-name">{row.event}</span>
          <span className="event-tag">Operação Ativa</span>
        </div>
      )
    },
    { 
      header: 'Provedor', 
      accessor: 'provider' as keyof ContractRow, 
      sortable: true,
      render: (row: ContractRow) => (
        <div className="flex items-center gap-2">
          <Building2 size={14} className="text-muted" />
          <span className="text-sm">{row.provider}</span>
        </div>
      )
    },
    { 
      header: 'Valor Estimado', 
      accessor: 'value' as keyof ContractRow, 
      sortable: true,
      render: (row: ContractRow) => (
        <div className="flex items-center gap-1 font-bold text-secondary-main">
          <span>{row.value}</span>
        </div>
      )
    },
    { 
      header: 'Data Início', 
      accessor: 'date' as keyof ContractRow, 
      sortable: true,
      render: (row: ContractRow) => (
        <div className="flex items-center gap-2 text-muted text-sm">
          <Calendar size={14} />
          <span>{row.date}</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status' as keyof ContractRow,
      sortable: true,
      render: (row: ContractRow) => {
        const statusMap: Record<ContractRow['status'], { status: StatusType; label: string }> = {
          active: { status: 'success', label: 'Ativo' },
          pending: { status: 'warning', label: 'Assinatura' },
          processing: { status: 'info', label: 'Em Execução' },
          closed: { status: 'neutral', label: 'Encerrado' }
        };
        const config = statusMap[row.status];
        return <StatusBadge status={config.status} label={config.label} variant="glass" size="sm" />;
      }
    },
    {
      header: 'Ações',
      accessor: 'id' as keyof ContractRow,
      render: () => (
        <button className="btn-icon-link">
          Gestão <ChevronRight size={14} />
        </button>
      )
    }
  ];

  return (
    <div className="contracts-page animate-fade-in">
      {/* Executive Header */}
      <div className="module-header">
        <div className="header-content">
          <div className="header-badge">Governança Comercial</div>
          <h1 className="header-title">Lifecycle de Contratos</h1>
          <p className="header-subtitle">Gestão de conformidade, fluxo jurídico e execução de ativos energéticos.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary flex items-center gap-2">
            <Filter size={18} /> 
            Filtros
          </button>
          <button className="btn btn-primary flex items-center gap-2">
            <Plus size={18} /> 
            Novo Contrato
          </button>
        </div>
      </div>

      {/* Intelligence Banner */}
      <div className="intelligence-banner glass">
        <div className="banner-icon">
          <ShieldCheck size={24} className="text-secondary" />
        </div>
        <div className="banner-content">
          <span className="ai-badge-mini">Compliance</span>
          <h4>Conformidade e Segurança Jurídica</h4>
          <p><strong>98% dos contratos</strong> estão em total conformidade com as normas regulatórias atuais da ANEEL e requisitos de sustentabilidade.</p>
        </div>
        <div className="banner-actions">
          <button className="btn-text flex items-center gap-1">
            Relatório Audit <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box primary">
              <FileCheck size={20} />
            </div>
            <div className="kpi-trend positive">
              <TrendingUp size={12} /> +4%
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Contratos Ativos</span>
            <h2 className="kpi-value">42</h2>
            <p className="kpi-desc">Em fase de execução plena</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box warning">
              <Clock size={20} />
            </div>
            <div className="kpi-trend warning">
              Assinatura
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Pendente Assinatura</span>
            <h2 className="kpi-value">08</h2>
            <p className="kpi-desc">Fluxo jurídico em processamento</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box info">
              <DollarSign size={20} />
            </div>
            <div className="kpi-trend positive">
              <TrendingUp size={12} /> +15%
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Volume Contratual</span>
            <h2 className="kpi-value">R$ 1.2M</h2>
            <p className="kpi-desc">Valor total sob gestão (Anual)</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box error">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Vencimentos (30 dias)</span>
            <h2 className="kpi-value">03</h2>
            <p className="kpi-desc">Contratos requerendo renovação</p>
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="content-card-enterprise">
        <div className="card-header">
          <div className="header-info">
            <h3>Base de Contratos</h3>
            <p>Lista detalhada de parcerias e ativos sob gestão</p>
          </div>
          <div className="header-actions">
            <div className="flex items-center gap-4">
              <select className="glass-select">
                <option>Todos os Status</option>
                <option>Ativos</option>
                <option>Pendentes</option>
              </select>
              <div className="search-box-enterprise">
                <Search size={16} />
                <input type="text" placeholder="Buscar contrato..." />
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <DataTable data={contractsData} columns={columns} />
        </div>
      </div>
    </div>
  );
};

export default Contracts;
