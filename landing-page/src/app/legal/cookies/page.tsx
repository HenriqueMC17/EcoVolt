import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { PageHeader } from "@/shared/components/PageHeader";

export default function CookiesPage() {
  return (
    <main className="bg-slate-950 min-h-screen">
      <Navbar />
      <PageHeader 
        title="Preferência de Cookies" 
        description="Controle e entenda como utilizamos tecnologias de session state local."
      />
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 mb-8">
            <h3 className="text-emerald-400 font-bold mb-2">Você está no controle</h3>
            <p className="text-sm text-slate-400">Apenas cookies vitais para a segurança do painel de ERP estão ativos. Monitoramento de parceiros de marketing encontram-se desativados no nível corporativo.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-white/5 bg-slate-900/30 rounded-xl">
              <div>
                <h4 className="text-white font-bold text-sm">Cookies Essenciais (Strictly Necessary)</h4>
                <p className="text-xs text-slate-500 mt-1">Garantem autenticação e proteção CSRF dos endpoints.</p>
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase">Sempre Ativo</span>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-white/5 bg-slate-900/30 rounded-xl opacity-50">
              <div>
                <h4 className="text-white font-bold text-sm">Cookies de Analytics</h4>
                <p className="text-xs text-slate-500 mt-1">Utilizados anonimamente para performance local Web Vitals.</p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">Inativo</span>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
