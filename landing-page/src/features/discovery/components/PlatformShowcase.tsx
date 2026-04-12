"use client";

import React from "react";
import { m as motion } from "framer-motion";
import { Section } from "@/shared/components/Section";
import { Heading, Paragraph, Subheading } from "@/shared/ui/Typography";
import { Glow } from "@/shared/ui/Glow";
import { Badge } from "@/shared/ui/Badge";
import { GlassCard } from "@/shared/ui/GlassCard";
import { Layout, Zap, Terminal, BarChart3, Globe, Cpu, Shield, Activity, ArrowRight } from "lucide-react";
import { theme } from "@/shared/lib/theme";
import { cn } from "@/shared/lib/utils";

const PreviewHeader = () => (
  <div className="flex items-center justify-between mb-16 max-w-4xl mx-auto px-4">
    <div className="flex gap-6">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Live Grid Monitoring</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-slate-500" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 underline decoration-slate-800">Edge Node: Beta-7</span>
      </div>
    </div>
    <div className="hidden sm:flex items-center gap-3">
       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/50">Status: Operational</span>
       <Badge variant="success" size="sm" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-black">L-99.9</Badge>
    </div>
  </div>
);

export const PlatformShowcase = () => {
  return (
    <Section id="plataforma" className="bg-slate-950 py-32 md:py-64 overflow-hidden relative">
      <Glow color="green" position="top-right" size="lg" className="opacity-20" />
      <Glow color="blue" position="bottom-left" size="lg" className="opacity-10" />
      
      <div className="max-w-7xl mx-auto px-6 text-center relative">
        <div className="mb-24 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Subheading className="text-emerald-500">EcoVolt OS</Subheading>
            <Heading className="max-w-4xl mx-auto text-white text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
              A arquitetura que domina a <span className="text-slate-500">complexidade.</span>
            </Heading>
            <Paragraph className="text-lg md:text-2xl max-w-2xl mx-auto font-medium text-slate-400 leading-relaxed">
              Interface unificada para monitoramento de carga crítica, automação preditiva e governança de dados renováveis.
            </Paragraph>
          </motion.div>
        </div>

        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <PreviewHeader />

          {/* Luxury Dashboard Mockup */}
          <div className="relative max-w-6xl mx-auto group">
            <div className="absolute -inset-10 bg-emerald-500/10 rounded-[5rem] blur-[120px] -z-10 group-hover:bg-emerald-500/15 transition-colors duration-1000" />
            <div className="absolute -inset-1 bg-gradient-to-b from-emerald-500/20 to-transparent rounded-[2.5rem] -z-10 blur-[2px] opacity-50" />
            
            <GlassCard variant="dark" className="p-0 border-white/10 shadow-2xl bg-slate-900/60 backdrop-blur-3xl overflow-hidden" hover={false}>
               {/* Browser Chrome */}
               <div className="bg-slate-950/90 px-6 py-4 flex items-center justify-between border-b border-white/5 relative">
                  <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
                     <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/30" />
                     <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 px-6 py-1.5 bg-white/5 rounded-full border border-white/10 flex items-center gap-3">
                     <Shield size={10} className="text-emerald-500" />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        secure.ecovolt.enterprise
                     </span>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="hidden lg:flex flex-col items-end">
                        <span className="text-[8px] font-bold text-slate-500 uppercase">Last Sync</span>
                        <span className="text-[10px] font-black text-white">0.04ms ago</span>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                        <Cpu size={14} />
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
                  {/* Luxury Sidebar */}
                  <div className="md:col-span-1 border-r border-white/5 flex flex-col items-center py-10 gap-10 bg-slate-950/40">
                     {[Layout, Activity, Zap, BarChart3, Globe, Terminal].map((Icon, i) => (
                       <div 
                         key={i} 
                         className={cn(
                           "p-2.5 rounded-xl transition-all duration-300 cursor-pointer group/icon",
                           i === 1 ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "text-slate-600 hover:text-slate-300 hover:bg-white/5"
                         )}
                       >
                         <Icon size={20} strokeWidth={2.5} />
                       </div>
                     ))}
                  </div>

                  {/* Main Analytics Content */}
                  <div className="md:col-span-11 p-6 md:p-12 space-y-12 text-left">
                     <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-white/5">
                        <div className="space-y-4">
                           <div className="flex items-center gap-3">
                              <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-2 py-0.5 rounded text-[8px] font-black">REALTIME</Badge>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Infrastructure Health</span>
                           </div>
                           <Heading as="h3" className="text-white text-3xl md:text-5xl font-black tracking-tighter">Event Performance Matrix</Heading>
                        </div>
                        <div className="flex gap-4">
                           <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col">
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Peak Load</span>
                              <span className="text-xl font-black text-white">482.4 <span className="text-slate-500 text-sm">kV</span></span>
                           </div>
                           <div className="px-6 py-3 bg-emerald-500 border border-emerald-400 rounded-2xl flex flex-col shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                              <span className="text-[9px] font-bold text-slate-100/60 uppercase tracking-widest mb-1">Efficiency</span>
                              <span className="text-xl font-black text-white">99.8%</span>
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {[
                          { label: "Storage Capacity", val: 84, color: "emerald", icon: Zap },
                          { label: "Active Nodes", val: 92, color: "blue", icon: Globe },
                          { label: "Sustainability Score", val: 98, color: "emerald", icon: Activity }
                        ].map((stat, i) => (
                          <div key={i} className="relative group/card cursor-pointer">
                            <div className="absolute inset-0 bg-white/5 rounded-[2rem] blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity" />
                            <div className="relative h-44 bg-slate-900/40 rounded-[2rem] border border-white/5 p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-300">
                               <div className="flex justify-between items-start">
                                  <stat.icon size={18} className={stat.color === 'emerald' ? 'text-emerald-500' : 'text-blue-500'} />
                                  <span className="text-2xl font-black text-white">{stat.val}%</span>
                               </div>
                               <div className="space-y-4">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none block">{stat.label}</span>
                                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                     <motion.div 
                                       initial={{ width: 0 }}
                                       whileInView={{ width: `${stat.val}%` }}
                                       viewport={{ once: true }}
                                       transition={{ duration: 1.5, delay: 0.5 + (i * 0.2), ease: [0.16, 1, 0.3, 1] }}
                                       className={cn("h-full", stat.color === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500')} 
                                      />
                                  </div>
                               </div>
                            </div>
                          </div>
                        ))}
                     </div>

                     {/* Recent Events Table */}
                     <div className="space-y-6">
                        <div className="flex justify-between items-center">
                           <Heading as="h4" className="text-xs uppercase tracking-[0.3em] font-black text-slate-500">Active Load Logs</Heading>
                           <button className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-2 hover:gap-3 transition-all underline decoration-emerald-500/20 underline-offset-4">
                              Full Diagnostics <ArrowRight size={12} />
                           </button>
                        </div>
                        <div className="space-y-3">
                          {[
                            { name: "São Paulo Data Center", code: "SP-EAST-01", val: 12.4 },
                            { name: "London Tech Summit", code: "LDN-HUB-V2", val: 4.2 },
                            { name: "Tokyo Smart City", code: "TKY-NORTH-8", val: 8.9 }
                          ].map((node, i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-white/3 border border-white/5 rounded-2xl hover:bg-white/8 transition-all duration-300 backdrop-blur-md">
                               <div className="flex items-center gap-6">
                                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 font-black text-xs">
                                     {i+1}
                                  </div>
                                  <div className="space-y-1">
                                     <div className="text-sm font-black text-white">{node.name}</div>
                                     <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{node.code}</div>
                                  </div>
                               </div>
                               <div className="flex items-center gap-12">
                                  <div className="hidden sm:flex flex-col items-end">
                                     <span className="text-[8px] font-bold text-slate-500 uppercase">Consumption</span>
                                     <span className="text-xs font-black text-white">{node.val} MW/h</span>
                                  </div>
                                  <div className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg text-[9px] font-black tracking-widest">
                                     STATUS: OPTIMAL
                                  </div>
                               </div>
                            </div>
                          ))}
                        </div>
                     </div>
                  </div>
               </div>
            </GlassCard>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};
