import pymongo

def up(db):
    db.create_collection("demon_NPC")
    # Exemplo de documento para a tabela demon_NPC
    demon_npc_example = {
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
        "pericia": "",
        "armadura": "",
        "runas": [],  # lista de string
        "observacoes": [],  # lista de string
        "ataques": [],      # lista de string
        "loot": [],         # lista de string
        "dano": "",
    }
    # Insere um exemplo vazio (opcional)
    # db.demon_NPC.insert_one(demon_npc_example)

def down(db):
    db.drop_collection("demon_NPC")
