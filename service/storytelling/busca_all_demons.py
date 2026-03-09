from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def busca_all_demons():
    db = conectar()
    demons = list(db.demon_NPC.find())
    return demons

if __name__ == "__main__":
    demons = busca_all_demons()
    for demon in demons:
        print(demon)
