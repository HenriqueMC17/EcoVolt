'use client';
import React, { useState, useMemo } from 'react';
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
  ArrowRight,
  TrendingUp,
  Activity,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useToast } from "@/shared/context/ToastContext";
import { Id } from "@convex/_generated/dataModel";
import { useUser } from '@/shared/context/UserContext';
import { Typography } from '@/shared/ui/typography';
import { Button } from '@/shared/ui/Button';

// --- Types & Constants ---

// --- Types & Constants ---

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
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
  }
};

const getStatusDetails = (status: string) => {
  switch (status) {
    case 'completed': return { color: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/10', label: 'Finalizado', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.1)]' };
    case 'active': return { color: 'text-blue-400', bg: 'bg-blue-500/5', border: 'border-blue-500/10', label: 'Operação Ativa', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.1)]' };
    case 'cancelled': return { color: 'text-rose-400', bg: 'bg-rose-500/5', border: 'border-rose-500/10', label: 'Descontinuado', glow: 'shadow-[0_0_20px_rgba(244,63,94,0.1)]' };
    case 'planning': return { color: 'text-amber-400', bg: 'bg-amber-500/5', border: 'border-amber-500/10', label: 'Planejamento', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.1)]' };
    default: return { color: 'text-slate-400', bg: 'bg-slate-500/5', border: 'border-slate-500/10', label: status, glow: '' };
  }
};

const getSizeFromAttendees = (attendees: number) => {
  if (attendees < 1000) return { label: 'Boutique', color: 'text-purple-400' };
  if (attendees < 5000) return { label: 'Standard', color: 'text-blue-400' };
  if (attendees < 15000) return { label: 'Enterprise', color: 'text-emerald-400' };
  return { label: 'Mega Event', color: 'text-rose-400' };
};

// --- Components ---

const StatCard = ({ title, value, icon: Icon, trend, color, glowColor }: any) => (
  <motion.div 
    variants={itemVariants}
    className="glass-card relative overflow-hidden group border-slate-800/50 hover:border-slate-700/50 transition-all duration-500"
  >
    {/* Animated background glow */}
    <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-br ${glowColor}`} />
    
    <div className="p-6 relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl bg-slate-900/50 border border-slate-800/50 text-slate-400 group-hover:text-white group-hover:border-slate-600 transition-all duration-500 shadow-xl group-hover:${glowColor.replace('from-', 'shadow-')}/20`}>
          <Icon size={22} className="group-hover:scale-110 transition-transform duration-500" />
        </div>
        {trend && (
          <div className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-emerald-400 bg-emerald-400/5 border border-emerald-400/10 px-3 py-1 rounded-full backdrop-blur-md">
            <TrendingUp size={12} />
            {trend}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <Typography className="text-[10px] font-black tracking-[0.25em] text-slate-500 uppercase">
          {title}
        </Typography>
        <div className="flex items-baseline gap-2">
          <Typography className="text-3xl font-bold text-white tracking-tighter">
            {value}
          </Typography>
        </div>
      </div>

      <div className={`mt-6 h-1 w-full bg-slate-800/50 rounded-full overflow-hidden`}>
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
        />
      </div>
    </div>
  </motion.div>
);

import { useRouter } from 'next/navigation';

export const Events: React.FC = () => {
  const router = useRouter();
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

  const stats = useMemo(() => {
    if (!events) return { total: 0, active: 0, consumption: 0, attendees: 0 };
    return {
      total: events.length,
      active: events.filter(e => e.status === 'active').length,
      consumption: events.reduce((acc, curr) => acc + (curr.estimatedConsumption || 0), 0),
      attendees: events.reduce((acc, curr) => acc + (curr.expectedAttendees || 0), 0),
    };
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events?.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.companyName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [events, searchQuery, statusFilter]);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10 pb-20"
    >
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full border-2 border-slate-950 bg-blue-500 flex items-center justify-center text-white shadow-lg">
                <Globe size={18} />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-slate-400 shadow-lg">
                <Activity size={18} />
              </div>
            </div>
            <Typography className="text-[10px] font-black tracking-[0.3em] text-blue-500 uppercase">
              Operations Center
            </Typography>
          </div>
          <Typography variant="h1" className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none">
            Managed <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Events</span>
          </Typography>
          <Typography variant="body" className="text-slate-400 font-medium tracking-wide max-w-xl">
            Orquestração de infraestrutura de alto impacto e eficiência energética para grandes operações.
          </Typography>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Button onClick={handleOpenCreate} className="btn-premium-primary h-14 px-10 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:shadow-[0_0_40px_rgba(59,130,246,0.25)] transition-all duration-500 group">
            <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-500" />
            Provisionar Operação
          </Button>
        </motion.div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Total de Operações" 
          value={stats.total} 
          icon={Globe} 
          color="from-blue-500 to-indigo-600"
          glowColor="from-blue-500/20"
        />
        <StatCard 
          title="Eventos em Atividade" 
          value={stats.active} 
          icon={Activity} 
          trend="+12%"
          color="from-emerald-500 to-teal-600"
          glowColor="from-emerald-500/20"
        />
        <StatCard 
          title="Consumo Estimado" 
          value={`${(stats.consumption / 1000).toFixed(1)} MWh`} 
          icon={Zap} 
          color="from-amber-500 to-orange-600"
          glowColor="from-amber-500/20"
        />
        <StatCard 
          title="Alcance de Público" 
          value={stats.attendees.toLocaleString()} 
          icon={Users} 
          color="from-purple-500 to-pink-600"
          glowColor="from-purple-500/20"
        />
      </div>

      {/* Action Bar */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-5 items-center bg-slate-900/40 backdrop-blur-2xl border border-slate-800/50 p-3 rounded-[2.5rem]">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por operação, local ou entidade..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/40 border border-slate-800/50 rounded-2xl py-4 pl-14 pr-4 text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all font-medium"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto pr-2">
          <div className="relative flex-1 md:w-64 group">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950/40 border border-slate-800/50 rounded-2xl py-4 pl-12 pr-10 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all appearance-none cursor-pointer font-medium"
            >
              <option value="all">Filtro: Global</option>
              <option value="planning">Status: Planejamento</option>
              <option value="active">Status: Em Operação</option>
              <option value="completed">Status: Finalizado</option>
              <option value="cancelled">Status: Descontinuado</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 group-hover:text-blue-400 transition-colors">
              <ArrowRight size={14} className="rotate-90" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid Content */}
      <div className="relative">
        {events === undefined ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 blur-[80px] rounded-full animate-pulse" />
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative" />
            </div>
            <div className="text-center space-y-2">
              <Typography className="text-white font-bold text-xl tracking-tight">Sincronizando Ecossistema</Typography>
              <Typography className="text-slate-500 font-black tracking-[0.4em] uppercase text-[10px]">Aguardando Resposta do Protocolo...</Typography>
            </div>
          </div>
        ) : filteredEvents?.length === 0 ? (
          <motion.div 
            variants={itemVariants}
            className="glass-card flex flex-col items-center justify-center py-40 text-center border-dashed border-slate-800/50"
          >
            <div className="w-28 h-28 bg-slate-900/50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-800/50 shadow-2xl relative group">
              <div className="absolute inset-0 bg-blue-500/5 blur-2xl rounded-full group-hover:bg-blue-500/10 transition-colors" />
              <Calendar className="w-12 h-12 text-slate-700 relative group-hover:text-slate-500 transition-colors" />
            </div>
            <Typography variant="h3" className="text-3xl font-bold text-white mb-3 tracking-tight">
              Nenhum Registro Localizado
            </Typography>
            <Typography className="text-slate-500 mb-10 max-w-sm mx-auto leading-relaxed font-medium">
              {searchQuery ? `Não existem operações vinculadas ao termo "${searchQuery}" nesta camada de dados.` : "O protocolo de eventos está vazio. Inicie um novo provisionamento para monitorar sua infraestrutura."}
            </Typography>
            {!searchQuery && (
              <Button onClick={handleOpenCreate} className="btn-premium-primary rounded-2xl h-14 px-10">
                Ativar Provisionamento
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredEvents?.map((event) => {
                const status = getStatusDetails(event.status);
                const size = getSizeFromAttendees(event.expectedAttendees);
                return (
                  <motion.div
                    key={event._id}
                    layout
                    variants={itemVariants}
                    whileHover={{ y: -10, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
                    className="glass-card group relative border border-slate-800/50 hover:border-blue-500/40 transition-all duration-700 overflow-hidden"
                  >
                    {/* Refined gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                    
                    <div className="p-10 space-y-10 relative z-10">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-6">
                          <div className="w-20 h-20 rounded-[2.5rem] bg-slate-900/80 flex items-center justify-center text-blue-400 border border-slate-800/50 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-all duration-700 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <Calendar size={32} className="relative group-hover:scale-110 transition-transform duration-700" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Globe size={12} className="text-slate-600" />
                              <Typography className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase">
                                {event.companyName}
                              </Typography>
                            </div>
                            <Typography variant="h3" className="text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all duration-500 tracking-tight">
                              {event.name}
                            </Typography>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                          <button 
                            onClick={() => handleOpenEdit(event)}
                            className="p-3.5 bg-slate-900/80 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 border border-slate-800/50 rounded-2xl transition-all shadow-xl"
                            title="Editar Operação"
                          >
                            <Edit size={20} />
                          </button>
                          <button 
                            onClick={() => handleDelete(event._id, event.companyId)}
                            className="p-3.5 bg-slate-900/80 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 border border-slate-800/50 rounded-2xl transition-all shadow-xl"
                            title="Descontinuar"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-slate-800/50">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-600 mb-1">
                            <MapPin size={14} />
                            <span className="text-[10px] font-black tracking-widest uppercase">Geolocal</span>
                          </div>
                          <span className="text-sm text-slate-200 font-bold tracking-tight line-clamp-1">{event.location}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-600 mb-1">
                            <Users size={14} />
                            <span className="text-[10px] font-black tracking-widest uppercase">Magnitude</span>
                          </div>
                          <span className={`text-sm font-bold tracking-tight ${size.color}`}>{size.label}</span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-amber-500/50 mb-1">
                            <Zap size={14} />
                            <span className="text-[10px] font-black tracking-widest uppercase">Provision</span>
                          </div>
                          <span className="text-sm text-white font-bold tracking-tight">{event.estimatedConsumption.toLocaleString()} kWh</span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-600 mb-1">
                            <Calendar size={14} />
                            <span className="text-[10px] font-black tracking-widest uppercase">Scheduled</span>
                          </div>
                          <span className="text-sm text-slate-200 font-bold tracking-tight">{new Date(event.startDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border ${status.border} ${status.bg} ${status.color} ${status.glow} backdrop-blur-md`}>
                          {status.label}
                        </div>
                        <button 
                          onClick={() => router.push(`/events/${event._id}`)}
                          className="h-12 px-8 rounded-2xl bg-slate-900/50 text-slate-400 text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-3 hover:bg-blue-500/10 hover:text-blue-400 border border-slate-800/50 hover:border-blue-500/30 transition-all group/btn shadow-xl"
                        >
                          Ver Dossier
                          <ArrowRight size={16} className="group-hover/btn:translate-x-1.5 transition-transform duration-500" />
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

      {/* Premium Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="relative w-full max-w-3xl bg-slate-900/80 border border-slate-700/50 rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden backdrop-blur-3xl"
            >
              {/* Modal Decorative Element */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="p-12 sm:p-16 relative z-10">
                <div className="flex items-start justify-between mb-16">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse" />
                      <Typography className="text-[10px] font-black tracking-[0.4em] text-blue-500 uppercase">
                        Protocol System v2.0
                      </Typography>
                    </div>
                    <Typography variant="h2" className="text-4xl font-bold text-white tracking-tight">
                      {isEditing ? 'Ajustar Operação' : 'Provisionar Operação'}
                    </Typography>
                    <Typography className="text-slate-400 font-medium tracking-wide">Configure os parâmetros técnicos para o novo ativo.</Typography>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-4 text-slate-500 hover:text-white hover:bg-slate-800/80 rounded-3xl transition-all border border-slate-800/50 shadow-2xl group"
                  >
                    <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Designação da Operação</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-950/40 border border-slate-800/50 rounded-[1.5rem] py-5 px-8 text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/40 transition-all font-bold text-lg placeholder-slate-700"
                      placeholder="Ex: Festival de Verão 2026"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Entidade Responsável</label>
                    <div className="relative group">
                      <select 
                        value={formData.companyId} 
                        onChange={e => setFormData({...formData, companyId: e.target.value as Id<"companies">})}
                        className="w-full bg-slate-950/40 border border-slate-800/50 rounded-[1.5rem] py-5 px-8 text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/40 transition-all appearance-none cursor-pointer font-bold"
                        required
                      >
                        <option value="">Selecione a Entidade</option>
                        {companies?.filter(c => c.type === 'client').map(company => (
                          <option key={company._id} value={company._id}>{company.name}</option>
                        ))}
                      </select>
                      <ArrowRight size={16} className="absolute right-8 top-1/2 -translate-y-1/2 rotate-90 text-slate-600 pointer-events-none group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Estado do Protocolo</label>
                    <div className="relative group">
                      <select 
                        value={formData.status} 
                        onChange={e => setFormData({...formData, status: e.target.value as any})}
                        className="w-full bg-slate-950/40 border border-slate-800/50 rounded-[1.5rem] py-5 px-8 text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/40 transition-all appearance-none cursor-pointer font-bold"
                        required
                      >
                        <option value="planning">Planejamento</option>
                        <option value="active">Operação Ativa</option>
                        <option value="completed">Finalizado</option>
                        <option value="cancelled">Descontinuado</option>
                      </select>
                      <ArrowRight size={16} className="absolute right-8 top-1/2 -translate-y-1/2 rotate-90 text-slate-600 pointer-events-none group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Início Scheduled</label>
                    <input 
                      type="date" 
                      value={formData.startDate}
                      onChange={e => setFormData({...formData, startDate: e.target.value})}
                      className="w-full bg-slate-950/40 border border-slate-800/50 rounded-[1.5rem] py-5 px-8 text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/40 transition-all font-bold"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Término Scheduled</label>
                    <input 
                      type="date" 
                      value={formData.endDate}
                      onChange={e => setFormData({...formData, endDate: e.target.value})}
                      className="w-full bg-slate-950/40 border border-slate-800/50 rounded-[1.5rem] py-5 px-8 text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/40 transition-all font-bold"
                      required
                    />
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Coordenadas / Localização</label>
                    <div className="relative">
                      <MapPin size={22} className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-600" />
                      <input 
                        type="text" 
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                        className="w-full bg-slate-950/40 border border-slate-800/50 rounded-[1.5rem] py-5 pl-20 pr-8 text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/40 transition-all font-bold placeholder-slate-700"
                        placeholder="Local exato da operação física"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Magnitude de Público</label>
                    <div className="relative">
                      <Users size={22} className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-600" />
                      <input 
                        type="number" 
                        value={formData.expectedAttendees || ''}
                        onChange={e => setFormData({...formData, expectedAttendees: Number(e.target.value)})}
                        className="w-full bg-slate-950/40 border border-slate-800/50 rounded-[1.5rem] py-5 pl-20 pr-8 text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/40 transition-all font-bold placeholder-slate-700"
                        placeholder="Qtd. Estimada"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Provision Energético (kWh)</label>
                    <div className="relative">
                      <Zap size={22} className="absolute left-8 top-1/2 -translate-y-1/2 text-amber-500/50" />
                      <input 
                        type="number" 
                        value={formData.estimatedConsumption || ''}
                        onChange={e => setFormData({...formData, estimatedConsumption: Number(e.target.value)})}
                        className="w-full bg-slate-950/40 border border-slate-800/50 rounded-[1.5rem] py-5 pl-20 pr-8 text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/40 transition-all font-bold placeholder-slate-700"
                        placeholder="Carga Prevista"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-6 md:col-span-2 pt-10">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 h-16 rounded-[1.5rem] border border-slate-800 text-slate-500 font-black tracking-[0.3em] uppercase text-[10px] hover:bg-slate-800/50 hover:text-white transition-all shadow-xl"
                    >
                      Descartar
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="flex-[2] h-16 btn-premium-primary disabled:opacity-50 shadow-[0_0_30px_rgba(59,130,246,0.2)]" 
                    >
                      {isSaving ? (
                        <span className="flex items-center justify-center gap-4">
                          <Loader2 size={24} className="animate-spin" />
                          Processando Protocolo...
                        </span>
                      ) : isEditing ? 'Confirmar Ajuste' : 'Ativar Provisionamento'}
                    </button>
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

