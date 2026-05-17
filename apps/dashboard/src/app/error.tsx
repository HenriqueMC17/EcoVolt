"use client";

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Aqui seria ideal enviar o erro para um serviço como Sentry
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-luxury">
      <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-rose-500" />
      </div>
      
      <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
        Falha Operacional
      </h2>
      
      <p className="text-white/60 max-w-md mb-8 leading-relaxed">
        Ocorreu um erro inesperado ao carregar esta interface. Nossos sistemas automatizados já registraram a ocorrência.
      </p>
      
      <div className="p-4 bg-black/40 border border-white/5 rounded-xl text-left max-w-lg w-full mb-8 overflow-auto">
        <p className="text-rose-400 font-mono text-xs">{error.message || "Erro desconhecido."}</p>
        {error.digest && <p className="text-white/30 font-mono text-[10px] mt-2">Digest: {error.digest}</p>}
      </div>

      <button
        onClick={() => reset()}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-black px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all"
      >
        <RefreshCcw className="w-4 h-4" />
        Tentar Novamente
      </button>
    </div>
  );
}
