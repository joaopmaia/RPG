"""
Gera uma fera (animal) aleatória com atributos, HP, ataques e loot.

Uso:
    python cria_fera.py
"""

import random
import sys

sys.path.insert(0, sys.path[0] + "/../..")

from pymongo import MongoClient
from service.utils.constantes import (
    ATRIBUTOS,
    ANIMAIS_COMUNS,
    ANIMAIS_AQUATICOS_COMUNS,
    ANIMAIS_VOADORES_COMUNS,
    ANIMAIS_TERRESTRES_GRANDES,
    ANIMAIS_AQUATICOS_GRANDES,
    ANIMAIS_VOADORES_GRANDES,
    ARCANOS_TERRESTRES,
    ARCANOS_AQUATICOS,
    ARCANOS_VOADORES,
    ANIMAIS_ARCANOS_HABILIDADES
)

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

def selecionar_nome_animal(tier, tipo):
    """
    Exibe uma lista de nomes baseada no tier e tipo, permitindo escolha manual ou aleatória.
    Retorna a string do nome selecionado.
    """
    # Mapeamento de dicionário para evitar múltiplos if/elifs encadeados
    mapa_listas = {
        "comum": {
            "Terrestre": ANIMAIS_COMUNS,
            "Aquático": ANIMAIS_AQUATICOS_COMUNS,
            "Voador": ANIMAIS_VOADORES_COMUNS
        },
        "grande": {
            "Terrestre": ANIMAIS_TERRESTRES_GRANDES,
            "Aquático": ANIMAIS_AQUATICOS_GRANDES,
            "Voador": ANIMAIS_VOADORES_GRANDES
        },
        "arcano": {
            "Terrestre": ARCANOS_TERRESTRES,
            "Aquático": ARCANOS_AQUATICOS,
            "Voador": ARCANOS_VOADORES
        }
    }

    # Busca a lista correta. Se não existir, retorna nome genérico.
    lista_nomes = mapa_listas.get(tier, {}).get(tipo)
    
    if not lista_nomes:
        return "Animal Desconhecido"

    print(f"\n--- Seleção de Nome ({tier.capitalize()} - {tipo}) ---")
    print("0. [Gerar Nome Aleatório]")
    for i, nome in enumerate(lista_nomes, 1):
        print(f"{i}. {nome}")

    while True:
        escolha = input(f"\nEscolha o nome (0 para aleatório, 1-{len(lista_nomes)}): ").strip()
        
        if escolha == "0":
            nome_escolhido = random.choice(lista_nomes)
            print(f"Nome aleatório gerado: {nome_escolhido}")
            return nome_escolhido
        
        try:
            idx = int(escolha) - 1
            if 0 <= idx < len(lista_nomes):
                return lista_nomes[idx]
            else:
                print(f"Número fora do intervalo! Escolha entre 0 e {len(lista_nomes)}.")
        except ValueError:
            print("Entrada inválida! Digite apenas o número correspondente.")

def gerar_atributos(tier):
    """Gera os 7 atributos do animal com base na categoria."""
    cat = CATEGORIAS[tier]
    qtd_espec = cat["qtd_especializados"]

    # Define ranges for base attribute
    if tier == "comum":
        base_range = (1, 3)
    elif tier == "grande":
        base_range = (4, 6)
    elif tier == "arcano":
        base_range = (6, 8)
    else:
        base_range = (1, 1)

    # Sorteia um valor para cada atributo
    atributos = {a: random.randint(*base_range) for a in ATRIBUTOS}

    especializados = random.sample(ATRIBUTOS, qtd_espec)

    # Specialized attribute bonus (0, 1, or 2)
    for attr in especializados:
        bonus = random.randint(0, 2)
        atributos[attr] = min(atributos[attr] + bonus, LIMITE_ATRIBUTO)

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

def habilidade_arcana(nome):
    """Busca a habilidade especial de um animal arcano pelo nome."""
    return ANIMAIS_ARCANOS_HABILIDADES.get(nome, ("", ""))


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
    print(f"  Nome:             {fera['nome']}")
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
    # Habilidade especial arcana
    if fera.get("habilidade_especial"):
        print(f"  Habilidade Especial: {fera['habilidade_especial']}")
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
#  Banco de Dados e Salvamento
# ═══════════════════════════════════════════════════


def deseja_salvar_animal():
    """Retorna True se o usuário quiser salvar, False caso contrário."""
    while True:
        res = input("\nDeseja salvar o animal no banco de dados? (s, sim, 1 / n, não, 2): ").strip().lower()
        if res in ['s', 'sim', '1']:
            return True
        if res in ['n', 'não', 'nao', '2']:
            return False
        print("Entrada inválida! Use 's' para sim ou 'n' para não.")

import random

import random

def converter_para_npc_banco(fera):
    """Transforma o dicionário da fera gerada no formato compatível com o banco de dados."""
    cat = CATEGORIAS[fera["tier"]]
    tipo_animal = fera.get("tipo", "Terrestre")
    
    # 2. Atribuição Automática de Nome
    if "nome" in fera and fera["nome"]: # Verifica se existe e não é vazio
        nome_final = fera["nome"]
    else:
        listas_nomes = {
            "Terrestre": ANIMAIS_COMUNS,
            "Aquático": ANIMAIS_AQUATICOS_COMUNS,
            "Voador": ANIMAIS_VOADORES_COMUNS
        }
        nome_final = random.choice(listas_nomes[tipo_animal])

    # 3. Processamento de Loot
    lista_loot_strings = []
    for item in fera["loot"]:
        info = f"[{item['tipo']}] {item['nome']} - {item['raridade']}"
        if item.get("efeito") and item["efeito"] != "Nenhum":
            info += f" (Efeito: {item['efeito']})"
        lista_loot_strings.append(info)

    # 4. Processamento de Ataque Especial (Correção do ValueError)
    ataque_especial_str = ""
    habil = fera.get("habilidade_especial")
    
    # Verifica se é uma tupla/lista com 2 elementos antes de desempacotar
    if isinstance(habil, (tuple, list)) and len(habil) == 2:
        nome_habil, desc_habil = habil
        ataque_especial_str = f"{nome_habil}: {desc_habil}"
    elif isinstance(habil, str) and habil: # Se for só uma string não vazia
        ataque_especial_str = habil

    # 5. Rolagem de Crítico
    EFEITOS_ATAQUE = {1: "Sangramento", 2: "Derrubar", 3: "Atordoado", 4: "Envenenado"}
    critico_rolado = EFEITOS_ATAQUE[random.randint(1, 4)]

    # 6. Montagem do Objeto do Banco
    attrs = fera["atributos"]
    
    # Tratativa para o campo 'runas' ser sempre uma lista de strings
    essencia = fera.get("essencia")
    if essencia:
        # Se essencia for um dict, extrai o nome, se for string, usa ela mesma
        txt_runa = f"{essencia['nome']}: {essencia['habilidade']}" if isinstance(essencia, dict) else str(essencia)
        lista_runas = [txt_runa]
    else:
        lista_runas = []
    
    fera_npc = {
        "nome": nome_final,
        "forca": attrs.get("Força", 0),
        "vitalidade": attrs.get("Vitalidade", 0),
        "destreza": attrs.get("Destreza", 0),
        "inteligencia": attrs.get("Inteligência", 0),
        "espirito": attrs.get("Espírito", 0),
        "carisma": attrs.get("Carisma", 0),
        "percepcao": attrs.get("Percepção", 0),
        "nível": fera.get("tier", "comum"), 
        "hp_total": fera["hp"],
        "hp_atual": fera["hp"],
        "arcana_total": (attrs.get("Espírito", 0) * 10) if fera["tier"] == "arcano" else 0,
        "arcana_atual": (attrs.get("Espírito", 0) * 10) if fera["tier"] == "arcano" else 0,
        "pericia": cat["pericia"],
        "armadura": cat["armadura_natural"],
        "runas": lista_runas, 
        "observacoes": [nome_final],
        "ataques": [f"Ataque Físico (1d{cat['dado_fisico']})"],
        "loot": lista_loot_strings,
        "dano": f"1d{cat['dado_fisico']}",
        "ataque_especial": ataque_especial_str,
        "efeito_ataque_critico": critico_rolado,
        "tipo": tipo_animal,
    }

    return fera_npc
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

    idx_tipo = prompt_opcao("Selecione o tipo de animal: ", ["Terrestre", "Aquático", "Voador"])
    tipo = ["Terrestre", "Aquático", "Voador"][idx_tipo]

    # Seleciona nome aleatório conforme categoria e tipo
    nome_aleatorio = selecionar_nome_animal(tier, tipo)

    
    # Gerar atributos
    atributos, especializados = gerar_atributos(tier)

    # Calcular HP
    hp = calcular_hp(tier, atributos)

    # Essência arcana (apenas para arcano)
    essencia = gerar_essencia() if tier == "arcano" else None

    # Habilidade especial arcana
    habilidade_especial = habilidade_arcana(nome_aleatorio) if tier == "arcano" else ""

    # Gerar loot
    loot = gerar_loot(tier, db)

    fera = {
        "tier": tier,
        "atributos": atributos,
        "especializados": especializados,
        "hp": hp,
        "essencia": essencia,
        "loot": loot,
        "nome": nome_aleatorio,
        "habilidade_especial": habilidade_especial,
        "tipo": tipo,
    }

    print(f"\n{fera}")

    exibir_fera(fera)

    # Prompt para salvar animal
    if deseja_salvar_animal():
        fera_NPC = converter_para_npc_banco(fera)
        print(fera_NPC)
        try:
            from service.storytelling.utils.salva_npc import salva_fera_npc
            salva_fera_npc(db, fera_NPC)
            print("Fera NPC salva com sucesso na tabela 'fera_NPC'.")
        except Exception as e:
            print(f"Erro ao salvar no banco: {e}")
    
    
        


if __name__ == "__main__":
    main()
