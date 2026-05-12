import React from 'react';
import { 
  Users, 
  Zap, 
  DollarSign, 
  AlertTriangle, 
  ArrowUpRight,
  Calendar,
  Clock,
  Activity,
  FileText,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Leaf,
  Target
} from 'lucide-react';
import { 
  AreaChart, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Area
} from 'recharts';
import StatusBadge from '../../../components/shared/StatusBadge';
import type { StatusType } from '../../../components/shared/StatusBadge';
import './Overview.css';

const dataPerformance = [
  { name: 'Jan', previsto: 4000, realizado: 2400 },
  { name: 'Fev', previsto: 3000, realizado: 1398 },
  { name: 'Mar', previsto: 2000, realizado: 9800 },
  { name: 'Abr', previsto: 2780, realizado: 3908 },
  { name: 'Mai', previsto: 1890, realizado: 4800 },
  { name: 'Jun', previsto: 2390, realizado: 3800 },
];

const dataContratos = [
  { name: 'Ativos', value: 45, color: 'var(--primary-main)' },
  { name: 'Assinatura', value: 25, color: 'var(--secondary-main)' },
  { name: 'Negociação', value: 20, color: 'var(--warning-main)' },
  { name: 'Encerrados', value: 10, color: 'var(--text-muted)' },
];

const Overview: React.FC = () => {
  return (
    <div className="overview-page module-page">
      <header className="module-header">
        <div className="header-content">
          <div className="header-badge">Centro de Comando AI</div>
          <h1 className="header-title">Centro de Comando</h1>
          <p className="header-subtitle">
            Visão executiva da operação energética, contratos e eventos em tempo real.
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <FileText size={18} />
            <span>Relatório Executivo</span>
          </button>
          <button className="btn btn-primary">
            <TrendingUp size={18} />
            <span>Simular Cenários</span>
          </button>
        </div>
      </header>

      <div className="intelligence-banner glass animate-fade-in">
        <div className="banner-icon">
          <ShieldAlert size={24} className="text-error" />
        </div>
        <div className="banner-content">
          <span className="ai-badge-mini">Alerta AI</span>
          <h4>Atenção Necessária na Operação</h4>
          <p>
            Existem <strong>3 desvios críticos</strong> identificados na reconciliação financeira e 
            <strong> 2 contratos</strong> vencendo nos próximos 7 dias.
          </p>
        </div>
        <div className="banner-actions">
          <button className="btn btn-primary btn-sm">Ver Detalhes</button>
          <button className="icon-btn-glass">
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card-enterprise">
          <div className="kpi-icon-wrapper success">
            <Users size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Eventos Ativos</span>
            <div className="kpi-value-container">
              <h2 className="kpi-value">12</h2>
              <span className="kpi-trend positive">
                <ArrowUpRight size={12} />
                +2
              </span>
            </div>
            <p className="kpi-subtitle">Novos eventos esta semana</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-icon-wrapper primary">
            <Zap size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Injeção Total</span>
            <div className="kpi-value-container">
              <h2 className="kpi-value">450 <span className="unit">MWh</span></h2>
              <span className="kpi-trend positive">
                <ArrowUpRight size={12} />
                +15%
              </span>
            </div>
            <p className="kpi-subtitle">vs mês anterior</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-icon-wrapper warning">
            <DollarSign size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Economia Gerada</span>
            <div className="kpi-value-container">
              <h2 className="kpi-value">R$ 42.5k</h2>
              <span className="kpi-trend positive">
                <Target size={12} />
                12.4%
              </span>
            </div>
            <p className="kpi-subtitle">Otimização de custos</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-icon-wrapper secondary">
            <Leaf size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">CO2 Evitado</span>
            <div className="kpi-value-container">
              <h2 className="kpi-value">15.8 <span className="unit">t</span></h2>
              <span className="kpi-trend positive">92%</span>
            </div>
            <p className="kpi-subtitle">Meta de sustentabilidade</p>
          </div>
        </div>
      </div>

      <div className="overview-charts-grid">
        <div className="content-card-enterprise chart-card large">
          <div className="card-header">
            <div className="header-info">
              <Activity size={20} className="text-primary" />
              <h3>Performance Energética</h3>
            </div>
            <div className="chart-legend">
              <span className="legend-item"><span className="dot secondary"></span> Previsto</span>
              <span className="legend-item"><span className="dot primary"></span> Realizado</span>
            </div>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={dataPerformance}>
                <defs>
                  <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--secondary-main)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--secondary-main)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary-main)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--primary-main)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                />
                <Area type="monotone" dataKey="previsto" stroke="var(--secondary-main)" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPrev)" />
                <Area type="monotone" dataKey="realizado" stroke="var(--primary-main)" strokeWidth={3} fillOpacity={1} fill="url(#colorReal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="content-card-enterprise chart-card">
          <div className="card-header">
            <div className="header-info">
              <FileText size={20} className="text-secondary" />
              <h3>Lifecycle de Contratos</h3>
            </div>
          </div>
          <div className="chart-body pie-container">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={dataContratos}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {dataContratos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend-enterprise">
              {dataContratos.map((item) => (
                <div key={item.name} className="legend-item-pill">
                  <span className="dot" style={{backgroundColor: item.color}}></span>
                  <span className="label">{item.name}</span>
                  <span className="value">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="overview-bottom-grid">
        <div className="content-card-enterprise block-card">
          <div className="card-header">
            <div className="header-info">
              <AlertTriangle size={18} className="text-warning" />
              <h3>Pendências Críticas</h3>
            </div>
            <button className="btn-text">Ver Painel</button>
          </div>
          <div className="block-list">
            {[
              { title: 'Contrato #459 expira em 48h', time: 'Há 2 horas', status: 'error' as StatusType, label: 'Urgente' },
              { title: 'Inconsistência na Reconciliação PCH-02', time: 'Há 5 horas', status: 'warning' as StatusType, label: 'Atenção' },
              { title: 'Relatório de conformidade pendente', time: 'Hoje', status: 'info' as StatusType, label: 'Novo' }
            ].map((item, i) => (
              <div key={i} className="list-item-enterprise">
                <div className="item-details">
                  <p className="item-title">{item.title}</p>
                  <p className="item-meta">{item.time}</p>
                </div>
                <StatusBadge status={item.status} label={item.label} size="sm" />
              </div>
            ))}
          </div>
        </div>

        <div className="content-card-enterprise block-card">
          <div className="card-header">
            <div className="header-info">
              <Calendar size={18} className="text-primary" />
              <h3>Próximas Operações</h3>
            </div>
            <button className="btn-text">Calendário</button>
          </div>
          <div className="block-list">
            {[
              { name: 'EcoFestival 2024', loc: 'Parque Ibirapuera, SP', date: '15', month: 'MAI', status: 'success' as StatusType, label: 'Confirmado' },
              { name: 'Rock in Rio 2024', loc: 'Cidade do Rock, RJ', date: '13', month: 'SET', status: 'info' as StatusType, label: 'Agendado' },
              { name: 'Congresso Tech', loc: 'Expominas, MG', date: '22', month: 'MAI', status: 'warning' as StatusType, label: 'Pendente' }
            ].map((item, i) => (
              <div key={i} className="operation-item">
                <div className="date-badge">
                  <span className="day">{item.date}</span>
                  <span className="month">{item.month}</span>
                </div>
                <div className="item-details">
                  <p className="item-title">{item.name}</p>
                  <p className="item-meta">{item.loc}</p>
                </div>
                <StatusBadge status={item.status} label={item.label} size="sm" />
              </div>
            ))}
          </div>
        </div>

        <div className="content-card-enterprise block-card">
          <div className="card-header">
            <div className="header-info">
              <Clock size={18} className="text-info" />
              <h3>Atividade Recente</h3>
            </div>
            <button className="btn-text">Logs</button>
          </div>
          <div className="activity-timeline">
            {[
              { user: 'Carlos A.', action: 'aprovou proposta', target: 'SolarTech', time: '14:30' },
              { user: 'Mariana L.', action: 'assinou contrato', target: 'PCH-02', time: '11:15' },
              { user: 'Sistema', action: 'detectou pico', target: 'Setor A', time: '08:45' }
            ].map((item, i) => (
              <div key={i} className="timeline-event">
                <div className="timeline-marker"></div>
                <div className="event-details">
                  <p className="event-desc">
                    <strong>{item.user}</strong> {item.action} <strong>{item.target}</strong>
                  </p>
                  <p className="event-time">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
