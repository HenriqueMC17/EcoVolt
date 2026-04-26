import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
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
  ArrowRight
} from 'lucide-react';
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

const FinancialStat = ({ label, value, icon: Icon, color, trend, trendValue }: any) => (
  <motion.div 
    variants={itemVariants}
    whileHover={{ y: -5 }}
    className="glass-card relative overflow-hidden group border-slate-800/50 hover:border-slate-700/50 transition-all duration-500"
  >
    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${color}`} />
    <div className="p-6 relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-all duration-300">
          <Icon size={20} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border ${
            trend === 'up' ? 'text-emerald-400 bg-emerald-400/5 border-emerald-400/10' : 'text-rose-400 bg-rose-400/5 border-rose-400/10'
          }`}>
            {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trendValue}
          </div>
        )}
      </div>
      <Typography className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase mb-1">
        {label}
      </Typography>
      <div className="flex items-baseline gap-2">
        <Typography className="text-3xl font-black text-white tracking-tight">
          <span className="text-sm font-bold text-slate-500 mr-1">R$</span>
          {value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Typography>
      </div>
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 p-4 rounded-2xl shadow-2xl">
        <Typography className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-2">{label}</Typography>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs text-slate-300 font-medium">{entry.name}</span>
              </div>
              <span className="text-sm font-bold text-white">R$ {entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          ))}
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
      <div className="flex flex-col items-center justify-center py-40 space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
          <Loader2 className="w-16 h-16 text-emerald-500 animate-spin relative" />
        </div>
        <Typography className="text-slate-500 font-black tracking-[0.4em] uppercase text-xs">Sincronizando Tesouraria...</Typography>
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
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div variants={itemVariants}>
          <Typography variant="h1" className="text-4xl font-black tracking-tight text-white mb-2 uppercase">
            Gestão <span className="text-emerald-500">Financeira</span>
          </Typography>
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-emerald-500/50" />
            <Typography variant="body" className="text-slate-400 font-medium tracking-wide">
              Controle de fluxo de caixa, liquidações e previsibilidade financeira
            </Typography>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex gap-4">
          <Button 
            variant="ghost" 
            onClick={handleExportPDF}
            className="h-12 px-6 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold tracking-widest uppercase text-[10px] rounded-2xl"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Balanço
          </Button>
          {canManage && (
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="btn-premium-primary h-12 px-8 rounded-2xl text-[10px] uppercase tracking-[0.2em]"
            >
              <Plus size={16} className="mr-2" />
              Nova Transação
            </Button>
          )}
        </motion.div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <FinancialStat 
          label="Receita Liquidada" 
          value={financialStats.totalIncome} 
          icon={Wallet}
          color="from-emerald-500 to-teal-600"
          trend="up"
          trendValue="+12.4%"
        />
        <FinancialStat 
          label="Projeção de Recebíveis" 
          value={financialStats.totalPending} 
          icon={CreditCard}
          color="from-amber-500 to-orange-600"
          trend="up"
          trendValue="WAITING"
        />
        <FinancialStat 
          label="Fluxo de Saída" 
          value={financialStats.totalExpenses} 
          icon={ArrowDownRight}
          color="from-rose-500 to-red-600"
          trend="down"
          trendValue="-2.1%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart Section */}
        <motion.div variants={itemVariants} className="lg:col-span-8 glass-card border-slate-800/50 p-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <Typography variant="h3" className="text-xl font-bold text-white mb-1 uppercase tracking-tight">Fluxo de Caixa</Typography>
              <Typography variant="body" className="text-xs text-slate-500 font-medium">Histórico mensal de entradas e saídas consolidadas</Typography>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Receitas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Despesas</span>
              </div>
            </div>
          </div>
          
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialStats.monthlyData}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#475569" 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={10} 
                  fontWeight="bold"
                  tick={{ dy: 10 }}
                />
                <YAxis 
                  stroke="#475569" 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={10} 
                  fontWeight="bold"
                  tickFormatter={(val) => `R$ ${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  name="Receita" 
                  stroke="#10b981" 
                  fill="url(#colorInc)" 
                  strokeWidth={3}
                  animationDuration={2000}
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  name="Despesa" 
                  stroke="#f43f5e" 
                  fill="url(#colorExp)" 
                  strokeWidth={3}
                  animationDuration={2500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Side Panel: Summary */}
        <motion.div variants={itemVariants} className="lg:col-span-4 glass-card border-slate-800/50 p-8 flex flex-col justify-between">
          <div>
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <PieChart size={18} />
                </div>
                <Typography className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Insights de Caixa</Typography>
              </div>
              <Typography className="text-sm text-slate-400 font-medium leading-relaxed">
                Seu saldo operacional este mês está <span className="text-emerald-400 font-bold">14% acima</span> do provisionado, impulsionado pela redução de 5.2% no desvio de consumo.
              </Typography>
            </div>

            <div className="space-y-4">
              <Typography className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Próximos Vencimentos</Typography>
              {[1, 2].map(i => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 group hover:border-slate-700/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-slate-500" />
                    <div>
                      <Typography className="text-xs font-bold text-white uppercase tracking-tight">Fatura Fornecedor {i}</Typography>
                      <Typography className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Em 4 dias</Typography>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-700 group-hover:text-white transition-all group-hover:translate-x-1" />
                </div>
              ))}
            </div>
          </div>

          <Button variant="ghost" className="w-full h-12 border border-slate-800 hover:bg-slate-800 text-slate-300 font-black tracking-widest uppercase text-[10px] rounded-xl mt-8">
            <Receipt className="w-4 h-4 mr-2" />
            Configurar Notificações
          </Button>
        </motion.div>
      </div>

      {/* Transactions Table */}
      <motion.div variants={itemVariants} className="glass-card overflow-hidden border-slate-800/50">
        <div className="p-8 border-b border-slate-800/50 flex flex-wrap gap-6 items-center bg-slate-900/20 backdrop-blur-md">
          <div className="mr-auto">
            <Typography variant="h3" className="text-xl font-bold text-white mb-1 uppercase tracking-tight">Ledger de Transações</Typography>
            <Typography variant="body" className="text-xs text-slate-500 font-medium tracking-wide">Registro imutável de movimentações financeiras</Typography>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="PESQUISAR TRX ID OU CATEGORIA..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-emerald-500/50 transition-all text-[10px] font-black tracking-widest uppercase text-white placeholder:text-slate-600"
            />
          </div>
          
          <Button variant="ghost" size="sm" className="h-11 px-6 border border-slate-800 text-slate-400 font-bold tracking-widest uppercase text-[9px] rounded-xl flex items-center gap-3 hover:text-white transition-all">
            <Filter size={14} /> Filtros Avançados
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Temporalidade / ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Domínio / Ativo</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Classificação</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Montante (BRL)</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Governança</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {transactions.map((trx) => (
                <tr key={trx._id} className="hover:bg-slate-800/20 group transition-all duration-300">
                  <td className="px-8 py-6">
                    <Typography className="text-sm font-bold text-white mb-0.5">{new Date(trx.createdAt).toLocaleDateString('pt-BR')}</Typography>
                    <Typography className="text-[9px] font-black text-slate-500 uppercase tracking-widest">TRX-{trx._id.substring(trx._id.length - 8).toUpperCase()}</Typography>
                  </td>
                  <td className="px-8 py-6">
                    <Typography className="text-sm font-bold text-white uppercase tracking-tight">{trx.event}</Typography>
                    <Typography className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest">{trx.contract}</Typography>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{trx.category}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 font-black">
                      {trx.type === 'income' ? 
                        <ArrowUpRight size={14} className="text-emerald-500" /> : 
                        <ArrowDownRight size={14} className="text-rose-500" />
                      }
                      <span className={`text-sm ${trx.type === 'income' ? 'text-white' : 'text-slate-300'}`}>
                        R$ {trx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-[0_0_15px_rgba(0,0,0,0.2)] ${
                        trx.status === 'paid' 
                          ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' 
                          : 'bg-amber-500/5 text-amber-500 border-amber-500/10'
                      }`}>
                        {trx.status === 'paid' ? 'Liquidado' : 'Pendente'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-1 group-hover:translate-x-[-4px] transition-all">
                      <button className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all"><FileText size={16} /></button>
                      {canManage && (
                        <>
                          <button onClick={() => handleEdit(trx)} className="p-2 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-400/5 transition-all"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(trx._id)} className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-400/5 transition-all"><Trash2 size={16} /></button>
                        </>
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
              onClick={handleCloseModal}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl glass-card border-slate-700/50 shadow-[0_0_100px_rgba(16,185,129,0.1)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500" />
              
              <div className="p-8">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <Typography className="text-[10px] font-black tracking-[0.3em] text-emerald-500 uppercase mb-1">Registro de Caixa</Typography>
                    <Typography variant="h2" className="text-2xl font-black text-white uppercase tracking-tight">
                      {editingTrxId ? 'Atualizar Transação' : 'Nova Operação'}
                    </Typography>
                  </div>
                  <button 
                    onClick={handleCloseModal}
                    className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white transition-all hover:rotate-90"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveTransaction} className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Natureza</label>
                      <select 
                        value={formData.type} 
                        onChange={e => setFormData({...formData, type: e.target.value})}
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500/50 transition-all font-bold appearance-none cursor-pointer"
                      >
                        <option value="income">Entrada (Receita)</option>
                        <option value="expense">Saída (Despesa)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Montante (BRL)</label>
                      <input 
                        type="number" 
                        value={formData.amount || ''}
                        onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Classificação / Descrição</label>
                    <input 
                      type="text" 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500/50 transition-all font-bold uppercase placeholder:text-slate-700"
                      placeholder="EX: PAGAMENTO FATURA ENEL MAIO"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Vínculo de Ativo</label>
                      <select 
                        value={formData.eventId} 
                        onChange={e => setFormData({...formData, eventId: e.target.value})}
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500/50 transition-all font-bold appearance-none cursor-pointer"
                      >
                        <option value="">Geral / Desvinculado</option>
                        {events?.map(ev => <option key={ev._id} value={ev._id}>{ev.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Estado de Liquidação</label>
                      <select 
                        value={formData.status} 
                        onChange={e => setFormData({...formData, status: e.target.value})}
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500/50 transition-all font-bold appearance-none cursor-pointer"
                      >
                        <option value="paid">Confirmado / Liquidado</option>
                        <option value="pending">Aguardando Pagamento</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button 
                      variant="ghost" 
                      className="flex-1 h-14 border border-slate-800 text-slate-500 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-slate-800 hover:text-white transition-all"
                      onClick={handleCloseModal}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 h-14 btn-premium-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]"
                      loading={isSaving}
                    >
                      {editingTrxId ? 'Persistir Alterações' : 'Confirmar Lançamento'}
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

