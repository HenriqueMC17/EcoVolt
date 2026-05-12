import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './modules/operations/pages/Overview';
import Contracts from './modules/commercial/pages/Contracts';

// Placeholder components for other pages
import Events from './modules/operations/pages/Events';
import Estimativa from './modules/operations/pages/Estimativa';
import Provedores from './modules/commercial/pages/Provedores';
import Propostas from './modules/commercial/pages/Propostas';
import Consumo from './modules/operations/pages/Consumo';
import Reconciliacao from './modules/financial/pages/Reconciliacao';
import Auditoria from './modules/operations/pages/Auditoria';
import Financeiro from './modules/financial/pages/Financeiro';
import Empresas from './modules/commercial/pages/Empresas';
import Usuarios from './modules/governance/pages/Usuarios';
import Compliance from './modules/governance/pages/Compliance';
import Relatorios from './modules/governance/pages/Relatorios';
import Configuracoes from './modules/governance/pages/Configuracoes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        {/* Redirect root to operations overview */}
        <Route index element={<Navigate to="/operations/overview" replace />} />
        
        {/* Operations Domain */}
        <Route path="operations">
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="eventos" element={<Events />} />
          <Route path="estimativa" element={<Estimativa />} />
          <Route path="consumo" element={<Consumo />} />
          <Route path="auditoria" element={<Auditoria />} />
        </Route>

        {/* Commercial Domain */}
        <Route path="commercial">
          <Route path="empresas" element={<Empresas />} />
          <Route path="propostas" element={<Propostas />} />
          <Route path="contratos" element={<Contracts />} />
          <Route path="provedores" element={<Provedores />} />
        </Route>

        {/* Financial Domain */}
        <Route path="financial">
          <Route path="financeiro" element={<Financeiro />} />
          <Route path="reconciliacao" element={<Reconciliacao />} />
        </Route>

        {/* Governance Domain */}
        <Route path="governance">
          <Route path="compliance" element={<Compliance />} />
          <Route path="relatorios" element={<Relatorios />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="configuracoes" element={<Configuracoes />} />
        </Route>

        {/* Legacy / Direct paths for compatibility if needed, otherwise removed */}
        <Route path="configuracoes" element={<Configuracoes />} />
      </Route>
    </Routes>
  );
}

export default App;
