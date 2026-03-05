"""
Busca uma armadura pelo nome no banco de dados MongoDB.

Uso:
    python buscar_armadura.py
    (o nome da armadura será solicitado interativamente)
"""

import json
import re
import sys

from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"
COLLECTION = "armaduras"


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def buscar_armadura(nome):
    db = conectar()
    colecao = db[COLLECTION]

    armadura = colecao.find_one({"nome": re.compile(f"^{re.escape(nome)}$", re.IGNORECASE)})

    if armadura is None:
        print(f"Nenhuma armadura encontrada com o nome '{nome}'.")
        return

    armadura.pop("_id", None)
    print(json.dumps(armadura, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    nome = input("Digite o nome da armadura que deseja buscar: ").strip()
    if not nome:
        print("Nenhum nome informado.")
        sys.exit(1)
    buscar_armadura(nome)
