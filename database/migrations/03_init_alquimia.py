"""
Migration: Criação da collection 'alquimia'.

Uso:
    python 03_init_alquimia.py
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
            "required": ["efeito", "vegetal_rar", "vegetal_pot", "animal_rar", "animal_pot",
                         "mineral_rar", "mineral_pot", "demoníaco_rar", "demoníaco_pot", "descrição"],
            "properties": {
                "efeito": {"bsonType": "string", "description": "Efeito da receita alquímica"},
                "vegetal_rar": {"bsonType": "string", "description": "Raridade do componente vegetal"},
                "vegetal_pot": {"bsonType": "string", "description": "Potência do componente vegetal"},
                "animal_rar": {"bsonType": "string", "description": "Raridade do componente animal"},
                "animal_pot": {"bsonType": "string", "description": "Potência do componente animal"},
                "mineral_rar": {"bsonType": "string", "description": "Raridade do componente mineral"},
                "mineral_pot": {"bsonType": "string", "description": "Potência do componente mineral"},
                "demoníaco_rar": {"bsonType": "string", "description": "Raridade do componente demoníaco"},
                "demoníaco_pot": {"bsonType": "string", "description": "Potência do componente demoníaco"},
                "descrição": {"bsonType": "string", "description": "Descrição do efeito"},
            },
        }
    }

    try:
        db.create_collection("alquimia", validator=validator)
        print("Collection 'alquimia' criada com sucesso.")
    except CollectionInvalid:
        print("Collection 'alquimia' já existe – pulando criação.")

    db["alquimia"].create_index("efeito", unique=True)
    print("Índice único em 'efeito' garantido.")

    client.close()
    print("Migration concluída.")


if __name__ == "__main__":
    run_migration()
