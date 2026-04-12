import { test, expect, Page } from "@playwright/test";

/**
 * EcoVolt E2E — Critical Conversion Path
 *
 * Flow: Landing Page → Scroll to #contato → Fill LeadSubmissionForm → Submit → Verify Success
 *
 * NOTE: Framer Motion lazy-hydration requires waitFor({ state: 'visible' }) guards
 * before any scroll/interaction to prevent "element not attached to DOM" errors.
 */

// Wait for the page to fully hydrate (LazyMotion + React 19 concurrent rendering)
async function waitForHydration(page: Page) {
  await page.waitForLoadState("networkidle");
  // Allow Framer Motion initial animations to settle
  await page.waitForTimeout(800);
}

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForHydration(page);
  });

  test("should render the hero section with the main CTA", async ({ page }) => {
    // Wait for h1 to be in the DOM and visible (after Framer Motion entry)
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible({ timeout: 10_000 });

    // At least one primary CTA should be visible
    const ctaButton = page
      .getByRole("link", { name: /começar|solicitar|agendar|demo|acesso/i })
      .first();
    await expect(ctaButton).toBeVisible({ timeout: 10_000 });
  });

  test("should display the Navbar brand and nav links", async ({ page }) => {
    // The Navbar is a widget — always rendered server-side, stable
    const nav = page.getByRole("navigation").first();
    await expect(nav).toBeVisible();

    // At least one nav link should be rendered
    const navLinks = page.getByRole("link", {
      name: /solução|início|plataforma|benefícios/i,
    });
    await expect(navLinks.first()).toBeVisible();
  });

  test("should render the Footer with all primary link groups", async ({ page }) => {
    // Scroll to end of page
    await page.keyboard.press("End");
    await page.waitForTimeout(500);

    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible({ timeout: 10_000 });

    await expect(page.getByText("Produto", { exact: true })).toBeVisible();
    await expect(page.getByText("Empresa", { exact: true })).toBeVisible();
    await expect(page.getByText("Recursos", { exact: true })).toBeVisible();
    await expect(page.getByText("Legal", { exact: true })).toBeVisible();
  });
});

test.describe("Lead Submission Form — Conversion Path", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForHydration(page);
  });

  test("should display the contact form in the page", async ({ page }) => {
    // Scroll gradually to allow lazy-loaded sections to mount
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("PageDown");
      await page.waitForTimeout(300);
    }

    const form = page.locator("form").first();
    await expect(form).toBeVisible({ timeout: 15_000 });
  });

  test("should show validation errors on empty submit", async ({ page }) => {
    // Navigate directly to the section anchor to trigger lazy load
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("PageDown");
      await page.waitForTimeout(300);
    }

    const form = page.locator("form").first();
    await expect(form).toBeVisible({ timeout: 15_000 });

    const submitButton = form
      .getByRole("button", { name: /enviar|solicitar|agendar|send/i })
      .first();
    await expect(submitButton).toBeVisible({ timeout: 5_000 });
    await submitButton.click();

    // Expect at least one validation error to appear
    const errorMessage = page
      .locator("[role='alert'], p.text-red-500, p[class*='destructive'], span[class*='error']")
      .first();
    await expect(errorMessage).toBeVisible({ timeout: 8_000 });
  });

  test("should successfully submit a valid lead form", async ({ page }) => {
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("PageDown");
      await page.waitForTimeout(300);
    }

    const form = page.locator("form").first();
    await expect(form).toBeVisible({ timeout: 15_000 });

    // Try to fill fields by placeholder or label (resilient approach)
    const nameField =
      (await form.getByLabel(/nome/i).count()) > 0
        ? form.getByLabel(/nome/i)
        : form.getByPlaceholder(/nome/i);
    const emailField =
      (await form.getByLabel(/e-mail|email/i).count()) > 0
        ? form.getByLabel(/e-mail|email/i)
        : form.getByPlaceholder(/e-mail|email/i);

    if (await nameField.isVisible()) await nameField.fill("João Silva");
    if (await emailField.isVisible()) await emailField.fill("joao@empresa.com.br");

    const companyField =
      (await form.getByLabel(/empresa/i).count()) > 0
        ? form.getByLabel(/empresa/i)
        : form.getByPlaceholder(/empresa/i);
    if (await companyField.isVisible()) await companyField.fill("Empresa Ltda");

    const submitButton = form
      .getByRole("button", { name: /enviar|solicitar|agendar|send/i })
      .first();
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // Look for any success indicator
    const successIndicator = page
      .getByText(/enviado|sucesso|obrigado|recebemos|confirmado/i)
      .first();
    await expect(successIndicator).toBeVisible({ timeout: 12_000 });
  });
});

test.describe("Sub-pages smoke tests", () => {
  const subPages = [
    { name: "platform", url: "/product/platform" },
    { name: "privacy",  url: "/legal/privacy"    },
    { name: "docs",     url: "/resources/docs"   },
  ] as const;

  for (const { name, url } of subPages) {
    test(`should render ${name} page without errors`, async ({ page }) => {
      const response = await page.goto(url);

      // Must not be a 404 or 500
      expect(response?.status()).toBeLessThan(400);

      // Main content area must be present
      const main = page.getByRole("main");
      await expect(main).toBeVisible({ timeout: 8_000 });
    });
  }
});
