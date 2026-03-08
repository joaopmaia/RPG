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
        print(f"[{i}] Nome: {npc['nome']} | Raça: {npc['raça']} | Tipo: {npc['tipo']} | Nível: {npc['nível']} | Natureza: {npc['natureza']} | Observação: {npc.get('observacoes', '')}")
    return npcs

def prompt_npc_nome(npcs):
    nomes = [npc['nome'] for npc in npcs]
    escolha = input("\nDigite o nome ou índice do NPC para exibir equipamentos: ")
    if escolha.isdigit():
        idx = int(escolha) - 1
        if 0 <= idx < len(npcs):
            return npcs[idx]
    for npc in npcs:
        if npc['nome'] == escolha:
            return npc
    print("NPC não encontrado.")
    return None

def buscar_equipamento(db, nome_npc, nome_equip):
    if not nome_equip:
        return None
    eq = db.equipamentos_NPC.find_one({"personagem_dono": nome_npc, "nome": nome_equip})
    return eq

def formatar_equipamentos(eq):
    equipamento = {
        "nome": eq.get("nome", "?"),
        "tipo": eq.get("tipo", "?"),
        "material": eq.get("nome_material", "?"),
        "tipo_material": eq.get("tipo_material", "?"),
        "raridade": eq.get("raridade", "?"),
        "peso": eq.get("peso", "?"),
        "peso_material": eq.get("peso", "?"),
        "durabilidade": eq.get("durabilidade", "?"),
        "efeito_material": eq.get("efeito_material", ""),
        "rank": eq.get("rank", "?"),
        "preco": eq.get("preco", "?"),
        "bonus": eq.get("bônus", "?"),
    }
    return equipamento

def exibir_equipamentos_npc(db, npc):
    armas = [npc.get('arma1', ''), npc.get('arma2', '')]
    armadura = npc.get('armadura', '')
    escudos = npc.get('escudo', '')
    nomes = ["Arma 1", "Arma 2",  "Armadura", "Escudo"]
    valores = armas + [armadura] + [escudos]
    todos_equipamentos = []
    for nome, valor in zip(nomes, valores):
        if valor:
            eq = buscar_equipamento(db, npc['nome'], valor)
            equip = formatar_equipamentos(eq) if eq else None
            if equip:
                todos_equipamentos.append(equip)
        else:
            if 'Arma' in nome:
                print(f"{nome}: Nenhuma Arma Equipada")
            elif 'Armadura' in nome:
                print(f"{nome}: Nenhuma Armadura Equipada")
            elif 'Escudo' in nome:
                print(f"{nome}: Nenhum Escudo Equipado")
    if todos_equipamentos:
        exibir_equipamentos(todos_equipamentos)

def exibir_equipamentos(todos_equipamentos):
    # Equipamentos
    print("──────────────────────────────────────────────────────")
    print(f"  EQUIPAMENTOS ({len(todos_equipamentos)}):")
    if not todos_equipamentos:
        print("    Nenhum")
    for i, eq in enumerate(todos_equipamentos, 1):
        print(f"\n    {i}. {eq['nome']} ({eq['tipo']})")
        if eq.get("dano"):
            print(f"       Dano:     {eq['dano']}")
        if eq.get("defesa") is not None:
            defesa = eq['defesa']
            if isinstance(defesa, float):
                print(f"       Defesa:   {defesa:.1f}")
            else:
                print(f"       Defesa:   {defesa}")
        print(f"       Material: {eq['material']} ({eq['tipo_material']}) | {eq['raridade']}")
        if eq.get('efeito_material'):
            print(f"       Efeito:   {eq['efeito_material']}")
        print(f"       Peso:     {eq['peso']} (material: {eq.get('peso_material', '?')})")
        print(f"       Durabil.: {eq['durabilidade']}")
        print(f"       Bônus:    {eq.get('bonus', '?')}")
        print(f"       Preço:    {eq['preco']} moedas ({formatar_moedas(eq['preco'])})")
        print(f"       Rank:     {eq.get('rank', '?')}")

def formatar_moedas(bronze_total):
    """Converte bronze em ouro/prata/bronze."""
    bronze_total = int(bronze_total)
    ouro = bronze_total // 10000
    resto = bronze_total % 10000
    prata = resto // 100
    bronze = resto % 100
    partes = []
    if ouro:
        partes.append(f"{ouro} ouro")
    if prata:
        partes.append(f"{prata} prata")
    if bronze or not partes:
        partes.append(f"{bronze} bronze")
    return ", ".join(partes)

def main():
    db = conectar()
    npcs = listar_npcs(db)
    if not npcs:
        return
    npc = prompt_npc_nome(npcs)
    if npc:
        print(f"\nEquipamentos de {npc['nome']}:")
        exibir_equipamentos_npc(db, npc)

if __name__ == "__main__":
    main()
