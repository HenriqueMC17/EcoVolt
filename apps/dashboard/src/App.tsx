import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Overview from './pages/Overview';
import Estimation from './pages/Estimation';
import Contracts from './pages/Contracts';
import Events from './pages/Events';
import Providers from './pages/Providers';
import Consumption from './pages/Consumption';
import Financial from './pages/Financial';
import Documents from './pages/Documents';
import Management from './pages/Management';
import { ToastProvider } from './context/ToastContext';
import { UserProvider } from './context/UserContext';

import Proposals from './pages/Proposals';

// Placeholder pages for other routes
const ReportsPage = () => <div className="card glass"><h2>Relatórios</h2><p>Analytics em breve...</p></div>;


const App: React.FC = () => {
  return (
    <UserProvider>
      <ToastProvider>
        <Router>
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            
            <div style={{ 
              flex: 1, 
              marginLeft: 'var(--sidebar-width)', 
              display: 'flex', 
              flexDirection: 'column' 
            }}>
              <Topbar />
              
              <main style={{ 
                flex: 1, 
                marginTop: 'var(--topbar-height)', 
                padding: '40px 32px',
                overflowY: 'auto'
              }}>
                <Routes>
                  <Route path="/" element={<Overview />} />
                  <Route path="/eventos" element={<Events />} />
                  <Route path="/estimativas" element={<Estimation />} />
                  <Route path="/provedores" element={<Providers />} />
                  <Route path="/propostas" element={<Proposals />} />
                  <Route path="/contratos" element={<Contracts />} />
                  <Route path="/consumo" element={<Consumption />} />
                  <Route path="/financeiro" element={<Financial />} />
                  <Route path="/documentos" element={<Documents />} />
                  <Route path="/relatorios" element={<ReportsPage />} />
                  <Route path="/configuracoes" element={<Management />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </ToastProvider>
    </UserProvider>
  );
};

export default App;
