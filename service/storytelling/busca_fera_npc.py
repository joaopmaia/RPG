import os
import sys
from pymongo import MongoClient

# Configurações do Banco
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DATABASE = "rpg"

def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]

def busca_todas_feras():
    db = conectar()
    # Busca todas as feras ordenadas por nome
    return list(db.fera_NPC.find().sort("nome", 1))

def exibir_fera_detalhada(npc):
    """
    Imprime os dados da fera vinda do banco (formato NPC) 
    com a estética visual solicitada.
    """
    print("\n" + "═"*54)
    print(f"{'FICHA DA FERA SELECIONADA':^54}")
    print("═"*54)
    print(f"  Nome:             {npc['nome']}")
    print(f"  Tipo/Habitat:     {npc.get('tipo', 'Desconhecido')}")
    print(f"  Nível (Tier):     {npc['nível'].capitalize()}")
    print(f"  HP Total:         {npc['hp_total']}")
    print(f"  Armadura:         {npc['armadura']} (Redução de Dano)")
    print(f"  Perícia:          +{npc['pericia']}")
    print(f"  Dano Base:        {npc['dano']}")
    
    if npc.get("arcana_total", 0) > 0:
        print(f"  Arcana:           {npc['arcana_atual']}/{npc['arcana_total']}")

    print("─"*54)
    print("  ATRIBUTOS:")
    # Mapeamento para garantir a ordem visual
    atributos = [
        ("Força", npc['forca']), ("Destreza", npc['destreza']), 
        ("Vitalidade", npc['vitalidade']), ("Inteligência", npc['inteligencia']),
        ("Espírito", npc['espirito']), ("Carisma", npc['carisma']), 
        ("Percepção", npc['percepcao'])
    ]
    
    # Tenta identificar especializações pelas observações para colocar a estrela ★
    especializacoes = ""
    for obs in npc.get("observacoes", []):
        if "Especializações:" in obs:
            especializacoes = obs

    for nome_attr, valor in atributos:
        marca = " ★" if nome_attr in especializacoes else ""
        print(f"    {nome_attr:<14} {valor}{marca}")

    print("─"*54)
    print("  ATAQUES E EFEITOS:")
    for atk in npc.get("ataques", []):
        print(f"    • {atk}")
    
    if npc.get("ataque_special"):
        print(f"    • Especial: {npc['ataque_especial']}")
        
    print(f"    • Crítico: {npc.get('efeito_ataque_critico', 'Nenhum')}")

    # Essências/Runas
    if npc.get("runas"):
        print("─"*54)
        print("  ESSÊNCIAS RÚNICAS:")
        for runa in npc["runas"]:
            print(f"    [◊] {runa}")

    # Loot
    print("─"*54)
    print("  LOOT POSSÍVEL:")
    if not npc.get("loot"):
        print("    Nenhum material cadastrado.")
    else:
        for item in npc["loot"]:
            print(f"    - {item}")

    print("═"*54 + "\n")

def menu_busca():
    feras = busca_todas_feras()
    
    if not feras:
        print("\n[!] Nenhuma fera encontrada no banco de dados.")
        return

    print("\n" + "─"*54)
    print(f"{'LISTA DE FERAS DISPONÍVEIS':^54}")
    print("─"*54)
    
    for i, fera in enumerate(feras, 1):
        # Pega a categoria/tier das observações se disponível
        obs_resumo = ""
        if fera.get("observacoes"):
            obs_resumo = f" | {fera['observacoes'][0]}" # Ex: Tier: comum
        
        print(f"  {i:>2}. {fera['nome']:<20} ({fera.get('tipo', '???')}{obs_resumo})")

    print(f"  {0:>2}. Sair")
    print("─"*54)

    while True:
        try:
            escolha = int(input("\nSelecione o número da fera para ver detalhes: "))
            if escolha == 0:
                print("Encerrando busca.")
                sys.exit()
            if 1 <= escolha <= len(feras):
                exibir_fera_detalhada(feras[escolha - 1])
                
                input("Pressione Enter para voltar à lista...")
                return menu_busca() # Loop de navegação
            else:
                print(f"Escolha entre 1 e {len(feras)}.")
        except ValueError:
            print("Por favor, digite um número válido.")

if __name__ == "__main__":
    try:
        menu_busca()
    except KeyboardInterrupt:
        print("\nBusca encerrada pelo usuário.")