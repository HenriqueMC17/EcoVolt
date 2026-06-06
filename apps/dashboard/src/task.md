# Tarefas de Implementação – EcoVolt Dashboard

Abaixo está o checklist de tarefas a serem realizadas para a implementação do plano de melhorias:

- [x] **1. Otimização do Convex Backend & Índices**
  - [x] Adicionar índices de `status` e `status_endDate` em `schema.ts`
  - [x] Refatorar consultas em `alerts.ts` para usar `.withIndex()`
- [x] **2. Central de IA (Ecopilot) com Gemini API Real**
  - [x] Criar API Route Next.js para streaming SSE em `src/app/api/ai/insights/route.ts`
  - [x] Conectar `AICenter.tsx` via `EventSource` para streaming real de insights
- [x] **3. Temas OKLCH Dinâmicos via Tailwind CSS v4**
  - [x] Ajustar `globals.css` para configurar variáveis nativas de temas
  - [x] Adicionar seletor interativo de temas em `SettingsPage.tsx`
- [x] **4. Redução de Layout Shift (CLS)**
  - [x] Redesenhar Skeleton e Fallback de carregamento para o gráfico `EnergyChart` em `Dashboard.tsx`
