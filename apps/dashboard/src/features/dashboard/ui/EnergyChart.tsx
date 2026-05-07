"use client";
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface EnergyChartProps {
  data: any[];
}

export const EnergyChart: React.FC<EnergyChartProps> = ({ data }) => {
  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrevisto" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.6 0.18 250)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="oklch(0.6 0.18 250)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorRealizado" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.705 0.15 160)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="oklch(0.705 0.15 160)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
              borderRadius: '16px', 
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              color: '#fff'
            }}
            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
          />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle"
            wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}
          />
          <Area 
            type="monotone" 
            dataKey="previsto" 
            stroke="oklch(0.6 0.18 250)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorPrevisto)" 
            animationDuration={2000}
          />
          <Area 
            type="monotone" 
            dataKey="realizado" 
            stroke="oklch(0.705 0.15 160)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRealizado)" 
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

