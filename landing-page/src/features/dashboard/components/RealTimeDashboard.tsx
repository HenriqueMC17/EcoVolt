"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Activity, Zap, Server, ShieldCheck } from "lucide-react";
import { Heading, Paragraph } from "@/shared/ui/Typography";
import { GlassCard } from "@/shared/ui/GlassCard";

export function RealTimeDashboard() {
  const energyData = useQuery(api.energy.getMachineData, { machineId: "generator-alpha", limit: 5 });
  const healthData = useQuery(api.health.ping);

  return (
    <section className="relative w-full py-24 bg-slate-950 text-white overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 z-10 relative">
        <Heading as="h2" className="text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
          Dashboard Real-Time
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-emerald-500/50 transition-colors duration-500 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Activity className="w-10 h-10 text-emerald-400 mb-4 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
            <Heading as="h4" className="mb-2 text-white/90">Status</Heading>
            <Paragraph className="text-emerald-400 font-medium">
              {healthData ? "Sistema Online" : "Conectando..."}
            </Paragraph>
          </GlassCard>

          <GlassCard className="p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-amber-500/50 transition-colors duration-500 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Zap className="w-10 h-10 text-amber-400 mb-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
            <Heading as="h4" className="mb-2 text-white/90">Voltagem</Heading>
            <Paragraph className="text-amber-400 font-medium text-2xl">
              {energyData && energyData.length > 0 ? `${energyData[0].voltage}V` : "-- V"}
            </Paragraph>
          </GlassCard>

          <GlassCard className="p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-blue-500/50 transition-colors duration-500 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <Server className="w-10 h-10 text-blue-400 mb-4 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
             <Heading as="h4" className="mb-2 text-white/90">Potência Reativa</Heading>
             <Paragraph className="text-blue-400 font-medium text-2xl">
               {energyData && energyData.length > 0 ? `${energyData[0].power}W` : "-- W"}
             </Paragraph>
          </GlassCard>
          
          <GlassCard className="p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-purple-500/50 transition-colors duration-500 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <ShieldCheck className="w-10 h-10 text-purple-400 mb-4 drop-shadow-[0_0_15px_rgba(192,132,252,0.5)]" />
            <Heading as="h4" className="mb-2 text-white/90">Identificador</Heading>
             <Paragraph className="text-purple-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
               {energyData && energyData.length > 0 ? energyData[0].machineId : "Aguardando Sinal..."}
             </Paragraph>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
