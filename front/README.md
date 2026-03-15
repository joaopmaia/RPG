# Front — Crônicas do Reino

Interface web local para gerenciar os dados do RPG (armas, armaduras, alquimia, reinos, materiais, runas, NPCs, equipamentos e elixires). Estética rústica inspirada em Senhor dos Anéis / D&D.

## Pré-requisitos

- **MongoDB** rodando em `localhost:27017` (use `make db-up` na raiz do projeto).
- **Python 3** com dependências do backend.
- **Node.js** (npm) para o frontend React.

## Estrutura

- `backend/` — API Flask (Python) em `http://127.0.0.1:5000`
- `frontend/` — App React (Vite) em `http://localhost:5173`

## Como rodar

### 1. Backend (API)

Na raiz do projeto RPG (onde está o `Makefile`):

```bash
# Criar venv do front e instalar dependências do backend
make front-setup

# Subir a API (porta 5000)
make front-backend
```

Ou manualmente:

```bash
cd front
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cd backend && python app.py
```

### 2. Frontend (React)

Em outro terminal:

```bash
make front-frontend
```

Ou:

```bash
cd front/frontend
npm install
npm run dev
```

### 3. Acessar

Abra no navegador: **http://localhost:5173**

A API estará em **http://127.0.0.1:5000**. O frontend já está configurado para usar essa URL.

## Endpoints da API

- `GET/POST /api/armas`
- `GET/POST /api/armaduras`
- `GET/POST /api/alquimia`
- `GET/POST /api/reinos`
- `GET/POST /api/materiais`
- `GET/POST /api/runas`
- `GET/POST /api/npcs`
- `GET/POST /api/equipamentos-npc`
- `GET/POST /api/elixir-npc`

Cada recurso tem também `GET/PUT/DELETE /api/<recurso>/<id>`.

Filtros via query: `?q=texto`, `?tipo=...`, `?raça=...`, `?personagem_dono=...`, etc.
