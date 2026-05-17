import type { Metadata } from "next";
import { Heading, Paragraph, Subheading } from "@/shared/ui/Typography";
import { Badge } from "@/shared/ui/Badge";
import { GlassCard } from "@/shared/ui/GlassCard";
import { Navbar } from "@/widgets/Layout/Navbar";
import { Footer } from "@/widgets/Layout/Footer";
import { CheckCircle2 } from "lucide-react";
import { BENEFITS_DATA } from "@/shared/lib/constants";
import { LeadSubmissionForm } from "@/features/lead-submission/components/LeadSubmissionForm";

export const metadata: Metadata = {
  title: "Acelere a Transição Energética | EcoVolt Enterprise",
  description: "Solicite uma demonstração da plataforma EcoVolt Enterprise e veja na prática como podemos otimizar a energia limpa para seus eventos.",
};

export default function SolicitarDemonstracao() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 blur-[150px] rounded-full -z-10 translate-x-1/3 -translate-y-1/2 opacity-50" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-ecovolt-blue-500/10 blur-[150px] rounded-full -z-10 -translate-x-1/2 translate-y-1/2 opacity-30" />

      <Navbar />

      <main className="flex-grow pt-32 pb-24 md:pt-40 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Side: Copy and Value Proposition */}
          <div className="space-y-10 z-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                  Agendamento B2B
                </Badge>
                <div className="h-px w-12 bg-gradient-to-r from-emerald-500/50 to-transparent" />
              </div>
              
              <Heading as="h1">
                Conheça a <br />
                EcoVolt <span className="text-emerald-500">Corporativa</span>
              </Heading>
              
              <Paragraph className="text-lg max-w-md">
                Veja na prática como organizadores de eventos e fornecedores de energia conectam-se através de uma plataforma segura, rastreável e desenhada para performance extrema.
              </Paragraph>
            </div>

            <div className="space-y-6">
              {BENEFITS_DATA.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center shadow-lg shadow-emerald-500/5">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">{item.title}</h3>
                    <p className="text-sm font-medium text-slate-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>Implantação rápida e suporte dedicado</span>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="relative z-10">
            <GlassCard variant="dark" hover={false} className="p-8 md:p-10 border-white/10 shadow-2xl relative overflow-hidden">
              {/* Card Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[60px] rounded-full pointer-events-none" />
              
              <div className="mb-8">
                <Subheading className="!mb-2">Formulário de Interesse</Subheading>
                <h3 className="text-2xl font-display font-bold text-white tracking-tight">Fale com um Especialista</h3>
                <p className="text-sm text-slate-400 font-medium mt-2">
                  Preencha os dados abaixo e entraremos em contato rapidamente para agendar.
                </p>
              </div>

              <LeadSubmissionForm />
            </GlassCard>
            
            {/* Soft shadow underlying the card */}
            <div className="absolute -inset-4 bg-emerald-500/10 blur-[80px] -z-10 rounded-full" />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
