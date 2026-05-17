import React from 'react';

export default function GlobalLoading() {
  return (
    <div className="w-full h-full flex flex-col gap-8 animate-pulse p-6">
      <header className="flex justify-between items-end">
        <div className="flex flex-col gap-4">
          <div className="h-10 w-64 bg-white/5 rounded-xl" />
          <div className="h-4 w-40 bg-white/5 rounded-md" />
        </div>
        <div className="h-10 w-32 bg-white/5 rounded-xl" />
      </header>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card h-32 bg-white/5" />
        ))}
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass-card h-[400px] bg-white/5" />
        <div className="lg:col-span-1 glass-card h-[400px] bg-white/5" />
      </div>
    </div>
  );
}
