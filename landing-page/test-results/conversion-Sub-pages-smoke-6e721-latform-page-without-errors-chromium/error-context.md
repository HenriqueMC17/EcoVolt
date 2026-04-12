# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: conversion.spec.ts >> Sub-pages smoke tests >> should render platform page without errors
- Location: e2e\conversion.spec.ts:154:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('main')
Expected: visible
Timeout: 8000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 8000ms
  - waiting for getByRole('main')

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
  147 |   const subPages = [
  148 |     { name: "platform", url: "/product/platform" },
  149 |     { name: "privacy",  url: "/legal/privacy"    },
  150 |     { name: "docs",     url: "/resources/docs"   },
  151 |   ] as const;
  152 | 
  153 |   for (const { name, url } of subPages) {
  154 |     test(`should render ${name} page without errors`, async ({ page }) => {
  155 |       const response = await page.goto(url);
  156 | 
  157 |       // Must not be a 404 or 500
  158 |       expect(response?.status()).toBeLessThan(400);
  159 | 
  160 |       // Main content area must be present
  161 |       const main = page.getByRole("main");
> 162 |       await expect(main).toBeVisible({ timeout: 8_000 });
      |                          ^ Error: expect(locator).toBeVisible() failed
  163 |     });
  164 |   }
  165 | });
  166 | 
```