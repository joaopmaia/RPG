"""
Salva reinos no banco de dados MongoDB a partir do arquivo resources/Reinos.json.

Uso:
    python salvar_reino.py
"""

import json
import os
import sys

from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DATABASE = "rpg"
COLLECTION = "reinos"

CAMPOS_OBRIGATORIOS = ["nome", "armas", "armaduras", "escudos", "ferramentas",
                       "runicos", "servicos", "alquimia", "materiais"]

RESOURCES_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "resources", "Reinos.json")


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def salvar_reinos(caminho_json):
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
    for i, reino in enumerate(dados):
        faltando = [c for c in CAMPOS_OBRIGATORIOS if c not in reino]
        if faltando:
            print(f"[{i}] Pulando – campos faltando: {', '.join(faltando)}")
            continue

        for campo in CAMPOS_OBRIGATORIOS:
            reino[campo] = str(reino[campo]) if reino[campo] is not None else ""

        try:
            resultado = colecao.insert_one(reino)
            print(f"Reino '{reino['nome']}' salvo com sucesso! (id: {resultado.inserted_id})")
            salvos += 1
        except DuplicateKeyError:
            print(f"Reino '{reino['nome']}' já existe – pulando.")

    print(f"\n{salvos}/{len(dados)} reino(s) salvo(s).")


if __name__ == "__main__":
    salvar_reinos(RESOURCES_PATH)
