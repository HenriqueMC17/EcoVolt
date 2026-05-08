import React from 'react';
import DataTable from '../../../components/shared/DataTable';
import { Filter, Plus } from 'lucide-react';
import './Contracts.css';

interface ContractRow {
  id: string;
  event: string;
  provider: string;
  value: string;
  status: string;
  date: string;
}

const contractsData: ContractRow[] = [
  { id: 'CON-2024-001', event: 'Eco Festival SP', provider: 'SolarTech Energia', value: 'R$ 45.000', status: 'Ativo', date: '12/05/2024' },
  { id: 'CON-2024-002', event: 'Congresso Sustentável', provider: 'WindFlow', value: 'R$ 12.500', status: 'Assinatura', date: '15/05/2024' },
  { id: 'CON-2024-003', event: 'Maratona Verde', provider: 'BioGen', value: 'R$ 8.900', status: 'Execução', date: '20/05/2024' },
  { id: 'CON-2024-004', event: 'Exposição EcoArt', provider: 'SolarTech Energia', value: 'R$ 32.000', status: 'Reconciliação', date: '22/05/2024' },
  { id: 'CON-2024-005', event: 'Show de Verão', provider: 'WindFlow', value: 'R$ 150.000', status: 'Encerrado', date: '05/04/2024' },
];

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Ativo': return 'active';
    case 'Assinatura': return 'pending';
    case 'Execução': return 'processing';
    case 'Reconciliação': return 'processing';
    default: return 'closed';
  }
};

const columns = [
  { header: 'ID Contrato', accessor: 'id', render: (row: ContractRow) => <span className="font-mono text-primary">{row.id}</span> },
  { header: 'Evento', accessor: 'event' },
  { header: 'Provedor', accessor: 'provider' },
  { header: 'Valor Est.', accessor: 'value' },
  { header: 'Data Início', accessor: 'date' },
  { 
    header: 'Status', 
    accessor: 'status',
    render: (row: ContractRow) => (
      <span className={`badge ${getStatusClass(row.status)}`}>
        <span className="badge-dot" style={{backgroundColor: 'currentColor'}}></span>
        {row.status}
      </span>
    )
  },
];

const Contracts: React.FC = () => {
  return (
    <div className="contracts-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Lifecycle de Contratos</h1>
          <p className="page-subtitle">Gestão completa do fluxo contratual EcoVolt.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary flex-center gap-2"><Filter size={18} /> Filtros</button>
          <button className="btn btn-primary flex-center gap-2"><Plus size={18} /> Novo Contrato</button>
        </div>
      </div>

      <div className="contracts-stats">
        <div className="stat-item glass">
          <span className="label">Total sob gestão</span>
          <span className="value">R$ 2.4M</span>
        </div>
        <div className="stat-item glass">
          <span className="label">Aguardando Assinatura</span>
          <span className="value">14</span>
        </div>
        <div className="stat-item glass">
          <span className="label">Em Reconciliação</span>
          <span className="value">08</span>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={contractsData} 
        onRowClick={(row) => console.log('Clicked row', row)}
      />
    </div>
  );
};

export default Contracts;
