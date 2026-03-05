"""
Lista todos os materiais cadastrados no banco de dados MongoDB.

Uso:
    python listar_materiais.py
"""

import json

from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"
COLLECTION = "materiais"


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def listar_materiais():
    db = conectar()
    colecao = db[COLLECTION]

    materiais = list(colecao.find())

    if not materiais:
        print("Nenhum material cadastrado.")
        return

    for mat in materiais:
        mat.pop("_id", None)

    print(f"\n{len(materiais)} material(is) cadastrado(s):\n")
    print(json.dumps(materiais, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    listar_materiais()
