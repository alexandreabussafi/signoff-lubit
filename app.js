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

const acceptanceGates = [
  {
    id: "gate-1",
    name: "Gate 1",
    title: "Ambiente e dados migrados",
    phase: "Preparação",
    processIds: ["implantacao"],
    objective:
      "Confirmar ambiente disponível, migrations aplicadas, usuários/unidades e dados mestres mínimos migrados.",
  },
  {
    id: "gate-2",
    name: "Gate 2",
    title: "Cadastros críticos validados",
    phase: "Migração e dados mestres",
    processIds: ["cadastros"],
    objective:
      "Validar cadastros administrativos, operacionais, materiais e estrutura industrial usados pelos fluxos críticos.",
  },
  {
    id: "gate-3",
    name: "Gate 3",
    title: "Fluxos operacionais aprovados",
    phase: "Validação funcional",
    processIds: ["operacionais"],
    objective:
      "Aprovar geração, consulta, retorno, OS extraordinária, notas, parada preventiva e estoque.",
  },
  {
    id: "gate-4",
    name: "Gate 4",
    title: "Integrações e relatórios validados",
    phase: "Operação assistida",
    processIds: ["integracoes", "consultas"],
    objective:
      "Confirmar importações, SAP, logs, relatórios, gráficos, mapas e recursos de apoio.",
  },
  {
    id: "gate-5",
    name: "Gate 5",
    title: "Assinatura final",
    phase: "Sign-off final",
    processIds: ["implantacao", "cadastros", "operacionais", "integracoes", "consultas"],
    objective:
      "Formalizar aceite com pendências conhecidas, riscos registrados e assinaturas das áreas responsáveis.",
  },
];

const acceptancePhases = [
  {
    name: "Preparação",
    description:
      "Definir ambiente, escopo, responsáveis, dados de entrada e evidências mínimas para iniciar o aceite.",
  },
  {
    name: "Migração e dados mestres",
    description:
      "Validar base técnica, usuários, unidades, plano de lubrificação, estrutura industrial e cadastros críticos.",
  },
  {
    name: "Validação funcional",
    description:
      "Executar roteiros UAT dos fluxos transacionais que sustentam operação, retorno e gestão de OS.",
  },
  {
    name: "Operação assistida",
    description:
      "Validar integrações, relatórios, logs e recursos de apoio com dados representativos da rotina.",
  },
  {
    name: "Pendências",
    description:
      "Classificar defeitos, bloqueios, riscos e itens aceitos com ressalva antes da assinatura final.",
  },
  {
    name: "Sign-off final",
    description:
      "Emitir relatório de aceite, consolidar evidências e registrar assinatura das áreas participantes.",
  },
];

const processProfiles = {
  implantacao: {
    type: "Preparação",
    criticality: "Crítica",
    owner: "TI / Implantação",
    evidence: "Prints de ambiente, logs de migration, amostra de dados migrados e checklist técnico.",
  },
  cadastros: {
    type: "Cadastro",
    criticality: "Alta",
    owner: "Key user / Administração",
    evidence: "Prints de cadastro, consulta, edição e amostra de registros validados.",
  },
  operacionais: {
    type: "Transacional",
    criticality: "Crítica",
    owner: "Operação / Manutenção",
    evidence: "Número de OS, prints do fluxo executado, PDF/relatório e histórico de retorno.",
  },
  integracoes: {
    type: "Integração",
    criticality: "Crítica",
    owner: "TI / Integrações / SAP",
    evidence: "Arquivo importado, protocolo/log, status SAP, documentos retornados e divergências tratadas.",
  },
  consultas: {
    type: "Relatório / Apoio",
    criticality: "Média",
    owner: "Gestão / Operação",
    evidence: "Prints de filtros, relatório gerado, dashboard ou mapa com período/unidade identificados.",
  },
};

const processGroups = [
  {
    id: "dados",
    title: "Preparar a entrega",
    shortTitle: "Dados iniciais",
    icon: "boxes",
    color: "teal",
    processIds: ["implantacao", "cadastros"],
    summary: "Ambiente, usuários, plano e estrutura.",
    objective: "Ambiente, usuários, cadastros, plano e estrutura prontos para testar.",
  },
  {
    id: "operacao",
    title: "Validar a operação",
    shortTitle: "Operação principal",
    icon: "wrench",
    color: "blue",
    processIds: ["operacionais"],
    summary: "Plano, OS, retorno, notas e estoque.",
    objective: "Plano, tarefas, geração de OS, retorno, extraordinária, notas e estoque funcionando.",
  },
  {
    id: "apoio",
    title: "Assinar o aceite",
    shortTitle: "Apoio e integrações",
    icon: "plug",
    color: "violet",
    processIds: ["integracoes", "consultas"],
    summary: "Importações, SAP, relatórios e assinatura.",
    objective: "Importações, SAP, relatórios, logs, mapas e pendências fechados para assinatura.",
  },
];

const optionalNaScenarioIds = [
  "upload-xml",
  "configurar-alarmes",
  "mapas-validacao",
  "sap-integrar-os",
  "sap-reintegracao",
];

let state = loadState();
let selectedScenarioId = getAllScenarios()[0].scenario.id;
let selectedProcessGroupId = processGroups[0].id;
let journeyViewMode = "lines";
let isDrawerOpen = false;

const els = {
  projectName: document.getElementById("projectName"),
  projectClient: document.getElementById("projectClient"),
  projectEnvironment: document.getElementById("projectEnvironment"),
  processFilter: document.getElementById("processFilter"),
  statusFilter: document.getElementById("statusFilter"),
  searchFilter: document.getElementById("searchFilter"),
  journeySummary: document.getElementById("journeySummary"),
  journeySteps: document.getElementById("journeySteps"),
  journeyLines: document.getElementById("journeyLines"),
  journeyViewToggle: document.getElementById("journeyViewToggle"),
  journeyDetail: document.getElementById("journeyDetail"),
  drawerBackdrop: document.getElementById("drawerBackdrop"),
  scenarioDrawer: document.getElementById("scenarioDrawer"),
  reportSummary: document.getElementById("reportSummary"),
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
  renderJourney();
  renderIssues();
  renderReport();
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

function renderJourney() {
  const all = getAllScenarios();
  const completed = all.filter(({ scenario }) =>
    ["Aprovado", "N/A"].includes(state.scenarios[scenario.id].status)
  ).length;
  const approved = all.filter(({ scenario }) => state.scenarios[scenario.id].status === "Aprovado").length;
  const issues = all.filter(({ scenario }) => isIssue(state.scenarios[scenario.id])).length;
  const progress = percent(completed, all.length);

  els.journeySummary.innerHTML = [
    metricCard("check", `${progress}%`, "Progresso"),
    metricCard("shield", approved, "Aprovados"),
    metricCard("alert", issues, "Pendências"),
    metricCard("signature", state.signatures.length, "Assinaturas"),
  ].join("");

  if (!processGroups.some((group) => group.id === selectedProcessGroupId)) {
    selectedProcessGroupId = processGroups[0].id;
  }
  els.journeyViewToggle.querySelectorAll("[data-view-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.viewMode === journeyViewMode);
  });
  els.journeySteps.innerHTML = processGroups.map(renderJourneyGroup).join("");
  renderJourneyLines();
  renderSimpleScenarioDetail();
}

function renderJourneyGroup(group) {
  const scenarios = getAllScenarios().filter(({ process }) => group.processIds.includes(process.id));
  const completed = scenarios.filter(({ scenario }) =>
    ["Aprovado", "N/A"].includes(state.scenarios[scenario.id].status)
  ).length;
  const groupIssues = scenarios.filter(({ scenario }) => isIssue(state.scenarios[scenario.id])).length;
  const next = scenarios.find(({ scenario }) => !["Aprovado", "N/A"].includes(state.scenarios[scenario.id].status));
  const progress = percent(completed, scenarios.length);
  const isActive = selectedProcessGroupId === group.id;

  return `
    <article class="journey-card ${group.color} ${isActive ? "active" : ""}" role="button" tabindex="0" data-select-group="${group.id}">
      <span class="journey-icon">${renderIcon(group.icon)}</span>
      <div class="journey-card-body">
        <div class="journey-card-header">
          <div>
            <p class="eyebrow">${group.shortTitle}</p>
            <h3>${group.title}</h3>
          </div>
          <strong class="journey-percent">${progress}%</strong>
        </div>
        <p>${group.summary || group.objective}</p>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <div class="journey-card-footer">
          <span>${completed}/${scenarios.length} concluídos</span>
          <span>${groupIssues} pendência(s)</span>
          <span class="${next ? "next-label" : "done-label"}">${next ? "Abrir bloco" : "Bloco concluído"}</span>
        </div>
      </div>
    </article>
  `;
}

function renderJourneyLines() {
  const group = processGroups.find((item) => item.id === selectedProcessGroupId) || processGroups[0];
  const filtered = getFilteredScenarios().filter(({ process }) => group.processIds.includes(process.id));
  const allInGroup = getAllScenarios().filter(({ process }) => group.processIds.includes(process.id));
  const selectedInGroup = allInGroup.some(({ scenario }) => scenario.id === selectedScenarioId);

  if (!selectedInGroup && filtered.length) {
    selectedScenarioId =
      filtered.find(({ scenario }) => !["Aprovado", "N/A"].includes(state.scenarios[scenario.id].status))?.scenario.id ||
      filtered[0].scenario.id;
  }

  if (!filtered.length) {
    els.journeyLines.innerHTML = `
      <section class="journey-line-panel ${group.color}">
        <header class="journey-line-header">
          <div>
            <p class="eyebrow">${group.shortTitle}</p>
            <h3>${group.title}</h3>
          </div>
          <span class="status-pill status-nao-iniciado">0 itens</span>
        </header>
        <div class="empty-state">Nenhum cenário encontrado para os filtros atuais.</div>
      </section>
    `;
    return;
  }

  if (journeyViewMode === "kanban") {
    els.journeyLines.innerHTML = `
      <section class="journey-line-panel ${group.color}">
        ${journeyPanelHeader(group, filtered.length, allInGroup.length)}
        <div class="journey-kanban-wrap">
          ${renderKanbanBoard(filtered, "journey-kanban")}
        </div>
      </section>
    `;
    return;
  }

  els.journeyLines.innerHTML = `
    <section class="journey-line-panel ${group.color}">
      ${journeyPanelHeader(group, filtered.length, allInGroup.length)}
      <div class="journey-line-list">
        ${filtered
          .map(({ feature, scenario }, index) => {
            const data = state.scenarios[scenario.id];
            const isActive = scenario.id === selectedScenarioId;
            return `
              <button type="button" class="journey-line ${isActive ? "active" : ""}" data-select-scenario="${scenario.id}">
                <span class="journey-line-index">${String(index + 1).padStart(2, "0")}</span>
                <span class="journey-line-main">
                  <strong>${scenario.name}</strong>
                  <small>${feature.name}</small>
                </span>
                <span class="journey-line-meta">${data.owner || "Sem responsável"}</span>
                <span class="status-pill ${statusClass(data.status)}">${data.status}</span>
              </button>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function journeyPanelHeader(group, visibleCount, totalCount) {
  return `
    <header class="journey-line-header">
      <div>
        <p class="eyebrow">${group.shortTitle}</p>
        <h3>${group.title}</h3>
        <span>${visibleCount}/${totalCount} cenário(s) nesta visão</span>
      </div>
      <span class="journey-line-icon">${renderIcon(group.icon)}</span>
    </header>
  `;
}

function renderKanbanBoard(rows, extraClass = "") {
  const columns = [
    { id: "todo", title: "Não iniciado", icon: "circle", match: (data) => data.status === "Não iniciado" },
    { id: "testing", title: "Em teste", icon: "timer", match: (data) => data.status === "Em teste" },
    { id: "done", title: "Aprovado", icon: "check", match: (data) => data.status === "Aprovado" },
    { id: "issue", title: "Pendência", icon: "alert", match: (data) => ["Reprovado", "Bloqueado"].includes(data.status) || Boolean(data.issues.trim()) },
    { id: "na", title: "N/A", icon: "minus", match: (data) => data.status === "N/A" },
  ];

  return `<div class="kanban-board ${extraClass}">${columns
    .map((column) => {
      const cards = rows.filter(({ scenario }) => column.match(state.scenarios[scenario.id]));
      return `
        <section class="kanban-column ${column.id}">
          <header>
            <span>${renderIcon(column.icon)}</span>
            <strong>${column.title}</strong>
            <em>${cards.length}</em>
          </header>
          <div class="kanban-cards">
            ${
              cards
                .map(({ process, feature, scenario }) => {
                  const data = state.scenarios[scenario.id];
                  const group = getProcessGroup(process.id);
                  return `
                    <button type="button" class="kanban-card ${group.color}" data-select-scenario="${scenario.id}">
                      <span class="kanban-tag">${renderIcon(group.icon)} ${group.shortTitle}</span>
                      <strong>${scenario.name}</strong>
                      <small>${feature.name}</small>
                      <span class="status-pill ${statusClass(data.status)}">${data.status}</span>
                    </button>
                  `;
                })
                .join("") || `<p class="empty-column">Sem itens</p>`
            }
          </div>
        </section>
      `;
    })
    .join("")}</div>`;
}

function renderKanban() {
  return renderKanbanBoard(getFilteredScenarios());
}

function renderReport() {
  const all = getAllScenarios();
  const completed = all.filter(({ scenario }) =>
    ["Aprovado", "N/A"].includes(state.scenarios[scenario.id].status)
  ).length;
  const issues = all.filter(({ scenario }) => isIssue(state.scenarios[scenario.id])).length;
  const progress = percent(completed, all.length);
  const signatureStatus = state.signatures.length ? "Aceite com assinatura registrada" : "Aguardando assinatura";

  els.reportSummary.innerHTML = `
    <article class="report-card report-package">
      <div class="report-icon">${renderIcon("file")}</div>
      <div>
        <p class="eyebrow">Pacote de aceite</p>
        <h3>${progress}% concluído</h3>
        <p>${completed}/${all.length} cenários finalizados, ${issues} pendência(s), ${signatureStatus.toLowerCase()}.</p>
      </div>
    </article>
    <div class="report-actions">
      <button type="button" class="export-tile html" id="reportBtnInline">
        <span>${renderIcon("file")}</span>
        <strong>Relatório HTML</strong>
        <small>Abre o documento formal para imprimir ou salvar em PDF.</small>
      </button>
      <button type="button" class="export-tile markdown" id="markdownBtnInline">
        <span>${renderIcon("markdown")}</span>
        <strong>Markdown</strong>
        <small>Exporta o mesmo aceite em formato editável.</small>
      </button>
      <button type="button" class="export-tile json" id="exportBtnInline">
        <span>${renderIcon("download")}</span>
        <strong>JSON</strong>
        <small>Backup do preenchimento e pacote de evidências.</small>
      </button>
    </div>
  `;

  document.getElementById("reportBtnInline").addEventListener("click", generateReport);
  document.getElementById("markdownBtnInline").addEventListener("click", exportMarkdown);
  document.getElementById("exportBtnInline").addEventListener("click", exportJson);
}

function renderSimpleScenarioDetail() {
  const selected = getAllScenarios().find((item) => item.scenario.id === selectedScenarioId);
  if (!isDrawerOpen || !selected) {
    closeScenarioDrawer(false);
    return;
  }

  const data = state.scenarios[selected.scenario.id];
  const meta = getScenarioMeta(selected.process, selected.feature, selected.scenario);
  const group = getProcessGroup(selected.process.id);

  openScenarioDrawer(false);
  els.journeyDetail.innerHTML = `
    <article class="drawer-scenario ${group.color}" data-scenario-form="${selected.scenario.id}">
      <header class="drawer-header">
        <span class="scenario-focus-icon">${renderIcon(group.icon)}</span>
        <div>
          <p class="eyebrow">${group.shortTitle} / ${selected.feature.name}</p>
          <h2>${selected.scenario.name}</h2>
        </div>
        <span class="status-pill ${statusClass(data.status)}">${data.status}</span>
        <button type="button" class="icon-button" data-action="close-drawer" aria-label="Fechar editor">${renderIcon("x")}</button>
      </header>
      <div class="quick-status-actions" aria-label="Ações rápidas de status">
        <button type="button" class="quick-status approve" data-set-status="Aprovado">${renderIcon("check")} Aprovar</button>
        <button type="button" class="quick-status testing" data-set-status="Em teste">${renderIcon("timer")} Em teste</button>
        <button type="button" class="quick-status reject" data-set-status="Reprovado">${renderIcon("alert")} Reprovar</button>
        <button type="button" class="quick-status block" data-set-status="Bloqueado">${renderIcon("shield")} Bloquear</button>
        <button type="button" class="quick-status neutral" data-set-status="N/A">${renderIcon("minus")} N/A</button>
      </div>
      <div class="focus-grid drawer-route">
        <section>
          <h3>Objetivo</h3>
          <p>${selected.scenario.acceptance}</p>
        </section>
        <section>
          <h3>Resultado esperado</h3>
          <p>${meta.expectedResult}</p>
        </section>
      </div>
      <section>
        <h3>Passos rápidos</h3>
        <ol class="steps-list compact-list">
          ${selected.scenario.steps.map((step) => `<li>${step}</li>`).join("")}
        </ol>
      </section>
      <div class="detail-grid drawer-form" data-scenario-form="${selected.scenario.id}">
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
          Data
          <input data-field="date" type="date">
        </label>
        <label>
          Severidade
          <select data-field="severity">
            <option>Baixa</option>
            <option>Média</option>
            <option>Alta</option>
            <option>Crítica</option>
          </select>
        </label>
        <label class="full-width">
          Ambiente testado
          <input data-field="environment" type="text">
        </label>
        <label class="full-width">
          Evidência
          <textarea data-field="evidence" rows="2" placeholder="Link, print, arquivo ou observação"></textarea>
        </label>
        <label class="full-width">
          Pendência
          <textarea data-field="issues" rows="2" placeholder="Descreva somente se houver bloqueio ou ressalva"></textarea>
        </label>
        <label class="full-width">
          Observações
          <textarea data-field="notes" rows="2" placeholder="Contexto, ressalva ou orientação para o aceite"></textarea>
        </label>
      </div>
    </article>
  `;

  els.journeyDetail.querySelectorAll("[data-field]").forEach((field) => {
    field.value = data[field.dataset.field] || "";
  });
}

function openScenarioDrawer(renderNow = true) {
  isDrawerOpen = true;
  els.drawerBackdrop.hidden = false;
  els.drawerBackdrop.classList.add("open");
  els.scenarioDrawer.classList.add("open");
  els.scenarioDrawer.setAttribute("aria-hidden", "false");
  if (renderNow) renderSimpleScenarioDetail();
}

function closeScenarioDrawer(renderNow = true) {
  isDrawerOpen = false;
  els.drawerBackdrop.classList.remove("open");
  els.scenarioDrawer.classList.remove("open");
  els.scenarioDrawer.setAttribute("aria-hidden", "true");
  window.setTimeout(() => {
    if (!isDrawerOpen) els.drawerBackdrop.hidden = true;
  }, 180);
  if (renderNow) {
    els.journeyDetail.innerHTML = "";
  }
}

function metricCard(iconName, value, label) {
  return `
    <article class="summary-card metric-card">
      <span>${renderIcon(iconName)}</span>
      <div>
        <strong>${value}</strong>
        <small>${label}</small>
      </div>
    </article>
  `;
}

function getProcessGroup(processId) {
  return processGroups.find((group) => group.processIds.includes(processId)) || processGroups[0];
}

function renderIcon(name) {
  const icons = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    signature: '<path d="M3 21c3-5 6-5 9 0 3-5 6-5 9 0"/><path d="M7 13 17 3l4 4-10 10H7v-4Z"/>',
    boxes: '<path d="M3 7.5 12 3l9 4.5-9 4.5L3 7.5Z"/><path d="M3 7.5v9L12 21v-9"/><path d="M21 7.5v9L12 21"/><path d="M12 12v9"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.4 2.4-3-3 2.4-2.4Z"/>',
    plug: '<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M7 8h10v4a5 5 0 0 1-10 0V8Z"/>',
    circle: '<circle cx="12" cy="12" r="8"/>',
    timer: '<path d="M10 2h4"/><path d="M12 14l3-3"/><circle cx="12" cy="13" r="8"/>',
    minus: '<path d="M5 12h14"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h5"/>',
    markdown: '<path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path d="M6 15V9l3 3 3-3v6"/><path d="M15 9v6"/><path d="m18 12-3 3-3-3"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  };
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icons[name] || icons.circle}</svg>`;
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

  els.dashboardGates.innerHTML = acceptanceGates.map(renderGateCard).join("");

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

function renderMethodology() {
  const gatesHtml = acceptanceGates.map(renderGateCard).join("");
  const phasesHtml = acceptancePhases
    .map(
      (phase, index) => `
        <article class="phase-card">
          <span class="phase-index">${index + 1}</span>
          <div>
            <h3>${phase.name}</h3>
            <p>${phase.description}</p>
          </div>
        </article>
      `
    )
    .join("");

  els.methodology.innerHTML = `
    <section class="framework-section">
      <h2>Fases do aceite</h2>
      <div class="phase-grid">${phasesHtml}</div>
    </section>
    <section class="framework-section">
      <h2>Gates de aprovação</h2>
      <div class="gates-grid">${gatesHtml}</div>
    </section>
    <section class="framework-section">
      <h2>Pacote de evidências</h2>
      <div class="evidence-grid">
        <article><strong>Obrigatório</strong><p>Status, responsável, data, ambiente e evidência para cenários aprovados.</p></article>
        <article><strong>Pendência</strong><p>Descrição, severidade, responsável e evidência para reprovados ou bloqueados.</p></article>
        <article><strong>Sign-off</strong><p>Assinaturas por área e relatório HTML/Markdown exportado ao final.</p></article>
      </div>
    </section>
  `;
}

function renderProcessMatrix() {
  const rows = getFilteredScenarios();
  els.matrixCount.textContent = `${rows.length} cenário(s)`;
  els.processMatrix.innerHTML = rows
    .map(({ process, feature, scenario }) => {
      const data = state.scenarios[scenario.id];
      const meta = getScenarioMeta(process, feature, scenario);
      return `
        <tr>
          <td>${meta.gate.name}</td>
          <td>${process.name}</td>
          <td>${feature.name}</td>
          <td>
            <strong>${scenario.name}</strong>
            <span class="table-note">${scenario.acceptance}</span>
          </td>
          <td>${meta.type}</td>
          <td>${meta.criticality}</td>
          <td>${meta.owner}</td>
          <td>${meta.evidence}</td>
          <td><span class="status-pill ${statusClass(data.status)}">${data.status}</span></td>
        </tr>
      `;
    })
    .join("") || `<tr><td colspan="9">Nenhum cenário encontrado para os filtros atuais.</td></tr>`;
}

function renderGateCard(gate) {
  const stats = getGateStats(gate);
  const isFinalGate = gate.id === "gate-5";
  const signatureReady = state.signatures.length > 0;
  const gateReady = isFinalGate ? stats.progress === 100 && signatureReady : stats.progress === 100;
  const statusText = gateReady ? "Aprovado" : stats.blocked ? "Bloqueado" : "Em validação";
  return `
    <article class="gate-card ${gateReady ? "ready" : ""}">
      <div class="gate-card-header">
        <span>${gate.name}</span>
        <strong>${stats.progress}%</strong>
      </div>
      <h3>${gate.title}</h3>
      <p>${gate.objective}</p>
      <div class="progress-track">
        <div class="progress-fill" style="width: ${stats.progress}%"></div>
      </div>
      <p class="gate-meta">${gate.phase} / ${statusText}${isFinalGate ? ` / ${state.signatures.length} assinatura(s)` : ""}</p>
    </article>
  `;
}

function getGateStats(gate) {
  const gateScenarios = getAllScenarios().filter(({ process }) => gate.processIds.includes(process.id));
  const completed = gateScenarios.filter(({ scenario }) =>
    ["Aprovado", "N/A"].includes(state.scenarios[scenario.id].status)
  ).length;
  const blocked = gateScenarios.some(({ scenario }) =>
    ["Bloqueado", "Reprovado"].includes(state.scenarios[scenario.id].status)
  );
  return {
    total: gateScenarios.length,
    completed,
    progress: percent(completed, gateScenarios.length),
    blocked,
  };
}

function getScenarioMeta(process, feature, scenario) {
  const profile = processProfiles[process.id];
  const gate = acceptanceGates.find((item) => item.processIds.includes(process.id)) || acceptanceGates[0];
  return {
    gate,
    type: scenario.type || profile.type,
    criticality: scenario.criticality || profile.criticality,
    owner: scenario.owner || profile.owner,
    evidence: scenario.evidence || profile.evidence,
    preconditions: getPreconditions(process.id),
    dataNeeded: getDataNeeded(process.id),
    expectedResult: scenario.expectedResult || scenario.acceptance,
  };
}

function getPreconditions(processId) {
  const map = {
    implantacao: "Ambiente definido, acesso liberado e base disponível para conferência.",
    cadastros: "Usuário com permissão de cadastro e dados de amostra definidos.",
    operacionais: "Unidade, estrutura, tarefas, materiais e responsáveis previamente cadastrados.",
    integracoes: "Arquivos ou credenciais de integração disponíveis e ambiente de teste definido.",
    consultas: "Dados operacionais existentes para filtros, relatórios, mapas ou logs.",
  };
  return map[processId];
}

function getDataNeeded(processId) {
  const map = {
    implantacao: "Credenciais, unidade alvo, evidências de migration e amostra da base migrada.",
    cadastros: "Registros de exemplo, perfis, unidades, materiais e parâmetros usados no Lubit.",
    operacionais: "Ativo/CILA, tarefa CIT, rota, material, responsável, datas e motivos de retorno.",
    integracoes: "Planilha/XML de teste, filtros SAP, OS elegíveis e logs esperados.",
    consultas: "Período, unidade, OS, ativo, relatório ou mapa representativo.",
  };
  return map[processId];
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
                  const meta = getScenarioMeta(process, feature, scenario);
                  return `
                    <div class="scenario-row">
                      <div>
                        <strong>${scenario.name}</strong>
                        <p class="muted">${scenario.acceptance}</p>
                        <p class="scenario-meta">${meta.gate.name} / ${meta.type} / ${meta.criticality}</p>
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
  const meta = getScenarioMeta(selected.process, selected.feature, selected.scenario);
  els.scenarioDetail.innerHTML = `
    <p class="eyebrow">${selected.process.name} / ${selected.feature.name}</p>
    <h2>${selected.scenario.name}</h2>
    <div class="uat-summary">
      <span>${meta.gate.name}: ${meta.gate.title}</span>
      <span>${meta.type}</span>
      <span>${meta.criticality}</span>
      <span>${meta.owner}</span>
    </div>
    <div class="uat-grid">
      <article>
        <strong>Pré-condições</strong>
        <p>${meta.preconditions}</p>
      </article>
      <article>
        <strong>Dados necessários</strong>
        <p>${meta.dataNeeded}</p>
      </article>
      <article>
        <strong>Resultado esperado</strong>
        <p>${meta.expectedResult}</p>
      </article>
      <article>
        <strong>Evidência esperada</strong>
        <p>${meta.evidence}</p>
      </article>
    </div>
    <h3>Critério objetivo de aceite</h3>
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
  renderJourney();
  renderIssues();
  renderReport();
}

function applyOptionalNaPreset() {
  const message = [
    "Aplicar N/A aos módulos opcionais?",
    "",
    "Serão marcados como N/A apenas cenários ainda não iniciados ou em teste.",
    "Evidências, pendências e observações já preenchidas serão preservadas.",
    "Você poderá revisar cada cenário depois.",
  ].join("\n");

  if (!confirm(message)) return;

  let updated = 0;
  optionalNaScenarioIds.forEach((id) => {
    const data = state.scenarios[id];
    if (!data || !["Não iniciado", "Em teste"].includes(data.status)) return;
    data.status = "N/A";
    updated += 1;
  });

  persist();
  selectedProcessGroupId = "apoio";
  journeyViewMode = "kanban";
  closeScenarioDrawer();
  render();

  if (!updated) {
    alert("Nenhum cenário opcional elegível foi alterado.");
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
  const completed = all.filter(({ scenario }) =>
    ["Aprovado", "N/A"].includes(state.scenarios[scenario.id].status)
  ).length;
  const issues = all.filter(({ scenario }) => isIssue(state.scenarios[scenario.id]));
  const lines = [
    `# ${state.project.name}`,
    "",
    `Cliente/unidade: ${state.project.client || "Não informado"}`,
    `Ambiente: ${state.project.environment || "Não informado"}`,
    `Atualizado em: ${new Date(state.updatedAt).toLocaleString("pt-BR")}`,
    "",
    "## Resumo executivo",
    "",
    `- Cenários: ${all.length}`,
    `- Conclusão: ${percent(completed, all.length)}%`,
    `- Pendências abertas: ${issues.length}`,
    `- Assinaturas registradas: ${state.signatures.length}`,
    "",
    "## Fases do aceite",
    "",
    ...acceptancePhases.flatMap((phase, index) => [
      `${index + 1}. ${phase.name}: ${phase.description}`,
    ]),
    "",
    "## Gates de aceite",
    "",
  ];

  acceptanceGates.forEach((gate) => {
    const stats = getGateStats(gate);
    lines.push(
      `- ${gate.name} - ${gate.title}: ${stats.progress}% (${stats.completed}/${stats.total}) - ${gate.objective}`
    );
  });

  lines.push("", "## Matriz de aprovação", "");
  lines.push("| Gate | Macroprocesso | Funcionalidade | Cenário | Tipo | Criticidade | Responsável sugerido | Status |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- |");
  all.forEach(({ process, feature, scenario }) => {
    const data = state.scenarios[scenario.id];
    const meta = getScenarioMeta(process, feature, scenario);
    lines.push(
      `| ${meta.gate.name} | ${process.name} | ${feature.name} | ${scenario.name} | ${meta.type} | ${meta.criticality} | ${meta.owner} | ${data.status} |`
    );
  });

  lines.push("", "## Roteiro UAT e evidências", "");
  catalog.forEach((process) => {
    lines.push(`### ${process.name}`, "");
    process.features.forEach((feature) => {
      lines.push(`#### ${feature.name}`, "");
      feature.scenarios.forEach((scenario) => {
        const data = state.scenarios[scenario.id];
        const meta = getScenarioMeta(process, feature, scenario);
        lines.push(`##### ${scenario.name}`);
        lines.push(`- Gate: ${meta.gate.name} - ${meta.gate.title}`);
        lines.push(`- Tipo: ${meta.type}`);
        lines.push(`- Criticidade: ${meta.criticality}`);
        lines.push(`- Pré-condições: ${meta.preconditions}`);
        lines.push(`- Dados necessários: ${meta.dataNeeded}`);
        lines.push(`- Resultado esperado: ${meta.expectedResult}`);
        lines.push(`- Evidência esperada: ${meta.evidence}`);
        lines.push(`- Status: ${data.status}`);
        lines.push(`- Responsável: ${data.owner || "Não informado"}`);
        lines.push(`- Data: ${data.date || "Não informada"}`);
        lines.push(`- Evidência: ${data.evidence || "Não informada"}`);
        lines.push(`- Pendências: ${data.issues || "Nenhuma"}`);
        lines.push("");
      });
    });
  });

  lines.push("## Pendências e riscos", "");
  if (!issues.length) {
    lines.push("Nenhuma pendência aberta.", "");
  } else {
    issues.forEach(({ process, feature, scenario }) => {
      const data = state.scenarios[scenario.id];
      lines.push(
        `- ${data.severity || "Média"} / ${data.status}: ${process.name} > ${feature.name} > ${scenario.name} - ${
          data.issues || "Pendente de descrição"
        }`
      );
    });
    lines.push("");
  }

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
          :root { color-scheme: light; }
          * { box-sizing: border-box; }
          body { font-family: Arial, Helvetica, sans-serif; color: #1d252c; margin: 0; background: linear-gradient(180deg, rgba(15,118,110,.08), rgba(37,99,235,.04) 360px, #f6f8fb 720px); }
          .report-shell { max-width: 1180px; margin: 24px auto; background: #fff; border: 1px solid #d8e0e7; border-radius: 12px; overflow: hidden; box-shadow: 0 12px 34px rgba(30,43,54,.1); }
          .report-body { padding: 26px 28px 30px; }
          .cover { display: grid; grid-template-columns: minmax(0,1fr) 240px; gap: 18px; align-items: center; padding: 28px; border-top: 7px solid #0f766e; background: linear-gradient(135deg, #fff, #f8fbff 58%, #e6f6f3); }
          .cover-card { border: 1px solid rgba(15,118,110,.22); border-radius: 10px; background: rgba(255,255,255,.75); padding: 14px; }
          .cover-card strong { display: block; font-size: 28px; line-height: 1; }
          h1 { margin: 0 0 6px; font-size: 32px; line-height: 1.12; }
          h2 { display: flex; align-items: center; gap: 8px; margin-top: 28px; border-bottom: 1px solid #d8e0e7; padding-bottom: 8px; font-size: 20px; }
          h3 { color: #176b62; margin: 18px 0 8px; }
          table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 12px 0 20px; font-size: 13px; border: 1px solid #d8e0e7; border-radius: 8px; overflow: hidden; }
          th, td { border-bottom: 1px solid #d8e0e7; padding: 9px 10px; text-align: left; vertical-align: top; }
          tr:last-child td { border-bottom: 0; }
          th { background: #eef2f5; color: #425466; text-transform: uppercase; font-size: 11px; }
          .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 12px 0 18px; }
          .kpi { display: grid; grid-template-columns: 42px minmax(0,1fr); gap: 10px; align-items: center; border: 1px solid #d8e0e7; border-top: 4px solid #0f766e; border-radius: 9px; padding: 12px; background: #fbfcfd; }
          .kpi:nth-child(2) { border-top-color: #217044; }
          .kpi:nth-child(3) { border-top-color: #f97316; }
          .kpi:nth-child(4) { border-top-color: #7c3aed; }
          .kpi strong { display: block; font-size: 24px; }
          .kpi span { color: #65727e; font-size: 12px; font-weight: 700; }
          .icon, .title-icon svg { width: 19px; height: 19px; }
          .kpi-icon, .title-icon { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 9px; background: #e6f6f3; color: #0f766e; }
          .kpi:nth-child(2) .kpi-icon { background: #ecfdf3; color: #217044; }
          .kpi:nth-child(3) .kpi-icon { background: #fff4e8; color: #f97316; }
          .kpi:nth-child(4) .kpi-icon { background: #f2ebff; color: #7c3aed; }
          .meta { color: #65727e; }
          .status { font-weight: 700; color: #176b62; }
          @media (max-width: 760px) { .report-shell { margin: 0; border-radius: 0; } .cover, .kpi-grid { grid-template-columns: 1fr; } }
          @media print { body { background: #fff; } .report-shell { margin: 0; border: 0; box-shadow: none; } .cover { padding: 18px 0; } .report-body { padding: 0; } }
        </style>
      </head>
      <body>
        <main class="report-shell">
          <section class="cover">
            <div>
              <p class="meta">Relatório formal de aceite</p>
              <h1>${escapeHtml(state.project.name)}</h1>
              <p class="meta">Cliente/unidade: ${escapeHtml(state.project.client || "Não informado")}</p>
              <p class="meta">Ambiente: ${escapeHtml(state.project.environment || "Não informado")}</p>
              <p class="meta">Atualizado em: ${new Date(state.updatedAt).toLocaleString("pt-BR")}</p>
            </div>
            <aside class="cover-card">
              <span class="meta">Pacote Lubit</span>
              <strong>${percent(completed, all.length)}%</strong>
              <span class="meta">concluído para sign-off</span>
            </aside>
          </section>
        <div class="report-body">
        <h2><span class="title-icon">${renderIcon("shield")}</span>Resumo executivo</h2>
        <div class="kpi-grid">
          <article class="kpi"><span class="kpi-icon">${renderIcon("file")}</span><div><strong>${all.length}</strong><span>Cenários</span></div></article>
          <article class="kpi"><span class="kpi-icon">${renderIcon("check")}</span><div><strong>${percent(completed, all.length)}%</strong><span>Conclusão</span></div></article>
          <article class="kpi"><span class="kpi-icon">${renderIcon("alert")}</span><div><strong>${issues.length}</strong><span>Pendências</span></div></article>
          <article class="kpi"><span class="kpi-icon">${renderIcon("signature")}</span><div><strong>${state.signatures.length}</strong><span>Assinaturas</span></div></article>
        </div>
        <table>
          <tr><th>Cenários</th><th>Conclusão</th><th>Pendências</th><th>Assinaturas</th></tr>
          <tr><td>${all.length}</td><td>${percent(completed, all.length)}%</td><td>${issues.length}</td><td>${state.signatures.length}</td></tr>
        </table>
        <h2><span class="title-icon">${renderIcon("check")}</span>Fases do aceite</h2>
        <table>
          <thead><tr><th>Fase</th><th>Objetivo</th></tr></thead>
          <tbody>
            ${acceptancePhases
              .map((phase) => `<tr><td>${escapeHtml(phase.name)}</td><td>${escapeHtml(phase.description)}</td></tr>`)
              .join("")}
          </tbody>
        </table>
        <h2><span class="title-icon">${renderIcon("timer")}</span>Gates de aceite</h2>
        <table>
          <thead><tr><th>Gate</th><th>Título</th><th>Fase</th><th>Conclusão</th><th>Objetivo</th></tr></thead>
          <tbody>
            ${acceptanceGates
              .map((gate) => {
                const stats = getGateStats(gate);
                return `<tr><td>${escapeHtml(gate.name)}</td><td>${escapeHtml(gate.title)}</td><td>${escapeHtml(
                  gate.phase
                )}</td><td>${stats.progress}% (${stats.completed}/${stats.total})</td><td>${escapeHtml(gate.objective)}</td></tr>`;
              })
              .join("")}
          </tbody>
        </table>
        <h2><span class="title-icon">${renderIcon("boxes")}</span>Matriz de aprovação</h2>
        <table>
          <thead>
            <tr><th>Gate</th><th>Macroprocesso</th><th>Funcionalidade</th><th>Cenário</th><th>Tipo</th><th>Criticidade</th><th>Responsável sugerido</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${all
              .map(({ process, feature, scenario }) => {
                const data = state.scenarios[scenario.id];
                const meta = getScenarioMeta(process, feature, scenario);
                return `<tr><td>${escapeHtml(meta.gate.name)}</td><td>${escapeHtml(process.name)}</td><td>${escapeHtml(
                  feature.name
                )}</td><td>${escapeHtml(scenario.name)}</td><td>${escapeHtml(meta.type)}</td><td>${escapeHtml(
                  meta.criticality
                )}</td><td>${escapeHtml(meta.owner)}</td><td class="status">${escapeHtml(data.status)}</td></tr>`;
              })
              .join("")}
          </tbody>
        </table>
        <h2><span class="title-icon">${renderIcon("file")}</span>Roteiro UAT e evidências</h2>
        ${catalog
          .map(
            (process) => `
              <h3>${escapeHtml(process.name)}</h3>
              <table>
                <thead>
                  <tr><th>Funcionalidade</th><th>Cenário</th><th>Pré-condições</th><th>Dados</th><th>Resultado esperado</th><th>Status</th><th>Responsável</th><th>Evidência</th><th>Pendências</th></tr>
                </thead>
                <tbody>
                  ${process.features
                    .flatMap((feature) =>
                      feature.scenarios.map((scenario) => {
                        const data = state.scenarios[scenario.id];
                        const meta = getScenarioMeta(process, feature, scenario);
                        return `
                          <tr>
                            <td>${escapeHtml(feature.name)}</td>
                            <td>${escapeHtml(scenario.name)}<br><span class="meta">${escapeHtml(scenario.acceptance)}</span></td>
                            <td>${escapeHtml(meta.preconditions)}</td>
                            <td>${escapeHtml(meta.dataNeeded)}</td>
                            <td>${escapeHtml(meta.expectedResult)}</td>
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
        <h2><span class="title-icon">${renderIcon("alert")}</span>Pendências abertas</h2>
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
        <h2><span class="title-icon">${renderIcon("signature")}</span>Assinaturas</h2>
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
        </div>
        </main>
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

els.journeyViewToggle.addEventListener("click", (event) => {
  const button = event.target.closest("[data-view-mode]");
  if (!button) return;
  journeyViewMode = button.dataset.viewMode;
  renderJourney();
});

document.body.addEventListener("click", (event) => {
  const scenarioButton = event.target.closest("[data-select-scenario]");
  if (scenarioButton) {
    selectedScenarioId = scenarioButton.dataset.selectScenario;
    const selected = getAllScenarios().find(({ scenario }) => scenario.id === selectedScenarioId);
    if (selected) {
      selectedProcessGroupId = getProcessGroup(selected.process.id).id;
    }
    isDrawerOpen = true;
    document.querySelector('[data-tab="journey"]').click();
    renderJourney();
    return;
  }

  const groupButton = event.target.closest("[data-select-group]");
  if (groupButton) {
    selectedProcessGroupId = groupButton.dataset.selectGroup;
    const group = processGroups.find((item) => item.id === selectedProcessGroupId) || processGroups[0];
    const next =
      getFilteredScenarios().find(
        ({ process, scenario }) =>
          group.processIds.includes(process.id) && !["Aprovado", "N/A"].includes(state.scenarios[scenario.id].status)
      ) ||
      getFilteredScenarios().find(({ process }) => group.processIds.includes(process.id)) ||
      getAllScenarios().find(({ process }) => group.processIds.includes(process.id));
    if (next) {
      selectedScenarioId = next.scenario.id;
    }
    closeScenarioDrawer();
    renderJourney();
    return;
  }

  const statusButton = event.target.closest("[data-set-status]");
  if (statusButton) {
    const form = event.target.closest("[data-scenario-form]");
    if (!form) return;
    updateScenario(form.dataset.scenarioForm, "status", statusButton.dataset.setStatus);
    return;
  }

  if (event.target.closest('[data-action="close-drawer"]')) {
    closeScenarioDrawer();
    return;
  }

  if (event.target.dataset.action === "remove-signature") {
    const index = Number(event.target.closest(".signature-card").dataset.signatureIndex);
    state.signatures.splice(index, 1);
    persist();
    renderJourney();
    renderReport();
    renderSignatures();
  }
});

els.drawerBackdrop.addEventListener("click", () => closeScenarioDrawer());

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && isDrawerOpen) {
    closeScenarioDrawer();
    return;
  }

  const groupButton = event.target.closest?.("[data-select-group]");
  if (groupButton && ["Enter", " "].includes(event.key)) {
    event.preventDefault();
    groupButton.click();
  }
});

els.journeyDetail.addEventListener("change", (event) => {
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
  renderJourney();
  renderReport();
});

document.getElementById("addSignatureBtn").addEventListener("click", () => {
  state.signatures.push({ area: "", name: "", role: "", date: "", notes: "" });
  persist();
  renderJourney();
  renderReport();
  renderSignatures();
});

document.getElementById("exportBtn").addEventListener("click", exportJson);
document.getElementById("markdownBtn").addEventListener("click", exportMarkdown);
document.getElementById("reportBtn").addEventListener("click", generateReport);
document.getElementById("optionalNaBtn").addEventListener("click", applyOptionalNaPreset);
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
