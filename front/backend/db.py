"""
Conexão com MongoDB para o front local.
Reutiliza um único cliente (singleton) para evitar múltiplas conexões e falhas por timeout.
"""
import os
from typing import Optional
from pymongo import MongoClient
from pymongo.database import Database

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DATABASE = os.environ.get("RPG_DATABASE", "rpg")

_client: Optional[MongoClient] = None


def get_db() -> Database:
    global _client
    if _client is None:
        _client = MongoClient(
            MONGO_URI,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000,
            socketTimeoutMS=10000,
        )
    return _client[DATABASE]
