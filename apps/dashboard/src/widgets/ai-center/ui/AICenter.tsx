import React, { useState, useEffect } from 'react';
import { cn } from '@/shared/lib/utils';
import { Brain, Sparkles, AlertTriangle, ArrowRight, Zap, RefreshCw } from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'optimization' | 'anomaly' | 'prediction' | 'streaming';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  time: string;
}

const mockInsights: AIInsight[] = [
  {
    id: '1',
    type: 'anomaly',
    title: 'Pico Inesperado Detectado',
    description: 'Equipamentos no Setor B apresentaram um desvio padrão de +15% no consumo entre as 02:00 e 04:00 da manhã.',
    impact: 'high',
    time: 'há 10 min'
  },
  {
    id: '2',
    type: 'optimization',
    title: 'Janela de Tarifa Otimizada',
    description: 'Antecipar a refrigeração industrial para as 17:00 pode gerar uma redução estimada de 8% nos custos diários.',
    impact: 'medium',
    time: 'há 32 min'
  },
  {
    id: '3',
    type: 'prediction',
    title: 'Tendência Climática',
    description: 'A previsão de alta nebulosidade amanhã reduzirá a geração solar em ~22%. Considere despachar geradores de backup.',
    impact: 'high',
    time: 'há 1 hora'
  }
];

const STREAMING_TEXT = 'Algoritmo de eficiência identificou que reprogramar a refrigeração do Setor C para as 05:30 evita a tarifa de ponta. Economia estimada de R$ 1.840/mês.';

export const AICenter: React.FC = () => {
  const [streamText, setStreamText] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);

  // Real SSE streaming effect using EventSource
  useEffect(() => {
    if (!isStreaming) return;

    setStreamText('');
    const eventSource = new EventSource('/api/ai/insights');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.text) {
          setStreamText((prev) => prev + data.text);
        }
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = () => {
      setIsStreaming(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [isStreaming, refreshCount]);

  const handleRefresh = () => {
    if (!isStreaming) {
      setStreamText('');
      setIsStreaming(true);
      setRefreshCount(prev => prev + 1);
    }
  };

  return (
    <div className="glass-card force-gpu p-8 border border-white/5 bg-linear-to-br from-white/1 to-transparent relative overflow-hidden flex flex-col justify-between min-h-[498px] rounded-3xl">
      {/* Background Neon Blur FX */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="flex flex-col gap-6 relative z-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center shadow-[0_0_15px_rgba(96,165,250,0.1)]">
              <Brain className="w-5 h-5 text-secondary animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-widest text-white uppercase italic flex items-center gap-2">
                AI Center <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
              </h3>
              <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">
                Inteligência Contínua
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Interactive refresh button with premium micro-interaction */}
            <button 
              onClick={handleRefresh}
              disabled={isStreaming}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 text-white/40 hover:text-white transition-all active:scale-95",
                isStreaming ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
              )}
              title="Recarregar análise em tempo real"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isStreaming && "animate-spin")} />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
              <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">SSE Live</span>
            </div>
          </div>
        </header>

        {/* Dynamic Insights Stack */}
        <div className="flex flex-col gap-4">
          {/* 1. Real-time Streaming AI Insight Card */}
          <div className="group force-gpu p-6 rounded-2xl bg-secondary/2 border border-secondary/10 hover:border-secondary/30 hover:bg-secondary/4 transition-all duration-300 relative overflow-hidden flex gap-4">
            {/* Glow accent for streaming card */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-secondary" />
            <div className="mt-0.5 shrink-0">
              <Brain className="w-4 h-4 text-secondary" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-black text-white tracking-wider uppercase mb-1.5 flex items-center justify-between">
                <span>Análise de Telemetria Dinâmica</span>
                <span className="text-[8px] bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded-sm font-black uppercase tracking-wider animate-pulse">
                  Streaming
                </span>
              </h4>
              
              {/* Dynamic word printing with custom cursor indicator */}
              <p className={cn(
                "text-xs text-white/80 leading-relaxed font-medium mb-3 min-h-[72px]",
                isStreaming && "sse-cursor"
              )}>
                {streamText}
              </p>
              
              <div className="flex items-center gap-3">
                <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                  Impacto Alto
                </span>
                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest tabular-data">
                  {isStreaming ? 'Calculando...' : 'Atualizado agora'}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Static loaded insight list */}
          {mockInsights.map((insight) => (
            <div 
              key={insight.id} 
              className="group force-gpu p-6 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 hover:bg-white/4 transition-all duration-500 cursor-pointer flex gap-4"
            >
              <div className="mt-0.5 shrink-0">
                {insight.type === 'anomaly' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                {insight.type === 'optimization' && <Zap className="w-4 h-4 text-primary" />}
                {insight.type === 'prediction' && <Sparkles className="w-4 h-4 text-secondary" />}
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-black text-white tracking-wider uppercase mb-1.5 flex items-center justify-between">
                  {insight.title}
                  <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                </h4>
                <p className="text-xs text-white/60 leading-relaxed font-medium mb-3">
                  {insight.description}
                </p>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm border",
                    insight.impact === 'high' ? "bg-rose-500/10 text-rose-300 border-rose-500/10" :
                    insight.impact === 'medium' ? "bg-amber-500/10 text-amber-300 border-amber-500/10" :
                    "bg-emerald-500/10 text-emerald-300 border-emerald-500/10"
                  )}>
                    Impacto {insight.impact === 'high' ? 'Alto' : insight.impact === 'medium' ? 'Médio' : 'Baixo'}
                  </span>
                  <span className="text-[8px] font-black text-white/30 uppercase tracking-widest tabular-data">
                    {insight.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
