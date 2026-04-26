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
  History,
  Leaf
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
import { motion } from 'framer-motion';

import { ActivityFeed } from '@/features/activity-feed/ui/ActivityFeed';

export const DashboardOverview: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  const userMe = useQuery(api.users.getMe, { email: user?.email || "" });
  const globalStats = useQuery(api.metrics.getGlobalStats, userMe ? { userId: userMe._id } : "skip");
  const chartDataGlobal = useQuery(api.metrics.getGlobalChartData, userMe ? { userId: userMe._id } : "skip");
  const recentProjects = useQuery(api.projects.list, userMe ? { userId: userMe._id } : "skip");
  const operationalAlerts = useQuery(api.alerts.getOperationalAlerts, { userEmail: user?.email || "" });

  if (!globalStats || !chartDataGlobal || !recentProjects || !operationalAlerts) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="text-primary" size={48} />
        </motion.div>
      </div>
    );
  }

  const kpiData = [
    { label: 'Projetos Ativos', value: globalStats.activeProjects.toString(), icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-400/10', trend: '+2', up: true },
    { label: 'Geração Acumulada', value: `${globalStats.totalEnergy.toFixed(0)} kWh`, icon: Zap, color: 'text-blue-400', bg: 'bg-blue-400/10', trend: '+15%', up: true },
    { label: 'Economia Total', value: `R$ ${globalStats.totalSavings.toLocaleString('pt-BR')}`, icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-400/10', trend: '+R$ 4.2k', up: true },
    { label: 'CO2 Evitado', value: `${globalStats.totalCO2.toFixed(0)} kg`, icon: Leaf, color: 'text-purple-400', bg: 'bg-purple-400/10', trend: '+8%', up: true },
  ];

  const pieData = [
    { name: 'Solar', value: 45, color: 'oklch(0.705 0.15 160)' },
    { name: 'Eólica', value: 30, color: 'oklch(0.6 0.18 250)' },
    { name: 'Biomassa', value: 15, color: 'oklch(0.75 0.15 100)' },
    { name: 'Outros', value: 10, color: 'oklch(0.5 0.05 240)' },
  ];

  return (
    <div className="space-y-10 animate-orchestrated">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Typography variant="h2" className="text-3xl font-black tracking-tight mb-1">
            Dashboard Executivo
          </Typography>
          <Typography variant="muted" className="font-medium">
            Bem-vindo de volta, <span className="text-white font-bold">{user?.name.split(' ')[0]}</span>. Aqui está o panorama da sua infraestrutura.
          </Typography>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 backdrop-blur-md">
          <Clock size={16} className="text-primary" />
          <Typography variant="small" className="text-xs font-bold tracking-tight">
            Última atualização: {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <motion.div 
            key={index} 
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass-card group overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex justify-between items-start mb-6">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6", kpi.bg, kpi.color)}>
                <kpi.icon size={24} />
              </div>
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase",
                kpi.up ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
              )}>
                {kpi.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {kpi.trend}
              </div>
            </div>
            
            <div>
              <Typography variant="small" className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-black mb-1">
                {kpi.label}
              </Typography>
              <Typography variant="h3" className="text-2xl font-black tracking-tighter">
                {kpi.value}
              </Typography>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card h-[450px] flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-30" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <Typography variant="h4" className="font-black tracking-tight mb-1">Performance de Geração</Typography>
              <Typography variant="small" className="text-text-muted">Comparativo entre métricas previstas e realizadas (kWh)</Typography>
            </div>
            <div className="flex gap-6 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
                <span className="text-[10px] text-white font-black uppercase tracking-widest">Previsto</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_8px_var(--color-secondary)]" />
                <span className="text-[10px] text-white font-black uppercase tracking-widest">Realizado</span>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartDataGlobal}>
                <defs>
                  <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={10} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={10} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontWeight: 700 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '16px',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="previsto" 
                  stroke="var(--color-primary)" 
                  fillOpacity={1} 
                  fill="url(#colorPrev)" 
                  strokeWidth={3}
                  animationDuration={2000}
                />
                <Area 
                  type="monotone" 
                  dataKey="realizado" 
                  stroke="var(--color-secondary)" 
                  fillOpacity={1} 
                  fill="url(#colorReal)" 
                  strokeWidth={3}
                  animationDuration={2500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card h-[450px] flex flex-col">
          <Typography variant="h4" className="font-black tracking-tight mb-2">Mix Energético</Typography>
          <Typography variant="small" className="text-text-muted mb-8">Distribuição por fonte de geração</Typography>
          
          <div className="flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '12px',
                    backdropFilter: 'blur(12px)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <Typography variant="h3" className="text-2xl font-black leading-none">100%</Typography>
              <Typography variant="small" className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Sustentável</Typography>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{item.name}</span>
                <span className="text-[10px] font-black ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="glass-card">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <ClipboardCheck className="text-primary" size={20} />
              <Typography variant="h4" className="font-black tracking-tight">Projetos Ativos</Typography>
            </div>
            <button 
              onClick={() => navigate('/dashboard/contratos')}
              className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline px-3 py-1 bg-primary/5 rounded-lg transition-all"
            >
              Ver Tudo
            </button>
          </div>
          <div className="space-y-4">
            {recentProjects.slice(0, 3).map((project, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                onClick={() => navigate(`/dashboard/contratos`)}
                className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.02] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Leaf size={24} />
                  </div>
                  <div>
                    <Typography variant="h4" className="text-sm font-bold">{project.name}</Typography>
                    <Typography variant="muted" className="text-xs font-medium">{project.location}</Typography>
                  </div>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                  project.status === 'active' ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/5" : "text-amber-400 border-amber-400/20 bg-amber-400/5"
                )}>
                  {project.status === 'active' ? 'Operacional' : 'Em Análise'}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <div className="flex items-center gap-3 mb-8">
            <AlertCircle className="text-rose-400" size={20} />
            <Typography variant="h4" className="font-black tracking-tight">Alertas do Sistema</Typography>
          </div>
          <div className="space-y-3">
            {operationalAlerts.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-text-muted text-sm font-medium italic bg-white/5 rounded-2xl border border-dashed border-white/10">
                Nenhum incidente crítico detectado.
              </div>
            ) : (
              operationalAlerts.map((alert: any) => (
                <motion.div 
                  key={alert.id} 
                  whileHover={{ scale: 1.01 }}
                  onClick={() => alert.link && navigate(alert.link)}
                  className={cn(
                    "p-4 rounded-2xl border flex gap-4 transition-all relative overflow-hidden",
                    alert.severity === 'high' 
                      ? "bg-rose-500/5 border-rose-500/10 hover:border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.05)]" 
                      : "bg-amber-500/5 border-amber-500/10 hover:border-amber-500/30",
                    alert.link && "cursor-pointer"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    alert.severity === 'high' ? "text-rose-400 bg-rose-400/10" : "text-amber-400 bg-amber-400/10"
                  )}>
                    {alert.severity === 'high' ? <AlertCircle size={20} /> : <Clock size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography variant="h4" className={cn(
                      "text-sm font-bold mb-0.5",
                      alert.severity === 'high' ? "text-rose-400" : "text-amber-400"
                    )}>
                      {alert.title}
                    </Typography>
                    <Typography variant="muted" className="text-xs font-medium truncate">
                      {alert.description}
                    </Typography>
                  </div>
                  {alert.severity === 'high' && (
                    <div className="absolute top-0 right-0 p-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Activity Feed Section */}
      <div className="glass-card">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <History className="text-primary" size={20} />
            </div>
            <div>
              <Typography variant="h4" className="font-black tracking-tight">Atividade do Sistema</Typography>
              <Typography variant="small" className="text-text-muted">Log de auditoria e operações recentes</Typography>
            </div>
          </div>
          <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">
            <Typography variant="muted" className="text-[9px] font-black uppercase tracking-widest">
              Live Feed
            </Typography>
          </div>
        </div>
        <div className="bg-white/[0.01] rounded-2xl p-4 border border-white/5">
          <ActivityFeed limit={8} userEmail={user?.email || ""} />
        </div>
      </div>
    </div>
  );
};
