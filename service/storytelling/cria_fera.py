"""
Gera uma fera (animal) aleatória com atributos, HP, ataques e loot.

Uso:
    python cria_fera.py
"""

import random
import sys

sys.path.insert(0, sys.path[0] + "/../..")

from pymongo import MongoClient
from service.utils.constantes import ATRIBUTOS

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"

# ═══════════════════════════════════════════════════
#  Categorias de Animal
# ═══════════════════════════════════════════════════

CATEGORIAS = {
    "comum": {
        "nome": "Animal Pequeno",
        "atributo_base": 3,
        "qtd_especializados": 2,
        "dado_especializado": (2, 3),   # 1d2+3 → 4-5
        "pericia": 2,
        "bonus_hp": 20,
        "armadura_natural": 1,
        "loot_rolls": 1,
        "dado_fisico": 6,               # 1d6
    },
    "grande": {
        "nome": "Animal Grande",
        "atributo_base": 4,
        "qtd_especializados": 3,
        "dado_especializado": (2, 4),   # 1d2+4 → 5-6
        "pericia": 4,
        "bonus_hp": 60,
        "armadura_natural": 3,
        "loot_rolls": 2,
        "dado_fisico": 10,              # 1d10
    },
    "arcano": {
        "nome": "Animal Arcano",
        "atributo_base": 5,
        "qtd_especializados": 4,
        "dado_especializado": (2, 6),   # 1d2+6 → 7-8
        "pericia": 7,
        "bonus_hp": 100,
        "armadura_natural": 5,
        "loot_rolls": 3,
        "dado_fisico": 20,              # 1d20
    },
}

LIMITE_ATRIBUTO = 8

DIFICULDADE_EXTRACAO = {
    "Comum": 10,
    "Incomum": 12,
    "Raro": 15,
    "Épico": 17,
    "Lendário": 20,
}

DIFICULDADE_CONSTRUCAO = DIFICULDADE_EXTRACAO  # mesma tabela

# ═══════════════════════════════════════════════════
#  Efeitos de Ataque (1d4)
# ═══════════════════════════════════════════════════

EFEITOS_ATAQUE = {
    1: "Sangramento",
    2: "Derrubar",
    3: "Atordoado",
    4: "Envenenado",
}

# ═══════════════════════════════════════════════════
#  Essências Arcanas (1d6) — apenas para Animais Arcanos
# ═══════════════════════════════════════════════════

ELEMENTOS = {
    1: "Genia",
    2: "Degila",
    3: "Reetear",
    4: "Arunalt",
    5: "Saltrat",
    6: "Pascalia",
}

ESSENCIAS = {
    "Genia": {
        "nome": "Genia (Fogo)",
        "habilidade": "Bola de Fogo: Causa 1d20 de dano (Queimaduras em acertos críticos).",
    },
    "Degila": {
        "nome": "Degila (Gelo)",
        "habilidade": "Explosão Gélida: Causa 1d12 de dano em área e status Congelado (Resistência vs. Rolagem do animal).",
    },
    "Reetear": {
        "nome": "Reetear (Ar/Som)",
        "habilidade": "Fica invisível, pode voar.",
    },
    "Arunalt": {
        "nome": "Arunalt (Terra)",
        "habilidade": "Cura no valor da rolagem do animal + 1d20.",
    },
    "Saltrat": {
        "nome": "Saltrat (Mente)",
        "habilidade": "Imunidade a qualquer status.",
    },
    "Pascalia": {
        "nome": "Pascalia (Espaço/Vácuo)",
        "habilidade": "Pode se teletransportar livremente, recebe passivamente 1d10 para esquivas.",
    },
}

# ═══════════════════════════════════════════════════
#  Tabela de Ranks de Loot por porte e rolagem
# ═══════════════════════════════════════════════════

RANKS_LOOT = {
    "comum": {
        "baixo": ["F", "E"],     # 1-4
        "medio": ["E", "D"],     # 5-8
        "alto": ["E", "D"],      # 9
        "raro": ["A", "S"],      # 10
    },
    "grande": {
        "baixo": ["D"],          # 1-4
        "medio": ["C"],          # 5-8
        "alto": ["C", "B"],      # 9
        "raro": ["A", "S"],      # 10
    },
    "arcano": {
        "baixo": ["C", "B"],     # 1-4
        "medio": ["C", "B"],     # 5-8
        "alto": ["B", "A"],      # 9
        "raro": ["A", "S"],      # 10
    },
}


# ═══════════════════════════════════════════════════
#  Funções utilitárias
# ═══════════════════════════════════════════════════

def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def rolar(lados):
    """Rola 1dN."""
    return random.randint(1, lados)


def prompt_opcao(mensagem, opcoes):
    """Exibe opções numeradas e retorna o índice escolhido."""
    print()
    for i, opcao in enumerate(opcoes, start=1):
        print(f"  [{i}] {opcao}")
    while True:
        escolha = input(f"\n{mensagem}").strip()
        try:
            idx = int(escolha) - 1
            if 0 <= idx < len(opcoes):
                return idx
        except ValueError:
            pass
        print("Opção inválida. Tente novamente.")


# ═══════════════════════════════════════════════════
#  Geração de Atributos
# ═══════════════════════════════════════════════════

def gerar_atributos(tier):
    """Gera os 7 atributos do animal com base na categoria."""
    cat = CATEGORIAS[tier]
    base = cat["atributo_base"]
    qtd_espec = cat["qtd_especializados"]
    lados, dado_base = cat["dado_especializado"]

    atributos = {a: base for a in ATRIBUTOS}

    especializados = random.sample(ATRIBUTOS, qtd_espec)

    for attr in especializados:
        valor = rolar(lados) + dado_base
        atributos[attr] = min(valor, LIMITE_ATRIBUTO)

    return atributos, especializados


# ═══════════════════════════════════════════════════
#  Cálculo de HP
# ═══════════════════════════════════════════════════

def calcular_hp(tier, atributos):
    """HP = (Força x 5) + (Vitalidade x 10) + Bônus de Porte."""
    cat = CATEGORIAS[tier]
    forca = atributos.get("Força", 1)
    vitalidade = atributos.get("Vitalidade", 1)
    return (forca * 5) + (vitalidade * 10) + cat["bonus_hp"]


# ═══════════════════════════════════════════════════
#  Geração de Essência (apenas Arcano)
# ═══════════════════════════════════════════════════

def gerar_essencia():
    """Rola 1d6 para determinar a essência do animal arcano."""
    roll = rolar(6)
    elemento = ELEMENTOS[roll]
    return ESSENCIAS[elemento]


# ═══════════════════════════════════════════════════
#  Geração de Loot
# ═══════════════════════════════════════════════════

def faixa_roll(roll):
    """Retorna a faixa de loot com base na rolagem 1d10."""
    if roll <= 4:
        return "baixo"
    elif roll <= 8:
        return "medio"
    elif roll == 9:
        return "alto"
    else:
        return "raro"


def gerar_loot(tier, db):
    """Gera loot (materiais ou elixires) com base no tier, sem repetições."""
    cat = CATEGORIAS[tier]
    qtd_rolls = cat["loot_rolls"]

    loot = []
    obtidos = set()

    tentativas = 0
    while len(loot) < qtd_rolls and tentativas < qtd_rolls * 10:
        tentativas += 1
        roll = rolar(10)
        faixa = faixa_roll(roll)
        ranks_possiveis = RANKS_LOOT[tier][faixa]
        rank = random.choice(ranks_possiveis)

        # Escolher aleatoriamente entre material ou elixir
        fonte = random.choice(["material", "elixir"])

        if fonte == "material":
            candidatos = list(db["materiais"].find({"rank": rank, "tipo": "animal"}))
            if not candidatos:
                candidatos = list(db["materiais"].find({"tipo": "animal"}))
            if candidatos:
                mat = random.choice(candidatos)
                nome = mat.get("material", "?")
                if nome in obtidos:
                    continue
                obtidos.add(nome)
                raridade = mat.get("raridade", "Comum")
                loot.append({
                    "tipo": "Material",
                    "nome": nome,
                    "rank": mat.get("rank", "?"),
                    "raridade": raridade,
                    "efeito": mat.get("efeito", ""),
                    "origem": mat.get("tipo", "?"),
                    "dificuldade": DIFICULDADE_EXTRACAO.get(raridade, 10),
                })
        else:
            rank_para_raridade = {
                "F": "Comum", "E": "Comum", "D": "Incomum",
                "C": "Raro", "B": "Épico", "A": "Épico", "S": "Lendário",
            }
            raridade = rank_para_raridade.get(rank, "Comum")

            candidatos = []
            for elixir in db["alquimia"].find():
                if elixir.get("animal_rar", "-") != "-" and elixir.get("animal_rar") == raridade:
                    candidatos.append(elixir)

            if not candidatos:
                candidatos = [e for e in db["alquimia"].find() if e.get("animal_rar", "-") != "-"]
            if candidatos:
                elixir = random.choice(candidatos)
                nome = elixir.get("nome", "?")
                if nome in obtidos:
                    continue
                obtidos.add(nome)
                rar_elixir = elixir.get("animal_rar", "Comum")
                loot.append({
                    "tipo": "Elixir",
                    "nome": nome,
                    "raridade": rar_elixir,
                    "efeito": elixir.get("efeito", "?"),
                    "dificuldade": DIFICULDADE_EXTRACAO.get(rar_elixir, 10),
                })

    return loot


# ═══════════════════════════════════════════════════
#  Exibição da Fera
# ═══════════════════════════════════════════════════

def exibir_fera(fera):
    """Imprime a fera gerada formatada."""
    cat = CATEGORIAS[fera["tier"]]

    print()
    print("══════════════════════════════════════════════════════")
    print("                FERA GERADA")
    print("══════════════════════════════════════════════════════")
    print(f"  Categoria:        {cat['nome']}")
    print(f"  HP:               {fera['hp']}")
    print(f"  Armadura Natural: {cat['armadura_natural']} (Redução de Dano)")
    print(f"  Perícia:          +{cat['pericia']}")
    print(f"  Dado Físico:      1d{cat['dado_fisico']}")
    print("──────────────────────────────────────────────────────")

    # Atributos
    print("  ATRIBUTOS:")
    especializados = set(fera["especializados"])
    for attr in ATRIBUTOS:
        valor = fera["atributos"][attr]
        marca = " ★" if attr in especializados else ""
        print(f"    {attr:<14} {valor}{marca}")

    # Ataques
    print("──────────────────────────────────────────────────────")
    print("  ATAQUES:")
    print()
    print(f"  Ataque Físico: 1d{cat['dado_fisico']} de dano")
    print()
    print("  Efeitos de Ataque (1d4 em acerto bem-sucedido):")
    for num, efeito in EFEITOS_ATAQUE.items():
        print(f"    {num}. {efeito}")

    # Essência Arcana
    if fera.get("essencia"):
        ess = fera["essencia"]
        print()
        print("──────────────────────────────────────────────────────")
        print(f"  ESSÊNCIA ARCANA: {ess['nome']}")
        print(f"    {ess['habilidade']}")

    # Loot
    print()
    print("──────────────────────────────────────────────────────")
    print(f"  LOOT — Materiais Extraídos ({cat['loot_rolls']} rolagem(ns)):")
    if not fera["loot"]:
        print("    Nenhum material encontrado.")
    for i, item in enumerate(fera["loot"], 1):
        dif_ext = item.get("dificuldade", "?")
        raridade = item.get("raridade", "")
        dif_con = DIFICULDADE_CONSTRUCAO.get(raridade, "?")
        if item["tipo"] == "Material":
            print(f"    {i}. [{item['rank']}] {item['nome']} ({item['origem']}, {raridade})")
            print(f"       Extração: {dif_ext} | Construção: {dif_con}")
            if item.get("efeito"):
                print(f"       Efeito: {item['efeito']}")
        else:
            print(f"    {i}. [Elixir] {item['nome']} ({raridade})")
            print(f"       Extração: {dif_ext} | Construção: {dif_con}")
            print(f"       Efeito: {item['efeito']}")

    print()
    print("══════════════════════════════════════════════════════")


# ═══════════════════════════════════════════════════
#  Execução principal
# ═══════════════════════════════════════════════════

def main():
    db = conectar()

    print("══ Gerador de Fera ══")

    # Selecionar tier
    opcoes_tier = [
        f"Animal Pequeno  (Base: 3 | Perícia: +2 | HP Bônus: +20)",
        f"Animal Grande   (Base: 4 | Perícia: +4 | HP Bônus: +60)",
        f"Animal Arcano   (Base: 5 | Perícia: +7 | HP Bônus: +100)",
    ]
    tiers = ["comum", "grande", "arcano"]

    idx_tier = prompt_opcao("Selecione o porte do animal: ", opcoes_tier)
    tier = tiers[idx_tier]

    cat = CATEGORIAS[tier]
    print(f"\n→ {cat['nome']}")

    # Gerar atributos
    atributos, especializados = gerar_atributos(tier)

    # Calcular HP
    hp = calcular_hp(tier, atributos)

    # Essência arcana (apenas para arcano)
    essencia = gerar_essencia() if tier == "arcano" else None

    # Gerar loot
    loot = gerar_loot(tier, db)

    fera = {
        "tier": tier,
        "atributos": atributos,
        "especializados": especializados,
        "hp": hp,
        "essencia": essencia,
        "loot": loot,
    }

    exibir_fera(fera)


if __name__ == "__main__":
    main()
