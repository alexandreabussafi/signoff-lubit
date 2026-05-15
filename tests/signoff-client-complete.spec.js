const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");

const STORAGE_KEY = "lubit-signoff-state-v1";
const ARTIFACT_DIR = path.join(__dirname, "..", "artifacts", "client-signoff-complete");
const DOCS_DIR = path.join(__dirname, "..", "docs");
const OPTIONAL_NA_IDS = [
  "upload-xml",
  "configurar-alarmes",
  "mapas-validacao",
  "sap-integrar-os",
  "sap-reintegracao",
];
const GROUPS = [
  { id: "dados", count: 10 },
  { id: "operacao", count: 11 },
  { id: "apoio", count: 11 },
];
const TEMP_REJECTED_ID = "retorno-reprogramado-cancelado";
const TEMP_BLOCKED_ID = "historico-importacao-validacao";

function ensureArtifactDir() {
  fs.rmSync(ARTIFACT_DIR, { recursive: true, force: true });
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function screenshot(page, name) {
  const fileName = `${name}.png`;
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, fileName),
    fullPage: true,
  });
  return fileName;
}

async function setField(page, selector, value, scope = null) {
  const root = scope || page;
  const field = root.locator(selector).first();
  await field.fill(value);
  await field.dispatchEvent("change");
}

async function openScenario(page, scenarioId) {
  await page.locator('[data-tab="journey"]').click();
  await expect(page.locator("#journeyPanel")).toHaveClass(/active/);

  for (const group of GROUPS) {
    await page.locator(`[data-select-group="${group.id}"]`).click();
    await page.locator('[data-view-mode="lines"]').click();
    const scenario = page.locator(`#journeyLines [data-select-scenario="${scenarioId}"]`).first();
    if (await scenario.count()) {
      await scenario.click();
      await expect(page.locator("#scenarioDrawer")).toHaveClass(/open/);
      return page.locator("#journeyDetail");
    }
  }
  throw new Error(`Scenario not found: ${scenarioId}`);
}

async function closeDrawer(page) {
  const drawer = page.locator("#scenarioDrawer");
  if (!(await drawer.evaluate((node) => node.classList.contains("open")))) return;
  await page.locator("#journeyDetail").locator('[data-action="close-drawer"]').click();
  await expect(drawer).not.toHaveClass(/open/);
}

async function fillScenario(page, scenarioId, status, index, options = {}) {
  const detail = await openScenario(page, scenarioId);
  await setField(page, '[data-field="owner"]', options.owner || "Cliente Key User", detail);
  await setField(page, '[data-field="date"]', "2026-05-14", detail);
  await setField(page, '[data-field="environment"]', "Homologação / Produção assistida", detail);
  await setField(
    page,
    '[data-field="evidence"]',
    options.evidence || `Evidência cliente ${String(index).padStart(2, "0")} - print e validação assistida.`,
    detail
  );

  if (options.severity) {
    await detail.locator('[data-field="severity"]').selectOption(options.severity);
  }
  if (options.issues !== undefined) {
    await setField(page, '[data-field="issues"]', options.issues, detail);
  }
  if (options.notes !== undefined) {
    await setField(page, '[data-field="notes"]', options.notes, detail);
  }

  await detail.locator(`[data-set-status="${status}"]`).click();
  await closeDrawer(page);
}

async function downloadByClick(page, selector, targetName) {
  const downloadPromise = page.waitForEvent("download");
  await page.locator(selector).click();
  const download = await downloadPromise;
  const target = path.join(ARTIFACT_DIR, targetName);
  await download.saveAs(target);
  return target;
}

function imageData(fileName) {
  const filePath = path.join(ARTIFACT_DIR, fileName);
  return `data:image/png;base64,${fs.readFileSync(filePath).toString("base64")}`;
}

function generateManual(screenshots) {
  const mdPath = path.join(DOCS_DIR, "manual-signoff-cliente.md");
  const htmlPath = path.join(DOCS_DIR, "manual-signoff-cliente.html");
  const relative = (fileName) => `../artifacts/client-signoff-complete/${fileName}`;

  const md = `# Manual de Uso - Sign-off Cliente Lubit

Este manual foi gerado a partir de uma simulação completa de aceite de cliente executada com Playwright.

## 1. Preencher o projeto

Informe nome do projeto, cliente/unidade e ambiente testado.

![Projeto preenchido](${relative(screenshots.project)})

## 2. Usar a Jornada em linhas

Selecione o bloco de processo e use a visão **Linhas** para execução rápida.

![Jornada em linhas](${relative(screenshots.lines)})

## 3. Alternar para Kanban

Use a visão **Kanban** para conferir os cenários por status.

![Jornada em Kanban](${relative(screenshots.kanban)})

## 4. Aplicar N/A opcionais

Use **Aplicar N/A opcionais** quando SAP, XML, alarmes ou mapas não fizerem parte do escopo.

![Preset N/A](${relative(screenshots.naPreset)})

## 5. Registrar evidência no sidebar

Clique em um cenário, revise objetivo/passos e registre responsável, data, evidência, pendência e status.

![Sidebar de evidência](${relative(screenshots.sidebar)})

## 6. Controlar pendências

Cenários reprovados, bloqueados ou com defeitos aparecem automaticamente na aba Pendências.

![Pendências temporárias](${relative(screenshots.issues)})

## 7. Fechar o sign-off

Resolva pendências, registre assinaturas e gere o relatório final.

![Sign-off final](${relative(screenshots.final)})

![Relatório HTML](${relative(screenshots.report)})

## Melhorias identificadas

### UX

- Adicionar contador visual de N/A por bloco.
- Permitir filtro rápido por responsável no topo da Jornada.
- Exibir indicador de evidência ausente nos cards.

### Governança

- Criar campo de aprovação com ressalva.
- Separar pendência técnica de pendência de dado mestre.
- Incluir trilha de auditoria de alterações de status.

### Futuro com backend

- Persistir projetos, evidências, assinaturas e anexos em banco.
- Adicionar autenticação por perfil.
- Criar upload real de arquivos de evidência.
`;

  const figure = (title, text, fileName) => `
    <figure>
      <img src="${imageData(fileName)}" alt="${escapeHtml(title)}">
      <figcaption><strong>${escapeHtml(title)}</strong><span>${escapeHtml(text)}</span></figcaption>
    </figure>
  `;

  const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Manual de Uso - Sign-off Cliente Lubit</title>
    <style>
      :root { --bg:#f3f6fa; --surface:#fff; --line:#d8e0e7; --text:#1d252c; --muted:#607181; --teal:#0f766e; --blue:#2563eb; --violet:#7c3aed; --orange:#f97316; --green:#217044; --soft:#f8fafc; }
      * { box-sizing: border-box; }
      body { margin: 0; background: linear-gradient(180deg, rgba(15,118,110,.08), rgba(37,99,235,.04) 380px, var(--bg)); color: var(--text); font-family: Arial, Helvetica, sans-serif; line-height: 1.55; }
      main { max-width: 1180px; margin: 0 auto; padding: 28px 20px 56px; }
      .shell { overflow: hidden; background: var(--surface); border: 1px solid var(--line); border-radius: 12px; box-shadow: 0 12px 34px rgba(30,43,54,.1); }
      header { display: grid; grid-template-columns: minmax(0,1fr) 280px; gap: 24px; padding: 30px; border-top: 7px solid var(--teal); background: linear-gradient(135deg,#fff,#f8fbff 58%,#e6f6f3); }
      .badge { color: var(--teal); font-size: 12px; font-weight: 800; text-transform: uppercase; }
      h1 { margin: 8px 0 10px; font-size: clamp(30px,4vw,44px); line-height: 1.08; }
      h2 { display: flex; align-items: center; gap: 10px; margin: 30px 0 12px; font-size: 22px; }
      h3 { margin: 0 0 8px; color: var(--teal); }
      .lead, p, figcaption span, li { color: var(--muted); }
      .hero-card { border: 1px solid rgba(15,118,110,.24); border-radius: 10px; background: rgba(255,255,255,.72); padding: 16px; }
      .hero-card strong { display: block; font-size: 30px; }
      .content { padding: 26px 30px 34px; }
      .icon { display: inline-grid; width: 38px; height: 38px; place-items: center; border-radius: 9px; background: #e6f6f3; color: var(--teal); font-weight: 900; }
      .grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; }
      .card { border: 1px solid var(--line); border-top: 4px solid var(--teal); border-radius: 10px; background: var(--soft); padding: 14px; }
      .card.blue { border-top-color: var(--blue); } .card.violet { border-top-color: var(--violet); } .card.orange { border-top-color: var(--orange); }
      figure { margin: 16px 0 28px; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; background: #fff; }
      img { display: block; width: 100%; height: auto; }
      figcaption { display: grid; gap: 3px; padding: 12px 14px; border-top: 1px solid var(--line); background: var(--soft); }
      .improvements { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; }
      ul { margin: 0; padding-left: 20px; }
      @media (max-width: 840px) { header, .grid, .improvements { grid-template-columns: 1fr; } .content, header { padding: 22px; } }
      @media print { body { background: #fff; } main { padding: 0; } .shell { border: 0; box-shadow: none; } }
    </style>
  </head>
  <body>
    <main>
      <article class="shell">
        <header>
          <div>
            <span class="badge">Manual com simulação Playwright</span>
            <h1>Manual de Uso - Sign-off Cliente Lubit</h1>
            <p class="lead">Roteiro de aceite completo com prints reais da ferramenta, evidências, pendências, preset N/A e assinatura final.</p>
          </div>
          <aside class="hero-card">
            <span>Simulação completa</span>
            <strong>32 cenários</strong>
            <p>Aprovados, N/A, pendências temporárias resolvidas e 3 assinaturas.</p>
          </aside>
        </header>
        <div class="content">
          <section class="grid">
            <div class="card"><h3>1. Preparar</h3><p>Preencher projeto, cliente e ambiente.</p></div>
            <div class="card blue"><h3>2. Validar</h3><p>Executar cenários em Linhas ou Kanban pelo sidebar.</p></div>
            <div class="card violet"><h3>3. Assinar</h3><p>Resolver pendências, registrar assinaturas e exportar o pacote.</p></div>
          </section>

          <h2><span class="icon">1</span>Preenchimento do projeto</h2>
          ${figure("Projeto preenchido", "Dados-base usados na simulação do cliente.", screenshots.project)}

          <h2><span class="icon">2</span>Jornada em linhas</h2>
          ${figure("Visão Linhas", "Lista rápida por bloco para execução assistida.", screenshots.lines)}

          <h2><span class="icon">3</span>Jornada em Kanban</h2>
          ${figure("Visão Kanban", "Cenários agrupados por status no bloco selecionado.", screenshots.kanban)}

          <h2><span class="icon">4</span>Preset N/A opcionais</h2>
          ${figure("Preset aplicado", "Itens opcionais fora do escopo marcados como N/A.", screenshots.naPreset)}

          <h2><span class="icon">5</span>Registro de evidência</h2>
          ${figure("Sidebar de edição", "Registro de responsável, data, evidência, status e observação.", screenshots.sidebar)}

          <h2><span class="icon">6</span>Pendências e resolução</h2>
          ${figure("Pendências temporárias", "Exemplo de reprovação e bloqueio antes da resolução.", screenshots.issues)}

          <h2><span class="icon">7</span>Sign-off final</h2>
          ${figure("Relatório e assinaturas", "Três assinaturas registradas e pacote pronto para exportação.", screenshots.final)}
          ${figure("Relatório HTML", "Documento formal gerado pela ferramenta.", screenshots.report)}

          <h2><span class="icon">+</span>Melhorias identificadas</h2>
          <section class="improvements">
            <div class="card"><h3>UX</h3><ul><li>Contador visual de N/A por bloco.</li><li>Filtro rápido por responsável.</li><li>Indicador de evidência ausente.</li></ul></div>
            <div class="card orange"><h3>Governança</h3><ul><li>Aprovação com ressalva.</li><li>Separar defeito técnico de dado mestre.</li><li>Trilha de auditoria de status.</li></ul></div>
            <div class="card violet"><h3>Backend futuro</h3><ul><li>Persistência centralizada.</li><li>Autenticação por perfil.</li><li>Upload real de evidências.</li></ul></div>
          </section>
        </div>
      </article>
    </main>
  </body>
</html>`;

  fs.writeFileSync(mdPath, md, "utf8");
  fs.writeFileSync(htmlPath, html, "utf8");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

test.beforeEach(async ({ page }) => {
  ensureArtifactDir();
  await page.goto("/");
  await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
  await page.reload();
});

test("simula sign-off completo de cliente com N/A, pendencias e manual", async ({ page }) => {
  const screenshots = {};
  await expect(page.getByRole("button", { name: "Jornada" })).toBeVisible();

  await setField(page, "#projectName", "Sign-off Lubit - Aceite Cliente Demonstração");
  await setField(page, "#projectClient", "Cliente Demonstração - Planta Piloto");
  await setField(page, "#projectEnvironment", "Homologação / Produção assistida");
  screenshots.project = await screenshot(page, "01-projeto-preenchido");

  let visibleScenarioTotal = 0;
  for (const group of GROUPS) {
    await page.locator(`[data-select-group="${group.id}"]`).click();
    await page.locator('[data-view-mode="lines"]').click();
    await expect(page.locator(".journey-line")).toHaveCount(group.count);
    visibleScenarioTotal += group.count;
  }
  expect(visibleScenarioTotal).toBe(32);

  await page.locator('[data-select-group="dados"]').click();
  await page.locator('[data-view-mode="lines"]').click();
  screenshots.lines = await screenshot(page, "02-jornada-linhas");

  await page.locator('[data-view-mode="kanban"]').click();
  await expect(page.locator(".journey-kanban .kanban-card")).toHaveCount(10);
  screenshots.kanban = await screenshot(page, "03-jornada-kanban");

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("N/A");
    await dialog.accept();
  });
  await page.locator("#optionalNaBtn").click();
  await expect(page.locator('[data-select-group="apoio"]')).toHaveClass(/active/);
  await expect(page.locator(".journey-kanban .kanban-column.na .kanban-card")).toHaveCount(5);
  screenshots.naPreset = await screenshot(page, "04-preset-na-opcionais");

  let approvedIndex = 0;
  for (const group of GROUPS) {
    await page.locator(`[data-select-group="${group.id}"]`).click();
    await page.locator('[data-view-mode="lines"]').click();
    const scenarioIds = await page.locator(".journey-line").evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("data-select-scenario"))
    );

    for (const scenarioId of scenarioIds) {
      if (OPTIONAL_NA_IDS.includes(scenarioId)) continue;
      approvedIndex += 1;

      if (scenarioId === TEMP_REJECTED_ID) {
        await fillScenario(page, scenarioId, "Reprovado", approvedIndex, {
          severity: "Alta",
          issues: "Cliente solicitou ajuste de mensagem no cancelamento antes do aceite final.",
          notes: "Pendência temporária criada para validar a rotina de resolução.",
        });
        continue;
      }

      if (scenarioId === TEMP_BLOCKED_ID) {
        await fillScenario(page, scenarioId, "Bloqueado", approvedIndex, {
          severity: "Média",
          issues: "Acesso ao arquivo de histórico foi liberado após validação com TI.",
          notes: "Bloqueio temporário criado para validar a tela de pendências.",
        });
        continue;
      }

      await fillScenario(page, scenarioId, "Aprovado", approvedIndex);
      if (!screenshots.sidebar) {
        const detail = await openScenario(page, scenarioId);
        await setField(page, '[data-field="notes"]', "Print capturado para o manual de uso.", detail);
        screenshots.sidebar = await screenshot(page, "05-sidebar-evidencia");
        await closeDrawer(page);
      }
    }
  }

  await page.getByRole("button", { name: "Pendências" }).click();
  await expect(page.locator(".issue-card")).toHaveCount(2);
  screenshots.issues = await screenshot(page, "06-pendencias-temporarias");

  await fillScenario(page, TEMP_REJECTED_ID, "Aprovado", 98, {
    issues: "",
    notes: "Pendência resolvida e aprovada pelo cliente na rodada final.",
    evidence: "Evidência de correção validada pelo cliente.",
  });
  await fillScenario(page, TEMP_BLOCKED_ID, "Aprovado", 99, {
    issues: "",
    notes: "Bloqueio removido após liberação de acesso pela TI.",
    evidence: "Histórico revalidado com acesso liberado.",
  });

  await expect(page.locator(".metric-card").filter({ hasText: "Progresso" })).toContainText("100%");
  await page.getByRole("button", { name: "Pendências" }).click();
  await expect(page.locator("#issuesList")).toContainText("Nenhuma pendência registrada");

  await page.locator('[data-tab="report"]').click();
  const signatures = [
    ["Operação", "Mariana Costa", "Key User Operação", "Fluxos operacionais aprovados."],
    ["Manutenção", "Roberto Lima", "Coordenador de Manutenção", "Plano, OS e retorno validados."],
    ["TI / Integrações", "Carla Mendes", "Responsável TI", "Módulos opcionais SAP/XML/Mapas tratados como N/A para este escopo."],
  ];

  for (let index = 0; index < signatures.length; index += 1) {
    await page.getByRole("button", { name: "Adicionar assinatura" }).click();
    const card = page.locator(".signature-card").nth(index);
    await setField(page, '[data-field="area"]', signatures[index][0], card);
    await setField(page, '[data-field="name"]', signatures[index][1], card);
    await setField(page, '[data-field="role"]', signatures[index][2], card);
    await setField(page, '[data-field="date"]', "2026-05-14", card);
    await setField(page, '[data-field="notes"]', signatures[index][3], card);
  }
  screenshots.final = await screenshot(page, "07-signoff-final");

  const popupPromise = page.waitForEvent("popup");
  await page.locator("#reportBtn").click();
  const report = await popupPromise;
  await report.waitForLoadState("domcontentloaded");
  await report.screenshot({ path: path.join(ARTIFACT_DIR, "08-relatorio-html.png"), fullPage: true });
  screenshots.report = "08-relatorio-html.png";

  const jsonDownload = await downloadByClick(page, "#exportBtn", "client-signoff-export.json");
  const markdownDownload = await downloadByClick(page, "#markdownBtn", "client-signoff-export.md");

  const exportedState = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  fs.writeFileSync(path.join(ARTIFACT_DIR, "client-signoff-state.json"), JSON.stringify(exportedState, null, 2), "utf8");

  const scenarioValues = Object.values(exportedState.scenarios);
  expect(scenarioValues).toHaveLength(32);
  expect(scenarioValues.filter((scenario) => scenario.status === "N/A")).toHaveLength(5);
  expect(scenarioValues.filter((scenario) => scenario.status === "Aprovado")).toHaveLength(27);
  expect(exportedState.signatures).toHaveLength(3);

  OPTIONAL_NA_IDS.forEach((id) => {
    expect(exportedState.scenarios[id].status).toBe("N/A");
  });
  expect(fs.existsSync(jsonDownload)).toBe(true);
  expect(fs.existsSync(markdownDownload)).toBe(true);

  await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
  await page.reload();
  await page.locator("#importFile").setInputFiles(jsonDownload);
  await expect(page.locator(".metric-card").filter({ hasText: "Progresso" })).toContainText("100%");

  const importedState = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(Object.values(importedState.scenarios)).toHaveLength(32);
  expect(importedState.signatures).toHaveLength(3);

  generateManual(screenshots);
  expect(fs.existsSync(path.join(DOCS_DIR, "manual-signoff-cliente.html"))).toBe(true);
  expect(fs.existsSync(path.join(DOCS_DIR, "manual-signoff-cliente.md"))).toBe(true);
});
