import { Navbar } from "@/widgets/Layout/Navbar";
import { Footer } from "@/widgets/Layout/Footer";
import { PageHeader } from "@/shared/components/PageHeader";
import Link from "next/link";
import { BookOpen, Code, Terminal, Zap } from "lucide-react";

export default function DocsPage() {
  return (
    <main className="bg-slate-950 min-h-screen">
      <Navbar />
      <PageHeader 
        title="Documentação do EcoVolt" 
        description="Guias de integração, onboarding e implantação dos serviços logísticos e plataforma SAAS."
      />
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="#" className="p-6 rounded-2xl bg-slate-900 border border-white/5 hover:border-emerald-500/30 transition-colors group">
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Guia de Início Rápido</h3>
            <p className="text-sm text-slate-400">Aprenda a cadastrar seu primeiro evento corporativo e estimar as primeiras projeções de carga mínima.</p>
          </Link>
          
          <Link href="#" className="p-6 rounded-2xl bg-slate-900 border border-white/5 hover:border-emerald-500/30 transition-colors group">
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Manuais Operacionais</h3>
            <p className="text-sm text-slate-400">Layout físico de geradores, regras logísticas de deployment pré-evento e normas de saúde.</p>
          </Link>
          
          <Link href="#" className="p-6 rounded-2xl bg-slate-900 border border-white/5 hover:border-emerald-500/30 transition-colors group">
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Terminal size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">CLI de Monitoramento</h3>
            <p className="text-sm text-slate-400">Monitore picos de voltagem localmente nas docas através via Command Line customizada de terminal.</p>
          </Link>

          <Link href="/resources/api-reference" className="p-6 rounded-2xl bg-slate-900 border border-white/5 hover:border-emerald-500/30 transition-colors group">
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Code size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Integrar via SDK / API</h3>
            <p className="text-sm text-slate-400">Vá à documentação focada para desenvolvedores e arquitetos Back-End.</p>
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
