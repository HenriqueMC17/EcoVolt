import React from 'react';
import { 
  Scale, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Download,
  Filter,
  FileText,
  Search
} from 'lucide-react';
import DataTable from '../../../components/shared/DataTable';
import './Reconciliacao.css';

interface ReconciliationItem {
  id: string;
  event: string;
  provider: string;
  estimatedKwh: number;
  actualKwh: number;
  difference: number;
  status: 'reconciled' | 'pending' | 'disputed';
  date: string;
}

const reconciliationData: ReconciliationItem[] = [
  { id: 'REC-001', event: 'Tomorrowland Brasil', provider: 'SolarGrid', estimatedKwh: 15000, actualKwh: 14850, difference: -1, status: 'reconciled', date: '12/10/2024' },
  { id: 'REC-002', event: 'Rock in Rio', provider: 'WindFlow', estimatedKwh: 85000, actualKwh: 89200, difference: 4.9, status: 'pending', date: '25/09/2024' },
  { id: 'REC-003', event: 'Lollapalooza', provider: 'BioEnergy', estimatedKwh: 42000, actualKwh: 45000, difference: 7.1, status: 'disputed', date: '15/08/2024' },
  { id: 'REC-004', event: 'Web Summit Rio', provider: 'CleanPower', estimatedKwh: 12000, actualKwh: 11900, difference: -0.8, status: 'reconciled', date: '05/07/2024' },
  { id: 'REC-005', event: 'Virada Cultural', provider: 'SolarGrid', estimatedKwh: 28000, actualKwh: 31000, difference: 10.7, status: 'pending', date: '20/06/2024' },
];

const Reconciliacao: React.FC = () => {
  const columns = [
    { header: 'ID', accessor: 'id' },
    { 
      header: 'Evento', 
      accessor: 'event',
      render: (row: ReconciliationItem) => (
        <div className="flex-col">
          <span className="font-semibold text-primary">{row.event}</span>
          <span className="text-xs text-muted">{row.date}</span>
        </div>
      )
    },
    { header: 'Provedor', accessor: 'provider' },
    { 
      header: 'Estimado', 
      accessor: 'estimatedKwh',
      render: (row: ReconciliationItem) => `${row.estimatedKwh.toLocaleString()} kWh`
    },
    { 
      header: 'Realizado', 
      accessor: 'actualKwh',
      render: (row: ReconciliationItem) => `${row.actualKwh.toLocaleString()} kWh`
    },
    { 
      header: 'Divergência', 
      accessor: 'difference',
      render: (row: ReconciliationItem) => (
        <span className={`diff-tag ${row.difference > 5 ? 'high' : row.difference < 0 ? 'low' : 'normal'}`}>
          {row.difference > 0 ? `+${row.difference}%` : `${row.difference}%`}
        </span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row: ReconciliationItem) => (
        <div className={`status-pill ${row.status}`}>
          {row.status === 'reconciled' && <CheckCircle2 size={14} />}
          {row.status === 'pending' && <AlertCircle size={14} />}
          {row.status === 'disputed' && <AlertCircle size={14} />}
          {row.status === 'reconciled' ? 'Conciliado' : row.status === 'pending' ? 'Pendente' : 'Disputa'}
        </div>
      )
    },
  ];

  return (
    <div className="reconciliacao-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reconciliação Financeira</h1>
          <p className="page-subtitle">Ajuste de contas entre energia contratada e consumida.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary flex-center gap-2">
            <Download size={18} />
            Relatório de Divergências
          </button>
          <button className="btn btn-primary">Iniciar Nova Conciliação</button>
        </div>
      </div>

      <div className="reconciliation-summary">
        <div className="summary-card glass">
          <div className="card-icon blue"><Scale size={24} /></div>
          <div className="card-data">
            <p className="card-label">Total em Reconciliação</p>
            <h2 className="card-value">R$ 458.200,00</h2>
          </div>
        </div>
        <div className="summary-card glass">
          <div className="card-icon yellow"><AlertCircle size={24} /></div>
          <div className="card-data">
            <p className="card-label">Divergências Pendentes</p>
            <h2 className="card-value">14 Itens</h2>
          </div>
        </div>
        <div className="summary-card glass">
          <div className="card-icon green"><CheckCircle2 size={24} /></div>
          <div className="card-data">
            <p className="card-label">Taxa de Sucesso</p>
            <h2 className="card-value">98.2%</h2>
          </div>
        </div>
      </div>

      <div className="filters-bar glass">
        <div className="search-input">
          <Search size={18} />
          <input type="text" placeholder="Filtrar por evento ou provedor..." />
        </div>
        <div className="filter-actions">
          <button className="filter-btn"><Filter size={18} /> Filtros Avançados</button>
          <div className="divider"></div>
          <button className="period-btn">Últimos 30 dias</button>
        </div>
      </div>

      <div className="table-section">
        <DataTable 
          title="Processos de Reconciliação"
          columns={columns}
          data={reconciliationData}
          onRowClick={(row) => console.log('Row clicked:', row)}
        />
      </div>

      <div className="dispute-workflow glass">
        <div className="workflow-header">
          <div className="flex-center gap-2">
            <FileText size={20} className="text-primary" />
            <h3>Workflow de Disputa Ativa</h3>
          </div>
          <ArrowRight size={20} className="text-muted" />
        </div>
        <div className="workflow-content">
          <p>Existem <strong>3 disputas</strong> que requerem sua atenção técnica para validação de faturas.</p>
          <button className="btn btn-primary btn-sm">Ver Disputas</button>
        </div>
      </div>
    </div>
  );
};

export default Reconciliacao;
