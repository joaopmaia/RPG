"""
Busca uma receita de alquimia pelo efeito no banco de dados MongoDB.

Uso:
    python buscar_alquimia.py
    (o nome do efeito será solicitado interativamente)
    Digite 'listar' para ver todas as receitas cadastradas.
"""

import json
import sys
import unicodedata

from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"
COLLECTION = "alquimia"


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def remover_acentos(texto):
    nfkd = unicodedata.normalize('NFKD', texto)
    return ''.join(c for c in nfkd if not unicodedata.combining(c))


def buscar_alquimia(efeito):
    db = conectar()
    colecao = db[COLLECTION]

    efeito_normalizado = remover_acentos(efeito).lower()

    for receita in colecao.find():
        valor = remover_acentos(receita.get("efeito", "")).lower()
        if efeito_normalizado == valor:
            receita.pop("_id", None)
            print(json.dumps(receita, indent=2, ensure_ascii=False))
            return

    print(f"Nenhuma receita encontrada com o efeito '{efeito}'.")


def listar_alquimia():
    db = conectar()
    colecao = db[COLLECTION]
    itens = list(colecao.find({}, {"efeito": 1}).sort("efeito", 1))

    if not itens:
        print("Nenhuma receita de alquimia cadastrada.")
        return

    print("\nReceitas de alquimia cadastradas:\n")
    for i, item in enumerate(itens, start=1):
        print(f"  [{i}] {item['efeito']}")

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
    entrada = input("Digite o efeito da receita (ou 'listar'): ").strip()

    if not entrada:
        print("Nenhum efeito informado.")
        sys.exit(1)

    if entrada.lower() == "listar":
        listar_alquimia()
    else:
        buscar_alquimia(entrada)
