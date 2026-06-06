import { Navbar } from "@/widgets/Layout/Navbar";
import { Footer } from "@/widgets/Layout/Footer";
import { PageHeader } from "@/shared/components/PageHeader";

export default function BlogPage() {
  return (
    <main className="bg-slate-950 min-h-screen">
      <Navbar />
      <PageHeader 
        title="Blog e Casos de Estudo" 
        description="Publicações técnicas, atualizações de roadmap e diários de bordo dos maiores eventos renováveis do globo."
      />
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-3xl bg-slate-900 border border-white/5 overflow-hidden flex flex-col group cursor-pointer hover:border-emerald-500/30 transition-colors">
            <div className="h-48 bg-slate-800 relative">
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold mb-2">Case de Sucesso</div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">Como alimentamos um festival de 100.000 pessoas em grid-zero</h3>
                <p className="text-sm text-slate-400">Análise técnica da nossa arquitetura elétrica off-grid modular para três dias de operação profunda.</p>
              </div>
              <div className="text-xs text-slate-500 mt-6 font-medium">Publicado em 24 de Abril</div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-white/5 overflow-hidden flex flex-col group cursor-pointer hover:border-emerald-500/30 transition-colors">
            <div className="h-48 bg-slate-800 relative">
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-blue-500 font-bold mb-2">Engenharia</div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">Garantindo 99.99% de SLA com Micro-baterias Descentralizadas</h3>
                <p className="text-sm text-slate-400">Deep-dive sobre o roteiro de tolerância a falhas na camada 2 de nossa rede conectada.</p>
              </div>
              <div className="text-xs text-slate-500 mt-6 font-medium">Publicado em 02 de Março</div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
