"""
Migration: Criação da collection 'materiais'.

Uso:
    python 05_init_materiais.py
"""

from pymongo import MongoClient
from pymongo.errors import CollectionInvalid

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"


def run_migration():
    client = MongoClient(MONGO_URI)
    db = client[DATABASE]

    validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["rank", "material", "bonus", "peso", "raridade",
                         "durabilidade", "efeito", "tipo"],
            "properties": {
                "rank": {"bsonType": "string", "description": "Rank do material"},
                "material": {"bsonType": "string", "description": "Nome do material"},
                "bonus": {"bsonType": "string", "description": "Bônus de dano/defesa"},
                "peso": {"bsonType": "string", "description": "Peso do material"},
                "raridade": {"bsonType": "string", "description": "Raridade do material"},
                "durabilidade": {"bsonType": "string", "description": "Modificador de durabilidade"},
                "efeito": {"bsonType": "string", "description": "Efeito especial do material"},
                "tipo": {"bsonType": "string", "description": "Tipo do material (vegetal, animal, demon, mineral)"},
            },
        }
    }

    try:
        db.create_collection("materiais", validator=validator)
        print("Collection 'materiais' criada com sucesso.")
    except CollectionInvalid:
        print("Collection 'materiais' já existe – pulando criação.")

    db["materiais"].create_index([("material", 1), ("tipo", 1)], unique=True)
    print("Índice único em 'material' + 'tipo' garantido.")

    client.close()
    print("Migration concluída.")


if __name__ == "__main__":
    run_migration()
