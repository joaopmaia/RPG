import os
from pymongo import MongoClient

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DATABASE = "rpg"


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def prompt_natureza():
    opcoes = ["Neutro", "Bom", "Mal", "Não Sei"]
    print("Qual a natureza do NPC?")
    for i, op in enumerate(opcoes, 1):
        print(f"{i}. {op}")
    escolha = input("Escolha (1-4): ")
    try:
        idx = int(escolha) - 1
        if idx in range(len(opcoes)):
            return opcoes[idx]
    except Exception:
        pass
    return opcoes[0]  # padrão: Neutro


def listar_npcs_por_natureza(db, natureza):
    npcs = list(db.NPC.find({"natureza": natureza}))
    if not npcs:
        print(f"Nenhum NPC encontrado com natureza '{natureza}'.")
        return None
    print("\nNPCs encontrados:")
    for i, npc in enumerate(npcs, 1):
        print(f"[{i}] Nome: {npc['nome']} | Raça: {npc['raça']} | Tipo: {npc['tipo']} | Nível: {npc['nível']} | Observação: {npc.get('observacoes', '')}")
    return npcs


def prompt_npc_nome(npcs):
    nomes = [npc['nome'] for npc in npcs]
    escolha = input("\nDigite o nome ou índice do NPC para exibir detalhes: ")
    # Permite selecionar por índice
    if escolha.isdigit():
        idx = int(escolha) - 1
        if 0 <= idx < len(npcs):
            return npcs[idx]
    # Seleção por nome
    for npc in npcs:
        if npc['nome'] == escolha:
            return npc
    print("NPC não encontrado.")
    return None

def exibir_loot(npc):
    print("\n EXIBINDO LOOT DO NPC\n")
    # EQUIPAMENTOS
    try:
        from busca_equipamento_npc import exibir_equipamentos_npc
        db = conectar()
        exibir_equipamentos_npc(db, npc)
    except Exception as e:
        print("[ERRO] Falha ao exibir equipamentos detalhados:")
        print(f"    {e}")
    print("──────────────────────────────────────────────────────")
    # ELIXIRES
    try:
        from busca_elixires_npc import exibir_elixires_npc
        db = conectar()
        exibir_elixires_npc(db, npc)
    except Exception as e:
        print("[ERRO] Falha ao exibir elixires detalhados:")
        print(f"    {e}")
    print("──────────────────────────────────────────────────────")
    # TESOURO
    moedas = npc.get('moedas', '?')
    print(f"  TESOURO: {moedas} moedas ({formatar_moedas(moedas)})")

def exibir_npc_completo(npc):
    print("\n══════════════════════════════════════════════════════")
    print("                NPC")
    print("══════════════════════════════════════════════════════")
    print(f"  Nome:    {npc['nome']}")
    print(f"  Raça:    {npc['raça']}")
    print(f"  Tipo:    {npc['tipo']}")
    nivel_str = str(npc.get('nível', '?'))
    niveis_dict = {1: 'Charlatão', 2: 'Amador', 3: 'Profissional', 4: 'Mestre', 5: 'Lenda'}
    nivel_nome = niveis_dict.get(npc.get('nível'), '')
    print(f"  Nível:   {nivel_str} - {nivel_nome}")
    print(f"  HP Total:   {npc.get('hp_total', '?')}")
    print(f"  HP Atual:   {npc.get('hp_atual', '?')}")
    print(f"  Arcana Total:   {npc.get('arcana_total', '?')}")
    print(f"  Arcana Atual:   {npc.get('arcana_atual', '?')}")
    print(f"  Perícia: +{npc.get('pericia', '?')}")
    print("──────────────────────────────────────────────────────")
    print("  ATRIBUTOS:")
    # Exibe atributos com marcações
    atributos = [
        ("Força", npc.get("forca", '?')),
        ("Destreza", npc.get("destreza", '?')),
        ("Vitalidade", npc.get("vitalidade", '?')),
        ("Inteligência", npc.get("inteligencia", '?')),
        ("Carisma", npc.get("carisma", '?')),
        ("Espírito", npc.get("espirito", '?')),
        ("Percepção", npc.get("percepcao", '?')),
    ]
    # Marca racial e especializado
    especializacao = {
        "Mercadores":  ["Carisma", "Inteligência", "Percepção", "Espírito", "Vitalidade"],
        "Nobres":      ["Carisma", "Espírito", "Inteligência", "Percepção", "Vitalidade"],
        "Guardas":     ["Força", "Vitalidade", "Percepção", "Destreza", "Espírito"],
        "Ladinos":     ["Destreza", "Percepção", "Inteligência", "Carisma", "Força"],
        "Assassinos":  ["Destreza", "Percepção", "Força", "Inteligência", "Vitalidade"],
        "Mensageiros": ["Vitalidade", "Destreza", "Percepção", "Força", "Espírito"],
        "Alquimista":  ["Inteligência", "Percepção", "Espírito", "Vitalidade", "Destreza"],
        "Bardo":       ["Carisma", "Espírito", "Percepção", "Destreza", "Inteligência"],
        "Criminoso":   ["Força", "Carisma", "Vitalidade", "Destreza", "Percepção"],
        "Pirata":      ["Força", "Vitalidade", "Destreza", "Carisma", "Percepção"],
        "Cidadão":     ["Vitalidade", "Percepção", "Força", "Inteligência", "Carisma"],
    }
    bonus_racial = {
        "Vaelthor":  "Inteligência",
        "Drovenar":  "Vitalidade",
        "Sylmari":   "Espírito",
        "Gorvash":   "Força",
        "Sharusahk": "Destreza",
    }
    tipo = npc.get('tipo', '')
    raca = npc.get('raça', '')
    nivel = npc.get('nível', 1)
    espec = set(especializacao.get(tipo, [])[:nivel])
    for nome, valor in atributos:
        marca = " ★" if nome in espec else ""
        racial = " (+1 racial)" if bonus_racial.get(raca) == nome else ""
        print(f"    {nome:<14} {valor}{marca}{racial}")
    print("──────────────────────────────────────────────────────")
    # EQUIPAMENTOS
    try:
        from busca_equipamento_npc import exibir_equipamentos_npc
        db = conectar()
        exibir_equipamentos_npc(db, npc)
    except Exception as e:
        print("[ERRO] Falha ao exibir equipamentos detalhados:")
        print(f"    {e}")
    print("──────────────────────────────────────────────────────")
    # ELIXIRES
    try:
        from busca_elixires_npc import exibir_elixires_npc
        db = conectar()
        exibir_elixires_npc(db, npc)
    except Exception as e:
        print("[ERRO] Falha ao exibir elixires detalhados:")
        print(f"    {e}")
    print("──────────────────────────────────────────────────────")
    # RUNAS
    runas = npc.get('runas', [])
    print("  RUNAS:")
    if runas:
        print(f"    Elementos: {', '.join(runas)}")
    else:
        print("    Nenhuma")
    print("──────────────────────────────────────────────────────")
    # TESOURO
    moedas = npc.get('moedas', '?')
    print(f"  TESOURO: {moedas} moedas ({formatar_moedas(moedas)})")

    print("══════════════════════════════════════════════════════")
    # Informações extras
    print(f"  HP Atual: {npc.get('hp_atual', '?')} | HP Total: {npc.get('hp_total', '?')}")
    print(f"  Arcana Atual: {npc.get('arcana_atual', '?')} | Arcana Total: {npc.get('arcana_total', '?')}")
    print(f"  Natureza: {npc.get('natureza', '?')}")
    print(f"  Descrição: {npc.get('observacoes', '')}")

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

def exibir_equipamentos(npc):
    # Equipamentos
    print("──────────────────────────────────────────────────────")
    print(f"  EQUIPAMENTOS ({len(npc['equipamentos'])}):")
    if not npc['equipamentos']:
        print("    Nenhum")
    for i, eq in enumerate(npc['equipamentos'], 1):
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
        print(f"       Durabil.: {eq['durabilidade']:.0f}")
        print(f"       Preço:    {eq['preco']} moedas ({formatar_moedas(eq['preco'])})")
        print(f"       Rank:     {eq.get('rank', '?')}")


def main():
    db = conectar()
    natureza = prompt_natureza()
    npcs = []
    if natureza == "Não Sei":  # "Não Sei"
        npcs = list(db.NPC.find())
        if not npcs:
            print(f"Nenhum NPC encontrado.")
            return None
        print("\nNPCs encontrados:")
        for i, npc in enumerate(npcs, 1):
            print(f"[{i}] Nome: {npc['nome']} | Raça: {npc['raça']} | Tipo: {npc['tipo']} | Nível: {npc['nível']} | Natureza: {npc['natureza']} | Observação: {npc.get('observacoes', '')}")
        
    else:
        npcs = listar_npcs_por_natureza(db, natureza)
    if not npcs:
        return
    npc = prompt_npc_nome(npcs)
    if npc:
        print("Deseja exibir os detalhes completos do NPC?")
        print("1. Sim")
        print("2. Não")
        escolha_exibe = input("Escolha (1 ou 2): ")
        if escolha_exibe.strip() in ["1", "Sim", "sim", "S", "s"]:
            exibir_npc_completo(npc)
    return npc['nome']

if __name__ == "__main__":
    main()
