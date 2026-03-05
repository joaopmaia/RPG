"""
Lista todas as armaduras cadastradas no banco de dados MongoDB.

Uso:
    python listar_armaduras.py
"""

import json

from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"
COLLECTION = "armaduras"


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def listar_armaduras():
    db = conectar()
    colecao = db[COLLECTION]

    armaduras = list(colecao.find())

    if not armaduras:
        print("Nenhuma armadura cadastrada.")
        return

    for armadura in armaduras:
        armadura.pop("_id", None)

    print(f"\n{len(armaduras)} armadura(s) cadastrada(s):\n")
    print(json.dumps(armaduras, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    listar_armaduras()
