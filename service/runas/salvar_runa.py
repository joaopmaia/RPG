"""
Salva runas no banco de dados MongoDB a partir dos JSONs em resources/runas/.

Uso:
    python salvar_runa.py
"""

import json
import os
import sys

from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"
COLLECTION = "runas"

CAMPOS_OBRIGATORIOS = ["tier", "elementos", "efeito", "bonus", "nome", "descricao"]

RESOURCES_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "resources", "runas")


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def salvar_runas(diretorio):
    diretorio = os.path.abspath(diretorio)

    if not os.path.isdir(diretorio):
        print(f"Erro: diretório não encontrado – {diretorio}")
        sys.exit(1)

    db = conectar()
    colecao = db[COLLECTION]

    salvos = 0
    total = 0

    for arquivo in sorted(os.listdir(diretorio)):
        if not arquivo.endswith(".json"):
            continue

        caminho = os.path.join(diretorio, arquivo)
        with open(caminho, "r", encoding="utf-8") as f:
            try:
                dados = json.load(f)
            except json.JSONDecodeError as e:
                print(f"Erro no arquivo {arquivo}: {e}")
                continue

        if not isinstance(dados, list):
            print(f"Arquivo {arquivo}: esperava lista, pulando.")
            continue

        for i, runa in enumerate(dados):
            total += 1
            faltando = [c for c in CAMPOS_OBRIGATORIOS if c not in runa]
            if faltando:
                print(f"[{arquivo}:{i}] Pulando – campos faltando: {', '.join(faltando)}")
                continue

            try:
                resultado = colecao.insert_one(runa)
                print(f"Runa '{runa['nome']}' salva com sucesso! (id: {resultado.inserted_id})")
                salvos += 1
            except DuplicateKeyError:
                print(f"Runa '{runa['nome']}' já existe – pulando.")

    print(f"\n{salvos}/{total} runa(s) salva(s).")


if __name__ == "__main__":
    salvar_runas(RESOURCES_DIR)
