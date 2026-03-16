"""
Geração de fera (animal) para a API (lógica copiada do script legado cria_fera.py).
Não importa nem chama o script legado.
"""
import random

CATEGORIAS = {
    "comum": {
        "nome": "Animal Pequeno",
        "atributo_base": 3,
        "qtd_especializados": 2,
        "dado_especializado": (2, 3),
        "pericia": 2,
        "bonus_hp": 20,
        "armadura_natural": 1,
        "loot_rolls": 1,
        "dado_fisico": 6,
    },
    "grande": {
        "nome": "Animal Grande",
        "atributo_base": 4,
        "qtd_especializados": 3,
        "dado_especializado": (2, 4),
        "pericia": 4,
        "bonus_hp": 60,
        "armadura_natural": 3,
        "loot_rolls": 2,
        "dado_fisico": 10,
    },
    "arcano": {
        "nome": "Animal Arcano",
        "atributo_base": 5,
        "qtd_especializados": 4,
        "dado_especializado": (2, 6),
        "pericia": 7,
        "bonus_hp": 100,
        "armadura_natural": 5,
        "loot_rolls": 3,
        "dado_fisico": 20,
    },
}

LIMITE_ATRIBUTO = 8
DIFICULDADE_EXTRACAO = {"Comum": 10, "Incomum": 12, "Raro": 15, "Épico": 17, "Lendário": 20}

EFEITOS_ATAQUE = {1: "Sangramento", 2: "Derrubar", 3: "Atordoado", 4: "Envenenado"}

ELEMENTOS = {1: "Genia", 2: "Degila", 3: "Reetear", 4: "Arunalt", 5: "Saltrat", 6: "Pascalia"}

ESSENCIAS = {
    "Genia": {"nome": "Genia (Fogo)", "habilidade": "Bola de Fogo: Causa 1d20 de dano (Queimaduras em acertos críticos)."},
    "Degila": {"nome": "Degila (Gelo)", "habilidade": "Explosão Gélida: Causa 1d12 de dano em área e status Congelado (Resistência vs. Rolagem do animal)."},
    "Reetear": {"nome": "Reetear (Ar/Som)", "habilidade": "Fica invisível, pode voar."},
    "Arunalt": {"nome": "Arunalt (Terra)", "habilidade": "Cura no valor da rolagem do animal + 1d20."},
    "Saltrat": {"nome": "Saltrat (Mente)", "habilidade": "Imunidade a qualquer status."},
    "Pascalia": {"nome": "Pascalia (Espaço/Vácuo)", "habilidade": "Pode se teletransportar livremente, recebe passivamente 1d10 para esquivas."},
}

RANKS_LOOT = {
    "comum": {"baixo": ["F", "E"], "medio": ["E", "D"], "alto": ["E", "D"], "raro": ["A", "S"]},
    "grande": {"baixo": ["D"], "medio": ["C"], "alto": ["C", "B"], "raro": ["A", "S"]},
    "arcano": {"baixo": ["C", "B"], "medio": ["C", "B"], "alto": ["B", "A"], "raro": ["A", "S"]},
}


def _rolar(lados):
    return random.randint(1, lados)


def _gerar_atributos(tier):
    from service.utils.constantes import ATRIBUTOS
    cat = CATEGORIAS[tier]
    qtd_espec = cat["qtd_especializados"]
    if tier == "comum":
        base_range = (1, 3)
    elif tier == "grande":
        base_range = (4, 6)
    elif tier == "arcano":
        base_range = (6, 8)
    else:
        base_range = (1, 1)
    atributos = {a: random.randint(*base_range) for a in ATRIBUTOS}
    especializados = random.sample(ATRIBUTOS, qtd_espec)
    for attr in especializados:
        bonus = random.randint(0, 2)
        atributos[attr] = min(atributos[attr] + bonus, LIMITE_ATRIBUTO)
    return atributos, especializados


def _calcular_hp(tier, atributos):
    cat = CATEGORIAS[tier]
    forca = atributos.get("Força", 1)
    vitalidade = atributos.get("Vitalidade", 1)
    return (forca * 5) + (vitalidade * 10) + cat["bonus_hp"]


def _gerar_essencia():
    roll = _rolar(6)
    return ESSENCIAS[ELEMENTOS[roll]]


def _habilidade_arcana(nome):
    from service.utils.constantes import ANIMAIS_ARCANOS_HABILIDADES
    return ANIMAIS_ARCANOS_HABILIDADES.get(nome, ("", ""))


def _faixa_roll(roll):
    if roll <= 4:
        return "baixo"
    elif roll <= 8:
        return "medio"
    elif roll == 9:
        return "alto"
    return "raro"


def _gerar_loot(tier, db):
    cat = CATEGORIAS[tier]
    qtd_rolls = cat["loot_rolls"]
    loot = []
    obtidos = set()
    tentativas = 0
    while len(loot) < qtd_rolls and tentativas < qtd_rolls * 10:
        tentativas += 1
        roll = _rolar(10)
        faixa = _faixa_roll(roll)
        ranks_possiveis = RANKS_LOOT[tier][faixa]
        rank = random.choice(ranks_possiveis)
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
                    "tipo": "Material", "nome": nome, "rank": mat.get("rank", "?"),
                    "raridade": raridade, "efeito": mat.get("efeito", ""), "origem": mat.get("tipo", "?"),
                    "dificuldade": DIFICULDADE_EXTRACAO.get(raridade, 10),
                })
        else:
            rank_para_raridade = {"F": "Comum", "E": "Comum", "D": "Incomum", "C": "Raro", "B": "Épico", "A": "Épico", "S": "Lendário"}
            raridade = rank_para_raridade.get(rank, "Comum")
            candidatos = [e for e in db["alquimia"].find() if e.get("animal_rar", "-") != "-" and e.get("animal_rar") == raridade]
            if not candidatos:
                candidatos = [e for e in db["alquimia"].find() if e.get("animal_rar", "-") != "-"]
            if candidatos:
                elixir = random.choice(candidatos)
                nome = elixir.get("nome", "?")
                if nome in obtidos:
                    continue
                obtidos.add(nome)
                loot.append({
                    "tipo": "Elixir", "nome": nome, "raridade": elixir.get("animal_rar", "Comum"),
                    "efeito": elixir.get("efeito", "?"), "dificuldade": DIFICULDADE_EXTRACAO.get(elixir.get("animal_rar", "Comum"), 10),
                })
    return loot


def _listas_nomes(tier, tipo):
    from service.utils.constantes import (
        ANIMAIS_COMUNS, ANIMAIS_AQUATICOS_COMUNS, ANIMAIS_VOADORES_COMUNS,
        ANIMAIS_TERRESTRES_GRANDES, ANIMAIS_AQUATICOS_GRANDES, ANIMAIS_VOADORES_GRANDES,
        ARCANOS_TERRESTRES, ARCANOS_AQUATICOS, ARCANOS_VOADORES,
    )
    mapa = {
        "comum": {"Terrestre": ANIMAIS_COMUNS, "Aquático": ANIMAIS_AQUATICOS_COMUNS, "Voador": ANIMAIS_VOADORES_COMUNS},
        "grande": {"Terrestre": ANIMAIS_TERRESTRES_GRANDES, "Aquático": ANIMAIS_AQUATICOS_GRANDES, "Voador": ANIMAIS_VOADORES_GRANDES},
        "arcano": {"Terrestre": ARCANOS_TERRESTRES, "Aquático": ARCANOS_AQUATICOS, "Voador": ARCANOS_VOADORES},
    }
    return mapa.get(tier, {}).get(tipo, ANIMAIS_COMUNS)


def gerar_fera_npc(tier, tipo, db, nome=None):
    """
    Gera uma fera completa no formato fera_NPC.
    tier: 'comum' | 'grande' | 'arcano'
    tipo: 'Terrestre' | 'Aquático' | 'Voador'
    db: conexão MongoDB
    nome: opcional
    Retorna documento com campo 'ataques' = lista de { nome, desc }.
    """
    from service.utils.constantes import ATRIBUTOS
    if tier not in CATEGORIAS:
        tier = "comum"
    if tipo not in ("Terrestre", "Aquático", "Voador"):
        tipo = "Terrestre"
    listas = _listas_nomes(tier, tipo)
    nome_aleatorio = random.choice(listas) if listas else "Animal"
    nome_final = (nome or "").strip() or nome_aleatorio

    atributos, especializados = _gerar_atributos(tier)
    hp = _calcular_hp(tier, atributos)
    essencia = _gerar_essencia() if tier == "arcano" else None
    habilidade_especial = _habilidade_arcana(nome_final) if tier == "arcano" else ""
    loot = _gerar_loot(tier, db)

    cat = CATEGORIAS[tier]
    lista_loot_strings = []
    for item in loot:
        info = f"[{item['tipo']}] {item['nome']} - {item['raridade']}"
        if item.get("efeito") and item.get("efeito") != "Nenhum":
            info += f" (Efeito: {item['efeito']})"
        lista_loot_strings.append(info)

    ataque_especial_str = ""
    if isinstance(habilidade_especial, (tuple, list)) and len(habilidade_especial) == 2:
        nome_habil, desc_habil = habilidade_especial
        ataque_especial_str = f"{nome_habil}: {desc_habil}"
    elif isinstance(habilidade_especial, str) and habilidade_especial:
        ataque_especial_str = habilidade_especial

    critico_rolado = EFEITOS_ATAQUE[random.randint(1, 4)]
    attrs = atributos
    lista_runas = []
    if essencia:
        txt_runa = f"{essencia['nome']}: {essencia['habilidade']}" if isinstance(essencia, dict) else str(essencia)
        lista_runas = [txt_runa]

    # Lista de ataques para o banco: { nome, desc }
    ataques_banco = [{"nome": "Ataque Físico", "desc": f"1d{cat['dado_fisico']} de dano. Efeito em crítico: {critico_rolado}."}]
    if ataque_especial_str:
        if ":" in ataque_especial_str:
            part_nome, part_desc = ataque_especial_str.split(":", 1)
            ataques_banco.append({"nome": part_nome.strip(), "desc": part_desc.strip()})
        else:
            ataques_banco.append({"nome": "Ataque Especial", "desc": ataque_especial_str})

    fera_npc = {
        "nome": nome_final,
        "forca": attrs.get("Força", 0),
        "vitalidade": attrs.get("Vitalidade", 0),
        "destreza": attrs.get("Destreza", 0),
        "inteligencia": attrs.get("Inteligência", 0),
        "espirito": attrs.get("Espírito", 0),
        "carisma": attrs.get("Carisma", 0),
        "percepcao": attrs.get("Percepção", 0),
        "nível": tier,
        "hp_total": hp,
        "hp_atual": hp,
        "arcana_total": (attrs.get("Espírito", 0) * 10) if tier == "arcano" else 0,
        "arcana_atual": (attrs.get("Espírito", 0) * 10) if tier == "arcano" else 0,
        "pericia": cat["pericia"],
        "armadura": cat["armadura_natural"],
        "runas": lista_runas,
        "observacoes": [nome_final],
        "ataques": ataques_banco,
        "loot": lista_loot_strings,
        "dano": f"1d{cat['dado_fisico']}",
        "ataque_especial": ataque_especial_str,
        "efeito_ataque_critico": critico_rolado,
        "tipo": tipo,
        "raça": nome_final,
    }
    return fera_npc
