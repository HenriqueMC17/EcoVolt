import React from 'react';
import { cn } from '@/shared/lib/utils';
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

interface SmartKPIProps {
  title: string;
  value: string | number;
  unit?: string;
  trend: {
    value: number; // percentage
    direction: 'up' | 'down';
    label: string; // e.g., "vs último mês"
  };
  aiInsight?: string;
  color: 'primary' | 'secondary' | 'neutral';
  className?: string;
}

export const SmartKPI: React.FC<SmartKPIProps> = ({ 
  title, 
  value, 
  unit, 
  trend,
  aiInsight,
  color,
  className 
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const shadowClasses = {
    primary: 'hover:border-primary/35 hover:shadow-[0_0_80px_rgba(16,185,129,0.12)]',
    secondary: 'hover:border-secondary/35 hover:shadow-[0_0_80px_rgba(96,165,250,0.12)]',
    neutral: 'hover:border-white/20 hover:shadow-[0_0_80px_rgba(255,255,255,0.06)]'
  };

  const isPositive = trend.direction === 'up';

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "glass-card force-gpu group relative overflow-hidden transition-all duration-700",
        shadowClasses[color],
        className
      )}
    >
      {/* Glow Superior de Identificação Visual do KPI */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-[2px] transition-all duration-700",
        color === 'primary' ? 'bg-gradient-to-r from-primary/50 via-primary to-primary/50 shadow-[0_1px_10px_rgba(16,185,129,0.3)]' :
        color === 'secondary' ? 'bg-gradient-to-r from-secondary/50 via-secondary to-secondary/50 shadow-[0_1px_10px_rgba(96,165,250,0.3)]' :
        'bg-white/10'
      )} />

      {/* Background Radial Light Effect (Premium UI) */}
      <div className={cn(
        "absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2.5rem] bg-[radial-gradient(400px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.03),transparent_80%)]",
        color === 'primary' && "bg-[radial-gradient(400px_circle_at_50%_0%,rgba(16,185,129,0.08),transparent_70%)]",
        color === 'secondary' && "bg-[radial-gradient(400px_circle_at_50%_0%,rgba(96,165,250,0.08),transparent_70%)]"
      )} />

      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex justify-between items-start">
          <span className={cn(
            "text-[10px] font-black uppercase tracking-[0.25em]",
            color === 'primary' ? 'text-primary' : color === 'secondary' ? 'text-secondary' : 'text-white/40'
          )}>
            {title}
          </span>
          {aiInsight && (
            <div className="group/tooltip relative">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/5 hover:border-secondary/30 hover:bg-secondary/10 transition-colors cursor-help">
                <Sparkles className="w-3.5 h-3.5 text-secondary/70 group-hover/tooltip:text-secondary transition-colors" />
              </div>
              <div className="absolute right-0 top-10 w-64 opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/tooltip:translate-y-0 pointer-events-none bg-[#1A1A1A] border border-white/10 p-4 rounded-2xl z-50 backdrop-blur-md shadow-2xl">
                <p className="text-[10px] font-bold text-white/95 leading-relaxed">
                  <span className="text-secondary uppercase tracking-[0.2em] font-black block mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Insight
                  </span>
                  {aiInsight}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Glued values using whitespace-nowrap and tabular numbers */}
        <div className="flex items-baseline gap-1.5 whitespace-nowrap force-gpu">
          <span className="text-4.5xl font-black text-white tracking-tighter tabular-data leading-none">
            {value}
          </span>
          {unit && (
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">
              &nbsp;{unit}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 mt-1.5">
          <div className={cn(
            "flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-sm",
            isPositive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" : "bg-rose-500/10 text-rose-400 border border-rose-500/10"
          )}>
            {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
            <span className="tabular-data">{trend.value}%</span>
          </div>
          <span className="text-[9px] font-black text-white/30 uppercase tracking-wider">
            {trend.label}
          </span>
        </div>
      </div>
    </div>
  );
};
