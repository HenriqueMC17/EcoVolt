# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: conversion.spec.ts >> Landing Page >> should display the Navbar and navigate to #solucao section
- Location: e2e\conversion.spec.ts:22:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: 'Solução' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('link', { name: 'Solução' })

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
                  - generic [ref=e66]: "9 | }: React.ComponentProps<typeof NextThemesProvider>) {"
                  - generic [ref=e67]: "> 10 | return <NextThemesProvider {...props}>{children}</NextThemesProvider>;"
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
  6   |  * Flow: Landing Page → Scroll to #contato → Fill LeadSubmissionForm → Submit → Verify Success State
  7   |  */
  8   | 
  9   | test.describe("Landing Page", () => {
  10  |   test("should render the hero section with the main CTA", async ({ page }) => {
  11  |     await page.goto("/");
  12  | 
  13  |     // Confirm the hero headline is visible
  14  |     const heading = page.getByRole("heading", { level: 1 });
  15  |     await expect(heading).toBeVisible();
  16  | 
  17  |     // Confirm at least one CTA button is present
  18  |     const ctaButton = page.getByRole("link", { name: /começar|solicitar|agendar/i }).first();
  19  |     await expect(ctaButton).toBeVisible();
  20  |   });
  21  | 
  22  |   test("should display the Navbar and navigate to #solucao section", async ({ page }) => {
  23  |     await page.goto("/");
  24  | 
  25  |     const navLink = page.getByRole("link", { name: "Solução" });
> 26  |     await expect(navLink).toBeVisible();
      |                           ^ Error: expect(locator).toBeVisible() failed
  27  | 
  28  |     await navLink.click();
  29  |     await expect(page).toHaveURL(/#solucao/);
  30  |   });
  31  | 
  32  |   test("should render the Footer with all primary link groups", async ({ page }) => {
  33  |     await page.goto("/");
  34  | 
  35  |     // Scroll to footer
  36  |     await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  37  | 
  38  |     await expect(page.getByText("Produto")).toBeVisible();
  39  |     await expect(page.getByText("Empresa")).toBeVisible();
  40  |     await expect(page.getByText("Recursos")).toBeVisible();
  41  |     await expect(page.getByText("Legal")).toBeVisible();
  42  |   });
  43  | });
  44  | 
  45  | test.describe("Lead Submission Form — Conversion Path", () => {
  46  |   test("should display the contact form in the #contato section", async ({ page }) => {
  47  |     await page.goto("/");
  48  | 
  49  |     const form = page.locator("form").first();
  50  |     await form.scrollIntoViewIfNeeded();
  51  |     await expect(form).toBeVisible();
  52  |   });
  53  | 
  54  |   test("should show validation errors on empty submit", async ({ page }) => {
  55  |     await page.goto("/");
  56  | 
  57  |     // Scroll to form and try to submit empty
  58  |     const form = page.locator("form").first();
  59  |     await form.scrollIntoViewIfNeeded();
  60  | 
  61  |     const submitButton = form.getByRole("button", { name: /enviar|solicitar|agendar/i });
  62  |     await submitButton.click();
  63  | 
  64  |     // At least one validation error message should appear
  65  |     const errorMessage = page.locator("[role='alert'], .text-red-500, .text-destructive").first();
  66  |     await expect(errorMessage).toBeVisible({ timeout: 5_000 });
  67  |   });
  68  | 
  69  |   test("should successfully submit a valid lead form", async ({ page }) => {
  70  |     await page.goto("/");
  71  | 
  72  |     const form = page.locator("form").first();
  73  |     await form.scrollIntoViewIfNeeded();
  74  | 
  75  |     // Fill in required fields (adjust selectors to match actual form fields)
  76  |     const nameInput = form.getByLabel(/nome/i);
  77  |     const emailInput = form.getByLabel(/e-mail/i);
  78  |     const companyInput = form.getByLabel(/empresa/i);
  79  | 
  80  |     if (await nameInput.isVisible()) await nameInput.fill("João Silva");
  81  |     if (await emailInput.isVisible()) await emailInput.fill("joao@empresa.com.br");
  82  |     if (await companyInput.isVisible()) await companyInput.fill("Empresa Ltda");
  83  | 
  84  |     const submitButton = form.getByRole("button", { name: /enviar|solicitar|agendar/i });
  85  |     await submitButton.click();
  86  | 
  87  |     // Verify success state (toast, message, or page change)
  88  |     const successIndicator = page.getByText(/enviado|sucesso|obrigado|recebemos/i).first();
  89  |     await expect(successIndicator).toBeVisible({ timeout: 10_000 });
  90  |   });
  91  | });
  92  | 
  93  | test.describe("Sub-pages", () => {
  94  |   test("should render /product/platform without errors", async ({ page }) => {
  95  |     await page.goto("/product/platform");
  96  |     await expect(page).not.toHaveURL(/error|404/i);
  97  |     await expect(page.getByRole("main")).toBeVisible();
  98  |   });
  99  | 
  100 |   test("should render /legal/privacy without errors", async ({ page }) => {
  101 |     await page.goto("/legal/privacy");
  102 |     await expect(page).not.toHaveURL(/error|404/i);
  103 |     await expect(page.getByRole("main")).toBeVisible();
  104 |   });
  105 | 
  106 |   test("should render /resources/docs without errors", async ({ page }) => {
  107 |     await page.goto("/resources/docs");
  108 |     await expect(page).not.toHaveURL(/error|404/i);
  109 |     await expect(page.getByRole("main")).toBeVisible();
  110 |   });
  111 | });
  112 | 
```