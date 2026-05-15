const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");

const ARTIFACT_DIR = path.join(__dirname, "..", "artifacts", "signoff-approved");
const STORAGE_KEY = "lubit-signoff-state-v1";
const GROUPS = [
  { id: "dados", count: 10 },
  { id: "operacao", count: 11 },
  { id: "apoio", count: 11 },
];

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

test("aprova todos os cenarios e gera pacote de evidencias", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Jornada" })).toBeVisible();
  await expect(page.locator('[data-tab="kanban"]')).toHaveCount(0);
  await expect(page.locator(".journey-card")).toHaveCount(3);
  await expect(page.locator(".journey-line")).toHaveCount(10);
  await screenshot(page, "01-jornada-linhas");

  await page.locator('[data-view-mode="kanban"]').click();
  await expect(page.locator(".journey-kanban .kanban-card")).toHaveCount(10);
  await screenshot(page, "02-jornada-kanban");

  let approvedIndex = 0;
  for (const group of GROUPS) {
    await page.locator(`[data-select-group="${group.id}"]`).click();
    await page.locator('[data-view-mode="lines"]').click();
    await expect(page.locator(".journey-line")).toHaveCount(group.count);

    for (let index = 0; index < group.count; index += 1) {
      approvedIndex += 1;
      await page.locator(".journey-line").nth(index).click();

      const drawer = page.locator("#scenarioDrawer");
      const journeyDetail = page.locator("#journeyDetail");
      await expect(drawer).toHaveClass(/open/);

      await setField(page, '[data-field="owner"]', "QA Sign-off", journeyDetail);
      await setField(page, '[data-field="date"]', "2026-05-14", journeyDetail);
      await setField(
        page,
        '[data-field="evidence"]',
        `Evidencia automatizada Playwright ${String(approvedIndex).padStart(2, "0")}`,
        journeyDetail
      );
      await journeyDetail.locator('[data-set-status="Aprovado"]').click();

      if (approvedIndex === 1) {
        await screenshot(page, "03-sidebar-aprovacao");
      }

      await journeyDetail.locator('[data-action="close-drawer"]').click();
      await expect(drawer).not.toHaveClass(/open/);
    }
  }

  await expect(page.locator(".metric-card").filter({ hasText: "Progresso" })).toContainText("100%");
  await screenshot(page, "04-jornada-aprovada");

  await page.locator('[data-view-mode="kanban"]').click();
  await expect(page.locator(".journey-kanban .kanban-column.done .kanban-card")).toHaveCount(11);
  await expect(page.locator(".journey-kanban .kanban-column.issue .kanban-card")).toHaveCount(0);
  await screenshot(page, "05-jornada-kanban-aprovado");

  await page.getByRole("button", { name: "Pendências" }).click();
  await expect(page.locator("#issuesList")).toContainText("Nenhuma pendência registrada");
  await screenshot(page, "06-pendencias-sem-itens");

  await page.locator('[data-tab="report"]').click();
  await page.getByRole("button", { name: "Adicionar assinatura" }).click();
  const reportPanel = page.locator("#reportPanel");
  await setField(page, '[data-field="area"]', "Validação Interna", reportPanel);
  await setField(page, '[data-field="name"]', "QA Sign-off", reportPanel);
  await setField(page, '[data-field="role"]', "Responsável pela validação", reportPanel);
  await setField(page, '[data-field="date"]', "2026-05-14", reportPanel);
  await setField(page, '[data-field="notes"]', "Aprovação automatizada para teste da ferramenta.", reportPanel);
  await screenshot(page, "07-relatorio-assinatura");

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
