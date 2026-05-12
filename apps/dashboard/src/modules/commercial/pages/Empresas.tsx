import React from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck,
  History,
  TrendingUp,
  Search,
  ChevronRight,
  Filter,
  Users,
  UserPlus
} from 'lucide-react';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import type { StatusType } from '../../../components/shared/StatusBadge';
import '../../../styles/enterprise-components.css';
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
      accessor: 'name' as keyof Company,
      sortable: true,
      render: (row: Company) => (
        <div className="flex flex-col">
          <span className="font-bold text-primary">{row.name}</span>
          <span className="text-xs text-muted">{row.cnpj}</span>
        </div>
      )
    },
    { 
      header: 'Localização', 
      accessor: 'location' as keyof Company,
      sortable: true,
      render: (row: Company) => (
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-muted" />
          <span>{row.location}</span>
        </div>
      )
    },
    { 
      header: 'Segmento', 
      accessor: 'segment' as keyof Company, 
      sortable: true,
      render: (row: Company) => (
        <span className="px-2 py-1 bg-white/5 rounded text-xs font-medium">
          {row.segment}
        </span>
      )
    },
    { 
      header: 'Contratos', 
      accessor: 'contracts' as keyof Company, 
      sortable: true,
      render: (row: Company) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${Math.min((row.contracts / 5) * 100, 100)}%` }}
            />
          </div>
          <span className="font-medium">{row.contracts}</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status' as keyof Company,
      sortable: true,
      render: (row: Company) => {
        const statusMap: Record<string, { status: StatusType; label: string }> = {
          active: { status: 'success', label: 'Ativo' },
          pending: { status: 'warning', label: 'Pendente' },
          suspended: { status: 'error', label: 'Suspenso' }
        };
        const config = statusMap[row.status] || { status: 'neutral', label: row.status };
        return <StatusBadge status={config.status} label={config.label} variant="glass" size="sm" />;
      }
    },
    {
      header: 'Ações',
      accessor: 'id' as keyof Company,
      sortable: false,
      render: () => (
        <div className="flex items-center gap-2">
          <button className="icon-btn-glass" title="Histórico"><History size={16} /></button>
          <button className="icon-btn-glass" title="Documentos"><ShieldCheck size={16} /></button>
          <button className="btn-icon-link">
            Detalhes <ChevronRight size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="empresas-page animate-fade-in">
      {/* Executive Header */}
      <div className="module-header">
        <div className="header-content">
          <div className="header-badge">Ecossistema Corporativo</div>
          <h1 className="header-title">Gestão de Empresas</h1>
          <p className="header-subtitle">Cadastro, conformidade e controle de stakeholders e parceiros estratégicos.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary flex items-center gap-2">
            <Search size={18} />
            Consultar CNPJ
          </button>
          <button className="btn btn-primary flex items-center gap-2">
            <UserPlus size={18} />
            Nova Empresa
          </button>
        </div>
      </div>

      {/* Intelligence Banner */}
      <div className="intelligence-banner glass">
        <div className="banner-icon">
          <Building2 size={24} className="text-primary" />
        </div>
        <div className="banner-content">
          <span className="ai-badge-mini">Inteligência Comercial</span>
          <h4>Expansão de Portfolio</h4>
          <p>Você possui <strong>12 novas empresas</strong> qualificadas para parcerias de infraestrutura energética este mês. Otimize sua rede de provedores.</p>
        </div>
        <div className="banner-actions">
          <button className="btn-text flex items-center gap-1">
            Ver Leads <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box primary">
              <Building2 size={20} />
            </div>
            <div className="kpi-trend positive">
              <TrendingUp size={12} /> +5/mês
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total de Empresas</span>
            <h2 className="kpi-value">128</h2>
            <p className="kpi-desc">Stakeholders cadastrados</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box success">
              <ShieldCheck size={20} />
            </div>
            <div className="kpi-trend positive">
              89% Atividade
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Empresas Ativas</span>
            <h2 className="kpi-value">114</h2>
            <p className="kpi-desc">Em operação plena</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box warning">
              <History size={20} />
            </div>
            <div className="kpi-trend warning">
              Prioridade
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Em Onboarding</span>
            <h2 className="kpi-value">09</h2>
            <p className="kpi-desc">Fluxo de integração ativo</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box info">
              <Users size={20} />
            </div>
            <div className="kpi-trend positive">
              +0.3 vs meta
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Contratos/Empresa</span>
            <h2 className="kpi-value">2.4</h2>
            <p className="kpi-desc">Média de densidade contratual</p>
          </div>
        </div>
      </div>

      <div className="content-card-enterprise">
        <div className="card-header">
          <div className="header-info">
            <h3>Empresas Cadastradas</h3>
            <p>Lista detalhada de stakeholders e parceiros estratégicos</p>
          </div>
          <div className="header-actions">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-muted" />
                <select className="glass-select">
                  <option>Todos os Segmentos</option>
                  <option>Indústria</option>
                  <option>Tecnologia</option>
                  <option>Varejo</option>
                </select>
                <select className="glass-select">
                  <option>Status: Todos</option>
                  <option>Status: Ativos</option>
                  <option>Status: Pendentes</option>
                </select>
              </div>
              <div className="search-box-enterprise">
                <Search size={16} />
                <input type="text" placeholder="Buscar empresa..." />
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <DataTable 
            columns={columns}
            data={companiesData}
          />
        </div>
      </div>
    </div>
  );
};

export default Empresas;
