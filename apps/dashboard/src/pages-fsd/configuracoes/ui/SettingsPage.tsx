"use client";

import React from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Palette, 
  Zap, 
  Key,
  Smartphone,
  LogOut
} from 'lucide-react';
import { Typography } from '@/shared/ui/Typography';

export const SettingsPage: React.FC = () => {
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
        {/* Navigation Tabs (Sidebar de Configurações) */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'profile', label: 'Perfil', icon: User, active: true },
            { id: 'notifications', label: 'Notificações', icon: Bell },
            { id: 'security', label: 'Segurança', icon: Shield },
            { id: 'appearance', label: 'Aparência', icon: Palette },
            { id: 'integrations', label: 'Integrações', icon: Zap },
            { id: 'languages', label: 'Idioma e Região', icon: Globe },
          ].map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-full transition-all duration-300 font-bold tracking-wide ${
                item.active 
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg' 
                  : 'text-white/40 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-white/10">
            <button className="w-full flex items-center gap-4 px-5 py-4 rounded-full text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all duration-300 font-bold border border-transparent">
              <LogOut size={20} />
              <span className="text-sm">Sair da Conta</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Section */}
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
                <Typography variant="h3" className="text-3xl font-bold text-white tracking-tight">Henrique Montemagno</Typography>
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
                  defaultValue="Henrique Montemagno"
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
              <button className="px-10 py-4 bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-[10px] rounded-full transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                Salvar Alterações
              </button>
            </div>
          </div>

          {/* Security Summary Card */}
          <div className="glass-card p-10 border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <Shield size={24} className="text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Segurança da Conta</h3>
              </div>
              <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:text-white transition-colors">Configurar</button>
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
        </div>
      </div>
    </div>
  );
};
