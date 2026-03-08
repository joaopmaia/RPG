from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"

def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]

def listar_npcs(db):
    npcs = list(db.NPC.find())
    if not npcs:
        print("Nenhum NPC encontrado.")
        return None
    print("\nNPCs encontrados:")
    for i, npc in enumerate(npcs, 1):
        print(f"[{i}] Nome: {npc['nome']} | Raça: {npc['raça']} | Tipo: {npc['tipo']} | Nível: {npc['nível']} | Observação: {npc.get('observacoes', '')}")
    return npcs

def prompt_npc_nome(npcs):
    escolha = input("\nDigite o nome ou índice do NPC para exibir detalhes completos: ")
    if escolha.isdigit():
        idx = int(escolha) - 1
        if 0 <= idx < len(npcs):
            return npcs[idx]
    for npc in npcs:
        if npc['nome'] == escolha:
            return npc
    print("NPC não encontrado.")
    return None

def exibir_npc_full(npc):
    print("\n══════════════════════════════════════════════════════")
    print("                NPC COMPLETO")
    print("══════════════════════════════════════════════════════")
    for key, value in npc.items():
        print(f"{key}: {value}")
    print("══════════════════════════════════════════════════════")

def main():
    db = conectar()
    npcs = listar_npcs(db)
    if not npcs:
        return
    npc = prompt_npc_nome(npcs)
    if npc:
        exibir_npc_full(npc)

if __name__ == "__main__":
    main()
