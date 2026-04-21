import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTopbar } from './DashboardTopbar';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-bg-main">
      <DashboardSidebar />
      
      <div className="flex-1 ml-64 flex flex-col">
        <DashboardTopbar />
        
        <main className="flex-1 mt-20 p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
