# Lubit Sign-off

Aplicação web estática e independente para conduzir o aceite de implantação do Lubit. O app não depende do backend Django, do frontend Angular, de Docker ou de banco de dados.

## Objetivo

O objetivo é fornecer um checklist operacional para sign-off de entrega do sistema, cobrindo os fluxos críticos mapeados no projeto:

- implantação e migração;
- cadastros críticos;
- fluxos operacionais;
- importações e integrações;
- consultas e apoio.

## Como usar localmente

Abra `index.html` diretamente no navegador.

Também é possível servir a pasta com qualquer servidor estático:

```bash
npx serve .
```

## Funcionalidades

- Jornada simplificada em 3 blocos no topo: dados iniciais, operação principal, apoio e integrações.
- Visualização alternável entre Linhas e Kanban dentro da Jornada.
- Clique em qualquer cenário abre um sidebar largo para aprovar, reprovar, bloquear, registrar evidência e pendência.
- Preset `Aplicar N/A opcionais` para marcar módulos fora do escopo sem apagar evidências ou observações.
- Visual mais leve, colorido e com ícones SVG.
- Kanban por status filtrado pelo bloco selecionado.
- Dashboard reduzido com progresso, aprovados, pendências e assinaturas.
- Execução rápida no sidebar com objetivo, passos, resultado esperado, status, evidência e pendência.
- Controle de status: `Não iniciado`, `Em teste`, `Aprovado`, `Reprovado`, `Bloqueado`, `N/A`.
- Lista de pendências por severidade e responsável.
- Assinaturas de aceite por área.
- Persistência automática no navegador via `localStorage`.
- Exportação/importação JSON.
- Exportação Markdown formal.
- Relatório HTML visual, imprimível e organizado como documento de aceite.

## Dados e backup

Nesta primeira versão, os dados preenchidos ficam no navegador via `localStorage`. Eles não são compartilhados automaticamente entre usuários, computadores ou navegadores.

Para preservar um aceite, use **Exportar JSON**. Esse arquivo funciona como backup e pacote oficial do projeto. Para continuar um aceite em outra máquina, use **Importar JSON**.

## Manual e simulação

- Manual de treinamento: `docs/treinamento-signoff.html`.
- Manual com simulação de cliente e prints: `docs/manual-signoff-cliente.html`.
- Teste E2E completo: `tests/signoff-client-complete.spec.js`.

A simulação de cliente aprova os cenários aplicáveis, marca módulos opcionais como `N/A`, cria e resolve pendências temporárias, registra 3 assinaturas e valida exportação/importação JSON.

## Publicação na Vercel

Este projeto é estático. Na Vercel, configure:

- Framework Preset: `Other`;
- Build Command: vazio;
- Output Directory: vazio ou raiz do projeto;
- Install Command: vazio ou padrão.

O arquivo `vercel.json` já define configuração mínima para hospedagem estática e evita cache agressivo dos arquivos.

## Evolução futura com backend

Uma segunda versão pode adicionar persistência centralizada e autenticação. Modelo mínimo sugerido:

- `projects`;
- `scenarios`;
- `scenario_results`;
- `issues`;
- `signatures`;
- `evidence_files`.

Autenticação pode ser adicionada depois com Supabase Auth, Firebase Auth ou backend próprio.

## Observação

Este app não altera o backend Django nem o frontend Angular do Lubit. Ele foi criado como entregável separado para sign-off, treinamento assistido e rastreio de pendências.
