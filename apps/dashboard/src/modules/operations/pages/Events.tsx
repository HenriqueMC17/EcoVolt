import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Zap, 
  Clock, 
  Plus, 
  Search, 
  Filter,
  MoreVertical
} from 'lucide-react';
import DataTable from '../../../components/shared/DataTable';
import './Events.css';

interface Event {
  id: string;
  name: string;
  location: string;
  date: string;
  public: string;
  demand: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

const eventsData: Event[] = [
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
      render: (row: Event) => (
        <div className="flex-col">
          <span className="font-bold text-primary">{row.name}</span>
          <div className="flex-center gap-1 text-xs text-muted">
            <MapPin size={10} /> {row.location}
          </div>
        </div>
      )
    },
    { 
      header: 'Data', 
      accessor: 'date',
      render: (row: Event) => (
        <div className="flex-center gap-2">
          <Calendar size={14} className="text-muted" />
          <span>{row.date}</span>
        </div>
      )
    },
    { 
      header: 'Público', 
      accessor: 'public',
      render: (row: Event) => (
        <div className="flex-center gap-2">
          <Users size={14} className="text-muted" />
          <span>{row.public}</span>
        </div>
      )
    },
    { 
      header: 'Demanda', 
      accessor: 'demand',
      render: (row: Event) => (
        <div className="flex-center gap-2">
          <Zap size={14} className="text-blue-400" />
          <span className="font-medium">{row.demand}</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row: Event) => (
        <span className={`status-pill ${row.status}`}>
          {row.status === 'ongoing' && <span className="dot pulse"></span>}
          {row.status === 'upcoming' ? 'Agendado' : row.status === 'ongoing' ? 'Em Curso' : row.status === 'completed' ? 'Finalizado' : 'Cancelado'}
        </span>
      )
    },
    {
      header: '',
      accessor: 'id',
      render: () => (
        <button className="icon-btn"><MoreVertical size={18} /></button>
      )
    }
  ];

  return (
    <div className="events-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestão de Eventos</h1>
          <p className="page-subtitle">Planejamento e execução operacional da infraestrutura energética.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">Calendário</button>
          <button className="btn btn-primary flex-center gap-2">
            <Plus size={18} />
            Agendar Evento
          </button>
        </div>
      </div>

      <div className="events-quick-stats">
        <div className="quick-stat glass">
          <p>Total de Eventos (Ano)</p>
          <h3>42</h3>
        </div>
        <div className="quick-stat glass">
          <p>Em Curso Agora</p>
          <h3 className="text-primary">1</h3>
        </div>
        <div className="quick-stat glass">
          <p>Próximos 30 dias</p>
          <h3>8</h3>
        </div>
      </div>

      <div className="events-filters glass">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Buscar por nome, local ou ID..." />
        </div>
        <div className="filter-actions">
          <button className="filter-btn"><Filter size={18} /> Filtros</button>
          <button className="view-btn active">Lista</button>
          <button className="view-btn">Gantt</button>
        </div>
      </div>

      <div className="events-table">
        <DataTable 
          title="Próximas Operações"
          columns={columns}
          data={eventsData}
        />
      </div>

      <div className="event-insights glass">
        <div className="insight-header">
          <Clock size={20} className="text-warning" />
          <h3>Atenção Necessária</h3>
        </div>
        <p>O evento <strong>Rodeio Sustentável</strong> (18/06) ainda não possui provedor de energia confirmado. Faltam 42 dias para o início da operação.</p>
        <button className="btn btn-primary btn-sm">Abrir Chamada</button>
      </div>
    </div>
  );
};

export default Events;
