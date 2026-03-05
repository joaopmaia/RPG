"""
Busca uma arma pelo nome no banco de dados MongoDB.

Uso:
    python buscar_arma.py
    (o nome da arma será solicitado interativamente)
    Digite 'listar' para ver todas as armas cadastradas.
"""

import json
import sys
import unicodedata

from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"
COLLECTION = "armas"

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


def buscar_arma(nome):
    db = conectar()
    colecao = db[COLLECTION]

    nome_normalizado = remover_acentos(nome).lower()

    for arma in colecao.find():
        valor = remover_acentos(arma.get("nome", "")).lower()
        if nome_normalizado == valor:
            arma.pop("_id", None)
            print(json.dumps(arma, indent=2, ensure_ascii=False))
            _exibir_dificuldade()
            return

    print(f"Nenhuma arma encontrada com o nome '{nome}'.")


def listar_armas():
    db = conectar()
    colecao = db[COLLECTION]
    itens = list(colecao.find({}, {"nome": 1}).sort("nome", 1))

    if not itens:
        print("Nenhuma arma cadastrada.")
        return

    print("\nArmas cadastradas:\n")
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
    entrada = input("Digite o nome da arma (ou 'listar'): ").strip()

    if not entrada:
        print("Nenhum nome informado.")
        sys.exit(1)

    if entrada.lower() == "listar":
        listar_armas()
    else:
        buscar_arma(entrada)
