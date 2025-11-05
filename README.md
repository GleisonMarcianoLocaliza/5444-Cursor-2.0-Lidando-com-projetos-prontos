# 🚗 Locadora Loucadora

Sistema de locação de carros desenvolvido com React (frontend) e Node.js (backend).

## 📁 Estrutura do Projeto

```
locadora-loucadora/
├── backend/          # API Node.js + SQLite
├── frontend/         # Aplicação React
├── package.json      # Scripts principais
└── README.md
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 18.17.1 ou superior)
- npm

### Instalação
```bash
# Instalar dependências de todos os projetos
npm run install:all
```

### Desenvolvimento
```bash
# Executar backend e frontend simultaneamente
npm run dev
```

### Executar Separadamente

#### Backend (API)
```bash
npm run backend:dev
# ou
cd backend && npm run dev
```

#### Frontend (React)
```bash
npm run frontend:dev
# ou
cd frontend && npm run dev
```

### Banco de Dados
```bash
# Popular banco com dados iniciais
npm run backend:seed
```

## 🌐 URLs de Acesso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 📚 Tecnologias

### Backend
- Node.js + Express
- SQLite
- CORS

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Context API

## 🗂️ Estrutura Detalhada

### Backend (`/backend`)
- `controllers/` - Controladores da API
- `routes/` - Definição das rotas
- `database/` - Dados e imagens dos carros
- `database.js` - Configuração do banco SQLite
- `server.js` - Servidor Express
- `seed.js` - Script para popular banco

### Frontend (`/frontend`)
- `src/components/` - Componentes React
- `src/pages/` - Páginas da aplicação
- `src/contexts/` - Context API para estado global
- `src/services/` - Serviços de API
- `src/types/` - Definições TypeScript

## 🛠️ Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Executa backend e frontend simultaneamente |
| `npm run backend:dev` | Executa apenas o backend |
| `npm run frontend:dev` | Executa apenas o frontend |
| `npm run backend:start` | Executa backend em produção |
| `npm run frontend:build` | Build do frontend para produção |
| `npm run backend:seed` | Popula banco com dados iniciais |
| `npm run install:all` | Instala dependências de todos os projetos |

## 📝 API Endpoints

### Carros
- `GET /car` - Listar todos os carros
- `GET /car/:id` - Buscar carro por ID
- `GET /car?categoryId=:id` - Carros por categoria
- `POST /car` - Criar novo carro
- `PUT /car/:id` - Atualizar carro
- `DELETE /car/:id` - Deletar carro

### Categorias
- `GET /category` - Listar categorias
- `GET /category/:id` - Buscar categoria por ID
- `POST /category` - Criar categoria
- `PUT /category/:id` - Atualizar categoria
- `DELETE /category/:id` - Deletar categoria

## 👨‍💻 Autores

Desenvolvido por:
- [alura-cursos](https://github.com/alura-cursos)
- [cicatrizdev](https://github.com/cicatrizdev)
- [git-jr](https://github.com/git-jr)
