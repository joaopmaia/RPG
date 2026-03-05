"""
Busca materiais por tipo no banco de dados MongoDB.

Uso:
    python buscar_material.py
    (o tipo será solicitado interativamente)
"""

import json
import sys

from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"
COLLECTION = "materiais"

TIPOS = ["vegetal", "animal", "demon", "mineral"]


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def buscar_por_tipo(tipo):
    db = conectar()
    colecao = db[COLLECTION]

    materiais = list(colecao.find({"tipo": tipo}))

    if not materiais:
        print(f"Nenhum material encontrado com o tipo '{tipo}'.")
        return

    for mat in materiais:
        mat.pop("_id", None)

    print(f"\n{len(materiais)} material(is) do tipo '{tipo}':\n")
    print(json.dumps(materiais, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    print("Selecione o tipo de material:\n")
    for i, tipo in enumerate(TIPOS, start=1):
        print(f"  [{i}] {tipo}")

    print()
    escolha = input("Digite o número da opção desejada: ").strip()

    try:
        indice = int(escolha) - 1
        if indice < 0 or indice >= len(TIPOS):
            raise ValueError
    except ValueError:
        print("Opção inválida.")
        sys.exit(1)

    buscar_por_tipo(TIPOS[indice])
