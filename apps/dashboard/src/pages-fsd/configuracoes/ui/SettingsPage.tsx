"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Palette, 
  Zap, 
  Key,
  Smartphone,
  LogOut,
  Sun,
  Wind,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { Typography } from '@/shared/ui/Typography';

type TabId = 'profile' | 'notifications' | 'security' | 'appearance' | 'integrations' | 'languages';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [currentTheme, setCurrentTheme] = useState<string>('solar');

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('ecovolt-theme') || 'solar';
    setCurrentTheme(savedTheme);
    if (savedTheme === 'solar') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem('ecovolt-theme', theme);
    if (theme === 'solar') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  };

  return (
    <div className="space-y-8 animate-luxury pb-20">
      {/* Header */}
      <div>
        <Typography variant="h1" className="text-4xl font-black tracking-tighter text-white uppercase italic">
          Configurações
        </Typography>
        <p className="text-white/40 mt-2 font-medium tracking-wide">Gerencie sua conta, preferências e segurança da plataforma.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'profile', label: 'Perfil', icon: User },
            { id: 'notifications', label: 'Notificações', icon: Bell },
            { id: 'security', label: 'Segurança', icon: Shield },
            { id: 'appearance', label: 'Aparência', icon: Palette },
            { id: 'integrations', label: 'Integrações', icon: Zap },
            { id: 'languages', label: 'Idioma e Região', icon: Globe },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabId)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-full transition-all duration-300 font-bold tracking-wide cursor-pointer ${
                  isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg' 
                    : 'text-white/40 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <item.icon size={20} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
          
          <div className="pt-4 mt-4 border-t border-white/10">
            <button className="w-full flex items-center gap-4 px-5 py-4 rounded-full text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all duration-300 font-bold border border-transparent cursor-pointer">
              <LogOut size={20} />
              <span className="text-sm">Sair da Conta</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'profile' && (
            <div className="glass-card p-10 space-y-8 border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 relative z-10">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-teal-400 p-1 shadow-2xl">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                      <User size={48} className="text-white/20" />
                    </div>
                  </div>
                  <button className="absolute bottom-0 right-0 p-3 bg-primary rounded-full text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] border-[3px] border-black hover:scale-110 transition-transform">
                    <Smartphone size={16} />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <Typography variant="h3" className="text-3xl font-bold text-white tracking-tight">Henrique Monteiro</Typography>
                  <p className="text-white/40 mt-1 font-medium">Administrador da Plataforma</p>
                  <div className="mt-4 flex justify-center sm:justify-start gap-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20 shadow-lg">Ativo</span>
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/20 shadow-lg">Premium</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Nome Completo</label>
                  <input 
                    type="text" 
                    defaultValue="Henrique Monteiro"
                    className="w-full bg-black/40 border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-bold text-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">E-mail Corporativo</label>
                  <input 
                    type="email" 
                    defaultValue="henrique@ecovolt.energy"
                    className="w-full bg-black/40 border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-bold text-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Cargo / Função</label>
                  <input 
                    type="text" 
                    defaultValue="Engenheiro de Sustentabilidade"
                    className="w-full bg-black/40 border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-bold text-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Telefone</label>
                  <input 
                    type="text" 
                    defaultValue="+55 (11) 99999-9999"
                    className="w-full bg-black/40 border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-bold text-sm"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 flex justify-end relative z-10">
                <button className="px-10 py-4 bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-[10px] rounded-full transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] cursor-pointer">
                  Salvar Alterações
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="glass-card p-10 border border-white/10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <Shield size={24} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Segurança da Conta</h3>
                  <p className="text-white/40 text-sm font-medium">Controle suas credenciais e mecanismos de verificação.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-black/40 rounded-[2rem] border border-white/10 hover:border-white/20 transition-all cursor-pointer group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white group-hover:bg-white/10 transition-all">
                      <Key size={20} />
                    </div>
                    <div>
                      <p className="text-white font-bold tracking-wide">Autenticação de Dois Fatores (2FA)</p>
                      <p className="text-sm text-white/40 font-medium">Proteja sua conta com um código extra.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">Ativado</span>
                    <div className="w-12 h-6 bg-primary rounded-full relative shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-black/40 rounded-[2rem] border border-white/10 hover:border-white/20 transition-all cursor-pointer group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white group-hover:bg-white/10 transition-all">
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <p className="text-white font-bold tracking-wide">Dispositivos Conectados</p>
                      <p className="text-sm text-white/40 font-medium">Gerencie onde você está logado.</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black tracking-widest uppercase text-white/40 bg-white/5 border border-white/10 px-4 py-2 rounded-full">3 ativos</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="glass-card p-10 border border-white/10 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-secondary/10 rounded-2xl border border-secondary/20">
                  <Palette size={24} className="text-secondary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Tema e Aparência</h3>
                  <p className="text-white/40 text-sm font-medium">Selecione a identidade visual da sua central de energia.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {/* Solar / Emerald Theme */}
                <button 
                  onClick={() => handleThemeChange('solar')}
                  className={`flex flex-col gap-4 p-6 rounded-3xl border transition-all text-left cursor-pointer group relative overflow-hidden ${
                    currentTheme === 'solar' 
                      ? 'bg-primary/5 border-primary shadow-[0_0_30px_rgba(16,185,129,0.15)]' 
                      : 'bg-black/40 border-white/5 hover:border-white/15 hover:bg-white/2'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Sun size={20} className="text-primary animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-wider text-white">Solar / Emerald</p>
                    <p className="text-xs text-white/40 mt-1 font-medium">Esmeralda Energético</p>
                  </div>
                  {currentTheme === 'solar' && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle2 size={16} className="text-primary" />
                    </div>
                  )}
                </button>

                {/* Wind / Sapphire Theme */}
                <button 
                  onClick={() => handleThemeChange('wind')}
                  className={`flex flex-col gap-4 p-6 rounded-3xl border transition-all text-left cursor-pointer group relative overflow-hidden ${
                    currentTheme === 'wind' 
                      ? 'bg-blue-500/5 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.15)]' 
                      : 'bg-black/40 border-white/5 hover:border-white/15 hover:bg-white/2'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Wind size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-wider text-white">Wind / Sapphire</p>
                    <p className="text-xs text-white/40 mt-1 font-medium">Safira e Eletricidade</p>
                  </div>
                  {currentTheme === 'wind' && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle2 size={16} className="text-blue-400" />
                    </div>
                  )}
                </button>

                {/* Biomass / Amber Theme */}
                <button 
                  onClick={() => handleThemeChange('biomass')}
                  className={`flex flex-col gap-4 p-6 rounded-3xl border transition-all text-left cursor-pointer group relative overflow-hidden ${
                    currentTheme === 'biomass' 
                      ? 'bg-amber-500/5 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.15)]' 
                      : 'bg-black/40 border-white/5 hover:border-white/15 hover:bg-white/2'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Flame size={20} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-wider text-white">Biomass / Amber</p>
                    <p className="text-xs text-white/40 mt-1 font-medium">Âmbar e Térmica</p>
                  </div>
                  {currentTheme === 'biomass' && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle2 size={16} className="text-amber-500" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {['notifications', 'integrations', 'languages'].includes(activeTab) && (
            <div className="glass-card p-10 border border-white/10 text-center space-y-4">
              <Typography variant="h3" className="text-xl font-bold text-white uppercase tracking-wider">Módulo em Desenvolvimento</Typography>
              <p className="text-white/40 text-sm font-medium">Esta seção de configurações será liberada em breve na próxima atualização do EcoVolt OS.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
