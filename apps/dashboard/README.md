<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=timeGradient&height=250&section=header&text=EcoVolt%20Dashboard&fontSize=50&fontAlignY=35&desc=Painel%20de%20Controle%20e%20Intelig%C3%AAncia%20Energ%C3%A9tica&descAlignY=55&descAlign=50" alt="EcoVolt Dashboard Banner" />
  
  <br />
  
  <blockquote>
    <p><b>Painel de controle corporativo de alta performance focado em telemetria, finanças, contratos e inteligência de ativos de energia renovável.</b></p>
  </blockquote>

  <p>
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
    <img alt="React 19" src="https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
    <img alt="Next.js 16" src="https://img.shields.io/badge/Next.js%2016-black?style=for-the-badge&logo=next.js&logoColor=white">
    <img alt="Convex" src="https://img.shields.io/badge/Convex-FF5A4F?style=for-the-badge&logo=convex&logoColor=white">
    <img alt="Clerk" src="https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white">
  </p>
</div>

---

## ✦ Sobre o Projeto

O **EcoVolt Dashboard** é a central de operações e inteligência do ecossistema EcoVolt. Esta aplicação foi desenvolvida para atender às demandas de grandes corporações e gestores de energia, permitindo monitorar o consumo, prever despesas com tarifas baseadas em faixas horárias, gerenciar contratos bilaterais de compra e venda de energia limpa, e obter **insights gerados por IA em tempo real**.

A interface adota conceitos de **Luxury UX**, proporcionando transições fluidas e layouts otimizados para evitar qualquer Layout Shift (CLS) durante o carregamento assíncrono de dados.

---

## ✦ Principais Módulos da Aplicação

* **Painel de Telemetria Energética (Consumption):** Visualizações ricas com gráficos interativos em **Recharts**, comparando o consumo de energia previsto em relação ao realizado (em kWh) por evento ou planta corporativa.
* **Módulo Financeiro e Contratos (Financial & Contracts):** Acompanhamento de fluxo de caixa (receitas e despesas), faturas (pendentes, pagas, atrasadas), e controle de contratos bilaterais com taxas por kWh combinadas.
* **AI Center:** Módulo de IA simulando streaming assíncrono (Server-Sent Events) que analisa anomalias no consumo, prevê perdas por variações climáticas locais e recomenda janelas de economia tarifária.
* **Documentos e Auditoria:** Sistema de envio e validação de documentos regulatórios integrados com fluxos de aprovação, mantendo registros imutáveis de logs de atividades na tabela `activityLog`.
* **Projetos:** Gestão de ativos e geração descentralizada categorizados por matriz (Solar, Eólica, Hídrica, Biomassa) com geolocalização e status de análise.

---

## ✦ Arquitetura de Software: Feature-Sliced Design (FSD)

Para manter a escalabilidade do frontend com o crescimento da plataforma, o projeto é estruturado conforme a metodologia **Feature-Sliced Design (FSD)**:

```text
src/
├── app/                  # Configurações globais, providers e rotas do Next.js App Router
│   ├── globals.css       # Estilos globais (Tailwind CSS v4)
│   ├── layout.tsx        # Layout raiz e injeção de Providers
│   └── page.tsx          # Ponto de entrada que carrega a View principal do Dashboard
│
├── pages-fsd/            # Composições de widgets montando as telas completas (Alias: @/pages/*)
│   ├── ai-center/        # Tela principal do hub de inteligência artificial
│   ├── consumption/      # Tela analítica de telemetria de consumo energético
│   ├── financial/        # Painel financeiro de receitas, despesas e status de faturamento
│   └── ...               # Configurações, Projetos, Documentos, Contratos, Eventos
│
├── widgets/              # Componentes complexos e autônomos integrando features e entidades
│   ├── sidebar/          # Painel de navegação lateral rico com micro-animações
│   ├── header/           # Cabeçalho da aplicação com perfil do usuário e notificações
│   └── ai-center/        # Bloco visual e interativo da inteligência de telemetria
│
├── features/             # Funcionalidades e ações do usuário de alto valor de negócio
│   ├── dashboard/        # Layout principal de KPIs, gráficos e hooks de telemetria
│   └── search/           # Barra de pesquisa avançada por ativos e logs
│
├── entities/             # Conceitos de negócio puros (Models, Hooks compartilhados)
│
├── shared/               # Componentes atômicos e recursos reutilizáveis sem regras de negócio
│   ├── ui/               # Botões, inputs, modais e o card dinâmico SmartKPI
│   └── lib/              # Utilitários de classes CSS (cn) e wrappers do Convex client
│
├── middleware.ts         # Middleware para rotas protegidas (Suporta Clerk ou Mock Auth)
```

---

## ✦ Mecanismo de Autenticação Duplo (Dual-Auth Engine)

A aplicação conta com um sistema inteligente e adaptável de autenticação no arquivo `middleware.ts`:

1. **Modo Mock (Desenvolvimento Rápido):** 
   - Ativado automaticamente se a chave `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` não estiver declarada ou for igual a `"dummy"`.
   - Utiliza um cookie local chamado `ecovolt-session` para autenticar sessões mockadas.
   - Perfeito para desenvolvimento offline, demonstrações rápidas e prototipagem sem necessidade de credenciais externas.
2. **Modo Clerk (Produção/Homologação):**
   - Utiliza autenticação robusta via **Clerk** integrando o `@clerk/nextjs` e sincroniza o perfil do usuário diretamente na tabela `users` do Convex na primeira autenticação.

---

## ✦ Stack Tecnológica

- **Next.js 16 (App Router) & React 19:** Utilizando o compilador React e recursos avançados de renderização assíncrona.
- **Tailwind CSS v4:** Estilização com performance aprimorada, suporte a variáveis CSS nativas e paleta em escala OKLCH.
- **Framer Motion:** Micro-interações táteis e efeitos cinemáticos.
- **Zustand & React Query (TanStack):** Gerenciamento de estado global leve e cacheamento eficiente de dados.
- **Recharts:** Renderização fluida de gráficos SVG responsivos.
- **Convex (BaaS):** Backend Serverless reativo com sincronização por WebSocket nativo.

---

## ✦ Configuração e Instalação

### 1. Pré-requisitos
- Node.js (Versão 18 ou superior)
- Conta no [Convex](https://www.convex.dev/) (para modo live) e [Clerk](https://clerk.dev/) (opcional, para modo Clerk live).

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz de `apps/dashboard`:
```env
# URL do backend do Convex
NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210

# Chave de autenticação Clerk (Caso queira rodar em modo Mock, deixe como "dummy")
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=dummy
```

### 3. Instalar Dependências
```bash
npm install
```

### 4. Inicializar o Backend e Rodar Localmente
Para iniciar o banco de dados local do Convex:
```bash
# Na pasta raiz ou na pasta apps/dashboard
npx convex dev
```

E para rodar o servidor de desenvolvimento do Next.js:
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador. Se o modo mock estiver ativo, você será redirecionado para `/login` onde poderá entrar utilizando dados simulados.

### 5. Popular o Banco (Seeding)
Para preencher o banco com dados simulados de métricas, consumo real, contratos de eventos e finanças:
```bash
# Executa a sementeira nativa do Convex
npx convex run seed
```

---

## ✦ Scripts Disponíveis

* `npm run dev`: Inicializa o servidor local de desenvolvimento.
* `npm run build`: Compila e otimiza a aplicação para produção.
* `npm run start`: Inicia o servidor Next.js compilado em produção.
* `npm run lint`: Executa a varredura do linter para verificar a qualidade do código.
