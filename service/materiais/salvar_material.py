"""
Salva materiais no banco de dados MongoDB a partir de todos os JSONs em resources/materiais/.

Uso:
    python salvar_material.py
"""

import glob
import json
import os
import sys

from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DATABASE = "rpg"
COLLECTION = "materiais"

CAMPOS_OBRIGATORIOS = ["rank", "material", "bonus", "peso", "raridade",
                       "durabilidade", "efeito", "tipo"]

RESOURCES_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "resources", "materiais")


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def salvar_materiais():
    pasta = os.path.abspath(RESOURCES_DIR)
    arquivos = sorted(glob.glob(os.path.join(pasta, "*.json")))

    if not arquivos:
        print(f"Nenhum JSON encontrado em {pasta}/")
        sys.exit(1)

    db = conectar()
    colecao = db[COLLECTION]

    total = 0
    salvos_total = 0

    for arquivo in arquivos:
        nome_arquivo = os.path.basename(arquivo)
        with open(arquivo, "r", encoding="utf-8") as f:
            try:
                dados = json.load(f)
            except json.JSONDecodeError as e:
                print(f"Erro em {nome_arquivo}: JSON inválido – {e}")
                continue

        if not isinstance(dados, list):
            print(f"Erro em {nome_arquivo}: deve conter uma lista de objetos.")
            continue

        salvos = 0
        for i, mat in enumerate(dados):
            faltando = [c for c in CAMPOS_OBRIGATORIOS if c not in mat]
            if faltando:
                print(f"[{nome_arquivo}:{i}] Pulando – campos faltando: {', '.join(faltando)}")
                continue

            for campo in CAMPOS_OBRIGATORIOS:
                mat[campo] = str(mat[campo]) if mat[campo] is not None else ""

            try:
                resultado = colecao.insert_one(mat)
                print(f"  Material '{mat['material']}' ({mat['tipo']}) salvo! (id: {resultado.inserted_id})")
                salvos += 1
            except DuplicateKeyError:
                print(f"  Material '{mat['material']}' ({mat['tipo']}) já existe – pulando.")

        print(f"{nome_arquivo}: {salvos}/{len(dados)} salvo(s).\n")
        total += len(dados)
        salvos_total += salvos

    print(f"Total: {salvos_total}/{total} material(is) salvo(s).")


if __name__ == "__main__":
    salvar_materiais()
