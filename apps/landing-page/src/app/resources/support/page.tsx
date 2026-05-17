import { Navbar } from "@/widgets/Layout/Navbar";
import { Footer } from "@/widgets/Layout/Footer";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/Button";

export default function SupportPage() {
  return (
    <main className="bg-slate-950 min-h-screen">
      <Navbar />
      <PageHeader 
        title="Suporte Técnico 24/7" 
        description="Uma equipe de engenheiros focada na viabilização do seu sucesso. Como podemos ajudar?"
      />
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="p-8 rounded-3xl bg-slate-900 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-2">Abrir um Chamado</h3>
            <p className="text-slate-400 text-sm mb-6">Para assinaturas Enterprise, nossa política exige resposta SLA de 15 minutos via painel autenticado ou linha telefônica emergencial.</p>
            
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Profissional</label>
                <input type="email" placeholder="nome@suaempresa.com" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Sua Urgência e Descrição</label>
                <textarea rows={4} placeholder="Pânico energético, solicitações..." className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>
              <Button variant="primary" className="w-full mt-4">Enviar Ticket</Button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
