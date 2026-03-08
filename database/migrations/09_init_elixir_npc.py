import pymongo

def up(db):
    db.create_collection("elixir_NPC")
    # Exemplo de documento para a tabela elixir_NPC
    elixir_example = {
        "personagem_dono": "",
        "nome": "",
        "efeito": "",
        "descricao": "",
        "materia_prima": "",
        "bonus_materia_prima": ""
    }
    # Insere um exemplo vazio (opcional)
    # db.elixir_NPC.insert_one(elixir_example)

def down(db):
    db.drop_collection("elixir_NPC")
