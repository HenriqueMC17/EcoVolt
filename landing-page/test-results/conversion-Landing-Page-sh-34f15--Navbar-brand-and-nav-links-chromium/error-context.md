# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: conversion.spec.ts >> Landing Page >> should display the Navbar brand and nav links
- Location: e2e\conversion.spec.ts:37:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: /solução|início|plataforma|benefícios/i }).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('link', { name: /solução|início|plataforma|benefícios/i }).first()

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
                  - generic [ref=e58]: src\app\layout.tsx (33:9) @ RootLayout
                  - button "Open in editor" [ref=e59] [cursor=pointer]:
                    - img [ref=e61]
                - generic [ref=e64]:
                  - generic [ref=e65]: "31 | <html lang=\"pt-BR\" className={`${inter.variable} ${outfit.variable} scroll-smooth`} su..."
                  - generic [ref=e66]: 32 | <body className="antialiased overflow-x-hidden bg-white text-slate-900 dark:bg-slate...
                  - generic [ref=e67]: "> 33 | <AppThemeProvider"
                  - generic [ref=e68]: "| ^"
                  - generic [ref=e69]: 34 | attribute="class"
                  - generic [ref=e70]: 35 | defaultTheme="system"
                  - generic [ref=e71]: 36 | enableSystem
              - generic [ref=e72]:
                - generic [ref=e73]:
                  - paragraph [ref=e74]:
                    - text: Call Stack
                    - generic [ref=e75]: "14"
                  - button "Show 12 ignore-listed frame(s)" [ref=e76] [cursor=pointer]:
                    - text: Show 12 ignore-listed frame(s)
                    - img [ref=e77]
                - generic [ref=e79]:
                  - generic [ref=e80]: script
                  - text: <anonymous>
                - generic [ref=e81]:
                  - generic [ref=e82]:
                    - text: RootLayout
                    - button "Open RootLayout in editor" [ref=e83] [cursor=pointer]:
                      - img [ref=e84]
                  - text: src\app\layout.tsx (33:9)
          - generic [ref=e86]: "1"
          - generic [ref=e87]: "2"
        - contentinfo [ref=e88]:
          - region "Error feedback" [ref=e89]:
            - paragraph [ref=e90]:
              - link "Was this helpful?" [ref=e91] [cursor=pointer]:
                - /url: https://nextjs.org/telemetry#error-feedback
            - button "Mark as helpful" [ref=e92] [cursor=pointer]:
              - img [ref=e93]
            - button "Mark as not helpful" [ref=e96] [cursor=pointer]:
              - img [ref=e97]
    - generic [ref=e103] [cursor=pointer]:
      - button "Open Next.js Dev Tools" [ref=e104]:
        - img [ref=e105]
      - generic [ref=e108]:
        - button "Open issues overlay" [ref=e109]:
          - generic [ref=e110]:
            - generic [ref=e111]: "1"
            - generic [ref=e112]: "2"
          - generic [ref=e113]:
            - text: Issue
            - generic [ref=e114]: s
        - button "Collapse issues badge" [ref=e115]:
          - img [ref=e116]
  - generic [ref=e119]:
    - img [ref=e120]
    - heading "This page couldn’t load" [level=1] [ref=e122]
    - paragraph [ref=e123]: Reload to try again, or go back.
    - generic [ref=e124]:
      - button "Reload" [ref=e126] [cursor=pointer]
      - button "Back" [ref=e127] [cursor=pointer]
```

# Test source

```ts
  1   | import { test, expect, Page } from "@playwright/test";
  2   | 
  3   | /**
  4   |  * EcoVolt E2E — Critical Conversion Path
  5   |  *
  6   |  * Flow: Landing Page → Scroll to #contato → Fill LeadSubmissionForm → Submit → Verify Success
  7   |  *
  8   |  * NOTE: Framer Motion lazy-hydration requires waitFor({ state: 'visible' }) guards
  9   |  * before any scroll/interaction to prevent "element not attached to DOM" errors.
  10  |  */
  11  | 
  12  | // Wait for the page to fully hydrate (LazyMotion + React 19 concurrent rendering)
  13  | async function waitForHydration(page: Page) {
  14  |   await page.waitForLoadState("networkidle");
  15  |   // Allow Framer Motion initial animations to settle
  16  |   await page.waitForTimeout(800);
  17  | }
  18  | 
  19  | test.describe("Landing Page", () => {
  20  |   test.beforeEach(async ({ page }) => {
  21  |     await page.goto("/");
  22  |     await waitForHydration(page);
  23  |   });
  24  | 
  25  |   test("should render the hero section with the main CTA", async ({ page }) => {
  26  |     // Wait for h1 to be in the DOM and visible (after Framer Motion entry)
  27  |     const heading = page.getByRole("heading", { level: 1 });
  28  |     await expect(heading).toBeVisible({ timeout: 10_000 });
  29  | 
  30  |     // At least one primary CTA should be visible
  31  |     const ctaButton = page
  32  |       .getByRole("link", { name: /começar|solicitar|agendar|demo|acesso/i })
  33  |       .first();
  34  |     await expect(ctaButton).toBeVisible({ timeout: 10_000 });
  35  |   });
  36  | 
  37  |   test("should display the Navbar brand and nav links", async ({ page }) => {
  38  |     // The Navbar is a widget — always rendered server-side, stable
  39  |     const nav = page.getByRole("navigation").first();
  40  |     await expect(nav).toBeVisible();
  41  | 
  42  |     // At least one nav link should be rendered
  43  |     const navLinks = page.getByRole("link", {
  44  |       name: /solução|início|plataforma|benefícios/i,
  45  |     });
> 46  |     await expect(navLinks.first()).toBeVisible();
      |                                    ^ Error: expect(locator).toBeVisible() failed
  47  |   });
  48  | 
  49  |   test("should render the Footer with all primary link groups", async ({ page }) => {
  50  |     // Scroll to end of page
  51  |     await page.keyboard.press("End");
  52  |     await page.waitForTimeout(500);
  53  | 
  54  |     const footer = page.getByRole("contentinfo");
  55  |     await expect(footer).toBeVisible({ timeout: 10_000 });
  56  | 
  57  |     await expect(page.getByText("Produto", { exact: true })).toBeVisible();
  58  |     await expect(page.getByText("Empresa", { exact: true })).toBeVisible();
  59  |     await expect(page.getByText("Recursos", { exact: true })).toBeVisible();
  60  |     await expect(page.getByText("Legal", { exact: true })).toBeVisible();
  61  |   });
  62  | });
  63  | 
  64  | test.describe("Lead Submission Form — Conversion Path", () => {
  65  |   test.beforeEach(async ({ page }) => {
  66  |     await page.goto("/");
  67  |     await waitForHydration(page);
  68  |   });
  69  | 
  70  |   test("should display the contact form in the page", async ({ page }) => {
  71  |     // Scroll gradually to allow lazy-loaded sections to mount
  72  |     for (let i = 0; i < 5; i++) {
  73  |       await page.keyboard.press("PageDown");
  74  |       await page.waitForTimeout(300);
  75  |     }
  76  | 
  77  |     const form = page.locator("form").first();
  78  |     await expect(form).toBeVisible({ timeout: 15_000 });
  79  |   });
  80  | 
  81  |   test("should show validation errors on empty submit", async ({ page }) => {
  82  |     // Navigate directly to the section anchor to trigger lazy load
  83  |     for (let i = 0; i < 5; i++) {
  84  |       await page.keyboard.press("PageDown");
  85  |       await page.waitForTimeout(300);
  86  |     }
  87  | 
  88  |     const form = page.locator("form").first();
  89  |     await expect(form).toBeVisible({ timeout: 15_000 });
  90  | 
  91  |     const submitButton = form
  92  |       .getByRole("button", { name: /enviar|solicitar|agendar|send/i })
  93  |       .first();
  94  |     await expect(submitButton).toBeVisible({ timeout: 5_000 });
  95  |     await submitButton.click();
  96  | 
  97  |     // Expect at least one validation error to appear
  98  |     const errorMessage = page
  99  |       .locator("[role='alert'], p.text-red-500, p[class*='destructive'], span[class*='error']")
  100 |       .first();
  101 |     await expect(errorMessage).toBeVisible({ timeout: 8_000 });
  102 |   });
  103 | 
  104 |   test("should successfully submit a valid lead form", async ({ page }) => {
  105 |     for (let i = 0; i < 5; i++) {
  106 |       await page.keyboard.press("PageDown");
  107 |       await page.waitForTimeout(300);
  108 |     }
  109 | 
  110 |     const form = page.locator("form").first();
  111 |     await expect(form).toBeVisible({ timeout: 15_000 });
  112 | 
  113 |     // Try to fill fields by placeholder or label (resilient approach)
  114 |     const nameField =
  115 |       (await form.getByLabel(/nome/i).count()) > 0
  116 |         ? form.getByLabel(/nome/i)
  117 |         : form.getByPlaceholder(/nome/i);
  118 |     const emailField =
  119 |       (await form.getByLabel(/e-mail|email/i).count()) > 0
  120 |         ? form.getByLabel(/e-mail|email/i)
  121 |         : form.getByPlaceholder(/e-mail|email/i);
  122 | 
  123 |     if (await nameField.isVisible()) await nameField.fill("João Silva");
  124 |     if (await emailField.isVisible()) await emailField.fill("joao@empresa.com.br");
  125 | 
  126 |     const companyField =
  127 |       (await form.getByLabel(/empresa/i).count()) > 0
  128 |         ? form.getByLabel(/empresa/i)
  129 |         : form.getByPlaceholder(/empresa/i);
  130 |     if (await companyField.isVisible()) await companyField.fill("Empresa Ltda");
  131 | 
  132 |     const submitButton = form
  133 |       .getByRole("button", { name: /enviar|solicitar|agendar|send/i })
  134 |       .first();
  135 |     await expect(submitButton).toBeVisible();
  136 |     await submitButton.click();
  137 | 
  138 |     // Look for any success indicator
  139 |     const successIndicator = page
  140 |       .getByText(/enviado|sucesso|obrigado|recebemos|confirmado/i)
  141 |       .first();
  142 |     await expect(successIndicator).toBeVisible({ timeout: 12_000 });
  143 |   });
  144 | });
  145 | 
  146 | test.describe("Sub-pages smoke tests", () => {
```