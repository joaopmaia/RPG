"""
Migration: Criação da collection 'estabelecimentos'.
Armazena estabelecimentos gerados (ferreiro, alquimista, hospedagem) com nome, nível, reino e estoque.
"""

from pymongo import MongoClient
from pymongo.errors import CollectionInvalid

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"


def run_migration():
    client = MongoClient(MONGO_URI)
    db = client[DATABASE]

    try:
        db.create_collection("estabelecimentos")
        print("Collection 'estabelecimentos' criada com sucesso.")
    except CollectionInvalid:
        print("Collection 'estabelecimentos' já existe – pulando criação.")

    client.close()
    print("Migration concluída.")


if __name__ == "__main__":
    run_migration()
