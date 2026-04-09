import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { PageHeader } from "@/shared/components/PageHeader";

export default function CompliancePage() {
  return (
    <main className="bg-slate-950 min-h-screen">
      <Navbar />
      <PageHeader 
        title="Compliance Corporativo" 
        description="Nossas licenças e certificados globais para atestar a verdadeira neutralidade."
      />
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-white/5 bg-slate-900 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-2">B-Corp Certification</h3>
              <p className="text-sm text-slate-400">
                Alinhamento absoluto entre propósitos fiscais e sociais e sustentabilidade radical.
              </p>
            </div>
            <div className="p-6 border border-white/5 bg-slate-900 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-2">SOC 2 Type II</h3>
              <p className="text-sm text-slate-400">
                Garantia militar de confiabilidade no tratamentos de dados sensíveis empresariais que transitam em nossa API.
              </p>
            </div>
            <div className="p-6 border border-white/5 bg-slate-900 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-2">ISO 27001</h3>
              <p className="text-sm text-slate-400">
                Padrão internacional definidor de gestão da segurança da informação.
              </p>
            </div>
            <div className="p-6 border border-white/5 bg-slate-900 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-2">Zero-Carbon Certificate</h3>
              <p className="text-sm text-slate-400">
                Auditado externamente apontando que a frota de micro-grids é 100% reposta verde.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
