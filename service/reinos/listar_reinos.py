"""
Lista todos os reinos cadastrados no banco de dados MongoDB.

Uso:
    python listar_reinos.py
"""

import json

from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"
COLLECTION = "reinos"


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def listar_reinos():
    db = conectar()
    colecao = db[COLLECTION]

    reinos = list(colecao.find())

    if not reinos:
        print("Nenhum reino cadastrado.")
        return

    for reino in reinos:
        reino.pop("_id", None)

    print(f"\n{len(reinos)} reino(s) cadastrado(s):\n")
    print(json.dumps(reinos, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    listar_reinos()
