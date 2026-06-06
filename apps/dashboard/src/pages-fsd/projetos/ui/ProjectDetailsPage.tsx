"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useAction } from '@/shared/lib/convex';
import { api } from '@convex/_generated/api';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Zap, 
  TrendingUp, 
  Leaf, 
  CloudSun, 
  RefreshCw
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface ProjectDetailsPageProps {
  projectId: string;
}

export const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({ projectId }) => {
  const router = useRouter();
  
  const project = useQuery(api.projects.getById, { projectId: projectId as any }) as any;
  const getSolarData = useAction(api.external.weather.getSolarData) as any;

  const [simulation, setSimulation] = useState<any>(null);
  const [loadingSim, setLoadingSim] = useState(false);

  // Mock chart data if not enough real metrics
  const chartData = [
    { name: 'Seg', cons: 400, econ: 240 },
    { name: 'Ter', cons: 300, econ: 139 },
    { name: 'Qua', cons: 200, econ: 980 },
    { name: 'Qui', cons: 278, econ: 390 },
    { name: 'Sex', cons: 189, econ: 480 },
    { name: 'Sáb', cons: 239, econ: 380 },
    { name: 'Dom', cons: 349, econ: 430 },
  ];

  const handleSimulate = async () => {
    setLoadingSim(true);
    try {
      // Fetch external data (Open-Meteo)
      const weather = await getSolarData({ latitude: -23.55, longitude: -46.63 }); // SP Coordinates
      
      // Calculate simulation (Simplified client-side for immediate feedback)
      const capacity = 50; // 50kW
      const rad = weather.averageRadiation;
      const gen = capacity * (rad / 1000) * 0.15 * 5 * 30; // Monthly Gen
      
      setSimulation({
        weather,
        generation: gen.toFixed(2),
        savings: (gen * 0.95).toFixed(2), // R$ 0.95 per kWh
        co2: (gen * 0.088).toFixed(2),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSim(false);
    }
  };

  if (!project) return <div className="flex items-center justify-center h-64 text-white">Carregando projeto...</div>;

  return (
    <div className="space-y-8 pb-12 animate-luxury">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/projetos')} className="p-2 hover:bg-white/10 rounded-full text-text-muted transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">{project.name}</h1>
          <p className="text-text-muted text-[10px] font-bold tracking-[0.2em] uppercase">{project.location} • {project.category}</p>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
              <Zap size={24} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">Geração Total</p>
            <h2 className="text-4xl font-bold text-white tracking-tighter mt-2">{project.latestMetrics?.energyConsumption.toFixed(1) || '0'} <span className="text-sm font-normal text-text-muted uppercase tracking-widest">kWh</span></h2>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">Economia Acumulada</p>
            <h2 className="text-4xl font-bold text-white tracking-tighter mt-2">R$ {project.latestMetrics?.savings.toFixed(2) || '0,00'}</h2>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
              <Leaf size={24} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">CO₂ Evitado</p>
            <h2 className="text-4xl font-bold text-white tracking-tighter mt-2">{project.latestMetrics?.environmentalImpact.toFixed(1) || '0'} <span className="text-sm font-normal text-text-muted uppercase tracking-widest">kg</span></h2>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Charts Section */}
        <div className="glass-card h-[400px]">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/60 mb-6">Desempenho Semanal</h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEcon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={10} fontWeight={700} axisLine={false} tickLine={false} dy={10} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} fontWeight={700} axisLine={false} tickLine={false} />
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
              <Area type="monotone" dataKey="cons" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorCons)" animationDuration={2000} />
              <Area type="monotone" dataKey="econ" stroke="var(--color-secondary)" strokeWidth={3} fillOpacity={1} fill="url(#colorEcon)" animationDuration={2000} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Simulation Section */}
        <div className="glass-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/60">Simulador de Cenário (Real-time)</h3>
            <button 
              onClick={handleSimulate} 
              disabled={loadingSim}
              className="p-2 border border-white/10 hover:bg-white/5 rounded-xl text-primary transition-all disabled:opacity-50"
            >
              {loadingSim ? <RefreshCw className="animate-spin" size={20} /> : <CloudSun size={20} />}
            </button>
          </div>

          {!simulation ? (
            <div className="flex flex-col items-center justify-center h-[280px] text-text-muted space-y-4">
              <CloudSun size={48} className="opacity-20 text-white" />
              <p className="text-xs uppercase tracking-widest text-center max-w-[200px]">Clique no ícone de clima para buscar dados reais e simular projeções.</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] mb-1">DADOS EXTERNOS ({simulation.weather.source})</p>
                <p className="text-sm text-white">Radiação Solar Média: <span className="font-bold text-secondary">{simulation.weather.averageRadiation.toFixed(1)} W/m²</span></p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Geração Mensal Est.</p>
                  <p className="text-xl font-bold text-white tracking-tight">{simulation.generation} <span className="text-[10px] uppercase font-normal text-text-muted">kWh</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Economia Mensal Est.</p>
                  <p className="text-xl font-bold text-secondary tracking-tight">R$ {simulation.savings}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Impacto Ambiental</p>
                  <p className="text-xl font-bold text-white tracking-tight">{simulation.co2} <span className="text-[10px] uppercase font-normal text-text-muted">kg CO2/mês</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Status do Cenário</p>
                  <span className="inline-block px-3 py-1 bg-secondary/20 text-secondary text-[10px] font-black uppercase tracking-widest rounded-full border border-secondary/30 mt-1">
                    Altamente Viável
                  </span>
                </div>
              </div>

              <button className="w-full py-3 bg-primary hover:bg-primary/90 text-background font-black uppercase tracking-[0.2em] text-xs rounded-xl transition-all">
                Aplicar Projeção ao Projeto
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
