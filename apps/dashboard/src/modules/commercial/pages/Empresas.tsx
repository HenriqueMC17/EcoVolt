import React from 'react';
import { 
  Building2, 
  MapPin, 
  Plus, 
  Search, 
  MoreVertical,
  ExternalLink,
  ShieldCheck,
  History
} from 'lucide-react';
import DataTable from '../../../components/shared/DataTable';
import './Empresas.css';

interface Company {
  id: string;
  name: string;
  cnpj: string;
  location: string;
  segment: string;
  status: 'active' | 'suspended' | 'pending';
  contracts: number;
}

const companiesData: Company[] = [
  { id: 'COMP-001', name: 'Alimentos S.A.', cnpj: '12.345.678/0001-90', location: 'São Paulo, SP', segment: 'Indústria', status: 'active', contracts: 4 },
  { id: 'COMP-002', name: 'TechLogix Brasil', cnpj: '98.765.432/0001-10', location: 'Campinas, SP', segment: 'Tecnologia', status: 'active', contracts: 2 },
  { id: 'COMP-003', name: 'Mineração Vale Verde', cnpj: '45.678.901/0001-22', location: 'Belo Horizonte, MG', segment: 'Extração', status: 'pending', contracts: 0 },
  { id: 'COMP-004', name: 'Rede Confiança Varejo', cnpj: '33.222.111/0001-88', location: 'Curitiba, PR', segment: 'Varejo', status: 'suspended', contracts: 1 },
  { id: 'COMP-005', name: 'Logística Express', cnpj: '55.444.333/0001-77', location: 'Itajaí, SC', segment: 'Transporte', status: 'active', contracts: 3 },
];

const Empresas: React.FC = () => {
  const columns = [
    { 
      header: 'Razão Social', 
      accessor: 'name',
      render: (row: Company) => (
        <div className="flex-col">
          <span className="font-bold text-primary">{row.name}</span>
          <span className="text-xs text-muted">{row.cnpj}</span>
        </div>
      )
    },
    { 
      header: 'Localização', 
      accessor: 'location',
      render: (row: Company) => (
        <div className="flex-center gap-1">
          <MapPin size={14} className="text-muted" />
          <span>{row.location}</span>
        </div>
      )
    },
    { header: 'Segmento', accessor: 'segment' },
    { header: 'Contratos', accessor: 'contracts' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row: Company) => (
        <span className={`status-pill ${row.status}`}>
          {row.status === 'active' ? 'Ativo' : row.status === 'pending' ? 'Pendente' : 'Suspenso'}
        </span>
      )
    },
    {
      header: 'Ações',
      accessor: 'id',
      render: () => (
        <div className="flex-center gap-2">
          <button className="icon-btn" title="Histórico"><History size={16} /></button>
          <button className="icon-btn" title="Documentos"><ShieldCheck size={16} /></button>
          <button className="icon-btn" title="Ver Detalhes"><ExternalLink size={16} /></button>
          <button className="icon-btn"><MoreVertical size={18} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="empresas-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestão de Empresas</h1>
          <p className="page-subtitle">Cadastro e controle de clientes e parceiros corporativos.</p>
        </div>
        <button className="btn btn-primary flex-center gap-2">
          <Plus size={18} /> Cadastrar Empresa
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-card glass">
          <Building2 size={24} className="text-blue-400" />
          <div className="stat-info">
            <span className="label">Total de Empresas</span>
            <span className="value">128</span>
          </div>
        </div>
        <div className="stat-card glass">
          <ShieldCheck size={24} className="text-primary" />
          <div className="stat-info">
            <span className="label">Empresas Ativas</span>
            <span className="value">114</span>
          </div>
        </div>
        <div className="stat-card glass">
          <History size={24} className="text-warning" />
          <div className="stat-info">
            <span className="label">Em Processo</span>
            <span className="value">09</span>
          </div>
        </div>
      </div>

      <div className="filters-bar glass">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Buscar por nome, CNPJ ou cidade..." />
        </div>
        <div className="filter-actions">
          <select className="glass-select">
            <option>Todos os Segmentos</option>
            <option>Indústria</option>
            <option>Tecnologia</option>
            <option>Varejo</option>
          </select>
          <select className="glass-select">
            <option>Status: Ativos</option>
            <option>Status: Todos</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <DataTable 
          title="Empresas Cadastradas"
          columns={columns}
          data={companiesData}
        />
      </div>
    </div>
  );
};

export default Empresas;
