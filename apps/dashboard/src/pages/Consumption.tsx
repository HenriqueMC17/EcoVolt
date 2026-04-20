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
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Consumo Inferior': return <span className="badge badge-info">{status}</span>;
    case 'Consumo Excedente': return <span className="badge badge-error">{status}</span>;
    case 'Dentro da Tolerância': return <span className="badge badge-success">{status}</span>;
    default: return <span className="badge">{status}</span>;
  }
};

const Consumption: React.FC = () => {
  const { user } = useUser();
  const { showToast } = useToast();
  
  const consumptions = useQuery(api.consumptions.getConsumptions, {
    userEmail: user?.email || undefined
  });
  
  const events = useQuery(api.events.getEvents, {
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
    return <div style={{ padding: '40px', textAlign: 'center' }}><Loader2 className="spin" size={32} /></div>;
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
      console.error(error);
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
      console.error(error);
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
      console.error(error);
      showToast(error.message || "Erro ao excluir medição.", "error");
    }
  };

  const handleEditItem = (item: any) => {
    if (!isManagementRole) {
      showToast("Apenas administradores ou operadores podem editar medições.", "error");
      return;
    }
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
      console.error(error);
      showToast(error.message || "Erro ao atualizar medição.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>Consumo & Fechamento</h2>
        <p style={{ color: 'var(--text-muted)' }}>Compare a operação planejada com a executada e gerencie os ajustes financeiros.</p>
      </header>

      {/* Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <div className="card glass">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Total Previsto (Global)</p>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700 }}>{totalPrevisto.toFixed(1)} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>kWh</span></h3>
        </div>
        <div className="card glass">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Total Realizado (Global)</p>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700 }}>{totalRealizado.toFixed(1)} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>kWh</span></h3>
        </div>
        <div className="card glass" style={{ borderLeft: `4px solid ${desvioGlobal > 0 ? 'var(--error)' : desvioGlobal < 0 ? 'var(--secondary)' : 'var(--success)'}` }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Desvio Global</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {desvioGlobal > 0 ? <TrendingUp size={24} color="var(--error)" /> : <TrendingDown size={24} color="var(--secondary)" />}
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: desvioGlobal > 0 ? 'var(--error)' : 'var(--secondary)' }}>
              {desvioGlobal > 0 ? '+' : ''}{desvioGlobal.toFixed(1)}%
            </h3>
          </div>
        </div>
        <div className="card glass" style={{ borderLeft: pendingOperations > 0 ? '4px solid var(--warning)' : '4px solid var(--success)' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Operações Pendentes</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={24} color={pendingOperations > 0 ? "var(--warning)" : "var(--success)"} />
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: pendingOperations > 0 ? 'var(--warning)' : 'var(--success)' }}>{pendingOperations}</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Main Chart */}
        <div className="card">
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '24px' }}>Previsto x Realizado por Evento (kWh)</h4>
          <div style={{ height: '300px' }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="Previsto" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Realizado" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>Sem dados para exibir</div>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="card glass" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Ações de Reconciliação</h4>
          
          {consumptions.filter(c => c.actualKwh && !c.isReconciled && c.status === 'Consumo Excedente').map(c => (
            <div key={c._id} style={{ background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '16px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <AlertCircle size={18} color="var(--error)" />
                <strong style={{ color: '#fb7185' }}>Cobrança Adicional</strong>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                O evento "{c.eventName}" ultrapassou a tolerância em {c.difference.toFixed(1)} kWh.
              </p>
              {isManagementRole && (
                <button 
                  className="btn btn-outline" 
                  style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(244, 63, 94, 0.5)', color: '#fb7185' }}
                  onClick={() => handleProcessReconciliation(c._id)}
                  disabled={isProcessing === c._id}
                >
                  {isProcessing === c._id ? <Loader2 className="spin" size={16} /> : 'Gerar Transação'}
                </button>
              )}
            </div>
          ))}

          {consumptions.filter(c => c.actualKwh && !c.isReconciled && c.status === 'Consumo Inferior').map(c => (
            <div key={c._id} style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '16px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <TrendingDown size={18} color="var(--secondary)" />
                <strong style={{ color: '#60a5fa' }}>Reembolso Pendente</strong>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                O evento "{c.eventName}" consumiu {Math.abs(c.difference).toFixed(1)} kWh abaixo do previsto.
              </p>
              {isManagementRole && (
                <button 
                  className="btn btn-outline" 
                  style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(59, 130, 246, 0.5)', color: '#60a5fa' }}
                  onClick={() => handleProcessReconciliation(c._id)}
                  disabled={isProcessing === c._id}
                >
                  {isProcessing === c._id ? <Loader2 className="spin" size={16} /> : 'Aprovar Reembolso'}
                </button>
              )}
            </div>
          ))}

          {consumptions.length === 0 || consumptions.every(c => !c.actualKwh || c.isReconciled || c.status === 'Dentro da Tolerância') ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: '20px' }}>Nenhuma ação pendente.</p>
          ) : null}
        </div>
      </div>

      {/* Details Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Detalhamento por Operação</h4>
          <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
            <FileText size={16} /> Relatório Completo
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>EVENTO</th>
              <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>PREVISTO (kWh)</th>
              <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>REALIZADO (kWh)</th>
              <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>DESVIO</th>
              <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>STATUS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>AÇÃO / GESTÃO</th>
            </tr>
          </thead>
          <tbody>
            {consumptions.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Nenhuma medição encontrada.</td>
              </tr>
            ) : consumptions.map((item) => (
              <tr key={item._id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                <td style={{ padding: '16px 24px' }}>
                  <p style={{ fontWeight: 600 }}>{item.eventName}</p>
                </td>
                <td style={{ padding: '16px 24px', fontWeight: 500 }}>{item.predictedKwh.toFixed(1)}</td>
                <td style={{ padding: '16px 24px', fontWeight: 500 }}>
                  {editingId === item._id ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="number" 
                        value={actualValue}
                        onChange={e => setActualValue(e.target.value)}
                        style={{ width: '80px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px', padding: '4px' }}
                        disabled={isUpdating}
                      />
                      <button 
                        onClick={() => handleUpdateConsumption(item._id)} 
                        className="btn btn-primary" 
                        style={{ padding: '4px 8px' }}
                        disabled={isUpdating}
                      >
                        {isUpdating ? <Loader2 className="spin" size={14} /> : 'Salvar'}
                      </button>
                      <button 
                        onClick={() => { setEditingId(null); }} 
                        className="btn btn-outline" 
                        style={{ padding: '4px 8px' }}
                        disabled={isUpdating}
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {item.actualKwh ? item.actualKwh.toFixed(1) : '-'}
                      {!item.actualKwh && isManagementRole && (
                        <button onClick={() => setEditingId(item._id)} className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.7rem' }}>Inserir</button>
                      )}
                    </div>
                  )}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  {item.actualKwh ? (
                    <span style={{ 
                      color: item.difference > 0 ? 'var(--error)' : item.difference < 0 ? 'var(--secondary)' : 'var(--success)',
                      fontWeight: 700
                    }}>
                      {item.difference > 0 ? '+' : ''}{item.difference.toFixed(1)}
                    </span>
                  ) : '-'}
                </td>
                <td style={{ padding: '16px 24px' }}>{item.actualKwh ? getStatusBadge(item.status) : <span className="badge badge-warning">Aguardando Medição</span>}</td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {item.actualKwh && item.status === 'Dentro da Tolerância' && !item.isReconciled && isManagementRole && (
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                        onClick={() => handleProcessReconciliation(item._id)}
                        disabled={isProcessing === item._id}
                      >
                        {isProcessing === item._id ? <Loader2 className="spin" size={16} /> : <><CheckCircle2 size={16} /> Fechar</>}
                      </button>
                    )}
                    
                    {item.isReconciled ? (
                      <span className="badge badge-success">Finalizada</span>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.action}</span>
                    )}

                    {isManagementRole && (
                      <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                        <button onClick={() => handleEditItem(item)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }} title="Editar"><Edit2 size={18} /></button>
                        <button onClick={() => handleDeleteConsumption(item._id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }} title="Excluir"><Trash2 size={18} /></button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal Editar Medição */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card glass"
            style={{ width: '100%', maxWidth: '450px', border: '1px solid var(--border)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Editar Medição</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <Plus size={20} style={{ transform: 'rotate(45deg)' }} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Consumo Previsto (kWh)</label>
                <input 
                  type="number" 
                  value={modalFormData.predictedKwh}
                  onChange={e => setModalFormData({...modalFormData, predictedKwh: parseFloat(e.target.value)})}
                  className="glass"
                  style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Consumo Realizado (kWh)</label>
                <input 
                  type="number" 
                  value={modalFormData.actualKwh}
                  onChange={e => setModalFormData({...modalFormData, actualKwh: parseFloat(e.target.value)})}
                  className="glass"
                  style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                  placeholder="Ainda não medido"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={isUpdating}>
                  {isUpdating ? 'Salvando...' : 'Atualizar Medição'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Consumption;
