import { test, expect } from "@playwright/test";

/**
 * EcoVolt E2E — Critical Conversion Path
 *
 * Flow: Landing Page → Scroll to #contato → Fill LeadSubmissionForm → Submit → Verify Success State
 */

test.describe("Landing Page", () => {
  test("should render the hero section with the main CTA", async ({ page }) => {
    await page.goto("/");

    // Confirm the hero headline is visible
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();

    // Confirm at least one CTA button is present
    const ctaButton = page.getByRole("link", { name: /começar|solicitar|agendar/i }).first();
    await expect(ctaButton).toBeVisible();
  });

  test("should display the Navbar and navigate to #solucao section", async ({ page }) => {
    await page.goto("/");

    const navLink = page.getByRole("link", { name: "Solução" });
    await expect(navLink).toBeVisible();

    await navLink.click();
    await expect(page).toHaveURL(/#solucao/);
  });

  test("should render the Footer with all primary link groups", async ({ page }) => {
    await page.goto("/");

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await expect(page.getByText("Produto")).toBeVisible();
    await expect(page.getByText("Empresa")).toBeVisible();
    await expect(page.getByText("Recursos")).toBeVisible();
    await expect(page.getByText("Legal")).toBeVisible();
  });
});

test.describe("Lead Submission Form — Conversion Path", () => {
  test("should display the contact form in the #contato section", async ({ page }) => {
    await page.goto("/");

    const form = page.locator("form").first();
    await form.scrollIntoViewIfNeeded();
    await expect(form).toBeVisible();
  });

  test("should show validation errors on empty submit", async ({ page }) => {
    await page.goto("/");

    // Scroll to form and try to submit empty
    const form = page.locator("form").first();
    await form.scrollIntoViewIfNeeded();

    const submitButton = form.getByRole("button", { name: /enviar|solicitar|agendar/i });
    await submitButton.click();

    // At least one validation error message should appear
    const errorMessage = page.locator("[role='alert'], .text-red-500, .text-destructive").first();
    await expect(errorMessage).toBeVisible({ timeout: 5_000 });
  });

  test("should successfully submit a valid lead form", async ({ page }) => {
    await page.goto("/");

    const form = page.locator("form").first();
    await form.scrollIntoViewIfNeeded();

    // Fill in required fields (adjust selectors to match actual form fields)
    const nameInput = form.getByLabel(/nome/i);
    const emailInput = form.getByLabel(/e-mail/i);
    const companyInput = form.getByLabel(/empresa/i);

    if (await nameInput.isVisible()) await nameInput.fill("João Silva");
    if (await emailInput.isVisible()) await emailInput.fill("joao@empresa.com.br");
    if (await companyInput.isVisible()) await companyInput.fill("Empresa Ltda");

    const submitButton = form.getByRole("button", { name: /enviar|solicitar|agendar/i });
    await submitButton.click();

    // Verify success state (toast, message, or page change)
    const successIndicator = page.getByText(/enviado|sucesso|obrigado|recebemos/i).first();
    await expect(successIndicator).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Sub-pages", () => {
  test("should render /product/platform without errors", async ({ page }) => {
    await page.goto("/product/platform");
    await expect(page).not.toHaveURL(/error|404/i);
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("should render /legal/privacy without errors", async ({ page }) => {
    await page.goto("/legal/privacy");
    await expect(page).not.toHaveURL(/error|404/i);
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("should render /resources/docs without errors", async ({ page }) => {
    await page.goto("/resources/docs");
    await expect(page).not.toHaveURL(/error|404/i);
    await expect(page.getByRole("main")).toBeVisible();
  });
});
