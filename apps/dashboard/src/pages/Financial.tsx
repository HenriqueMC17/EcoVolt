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
import { api } from "../../convex/_generated/api";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useUser } from '../context/UserContext';


const Financial: React.FC = () => {
  const { user } = useUser();
  const userEmail = user?.email || "";
  
  const transactions = useQuery(api.financials.getFinancials, { userEmail });
  const financialStats = useQuery(api.financials.getFinancialStats, { userEmail });
  const events = useQuery(api.events.getEvents, { userEmail });
  const contracts = useQuery(api.contracts.getContracts, { userEmail });
  
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

  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || formData.amount <= 0) {
      alert("Por favor, preencha os campos obrigatórios corretamente.");
      return;
    }

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
      } else {
        await createTransaction({
          userEmail,
          type: formData.type as "income" | "expense",
          category: formData.category,
          amount: formData.amount,
          status: formData.status as any,
          dueDate: Date.now() + 86400000 * 5, // 5 days from now
          eventId: formData.eventId || undefined,
          contractId: formData.contractId || undefined,
        });
      }

      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert(editingTrxId ? "Erro ao atualizar transação." : "Erro ao criar transação.");
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
    if (!confirm("Tem certeza que deseja excluir esta transação?")) return;
    
    try {
      await removeFinancial({ userEmail, id });
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir transação.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTrxId(null);
    setFormData({ type: 'income', category: '', amount: 0, status: 'pending', eventId: '', contractId: '' });
  };

  const totalIncome = financialStats?.totalIncome || 0;
  const totalPending = financialStats?.totalPending || 0;
  const totalExpenses = financialStats?.totalExpenses || 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>Financeiro</h2>
          <p style={{ color: 'var(--text-muted)' }}>Acompanhe o impacto financeiro da operação, faturamentos e reembolsos.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline">
            <Download size={18} />
            Exportar
          </button>
          {canManage && (
            <button className="btn btn-primary" onClick={() => { setEditingTrxId(null); setIsModalOpen(true); }}>
              <Plus size={18} />
              Nova Transação
            </button>
          )}
        </div>
      </header>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <div className="card glass" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={24} />
            </div>
            <span className="badge badge-success">+12%</span>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Receita Total (Liquidada)</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700 }}>R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>

        <div className="card glass" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={24} />
            </div>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>A Receber (Pendentes)</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700 }}>R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>

        <div className="card glass" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowDownRight size={24} />
            </div>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Despesas / Reembolsos</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700 }}>R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="card" style={{ marginBottom: '32px', height: '350px', display: 'flex', flexDirection: 'column' }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '24px' }}>Fluxo de Caixa (Mensal)</h4>
        <div style={{ flex: 1 }}>
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
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ fontSize: '0.85rem' }}
              />
              <Area type="monotone" dataKey="income" name="Receita" stroke="var(--primary)" fillOpacity={1} fill="url(#colorInc)" strokeWidth={2} />
              <Area type="monotone" dataKey="expenses" name="Despesa" stroke="var(--secondary)" fillOpacity={1} fill="url(#colorExp)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginRight: 'auto' }}>Histórico de Transações</h4>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Buscar transação..." 
              style={{ width: '100%', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px 8px 40px', color: 'white', outline: 'none' }}
            />
          </div>
          <button className="btn btn-outline" style={{ padding: '8px 16px' }}>
            <Filter size={18} /> Filtros
          </button>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>DATA / ID</th>
              <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>EVENTO / CONTRATO</th>
              <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>TIPO</th>
              <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>VALOR</th>
              <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>STATUS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center' }}>{canManage ? 'NF / AÇÕES' : 'NF'}</th>
            </tr>
          </thead>
          <tbody>
            {transactions === undefined ? (
              <tr>
                <td colSpan={6} style={{ padding: '48px', textAlign: 'center' }}>
                  <Loader2 className="animate-spin" size={24} color="var(--primary)" style={{ margin: '0 auto' }} />
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Nenhuma transação encontrada.
                </td>
              </tr>
            ) : transactions.map((trx) => (
              <tr key={trx._id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                <td style={{ padding: '16px 24px' }}>
                  <p style={{ fontWeight: 600 }}>{new Date(trx.createdAt).toLocaleDateString('pt-BR')}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    TRX-{trx._id.substring(trx._id.length - 5).toUpperCase()}
                  </p>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <p style={{ fontWeight: 600 }}>{trx.event}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{trx.contract}</p>
                </td>
                <td style={{ padding: '16px 24px', fontSize: '0.9rem' }}>{trx.category}</td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {trx.type === 'income' ? 
                      <ArrowUpRight size={16} color="var(--success)" /> : 
                      <ArrowDownRight size={16} color="var(--secondary)" />
                    }
                    <span style={{ fontWeight: 700 }}>
                      R$ {trx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span className={`badge ${trx.status === 'paid' ? 'badge-success' : trx.status === 'pending' ? 'badge-warning' : 'badge-error'}`}>
                    {trx.status === 'paid' ? 'Pago' : trx.status === 'pending' ? 'Pendente' : 'Cancelado/Vencido'}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Ver NF">
                      <FileText size={18} />
                    </button>
                    {canManage && (
                      <>
                        <button 
                          onClick={() => handleEdit(trx)}
                          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }} 
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(trx._id)}
                          style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }} 
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Nova Transação */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card glass"
              style={{ width: '100%', maxWidth: '500px', border: '1px solid var(--border)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{editingTrxId ? 'Editar Transação' : 'Nova Transação'}</h3>
                <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tipo</label>
                    <select 
                      value={formData.type} 
                      onChange={e => setFormData({...formData, type: e.target.value})}
                      className="glass"
                      style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                    >
                      <option value="income">Receita (Entrada)</option>
                      <option value="expense">Despesa (Saída)</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Valor (R$)</label>
                    <input 
                      type="number" 
                      value={formData.amount || ''}
                      onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                      className="glass"
                      style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                      placeholder="Ex: 1500.00"
                      required
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Categoria / Descrição</label>
                  <input 
                    type="text" 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="glass"
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                    placeholder="Ex: Sinal do Contrato 30%"
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Evento Associado (Opcional)</label>
                  <select 
                    value={formData.eventId} 
                    onChange={e => setFormData({...formData, eventId: e.target.value})}
                    className="glass"
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                  >
                    <option value="">Nenhum / Geral</option>
                    {events?.map(ev => (
                      <option key={ev._id} value={ev._id}>{ev.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status</label>
                  <select 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="glass"
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                  >
                    <option value="paid">Pago / Liquidado</option>
                    <option value="pending">Pendente / A Receber</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <button type="button" className="btn btn-outline" onClick={handleCloseModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSaving}>
                    {isSaving ? 'Salvando...' : editingTrxId ? 'Atualizar Transação' : 'Adicionar Transação'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Financial;
