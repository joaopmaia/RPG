"""
"""Lista todas as receitas de alquimia cadastradas no banco de dados MongoDB (nome e efeito).

Uso:
    python listar_alquimia.py
"""

import json
import os

from pymongo import MongoClient

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DATABASE = "rpg"
COLLECTION = "alquimia"


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def listar_alquimia():
    db = conectar()
    colecao = db[COLLECTION]

    receitas = list(colecao.find())

    if not receitas:
        print("Nenhuma receita de alquimia cadastrada.")
        return

    for receita in receitas:
        receita.pop("_id", None)

    print(f"\n{len(receitas)} receita(s) de alquimia cadastrada(s):\n")
    print(json.dumps(receitas, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    listar_alquimia()
