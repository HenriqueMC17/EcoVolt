import React, { useState } from 'react';
import { Zap, Info, Shield, TrendingUp, DollarSign } from 'lucide-react';
import '../../../styles/enterprise-components.css';
import './Estimativa.css';

interface EstimativaResult {
  kwh: string;
  cost: string;
  safetyMargin: string;
  risk: string;
  range: string;
}

const Estimativa: React.FC = () => {
  const [formData, setFormData] = useState({
    eventType: 'Festival',
    days: 3,
    expectedPublic: 5000,
    equipmentType: 'Som e Luz Profissional',
    hasKitchen: true,
  });

  const [result, setResult] = useState<EstimativaResult | null>(null);

  const calculateEstimativa = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulated operational logic
    const kwh = formData.expectedPublic * 0.5 * formData.days;
    const cost = kwh * 1.25;
    
    setResult({
      kwh: kwh.toLocaleString('pt-BR'),
      cost: cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      safetyMargin: '15%',
      risk: 'Baixo',
      range: 'B - Mdio Porte'
    });
  };

  return (
    <div className="estimativa-page animate-fade-in">
      <div className="module-header">
        <div className="header-content">
          <div className="header-badge">Inteligência Operacional</div>
          <h1 className="header-title">Simulador de Demanda</h1>
          <p className="header-subtitle">Previsão algorítmica de consumo e custo baseada em parâmetros operacionais.</p>
        </div>
      </div>

      <div className="estimator-container">
        <div className="content-card-enterprise estimator-form-card">
          <div className="card-header">
            <div className="header-info">
              <h3>Parâmetros da Simulação</h3>
              <p>Configure os dados base para o cálculo de demanda</p>
            </div>
          </div>
          <div className="card-body">
            <form className="estimator-form" onSubmit={calculateEstimativa}>
              <div className="form-section">
                <div className="form-section-header">
                  <Zap size={18} className="text-primary" />
                  <h3>Dados Gerais do Evento</h3>
                </div>
                <div className="form-grid">
                  <div className="input-group">
                    <label>Tipo de Evento</label>
                    <select value={formData.eventType} onChange={(e) => setFormData({...formData, eventType: e.target.value})}>
                      <option value="Festival">Festival Musical</option>
                      <option value="Congresso">Congresso / Feira</option>
                      <option value="Esportivo">Evento Esportivo</option>
                      <option value="Privado">Evento Corporativo</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Duração (Dias)</label>
                    <input type="number" value={formData.days} onChange={(e) => setFormData({...formData, days: Number(e.target.value)})} />
                  </div>
                  <div className="input-group">
                    <label>Público Estimado / Dia</label>
                    <input type="number" value={formData.expectedPublic} onChange={(e) => setFormData({...formData, expectedPublic: Number(e.target.value)})} />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-header">
                  <Shield size={18} className="text-secondary" />
                  <h3>Estrutura e Equipamentos</h3>
                </div>
                <div className="form-grid">
                  <div className="input-group">
                    <label>Complexidade Técnica</label>
                    <select value={formData.equipmentType} onChange={(e) => setFormData({...formData, equipmentType: e.target.value})}>
                      <option value="Basico">Básico (Som Ambiente)</option>
                      <option value="Som e Luz Profissional">Som e Iluminação Profissional</option>
                      <option value="Alta Performance">Alta Performance (LED / Palcos Múltiplos)</option>
                    </select>
                  </div>
                  <div className="input-group-check" onClick={() => setFormData({...formData, hasKitchen: !formData.hasKitchen})}>
                    <input type="checkbox" checked={formData.hasKitchen} readOnly id="kitchen" />
                    <label htmlFor="kitchen">Possui Área de Alimentação</label>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full py-4 font-bold text-lg mt-4">Calcular Demanda</button>
            </form>
          </div>
        </div>

        <div className="estimator-results">
          {!result ? (
            <div className="empty-state glass">
              <div className="empty-icon-box">
                <Zap size={48} className="text-muted opacity-20" />
              </div>
              <h4>Aguardando Parâmetros</h4>
              <p>Insira os dados do evento ao lado para gerar a estimativa operacional detalhada.</p>
            </div>
          ) : (
            <div className="results-container animate-fade-in">
              <div className="kpi-grid results-kpis">
                <div className="kpi-card-enterprise">
                  <div className="kpi-header">
                    <div className="kpi-icon-box primary">
                      <Zap size={20} />
                    </div>
                  </div>
                  <div className="kpi-content">
                    <span className="kpi-label">Consumo Estimado</span>
                    <h2 className="kpi-value">{result.kwh} <small className="text-sm font-medium text-muted">kWh</small></h2>
                    <p className="kpi-desc text-primary font-bold">Previsão de alta confiança</p>
                  </div>
                </div>

                <div className="kpi-card-enterprise">
                  <div className="kpi-header">
                    <div className="kpi-icon-box secondary">
                      <DollarSign size={20} />
                    </div>
                  </div>
                  <div className="kpi-content">
                    <span className="kpi-label">Custo Operacional</span>
                    <h2 className="kpi-value">{result.cost}</h2>
                    <p className="kpi-desc text-secondary font-bold">Tarifa estimada</p>
                  </div>
                </div>

                <div className="kpi-card-enterprise">
                  <div className="kpi-header">
                    <div className="kpi-icon-box success">
                      <Shield size={20} />
                    </div>
                  </div>
                  <div className="kpi-content">
                    <span className="kpi-label">Segurança</span>
                    <h2 className="kpi-value">{result.safetyMargin}</h2>
                    <p className="kpi-desc">Margem p/ picos de carga</p>
                  </div>
                </div>

                <div className="kpi-card-enterprise">
                  <div className="kpi-header">
                    <div className="kpi-icon-box warning">
                      <TrendingUp size={20} />
                    </div>
                  </div>
                  <div className="kpi-content">
                    <span className="kpi-label">Grau de Risco</span>
                    <h2 className="kpi-value">{result.risk}</h2>
                    <p className="kpi-desc">Análise de infraestrutura</p>
                  </div>
                </div>
              </div>

              <div className="intelligence-banner glass">
                <div className="banner-icon">
                  <Info size={24} className="text-primary" />
                </div>
                <div className="banner-content">
                  <span className="ai-badge-mini">Recomendação EcoVolt</span>
                  <h4>Contratação Sugerida: Faixa {result.range}</h4>
                  <p>Com base nos dados fornecidos, o evento apresenta um perfil de consumo estável. Recomendamos a contratação imediata para garantir a tarifa simulada.</p>
                </div>
                <div className="banner-actions">
                  <button className="btn btn-secondary btn-sm">Salvar</button>
                  <button className="btn btn-primary btn-sm">Gerar Proposta</button>
                </div>
              </div>

              <div className="content-card-enterprise">
                <div className="card-header">
                  <div className="header-info">
                    <h3>Curva de Carga Estimada</h3>
                    <p>Distribuição horária prevista para os dias de operação</p>
                  </div>
                </div>
                <div className="card-body">
                  <div className="placeholder-chart flex-center h-[200px] border border-dashed border-border rounded-lg bg-white/5 text-muted italic">
                    Visualização da curva de carga em desenvolvimento...
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Estimativa;
