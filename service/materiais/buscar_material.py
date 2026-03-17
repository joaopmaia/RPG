"""
Busca materiais por tipo no banco de dados MongoDB.

Uso:
    python buscar_material.py
    (o tipo será solicitado interativamente)
    Digite 'listar' para ver todos os materiais cadastrados.
"""

import json
import os
import sys
import unicodedata

from pymongo import MongoClient

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DATABASE = "rpg"
COLLECTION = "materiais"

TIPOS = ["vegetal", "animal", "demon", "mineral"]


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def remover_acentos(texto):
    nfkd = unicodedata.normalize('NFKD', texto)
    return ''.join(c for c in nfkd if not unicodedata.combining(c))


def buscar_por_tipo(tipo):
    db = conectar()
    colecao = db[COLLECTION]

    tipo_normalizado = remover_acentos(tipo).lower()

    materiais = []
    for mat in colecao.find():
        valor = remover_acentos(mat.get("tipo", "")).lower()
        if tipo_normalizado == valor:
            mat.pop("_id", None)
            materiais.append(mat)

    if not materiais:
        print(f"Nenhum material encontrado com o tipo '{tipo}'.")
        return

    print(f"\n{len(materiais)} material(is) do tipo '{tipo}':\n")
    print(json.dumps(materiais, indent=2, ensure_ascii=False))


def listar_materiais():
    db = conectar()
    colecao = db[COLLECTION]
    itens = list(colecao.find({}, {"material": 1, "tipo": 1}).sort("material", 1))

    if not itens:
        print("Nenhum material cadastrado.")
        return

    print("\nMateriais cadastrados:\n")
    for i, item in enumerate(itens, start=1):
        print(f"  [{i}] {item['material']} ({item.get('tipo', '')})")

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
    print("Selecione o tipo de material:\n")
    for i, tipo in enumerate(TIPOS, start=1):
        print(f"  [{i}] {tipo}")

    print()
    escolha = input("Digite o número da opção (ou 'listar' para ver todos): ").strip()

    if escolha.lower() == "listar":
        listar_materiais()
    else:
        try:
            indice = int(escolha) - 1
            if indice < 0 or indice >= len(TIPOS):
                raise ValueError
        except ValueError:
            print("Opção inválida.")
            sys.exit(1)

        buscar_por_tipo(TIPOS[indice])
