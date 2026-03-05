"""
Migration: Criação da collection 'armaduras'.

Uso:
    python 02_init_armaduras.py
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
            "required": ["nome", "defesa", "peso", "durabilidade", "tipo", "preco"],
            "properties": {
                "nome": {"bsonType": "string", "description": "Nome da armadura"},
                "defesa": {"bsonType": "string", "description": "Valor de defesa da armadura"},
                "peso": {"bsonType": "string", "description": "Peso da armadura"},
                "durabilidade": {"bsonType": "string", "description": "Durabilidade da armadura"},
                "tipo": {"bsonType": "string", "description": "Tipo do equipamento"},
                "preco": {"bsonType": "string", "description": "Preço da armadura"},
            },
        }
    }

    try:
        db.create_collection("armaduras", validator=validator)
        print("Collection 'armaduras' criada com sucesso.")
    except CollectionInvalid:
        print("Collection 'armaduras' já existe – pulando criação.")

    db["armaduras"].create_index("nome", unique=True)
    print("Índice único em 'nome' garantido.")

    client.close()
    print("Migration concluída.")


if __name__ == "__main__":
    run_migration()
