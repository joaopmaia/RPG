"""
Salva receitas de alquimia no banco de dados MongoDB a partir do arquivo resources/Alquimia.json.

Uso:
    python salvar_alquimia.py
"""

import json
import os
import sys

from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"
COLLECTION = "alquimia"

CAMPOS_OBRIGATORIOS = [
    "nome", "efeito", "vegetal_rar", "vegetal_pot", "animal_rar", "animal_pot",
    "mineral_rar", "mineral_pot", "demoníaco_rar", "demoníaco_pot", "descrição"
]

RESOURCES_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "resources", "Alquimia.json")


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def salvar_alquimia(caminho_json):
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
    for i, receita in enumerate(dados):
        faltando = [c for c in CAMPOS_OBRIGATORIOS if c not in receita]
        if faltando:
            print(f"[{i}] Pulando – campos faltando: {', '.join(faltando)}")
            continue

        for campo in CAMPOS_OBRIGATORIOS:
            receita[campo] = str(receita[campo]) if receita[campo] is not None else ""

        try:
            resultado = colecao.insert_one(receita)
            print(f"Receita '{receita['nome']}' salva com sucesso! (id: {resultado.inserted_id})")
            salvos += 1
        except DuplicateKeyError:
            print(f"Receita '{receita['nome']}' já existe – pulando.")

    print(f"\n{salvos}/{len(dados)} receita(s) salva(s).")


if __name__ == "__main__":
    salvar_alquimia(RESOURCES_PATH)
