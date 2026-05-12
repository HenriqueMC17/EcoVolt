import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Award, 
  Star, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Search,
  Building2,
  CheckCircle,
  Activity,
  Filter
} from 'lucide-react';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import type { StatusType } from '../../../components/shared/StatusBadge';
import '../../../styles/enterprise-components.css';
import './Provedores.css';

interface Provider {
  id: string;
  name: string;
  type: string;
  location: string;
  rating: number;
  capacity: string;
  status: 'homologado' | 'em_analise' | 'pendente';
  verified: boolean;
}

const providers: Provider[] = [
  { 
    id: 'PV-001',
    name: 'SolarTech Energia', 
    type: 'Solar / Fotovoltaica', 
    location: 'São Paulo, SP', 
    rating: 4.9, 
    capacity: '1.2 GWh/ano', 
    status: 'homologado',
    verified: true
  },
  { 
    id: 'PV-002',
    name: 'WindFlow Brasil', 
    type: 'Eólica', 
    location: 'Fortaleza, CE', 
    rating: 4.8, 
    capacity: '500 MWh/ano', 
    status: 'homologado',
    verified: true
  },
  { 
    id: 'PV-003',
    name: 'BioGen Sustentável', 
    type: 'Biomassa', 
    location: 'Curitiba, PR', 
    rating: 4.5, 
    capacity: '200 MWh/ano', 
    status: 'em_analise',
    verified: false
  },
  { 
    id: 'PV-004',
    name: 'EcoLight Solutions', 
    type: 'Consultoria / Distribuição', 
    location: 'Rio de Janeiro, RJ', 
    rating: 4.7, 
    capacity: 'N/A', 
    status: 'homologado',
    verified: true
  }
];

const Provedores: React.FC = () => {
  const getStatusInfo = (status: Provider['status']): { type: StatusType; label: string } => {
    switch (status) {
      case 'homologado':
        return { type: 'success', label: 'Homologado' };
      case 'em_analise':
        return { type: 'warning', label: 'Em Análise' };
      case 'pendente':
        return { type: 'info', label: 'Pendente' };
      default:
        return { type: 'neutral', label: status };
    }
  };

  const columns = [
    { 
      header: 'Provedor', 
      accessor: 'name' as keyof Provider,
      sortable: true,
      render: (row: Provider) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-primary">
            <Building2 size={16} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary">{row.name}</span>
              {row.verified && <ShieldCheck size={14} className="text-secondary" />}
            </div>
            <span className="text-xs text-muted">{row.type}</span>
          </div>
        </div>
      )
    },
    { 
      header: 'Localização', 
      accessor: 'location' as keyof Provider,
      sortable: true,
      render: (row: Provider) => (
        <div className="flex items-center gap-2 text-muted">
          <MapPin size={14} />
          <span>{row.location}</span>
        </div>
      )
    },
    { 
      header: 'Avaliação', 
      accessor: 'rating' as keyof Provider,
      sortable: true,
      render: (row: Provider) => (
        <div className="flex items-center gap-1">
          <Star size={14} className="text-warning fill-warning" />
          <span className="font-bold">{row.rating}</span>
        </div>
      )
    },
    { 
      header: 'Capacidade', 
      accessor: 'capacity' as keyof Provider,
      sortable: true,
      render: (row: Provider) => (
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-info" />
          <span className="font-medium">{row.capacity}</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status' as keyof Provider,
      sortable: true,
      render: (row: Provider) => {
        const { type, label } = getStatusInfo(row.status);
        return <StatusBadge status={type} label={label} variant="glass" size="sm" />;
      }
    },
    { 
      header: 'Ações', 
      accessor: 'id' as keyof Provider,
      render: () => (
        <div className="flex items-center gap-2">
          <button className="icon-btn-glass" title="Ver Portfólio"><ExternalLink size={16} /></button>
          <button className="btn-icon-link">
            Perfil <ChevronRight size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="provedores-page animate-fade-in">
      {/* Executive Header */}
      <div className="module-header">
        <div className="header-content">
          <div className="header-badge">Rede de Suprimentos</div>
          <h1 className="header-title">Provedores de Energia</h1>
          <p className="header-subtitle">Diretório estratégico de parceiros homologados para fornecimento de energia renovável.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary flex items-center gap-2">
            <Filter size={18} />
            Filtros
          </button>
          <button className="btn btn-primary flex items-center gap-2">
            <Award size={18} />
            Credenciamento
          </button>
        </div>
      </div>

      {/* Intelligence Banner */}
      <div className="intelligence-banner glass">
        <div className="banner-icon">
          <CheckCircle size={24} className="text-success" />
        </div>
        <div className="banner-content">
          <span className="ai-badge-mini">Compliance</span>
          <h4>Qualidade Garantida</h4>
          <p>Todos os provedores listados possuem certificação <strong>RECs Brasil</strong> e atendem aos rigorosos critérios de sustentabilidade da EcoVolt.</p>
        </div>
        <div className="banner-actions">
          <button className="btn-text flex items-center gap-1">
            Critérios de Aceite <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box success">
              <Building2 size={20} />
            </div>
            <div className="kpi-trend positive">
              <TrendingUp size={12} /> +3/trim
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Provedores Ativos</span>
            <h2 className="kpi-value">42</h2>
            <p className="kpi-desc">Parceiros homologados</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box info">
              <Zap size={20} />
            </div>
            <div className="kpi-trend positive">
              94% Disponível
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Capacidade Total</span>
            <h2 className="kpi-value">4.8 GWh</h2>
            <p className="kpi-desc">Ativos em portfólio</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box warning">
              <Star size={20} />
            </div>
            <div className="kpi-trend positive">
              SLA: 99.8%
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Rating Médio</span>
            <h2 className="kpi-value">4.75</h2>
            <p className="kpi-desc">Média global de satisfação</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box secondary">
              <Activity size={20} />
            </div>
            <div className="kpi-trend positive">
              Mix Diversificado
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Matriz Energética</span>
            <h2 className="kpi-value">5 Fontes</h2>
            <p className="kpi-desc">Solar, Eólica, Bio, PCH</p>
          </div>
        </div>
      </div>

      <div className="content-card-enterprise">
        <div className="card-header">
          <div className="header-info">
            <h3>Diretório de Parceiros</h3>
            <p>Acompanhamento estratégico da rede de fornecedores</p>
          </div>
          <div className="header-actions">
            <div className="flex items-center gap-4">
              <select className="glass-select">
                <option>Todas as Fontes</option>
                <option>Solar</option>
                <option>Eólica</option>
                <option>Biomassa</option>
              </select>
              <div className="search-box-enterprise">
                <Search size={16} />
                <input type="text" placeholder="Buscar provedor..." />
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <DataTable 
            columns={columns}
            data={providers}
          />
        </div>
      </div>
    </div>
  );
};

export default Provedores;
