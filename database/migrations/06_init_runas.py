"""
Migration: Criação da collection 'runas'.

Uso:
    python 06_init_runas.py
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
            "required": ["tier", "elementos", "efeito", "bonus", "nome", "descricao"],
            "properties": {
                "tier": {"bsonType": "string", "description": "Tier da runa (Básico, Intermediário, Superior)"},
                "elementos": {
                    "bsonType": "array",
                    "items": {"bsonType": "string"},
                    "description": "Elementos da runa",
                },
                "efeito": {"bsonType": "string", "description": "Efeito da runa"},
                "bonus": {"bsonType": "string", "description": "Bônus concedido pela runa"},
                "nome": {"bsonType": "string", "description": "Nome da runa"},
                "descricao": {"bsonType": "string", "description": "Descrição da runa"},
            },
        }
    }

    try:
        db.create_collection("runas", validator=validator)
        print("Collection 'runas' criada com sucesso.")
    except CollectionInvalid:
        print("Collection 'runas' já existe – pulando criação.")

    db["runas"].create_index("nome", unique=True)
    print("Índice único em 'nome' garantido.")

    client.close()
    print("Migration concluída.")


if __name__ == "__main__":
    run_migration()
