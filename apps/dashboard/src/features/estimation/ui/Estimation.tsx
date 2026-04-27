import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, 
  Clock, 
  Lightbulb, 
  Wind, 
  Music, 
  Hammer, 
  Coffee,
  Info,
  Calculator,
  Save,
  FileText,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Cpu,
  Activity,
  Layers,
  Terminal,
  Database,
  Lock,
  ArrowUpRight,
  Loader2,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery } from 'convex/react';
import { api } from "@/../convex/_generated/api";
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/shared/lib/utils';

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
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const Estimation: React.FC = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    duration: 8,
    participants: 1000,
    lighting: 5,
    climatization: 15,
    sound: 10,
    auxiliary: 2,
    support: 5,
    safetyMargin: 15
  });

  const [result, setResult] = useState({
    totalKWh: 0,
    contractRange: '',
    costEstimate: 0,
    risk: 'Baixo'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const createEvent = useMutation(api.events.createEvent);
  const createContract = useMutation(api.contracts.createContract);
  const companies = useQuery(api.companies.getCompanies);

  useEffect(() => {
    // Calculation logic
    const base = (formData.lighting + formData.climatization + formData.sound + formData.auxiliary + formData.support) * formData.duration;
    const participantLoad = (formData.participants / 100) * 0.5 * formData.duration;
    const total = (base + participantLoad) * (1 + formData.safetyMargin / 100);
    
    setResult({
      totalKWh: Math.round(total * 100) / 100,
      contractRange: total < 50 ? 'Pequeno Porte' : total < 200 ? 'Médio Porte' : 'Grande Porte',
      costEstimate: Math.round(total * 0.85 * 100) / 100, // R$ 0.85 per kWh
      risk: formData.safetyMargin < 10 ? 'Alto' : formData.safetyMargin < 20 ? 'Moderado' : 'Baixo'
    });
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'name' ? value : Number(value) }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Nome do evento é obrigatório.";
    if (formData.duration <= 0) errors.duration = "Duração deve ser maior que zero.";
    if (formData.participants <= 0) errors.participants = "Número de participantes deve ser válido.";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    try {
      const clientCompany = companies?.find(c => c.type === 'client');
      if (!clientCompany) throw new Error("Empresa cliente não encontrada.");

      await createEvent({
        name: formData.name,
        status: "planning",
        startDate: Date.now() + 86400000 * 30,
        endDate: Date.now() + 86400000 * 32,
        location: "A Definir",
        expectedAttendees: formData.participants,
        estimatedConsumption: result.totalKWh,
        companyId: clientCompany._id
      });
      
      setSaveSuccess(true);
      showToast('Rascunho salvo com sucesso!', 'success');
      setTimeout(() => setSaveSuccess(false), 3000);
      setFormData(prev => ({ ...prev, name: '' }));
    } catch (error: any) {
      showToast(error.message || "Erro ao salvar o evento.", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateProposal = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    try {
      const clientCompany = companies?.find(c => c.type === 'client');
      const providerCompany = companies?.find(c => c.type === 'provider');
      
      if (!clientCompany || !providerCompany) {
        throw new Error("Empresas cliente ou provedor não encontradas para gerar proposta.");
      }

      const eventId = await createEvent({
        name: formData.name,
        status: "planning",
        startDate: Date.now() + 86400000 * 30,
        endDate: Date.now() + 86400000 * 32,
        location: "A Definir",
        expectedAttendees: formData.participants,
        estimatedConsumption: result.totalKWh,
        companyId: clientCompany._id
      });

      await createContract({
        eventId: eventId,
        providerCompanyId: providerCompany._id,
        clientCompanyId: clientCompany._id,
        value: result.costEstimate,
        status: "draft"
      });
      
      showToast('Proposta e Evento gerados com sucesso!', 'success');
      setFormData(prev => ({ ...prev, name: '' }));
    } catch (error: any) {
      showToast(error.message || "Erro ao gerar a proposta.", 'error');
    } finally {
      setIsSaving(false);
    }
  };

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
            <Cpu size={12} className="text-primary animate-pulse" />
            <Typography className="text-[10px] font-black italic uppercase tracking-[0.5em] text-primary">
              Prediction Engine v2.4.0
            </Typography>
          </div>
          <Typography variant="h1" className="text-5xl font-black italic uppercase tracking-tighter text-white mb-2 leading-none">
            Load <span className="text-primary glow-text">Simulation</span> HUD
          </Typography>
          <div className="flex items-center gap-4">
            <Typography variant="muted" className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-white/40">
              <Database size={14} className="text-primary/50" />
              ALGO: NEURAL_RECURSIVE
            </Typography>
            <div className="h-1 w-1 rounded-full bg-white/20" />
            <Typography variant="muted" className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-white/40">
              <Activity size={14} className="text-primary/50" />
              REALTIME CALIBRATION
            </Typography>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
          <Button 
            variant="ghost" 
            onClick={handleSaveDraft} 
            disabled={isSaving || !companies}
            className="glass-thick border-white/5 h-14 px-8 text-white/60 font-black tracking-[0.2em] uppercase text-[10px] rounded-2xl flex items-center gap-3 hover:text-primary hover:border-primary/30 transition-all"
          >
            {saveSuccess ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Save className="w-5 h-5" />}
            {saveSuccess ? "SYNCHRONIZED" : isSaving ? "TRANSMITTING..." : "SAVE_DRAFT_NODE"}
          </Button>
          <Button 
            onClick={handleGenerateProposal} 
            disabled={isSaving || !companies}
            className="btn-premium-primary h-14 px-10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(16,185,129,0.2)]"
          >
            <FileText size={18} className="mr-2" />
            Gerar Proposta
          </Button>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Simulation Workspace */}
        <div className="xl:col-span-2 space-y-10">
          <motion.section variants={itemVariants} className="glass-thick p-10 relative overflow-hidden group border-t-2 border-primary/30">
            <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-colors" />

            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900/80 border border-white/5 flex items-center justify-center text-primary shadow-2xl group-hover:border-primary/50 transition-all">
                <Settings size={24} className="group-hover:rotate-90 transition-transform duration-700" />
              </div>
              <div>
                <Typography className="text-[10px] font-black italic uppercase tracking-[0.3em] text-primary/70">Structural Configuration</Typography>
                <Typography variant="h3" className="text-xl font-black text-white italic uppercase tracking-tighter">Global Parameters</Typography>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Event Designation</label>
                <div className="relative group/input">
                  <Terminal size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-primary transition-all" />
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    placeholder="ENTER_DESIGNATION..."
                    className={cn(
                      "w-full bg-black/60 border rounded-2xl py-5 pl-16 pr-8 text-white outline-none focus:border-primary/50 focus:bg-black/80 transition-all text-sm font-black uppercase tracking-widest shadow-inner",
                      formErrors.name ? 'border-rose-500/50 shadow-rose-500/5' : 'border-white/5'
                    )}
                    onChange={handleChange}
                  />
                </div>
                {formErrors.name && <Typography className="text-rose-400 text-[10px] font-black uppercase tracking-widest ml-4">{formErrors.name}</Typography>}
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Duration (h)</label>
                  <input 
                    type="number" 
                    name="duration" 
                    value={formData.duration} 
                    className="w-full bg-black/60 border border-white/5 rounded-2xl py-5 px-8 text-white outline-none focus:border-primary/50 focus:bg-black/80 transition-all text-lg font-black italic tracking-tighter shadow-inner"
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Attendees</label>
                  <input 
                    type="number" 
                    name="participants" 
                    value={formData.participants} 
                    className="w-full bg-black/60 border border-white/5 rounded-2xl py-5 px-8 text-white outline-none focus:border-primary/50 focus:bg-black/80 transition-all text-lg font-black italic tracking-tighter shadow-inner"
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="glass-thick p-10 relative overflow-hidden group border-t-2 border-primary/30">
            <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900/80 border border-white/5 flex items-center justify-center text-amber-400 shadow-2xl group-hover:border-amber-400/50 transition-all">
                <Zap size={24} className="group-hover:animate-pulse" />
              </div>
              <div>
                <Typography className="text-[10px] font-black italic uppercase tracking-[0.3em] text-amber-400/70">Neural Projection Metrics</Typography>
                <Typography variant="h3" className="text-xl font-black text-white italic uppercase tracking-tighter">Installed Load (kW)</Typography>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { label: 'Iluminação', name: 'lighting', icon: Lightbulb },
                { label: 'Climatização', name: 'climatization', icon: Wind },
                { label: 'Sonorização', name: 'sound', icon: Music },
                { label: 'Est. Auxiliar', name: 'auxiliary', icon: Hammer },
                { label: 'Apoio Técnico', name: 'support', icon: Coffee },
                { label: 'Margem Seg.', name: 'safetyMargin', icon: ShieldCheck, color: 'text-emerald-400' },
              ].map((item) => (
                <div key={item.name} className="space-y-4 group/item">
                  <div className="flex items-center gap-2 ml-2">
                    <item.icon size={14} className={item.color || "text-white/20 group-hover/item:text-primary transition-colors"} />
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] group-hover/item:text-white transition-colors">{item.label}</label>
                  </div>
                  <div className="relative">
                    <input 
                      type="number" 
                      name={item.name}
                      value={formData[item.name as keyof typeof formData]} 
                      className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary/50 focus:bg-black/80 transition-all font-black text-base italic tracking-tighter shadow-inner group-hover/item:border-white/10"
                      onChange={handleChange}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/10 uppercase tracking-widest pointer-events-none group-hover/item:text-primary/30 transition-all">kW</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Projection Engine Results */}
        <div className="space-y-8">
          <motion.section variants={itemVariants} className="glass-thick border-t-4 border-primary bg-primary/[0.02] overflow-hidden group relative">
            <div className="absolute inset-0 scanline opacity-[0.05] pointer-events-none" />
            <div className="p-8 sm:p-10 space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-black shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <Calculator size={28} />
                </div>
                <div>
                  <Typography className="text-[10px] font-black italic uppercase tracking-[0.3em] text-primary">Projection Output</Typography>
                  <Typography variant="h3" className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">Simulation Results</Typography>
                </div>
              </div>

              <div className="space-y-10">
                <div className="relative p-8 rounded-3xl bg-neutral-900/60 border border-white/5 overflow-hidden group/result">
                  <div className="absolute inset-0 scanline opacity-[0.05] pointer-events-none" />
                  <Typography className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] mb-2 block">
                    Estimated Net Consumption
                  </Typography>
                  <div className="flex items-baseline gap-3">
                    <Typography className="text-6xl font-black text-primary tracking-tighter italic leading-none group-hover/result:glow-text transition-all duration-700">
                      {result.totalKWh.toLocaleString()}
                    </Typography>
                    <Typography className="text-2xl font-black text-white/20 italic tracking-tighter uppercase">kWh</Typography>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-neutral-900/40 rounded-2xl border border-white/5 relative overflow-hidden group/box">
                    <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none" />
                    <Typography className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-2 block">Scale Category</Typography>
                    <Typography className="text-sm font-black text-white uppercase italic tracking-widest group-hover/box:text-primary transition-colors">
                      {result.contractRange}
                    </Typography>
                  </div>
                  <div className="p-6 bg-neutral-900/40 rounded-2xl border border-white/5 relative overflow-hidden group/box">
                    <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none" />
                    <Typography className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-2 block">Stability Risk</Typography>
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] animate-pulse", 
                        result.risk === 'Baixo' ? 'text-emerald-400 bg-emerald-400' : 
                        result.risk === 'Moderado' ? 'text-amber-400 bg-amber-400' : 'text-rose-400 bg-rose-400'
                      )} />
                      <Typography className="text-sm font-black text-white uppercase italic tracking-widest group-hover/box:text-primary transition-colors">
                        {result.risk.toUpperCase()}
                      </Typography>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-neutral-900/80 rounded-3xl border border-white/5 relative overflow-hidden group/capex">
                  <div className="absolute inset-0 scanline opacity-[0.05] pointer-events-none" />
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover/capex:opacity-[0.08] transition-opacity">
                    <TrendingUp size={80} className="text-primary" />
                  </div>
                  <Typography className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] mb-2 block">
                    Projected Capex Investment
                  </Typography>
                  <div className="flex items-center gap-3">
                    <Typography className="text-3xl font-black text-white italic tracking-tighter">
                      R$ {result.costEstimate.toLocaleString('pt-BR')}
                    </Typography>
                    <div className="px-2 py-0.5 rounded-lg bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase tracking-widest animate-pulse">
                      ESTIMATED
                    </div>
                  </div>
                  <Typography className="text-[9px] text-white/20 mt-4 italic font-bold uppercase tracking-widest flex items-center gap-2">
                    <Info size={10} className="text-primary/40" />
                    Base Calibration: R$ 0,85 / kWh
                  </Typography>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="glass-thick p-8 space-y-6 relative overflow-hidden group">
            <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none" />
            <div className="flex items-center gap-3 pb-4 border-b border-white/5">
              <AlertTriangle size={18} className="text-amber-400 animate-pulse" />
              <Typography variant="h4" className="text-[11px] font-black text-white uppercase tracking-[0.3em]">
                Neural System Insights
              </Typography>
            </div>
            <Typography className="text-xs font-bold text-white/40 leading-relaxed italic border-l-2 border-primary/20 pl-6 py-1 group-hover:text-white/60 transition-colors">
              "The integration matrix accounts for static structural load and dynamic thermal entropy from attendees. Applying a simultaneity factor of 0.85 for hyper-efficient cost distribution. Calibration active."
            </Typography>
            <div className="pt-4 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 w-fit">
                <CheckCircle2 size={12} className="animate-pulse" />
                Algorithm v4.2 Nominal
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-3">
                <Clock size={12} />
                Last Calibration: SYNC_OK
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
};
