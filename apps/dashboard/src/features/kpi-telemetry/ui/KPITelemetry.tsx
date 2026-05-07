"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Globe, Cpu } from 'lucide-react';
import { Typography } from '@/shared/ui/typography';
import { Card } from '@/shared/ui/card';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useUser } from '@/shared/context/UserContext';
import { Id } from '@convex/_generated/dataModel';

export const KPITelemetry: React.FC = () => {
  const { user } = useUser();
  const stats = useQuery(api.metrics.getGlobalStats, user ? { userId: user._id as Id<"users"> } : "skip");

  const kpis = [
    { 
      label: 'TOTAL_ENERGY_LOAD', 
      value: stats ? (stats.totalEnergy / 1000).toFixed(2) : '---', 
      unit: 'MW', 
      trend: '+12.5%', 
      icon: Zap, 
      color: 'text-emerald-500', 
      glow: 'bg-emerald-500/10' 
    },
    { 
      label: 'ACTIVE_PROJECTS', 
      value: stats ? stats.activeProjects.toString() : '---', 
      unit: 'UNITS', 
      trend: 'STABLE', 
      icon: Activity, 
      color: 'text-blue-400', 
      glow: 'bg-blue-400/10' 
    },
    { 
      label: 'CARBON_OFFSET', 
      value: stats ? stats.totalCO2.toFixed(1) : '---', 
      unit: 'TONS', 
      trend: '+5.2%', 
      icon: Globe, 
      color: 'text-purple-400', 
      glow: 'bg-purple-400/10' 
    },
    { 
      label: 'ESTIMATED_SAVINGS', 
      value: stats ? (stats.totalSavings / 1000).toFixed(1) : '---', 
      unit: 'K$', 
      trend: 'UP', 
      icon: Cpu, 
      color: 'text-amber-400', 
      glow: 'bg-amber-400/10' 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {kpis.map((kpi, idx) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="p-8 group">
            <div className={`absolute top-0 right-0 w-32 h-32 ${kpi.glow} blur-[60px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${kpi.color} group-hover:scale-110 transition-transform duration-500`}>
                  <kpi.icon size={24} />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                  <Typography variant="small" className={kpi.trend.includes('+') ? 'text-emerald-500' : 'text-slate-500'}>
                    {kpi.trend}
                  </Typography>
                </div>
              </div>

              <Typography variant="small" className="mb-3">{kpi.label}</Typography>
              <div className="flex items-baseline gap-3">
                <Typography variant="h2" className="text-5xl">{kpi.value}</Typography>
                <Typography className="text-lg font-black text-slate-700 italic">{kpi.unit}</Typography>
              </div>
            </div>

            {/* Micro-interaction line */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 group-hover:bg-emerald-500/50 transition-all duration-700 origin-left scale-x-0 group-hover:scale-x-100" />
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
