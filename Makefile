# ──────────────────────────────────────────────
# Busca Elixires NPC
# ──────────────────────────────────────────────
busca-elixires-npc:
	$(PYTHON) service/storytelling/busca_elixires_npc.py

# ──────────────────────────────────────────────
# Busca All Elixires
# ──────────────────────────────────────────────
busca-all-elixires:
	$(PYTHON) service/storytelling/busca_all_elixires.py
# ──────────────────────────────────────────────
# Busca All Equips
# ──────────────────────────────────────────────
busca-all-equips:
	$(PYTHON) service/storytelling/busca_all_equips.py
# ──────────────────────────────────────────────
# Busca NPC Full
# ──────────────────────────────────────────────
busca-npc-full:
	$(PYTHON) service/storytelling/busca_npc_full.py
.PHONY: db-up db-up-run db-down db-restart db-logs db-migrate db-clean setup venv-setup build up up-all up-d run stop clean docker-first-run logs-backend tail-backend salvar-tudo salvar-arma buscar-arma listar-armas salvar-armadura buscar-armadura listar-armaduras salvar-alquimia buscar-alquimia listar-alquimia salvar-reino buscar-reino listar-reinos salvar-material buscar-material listar-materiais salvar-runa buscar-runa busca-elemento converter-planilha calcula-preco cria-estabelecimento cria-npc cria-demon cria-fera busca-npc interagindo-com-npc gerar-npc-custom visualizador-npc front-run run-local stop-local
# ──────────────────────────────────────────────
# Interagindo com NPC
# ──────────────────────────────────────────────

# ──────────────────────────────────────────────
# Busca All Feras
# ──────────────────────────────────────────────
busca-all-feras:
	$(PYTHON) service/storytelling/busca_all_feras.py

busca-feras:
	$(PYTHON) service/storytelling/busca_fera_npc.py

deleta-fera:
	$(PYTHON) service/storytelling/deleta_fera.py

busca-all-demons:
	$(PYTHON) service/storytelling/busca_all_demons.py

busca-demons:
	$(PYTHON) service/storytelling/busca_demon.py

deleta-demon:
	$(PYTHON) service/storytelling/deleta_demon.py

interagindo-com-npc:
	$(PYTHON) service/storytelling/interagindo_com_npc.py

monster-interaction:
	$(PYTHON) service/storytelling/interagir_monstro.py
# ──────────────────────────────────────────────
# Busca NPC
# ──────────────────────────────────────────────

busca-npc:
	$(PYTHON) service/storytelling/busca_npc.py

# ──────────────────────────────────────────────
# Busca Equipamento NPC
# ──────────────────────────────────────────────
busca-equipamento-npc:
	$(PYTHON) service/storytelling/busca_equipamento_npc.py
VENV = .venv
PYTHON = $(VENV)/bin/python3
DOCKER_COMPOSE = docker compose

# ──────────────────────────────────────────────
# Setup (Docker na raiz)
# ──────────────────────────────────────────────

setup: ## Verifica Docker/Compose, cria .env e ./data/db
	@command -v docker >/dev/null 2>&1 || (echo "Docker não encontrado. Instale: https://docs.docker.com/get-docker/"; exit 1)
	@($(DOCKER_COMPOSE) version >/dev/null 2>&1) || command -v docker-compose >/dev/null 2>&1 || (echo "Docker Compose não encontrado. Instale: https://docs.docker.com/compose/install/"; exit 1)
	@test -f .env || (cp .env.example .env && echo "Arquivo .env criado a partir de .env.example.")
	@mkdir -p ./data/db
	@echo "Setup concluído. Próximo: make build && make up"

venv-setup: ## Ambiente virtual Python + pip (fluxo sem Docker)
	python3 -m venv $(VENV)
	$(VENV)/bin/pip install --upgrade pip
	$(VENV)/bin/pip install -r service/requirements.txt
	@echo "\nAmbiente virtual criado em $(VENV)/"
	@echo "Ative com:  source $(VENV)/bin/activate"

# ──────────────────────────────────────────────
# Docker — stack completo (docker-compose.yml na raiz)
# ──────────────────────────────────────────────

build: ## Instala dependências nas imagens (pip e npm) sem cache
	@$(DOCKER_COMPOSE) build --no-cache
	@echo "Imagem atualizada. Se alterou service/ ou backend, suba de novo com: make run   (ou: docker compose up --build)"

up: ## Sobe o stack; apenas logs do backend no terminal (tempo real, Ctrl+C encerra)
	@$(DOCKER_COMPOSE) up --attach backend

up-all: ## Sobe o stack com logs de todos os serviços (db + backend + frontend)
	@$(DOCKER_COMPOSE) up

run: up ## Alias: docker compose up (logs do backend)

up-d: ## Sobe o stack em segundo plano
	@$(DOCKER_COMPOSE) up -d

logs-backend: ## Segue logs do container backend (use após make up-d)
	@$(DOCKER_COMPOSE) logs -f backend

tail-backend: ## Segue o log do backend local (run-local em background)
	@test -f .front-backend.log && tail -f .front-backend.log || (echo "Sem .front-backend.log; rode make run-local primeiro."; exit 1)

stop: ## Para os containers (volumes em ./data/db preservados)
	@$(DOCKER_COMPOSE) down

clean: ## Remove imagens órfãs e cache de build do Docker
	docker image prune -f
	docker builder prune -f

docker-first-run: ## Primeira vez com Docker: setup, venv (se faltar), build, db, migrations, stack -d
	@$(MAKE) setup
	@test -d $(VENV) || $(MAKE) venv-setup
	@$(DOCKER_COMPOSE) build
	@$(DOCKER_COMPOSE) up -d db
	@echo "[docker-first-run] Aguardando MongoDB (healthcheck em rpg-db)..."
	@i=0; while [ $$i -lt 40 ]; do st=$$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' rpg-db 2>/dev/null); [ "$$st" = "healthy" ] && break; i=$$((i+1)); sleep 2; done; \
		st=$$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' rpg-db 2>/dev/null); \
		[ "$$st" = "healthy" ] || (echo "Mongo não ficou healthy a tempo. Ver: docker logs rpg-db"; exit 1)
	@$(MAKE) db-migrate
	@$(DOCKER_COMPOSE) up -d
	@echo ""
	@echo "Stack no ar. Frontend: http://localhost:5173"
	@echo "API: http://127.0.0.1:5000/api/health  (use login na UI; rotas de jogo exigem JWT/campanha)"

# ──────────────────────────────────────────────
# Banco de dados
# ──────────────────────────────────────────────

db-up: ## Sobe só o MongoDB (compose na raiz; volume ./data/db; pode pedir sudo)
	sudo $(DOCKER_COMPOSE) up -d db 2>/dev/null || $(DOCKER_COMPOSE) up -d db

db-up-run: ## Sobe o MongoDB sem sudo (para make run-local)
	$(DOCKER_COMPOSE) up -d db

db-down: ## Para o serviço db do compose da raiz
	$(DOCKER_COMPOSE) stop db

db-restart: db-down db-up ## Reinicia o MongoDB

db-logs: ## Logs do MongoDB (compose na raiz)
	$(DOCKER_COMPOSE) logs -f db

db-migrate: ## Executa as migrations Python
	$(PYTHON) database/migrations/01_init_armas.py
	$(PYTHON) database/migrations/02_init_armaduras.py
	$(PYTHON) database/migrations/03_init_alquimia.py
	$(PYTHON) database/migrations/04_init_reinos.py
	$(PYTHON) database/migrations/05_init_materiais.py
	$(PYTHON) database/migrations/06_init_runas.py
	$(PYTHON) database/migrations/07_init_npc.py
	$(PYTHON) database/migrations/08_init_equipamentos_npc.py
	$(PYTHON) database/migrations/09_init_elixir_npc.py
	$(PYTHON) database/migrations/10_init_demon_npc.py
	$(PYTHON) database/migrations/11_init_fera_npc.py
	$(PYTHON) database/migrations/12_init_imagens.py
	$(PYTHON) database/migrations/13_init_estabelecimentos.py
	$(PYTHON) database/migrations/14_init_usuarios.py
	$(PYTHON) database/migrations/15_init_campanha.py

start: db-up db-migrate ## Inicia o MongoDB e executa as migrations

db-clean: ## Remove dados de roleplaying (NPC*, estabelecimentos); preserva armas, armaduras, alquimia, reinos, materiais, imagens, usuarios, campanhas, runas
	$(PYTHON) database/scripts/db_clean_roleplaying.py

# ──────────────────────────────────────────────
# Scripts de serviço
# ──────────────────────────────────────────────

salvar-tudo: salvar-arma salvar-armadura salvar-alquimia salvar-reino salvar-material salvar-runa ## Salva todos os recursos no banco

salvar-arma: ## Salva armas a partir de resources/armas.json
	$(PYTHON) service/armas/salvar_arma.py

buscar-arma: ## Busca uma arma pelo nome (interativo)
	$(PYTHON) service/armas/buscar_arma.py

listar-armas: ## Lista todas as armas cadastradas
	$(PYTHON) service/armas/listar_armas.py

salvar-armadura: ## Salva armaduras a partir de resources/Armaduras.json
	$(PYTHON) service/armaduras/salvar_armadura.py

buscar-armadura: ## Busca uma armadura pelo nome (interativo)
	$(PYTHON) service/armaduras/buscar_armadura.py

listar-armaduras: ## Lista todas as armaduras cadastradas
	$(PYTHON) service/armaduras/listar_armaduras.py

salvar-alquimia: ## Salva receitas de alquimia a partir de resources/Alquimia.json
	$(PYTHON) service/alquimia/salvar_alquimia.py

buscar-alquimia: ## Busca uma receita de alquimia pelo efeito (interativo)
	$(PYTHON) service/alquimia/buscar_alquimia.py

listar-alquimia: ## Lista todas as receitas de alquimia cadastradas
	$(PYTHON) service/alquimia/listar_alquimia.py

salvar-reino: ## Salva reinos a partir de resources/Reinos.json
	$(PYTHON) service/reinos/salvar_reino.py

buscar-reino: ## Busca um reino pelo nome (interativo)
	$(PYTHON) service/reinos/buscar_reino.py

listar-reinos: ## Lista todos os reinos cadastrados
	$(PYTHON) service/reinos/listar_reinos.py

salvar-material: ## Salva materiais de todos os JSONs em resources/materiais/
	$(PYTHON) service/materiais/salvar_material.py

buscar-material: ## Busca materiais por tipo (interativo)
	$(PYTHON) service/materiais/buscar_material.py

listar-materiais: ## Lista todos os materiais cadastrados
	$(PYTHON) service/materiais/listar_materiais.py

salvar-runa: ## Salva runas a partir dos JSONs em resources/runas/
	$(PYTHON) service/runas/salvar_runa.py

buscar-runa: ## Busca runas por tier e elemento (interativo)
	$(PYTHON) service/runas/buscar_runa.py

busca-elemento: ## Busca runas por combinação de elementos (1 a 3)
	$(PYTHON) service/runas/busca_elemento.py

converter-planilha: ## Converte uma planilha xlsx de docs/ em JSONs em resources/
	$(PYTHON) service/utils/planilha_para_json.py

# ──────────────────────────────────────────────
# Storytelling
# ──────────────────────────────────────────────

calcula-preco: ## Calcula o preço de um item com base no reino e material
	$(PYTHON) service/storytelling/calcula_preco.py

cria-estabelecimento: ## Gera um estabelecimento aleatório com estoque
	$(PYTHON) service/storytelling/cria_estabelecimento.py

cria-npc: ## Gera um NPC aleatório com atributos, equipamentos e tesouro
	$(PYTHON) service/storytelling/cria_npc.py

cria-demon: ## Gera um demônio aleatório com atributos, ataques e loot
	$(PYTHON) service/storytelling/cria_demon.py

cria-fera: ## Gera uma fera aleatória com atributos, ataques e loot
	$(PYTHON) service/storytelling/cria_fera.py

# ──────────────────────────────────────────────
# Storytelling — Menu custom (NPC)
# ──────────────────────────────────────────────

gerar-npc-custom: ## Menu interativo: gerar NPC customizado e salvar na coleção NPC
	$(PYTHON) -m service.storytelling.custom.gerar_npc_custom

visualizador-npc: ## Menu interativo: listar e visualizar NPCs (ficha, equipamentos, runas, elixires)
	$(PYTHON) -m service.storytelling.custom.visualizador_npc_custom

# ──────────────────────────────────────────────
# Front (interface web local)
# ──────────────────────────────────────────────

front-setup: ## Instala dependências do front (Python backend no venv do projeto + npm frontend)
	$(VENV)/bin/pip install -r front/requirements.txt
	cd front/frontend && npm install

front-backend: ## Sobe a API do front em http://127.0.0.1:5000 (requer MongoDB em localhost:27017)
	@echo "[front-backend] Garantindo que a porta 5000 esteja livre..."
	@-lsof -ti:5000 | xargs kill -9 2>/dev/null || true
	@echo "[front-backend] Se a API retornar 500 com 'Connection refused', suba o MongoDB: make db-up-run (ou make front-backend-with-db)"
	cd front/backend && $(CURDIR)/$(VENV)/bin/python3 app.py

front-backend-with-db: ## Sobe o MongoDB e em seguida o backend (um comando só; use após make stop-local)
	@echo "[front-backend-with-db] Subindo MongoDB..."
	@$(MAKE) db-up-run 2>/dev/null || $(MAKE) db-up
	@echo "[front-backend-with-db] Aguardando MongoDB em localhost:27017..."
	@sleep 3
	@$(MAKE) front-backend

front-frontend: ## Sobe o frontend React em http://localhost:5173
	cd front/frontend && npm run dev

front-run: front-backend ## Alias: sobe apenas o backend (rode front-frontend em outro terminal)

# ──────────────────────────────────────────────
# Run (não bloqueia: banco + migrations + setup + backend + frontend em background)
# ──────────────────────────────────────────────

run-local: ## Sobe venv + Mongo + migrations + backend + frontend em background (use 'make stop-local')
	@echo "[run-local] Verificando ambiente..."
	@test -d $(VENV) || ($(MAKE) venv-setup && echo "[run-local] Venv criado.")
	@$(MAKE) front-setup
	@echo "[run-local] Subindo banco (tentativa sem sudo)..."
	@$(MAKE) db-up-run 2>/dev/null || echo "[run-local] Aviso: não foi possível subir o banco. Se precisar, rode 'make db-up' num terminal (pede senha). Continuando..."
	@echo "[run-local] Executando migrations..."
	@$(MAKE) db-migrate
	@echo "[run-local] Iniciando backend (porta 5000)..."
	@-lsof -ti:5000 | xargs kill -9 2>/dev/null || true
	@sleep 1
	@cd front/backend && RUN_IN_BACKGROUND=1 nohup $(CURDIR)/$(VENV)/bin/python3 app.py >> $(CURDIR)/.front-backend.log 2>&1 & echo $$! > $(CURDIR)/.front-backend.pid
	@echo "[run-local] Backend em background (PID $$(cat $(CURDIR)/.front-backend.pid)). Aguardando API responder..."
	@i=0; while [ $$i -lt 20 ]; do code=$$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5000/api/health 2>/dev/null); [ "$$code" = "200" ] && echo "[run-local] Backend OK (porta 5000, /api/health)." && break; i=$$((i+1)); sleep 1; done
	@echo "[run-local] Iniciando frontend (porta 5173)..."
	@-lsof -ti:5173 | xargs kill -9 2>/dev/null || true
	@sleep 1
	@cd front/frontend && nohup npm run dev >> $(CURDIR)/.front-frontend.log 2>&1 & echo $$! > $(CURDIR)/.front-frontend.pid
	@echo "[run-local] Frontend em background (PID $$(cat $(CURDIR)/.front-frontend.pid)). Log: .front-frontend.log"
	@echo ""
	@echo "Sistema em execução. Frontend: http://localhost:5173  |  Backend: http://127.0.0.1:5000"
	@echo "Logs do backend em tempo real: make tail-backend   (ou: tail -f .front-backend.log)"
	@echo "Para encerrar tudo: make stop-local"

# ──────────────────────────────────────────────
# Stop (frontend + backend + containers do banco)
# ──────────────────────────────────────────────

stop-local: ## Encerra processos locais (venv) e tenta parar o Mongo do compose da raiz
	@echo "[stop-local] Encerrando frontend (porta 5173)..."
	@-lsof -ti:5173 | xargs kill -9 2>/dev/null || true
	@-test -f .front-frontend.pid && kill -9 $$(cat .front-frontend.pid) 2>/dev/null || true
	@echo "[stop-local] Encerrando backend (porta 5000)..."
	@-lsof -ti:5000 | xargs kill -9 2>/dev/null || true
	@-test -f .front-backend.pid && kill -9 $$(cat .front-backend.pid) 2>/dev/null || true
	@echo "[stop-local] Parando MongoDB (compose na raiz ou legado database/)..."
	@$(DOCKER_COMPOSE) stop db 2>/dev/null || true
	@docker compose -f database/docker-compose.yml down 2>/dev/null || sudo docker compose -f database/docker-compose.yml down 2>/dev/null || true
	@echo "Sistema finalizado com sucesso!"


full-reset: db-clean stop-local run-local