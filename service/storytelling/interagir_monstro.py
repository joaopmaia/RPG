import random
import sys
from pymongo import MongoClient
from bson.objectid import ObjectId

# Configurações do Banco
MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"

def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]

def selecionar_alvo():
    db = conectar()
    print("\n" + "═"*54)
    print(f"{'MODO DE INTERAÇÃO':^54}")
    print("═"*54)
    print("  1. Feras (coleção fera_NPC)")
    print("  2. Demônios (coleção demon_NPC)")
    print("  0. Sair")
    
    escolha = input("\nDeseja interagir com qual tipo? ").strip()
    
    if escolha == '1':
        colecao = "fera_NPC"
    elif escolha == '2':
        colecao = "demon_NPC"
    elif escolha == '0':
        sys.exit()
    else:
        print("Opção inválida.")
        return selecionar_alvo()

    monstros = list(db[colecao].find().sort("nome", 1))
    
    if not monstros:
        print(f"\n[!] Nenhum registro encontrado em {colecao}.")
        return selecionar_alvo()

    print(f"\n--- Selecione o Alvo ({colecao}) ---")
    for i, m in enumerate(monstros, 1):
        print(f"  {i}. {m['nome']} (HP: {m['hp_atual']}/{m['hp_total']}, Tipo: {m.get('tipo', '???')}, Tier: {m.get('nível', '???')})")

        
    
    try:
        idx = int(input("\nEscolha o número do monstro: ")) - 1
        if 0 <= idx < len(monstros):
            return colecao, monstros[idx]
    except ValueError:
        pass
    
    print("Seleção inválida.")
    return selecionar_alvo()

def menu_interativo(colecao, monstro):
    db = conectar()
    mid = monstro["_id"]

    while True:
        # Recarregar dados do monstro para garantir atualização
        m = db[colecao].find_one({"_id": mid})
        
        print(f"\n" + "─"*54)
        print(f" INTERAGINDO COM: {m['nome']} | HP: {m['hp_atual']}/{m['hp_total']}")
        print("─"*54)
        print("  1. Dar Dano")
        print("  2. Curar")
        print("  3. Rolar Atributo")
        print("  4. Adicionar Observação")
        print("  5. Mostrar Ficha")
        print("  6. Mostrar Loot")
        print("  7. Alterar Nome")
        print("  0. Voltar ao Menu Inicial")
        
        op = input("\nEscolha uma ação: ").strip()

        if op == '1':
            try:
                valor_dano = int(input("Valor do dano bruto: "))
                armadura = int(m.get("armadura", 0))
                dano_final = max(0, valor_dano - armadura)
                novo_hp = max(0, int(m["hp_atual"]) - dano_final)
                
                db[colecao].update_one({"_id": mid}, {"$set": {"hp_atual": novo_hp}})
                print(f"\n[💥] Dano: {valor_dano} - Armadura: {armadura} = Final: {dano_final}")
                if novo_hp <= 0:
                    print(f"[💀] O MONSTRO {m['nome'].upper()} FOI MORTO!")
            except ValueError:
                print("Valor de dano inválido.")

        elif op == '2':
            try:
                valor_cura = int(input("Valor da cura: "))
                novo_hp = min(int(m["hp_total"]), int(m["hp_atual"]) + valor_cura)
                db[colecao].update_one({"_id": mid}, {"$set": {"hp_atual": novo_hp}})
                print(f"\n[💚] HP Atualizado: {novo_hp}/{m['hp_total']}")
            except ValueError:
                print("Valor de cura inválido.")

        elif op == '3':
            attrs = ["forca", "destreza", "vitalidade", "inteligencia", "espirito", "carisma", "percepcao"]
            print("\nSelecione o atributo:")
            for i, a in enumerate(attrs, 1): print(f"  {i}. {a.capitalize()}")
            
            try:
                at_idx = int(input("Atributo: ")) - 1
                if 0 <= at_idx < len(attrs):
                    attr_nome = attrs[at_idx]
                    valor_attr = int(m.get(attr_nome, 0))
                    pericia = int(m.get("pericia", 0))
                    dado = random.randint(1, 10)
                    total = valor_attr + pericia + dado
                    print(f"\n[🎲] ROLAGEM DE {attr_nome.upper()}:")
                    print(f"    Atributo({valor_attr}) + Perícia({pericia}) + Dado({dado}) = TOTAL: {total}")
            except ValueError:
                print("Opção inválida.")

        elif op == '4':
            nova_obs = input("Digite a nova observação: ").strip()
            if nova_obs:
                db[colecao].update_one({"_id": mid}, {"$push": {"observacoes": nova_obs}})
                print("\n[📝] Observação adicionada!")

        elif op == '5':
            print("\n" + "═"*54)
            for k, v in m.items():
                if k != "_id": print(f"  {k:<15}: {v}")
            print("═"*54)

        elif op == '6':
            print(f"\n[💰] LOOT DE {m['nome']}:")
            for item in m.get("loot", []):
                print(f"    - {item}")

        elif op == '7':
            novo_nome = input("Digite o novo nome: ").strip()
            if novo_nome:
                db[colecao].update_one({"_id": mid}, {"$set": {"nome": novo_nome}})
                print(f"\n[✏️] Nome alterado para: {novo_nome}")

        elif op == '0':
            break

if __name__ == "__main__":
    while True:
        col, alvo = selecionar_alvo()
        menu_interativo(col, alvo)