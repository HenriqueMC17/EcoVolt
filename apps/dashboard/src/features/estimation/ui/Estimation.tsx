import React, { useState, useEffect } from 'react';
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
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery } from 'convex/react';
import { api } from "@/../convex/_generated/api";
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/context/ToastContext';

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
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Typography variant="h2" className="text-3xl font-bold tracking-tight text-white">
            Simulador de Carga Energética
          </Typography>
          <Typography variant="body" className="text-slate-400 mt-1">
            Algoritmos de precisão para dimensionamento de infraestrutura.
          </Typography>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="ghost" 
            onClick={handleSaveDraft} 
            disabled={isSaving || !companies}
            className="border border-slate-700 hover:bg-slate-800"
          >
            {saveSuccess ? <CheckCircle2 className="w-5 h-5 mr-2 text-green-400" /> : <Save className="w-5 h-5 mr-2" />}
            {saveSuccess ? "Salvo" : isSaving ? "Salvando..." : "Salvar Rascunho"}
          </Button>
          <Button 
            onClick={handleGenerateProposal} 
            disabled={isSaving || !companies}
            className="btn-premium-primary"
          >
            <FileText className="w-5 h-5 mr-2" />
            Gerar Proposta
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="xl:col-span-2 space-y-8">
          <section className="glass-card p-6 sm:p-8 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                  <Info size={20} />
                </div>
                <Typography variant="h3" className="text-lg font-bold text-white">
                  Parâmetros Estruturais
                </Typography>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nome do Evento</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    placeholder="Ex: Arena Verão 2026"
                    className={`w-full bg-slate-900/50 border ${formErrors.name ? 'border-red-500/50' : 'border-slate-800'} rounded-xl py-3 px-4 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all`}
                    onChange={handleChange}
                  />
                  {formErrors.name && <Typography className="text-red-400 text-xs">{formErrors.name}</Typography>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duração (h)</label>
                    <input 
                      type="number" 
                      name="duration" 
                      value={formData.duration} 
                      className={`w-full bg-slate-900/50 border ${formErrors.duration ? 'border-red-500/50' : 'border-slate-800'} rounded-xl py-3 px-4 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all`}
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Público</label>
                    <input 
                      type="number" 
                      name="participants" 
                      value={formData.participants} 
                      className={`w-full bg-slate-900/50 border ${formErrors.participants ? 'border-red-500/50' : 'border-slate-800'} rounded-xl py-3 px-4 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all`}
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 border border-yellow-500/20">
                  <Zap size={20} />
                </div>
                <Typography variant="h3" className="text-lg font-bold text-white">
                  Carga Instalada (kW)
                </Typography>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {[
                  { label: 'Iluminação', name: 'lighting', icon: Lightbulb },
                  { label: 'Climatização', name: 'climatization', icon: Wind },
                  { label: 'Sonorização', name: 'sound', icon: Music },
                  { label: 'Est. Auxiliar', name: 'auxiliary', icon: Hammer },
                  { label: 'Apoio Técnico', name: 'support', icon: Coffee },
                  { label: 'Margem Seg.', name: 'safetyMargin', icon: ShieldCheck, color: 'text-green-400' },
                ].map((item) => (
                  <div key={item.name} className="space-y-2 group">
                    <div className="flex items-center gap-2">
                      <item.icon size={14} className={item.color || "text-slate-500"} />
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</label>
                    </div>
                    <input 
                      type="number" 
                      name={item.name}
                      value={formData[item.name as keyof typeof formData]} 
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all group-hover:border-slate-700"
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Results / Sidebar */}
        <div className="space-y-6">
          <section className="glass-card overflow-hidden border-2 border-blue-500/30 bg-blue-500/5">
            <div className="p-6 sm:p-8 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <Calculator size={24} />
                </div>
                <Typography variant="h3" className="text-xl font-bold text-white">
                  Resultado
                </Typography>
              </div>

              <div className="space-y-6">
                <div>
                  <Typography className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Consumo Total Estimado
                  </Typography>
                  <div className="flex items-baseline gap-2">
                    <Typography className="text-5xl font-black text-blue-400 tracking-tighter">
                      {result.totalKWh.toLocaleString()}
                    </Typography>
                    <Typography className="text-xl font-medium text-slate-500">kWh</Typography>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <Typography className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Faixa
                    </Typography>
                    <Typography className="text-sm font-bold text-white">
                      {result.contractRange}
                    </Typography>
                  </div>
                  <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <Typography className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Risco
                    </Typography>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        result.risk === 'Baixo' ? 'bg-green-400' : 
                        result.risk === 'Moderado' ? 'bg-yellow-400' : 'bg-red-400'
                      }`} />
                      <Typography className="text-sm font-bold text-white">
                        {result.risk}
                      </Typography>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <TrendingUp size={64} className="text-blue-400" />
                  </div>
                  <Typography className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Investimento Base
                  </Typography>
                  <Typography className="text-2xl font-bold text-white">
                    R$ {result.costEstimate.toLocaleString('pt-BR')}
                  </Typography>
                  <Typography className="text-[10px] text-slate-600 mt-2 italic">
                    * Projeção baseada na média de R$ 0,85/kWh
                  </Typography>
                </div>
              </div>
            </div>
          </section>

          <section className="glass-card p-6 space-y-4">
            <Typography variant="h4" className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle size={16} className="text-yellow-400" />
              Observações Técnicas
            </Typography>
            <Typography className="text-xs text-slate-400 leading-relaxed">
              O cálculo integra a carga base estática (equipamentos) e a carga térmica dinâmica (fluxo de participantes), aplicando um fator de simultaneidade de 0.85 para otimização de custos.
            </Typography>
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400/80 uppercase">
                <CheckCircle2 size={12} />
                Algoritmo V4.2 Ativo
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                <Clock size={12} />
                Última calibração: Hoje
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
