"use client";

import React from "react";
import { motion } from "framer-motion";
import { Section } from "@/shared/components/Section";
import { Heading, Text, Subheading } from "@/shared/ui/Typography";
import { Glow } from "@/shared/ui/Glow";
import { Badge } from "@/shared/ui/Badge";
import { GlassCard } from "@/shared/ui/GlassCard";
import { Layout, Zap, Terminal, BarChart3, Globe } from "lucide-react";
import { theme } from "@/shared/lib/theme";
import { cn } from "@/shared/lib/utils";

const PreviewHeader = () => (
  <div className="flex items-center justify-between mb-16 max-w-4xl mx-auto">
    <div className="flex gap-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-ecovolt-green-500 animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Grid</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-slate-200" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sync Active</span>
      </div>
    </div>
    <Badge variant="success" size="sm">System Up</Badge>
  </div>
);

export const PlatformShowcase = () => {
  return (
    <Section id="plataforma" className="bg-slate-50 py-32 md:py-48 overflow-hidden relative">
      <Glow color="blue" position="top-right" size="lg" />
      
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="mb-24 space-y-6">
          <Subheading>The Platform</Subheading>
          <Heading className="max-w-4xl mx-auto">
            Uma central de controle para sua <span className="text-slate-400">infraestrutura energética.</span>
          </Heading>
          <Text className="text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Gerencie múltiplos eventos, monitore consumo em tempo real e emita relatórios de sustentabilidade com um clique.
          </Text>
        </div>

        <PreviewHeader />

        {/* Product Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: theme.animations.durations.slow, ease: theme.animations.easing.premium }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="absolute -inset-10 bg-ecovolt-green-500/5 rounded-[5rem] blur-[80px] -z-10" />
          
          <GlassCard className="p-0 border-slate-200/60 shadow-2xl shadow-slate-200/50 bg-white" hover={false}>
             <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-white/5">
                <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-slate-700" />
                   <div className="w-3 h-3 rounded-full bg-slate-700" />
                   <div className="w-3 h-3 rounded-full bg-slate-700" />
                </div>
                <div className="px-4 py-1.5 bg-white/5 rounded-lg border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                   EcoVolt Dashboard v2.0
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-800" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
                {/* Sidebar Mockup */}
                <div className="md:col-span-1 border-r border-slate-100 flex flex-col items-center py-8 gap-8 bg-slate-50/50">
                   {[Layout, Zap, Terminal, BarChart3, Globe].map((Icon, i) => (
                     <Icon 
                        key={i} 
                        size={20} 
                        className={cn("transition-colors", i === 1 ? "text-ecovolt-green-600" : "text-slate-300")} 
                      />
                   ))}
                </div>

                {/* Main Content Mockup */}
                <div className="md:col-span-11 p-10 space-y-10 text-left">
                   <div className="flex items-center justify-between">
                      <Heading as="h3">Event Performance</Heading>
                      <div className="flex gap-2">
                         <div className="w-32 h-8 bg-slate-100 rounded-lg animate-pulse" />
                         <div className="w-8 h-8 bg-ecovolt-green-500 rounded-lg shadow-lg shadow-ecovolt-green-500/20" />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[1,2,3].map(i => (
                        <div key={i} className="h-32 bg-slate-50 rounded-[1.5rem] border border-slate-100 p-6 space-y-4">
                           <div className="w-10 h-2 bg-slate-200 rounded-full" />
                           <div className="w-24 h-6 bg-slate-100 rounded-md" />
                           <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-ecovolt-green-500" style={{ width: `${30 + i * 20}%` }} />
                           </div>
                        </div>
                      ))}
                   </div>

                   {/* Stats Table Mockup */}
                   <div className="space-y-4">
                      <div className="flex justify-between items-center mb-6">
                         <Heading as="h4" className="text-sm uppercase tracking-widest text-slate-400">Consumption Logs</Heading>
                         <Text className="text-xs">Last 24 hours</Text>
                      </div>
                      {[1,2,3,4].map(i => (
                        <div key={i} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                           <div className="flex items-center gap-4">
                              <div className="w-2 h-2 rounded-full bg-slate-200" />
                              <div className="space-y-1">
                                 <div className="w-32 h-4 bg-slate-100 rounded-md" />
                                 <div className="w-16 h-2 bg-slate-50 rounded-md" />
                              </div>
                           </div>
                           <div className="w-12 h-6 bg-ecovolt-green-50 text-ecovolt-green-600 rounded-md flex items-center justify-center text-[10px] font-bold">Stable</div>
                           <div className="w-20 h-4 bg-slate-100 rounded-md" />
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </GlassCard>
        </motion.div>
      </div>
    </Section>
  );
};
