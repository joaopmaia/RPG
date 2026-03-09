import sys
from pymongo import MongoClient

# Configurações do Banco
MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"

def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]

def busca_todos_demons():
    db = conectar()
    # Busca na coleção onde os NPCs são salvos, ordenados por nome
    return list(db.demon_NPC.find({"observacoes": {"$regex": "Elemento:"}}).sort("nome", 1))

def exibir_demon_detalhado(npc):
    """
    Imprime os dados do demônio vindo do banco com a estética visual solicitada.
    """
    # Extrai o elemento das observações
    elemento = "Desconhecido"
    for obs in npc.get("observacoes", []):
        if "Elemento:" in obs:
            elemento = obs.split(": ")[1]

    print("\n" + "══════════════════════════════════════════════════════")
    print(f"{'FICHA DO DEMÔNIO SELECIONADO':^54}")
    print("══════════════════════════════════════════════════════")
    print(f"  Nome:             {npc['nome']}")
    print(f"  Categoria:        {npc.get('nível', 'inferior').capitalize()}")
    print(f"  Elemento:         {elemento}")
    print(f"  HP:               {npc['hp_total']}")
    print(f"  Armadura Natural: {npc['armadura']} (Redução de Dano)")
    print(f"  Perícia:          +{npc['pericia']}")
    print(f"  Dado Físico:      {npc['dano']}")
    
    print("──────────────────────────────────────────────────────")
    print("  ATRIBUTOS:")
    
    # Identifica especializações para colocar a estrela ★
    especializacoes = ""
    for obs in npc.get("observacoes", []):
        if "Especializações:" in obs:
            especializacoes = obs

    attrs_ordem = [
        "forca", "destreza", "vitalidade", "inteligencia", 
        "espirito", "carisma", "percepcao"
    ]
    nomes_display = {
        "forca": "Força", "destreza": "Destreza", "vitalidade": "Vitalidade",
        "inteligencia": "Inteligência", "espirito": "Espírito", 
        "carisma": "Carisma", "percepcao": "Percepção"
    }

    for key in attrs_ordem:
        nome_exibir = nomes_display[key]
        valor = npc.get(key, 0)
        marca = " ★" if nome_exibir in especializacoes else ""
        print(f"    {nome_exibir:<14} {valor}{marca}")

    print("──────────────────────────────────────────────────────")
    print(f"  ATAQUES E HABILIDADES:")
    for i, atk in enumerate(npc.get("ataques", []), 1):
        # Separa nome e descrição se estiver no formato "Nome: Descrição"
        if ":" in atk:
            nome_atk, desc_atk = atk.split(":", 1)
            print(f"    {i}. {nome_atk.strip()}")
            print(f"       {desc_atk.strip()}")
        else:
            print(f"    {i}. {atk}")
        print()

    # Loot
    print("──────────────────────────────────────────────────────")
    print(f"  LOOT — Restos Demoníacos:")
    if not npc.get("loot"):
        print("    Nenhum material encontrado.")
    else:
        for i, item in enumerate(npc["loot"], 1):
            print(f"    {i}. {item}")

    print("\n" + "══════════════════════════════════════════════════════")

def menu_busca_demon():
    demons = busca_todos_demons()
    
    if not demons:
        print("\n[!] Nenhum demônio encontrado no banco de dados.")
        return

    print("\n" + "─"*54)
    print(f"{'LISTA DE DEMÔNIOS NO BANCO':^54}")
    print("─"*54)
    
    for i, d in enumerate(demons, 1):
        tier = d.get('nível', '???').capitalize()
        # Busca o elemento nas observações para mostrar na lista
        elem_lista = "???"
        for obs in d.get("observacoes", []):
            if "Elemento:" in obs:
                elem_lista = obs.split(": ")[1]
        
        print(f"  {i:>2}. {d['nome']:<25} | {tier:<10} | {elem_lista}")

    print(f"  {0:>2}. Sair")
    print("─"*54)

    while True:
        try:
            escolha = int(input("\nSelecione o número do demônio para ver detalhes: "))
            if escolha == 0:
                break
            if 1 <= escolha <= len(demons):
                exibir_demon_detalhado(demons[escolha - 1])
                input("Pressione Enter para voltar à lista...")
                return menu_busca_demon()
            else:
                print(f"Escolha entre 1 e {len(demons)}.")
        except ValueError:
            print("Entrada inválida. Digite um número.")

if __name__ == "__main__":
    try:
        menu_busca_demon()
    except KeyboardInterrupt:
        print("\nBusca encerrada.")