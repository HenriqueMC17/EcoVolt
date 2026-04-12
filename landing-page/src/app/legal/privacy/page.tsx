import { Navbar } from "@/widgets/Layout/Navbar";
import { Footer } from "@/widgets/Layout/Footer";
import { PageHeader } from "@/shared/components/PageHeader";

export default function PrivacyPage() {
  return (
    <main className="bg-slate-950 min-h-screen">
      <Navbar />
      <PageHeader 
        title="Política de Privacidade" 
        description="Transparência radical em como processamos, protegemos e armazenamos a telemetria do seu evento."
      />
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto prose prose-invert prose-slate prose-emerald">
          <p className="text-slate-400">
            A sua privacidade e o segredo industrial da configuração técnica do seu evento são nossa prioridade zero. 
            Este documento delineia nossas práticas rigorosas de proteção de dados (LGPD & GDPR Compliant).
          </p>
          <h3 className="text-white text-xl font-bold mt-8 mb-4">1. Coleta de Dados</h3>
          <p className="text-slate-400 text-sm">
            Apenas telemetria estritamente relacional ao consumo energético e offsets de carbono são retidos. Nenhuma informação de cliente final logada na sua internet local passa pela nossa malha.
          </p>
          <h3 className="text-white text-xl font-bold mt-8 mb-4">2. Compartilhamento</h3>
          <p className="text-slate-400 text-sm">
            Nós não vendemos seus picos de consumo ou dados sazonais para terceiros. O painel e seus dados pertencem sob chave ao locatário mestre do ERP.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
