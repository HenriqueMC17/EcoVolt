import React from 'react';
import { MainLayout } from '../../../layouts/MainLayout';

export const Dashboard: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Visão geral do sistema EcoVolt.</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Cards de métricas premium */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Consumido</h3>
            <div className="text-2xl font-bold mt-2">1,234 kWh</div>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Geração Solar</h3>
            <div className="text-2xl font-bold mt-2">845 kWh</div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
