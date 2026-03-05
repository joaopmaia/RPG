"""
Busca uma arma pelo nome no banco de dados MongoDB.

Uso:
    python buscar_arma.py
    (o nome da arma será solicitado interativamente)
"""

import json
import re
import sys

from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"
COLLECTION = "armas"


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def buscar_arma(nome: str):
    db = conectar()
    colecao = db[COLLECTION]

    arma = colecao.find_one({"nome": re.compile(f"^{re.escape(nome)}$", re.IGNORECASE)})

    if arma is None:
        print(f"Nenhuma arma encontrada com o nome '{nome}'.")
        return

    # Remove o _id do MongoDB para exibição limpa
    arma.pop("_id", None)

    print(json.dumps(arma, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    nome = input("Digite o nome da arma que deseja buscar: ").strip()
    if not nome:
        print("Nenhum nome informado.")
        sys.exit(1)
    buscar_arma(nome)
