from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def busca_all_feras():
    db = conectar()
    feras = list(db.fera_NPC.find())
    return feras

if __name__ == "__main__":
    feras = busca_all_feras()
    for fera in feras:
        print(fera)
