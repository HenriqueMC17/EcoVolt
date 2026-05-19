"use client";

import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

interface ChartDataPoint {
  name: string;
  previsto: number;
  realizado: number;
}

interface EnergyChartProps {
  data: ChartDataPoint[];
}

interface TooltipItem {
  name: string;
  value: number;
  color: string;
  stroke?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipItem[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#161616]/95 border border-white/10 backdrop-blur-md p-4 rounded-2xl shadow-2xl flex flex-col gap-2.5 force-gpu min-w-[160px]">
        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none border-b border-white/5 pb-2">
          {label}
        </p>
        <div className="flex flex-col gap-1.5">
          {payload.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.1)]" 
                  style={{ 
                    backgroundColor: item.stroke || item.color,
                    boxShadow: `0 0 10px ${item.stroke || item.color}40`
                  }} 
                />
                <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">
                  {item.name === 'realizado' ? 'Realizado' : 'Previsto'}
                </span>
              </div>
              <span className="text-xs font-black text-white tabular-data">
                {item.value?.toLocaleString()}&nbsp;kWh
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const EnergyChart: React.FC<EnergyChartProps> = ({ data }) => {
  return (
    <div className="w-full h-full min-h-[300px] force-gpu">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrevisto" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.25}/>
              <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorRealizado" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.25}/>
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 900, letterSpacing: '0.1em' }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 900 }}
            dx={-10}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }}
          />
          <Area 
            type="monotone" 
            dataKey="previsto" 
            name="previsto"
            stroke="var(--color-secondary)" 
            strokeWidth={2.5}
            fillOpacity={1} 
            fill="url(#colorPrevisto)" 
            activeDot={{ r: 4, strokeWidth: 1, stroke: '#fff', fill: 'var(--color-secondary)' }}
            animationDuration={1500}
          />
          <Area 
            type="monotone" 
            dataKey="realizado" 
            name="realizado"
            stroke="var(--color-primary)" 
            strokeWidth={2.5}
            fillOpacity={1} 
            fill="url(#colorRealizado)" 
            activeDot={{ r: 4, strokeWidth: 1, stroke: '#fff', fill: 'var(--color-primary)' }}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
