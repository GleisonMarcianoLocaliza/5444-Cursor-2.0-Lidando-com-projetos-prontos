# git-commit-push

Adiciona todos os arquivos ao stage, gera uma mensagem de commit automática com base nos arquivos modificados (ou usa a mensagem fornecida pelo usuário) e executa o push para o repositório remoto.

## Comportamento

- Se o usuário passou uma mensagem junto ao comando (ex: `/git-commit-push fix: corrige bug no formulário`), use essa mensagem como mensagem de commit.
- Se nenhuma mensagem foi fornecida, analise os arquivos modificados com `git status` e `git diff --stat` e gere uma mensagem de commit descritiva seguindo o padrão Conventional Commits:
  - `feat:` para novos arquivos ou funcionalidades adicionadas
  - `fix:` para correções de bugs
  - `refactor:` para refatorações
  - `chore:` para alterações de configuração, dependências ou arquivos auxiliares
  - `docs:` para alterações em documentação
  - Use o escopo quando possível, ex: `feat(frontend): adiciona componente de listagem`

## Passos

1. Execute `git status` para verificar o estado atual do repositório e listar arquivos modificados.
2. Execute `git diff --stat` para entender o que foi alterado.
3. Determine a mensagem de commit:
   - Se o usuário forneceu uma mensagem, use-a diretamente.
   - Caso contrário, analise os arquivos e gere uma mensagem no padrão Conventional Commits.
4. Execute `git add .` para adicionar todos os arquivos ao stage.
5. Execute `git commit -m "<mensagem gerada ou fornecida>"`.
6. Execute `git push` para enviar ao repositório remoto.
7. Informe ao usuário o resultado final, incluindo a mensagem de commit utilizada e a branch em que o push foi feito.

## Regras importantes

- NUNCA faça commit de arquivos sensíveis como `.env`, credenciais ou chaves de API. Avise o usuário caso algum desses arquivos esteja no stage.
- Se não houver nada para commitar (`nothing to commit`), informe o usuário e não execute os passos seguintes.
- Se o `git push` falhar por divergência de histórico, informe o usuário e sugira executar `git pull` antes de tentar novamente.
