import React from 'react';
import { 
  Users, 
  Zap, 
  DollarSign, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  Clock,
  Activity
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
  { name: 'Ativos', value: 45, color: '#10b981' },
  { name: 'Assinatura', value: 25, color: '#3b82f6' },
  { name: 'Negociação', value: 20, color: '#f59e0b' },
  { name: 'Encerrados', value: 10, color: '#94a3b8' },
];

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  trendValue: string;
  color: string;
}

const KPICard = ({ title, value, icon, trend, trendValue, color }: KPICardProps) => (
  <div className="kpi-card glass animate-fade-in">
    <div className="kpi-header">
      <div className={`kpi-icon-box ${color}`}>
        {icon}
      </div>
      <div className={`kpi-trend ${trend === 'up' ? 'positive' : 'negative'}`}>
        {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        <span>{trendValue}</span>
      </div>
    </div>
    <div className="kpi-body">
      <h3 className="kpi-value">{value}</h3>
      <p className="kpi-title">{title}</p>
    </div>
  </div>
);

const Overview: React.FC = () => {
  return (
    <div className="overview-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Bem-vindo ao EcoVolt</h1>
          <p className="page-subtitle">Acompanhe a performance e operação em tempo real.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">Exportar PDF</button>
          <button className="btn btn-primary">Novo Evento</button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <KPICard 
          title="Eventos Ativos" 
          value="12" 
          icon={<Users size={24} />} 
          trend="up" 
          trendValue="+2" 
          color="green"
        />
        <KPICard 
          title="Injeção Total" 
          value="450 MWh" 
          icon={<Zap size={24} />} 
          trend="up" 
          trendValue="+15%" 
          color="blue"
        />
        <KPICard 
          title="Economia Gerada" 
          value="R$ 42.5k" 
          icon={<DollarSign size={24} />} 
          trend="up" 
          trendValue="+12%" 
          color="yellow"
        />
        <KPICard 
          title="CO2 Evitado" 
          value="15.8 t" 
          icon={<Activity size={24} />} 
          trend="up" 
          trendValue="+4%" 
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-container glass large">
          <div className="chart-header">
            <h3>Previsto x Realizado (Consumo kWh)</h3>
            <div className="chart-legend">
              <span className="legend-item"><span className="dot blue"></span> Previsto</span>
              <span className="legend-item"><span className="dot green"></span> Realizado</span>
            </div>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dataPerformance}>
                <defs>
                  <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px'}}
                  itemStyle={{color: '#f8fafc'}}
                />
                <Area type="monotone" dataKey="previsto" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPrev)" />
                <Area type="monotone" dataKey="realizado" stroke="#10b981" fillOpacity={1} fill="url(#colorReal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container glass small">
          <div className="chart-header">
            <h3>Lifecycle de Contratos</h3>
          </div>
          <div className="chart-body flex-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dataContratos}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataContratos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {dataContratos.map((item) => (
                <div key={item.name} className="pie-legend-item">
                  <span className="dot" style={{backgroundColor: item.color}}></span>
                  <span className="name">{item.name}</span>
                  <span className="value">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="bottom-grid">
        <div className="block-container glass">
          <div className="block-header">
            <div className="flex-center gap-2">
              <AlertTriangle size={18} className="text-warning" />
              <h3>Alertas e Pendências</h3>
            </div>
            <button className="view-all">Ver tudo</button>
          </div>
          <div className="block-content">
            {[1, 2, 3].map((i) => (
              <div key={i} className="alert-item">
                <div className="alert-icon-box warning">!</div>
                <div className="alert-info">
                  <p className="alert-title">Contrato #459 expira em 48h</p>
                  <p className="alert-time">Há 2 horas • Urgente</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="block-container glass">
          <div className="block-header">
            <div className="flex-center gap-2">
              <Calendar size={18} className="text-primary" />
              <h3>Próximos Eventos</h3>
            </div>
            <button className="view-all">Ver tudo</button>
          </div>
          <div className="block-content">
            {[1, 2, 3].map((i) => (
              <div key={i} className="event-mini-card">
                <div className="event-date">
                  <span className="day">15</span>
                  <span className="month">MAI</span>
                </div>
                <div className="event-details">
                  <p className="event-name">EcoFestival 2024</p>
                  <p className="event-loc">Parque Ibirapuera, SP</p>
                </div>
                <div className="event-status badge-success">Confirmado</div>
              </div>
            ))}
          </div>
        </div>

        <div className="block-container glass">
          <div className="block-header">
            <div className="flex-center gap-2">
              <Clock size={18} className="text-info" />
              <h3>Últimas Movimentações</h3>
            </div>
            <button className="view-all">Ver tudo</button>
          </div>
          <div className="block-content">
            <div className="timeline">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <p className="timeline-text"><strong>Carlos A.</strong> aprovou a proposta de <strong>SolarTech</strong></p>
                    <p className="timeline-time">Ontem às 14:30</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
