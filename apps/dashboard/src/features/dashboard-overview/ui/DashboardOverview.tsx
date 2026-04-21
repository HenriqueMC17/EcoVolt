import React from 'react';
import { 
  Users, 
  Zap, 
  ClipboardCheck, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  AlertCircle,
  Loader2,
  History
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
import { api } from "@/../convex/_generated/api";
import { useUser } from "@/context/UserContext";
import { useNavigate } from 'react-router-dom';
import { Typography } from '@/shared/ui/Typography';
import { cn } from '@/shared/lib/utils';

import { ActivityFeed } from '@/features/activity-feed/ui/ActivityFeed';


export const DashboardOverview: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  const financialStats = useQuery(api.financials.getFinancialStats, { userEmail: user?.email || "" });
  const eventStats = useQuery(api.events.getEventStats, { userEmail: user?.email || "" });
  const contractStats = useQuery(api.contracts.getContractStats, { userEmail: user?.email || "" });
  const consumptionChartData = useQuery(api.consumptions.getConsumptionChartData, { userEmail: user?.email || "" });
  const recentEvents = useQuery(api.events.getEvents, { userEmail: user?.email || "" });
  const operationalAlerts = useQuery(api.alerts.getOperationalAlerts, { userEmail: user?.email || "" });

  if (!financialStats || !eventStats || !contractStats || !consumptionChartData || !recentEvents || !operationalAlerts) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const kpiData = [
    { label: 'Eventos Ativos', value: eventStats.active.toString(), icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-400/10', trend: '+12%', up: true },
    { label: 'Energia Estimada', value: `${consumptionChartData[consumptionChartData.length - 1]?.previsto || 0} kWh`, icon: Zap, color: 'text-blue-400', bg: 'bg-blue-400/10', trend: '+5.4%', up: true },
    { label: 'Contratos Ativos', value: contractStats.active.toString(), icon: ClipboardCheck, color: 'text-violet-400', bg: 'bg-violet-400/10', trend: 'OK', up: true },
    { label: 'Saldo Financeiro', value: `R$ ${financialStats.totalIncome.toLocaleString('pt-BR')}`, icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-400/10', trend: '+R$ 12k', up: true },
  ];

  const eventPieData = [
    { name: 'Planejamento', value: eventStats.planning, color: '#60a5fa' },
    { name: 'Ativo', value: eventStats.active, color: '#34d399' },
    { name: 'Finalizado', value: eventStats.completed, color: '#94a3b8' },
    { name: 'Cancelado', value: eventStats.cancelled, color: '#f87171' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-10 animate-orchestrated">
      <header>
        <Typography variant="h2" className="text-3xl mb-1">
          Bem-vindo, {user?.name.split(' ')[0] || 'Usuário'}
        </Typography>
        <Typography variant="muted">
          Monitoramento em tempo real da infraestrutura EcoVolt.
        </Typography>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <div key={index} className="glass-card space-y-4">
            <div className="flex justify-between items-start">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", kpi.bg, kpi.color)}>
                <kpi.icon size={24} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold",
                kpi.up ? "text-emerald-400" : "text-rose-400"
              )}>
                {kpi.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {kpi.trend}
              </div>
            </div>
            <div>
              <Typography variant="muted" className="text-xs uppercase tracking-widest font-bold mb-1">
                {kpi.label}
              </Typography>
              <Typography variant="h3" className="text-2xl font-bold">
                {kpi.value}
              </Typography>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <Typography variant="h4">Consumo Energético (kWh)</Typography>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs text-text-muted font-medium">Previsto</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-xs text-text-muted font-medium">Realizado</span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={consumptionChartData}>
                <defs>
                  <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="previsto" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorPrev)" strokeWidth={2} />
                <Area type="monotone" dataKey="realizado" stroke="var(--color-secondary)" fillOpacity={1} fill="url(#colorReal)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card h-[400px] flex flex-col">
          <Typography variant="h4" className="mb-8">Status dos Eventos</Typography>
          <div className="flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventPieData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {eventPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Typography variant="h3" className="text-3xl font-black">{eventStats.total}</Typography>
              <Typography variant="muted" className="text-[10px] uppercase tracking-widest font-bold">Total</Typography>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {eventPieData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] text-text-muted font-bold uppercase truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="glass-card">
          <div className="flex justify-between items-center mb-6">
            <Typography variant="h4">Próximos Eventos</Typography>
            <button 
              onClick={() => navigate('/dashboard/eventos')}
              className="text-primary text-xs font-bold uppercase tracking-widest hover:underline"
            >
              Ver todos
            </button>
          </div>
          <div className="space-y-4">
            {recentEvents.slice(0, 3).map((event, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                    <span className="text-primary text-xs font-black">
                      {new Date(event.startDate).toLocaleDateString('pt-BR', { day: '2-digit' })}
                    </span>
                    <span className="text-[10px] font-bold text-text-muted uppercase">
                      {new Date(event.startDate).toLocaleDateString('pt-BR', { month: 'short' })}
                    </span>
                  </div>
                  <div>
                    <Typography variant="h4" className="text-sm">{event.name}</Typography>
                    <Typography variant="muted" className="text-xs">{event.estimatedConsumption} kWh estimados</Typography>
                  </div>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                  event.status === 'active' ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/5" : "text-amber-400 border-amber-400/20 bg-amber-400/5"
                )}>
                  {event.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <Typography variant="h4" className="mb-6">Alertas Operacionais</Typography>
          <div className="space-y-3">
            {operationalAlerts.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-text-muted text-sm italic">
                Nenhum alerta crítico no momento.
              </div>
            ) : (
              operationalAlerts.map((alert: any) => (
                <div 
                  key={alert.id} 
                  onClick={() => alert.link && navigate(alert.link)}
                  className={cn(
                    "p-4 rounded-xl border flex gap-4 transition-all",
                    alert.severity === 'high' 
                      ? "bg-rose-500/5 border-rose-500/10 hover:border-rose-500/30" 
                      : "bg-amber-500/5 border-amber-500/10 hover:border-amber-500/30",
                    alert.link && "cursor-pointer"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    alert.severity === 'high' ? "text-rose-400 bg-rose-400/10" : "text-amber-400 bg-amber-400/10"
                  )}>
                    {alert.severity === 'high' ? <AlertCircle size={20} /> : <Clock size={20} />}
                  </div>
                  <div>
                    <Typography variant="h4" className={cn(
                      "text-sm mb-1",
                      alert.severity === 'high' ? "text-rose-400" : "text-amber-400"
                    )}>
                      {alert.title}
                    </Typography>
                    <Typography variant="muted" className="text-xs leading-relaxed">
                      {alert.description}
                    </Typography>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Activity Feed Section */}
      <div className="glass-card">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <History className="text-primary" size={20} />
            <Typography variant="h4">Atividade Recente (Auditoria)</Typography>
          </div>
          <Typography variant="muted" className="text-xs font-bold uppercase tracking-widest">
            Últimas 10 ações
          </Typography>
        </div>
        <ActivityFeed limit={10} userEmail={user?.email || ""} />
      </div>
    </div>
  );
};
