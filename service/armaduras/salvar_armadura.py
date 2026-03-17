"""
Salva armaduras no banco de dados MongoDB a partir do arquivo resources/Armaduras.json.

Uso:
    python salvar_armadura.py
"""

import json
import os
import sys

from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DATABASE = "rpg"
COLLECTION = "armaduras"

CAMPOS_OBRIGATORIOS = ["nome", "defesa", "durabilidade", "peso", "tipo", "preco"]

RESOURCES_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "resources", "Armaduras.json")


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def salvar_armaduras(caminho_json):
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
    for i, armadura in enumerate(dados):
        faltando = [c for c in CAMPOS_OBRIGATORIOS if c not in armadura]
        if faltando:
            print(f"[{i}] Pulando – campos faltando: {', '.join(faltando)}")
            continue

        for campo in CAMPOS_OBRIGATORIOS:
            armadura[campo] = str(armadura[campo]) if armadura[campo] is not None else ""

        try:
            resultado = colecao.insert_one(armadura)
            print(f"Armadura '{armadura['nome']}' salva com sucesso! (id: {resultado.inserted_id})")
            salvos += 1
        except DuplicateKeyError:
            print(f"Armadura '{armadura['nome']}' já existe – pulando.")

    print(f"\n{salvos}/{len(dados)} armadura(s) salva(s).")


if __name__ == "__main__":
    salvar_armaduras(RESOURCES_PATH)
