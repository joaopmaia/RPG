"""
"""Busca uma receita de alquimia pelo nome no banco de dados MongoDB.

Uso:
    python buscar_alquimia.py
    (o nome da receita será solicitado interativamente)
    Digite 'listar' para ver todas as receitas cadastradas.
"""

import json
import os
import sys
import unicodedata

from pymongo import MongoClient

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DATABASE = "rpg"
COLLECTION = "alquimia"

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


def _exibir_dificuldade(receita):
    """Exibe a dificuldade de construção por tipo de ingrediente."""
    tipos = [
        ("vegetal", "Vegetal"),
        ("animal", "Animal"),
        ("mineral", "Mineral"),
        ("demoníaco", "Demoníaco"),
    ]
    print("\n  Dificuldade de Construção:")
    for chave, label in tipos:
        rar = receita.get(f"{chave}_rar", "-")
        if rar != "-":
            dif = DIFICULDADE_CONSTRUCAO.get(rar, "?")
            print(f"    {label:<12} {rar} — Dificuldade: {dif}")
        else:
            print(f"    {label:<12} Não disponível")
    print()


def buscar_alquimia(nome):
    db = conectar()
    colecao = db[COLLECTION]

    nome_normalizado = remover_acentos(nome).lower()

    for receita in colecao.find():
        valor = remover_acentos(receita.get("nome", "")).lower()
        if nome_normalizado == valor:
            receita.pop("_id", None)
            print(json.dumps(receita, indent=2, ensure_ascii=False))
            _exibir_dificuldade(receita)
            return

    print(f"Nenhuma receita encontrada com o nome '{nome}'.")


def listar_alquimia():
    db = conectar()
    colecao = db[COLLECTION]
    itens = list(colecao.find({}, {"nome": 1}).sort("nome", 1))

    if not itens:
        print("Nenhuma receita de alquimia cadastrada.")
        return

    print("\nReceitas de alquimia cadastradas:\n")
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
    _exibir_dificuldade(resultado)


if __name__ == "__main__":
    entrada = input("Digite o nome da receita (ou 'listar'): ").strip()

    if not entrada:
        print("Nenhum nome informado.")
        sys.exit(1)

    if entrada.lower() == "listar":
        listar_alquimia()
    else:
        buscar_alquimia(entrada)
