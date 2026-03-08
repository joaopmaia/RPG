import sys
from service.storytelling.utils.salva_npc import salva_npc
from service.storytelling.utils.cria_equipamento_npc import cria_equipamento_npc
from service.storytelling.utils.cria_elixir_npc import cria_elixir_npc

def pergunta_natureza():
    print("Qual a natureza do NPC?")
    opcoes = ["Bom", "Neutro", "Mal"]
    for i, op in enumerate(opcoes, 1):
        print(f"{i}. {op}")
    escolha = input("Escolha (1-3): ")
    try:
        idx = int(escolha) - 1
        if idx in range(len(opcoes)):
            return opcoes[idx]
    except Exception:
        pass
    return opcoes[1]  # padrão: Neutro

def criar_registros_npc(db, nome, atributos, raca, tipo, nivel, hp, pericia, equipamentos, elixires, runa, tesouro, natureza):

    print("\nCriando NPC no banco")
    arma1 = ""
    arma2 = ""
    armadura = ""
    escudo = ""
    for eq in equipamentos:
        if eq["tipo"].lower() == "melee" or eq["tipo"].lower() == "ranged" or eq["tipo"].lower() == "arcane":
            if (arma1 == ""):
                arma1 = eq["nome"]
                salva_equipamentos_npc(db, nome, eq)
            elif (arma2 == ""):
                arma2 = eq["nome"]
                salva_equipamentos_npc(db, nome, eq)
        elif eq["tipo"].lower() == "armadura":
            if (armadura == ""):
                armadura = eq["nome"]
                salva_equipamentos_npc(db, nome, eq)
        elif eq["tipo"].lower() == "escudo":
            if (escudo == ""):
                escudo = eq["nome"]
                salva_equipamentos_npc(db, nome, eq)

    npc_obj = {
        "nome": nome,
        "forca": atributos["Força"],
        "vitalidade": atributos["Vitalidade"],
        "destreza": atributos["Destreza"],
        "inteligencia": atributos["Inteligência"],
        "espirito": atributos["Espírito"],
        "carisma": atributos["Carisma"],
        "percepcao": atributos["Percepção"],
        "raça": raca,
        "tipo": tipo,
        "nível": nivel,
        "hp_total": str(hp),
        "hp_atual": str(hp),
        "arcana_total": "0",
        "arcana_atual": "0",
        "pericia": str(pericia),
        "arma1": arma1,
        "arma2": arma2,
        "armadura": armadura,
        "escudo": escudo,
        "elixir": [el["nome"] for el in elixires],
        "runas": runa["elementos"] if runa else [],
        "moedas": str(tesouro),
        "observacoes": "",
        "natureza": natureza,
    }
    salva_npc(db, npc_obj)

    for el in elixires:
        elixir_obj = {
            "personagem_dono": nome,
            "nome": el["nome"],
            "efeito": el["efeito"],
            "descricao": el.get("descricao", ""),
            "materia_prima": el.get("material", ""),
            "bonus_materia_prima": el.get("potencia", ""),
        }
        cria_elixir_npc(db, elixir_obj)

def salva_equipamentos_npc(db, nome, eq):
    try:
        eq_obj = {
            "personagem_dono": nome,
            "nome": eq["nome"],
            "bônus": eq.get("dano", eq.get("defesa", "")),
            "durabilidade": str(eq.get("durabilidade", "")),
            "peso": str(eq.get("peso", "")),
            "preco": eq.get("preco", ""),
            "tipo": eq.get("tipo", ""),
            "nome_material": eq.get("material", ""),
            "rank": eq.get("rank", ""),
            "raridade": eq.get("raridade", ""),
            "tipo_material": eq.get("tipo_material", ""),
            "efeito": eq.get("efeito_material", ""),
            "runas": [],
        }
        cria_equipamento_npc(db, eq_obj)
    except Exception as e:
        print("[ERRO] Falha ao salvar equipamento NPC:")
        print(f"    {e}")
        print("[LOG] Dados recebidos:")
        print(f"    nome: {nome}")
        print(f"    eq: {eq}")

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

