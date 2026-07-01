# 🌌 EcoVolt – Plataforma de Gestão e Inteligência Energética

EcoVolt é uma infraestrutura de **Luxury Enterprise** focada em gestão, análise e simulação de ativos de energia renovável. Evoluída de um dashboard simples para uma plataforma robusta, permite que empresas monitorem seu consumo, prevejam economias e analisem o impacto ambiental em tempo real.

## 🔗 Links de Acesso (Deploys)

- 📈 **Dashboard**: [https://dashboard-psi-lyart-97.vercel.app/login](https://dashboard-psi-lyart-97.vercel.app/login)
- 🌐 **Landing Page**: [https://landing-page-wheat-omega-53.vercel.app/](https://landing-page-wheat-omega-53.vercel.app/)

## 🚀 Problema que Resolve

A falta de visibilidade sobre o desempenho de ativos energéticos descentralizados (Solar, Eólico, etc.) e a dificuldade em realizar projeções financeiras realistas baseadas em dados ambientais externos. O EcoVolt centraliza esses dados e oferece ferramentas de simulação precisas.

## 🏛️ Arquitetura do Sistema
O projeto segue uma arquitetura profissional em camadas (**Controller -> Service -> Repository**) implementada sobre o ecossistema Convex e React:

### Backend (Convex)
- **Controller (Entry Points)**: Public `query` e `mutation` em `convex/projects.ts` e `convex/metrics.ts`. Para segurança dos endpoints do backend Convex, implementamos o hardening de segurança baseado nas diretrizes de [Technical Report: The Evolution of API Security (OWASP Top 10)](file:///c:/Dev/Docs/Programação%20Web/Technical%20Report_%20The%20Evolution%20of%20API%20Security%E2%80%93A%20Deep%20Analysis%20of%20the%20OWASP%20API%20Top%2010%20%282019%E2%80%932025%29.md).
- **Service Layer**: Lógica de negócio isolada em `convex/services/energy.ts` para cálculos de simulação e ROI.
- **External Integration**: `convex/external/weather.ts` realiza chamadas assíncronas para APIs de clima (Open-Meteo).
- **Audit System**: Registro automático de todas as ações críticas na tabela `auditLogs`.

### Frontend (FSD Alignment)
- **Framework**: Next.js 16 (App Router) + React 19.
- **Design System**: Tailwind CSS 4 + Framer Motion (Cinematic UX). A adoção estrutural do Tailwind v4 segue o roadmap definido no [Strategic Modernization Plan: Adopting Tailwind CSS v4](file:///c:/Dev/Docs/Programação%20Web/Strategic%20Modernization%20Plan_%20Adopting%20Tailwind%20CSS%20v4%20and%20the%20React%20Compiler.md).
- **Visualization**: Recharts para análise de tendência e geração.

## 🔗 Integração com API Externa
A plataforma consome a API da **Open-Meteo** para obter dados de radiação solar em tempo real baseados na localização do projeto.
- **Fallback Strategy**: Caso a API esteja indisponível, o sistema utiliza médias históricas regionalizadas para garantir que o simulador nunca fique inativo. O tratamento e orquestração de contexto dos dados seguem os conceitos de [Strategic Manual: Context Engineering for High-Reliability Enterprise Applications](file:///c:/Dev/Docs/Guia%20de%20Engenharia%20de%20Prompt/Strategic%20Manual_%20Context%20Engineering%20for%20High-Reliability%20Enterprise%20Applications.md) para mitigar inconsistências.
- **Normalização**: Os dados brutos são processados no backend antes de serem entregues ao frontend.

## 🛠️ Tecnologias Utilizadas
- **Core**: React 19, TypeScript, Vite.
- **Backend-as-a-Service**: Convex.
- **Styling**: Tailwind CSS 4 (OKLCH).
- **Animations**: Framer Motion.
- **Charts**: Recharts.
- **Icons**: Lucide React.

## 📦 Instruções de Execução
1. Clone o repositório.
2. Navegue até `apps/dashboard`.
3. Instale as dependências: `npm install`.
4. Configure o Convex: `npx convex dev`.
5. Inicie o projeto: `npm run dev`.

---

## 📐 Modelagem do Banco (Principais Entidades)

| Entidade | Campos Principais |
| :--- | :--- |
| **Users** | `id`, `name`, `email`, `role`, `createdAt` |
| **Projects** | `id`, `userId`, `name`, `status`, `category`, `location` |
| **Metrics** | `id`, `projectId`, `energyConsumption`, `savings`, `CO2Impact` |
| **AuditLogs** | `id`, `projectId`, `userId`, `action`, `details`, `timestamp` |

---

## 🌟 Diferenciais Implementados
- **Simulação em Tempo Real**: Integração viva com dados de clima.
- **Auditoria Completa**: Rastreabilidade total de mudanças.
- **Arquitetura Escalável**: Separação clara de responsabilidades no backend.
- **UX Premium**: Glassmorphism e animações orquestradas.

> **"Código é um ativo. Arquitetura é o seguro."** – *EcoVolt Platform*
