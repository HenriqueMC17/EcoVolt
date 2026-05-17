import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Heading, Paragraph } from "@/shared/ui/Typography";

interface PageHeaderProps {
  title: string;
  description: string;
}

export const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-950 border-b border-white/5">
      {/* Visual Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative max-w-7xl mx-auto px-6 z-10 flex flex-col items-center text-center">
        <Link 
          href="/"
          className="flex items-center gap-2 px-4 py-2 mb-8 text-sm font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-full backdrop-blur-md transition-all group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para Home
        </Link>
        <Heading as="h1" className="max-w-4xl tracking-tight text-white mb-6">
          {title}
        </Heading>
        <Paragraph className="text-lg md:text-xl max-w-2xl text-slate-400">
          {description}
        </Paragraph>
      </div>
    </div>
  );
};
