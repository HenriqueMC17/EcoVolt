import { Navbar } from "@/widgets/Layout/Navbar";
import { Footer } from "@/widgets/Layout/Footer";
import { PageHeader } from "@/shared/components/PageHeader";

export default function ApiReferencePage() {
  return (
    <main className="bg-slate-950 min-h-screen">
      <Navbar />
      <PageHeader 
        title="EcoVolt API Reference" 
        description="Integre as métricas brutas de telemetria diretamente ao sistema interno ERP da sua empresa. Restful, JSON, Edge."
      />
      <section className="py-24 px-6 relative z-10 flex flex-col items-center">
        <div className="max-w-4xl w-full">
          <div className="rounded-2xl border border-white/10 bg-[#0d1117] overflow-hidden">
            <div className="flex border-b border-white/10 bg-slate-900/50 px-4 py-3 items-center">
              <div className="flex gap-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs font-mono text-slate-400 flex-1 text-center">curl - GET /v1/telemetry/reports</span>
            </div>
            <div className="p-6 md:p-8 overflow-x-auto text-sm font-mono text-emerald-400/90 leading-relaxed">
              <span className="text-blue-400">curl</span> -X <span className="text-green-400">GET</span> {"\"https://api.ecovolt.app/v1/telemetry/reports/latest\""} \
              <br />  -H <span className="text-yellow-400">{"\"Authorization: Bearer sk_prod_X1Y2Z...\""}</span> \
              <br />  -H <span className="text-yellow-400">{"\"Accept: application/json\""}</span>
              <br /><br />
              <span className="text-slate-500">{"// Response (200 OK)"}</span><br />
              {"{"}<br />
              {"  "}<span className="text-pink-400">{"\"status\""}</span>: <span className="text-yellow-400">{"\"active\""}</span>,<br />
              {"  "}<span className="text-pink-400">{"\"current_kw\""}</span>: <span className="text-purple-400">2045.3</span>,<br />
              {"  "}<span className="text-pink-400">{"\"renewable_ratio\""}</span>: <span className="text-purple-400">0.999</span>,<br />
              {"  "}<span className="text-pink-400">{"\"uptime\""}</span>: <span className="text-yellow-400">{"\"99.999%\""}</span><br />
              {"}"}
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-slate-400 bg-slate-900/50 p-4 rounded-xl border border-white/5">
            Documentação OpenAPI V3 oficial e SDKs Type-Safe liberados para clientes logados no painel.
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
