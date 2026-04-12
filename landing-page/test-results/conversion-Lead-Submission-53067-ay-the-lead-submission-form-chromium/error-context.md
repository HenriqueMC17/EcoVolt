# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: conversion.spec.ts >> Lead Submission Form — Conversion Path >> should display the lead submission form
- Location: e2e\conversion.spec.ts:79:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByLabel('Nome Completo')
Expected: visible
Timeout: 8000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 8000ms
  - waiting for getByLabel('Nome Completo')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [active]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e6]:
          - navigation [ref=e7]:
            - button "previous" [disabled] [ref=e8]:
              - img "previous" [ref=e9]
            - generic [ref=e11]:
              - generic [ref=e12]: 1/
              - text: "2"
            - button "next" [ref=e13] [cursor=pointer]:
              - img "next" [ref=e14]
          - img
        - generic [ref=e16]:
          - link "Next.js 16.2.1 (stale) Turbopack" [ref=e17] [cursor=pointer]:
            - /url: https://nextjs.org/docs/messages/version-staleness
            - img [ref=e18]
            - generic "There is a newer version (16.2.3) available, upgrade recommended!" [ref=e20]: Next.js 16.2.1 (stale)
            - generic [ref=e21]: Turbopack
          - img
      - generic [ref=e22]:
        - dialog "Console Error" [ref=e23]:
          - generic [ref=e26]:
            - generic [ref=e27]:
              - generic [ref=e28]:
                - generic [ref=e30]: Console Error
                - generic [ref=e31]:
                  - button "Copy Error Info" [ref=e32] [cursor=pointer]:
                    - img [ref=e33]
                  - button "No related documentation found" [disabled] [ref=e35]:
                    - img [ref=e36]
                  - button "Attach Node.js inspector" [ref=e38] [cursor=pointer]:
                    - img [ref=e39]
              - generic [ref=e48]:
                - text: Encountered a script tag while rendering React component. Scripts inside React components are never executed when rendering on the client. Consider using template tag instead (
                - link "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template" [ref=e49] [cursor=pointer]:
                  - /url: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
                - text: ).
            - generic [ref=e50]:
              - generic [ref=e51]:
                - paragraph [ref=e53]:
                  - img [ref=e55]
                  - generic [ref=e58]: src/app/providers/ThemeProvider.tsx (10:10) @ AppThemeProvider
                  - button "Open in editor" [ref=e59] [cursor=pointer]:
                    - img [ref=e61]
                - generic [ref=e64]:
                  - generic [ref=e65]: 8 | ...props
                  - generic [ref=e66]: "9 | }: React.ComponentPro..."
                  - generic [ref=e67]: "> 10 | return <NextThemesP..."
                  - generic [ref=e68]: "| ^"
                  - generic [ref=e69]: "11 | }"
                  - generic [ref=e70]: 12 |
              - generic [ref=e71]:
                - generic [ref=e72]:
                  - paragraph [ref=e73]:
                    - text: Call Stack
                    - generic [ref=e74]: "18"
                  - button "Show 15 ignore-listed frame(s)" [ref=e75] [cursor=pointer]:
                    - text: Show 15 ignore-listed frame(s)
                    - img [ref=e76]
                - generic [ref=e78]:
                  - generic [ref=e79]: script
                  - text: <anonymous>
                - generic [ref=e80]:
                  - generic [ref=e81]:
                    - text: AppThemeProvider
                    - button "Open AppThemeProvider in editor" [ref=e82] [cursor=pointer]:
                      - img [ref=e83]
                  - text: src/app/providers/ThemeProvider.tsx (10:10)
                - generic [ref=e85]:
                  - generic [ref=e86]:
                    - text: RootLayout
                    - button "Open RootLayout in editor" [ref=e87] [cursor=pointer]:
                      - img [ref=e88]
                  - text: src\app\layout.tsx (33:9)
          - generic [ref=e90]: "1"
          - generic [ref=e91]: "2"
        - contentinfo [ref=e92]:
          - region "Error feedback" [ref=e93]:
            - paragraph [ref=e94]:
              - link "Was this helpful?" [ref=e95] [cursor=pointer]:
                - /url: https://nextjs.org/telemetry#error-feedback
            - button "Mark as helpful" [ref=e96] [cursor=pointer]:
              - img [ref=e97]
            - button "Mark as not helpful" [ref=e100] [cursor=pointer]:
              - img [ref=e101]
    - generic [ref=e107] [cursor=pointer]:
      - button "Open Next.js Dev Tools" [ref=e108]:
        - img [ref=e109]
      - generic [ref=e112]:
        - button "Open issues overlay" [ref=e113]:
          - generic [ref=e114]:
            - generic [ref=e115]: "1"
            - generic [ref=e116]: "2"
          - generic [ref=e117]:
            - text: Issue
            - generic [ref=e118]: s
        - button "Collapse issues badge" [ref=e119]:
          - img [ref=e120]
  - generic [ref=e123]:
    - img [ref=e124]
    - heading "This page couldn’t load" [level=1] [ref=e126]
    - paragraph [ref=e127]: Reload to try again, or go back.
    - generic [ref=e128]:
      - button "Reload" [ref=e130] [cursor=pointer]
      - button "Back" [ref=e131] [cursor=pointer]
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | /**
  4   |  * EcoVolt E2E — Critical Conversion Path
  5   |  *
  6   |  * Selectors derived directly from source code analysis:
  7   |  * - Hero H1: role=heading level=1 (text: "Energia para a próxima escala.")
  8   |  * - Hero CTAs: role=button name="Agendar Trial" | "Documentação" (are <button>, not <a>)
  9   |  * - Nav: <nav> with <a> links from NAV_LINKS constant
  10  |  * - Form submit: role=button name="Solicitar Contato"
  11  |  * - Success state: <h3> text "Solicitação Enviada!"
  12  |  * - Footer: <footer> with groups "Produto", "Empresa", "Recursos", "Legal"
  13  |  *
  14  |  * Framer Motion mitigation: waitForLoadState('networkidle') + 1000ms settle
  15  |  */
  16  | 
  17  | const HYDRATION_WAIT = 1200;
  18  | 
  19  | test.describe("Landing Page — Hero & Navigation", () => {
  20  |   test.beforeEach(async ({ page }) => {
  21  |     await page.goto("/");
  22  |     await page.waitForLoadState("networkidle");
  23  |     await page.waitForTimeout(HYDRATION_WAIT);
  24  |   });
  25  | 
  26  |   test("should render the H1 heading", async ({ page }) => {
  27  |     const h1 = page.getByRole("heading", { level: 1 });
  28  |     await expect(h1).toBeVisible({ timeout: 10_000 });
  29  |     // Verify it contains the expected text (partial match, resilient to line breaks)
  30  |     const text = await h1.innerText();
  31  |     expect(text).toMatch(/energia|próxima|escala/i);
  32  |   });
  33  | 
  34  |   test("should render hero CTA buttons — Agendar Trial and Documentação", async ({ page }) => {
  35  |     const primaryCTA = page.getByRole("button", { name: /agendar trial/i });
  36  |     await expect(primaryCTA).toBeVisible({ timeout: 10_000 });
  37  | 
  38  |     const secondaryCTA = page.getByRole("button", { name: /documentação/i });
  39  |     await expect(secondaryCTA).toBeVisible({ timeout: 10_000 });
  40  |   });
  41  | 
  42  |   test("should render Navbar with navigation links", async ({ page }) => {
  43  |     const nav = page.locator("nav").first();
  44  |     await expect(nav).toBeVisible();
  45  | 
  46  |     // NAV_LINKS from constants.tsx
  47  |     for (const label of ["Solução", "Como Funciona", "Plataforma", "Benefícios", "Contato"]) {
  48  |       await expect(page.getByRole("link", { name: label, exact: true }).first()).toBeVisible();
  49  |     }
  50  |   });
  51  | 
  52  |   test("should render Footer with all section groups", async ({ page }) => {
  53  |     // Scroll to bottom
  54  |     await page.keyboard.press("End");
  55  |     await page.waitForTimeout(600);
  56  | 
  57  |     const footer = page.locator("footer");
  58  |     await expect(footer).toBeVisible({ timeout: 10_000 });
  59  | 
  60  |     for (const group of ["Produto", "Empresa", "Recursos", "Legal"]) {
  61  |       await expect(footer.getByText(group, { exact: true })).toBeVisible();
  62  |     }
  63  |   });
  64  | });
  65  | 
  66  | test.describe("Lead Submission Form — Conversion Path", () => {
  67  |   test.beforeEach(async ({ page }) => {
  68  |     await page.goto("/");
  69  |     await page.waitForLoadState("networkidle");
  70  |     await page.waitForTimeout(HYDRATION_WAIT);
  71  | 
  72  |     // Scroll incrementally to trigger lazy-loaded sections
  73  |     for (let i = 0; i < 6; i++) {
  74  |       await page.keyboard.press("PageDown");
  75  |       await page.waitForTimeout(250);
  76  |     }
  77  |   });
  78  | 
  79  |   test("should display the lead submission form", async ({ page }) => {
  80  |     const form = page.locator("form").first();
  81  |     await expect(form).toBeVisible({ timeout: 15_000 });
  82  | 
  83  |     // Verify key form fields are present (by label text from LeadSubmissionForm.tsx)
> 84  |     await expect(page.getByLabel("Nome Completo")).toBeVisible({ timeout: 8_000 });
      |                                                    ^ Error: expect(locator).toBeVisible() failed
  85  |     await expect(page.getByLabel("Email Corporativo")).toBeVisible();
  86  |     await expect(page.getByLabel("Empresa")).toBeVisible();
  87  |   });
  88  | 
  89  |   test("should show validation errors on empty submit", async ({ page }) => {
  90  |     const form = page.locator("form").first();
  91  |     await expect(form).toBeVisible({ timeout: 15_000 });
  92  | 
  93  |     // Submit button text from source: "Solicitar Contato"
  94  |     const submitBtn = page.getByRole("button", { name: /solicitar contato/i });
  95  |     await expect(submitBtn).toBeVisible({ timeout: 8_000 });
  96  |     await submitBtn.click();
  97  | 
  98  |     // react-hook-form renders errors as text next to inputs
  99  |     // Zod schema requires: name, company, email, phone, role, segment
  100 |     const firstError = page.locator("p.text-red-500, span.text-red-500, p[class*='error'], [data-error]").first();
  101 |     await expect(firstError).toBeVisible({ timeout: 8_000 });
  102 |   });
  103 | 
  104 |   test("should fill and submit the lead form successfully", async ({ page }) => {
  105 |     const form = page.locator("form").first();
  106 |     await expect(form).toBeVisible({ timeout: 15_000 });
  107 | 
  108 |     // Fill required fields (labels from LeadSubmissionForm.tsx)
  109 |     await page.getByLabel("Nome Completo").fill("João Silva");
  110 |     await page.getByLabel("Empresa").fill("TechCorp Ltda");
  111 |     await page.getByLabel("Email Corporativo").fill("joao.silva@techcorp.com.br");
  112 |     await page.getByLabel("Telefone / WhatsApp").fill("(11) 99999-8888");
  113 |     await page.getByLabel("Seu Cargo").fill("CTO");
  114 |     await page.getByLabel("Segmento de Atuação").selectOption("corporativo");
  115 | 
  116 |     const submitBtn = page.getByRole("button", { name: /solicitar contato/i });
  117 |     await submitBtn.click();
  118 | 
  119 |     // Success state from LeadSubmissionForm.tsx: <h3>Solicitação Enviada!</h3>
  120 |     const successHeading = page.getByRole("heading", { name: /solicitação enviada/i });
  121 |     await expect(successHeading).toBeVisible({ timeout: 15_000 });
  122 |   });
  123 | });
  124 | 
  125 | test.describe("Sub-pages — Smoke Tests", () => {
  126 |   const pages = [
  127 |     { title: "platform", url: "/product/platform" },
  128 |     { title: "privacy",  url: "/legal/privacy"    },
  129 |     { title: "docs",     url: "/resources/docs"   },
  130 |   ] as const;
  131 | 
  132 |   for (const { title, url } of pages) {
  133 |     test(`${title} page should load without 4xx/5xx errors`, async ({ page }) => {
  134 |       const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  135 |       expect(response?.status()).toBeLessThan(400);
  136 | 
  137 |       const main = page.getByRole("main");
  138 |       await expect(main).toBeVisible({ timeout: 8_000 });
  139 |     });
  140 |   }
  141 | });
  142 | 
```