import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@/shared/ui/Typography';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { name: '00:00', value: 400 },
  { name: '04:00', value: 300 },
  { name: '08:00', value: 600 },
  { name: '12:00', value: 800 },
  { name: '16:00', value: 500 },
  { name: '20:00', value: 700 },
  { name: '23:59', value: 450 },
];

export const StatsOverview: React.FC = () => {
  return (
    <section className="py-24 bg-bg-main relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h2" className="mb-6">
              Intelligence in <br />
              <span className="text-primary">Every Kilowatt</span>
            </Typography>
            <Typography variant="p" className="text-text-muted mb-8">
              Our advanced ML models analyze your infrastructure's energy signature 
              to identify waste patterns and predict future demand with 99.2% accuracy.
            </Typography>
            
            <div className="space-y-4">
              {[
                { label: 'Energy Waste Reduction', value: '24%' },
                { label: 'Operational Cost Savings', value: '$1.2M+' },
                { label: 'Carbon Footprint Offset', value: '14k Tons' },
              ].map((stat, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl glass border-white/5">
                  <span className="font-medium text-text-muted">{stat.label}</span>
                  <span className="text-xl font-bold text-primary">{stat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="h-[400px] glass-card overflow-hidden p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <Typography variant="h4">Predictive Load Analysis</Typography>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Live Feed</span>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--color-primary)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
