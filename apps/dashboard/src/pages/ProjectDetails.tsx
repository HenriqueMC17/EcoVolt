import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
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

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const project = useQuery(api.projects.getById, { projectId: id as any }) as any;
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
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/projetos')} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">{project.name}</h1>
          <p className="text-gray-400">{project.location} • {project.category}</p>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card glass">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
              <Zap size={24} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 text-sm">Geração Total</p>
            <h2 className="text-3xl font-bold text-white">{project.latestMetrics?.energyConsumption.toFixed(1) || '0'} <span className="text-sm font-normal text-gray-500">kWh</span></h2>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card glass">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 text-sm">Economia Acumulada</p>
            <h2 className="text-3xl font-bold text-white">R$ {project.latestMetrics?.savings.toFixed(2) || '0,00'}</h2>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card glass">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
              <Leaf size={24} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 text-sm">CO₂ Evitado</p>
            <h2 className="text-3xl font-bold text-white">{project.latestMetrics?.environmentalImpact.toFixed(1) || '0'} <span className="text-sm font-normal text-gray-500">kg</span></h2>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Charts Section */}
        <div className="card glass h-[400px]">
          <h3 className="text-lg font-bold text-white mb-6">Desempenho Semanal</h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="cons" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCons)" />
              <Area type="monotone" dataKey="econ" stroke="#10b981" fillOpacity={0.1} fill="#10b981" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Simulation Section */}
        <div className="card glass">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Simulador de Cenário (Real-time)</h3>
            <button 
              onClick={handleSimulate} 
              disabled={loadingSim}
              className="p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg text-blue-400 transition-all disabled:opacity-50"
            >
              {loadingSim ? <RefreshCw className="animate-spin" size={20} /> : <CloudSun size={20} />}
            </button>
          </div>

          {!simulation ? (
            <div className="flex flex-col items-center justify-center h-[280px] text-gray-500 space-y-4">
              <CloudSun size={48} className="opacity-20" />
              <p>Clique no ícone de clima para buscar dados reais e simular projeções.</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-xs text-gray-500 mb-1">DADOS EXTERNOS ({simulation.weather.source})</p>
                <p className="text-sm text-white">Radiação Solar Média: <span className="font-bold text-yellow-400">{simulation.weather.averageRadiation.toFixed(1)} W/m²</span></p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 uppercase">Geração Mensal Est.</p>
                  <p className="text-xl font-bold text-white">{simulation.generation} kWh</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 uppercase">Economia Mensal Est.</p>
                  <p className="text-xl font-bold text-green-400">R$ {simulation.savings}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 uppercase">Impacto Ambiental</p>
                  <p className="text-xl font-bold text-purple-400">{simulation.co2} kg CO2/mês</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 uppercase">Status do Cenário</p>
                  <span className="badge badge-success">Altamente Viável</span>
                </div>
              </div>

              <button className="btn btn-primary w-full mt-4">Aplicar Projeção ao Projeto</button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
