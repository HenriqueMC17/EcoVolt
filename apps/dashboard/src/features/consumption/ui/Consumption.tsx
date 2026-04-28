import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { 
  Zap, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Typography } from '@/shared/ui/Typography';
import { StatCard } from '@/shared/ui/StatCard';
import { useUser } from '@/context/UserContext';

export const Consumption: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const eventId = searchParams.get('eventId');
  const { user } = useUser();

  const consumptionData = useQuery(
    api.consumptions.getConsumptionByEventId,
    eventId && user?.email ? { eventId: eventId as Id<"events">, userEmail: user.email } : 'skip'
  );

  const alerts = useQuery(
    api.alerts.getAlertsByEventId,
    eventId && user?.email ? { eventId: eventId as Id<"events">, userEmail: user.email } : 'skip'
  );

  if (consumptionData === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = consumptionData ? {
    totalActual: consumptionData.reduce((acc, c) => acc + (c.actualKwh || 0), 0),
    totalPredicted: consumptionData.reduce((acc, c) => acc + c.predictedKwh, 0),
    avgDeviation: consumptionData.length > 0 
      ? (consumptionData.reduce((acc, c) => acc + Math.abs((c.actualKwh || 0) - c.predictedKwh), 0) / consumptionData.length).toFixed(1)
      : '0',
    efficiency: consumptionData.length > 0
      ? (100 - (consumptionData.reduce((acc, c) => acc + Math.abs((c.actualKwh || 0) - c.predictedKwh), 0) / consumptionData.reduce((acc, c) => acc + c.predictedKwh, 1)) * 100).toFixed(0)
      : '100'
  } : { totalActual: 0, totalPredicted: 0, avgDeviation: '0', efficiency: '100' };

  const maxVal = Math.max(...(consumptionData?.map(d => Math.max(d.predictedKwh, d.actualKwh || 0)) || [100]), 100);

  return (
    <div className="space-y-10 pb-20">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-slate-400"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Activity size={18} />
            </div>
            <Typography className="text-[10px] font-black tracking-[0.3em] text-blue-500 uppercase">
              Telemetria Operacional
            </Typography>
          </div>
          {eventId && (
             <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               ID: {eventId.slice(-6)}
             </div>
          )}
        </div>
        <Typography variant="h1" className="text-4xl font-black tracking-tighter text-white uppercase">
          Previsto x <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Realizado</span>
        </Typography>
        <Typography className="text-slate-400 max-w-2xl">
          Acompanhe a curva de carga das suas operações e identifique anomalias de consumo instantaneamente com dados sincronizados da rede.
        </Typography>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Consumo Acumulado"
          value={`${stats.totalActual.toLocaleString()} kWh`}
          icon={Activity}
          color="from-blue-500 to-indigo-600"
        />
        <StatCard 
          title="Desvio Médio"
          value={`${stats.avgDeviation} kWh`}
          trend={parseFloat(stats.avgDeviation) > 10 ? "Crítico" : "Estável"}
          icon={TrendingUp}
          color="from-amber-500 to-orange-600"
        />
        <StatCard 
          title="Índice de Eficiência"
          value={`${stats.efficiency}%`}
          icon={Zap}
          color="from-emerald-500 to-teal-600"
        />
      </div>

      {/* Consumption Chart Visualization */}
      <div className="glass-card p-10 border-slate-800/50">
        <div className="flex items-center justify-between mb-12">
          <div>
            <Typography variant="h3" className="text-xl font-bold text-white tracking-tight">Curva de Carga</Typography>
            <Typography className="text-slate-500 text-xs">Comparativo de provisão técnica em tempo real</Typography>
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
          {consumptionData && consumptionData.length > 0 ? (
            consumptionData.map((d, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="w-full flex justify-center gap-2 items-end h-full">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.predictedKwh / maxVal) * 100}%` }}
                    className="w-4 bg-slate-800 rounded-t-lg transition-all duration-500 group-hover:bg-slate-700"
                  />
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${((d.actualKwh || 0) / maxVal) * 100}%` }}
                    className={`w-4 rounded-t-lg transition-all duration-500 shadow-[0_0_20px_rgba(59,130,246,0.1)] ${
                      (d.actualKwh || 0) > d.predictedKwh ? 'bg-rose-500' : 'bg-blue-500'
                    }`}
                  />
                </div>
                <Typography className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{d.day}</Typography>
              </div>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl">
              <Typography className="text-slate-500 text-sm font-medium">Aguardando início da telemetria...</Typography>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="glass-card p-8 border-slate-800/50 space-y-6">
          <div className="flex items-center gap-3 text-rose-400">
            <AlertTriangle size={20} />
            <Typography className="font-bold text-white">Alertas de Operação</Typography>
          </div>
          <div className="space-y-4">
            {alerts && alerts.length > 0 ? (
              alerts.map((alert: any) => (
                <div key={alert.id} className={`p-4 rounded-2xl border flex items-center justify-between ${
                  alert.type === 'error' ? 'bg-rose-500/5 border-rose-500/10' : 'bg-amber-500/5 border-amber-500/10'
                }`}>
                  <div className="space-y-1">
                    <Typography className="text-white font-bold text-sm">{alert.title}</Typography>
                    <Typography className="text-slate-500 text-xs">{alert.description}</Typography>
                  </div>
                  <ChevronRight size={16} className="text-slate-600" />
                </div>
              ))
            ) : (
              <Typography className="text-slate-500 text-xs italic">Nenhum alerta crítico registrado para este evento.</Typography>
            )}
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
                  <Typography className="text-white font-bold text-sm">Monitoramento Ativo</Typography>
                  <Typography className="text-slate-500 text-xs font-black tracking-widest uppercase">
                    {consumptionData && consumptionData.length > 0 ? 'Sincronizado' : 'Stand-by'}
                  </Typography>
                </div>
              </div>
              <div className="text-right">
                <Typography className="text-white font-bold text-sm">{stats.efficiency}%</Typography>
                <Typography className="text-slate-500 text-[10px] font-black tracking-widest uppercase">Health</Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
