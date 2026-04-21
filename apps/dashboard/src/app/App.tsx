import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '@/shared/components/Navbar';
import { Hero } from '@/features/hero/ui/Hero';
import { StatsOverview } from '@/features/stats-overview/ui/StatsOverview';
import { Footer } from '@/shared/components/Footer';
import { DashboardLayout } from '@/shared/components/DashboardLayout';
// Features
import { DashboardOverview } from '@/features/dashboard-overview/ui/DashboardOverview';
import { Contracts } from '@/features/contracts/ui/Contracts';
import { Events } from '@/features/events/ui/Events';
import { Estimation } from '@/features/estimation/ui/Estimation';
import { Providers } from '@/features/providers/ui/Providers';

// Providers
import { UserProvider } from '@/context/UserContext';
import { ToastProvider } from '@/context/ToastContext';

// Legacy Pages (to be migrated)
import Estimation from '@/pages/Estimation';
import Providers from '@/pages/Providers';
import Proposals from '@/pages/Proposals';
import Consumption from '@/pages/Consumption';
import Financial from '@/pages/Financial';
import Documents from '@/pages/Documents';
import Management from '@/pages/Management';

const LandingPage = () => (
  <div className="bg-bg-main min-h-screen">
    <Navbar />
    <Hero />
    <StatsOverview />
    <Footer />
  </div>
);

export const App: React.FC = () => {
  return (
    <UserProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="contratos" element={<Contracts />} />
              <Route path="eventos" element={<Events />} />
              <Route path="estimativas" element={<Estimation />} />
              <Route path="provedores" element={<Providers />} />
              <Route path="propostas" element={<Proposals />} />
              <Route path="consumo" element={<Consumption />} />
              <Route path="financeiro" element={<Financial />} />
              <Route path="documentos" element={<Documents />} />
              <Route path="configuracoes" element={<Management />} />
              {/* Fallback for dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
            
            {/* Global Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </UserProvider>
  );
};

