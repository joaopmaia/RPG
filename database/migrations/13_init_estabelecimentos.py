"""
Migration: Criação da collection 'estabelecimentos'.
Armazena estabelecimentos gerados (ferreiro, alquimista, hospedagem) com nome, nível, reino e estoque.
"""

import os
from pymongo import MongoClient
from pymongo.errors import CollectionInvalid

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DATABASE = "rpg"


def run_migration():
    client = MongoClient(MONGO_URI)
    db = client[DATABASE]

    try:
        db.create_collection("estabelecimentos")
        print("Collection 'estabelecimentos' criada com sucesso.")
    except CollectionInvalid:
        print("Collection 'estabelecimentos' já existe – pulando criação.")

    # Atualiza schema básico para incluir listas de nomes de NPCs, animais e demônios associados à noite
    try:
        db.command({
            "collMod": "estabelecimentos",
            "validator": {
                "$jsonSchema": {
                    "bsonType": "object",
                    "properties": {
                        "lista_ladinos": {
                            "bsonType": ["array"],
                            "items": {"bsonType": "string"},
                        },
                        "lista_animais": {
                            "bsonType": ["array"],
                            "items": {"bsonType": "string"},
                        },
                        "lista_demonios": {
                            "bsonType": ["array"],
                            "items": {"bsonType": "string"},
                        },
                    },
                }
            },
            "validationLevel": "moderate",
        })
        print("Schema de 'estabelecimentos' atualizado com listas de ladinos/animais/demônios.")
    except Exception as e:
        print(f"Aviso ao atualizar schema de 'estabelecimentos': {e}")

    client.close()
    print("Migration concluída.")


if __name__ == "__main__":
    run_migration()
