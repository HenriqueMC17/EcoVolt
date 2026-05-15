import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Dashboard } from '../features/dashboard/ui/Dashboard';
import { AuthProvider } from './context/AuthContext';

// Pages
import Events from '../pages/Events';
import EventHub from '../pages/EventHub';
import Estimation from '../pages/Estimation';
import Providers from '../pages/Providers';
import Proposals from '../pages/Proposals';
import Contracts from '../pages/Contracts';
import Consumption from '../pages/Consumption';
import Financial from '../pages/Financial';
import Documents from '../pages/Documents';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventHub />} />
            <Route path="/estimation" element={<Estimation />} />
            <Route path="/providers" element={<Providers />} />
            <Route path="/proposals" element={<Proposals />} />
            <Route path="/contracts" element={<Contracts />} />
            <Route path="/consumption" element={<Consumption />} />
            <Route path="/financial" element={<Financial />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}

