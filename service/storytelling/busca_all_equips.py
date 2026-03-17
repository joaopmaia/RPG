import os
from pymongo import MongoClient

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
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
    escolha = input("\nDigite o nome ou índice do NPC para exibir todos os equipamentos: ")
    if escolha.isdigit():
        idx = int(escolha) - 1
        if 0 <= idx < len(npcs):
            return npcs[idx]
    for npc in npcs:
        if npc['nome'] == escolha:
            return npc
    print("NPC não encontrado.")
    return None

def exibir_equipamentos_npc(db, npc):
    equips = list(db.equipamentos_NPC.find({"personagem_dono": npc['nome']}))
    print(f"\nEquipamentos de {npc['nome']}:")
    if not equips:
        print("Nenhum equipamento encontrado para este NPC.")
        return
    for i, eq in enumerate(equips, 1):
        print(f"\n[{i}] {eq['nome']} (Tipo: {eq.get('tipo', '?')}, Material: {eq.get('nome_material', '?')}, Raridade: {eq.get('raridade', '?')})")
        for k, v in eq.items():
            if k not in ['_id', 'personagem_dono', 'nome', 'tipo', 'nome_material', 'raridade']:
                print(f"    {k}: {v}")

def main():
    db = conectar()
    npcs = listar_npcs(db)
    if not npcs:
        return
    npc = prompt_npc_nome(npcs)
    if npc:
        exibir_equipamentos_npc(db, npc)

if __name__ == "__main__":
    main()
