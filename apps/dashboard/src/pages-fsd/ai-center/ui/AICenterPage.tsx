"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Brain, 
  ArrowLeft,
  Sparkles,
  Cpu,
  Gauge,
  TrendingDown,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Typography } from '@/shared/ui/Typography';
import { AICenter } from '@/widgets/ai-center/ui/AICenter';

export const AICenterPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="space-y-10 pb-20 animate-luxury">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-text-muted cursor-pointer"
            title="Voltar"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20 text-secondary">
            <Brain size={18} className="animate-pulse" />
          </div>
          <Typography className="text-[10px] font-black tracking-[0.3em] text-secondary uppercase">
            Plataforma de Inteligência Preditiva
          </Typography>
        </div>
        <Typography variant="h1" className="text-4xl font-black tracking-tighter text-white uppercase italic">
          AI Center <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary to-primary font-black uppercase italic">Ecopilot</span>
        </Typography>
        <Typography className="text-text-muted max-w-2xl text-sm font-medium">
          O Ecopilot processa telemetria contínua, climatologia local e tarifas do mercado livre de energia para entregar insights otimizados em tempo real.
        </Typography>
      </header>

      {/* Grid of AI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main interactive AI center widgets */}
        <div className="lg:col-span-2 space-y-6">
          <AICenter />
        </div>

        {/* AI Engine Status & Control Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card force-gpu p-8 border border-white/5 bg-linear-to-br from-white/1 to-transparent rounded-3xl relative overflow-hidden flex flex-col justify-between h-full min-h-[498px]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <Typography className="text-xs font-black uppercase tracking-wider text-white">Status do Motor IA</Typography>
                  <Typography className="text-[9px] font-black text-white/30 uppercase tracking-widest">Model Telemetry</Typography>
                </div>
              </div>

              <div className="space-y-4">
                {/* Engine KPI 1 */}
                <div className="p-4 rounded-2xl bg-white/2 border border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Gauge className="w-4 h-4 text-secondary" />
                    <div>
                      <Typography className="text-[10px] font-bold text-white/60">Latência do Modelo</Typography>
                      <Typography className="text-[9px] font-black text-white/30 uppercase">Latency Rate</Typography>
                    </div>
                  </div>
                  <Typography className="text-xs font-black text-secondary tracking-wider">120ms</Typography>
                </div>

                {/* Engine KPI 2 */}
                <div className="p-4 rounded-2xl bg-white/2 border border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="w-4 h-4 text-primary" />
                    <div>
                      <Typography className="text-[10px] font-bold text-white/60">Custo Total de Operações</Typography>
                      <Typography className="text-[9px] font-black text-white/30 uppercase">Savings Efficiency</Typography>
                    </div>
                  </div>
                  <Typography className="text-xs font-black text-primary tracking-wider">-14.2%</Typography>
                </div>

                {/* Engine KPI 3 */}
                <div className="p-4 rounded-2xl bg-white/2 border border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <div>
                      <Typography className="text-[10px] font-bold text-white/60">Acurácia Preditiva</Typography>
                      <Typography className="text-[9px] font-black text-white/30 uppercase">Confidence Level</Typography>
                    </div>
                  </div>
                  <Typography className="text-xs font-black text-emerald-400 tracking-wider">98.4%</Typography>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-center">
                <Typography className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Inteligência Autônoma Ativada
                </Typography>
                <Typography className="text-[9px] text-white/40 mt-1 leading-relaxed uppercase tracking-wider">
                  Políticas ativas estão sendo orquestradas pelo gateway EcoVolt.
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
