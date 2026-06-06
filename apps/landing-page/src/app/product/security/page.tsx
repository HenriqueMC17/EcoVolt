import { Navbar } from "@/widgets/Layout/Navbar";
import { Footer } from "@/widgets/Layout/Footer";
import { PageHeader } from "@/shared/components/PageHeader";

export default function SecurityPage() {
  return (
    <main className="bg-slate-950 min-h-screen">
      <Navbar />
      <PageHeader 
        title="Segurança Energética" 
        description="Fail-safes, redundâncias e SLA de 99.99%. Nós mantemos as luzes acesas, para que você foque no evento."
      />
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-slate-400 space-y-6">
          <p>
            A interrupção de energia em grandes eventos custa milhões em danos de marca e receita. Nossas garantias técnicas eliminam pontos únicos de falha.
          </p>
          <ul className="space-y-4 font-medium">
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Backups de estado sólido dedicados por zona de evento.
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Arquitetura Redundante de Suprimento (N+1).
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Auditorias e testes de estresse periódicos pré-evento.
            </li>
          </ul>
        </div>
      </section>
      <Footer />
    </main>
  );
}
