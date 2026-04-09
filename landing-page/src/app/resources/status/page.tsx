import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { PageHeader } from "@/shared/components/PageHeader";
import { CheckCircle2 } from "lucide-react";

export default function StatusPage() {
  return (
    <main className="bg-slate-950 min-h-screen">
      <Navbar />
      <PageHeader 
        title="Status da Rede Global" 
        description="Monitoramento nativo de integridade, disponibilidade e manutenção de nossa frota."
      />
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto space-y-12">
          
          <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center flex flex-col items-center">
            <CheckCircle2 size={48} className="text-emerald-500 mb-4" />
            <h2 className="text-2xl font-black text-emerald-400 mb-2">Todos os Sistemas Operacionais</h2>
            <p className="text-slate-400 text-sm">Atualizado em tempo real. Última verificação há poucos segundos.</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-6">Componentes de Borda</h3>
            {[
              { name: "API Gateway Sul-Americano", status: "Operational" },
              { name: "Telemetria e Ingestão de Dados", status: "Operational" },
              { name: "Painel ERP (Dashboard Integrado)", status: "Operational" },
              { name: "Grid Central de Baterias (SP-01)", status: "Operational" },
            ].map((sys, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-slate-900/50">
                <span className="font-medium text-white">{sys.name}</span>
                <span className="text-xs uppercase font-bold text-emerald-400 flex items-center gap-2">
                  {sys.status}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>
      <Footer />
    </main>
  );
}
