import React from 'react';
import { 
  Users, 
  Zap, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  AlertCircle,
  Loader2,
  History,
  Leaf,
  Activity,
  Cpu,
  Globe,
  TrendingUp
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
import { motion, AnimatePresence } from 'framer-motion';

import { ActivityFeed } from '@/features/activity-feed/ui/ActivityFeed';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const KPICard = ({ label, value, icon: Icon, color, trend, up, delay }: any) => (
  <motion.div 
    variants={itemVariants}
    whileHover={{ y: -5 }}
    className="glass-card relative overflow-hidden group border-slate-800/50 hover:border-slate-700/50 transition-all duration-700"
  >
    <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity duration-1000 ${color === 'text-emerald-400' ? 'bg-emerald-500' : color === 'text-blue-400' ? 'bg-blue-500' : color === 'text-amber-400' ? 'bg-amber-500' : 'bg-purple-500'}`} />
    
    <div className="flex justify-between items-start mb-8 relative z-10">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-950/80 border border-white/5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 shadow-2xl", color)}>
        <Icon size={28} />
      </div>
      <div className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border transition-all duration-700",
        up ? "text-emerald-400 bg-emerald-400/5 border-emerald-400/10 group-hover:bg-emerald-400/20" : "text-rose-400 bg-rose-400/5 border-rose-400/10 group-hover:bg-rose-400/20"
      )}>
        {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </div>
    </div>
    
    <div className="space-y-1 relative z-10">
      <Typography className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase">
        {label}
      </Typography>
      <Typography className="text-3xl font-black text-white tracking-tighter">
        {value}
      </Typography>
    </div>

    <div className="mt-8 h-1 w-full bg-slate-900/50 rounded-full overflow-hidden relative z-10">
      <motion.div 
        initial={{ x: '-100%' }}
        animate={{ x: '0%' }}
        transition={{ duration: 2, ease: "circOut", delay: 0.5 + delay }}
        className={cn("h-full bg-gradient-to-r rounded-full", color === 'text-emerald-400' ? 'from-emerald-500 to-teal-400' : color === 'text-blue-400' ? 'from-blue-500 to-indigo-400' : color === 'text-amber-400' ? 'from-amber-500 to-yellow-400' : 'from-purple-500 to-pink-400')}
      />
    </div>
  </motion.div>
);

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
      <div className="h-[70vh] flex flex-col items-center justify-center gap-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[100px] rounded-full animate-pulse" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-full border-b-4 border-primary shadow-[0_10px_40px_rgba(16,185,129,0.3)] flex items-center justify-center">
            <Cpu className="text-primary animate-pulse" size={32} />
          </div>
        </motion.div>
        <Typography className="text-[10px] font-black tracking-[0.5em] text-slate-500 uppercase animate-pulse">
          Sincronizando Rede...
        </Typography>
      </div>
    );
  }

  const kpiData = [
    { label: 'Projetos Ativos', value: globalStats.activeProjects.toString(), icon: Globe, color: 'text-emerald-400', trend: '+2', up: true },
    { label: 'Geração Acumulada', value: `${globalStats.totalEnergy.toFixed(0)} kWh`, icon: Zap, color: 'text-blue-400', trend: '+15%', up: true },
    { label: 'Economia Líquida', value: `R$ ${globalStats.totalSavings.toLocaleString('pt-BR')}`, icon: TrendingUp, color: 'text-amber-400', trend: '+R$ 4.2k', up: true },
    { label: 'Carbon Offset', value: `${globalStats.totalCO2.toFixed(0)} kg`, icon: Leaf, color: 'text-purple-400', trend: '+8%', up: true },
  ];

  const pieData = [
    { name: 'Solar', value: 45, color: '#10b981' },
    { name: 'Eólica', value: 30, color: '#3b82f6' },
    { name: 'Biomassa', value: 15, color: '#f59e0b' },
    { name: 'Outros', value: 10, color: '#8b5cf6' },
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-12 pb-20"
    >
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_12px_rgba(16,185,129,0.6)] animate-pulse" />
            <Typography className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">
              System Health: Optimal
            </Typography>
          </div>
          <Typography variant="h1" className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none">
            Network <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500 italic">Core</span>
          </Typography>
          <Typography variant="body" className="text-slate-400 font-medium tracking-wide max-w-xl">
            Bem-vindo ao centro de comando, <span className="text-white font-black">{user?.name.split(' ')[0]}</span>. Monitoramento em tempo real da infraestrutura EcoVolt.
          </Typography>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="flex items-center gap-4 bg-slate-900/40 p-4 rounded-3xl border border-white/5 backdrop-blur-3xl shadow-2xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <Clock size={24} className="animate-spin-slow" />
          </div>
          <div>
            <Typography className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Last Update</Typography>
            <Typography className="text-lg font-black text-white tracking-tighter">
              {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </Typography>
          </div>
        </motion.div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} delay={index * 0.1} />
        ))}
      </div>

      {/* Charts Visualization Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="xl:col-span-2 glass-card h-[550px] flex flex-col relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500 opacity-20" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 p-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity size={16} className="text-primary" />
                <Typography className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Grid Performance</Typography>
              </div>
              <Typography variant="h3" className="text-2xl font-black text-white tracking-tight">Telemetria de Geração</Typography>
            </div>
            
            <div className="flex gap-4 p-2 bg-slate-950/50 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,1)]" />
                <span className="text-[10px] text-white font-black uppercase tracking-widest">Previsto</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 border-l border-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,1)]" />
                <span className="text-[10px] text-white font-black uppercase tracking-widest">Realizado</span>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartDataGlobal} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="8 8" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.1)" 
                  fontSize={10} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontWeight: 800 }}
                  dy={15}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.1)" 
                  fontSize={10} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontWeight: 800 }}
                />
                <Tooltip 
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(2, 6, 23, 0.95)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '24px',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    padding: '16px'
                  }}
                  itemStyle={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="previsto" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorPrev)" 
                  strokeWidth={4}
                  dot={{ r: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
                  animationDuration={3000}
                />
                <Area 
                  type="monotone" 
                  dataKey="realizado" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorReal)" 
                  strokeWidth={4}
                  dot={{ r: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
                  animationDuration={3500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card h-[550px] flex flex-col p-10 relative overflow-hidden">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <PieChart size={16} className="text-purple-400" />
              <Typography className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">Resource Allocation</Typography>
            </div>
            <Typography variant="h3" className="text-2xl font-black text-white tracking-tight">Mix de Ativos</Typography>
          </div>
          
          <div className="flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={125}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                  animationBegin={500}
                  animationDuration={2000}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(2, 6, 23, 0.95)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '16px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <Typography className="text-4xl font-black leading-none tracking-tighter text-white">100<span className="text-primary text-2xl">%</span></Typography>
              <Typography className="text-[9px] uppercase tracking-[0.4em] text-slate-500 font-black">Renewable</Typography>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: item.color, color: item.color }} />
                <div className="flex-1">
                  <Typography className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{item.name}</Typography>
                  <Typography className="text-xs font-black text-white">{item.value}%</Typography>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Operation Control Centers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants} className="glass-card p-10">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ClipboardCheck size={26} />
              </div>
              <div>
                <Typography variant="h3" className="text-xl font-black text-white tracking-tight">Active Projects</Typography>
                <Typography className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Deployment Queue</Typography>
              </div>
            </div>
            <button 
              onClick={() => navigate('/dashboard/contratos')}
              className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white hover:border-white/10 transition-all"
            >
              Access Explorer
            </button>
          </div>
          
          <div className="space-y-4">
            {recentProjects.slice(0, 3).map((project, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ x: 10 }}
                onClick={() => navigate(`/dashboard/contratos`)}
                className="flex items-center justify-between p-6 rounded-[2rem] border border-white/5 bg-slate-900/40 hover:bg-slate-900/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-center text-emerald-500 group-hover:scale-110 group-hover:border-emerald-500/30 transition-all duration-700">
                    <Leaf size={24} />
                  </div>
                  <div>
                    <Typography className="text-sm font-black text-white tracking-tight mb-1 group-hover:text-emerald-400 transition-colors">{project.name}</Typography>
                    <div className="flex items-center gap-2">
                      <Globe size={12} className="text-slate-600" />
                      <Typography className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{project.location}</Typography>
                    </div>
                  </div>
                </div>
                <div className={cn(
                  "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-700",
                  project.status === 'active' 
                    ? "text-emerald-400 border-emerald-400/10 bg-emerald-400/5 group-hover:bg-emerald-400/20" 
                    : "text-amber-400 border-amber-400/10 bg-amber-400/5 group-hover:bg-amber-400/20"
                )}>
                  {project.status === 'active' ? 'Operational' : 'Syncing'}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
            <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,1)] animate-ping" />
          </div>
          
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertCircle size={26} />
            </div>
            <div>
              <Typography variant="h3" className="text-xl font-black text-white tracking-tight italic">Threat Detection</Typography>
              <Typography className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Security Center</Typography>
            </div>
          </div>
          
          <div className="space-y-4">
            {operationalAlerts.length === 0 ? (
              <div className="h-[268px] flex flex-col items-center justify-center gap-4 text-slate-500 bg-slate-950/40 rounded-[2rem] border border-dashed border-white/5">
                <ShieldCheck size={40} className="text-emerald-500 opacity-20" />
                <Typography className="text-[10px] font-black uppercase tracking-[0.3em] italic">No active threats detected</Typography>
              </div>
            ) : (
              operationalAlerts.map((alert: any) => (
                <motion.div 
                  key={alert.id} 
                  whileHover={{ scale: 1.02 }}
                  onClick={() => alert.link && navigate(alert.link)}
                  className={cn(
                    "p-6 rounded-[2rem] border flex gap-6 transition-all relative overflow-hidden",
                    alert.severity === 'high' 
                      ? "bg-rose-500/5 border-rose-500/10 hover:border-rose-500/30" 
                      : "bg-amber-500/5 border-amber-500/10 hover:border-amber-500/30",
                    alert.link && "cursor-pointer"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                    alert.severity === 'high' ? "text-rose-400 bg-rose-400/10 border border-rose-400/20" : "text-amber-400 bg-amber-400/10 border border-amber-400/20"
                  )}>
                    {alert.severity === 'high' ? <AlertCircle size={24} /> : <Clock size={24} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography className={cn(
                      "text-sm font-black uppercase tracking-tight mb-1 italic",
                      alert.severity === 'high' ? "text-rose-400" : "text-amber-400"
                    )}>
                      {alert.title}
                    </Typography>
                    <Typography className="text-xs font-medium text-slate-400 leading-relaxed">
                      {alert.description}
                    </Typography>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Integrated Activity Ledger */}
      <motion.div variants={itemVariants} className="glass-card p-10">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center">
              <History className="text-primary" size={26} />
            </div>
            <div>
              <Typography variant="h3" className="text-2xl font-black text-white tracking-tight">Activity Ledger</Typography>
              <Typography className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Immutable Operation Log</Typography>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)] animate-pulse" />
            <Typography className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400">
              Live Stream
            </Typography>
          </div>
        </div>
        
        <div className="bg-slate-950/40 rounded-[2.5rem] p-8 border border-white/5">
          <ActivityFeed limit={10} userEmail={user?.email || ""} />
        </div>
      </motion.div>
    </motion.div>
  );
};
