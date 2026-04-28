import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Users, 
  Clock, 
  Wind, 
  Lightbulb, 
  Music, 
  ArrowRight, 
  CheckCircle2, 
  Calculator,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';

const steps = [
  { id: 'basics', title: 'Dimensões e Público', icon: Users },
  { id: 'technical', title: 'Infraestrutura Técnica', icon: Music },
  { id: 'environment', title: 'Climatização e Ambiente', icon: Wind },
  { id: 'result', title: 'Resultado do Provisionamento', icon: Zap },
];

export const Estimation: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    participants: 1000,
    days: 1,
    hoursPerDay: 8,
    ledWallSqm: 50,
    soundPowerWatts: 20000,
    lightingComplexity: 'medium', // low, medium, high
    climatizationRequired: true,
    areaSqm: 500,
  });

  const calculateEstimation = () => {
    // Basic heuristic calculation for energy demand
    const lightingBase = formData.lightingComplexity === 'high' ? 50 : formData.lightingComplexity === 'medium' ? 25 : 10;
    const lightingTotal = (formData.areaSqm * lightingBase) / 1000; // kW
    
    const ledWallTotal = (formData.ledWallSqm * 0.6); // 0.6 kW per sqm average
    const soundTotal = (formData.soundPowerWatts * 0.1) / 1000; // 10% peak power average in kW
    
    const acTotal = formData.climatizationRequired ? (formData.areaSqm * 0.15) : 0; // 150W per sqm for AC
    
    const basalPerPerson = (formData.participants * 0.05) / 1000; // 50W per person for devices etc
    
    const totalKW = lightingTotal + ledWallTotal + soundTotal + acTotal + basalPerPerson;
    const totalKWh = totalKW * formData.hoursPerDay * formData.days;
    
    return {
      peakLoad: totalKW.toFixed(1),
      totalConsumption: totalKWh.toFixed(1),
      suggestedGenerator: (totalKW * 1.25).toFixed(0), // 25% safety margin
    };
  };

  const result = calculateEstimation();

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="space-y-10 pb-20">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Calculator size={18} />
          </div>
          <Typography className="text-[10px] font-black tracking-[0.3em] text-blue-500 uppercase">
            Energy Intelligence
          </Typography>
        </div>
        <Typography variant="h1" className="text-4xl font-black tracking-tighter text-white uppercase">
          Nova <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Estimativa</span>
        </Typography>
        <Typography className="text-slate-400 max-w-2xl">
          Calcule a demanda energética do seu evento com precisão técnica para evitar apagões e otimizar custos de contratação.
        </Typography>
      </header>

      {/* Stepper */}
      <div className="flex items-center justify-between max-w-4xl mx-auto px-4">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-3 relative">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                idx <= currentStep 
                  ? 'bg-blue-500 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                  : 'bg-slate-900 border-slate-800 text-slate-600'
              }`}>
                <step.icon size={20} />
              </div>
              <Typography className={`text-[10px] font-black uppercase tracking-widest absolute -bottom-8 whitespace-nowrap ${
                idx <= currentStep ? 'text-blue-400' : 'text-slate-600'
              }`}>
                {step.title}
              </Typography>
            </div>
            {idx < steps.length - 1 && (
              <div className={`h-[2px] flex-1 mx-4 rounded-full transition-all duration-700 ${
                idx < currentStep ? 'bg-blue-500' : 'bg-slate-800'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="max-w-4xl mx-auto mt-20">
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-10 border-slate-800/50"
        >
          {currentStep === 0 && (
            <div className="space-y-8">
              <Typography variant="h3" className="text-2xl font-bold text-white tracking-tight">Dimensões da Operação</Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Público Esperado (Pax)</label>
                  <div className="relative group">
                    <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors" size={20} />
                    <input 
                      type="number" 
                      value={formData.participants}
                      onChange={e => setFormData({...formData, participants: Number(e.target.value)})}
                      className="w-full bg-slate-950/50 border border-slate-800/50 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Área Útil (m²)</label>
                  <div className="relative group">
                    <Zap className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors" size={20} />
                    <input 
                      type="number" 
                      value={formData.areaSqm}
                      onChange={e => setFormData({...formData, areaSqm: Number(e.target.value)})}
                      className="w-full bg-slate-950/50 border border-slate-800/50 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Duração (Dias)</label>
                  <div className="relative group">
                    <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors" size={20} />
                    <input 
                      type="number" 
                      value={formData.days}
                      onChange={e => setFormData({...formData, days: Number(e.target.value)})}
                      className="w-full bg-slate-950/50 border border-slate-800/50 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Horas por Dia</label>
                  <div className="relative group">
                    <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors" size={20} />
                    <input 
                      type="number" 
                      value={formData.hoursPerDay}
                      onChange={e => setFormData({...formData, hoursPerDay: Number(e.target.value)})}
                      className="w-full bg-slate-950/50 border border-slate-800/50 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-8">
              <Typography variant="h3" className="text-2xl font-bold text-white tracking-tight">Carga Técnica</Typography>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Complexidade de Iluminação</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['low', 'medium', 'high'].map(level => (
                      <button
                        key={level}
                        onClick={() => setFormData({...formData, lightingComplexity: level})}
                        className={`py-4 rounded-2xl border font-bold uppercase text-[10px] tracking-widest transition-all ${
                          formData.lightingComplexity === level 
                            ? 'bg-blue-500/10 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                            : 'bg-slate-950 border-slate-800 text-slate-600 hover:border-slate-700'
                        }`}
                      >
                        {level === 'low' ? 'Básica' : level === 'medium' ? 'Intermediária' : 'Show / Performance'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Painéis de LED (m²)</label>
                    <div className="relative group">
                      <Lightbulb className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors" size={20} />
                      <input 
                        type="number" 
                        value={formData.ledWallSqm}
                        onChange={e => setFormData({...formData, ledWallSqm: Number(e.target.value)})}
                        className="w-full bg-slate-950/50 border border-slate-800/50 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Potência de Som (Watts RMS)</label>
                    <div className="relative group">
                      <Music className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors" size={20} />
                      <input 
                        type="number" 
                        value={formData.soundPowerWatts}
                        onChange={e => setFormData({...formData, soundPowerWatts: Number(e.target.value)})}
                        className="w-full bg-slate-950/50 border border-slate-800/50 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <Typography variant="h3" className="text-2xl font-bold text-white tracking-tight">Climatização</Typography>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-950/50 border border-slate-800/50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Wind size={24} />
                    </div>
                    <div>
                      <Typography className="text-white font-bold">Ar Condicionado / Climatização</Typography>
                      <Typography className="text-slate-500 text-sm">Ative se o evento necessita de refrigeração forçada.</Typography>
                    </div>
                  </div>
                  <button 
                    onClick={() => setFormData({...formData, climatizationRequired: !formData.climatizationRequired})}
                    className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${
                      formData.climatizationRequired ? 'bg-blue-500' : 'bg-slate-800'
                    }`}
                  >
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300 ${
                      formData.climatizationRequired ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>
                
                {formData.climatizationRequired && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/20"
                  >
                    <div className="flex items-start gap-4">
                      <CheckCircle2 size={18} className="text-blue-400 mt-1" />
                      <Typography className="text-blue-200/70 text-sm leading-relaxed">
                        Calculamos automaticamente ~150W por m² para ambientes fechados com isolamento térmico padrão. 
                        Este valor é uma estimativa de carga de pico para dimensionamento de geradores.
                      </Typography>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-10">
              <div className="text-center space-y-2">
                <Typography variant="h3" className="text-3xl font-bold text-white tracking-tight">Provisionamento Recomendado</Typography>
                <Typography className="text-slate-500 uppercase text-[10px] font-black tracking-[0.4em]">Configuração Final da Infraestrutura</Typography>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 rounded-[2.5rem] bg-slate-950/50 border border-slate-800/50 text-center space-y-4">
                  <Typography className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Carga de Pico</Typography>
                  <Typography className="text-4xl font-bold text-white tracking-tighter">{result.peakLoad} kW</Typography>
                  <div className="h-1 w-12 bg-blue-500 mx-auto rounded-full" />
                </div>
                <div className="p-8 rounded-[2.5rem] bg-blue-500/10 border border-blue-500/20 text-center space-y-4 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
                  <Typography className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Gerador Sugerido</Typography>
                  <Typography className="text-4xl font-bold text-white tracking-tighter">{result.suggestedGenerator} kVA</Typography>
                  <Typography className="text-[10px] text-blue-400/60 font-bold uppercase">+25% de Margem</Typography>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-slate-950/50 border border-slate-800/50 text-center space-y-4">
                  <Typography className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Consumo Total</Typography>
                  <Typography className="text-4xl font-bold text-white tracking-tighter">{result.totalConsumption} kWh</Typography>
                  <div className="h-1 w-12 bg-emerald-500 mx-auto rounded-full" />
                </div>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-slate-950/80 border border-slate-800/50 space-y-6">
                <Typography className="text-white font-bold tracking-tight">Resumo Técnico p/ Proposta</Typography>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Duração Total:</span>
                    <span className="text-slate-200 font-medium">{formData.days * formData.hoursPerDay} Horas Operacionais</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Demanda p/ Participante:</span>
                    <span className="text-slate-200 font-medium">{(Number(result.totalConsumption) / formData.participants).toFixed(2)} kWh/pax</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Complexidade Técnica:</span>
                    <span className="text-blue-400 font-black uppercase text-[10px] tracking-widest">{formData.lightingComplexity}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-12 pt-10 border-t border-slate-800/50">
            <button 
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                currentStep === 0 ? 'text-slate-800 opacity-0' : 'text-slate-500 hover:text-white'
              }`}
            >
              <ChevronLeft size={16} />
              Voltar
            </button>
            
            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={nextStep}
                className="btn-premium-primary rounded-2xl h-14 px-10"
              >
                Continuar
                <ChevronRight size={18} className="ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={() => navigate('/events')}
                className="btn-premium-primary rounded-2xl h-14 px-10 shadow-[0_0_40px_rgba(59,130,246,0.3)]"
              >
                Vincular a um Evento
                <ArrowRight size={18} className="ml-2" />
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
