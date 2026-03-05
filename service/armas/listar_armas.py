"""
Lista todas as armas cadastradas no banco de dados MongoDB.

Uso:
    python listar_armas.py
"""

import json

from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"
COLLECTION = "armas"


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def listar_armas():
    db = conectar()
    colecao = db[COLLECTION]

    armas = list(colecao.find())

    if not armas:
        print("Nenhuma arma cadastrada.")
        return

    for arma in armas:
        arma.pop("_id", None)

    print(f"\n{len(armas)} arma(s) cadastrada(s):\n")
    print(json.dumps(armas, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    listar_armas()
