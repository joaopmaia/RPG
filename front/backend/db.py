"""
Conexão com MongoDB para o front local.
"""
import os
from pymongo import MongoClient
from pymongo.database import Database

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DATABASE = os.environ.get("RPG_DATABASE", "rpg")


def get_db() -> Database:
    client = MongoClient(MONGO_URI)
    return client[DATABASE]
