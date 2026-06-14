import { test, expect } from "@playwright/test";

test.describe("Fluxos de Conversão e Leads", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to landing page home
    await page.goto("/");
  });

  test("Deve exibir a página inicial e carregar os principais elementos acima da dobra", async ({ page }) => {
    // Check if main title exists
    const title = page.locator("h1");
    await expect(title).toContainText("Energia para a");
    await expect(title).toContainText("próxima escala.");

    // Check if CTA button exists
    const ctaBtn = page.locator("button:has-text('Agendar Trial')");
    await expect(ctaBtn).toBeVisible();
  });

  test("Deve preencher e enviar o formulário de contato na home com sucesso", async ({ page }) => {
    // Scroll to contact section
    const contactSection = page.locator("#contato");
    await contactSection.scrollIntoViewIfNeeded();

    // Fill form fields
    await page.fill("input[name='name']", "Cliente de Teste");
    await page.fill("input[name='email']", "teste@empresa.com");
    await page.fill("input[name='company']", "EcoVolt E2E Tests Inc");
    await page.selectOption("select[name='scale']", "medium");
    await page.fill("textarea[name='message']", "Gostaria de solicitar uma análise de viabilidade energética.");

    // Click submit
    const submitBtn = page.locator("button:has-text('Solicitar Análise Técnica')");
    await submitBtn.click();

    // Verify submission loading and then success
    const successMsg = page.locator("h3:has-text('Solicitação Enviada!')");
    await expect(successMsg).toBeVisible({ timeout: 10000 });

    const successDesc = page.locator("p:has-text('Nossa equipe técnica entrará em contato em breve.')");
    await expect(successDesc).toBeVisible();
  });

  test("Deve mostrar mensagens de validação ao submeter formulário da home vazio", async ({ page }) => {
    // Scroll to contact section
    const contactSection = page.locator("#contato");
    await contactSection.scrollIntoViewIfNeeded();

    // Submit directly
    const submitBtn = page.locator("button:has-text('Solicitar Análise Técnica')");
    await submitBtn.click();

    // Assert validation errors are shown (Zod)
    await expect(page.locator("text=O nome deve ter pelo menos 3 caracteres")).toBeVisible();
    await expect(page.locator("text=Endereço de e-mail corporativo inválido")).toBeVisible();
    await expect(page.locator("text=Informe o nome da sua empresa")).toBeVisible();
  });

  test("Deve preencher e enviar o formulário na página de solicitação dedicada", async ({ page }) => {
    // Navigate directly to requested page
    await page.goto("/solicitar-demonstracao");

    // Check if the form elements exist
    await expect(page.locator("h1")).toContainText("Conheça a");
    await expect(page.locator("h3:has-text('Fale com um Especialista')")).toBeVisible();

    // Fill the LeadSubmissionForm fields
    await page.fill("#name", "Maria E2E Silva");
    await page.fill("#company", "Global Events Corp");
    await page.fill("#email", "m.silva@globalevents.com");
    await page.fill("#phone", "(11) 98765-4321");
    await page.fill("#role", "Diretora de Operações");
    await page.selectOption("#segment", "festivais");
    await page.fill("#message", "Precisamos de energia limpa para um festival de 3 dias.");

    // Click submit
    const submitBtn = page.locator("button[type='submit']");
    await submitBtn.click();

    // Verify success state
    const successHeader = page.locator("h3:has-text('Solicitação Enviada!')");
    await expect(successHeader).toBeVisible({ timeout: 10000 });

    const successParagraph = page.locator("p:has-text('Obrigado! Um especialista da EcoVolt entrará em contato em breve.')");
    await expect(successParagraph).toBeVisible();

    // Verify it allows sending another request
    const resetBtn = page.locator("button:has-text('Enviar Outra Solicitação')");
    await expect(resetBtn).toBeVisible();
    await resetBtn.click();

    // Verify the form is blank again
    await expect(page.locator("#name")).toHaveValue("");
  });
});
