"""
Busca um reino pelo nome no banco de dados MongoDB.

Uso:
    python buscar_reino.py
    (o nome do reino será solicitado interativamente)
"""

import json
import re
import sys

from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"
COLLECTION = "reinos"


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def buscar_reino(nome):
    db = conectar()
    colecao = db[COLLECTION]

    reino = colecao.find_one({"nome": re.compile(f"^{re.escape(nome)}$", re.IGNORECASE)})

    if reino is None:
        print(f"Nenhum reino encontrado com o nome '{nome}'.")
        return

    reino.pop("_id", None)
    print(json.dumps(reino, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    nome = input("Digite o nome do reino que deseja buscar: ").strip()
    if not nome:
        print("Nenhum nome informado.")
        sys.exit(1)
    buscar_reino(nome)
