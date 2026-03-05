"""
Migration: Criação da collection 'reinos'.

Uso:
    python 04_init_reinos.py
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
            "required": ["nome", "armas", "armaduras", "escudos", "ferramentas",
                         "runicos", "servicos", "alquimia", "materiais"],
            "properties": {
                "nome": {"bsonType": "string", "description": "Nome do reino"},
                "armas": {"bsonType": "string", "description": "Modificador de preço de armas"},
                "armaduras": {"bsonType": "string", "description": "Modificador de preço de armaduras"},
                "escudos": {"bsonType": "string", "description": "Modificador de preço de escudos"},
                "ferramentas": {"bsonType": "string", "description": "Modificador de preço de ferramentas"},
                "runicos": {"bsonType": "string", "description": "Modificador de preço de aparatos rúnicos"},
                "servicos": {"bsonType": "string", "description": "Modificador de preço de serviços da cidade"},
                "alquimia": {"bsonType": "string", "description": "Modificador de preço de compostos alquímicos"},
                "materiais": {"bsonType": "string", "description": "Modificador de preço de materiais"},
            },
        }
    }

    try:
        db.create_collection("reinos", validator=validator)
        print("Collection 'reinos' criada com sucesso.")
    except CollectionInvalid:
        print("Collection 'reinos' já existe – pulando criação.")

    db["reinos"].create_index("nome", unique=True)
    print("Índice único em 'nome' garantido.")

    client.close()
    print("Migration concluída.")


if __name__ == "__main__":
    run_migration()
