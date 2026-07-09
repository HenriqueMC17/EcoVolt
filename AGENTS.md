# 📜 CONSTITUIÇÃO DO PROJETO: DIRETRIZES PARA AGENTES DE IA (`AGENTS.md`)

Este documento estabelece as diretrizes de governança, padrões arquiteturais e regras visuais mandatórias para qualquer agente de IA que opere dentro do ecossistema do **EcoVolt**.

---

## 🏛️ 1. Diretrizes de Arquitetura e Código

O ecossistema EcoVolt é estruturado em duas aplicações principais (`apps/dashboard` e `apps/landing-page`) que consomem o **Convex** no backend.

- **FSD (Feature-Sliced Design) no Frontend**: Toda interface do dashboard e da landing page segue a arquitetura Feature-Sliced Design. Mantenha a separação rígida entre as camadas: `app`, `pages-fsd`, `widgets`, `features`, `entities`, e `shared`.
- **Isolamento de Negócio (Camada de Serviços)**: Regras de negócio puras (cálculos de ROI, conversões de métricas) devem residir no diretório `convex/services/` isoladas dos entry-points públicos de queries/mutations.
- **Segurança de Endpoints (OWASP / BOLA)**: É proibido confiar em IDs de usuário informados diretamente pelo cliente (`userId` vindo nos argumentos). Toda requisição de dados pessoais ou edição de entidades deve passar por autenticação nativa JWT via Clerk (`ctx.auth.getUserIdentity()`).
- **Resiliência e Fallbacks**: Integrações com APIs de terceiros (como a API de clima Open-Meteo) devem ser protegidas por disjuntores lógicos (Circuit Breakers) com políticas robustas de cache e fallback locais para evitar falhas consecutivas.

---

## 🎨 2. Padrões de Estética Premium e Design Engineering

Todas as interfaces gráficas criadas ou editadas neste repositório devem cumprir com as diretrizes do **Design Engineering Premium**:

- **Dark Mode Tri-Layer**:
  - `Layer 0 (Fundo Primário)`: `#0D0D0D`
  - `Layer 1 (Cards, Sidebar)`: `#1A1A1A`
  - `Layer 2 (Diálogos, Tooltips, Modais)`: `#2D2D2D`
- **Crisp Borders**: Use contornos finos de `1px` com transparência suave (`rgba(255, 255, 255, 0.08)` para Layer 1 e `rgba(255, 255, 255, 0.15)` para Layer 2) em vez de sombras pesadas ou bordas sólidas grossas.
- **Alinhamento Numérico e Geist Mono**: Use `font-variant-numeric: tabular-nums` e Geist Mono para exibir dados numéricos e métricas dinâmicas para estabilidade visual total.
- **APCA Contrast**: As paletas de cores (Solar/Emerald, Wind/Sapphire, Biomass/Amber) devem cumprir estritamente com os níveis mínimos de contraste dinâmico APCA (**Lc 75** para texto comum, **Lc 60** para cabeçalhos e elementos maiores).
- **GPU Acceleration e Transições Spring**: Painéis flutuantes ou de vidro fosco (backdrop-blur) devem forçar aceleração GPU (`transform: translate3d(0, 0, 0)`). Animações de transição hover e modais devem usar easing de mola elástica através da função CSS `linear()`.

---

## 🚀 3. Ciclo de Validação e Qualidade

- **Validação Local Obrigatória**: Antes de enviar alterações para homologação, execute obrigatoriamente o script `./validate-all.ps1`.
- **Cobertura de Código**: Alterações críticas e novas funcionalidades devem possuir testes associados (E2E na landing page com Playwright ou unitários locais).
- **Comandos Proibidos**: Nunca utilize o comando `cd` nos terminais. Configure o `Cwd` diretamente nas ferramentas ou use caminhos de arquivo absolutos.
