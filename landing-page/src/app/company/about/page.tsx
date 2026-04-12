import { Navbar } from "@/widgets/Layout/Navbar";
import { Footer } from "@/widgets/Layout/Footer";
import { PageHeader } from "@/shared/components/PageHeader";

export default function AboutPage() {
  return (
    <main className="bg-slate-950 min-h-screen">
      <Navbar />
      <PageHeader 
        title="Sobre a EcoVolt" 
        description="Nascida para eletrificar o futuro do entretenimento global de maneira neutra e descentralizada."
      />
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-slate-400 space-y-6">
          <p>
            Na EcoVolt Enterprise acreditamos que mega eventos não precisam ser incompatíveis com metas climáticas rigorosas. A nossa atuação como integradora energética visa acelerar a transição local.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="p-6 rounded-2xl bg-slate-900 border border-white/5">
              <h3 className="text-xl font-bold text-white mb-2">Visão</h3>
              <p className="text-sm">Um globo onde 100% da cultura em massa é alimentada através de sol, vento e grids locais auto-sustentáveis.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-white/5">
              <h3 className="text-xl font-bold text-white mb-2">Missão</h3>
              <p className="text-sm">Fornecer infraestrutura, governança de software e hard-assets de nível militar para produtores de eventos limpos.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
