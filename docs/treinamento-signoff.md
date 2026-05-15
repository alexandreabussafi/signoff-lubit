# Treinamento de Uso - Lubit Sign-off

## Objetivo

O Lubit Sign-off é uma ferramenta simples para validar a entrega do sistema, registrar evidências, controlar pendências e gerar um pacote final de aceite.

Ela não substitui o Lubit. Ela organiza o aceite da implantação.

## Jornada Recomendada

Use a aba **Jornada** como tela principal. Os três cards superiores funcionam como headers da etapa; ao escolher um card, os cenários aparecem logo abaixo em **Linhas** ou **Kanban**.

1. **Preparar a entrega**
   - Valide ambiente, usuários, permissões, cadastros, plano migrado e árvore de ativos.
   - Registre evidência sempre que um item for aprovado.

2. **Validar a operação**
   - Execute os fluxos principais: tarefas CIT, geração de OS, retorno, retorno em massa, OS extraordinária, nota técnica, parada preventiva e estoque.
   - Marque cada cenário com o status correto.

3. **Assinar o aceite**
   - Valide importações, SAP, relatórios, logs, mapas e alarmes.
   - Feche pendências ou registre ressalvas.
   - Adicione as assinaturas na aba **Relatório**.

## Status dos Cenários

- **Não iniciado**: ainda não testado.
- **Em teste**: execução em andamento.
- **Aprovado**: validado com evidência suficiente.
- **Reprovado**: comportamento incorreto encontrado.
- **Bloqueado**: não foi possível testar por dependência externa.
- **N/A**: não aplicável ao projeto.

## Como Registrar Um Teste

1. Abra **Jornada**.
2. Escolha um bloco superior.
3. Escolha a visão **Linhas** ou **Kanban**.
4. Clique em um cenário para abrir o sidebar de edição.
5. Leia objetivo, passos e resultado esperado.
6. Use uma ação rápida de status ou preencha o status manualmente.
7. Preencha responsável, data, evidência e pendência quando houver.

## Kanban

O **Kanban** fica dentro da Jornada e mostra os cenários por status no bloco selecionado.

Use essa visão para acompanhar rapidamente:

- o que ainda não começou;
- o que está em teste;
- o que já foi aprovado;
- o que está com pendência;
- o que foi marcado como N/A.

## Pendências

A aba **Pendências** reúne automaticamente cenários reprovados, bloqueados ou com descrição de defeito.

Antes do sign-off final, revise essa tela e decida:

- corrigir antes da entrega;
- aceitar com ressalva;
- marcar como N/A;
- manter como bloqueio.

## Relatório e Assinaturas

Na aba **Relatório**:

1. Revise o progresso do pacote.
2. Adicione assinaturas por área.
3. Gere o relatório HTML.
4. Exporte Markdown se precisar de versão editável.
5. Exporte JSON para backup e continuidade do aceite.

## Exportar e Importar JSON

O app salva dados no navegador. Para não perder informações:

- use **Exportar JSON** ao final de cada sessão;
- use **Importar JSON** para continuar em outro navegador ou computador.

O JSON exportado é o pacote operacional do aceite.

## Boas Práticas

- Não aprove cenário sem evidência.
- Use comentários curtos e objetivos.
- Mantenha uma assinatura por área participante.
- Exporte o JSON antes de limpar o preenchimento.
- Gere o relatório final somente após revisar pendências.
