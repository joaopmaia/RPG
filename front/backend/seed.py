"""
Seed: carrega dados default do jogo (armas, armaduras, alquimia, reinos, materiais, runas)
a partir dos JSONs em resources/. Executado ao iniciar o backend.
"""
import glob
import json
import os
from pymongo.errors import DuplicateKeyError

from db import get_db

# Projeto raiz: front/backend/../../ = raiz do RPG
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
RESOURCES = os.path.join(PROJECT_ROOT, "resources")


def _load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _seed_armas(db):
    path = os.path.join(RESOURCES, "armas.json")
    if not os.path.isfile(path):
        return 0
    dados = _load_json(path)
    col = db["armas"]
    n = 0
    for item in dados:
        if not all(item.get(k) is not None for k in ("nome", "dano", "durabilidade", "peso", "preco", "tipo")):
            continue
        try:
            col.insert_one({k: str(v) if v is not None else "" for k, v in item.items()})
            n += 1
        except DuplicateKeyError:
            pass
    return n


def _seed_armaduras(db):
    path = os.path.join(RESOURCES, "Armaduras.json")
    if not os.path.isfile(path):
        return 0
    dados = _load_json(path)
    col = db["armaduras"]
    n = 0
    for item in dados:
        if not all(item.get(k) is not None for k in ("nome", "defesa", "peso", "durabilidade", "tipo", "preco")):
            continue
        try:
            col.insert_one({k: str(v) if v is not None else "" for k, v in item.items()})
            n += 1
        except DuplicateKeyError:
            pass
    return n


def _seed_alquimia(db):
    path = os.path.join(RESOURCES, "Alquimia.json")
    if not os.path.isfile(path):
        return 0
    dados = _load_json(path)
    col = db["alquimia"]
    n = 0
    for item in dados:
        try:
            col.insert_one(item)
            n += 1
        except DuplicateKeyError:
            pass
    return n


def _seed_reinos(db):
    path = os.path.join(RESOURCES, "Reinos.json")
    if not os.path.isfile(path):
        return 0
    dados = _load_json(path)
    col = db["reinos"]
    obrigatorios = ["nome", "armas", "armaduras", "escudos", "ferramentas", "runicos", "servicos", "alquimia", "materiais"]
    n = 0
    for item in dados:
        if not all(item.get(k) is not None for k in obrigatorios):
            continue
        try:
            col.insert_one(item)
            n += 1
        except DuplicateKeyError:
            pass
    return n


def _seed_materiais(db):
    pasta = os.path.join(RESOURCES, "materiais")
    if not os.path.isdir(pasta):
        return 0
    col = db["materiais"]
    n = 0
    for path in sorted(glob.glob(os.path.join(pasta, "*.json"))):
        try:
            dados = _load_json(path)
        except Exception:
            continue
        if not isinstance(dados, list):
            continue
        for item in dados:
            if not all(item.get(k) is not None for k in ("rank", "material", "bonus", "peso", "raridade", "durabilidade", "efeito", "tipo")):
                continue
            try:
                col.insert_one({k: str(v) if v is not None else "" for k, v in item.items()})
                n += 1
            except DuplicateKeyError:
                pass
    return n


def _seed_runas(db):
    pasta = os.path.join(RESOURCES, "runas")
    if not os.path.isdir(pasta):
        return 0
    col = db["runas"]
    n = 0
    for path in sorted(glob.glob(os.path.join(pasta, "*.json"))):
        try:
            dados = _load_json(path)
        except Exception:
            continue
        if not isinstance(dados, list):
            continue
        for item in dados:
            if not all(item.get(k) is not None for k in ("tier", "elementos", "efeito", "bonus", "nome", "descricao")):
                continue
            try:
                col.insert_one(item)
                n += 1
            except DuplicateKeyError:
                pass
    return n


def run_seed_if_needed():
    """Executa o seed apenas se as collections base estiverem vazias, evitando duplicação."""
    db = get_db()
    total = 0
    if db["armas"].count_documents({}) == 0:
        total += _seed_armas(db)
    if db["armaduras"].count_documents({}) == 0:
        total += _seed_armaduras(db)
    if db["alquimia"].count_documents({}) == 0:
        total += _seed_alquimia(db)
    if db["reinos"].count_documents({}) == 0:
        total += _seed_reinos(db)
    if db["materiais"].count_documents({}) == 0:
        total += _seed_materiais(db)
    if db["runas"].count_documents({}) == 0:
        total += _seed_runas(db)
    if total > 0:
        print(f"[Seed] {total} documento(s) carregado(s) como padrão.")
