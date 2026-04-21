import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Plus, 
  MapPin, 
  Users, 
  Zap, 
  Edit, 
  Trash2, 
  X,
  Loader2,
  Filter,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useToast } from "@/context/ToastContext";
import { Id } from "@/../convex/_generated/dataModel";
import { useUser } from '@/context/UserContext';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';

const getStatusDetails = (status: string) => {
  switch (status) {
    case 'completed': return { color: 'text-green-400', bg: 'bg-green-400/10', label: 'Finalizado' };
    case 'active': return { color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Ativo' };
    case 'cancelled': return { color: 'text-red-400', bg: 'bg-red-400/10', label: 'Cancelado' };
    case 'planning': return { color: 'text-slate-400', bg: 'bg-slate-400/10', label: 'Planejamento' };
    default: return { color: 'text-white', bg: 'bg-white/10', label: status };
  }
};

const getSizeFromAttendees = (attendees: number) => {
  if (attendees < 1000) return 'Pequeno';
  if (attendees < 5000) return 'Médio';
  if (attendees < 15000) return 'Grande';
  return 'Extra G';
};

export const Events: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useUser();
  const events = useQuery(api.events.getEvents, { 
    userEmail: user?.email || undefined 
  });
  const companies = useQuery(api.companies.getCompanies);
  
  const createEvent = useMutation(api.events.createEvent);
  const updateEvent = useMutation(api.events.updateEvent);
  const removeEvent = useMutation(api.events.removeEvent);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<Id<"events"> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [formData, setFormData] = useState({
    name: '',
    status: 'planning' as 'planning' | 'active' | 'completed' | 'cancelled',
    startDate: '',
    endDate: '',
    location: '',
    expectedAttendees: 0,
    estimatedConsumption: 0,
    companyId: '' as Id<"companies"> | ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      status: 'planning',
      startDate: '',
      endDate: '',
      location: '',
      expectedAttendees: 0,
      estimatedConsumption: 0,
      companyId: user?.companyId || '' as any
    });
    setIsEditing(false);
    setCurrentEventId(null);
  };

  const handleOpenCreate = () => {
    if (user?.role !== 'event_company' && user?.role !== 'admin') {
      showToast('Apenas organizadores podem criar eventos.', 'error');
      return;
    }
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: any) => {
    if (user?.role !== 'admin' && user?.companyId !== event.companyId) {
      showToast('Você não tem permissão para editar este evento.', 'error');
      return;
    }
    setFormData({
      name: event.name,
      status: event.status,
      startDate: new Date(event.startDate).toISOString().split('T')[0],
      endDate: new Date(event.endDate).toISOString().split('T')[0],
      location: event.location,
      expectedAttendees: event.expectedAttendees,
      estimatedConsumption: event.estimatedConsumption,
      companyId: event.companyId
    });
    setIsEditing(true);
    setCurrentEventId(event._id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyId || !user?.email) {
      showToast('Por favor, verifique os dados.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
        status: formData.status,
        startDate: new Date(formData.startDate).getTime(),
        endDate: new Date(formData.endDate).getTime(),
        location: formData.location,
        expectedAttendees: Number(formData.expectedAttendees),
        estimatedConsumption: Number(formData.estimatedConsumption),
        companyId: formData.companyId as Id<"companies">,
        userEmail: user.email
      };

      if (isEditing && currentEventId) {
        await updateEvent({ eventId: currentEventId, ...payload });
        showToast('Evento atualizado com sucesso!', 'success');
      } else {
        await createEvent(payload);
        showToast('Evento criado com sucesso!', 'success');
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error: any) {
      showToast(error.message || 'Erro ao salvar evento.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: Id<"events">, eventCompanyId: string) => {
    if (user?.role !== 'admin' && user?.companyId !== eventCompanyId) {
      showToast('Você não tem permissão para excluir este evento.', 'error');
      return;
    }
    if (window.confirm("Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.")) {
      try {
        await removeEvent({ 
          eventId: id,
          userEmail: user!.email
        });
        showToast('Evento excluído com sucesso!', 'success');
      } catch (error: any) {
        showToast(error.message || 'Erro ao excluir evento.', 'error');
      }
    }
  };

  const filteredEvents = events?.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Typography variant="h2" className="text-3xl font-bold tracking-tight text-white">
            Gerenciamento de Eventos
          </Typography>
          <Typography variant="body" className="text-slate-400 mt-1">
            Planejamento e infraestrutura energética de elite.
          </Typography>
        </div>
        <Button onClick={handleOpenCreate} className="btn-premium-primary">
          <Plus className="w-5 h-5 mr-2" />
          Novo Evento
        </Button>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar eventos..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-10 pr-8 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
            >
              <option value="all">Todos os Status</option>
              <option value="planning">Planejamento</option>
              <option value="active">Ativo</option>
              <option value="completed">Finalizado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {events === undefined ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <Typography className="text-slate-400">Carregando eventos...</Typography>
          </div>
        ) : filteredEvents?.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
              <Calendar className="w-10 h-10 text-slate-600" />
            </div>
            <Typography variant="h3" className="text-xl font-semibold text-white mb-2">
              Nenhum evento encontrado
            </Typography>
            <Typography className="text-slate-400 mb-8 max-w-sm mx-auto">
              {searchQuery ? `Não encontramos resultados para "${searchQuery}"` : "Você ainda não possui eventos cadastrados em sua conta."}
            </Typography>
            {!searchQuery && (
              <Button onClick={handleOpenCreate} variant="secondary">
                Criar o primeiro evento
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredEvents?.map((event) => {
                const status = getStatusDetails(event.status);
                return (
                  <motion.div
                    key={event._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -4 }}
                    className="glass-card group overflow-hidden border border-slate-800 hover:border-blue-500/30 transition-all duration-300"
                  >
                    <div className="p-6 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                            <Calendar size={24} />
                          </div>
                          <div>
                            <Typography variant="h3" className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                              {event.name}
                            </Typography>
                            <Typography className="text-xs text-slate-500 mt-0.5">
                              Empresa: <span className="text-slate-300 font-medium">{event.companyName}</span>
                            </Typography>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenEdit(event)}
                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(event._id, event.companyId)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-4 gap-x-6 py-4 border-y border-slate-800/50">
                        <div className="flex items-center gap-3 text-slate-400">
                          <MapPin size={16} className="text-slate-500" />
                          <span className="text-sm truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                          <Users size={16} className="text-slate-500" />
                          <span className="text-sm">Porte: {getSizeFromAttendees(event.expectedAttendees)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-blue-400 font-medium">
                          <Zap size={16} />
                          <span className="text-sm">{event.estimatedConsumption.toLocaleString()} kWh</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                          <Calendar size={16} className="text-slate-500" />
                          <span className="text-sm">{new Date(event.startDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.color} border border-current/10`}>
                          {status.label}
                        </div>
                        <button className="text-blue-400 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all group/btn">
                          Ver Detalhes
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <Typography variant="h3" className="text-xl font-bold text-white">
                      {isEditing ? 'Editar Evento' : 'Novo Evento'}
                    </Typography>
                    <Typography className="text-sm text-slate-400 mt-1">
                      Configure os detalhes técnicos do seu evento.
                    </Typography>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nome do Evento</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                      placeholder="Ex: Conference EcoVolt 2026"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Organizador</label>
                      <select 
                        value={formData.companyId} 
                        onChange={e => setFormData({...formData, companyId: e.target.value as Id<"companies">})}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Selecione...</option>
                        {companies?.filter(c => c.type === 'client').map(company => (
                          <option key={company._id} value={company._id}>{company.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                      <select 
                        value={formData.status} 
                        onChange={e => setFormData({...formData, status: e.target.value as any})}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                        required
                      >
                        <option value="planning">Planejamento</option>
                        <option value="active">Ativo</option>
                        <option value="completed">Finalizado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Início</label>
                      <input 
                        type="date" 
                        value={formData.startDate}
                        onChange={e => setFormData({...formData, startDate: e.target.value})}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Término</label>
                      <input 
                        type="date" 
                        value={formData.endDate}
                        onChange={e => setFormData({...formData, endDate: e.target.value})}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Localização</label>
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                      placeholder="Local ou Endereço do evento"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Público</label>
                      <input 
                        type="number" 
                        value={formData.expectedAttendees || ''}
                        onChange={e => setFormData({...formData, expectedAttendees: Number(e.target.value)})}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                        placeholder="Ex: 50000"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Consumo (kWh)</label>
                      <input 
                        type="number" 
                        value={formData.estimatedConsumption || ''}
                        onChange={e => setFormData({...formData, estimatedConsumption: Number(e.target.value)})}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                        placeholder="Ex: 15000"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="flex-1 border border-slate-700 hover:bg-slate-800"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 btn-premium-primary" 
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <span className="flex items-center gap-2">
                          <Loader2 size={18} className="animate-spin" />
                          Salvando...
                        </span>
                      ) : isEditing ? 'Salvar Alterações' : 'Criar Evento'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
