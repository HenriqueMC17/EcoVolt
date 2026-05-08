import React from 'react';
import { 
  Settings, 
  Shield, 
  Bell, 
  Globe, 
  Database, 
  Key, 
  Save,
  UserCheck
} from 'lucide-react';
import './Configuracoes.css';

const Configuracoes: React.FC = () => {
  return (
    <div className="config-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Configurações do Sistema</h1>
          <p className="page-subtitle">Gerencie os parâmetros globais, segurança e regras de negócio da plataforma.</p>
        </div>
        <button className="btn btn-primary flex-center gap-2">
          <Save size={18} /> Salvar Alterações
        </button>
      </div>

      <div className="config-grid">
        <aside className="config-sidebar glass">
          <button className="config-nav-item active">
            <Settings size={18} /> Geral
          </button>
          <button className="config-nav-item">
            <Shield size={18} /> Segurança
          </button>
          <button className="config-nav-item">
            <Bell size={18} /> Notificações
          </button>
          <button className="config-nav-item">
            <Globe size={18} /> Regional e Idioma
          </button>
          <button className="config-nav-item">
            <Database size={18} /> Integrações
          </button>
          <button className="config-nav-item">
            <UserCheck size={18} /> Perfis de Acesso
          </button>
        </aside>

        <section className="config-content glass">
          <div className="config-section">
            <h3>Informações da Plataforma</h3>
            <div className="form-group">
              <label>Nome da Instância</label>
              <input type="text" defaultValue="EcoVolt Operational Dashboard" />
            </div>
            <div className="form-group">
              <label>URL de Acesso</label>
              <input type="text" defaultValue="https://op.ecovolt.com.br" />
            </div>
            <div className="form-group">
              <label>E-mail de Suporte</label>
              <input type="email" defaultValue="operacoes@ecovolt.com.br" />
            </div>
          </div>

          <div className="config-section separator">
            <h3>Regras de Negócio</h3>
            <div className="config-row">
              <div className="form-group">
                <label>Taxa de Serviço (%)</label>
                <input type="number" defaultValue="2.5" step="0.1" />
              </div>
              <div className="form-group">
                <label>Margem de Segurança de Carga (%)</label>
                <input type="number" defaultValue="15" />
              </div>
            </div>
            <div className="form-checkbox">
              <input type="checkbox" id="auto-recon" defaultChecked />
              <label htmlFor="auto-recon">Ativar Reconciliação Automática para contratos &lt; R$ 10k</label>
            </div>
          </div>

          <div className="config-section separator">
            <h3>Segurança e API</h3>
            <div className="api-key-box">
              <div className="api-info">
                <label>Chave de API (Produção)</label>
                <div className="key-display">
                  <code>ev_live_xxxxxxxxxxxxxxxxxxxxxx4a8f</code>
                  <button className="btn-icon"><Key size={14} /></button>
                </div>
              </div>
              <p className="helper-text">Utilizada para integração com sistemas de telemetria externos.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Configuracoes;
