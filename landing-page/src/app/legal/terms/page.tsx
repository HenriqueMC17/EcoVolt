import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { PageHeader } from "@/shared/components/PageHeader";

export default function TermsPage() {
  return (
    <main className="bg-slate-950 min-h-screen">
      <Navbar />
      <PageHeader 
        title="Termos de Uso" 
        description="Diretrizes contratuais de governança, locação de microgrids e acesso aos nossos sistemas Edge."
      />
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto space-y-6 text-slate-400 text-sm">
          <p>
            O uso da EcoVolt Enterprise constitui acordo legal vinculativo entre sua entidade representativa e a Nossa Corporação.
          </p>
          <div className="p-6 bg-slate-900 border border-white/5 rounded-xl mt-6">
            <h4 className="text-lg font-bold text-white mb-2">Cláusula de Garantia de SLA</h4>
            <p className="mb-4">
              Nossa infraestrutura garante 99.99% de disponibilidade nominal sob condições normais de pressão e ambiente logístico estipulado pré-evento.
            </p>
            <h4 className="text-lg font-bold text-white mb-2">Regras de Acesso à API</h4>
            <p>
              Qualquer tentativa de sobrecarga ou desrespeito aos rate limits públicos do nosso SDK podem resultar em limitação imediata (Throttling) do seu workspace.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
