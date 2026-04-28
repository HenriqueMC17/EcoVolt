import React from 'react';
import { 
  Zap, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Typography } from '@/shared/ui/Typography';
import { StatCard } from '@/shared/ui/StatCard';

const mockData = [
  { day: '01/05', estimated: 450, actual: 420 },
  { day: '02/05', estimated: 450, actual: 480 },
  { day: '03/05', estimated: 600, actual: 610 },
  { day: '04/05', estimated: 600, actual: 750 }, // Alert here
  { day: '05/05', estimated: 300, actual: 280 },
];

export const Consumption: React.FC = () => {
  const maxVal = 800;

  return (
    <div className="space-y-10 pb-20">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Activity size={18} />
          </div>
          <Typography className="text-[10px] font-black tracking-[0.3em] text-blue-500 uppercase">
            Real-time Monitoring
          </Typography>
        </div>
        <Typography variant="h1" className="text-4xl font-black tracking-tighter text-white uppercase">
          Previsto x <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Realizado</span>
        </Typography>
        <Typography className="text-slate-400 max-w-2xl">
          Acompanhe a curva de carga das suas operações e identifique anomalias de consumo instantaneamente.
        </Typography>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Consumo Atual"
          value="42.5 kW"
          icon={Activity}
          color="from-blue-500 to-indigo-600"
        />
        <StatCard 
          title="Desvio Médio"
          value="+4.2%"
          trend="Estável"
          icon={TrendingUp}
          color="from-amber-500 to-orange-600"
        />
        <StatCard 
          title="Eficiência"
          value="92%"
          icon={Zap}
          color="from-emerald-500 to-teal-600"
        />
      </div>

      {/* Consumption Chart Visualization */}
      <div className="glass-card p-10 border-slate-800/50">
        <div className="flex items-center justify-between mb-12">
          <div>
            <Typography variant="h3" className="text-xl font-bold text-white tracking-tight">Curva de Carga</Typography>
            <Typography className="text-slate-500 text-xs">Comparativo diário em kWh</Typography>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-slate-700" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Estimado</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Realizado</span>
             </div>
          </div>
        </div>

        <div className="h-64 flex items-end gap-10 px-4">
          {mockData.map((d, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-4 group">
              <div className="w-full flex justify-center gap-2 items-end h-full">
                {/* Estimated Bar */}
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.estimated / maxVal) * 100}%` }}
                  className="w-4 bg-slate-800 rounded-t-lg transition-all duration-500 group-hover:bg-slate-700"
                />
                {/* Actual Bar */}
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.actual / maxVal) * 100}%` }}
                  className={`w-4 rounded-t-lg transition-all duration-500 shadow-[0_0_20px_rgba(59,130,246,0.1)] ${
                    d.actual > d.estimated ? 'bg-rose-500' : 'bg-blue-500'
                  }`}
                />
              </div>
              <Typography className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{d.day}</Typography>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="glass-card p-8 border-slate-800/50 space-y-6">
          <div className="flex items-center gap-3 text-rose-400">
            <AlertTriangle size={20} />
            <Typography className="font-bold text-white">Alertas de Anomalia</Typography>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex items-center justify-between">
              <div className="space-y-1">
                <Typography className="text-white font-bold text-sm">Pico Excedido - 04/05</Typography>
                <Typography className="text-slate-500 text-xs">O consumo realizado excedeu o estimado em 25%.</Typography>
              </div>
              <ChevronRight size={16} className="text-slate-600" />
            </div>
          </div>
        </div>

        <div className="glass-card p-8 border-slate-800/50 space-y-6">
          <Typography className="font-bold text-white">Eventos Monitorados</Typography>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                  <Calendar size={18} />
                </div>
                <div>
                  <Typography className="text-white font-bold text-sm">Festival de Verão 2026</Typography>
                  <Typography className="text-slate-500 text-xs font-black tracking-widest uppercase">Live Now</Typography>
                </div>
              </div>
              <div className="text-right">
                <Typography className="text-white font-bold text-sm">92%</Typography>
                <Typography className="text-slate-500 text-[10px] font-black tracking-widest uppercase">Health</Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
