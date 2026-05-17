"use client";

import React from 'react';
import { SmartKPI } from '@/shared/ui/SmartKPI';
import { useDashboardData } from '../api/useDashboardData';
import { BarChart3, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';

const EnergyChart = dynamic(() => import('./EnergyChart').then(mod => mod.EnergyChart), { 
  ssr: false, 
  loading: () => <div className="w-full h-full bg-white/5 animate-pulse rounded-xl" /> 
});

const AICenter = dynamic(() => import('@/widgets/ai-center/ui/AICenter').then(mod => mod.AICenter), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-white/5 animate-pulse rounded-xl" />
});

export const Dashboard: React.FC = () => {
  const { stats, chartData, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-48 bg-white/5 rounded-2xl" />
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map(i => <div key={i} className="glass-card h-32" />)}
        </div>
        <div className="glass-card h-[400px] bg-white/5" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-luxury">
      <header className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            Visão Geral
          </h2>
          <p className="text-text-muted text-[10px] font-black tracking-[0.3em] uppercase flex items-center gap-2">
            <Clock className="w-3 h-3 text-primary" />
            Sincronizado em tempo real
          </p>
        </div>
        
        <div className="flex gap-4">
          <button className="nav-link-premium border border-white/10 hover:bg-white/5 px-4 py-2 rounded-xl">
            <BarChart3 className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Relatórios</span>
          </button>
        </div>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SmartKPI 
          title="Consumo Total"
          value={stats?.totalEnergy?.toLocaleString() || '0'}
          unit="kWh"
          trend={{ value: 4.2, direction: 'down', label: 'vs último mês' }}
          aiInsight="O consumo apresentou uma redução atípica fora do horário comercial. Possível ganho de eficiência nas operações de standby."
          color="primary"
        />
        <SmartKPI 
          title="Economia Estimada"
          value={`R$ ${stats?.totalSavings?.toLocaleString() || '0'}`}
          trend={{ value: 12.5, direction: 'up', label: 'vs último mês' }}
          aiInsight="Projeção aponta superávit devido ao uso otimizado de tarifas no mercado livre de energia."
          color="secondary"
        />
        <SmartKPI 
          title="Impacto Ambiental"
          value={stats?.totalCO2?.toLocaleString() || '0'}
          unit="kg CO2"
          trend={{ value: 8.1, direction: 'up', label: 'compensados' }}
          aiInsight="Sua compensação este mês equivale ao plantio de 43 árvores. Padrão excelente."
          color="neutral"
        />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass-card p-8 bg-black/20 border border-white/5 rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/60">
              Desempenho Energético
            </h3>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-[10px] font-bold text-text-muted uppercase">Previsto</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-[10px] font-bold text-text-muted uppercase">Realizado</span>
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <EnergyChart data={chartData || []} />
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col">
          <AICenter />
        </div>
      </div>
    </div>
  );
};
