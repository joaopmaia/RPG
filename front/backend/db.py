"""
Conexão com MongoDB para o backend.
Reutiliza um único cliente (singleton) para evitar múltiplas conexões e falhas por timeout.
"""
import logging
from typing import Optional

from pymongo import MongoClient
from pymongo.database import Database

from config import settings

MONGO_URI = settings.mongo_uri
DATABASE = settings.rpg_database

_client: Optional[MongoClient] = None
_log = logging.getLogger("rpg.db")


def _safe_uri(uri: str) -> str:
    if not uri or "@" not in uri or "://" not in uri:
        return uri
    try:
        scheme, rest = uri.split("://", 1)
        if "@" in rest:
            hostpart = rest.split("@", 1)[1]
            return f"{scheme}://***@{hostpart}"
    except Exception:
        pass
    return uri


def get_db() -> Database:
    global _client
    if _client is None:
        _log.info("MongoDB | conexão nova | db=%s | uri=%s", DATABASE, _safe_uri(MONGO_URI))
        _client = MongoClient(
            MONGO_URI,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000,
            socketTimeoutMS=10000,
        )
    return _client[DATABASE]
