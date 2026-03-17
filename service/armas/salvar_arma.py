"""
Salva armas no banco de dados MongoDB a partir do arquivo resources/armas.json.

Uso:
    python salvar_arma.py
"""

import json
import os
import sys

from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DATABASE = "rpg"
COLLECTION = "armas"

CAMPOS_OBRIGATORIOS = ["nome", "dano", "durabilidade", "peso", "preco", "tipo"]

# Caminho relativo à raiz do projeto
RESOURCES_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "resources", "armas.json")


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def salvar_armas(caminho_json: str):
    caminho = os.path.abspath(caminho_json)

    if not os.path.isfile(caminho):
        print(f"Erro: arquivo não encontrado – {caminho}")
        sys.exit(1)

    with open(caminho, "r", encoding="utf-8") as f:
        try:
            dados = json.load(f)
        except json.JSONDecodeError as e:
            print(f"Erro: JSON inválido – {e}")
            sys.exit(1)

    if not isinstance(dados, list):
        print("Erro: o JSON deve conter uma lista de objetos.")
        sys.exit(1)

    db = conectar()
    colecao = db[COLLECTION]

    salvos = 0
    for i, arma in enumerate(dados):
        # Valida campos obrigatórios
        faltando = [c for c in CAMPOS_OBRIGATORIOS if c not in arma]
        if faltando:
            print(f"[{i}] Pulando – campos faltando: {', '.join(faltando)}")
            continue

        # Converte valores para string (trata null → "")
        for campo in CAMPOS_OBRIGATORIOS:
            arma[campo] = str(arma[campo]) if arma[campo] is not None else ""

        try:
            resultado = colecao.insert_one(arma)
            print(f"Arma '{arma['nome']}' salva com sucesso! (id: {resultado.inserted_id})")
            salvos += 1
        except DuplicateKeyError:
            print(f"Arma '{arma['nome']}' já existe – pulando.")

    print(f"\n{salvos}/{len(dados)} arma(s) salva(s).")


if __name__ == "__main__":
    salvar_armas(RESOURCES_PATH)
