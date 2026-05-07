"use client";
import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Plus, 
  Mail, 
  X, 
  Loader2,
  Trash2,
  Edit,
  Lock,
  Globe,
  Briefcase,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useToast } from '@/shared/context/ToastContext';
import { useUser } from '@/shared/context/UserContext';
import { Button } from '@/shared/ui/Button';
import { Typography } from '@/shared/ui/typography';

// --- Constants & Animations ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const StatCard = ({ title, value, icon: Icon, color, glowColor, label }: any) => (
  <motion.div 
    variants={itemVariants}
    className="glass-card relative overflow-hidden group border-white/5 hover:border-primary/20 transition-all duration-700"
  >
    <div className="absolute inset-0 scanline opacity-[0.02] pointer-events-none" />
    <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-br ${glowColor}`} />
    
    <div className="p-10 relative z-10">
      <div className="flex justify-between items-start mb-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
            <Typography className="text-[9px] font-black tracking-[0.4em] text-slate-500 uppercase italic">
              {label || 'TELEMETRY_NODE'}
            </Typography>
          </div>
          <Typography className="text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase italic">
            {title}
          </Typography>
        </div>
        <div className={`p-5 rounded-2xl bg-slate-950 border border-white/10 text-slate-500 group-hover:text-primary group-hover:border-primary/40 transition-all duration-700 shadow-2xl relative overflow-hidden`}>
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Icon size={24} className="group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 relative z-10" />
        </div>
      </div>
      
      <div className="flex items-baseline gap-4">
        <Typography className="text-5xl font-black text-white tracking-tighter italic">
          {value}
        </Typography>
        <div className="flex gap-0.5">
          <div className="w-1 h-4 bg-primary/40" />
          <div className="w-1 h-4 bg-primary/20" />
        </div>
      </div>

      <div className="mt-10 flex items-center gap-4">
        <div className="h-[2px] flex-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 2, ease: "circOut", delay: 0.5 }}
            className={`h-full bg-gradient-to-r ${color} rounded-full`}
          />
        </div>
        <Typography className="text-[8px] font-black text-slate-600 tracking-widest uppercase">
          LIVE_SYNC
        </Typography>
      </div>
    </div>
  </motion.div>
);

export const Management: React.FC = () => {
  const { user } = useUser();
  const userEmail = user?.email || "";
  
  const companies = useQuery(api.companies.getCompanies, { userEmail });
  const users = useQuery(api.users.getUsers, { userEmail });
  const { showToast } = useToast();

  const createCompany = useMutation(api.companies.createCompany);
  const updateCompany = useMutation(api.companies.updateCompany);
  const removeCompany = useMutation(api.companies.removeCompany);
  
  const createUser = useMutation(api.users.createUser);
  const updateUser = useMutation(api.users.updateUser);
  const removeUser = useMutation(api.users.removeUser);

  const [activeTab, setActiveTab] = useState<'companies' | 'users'>('companies');
  const [isCompanyModalOpen, setCompanyModalOpen] = useState(false);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';

  // Form states
  const [companyForm, setCompanyForm] = useState({
    name: '',
    type: 'client' as 'client' | 'provider',
    cnpj: '',
    status: 'active' as 'active' | 'inactive',
    region: '',
    category: ''
  });

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'event_company' as any,
    companyId: ''
  });

  if (!isAdmin) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[70vh] p-10 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 scanline opacity-[0.05] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-rose-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-500/5 blur-[200px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 space-y-12 max-w-2xl">
          <div className="relative inline-block">
            <motion.div 
              animate={{ 
                boxShadow: ['0 0 40px rgba(244,63,94,0.2)', '0 0 80px rgba(244,63,94,0.5)', '0 0 40px rgba(244,63,94,0.2)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-40 h-40 rounded-[3rem] bg-slate-950 border-2 border-rose-500/40 flex items-center justify-center text-rose-500 relative"
            >
              <Lock size={72} strokeWidth={1.5} className="animate-pulse" />
              <div className="absolute inset-0 bg-rose-500/10 blur-3xl rounded-full" />
            </motion.div>
            <div className="absolute -bottom-4 -right-4 w-14 h-14 rounded-2xl bg-rose-600 flex items-center justify-center text-white border-[6px] border-slate-950 shadow-2xl">
              <ShieldCheck size={28} />
            </div>
          </div>
          
          <div className="space-y-6">
            <Typography variant="h1" className="text-5xl font-black tracking-tighter text-white uppercase italic leading-none">
              TERMINAL <span className="text-rose-500 drop-shadow-[0_0_20px_rgba(244,63,94,0.6)]">LOCKED</span>
            </Typography>
            <div className="flex items-center justify-center gap-4 text-rose-500/60 mb-8">
              <div className="h-px w-12 bg-current" />
              <span className="text-[10px] font-black tracking-[0.5em] uppercase">Security_Override_Active</span>
              <div className="h-px w-12 bg-current" />
            </div>
            <Typography className="text-slate-400 font-bold leading-relaxed text-lg max-w-xl mx-auto italic">
              Esta seção contém protocolos de governança de alta prioridade. Seu perfil atual não possui as credenciais "root" necessárias para modificação da rede.
            </Typography>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="h-18 px-12 rounded-3xl bg-slate-900 border border-white/10 text-white font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl hover:bg-slate-800 transition-all italic"
          >
            Purge Attempt & Return
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const handleOpenCompanyEdit = (company: any) => {
    setEditingCompanyId(company._id);
    setCompanyForm({
      name: company.name,
      type: company.type,
      cnpj: company.cnpj || '',
      status: company.status,
      region: company.region || '',
      category: company.category || ''
    });
    setCompanyModalOpen(true);
  };

  const handleOpenUserEdit = (user: any) => {
    setEditingUserId(user._id);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId || ''
    });
    setUserModalOpen(true);
  };

  const handleSubmitCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyForm.name) {
      showToast('O nome da empresa é obrigatório', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCompanyId) {
        await updateCompany({
          userEmail,
          id: editingCompanyId as any,
          ...companyForm,
        });
        showToast('Matriz corporativa atualizada.', 'success');
      } else {
        await createCompany({
          userEmail,
          ...companyForm,
        });
        showToast('Nova entidade registrada na rede.', 'success');
      }
      setCompanyModalOpen(false);
      setEditingCompanyId(null);
      setCompanyForm({ name: '', type: 'client', cnpj: '', status: 'active', region: '', category: '' });
    } catch (err) {
      showToast('Falha na operação de registro.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) {
      showToast('Credenciais incompletas.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingUserId) {
        await updateUser({
          userEmail,
          id: editingUserId as any,
          ...userForm,
          companyId: userForm.companyId ? (userForm.companyId as any) : undefined
        });
        showToast('Perfil de usuário sincronizado.', 'success');
      } else {
        await createUser({
          userEmail,
          ...userForm,
          companyId: userForm.companyId ? (userForm.companyId as any) : undefined
        });
        showToast('Novo operador autenticado.', 'success');
      }
      setUserModalOpen(false);
      setEditingUserId(null);
      setUserForm({ name: '', email: '', role: 'event_company', companyId: '' });
    } catch (err) {
      showToast('Erro ao validar novas credenciais.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (window.confirm('Atenção: A exclusão da matriz removerá todos os vínculos operacionais. Confirmar?')) {
      try {
        await removeCompany({ userEmail, id: id as any });
        showToast('Entidade removida do ledger.', 'success');
      } catch (err) {
        showToast('Erro ao purgar registro.', 'error');
      }
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Revogar permanentemente o acesso deste usuário?')) {
      try {
        await removeUser({ userEmail, id: id as any });
        showToast('Acesso revogado com sucesso.', 'success');
      } catch (err) {
        showToast('Erro ao remover credenciais.', 'error');
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-16 pb-32"
    >
      {/* Header & Tabs */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12">
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-6 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]" />
            <Typography className="text-[11px] font-black tracking-[0.5em] text-indigo-400 uppercase italic">
              CENTRAL_GOVERNANCE_HUB
            </Typography>
          </div>
          <Typography variant="h1" className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none italic">
            Identity <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-primary drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]">Vault</span>
          </Typography>
          <Typography className="text-slate-400 font-bold tracking-wide max-w-2xl text-lg italic opacity-80 leading-relaxed">
            Orquestração de permissões, perfis de segurança e hierarquia corporativa EcoVolt. Monitoramento de rede em tempo real.
          </Typography>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="flex bg-slate-950/80 p-2.5 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none" />
          <button 
            onClick={() => setActiveTab('companies')}
            className={`flex items-center gap-4 px-12 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-700 italic relative z-10 ${
              activeTab === 'companies' 
                ? 'bg-indigo-600 text-white shadow-[0_0_40px_rgba(79,70,229,0.4)] scale-105' 
                : 'text-slate-500 hover:text-slate-200'
            }`}
          >
            <Building2 size={20} /> Matrix_Registry
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-4 px-12 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-700 italic relative z-10 ${
              activeTab === 'users' 
                ? 'bg-purple-600 text-white shadow-[0_0_40px_rgba(147,51,234,0.4)] scale-105' 
                : 'text-slate-500 hover:text-slate-200'
            }`}
          >
            <Users size={20} /> Auth_Operators
          </button>
        </motion.div>
      </div>

      {/* Stats QuickView */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          title="Active_Entities" 
          value={companies?.length || 0} 
          icon={Globe} 
          color="from-indigo-500 to-blue-600"
          glowColor="from-indigo-500/20"
          label="NETWORK_NODES"
        />
        <StatCard 
          title="Auth_Profiles" 
          value={users?.length || 0} 
          icon={Users} 
          color="from-purple-500 to-pink-600"
          glowColor="from-purple-500/20"
          label="IDENTITY_LEDGER"
        />
        <StatCard 
          title="System_Integrity" 
          value="99.9%" 
          icon={ShieldCheck} 
          color="from-primary to-emerald-600"
          glowColor="from-primary/20"
          label="CORE_HEALTH"
        />
      </div>

      {/* Main Content Area */}
      <div className="space-y-12">
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-center bg-slate-950/60 p-10 rounded-[3rem] border border-white/5 backdrop-blur-3xl relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 scanline opacity-[0.02] pointer-events-none" />
          <div className="space-y-2 mb-8 md:mb-0">
            <Typography variant="h3" className="text-3xl font-black text-white tracking-tight italic uppercase">
              {activeTab === 'companies' ? 'Enterprise_Ledger' : 'Identity_Provisioning'}
            </Typography>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
              <Typography className="text-[10px] text-slate-500 font-black tracking-widest uppercase">
                {activeTab === 'companies' ? 'Orquestração de entidades federadas.' : 'Gestão de credenciais e privilégios root.'}
              </Typography>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="btn-premium-primary rounded-[2rem] h-18 px-12 group relative overflow-hidden"
            onClick={() => {
              if (activeTab === 'companies') {
                setEditingCompanyId(null);
                setCompanyForm({ name: '', type: 'client', cnpj: '', status: 'active', region: '', category: '' });
                setCompanyModalOpen(true);
              } else {
                setEditingUserId(null);
                setUserForm({ name: '', email: '', role: 'event_company', companyId: '' });
                setUserModalOpen(true);
              }
            }}
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <div className="flex items-center gap-4 relative z-10">
              <Plus size={24} strokeWidth={3} className="group-hover:rotate-180 transition-transform duration-700" />
              <span className="text-[12px] font-black uppercase tracking-[0.3em] italic">{activeTab === 'companies' ? 'REGISTER_ENTITY' : 'PROVISION_USER'}</span>
            </div>
          </motion.button>
        </motion.div>

        {activeTab === 'companies' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {companies?.map((company, index) => (
                <motion.div
                  key={company._id}
                  layout
                  variants={itemVariants}
                  whileHover={{ y: -12 }}
                  className="glass-card group relative border border-white/5 hover:border-indigo-500/40 transition-all duration-700 rounded-[2.5rem] overflow-hidden"
                >
                  <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none" />
                  <div className="p-12 space-y-10 relative z-10">
                    <div className="flex justify-between items-start">
                      <div className="w-20 h-20 rounded-[2rem] bg-slate-950 flex items-center justify-center text-indigo-400 border border-white/5 group-hover:border-indigo-500/30 transition-all duration-700 shadow-3xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {company.type === 'client' ? <Building2 size={32} /> : <Briefcase size={32} />}
                      </div>
                      <div className="flex gap-3 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700">
                        <button onClick={() => handleOpenCompanyEdit(company)} className="w-12 h-12 flex items-center justify-center bg-slate-900/80 text-slate-400 hover:text-indigo-400 border border-white/5 rounded-2xl transition-all shadow-2xl backdrop-blur-xl"><Edit size={20} /></button>
                        <button onClick={() => handleDeleteCompany(company._id)} className="w-12 h-12 flex items-center justify-center bg-slate-900/80 text-slate-400 hover:text-rose-400 border border-white/5 rounded-2xl transition-all shadow-2xl backdrop-blur-xl"><Trash2 size={20} /></button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className={`text-[9px] font-black uppercase tracking-[0.4em] mb-4 px-4 py-1.5 rounded-full border inline-block italic ${
                        company.status === 'active' ? 'text-primary bg-primary/5 border-primary/20' : 'text-amber-500 bg-amber-500/5 border-amber-500/20'
                      }`}>
                        {company.status === 'active' ? 'NODE_ACTIVE' : 'NODE_OFFLINE'}
                      </div>
                      <Typography variant="h3" className="text-3xl font-black text-white tracking-tight italic leading-tight">{company.name}</Typography>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-[1px] bg-slate-800" />
                        <Typography className="text-[10px] text-slate-600 font-black tracking-[0.3em] uppercase italic">{company.cnpj || 'INTERNAL_UNIT'}</Typography>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/5">
                      <div className="space-y-1">
                        <Typography className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Territory</Typography>
                        <div className="flex items-center gap-2">
                          <Globe size={12} className="text-slate-600" />
                          <span className="text-[10px] font-bold text-slate-400 truncate italic">{company.region || 'GLOBAL'}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Typography className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Sector</Typography>
                        <div className="flex items-center gap-2">
                          <Briefcase size={12} className="text-slate-600" />
                          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">{company.type === 'client' ? 'COORD' : 'SUPPLY'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {users?.map((userItem, index) => (
                <motion.div
                  key={userItem._id}
                  layout
                  variants={itemVariants}
                  whileHover={{ y: -12 }}
                  className="glass-card group relative border border-white/5 hover:border-purple-500/40 transition-all duration-700 rounded-[2.5rem] overflow-hidden"
                >
                  <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none" />
                  <div className="p-12 space-y-10 relative z-10">
                    <div className="flex justify-between items-start">
                      <div className="w-20 h-20 rounded-full bg-slate-950 flex items-center justify-center text-purple-400 border border-white/5 group-hover:border-purple-500/30 transition-all duration-700 shadow-3xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Users size={32} />
                      </div>
                      <div className="flex gap-3 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700">
                        <button onClick={() => handleOpenUserEdit(userItem)} className="w-12 h-12 flex items-center justify-center bg-slate-900/80 text-slate-400 hover:text-purple-400 border border-white/5 rounded-2xl transition-all shadow-2xl backdrop-blur-xl"><Edit size={20} /></button>
                        <button onClick={() => handleDeleteUser(userItem._id)} className="w-12 h-12 flex items-center justify-center bg-slate-900/80 text-slate-400 hover:text-rose-400 border border-white/5 rounded-2xl transition-all shadow-2xl backdrop-blur-xl"><Trash2 size={20} /></button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="text-[9px] font-black uppercase tracking-[0.4em] mb-4 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 inline-block italic">
                        {userItem.role === 'admin' ? 'SYSTEM_ROOT' : userItem.role === 'provider' ? 'POWER_UNIT' : 'GRID_OPERATOR'}
                      </div>
                      <Typography variant="h3" className="text-3xl font-black text-white tracking-tight italic leading-tight">{userItem.name}</Typography>
                      <Typography className="text-[11px] text-slate-500 font-bold tracking-widest lowercase opacity-60">{userItem.email}</Typography>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/50 border border-white/[0.03]">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5"><Building2 size={16} className="text-slate-600" /></div>
                        <div className="flex-1 min-w-0">
                          <Typography className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em] mb-1">UNIT_AFFILIATION</Typography>
                          <Typography className="text-[11px] font-black text-white tracking-widest truncate italic uppercase leading-none">{companies?.find(c => c._id === userItem.companyId)?.name || 'ECOVOLT_CENTRAL'}</Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Enterprise Modals */}
      <AnimatePresence>
        {(isCompanyModalOpen || isUserModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setCompanyModalOpen(false); setUserModalOpen(false); }}
              className="absolute inset-0 bg-slate-950/98 backdrop-blur-2xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="relative w-full max-w-4xl bg-slate-900/80 border border-white/10 rounded-[4rem] shadow-[0_0_150px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-3xl"
            >
              <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none" />
              <div className="p-16 sm:p-20 relative z-10">
                <div className="flex items-start justify-between mb-20">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)] animate-pulse" />
                      <Typography className="text-[10px] font-black tracking-[0.6em] text-indigo-500 uppercase italic">
                        PROTOCOL: {isCompanyModalOpen ? 'ENTITY_REG_X2' : 'IDENTITY_PROV_X1'}
                      </Typography>
                    </div>
                    <Typography variant="h2" className="text-5xl font-black text-white tracking-tighter italic leading-none uppercase">
                      {isCompanyModalOpen 
                        ? (editingCompanyId ? 'ADJUST_ENTITY' : 'NEW_ENTITY_LINK') 
                        : (editingUserId ? 'UPDATE_OPERATOR' : 'PROVISION_OPERATOR')}
                    </Typography>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setCompanyModalOpen(false); setUserModalOpen(false); }}
                    className="w-16 h-16 flex items-center justify-center text-slate-500 hover:text-white bg-slate-950 rounded-[1.5rem] transition-all border border-white/10 shadow-3xl"
                  >
                    <X size={28} />
                  </motion.button>
                </div>

                {isCompanyModalOpen ? (
                  <form onSubmit={handleSubmitCompany} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4 md:col-span-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] ml-4 italic leading-none">Entity_Designation</label>
                      <input 
                        type="text" 
                        value={companyForm.name}
                        onChange={e => setCompanyForm({...companyForm, name: e.target.value})}
                        className="w-full bg-slate-950/60 border-2 border-white/5 rounded-[2rem] py-7 px-10 text-white outline-none focus:border-indigo-500/50 transition-all font-black text-2xl placeholder-slate-800 italic"
                        placeholder="NAME_REQD"
                        required
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] ml-4 italic leading-none">Classification</label>
                      <select 
                        className="w-full bg-slate-950/60 border-2 border-white/5 rounded-[2rem] py-7 px-10 text-white outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer font-black text-lg italic uppercase tracking-widest"
                        value={companyForm.type}
                        onChange={e => setCompanyForm({...companyForm, type: e.target.value as any})}
                      >
                        <option value="client">EVENT_COORD</option>
                        <option value="provider">PWR_PROVIDER</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] ml-4 italic leading-none">Tax_Register_ID</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-950/60 border-2 border-white/5 rounded-[2rem] py-7 px-10 text-white outline-none focus:border-indigo-500/50 transition-all font-black text-lg italic placeholder-slate-800"
                        value={companyForm.cnpj}
                        onChange={e => setCompanyForm({...companyForm, cnpj: e.target.value})}
                        placeholder="00.000.000/0000-00"
                      />
                    </div>

                    <div className="space-y-4 md:col-span-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] ml-4 italic leading-none">Geo_Node_Link</label>
                      <div className="relative">
                        <Globe size={24} className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-700" />
                        <input 
                          type="text" 
                          className="w-full bg-slate-950/60 border-2 border-white/5 rounded-[2rem] py-7 pl-24 pr-10 text-white outline-none focus:border-indigo-500/50 transition-all font-black text-lg italic placeholder-slate-800"
                          value={companyForm.region}
                          onChange={e => setCompanyForm({...companyForm, region: e.target.value})}
                          placeholder="GEO_COORD_REQD"
                        />
                      </div>
                    </div>

                    <div className="flex gap-8 md:col-span-2 pt-16">
                      <button type="button" onClick={() => setCompanyModalOpen(false)} className="flex-1 h-20 rounded-[2rem] border-2 border-white/5 text-slate-500 font-black tracking-[0.4em] uppercase text-[11px] hover:bg-slate-800/20 transition-all italic">CANCEL_OP</button>
                      <motion.button 
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        disabled={isSubmitting} 
                        className="flex-[2] h-20 btn-premium-primary rounded-[2rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] relative overflow-hidden"
                      >
                        {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={28} /> : (
                          <div className="flex items-center justify-center gap-4 italic">
                            <span className="text-[13px] font-black uppercase tracking-[0.4em]">{editingCompanyId ? 'SYNC_CHANGES' : 'COMMIT_REGISTRY'}</span>
                          </div>
                        )}
                      </motion.button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSubmitUser} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4 md:col-span-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] ml-4 italic leading-none">Operator_Full_Name</label>
                      <input 
                        type="text" 
                        value={userForm.name}
                        onChange={e => setUserForm({...userForm, name: e.target.value})}
                        className="w-full bg-slate-950/60 border-2 border-white/5 rounded-[2rem] py-7 px-10 text-white outline-none focus:border-purple-500/50 transition-all font-black text-2xl placeholder-slate-800 italic"
                        placeholder="NAME_ENTRY"
                        required
                      />
                    </div>
                    
                    <div className="space-y-4 md:col-span-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] ml-4 italic leading-none">Secure_Auth_Channel</label>
                      <div className="relative">
                        <Mail size={24} className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-700" />
                        <input 
                          type="email" 
                          value={userForm.email}
                          onChange={e => setUserForm({...userForm, email: e.target.value})}
                          className="w-full bg-slate-950/60 border-2 border-white/5 rounded-[2rem] py-7 pl-24 pr-10 text-white outline-none focus:border-purple-500/50 transition-all font-black text-lg italic placeholder-slate-800"
                          placeholder="EMAIL_ADDR_REQD"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] ml-4 italic leading-none">Auth_Clearance_Level</label>
                      <select 
                        className="w-full bg-slate-950/60 border-2 border-white/5 rounded-[2rem] py-7 px-10 text-white outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer font-black text-lg italic uppercase tracking-widest"
                        value={userForm.role}
                        onChange={e => setUserForm({...userForm, role: e.target.value as any})}
                      >
                        <option value="admin">ROOT_SYSTEM</option>
                        <option value="event_company">OP_COORD</option>
                        <option value="provider">PWR_SUPPLY</option>
                        <option value="operator">GRID_MONITOR</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] ml-4 italic leading-none">Unit_Federation_Link</label>
                      <select 
                        className="w-full bg-slate-950/60 border-2 border-white/5 rounded-[2rem] py-7 px-10 text-white outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer font-black text-lg italic uppercase tracking-widest"
                        value={userForm.companyId}
                        onChange={e => setUserForm({...userForm, companyId: e.target.value})}
                      >
                        <option value="">ECOVOLT_CENTRAL</option>
                        {companies?.map(c => (
                          <option key={c._id} value={c._id}>{c.name.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-8 md:col-span-2 pt-16">
                      <button type="button" onClick={() => setUserModalOpen(false)} className="flex-1 h-20 rounded-[2rem] border-2 border-white/5 text-slate-500 font-black tracking-[0.4em] uppercase text-[11px] hover:bg-slate-800/20 transition-all italic">CANCEL_OP</button>
                      <motion.button 
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        disabled={isSubmitting} 
                        className="flex-[2] h-20 bg-purple-600 text-white rounded-[2rem] font-black shadow-[0_20px_50px_rgba(147,51,234,0.3)] relative overflow-hidden"
                      >
                        {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={28} /> : (
                          <div className="flex items-center justify-center gap-4 italic uppercase tracking-[0.4em] text-[13px]">
                            <span>{editingUserId ? 'UPDATE_AUTH' : 'PROVISION_ID'}</span>
                          </div>
                        )}
                      </motion.button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Management;

