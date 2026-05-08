import React from 'react';
import { 
  Briefcase, 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import DataTable from '../../../components/shared/DataTable';
import './Propostas.css';

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
      accessor: 'id',
      render: (row: Proposal) => (
        <div className="flex-col">
          <span className="font-bold text-primary">{row.id}</span>
          <span className="text-xs text-muted">{row.date}</span>
        </div>
      )
    },
    { 
      header: 'Projeto / Cliente', 
      accessor: 'title',
      render: (row: Proposal) => (
        <div className="flex-col">
          <span className="font-medium">{row.title}</span>
          <span className="text-xs text-muted">{row.client}</span>
        </div>
      )
    },
    { header: 'Provedor', accessor: 'provider' },
    { header: 'Valor Estimado', accessor: 'value' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row: Proposal) => (
        <div className={`status-tag ${row.status}`}>
          {row.status === 'accepted' && <CheckCircle2 size={12} />}
          {row.status === 'rejected' && <XCircle size={12} />}
          {row.status === 'negotiating' && <Clock size={12} />}
          <span>{row.status.toUpperCase()}</span>
        </div>
      )
    },
    {
      header: '',
      accessor: 'id',
      render: () => (
        <div className="flex gap-2">
          <button className="icon-btn-sm"><FileText size={16} /></button>
          <button className="icon-btn-sm"><MoreVertical size={16} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="propostas-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Propostas Comerciais</h1>
          <p className="page-subtitle">Gestão de negociações, orçamentos e conversão de contratos.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary flex-center gap-2">
            <Plus size={18} />
            Nova Proposta
          </button>
        </div>
      </div>

      <div className="proposals-dashboard">
        <div className="dash-card glass">
          <div className="dash-info">
            <p>Em Negociação</p>
            <h3>R$ 1.2M</h3>
          </div>
          <div className="dash-icon orange"><Clock size={24} /></div>
        </div>
        <div className="dash-card glass">
          <div className="dash-info">
            <p>Convertidas (Mês)</p>
            <h3>R$ 450k</h3>
          </div>
          <div className="dash-icon green"><CheckCircle2 size={24} /></div>
        </div>
        <div className="dash-card glass">
          <div className="dash-info">
            <p>Win Rate</p>
            <h3>68%</h3>
          </div>
          <div className="dash-icon blue"><Briefcase size={24} /></div>
        </div>
      </div>

      <div className="content-filters glass">
        <div className="search-group">
          <Search size={18} />
          <input type="text" placeholder="Buscar por cliente, projeto ou ID..." />
        </div>
        <div className="filter-group">
          <button className="filter-toggle"><Filter size={18} /> Filtros</button>
          <div className="view-modes">
            <button className="active">Lista</button>
            <button>Kanban</button>
          </div>
        </div>
      </div>

      <div className="proposals-table">
        <DataTable 
          title="Pipeline de Vendas"
          columns={columns}
          data={proposals}
        />
      </div>

      <div className="ai-insights glass">
        <div className="insight-header">
          <div className="flex-center gap-2">
            <div className="ai-badge">AI</div>
            <h3>Sugestão Estratégica</h3>
          </div>
        </div>
        <div className="insight-body">
          <p>O cliente <strong>RIR Eventos</strong> costuma fechar propostas com 15% de desconto no volume. Considere ajustar a oferta atual para aumentar a chance de conversão em 25%.</p>
          <button className="insight-action">Ver Detalhes <ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
};

export default Propostas;
