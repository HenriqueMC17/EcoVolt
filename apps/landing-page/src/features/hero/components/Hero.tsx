"use client";

import React from "react";
import { m as motion } from "framer-motion";
import { Button } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";
import { Glow } from "@/shared/ui/Glow";
import { Heading, Paragraph } from "@/shared/ui/Typography";
import { ArrowRight } from "lucide-react";
import { TrustCloud } from "./TrustCloud";
import { cn } from "@/shared/lib/utils";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
// Note: using lucide-react standard icons
import { Activity as ActivityIcon, Zap as ZapIcon, ShieldCheck as ShieldIcon, BarChart3 as ChartIcon, Lock as LockIcon, Cpu as CpuIcon } from "lucide-react";

const HeroDashboard = () => {
  const energyData = useQuery(api.energy.getMachineData, { machineId: "generator-alpha", limit: 3 });
  const recentData = energyData?.[0];
  const powerKb = recentData ? (recentData.power / 100).toFixed(2) : "482.4";

  const barHeights = [
    45, 78, 34, 89, 23, 56, 91, 44, 67, 32, 88, 54, 76, 21, 95, 43,
    65, 33, 87, 52, 74, 19, 93, 41, 63, 31, 85, 50, 72, 17, 91, 39
  ];

  const stats = [
    { label: "Grid Status", value: "Optimal", icon: ActivityIcon, color: "text-emerald-500", trend: "99.9%" },
    { label: "Realtime Load", value: `${powerKb} kW`, icon: ZapIcon, color: "text-blue-500", trend: "Live" },
    { label: "Net Zero Index", value: "1.00", icon: ShieldIcon, color: "text-emerald-400", trend: "Active" },
    { label: "Revenue Delta", value: "+12.4%", icon: ChartIcon, color: "text-amber-400", trend: "Live" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative max-w-6xl mx-auto px-4"
    >
      <div className="absolute -inset-10 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-[4rem] blur-[120px] -z-10" />
      
      <div className="relative glass-dark border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden bg-slate-900/60 backdrop-blur-3xl">
        {/* Top Bar */}
        <div className="h-14 border-b border-white/5 flex items-center justify-between px-8 bg-slate-950/80">
           <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
              <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/30" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
           </div>
           <div className="flex items-center gap-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">
              <div className="flex items-center gap-2"><LockIcon size={10} className="text-emerald-500" /> secure.ecovolt.cloud</div>
           </div>
           <div className="flex items-center gap-2 text-emerald-500/50">
              <CpuIcon size={12} className="animate-pulse" />
              <span className="text-[8px] font-black">X-GRID ENGINE</span>
           </div>
        </div>

        <div className="p-6 md:p-12 space-y-10">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((item, i) => (
                 <div key={i} className="bg-white/3 rounded-3xl p-6 border border-white/5 hover:bg-white/8 transition-all cursor-pointer space-y-4 text-left group">
                    <div className="flex items-center justify-between">
                      <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-950 border border-white/10 shadow-inner", item.color)}>
                         <item.icon size={20} strokeWidth={2} />
                      </div>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 uppercase tracking-widest">
                        {item.trend}
                      </span>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-xl font-black text-white tracking-tight leading-none">{item.value}</p>
                   </div>
                 </div>
               ))}
           </div>

           <div className="relative bg-slate-950/50 border border-white/5 rounded-[2.5rem] p-10 overflow-hidden shadow-inner">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
                 <div className="text-left space-y-2">
                    <h4 className="text-xl font-black text-white tracking-tight">Active Load Topology</h4>
                    <Paragraph className="text-xs text-slate-500 font-medium tracking-tight">Análise preditiva de demanda energética em milissegundos.</Paragraph>
                 </div>
                 <div className="flex gap-3">
                    <div className="px-4 py-2 bg-white/3 border border-white/10 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">Global</div>
                    <div className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/30">Live Nodes</div>
                 </div>
              </div>
              
              <div className="h-48 flex items-end justify-between gap-1.5" aria-label="Consumo Matrix">
                 {Array.from({ length: 32 }).map((_, i) => (
                   <motion.div 
                    key={i} 
                    initial={{ height: 0 }}
                    animate={{ height: `${barHeights[i]}%` }}
                    transition={{ delay: 0.5 + i * 0.015, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full bg-slate-800/40 rounded-t-md relative overflow-hidden group/bar"
                   >
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-500 to-emerald-400 opacity-20 group-hover/bar:opacity-100 transition-opacity" />
                      <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 blur-[2px] opacity-0 group-hover/bar:opacity-100" />
                   </motion.div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-16 md:pt-64 md:pb-32 px-6 overflow-hidden bg-slate-950">
      <Glow color="green" position="top-left" size="lg" className="opacity-30" />
      <Glow color="blue" position="bottom-right" size="lg" className="opacity-10" />
      
      {/* Abstract Grid background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.02)_1px,transparent_0)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="mb-12"
        >
          <Badge variant="glass" className="py-2 px-6 border-white/10 bg-slate-900/50 backdrop-blur-xl">
            <div className="flex -space-x-1.5 mr-3" aria-hidden="true">
               {[1,2,3].map(i => (
                 <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-950 bg-slate-800 shadow-xl" />
               ))}
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Trusted by Global Tech Hubs</span>
            <div className="w-px h-4 bg-white/10 mx-4" aria-hidden="true" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500">Scale: Zero Carbon</span>
          </Badge>
        </motion.div>

        <Heading as="h1" className="mb-10 max-w-6xl mx-auto text-white text-6xl md:text-9xl font-black tracking-tighter leading-[0.85]">
          Energia para a <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-600">
             próxima escala.
          </span>
        </Heading>

        <Paragraph className="text-xl md:text-3xl mb-16 max-w-4xl mx-auto font-medium text-slate-400 leading-tight tracking-tight">
          A infraestrutura crítica que converte sustentabilidade em <br className="hidden md:block" />
          <span className="text-white">eficiência financeira real para grandes operações.</span>
        </Paragraph>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-32"
        >
          <Button size="lg" className="w-full sm:w-auto h-20 px-12 group shadow-2xl shadow-emerald-500/20 text-xl font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500">
            Agendar Trial <ArrowRight size={22} className="ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto h-20 px-12 text-xl font-black uppercase tracking-widest border-white/10 hover:bg-white/5">
            Documentação
          </Button>
        </motion.div>

        <HeroDashboard />
      </div>
      
      <div className="mt-48">
        <TrustCloud />
      </div>
    </section>
  );
};
