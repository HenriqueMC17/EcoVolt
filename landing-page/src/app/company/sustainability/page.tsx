import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { PageHeader } from "@/shared/components/PageHeader";

export default function SustainabilityPage() {
  return (
    <main className="bg-slate-950 min-h-screen">
      <Navbar />
      <PageHeader 
        title="Nosso Impacto e Sustentabilidade" 
        description="Nossas credenciais para guiar a mudança de base de carbono em escala global."
      />
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-slate-400 space-y-8">
          <p>
            Não apenas vendemos energia sustentável, nós a praticamos intimamente. A EcoVolt é signatária de protocolos abertos para a total eliminação de impacto de software.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-slate-900 rounded-2xl border border-white/5">
              <div className="text-3xl font-black text-white mb-2">100%</div>
              <div className="text-xs uppercase tracking-widest font-bold">Cloud Limpa</div>
            </div>
            <div className="p-6 bg-slate-900 rounded-2xl border border-white/5">
              <div className="text-3xl font-black text-white mb-2">Zero</div>
              <div className="text-xs uppercase tracking-widest font-bold">Resíduo E-Waste</div>
            </div>
            <div className="p-6 bg-slate-900 rounded-2xl border border-emerald-500/20">
              <div className="text-3xl font-black text-emerald-400 mb-2">B-Corp</div>
              <div className="text-xs uppercase tracking-widest font-bold">Certificação em Andamento</div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
