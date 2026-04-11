"""
Migration: campanhas + vínculo em usuários e coleções de roleplaying.

- Cria a collection `campanhas` com: id (UUID string, único), nome (único), mestre (string).
- Garante o campo `campanhas` em documentos de `usuarios` (lista de { function, campanha_id }).
- Cria índice opcional em `campanha` nas coleções: NPC, demon_NPC, fera_NPC,
  equipamentos_NPC, elixir_NPC, estabelecimentos (consultas por campanha).
"""

import os
from pymongo import MongoClient
from pymongo.errors import CollectionInvalid

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DATABASE = "rpg"

NPC_RELATED = ("NPC", "demon_NPC", "fera_NPC", "equipamentos_NPC", "elixir_NPC", "estabelecimentos")


def run_migration():
    client = MongoClient(MONGO_URI)
    db = client[DATABASE]

    try:
        db.create_collection("campanhas")
        print("Collection 'campanhas' criada com sucesso.")
    except CollectionInvalid:
        print("Collection 'campanhas' já existe – pulando criação.")

    camp = db["campanhas"]
    camp.create_index("id", unique=True)
    camp.create_index("nome", unique=True)
    print("Índices únicos em 'campanhas.id' e 'campanhas.nome' garantidos.")

    usu = db["usuarios"]
    usu.update_many({"campanhas": {"$exists": False}}, {"$set": {"campanhas": []}})
    print("Campo 'campanhas' inicializado em usuários sem o campo.")

    for name in NPC_RELATED:
        if name not in db.list_collection_names():
            print(f"Aviso: collection '{name}' não existe – índice em 'campanha' ignorado.")
            continue
        db[name].create_index("campanha")
        print(f"Índice em '{name}.campanha' criado.")

    client.close()
    print("Migration init_campanha concluída.")


if __name__ == "__main__":
    run_migration()
