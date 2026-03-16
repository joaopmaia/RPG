"""
Migration: Criação da collection 'imagens'.
Correlaciona tabela (npc, fera, demon, armas, alquimia, etc.) + identificador (nome) com uma imagem.
"""

from pymongo import MongoClient
from pymongo.errors import CollectionInvalid

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"


def run_migration():
    client = MongoClient(MONGO_URI)
    db = client[DATABASE]

    try:
        db.create_collection("imagens")
        print("Collection 'imagens' criada com sucesso.")
    except CollectionInvalid:
        print("Collection 'imagens' já existe – pulando criação.")

    # Índice único por (tabela, identificador)
    db["imagens"].create_index([("tabela", 1), ("identificador", 1)], unique=True)
    print("Índice único em (tabela, identificador) garantido.")

    client.close()
    print("Migration concluída.")


if __name__ == "__main__":
    run_migration()
