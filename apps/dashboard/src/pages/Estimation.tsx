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
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const Estimation: React.FC = () => {
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
    // Simple mock calculation logic
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
        startDate: Date.now() + 86400000 * 30, // 30 days from now
        endDate: Date.now() + 86400000 * 32,
        location: "A Definir",
        expectedAttendees: formData.participants,
        estimatedConsumption: result.totalKWh,
        companyId: clientCompany._id
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setFormData(prev => ({ ...prev, name: '' })); // reset name
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar o evento.");
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

      // 1. Create Event
      const eventId = await createEvent({
        name: formData.name,
        status: "planning",
        startDate: Date.now() + 86400000 * 30, // 30 days from now
        endDate: Date.now() + 86400000 * 32,
        location: "A Definir",
        expectedAttendees: formData.participants,
        estimatedConsumption: result.totalKWh,
        companyId: clientCompany._id
      });

      // 2. Create Contract associated with Event
      await createContract({
        eventId: eventId,
        providerCompanyId: providerCompany._id,
        clientCompanyId: clientCompany._id,
        value: result.costEstimate,
        status: "draft"
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setFormData(prev => ({ ...prev, name: '' })); // reset name
      alert("Proposta e Evento gerados com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar a proposta.");
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>Nova Estimativa Energética</h2>
          <p style={{ color: 'var(--text-muted)' }}>Configure os parâmetros do evento para gerar a previsão de consumo.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline" onClick={handleSaveDraft} disabled={isSaving || !companies}>
            {saveSuccess ? <CheckCircle2 size={18} color="var(--primary)" /> : <Save size={18} />}
            {saveSuccess ? "Salvo!" : isSaving ? "Salvando..." : "Salvar Rascunho"}
          </button>
          <button className="btn btn-primary" onClick={handleGenerateProposal} disabled={isSaving || !companies}>
            <FileText size={18} />
            Gerar Proposta
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
        {/* Form Section */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <section>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={18} color="var(--primary)" />
              Dados Gerais do Evento
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Nome do Evento</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  placeholder="Ex: Arena Verão 2026"
                  className="glass" 
                  style={{ padding: '12px', borderRadius: '10px', border: `1px solid ${formErrors.name ? 'var(--error, #ef4444)' : 'var(--border)'}`, color: 'white' }}
                  onChange={handleChange}
                />
                {formErrors.name && <span style={{ color: 'var(--error, #ef4444)', fontSize: '0.75rem' }}>{formErrors.name}</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Duração (h)</label>
                  <input type="number" name="duration" value={formData.duration} className="glass" style={{ padding: '12px', borderRadius: '10px', border: `1px solid ${formErrors.duration ? 'var(--error, #ef4444)' : 'var(--border)'}`, color: 'white' }} onChange={handleChange} />
                  {formErrors.duration && <span style={{ color: 'var(--error, #ef4444)', fontSize: '0.75rem' }}>{formErrors.duration}</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Participantes</label>
                  <input type="number" name="participants" value={formData.participants} className="glass" style={{ padding: '12px', borderRadius: '10px', border: `1px solid ${formErrors.participants ? 'var(--error, #ef4444)' : 'var(--border)'}`, color: 'white' }} onChange={handleChange} />
                  {formErrors.participants && <span style={{ color: 'var(--error, #ef4444)', fontSize: '0.75rem' }}>{formErrors.participants}</span>}
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="var(--primary)" />
              Carga Instalada (kW)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {[
                { label: 'Iluminação', name: 'lighting', icon: Lightbulb },
                { label: 'Climatização', name: 'climatization', icon: Wind },
                { label: 'Sonorização', name: 'sound', icon: Music },
                { label: 'Est. Auxiliar', name: 'auxiliary', icon: Hammer },
                { label: 'Apoio Técnico', name: 'support', icon: Coffee },
                { label: 'Margem Seg.', name: 'safetyMargin', icon: ShieldCheck },
              ].map((item) => (
                <div key={item.name} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <item.icon size={14} color="var(--text-muted)" />
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.label}</label>
                  </div>
                  <input 
                    type="number" 
                    name={item.name}
                    value={formData[item.name as keyof typeof formData]} 
                    className="glass" 
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', color: 'white' }}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Results Section */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card glass" style={{ border: '2px solid var(--primary)', background: 'rgba(16, 185, 129, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
                <Calculator size={20} color="white" />
              </div>
              <h4 style={{ fontWeight: 700 }}>Resultado da Estimativa</h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Consumo Total Estimado</p>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {result.totalKWh} <span style={{ fontSize: '1rem', fontWeight: 400 }}>kWh</span>
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Faixa de Contratação</p>
                  <p style={{ fontWeight: 600 }}>{result.contractRange}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Risco Operacional</p>
                  <span className={`badge ${result.risk === 'Baixo' ? 'badge-success' : result.risk === 'Moderado' ? 'badge-warning' : 'badge-error'}`}>
                    {result.risk}
                  </span>
                </div>
              </div>

              <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Investimento Estimado Base</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>R$ {result.costEstimate.toLocaleString('pt-BR')}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>* Baseado na média de R$ 0,85/kWh</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Resumo Técnico</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--text-muted)' }}>
                O cálculo considera a carga base de equipamentos multiplicada pelo tempo de uso, somada à carga térmica variável por participante.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                <Zap size={14} />
                Fator de Simultaneidade: 0.85
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                <Clock size={14} />
                Pico de Demanda: 18:00 - 22:00
              </div>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

export default Estimation;
