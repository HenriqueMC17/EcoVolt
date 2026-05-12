import React from 'react';
import { 
  Activity, 
  Zap, 
  TrendingUp, 
  AlertCircle,
  Database,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  BarChart3,
  Cpu
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import type { StatusType } from '../../../components/shared/StatusBadge';
import '../../../styles/enterprise-components.css';
import './Consumo.css';

const telemetryData = [
  { time: '10:00', kwh: 45 },
  { time: '10:15', kwh: 52 },
  { time: '10:30', kwh: 48 },
  { time: '10:45', kwh: 61 },
  { time: '11:00', kwh: 55 },
  { time: '11:15', kwh: 67 },
  { time: '11:30', kwh: 72 },
  { time: '11:45', kwh: 58 },
  { time: '12:00', kwh: 50 },
];

const distributionData = [
  { name: 'Palco Principal', value: 45, color: '#3b82f6' },
  { name: 'Área Food', value: 25, color: '#10b981' },
  { name: 'Iluminação', value: 15, color: '#f59e0b' },
  { name: 'Backstage', value: 10, color: '#8b5cf6' },
  { name: 'Outros', value: 5, color: '#94a3b8' },
];

interface Device {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'alert';
  currentLoad: string;
  voltage: string;
  lastSync: string;
}

const devices: Device[] = [
  { id: 'MT-01', name: 'Medidor Principal - Entrada A', status: 'online', currentLoad: '12.5 kW', voltage: '220V', lastSync: '1 min atrás' },
  { id: 'MT-02', name: 'Subestação Palco Norte', status: 'online', currentLoad: '45.2 kW', voltage: '220V', lastSync: '30 seg atrás' },
  { id: 'MT-03', name: 'Quadro Distribuição Food Park', status: 'alert', currentLoad: '28.9 kW', voltage: '215V', lastSync: '2 min atrás' },
  { id: 'MT-04', name: 'Unidade Backstage B', status: 'online', currentLoad: '5.4 kW', voltage: '221V', lastSync: '5 min atrás' },
  { id: 'MT-05', name: 'Gerador Emergência 01', status: 'offline', currentLoad: '0.0 kW', voltage: '0V', lastSync: '15 min atrás' },
];

const Consumo: React.FC = () => {
  const getStatusInfo = (status: Device['status']): { type: StatusType; label: string; pulse?: boolean } => {
    switch (status) {
      case 'online':
        return { type: 'success', label: 'Online', pulse: true };
      case 'offline':
        return { type: 'neutral', label: 'Offline' };
      case 'alert':
        return { type: 'error', label: 'Alerta', pulse: true };
      default:
        return { type: 'neutral', label: status };
    }
  };

  const columns = [
    { 
      header: 'ID', 
      accessor: 'id' as keyof Device,
      sortable: true 
    },
    { 
      header: 'Equipamento', 
      accessor: 'name' as keyof Device,
      sortable: true,
      render: (row: Device) => (
        <div className="flex items-center gap-3">
          <div className="device-icon-wrapper">
            <Cpu size={16} />
          </div>
          <span className="font-medium">{row.name}</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status' as keyof Device,
      sortable: true,
      render: (row: Device) => {
        const { type, label, pulse } = getStatusInfo(row.status);
        return <StatusBadge status={type} label={label} pulse={pulse} variant="glass" size="sm" />;
      }
    },
    { 
      header: 'Carga Atual', 
      accessor: 'currentLoad' as keyof Device,
      sortable: true,
      render: (row: Device) => (
        <span className="font-mono text-primary">{row.currentLoad}</span>
      )
    },
    { 
      header: 'Tensão', 
      accessor: 'voltage' as keyof Device,
      sortable: true 
    },
    { 
      header: 'Sincronização', 
      accessor: 'lastSync' as keyof Device,
      sortable: true,
      render: (row: Device) => (
        <span className="text-sm text-muted">{row.lastSync}</span>
      )
    }
  ];

  return (
    <div className="consumo-page animate-fade-in">
      {/* Executive Header */}
      <div className="module-header">
        <div className="header-content">
          <div className="header-badge">Telemetria Real-time</div>
          <h1 className="header-title">Gestão de Consumo</h1>
          <p className="header-subtitle">Monitoramento de carga, eficiência e distribuição energética da operação.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary flex items-center gap-2">
            <Filter size={18} />
            Filtros
          </button>
          <button className="btn btn-primary flex items-center gap-2">
            <TrendingUp size={18} />
            Análise Preditiva
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box info">
              <Zap size={20} />
            </div>
            <div className="kpi-trend negative">
              <ArrowUpRight size={12} /> +12%
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Demanda Atual</span>
            <h2 className="kpi-value">91.4 kW</h2>
            <p className="kpi-desc">vs. 1h atrás</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box success">
              <Database size={20} />
            </div>
            <div className="kpi-trend positive">
              Estável
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Consumo Acumulado</span>
            <h2 className="kpi-value text-primary">1,450 kWh</h2>
            <p className="kpi-desc">Dentro da meta prevista</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box warning">
              <AlertCircle size={20} />
            </div>
            <div className="kpi-trend negative">
              <ArrowDownRight size={12} /> -2.1%
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Eficiência Energética</span>
            <h2 className="kpi-value">94.2%</h2>
            <p className="kpi-desc">Leve instabilidade detectada</p>
          </div>
        </div>

        <div className="kpi-card-enterprise">
          <div className="kpi-header">
            <div className="kpi-icon-box secondary">
              <BarChart3 size={20} />
            </div>
            <div className="kpi-trend positive">
              Otimizado
            </div>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Fator de Carga</span>
            <h2 className="kpi-value">0.82</h2>
            <p className="kpi-desc">Distribuição equilibrada</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid consumo-charts">
        {/* Real-time Graph */}
        <div className="content-card-enterprise chart-card large">
          <div className="card-header">
            <div className="header-info">
              <div className="flex items-center gap-2">
                <Activity size={20} className="text-primary" />
                <h3>Curva de Carga Instantânea (kW)</h3>
              </div>
            </div>
            <div className="header-actions">
              <div className="live-tag">
                <span className="dot pulse"></span>
                LIVE
              </div>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={telemetryData}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--bg-sidebar)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(8px)'
                  }}
                  itemStyle={{color: 'var(--text-main)'}}
                />
                <Area type="monotone" dataKey="kwh" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorLoad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Distribution */}
        <div className="content-card-enterprise chart-card">
          <div className="card-header">
            <div className="header-info">
              <div className="flex items-center gap-2">
                <BarChart3 size={20} className="text-secondary" />
                <h3>Distribuição por Setor</h3>
              </div>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={distributionData} layout="vertical" margin={{ left: -20, right: 20 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'var(--text-main)', fontSize: 11}} 
                  width={100}
                />
                <Tooltip 
                  cursor={{fill: 'var(--bg-hover)'}}
                  contentStyle={{
                    backgroundColor: 'var(--bg-sidebar)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Operational Table */}
      <div className="content-card-enterprise">
        <div className="card-header">
          <div className="header-info">
            <h3>Inventário de Telemetria</h3>
            <p>Monitoramento ativo de sensores e medidores de campo</p>
          </div>
          <div className="header-actions">
            <button className="btn-text flex items-center gap-2">
              <Download size={16} /> Exportar Relatório
            </button>
          </div>
        </div>
        <div className="card-body">
          <DataTable 
            columns={columns}
            data={devices}
            searchPlaceholder="Buscar por ID ou Equipamento..."
          />
        </div>
      </div>
    </div>
  );
};

export default Consumo;
