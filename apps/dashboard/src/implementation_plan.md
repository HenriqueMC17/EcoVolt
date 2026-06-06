# Plano de Implementação – Otimizações e Melhorias do EcoVolt Dashboard

Este plano detalha a implementação das 5 melhorias arquiteturais e de performance propostas para o EcoVolt Dashboard.

## Revisão do Usuário Requerida

> [!IMPORTANT]
> **Conexão Real do Clerk**: A melhoria de Autenticação Nativa Clerk-Convex por JWT prepara o backend do Convex para validar tokens JWT emitidos pelo Clerk. No entanto, para funcionar em produção, você precisará configurar as variáveis de ambiente `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` e `CLERK_SECRET_KEY` no seu ambiente Next.js, além do `CLERK_JWT_ISSUER_DOMAIN` nas configurações do Convex Dashboard.

## Questões Abertas

Nenhuma questão impeditiva identificada. As melhorias propostas mantêm compatibilidade total com os fluxos e dados atuais.

## Alterações Propostas

---

### Camada de Dados e Banco de Dados (Convex Backend)

#### [MODIFY] [schema.ts](file:///c:/Dev/EcoVolt/apps/dashboard/convex/schema.ts)
- Adicionar índices específicos para buscas rápidas baseadas no status de entidades críticas, eliminando a necessidade de buscas sequenciais (*Table Scans*).
- Índices a adicionar:
  - `events`: `.index("by_status", ["status"])` e `.index("by_status_endDate", ["status", "endDate"])`
  - `financials`: `.index("by_status", ["status"])`
  - `documents`: `.index("by_status", ["status"])`

#### [MODIFY] [alerts.ts](file:///c:/Dev/EcoVolt/apps/dashboard/convex/alerts.ts)
- Atualizar as queries de agregação de alertas operacionais para usar os novos indexadores `.withIndex("by_status")` e `.withIndex("by_status_endDate")` em vez de `.filter(...)`.

#### [MODIFY] [metrics.ts](file:///c:/Dev/EcoVolt/apps/dashboard/convex/metrics.ts)
- Atualizar a função auxiliar `resolveUser` para integrar autenticação nativa por JWT via `ctx.auth.getUserIdentity()`.

---

### Camada de Apresentação e Integração (Next.js Frontend & API)

#### [NEW] [route.ts](file:///c:/Dev/EcoVolt/apps/dashboard/src/app/api/ai/insights/route.ts)
- Criar uma rota de API Next.js que implementa **Server-Sent Events (SSE)** para streaming de insights preditivos utilizando o SDK oficial do Google Gemini (`@google/generative-ai` ou fallback estruturado).

#### [MODIFY] [AICenter.tsx](file:///c:/Dev/EcoVolt/apps/dashboard/src/widgets/ai-center/ui/AICenter.tsx)
- Substituir a simulação baseada em frontend (`setInterval` estático) por uma conexão real via `EventSource` conectada à nova rota de API `/api/ai/insights`.
- Garantir que o texto recebido via stream do servidor seja renderizado em tempo real com efeito caret cursor suave.

#### [MODIFY] [SettingsPage.tsx](file:///c:/Dev/EcoVolt/apps/dashboard/src/pages-fsd/configuracoes/ui/SettingsPage.tsx)
- Implementar o chaveamento dinâmico de temas ("Aparência") integrando botões de seleção de tema (Solar/Emerald, Wind/Sapphire, Biomass/Amber).
- Adicionar lógica para injetar a classe `data-theme` no `document.documentElement` e persistir a escolha no LocalStorage.

#### [MODIFY] [globals.css](file:///c:/Dev/EcoVolt/apps/dashboard/src/app/globals.css)
- Redefinir as variáveis semânticas do Tailwind v4 (`--color-primary`, etc.) sob o escopo de variáveis CSS nativas vinculadas aos seletores de tema (`:root`, `[data-theme="wind"]`, `[data-theme="biomass"]`).

#### [MODIFY] [Dashboard.tsx](file:///c:/Dev/EcoVolt/apps/dashboard/src/features/dashboard/ui/Dashboard.tsx)
- Redesenhar o Skeleton de carregamento do componente `EnergyChart` importado dinamicamente para alocar exatamente a mesma altura e proporção física (`h-[320px]`) e simular barras animadas, eliminando o Layout Shift (CLS).

---

## Plano de Verificação

### Testes Manuais
1. **Verificação de Performance no Convex**: Executar o dashboard localmente e verificar nos logs do Convex que as queries de alertas operacionais não geram alertas de *Table Scan*.
2. **Teste de Streaming**: Acessar a página do AI Center e verificar o fluxo fluido da escrita do diagnóstico.
3. **Teste de Aparência**: Acessar a página de configurações, alternar entre os temas (Solar, Eólica e Biomassa) e verificar se a paleta de cores OKLCH atualiza instantaneamente.
4. **Teste de Layout Shift**: Recarregar a página inicial e observar se a transição de carregamento do gráfico ocorre sem saltos físicos na interface.
