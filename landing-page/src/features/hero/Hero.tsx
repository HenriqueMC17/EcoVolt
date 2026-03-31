"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";
import { Glow } from "@/shared/ui/Glow";
import { Heading, Text } from "@/shared/ui/Typography";
import { Zap, ArrowRight, Activity, Globe, Lock, BarChart3, ShieldCheck } from "lucide-react";
import { TrustCloud } from "./TrustCloud";
import { cn } from "@/shared/lib/utils";
import { theme } from "@/shared/lib/theme";

const HeroDashboard = () => {
  // Static random heights to ensure purity and premium "live" feel without runtime instability
  const barHeights = [
    45, 78, 34, 89, 23, 56, 91, 44, 67, 32, 88, 54, 76, 21, 95, 43,
    65, 33, 87, 52, 74, 19, 93, 41, 63, 31, 85, 50, 72, 17, 91, 39
  ];

  const stats = [
    { label: "Status do Grid", value: "Estável", icon: Activity, color: "text-ecovolt-green-600", trend: "+12.5%" },
    { label: "Consumo Real", value: "142.8 kW", icon: Zap, color: "text-ecovolt-blue-600", trend: "-2.4%" },
    { label: "Pegada de Carbono", value: "0.0kg", icon: ShieldCheck, color: "text-ecovolt-green-500", trend: "-100%" },
    { label: "Faturamento", value: "R$ 12.4k", icon: BarChart3, color: "text-ecovolt-amber-400", trend: "+5.1%" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: theme.animations.durations.loading, ease: theme.animations.easing.premium }}
      className="relative max-w-6xl mx-auto"
      aria-label="Plataforma EcoVolt Dashboard Preview"
    >
      <div className="absolute -inset-4 bg-gradient-to-r from-ecovolt-green-500/10 to-ecovolt-blue-500/10 rounded-[3rem] blur-3xl -z-10" />
      
      <div className="relative glass border border-white/40 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
        {/* Browser Frame Top Bar */}
        <div className="h-12 border-b border-slate-100 flex items-center justify-between px-6 bg-white/40">
           <div className="flex gap-1.5" aria-hidden="true">
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="w-3 h-3 rounded-full bg-slate-200" />
           </div>
           <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-1.5"><Globe size={10} aria-hidden="true" /> network.ecovolt.app</div>
              <div className="flex items-center gap-1.5"><Lock size={10} aria-hidden="true" /> secure</div>
           </div>
           <div className="w-12 h-1 bg-slate-100 rounded-full" aria-hidden="true" />
        </div>

        <div className="p-4 md:p-10 bg-gradient-to-b from-white/80 to-slate-50/50">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
               {stats.map((item, i) => (
                 <div key={i} className="bg-white/95 dark:bg-slate-900/95 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-4 text-left group">
                    <div className="flex items-center justify-between">
                      <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-50", item.color)}>
                         <item.icon size={20} aria-hidden="true" />
                      </div>
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-50", 
                        item.trend.startsWith("+") ? "text-green-600" : "text-blue-600")}>
                        {item.trend}
                      </span>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-2xl font-bold text-slate-900 tracking-tight">{item.value}</p>
                   </div>
                </div>
              ))}
           </div>

           {/* Interactive Chart Component */}
           <div className="relative bg-white border border-slate-200/60 rounded-[2rem] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <div className="text-left">
                    <h4 className="font-bold text-slate-800">Monitoramento em Tempo Real</h4>
                    <p className="text-xs text-slate-500">Distribuição energética por bloco operacional</p>
                 </div>
                 <div className="flex gap-2">
                    <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 uppercase">Snapshot</div>
                    <div className="px-3 py-1 bg-ecovolt-green-500 text-white rounded-lg text-[10px] font-bold uppercase transition-transform hover:scale-105 cursor-pointer shadow-lg shadow-ecovolt-green-500/20">Live View</div>
                 </div>
              </div>
              
              <div className="h-64 flex items-end justify-between gap-1 group/bars" aria-label="Consumo Chart">
                 {Array.from({ length: 32 }).map((_, i) => (
                   <motion.div 
                    key={i} 
                    initial={{ height: 0 }}
                    animate={{ height: `${barHeights[i]}%` }}
                    transition={{ delay: 0.5 + i * 0.02, duration: 1 }}
                    className="w-full bg-slate-100/50 rounded-t-sm relative overflow-hidden group/bar"
                   >
                      <div className="absolute bottom-0 left-0 w-full bg-ecovolt-green-500 opacity-20 transition-opacity group-hover/bar:opacity-100 h-full" />
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
    <section className="relative pt-32 pb-0 md:pt-48 md:pb-0 px-6 overflow-hidden bg-white dark:bg-slate-950 glow-mesh">
      <Glow color="green" position="top-left" size="lg" />
      <Glow color="blue" position="bottom-right" size="md" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <Badge variant="glass" className="mb-10">
          <div className="flex -space-x-1" aria-hidden="true">
             {[1,2,3].map(i => (
               <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-200" />
             ))}
          </div>
          <span className="pl-1 text-slate-600 font-medium">Líder em infraestrutura energética para eventos</span>
          <div className="w-1 h-3 bg-slate-300 mx-2" aria-hidden="true" />
          <span className="text-ecovolt-green-600 font-bold">Sociedade Carbono Zero</span>
        </Badge>

        <Heading as="h1" className="mb-8 max-w-5xl mx-auto">
          Energia limpa para eventos. <br />
          <span className="relative inline-block">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-ecovolt-green-600 to-ecovolt-green-500">
              Rentabilidade para o seu negócio.
            </span>
          </span>
        </Heading>

        <Text className="text-lg md:text-2xl mb-12 max-w-3xl mx-auto font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
          Reduza custos operacionais em até 30% e elimine riscos regulatórios 
          com a plataforma de gestão energética mais avançada do mercado.
        </Text>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
        >
          <Button size="lg" className="w-full sm:w-auto gap-2 group shadow-xl shadow-ecovolt-green-500/20 text-lg px-10">
            Agendar Demonstração <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10">
            Ver Casos de Sucesso
          </Button>
        </motion.div>

        <HeroDashboard />
      </div>
      
      <div className="mt-24">
        <TrustCloud />
      </div>
    </section>
  );
};
