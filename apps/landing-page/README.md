<div align="center">
  <img src="./Logo_EcoVolt_UPX3.png" alt="EcoVolt Logo" width="200"/>

# EcoVolt – Portal de Apresentação e Conversão Corporativa

  **Acelerando a transição corporativa para energia limpa e gerenciamento de ativos sustentáveis.**

  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

</div>

---

## ✦ Sobre o Projeto

A **EcoVolt Landing Page** é o portal institucional focado no fechamento de parcerias B2B da plataforma. Criada para proporcionar uma experiência **Cinematic UX**, ela combina narrativas interativas sobre sustentabilidade e economia energética com recursos técnicos modernos.

A arquitetura foi meticulosamente otimizada visando a pontuação máxima de **Core Web Vitals**:

* **Code Splitting Agressivo:** Componentes e seções posicionados abaixo da dobra (Below-the-Fold) são carregados assincronamente através de `next/dynamic` apenas quando entram na viewport do usuário.
* **Resiliência Transversal:** Lógica para garantir estabilidade mesmo perante falhas nas APIs do backend.
* **Acessibilidade Completa:** Foco em contrastes adequados (OKLCH), atributos ARIA semânticos e navegação fluida por teclado.

---

## ✦ Recursos Principais e Diferenciais Técnicos

* **Validação Segura com Server Actions:** Captação de leads de interesse via formulários de contato processados no servidor com Next.js **Server Actions** (`submitLeadAction`) e validados rigorosamente com **Zod**.
* **Observabilidade e Logs Estruturados:** Utiliza a biblioteca **Pino** (com formatação legível por `pino-pretty` em desenvolvimento) para gerar logs JSON estruturados e padronizados sobre os processos da aplicação.
* **Motor de Resiliência (Circuit Breaker & Backoff):** Camada interna customizada (`withResilience`) que encapsula requisições críticas, fornecendo suporte a **Circuit Breaker** (Disjuntor de API) e retentativas automáticas com recuo exponencial.
* **Banco de Dados de Telemetria (Convex):** Integração com o Convex local sob o esquema de telemetria `energyData` (para demonstrativos em tempo real das máquinas energéticas) e status de latência `healthMetrics`.
* **Dark & Light Mode Nativo:** Tematização flexível controlada via `next-themes` e integrada com as novas variáveis do Tailwind CSS v4.

---

## ✦ Estrutura e Arquitetura do Projeto (FSD Simplificado)

O projeto divide as pastas de forma modular baseada em responsabilidades:

```text
src/
├── app/                  # Rotas físicas do Next.js App Router, CSS global e layout root
│   ├── company/          # Páginas institucionais (Quem Somos)
│   ├── legal/            # Termos de serviço e políticas de privacidade
│   ├── product/          # Detalhamento de planos corporativos
│   ├── providers/        # Contextos compartilhados (Next-themes, ConvexProvider)
│   └── solicitar-demonstracao/ # Formulário dedicado de contato avançado
│
├── features/             # Lógicas e seções isoladas divididas por contexto funcional
│   ├── conversion/       # Formulários de contato e seções de públicos-alvo (Persona)
│   ├── dashboard/        # Demonstrações de gráficos reais de telemetria
│   ├── discovery/        # Seções de descoberta do problema, precificação e diferenciais
│   ├── hero/             # Banner animado principal acima da dobra (Above-the-Fold)
│   ├── lead-submission/  # Server Actions e schemas do Zod para submissão de contatos
│   ├── motion/           # Componentes e transições pré-configuradas do Framer Motion
│   └── support/          # Seção de FAQ e ajudas gerais
│
├── shared/               # Recursos reutilizáveis de baixo nível (Sem regras de negócio)
│   ├── components/       # Componentes de interface globais (Navbar, Footer)
│   ├── ui/               # Design System atômico (Button, Badge, etc.)
│   └── lib/              # Inicialização de bibliotecas (logger, resilience)
│
└── widgets/              # Elementos que unem features em estruturas de layout (Layout wrapper)
```

---

## ✦ Instalação e Execução Local

### 1. Clonar o Repositório

```bash
git clone https://github.com/HenriqueMC17/portfolio-profissional.git
cd portfolio-profissional/apps/landing-page
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na pasta raiz de `apps/landing-page`:

```env
NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210
```

> [!WARNING]
> **Atenção:** Evite utilizar URLs de placeholder como `https://dummy-url.convex.cloud`. O parser interno do SDK do Convex exige um formato válido (ex: `https://funny-animal-123.convex.cloud` ou conexões locais como `http://127.0.0.1:3210`). URLs inválidas acarretarão no erro crítico `Couldn't parse deployment name`.

### 4. Executar em Desenvolvimento

Para subir o servidor local:

```bash
npm run dev
```

Acesse o portal em: `http://localhost:3000`.

---

## ✦ Testes de Conversão e Qualidade

O projeto está configurado com o **Playwright** para garantir que o fluxo de conversão principal (Preenchimento e Envio de Lead) nunca quebre em produção.

* **Executar os testes E2E:**
  ```bash
  npm run e2e
  ```
* **Visualizar a interface gráfica do Playwright (modo interativo):**
  ```bash
  npm run e2e:ui
  ```

---

## ✦ Scripts Disponíveis

* `npm run dev`: Inicializa o servidor local de desenvolvimento.
* `npm run build`: Compila e otimiza a aplicação Next.js para produção.
* `npm run start`: Inicia o servidor Next.js compilado em produção.
* `npm run lint`: Valida o linter de código.
* `npm run prepare`: Inicializa os hooks do Husky para validações no commit.
