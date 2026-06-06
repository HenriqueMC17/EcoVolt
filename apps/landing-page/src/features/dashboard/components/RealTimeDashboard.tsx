"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Activity, Zap, Server, ShieldCheck, AlertTriangle, PowerOff, CheckCircle2, Trash2 } from "lucide-react";
import { Heading, Paragraph } from "@/shared/ui/Typography";
import { GlassCard } from "@/shared/ui/GlassCard";

export function RealTimeDashboard() {
  const energyData = useQuery(api.energy.getMachineData, { machineId: "generator-alpha", limit: 5 });
  const healthData = useQuery(api.health.ping);

  const generateTelemetry = useMutation(api.energy.generateMockTelemetry);
  const clearData = useMutation(api.energy.clearMachineData);
  const [isSimulating, setIsSimulating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);


  const handleSimulate = async (type: "Peak" | "Overvoltage" | "Shutdown" | "Optimal") => {
    setIsSimulating(true);
    try {
      let voltage = 220;
      let current = 15;
      let power = 3300;
      let status = "Optimal";

      if (type === "Peak") {
        voltage = 215;
        current = 38;
        power = 8170;
        status = "Warning";
      } else if (type === "Overvoltage") {
        voltage = 254;
        current = 10;
        power = 2540;
        status = "Warning";
      } else if (type === "Shutdown") {
        voltage = 0;
        current = 0;
        power = 0;
        status = "Critical";
      }

      await generateTelemetry({
        machineId: "generator-alpha",
        voltage,
        current,
        power,
        status,
      });
    } catch (err) {
      console.error("Failed to generate telemetry:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleClear = async () => {
    setIsSimulating(true);
    try {
      await clearData({ machineId: "generator-alpha" });
    } catch (err) {
      console.error("Failed to clear data:", err);
    } finally {
      setIsSimulating(false);
    }
  };

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
              {mounted && healthData ? "Sistema Online" : "Conectando..."}
            </Paragraph>
          </GlassCard>

          <GlassCard className="p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-amber-500/50 transition-colors duration-500 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Zap className="w-10 h-10 text-amber-400 mb-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
            <Heading as="h4" className="mb-2 text-white/90">Voltagem</Heading>
            <Paragraph className="text-amber-400 font-medium text-2xl tabular-nums">
              {mounted && energyData && energyData.length > 0 ? <span className="whitespace-nowrap">{energyData[0].voltage}&nbsp;V</span> : <span className="whitespace-nowrap">--&nbsp;V</span>}
            </Paragraph>
          </GlassCard>

          <GlassCard className="p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-blue-500/50 transition-colors duration-500 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <Server className="w-10 h-10 text-blue-400 mb-4 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
             <Heading as="h4" className="mb-2 text-white/90">Potência Reativa</Heading>
             <Paragraph className="text-blue-400 font-medium text-2xl tabular-nums">
               {mounted && energyData && energyData.length > 0 ? <span className="whitespace-nowrap">{energyData[0].power}&nbsp;W</span> : <span className="whitespace-nowrap">--&nbsp;W</span>}
             </Paragraph>
          </GlassCard>
          
          <GlassCard className="p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-purple-500/50 transition-colors duration-500 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <ShieldCheck className="w-10 h-10 text-purple-400 mb-4 drop-shadow-[0_0_15px_rgba(192,132,252,0.5)]" />
            <Heading as="h4" className="mb-2 text-white/90">Identificador</Heading>
             <Paragraph className="text-purple-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                {mounted && energyData && energyData.length > 0 ? energyData[0].machineId : "Aguardando Sinal..."}
             </Paragraph>
          </GlassCard>
        </div>

        {/* Simulation Control Panel (Public Playground) */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="p-8 border border-white/10 bg-slate-900/40 backdrop-blur-md rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 mb-8">
              <div className="text-left space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                  <Heading as="h4" className="text-white text-lg font-black uppercase tracking-widest leading-none">Playground de Simulação</Heading>
                </div>
                <Paragraph className="text-xs text-slate-400 font-medium leading-normal">
                  Controle a telemetria do gerador e observe a propagação instantânea via Convex.
                </Paragraph>
              </div>
              
              <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-full border border-white/5">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Modo Playground:</span>
                <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Público</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 relative z-10">
              <button
                onClick={() => handleSimulate("Peak")}
                disabled={isSimulating}
                className="flex flex-col items-center justify-center p-4 bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/50 rounded-2xl text-center transition-all duration-300 hover:bg-amber-500/25 active:scale-95 group disabled:opacity-50 cursor-pointer"
              >
                <Zap className="w-6 h-6 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Pico de Carga</span>
              </button>
              
              <button
                onClick={() => handleSimulate("Overvoltage")}
                disabled={isSimulating}
                className="flex flex-col items-center justify-center p-4 bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/50 rounded-2xl text-center transition-all duration-300 hover:bg-rose-500/25 active:scale-95 group disabled:opacity-50 cursor-pointer"
              >
                <AlertTriangle className="w-6 h-6 text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Sobretensão</span>
              </button>

              <button
                onClick={() => handleSimulate("Shutdown")}
                disabled={isSimulating}
                className="flex flex-col items-center justify-center p-4 bg-red-500/10 border border-red-500/20 hover:border-red-500/50 rounded-2xl text-center transition-all duration-300 hover:bg-red-500/25 active:scale-95 group disabled:opacity-50 cursor-pointer"
              >
                <PowerOff className="w-6 h-6 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Parada Total</span>
              </button>

              <button
                onClick={() => handleSimulate("Optimal")}
                disabled={isSimulating}
                className="flex flex-col items-center justify-center p-4 bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/50 rounded-2xl text-center transition-all duration-300 hover:bg-emerald-500/25 active:scale-95 group disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Restaurar</span>
              </button>

              <button
                onClick={handleClear}
                disabled={isSimulating}
                className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-4 bg-slate-800/40 border border-white/5 hover:border-white/20 rounded-2xl text-center transition-all duration-300 hover:bg-slate-800/60 active:scale-95 group disabled:opacity-50 cursor-pointer"
              >
                <Trash2 className="w-6 h-6 text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Limpar Logs</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

