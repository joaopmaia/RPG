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
.PHONY: db-up db-down db-restart db-logs db-migrate db-clean setup salvar-tudo salvar-arma buscar-arma listar-armas salvar-armadura buscar-armadura listar-armaduras salvar-alquimia buscar-alquimia listar-alquimia salvar-reino buscar-reino listar-reinos salvar-material buscar-material listar-materiais salvar-runa buscar-runa busca-elemento converter-planilha calcula-preco cria-estabelecimento cria-npc cria-demon cria-fera busca-npc interagindo-com-npc
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
	$(PYTHON) database/migrations/06_init_runas.py

start: db-up db-migrate ## Inicia o MongoDB e executa as migrations

db-clean: ## Limpa todas as collections do banco
	$(PYTHON) -c "from pymongo import MongoClient; db = MongoClient('mongodb://localhost:27017')['rpg']; [db.drop_collection(c) for c in db.list_collection_names()]; print('Banco limpo com sucesso.')"

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
