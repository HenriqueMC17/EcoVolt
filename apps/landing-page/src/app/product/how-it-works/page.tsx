import { Navbar } from "@/widgets/Layout/Navbar";
import { Footer } from "@/widgets/Layout/Footer";
import { PageHeader } from "@/shared/components/PageHeader";

export default function HowItWorksPage() {
  return (
    <main className="bg-slate-950 min-h-screen">
      <Navbar />
      <PageHeader 
        title="Como Funciona a EcoVolt" 
        description="Entenda o fluxo de ponta a ponta da nossa infraestrutura inteligente de fornecimento de energia renovável para o seu evento."
      />
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-slate-400 space-y-6">
          <p>
            A EcoVolt revoluciona a forma como grandes eventos adquirem, gerenciam e relatam o consumo de energia renovável.
          </p>
          <div className="p-6 rounded-2xl bg-slate-900 border border-white/5 space-y-4">
            <h3 className="text-xl font-bold text-white">1. Análise e Previsibilidade</h3>
            <p className="text-sm">Nossos algoritmos prevêem a demanda energética do seu evento cruzando dados históricos, localização e escopo.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-white/5 space-y-4">
            <h3 className="text-xl font-bold text-white">2. Conexão Contínua</h3>
            <p className="text-sm">Estabelecemos as pontes com os micro-grids renováveis mais eficientes da região, garantindo suprimento contínuo.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
