import React from 'react';
import { cn } from '@/shared/lib/utils';
import { Brain, Sparkles, AlertTriangle, ArrowRight, Zap } from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'optimization' | 'anomaly' | 'prediction';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

const mockInsights: AIInsight[] = [
  {
    id: '1',
    type: 'anomaly',
    title: 'Pico Inesperado Detectado',
    description: 'Equipamentos no Setor B apresentaram um desvio padrão de +15% no consumo entre as 02:00 e 04:00 da manhã.',
    impact: 'high',
  },
  {
    id: '2',
    type: 'optimization',
    title: 'Janela de Tarifa Otimizada',
    description: 'Antecipar a refrigeração industrial para as 17:00 pode gerar uma redução estimada de 8% nos custos diários.',
    impact: 'medium',
  },
  {
    id: '3',
    type: 'prediction',
    title: 'Tendência Climática',
    description: 'A previsão de alta nebulosidade amanhã reduzirá a geração solar em ~22%. Considere despachar geradores de backup.',
    impact: 'high',
  }
];

export const AICenter: React.FC = () => {
  return (
    <div className="glass-card p-6 border border-secondary/20 relative overflow-hidden flex flex-col gap-6">
      {/* Background FX */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full pointer-events-none" />
      
      <header className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 border border-secondary/30 flex items-center justify-center">
            <Brain className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tighter text-white uppercase italic flex items-center gap-2">
              AI Center <Sparkles className="w-3 h-3 text-secondary animate-pulse" />
            </h3>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
              Inteligência Contínua
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-[10px] font-bold text-white/70 uppercase">Online</span>
        </div>
      </header>

      <div className="flex flex-col gap-4 relative z-10">
        {mockInsights.map((insight) => (
          <div key={insight.id} className="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-secondary/30 hover:bg-white/10 transition-colors cursor-pointer flex gap-4">
            <div className="mt-1">
              {insight.type === 'anomaly' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
              {insight.type === 'optimization' && <Zap className="w-4 h-4 text-primary" />}
              {insight.type === 'prediction' && <Sparkles className="w-4 h-4 text-secondary" />}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white mb-1 flex items-center justify-between">
                {insight.title}
                <ArrowRight className="w-3 h-3 text-white/20 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
              </h4>
              <p className="text-xs text-white/60 leading-relaxed mb-3">
                {insight.description}
              </p>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm",
                  insight.impact === 'high' ? "bg-rose-500/20 text-rose-300" :
                  insight.impact === 'medium' ? "bg-amber-500/20 text-amber-300" :
                  "bg-emerald-500/20 text-emerald-300"
                )}>
                  Impacto {insight.impact === 'high' ? 'Alto' : insight.impact === 'medium' ? 'Médio' : 'Baixo'}
                </span>
                <span className="text-[9px] font-bold text-white/30 uppercase">
                  Identificado há 10 min
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
