"""
Migration: Inicialização do banco RPG e criação da collection 'armas'.

Uso:
    python 01_init_armas.py
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
            "required": ["nome", "dano", "durabilidade", "peso", "preco", "tipo"],
            "properties": {
                "nome": {"bsonType": "string", "description": "Nome da arma"},
                "dano": {"bsonType": "string", "description": "Dano causado pela arma"},
                "durabilidade": {"bsonType": "string", "description": "Durabilidade da arma"},
                "peso": {"bsonType": "string", "description": "Peso da arma"},
                "preco": {"bsonType": "string", "description": "Preço da arma"},
                "tipo": {"bsonType": "string", "description": "Tipo da arma"},
            },
        }
    }

    try:
        db.create_collection("armas", validator=validator)
        print("Collection 'armas' criada com sucesso.")
    except CollectionInvalid:
        print("Collection 'armas' já existe – pulando criação.")

    # Índice único pelo nome
    db["armas"].create_index("nome", unique=True)
    print("Índice único em 'nome' garantido.")

    client.close()
    print("Migration concluída.")


if __name__ == "__main__":
    run_migration()
