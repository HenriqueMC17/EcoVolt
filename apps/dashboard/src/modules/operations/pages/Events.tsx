import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Zap, 
  Plus, 
  MoreVertical,
  Clock,
  ChevronRight,
  Activity
} from 'lucide-react';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import type { StatusType } from '../../../components/shared/StatusBadge';
import '../../../styles/enterprise-components.css';
import './Events.css';

interface EventRow {
  id: string;
  name: string;
  location: string;
  date: string;
  public: string;
  demand: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

const eventsData: EventRow[] = [
  { id: 'EV-101', name: 'EcoFestival SP 2024', location: 'Parque Ibirapuera, SP', date: '15/05/2024', public: '15.000', demand: '450 MWh', status: 'upcoming' },
  { id: 'EV-102', name: 'Congresso de Sustentabilidade', location: 'Centro de Convenções, RJ', date: '22/05/2024', public: '5.000', demand: '120 MWh', status: 'upcoming' },
  { id: 'EV-103', name: 'Maratona Noturna Rio', location: 'Copacabana, RJ', date: '10/05/2024', public: '8.000', demand: '85 MWh', status: 'ongoing' },
  { id: 'EV-104', name: 'Feira de Inovação Energética', location: 'Expominas, MG', date: '05/05/2024', public: '12.000', demand: '310 MWh', status: 'completed' },
  { id: 'EV-105', name: 'Rodeio Sustentável', location: 'Barretos, SP', date: '18/06/2024', public: '40.000', demand: '920 MWh', status: 'upcoming' },
];

const Events: React.FC = () => {
  const columns = [
    { 
      header: 'Evento', 
      accessor: 'name',
      sortable: true,
      render: (row: EventRow) => (
        <div className="flex-col">
          <span className="font-bold text-primary">{row.name}</span>
          <div className="flex items-center gap-1 text-xs text-muted mt-1">
            <MapPin size={12} /> {row.location}
          </div>
        </div>
      )
    },
    { 
      header: 'Data', 
      accessor: 'date',
      sortable: true,
      render: (row: EventRow) => (
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-muted" />
          <span>{row.date}</span>
        </div>
      )
    },
    { 
      header: 'Público', 
      accessor: 'public',
      sortable: true,
      render: (row: EventRow) => (
        <div className="flex items-center gap-2">
          <Users size={14} className="text-muted" />
          <span>{row.public}</span>
        </div>
      )
    },
    { 
      header: 'Demanda', 
      accessor: 'demand',
      sortable: true,
      render: (row: EventRow) => (
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-blue-400" />
          <span className="font-medium">{row.demand}</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      sortable: true,
      render: (row: EventRow) => {
        const statusMap: Record<string, { status: StatusType; label: string }> = {
          upcoming: { status: 'info', label: 'Agendado' },
          ongoing: { status: 'success', label: 'Em Curso' },
          completed: { status: 'neutral', label: 'Finalizado' },
          cancelled: { status: 'error', label: 'Cancelado' }
        };
        const config = statusMap[row.status] || { status: 'neutral', label: row.status };
        return <StatusBadge status={config.status} label={config.label} size="sm" pulse={row.status === 'ongoing'} />;
      }
    },
    {
      header: 'Ações',
      accessor: 'id',
      render: () => (
        <button className="icon-btn hover:bg-white/10 p-1 rounded-full transition-colors">
          <MoreVertical size={18} />
        </button>
      )
    }
  ];

  return (
    <div className="events-page animate-fade-in">
      {/* Executive Header */}
      <div className="module-header">
        <div className="header-content">
          <div className="header-badge">Operações Ativas</div>
          <h1 className="header-title">Gestão de Eventos</h1>
          <p className="header-subtitle">Planejamento e execução operacional da infraestrutura energética.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary flex items-center gap-2">
            <Calendar size={18} />
            Calendário
          </button>
          <button className="btn btn-primary flex items-center gap-2">
            <Plus size={18} />
            Agendar Evento
          </button>
        </div>
      </div>

      {/* Intelligence Banner */}
      <div className="intelligence-banner glass animate-fade-in">
        <div className="banner-icon">
          <Clock size={24} className="text-warning" />
        </div>
        <div className="banner-content">
          <span className="ai-badge-mini">Alerta Operacional</span>
          <h4>Atenção Necessária</h4>
          <p>O evento <strong>Rodeio Sustentável</strong> (18/06) ainda não possui provedor de energia confirmado. Faltam 42 dias para o início da operação.</p>
        </div>
        <div className="banner-actions">
          <button className="btn btn-secondary btn-sm">Abrir Chamada</button>
          <button className="icon-btn-glass"><ChevronRight size={16} /></button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box primary">
              <Calendar size={20} />
            </div>
            <div className="kpi-trend positive">
              Planejados: 12
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total de Eventos (Ano)</span>
            <h2 className="kpi-value">42</h2>
            <p className="kpi-desc">Crescimento de 15% vs 2023</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box success">
              <Activity size={20} />
            </div>
            <div className="kpi-trend positive">
              Ativo
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Em Curso Agora</span>
            <h2 className="kpi-value text-primary">01</h2>
            <p className="kpi-desc">Monitoramento em tempo real</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box warning">
              <Clock size={20} />
            </div>
            <div className="kpi-trend warning">
              Alta Demanda
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Próximos 30 dias</span>
            <h2 className="kpi-value">08</h2>
            <p className="kpi-desc">Infraestrutura em preparação</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box secondary">
              <Users size={20} />
            </div>
            <div className="kpi-trend positive">
              94% Cobertura
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Provedores Alocados</span>
            <h2 className="kpi-value">15</h2>
            <p className="kpi-desc">Parceiros homologados ativos</p>
          </div>
        </div>
      </div>

      {/* Main Content Table */}
      <div className="content-card-enterprise">
        <div className="card-header">
          <div className="header-info">
            <h3>Próximas Operações</h3>
            <p>Acompanhamento detalhado do cronograma de eventos e demanda energética</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary btn-sm">Exportar Relatório</button>
          </div>
        </div>
        <div className="card-body">
          <DataTable 
            columns={columns}
            data={eventsData}
            searchPlaceholder="Buscar por nome, local ou ID..."
          />
        </div>
      </div>
    </div>
  );
};

export default Events;
