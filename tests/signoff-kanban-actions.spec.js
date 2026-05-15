const { test, expect } = require("@playwright/test");

const STORAGE_KEY = "lubit-signoff-state-v1";

async function openActions(page) {
  await page.locator("#actionMenuBtn").click();
  await expect(page.locator("#actionMenu")).toBeVisible();
}

async function dragScenarioTo(page, scenarioId, columnClass, status) {
  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
  await page.dispatchEvent(`[data-drag-scenario="${scenarioId}"]`, "dragstart", { dataTransfer });
  await page.dispatchEvent(`.journey-kanban .kanban-column.${columnClass}[data-drop-status="${status}"]`, "dragover", {
    dataTransfer,
  });
  await page.dispatchEvent(`.journey-kanban .kanban-column.${columnClass}[data-drop-status="${status}"]`, "drop", {
    dataTransfer,
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
  await page.reload();
  await page.locator('[data-view-mode="kanban"]').click();
});

test("menu de acoes concentra exportacoes globais", async ({ page }) => {
  await openActions(page);
  const menu = page.locator("#actionMenu");
  await expect(menu).toContainText("Importar JSON");
  await expect(menu).toContainText("Exportar JSON");
  await expect(menu).toContainText("Relatório HTML");
  await expect(menu).toContainText("Markdown");
  await expect(menu).toContainText("Aplicar N/A opcionais");
  await expect(menu).toContainText("Limpar preenchimento");

  const downloadPromise = page.waitForEvent("download");
  await page.locator("#exportBtn").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/signoff-lubit-.*\.json/);
  await expect(menu).toBeHidden();
});

test("move cenario por drag-and-drop atualizando status e persistencia", async ({ page }) => {
  const firstCard = page.locator(".journey-kanban .kanban-column.todo .kanban-card").first();
  await expect(firstCard).toBeVisible();
  const scenarioId = await firstCard.getAttribute("data-drag-scenario");

  await dragScenarioTo(page, scenarioId, "testing", "Em teste");
  await expect(page.locator(`.journey-kanban .kanban-column.testing [data-drag-scenario="${scenarioId}"]`)).toBeVisible();

  await dragScenarioTo(page, scenarioId, "done", "Aprovado");
  await expect(page.locator(`.journey-kanban .kanban-column.done [data-drag-scenario="${scenarioId}"]`)).toBeVisible();

  await dragScenarioTo(page, scenarioId, "issue", "Reprovado");
  await expect(page.locator(`.journey-kanban .kanban-column.issue [data-drag-scenario="${scenarioId}"]`)).toBeVisible();

  await dragScenarioTo(page, scenarioId, "na", "N/A");
  await expect(page.locator(`.journey-kanban .kanban-column.na [data-drag-scenario="${scenarioId}"]`)).toBeVisible();

  let savedStatus = await page.evaluate(
    ({ key, id }) => JSON.parse(localStorage.getItem(key)).scenarios[id].status,
    { key: STORAGE_KEY, id: scenarioId }
  );
  expect(savedStatus).toBe("N/A");

  await page.reload();
  await page.locator('[data-view-mode="kanban"]').click();
  await expect(page.locator(`.journey-kanban .kanban-column.na [data-drag-scenario="${scenarioId}"]`)).toBeVisible();

  savedStatus = await page.evaluate(
    ({ key, id }) => JSON.parse(localStorage.getItem(key)).scenarios[id].status,
    { key: STORAGE_KEY, id: scenarioId }
  );
  expect(savedStatus).toBe("N/A");
});
