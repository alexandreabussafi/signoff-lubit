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

- Framework de aceite com fases, gates e matriz de aprovação.
- Dashboard de progresso por macroprocesso.
- Gates de aceite: ambiente/dados, cadastros, fluxos operacionais, integrações/relatórios e assinatura final.
- Matriz de processos com macroprocesso, funcionalidade, criticidade, tipo, responsável sugerido, evidência esperada e status.
- Checklist hierárquico de fluxos críticos.
- Execução orientada em formato UAT com pré-condições, dados necessários, passos, resultado esperado, critério de aceite e registro de evidências.
- Controle de status: `Não iniciado`, `Em teste`, `Aprovado`, `Reprovado`, `Bloqueado`, `N/A`.
- Lista de pendências por severidade e responsável.
- Assinaturas de aceite por área.
- Persistência automática no navegador via `localStorage`.
- Exportação/importação JSON.
- Exportação Markdown formal.
- Relatório HTML imprimível com resumo executivo, fases, gates, matriz, roteiro UAT, pendências/riscos e assinaturas.

## Dados e backup

Nesta primeira versão, os dados preenchidos ficam no navegador via `localStorage`. Eles não são compartilhados automaticamente entre usuários, computadores ou navegadores.

Para preservar um aceite, use **Exportar JSON**. Esse arquivo funciona como backup e pacote oficial do projeto. Para continuar um aceite em outra máquina, use **Importar JSON**.

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
