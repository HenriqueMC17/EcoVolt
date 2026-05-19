"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@/shared/lib/convex';
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
export const ConsumptionPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  // Temporary mock user since context might not be fully ported yet
  const user = { email: "admin@ecovolt.com" }; // useUser() if available

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
    totalActual: consumptionData.reduce((acc: number, c: any) => acc + (c.actualKwh || 0), 0),
    totalPredicted: consumptionData.reduce((acc: number, c: any) => acc + c.predictedKwh, 0),
    avgDeviation: consumptionData.length > 0 
      ? (consumptionData.reduce((acc: number, c: any) => acc + Math.abs((c.actualKwh || 0) - c.predictedKwh), 0) / consumptionData.length).toFixed(1)
      : '0',
    efficiency: consumptionData.length > 0
      ? (100 - (consumptionData.reduce((acc: number, c: any) => acc + Math.abs((c.actualKwh || 0) - c.predictedKwh), 0) / consumptionData.reduce((acc: number, c: any) => acc + c.predictedKwh, 1)) * 100).toFixed(0)
      : '100'
  } : { totalActual: 0, totalPredicted: 0, avgDeviation: '0', efficiency: '100' };

  const maxVal = Math.max(...(consumptionData?.map(d => Math.max(d.predictedKwh, d.actualKwh || 0)) || [100]), 100);

  return (
    <div className="space-y-10 pb-20 animate-luxury">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-text-muted"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Activity size={18} />
            </div>
            <Typography className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">
              Telemetria Operacional
            </Typography>
          </div>
          {eventId && (
             <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-text-muted uppercase tracking-widest">
               ID: {eventId.slice(-6)}
             </div>
          )}
        </div>
        <Typography variant="h1" className="text-4xl font-black tracking-tighter text-white uppercase italic">
          Previsto x <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Realizado</span>
        </Typography>
        <Typography className="text-text-muted max-w-2xl text-sm font-medium">
          Acompanhe a curva de carga das suas operações e identifique anomalias de consumo instantaneamente com dados sincronizados da rede.
        </Typography>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Consumo Acumulado"
          value={stats.totalActual.toLocaleString()}
          unit="kWh"
          progress={75}
          color="primary"
        />
        <StatCard 
          title="Desvio Médio"
          value={stats.avgDeviation}
          unit="kWh"
          progress={parseFloat(stats.avgDeviation) > 10 ? 90 : 20}
          color={parseFloat(stats.avgDeviation) > 10 ? "secondary" : "primary"}
        />
        <StatCard 
          title="Índice de Eficiência"
          value={stats.efficiency}
          unit="%"
          progress={parseFloat(stats.efficiency)}
          color="secondary"
        />
      </div>

      {/* Consumption Chart Visualization */}
      <div className="glass-card p-10 border-white/5 rounded-3xl bg-black/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <Typography variant="h3" className="text-sm font-black uppercase tracking-[0.2em] text-white/60">Curva de Carga</Typography>
            <Typography className="text-text-muted text-xs uppercase tracking-widest mt-1">Comparativo de provisão técnica em tempo real</Typography>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-white/20" />
               <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Estimado</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-primary" />
               <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Realizado</span>
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
                    className="w-4 bg-white/10 rounded-t-lg transition-all duration-500 group-hover:bg-white/20"
                  />
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${((d.actualKwh || 0) / maxVal) * 100}%` }}
                    className={`w-4 rounded-t-lg transition-all duration-500 shadow-[0_0_20px_var(--color-primary)] ${
                      (d.actualKwh || 0) > d.predictedKwh ? 'bg-secondary shadow-[0_0_20px_var(--color-secondary)]' : 'bg-primary'
                    }`}
                  />
                </div>
                <Typography className="text-[10px] font-black text-text-muted uppercase tracking-widest">{d.day}</Typography>
              </div>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl">
              <Typography className="text-text-muted text-xs uppercase tracking-widest font-bold">Aguardando início da telemetria...</Typography>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="glass-card p-8 border-white/5 bg-black/20 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 text-secondary">
            <AlertTriangle size={20} />
            <Typography className="font-black text-[10px] uppercase tracking-[0.2em] text-secondary">Alertas de Operação</Typography>
          </div>
          <div className="space-y-4">
            {alerts && alerts.length > 0 ? (
              alerts.map((alert: any) => (
                <div key={alert.id} className={`p-4 rounded-2xl border flex items-center justify-between ${
                  alert.type === 'error' ? 'bg-secondary/5 border-secondary/10' : 'bg-amber-500/5 border-amber-500/10'
                }`}>
                  <div className="space-y-1">
                    <Typography className="text-white font-bold text-sm tracking-tight">{alert.title}</Typography>
                    <Typography className="text-text-muted text-xs">{alert.description}</Typography>
                  </div>
                  <ChevronRight size={16} className="text-text-muted" />
                </div>
              ))
            ) : (
              <Typography className="text-text-muted text-xs italic tracking-widest">Nenhum alerta crítico registrado para este evento.</Typography>
            )}
          </div>
        </div>

        <div className="glass-card p-8 border-white/5 bg-black/20 rounded-3xl space-y-6">
          <Typography className="font-black text-[10px] uppercase tracking-[0.2em] text-white/60">Eventos Monitorados</Typography>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Calendar size={18} />
                </div>
                <div>
                  <Typography className="text-white font-bold text-sm tracking-tight">Monitoramento Ativo</Typography>
                  <Typography className="text-text-muted text-[10px] font-black tracking-widest uppercase">
                    {consumptionData && consumptionData.length > 0 ? 'Sincronizado' : 'Stand-by'}
                  </Typography>
                </div>
              </div>
              <div className="text-right">
                <Typography className="text-white font-bold text-sm">{stats.efficiency}%</Typography>
                <Typography className="text-text-muted text-[10px] font-black tracking-widest uppercase">Health</Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
