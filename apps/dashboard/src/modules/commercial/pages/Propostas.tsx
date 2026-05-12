import React from 'react';
import { 
  Briefcase, 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  Search,
  DollarSign,
  Target,
  Sparkles,
  Filter
} from 'lucide-react';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import type { StatusType } from '../../../components/shared/StatusBadge';
import './Propostas.css';
import '../../../styles/enterprise-components.css';

interface Proposal {
  id: string;
  title: string;
  client: string;
  provider: string;
  value: string;
  status: 'draft' | 'sent' | 'negotiating' | 'accepted' | 'rejected';
  date: string;
}

const proposals: Proposal[] = [
  { id: 'PR-2024-001', title: 'Energia Festival de Inverno', client: 'Prefeitura de Campos', provider: 'SolarGrid', value: 'R$ 45.000,00', status: 'accepted', date: '10/05/2024' },
  { id: 'PR-2024-002', title: 'Suprimento Rock in Rio 2024', client: 'RIR Eventos', provider: 'WindFlow', value: 'R$ 850.000,00', status: 'negotiating', date: '08/05/2024' },
  { id: 'PR-2024-003', title: 'Expansão Solar Corporate', client: 'TechCorp SA', provider: 'CleanPower', value: 'R$ 120.000,00', status: 'sent', date: '05/05/2024' },
  { id: 'PR-2024-004', title: 'Iluminação Pública Sustentável', client: 'Município de Barueri', provider: 'SolarGrid', value: 'R$ 2.400.000,00', status: 'draft', date: '02/05/2024' },
  { id: 'PR-2024-005', title: 'Congresso Médico Nacional', client: 'Assoc. Médica', provider: 'BioEnergy', value: 'R$ 15.000,00', status: 'rejected', date: '28/04/2024' },
];

const Propostas: React.FC = () => {
  const columns = [
    { 
      header: 'Identificador', 
      accessor: 'id' as keyof Proposal,
      sortable: true,
      render: (row: Proposal) => (
        <div className="flex flex-col">
          <span className="id-badge">{row.id}</span>
          <span className="text-xs text-muted font-medium">{row.date}</span>
        </div>
      )
    },
    { 
      header: 'Projeto / Cliente', 
      accessor: 'title' as keyof Proposal,
      sortable: true,
      render: (row: Proposal) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm">{row.title}</span>
          <span className="text-xs text-muted">{row.client}</span>
        </div>
      )
    },
    { 
      header: 'Provedor', 
      accessor: 'provider' as keyof Proposal, 
      sortable: true,
      render: (row: Proposal) => (
        <div className="flex items-center gap-2">
          <Briefcase size={14} className="text-muted" />
          <span className="text-sm font-medium">{row.provider}</span>
        </div>
      )
    },
    { 
      header: 'Valor Estimado', 
      accessor: 'value' as keyof Proposal, 
      sortable: true,
      render: (row: Proposal) => (
        <span className="font-bold text-secondary">{row.value}</span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status' as keyof Proposal,
      sortable: true,
      render: (row: Proposal) => {
        const statusMap: Record<string, { status: StatusType; label: string }> = {
          accepted: { status: 'success', label: 'Aceito' },
          negotiating: { status: 'warning', label: 'Negociação' },
          sent: { status: 'info', label: 'Enviado' },
          draft: { status: 'neutral', label: 'Rascunho' },
          rejected: { status: 'error', label: 'Recusado' }
        };
        const config = statusMap[row.status] || { status: 'neutral', label: row.status };
        return <StatusBadge status={config.status} label={config.label} variant="glass" size="sm" />;
      }
    },
    {
      header: 'Ações',
      accessor: 'id' as keyof Proposal,
      render: () => (
        <div className="flex items-center gap-2">
          <button className="icon-btn-glass" title="Ver Documento"><FileText size={16} /></button>
          <button className="btn-icon-link">
            Analisar <ChevronRight size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="propostas-page animate-fade-in">
      {/* Executive Header */}
      <div className="module-header">
        <div className="header-content">
          <div className="header-badge">Estratégia Comercial</div>
          <h1 className="header-title">Pipeline de Propostas</h1>
          <p className="header-subtitle">Gestão ativa de negociações, orçamentos técnicos e conversão de novos ativos.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary flex items-center gap-2">
            <Filter size={18} />
            Filtros
          </button>
          <button className="btn btn-primary flex items-center gap-2">
            <Plus size={18} />
            Nova Proposta
          </button>
        </div>
      </div>

      {/* Intelligence Banner */}
      <div className="intelligence-banner glass">
        <div className="banner-icon">
          <Sparkles size={24} className="text-primary" />
        </div>
        <div className="banner-content">
          <span className="ai-badge-mini">Insight IA</span>
          <h4>Otimização de Conversão</h4>
          <p>O cliente <strong>RIR Eventos</strong> costuma fechar propostas com 15% de desconto no volume. Considere ajustar a oferta atual para aumentar a chance de conversão em <strong>25%</strong>.</p>
        </div>
        <div className="banner-actions">
          <button className="btn-text flex items-center gap-1">
            Aplicar Sugestão <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box warning">
              <Clock size={20} />
            </div>
            <div className="kpi-trend warning">
              Negociação
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Propostas Abertas</span>
            <h2 className="kpi-value">14</h2>
            <p className="kpi-desc">Ticket médio: R$ 42.5k</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box primary">
              <Target size={20} />
            </div>
            <div className="kpi-trend positive">
              <TrendingUp size={12} /> +8.2%
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Taxa de Conversão</span>
            <h2 className="kpi-value">32.4%</h2>
            <p className="kpi-desc">Acima da meta trimestral</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box info">
              <DollarSign size={20} />
            </div>
            <div className="kpi-trend positive">
              <TrendingUp size={12} /> +12%
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Valor em Pipeline</span>
            <h2 className="kpi-value">R$ 4.8M</h2>
            <p className="kpi-desc">Total de propostas enviadas</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box success">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Aceitas (Este Mês)</span>
            <h2 className="kpi-value">05</h2>
            <p className="kpi-desc">Total de R$ 1.2M convertidos</p>
          </div>
        </div>
      </div>

      {/* Proposals Table */}
      <div className="content-card-enterprise">
        <div className="card-header">
          <div className="header-info">
            <h3>Pipeline Detalhado</h3>
            <p>Acompanhamento em tempo real de cada estágio da venda</p>
          </div>
          <div className="header-actions">
            <div className="flex items-center gap-4">
              <select className="glass-select">
                <option>Todos os Estágios</option>
                <option>Negociação</option>
                <option>Aceito</option>
                <option>Rascunho</option>
              </select>
              <div className="search-box-enterprise">
                <Search size={16} />
                <input type="text" placeholder="Buscar proposta..." />
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <DataTable data={proposals} columns={columns} />
        </div>
      </div>
    </div>
  );
};

export default Propostas;
