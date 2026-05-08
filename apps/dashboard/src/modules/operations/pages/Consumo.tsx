import React from 'react';
import { 
  Activity, 
  Zap, 
  TrendingUp, 
  AlertCircle,
  Database,
  ArrowUpRight,
  ArrowDownRight
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
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Equipamento', accessor: 'name' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row: Device) => (
        <span className={`badge-${row.status}`}>
          {row.status.toUpperCase()}
        </span>
      )
    },
    { header: 'Carga Atual', accessor: 'currentLoad' },
    { header: 'Tensão', accessor: 'voltage' },
    { header: 'Sincronização', accessor: 'lastSync' },
  ];

  return (
    <div className="consumo-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Telemetria e Consumo</h1>
          <p className="page-subtitle">Acompanhamento em tempo real da carga energética da operação.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">Download Log</button>
          <button className="btn btn-primary flex-center gap-2">
            <TrendingUp size={18} />
            Análise Preditiva
          </button>
        </div>
      </div>

      <div className="consumo-grid">
        {/* Real-time Graph */}
        <div className="chart-card glass large">
          <div className="chart-header">
            <div className="flex-center gap-2">
              <Activity size={20} className="text-primary" />
              <h3>Carga Instantânea (kW)</h3>
            </div>
            <div className="live-indicator">
              <span className="dot pulse"></span>
              LIVE
            </div>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={telemetryData}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px'}}
                  itemStyle={{color: '#f8fafc'}}
                />
                <Area type="monotone" dataKey="kwh" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLoad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mini Stats */}
        <div className="stats-column">
          <div className="stat-card glass">
            <div className="stat-icon-box blue">
              <Zap size={20} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Demanda Atual</p>
              <h3 className="stat-value">91.4 kW</h3>
              <div className="stat-trend positive">
                <ArrowUpRight size={14} />
                <span>+12% vs última hora</span>
              </div>
            </div>
          </div>

          <div className="stat-card glass">
            <div className="stat-icon-box green">
              <Database size={20} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Consumo Acumulado</p>
              <h3 className="stat-value">1,450 kWh</h3>
              <div className="stat-trend neutral">
                <span>Dentro do previsto</span>
              </div>
            </div>
          </div>

          <div className="stat-card glass alert">
            <div className="stat-icon-box yellow">
              <AlertCircle size={20} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Eficiência Energética</p>
              <h3 className="stat-value">94.2%</h3>
              <div className="stat-trend negative">
                <ArrowDownRight size={14} />
                <span>-2.1% instabilidade</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="distribution-grid mt-6">
        {/* Distribution Chart */}
        <div className="chart-card glass">
          <div className="chart-header">
            <h3>Distribuição de Carga por Setor</h3>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={distributionData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#f8fafc', fontSize: 12}} 
                  width={100}
                />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px'}}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Table */}
        <div className="device-table-container">
          <DataTable 
            title="Sensores e Atuadores"
            columns={columns}
            data={devices}
          />
        </div>
      </div>
    </div>
  );
};

export default Consumo;
