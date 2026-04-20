import React from 'react';
import { 
  Users, 
  Zap, 
  ClipboardCheck, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "../context/UserContext";

const Overview: React.FC = () => {
  const { user } = useUser();
  const financialStats = useQuery(api.financials.getFinancialStats, { userEmail: user?.email || "" });
  const eventStats = useQuery(api.events.getEventStats, { userEmail: user?.email || "" });
  const contractStats = useQuery(api.contracts.getContractStats, { userEmail: user?.email || "" });
  const consumptionChartData = useQuery(api.consumptions.getConsumptionChartData, { userEmail: user?.email || "" });
  const recentEvents = useQuery(api.events.getEvents, { userEmail: user?.email || "" });

  if (!financialStats || !eventStats || !contractStats || !consumptionChartData || !recentEvents) {
    return (
      <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
      </div>
    );
  }

  const kpiData = [
    { label: 'Eventos Ativos', value: eventStats.active.toString(), icon: Users, color: '#10b981', trend: '+12%', up: true },
    { label: 'Energia Estimada (Mês)', value: `${consumptionChartData[consumptionChartData.length - 1]?.previsto || 0} kWh`, icon: Zap, color: '#3b82f6', trend: '+5.4%', up: true },
    { label: 'Contratos Ativos', value: contractStats.active.toString(), icon: ClipboardCheck, color: '#8b5cf6', trend: 'OK', up: true },
    { label: 'Saldo Financeiro', value: `R$ ${financialStats.totalIncome.toLocaleString('pt-BR')}`, icon: DollarSign, color: '#f59e0b', trend: '+R$ 12k', up: true },
  ];

  const eventPieData = [
    { name: 'Planejamento', value: eventStats.planning, color: '#3b82f6' },
    { name: 'Ativo', value: eventStats.active, color: '#10b981' },
    { name: 'Finalizado', value: eventStats.completed, color: '#64748b' },
    { name: 'Cancelado', value: eventStats.cancelled, color: '#f43f5e' },
  ].filter(d => d.value > 0);

  return (
    <div style={{ paddingBottom: '40px' }}>
      <header style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>Bem-vindo, Administrador</h2>
        <p style={{ color: 'var(--text-muted)' }}>Aqui está o que está acontecendo com a operação da EcoVolt hoje.</p>
      </header>

      {/* KPI Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        {kpiData.map((kpi, index) => (
          <div key={index} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: `${kpi.color}20`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: kpi.color
              }}>
                <kpi.icon size={24} />
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px', 
                fontSize: '0.85rem', 
                fontWeight: 600,
                color: kpi.up ? 'var(--success)' : 'var(--error)'
              }}>
                {kpi.up ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {kpi.trend}
              </div>
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{kpi.label}</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Consumo Energético (kWh)</h4>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></span>
                Previsto
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)' }}></span>
                Realizado
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={consumptionChartData}>
                <defs>
                  <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '0.85rem' }}
                />
                <Area type="monotone" dataKey="previsto" stroke="var(--primary)" fillOpacity={1} fill="url(#colorPrev)" strokeWidth={2} />
                <Area type="monotone" dataKey="realizado" stroke="var(--secondary)" fillOpacity={1} fill="url(#colorReal)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '24px' }}>Status dos Eventos</h4>
          <div style={{ flex: 1, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventPieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {eventPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{eventStats.total}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
            {eventPieData.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}></span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Próximos Eventos</h4>
            <button style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Ver todos</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentEvents.slice(0, 3).map((event, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '12px',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '10px', 
                    background: 'var(--bg-surface-elevated)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}>
                    <span style={{ color: 'var(--primary)' }}>{new Date(event.startDate).toLocaleDateString('pt-BR', { day: '2-digit' })}</span>
                    <span>{new Date(event.startDate).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{event.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{event.estimatedConsumption} kWh</p>
                  </div>
                </div>
                <span className={`badge ${event.status === 'active' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px' }}>Alertas Operacionais</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ 
              padding: '16px', 
              borderRadius: '12px', 
              background: 'rgba(244, 63, 94, 0.05)', 
              border: '1px solid rgba(244, 63, 94, 0.1)',
              display: 'flex',
              gap: '12px'
            }}>
              <AlertCircle size={20} color="var(--error)" />
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fb7185' }}>Desvio de Consumo Detectado</p>
                <p style={{ fontSize: '0.8rem', color: 'rgba(251, 113, 133, 0.8)' }}>Monitoramento detectou variações fora da curva em 3 eventos ativos.</p>
              </div>
            </div>
            <div style={{ 
              padding: '16px', 
              borderRadius: '12px', 
              background: 'rgba(245, 158, 11, 0.05)', 
              border: '1px solid rgba(245, 158, 11, 0.1)',
              display: 'flex',
              gap: '12px'
            }}>
              <Clock size={20} color="var(--warning)" />
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fbbf24' }}>Contratos Próximos do Vencimento</p>
                <p style={{ fontSize: '0.8rem', color: 'rgba(251, 191, 36, 0.8)' }}>Existem 5 contratos que requerem renovação ou fechamento financeiro.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
