"""
Geração de demônio para a API (lógica copiada do script legado cria_demon.py).
Não importa nem chama o script legado.
"""
import random

# Constantes locais (espelho do script legado)
CATEGORIAS = {
    "inferior": {
        "nome": "Demônio Inferior",
        "atributo_base": 2,
        "qtd_especializados": 2,
        "dado_especializado": (2, 2),
        "pericia": 2,
        "bonus_hp": 15,
        "armadura_natural": 1,
        "loot_rolls": 2,
        "dado_fisico": 6,
    },
    "normal": {
        "nome": "Demônio",
        "atributo_base": 4,
        "qtd_especializados": 3,
        "dado_especializado": (3, 4),
        "pericia": 5,
        "bonus_hp": 40,
        "armadura_natural": 3,
        "loot_rolls": 3,
        "dado_fisico": 10,
    },
    "superior": {
        "nome": "Demônio Superior",
        "atributo_base": 6,
        "qtd_especializados": 4,
        "dado_especializado": (2, 6),
        "pericia": 8,
        "bonus_hp": 100,
        "armadura_natural": 6,
        "loot_rolls": 4,
        "dado_fisico": 20,
    },
}

LIMITE_ATRIBUTO = 8

TABELA_LOOT = {
    1: "Garra", 2: "Dente", 3: "Couro", 4: "Osso", 5: "Carapaça",
    6: "Dente", 7: "Coração", 8: "Chifre", 9: "Composto Alquímico", 10: "Todos",
}
MATERIAIS_FISICOS = ["Garra", "Dente", "Couro", "Osso", "Carapaça", "Coração", "Chifre"]
DIFICULDADE_EXTRACAO = {"Comum": 10, "Incomum": 12, "Raro": 15, "Épico": 17, "Lendário": 20}

SUFIXO_TIER = {"inferior": "Inferior", "normal": "", "superior": "Superior"}

ELEMENTOS = {
    1: "Genia", 2: "Degila", 3: "Reetear", 4: "Arunalt", 5: "Saltrat", 6: "Pascalia",
}
ELEMENTOS_NOME_TO_NUM = {v: k for k, v in ELEMENTOS.items()}

ATAQUES = {
    "Genia": {
        "inferior": [
            {"nome": "Bola de Fogo", "desc": "Causa 1d6 de dano (Queimadura em Crítico)."},
            {"nome": "Vórtex de Fogo", "desc": "Causa Queimadura em área (Curto alcance/Indesviável)."},
            {"nome": "Olhos de Fogo (Passiva)", "desc": "Qualquer cura é reduzida pela metade até o final do combate."},
        ],
        "normal": [
            {"nome": "Bola de Fogo Aprimorada", "desc": "Causa 1d10 de dano (Queimadura em Crítico)."},
            {"nome": "Fogo Alucinante", "desc": "Causa 1d6 de dano e status Berserker em acertos críticos."},
        ],
        "superior": [
            {"nome": "Chama Infernal", "desc": "Causa 1d20 de dano e aplica 1 acúmulo de Queimadura."},
        ],
    },
    "Degila": {
        "inferior": [
            {"nome": "Espinho de Gelo", "desc": "Causa 1d4 de dano (Sangramento em Crítico)."},
            {"nome": "Toque Gélido", "desc": "Reduz a Agilidade do alvo em 1d4 no próximo turno ao ser tocado."},
            {"nome": "Sangue Frio (Passiva)", "desc": "Reduz a destreza do alvo em 1d4 no próximo turno ao ser atacado por golpes de corpo a corpo. Não é acumulativo."},
        ],
        "normal": [
            {"nome": "Nevasca", "desc": "Aplica o status Congelado (Resistência vs. Rolagem do Demônio)."},
            {"nome": "Lança de Granizo", "desc": "Causa 1d10 de dano em área."},
        ],
        "superior": [
            {"nome": "Zero Absoluto", "desc": "Causa 1d12 de dano em área e status Congelado (Resistência vs. Rolagem do Demônio)."},
        ],
    },
    "Reetear": {
        "inferior": [
            {"nome": "Grito Atordoante", "desc": "Aplica Atordoamento (Resistência vs. Rolagem do Demônio)."},
            {"nome": "Ondas de Choque", "desc": "Causa 1d4 de dano e derrubado em acertos críticos."},
            {"nome": "Voar (Passiva)", "desc": "Concede +1d6 de dano em ataques físicos realizados do ar."},
        ],
        "normal": [
            {"nome": "Frequência Dissonante", "desc": "Causa confusão (Mentalidade vs. Rolagem do Demônio)."},
            {"nome": "Eco Cortante", "desc": "Causa alucinação em área (Mentalidade vs. Rolagem do Demônio)."},
        ],
        "superior": [
            {"nome": "Raio", "desc": "Causa 1d10 de dano, ignora armaduras."},
        ],
    },
    "Arunalt": {
        "inferior": [
            {"nome": "Lançamento de Pedra", "desc": "Causa 1d4 de dano (Atordoamento em Crítico)."},
            {"nome": "Garras de Raiz", "desc": "Prende os pés do alvo no chão (Impede movimentação por 1 turno)."},
            {"nome": "Pele de Pedra (Passiva)", "desc": "Aumenta a Armadura em 1d6 permanentemente."},
        ],
        "normal": [
            {"nome": "Enterrar/Emergir", "desc": "Fica debaixo da terra e imune a qualquer ataque enquanto estiver abaixo da terra. Emerge do solo causando 1d6 de dano."},
            {"nome": "Envenenamento", "desc": "Causa 1d4 de dano e envenenamento em acertos críticos."},
        ],
        "superior": [
            {"nome": "Fissura do Abismo", "desc": "Causa 1d10 de dano e status Petrificado."},
        ],
    },
    "Saltrat": {
        "inferior": [
            {"nome": "Sussurro de Medo", "desc": "O alvo perde uma ação de combate (Mentalidade vs. Rolagem do Demônio)."},
            {"nome": "Olhar Hipnótico", "desc": "O alvo fica paralisado e não pode realizar ações de movimento por 1 turno (Mentalidade vs. Rolagem do Demônio)."},
            {"nome": "Presença Sinistra (Passiva)", "desc": "Causa aflição passivamente, requer teste de mentalidade dificuldade 14 todo turno."},
        ],
        "normal": [
            {"nome": "Invasão Psíquica", "desc": "Causa 1d10 de dano e paralisia em acertos críticos."},
            {"nome": "Choque Psíquico", "desc": "Causa 1d6 de dano e Desolado (Mentalidade vs. Rolagem do Demônio)."},
        ],
        "superior": [
            {"nome": "Devorar Sanidade", "desc": "Controle de mente (Mentalidade vs. Rolagem do Demônio)."},
        ],
    },
    "Pascalia": {
        "inferior": [
            {"nome": "Passo de Vácuo", "desc": "O demônio se teletransporta para um ponto visível a até 5 metros."},
            {"nome": "Compressão Atmosférica", "desc": "Causa 1d4 de dano e status Atordoado em acertos críticos."},
            {"nome": "Corpo Efêmero (Passiva)", "desc": "Concede +1d6 em testes de Esquiva devido a distorções espaciais."},
        ],
        "normal": [
            {"nome": "Espelho de Trauma", "desc": "1d10 de armadura, reflete todo dano defendido pela armadura."},
            {"nome": "Ataque Dimensional", "desc": "Causa 1d10 de dano e Ferimento em acertos críticos."},
        ],
        "superior": [
            {"nome": "Espaço Dimensional (Passiva)", "desc": "Dobra todos os atributos do demônio até o fim do combate. Esse efeito permite ultrapassar o limite de atributo."},
        ],
    },
}


def _rolar(lados):
    return random.randint(1, lados)


def _gerar_atributos(tier):
    from service.utils.constantes import ATRIBUTOS
    cat = CATEGORIAS[tier]
    base = cat["atributo_base"]
    qtd_espec = cat["qtd_especializados"]
    lados, dado_base = cat["dado_especializado"]
    atributos = {a: base for a in ATRIBUTOS}
    especializados = random.sample(ATRIBUTOS, qtd_espec)
    for attr in especializados:
        valor = _rolar(lados) + dado_base
        atributos[attr] = min(valor, LIMITE_ATRIBUTO)
    return atributos, especializados


def _calcular_hp(tier, atributos):
    cat = CATEGORIAS[tier]
    forca = atributos.get("Força", 1)
    vitalidade = atributos.get("Vitalidade", 1)
    return (forca * 5) + (vitalidade * 10) + cat["bonus_hp"]


def _escolher_elixir_demon(db):
    candidatos = [e for e in db["alquimia"].find() if e.get("demoníaco_rar", "-") != "-"]
    if not candidatos:
        return None
    return random.choice(candidatos)


def _buscar_material_demon(db, nome_parte, tier):
    sufixo = SUFIXO_TIER[tier]
    if sufixo:
        nome_esperado = f"{nome_parte} de Demônio {sufixo}".lower()
    else:
        nome_esperado = f"{nome_parte} de Demônio".lower()
    for m in db["materiais"].find({"tipo": "demon"}):
        mat_nome = m.get("material", "").lower()
        if mat_nome == nome_esperado:
            raridade = m.get("raridade", "Comum")
            return {"nome": m.get("material", nome_parte), "dificuldade": DIFICULDADE_EXTRACAO.get(raridade, 10), "raridade": raridade}
    nome_lower = nome_parte.lower()
    candidatos = [m for m in db["materiais"].find({"tipo": "demon"}) if nome_lower in m.get("material", "").lower()]
    if candidatos:
        mat = random.choice(candidatos)
        raridade = mat.get("raridade", "Comum")
        return {"nome": mat.get("material", nome_parte), "dificuldade": DIFICULDADE_EXTRACAO.get(raridade, 10), "raridade": raridade}
    return {"nome": nome_parte, "dificuldade": None}


def _gerar_loot(tier, db):
    cat = CATEGORIAS[tier]
    qtd_rolls = cat["loot_rolls"]
    loot = []
    obtidos = set()
    tentativas = 0
    while len(loot) < qtd_rolls and tentativas < qtd_rolls * 10:
        tentativas += 1
        roll = _rolar(10)
        item = TABELA_LOOT[roll]
        if item == "Todos":
            for mat in MATERIAIS_FISICOS:
                if mat not in obtidos:
                    loot.append(_buscar_material_demon(db, mat, tier))
                    obtidos.add(mat)
            if "Composto Alquímico" not in obtidos:
                elixir = _escolher_elixir_demon(db)
                if elixir:
                    raridade = elixir.get("demoníaco_rar", "Comum")
                    loot.append({
                        "nome": f"Composto Alquímico — {elixir.get('nome', '?')}: {elixir.get('efeito', '?')}",
                        "dificuldade": DIFICULDADE_EXTRACAO.get(raridade, 10), "raridade": raridade,
                    })
                    obtidos.add("Composto Alquímico")
            break
        if item == "Composto Alquímico":
            if item in obtidos:
                continue
            elixir = _escolher_elixir_demon(db)
            if elixir:
                raridade = elixir.get("demoníaco_rar", "Comum")
                loot.append({
                    "nome": f"Composto Alquímico — {elixir.get('nome', '?')}: {elixir.get('efeito', '?')}",
                    "dificuldade": DIFICULDADE_EXTRACAO.get(raridade, 10), "raridade": raridade,
                })
            else:
                loot.append({"nome": "Composto Alquímico (nenhum elixir disponível)", "dificuldade": None})
            obtidos.add(item)
        else:
            if item in obtidos:
                continue
            loot.append(_buscar_material_demon(db, item, tier))
            obtidos.add(item)
    return loot


def _gerar_ataques(tier, elemento_forcado=None):
    """elemento_forcado: nome do elemento (ex: 'Genia') ou None para sortear 1d6."""
    if elemento_forcado and elemento_forcado in ATAQUES:
        elemento = elemento_forcado
    else:
        roll_elem = _rolar(6)
        elemento = ELEMENTOS[roll_elem]
    ataques_elemento = ATAQUES[elemento]
    ataques = list(ataques_elemento["inferior"])
    if tier in ("normal", "superior"):
        ataques.extend(ataques_elemento["normal"])
    if tier == "superior":
        ataques.extend(ataques_elemento["superior"])
    return elemento, ataques


def gerar_demon_npc(tier, db, nome=None, elemento=None):
    """
    Gera um demônio completo no formato demon_NPC.
    tier: 'inferior' | 'normal' | 'superior'
    db: conexão MongoDB (database)
    nome: opcional
    elemento: opcional; nome do elemento (Genia, Degila, Reetear, Arunalt, Saltrat, Pascalia). Se None, sorteia.
    Retorna documento com campo 'ataques' = lista de { nome, desc } (ataque físico + elementais).
    """
    from service.utils.constantes import ATRIBUTOS, DEMON_NAMES
    if tier not in CATEGORIAS:
        tier = "normal"
    atributos, especializados = _gerar_atributos(tier)
    hp = _calcular_hp(tier, atributos)
    elemento, ataques_list = _gerar_ataques(tier, elemento_forcado=elemento)
    loot = _gerar_loot(tier, db)
    nome_aleatorio = random.choice(DEMON_NAMES)
    nome_final = (nome or "").strip() or nome_aleatorio
    cat = CATEGORIAS[tier]
    attrs = atributos
    # Lista de ataques para o banco: primeiro físico, depois elementais (nome + desc)
    ataques_banco = [{"nome": "Ataque Físico", "desc": f"1d{cat['dado_fisico']} de dano."}]
    ataques_banco.extend(ataques_list)
    lista_loot = []
    for item in loot:
        info = f"{item['nome']} ({item.get('raridade', 'Comum')})"
        if item.get("dificuldade"):
            info += f" | Ext: {item['dificuldade']}"
        lista_loot.append(info)
    demon_npc = {
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
        "pericia": cat["pericia"],
        "armadura": cat["armadura_natural"],
        "runas": [f"Essência de {elemento}"],
        "observacoes": [nome_final],
        "ataques": ataques_banco,
        "loot": lista_loot,
        "dano": f"1d{cat['dado_fisico']}",
        "tipo": elemento,
        "raça": nome_aleatorio,
    }
    return demon_npc
