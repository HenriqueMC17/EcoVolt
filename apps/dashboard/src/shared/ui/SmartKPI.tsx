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
  const colorClasses = {
    primary: 'text-primary glow-primary',
    secondary: 'text-secondary glow-secondary',
    neutral: 'text-white/80'
  };

  const bgClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    neutral: 'bg-white/20'
  };

  const isPositive = trend.direction === 'up';

  return (
    <div className={cn("glass-card group relative overflow-hidden", className)}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <span className={cn(
            "text-[10px] font-black uppercase tracking-[0.2em]",
            color === 'primary' ? 'text-primary' : color === 'secondary' ? 'text-secondary' : 'text-white/40'
          )}>
            {title}
          </span>
          {aiInsight && (
            <div className="group/tooltip relative">
              <Sparkles className="w-4 h-4 text-secondary/70 hover:text-secondary transition-colors cursor-help" />
              <div className="absolute right-0 top-6 w-48 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none bg-black/90 border border-white/10 p-3 rounded-xl z-10 backdrop-blur-md">
                <p className="text-[10px] font-bold text-white/80 leading-relaxed">
                  <span className="text-secondary uppercase tracking-widest block mb-1">AI Insight</span>
                  {aiInsight}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white tracking-tighter">{value}</span>
          {unit && <span className="text-sm font-medium text-text-muted uppercase">{unit}</span>}
        </div>

        <div className="flex items-center gap-3 mt-2">
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full",
            isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
          )}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{trend.value}%</span>
          </div>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            {trend.label}
          </span>
        </div>
      </div>
    </div>
  );
};
