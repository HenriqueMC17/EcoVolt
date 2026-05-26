"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMockAuth } from "@/shared/providers/MockAuthProvider";
import { 
  Zap, 
  Mail, 
  Lock, 
  ArrowRight, 
  Shield, 
  Activity, 
  Cpu, 
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Typography } from "@/shared/ui/Typography";

type ProfileRole = "admin" | "operator" | "provider" | "event_company";

interface ProfilePreset {
  email: string;
  name: string;
  role: ProfileRole;
  roleLabel: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  glowColor: string;
}

const PROFILE_PRESETS: ProfilePreset[] = [
  {
    email: "admin@ecovolt.com",
    name: "Henrique MC",
    role: "admin",
    roleLabel: "Administrador",
    description: "Visão estratégica global, métricas financeiras e gerenciamento de usinas.",
    icon: Shield,
    glowColor: "from-primary/20 to-emerald-500/10",
  },
  {
    email: "operacoes@rioarena.com.br",
    name: "Rio Arena Congressos",
    role: "event_company",
    roleLabel: "Organizador",
    description: "Provisão de carga, telemetria de consumo em tempo real e relatórios de eventos.",
    icon: Activity,
    glowColor: "from-blue-500/20 to-indigo-500/10",
  },
  {
    email: "matrix@cleanenergy.com",
    name: "Matrix Clean Energy",
    role: "provider",
    roleLabel: "Provedor",
    description: "Gestão de ativos renováveis, geração distribuída e contratos inteligentes.",
    icon: Cpu,
    glowColor: "from-purple-500/20 to-fuchsia-500/10",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useMockAuth();
  
  const [selectedRole, setSelectedRole] = useState<ProfileRole | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleProfileSelect = (preset: ProfilePreset) => {
    setSelectedRole(preset.role);
    setEmail(preset.email);
    setPassword("••••••••••••"); // visual placeholder for password
    setError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form validations
    if (!email) {
      setError("O endereço de e-mail é obrigatório.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Insira um endereço de e-mail válido.");
      return;
    }
    if (!password) {
      setError("A senha de acesso é obrigatória.");
      return;
    }

    setLoading(true);

    try {
      // Find matching preset, fallback to default naming if customized
      const preset = PROFILE_PRESETS.find(p => p.email === email);
      const name = preset ? preset.name : "Operador Convidado";
      const finalRole = preset ? preset.role : "event_company";

      // Execute Mock login (simulates network and writes session cookies)
      await login(email, name, finalRole);

      setSuccess(true);
      
      // Minor delay to appreciate the success animation and redirect
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Falha na autenticação do sistema.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-bg-main overflow-hidden py-16 px-4">
      {/* Dynamic Cinematic Ambient Background elements */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: "2s" }} />

      <div className="relative w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* LEFT COLUMN: Premium EcoVolt Branding & Slogan */}
        <div className="lg:col-span-5 text-left space-y-6 lg:pr-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-linear-to-br from-primary to-primary-hover text-black glow-primary shadow-lg animate-spin-slow">
              <Zap size={24} strokeWidth={2.5} />
            </div>
            <div>
              <Typography className="text-[11px] font-black tracking-[0.4em] text-primary uppercase">
                Enterprise Operating System
              </Typography>
              <Typography className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">
                EcoVolt
              </Typography>
            </div>
          </div>

          <div className="space-y-4">
            <Typography variant="h1" className="text-4xl lg:text-5xl font-black tracking-tighter text-white uppercase italic leading-tight">
              A era da <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-500">
                inteligência energética
              </span>
            </Typography>
            <Typography className="text-text-muted text-sm font-medium leading-relaxed max-w-md">
              Monitore a curva de carga de infraestruturas industriais, provisione eventos de grande porte com precisão de telemetria e otimize sua fatura sob as diretrizes do FSD e Convex.
            </Typography>
          </div>

          {/* Mini Dashboard Indicator Grid */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
            <div className="space-y-1">
              <Typography className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Latência
              </Typography>
              <Typography className="text-sm font-black text-white font-variant-numeric: tabular-nums">
                &lt; 300ms
              </Typography>
            </div>
            <div className="space-y-1">
              <Typography className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Garantia
              </Typography>
              <Typography className="text-sm font-black text-white font-variant-numeric: tabular-nums">
                SLA 99.9%
              </Typography>
            </div>
            <div className="space-y-1">
              <Typography className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Design
              </Typography>
              <Typography className="text-sm font-black text-primary font-variant-numeric: tabular-nums">
                FSD v4.0
              </Typography>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Premium Access Glass Card */}
        <div className="lg:col-span-7">
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-slate-950/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden relative"
          >
            {/* Holographic scanner laser line effect */}
            <div className="scanline" />

            <div className="space-y-8 relative z-10">
              
              {/* Card Title Header */}
              <div className="space-y-1">
                <Typography className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">
                  Portal de Autenticação
                </Typography>
                <Typography variant="h2" className="text-2xl font-black tracking-tight text-white uppercase italic">
                  Acessar Plataforma
                </Typography>
              </div>

              {/* SECTION: Quick Profile Selector Switcher */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Typography className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                    Selecione um Perfil de Acesso Rápido
                  </Typography>
                  <span className="h-px flex-1 bg-white/5 mx-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {PROFILE_PRESETS.map((preset) => {
                    const PresetIcon = preset.icon;
                    const isSelected = selectedRole === preset.role;

                    return (
                      <button
                        key={preset.role}
                        type="button"
                        onClick={() => handleProfileSelect(preset)}
                        className={`text-left p-4 rounded-2xl border transition-all duration-300 relative group flex flex-col justify-between min-h-[110px] ${
                          isSelected
                            ? "border-primary bg-white/5 shadow-[0_0_20px_rgba(16,185,129,0.1)] scale-[1.02]"
                            : "border-white/5 bg-white/2 hover:border-white/15 hover:bg-white/4"
                        }`}
                      >
                        {/* Internal hover glow backing */}
                        <div className={`absolute inset-0 bg-linear-to-br ${preset.glowColor} opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl -z-10`} />

                        <div className="flex items-start justify-between w-full">
                          <div className={`p-2 rounded-xl border transition-colors ${
                            isSelected 
                              ? "bg-primary/10 border-primary/20 text-primary" 
                              : "bg-white/5 border-white/10 text-text-muted group-hover:text-white"
                          }`}>
                            <PresetIcon size={18} />
                          </div>
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <Typography className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                            {preset.roleLabel}
                          </Typography>
                          <Typography className="text-xs font-black text-white truncate max-w-full">
                            {preset.name}
                          </Typography>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-4 text-center">
                <span className="h-px flex-1 bg-white/5" />
                <Typography className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em]">
                  Ou credenciais de rede
                </Typography>
                <span className="h-px flex-1 bg-white/5" />
              </div>

              {/* FORM SYSTEM */}
              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                {/* Inputs Stack */}
                <div className="space-y-4">
                  {/* Email Input Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                      Endereço de E-mail
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
                        <Mail size={16} />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (selectedRole && e.target.value !== PROFILE_PRESETS.find(p => p.role === selectedRole)?.email) {
                            setSelectedRole(null);
                          }
                        }}
                        placeholder="nome@ecovolt.com"
                        className="w-full pl-12 pr-4 py-3 bg-white/2 border border-white/5 rounded-xl text-white text-xs font-medium placeholder-white/20 focus:outline-none focus:border-primary focus:bg-white/4 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Input Field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                      Chave de Segurança
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
                        <Lock size={16} />
                      </div>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-12 pr-4 py-3 bg-white/2 border border-white/5 rounded-xl text-white text-xs font-medium placeholder-white/20 focus:outline-none focus:border-primary focus:bg-white/4 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Feedback Alerts Panel */}
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-start gap-3"
                    >
                      <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                      <div>
                        <Typography className="text-[10px] font-bold uppercase tracking-wider text-red-500 leading-none mb-1">
                          Restrição de Acesso
                        </Typography>
                        {error}
                      </div>
                    </motion.div>
                  )}

                  {success && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-medium flex items-start gap-3 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                    >
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 animate-bounce" />
                      <div>
                        <Typography className="text-[10px] font-bold uppercase tracking-wider text-primary leading-none mb-1">
                          Acesso Concedido
                        </Typography>
                        Sincronizando telemetria. Redirecionando...
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Login Action Submit Button */}
                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-black uppercase tracking-[0.15em] text-[10px] transition-all duration-300 relative overflow-hidden bg-linear-to-r from-primary to-primary-hover text-black hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] active:scale-98 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Autenticar no Operating System</span>
                      <ArrowRight size={14} strokeWidth={2.5} />
                    </>
                  )}
                </button>

              </form>

            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
