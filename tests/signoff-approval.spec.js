const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");

const ARTIFACT_DIR = path.join(__dirname, "..", "artifacts", "signoff-approved");
const STORAGE_KEY = "lubit-signoff-state-v1";

async function screenshot(page, name) {
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, `${name}.png`),
    fullPage: true,
  });
}

async function setField(page, selector, value, scope = null) {
  const root = scope || page;
  const field = root.locator(selector).first();
  await field.fill(value);
  await field.dispatchEvent("change");
}

test.beforeEach(async ({ page }) => {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  await page.goto("/");
  await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
  await page.reload();
});

test("aprova todos os cenários e gera pacote de evidências", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Jornada" })).toBeVisible();
  await expect(page.locator(".journey-card")).toHaveCount(3);

  await page.getByRole("button", { name: "Kanban" }).click();
  const totalScenarios = await page.locator(".kanban-card").count();
  expect(totalScenarios).toBe(32);

  for (let index = 0; index < totalScenarios; index += 1) {
    await page.getByRole("button", { name: "Kanban" }).click();
    const nextCard = page.locator(".kanban-column.todo .kanban-card").first();
    await expect(nextCard).toBeVisible();
    await nextCard.click();

    const journeyDetail = page.locator("#journeyDetail");
    await setField(page, '[data-field="owner"]', "QA Sign-off", journeyDetail);
    await setField(page, '[data-field="date"]', "2026-05-14", journeyDetail);
    await setField(
      page,
      '[data-field="evidence"]',
      `Evidência automatizada Playwright ${String(index + 1).padStart(2, "0")}`,
      journeyDetail
    );
    await journeyDetail.locator('[data-field="status"]').selectOption("Aprovado");
  }

  await expect(page.locator(".metric-card").filter({ hasText: "Progresso" })).toContainText("100%");
  await screenshot(page, "01-jornada-aprovada");

  await page.getByRole("button", { name: "Kanban" }).click();
  await expect(page.locator(".kanban-column.done .kanban-card")).toHaveCount(32);
  await expect(page.locator(".kanban-column.issue .kanban-card")).toHaveCount(0);
  await screenshot(page, "02-kanban-aprovado");

  await page.getByRole("button", { name: "Pendências" }).click();
  await expect(page.locator("#issuesList")).toContainText("Nenhuma pendência registrada");
  await screenshot(page, "03-pendencias-sem-itens");

  await page.locator('[data-tab="report"]').click();
  await page.getByRole("button", { name: "Adicionar assinatura" }).click();
  const reportPanel = page.locator("#reportPanel");
  await setField(page, '[data-field="area"]', "Validação Interna", reportPanel);
  await setField(page, '[data-field="name"]', "QA Sign-off", reportPanel);
  await setField(page, '[data-field="role"]', "Responsável pela validação", reportPanel);
  await setField(page, '[data-field="date"]', "2026-05-14", reportPanel);
  await setField(page, '[data-field="notes"]', "Aprovação automatizada para teste da ferramenta.", reportPanel);
  await screenshot(page, "04-relatorio-assinatura");

  const exportedState = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  const scenarioValues = Object.values(exportedState.scenarios);
  expect(scenarioValues).toHaveLength(32);
  expect(scenarioValues.every((scenario) => scenario.status === "Aprovado")).toBe(true);
  expect(exportedState.signatures).toHaveLength(1);

  fs.writeFileSync(
    path.join(ARTIFACT_DIR, "signoff-approved-state.json"),
    JSON.stringify(exportedState, null, 2),
    "utf8"
  );
});
