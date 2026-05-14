const STORAGE_KEY = "lubit-signoff-state-v1";

const statuses = [
  "Não iniciado",
  "Em teste",
  "Aprovado",
  "Reprovado",
  "Bloqueado",
  "N/A",
];

const defaultProject = {
  name: "Aceite de implantação Lubit",
  client: "",
  environment: "Homologação / Produção assistida",
};

const catalog = [
  {
    id: "implantacao",
    name: "Implantação e migração",
    features: [
      {
        id: "migrations",
        name: "Migrations e base de dados",
        scenarios: [
          {
            id: "migrations-aplicadas",
            name: "Validar aplicação das migrations e disponibilidade da base",
            acceptance:
              "Base acessível, migrations aplicadas e tabelas principais disponíveis para operação.",
            steps: [
              "Confirmar ambiente alvo e credenciais de acesso.",
              "Validar execução das migrations do backend Django.",
              "Conferir existência dos dados base de unidade, usuários e estrutura operacional.",
              "Registrar evidência da validação técnica ou checklist do responsável.",
            ],
          },
        ],
      },
      {
        id: "usuarios-perfis",
        name: "Usuários, perfis, permissões e unidades",
        scenarios: [
          {
            id: "usuarios-cadastrados",
            name: "Validar acesso dos usuários e atribuição de unidade",
            acceptance:
              "Usuários conseguem autenticar, visualizar a unidade correta e acessar menus conforme perfil.",
            steps: [
              "Selecionar usuário de cada perfil relevante.",
              "Entrar no sistema e conferir unidade padrão.",
              "Validar menus permitidos e bloqueios esperados.",
              "Registrar usuários testados e eventuais divergências.",
            ],
          },
        ],
      },
      {
        id: "plano-arvore",
        name: "Plano de lubrificação e árvore de ativos",
        scenarios: [
          {
            id: "plano-migrado",
            name: "Conferir plano de lubrificação migrado",
            acceptance:
              "Tarefas, frequências, materiais, rotas e prioridades migradas com consistência mínima.",
            steps: [
              "Comparar amostra do plano original com o Lubit.",
              "Validar tarefas, materiais, frequências e rotas em registros críticos.",
              "Conferir vínculo das tarefas com ativos e pontos de lubrificação.",
              "Registrar amostra usada e resultado da conferência.",
            ],
          },
          {
            id: "arvore-ativos",
            name: "Validar árvore de ativos",
            acceptance:
              "Hierarquia área, setor, equipamento, conjunto, subconjunto e ponto está navegável e consistente.",
            steps: [
              "Abrir Tree View ou telas da estrutura industrial.",
              "Conferir uma amostra de áreas e setores.",
              "Conferir equipamentos, conjuntos, subconjuntos e pontos com CILA.",
              "Registrar divergências de nomenclatura, posição ou vínculo.",
            ],
          },
        ],
      },
      {
        id: "dados-mestres",
        name: "Materiais e dados mestres",
        scenarios: [
          {
            id: "dados-mestres-migrados",
            name: "Validar materiais, lubrificantes, frequências, rotas, prioridades e motivos",
            acceptance:
              "Cadastros mestres necessários aos fluxos de OS estão disponíveis e selecionáveis.",
            steps: [
              "Abrir telas ou campos de seleção dos principais cadastros.",
              "Validar amostras de materiais e lubrificantes.",
              "Validar frequências, rotas, prioridades e motivos de retorno.",
              "Registrar evidências de consulta e eventuais ausências.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "cadastros",
    name: "Cadastros críticos",
    features: [
      {
        id: "cadastro-usuarios",
        name: "Usuários e atribuições",
        scenarios: [
          {
            id: "crud-usuarios",
            name: "Validar criação, edição, consulta e atribuição de usuário",
            acceptance:
              "Usuário pode ser cadastrado, editado, consultado e associado às unidades/perfis esperados.",
            steps: [
              "Criar ou selecionar usuário de teste.",
              "Editar dados gerais e atribuições.",
              "Consultar dados do usuário.",
              "Validar acesso ou bloqueio conforme perfil.",
            ],
          },
        ],
      },
      {
        id: "cadastro-unidades-fornecedores",
        name: "Unidades, fornecedores, cargos e funções",
        scenarios: [
          {
            id: "crud-administrativo",
            name: "Validar cadastros administrativos essenciais",
            acceptance:
              "Cadastros administrativos podem ser consultados e mantidos sem impedir os fluxos operacionais.",
            steps: [
              "Validar unidade e parâmetros da unidade.",
              "Validar fornecedor com endereço e contato.",
              "Validar cargos e funções.",
              "Registrar pendências em campos obrigatórios ou dados ausentes.",
            ],
          },
        ],
      },
      {
        id: "cadastro-itens",
        name: "Itens, consumíveis, lubrificantes e aditivos",
        scenarios: [
          {
            id: "crud-materiais",
            name: "Validar cadastros de materiais usados em tarefas e retorno",
            acceptance:
              "Itens aparecem nas tarefas CIT, OS, estoque e retorno conforme tipo de material.",
            steps: [
              "Consultar item, consumível, não consumível e lubrificante.",
              "Validar cadastro de aditivo, função e composto base.",
              "Usar material em uma tarefa CIT ou cenário de retorno.",
              "Registrar incompatibilidades de unidade de medida ou seleção.",
            ],
          },
        ],
      },
      {
        id: "cadastro-operacional",
        name: "Tarefas, frequências, condições, kits e instruções",
        scenarios: [
          {
            id: "crud-operacional",
            name: "Validar cadastros operacionais usados no plano",
            acceptance:
              "Tarefa, frequência, condição, kit e instrução de trabalho ficam disponíveis nos fluxos de plano e OS.",
            steps: [
              "Consultar cada cadastro operacional crítico.",
              "Criar ou editar uma amostra controlada quando permitido.",
              "Associar os dados a uma tarefa CIT.",
              "Validar se a informação aparece na OS gerada.",
            ],
          },
        ],
      },
      {
        id: "estrutura-cila",
        name: "Estrutura industrial e CILA",
        scenarios: [
          {
            id: "manutencao-estrutura",
            name: "Validar manutenção da estrutura e geração/consulta de CILA",
            acceptance:
              "Estrutura é editável conforme permissão e o CILA identifica corretamente o nível operacional.",
            steps: [
              "Criar ou editar item de estrutura em ambiente controlado.",
              "Validar geração ou consulta de CILA.",
              "Conferir vínculo com tarefas CIT.",
              "Registrar evidência da estrutura antes/depois.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "operacionais",
    name: "Fluxos operacionais",
    features: [
      {
        id: "levantamento-plano",
        name: "Levantamento de plano",
        scenarios: [
          {
            id: "levantamento-validacao",
            name: "Validar visão consolidada do levantamento de plano",
            acceptance:
              "Resumo por áreas, ativos, tarefas e materiais representa o plano cadastrado/migrado.",
            steps: [
              "Abrir Levantamento de Plano.",
              "Conferir contadores de áreas, setores, equipamentos, tarefas e materiais.",
              "Validar detalhes de uma amostra de ativo.",
              "Registrar divergências em tarefas ou materiais sugeridos.",
            ],
          },
        ],
      },
      {
        id: "tarefas-cit",
        name: "Tarefas CIT em ativos",
        scenarios: [
          {
            id: "cit-cadastro-edicao",
            name: "Validar cadastro e edição de tarefa CIT",
            acceptance:
              "Tarefa CIT é associada ao ativo correto com frequência, material, rota e próxima execução.",
            steps: [
              "Selecionar ativo de teste.",
              "Cadastrar ou editar tarefa CIT.",
              "Preencher frequência, material, rota, prioridade e datas.",
              "Conferir listagem da tarefa no ativo.",
            ],
          },
        ],
      },
      {
        id: "geracao-os",
        name: "Geração de OS programada",
        scenarios: [
          {
            id: "os-programada",
            name: "Gerar OS programada por data limite",
            acceptance:
              "Sistema emite OS para tarefas elegíveis, respeitando data limite, rota, condição e unidade.",
            steps: [
              "Abrir Gerar OS.",
              "Definir data limite de emissão.",
              "Executar geração para amostra controlada.",
              "Conferir OS emitidas, número, tarefa, ativo, material e data programada.",
            ],
          },
        ],
      },
      {
        id: "listagem-reimpressao",
        name: "Listagem, reimpressão e PDF de OS",
        scenarios: [
          {
            id: "consulta-pdf-os",
            name: "Consultar OS e gerar PDF/reimpressão",
            acceptance:
              "OS emitida pode ser localizada, consultada e impressa com dados corretos.",
            steps: [
              "Abrir Listagem de OS.",
              "Filtrar por número, ativo ou período.",
              "Abrir detalhes e validar dados principais.",
              "Gerar PDF ou reimpressão e anexar evidência.",
            ],
          },
        ],
      },
      {
        id: "retorno-os",
        name: "Retorno de OS individual",
        scenarios: [
          {
            id: "retorno-executado",
            name: "Retornar OS como executada",
            acceptance:
              "Retorno executado registra data, responsável, consumo, motivo e atualiza próxima execução quando aplicável.",
            steps: [
              "Buscar OS aberta.",
              "Preencher data de execução, responsável, consumo e observações.",
              "Selecionar situação executada e motivo.",
              "Salvar e conferir histórico/estado da OS.",
            ],
          },
          {
            id: "retorno-reprogramado-cancelado",
            name: "Retornar OS como reprogramada ou cancelada",
            acceptance:
              "Reprogramação/cancelamento salva motivo, nova data quando aplicável e mantém rastreabilidade.",
            steps: [
              "Buscar OS aberta.",
              "Selecionar reprogramação ou cancelamento.",
              "Preencher motivo e data de reprogramação quando necessário.",
              "Salvar e conferir alteração na listagem.",
            ],
          },
        ],
      },
      {
        id: "retorno-massa",
        name: "Retorno em massa",
        scenarios: [
          {
            id: "retorno-massa-validacao",
            name: "Executar retorno em massa de OS",
            acceptance:
              "OS selecionadas recebem retorno em lote sem corromper dados individuais.",
            steps: [
              "Abrir retorno em massa.",
              "Filtrar e selecionar conjunto de OS.",
              "Informar situação, responsável, data e observações.",
              "Salvar e conferir resultado nas OS selecionadas.",
            ],
          },
        ],
      },
      {
        id: "os-extraordinaria",
        name: "OS extraordinária",
        scenarios: [
          {
            id: "extraordinaria-crud-retorno",
            name: "Criar, editar e retornar OS extraordinária",
            acceptance:
              "OS extraordinária é criada para ativo/tarefa/material corretos e pode ser retornada.",
            steps: [
              "Criar OS extraordinária.",
              "Preencher ativo, tarefa, material, prioridade e responsável.",
              "Editar dados se necessário.",
              "Retornar a OS e conferir estado final.",
            ],
          },
        ],
      },
      {
        id: "parada-preventiva",
        name: "Parada preventiva",
        scenarios: [
          {
            id: "parada-preventiva-fluxo",
            name: "Criar parada preventiva e consultar tarefas",
            acceptance:
              "Parada preventiva registra período/responsável e lista tarefas associadas ao escopo.",
            steps: [
              "Cadastrar parada preventiva.",
              "Processar equipamentos ou selecionar escopo.",
              "Abrir tarefas da parada.",
              "Validar datas e responsáveis.",
            ],
          },
        ],
      },
      {
        id: "nota-tecnica",
        name: "Nota técnica e atividades",
        scenarios: [
          {
            id: "nota-tecnica-fluxo",
            name: "Criar nota técnica, anexar arquivos e gerar atividade/OS",
            acceptance:
              "Nota técnica mantém dados, anexos, atividades e vínculos com OS extraordinária ou tarefa CIT.",
            steps: [
              "Criar nota técnica para um ativo.",
              "Anexar evidência ou arquivo.",
              "Registrar atividade da nota.",
              "Criar OS extraordinária ou tarefa CIT a partir da nota quando aplicável.",
            ],
          },
        ],
      },
      {
        id: "estoque",
        name: "Estoque",
        scenarios: [
          {
            id: "estoque-entrada-saida",
            name: "Validar consulta, entrada e saída de estoque",
            acceptance:
              "Movimentações alteram saldo corretamente e ficam rastreáveis.",
            steps: [
              "Consultar saldo de item.",
              "Registrar entrada.",
              "Registrar saída manual ou vinculada à OS.",
              "Conferir saldo final e histórico.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "integracoes",
    name: "Importações e integrações",
    features: [
      {
        id: "importacao-planilha",
        name: "Importação de dados por planilha",
        scenarios: [
          {
            id: "importacao-dados",
            name: "Importar dados e concluir mapeamento",
            acceptance:
              "Planilha é processada, inconsistências são apresentadas e dados válidos são concluídos.",
            steps: [
              "Selecionar planilha de teste.",
              "Executar importação.",
              "Analisar prévia, divergências e abas de conferência.",
              "Concluir mapeamento e validar dados no sistema.",
            ],
          },
        ],
      },
      {
        id: "historico-importacao",
        name: "Histórico de importação",
        scenarios: [
          {
            id: "historico-importacao-validacao",
            name: "Consultar histórico e status de importação",
            acceptance:
              "Histórico mostra arquivos, contagens e status compatíveis com importações executadas.",
            steps: [
              "Abrir histórico de importação.",
              "Selecionar importação recente.",
              "Conferir contagens por serviços, materiais, frequências, rotas e motivos.",
              "Registrar evidência das diferenças entre planilha e banco.",
            ],
          },
        ],
      },
      {
        id: "xml-alertas",
        name: "Upload de medições e alertas por XML",
        scenarios: [
          {
            id: "upload-xml",
            name: "Importar XML de medições e gerar registros",
            acceptance:
              "XML válido é pré-visualizado, processado e registrado no histórico com medições associadas.",
            steps: [
              "Selecionar tipo de medição.",
              "Carregar XML válido.",
              "Conferir prévia e confirmar importação.",
              "Validar histórico e registros de medição/alerta.",
            ],
          },
        ],
      },
      {
        id: "mapeamento-equipamento",
        name: "Mapeamento de equipamento/CILA",
        scenarios: [
          {
            id: "mapear-cila",
            name: "Mapear equipamento importado para CILA",
            acceptance:
              "Caminho de equipamento externo fica associado ao CILA correto e pode ser filtrado/editado.",
            steps: [
              "Abrir mapeamento de equipamentos.",
              "Filtrar caminho de equipamento.",
              "Adicionar ou editar mapeamento para CILA.",
              "Validar listagem atualizada.",
            ],
          },
        ],
      },
      {
        id: "alarmes",
        name: "Configuração de alarmes",
        scenarios: [
          {
            id: "configurar-alarmes",
            name: "Ajustar preferências de alarme por unidade",
            acceptance:
              "Preferências são salvas, restauradas e respeitam limites de validação.",
            steps: [
              "Abrir configurações de alertas.",
              "Alterar dias por categoria.",
              "Salvar e recarregar a tela.",
              "Testar reset para padrão e registrar evidência.",
            ],
          },
        ],
      },
      {
        id: "sap",
        name: "Integração SAP",
        scenarios: [
          {
            id: "sap-integrar-os",
            name: "Selecionar OS e enviar para SAP",
            acceptance:
              "OS selecionadas são enviadas ao SAP, com logs de sucesso/erro e retorno de documentos quando aplicável.",
            steps: [
              "Abrir Integrar OS.",
              "Filtrar OS elegíveis e selecionar amostra.",
              "Executar integração.",
              "Conferir histórico SAP, status e documentos de material.",
            ],
          },
          {
            id: "sap-reintegracao",
            name: "Validar logs, reintegração e atualização de documento de material",
            acceptance:
              "Falhas podem ser auditadas, reintegradas ou atualizadas sem perder rastreabilidade.",
            steps: [
              "Abrir histórico de integração SAP.",
              "Localizar log de sucesso e log de falha, se houver.",
              "Executar reintegração em caso controlado.",
              "Validar atualização do documento de material no retorno.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "consultas",
    name: "Consultas e apoio",
    features: [
      {
        id: "relatorios",
        name: "Relatórios operacionais",
        scenarios: [
          {
            id: "relatorios-validacao",
            name: "Gerar relatórios críticos",
            acceptance:
              "Relatórios de consumo, projeção, highlights, histórico estatístico e OS extraordinária geram dados coerentes.",
            steps: [
              "Gerar relatório de consumo.",
              "Gerar projeção e highlights.",
              "Gerar histórico estatístico.",
              "Gerar relatório de OS extraordinária e registrar evidências.",
            ],
          },
        ],
      },
      {
        id: "graficos",
        name: "Gráficos de gestão de OS",
        scenarios: [
          {
            id: "graficos-os",
            name: "Validar dashboards e gráficos de OS",
            acceptance:
              "Indicadores de gestão de OS carregam sem erro e refletem filtros aplicados.",
            steps: [
              "Abrir gráficos de gestão.",
              "Aplicar filtros de unidade/período.",
              "Conferir contagens com listagem de OS.",
              "Registrar evidência dos indicadores.",
            ],
          },
        ],
      },
      {
        id: "logs",
        name: "Logs operacionais e SAP",
        scenarios: [
          {
            id: "logs-consulta",
            name: "Consultar logs operacionais, tarefas e SAP",
            acceptance:
              "Logs permitem rastrear operações críticas e integrações recentes.",
            steps: [
              "Abrir logs de tarefas CIT.",
              "Abrir logs de integração SAP.",
              "Filtrar por período/status.",
              "Validar detalhes de um evento.",
            ],
          },
        ],
      },
      {
        id: "mapas",
        name: "Mapas, beacons, heatmap, QR Code e geolocalização",
        scenarios: [
          {
            id: "mapas-validacao",
            name: "Validar funcionalidades de mapas e localização",
            acceptance:
              "Mapas, beacons, heatmap, QR Code e geolocalização carregam e permitem consulta/registro básico.",
            steps: [
              "Abrir lista de mapas/plantas.",
              "Validar cadastro ou edição de beacon.",
              "Abrir heatmap/tracking.",
              "Validar QR Code ou geolocalização para ativo/unidade.",
            ],
          },
        ],
      },
    ],
  },
];

let state = loadState();
let selectedScenarioId = getAllScenarios()[0].scenario.id;

const els = {
  projectName: document.getElementById("projectName"),
  projectClient: document.getElementById("projectClient"),
  projectEnvironment: document.getElementById("projectEnvironment"),
  processFilter: document.getElementById("processFilter"),
  statusFilter: document.getElementById("statusFilter"),
  searchFilter: document.getElementById("searchFilter"),
  summaryGrid: document.getElementById("summaryGrid"),
  processProgress: document.getElementById("processProgress"),
  checklist: document.getElementById("checklist"),
  scenarioCount: document.getElementById("scenarioCount"),
  scenarioList: document.getElementById("scenarioList"),
  scenarioDetail: document.getElementById("scenarioDetail"),
  issuesList: document.getElementById("issuesList"),
  signaturesList: document.getElementById("signaturesList"),
  importFile: document.getElementById("importFile"),
};

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return createInitialState();

  try {
    const parsed = JSON.parse(stored);
    return normalizeState(parsed);
  } catch {
    return createInitialState();
  }
}

function createInitialState() {
  const scenarioState = {};
  getAllScenarios().forEach(({ scenario }) => {
    scenarioState[scenario.id] = {
      status: "Não iniciado",
      owner: "",
      date: "",
      environment: "",
      evidence: "",
      issues: "",
      severity: "Média",
      notes: "",
    };
  });

  return {
    version: 1,
    project: { ...defaultProject },
    scenarios: scenarioState,
    signatures: [],
    updatedAt: new Date().toISOString(),
  };
}

function normalizeState(candidate) {
  const initial = createInitialState();
  return {
    ...initial,
    ...candidate,
    project: { ...initial.project, ...(candidate.project || {}) },
    scenarios: { ...initial.scenarios, ...(candidate.scenarios || {}) },
    signatures: Array.isArray(candidate.signatures) ? candidate.signatures : [],
  };
}

function persist() {
  state.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getAllScenarios() {
  return catalog.flatMap((process) =>
    process.features.flatMap((feature) =>
      feature.scenarios.map((scenario) => ({ process, feature, scenario }))
    )
  );
}

function getFilteredScenarios() {
  const processId = els.processFilter.value;
  const status = els.statusFilter.value;
  const query = els.searchFilter.value.trim().toLowerCase();

  return getAllScenarios().filter(({ process, feature, scenario }) => {
    const scenarioData = state.scenarios[scenario.id];
    const haystack = [
      process.name,
      feature.name,
      scenario.name,
      scenarioData.owner,
      scenarioData.issues,
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!processId || process.id === processId) &&
      (!status || scenarioData.status === status) &&
      (!query || haystack.includes(query))
    );
  });
}

function statusClass(status) {
  return `status-${status
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
}

function percent(part, total) {
  return total ? Math.round((part / total) * 100) : 0;
}

function render() {
  bindProjectFields();
  renderFilters();
  renderDashboard();
  renderChecklist();
  renderExecution();
  renderIssues();
  renderSignatures();
}

function bindProjectFields() {
  els.projectName.value = state.project.name;
  els.projectClient.value = state.project.client;
  els.projectEnvironment.value = state.project.environment;
}

function renderFilters() {
  const currentProcess = els.processFilter.value;
  const currentStatus = els.statusFilter.value;

  els.processFilter.innerHTML = [
    `<option value="">Todos</option>`,
    ...catalog.map((process) => `<option value="${process.id}">${process.name}</option>`),
  ].join("");
  els.processFilter.value = currentProcess;

  els.statusFilter.innerHTML = [
    `<option value="">Todos</option>`,
    ...statuses.map((status) => `<option value="${status}">${status}</option>`),
  ].join("");
  els.statusFilter.value = currentStatus;
}

function renderDashboard() {
  const all = getAllScenarios();
  const counts = Object.fromEntries(statuses.map((status) => [status, 0]));
  all.forEach(({ scenario }) => {
    counts[state.scenarios[scenario.id].status] += 1;
  });

  const approved = counts["Aprovado"];
  const done = approved + counts["N/A"];
  const openIssues = all.filter(({ scenario }) => isIssue(state.scenarios[scenario.id])).length;

  els.summaryGrid.innerHTML = [
    summaryCard(all.length, "Cenários"),
    summaryCard(`${percent(done, all.length)}%`, "Conclusão"),
    summaryCard(approved, "Aprovados"),
    summaryCard(counts["Em teste"], "Em teste"),
    summaryCard(counts["Bloqueado"], "Bloqueados"),
    summaryCard(openIssues, "Pendências"),
  ].join("");

  els.processProgress.innerHTML = catalog
    .map((process) => {
      const scenarios = getAllScenarios().filter((item) => item.process.id === process.id);
      const completed = scenarios.filter(({ scenario }) => {
        const status = state.scenarios[scenario.id].status;
        return status === "Aprovado" || status === "N/A";
      }).length;
      const progress = percent(completed, scenarios.length);
      return `
        <div class="process-progress-row">
          <strong>${process.name}</strong>
          <div class="progress-track" aria-label="Progresso de ${process.name}">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
          <span>${progress}%</span>
        </div>
      `;
    })
    .join("");
}

function summaryCard(value, label) {
  return `<article class="summary-card"><strong>${value}</strong><span>${label}</span></article>`;
}

function renderChecklist() {
  const filtered = getFilteredScenarios();
  els.scenarioCount.textContent = `${filtered.length} cenário(s)`;

  els.checklist.innerHTML = catalog
    .map((process) => {
      const features = process.features
        .map((feature) => {
          const scenarios = feature.scenarios.filter((scenario) =>
            filtered.some((item) => item.scenario.id === scenario.id)
          );
          if (!scenarios.length) return "";

          return `
            <div class="feature-group">
              <h3>${feature.name}</h3>
              ${scenarios
                .map((scenario) => {
                  const data = state.scenarios[scenario.id];
                  return `
                    <div class="scenario-row">
                      <div>
                        <strong>${scenario.name}</strong>
                        <p class="muted">${scenario.acceptance}</p>
                      </div>
                      <span class="status-pill ${statusClass(data.status)}">${data.status}</span>
                      <span>${data.owner || "Sem responsável"}</span>
                      <button type="button" class="ghost-button" data-select-scenario="${scenario.id}">Executar</button>
                    </div>
                  `;
                })
                .join("")}
            </div>
          `;
        })
        .join("");

      if (!features) return "";
      return `
        <article class="process-card">
          <div class="process-header">
            <h2>${process.name}</h2>
            <span>${processCompletion(process.id)}% concluído</span>
          </div>
          ${features}
        </article>
      `;
    })
    .join("") || `<div class="empty-state">Nenhum cenário encontrado para os filtros atuais.</div>`;
}

function processCompletion(processId) {
  const scenarios = getAllScenarios().filter((item) => item.process.id === processId);
  const completed = scenarios.filter(({ scenario }) => {
    const status = state.scenarios[scenario.id].status;
    return status === "Aprovado" || status === "N/A";
  }).length;
  return percent(completed, scenarios.length);
}

function renderExecution() {
  const filtered = getFilteredScenarios();
  if (!filtered.some((item) => item.scenario.id === selectedScenarioId) && filtered.length) {
    selectedScenarioId = filtered[0].scenario.id;
  }

  els.scenarioList.innerHTML = filtered
    .map(({ process, feature, scenario }) => {
      const data = state.scenarios[scenario.id];
      const active = scenario.id === selectedScenarioId ? "active" : "";
      return `
        <article class="scenario-card ${active}">
          <button type="button" data-select-scenario="${scenario.id}">
            <strong>${scenario.name}</strong>
            <p class="muted">${process.name} / ${feature.name}</p>
            <span class="status-pill ${statusClass(data.status)}">${data.status}</span>
          </button>
        </article>
      `;
    })
    .join("") || `<div class="empty-state">Nenhum cenário para executar.</div>`;

  const selected = getAllScenarios().find((item) => item.scenario.id === selectedScenarioId);
  if (!selected) {
    els.scenarioDetail.innerHTML = `<div class="empty-state">Selecione um cenário.</div>`;
    return;
  }

  const data = state.scenarios[selected.scenario.id];
  els.scenarioDetail.innerHTML = `
    <p class="eyebrow">${selected.process.name} / ${selected.feature.name}</p>
    <h2>${selected.scenario.name}</h2>
    <p>${selected.scenario.acceptance}</p>
    <h3>Passos de teste</h3>
    <ol class="steps-list">
      ${selected.scenario.steps.map((step) => `<li>${step}</li>`).join("")}
    </ol>
    <div class="detail-grid" data-scenario-form="${selected.scenario.id}">
      <label>
        Status
        <select data-field="status">
          ${statuses.map((status) => `<option value="${status}">${status}</option>`).join("")}
        </select>
      </label>
      <label>
        Responsável
        <input data-field="owner" type="text">
      </label>
      <label>
        Data de execução
        <input data-field="date" type="date">
      </label>
      <label>
        Ambiente testado
        <input data-field="environment" type="text">
      </label>
      <label>
        Severidade da pendência
        <select data-field="severity">
          <option>Baixa</option>
          <option>Média</option>
          <option>Alta</option>
          <option>Crítica</option>
        </select>
      </label>
      <label class="full-width">
        Evidência
        <textarea data-field="evidence" rows="3" placeholder="Link, caminho do arquivo, print, observação"></textarea>
      </label>
      <label class="full-width">
        Defeitos / pendências
        <textarea data-field="issues" rows="3"></textarea>
      </label>
      <label class="full-width">
        Observações
        <textarea data-field="notes" rows="3"></textarea>
      </label>
    </div>
  `;

  els.scenarioDetail.querySelectorAll("[data-field]").forEach((field) => {
    field.value = data[field.dataset.field] || "";
  });
}

function renderIssues() {
  const issues = getAllScenarios().filter(({ scenario }) => isIssue(state.scenarios[scenario.id]));
  if (!issues.length) {
    els.issuesList.innerHTML = `<div class="empty-state">Nenhuma pendência registrada.</div>`;
    return;
  }

  els.issuesList.innerHTML = `<div class="issue-grid">${issues
    .map(({ process, feature, scenario }) => {
      const data = state.scenarios[scenario.id];
      const blockedClass = data.status === "Bloqueado" ? "blocked" : "";
      return `
        <article class="issue-card ${blockedClass}">
          <p class="eyebrow">${data.severity || "Média"} / ${data.status}</p>
          <h3>${scenario.name}</h3>
          <p><strong>Macroprocesso:</strong> ${process.name}</p>
          <p><strong>Funcionalidade:</strong> ${feature.name}</p>
          <p><strong>Responsável:</strong> ${data.owner || "Não informado"}</p>
          <p><strong>Pendência:</strong> ${data.issues || "Status exige atenção, mas a pendência ainda não foi descrita."}</p>
          ${data.evidence ? `<p><strong>Evidência:</strong> ${data.evidence}</p>` : ""}
          <button type="button" class="ghost-button" data-select-scenario="${scenario.id}">Abrir cenário</button>
        </article>
      `;
    })
    .join("")}</div>`;
}

function isIssue(data) {
  return ["Reprovado", "Bloqueado"].includes(data.status) || Boolean(data.issues.trim());
}

function renderSignatures() {
  if (!state.signatures.length) {
    els.signaturesList.innerHTML = `<div class="empty-state">Nenhuma assinatura registrada.</div>`;
    return;
  }

  const template = document.getElementById("signatureTemplate");
  els.signaturesList.innerHTML = "";
  state.signatures.forEach((signature, index) => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector(".signature-card");
    card.dataset.signatureIndex = index;
    card.querySelectorAll("[data-field]").forEach((field) => {
      field.value = signature[field.dataset.field] || "";
    });
    els.signaturesList.appendChild(node);
  });
}

function updateScenario(id, field, value) {
  state.scenarios[id][field] = value;
  persist();
  renderDashboard();
  renderChecklist();
  renderIssues();
  if (field === "status") {
    renderExecution();
  }
}

function exportJson() {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  downloadBlob(blob, `signoff-lubit-${dateStamp()}.json`);
}

function exportMarkdown() {
  const all = getAllScenarios();
  const lines = [
    `# ${state.project.name}`,
    "",
    `Cliente/unidade: ${state.project.client || "Não informado"}`,
    `Ambiente: ${state.project.environment || "Não informado"}`,
    `Atualizado em: ${new Date(state.updatedAt).toLocaleString("pt-BR")}`,
    "",
    "## Resumo",
    "",
    `- Cenários: ${all.length}`,
    `- Conclusão: ${percent(
      all.filter(({ scenario }) => ["Aprovado", "N/A"].includes(state.scenarios[scenario.id].status)).length,
      all.length
    )}%`,
    `- Pendências: ${all.filter(({ scenario }) => isIssue(state.scenarios[scenario.id])).length}`,
    "",
  ];

  catalog.forEach((process) => {
    lines.push(`## ${process.name}`, "");
    process.features.forEach((feature) => {
      lines.push(`### ${feature.name}`, "");
      feature.scenarios.forEach((scenario) => {
        const data = state.scenarios[scenario.id];
        lines.push(`#### ${scenario.name}`);
        lines.push(`- Status: ${data.status}`);
        lines.push(`- Responsável: ${data.owner || "Não informado"}`);
        lines.push(`- Data: ${data.date || "Não informada"}`);
        lines.push(`- Critério de aceite: ${scenario.acceptance}`);
        lines.push(`- Evidência: ${data.evidence || "Não informada"}`);
        lines.push(`- Pendências: ${data.issues || "Nenhuma"}`);
        lines.push("");
      });
    });
  });

  lines.push("## Assinaturas", "");
  if (!state.signatures.length) {
    lines.push("Nenhuma assinatura registrada.", "");
  } else {
    state.signatures.forEach((signature) => {
      lines.push(
        `- ${signature.area || "Área não informada"}: ${signature.name || "Nome não informado"} / ${
          signature.role || "Cargo não informado"
        } / ${signature.date || "Data não informada"}`
      );
    });
  }

  const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
  downloadBlob(blob, `signoff-lubit-${dateStamp()}.md`);
}

function generateReport() {
  const reportWindow = window.open("", "_blank");
  if (!reportWindow) {
    alert("Permita pop-ups para gerar o relatório.");
    return;
  }

  const all = getAllScenarios();
  const completed = all.filter(({ scenario }) =>
    ["Aprovado", "N/A"].includes(state.scenarios[scenario.id].status)
  ).length;
  const issues = all.filter(({ scenario }) => isIssue(state.scenarios[scenario.id]));

  reportWindow.document.write(`
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <title>Relatório de Sign-off Lubit</title>
        <style>
          body { font-family: Arial, Helvetica, sans-serif; color: #1d252c; margin: 32px; }
          h1 { margin-bottom: 4px; }
          h2 { margin-top: 28px; border-bottom: 1px solid #d8e0e7; padding-bottom: 6px; }
          table { width: 100%; border-collapse: collapse; margin: 12px 0 20px; }
          th, td { border: 1px solid #d8e0e7; padding: 8px; text-align: left; vertical-align: top; }
          th { background: #eef2f5; }
          .meta { color: #65727e; }
          .status { font-weight: 700; }
          @media print { body { margin: 16px; } }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(state.project.name)}</h1>
        <p class="meta">Cliente/unidade: ${escapeHtml(state.project.client || "Não informado")}</p>
        <p class="meta">Ambiente: ${escapeHtml(state.project.environment || "Não informado")}</p>
        <p class="meta">Atualizado em: ${new Date(state.updatedAt).toLocaleString("pt-BR")}</p>
        <h2>Resumo executivo</h2>
        <table>
          <tr><th>Cenários</th><th>Conclusão</th><th>Pendências</th></tr>
          <tr><td>${all.length}</td><td>${percent(completed, all.length)}%</td><td>${issues.length}</td></tr>
        </table>
        <h2>Checklist completo</h2>
        ${catalog
          .map(
            (process) => `
              <h3>${escapeHtml(process.name)}</h3>
              <table>
                <thead>
                  <tr><th>Funcionalidade</th><th>Cenário</th><th>Status</th><th>Responsável</th><th>Evidência</th><th>Pendências</th></tr>
                </thead>
                <tbody>
                  ${process.features
                    .flatMap((feature) =>
                      feature.scenarios.map((scenario) => {
                        const data = state.scenarios[scenario.id];
                        return `
                          <tr>
                            <td>${escapeHtml(feature.name)}</td>
                            <td>${escapeHtml(scenario.name)}<br><span class="meta">${escapeHtml(scenario.acceptance)}</span></td>
                            <td class="status">${escapeHtml(data.status)}</td>
                            <td>${escapeHtml(data.owner || "")}</td>
                            <td>${escapeHtml(data.evidence || "")}</td>
                            <td>${escapeHtml(data.issues || "")}</td>
                          </tr>
                        `;
                      })
                    )
                    .join("")}
                </tbody>
              </table>
            `
          )
          .join("")}
        <h2>Pendências abertas</h2>
        ${
          issues.length
            ? `<table><thead><tr><th>Severidade</th><th>Status</th><th>Cenário</th><th>Responsável</th><th>Pendência</th></tr></thead><tbody>${issues
                .map(({ scenario }) => {
                  const data = state.scenarios[scenario.id];
                  return `<tr><td>${escapeHtml(data.severity || "")}</td><td>${escapeHtml(data.status)}</td><td>${escapeHtml(
                    scenario.name
                  )}</td><td>${escapeHtml(data.owner || "")}</td><td>${escapeHtml(data.issues || "")}</td></tr>`;
                })
                .join("")}</tbody></table>`
            : "<p>Nenhuma pendência aberta.</p>"
        }
        <h2>Assinaturas</h2>
        ${
          state.signatures.length
            ? `<table><thead><tr><th>Área</th><th>Nome</th><th>Cargo</th><th>Data</th><th>Observações</th></tr></thead><tbody>${state.signatures
                .map(
                  (signature) =>
                    `<tr><td>${escapeHtml(signature.area || "")}</td><td>${escapeHtml(signature.name || "")}</td><td>${escapeHtml(
                      signature.role || ""
                    )}</td><td>${escapeHtml(signature.date || "")}</td><td>${escapeHtml(signature.notes || "")}</td></tr>`
                )
                .join("")}</tbody></table>`
            : "<p>Nenhuma assinatura registrada.</p>"
        }
      </body>
    </html>
  `);
  reportWindow.document.close();
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(`${tab.dataset.tab}Panel`).classList.add("active");
  });
});

[els.projectName, els.projectClient, els.projectEnvironment].forEach((field) => {
  field.addEventListener("input", () => {
    state.project = {
      name: els.projectName.value,
      client: els.projectClient.value,
      environment: els.projectEnvironment.value,
    };
    persist();
  });
});

[els.processFilter, els.statusFilter, els.searchFilter].forEach((field) => {
  field.addEventListener("input", render);
});

document.body.addEventListener("click", (event) => {
  const scenarioButton = event.target.closest("[data-select-scenario]");
  if (scenarioButton) {
    selectedScenarioId = scenarioButton.dataset.selectScenario;
    document.querySelector('[data-tab="execution"]').click();
    renderExecution();
    return;
  }

  if (event.target.dataset.action === "remove-signature") {
    const index = Number(event.target.closest(".signature-card").dataset.signatureIndex);
    state.signatures.splice(index, 1);
    persist();
    renderSignatures();
  }
});

els.scenarioDetail.addEventListener("input", (event) => {
  const field = event.target.closest("[data-field]");
  const form = event.target.closest("[data-scenario-form]");
  if (!field || !form) return;
  updateScenario(form.dataset.scenarioForm, field.dataset.field, field.value);
});

els.signaturesList.addEventListener("input", (event) => {
  const field = event.target.closest("[data-field]");
  const card = event.target.closest(".signature-card");
  if (!field || !card) return;
  state.signatures[Number(card.dataset.signatureIndex)][field.dataset.field] = field.value;
  persist();
});

document.getElementById("addSignatureBtn").addEventListener("click", () => {
  state.signatures.push({ area: "", name: "", role: "", date: "", notes: "" });
  persist();
  renderSignatures();
});

document.getElementById("exportBtn").addEventListener("click", exportJson);
document.getElementById("markdownBtn").addEventListener("click", exportMarkdown);
document.getElementById("reportBtn").addEventListener("click", generateReport);
document.getElementById("importBtn").addEventListener("click", () => els.importFile.click());

els.importFile.addEventListener("change", async () => {
  const file = els.importFile.files[0];
  if (!file) return;
  try {
    state = normalizeState(JSON.parse(await file.text()));
    persist();
    render();
  } catch {
    alert("Arquivo JSON inválido.");
  } finally {
    els.importFile.value = "";
  }
});

document.getElementById("newProjectBtn").addEventListener("click", () => {
  if (!confirm("Criar um novo projeto em branco? Exporte o JSON atual antes se quiser preservar os dados.")) return;
  state = createInitialState();
  persist();
  render();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  if (!confirm("Limpar preenchimento do checklist e assinaturas?")) return;
  const project = { ...state.project };
  state = createInitialState();
  state.project = project;
  persist();
  render();
});

render();
