import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/Button";

export default function PricingPage() {
  return (
    <main className="bg-slate-950 min-h-screen">
      <Navbar />
      <PageHeader 
        title="Planos e Preços" 
        description="Modelos comerciais transparentes baseados no tamanho e na demanda crítica do seu evento."
      />
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-slate-900 border border-white/5 space-y-6 text-center">
            <h3 className="text-2xl font-bold text-white">Eventos de Médio Porte</h3>
            <p className="text-slate-400 text-sm">Estruturação energética otimizada com um grid local focado em neutralização.</p>
            <div className="pt-4">
              <Button variant="primary" className="w-full">Falar com Consultor</Button>
            </div>
          </div>
          <div className="p-8 rounded-3xl bg-slate-900 border border-emerald-500/30 relative space-y-6 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Enterprise
            </div>
            <h3 className="text-2xl font-bold text-white">Mega Festivais e Corpos Globais</h3>
            <p className="text-slate-400 text-sm">Garantia absoluta de rede. Distribuição redundante, múltiplos polos, relatórios globais de ESG.</p>
            <div className="pt-4">
              <Button variant="primary" className="w-full">Agendar Planejamento</Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
