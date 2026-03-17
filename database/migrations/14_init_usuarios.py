"""
Migration: Criação da collection 'usuarios'.
Armazena usuários do sistema (login): usuario (único), senha_hash, perfil ('user' | 'admin').
O usuário admin é criado pelo backend a partir das variáveis ADMIN_USER e ADMIN_PASSWORD no .env.
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
        db.create_collection("usuarios")
        print("Collection 'usuarios' criada com sucesso.")
    except CollectionInvalid:
        print("Collection 'usuarios' já existe – pulando criação.")

    col = db["usuarios"]
    col.create_index("usuario", unique=True)
    print("Índice único em 'usuario' garantido.")

    client.close()
    print("Migration concluída.")


if __name__ == "__main__":
    run_migration()
