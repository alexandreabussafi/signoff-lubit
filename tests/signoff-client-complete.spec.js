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

async function openActionMenu(page) {
  await page.locator("#actionMenuBtn").click();
  await expect(page.locator("#actionMenu")).toBeVisible();
}

async function clickActionMenuItem(page, selector) {
  await openActionMenu(page);
  await page.locator(selector).click();
}

async function downloadByClick(page, selector, targetName) {
  const downloadPromise = page.waitForEvent("download");
  await clickActionMenuItem(page, selector);
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

  const journey = [
    "Criar ou importar um projeto de aceite.",
    "Preencher nome do projeto, cliente/unidade e ambiente testado.",
    "Revisar escopo e aplicar N/A opcionais quando SAP, XML, alarmes ou mapas não fizerem parte da entrega.",
    "Validar os cenários por bloco: Dados iniciais, Operação principal e Apoio e integrações.",
    "Abrir cada cenário no sidebar e registrar responsável, data, ambiente, evidência e observações.",
    "Usar o status correto: Aprovado, Em teste, Reprovado, Bloqueado ou N/A.",
    "Resolver pendências antes do aceite final.",
    "Registrar assinaturas por área.",
    "Exportar o JSON como pacote oficial de aceite.",
    "Gerar Markdown e relatório HTML para documentação formal.",
  ];

  const evidenceExamples = [
    "Número da OS validada no Lubit.",
    "Print da tela ou do PDF gerado.",
    "Caminho do arquivo salvo na rede do projeto.",
    "Observação objetiva da homologação.",
    "Referência de reunião ou validação assistida com key user.",
  ];

  const statusGuide = [
    { label: "Aprovado", text: "O cenário foi executado, evidenciado e aceito pelo responsável.", tone: "green" },
    { label: "Em teste", text: "A execução começou, mas ainda falta evidência ou confirmação.", tone: "blue" },
    { label: "Reprovado", text: "O comportamento não atendeu ao critério de aceite e precisa de correção.", tone: "red" },
    { label: "Bloqueado", text: "Não foi possível testar por falta de acesso, dado, ambiente ou dependência.", tone: "orange" },
    { label: "N/A", text: "Item fora do escopo contratado ou não aplicável ao cliente.", tone: "violet" },
  ];

  const manualSections = [
    {
      number: "01",
      icon: "clipboard",
      tone: "teal",
      title: "Preencher o projeto",
      image: screenshots.project,
      caption: "Tela inicial com projeto, cliente e ambiente definidos.",
      goal: "Abrir uma rodada de aceite rastreável para uma implantação, unidade ou fase de homologação.",
      actions: [
        "Informe um nome claro para o projeto de aceite.",
        "Preencha cliente/unidade para identificar a planta ou área validada.",
        "Defina o ambiente testado, normalmente Homologação ou Produção assistida.",
      ],
      record: [
        "Data da rodada no próprio cenário.",
        "Ambiente usado para a validação.",
        "Responsável por cada bloco ou cenário.",
      ],
      acceptance: "O projeto deve estar identificado antes de qualquer aprovação ou exportação.",
    },
    {
      number: "02",
      icon: "list",
      tone: "blue",
      title: "Executar pela Jornada em Linhas",
      image: screenshots.lines,
      caption: "Visão em linhas para execução rápida dos cenários do bloco selecionado.",
      goal: "Conduzir o aceite em sequência, cenário por cenário, sem abrir telas desnecessárias.",
      actions: [
        "Escolha um dos três blocos superiores.",
        "Use Linhas quando a reunião de aceite estiver seguindo uma ordem de validação.",
        "Clique no cenário para abrir o sidebar e registrar o resultado.",
      ],
      record: [
        "Responsável que executou ou validou o cenário.",
        "Evidência mínima do teste realizado.",
        "Observação curta quando houver ressalva operacional.",
      ],
      acceptance: "Cada cenário aplicável deve terminar como Aprovado ou ter uma pendência explícita.",
    },
    {
      number: "03",
      icon: "columns",
      tone: "violet",
      title: "Acompanhar pela Jornada em Kanban",
      image: screenshots.kanban,
      caption: "Kanban agrupando cenários por status dentro do bloco selecionado.",
      goal: "Dar visibilidade rápida do que falta testar, do que está em teste e do que já foi aprovado.",
      actions: [
        "Alterne para Kanban no topo da Jornada.",
        "Revise cartões parados em Não iniciado ou Em teste.",
        "Use a coluna Pendência para priorizar correções e bloqueios.",
      ],
      record: [
        "Mudança de status no próprio cenário.",
        "Responsável pela próxima ação.",
        "Severidade quando houver defeito ou bloqueio.",
      ],
      acceptance: "O Kanban final deve ficar sem itens pendentes para que o aceite seja limpo.",
    },
    {
      number: "04",
      icon: "ban",
      tone: "orange",
      title: "Aplicar N/A opcionais",
      image: screenshots.naPreset,
      caption: "Preset conservador para módulos opcionais fora do escopo do cliente.",
      goal: "Evitar reprovar ou deixar em aberto módulos que não fazem parte da implantação validada.",
      actions: [
        "Clique em Aplicar N/A opcionais na barra lateral.",
        "Confirme a mensagem apresentada pelo sistema.",
        "Revise depois cada cenário marcado como N/A se o escopo mudar.",
      ],
      record: [
        "Motivo do N/A quando necessário.",
        "Observação indicando que SAP, XML, alarmes ou mapas estão fora do escopo.",
        "Evidências já preenchidas são mantidas, caso existam.",
      ],
      acceptance: "Use N/A somente para item fora do escopo, nunca para esconder pendência real.",
      warning: "O preset altera apenas cenários ainda não iniciados ou em teste. Itens já aprovados, reprovados ou bloqueados não são sobrescritos.",
    },
    {
      number: "05",
      icon: "edit",
      tone: "green",
      title: "Registrar evidência no sidebar",
      image: screenshots.sidebar,
      caption: "Sidebar lateral usado para preencher status, responsável, evidência e observações.",
      goal: "Transformar cada aprovação em um registro objetivo, auditável e fácil de revisar.",
      actions: [
        "Abra o cenário clicando na linha ou no cartão.",
        "Leia objetivo, passos rápidos e resultado esperado.",
        "Preencha responsável, data, ambiente, evidência e observações.",
        "Use Aprovar, Em teste, Reprovar, Bloquear ou N/A conforme o resultado.",
      ],
      record: [
        "Número da OS, print, PDF, arquivo, reunião ou observação de homologação.",
        "Pendência e severidade quando o cenário falhar.",
        "Comentário final quando houver aprovação assistida.",
      ],
      acceptance: "Um cenário aprovado deve ter evidência suficiente para ser entendido depois sem nova reunião.",
    },
    {
      number: "06",
      icon: "alert",
      tone: "red",
      title: "Controlar e resolver pendências",
      image: screenshots.issues,
      caption: "Exemplo de pendências temporárias criadas durante a simulação.",
      goal: "Separar problemas reais do aceite e impedir assinatura final sem visibilidade das pendências.",
      actions: [
        "Abra a aba Pendências para ver cenários reprovados, bloqueados ou com defeitos.",
        "Revise severidade, responsável e descrição.",
        "Após a correção ou liberação, volte ao cenário e atualize o status.",
      ],
      record: [
        "Descrição objetiva do problema.",
        "Responsável por resolver.",
        "Evidência de reteste após a correção.",
      ],
      acceptance: "Pendências críticas devem estar resolvidas ou formalmente aceitas com ressalva fora da ferramenta.",
    },
    {
      number: "07",
      icon: "signature",
      tone: "violet",
      title: "Assinar e exportar o aceite",
      image: screenshots.final,
      caption: "Tela de relatório com assinaturas das áreas de Operação, Manutenção e TI.",
      goal: "Encerrar a rodada com responsáveis identificados e pacote de aceite exportável.",
      actions: [
        "Abra Relatório e adicione as assinaturas das áreas envolvidas.",
        "Revise o percentual de progresso, pendências e cenários N/A.",
        "Exporte o JSON e gere o Markdown ou relatório HTML.",
      ],
      record: [
        "Nome, área, cargo, data e observação de cada assinatura.",
        "JSON final do aceite como backup oficial.",
        "Relatório HTML ou Markdown para documentação do projeto.",
      ],
      acceptance: "O aceite final deve ter progresso 100%, pendências tratadas e assinaturas registradas.",
    },
    {
      number: "08",
      icon: "file",
      tone: "teal",
      title: "Gerar o relatório HTML formal",
      image: screenshots.report,
      caption: "Relatório formal com resumo executivo, matriz, roteiro, pendências e assinaturas.",
      goal: "Produzir um documento de entrega que possa ser enviado, impresso ou anexado ao pacote do projeto.",
      actions: [
        "Clique em Relatório HTML para abrir o documento em uma nova janela.",
        "Confira resumo executivo, matriz de aprovação, roteiro UAT e assinaturas.",
        "Use o navegador para imprimir ou salvar como PDF quando necessário.",
      ],
      record: [
        "Relatório HTML salvo ou impresso.",
        "JSON exportado junto com o relatório.",
        "Markdown exportado quando for útil para documentação técnica.",
      ],
      acceptance: "O relatório deve refletir exatamente o estado exportado no JSON final.",
    },
  ];

  const mdList = (items) => items.map((item) => `- ${item}`).join("\n");
  const mdSection = (section) => `## ${section.number}. ${section.title}

**Objetivo:** ${section.goal}

**Como fazer**

${mdList(section.actions)}

**O que registrar**

${mdList(section.record)}

**Critério de aceite:** ${section.acceptance}
${section.warning ? `\n**Cuidado:** ${section.warning}\n` : ""}
![${section.title}](${relative(section.image)})
`;

  const md = `# Manual de Uso - Sign-off Cliente Lubit

Este manual explica como conduzir um sign-off completo do Lubit usando a ferramenta de aceite. Ele foi gerado a partir de uma simulação Playwright com 32 cenários, 27 aprovados, 5 itens N/A, pendências temporárias resolvidas e 3 assinaturas.

## Como fazer o sign-off

${journey.map((item, index) => `${index + 1}. ${item}`).join("\n")}

## Status usados no aceite

${statusGuide.map((status) => `- **${status.label}:** ${status.text}`).join("\n")}

## Exemplos de evidência

${mdList(evidenceExamples)}

${manualSections.map(mdSection).join("\n")}

## Boas práticas

- Não assine o aceite com pendências críticas abertas.
- Exporte o JSON ao fim de cada rodada de validação.
- Use N/A apenas para item fora do escopo do cliente.
- Mantenha evidências claras, rastreáveis e fáceis de entender.
- Registre aprovação por área quando Operação, Manutenção e TI participarem do aceite.

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

  const icon = (name) => {
    const icons = {
      clipboard: '<path d="M9 4h6"/><path d="M9 2h6v4H9z"/><path d="M6 5H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1"/><path d="M8 12h8"/><path d="M8 16h5"/>',
      list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
      columns: '<path d="M4 4h6v16H4z"/><path d="M14 4h6v10h-6z"/>',
      ban: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
      edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
      alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
      signature: '<path d="M3 17c3 0 3-4 6-4s3 4 6 4 3-4 6-4"/><path d="M5 21h14"/><path d="m14 3 4 4-8 8H6v-4z"/>',
      file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h5"/>',
      check: '<path d="m5 12 4 4L19 6"/>',
      box: '<path d="m21 8-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
      export: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.check}</svg>`;
  };

  const list = (items) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const figure = (title, text, fileName) => `
    <figure class="screen">
      <img src="${imageData(fileName)}" alt="${escapeHtml(title)}">
      <figcaption><strong>${escapeHtml(title)}</strong><span>${escapeHtml(text)}</span></figcaption>
    </figure>
  `;
  const statusCards = statusGuide
    .map(
      (status) => `
        <article class="status-card ${status.tone}">
          <strong>${escapeHtml(status.label)}</strong>
          <p>${escapeHtml(status.text)}</p>
        </article>
      `
    )
    .join("");
  const timeline = journey
    .map(
      (item, index) => `
        <li>
          <span>${String(index + 1).padStart(2, "0")}</span>
          <p>${escapeHtml(item)}</p>
        </li>
      `
    )
    .join("");
  const sectionHtml = manualSections
    .map(
      (section) => `
        <section class="manual-section ${section.tone}" id="passo-${section.number}">
          <div class="section-title">
            <span class="section-icon">${icon(section.icon)}</span>
            <div>
              <span class="eyebrow">Passo ${section.number}</span>
              <h2>${escapeHtml(section.title)}</h2>
            </div>
          </div>
          <div class="instruction-grid">
            <article class="instruction-card">
              <h3>Objetivo</h3>
              <p>${escapeHtml(section.goal)}</p>
              <div class="mini-grid">
                <div>
                  <h4>O que fazer</h4>
                  <ul>${list(section.actions)}</ul>
                </div>
                <div>
                  <h4>O que registrar</h4>
                  <ul>${list(section.record)}</ul>
                </div>
              </div>
              <div class="acceptance">
                <strong>Critério de aceite</strong>
                <p>${escapeHtml(section.acceptance)}</p>
              </div>
              ${
                section.warning
                  ? `<div class="callout warning"><strong>Cuidado</strong><p>${escapeHtml(section.warning)}</p></div>`
                  : ""
              }
            </article>
            ${figure(section.title, section.caption, section.image)}
          </div>
        </section>
      `
    )
    .join("");

  const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Manual de Uso - Sign-off Cliente Lubit</title>
    <style>
      :root { --bg:#f3f6fa; --surface:#fff; --line:#d8e0e7; --text:#1d252c; --muted:#607181; --teal:#0f766e; --blue:#2563eb; --violet:#7c3aed; --orange:#f97316; --green:#217044; --red:#be123c; --soft:#f8fafc; --shadow:0 12px 28px rgba(30,43,54,.09); }
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { margin: 0; background: radial-gradient(circle at 12% 0%, rgba(15,118,110,.12), transparent 28%), linear-gradient(180deg, #eef7f6 0, #f5f7fb 440px, var(--bg)); color: var(--text); font-family: Arial, Helvetica, sans-serif; line-height: 1.55; }
      main { max-width: 1260px; margin: 0 auto; padding: 28px 20px 56px; }
      h1, h2, h3, h4, p { margin-top: 0; }
      h1 { margin-bottom: 12px; font-size: clamp(32px,4vw,48px); line-height: 1.06; letter-spacing: 0; }
      h2 { margin-bottom: 4px; font-size: 24px; line-height: 1.2; }
      h3 { margin-bottom: 8px; font-size: 17px; }
      h4 { margin-bottom: 8px; font-size: 13px; color: var(--muted); text-transform: uppercase; }
      p, li, figcaption span { color: var(--muted); }
      svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
      .shell { overflow: hidden; background: rgba(255,255,255,.92); border: 1px solid var(--line); border-radius: 12px; box-shadow: var(--shadow); }
      .hero { display: grid; grid-template-columns: minmax(0,1fr) 330px; gap: 24px; padding: 34px; border-top: 7px solid var(--teal); background: linear-gradient(135deg,#fff,#f8fbff 58%,#e3f5f2); }
      .badge { display: inline-flex; align-items: center; gap: 8px; color: var(--teal); font-size: 12px; font-weight: 800; text-transform: uppercase; }
      .lead { max-width: 740px; font-size: 18px; color: #455766; }
      .hero-card { display: grid; gap: 12px; align-content: start; border: 1px solid rgba(15,118,110,.24); border-radius: 10px; background: rgba(255,255,255,.82); padding: 18px; }
      .hero-card strong { display: block; font-size: 34px; line-height: 1; }
      .stats { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 8px; }
      .stat { border: 1px solid var(--line); border-radius: 9px; background: #fff; padding: 10px; }
      .stat b { display: block; font-size: 20px; color: var(--text); }
      .content { display: grid; grid-template-columns: 260px minmax(0,1fr); gap: 24px; padding: 28px 34px 38px; }
      .toc { position: sticky; top: 18px; align-self: start; display: grid; gap: 14px; }
      .toc-card, .panel, .instruction-card, .status-card, .practice-card { border: 1px solid var(--line); border-radius: 10px; background: var(--surface); box-shadow: 0 1px 2px rgba(30,43,54,.04); }
      .toc-card { padding: 16px; }
      .toc-card a { display: block; padding: 7px 0; color: #475867; text-decoration: none; border-bottom: 1px solid #edf2f6; }
      .toc-card a:hover { color: var(--teal); }
      .panel { padding: 18px; margin-bottom: 18px; }
      .journey-list { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; margin: 14px 0 0; padding: 0; list-style: none; }
      .journey-list li { display: grid; grid-template-columns: 42px minmax(0,1fr); gap: 10px; align-items: start; border: 1px solid #e3ebf1; border-radius: 9px; background: #fbfdff; padding: 10px; }
      .journey-list span { display: grid; width: 30px; height: 30px; place-items: center; border-radius: 8px; background: #e6f6f3; color: var(--teal); font-weight: 800; }
      .journey-list p { margin: 2px 0 0; font-size: 14px; }
      .status-grid, .practice-grid, .improvements { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; }
      .status-card, .practice-card { padding: 14px; border-top: 4px solid var(--teal); }
      .status-card p, .practice-card p { margin-bottom: 0; font-size: 14px; }
      .status-card.green { border-top-color: var(--green); } .status-card.blue { border-top-color: var(--blue); } .status-card.red { border-top-color: var(--red); } .status-card.orange, .practice-card.orange { border-top-color: var(--orange); } .status-card.violet, .practice-card.violet { border-top-color: var(--violet); }
      .manual-section { margin-top: 26px; padding-top: 4px; border-top: 1px solid #dfe8ef; }
      .section-title { display: flex; gap: 12px; align-items: center; margin: 0 0 14px; }
      .section-icon { display: grid; width: 42px; height: 42px; place-items: center; border-radius: 10px; color: var(--teal); background: #e6f6f3; }
      .manual-section.blue .section-icon { color: var(--blue); background: #edf4ff; }
      .manual-section.violet .section-icon { color: var(--violet); background: #f2eafe; }
      .manual-section.orange .section-icon { color: var(--orange); background: #fff4e8; }
      .manual-section.green .section-icon { color: var(--green); background: #e9f7ef; }
      .manual-section.red .section-icon { color: var(--red); background: #fff0f3; }
      .eyebrow { display: block; color: var(--muted); font-size: 12px; font-weight: 800; text-transform: uppercase; }
      .instruction-grid { display: grid; grid-template-columns: minmax(330px,.9fr) minmax(0,1.1fr); gap: 16px; align-items: start; }
      .instruction-card { padding: 18px; }
      .mini-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 14px; margin-top: 14px; }
      ul { margin: 0; padding-left: 18px; }
      li + li { margin-top: 6px; }
      .acceptance, .callout { margin-top: 16px; padding: 12px 14px; border-radius: 9px; border: 1px solid rgba(15,118,110,.18); background: #f0faf8; }
      .acceptance p, .callout p { margin: 4px 0 0; }
      .callout.warning { border-color: rgba(249,115,22,.28); background: #fff7ed; }
      .screen { margin: 0; overflow: hidden; border: 1px solid var(--line); border-radius: 10px; background: #fff; box-shadow: 0 1px 2px rgba(30,43,54,.04); }
      .screen img { display: block; width: 100%; height: auto; }
      .screen figcaption { display: grid; gap: 3px; padding: 12px 14px; border-top: 1px solid var(--line); background: var(--soft); }
      .screen figcaption strong { color: var(--text); }
      .evidence-list { columns: 2; margin-top: 10px; }
      .footer-note { margin-top: 26px; padding: 16px; border-radius: 10px; background: #102a43; color: #fff; }
      .footer-note p { color: #d6e2ee; margin-bottom: 0; }
      @media (max-width: 1040px) { .content, .hero, .instruction-grid { grid-template-columns: 1fr; } .toc { position: static; } }
      @media (max-width: 760px) { main { padding: 0; } .shell { border-radius: 0; } .hero, .content { padding: 22px; } .journey-list, .status-grid, .practice-grid, .improvements, .mini-grid { grid-template-columns: 1fr; } .evidence-list { columns: 1; } }
      @media print { body { background: #fff; } main { padding: 0; } .shell { border: 0; box-shadow: none; } .toc { display: none; } .content { grid-template-columns: 1fr; } .manual-section { break-inside: avoid; } }
    </style>
  </head>
  <body>
    <main>
      <article class="shell">
        <header class="hero">
          <div>
            <span class="badge">${icon("check")} Manual operacional com simulação Playwright</span>
            <h1>Manual de Uso - Sign-off Cliente Lubit</h1>
            <p class="lead">Guia para conduzir o aceite de implantação: preparar o projeto, validar os cenários, registrar evidências, tratar pendências, coletar assinaturas e exportar o pacote final.</p>
          </div>
          <aside class="hero-card">
            <span class="badge">Resultado da simulação</span>
            <strong>100%</strong>
            <p>32 cenários validados: 27 aprovados, 5 N/A, pendências resolvidas e 3 assinaturas.</p>
            <div class="stats">
              <div class="stat"><b>32</b><span>cenários</span></div>
              <div class="stat"><b>3</b><span>assinaturas</span></div>
              <div class="stat"><b>5</b><span>N/A</span></div>
              <div class="stat"><b>0</b><span>pendências finais</span></div>
            </div>
          </aside>
        </header>
        <div class="content">
          <aside class="toc">
            <nav class="toc-card" aria-label="Índice do manual">
              <h3>Como usar</h3>
              <a href="#fluxo">Fluxo oficial</a>
              <a href="#status">Status do aceite</a>
              <a href="#evidencias">Evidências</a>
              ${manualSections.map((section) => `<a href="#passo-${section.number}">${section.number}. ${escapeHtml(section.title)}</a>`).join("")}
              <a href="#boas-praticas">Boas práticas</a>
            </nav>
            <section class="toc-card">
              <h3>Pacote final</h3>
              <p>Ao encerrar, mantenha juntos o JSON exportado, o relatório HTML/PDF e as evidências referenciadas nos cenários.</p>
            </section>
          </aside>

          <div>
            <section class="panel" id="fluxo">
              <h2>Como fazer o sign-off</h2>
              <p>Use esta sequência em reunião assistida com key users e responsáveis técnicos. A ferramenta salva automaticamente no navegador, mas o JSON exportado é o pacote oficial de backup e aceite.</p>
              <ol class="journey-list">${timeline}</ol>
            </section>

            <section class="panel" id="status">
              <h2>Status do aceite</h2>
              <p>O status deve refletir a situação real do cenário no momento da validação.</p>
              <div class="status-grid">${statusCards}</div>
            </section>

            <section class="panel" id="evidencias">
              <h2>O que vale como evidência</h2>
              <p>A evidência precisa permitir que outra pessoa entenda o que foi testado e por que o cenário foi aceito, reprovado, bloqueado ou marcado como N/A.</p>
              <ul class="evidence-list">${list(evidenceExamples)}</ul>
            </section>

            ${sectionHtml}

            <section class="panel" id="boas-praticas">
              <h2>Boas práticas para fechar o aceite</h2>
              <div class="practice-grid">
                <article class="practice-card"><h3>Antes de assinar</h3><p>Não encerre com pendências críticas abertas. Se houver ressalva, registre fora da ferramenta no termo formal do projeto.</p></article>
                <article class="practice-card orange"><h3>Durante a rodada</h3><p>Exporte o JSON ao fim de cada reunião. Ele é o backup que permite continuar o aceite em outro navegador ou máquina.</p></article>
                <article class="practice-card violet"><h3>Uso de N/A</h3><p>Marque N/A somente para itens fora do escopo do cliente, como SAP, XML, alarmes ou mapas quando não contratados.</p></article>
              </div>
            </section>

            <section class="panel">
              <h2>Melhorias identificadas</h2>
              <section class="improvements">
                <article class="practice-card"><h3>UX</h3><ul><li>Contador visual de N/A por bloco.</li><li>Filtro rápido por responsável.</li><li>Indicador de evidência ausente.</li></ul></article>
                <article class="practice-card orange"><h3>Governança</h3><ul><li>Aprovação com ressalva.</li><li>Separar defeito técnico de dado mestre.</li><li>Trilha de auditoria de status.</li></ul></article>
                <article class="practice-card violet"><h3>Backend futuro</h3><ul><li>Persistência centralizada.</li><li>Autenticação por perfil.</li><li>Upload real de evidências.</li></ul></article>
              </section>
            </section>

            <section class="footer-note">
              <h2>Resumo para o cliente</h2>
              <p>O sign-off está pronto quando todos os cenários aplicáveis estiverem aprovados, os itens fora de escopo estiverem como N/A, as pendências estiverem resolvidas ou formalmente tratadas, e as áreas responsáveis tiverem assinado o aceite.</p>
            </section>
          </div>
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
  await clickActionMenuItem(page, "#optionalNaBtn");
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
  await clickActionMenuItem(page, "#reportBtn");
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
  const manualHtmlPath = path.join(DOCS_DIR, "manual-signoff-cliente.html");
  const manualMdPath = path.join(DOCS_DIR, "manual-signoff-cliente.md");
  expect(fs.existsSync(manualHtmlPath)).toBe(true);
  expect(fs.existsSync(manualMdPath)).toBe(true);

  const manualHtml = fs.readFileSync(manualHtmlPath, "utf8");
  const manualMd = fs.readFileSync(manualMdPath, "utf8");
  expect(manualHtml).toContain("Como fazer o sign-off");
  expect(manualHtml).toContain("O que vale como evidência");
  expect(manualHtml).toContain("Critério de aceite");
  expect((manualHtml.match(/data:image\/png;base64/g) || []).length).toBe(8);
  expect(manualMd).toContain("## Status usados no aceite");
  expect(manualMd).toContain("## Boas práticas");
});
