import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { PageHeader } from "@/shared/components/PageHeader";

export default function PlatformPage() {
  return (
    <main className="bg-slate-950 min-h-screen">
      <Navbar />
      <PageHeader 
        title="Nossa Plataforma" 
        description="Um ecossistema robusto para gerenciamento remoto, governança e relatórios ESG do seu suprimento sustentável."
      />
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-slate-400 space-y-6">
          <p>
            Desenvolvida para operadores de infraestrutura, a plataforma EcoVolt Enterprise oferece o painel de missão crítica definitivo para energia.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="p-6 rounded-2xl bg-slate-900 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-2">Monitoramento Ativo</h3>
              <p className="text-sm">Acompanhamento do dashboard virtualizado de correntes em tempo real.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-2">Relatórios Imediatos</h3>
              <p className="text-sm">Geração de auditorias sustentáveis com a métrica de offset em poucos cliques.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
