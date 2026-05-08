import React, { useState } from 'react';
import { Zap, Info, Shield, TrendingUp, DollarSign } from 'lucide-react';
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
      <div className="page-header">
        <div>
          <h1 className="page-title">Calculadora de Demanda Energética</h1>
          <p className="page-subtitle">Formulário inteligente para previsão de consumo e custo operacional.</p>
        </div>
      </div>

      <div className="estimator-container">
        <form className="estimator-form glass" onSubmit={calculateEstimativa}>
          <div className="form-section">
            <h3>Dados Gerais do Evento</h3>
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
            <h3>Estrutura e Equipamentos</h3>
            <div className="form-grid">
              <div className="input-group">
                <label>Complexidade Técnica</label>
                <select value={formData.equipmentType} onChange={(e) => setFormData({...formData, equipmentType: e.target.value})}>
                  <option value="Basico">Básico (Som Ambiente)</option>
                  <option value="Som e Luz Profissional">Som e Iluminação Profissional</option>
                  <option value="Alta Performance">Alta Performance (LED / Palcos Múltiplos)</option>
                </select>
              </div>
              <div className="input-group-check">
                <input type="checkbox" checked={formData.hasKitchen} onChange={(e) => setFormData({...formData, hasKitchen: e.target.checked})} id="kitchen" />
                <label htmlFor="kitchen">Possui Área de Alimentação / Food Trucks</label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full">Calcular Demanda</button>
        </form>

        <div className="estimator-results">
          {!result ? (
            <div className="empty-state glass">
              <Zap size={48} className="text-muted" />
              <p>Insira os dados do evento para gerar a estimativa operacional.</p>
            </div>
          ) : (
            <div className="results-grid">
              <div className="result-card glass highlight">
                <div className="result-header">
                  <Zap size={20} />
                  <span>Consumo Estimado</span>
                </div>
                <div className="result-value">{result.kwh} kWh</div>
                <div className="result-footer text-primary">Previsão de alta confiança</div>
              </div>

              <div className="result-card glass highlight secondary">
                <div className="result-header">
                  <DollarSign size={20} />
                  <span>Custo Operacional</span>
                </div>
                <div className="result-value">{result.cost}</div>
                <div className="result-footer">Tarifa baseada no mercado livre</div>
              </div>

              <div className="result-card glass">
                <div className="result-header">
                  <Shield size={20} className="text-success" />
                  <span>Margem de Segurança</span>
                </div>
                <div className="result-value">{result.safetyMargin}</div>
                <p className="result-desc">Tolerância recomendada para picos de carga.</p>
              </div>

              <div className="result-card glass">
                <div className="result-header">
                  <TrendingUp size={20} className="text-info" />
                  <span>Risco Operacional</span>
                </div>
                <div className="result-value">{result.risk}</div>
                <p className="result-desc">Análise baseada na infraestrutura técnica.</p>
              </div>

              <div className="analysis-box glass">
                <div className="flex-center gap-2 mb-4">
                  <Info size={18} className="text-primary" />
                  <h3>Recomendação Estratégica</h3>
                </div>
                <p>Com base nos dados fornecidos, recomendamos a contratação de <strong>Faixa {result.range}</strong>. O evento apresenta um perfil de consumo estável com picos concentrados no período noturno.</p>
                <div className="actions">
                  <button className="btn btn-secondary">Salvar Simulação</button>
                  <button className="btn btn-primary">Gerar Proposta</button>
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
