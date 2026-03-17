"""
Busca uma armadura pelo nome no banco de dados MongoDB.

Uso:
    python buscar_armadura.py
    (o nome da armadura será solicitado interativamente)
    Digite 'listar' para ver todas as armaduras cadastradas.
"""

import json
import os
import sys
import unicodedata

from pymongo import MongoClient

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DATABASE = "rpg"
COLLECTION = "armaduras"

DIFICULDADE_CONSTRUCAO = {
    "Comum": 10,
    "Incomum": 12,
    "Raro": 15,
    "Épico": 17,
    "Lendário": 20,
}


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def remover_acentos(texto):
    nfkd = unicodedata.normalize('NFKD', texto)
    return ''.join(c for c in nfkd if not unicodedata.combining(c))


def _exibir_dificuldade():
    """Exibe a tabela de dificuldade de construção por raridade do material."""
    print("\n  Dificuldade de Construção (por raridade do material):")
    for rar, dif in DIFICULDADE_CONSTRUCAO.items():
        print(f"    {rar:<12} Dificuldade: {dif}")
    print()


def buscar_armadura(nome):
    db = conectar()
    colecao = db[COLLECTION]

    nome_normalizado = remover_acentos(nome).lower()

    for armadura in colecao.find():
        valor = remover_acentos(armadura.get("nome", "")).lower()
        if nome_normalizado == valor:
            armadura.pop("_id", None)
            print(json.dumps(armadura, indent=2, ensure_ascii=False))
            _exibir_dificuldade()
            return

    print(f"Nenhuma armadura encontrada com o nome '{nome}'.")


def listar_armaduras():
    db = conectar()
    colecao = db[COLLECTION]
    itens = list(colecao.find({}, {"nome": 1}).sort("nome", 1))

    if not itens:
        print("Nenhuma armadura cadastrada.")
        return

    print("\nArmaduras cadastradas:\n")
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
    _exibir_dificuldade()


if __name__ == "__main__":
    entrada = input("Digite o nome da armadura (ou 'listar'): ").strip()

    if not entrada:
        print("Nenhum nome informado.")
        sys.exit(1)

    if entrada.lower() == "listar":
        listar_armaduras()
    else:
        buscar_armadura(entrada)
