"use client";

import React, { useState } from 'react';
import { SmartKPI } from '@/shared/ui/SmartKPI';
import { useDashboardData } from '../api/useDashboardData';
import { BarChart3, Clock, Calendar } from 'lucide-react';
import dynamic from 'next/dynamic';

const EnergyChart = dynamic(() => import('./EnergyChart').then(mod => mod.EnergyChart), { 
  ssr: false, 
  loading: () => <div className="w-full h-full min-h-[300px] bg-white/5 animate-pulse rounded-2xl" /> 
});

const AICenter = dynamic(() => import('@/widgets/ai-center/ui/AICenter').then(mod => mod.AICenter), {
  ssr: false,
  loading: () => <div className="w-full min-h-[498px] bg-white/5 animate-pulse rounded-3xl" />
});

export const Dashboard: React.FC = () => {
  const { stats, chartData, isLoading } = useDashboardData();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '12m'>('30d');

  // Mirror loading state matching exactly the final DOM structure to eliminate Layout Shift
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse force-gpu">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="flex flex-col gap-2">
            <div className="h-10 w-48 bg-white/5 rounded-xl" />
            <div className="h-4 w-64 bg-white/5 rounded-md" />
          </div>
          <div className="flex gap-2">
            <div className="h-11 w-44 bg-white/5 rounded-xl" />
            <div className="h-11 w-32 bg-white/5 rounded-xl" />
          </div>
        </header>

        {/* KPIs Row Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card h-[188px] bg-white/5 border border-white/5 p-10 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="h-4 w-28 bg-white/5 rounded-md" />
                <div className="h-8 w-8 bg-white/5 rounded-lg" />
              </div>
              <div className="h-10 w-36 bg-white/5 rounded-lg my-2" />
              <div className="h-4 w-20 bg-white/5 rounded-md" />
            </div>
          ))}
        </div>

        {/* Bento Details Area Skeleton */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 glass-card h-[498px] bg-white/5 border border-white/5 p-10 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-8">
              <div className="h-5 w-48 bg-white/5 rounded-md" />
              <div className="flex gap-4">
                <div className="h-4 w-16 bg-white/5 rounded-md" />
                <div className="h-4 w-16 bg-white/5 rounded-md" />
              </div>
            </div>
            <div className="flex-1 w-full bg-white/5 rounded-2xl" />
          </div>

          <div className="lg:col-span-1 glass-card h-[498px] bg-white/5 border border-white/5 p-10 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/5 rounded-xl" />
              <div className="flex flex-col gap-1.5">
                <div className="h-5 w-24 bg-white/5 rounded-md" />
                <div className="h-3 w-32 bg-white/5 rounded-md" />
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-4 mt-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl h-24" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-luxury force-gpu">
      {/* Dynamic Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            Visão Geral
          </h2>
          <p className="text-text-muted text-[10px] font-black tracking-[0.3em] uppercase flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-primary animate-pulse" />
            Sincronizado em tempo real
          </p>
        </div>
        
        {/* Actions bar with 44px hit-target temporal selector */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Temporal filter group with 44px interactive hit target height */}
          <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 h-11">
            {(['24h', '7d', '30d', '12m'] as const).map((range) => {
              const active = timeRange === range;
              return (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 h-9 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    active 
                      ? 'bg-secondary text-white shadow-[0_0_20px_rgba(96,165,250,0.3)]' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                  style={{ minWidth: '55px' }}
                >
                  {range}
                </button>
              );
            })}
          </div>

          <button className="h-11 flex items-center gap-3 px-5 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 hover:text-white transition-colors">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest">Relatórios</span>
          </button>
        </div>
      </header>
      
      {/* 3-Column Bento Grid Row for Smart KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SmartKPI 
          title="Consumo Total"
          value={stats?.totalEnergy?.toLocaleString() || '0'}
          unit="kWh"
          trend={{ value: 4.2, direction: 'down', label: 'vs último período' }}
          aiInsight="O consumo apresentou uma redução atípica fora do horário comercial. Possível ganho de eficiência nas operações de standby."
          color="primary"
        />
        <SmartKPI 
          title="Economia Estimada"
          value={`R$ ${stats?.totalSavings?.toLocaleString() || '0'}`}
          trend={{ value: 12.5, direction: 'up', label: 'vs último período' }}
          aiInsight="Projeção aponta superávit devido ao uso otimizado de tarifas no mercado livre de energia."
          color="secondary"
        />
        <SmartKPI 
          title="Impacto Ambiental"
          value={stats?.totalCO2?.toLocaleString() || '0'}
          unit="kg CO2"
          trend={{ value: 8.1, direction: 'up', label: 'compensados' }}
          aiInsight="Sua compensação este mês equivale ao plantio de 43 árvores. Padrão de eficiência excelente."
          color="neutral"
        />
      </div>
      
      {/* Bento Grid layout with detailed Telemetry & Real-Time AI Center */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Telemetry Panel (Bento Grid Col-Span-2) */}
        <div className="lg:col-span-2 glass-card force-gpu bg-linear-to-br from-white/2 to-transparent border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[498px]">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          
          <header className="flex justify-between items-center mb-8 relative z-10">
            <div className="flex flex-col gap-1">
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-white/50 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-secondary" />
                Desempenho Energético
              </h3>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">
                Comparativo de Consumo Realizado vs Metas Projetadas
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_10px_rgba(96,165,250,0.4)]" />
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Previsto</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Realizado</span>
              </div>
            </div>
          </header>
          
          <div className="flex-1 w-full h-[320px] relative z-10">
            <EnergyChart data={chartData || []} />
          </div>
        </div>

        {/* Real-time AI Center (Bento Grid Col-Span-1) */}
        <div className="lg:col-span-1 flex flex-col min-h-[498px]">
          <AICenter />
        </div>
      </div>
    </div>
  );
};
