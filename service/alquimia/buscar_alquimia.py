"""
Busca uma receita de alquimia pelo efeito no banco de dados MongoDB.

Uso:
    python buscar_alquimia.py
    (o nome do efeito será solicitado interativamente)
"""

import json
import re
import sys

from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"
COLLECTION = "alquimia"


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def buscar_alquimia(efeito):
    db = conectar()
    colecao = db[COLLECTION]

    receita = colecao.find_one({"efeito": re.compile(f"^{re.escape(efeito)}$", re.IGNORECASE)})

    if receita is None:
        print(f"Nenhuma receita encontrada com o efeito '{efeito}'.")
        return

    receita.pop("_id", None)
    print(json.dumps(receita, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    efeito = input("Digite o efeito da receita que deseja buscar: ").strip()
    if not efeito:
        print("Nenhum efeito informado.")
        sys.exit(1)
    buscar_alquimia(efeito)
