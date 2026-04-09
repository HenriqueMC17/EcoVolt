import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/Button";

export default function CareersPage() {
  return (
    <main className="bg-slate-950 min-h-screen">
      <Navbar />
      <PageHeader 
        title="Carreiras" 
        description="Junte-se à espinha dorsal técnica da primeira rede de suprimento global para produção ao vivo sustentável."
      />
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-slate-400">
            <p>
              Estamos sempre à procura de engenheiros, analistas de negócios e especialistas em ESG talentosos que queiram transformar dados em eletricidade e impacto.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white border-b border-white/10 pb-4">Vagas em Aberto</h3>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-xl bg-slate-900/50 border border-white/5 group hover:border-emerald-500/30 transition-colors">
              <div>
                <h4 className="text-lg font-bold text-white">Senior Backend Engineer (B2B SaaS)</h4>
                <p className="text-sm text-slate-500 mt-1">Remoto (LATAM) • Full-time</p>
              </div>
              <Button variant="secondary" className="mt-4 md:mt-0">Ver Detalhes</Button>
            </div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-xl bg-slate-900/50 border border-white/5 group hover:border-emerald-500/30 transition-colors">
              <div>
                <h4 className="text-lg font-bold text-white">ESG Data Analyst</h4>
                <p className="text-sm text-slate-500 mt-1">São Paulo / Híbrido • Full-time</p>
              </div>
              <Button variant="secondary" className="mt-4 md:mt-0">Ver Detalhes</Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
