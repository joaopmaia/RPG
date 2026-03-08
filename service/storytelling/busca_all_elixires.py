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
    escolha = input("\nDigite o nome ou índice do NPC para exibir todos os elixires: ")
    if escolha.isdigit():
        idx = int(escolha) - 1
        if 0 <= idx < len(npcs):
            return npcs[idx]
    for npc in npcs:
        if npc['nome'] == escolha:
            return npc
    print("NPC não encontrado.")
    return None

def exibir_all_elixires_npc(db, npc):
    elixires = list(db.elixir_NPC.find({"personagem_dono": npc['nome']}))
    print(f"\nTodos os elixires de {npc['nome']}:")
    if not elixires:
        print("Nenhum elixir encontrado para este NPC.")
        return
    for i, el in enumerate(elixires, 1):
        print(f"\n[{i}] {el['nome']} (Efeito: {el.get('efeito', '?')}, Matéria-prima: {el.get('materia_prima', '?')}, Bônus: {el.get('bonus_materia_prima', '?')})")
        for k, v in el.items():
            if k not in ['_id', 'personagem_dono', 'nome', 'efeito', 'materia_prima', 'bonus_materia_prima']:
                print(f"    {k}: {v}")

def main():
    db = conectar()
    npcs = listar_npcs(db)
    if not npcs:
        return
    npc = prompt_npc_nome(npcs)
    if npc:
        exibir_all_elixires_npc(db, npc)

if __name__ == "__main__":
    main()
