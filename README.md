# Help Desk API

Sistema de Help Desk para abertura, acompanhamento e gerenciamento de chamados.

Projeto de portfólio desenvolvido por **Luis Fillipe Backer Faria** para praticar desenvolvimento web, APIs REST, banco de dados e integração entre frontend e backend.

## Tecnologias
- Node.js
- Express
- SQLite
- React
- Vite
- JavaScript
- REST API
- HTML5/CSS3

## Funcionalidades
- Criar chamados
- Listar e visualizar chamados
- Filtrar por status, prioridade e texto
- Atualizar status e prioridade
- Excluir chamados
- Dashboard com indicadores
- Persistência em SQLite
- Interface web responsiva

## Estrutura
```
backend/
  src/
    server.js
    database.js
    routes/ticketRoutes.js
    controllers/ticketController.js
    seed.js
frontend/
  src/
    App.jsx
    main.jsx
    styles.css
```

## Como executar

### Backend
```bash
cd backend
npm install
npm run seed
npm start
```

API: http://localhost:3000

### Frontend
Em outro terminal:
```bash
cd frontend
npm install
npm run dev
```

Interface: http://localhost:5173

## Endpoints
- GET /api/tickets
- GET /api/tickets/:id
- POST /api/tickets
- PUT /api/tickets/:id
- DELETE /api/tickets/:id
- GET /api/tickets/stats

## Autor
**Luis Fillipe Backer Faria**

GitHub: https://github.com/lfillipebf-ai
