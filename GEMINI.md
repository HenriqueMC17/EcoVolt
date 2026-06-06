# 🌌 EcoVolt – Executive Operating System (GEMINI.md)

Este documento atua como o **Manifesto Técnico e Operacional** para o projeto EcoVolt. Ele serve como a Fonte Única de Verdade (SSOT) para desenvolvedores sêniores e agentes de IA, garantindo que cada linha de código contribua para um ativo digital de elite.

---

## 🏗️ 1. Identidade e Arquitetura de Elite

O EcoVolt não é apenas uma landing page; é uma infraestrutura de **Luxury Enterprise** focada em inteligência energética.

### 🏛️ Core Architecture: Feature-Sliced Design (FSD)
Adotamos uma versão otimizada do FSD para máxima escalabilidade:
-   **`src/app/`**: A "Cola" do sistema. Roteamento (Next.js App Router), providers globais e layouts.
-   **`src/features/`**: Domínios de negócio isolados. Cada feature é auto-contida (`hero`, `discovery`, `analytics`, `conversion`). Se uma feature crescer demais, ela vira um domínio próprio.
-   **`src/shared/`**: Infraestrutura agnóstica.
    -   **`ui/`**: Nosso Design System atômico (Button, Badge, Typography).
    -   **`components/`**: Layouts compartilhados (Navbar, Footer, Section).
    -   **`lib/`**: Utilitários puristas, configurações de performance e constantes.

### ⚡ Tech Stack (Cutting Edge)
-   **Framework**: Next.js 16 (App Router) + React 19.
-   **Estilização**: Tailwind CSS 4 (OKLCH Color Space & Native Layers).
-   **Animações**: Framer Motion (Premium Easing - Cinematic UX).
-   **Validação**: Zod + React Hook Form (Type-safe from edge to core).

---

## 🎨 2. Filosofia de Design: Aesthetics-UX-Pro-Max

O objetivo é o efeito **"WOW"** imediato.
-   **Aesthetic**: Glassmorphism cinematográfico, profundidade com blur exponencial.
-   **Tipografia**: Uso estrito do componente `Typography` com Geist Sans.
-   **Movimento**: Micro-interações táteis e "orchestrated entry animations".
-   **Performance**: LCP < 1.2s via dynamic imports e otimização agressiva de ativos.

---

## 🛡️ 3. Padrões de Engenharia (Senior Fullstack)

### 📜 Princípios Inegociáveis
1.  **SOLID & Clean Code**: Funções com responsabilidade única. Se o componente UI tem lógica de negócio, extraia para um look ou feature.
2.  **Fail Fast**: Utilize guard clauses e validação de schema (Zod) precocemente.
3.  **Secure by Design**: Sanitização de dados e segurança de transporte por padrão.
4.  **Dry vs Cohesion**: Prefira duplicar código em domínios diferentes a criar acoplamento precoce (Rule of Three).

### 🔄 Git & Flow
-   **Conventional Commits**: `feat:`, `fix:`, `refactor:`, `chore:`, `test:`.
-   **Feature Branching**: Proteção absoluta da `main`. Merges via PR com squash.
-   **Documentação Contínua**: Mudanças arquiteturais exigem atualização no `ARCHITECTURE.md`.

---

## 🤖 4. Diretrizes para Agentes de IA

Sempre que atuar neste repositório:
1.  **Analise antes de agir**: Verifique o impacto de mudanças nas dependências via `grep`.
2.  **Mantenha a Elegância**: Proponha soluções que herdem o estilo visual premium.
3.  **Refatoração Habitual**: Se encontrar código morto ou padrões antigos, sugira o refactor atômico.
4.  **Performance First**: Não introduza bibliotecas pesadas sem justificativa de benchmarking.

---

## 🚀 5. Roadmap & Visão

O EcoVolt está em fase de expansão para se tornar um Hub de gestão energética em tempo real. Cada componente UI deve ser pensado para receber dados via stream no futuro.

---

> **"Código é um ativo. Arquitetura é o seguro."** – *Agente Sênior Full Stack @ EcoVolt*
