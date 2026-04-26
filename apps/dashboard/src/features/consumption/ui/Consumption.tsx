import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';
import { 
  Zap, 
  TrendingDown, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  FileText,
  Loader2,
  Trash2,
  Edit2,
  Plus,
  ArrowRight,
  Target,
  BarChart3,
  Scale,
  RefreshCw,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/shared/ui/Button';
import { Typography } from '@/shared/ui/Typography';

// --- Animation Variants ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

// --- Custom Components ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-thick border-white/10 p-5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-3 bg-emerald-500 rounded-full" />
          <Typography className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase italic">{label}</Typography>
        </div>
        <div className="space-y-3">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-12">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: entry.color, color: entry.color }} />
                <span className="text-[11px] text-slate-300 font-bold uppercase tracking-wider">{entry.name}</span>
              </div>
              <span className="text-sm font-black text-white tabular-nums">{entry.value.toFixed(1)} <span className="text-[10px] text-slate-500 ml-0.5">kWh</span></span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const ConsumptionStat = ({ title, value, unit, icon: Icon, color, trend, trendValue }: any) => (
  <motion.div 
    variants={itemVariants}
    whileHover={{ y: -4, scale: 1.02 }}
    className="glass-thick group relative overflow-hidden p-6 border-white/5 hover:border-white/20 transition-all duration-500"
  >
    {/* Background Glow */}
    <div className={`absolute -top-12 -right-12 w-24 h-24 blur-[60px] opacity-20 rounded-full transition-all duration-700 group-hover:scale-150 bg-gradient-to-br ${color}`} />
    
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div className="relative">
          <div className={`absolute inset-0 blur-lg opacity-40 rounded-full bg-gradient-to-br ${color}`} />
          <div className="relative p-3 rounded-xl bg-white/5 border border-white/10 text-white shadow-inner">
            <Icon size={18} strokeWidth={2.5} />
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-black tracking-[0.15em] uppercase border backdrop-blur-md shadow-lg ${
            trend === 'up' 
              ? 'text-rose-400 bg-rose-400/10 border-rose-400/20' 
              : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-emerald-500/10'
          }`}>
            {trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trendValue}
          </div>
        )}
      </div>

      <div className="mt-auto">
        <Typography className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase italic mb-1 group-hover:text-slate-300 transition-colors">
          {title}
        </Typography>
        <div className="flex items-baseline gap-2">
          <Typography className="text-4xl font-black text-white tracking-tight leading-none">
            {value}
          </Typography>
          <Typography className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
            {unit}
          </Typography>
        </div>
      </div>
    </div>
  </motion.div>
);

const Consumption: React.FC = () => {
  const { user } = useUser();
  const { showToast } = useToast();
  
  const consumptions = useQuery(api.consumptions.getConsumptions, {
    userEmail: user?.email || undefined
  });
  
  const updateActualConsumption = useMutation(api.consumptions.updateActualConsumption);
  const updateConsumption = useMutation(api.consumptions.updateConsumption);
  const removeConsumption = useMutation(api.consumptions.removeConsumption);
  const processReconciliation = useMutation(api.financials.processReconciliation);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actualValue, setActualValue] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalFormData, setModalFormData] = useState({
    eventId: '',
    predictedKwh: 0,
    actualKwh: 0
  });

  const isManagementRole = user?.role === 'admin' || user?.role === 'operator';

  const chartData = useMemo(() => {
    if (!consumptions) return [];
    return consumptions.map(c => ({
      name: c.eventName,
      Previsto: c.predictedKwh,
      Realizado: c.actualKwh || 0
    })).slice(0, 8);
  }, [consumptions]);

  const stats = useMemo(() => {
    if (!consumptions) return null;
    const totalPrevisto = consumptions.reduce((acc, curr) => acc + curr.predictedKwh, 0);
    const totalRealizado = consumptions.reduce((acc, curr) => acc + (curr.actualKwh || 0), 0);
    const desvioGlobal = totalPrevisto > 0 ? ((totalRealizado - totalPrevisto) / totalPrevisto) * 100 : 0;
    const pending = consumptions.filter(c => c.actualKwh && !c.isReconciled && c.status !== 'Dentro da Tolerância').length;
    
    return {
      totalPrevisto,
      totalRealizado,
      desvioGlobal,
      pending
    };
  }, [consumptions]);

  const handleUpdateConsumption = async (id: any) => {
    if (!actualValue || !user?.email) return;
    setIsUpdating(true);
    try {
      await updateActualConsumption({
        consumptionId: id,
        actualKwh: parseFloat(actualValue),
        userEmail: user.email
      });
      setEditingId(null);
      setActualValue('');
      showToast("Consumo atualizado com sucesso!", "success");
    } catch (error: any) {
      showToast(error.message || "Erro ao atualizar consumo.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleProcessReconciliation = async (id: any) => {
    if (!user?.email) return;
    setIsProcessing(id);
    try {
      const result = await processReconciliation({ 
        consumptionId: id,
        userEmail: user.email
      });
      showToast(result.message, "success");
    } catch (error: any) {
      showToast(error.message || "Erro ao processar reconciliação.", "error");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDeleteConsumption = async (id: any) => {
    if (!user?.email) return;
    if (!confirm("Tem certeza que deseja excluir esta medição?")) return;
    try {
      await removeConsumption({ 
        id,
        userEmail: user.email
      });
      showToast("Medição excluída com sucesso!", "success");
    } catch (error: any) {
      showToast(error.message || "Erro ao excluir medição.", "error");
    }
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setModalFormData({
      eventId: item.eventId,
      predictedKwh: item.predictedKwh,
      actualKwh: item.actualKwh || 0
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;
    setIsUpdating(true);
    try {
      await updateConsumption({
        id: editingItem._id,
        predictedKwh: modalFormData.predictedKwh,
        actualKwh: modalFormData.actualKwh || undefined,
        userEmail: user.email
      });
      setIsModalOpen(false);
      setEditingItem(null);
      showToast("Medição atualizada com sucesso!", "success");
    } catch (error: any) {
      showToast(error.message || "Erro ao atualizar medição.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  if (consumptions === undefined || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse" />
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative" />
        </div>
        <Typography className="text-slate-500 font-black tracking-[0.4em] uppercase text-xs">Sincronizando Medições...</Typography>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-12 pb-24"
    >
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <motion.div variants={itemVariants} className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[9px] font-black tracking-[0.2em] text-emerald-500 uppercase">Neural performance engine v4.0</span>
            </div>
            <div className="h-px w-16 bg-white/10" />
          </div>
          
          <Typography variant="h1" className="text-6xl font-black tracking-tight text-white mb-3 uppercase leading-none italic">
            ENERGY <span className="text-gradient">DIAGNOSTIC</span>
          </Typography>
          
          <div className="flex items-center gap-4">
            <Typography variant="body" className="text-slate-400 font-medium tracking-wide text-sm max-w-md">
              Real-time consumption forensics, load prediction, and cryptographic reconciliation protocol.
            </Typography>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex gap-4 relative z-10">
          <Button variant="ghost" className="h-14 px-8 border border-white/5 bg-white/5 hover:bg-white/10 text-white font-black tracking-[0.2em] uppercase text-[10px] rounded-2xl group transition-all">
            <FileText className="w-4 h-4 mr-3 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            Audit Ledger
          </Button>
          <Button className="btn-premium-primary h-14 px-10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic shadow-[0_20px_40px_-12px_rgba(16,185,129,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.5)]">
            <Target size={16} className="mr-3" />
            KPI SETTINGS
          </Button>
        </motion.div>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ConsumptionStat 
          title="Predicted Load" 
          value={stats.totalPrevisto.toFixed(1)} 
          unit="kWh"
          icon={BarChart3}
          color="from-emerald-500/20 to-teal-500/20"
        />
        <ConsumptionStat 
          title="Actual Output" 
          value={stats.totalRealizado.toFixed(1)} 
          unit="kWh"
          icon={Zap}
          color="from-blue-500/20 to-indigo-500/20"
        />
        <ConsumptionStat 
          title="Operational Delta" 
          value={`${stats.desvioGlobal > 0 ? '+' : ''}${stats.desvioGlobal.toFixed(1)}%`}
          unit={stats.desvioGlobal > 0 ? "Overage" : "Efficiency"}
          icon={Scale}
          trend={stats.desvioGlobal > 0 ? 'up' : 'down'}
          trendValue={stats.desvioGlobal > 0 ? 'ANOMALY' : 'NOMINAL'}
          color={stats.desvioGlobal > 0 ? "from-rose-500/20 to-red-500/20" : "from-emerald-500/20 to-teal-500/20"}
        />
        <ConsumptionStat 
          title="Pending Actions" 
          value={stats.pending}
          unit="Securitas"
          icon={RefreshCw}
          color="from-purple-500/20 to-pink-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Analytics Card */}
        <motion.div variants={itemVariants} className="lg:col-span-8 glass-thick border-white/5 p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6 relative z-10">
            <div>
              <Typography variant="h3" className="text-2xl font-black text-white mb-2 uppercase tracking-tight italic">Flux <span className="text-emerald-500">Variance</span></Typography>
              <Typography variant="body" className="text-xs text-slate-500 font-bold tracking-widest uppercase italic">Neural-mapped comparative analysis [PLAN vs EXEC]</Typography>
            </div>
            <div className="flex items-center gap-6 p-2 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-2.5 px-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Plan</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 border-l border-white/10">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_100px_rgba(59,130,246,0.5)]" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Exec</span>
              </div>
            </div>
          </div>
          
          <div className="h-[380px] relative">
            <div className="absolute inset-0 scanline pointer-events-none opacity-[0.03]" />
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={12}>
                <defs>
                  <linearGradient id="barGradientPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="barGradientReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#475569" 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={9} 
                  fontWeight="900"
                  tick={{ dy: 15 }}
                  className="uppercase tracking-widest"
                />
                <YAxis 
                  stroke="#475569" 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={9} 
                  fontWeight="900"
                  className="tabular-nums"
                />
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ fill: 'rgba(255,255,255,0.03)', radius: [8, 8, 0, 0] }} 
                />
                <Bar 
                  dataKey="Previsto" 
                  fill="url(#barGradientPrev)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={10} 
                  animationDuration={2000}
                />
                <Bar 
                  dataKey="Realizado" 
                  fill="url(#barGradientReal)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={10}
                  animationDuration={2500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Side Reconciliation Panel */}
        <motion.div variants={itemVariants} className="lg:col-span-4 glass-thick border-white/5 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl pointer-events-none" />
          
          <div className="p-8 border-b border-white/5 relative z-10">
            <Typography variant="h3" className="text-xl font-black text-white mb-2 uppercase tracking-tight italic">RECON <span className="text-emerald-500">VAULT</span></Typography>
            <Typography variant="body" className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Cryptographic financial clearing</Typography>
          </div>
          
          <div className="flex-1 p-6 space-y-6 max-h-[480px] overflow-y-auto custom-scrollbar relative z-10">
            {consumptions.filter(c => c.actualKwh && !c.isReconciled && (c.status === 'Consumo Excedente' || c.status === 'Consumo Inferior')).map(c => (
              <motion.div 
                key={c._id} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-6 rounded-2xl border relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] bg-white/5 ${
                  c.status === 'Consumo Excedente' 
                    ? 'border-rose-500/20 hover:border-rose-500/40' 
                    : 'border-emerald-500/20 hover:border-emerald-500/40'
                }`}
              >
                <div className={`absolute -top-12 -right-12 w-24 h-24 blur-[40px] rounded-full opacity-10 transition-all group-hover:scale-150 ${
                  c.status === 'Consumo Excedente' ? 'bg-rose-500' : 'bg-emerald-500'
                }`} />
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-white/5 border border-white/5 ${
                      c.status === 'Consumo Excedente' ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {c.status === 'Consumo Excedente' ? <AlertCircle size={16} /> : <TrendingDown size={16} />}
                    </div>
                    <Typography className={`text-[10px] font-black uppercase tracking-[0.2em] italic ${
                      c.status === 'Consumo Excedente' ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {c.status === 'Consumo Excedente' ? 'DEBIT_CLEAR' : 'CREDIT_CLEAR'}
                    </Typography>
                  </div>
                </div>
                
                <Typography className="text-base font-black text-white mb-2 block uppercase italic tracking-tight">{c.eventName}</Typography>
                <Typography className="text-[11px] text-slate-400 font-bold uppercase tracking-wide mb-6 block leading-relaxed">
                  Delta anomaly of <span className="text-white">{Math.abs(c.difference).toFixed(1)} kWh</span> identified. Requires clearance.
                </Typography>
                
                {isManagementRole && (
                  <Button 
                    variant="ghost" 
                    className={`w-full h-12 text-[10px] font-black uppercase tracking-[0.2em] italic rounded-xl transition-all border shadow-lg ${
                      c.status === 'Consumo Excedente' 
                        ? 'bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border-rose-500/30' 
                        : 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border-emerald-500/30'
                    }`}
                    onClick={() => handleProcessReconciliation(c._id)}
                    loading={isProcessing === c._id}
                  >
                    {c.status === 'Consumo Excedente' ? 'EXECUTE CLEARANCE' : 'AUTHORIZE REBATE'}
                  </Button>
                )}
              </motion.div>
            ))}

            {consumptions.filter(c => c.actualKwh && !c.isReconciled && (c.status === 'Consumo Excedente' || c.status === 'Consumo Inferior')).length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 opacity-30">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 relative">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                  <CheckCircle2 size={32} className="text-emerald-500 relative z-10" />
                </div>
                <div className="space-y-1">
                  <Typography className="text-[10px] font-black tracking-[0.3em] text-white uppercase italic">ALL CLEAR</Typography>
                  <Typography className="text-[9px] font-black tracking-[0.2em] text-slate-500 uppercase">Secure protocol synchronized</Typography>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Main Table */}
      <motion.div variants={itemVariants} className="glass-thick overflow-hidden border-white/5 relative">
        <div className="absolute top-0 left-0 w-full h-1 scanline pointer-events-none opacity-[0.05]" />
        
        <div className="p-10 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white/[0.02] relative z-10">
          <div>
            <Typography variant="h3" className="text-2xl font-black text-white mb-2 uppercase tracking-tight italic">Registry <span className="text-emerald-500">Forensics</span></Typography>
            <Typography variant="body" className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Cryptographically signed energy audit trail</Typography>
          </div>
          <Button variant="ghost" size="sm" className="h-12 px-8 border border-white/10 bg-white/5 text-slate-300 font-black tracking-[0.2em] uppercase text-[9px] rounded-xl flex items-center gap-4 hover:text-white hover:bg-white/10 transition-all group">
            <FileText size={14} className="group-hover:text-emerald-500 transition-colors" /> EXPORT_AUDIT_CSV
          </Button>
                <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">ASSET_IDENTITY</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">PLAN_LOAD</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">REAL_LOAD</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">VARIANCE_DELTA</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic text-center">PROTOCOL_STATUS</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic text-right">COMMAND_CENTER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {consumptions.map((item) => (
                <tr key={item._id} className="hover:bg-white/[0.03] group transition-all duration-300">
                  <td className="px-10 py-8">
                    <Typography className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors uppercase italic tracking-tight">{item.eventName}</Typography>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-black text-slate-300 tabular-nums">{item.predictedKwh.toFixed(1)}</span>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">kWh</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    {editingId === item._id ? (
                      <div className="flex items-center gap-3">
                        <input 
                          type="number" 
                          value={actualValue}
                          onChange={e => setActualValue(e.target.value)}
                          className="w-28 bg-slate-950/80 border border-emerald-500/40 rounded-xl px-4 py-2 text-sm text-white outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-black"
                          autoFocus
                        />
                        <button 
                          onClick={() => handleUpdateConsumption(item._id)} 
                          disabled={isUpdating}
                          className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20 shadow-lg"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button 
                          onClick={() => setEditingId(null)}
                          className="p-2 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-all"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className={`flex items-baseline gap-2 ${!item.actualKwh ? 'opacity-20 italic' : ''}`}>
                          <span className="text-sm font-black text-white tabular-nums">{item.actualKwh ? item.actualKwh.toFixed(1) : 'PENDING'}</span>
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">kWh</span>
                        </div>
                        {isManagementRole && !item.actualKwh && (
                          <button 
                            onClick={() => setEditingId(item._id)}
                            className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-500 hover:text-white shadow-lg border border-emerald-500/20"
                          >
                            <Plus size={16} />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-10 py-8">
                    {item.actualKwh ? (
                      <div className={`flex items-center gap-2 font-black text-xs tabular-nums ${
                        item.difference > 0 ? 'text-rose-400' : item.difference < 0 ? 'text-blue-400' : 'text-emerald-400'
                      }`}>
                        {item.difference > 0 ? <TrendingUp size={14} /> : item.difference < 0 ? <TrendingDown size={14} /> : null}
                        {item.difference > 0 ? '+' : ''}{item.difference.toFixed(1)}
                      </div>
                    ) : (
                      <span className="text-slate-800 text-xs font-black tracking-widest italic">NOT_CALCULATED</span>
                    )}
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] italic border backdrop-blur-md transition-all ${
                        item.status === 'Dentro da Tolerância' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' :
                        item.status === 'Consumo Excedente' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]' :
                        item.actualKwh ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-white/5 text-slate-500 border-white/10'
                      }`}>
                        {item.actualKwh ? item.status : 'AWAITING_MED'}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end items-center gap-4">
                      {item.actualKwh && item.status === 'Dentro da Tolerância' && !item.isReconciled && isManagementRole && (
                        <button 
                          className="h-10 px-6 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white font-black uppercase text-[9px] tracking-[0.2em] italic transition-all flex items-center gap-3 border border-emerald-500/20 shadow-lg"
                          onClick={() => handleProcessReconciliation(item._id)}
                          disabled={!!isProcessing}
                        >
                          {isProcessing === item._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                          CLEAR_RECON
                        </button>
                      )}
                      
                      {item.isReconciled && (
                        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] italic text-emerald-500">FINALIZED</span>
                        </div>
                      )}
 
                      {isManagementRole && (
                        <div className="flex items-center gap-1 ml-4 p-1 rounded-xl bg-white/5 border border-white/5">
                          <button 
                            onClick={() => handleEditItem(item)}
                            className="p-2.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteConsumption(item._id)}
                            className="p-2.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-400/5 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Glow Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass-thick border-white/10 shadow-[0_0_100px_rgba(16,185,129,0.15)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500" />
              
              <div className="p-10">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <Typography className="text-[10px] font-black tracking-[0.4em] text-emerald-500 uppercase mb-2 italic">Provisioning Node</Typography>
                    <Typography variant="h2" className="text-3xl font-black text-white uppercase tracking-tight italic">Adjust <span className="text-emerald-500">Metric</span></Typography>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all hover:rotate-90 border border-white/5"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSaveModal} className="space-y-10">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic ml-1">Planned Load Capacity (kWh)</label>
                      <input 
                        type="number" 
                        value={modalFormData.predictedKwh}
                        onChange={e => setModalFormData({...modalFormData, predictedKwh: parseFloat(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all font-black text-lg"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic ml-1">Observed Field Output (kWh)</label>
                      <input 
                        type="number" 
                        value={modalFormData.actualKwh}
                        onChange={e => setModalFormData({...modalFormData, actualKwh: parseFloat(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-black text-lg"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button 
                      variant="ghost" 
                      className="flex-1 h-16 border border-white/5 bg-white/5 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-white/10 hover:text-white transition-all italic"
                      onClick={() => setIsModalOpen(false)}
                    >
                      DISCARD_CHANGES
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 h-16 btn-premium-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic"
                      loading={isUpdating}
                    >
                      COMMIT_METRIC
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};>
    </motion.div>
  );
};

export { Consumption };

