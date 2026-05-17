import React from 'react';
import { cn } from '@/shared/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  progress: number;
  color: 'primary' | 'secondary' | 'neutral';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  unit, 
  progress, 
  color,
  className 
}) => {
  const colorClasses = {
    primary: 'text-primary bg-primary glow-primary',
    secondary: 'text-secondary bg-secondary glow-secondary',
    neutral: 'text-white/40 bg-white/20'
  };

  return (
    <div className={cn("glass-card group", className)}>
      <div className="flex flex-col gap-4">
        <span className={cn(
          "text-[10px] font-black uppercase tracking-[0.2em]",
          color === 'primary' ? 'text-primary' : color === 'secondary' ? 'text-secondary' : 'text-white/40'
        )}>
          {title}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white tracking-tighter">{value}</span>
          {unit && <span className="text-sm font-medium text-text-muted uppercase">{unit}</span>}
        </div>
        <div className="mt-4 w-full bg-white/5 h-1 rounded-full overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-1000 ease-premium", colorClasses[color])} 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    </div>
  );
};
