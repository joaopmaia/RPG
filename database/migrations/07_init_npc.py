import pymongo

def up(db):
    db.create_collection("NPC")
    # Exemplo de documento para a tabela NPC
    npc_example = {
        "nome": "",
        "forca": "",
        "vitalidade": "",
        "destreza": "",
        "inteligencia": "",
        "espirito": "",
        "carisma": "",
        "percepcao": "",
        "raça": "",
        "tipo": "",
        "nível": "",
        "hp_total": "",
        "hp_atual": "",
        "arcana_total": "",
        "arcana_atual": "",
        "pericia": "",
        "arma1": "",
        "arma2": "",
        "armadura": "",
        "escudo": "",
        "elixir": [],  # lista de string
        "runas": [],   # lista de string
        "moedas": "",
        "observacoes": [],  # lista de string
        "natureza": "",
    }
    # Insere um exemplo vazio (opcional)
    # db.NPC.insert_one(npc_example)

def down(db):
    db.drop_collection("NPC")
