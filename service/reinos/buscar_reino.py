"""
Busca um reino pelo nome no banco de dados MongoDB.

Uso:
    python buscar_reino.py
    (o nome do reino será solicitado interativamente)
    Digite 'listar' para ver todos os reinos cadastrados.
"""

import json
import os
import sys
import unicodedata

from pymongo import MongoClient

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DATABASE = "rpg"
COLLECTION = "reinos"


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def remover_acentos(texto):
    nfkd = unicodedata.normalize('NFKD', texto)
    return ''.join(c for c in nfkd if not unicodedata.combining(c))


def buscar_reino(nome):
    db = conectar()
    colecao = db[COLLECTION]

    nome_normalizado = remover_acentos(nome).lower()

    for reino in colecao.find():
        valor = remover_acentos(reino.get("nome", "")).lower()
        if nome_normalizado == valor:
            reino.pop("_id", None)
            print(json.dumps(reino, indent=2, ensure_ascii=False))
            return

    print(f"Nenhum reino encontrado com o nome '{nome}'.")


def listar_reinos():
    db = conectar()
    colecao = db[COLLECTION]
    itens = list(colecao.find({}, {"nome": 1}).sort("nome", 1))

    if not itens:
        print("Nenhum reino cadastrado.")
        return

    print("\nReinos cadastrados:\n")
    for i, item in enumerate(itens, start=1):
        print(f"  [{i}] {item['nome']}")

    print()
    escolha = input("Digite o número do item para ver detalhes (ou Enter para sair): ").strip()

    if not escolha:
        return

    try:
        indice = int(escolha) - 1
        if indice < 0 or indice >= len(itens):
            raise ValueError
    except ValueError:
        print("Opção inválida.")
        sys.exit(1)

    resultado = colecao.find_one({"_id": itens[indice]["_id"]})
    resultado.pop("_id", None)
    print(json.dumps(resultado, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    entrada = input("Digite o nome do reino (ou 'listar'): ").strip()

    if not entrada:
        print("Nenhum nome informado.")
        sys.exit(1)

    if entrada.lower() == "listar":
        listar_reinos()
    else:
        buscar_reino(entrada)
