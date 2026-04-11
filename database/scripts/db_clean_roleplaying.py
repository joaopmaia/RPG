"""
Limpa apenas collections de conteúdo de campanha (NPC e estabelecimentos).
Não apaga: armas, armaduras, alquimia, reinos, materiais, imagens, usuarios, campanhas, runas.
"""
import os
import sys

from pymongo import MongoClient

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DATABASE = "rpg"

# Collections a esvaziar (nome exato no MongoDB)
TO_CLEAR = (
    "NPC",
    "demon_NPC",
    "fera_NPC",
    "equipamentos_NPC",
    "elixir_NPC",
    "estabelecimentos",
)

PRESERVED = frozenset(
    {
        "armas",
        "armaduras",
        "alquimia",
        "reinos",
        "materiais",
        "imagens",
        "usuarios",
        "campanhas",
        "runas",
    }
)


def main():
    client = MongoClient(MONGO_URI)
    db = client[DATABASE]
    for name in TO_CLEAR:
        if name in PRESERVED:
            print(f"Aviso: '{name}' está na lista de preservação — ignorado.", file=sys.stderr)
            continue
        if name not in db.list_collection_names():
            print(f"Collection '{name}' não existe — pulando.")
            continue
        n = db[name].delete_many({})
        print(f"{name}: removidos {n.deleted_count} documento(s).")
    client.close()
    print("Limpeza de roleplaying concluída (demais collections intactas).")


if __name__ == "__main__":
    main()
