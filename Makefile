.PHONY: db-up db-down db-restart db-logs db-migrate db-clean setup salvar-arma buscar-arma salvar-armadura buscar-armadura salvar-alquimia buscar-alquimia salvar-reino buscar-reino salvar-material buscar-material converter-planilha

VENV = .venv
PYTHON = $(VENV)/bin/python3

# ──────────────────────────────────────────────
# Setup
# ──────────────────────────────────────────────

setup: ## Cria o ambiente virtual e instala dependências
	python3 -m venv $(VENV)
	$(VENV)/bin/pip install --upgrade pip
	$(VENV)/bin/pip install -r service/requirements.txt
	@echo "\nAmbiente virtual criado em $(VENV)/"
	@echo "Ative com:  source $(VENV)/bin/activate"

# ──────────────────────────────────────────────
# Banco de dados
# ──────────────────────────────────────────────

db-up: ## Sobe o MongoDB via Docker
	sudo docker compose -f database/docker-compose.yml up -d

db-down: ## Para o MongoDB
	sudo docker compose -f database/docker-compose.yml down

db-restart: db-down db-up ## Reinicia o MongoDB

db-logs: ## Mostra os logs do MongoDB
	sudo docker compose -f database/docker-compose.yml logs -f

db-migrate: ## Executa as migrations Python
	$(PYTHON) database/migrations/01_init_armas.py
	$(PYTHON) database/migrations/02_init_armaduras.py
	$(PYTHON) database/migrations/03_init_alquimia.py
	$(PYTHON) database/migrations/04_init_reinos.py
	$(PYTHON) database/migrations/05_init_materiais.py

start: db-up db-migrate ## Inicia o MongoDB e executa as migrations

db-clean: ## Limpa todas as collections do banco
	$(PYTHON) -c "from pymongo import MongoClient; db = MongoClient('mongodb://localhost:27017')['rpg']; [db.drop_collection(c) for c in db.list_collection_names()]; print('Banco limpo com sucesso.')"

# ──────────────────────────────────────────────
# Scripts de serviço
# ──────────────────────────────────────────────

salvar-arma: ## Salva armas a partir de resources/armas.json
	$(PYTHON) service/armas/salvar_arma.py

buscar-arma: ## Busca uma arma pelo nome (interativo)
	$(PYTHON) service/armas/buscar_arma.py

salvar-armadura: ## Salva armaduras a partir de resources/Armaduras.json
	$(PYTHON) service/armaduras/salvar_armadura.py

buscar-armadura: ## Busca uma armadura pelo nome (interativo)
	$(PYTHON) service/armaduras/buscar_armadura.py

salvar-alquimia: ## Salva receitas de alquimia a partir de resources/Alquimia.json
	$(PYTHON) service/alquimia/salvar_alquimia.py

buscar-alquimia: ## Busca uma receita de alquimia pelo efeito (interativo)
	$(PYTHON) service/alquimia/buscar_alquimia.py

salvar-reino: ## Salva reinos a partir de resources/Reinos.json
	$(PYTHON) service/reinos/salvar_reino.py

buscar-reino: ## Busca um reino pelo nome (interativo)
	$(PYTHON) service/reinos/buscar_reino.py

salvar-material: ## Salva materiais de todos os JSONs em resources/materiais/
	$(PYTHON) service/materiais/salvar_material.py

buscar-material: ## Busca materiais por tipo (interativo)
	$(PYTHON) service/materiais/buscar_material.py

converter-planilha: ## Converte uma planilha xlsx de docs/ em JSONs em resources/
	$(PYTHON) service/utils/planilha_para_json.py
