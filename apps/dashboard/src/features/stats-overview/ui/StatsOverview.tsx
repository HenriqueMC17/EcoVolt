"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@/shared/ui/typography';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Activity, Shield, TrendingDown, Leaf, Target } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const chartData = [
  { name: '00:00', load: 400, flux: 450 },
  { name: '04:00', load: 300, flux: 380 },
  { name: '08:00', load: 600, flux: 650 },
  { name: '12:00', load: 800, flux: 820 },
  { name: '16:00', load: 500, flux: 550 },
  { name: '20:00', load: 700, flux: 750 },
  { name: '23:59', load: 450, flux: 480 },
];

const StatRow = ({ label, value, icon: Icon, color, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className="flex items-center justify-between p-6 rounded-[2rem] glass-thick border-white/5 hover:border-white/10 transition-all group overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="flex items-center gap-5 relative z-10">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-950/80 border border-white/5 shadow-2xl transition-transform group-hover:scale-110", color)}>
        <Icon size={24} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">{label}</span>
    </div>
    <span className={cn("text-2xl font-black tracking-tighter relative z-10 italic", color)}>{value}</span>
  </motion.div>
);

export const StatsOverview: React.FC = () => {
  return (
    <section className="py-32 bg-slate-950 relative overflow-hidden">
      {/* Decorative Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 blur-[200px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Target size={16} className="text-primary" />
                <Typography className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Strategic Advantage</Typography>
              </div>
              <Typography variant="h2" className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-[0.9] mb-8">
                Intelligence in <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Every Flow</span>
              </Typography>
              <Typography className="text-lg font-medium text-slate-400 tracking-tight leading-relaxed">
                Nossos modelos neurais analisam a assinatura energética da sua infraestrutura para identificar padrões de desperdício e prever demandas futuras com <span className="text-white font-black">99.2% de precisão</span>.
              </Typography>
            </motion.div>
            
            <div className="space-y-4">
              <StatRow 
                label="Waste Reduction" 
                value="24.8%" 
                icon={TrendingDown} 
                color="text-emerald-400" 
                delay={0.1}
              />
              <StatRow 
                label="Protocol Savings" 
                value="$1.4M+" 
                icon={Shield} 
                color="text-blue-400" 
                delay={0.2}
              />
              <StatRow 
                label="Carbon Offset" 
                value="18k Tons" 
                icon={Leaf} 
                color="text-purple-400" 
                delay={0.3}
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-[550px] glass-thick overflow-hidden p-12 rounded-[3rem] border-white/5 relative group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-30" />
            
            <div className="flex justify-between items-start mb-12">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={16} className="text-primary" />
                  <Typography className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Neural Load Diagnostic</Typography>
                </div>
                <Typography variant="h4" className="text-2xl font-black text-white tracking-tight italic">Predictive Flux Analysis</Typography>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)] animate-pulse" />
                <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">Live Sync</span>
              </div>
            </div>
            
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFlux" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="10 10" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(255,255,255,0.1)" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontWeight: 800 }}
                    dy={15}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(2, 6, 23, 0.95)', 
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '24px',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                      padding: '16px'
                    }} 
                    itemStyle={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}
                  />
                  <Area 
                    type="stepAfter" 
                    dataKey="load" 
                    stroke="#10b981" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorLoad)" 
                    animationDuration={3000}
                  />
                  <Area 
                    type="stepAfter" 
                    dataKey="flux" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fillOpacity={1} 
                    fill="url(#colorFlux)" 
                    animationDuration={4000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Max Load</span>
                  <span className="text-sm font-black text-white italic">842.1 kWh</span>
                </div>
                <div className="flex flex-col border-l border-white/5 pl-8">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Grid Variance</span>
                  <span className="text-sm font-black text-emerald-400 italic">-12.4%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center animate-spin-slow">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

