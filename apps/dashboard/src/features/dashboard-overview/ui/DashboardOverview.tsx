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
import { api } from "@convex/_generated/api";
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
    whileHover={{ y: -5, scale: 1.02 }}
    className="glass-card relative overflow-hidden group border-white/5 hover:border-primary/30 transition-all duration-700 bg-slate-900/20 backdrop-blur-3xl"
  >
    {/* Neural Scanline Effect */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-20" />
    
    <div className={cn(
      "absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000",
      color.includes('emerald') ? 'bg-emerald-500' : color.includes('blue') ? 'bg-blue-500' : color.includes('amber') ? 'bg-amber-500' : 'bg-purple-500'
    )} />
    
    <div className="flex justify-between items-start mb-10 relative z-10">
      <div className={cn(
        "w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-950 border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden",
        color
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <Icon size={28} strokeWidth={1.5} />
      </div>
      
      <div className={cn(
        "flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black tracking-[0.2em] uppercase border transition-all duration-700",
        up 
          ? "text-emerald-400 bg-emerald-400/5 border-emerald-400/20 group-hover:bg-emerald-400/10 group-hover:border-emerald-400/40" 
          : "text-rose-400 bg-rose-400/5 border-rose-400/20 group-hover:bg-rose-400/10 group-hover:border-rose-400/40"
      )}>
        {up ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
        {trend}
      </div>
    </div>
    
    <div className="space-y-2 relative z-10">
      <div className="flex items-center gap-2">
        <div className={cn("w-1 h-3 rounded-full", color.replace('text', 'bg'))} />
        <Typography className="text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase">
          {label}
        </Typography>
      </div>
      <Typography className="text-4xl font-black text-white tracking-tighter drop-shadow-2xl">
        {value}
      </Typography>
    </div>

    <div className="mt-8 flex items-center justify-between relative z-10">
      <div className="h-[2px] flex-1 bg-slate-800/50 rounded-full overflow-hidden mr-4">
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.5 + delay }}
          className={cn(
            "h-full bg-gradient-to-r rounded-full",
            color.includes('emerald') ? 'from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
            color.includes('blue') ? 'from-blue-500 to-indigo-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 
            color.includes('amber') ? 'from-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 
            'from-purple-500 to-pink-400 shadow-[0_0_10px_rgba(139,92,246,0.5)]'
          )}
        />
      </div>
      <Typography className="text-[9px] font-black text-slate-600 tracking-[0.2em]">INTEGRITY_CHECK: PASS</Typography>
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
        <motion.div variants={itemVariants} className="xl:col-span-2 glass-card h-[550px] flex flex-col relative group overflow-hidden border-white/5 bg-slate-900/10 backdrop-blur-3xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.03),transparent_70%)]" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 p-4 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                  <Activity size={16} strokeWidth={2.5} />
                </div>
                <Typography className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">GRID_TOPOLOGY_TELEMETRY</Typography>
              </div>
              <Typography variant="h3" className="text-3xl font-black text-white tracking-tighter">Geração Neural</Typography>
            </div>
            
            <div className="flex gap-4 p-1.5 bg-slate-950/80 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl">
              <div className="flex items-center gap-3 px-5 py-3 bg-white/5 rounded-xl border border-white/5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,1)] animate-pulse" />
                <span className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Expected_Flow</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,1)]" />
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Actual_Output</span>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 px-2 pb-6 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartDataGlobal} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.1)" 
                  fontSize={10} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  dy={15}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.1)" 
                  fontSize={10} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontWeight: 900 }}
                />
                <Tooltip 
                  cursor={{ stroke: 'rgba(16,185,129,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-950/90 backdrop-blur-2xl border border-primary/30 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] min-w-[200px]">
                          <Typography className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 border-b border-white/5 pb-2">Datapoint_Integrity: 100%</Typography>
                          <div className="space-y-3">
                            {payload.map((p: any, i: number) => (
                              <div key={i} className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{p.name}</span>
                                </div>
                                <span className="text-sm font-black text-white">{p.value} kWh</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="stepAfter" 
                  dataKey="previsto" 
                  name="EXPECTED"
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorPrev)" 
                  strokeWidth={2}
                  activeDot={{ r: 4, strokeWidth: 2, fill: '#10b981', stroke: '#fff' }}
                  animationDuration={3000}
                />
                <Area 
                  type="monotone" 
                  dataKey="realizado" 
                  name="ACTUAL"
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorReal)" 
                  strokeWidth={3}
                  activeDot={{ r: 4, strokeWidth: 2, fill: '#3b82f6', stroke: '#fff' }}
                  animationDuration={3500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card h-[550px] flex flex-col p-10 relative overflow-hidden border-white/5 bg-slate-900/10 backdrop-blur-3xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[60px] rounded-full" />
          
          <div className="mb-10 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <PieChart size={16} strokeWidth={2.5} />
              </div>
              <Typography className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-400">RESOURCE_ALLOCATION_MATRIX</Typography>
            </div>
            <Typography variant="h3" className="text-3xl font-black text-white tracking-tighter">Mix de Ativos</Typography>
          </div>
          
          <div className="flex-1 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={95}
                  outerRadius={135}
                  paddingAngle={12}
                  dataKey="value"
                  stroke="none"
                  animationBegin={500}
                  animationDuration={2500}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      className="transition-all duration-700 hover:opacity-80 cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-950/90 backdrop-blur-2xl border border-white/10 p-4 rounded-xl shadow-2xl">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{payload[0].name}</span>
                            <span className="text-xs font-black text-white ml-4">{payload[0].value}%</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="flex items-center gap-1 mb-1">
                <Leaf size={12} className="text-primary animate-pulse" />
                <Typography className="text-[9px] uppercase tracking-[0.5em] text-slate-500 font-black">GREEN_LOAD</Typography>
              </div>
              <Typography className="text-5xl font-black leading-none tracking-tighter text-white drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">100<span className="text-primary text-2xl">%</span></Typography>
              <div className="mt-2 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-3 h-[2px] bg-primary/40 rounded-full" />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-8 pt-8 border-t border-white/5 relative z-10">
            {pieData.map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
                className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5 transition-all cursor-default"
              >
                <div className="w-3 h-3 rounded-full shadow-[0_0_12px_currentColor]" style={{ backgroundColor: item.color, color: item.color }} />
                <div className="flex-1">
                  <Typography className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1.5">{item.name}</Typography>
                  <Typography className="text-sm font-black text-white tabular-nums">{item.value}%</Typography>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Operation Control Centers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants} className="glass-card p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.03] blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex justify-between items-center mb-10 relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-2xl animate-pulse" />
                <div className="relative w-14 h-14 rounded-2xl bg-slate-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ClipboardCheck size={28} strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <Typography className="text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.4em] leading-none mb-2">DEPLOYMENT_QUEUE</Typography>
                <Typography variant="h3" className="text-2xl font-black text-white tracking-tighter">Projetos Ativos</Typography>
              </div>
            </div>
            <button 
              onClick={() => navigate('/dashboard/contratos')}
              className="group/btn relative px-6 py-3 bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-emerald-500/50"
            >
              <div className="absolute inset-0 bg-emerald-500/0 group-hover/btn:bg-emerald-500/5 transition-colors" />
              <Typography className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover/btn:text-emerald-400">ACCESS_EXPLORER</Typography>
            </button>
          </div>
          
          <div className="space-y-4 relative z-10">
            {recentProjects.slice(0, 3).map((project, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ x: 12, backgroundColor: 'rgba(255,255,255,0.03)' }}
                onClick={() => navigate(`/dashboard/contratos`)}
                className="flex items-center justify-between p-6 rounded-[2rem] border border-white/5 bg-slate-950/40 backdrop-blur-md transition-all cursor-pointer group/item"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-emerald-500/40 group-hover/item:text-emerald-400 group-hover/item:border-emerald-500/30 transition-all duration-500">
                    <div className="relative">
                      <Leaf size={28} />
                      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-0 group-hover/item:opacity-100" />
                    </div>
                  </div>
                  <div>
                    <Typography className="text-base font-black text-white tracking-tight mb-1 group-hover/item:text-emerald-400 transition-colors">{project.name}</Typography>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-emerald-500/30" />
                      <Typography className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{project.location}</Typography>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={cn(
                    "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border transition-all duration-500",
                    project.status === 'active' 
                      ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                      : "text-amber-400 border-amber-400/20 bg-amber-400/5"
                  )}>
                    {project.status === 'active' ? '● OPERATIONAL' : '○ SYNCING'}
                  </div>
                  <Typography className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">ID: {Math.random().toString(36).substring(7).toUpperCase()}</Typography>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/[0.03] blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="absolute top-8 right-8 z-20">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,1)] animate-ping" />
              <Typography className="text-[9px] font-black uppercase tracking-[0.3em] text-rose-400">THREAT_SCAN_ACTIVE</Typography>
            </div>
          </div>
          
          <div className="flex items-center gap-5 mb-10 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-2xl animate-pulse" />
              <div className="relative w-14 h-14 rounded-2xl bg-slate-950 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <ShieldAlert size={28} strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <Typography className="text-[10px] font-black text-rose-500/50 uppercase tracking-[0.4em] leading-none mb-2">NEURAL_FIREWALL</Typography>
              <Typography variant="h3" className="text-2xl font-black text-white tracking-tighter italic">Detecção de Ameaças</Typography>
            </div>
          </div>
          
          <div className="space-y-4 relative z-10">
            {operationalAlerts.length === 0 ? (
              <div className="h-[288px] flex flex-col items-center justify-center gap-6 text-slate-500 bg-slate-950/40 rounded-[2.5rem] border border-dashed border-white/5 relative overflow-hidden group/empty">
                <div className="absolute inset-0 bg-emerald-500/[0.02] opacity-0 group-hover/empty:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
                  <ShieldCheck size={48} className="relative text-emerald-500/30 group-hover/empty:text-emerald-400/50 transition-colors duration-700" />
                </div>
                <div className="text-center">
                  <Typography className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500/40 mb-1">ALL_SYSTEMS_OPTIMAL</Typography>
                  <Typography className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">NO_ACTIVE_THREATS_DETECTED</Typography>
                </div>
              </div>
            ) : (
              operationalAlerts.map((alert: any) => (
                <motion.div 
                  key={alert.id} 
                  whileHover={{ scale: 1.02, x: 5 }}
                  onClick={() => alert.link && navigate(alert.link)}
                  className={cn(
                    "p-6 rounded-[2rem] border flex gap-6 transition-all relative overflow-hidden group/alert",
                    alert.severity === 'high' 
                      ? "bg-rose-500/5 border-rose-500/10 hover:border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.05)]" 
                      : "bg-amber-500/5 border-amber-500/10 hover:border-amber-500/30",
                    alert.link && "cursor-pointer"
                  )}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500",
                    alert.severity === 'high' 
                      ? "text-rose-400 bg-rose-400/10 border border-rose-400/20 group-hover/alert:bg-rose-400/20" 
                      : "text-amber-400 bg-amber-400/10 border border-amber-400/20"
                  )}>
                    {alert.severity === 'high' ? <AlertTriangle size={28} /> : <Clock size={28} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Typography className={cn(
                        "text-[10px] font-black uppercase tracking-[0.3em] italic",
                        alert.severity === 'high' ? "text-rose-400" : "text-amber-400"
                      )}>
                        {alert.severity === 'high' ? 'CRITICAL_PROTOCOL' : 'MAINTENANCE_LOG'}
                      </Typography>
                      <div className="flex-1 h-[1px] bg-white/5" />
                    </div>
                    <Typography className="text-base font-black text-white tracking-tight mb-1 group-hover/alert:text-rose-400 transition-colors">
                      {alert.title}
                    </Typography>
                    <Typography className="text-xs font-medium text-slate-400 leading-relaxed line-clamp-2">
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
      <motion.div variants={itemVariants} className="glass-card p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/[0.01] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="flex justify-between items-center mb-10 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-2xl animate-pulse" />
              <div className="relative w-14 h-14 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center">
                <History className="text-blue-400" size={28} strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <Typography className="text-[10px] font-black text-blue-500/50 uppercase tracking-[0.4em] leading-none mb-2">BLOCKCHAIN_LEDGER</Typography>
              <Typography variant="h3" className="text-2xl font-black text-white tracking-tighter">Histórico de Atividades</Typography>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <Typography className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400">
                LIVE_FEED_SYNCED
              </Typography>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-500 cursor-help">
              <Info size={18} />
            </div>
          </div>
        </div>
        
        <div className="relative group/ledger">
          <div className="absolute -inset-1 bg-gradient-to-b from-white/5 to-transparent rounded-[2.5rem] opacity-0 group-hover/ledger:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="relative bg-slate-950/40 rounded-[2.5rem] p-8 border border-white/5 backdrop-blur-3xl overflow-hidden">
            {/* HUD Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/10 rounded-tl-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/10 rounded-br-3xl pointer-events-none" />
            
            <ActivityFeed limit={10} userEmail={user?.email || ""} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
