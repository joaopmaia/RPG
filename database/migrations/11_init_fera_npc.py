import pymongo

def up(db):
    db.create_collection("fera_NPC")
    # Exemplo de documento para a tabela fera_NPC
    fera_npc_example = {
        "nome": "",
        "forca": "",
        "vitalidade": "",
        "destreza": "",
        "inteligencia": "",
        "espirito": "",
        "carisma": "",
        "percepcao": "",
        "nível": "",
        "hp_total": "",
        "hp_atual": "",
        "arcana_total": "",
        "arcana_atual": "",
        "pericia": "",
        "armadura": "",
        "runas": [],  # lista de string
        "observacoes": [],  # lista de string
        "ataques": [],      # lista de string
        "loot": [],         # lista de string
        "dano": "",
        "ataque_especial": "",
        "efeito_ataque_critico": "",
        "tipo": "",
        "raça": "",
    }
    # Insere um exemplo vazio (opcional)
    # db.fera_NPC.insert_one(fera_npc_example)

def down(db):
    db.drop_collection("fera_NPC")
