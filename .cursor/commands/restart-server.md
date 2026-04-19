# restart-server

Para todos os processos Node.js em execução e reinicia a aplicação completa (backend + frontend) usando `npm run dev` na raiz do projeto.

## Passos

1. Encerre qualquer processo Node.js em execução relacionado ao projeto:
   - No Windows: execute `taskkill /F /IM node.exe` para forçar o encerramento de todos os processos Node.js.
   - No Mac/Linux: execute `pkill -f node` ou `kill $(lsof -t -i:3000) 2>/dev/null; kill $(lsof -t -i:5173) 2>/dev/null`.

2. Aguarde 2 segundos para garantir que as portas foram liberadas.

3. Na raiz do projeto (`c:\Curso Alura\5444-Cursor-2.0-Lidando-com-projetos-prontos`), execute:
   ```
   npm run dev
   ```
   Esse script executa em sequência:
   - `npm run backend:seed` — popula o banco de dados SQLite.
   - `npm run backend:dev` — inicia o servidor Node.js/Express na pasta `backend/`.
   - `npm run frontend:dev` — inicia o servidor de desenvolvimento Vite na pasta `frontend/`.

## Comando rápido (Windows PowerShell)

```powershell
taskkill /F /IM node.exe 2>$null; Start-Sleep -Seconds 2; npm run dev
```

## Comando rápido (Mac/Linux)

```bash
pkill -f node 2>/dev/null; sleep 2 && npm run dev
```
