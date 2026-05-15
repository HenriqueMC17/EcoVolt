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

export const Settings = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Configurações</h1>
        <p className="text-slate-400 mt-2">Gerencie sua conta, preferências e segurança da plataforma.</p>
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                item.active 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-white/10">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200">
              <LogOut size={20} />
              <span className="font-medium">Sair da Conta</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Section */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-8">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 p-1">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                    <User size={40} className="text-slate-400" />
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-emerald-500 rounded-full text-white shadow-lg border-2 border-slate-900 hover:scale-110 transition-transform">
                  <Smartphone size={14} />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Henrique Montemagno</h2>
                <p className="text-slate-400">Administrador da Plataforma</p>
                <div className="mt-2 flex gap-2">
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/20">Ativo</span>
                  <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-xs font-medium rounded-full border border-cyan-500/20">Premium</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Nome Completo</label>
                <input 
                  type="text" 
                  defaultValue="Henrique Montemagno"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">E-mail Corporativo</label>
                <input 
                  type="email" 
                  defaultValue="henrique@ecovolt.energy"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Cargo / Função</label>
                <input 
                  type="text" 
                  defaultValue="Engenheiro de Sustentabilidade"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Telefone</label>
                <input 
                  type="text" 
                  defaultValue="+55 (11) 99999-9999"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25">
                Salvar Alterações
              </button>
            </div>
          </div>

          {/* Security Summary Card */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <Shield size={20} className="text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Segurança da Conta</h3>
              </div>
              <button className="text-emerald-400 text-sm font-medium hover:underline">Configurar</button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <Key size={20} className="text-slate-400" />
                  <div>
                    <p className="text-white font-medium">Autenticação de Dois Fatores (2FA)</p>
                    <p className="text-xs text-slate-400">Proteja sua conta com um código extra.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Ativado</span>
                  <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <Smartphone size={20} className="text-slate-400" />
                  <div>
                    <p className="text-white font-medium">Dispositivos Conectados</p>
                    <p className="text-xs text-slate-400">Gerencie onde você está logado.</p>
                  </div>
                </div>
                <span className="text-sm text-slate-400">3 ativos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
