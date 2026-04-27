import React, { useState, useMemo, useEffect } from 'react';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowDownLeft,
  Download, 
  Filter, 
  Search,
  FileText,
  CreditCard,
  Wallet,
  X,
  Loader2,
  Plus,
  Trash2,
  Edit2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Receipt,
  PieChart,
  ArrowRight,
  ShieldCheck,
  Activity,
  Target,
  Zap,
  Clock,
  Terminal,
  Database,
  Cpu,
  Lock
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/shared/ui/Button';
import { Typography } from '@/shared/ui/Typography';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

const FinancialStat = ({ label, value, icon: Icon, trend, trendValue, delay = 0 }: any) => (
  <motion.div 
    variants={itemVariants}
    initial="hidden"
    animate="visible"
    transition={{ delay }}
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    className="glass-thick p-6 relative overflow-hidden group border-l-2 border-primary/30"
  >
    {/* Scanline Overlay */}
    <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none" />
    
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
    
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/5 text-primary shadow-2xl group-hover:border-primary/50 transition-all">
        <Icon size={22} className="group-hover:animate-pulse" />
      </div>
      <div className="flex flex-col items-end gap-1">
        {trend && (
          <span className={`text-[10px] font-black italic uppercase tracking-tighter px-2 py-0.5 rounded-full flex items-center gap-1 ${
            trend === 'up' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-rose-400/10 text-rose-400'
          }`}>
            {trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trendValue}
          </span>
        )}
        <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-1">
          <Activity size={8} className="animate-pulse" />
          REALTIME
        </div>
      </div>
    </div>
    
    <div className="relative z-10">
      <Typography className="text-[10px] font-black italic uppercase tracking-[0.3em] text-primary/70 mb-1 block">
        {label}
      </Typography>
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-bold text-white/30 uppercase tracking-tighter">BRL</span>
        <Typography className="text-3xl font-black tracking-tighter text-white group-hover:text-primary transition-colors leading-none">
          {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Typography>
      </div>
    </div>
    
    <div className="mt-6 space-y-2">
      <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-widest">
        <span>Allocation Efficiency</span>
        <span className="text-primary/50">94.2%</span>
      </div>
      <div className="h-1 w-full bg-neutral-900/80 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '70%' }}
          transition={{ duration: 1.5, delay: delay + 0.5, ease: "circOut" }}
          className={`h-full rounded-full relative ${trend === 'up' ? 'bg-primary' : 'bg-rose-500'}`}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </motion.div>
      </div>
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-thick bg-slate-950/95 border-l-4 border-primary p-5 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden min-w-[240px]">
        <div className="absolute inset-0 scanline opacity-[0.05] pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
          <Typography className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">
            {label} // DATA LOG
          </Typography>
          <Terminal size={12} className="text-primary animate-pulse" />
        </div>

        <div className="space-y-4">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="space-y-1 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ color: entry.color, backgroundColor: entry.color }} />
                  <span className="text-[10px] text-white/60 font-black uppercase tracking-widest">{entry.name}</span>
                </div>
                <span className="text-xs font-black text-white italic">
                  R$ {entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  className="h-full opacity-50"
                  style={{ backgroundColor: entry.color }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">
          <span className="flex items-center gap-1"><Cpu size={8} /> Processed by EV-AI</span>
          <span className="animate-pulse">Active Sync</span>
        </div>
      </div>
    );
  }
  return null;
};

const Financial: React.FC = () => {
  const { user } = useUser();
  const { showToast } = useToast();
  const userEmail = user?.email || "";
  
  const transactions = useQuery(api.financials.getFinancials, { userEmail });
  const financialStats = useQuery(api.financials.getFinancialStats, { userEmail });
  const events = useQuery(api.events.getEvents, { userEmail });
  
  const createTransaction = useMutation(api.financials.createFinancialTransaction);
  const updateFinancial = useMutation(api.financials.updateFinancial);
  const removeFinancial = useMutation(api.financials.removeFinancial);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrxId, setEditingTrxId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    type: 'income',
    category: '',
    amount: 0,
    status: 'pending',
    eventId: '',
    contractId: ''
  });

  const canManage = user?.role === 'admin' || user?.role === 'operator';

  const handleExportPDF = () => {
    if (!transactions) return;

    const doc = new jsPDF();
    const primaryColor = [16, 185, 129]; // #10b981
    
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('EcoVolt', 15, 25);
    doc.setFontSize(10);
    doc.text('Relatório Financeiro Operacional', 15, 32);
    
    autoTable(doc, {
      startY: 60,
      head: [['Categoria', 'Valor (R$)']],
      body: [
        ['Receita Liquidada', (financialStats?.totalIncome || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })],
        ['Pendentes / A Receber', (financialStats?.totalPending || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })],
        ['Despesas / Reembolsos', (financialStats?.totalExpenses || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })],
      ],
      theme: 'grid'
    });

    doc.save('EcoVolt_Relatorio_Financeiro.pdf');
    showToast("PDF gerado com sucesso!", "success");
  };

  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || formData.amount <= 0) return;

    setIsSaving(true);
    try {
      if (editingTrxId) {
        await updateFinancial({
          userEmail,
          id: editingTrxId as any,
          type: formData.type as "income" | "expense",
          category: formData.category,
          amount: formData.amount,
          status: formData.status as any,
          eventId: formData.eventId || undefined,
          contractId: formData.contractId || undefined,
        });
        showToast("Transação atualizada!", "success");
      } else {
        await createTransaction({
          userEmail,
          type: formData.type as "income" | "expense",
          category: formData.category,
          amount: formData.amount,
          status: formData.status as any,
          dueDate: Date.now() + 86400000 * 5,
          eventId: formData.eventId || undefined,
          contractId: formData.contractId || undefined,
        });
        showToast("Transação criada!", "success");
      }
      handleCloseModal();
    } catch (error) {
      showToast("Erro ao salvar transação.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (trx: any) => {
    setEditingTrxId(trx._id);
    setFormData({
      type: trx.type,
      category: trx.category,
      amount: trx.amount,
      status: trx.status,
      eventId: trx.eventId || '',
      contractId: trx.contractId || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: any) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    try {
      await removeFinancial({ userEmail, id });
      showToast("Excluído com sucesso!", "success");
    } catch (error) {
      showToast("Erro ao excluir.", "error");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTrxId(null);
    setFormData({ type: 'income', category: '', amount: 0, status: 'pending', eventId: '', contractId: '' });
  };

  if (transactions === undefined || !financialStats) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-8 relative overflow-hidden">
        <div className="absolute inset-0 scanline opacity-[0.05] pointer-events-none" />
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
          <div className="p-8 glass-thick rounded-full border-primary/30 relative shadow-[0_0_50px_rgba(16,185,129,0.2)]">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Typography className="text-primary font-black tracking-[0.5em] uppercase text-[10px] animate-pulse">
            Sincronizando Tesouraria Central...
          </Typography>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-1 h-1 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-12 pb-24 relative"
    >
      {/* HUD Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative z-10">
        <motion.div variants={itemVariants} className="relative pl-8">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary shadow-[0_0_20px_rgba(16,185,129,0.6)]" />
          <div className="flex items-center gap-2 mb-2">
            <Terminal size={12} className="text-primary animate-pulse" />
            <Typography className="text-[10px] font-black italic uppercase tracking-[0.5em] text-primary">
              Financial Intelligence Terminal v4.2.0
            </Typography>
          </div>
          <Typography variant="h1" className="text-5xl font-black italic uppercase tracking-tighter text-white mb-2 leading-none">
            Ledger <span className="text-primary glow-text">Vault</span>
          </Typography>
          <div className="flex items-center gap-4">
            <Typography variant="muted" className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-white/40">
              <ShieldCheck size={14} className="text-primary" />
              End-to-End Encryption Active
            </Typography>
            <div className="h-1 w-1 rounded-full bg-white/20" />
            <Typography variant="muted" className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-white/40">
              <Database size={14} className="text-primary/50" />
              Cloud Synchronized
            </Typography>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
          <Button 
            variant="ghost" 
            onClick={handleExportPDF}
            className="glass-thick border-white/10 hover:border-primary/50 hover:bg-primary/5 h-14 px-8 text-primary font-black tracking-[0.2em] uppercase text-[10px] rounded-2xl transition-all group"
          >
            <Download className="w-4 h-4 mr-2 group-hover:-translate-y-1 transition-transform" />
            Exportar Dossier
          </Button>
          {canManage && (
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="btn-premium-primary h-14 px-10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(16,185,129,0.2)]"
            >
              <Plus size={18} className="mr-2" />
              Nova Transação
            </Button>
          )}
        </motion.div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <FinancialStat 
          label="Receita Liquidada" 
          value={financialStats.totalIncome} 
          icon={Wallet}
          trend="up"
          trendValue="+12.4%"
          delay={0.1}
        />
        <FinancialStat 
          label="Projeção de Recebíveis" 
          value={financialStats.totalPending} 
          icon={CreditCard}
          trend="up"
          trendValue="WAITING"
          delay={0.2}
        />
        <FinancialStat 
          label="Fluxo de Saída" 
          value={financialStats.totalExpenses} 
          icon={ArrowDownRight}
          trend="down"
          trendValue="-2.1%"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Analytics Engine */}
        <motion.div variants={itemVariants} className="lg:col-span-8 glass-thick p-8 relative overflow-hidden group">
          <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none" />
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
            <Activity size={160} className="text-primary" />
          </div>

          <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <Typography className="text-[10px] font-black italic uppercase tracking-[0.3em] text-primary">
                  Neural Projection Engine
                </Typography>
              </div>
              <Typography variant="h4" className="text-2xl font-black italic uppercase tracking-tight text-white">Projeção de Fluxo</Typography>
            </div>
            <div className="flex items-center gap-8 bg-neutral-900/50 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-sm bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Receitas</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-sm bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Despesas</span>
              </div>
            </div>
          </div>
          
          <div className="h-[400px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialStats.monthlyData}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff20" 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={10} 
                  fontWeight="900"
                  tick={{ dy: 15, fill: '#ffffff40' }}
                />
                <YAxis 
                  stroke="#ffffff20" 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={10} 
                  fontWeight="900"
                  tick={{ fill: '#ffffff40' }}
                  tickFormatter={(val) => `R$ ${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(16,185,129,0.2)', strokeWidth: 2 }} />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  name="Receita" 
                  stroke="#10b981" 
                  fill="url(#colorInc)" 
                  strokeWidth={4}
                  strokeLinecap="round"
                  animationDuration={2500}
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  name="Despesa" 
                  stroke="#f43f5e" 
                  fill="url(#colorExp)" 
                  strokeWidth={4}
                  strokeLinecap="round"
                  animationDuration={3000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Side Panel: Forensic Context */}
        <motion.div variants={itemVariants} className="lg:col-span-4 glass-thick p-8 flex flex-col relative overflow-hidden group">
          <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none" />
          
          <div className="flex-1 relative z-10">
            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 mb-10 relative group overflow-hidden shadow-inner">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-all rotate-12 group-hover:rotate-0">
                <Target size={60} className="text-primary" />
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary/10 text-primary shadow-lg border border-primary/20">
                  <PieChart size={20} />
                </div>
                <Typography className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Neural Insights</Typography>
              </div>
              <Typography className="text-[13px] text-white/70 font-medium leading-relaxed italic tracking-wide">
                "Eficiência de alocação <span className="text-primary font-black shadow-[0_0_10px_rgba(16,185,129,0.3)]">14% acima</span> do provisionado. Risco de liquidez mitigado pela reserva operacional de segurança."
              </Typography>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <Typography className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Próximos Gatilhos</Typography>
                <div className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-black">PRIORITY</div>
              </div>
              
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-neutral-900/60 border border-white/5 group/item hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer shadow-lg overflow-hidden relative">
                    <div className="absolute inset-0 scanline opacity-0 group-hover/item:opacity-[0.03] transition-opacity" />
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-primary border border-white/5 group-hover/item:border-primary/30 transition-all">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <Typography className="text-[11px] font-black text-white uppercase tracking-tight group-hover/item:text-primary transition-colors">Fatura Fornecedor {i === 1 ? 'ENEL' : 'EQUATORIAL'}</Typography>
                        <Typography className="text-[9px] font-black text-primary/60 uppercase tracking-[0.2em] flex items-center gap-1.5">
                          <Clock size={10} className="animate-pulse" />
                          EXPIRING IN {i * 2} DAYS
                        </Typography>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-white/20 group-hover/item:text-primary transition-all transform group-hover/item:translate-x-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full h-16 glass-thick border-white/10 hover:border-primary/40 text-white/40 hover:text-white font-black tracking-[0.3em] uppercase text-[10px] rounded-2xl mt-10 transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <Zap className="w-4 h-4 mr-3 text-primary group-hover:animate-bounce relative z-10" />
            <span className="relative z-10">Configurar Alertas Neurais</span>
          </Button>
        </motion.div>
      </div>

      {/* Forensic Ledger Table */}
      <motion.div variants={itemVariants} className="glass-thick overflow-hidden border-t-4 border-primary relative group">
        <div className="absolute inset-0 scanline opacity-[0.02] pointer-events-none" />
        
        <div className="p-10 border-b border-white/5 flex flex-wrap gap-8 items-center bg-neutral-900/40 backdrop-blur-xl relative z-10">
          <div className="mr-auto">
            <div className="flex items-center gap-2 mb-1">
              <Database size={14} className="text-primary animate-pulse" />
              <Typography className="text-[10px] font-black italic uppercase tracking-[0.4em] text-primary">
                Immutable Forensic Registry
              </Typography>
            </div>
            <Typography variant="h3" className="text-3xl font-black italic uppercase text-white mb-1 tracking-tighter leading-none">Transactions <span className="text-primary">Ledger</span></Typography>
            <Typography variant="body" className="text-[11px] text-white/40 font-bold tracking-widest uppercase flex items-center gap-2">
              <Lock size={12} className="text-primary/40" />
              Blockchain verified audit trail active
            </Typography>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative w-full md:w-96 group/search">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/search:text-primary transition-all group-focus-within/search:scale-110" />
              <input 
                type="text" 
                placeholder="BUSCAR TRX_ID / CATEGORIA / DOMÍNIO..." 
                className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-primary/50 focus:bg-black/80 transition-all text-[11px] font-black tracking-widest uppercase text-white placeholder:text-white/10 shadow-inner"
              />
            </div>
            
            <Button variant="outline" size="sm" className="glass-thick border-white/5 h-14 px-8 text-white/60 font-black tracking-[0.2em] uppercase text-[10px] rounded-2xl flex items-center gap-3 hover:text-primary hover:border-primary/30 transition-all">
              <Filter size={16} /> Filtros Avançados
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 border-b border-white/5">
                <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Temporalidade // ID</th>
                <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Ativo // Destino</th>
                <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Classificação</th>
                <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] text-right">Montante (BRL)</th>
                <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] text-center">Protocolo</th>
                <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] text-right">Governança</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((trx) => (
                <tr key={trx._id} className="hover:bg-primary/5 group transition-all duration-500">
                  <td className="px-10 py-8 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center" />
                    <Typography className="text-sm font-black italic uppercase text-white mb-1 group-hover:text-primary transition-colors">{new Date(trx.createdAt).toLocaleDateString('pt-BR')}</Typography>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/20 animate-pulse" />
                      <Typography className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-widest">
                        TRX-{trx._id.substring(trx._id.length - 12).toUpperCase()}
                      </Typography>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <Typography className="text-sm font-black italic uppercase text-white tracking-tight mb-1">{trx.event || 'OPERACIONAL GERAL'}</Typography>
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-black text-white/40 uppercase tracking-widest">
                        {trx.contract || 'DEFAULT_LEDGER'}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-[10px] font-black italic uppercase text-primary/80 tracking-[0.2em] px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/20 group-hover:bg-primary/10 transition-all">
                      {trx.category}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <div className="flex flex-col items-end">
                        <span className={`text-base font-black italic ${trx.type === 'income' ? 'text-primary' : 'text-rose-500'} tracking-tighter`}>
                          {trx.type === 'income' ? '+' : '-'} R$ {trx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Validated Transaction</span>
                      </div>
                      <div className={`p-2 rounded-lg ${trx.type === 'income' ? 'bg-primary/10 text-primary' : 'bg-rose-500/10 text-rose-500'} border border-current/20`}>
                        {trx.type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex justify-center">
                      <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] border flex items-center gap-3 shadow-2xl transition-all duration-500 group-hover:scale-105 ${
                        trx.status === 'paid' 
                          ? 'bg-primary/10 text-primary border-primary/30 shadow-primary/5' 
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/30 shadow-amber-500/5'
                      }`}>
                        {trx.status === 'paid' ? <ShieldCheck size={12} className="animate-pulse" /> : <Clock size={12} className="animate-spin [animation-duration:3s]" />}
                        {trx.status === 'paid' ? 'SECURED' : 'PENDING'}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 duration-500">
                      <button className="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 border border-white/5 transition-all" title="View Evidence"><FileText size={18} /></button>
                      {canManage && (
                        <>
                          <button onClick={() => handleEdit(trx)} className="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-primary hover:bg-primary/10 border border-white/5 hover:border-primary/30 transition-all" title="Modify Protocol"><Edit2 size={18} /></button>
                          <button onClick={() => handleDelete(trx._id)} className="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-rose-500 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/30 transition-all" title="Purge Record"><Trash2 size={18} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer Telemetry */}
        <div className="p-6 bg-black/40 border-t border-white/5 flex items-center justify-between text-[9px] font-black text-white/20 uppercase tracking-[0.4em] relative z-10">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> System Online</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Memory Buffer: 1.2GB</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/40" /> Encryption: AES-256</span>
          </div>
          <div className="flex items-center gap-2">
            Page 01 // Total Records: {transactions.length}
          </div>
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
              onClick={handleCloseModal}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-2xl glass-thick border-white/10 shadow-[0_0_150px_rgba(16,185,129,0.15)] overflow-hidden rounded-[2rem]"
            >
              <div className="absolute inset-0 scanline opacity-[0.05] pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-teal-500 to-blue-500" />
              
              <div className="p-12 relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lock size={14} className="text-primary" />
                      <Typography className="text-[10px] font-black tracking-[0.5em] text-primary uppercase">Secure Protocol Input</Typography>
                    </div>
                    <Typography variant="h2" className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
                      {editingTrxId ? 'Modify <span className="text-primary">Record</span>' : 'Register <span className="text-primary">Operation</span>'}
                    </Typography>
                  </div>
                  <button 
                    onClick={handleCloseModal}
                    className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 border border-white/5 transition-all hover:rotate-90"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSaveTransaction} className="space-y-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Protocol Nature</label>
                      <div className="relative group">
                        <select 
                          value={formData.type} 
                          onChange={e => setFormData({...formData, type: e.target.value})}
                          className="w-full bg-black/60 border border-white/10 rounded-2xl px-8 py-5 text-white outline-none focus:border-primary/50 transition-all font-black uppercase tracking-widest appearance-none cursor-pointer group-hover:bg-black/80 shadow-inner"
                        >
                          <option value="income">ENTRY_FLOW (RECEITA)</option>
                          <option value="expense">EXIT_FLOW (DESPESA)</option>
                        </select>
                        <ArrowRight size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Asset Value (BRL)</label>
                      <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black text-sm">R$</div>
                        <input 
                          type="number" 
                          step="0.01"
                          value={formData.amount || ''}
                          onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                          className="w-full bg-black/60 border border-white/10 rounded-2xl px-14 py-5 text-white outline-none focus:border-primary/50 transition-all font-black text-lg group-hover:bg-black/80 shadow-inner"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Classification Descriptor</label>
                    <div className="relative group">
                      <Terminal size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-primary transition-colors" />
                      <input 
                        type="text" 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 rounded-2xl px-16 py-5 text-white outline-none focus:border-primary/50 transition-all font-black uppercase tracking-[0.1em] group-hover:bg-black/80 shadow-inner placeholder:text-white/5"
                        placeholder="EX: CORE_OPS_ENERGY_GRID_TAX_Q2"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Asset Dependency</label>
                      <div className="relative group">
                        <select 
                          value={formData.eventId} 
                          onChange={e => setFormData({...formData, eventId: e.target.value})}
                          className="w-full bg-black/60 border border-white/10 rounded-2xl px-8 py-5 text-white outline-none focus:border-primary/50 transition-all font-black uppercase tracking-widest appearance-none cursor-pointer group-hover:bg-black/80 shadow-inner"
                        >
                          <option value="">STANDALONE_OP</option>
                          {events?.map(ev => <option key={ev._id} value={ev._id}>{ev.name.toUpperCase()}</option>)}
                        </select>
                        <ArrowRight size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Liquidation Protocol</label>
                      <div className="relative group">
                        <select 
                          value={formData.status} 
                          onChange={e => setFormData({...formData, status: e.target.value})}
                          className="w-full bg-black/60 border border-white/10 rounded-2xl px-8 py-5 text-white outline-none focus:border-primary/50 transition-all font-black uppercase tracking-widest appearance-none cursor-pointer group-hover:bg-black/80 shadow-inner"
                        >
                          <option value="paid">SECURED (CONFIRMADO)</option>
                          <option value="pending">PENDING (AGUARDANDO)</option>
                        </select>
                        <ArrowRight size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6 pt-6">
                    <Button 
                      variant="ghost" 
                      className="flex-1 h-16 border border-white/5 text-white/20 font-black uppercase text-[10px] tracking-[0.4em] rounded-[1.5rem] hover:bg-white/5 hover:text-white transition-all"
                      onClick={handleCloseModal}
                    >
                      Abort Protocol
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 h-16 btn-premium-primary rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_0_50px_rgba(16,185,129,0.3)]"
                      loading={isSaving}
                    >
                      {editingTrxId ? 'Apply Patch' : 'Execute Registry'}
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
};

export { Financial };
