# 🛠️ TechSpec: EcoVolt Dashboard Alignment

**Status:** Draft / Review Required
**Author:** Agente Sênior Full Stack
**Version:** 1.0.0

## 1. Objetivo
Alinhar o projeto `EcoVolt Dashboard` com o framework `@agente-core` e o manifesto `GEMINI.md`, garantindo uma arquitetura de elite (FSD), stack moderna (Tailwind 4, Next.js) e padrões de Clean Code/SOLID.

## 2. Estado Atual
- **Framework**: Vite + React 19.
- **Estrutura**: Tradicional (`src/components`, `src/pages`, `src/context`).
- **Estilização**: CSS puro / Inline (sem Tailwind detectado no `package.json`).
- **Estado**: Funcional, mas desalinhado com o SSOT.

## 3. Proposta Técnica

### 3.1. Migração de Framework (Vite → Next.js)
- **Motivação**: O manifesto `GEMINI.md` exige Next.js 16 (App Router).
- **Ação**: Inicializar um novo projeto Next.js 15 (estável) e migrar a lógica de `src/`.
- **Risco**: Complexidade média. Requer ajuste de roteamento (`react-router-dom` → `Next.js App Router`).

### 3.2. Reestruturação Arquitetural (FSD)
- **Camada `app`**: Providers de contexto, layouts globais e roteamento.
- **Camada `features`**: Isolar domínios como `analytics`, `hero`, `discovery`.
- **Camada `shared`**: Componentes UI atômicos, hooks utilitários e constantes.

### 3.3. Estilização e Design System
- **Tailwind CSS 4**: Instalação e configuração para uso de OKLCH e Native Layers.
- **Aesthetics**: Implementação de Glassmorphism e micro-animações (Framer Motion já presente).

### 3.4. Validação e Tipagem
- Integração de `Zod` e `React Hook Form` conforme exigido.

## 4. Plano de Execução (Milestones)
1.  **Fase 1**: Inicialização do ambiente Next.js e Tailwind 4.
2.  **Fase 2**: Refatoração da estrutura de pastas para FSD.
3.  **Fase 3**: Migração de componentes existentes para o novo padrão UI/Shared.
4.  **Fase 4**: Implementação de regras de validação (Zod) e otimização de performance.

## 5. Perguntas de Validação (Socratic Gate)
1.  Confirmamos a migração de Vite para Next.js para seguir o `GEMINI.md`?
2.  O projeto deve manter a integração com Convex no novo setup Next.js? (Altamente recomendado).
3.  Existe algum requisito de SEO imediato que deva ser priorizado na camada `app`?
