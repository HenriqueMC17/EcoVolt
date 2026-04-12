import { test, expect } from "@playwright/test";

/**
 * EcoVolt E2E — Critical Conversion Path
 *
 * Selectors derived directly from source code analysis:
 * - Hero H1: role=heading level=1 (text: "Energia para a próxima escala.")
 * - Hero CTAs: role=button name="Agendar Trial" | "Documentação" (are <button>, not <a>)
 * - Nav: <nav> with <a> links from NAV_LINKS constant
 * - Form submit: role=button name="Solicitar Contato"
 * - Success state: <h3> text "Solicitação Enviada!"
 * - Footer: <footer> with groups "Produto", "Empresa", "Recursos", "Legal"
 *
 * Framer Motion mitigation: waitForLoadState('networkidle') + 1000ms settle
 */

const HYDRATION_WAIT = 1200;

test.describe("Landing Page — Hero & Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(HYDRATION_WAIT);
  });

  test("should render the H1 heading", async ({ page }) => {
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible({ timeout: 10_000 });
    // Verify it contains the expected text (partial match, resilient to line breaks)
    const text = await h1.innerText();
    expect(text).toMatch(/energia|próxima|escala/i);
  });

  test("should render hero CTA buttons — Agendar Trial and Documentação", async ({ page }) => {
    const primaryCTA = page.getByRole("button", { name: /agendar trial/i });
    await expect(primaryCTA).toBeVisible({ timeout: 10_000 });

    const secondaryCTA = page.getByRole("button", { name: /documentação/i });
    await expect(secondaryCTA).toBeVisible({ timeout: 10_000 });
  });

  test("should render Navbar with navigation links", async ({ page }) => {
    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();

    // NAV_LINKS from constants.tsx
    for (const label of ["Solução", "Como Funciona", "Plataforma", "Benefícios", "Contato"]) {
      await expect(page.getByRole("link", { name: label, exact: true }).first()).toBeVisible();
    }
  });

  test("should render Footer with all section groups", async ({ page }) => {
    // Scroll to bottom
    await page.keyboard.press("End");
    await page.waitForTimeout(600);

    const footer = page.locator("footer");
    await expect(footer).toBeVisible({ timeout: 10_000 });

    for (const group of ["Produto", "Empresa", "Recursos", "Legal"]) {
      await expect(footer.getByText(group, { exact: true })).toBeVisible();
    }
  });
});

test.describe("Lead Submission Form — Conversion Path", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(HYDRATION_WAIT);

    // Scroll incrementally to trigger lazy-loaded sections
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("PageDown");
      await page.waitForTimeout(250);
    }
  });

  test("should display the lead submission form", async ({ page }) => {
    const form = page.locator("form").first();
    await expect(form).toBeVisible({ timeout: 15_000 });

    // Verify key form fields are present (by label text from LeadSubmissionForm.tsx)
    await expect(page.getByLabel("Nome Completo")).toBeVisible({ timeout: 8_000 });
    await expect(page.getByLabel("Email Corporativo")).toBeVisible();
    await expect(page.getByLabel("Empresa")).toBeVisible();
  });

  test("should show validation errors on empty submit", async ({ page }) => {
    const form = page.locator("form").first();
    await expect(form).toBeVisible({ timeout: 15_000 });

    // Submit button text from source: "Solicitar Contato"
    const submitBtn = page.getByRole("button", { name: /solicitar contato/i });
    await expect(submitBtn).toBeVisible({ timeout: 8_000 });
    await submitBtn.click();

    // react-hook-form renders errors as text next to inputs
    // Zod schema requires: name, company, email, phone, role, segment
    const firstError = page.locator("p.text-red-500, span.text-red-500, p[class*='error'], [data-error]").first();
    await expect(firstError).toBeVisible({ timeout: 8_000 });
  });

  test("should fill and submit the lead form successfully", async ({ page }) => {
    const form = page.locator("form").first();
    await expect(form).toBeVisible({ timeout: 15_000 });

    // Fill required fields (labels from LeadSubmissionForm.tsx)
    await page.getByLabel("Nome Completo").fill("João Silva");
    await page.getByLabel("Empresa").fill("TechCorp Ltda");
    await page.getByLabel("Email Corporativo").fill("joao.silva@techcorp.com.br");
    await page.getByLabel("Telefone / WhatsApp").fill("(11) 99999-8888");
    await page.getByLabel("Seu Cargo").fill("CTO");
    await page.getByLabel("Segmento de Atuação").selectOption("corporativo");

    const submitBtn = page.getByRole("button", { name: /solicitar contato/i });
    await submitBtn.click();

    // Success state from LeadSubmissionForm.tsx: <h3>Solicitação Enviada!</h3>
    const successHeading = page.getByRole("heading", { name: /solicitação enviada/i });
    await expect(successHeading).toBeVisible({ timeout: 15_000 });
  });
});

test.describe("Sub-pages — Smoke Tests", () => {
  const pages = [
    { title: "platform", url: "/product/platform" },
    { title: "privacy",  url: "/legal/privacy"    },
    { title: "docs",     url: "/resources/docs"   },
  ] as const;

  for (const { title, url } of pages) {
    test(`${title} page should load without 4xx/5xx errors`, async ({ page }) => {
      const response = await page.goto(url, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBeLessThan(400);

      const main = page.getByRole("main");
      await expect(main).toBeVisible({ timeout: 8_000 });
    });
  }
});
