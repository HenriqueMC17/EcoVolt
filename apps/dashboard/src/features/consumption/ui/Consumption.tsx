import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
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
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/shared/ui/Button';
import { Typography } from '@/shared/ui/Typography';

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

  if (consumptions === undefined) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  const chartData = consumptions.map(c => ({
    name: c.eventName,
    Previsto: c.predictedKwh,
    Realizado: c.actualKwh || 0
  })).slice(0, 5);

  const totalPrevisto = consumptions.reduce((acc, curr) => acc + curr.predictedKwh, 0);
  const totalRealizado = consumptions.reduce((acc, curr) => acc + (curr.actualKwh || 0), 0);
  const desvioGlobal = totalPrevisto > 0 ? ((totalRealizado - totalPrevisto) / totalPrevisto) * 100 : 0;
  const pendingOperations = consumptions.filter(c => c.actualKwh && !c.isReconciled && c.status !== 'Dentro da Tolerância').length;

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

  return (
    <div className="space-y-8">
      <header>
        <Typography variant="h2" className="mb-2">Consumo & Fechamento</Typography>
        <Typography variant="body" className="text-text-muted">
          Compare a operação planejada com a executada e gerencie os ajustes financeiros.
        </Typography>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          whileHover={{ y: -4 }}
          className="glass-card p-6 border-l-4 border-primary"
        >
          <Typography variant="small" className="text-text-muted mb-2">Total Previsto</Typography>
          <div className="flex items-baseline gap-2">
            <Typography variant="h3">{totalPrevisto.toFixed(1)}</Typography>
            <Typography variant="small" className="text-text-muted">kWh</Typography>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="glass-card p-6 border-l-4 border-secondary"
        >
          <Typography variant="small" className="text-text-muted mb-2">Total Realizado</Typography>
          <div className="flex items-baseline gap-2">
            <Typography variant="h3">{totalRealizado.toFixed(1)}</Typography>
            <Typography variant="small" className="text-text-muted">kWh</Typography>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className={`glass-card p-6 border-l-4 ${desvioGlobal > 0 ? 'border-error' : 'border-success'}`}
        >
          <Typography variant="small" className="text-text-muted mb-2">Desvio Global</Typography>
          <div className="flex items-center gap-3">
            {desvioGlobal > 0 ? <TrendingUp size={24} className="text-error" /> : <TrendingDown size={24} className="text-success" />}
            <Typography variant="h3" className={desvioGlobal > 0 ? 'text-error' : 'text-success'}>
              {desvioGlobal > 0 ? '+' : ''}{desvioGlobal.toFixed(1)}%
            </Typography>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className={`glass-card p-6 border-l-4 ${pendingOperations > 0 ? 'border-warning' : 'border-success'}`}
        >
          <Typography variant="small" className="text-text-muted mb-2">Pendentes</Typography>
          <div className="flex items-center gap-3">
            <AlertCircle size={24} className={pendingOperations > 0 ? "text-warning" : "text-success"} />
            <Typography variant="h3" className={pendingOperations > 0 ? 'text-warning' : 'text-success'}>
              {pendingOperations}
            </Typography>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <Typography variant="h4" className="mb-6">Previsto x Realizado por Evento</Typography>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" />
                <Bar dataKey="Previsto" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="Realizado" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Panel */}
        <div className="glass-card p-6 space-y-4">
          <Typography variant="h4" className="mb-2">Ações de Reconciliação</Typography>
          
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {consumptions.filter(c => c.actualKwh && !c.isReconciled && (c.status === 'Consumo Excedente' || c.status === 'Consumo Inferior')).map(c => (
              <div 
                key={c._id} 
                className={`p-4 rounded-xl border ${c.status === 'Consumo Excedente' ? 'bg-error/5 border-error/20' : 'bg-secondary/5 border-secondary/20'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {c.status === 'Consumo Excedente' ? 
                    <AlertCircle size={16} className="text-error" /> : 
                    <TrendingDown size={16} className="text-secondary" />
                  }
                  <Typography variant="small" className={`font-bold ${c.status === 'Consumo Excedente' ? 'text-error' : 'text-secondary'}`}>
                    {c.status === 'Consumo Excedente' ? 'Cobrança Adicional' : 'Reembolso Pendente'}
                  </Typography>
                </div>
                <Typography variant="small" className="text-text-muted mb-3 block">
                  {c.eventName}: {Math.abs(c.difference).toFixed(1)} kWh {c.status === 'Consumo Excedente' ? 'acima' : 'abaixo'} do previsto.
                </Typography>
                {isManagementRole && (
                  <Button 
                    variant="outline" 
                    className="w-full h-9 text-xs"
                    onClick={() => handleProcessReconciliation(c._id)}
                    loading={isProcessing === c._id}
                  >
                    {c.status === 'Consumo Excedente' ? 'Gerar Transação' : 'Aprovar Reembolso'}
                  </Button>
                )}
              </div>
            ))}

            {consumptions.filter(c => c.actualKwh && !c.isReconciled && c.status === 'Consumo Excedente' || c.status === 'Consumo Inferior').length === 0 && (
              <div className="text-center py-8 opacity-50">
                <CheckCircle2 size={32} className="mx-auto mb-2" />
                <Typography variant="small">Tudo em dia!</Typography>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <Typography variant="h4">Detalhamento por Operação</Typography>
          <Button variant="outline" size="sm" className="gap-2">
            <FileText size={16} /> Relatório
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/2 border-b border-white/5">
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase">Evento</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase">Previsto</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase">Realizado</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase">Desvio</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {consumptions.map((item) => (
                <tr key={item._id} className="hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4">
                    <Typography variant="body" className="font-semibold">{item.eventName}</Typography>
                  </td>
                  <td className="px-6 py-4">
                    <Typography variant="body">{item.predictedKwh.toFixed(1)} <span className="text-xs text-text-muted">kWh</span></Typography>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === item._id ? (
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          value={actualValue}
                          onChange={e => setActualValue(e.target.value)}
                          className="w-20 bg-black/20 border border-white/10 rounded px-2 py-1 text-sm outline-none focus:border-primary"
                          autoFocus
                        />
                        <Button size="sm" onClick={() => handleUpdateConsumption(item._id)} loading={isUpdating}>OK</Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>×</Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group">
                        <Typography variant="body" className={item.actualKwh ? '' : 'text-text-muted italic'}>
                          {item.actualKwh ? `${item.actualKwh.toFixed(1)} kWh` : 'Não medido'}
                        </Typography>
                        {isManagementRole && !item.actualKwh && (
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-7 px-2" onClick={() => setEditingId(item._id)}>
                            <Plus size={14} />
                          </Button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {item.actualKwh ? (
                      <span className={`font-bold ${item.difference > 0 ? 'text-error' : item.difference < 0 ? 'text-secondary' : 'text-success'}`}>
                        {item.difference > 0 ? '+' : ''}{item.difference.toFixed(1)}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4">
                    {item.actualKwh ? (
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'Dentro da Tolerância' ? 'bg-success/10 text-success' :
                        item.status === 'Consumo Excedente' ? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary'
                      }`}>
                        {item.status}
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-warning/10 text-warning">
                        Aguardando
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-3">
                      {item.actualKwh && item.status === 'Dentro da Tolerância' && !item.isReconciled && isManagementRole && (
                        <Button 
                          size="sm" 
                          className="h-8 gap-2"
                          onClick={() => handleProcessReconciliation(item._id)}
                          loading={isProcessing === item._id}
                        >
                          <CheckCircle2 size={14} /> Fechar
                        </Button>
                      )}
                      
                      {item.isReconciled && (
                        <span className="text-success flex items-center gap-1 text-xs font-bold">
                          <CheckCircle2 size={14} /> Finalizado
                        </span>
                      )}

                      {isManagementRole && (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleEditItem(item)} className="p-2 hover:text-primary transition-colors"><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteConsumption(item._id)} className="p-2 hover:text-error transition-colors"><Trash2 size={16} /></button>
                        </div>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="glass-card p-8 w-full max-w-md border-white/10"
            >
              <div className="flex justify-between items-center mb-8">
                <Typography variant="h3">Editar Medição</Typography>
                <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white"><Plus size={24} className="rotate-45" /></button>
              </div>

              <form onSubmit={handleSaveModal} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase">Previsto (kWh)</label>
                  <input 
                    type="number" 
                    value={modalFormData.predictedKwh}
                    onChange={e => setModalFormData({...modalFormData, predictedKwh: parseFloat(e.target.value)})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase">Realizado (kWh)</label>
                  <input 
                    type="number" 
                    value={modalFormData.actualKwh}
                    onChange={e => setModalFormData({...modalFormData, actualKwh: parseFloat(e.target.value)})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                  <Button type="submit" className="flex-1" loading={isUpdating}>Salvar</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { Consumption };
