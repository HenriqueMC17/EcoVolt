import React, { useState } from 'react';
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
  Edit2
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

  if (transactions === undefined) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <Typography variant="h2" className="mb-2">Financeiro</Typography>
          <Typography variant="body" className="text-text-muted">Acompanhe o impacto financeiro da operação e fluxos de caixa.</Typography>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExportPDF} className="gap-2">
            <Download size={18} /> Exportar
          </Button>
          {canManage && (
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus size={18} /> Nova Transação
            </Button>
          )}
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Receita Total', value: financialStats?.totalIncome || 0, icon: Wallet, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'A Receber', value: financialStats?.totalPending || 0, icon: CreditCard, color: 'text-warning', bg: 'bg-warning/10' },
          { label: 'Despesas', value: financialStats?.totalExpenses || 0, icon: ArrowDownRight, color: 'text-secondary', bg: 'bg-secondary/10' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -4 }}
            className="glass-card p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              {i === 0 && <span className="px-2 py-1 rounded-lg bg-success/10 text-success text-[10px] font-bold">+12%</span>}
            </div>
            <Typography variant="small" className="text-text-muted mb-1">{stat.label}</Typography>
            <Typography variant="h3">R$ {stat.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Typography>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div className="glass-card p-6 h-[400px]">
        <Typography variant="h4" className="mb-8">Fluxo de Caixa Mensal</Typography>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={financialStats?.monthlyData || []}>
              <defs>
                <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} fontSize={12} />
              <YAxis stroke="#64748b" axisLine={false} tickLine={false} fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              />
              <Area type="monotone" dataKey="income" name="Receita" stroke="var(--primary)" fill="url(#colorInc)" strokeWidth={2} />
              <Area type="monotone" dataKey="expenses" name="Despesa" stroke="var(--secondary)" fill="url(#colorExp)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 items-center">
          <Typography variant="h4" className="mr-auto">Histórico de Transações</Typography>
          <div className="relative w-full md:w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 outline-none focus:border-primary transition-colors text-sm"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter size={18} /> Filtros
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/2 border-b border-white/5">
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase">Data / ID</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase">Evento</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase">Categoria</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase">Valor</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((trx) => (
                <tr key={trx._id} className="hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4">
                    <Typography variant="body" className="font-semibold">{new Date(trx.createdAt).toLocaleDateString('pt-BR')}</Typography>
                    <Typography variant="small" className="text-text-muted">TRX-{trx._id.substring(trx._id.length - 5).toUpperCase()}</Typography>
                  </td>
                  <td className="px-6 py-4">
                    <Typography variant="body" className="font-semibold">{trx.event}</Typography>
                    <Typography variant="small" className="text-primary">{trx.contract}</Typography>
                  </td>
                  <td className="px-6 py-4 text-sm">{trx.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {trx.type === 'income' ? <ArrowUpRight size={16} className="text-success" /> : <ArrowDownRight size={16} className="text-secondary" />}
                      <span className="font-bold">R$ {trx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      trx.status === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>
                      {trx.status === 'paid' ? 'Pago' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:text-text-muted transition-colors"><FileText size={18} /></button>
                      {canManage && (
                        <>
                          <button onClick={() => handleEdit(trx)} className="p-2 hover:text-primary transition-colors"><Edit2 size={18} /></button>
                          <button onClick={() => handleDelete(trx._id)} className="p-2 hover:text-error transition-colors"><Trash2 size={18} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="glass-card p-8 w-full max-w-lg border-white/10"
            >
              <div className="flex justify-between items-center mb-8">
                <Typography variant="h3">{editingTrxId ? 'Editar Transação' : 'Nova Transação'}</Typography>
                <button onClick={handleCloseModal} className="text-text-muted hover:text-white"><X size={24} /></button>
              </div>

              <form onSubmit={handleSaveTransaction} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase">Tipo</label>
                    <select 
                      value={formData.type} 
                      onChange={e => setFormData({...formData, type: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors appearance-none"
                    >
                      <option value="income">Entrada</option>
                      <option value="expense">Saída</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase">Valor (R$)</label>
                    <input 
                      type="number" 
                      value={formData.amount || ''}
                      onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase">Descrição</label>
                  <input 
                    type="text" 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                    placeholder="Ex: Pagamento Fornecedor"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase">Evento (Opcional)</label>
                    <select 
                      value={formData.eventId} 
                      onChange={e => setFormData({...formData, eventId: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary appearance-none"
                    >
                      <option value="">Geral</option>
                      {events?.map(ev => <option key={ev._id} value={ev._id}>{ev.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase">Status</label>
                    <select 
                      value={formData.status} 
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary appearance-none"
                    >
                      <option value="paid">Liquidado</option>
                      <option value="pending">Pendente</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" className="flex-1" onClick={handleCloseModal}>Cancelar</Button>
                  <Button type="submit" className="flex-1" loading={isSaving}>
                    {editingTrxId ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { Financial };
