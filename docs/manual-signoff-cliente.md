# Manual de Uso - Sign-off Cliente Lubit

Este manual explica como conduzir um sign-off completo do Lubit usando a ferramenta de aceite. Ele foi gerado a partir de uma simulação Playwright com 32 cenários, 27 aprovados, 5 itens N/A, pendências temporárias resolvidas e 3 assinaturas.

## Como fazer o sign-off

1. Criar ou importar um projeto de aceite.
2. Preencher nome do projeto, cliente/unidade e ambiente testado.
3. Revisar escopo e aplicar N/A opcionais quando SAP, XML, alarmes ou mapas não fizerem parte da entrega.
4. Validar os cenários por bloco: Dados iniciais, Operação principal e Apoio e integrações.
5. Abrir cada cenário no sidebar e registrar responsável, data, ambiente, evidência e observações.
6. Usar o status correto: Aprovado, Em teste, Reprovado, Bloqueado ou N/A.
7. Resolver pendências antes do aceite final.
8. Registrar assinaturas por área.
9. Exportar o JSON como pacote oficial de aceite.
10. Gerar Markdown e relatório HTML para documentação formal.

## Status usados no aceite

- **Aprovado:** O cenário foi executado, evidenciado e aceito pelo responsável.
- **Em teste:** A execução começou, mas ainda falta evidência ou confirmação.
- **Reprovado:** O comportamento não atendeu ao critério de aceite e precisa de correção.
- **Bloqueado:** Não foi possível testar por falta de acesso, dado, ambiente ou dependência.
- **N/A:** Item fora do escopo contratado ou não aplicável ao cliente.

## Exemplos de evidência

- Número da OS validada no Lubit.
- Print da tela ou do PDF gerado.
- Caminho do arquivo salvo na rede do projeto.
- Observação objetiva da homologação.
- Referência de reunião ou validação assistida com key user.

## 01. Preencher o projeto

**Objetivo:** Abrir uma rodada de aceite rastreável para uma implantação, unidade ou fase de homologação.

**Como fazer**

- Informe um nome claro para o projeto de aceite.
- Preencha cliente/unidade para identificar a planta ou área validada.
- Defina o ambiente testado, normalmente Homologação ou Produção assistida.

**O que registrar**

- Data da rodada no próprio cenário.
- Ambiente usado para a validação.
- Responsável por cada bloco ou cenário.

**Critério de aceite:** O projeto deve estar identificado antes de qualquer aprovação ou exportação.

![Preencher o projeto](../artifacts/client-signoff-complete/01-projeto-preenchido.png)

## 02. Executar pela Jornada em Linhas

**Objetivo:** Conduzir o aceite em sequência, cenário por cenário, sem abrir telas desnecessárias.

**Como fazer**

- Escolha um dos três blocos superiores.
- Use Linhas quando a reunião de aceite estiver seguindo uma ordem de validação.
- Clique no cenário para abrir o sidebar e registrar o resultado.

**O que registrar**

- Responsável que executou ou validou o cenário.
- Evidência mínima do teste realizado.
- Observação curta quando houver ressalva operacional.

**Critério de aceite:** Cada cenário aplicável deve terminar como Aprovado ou ter uma pendência explícita.

![Executar pela Jornada em Linhas](../artifacts/client-signoff-complete/02-jornada-linhas.png)

## 03. Acompanhar pela Jornada em Kanban

**Objetivo:** Dar visibilidade rápida do que falta testar, do que está em teste e do que já foi aprovado.

**Como fazer**

- Alterne para Kanban no topo da Jornada.
- Revise cartões parados em Não iniciado ou Em teste.
- Use a coluna Pendência para priorizar correções e bloqueios.

**O que registrar**

- Mudança de status no próprio cenário.
- Responsável pela próxima ação.
- Severidade quando houver defeito ou bloqueio.

**Critério de aceite:** O Kanban final deve ficar sem itens pendentes para que o aceite seja limpo.

![Acompanhar pela Jornada em Kanban](../artifacts/client-signoff-complete/03-jornada-kanban.png)

## 04. Aplicar N/A opcionais

**Objetivo:** Evitar reprovar ou deixar em aberto módulos que não fazem parte da implantação validada.

**Como fazer**

- Clique em Aplicar N/A opcionais na barra lateral.
- Confirme a mensagem apresentada pelo sistema.
- Revise depois cada cenário marcado como N/A se o escopo mudar.

**O que registrar**

- Motivo do N/A quando necessário.
- Observação indicando que SAP, XML, alarmes ou mapas estão fora do escopo.
- Evidências já preenchidas são mantidas, caso existam.

**Critério de aceite:** Use N/A somente para item fora do escopo, nunca para esconder pendência real.

**Cuidado:** O preset altera apenas cenários ainda não iniciados ou em teste. Itens já aprovados, reprovados ou bloqueados não são sobrescritos.

![Aplicar N/A opcionais](../artifacts/client-signoff-complete/04-preset-na-opcionais.png)

## 05. Registrar evidência no sidebar

**Objetivo:** Transformar cada aprovação em um registro objetivo, auditável e fácil de revisar.

**Como fazer**

- Abra o cenário clicando na linha ou no cartão.
- Leia objetivo, passos rápidos e resultado esperado.
- Preencha responsável, data, ambiente, evidência e observações.
- Use Aprovar, Em teste, Reprovar, Bloquear ou N/A conforme o resultado.

**O que registrar**

- Número da OS, print, PDF, arquivo, reunião ou observação de homologação.
- Pendência e severidade quando o cenário falhar.
- Comentário final quando houver aprovação assistida.

**Critério de aceite:** Um cenário aprovado deve ter evidência suficiente para ser entendido depois sem nova reunião.

![Registrar evidência no sidebar](../artifacts/client-signoff-complete/05-sidebar-evidencia.png)

## 06. Controlar e resolver pendências

**Objetivo:** Separar problemas reais do aceite e impedir assinatura final sem visibilidade das pendências.

**Como fazer**

- Abra a aba Pendências para ver cenários reprovados, bloqueados ou com defeitos.
- Revise severidade, responsável e descrição.
- Após a correção ou liberação, volte ao cenário e atualize o status.

**O que registrar**

- Descrição objetiva do problema.
- Responsável por resolver.
- Evidência de reteste após a correção.

**Critério de aceite:** Pendências críticas devem estar resolvidas ou formalmente aceitas com ressalva fora da ferramenta.

![Controlar e resolver pendências](../artifacts/client-signoff-complete/06-pendencias-temporarias.png)

## 07. Assinar e exportar o aceite

**Objetivo:** Encerrar a rodada com responsáveis identificados e pacote de aceite exportável.

**Como fazer**

- Abra Relatório e adicione as assinaturas das áreas envolvidas.
- Revise o percentual de progresso, pendências e cenários N/A.
- Exporte o JSON e gere o Markdown ou relatório HTML.

**O que registrar**

- Nome, área, cargo, data e observação de cada assinatura.
- JSON final do aceite como backup oficial.
- Relatório HTML ou Markdown para documentação do projeto.

**Critério de aceite:** O aceite final deve ter progresso 100%, pendências tratadas e assinaturas registradas.

![Assinar e exportar o aceite](../artifacts/client-signoff-complete/07-signoff-final.png)

## 08. Gerar o relatório HTML formal

**Objetivo:** Produzir um documento de entrega que possa ser enviado, impresso ou anexado ao pacote do projeto.

**Como fazer**

- Clique em Relatório HTML para abrir o documento em uma nova janela.
- Confira resumo executivo, matriz de aprovação, roteiro UAT e assinaturas.
- Use o navegador para imprimir ou salvar como PDF quando necessário.

**O que registrar**

- Relatório HTML salvo ou impresso.
- JSON exportado junto com o relatório.
- Markdown exportado quando for útil para documentação técnica.

**Critério de aceite:** O relatório deve refletir exatamente o estado exportado no JSON final.

![Gerar o relatório HTML formal](../artifacts/client-signoff-complete/08-relatorio-html.png)


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
