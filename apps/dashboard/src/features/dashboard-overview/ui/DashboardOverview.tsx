"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Activity, 
  TrendingUp, 
  Shield, 
  Globe, 
  Cpu,
  ArrowUpRight,
  Clock,
  Battery
} from 'lucide-react';
import { Typography } from '@/shared/ui/Typography';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const energyData = [
  { time: '00:00', generation: 4000, consumption: 2400 },
  { time: '04:00', generation: 3000, consumption: 1398 },
  { time: '08:00', generation: 2000, consumption: 9800 },
  { time: '12:00', generation: 2780, consumption: 3908 },
  { time: '16:00', generation: 1890, consumption: 4800 },
  { time: '20:00', generation: 2390, consumption: 3800 },
  { time: '23:59', generation: 3490, consumption: 4300 },
];

const kpis = [
  { 
    label: 'POWER_LOAD_CORE', 
    value: '2.48', 
    unit: 'MW', 
    trend: '+12.5%', 
    icon: Zap, 
    color: 'text-emerald-500', 
    glow: 'bg-emerald-500/10' 
  },
  { 
    label: 'ASSET_UPTIME', 
    value: '99.98', 
    unit: '%', 
    trend: 'STABLE', 
    icon: Activity, 
    color: 'text-blue-400', 
    glow: 'bg-blue-400/10' 
  },
  { 
    label: 'CARBON_OFFSET', 
    value: '142.4', 
    unit: 'TONS', 
    trend: '+5.2%', 
    icon: Globe, 
    color: 'text-purple-400', 
    glow: 'bg-purple-400/10' 
  },
  { 
    label: 'GRID_LATENCY', 
    value: '12', 
    unit: 'MS', 
    trend: '-2MS', 
    icon: Cpu, 
    color: 'text-amber-400', 
    glow: 'bg-amber-400/10' 
  },
];

export const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex items-end justify-between">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)] animate-pulse" />
            <Typography className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] italic">SYSTEM_STATUS: OPERATIONAL</Typography>
          </motion.div>
          <Typography className="text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
            CENTRAL_<span className="text-emerald-500">NEXUS</span>
          </Typography>
          <Typography className="text-slate-500 font-bold uppercase tracking-widest mt-6 text-[11px] italic">ENERGY_MANAGEMENT_OS v4.2.0 // COMMAND_DASHBOARD</Typography>
        </div>

        <div className="flex gap-6">
          <div className="flex flex-col items-end">
            <Typography className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">LOCAL_TIME_SYNC</Typography>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-emerald-500" />
              <Typography className="text-2xl font-black text-white italic leading-none">14:48:32</Typography>
            </div>
          </div>
          <div className="w-px h-12 bg-white/5 mx-4" />
          <div className="flex flex-col items-end">
            <Typography className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">GLOBAL_THROUGHPUT</Typography>
            <div className="flex items-center gap-3">
              <TrendingUp size={16} className="text-blue-400" />
              <Typography className="text-2xl font-black text-white italic leading-none">842.1 GB/S</Typography>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-4 gap-8">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-8 group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${kpi.glow} blur-[60px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${kpi.color}`}>
                  <kpi.icon size={24} />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                  <Typography className={`text-[9px] font-black uppercase tracking-widest ${kpi.trend.includes('+') ? 'text-emerald-500' : 'text-slate-500'}`}>
                    {kpi.trend}
                  </Typography>
                </div>
              </div>

              <Typography className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3 italic">{kpi.label}</Typography>
              <div className="flex items-baseline gap-3">
                <Typography className="text-5xl font-black text-white tracking-tighter italic">{kpi.value}</Typography>
                <Typography className="text-lg font-black text-slate-700 italic">{kpi.unit}</Typography>
              </div>
            </div>

            {/* Micro-interaction line */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-white/5 group-hover:bg-white/20 transition-colors" />
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-3 gap-8">
        {/* Main Consumption Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="col-span-2 glass-thick p-10 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-12">
            <div>
              <Typography className="text-2xl font-black text-white italic mb-2 uppercase">Real-Time Load Profile</Typography>
              <Typography className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Live energy nexus distribution matrix</Typography>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">GENERATION</Typography>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">CONSUMPTION</Typography>
              </div>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyData}>
                <defs>
                  <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#475569', fontWeight: 'bold' }}
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#475569', fontWeight: 'bold' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#020617', 
                    border: '1px solid #ffffff10', 
                    borderRadius: '16px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="generation" 
                  stroke="#10b981" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorGen)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="consumption" 
                  stroke="#3b82f6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorCons)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* System Health / Secondary Metrics */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <Typography className="text-sm font-black text-white italic uppercase">Storage Capacity</Typography>
              <Battery size={20} className="text-emerald-500" />
            </div>
            
            <div className="space-y-6">
              <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '84%' }}
                  transition={{ duration: 2, ease: "circOut" }}
                  className="absolute inset-y-0 left-0 bg-linear-to-r from-emerald-500 to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                />
              </div>
              <div className="flex justify-between items-center">
                <Typography className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">NODE_ALPHA_BATTERY</Typography>
                <Typography className="text-lg font-black text-white italic">84.2%</Typography>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-8 flex-1"
          >
            <div className="flex items-center justify-between mb-8">
              <Typography className="text-sm font-black text-white italic uppercase">Security Protocols</Typography>
              <Shield size={20} className="text-blue-400" />
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'FIREWALL_LVL_4', status: 'ACTIVE', color: 'text-emerald-500' },
                { label: 'E2E_TUNNEL_OS', status: 'STABLE', color: 'text-emerald-500' },
                { label: 'IDS_NEURAL_MAP', status: 'SYNCING', color: 'text-amber-500' },
              ].map((protocol) => (
                <div key={protocol.label} className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/5 group hover:border-white/10 transition-colors">
                  <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{protocol.label}</Typography>
                  <Typography className={`text-[9px] font-black uppercase tracking-widest ${protocol.color}`}>{protocol.status}</Typography>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="p-8 rounded-3xl bg-linear-to-br from-slate-900 to-slate-950 border border-white/5 group hover:border-emerald-500/30 transition-all duration-700 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <ArrowUpRight size={24} />
              </div>
              <div>
                <Typography className="text-[11px] font-black text-white uppercase tracking-widest leading-none mb-2">Generate Report</Typography>
                <Typography className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic leading-none">SECURE_PDF_EXPORT</Typography>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
