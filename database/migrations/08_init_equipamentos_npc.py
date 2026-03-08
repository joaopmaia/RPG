import pymongo

def up(db):
    db.create_collection("equipamentos_NPC")
    # Exemplo de documento para a tabela equipamentos_NPC
    equipamento_example = {
        "personagem_dono": "",  # Referência ao NPC
        "nome": "",
        "bônus": "",
        "durabilidade": "",
        "peso": "",
        "preco": "",
        "tipo": "",
        "nome_material": "",
        "rank": "",
        "raridade": "",
        "tipo_material": "",
        "efeito": "",
        "runas": [],  # lista de string
        "peso_material": ""
    }
    # Insere um exemplo vazio (opcional)
    # db.equipamentos_NPC.insert_one(equipamento_example)

def down(db):
    db.drop_collection("equipamentos_NPC")
