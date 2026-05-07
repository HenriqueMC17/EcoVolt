"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Typography } from '@/shared/ui/typography';
import { Card } from '@/shared/ui/card';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useUser } from '@/shared/context/UserContext';

import { Id } from '@convex/_generated/dataModel';

export const EnergyNexusChart: React.FC = () => {
  const { user } = useUser();
  const data = useQuery(api.metrics.getGlobalChartData, user ? { userId: user._id as Id<"users"> } : "skip");

  const chartData = data || [
    { time: '00:00', generation: 4000, consumption: 2400 },
    { time: '04:00', generation: 3000, consumption: 1398 },
    { time: '08:00', generation: 2000, consumption: 9800 },
    { time: '12:00', generation: 2780, consumption: 3908 },
    { time: '16:00', generation: 1890, consumption: 4800 },
    { time: '20:00', generation: 2390, consumption: 3800 },
    { time: '23:59', generation: 3490, consumption: 4300 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="glass-thick p-10 relative overflow-hidden border-emerald-500/10">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-emerald-500/20 to-transparent" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
          <div>
            <Typography variant="h3" className="mb-2">Energy_Nexus_Distribution</Typography>
            <Typography variant="small" className="text-slate-600">Live multi-layer telemetry matrix // NODE_ALPHA_STREAM</Typography>
          </div>
          
          <div className="flex gap-8 bg-white/3 p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <div>
                <Typography variant="small" className="text-white">GENERATION</Typography>
                <Typography className="text-[10px] font-mono text-slate-500">4.28 MW AVG</Typography>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              <div>
                <Typography variant="small" className="text-white">CONSUMPTION</Typography>
                <Typography className="text-[10px] font-mono text-slate-500">3.92 MW AVG</Typography>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#ffffff10" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#475569', fontWeight: '900', fontStyle: 'italic' }}
                dy={20}
              />
              <YAxis 
                stroke="#ffffff10" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#475569', fontWeight: '900', fontStyle: 'italic' }}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(2, 6, 23, 0.9)', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: '20px',
                  padding: '15px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
                }}
                itemStyle={{ 
                  fontSize: '10px', 
                  fontWeight: '900', 
                  textTransform: 'uppercase',
                  fontStyle: 'italic'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="generation" 
                stroke="#10b981" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorGen)" 
                animationDuration={2000}
              />
              <Area 
                type="monotone" 
                dataKey="consumption" 
                stroke="#3b82f6" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorCons)" 
                animationDuration={2500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
};
