# Manual de Uso - Sign-off Cliente Lubit

Este manual foi gerado a partir de uma simulação completa de aceite de cliente executada com Playwright.

## 1. Preencher o projeto

Informe nome do projeto, cliente/unidade e ambiente testado.

![Projeto preenchido](../artifacts/client-signoff-complete/01-projeto-preenchido.png)

## 2. Usar a Jornada em linhas

Selecione o bloco de processo e use a visão **Linhas** para execução rápida.

![Jornada em linhas](../artifacts/client-signoff-complete/02-jornada-linhas.png)

## 3. Alternar para Kanban

Use a visão **Kanban** para conferir os cenários por status.

![Jornada em Kanban](../artifacts/client-signoff-complete/03-jornada-kanban.png)

## 4. Aplicar N/A opcionais

Use **Aplicar N/A opcionais** quando SAP, XML, alarmes ou mapas não fizerem parte do escopo.

![Preset N/A](../artifacts/client-signoff-complete/04-preset-na-opcionais.png)

## 5. Registrar evidência no sidebar

Clique em um cenário, revise objetivo/passos e registre responsável, data, evidência, pendência e status.

![Sidebar de evidência](../artifacts/client-signoff-complete/05-sidebar-evidencia.png)

## 6. Controlar pendências

Cenários reprovados, bloqueados ou com defeitos aparecem automaticamente na aba Pendências.

![Pendências temporárias](../artifacts/client-signoff-complete/06-pendencias-temporarias.png)

## 7. Fechar o sign-off

Resolva pendências, registre assinaturas e gere o relatório final.

![Sign-off final](../artifacts/client-signoff-complete/07-signoff-final.png)

![Relatório HTML](../artifacts/client-signoff-complete/08-relatorio-html.png)

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
