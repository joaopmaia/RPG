"""
Gera um demônio aleatório com atributos, HP, loot e ataques elementais.

Uso:
    python cria_demon.py
"""

import random
import sys

sys.path.insert(0, sys.path[0] + "/../..")

from pymongo import MongoClient
from service.utils.constantes import ATRIBUTOS, DEMON_NAMES

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"

# ═══════════════════════════════════════════════════
#  Categorias de Demônio
# ═══════════════════════════════════════════════════

CATEGORIAS = {
    "inferior": {
        "nome": "Demônio Inferior",
        "atributo_base": 2,
        "qtd_especializados": 2,
        "dado_especializado": (2, 2),   # 1d2+2 → 3-4
        "pericia": 2,
        "bonus_hp": 15,
        "armadura_natural": 1,
        "loot_rolls": 2,
        "dado_fisico": 6,               # 1d6
    },
    "normal": {
        "nome": "Demônio",
        "atributo_base": 4,
        "qtd_especializados": 3,
        "dado_especializado": (3, 4),   # 1d3+4 → 5-7
        "pericia": 5,
        "bonus_hp": 40,
        "armadura_natural": 3,
        "loot_rolls": 3,
        "dado_fisico": 10,              # 1d10
    },
    "superior": {
        "nome": "Demônio Superior",
        "atributo_base": 6,
        "qtd_especializados": 4,
        "dado_especializado": (2, 6),   # 1d2+6 → 7-8
        "pericia": 8,
        "bonus_hp": 100,
        "armadura_natural": 6,
        "loot_rolls": 4,
        "dado_fisico": 20,              # 1d20
    },
}

LIMITE_ATRIBUTO = 8

# ═══════════════════════════════════════════════════
#  Tabela de Loot (1d10)
# ═══════════════════════════════════════════════════

TABELA_LOOT = {
    1: "Garra",
    2: "Dente",
    3: "Couro",
    4: "Osso",
    5: "Carapaça",
    6: "Dente",
    7: "Coração",
    8: "Chifre",
    9: "Composto Alquímico",
    10: "Todos",
}

MATERIAIS_FISICOS = ["Garra", "Dente", "Couro", "Osso", "Carapaça", "Coração", "Chifre"]

DIFICULDADE_EXTRACAO = {
    "Comum": 10,
    "Incomum": 12,
    "Raro": 15,
    "Épico": 17,
    "Lendário": 20,
}

DIFICULDADE_CONSTRUCAO = DIFICULDADE_EXTRACAO  # mesma tabela

# ═══════════════════════════════════════════════════
#  Ataques por Elemento e Tier
# ═══════════════════════════════════════════════════

ELEMENTOS = {
    1: "Genia",
    2: "Degila",
    3: "Reetear",
    4: "Arunalt",
    5: "Saltrat",
    6: "Pascalia",
}

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
    """Gera os 7 atributos do demônio com base na categoria."""
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
#  Cálculo de HP e Defesa
# ═══════════════════════════════════════════════════

def calcular_hp(tier, atributos):
    """HP = (Força x 5) + (Vitalidade x 10) + Bônus de Casta."""
    cat = CATEGORIAS[tier]
    forca = atributos.get("Força", 1)
    vitalidade = atributos.get("Vitalidade", 1)
    return (forca * 5) + (vitalidade * 10) + cat["bonus_hp"]


# ═══════════════════════════════════════════════════
#  Geração de Loot
# ═══════════════════════════════════════════════════

def _escolher_elixir_demon(db):
    """Escolhe um elixir aleatório que exista para demônios (demoníaco_rar != '-')."""
    candidatos = [e for e in db["alquimia"].find() if e.get("demoníaco_rar", "-") != "-"]
    if not candidatos:
        return None
    return random.choice(candidatos)


SUFIXO_TIER = {
    "inferior": "Inferior",
    "normal": "",
    "superior": "Superior",
}


def _buscar_material_demon(db, nome_parte, tier):
    """Busca um material demoníaco no banco filtrando pela parte e pelo tier."""
    sufixo = SUFIXO_TIER[tier]
    if sufixo:
        # Ex: "Garra de Demônio Inferior"
        nome_esperado = f"{nome_parte} de Demônio {sufixo}".lower()
    else:
        # Ex: "Garra de Demônio" (sem sufixo, mas não deve conter Inferior/Superior)
        nome_esperado = f"{nome_parte} de Demônio".lower()

    for m in db["materiais"].find({"tipo": "demon"}):
        mat_nome = m.get("material", "").lower()
        if mat_nome == nome_esperado:
            raridade = m.get("raridade", "Comum")
            return {
                "nome": m.get("material", nome_parte),
                "dificuldade": DIFICULDADE_EXTRACAO.get(raridade, 10),
                "raridade": raridade,
            }

    # Fallback: busca parcial pelo nome da parte
    nome_lower = nome_parte.lower()
    candidatos = [m for m in db["materiais"].find({"tipo": "demon"}) if nome_lower in m.get("material", "").lower()]
    if candidatos:
        mat = random.choice(candidatos)
        raridade = mat.get("raridade", "Comum")
        return {
            "nome": mat.get("material", nome_parte),
            "dificuldade": DIFICULDADE_EXTRACAO.get(raridade, 10),
            "raridade": raridade,
        }
    return {"nome": nome_parte, "dificuldade": None}


def gerar_loot(tier, db):
    """Gera loot (restos demoníacos) com base no tier, sem repetições."""
    cat = CATEGORIAS[tier]
    qtd_rolls = cat["loot_rolls"]

    loot = []
    obtidos = set()

    tentativas = 0
    while len(loot) < qtd_rolls and tentativas < qtd_rolls * 10:
        tentativas += 1
        roll = rolar(10)
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
                    dif = DIFICULDADE_EXTRACAO.get(raridade, 10)
                    loot.append({
                        "nome": f"Composto Alquímico — {elixir.get('nome', '?')}: {elixir.get('efeito', '?')}",
                        "dificuldade": dif,
                        "raridade": raridade,
                    })
                    obtidos.add("Composto Alquímico")
            break

        if item == "Composto Alquímico":
            if item in obtidos:
                continue
            elixir = _escolher_elixir_demon(db)
            if elixir:
                raridade = elixir.get("demoníaco_rar", "Comum")
                dif = DIFICULDADE_EXTRACAO.get(raridade, 10)
                loot.append({
                    "nome": f"Composto Alquímico — {elixir.get('nome', '?')}: {elixir.get('efeito', '?')}",
                    "dificuldade": dif,
                    "raridade": raridade,
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


# ═══════════════════════════════════════════════════
#  Geração de Elemento e Ataques
# ═══════════════════════════════════════════════════

def gerar_ataques(tier):
    """Rola 1d6 para o elemento e retorna todos os ataques disponíveis."""
    roll_elem = rolar(6)
    elemento = ELEMENTOS[roll_elem]

    ataques_elemento = ATAQUES[elemento]

    ataques = []

    # Inferior sempre tem acesso
    ataques.extend(ataques_elemento["inferior"])

    # Normal herda inferior
    if tier in ("normal", "superior"):
        ataques.extend(ataques_elemento["normal"])

    # Superior herda normal e inferior
    if tier == "superior":
        ataques.extend(ataques_elemento["superior"])

    return elemento, ataques


# ═══════════════════════════════════════════════════
#  Exibição do Demônio
# ═══════════════════════════════════════════════════

def exibir_demon(demon):
    """Imprime o demônio gerado formatado."""
    cat = CATEGORIAS[demon["tier"]]

    print()
    print("══════════════════════════════════════════════════════")
    print("              DEMÔNIO GERADO")
    print("══════════════════════════════════════════════════════")
    print(f"  Categoria:        {cat['nome']}")
    print(f"  Elemento:         {demon['elemento']}")
    print(f"  HP:               {demon['hp']}")
    print(f"  Armadura Natural: {cat['armadura_natural']} (Redução de Dano)")
    print(f"  Perícia:          +{cat['pericia']}")
    print(f"  Dado Físico:      1d{cat['dado_fisico']}")
    print("──────────────────────────────────────────────────────")

    # Atributos
    print("  ATRIBUTOS:")
    especializados = set(demon["especializados"])
    for attr in ATRIBUTOS:
        valor = demon["atributos"][attr]
        marca = " ★" if attr in especializados else ""
        print(f"    {attr:<14} {valor}{marca}")

    # Ataques
    print("──────────────────────────────────────────────────────")
    print(f"  ATAQUES ({demon['elemento']}):")
    print()
    print(f"  Ataque Físico: 1d{cat['dado_fisico']} de dano")
    print()

    # Ataques elementais
    print("  Ataques Elementais (Inteligência + Perícia + 1d10):")
    for i, atk in enumerate(demon["ataques"], 1):
        inteligencia = demon["atributos"].get("Inteligência", 1)
        roll_elemental = f"Inteligência({inteligencia}) + Perícia(+{cat['pericia']}) + 1d10"
        print(f"    {i}. {atk['nome']}")
        print(f"       {atk['desc']}")
        if "(Passiva)" not in atk["nome"]:
            print(f"       Rolagem: {roll_elemental}")
        print()

    # Loot
    print("──────────────────────────────────────────────────────")
    print(f"  LOOT — Restos Demoníacos ({cat['loot_rolls']} rolagens):")
    for i, item in enumerate(demon["loot"], 1):
        dif_ext = item.get("dificuldade")
        raridade = item.get("raridade", "")
        dif_con = DIFICULDADE_CONSTRUCAO.get(raridade) if raridade else None
        if dif_ext is not None:
            linha = f"    {i}. {item['nome']} ({raridade})"
            linha += f" — Extração: {dif_ext}"
            if dif_con is not None:
                linha += f" | Construção: {dif_con}"
            print(linha)
        else:
            print(f"    {i}. {item['nome']}")

    print()
    print("══════════════════════════════════════════════════════")

# ═══════════════════════════════════════════════════
#  BD e Salvamento
# ═══════════════════════════════════════════════════
def deseja_salvar_demon():
    """Retorna True se o usuário quiser salvar, False caso contrário."""
    while True:
        res = input("\nDeseja salvar este demônio no banco de dados? (s, sim, 1 / n, não, 2): ").strip().lower()
        if res in ['s', 'sim', '1']:
            return True
        if res in ['n', 'não', 'nao', '2']:
            return False
        print("[!] Entrada inválida! Use 's' para sim ou 'n' para não.")

import random

def converter_demon_para_npc_banco(demon):
    """Transforma o dicionário do demônio gerado no formato do banco de dados."""
    cat = CATEGORIAS[demon["tier"]]
    attrs = demon["atributos"]
    
    # 1. Definição do Nome
    # Como demônios geralmente são referenciados pelo título, 
    # pedimos um nome ou geramos um baseado no elemento.
    nome_input = input(f"Dê um nome a este {cat['nome']} (Deixe vazio para usar nome aleatório): ").strip()
    nome_aleatorio = random.choice(DEMON_NAMES)
    nome_final = nome_input if nome_input else nome_aleatorio

    # 2. Processamento de Ataques (Físico + Elementais)
    lista_ataques = [f"Ataque Físico (1d{cat['dado_fisico']})"]
    for atk in demon["ataques"]:
        lista_ataques.append(f"{atk['nome']}: {atk['desc']}")

    # 3. Processamento de Loot
    lista_loot = []
    for item in demon["loot"]:
        info = f"{item['nome']} ({item.get('raridade', 'Comum')})"
        if item.get("dificuldade"):
            info += f" | Ext: {item['dificuldade']}"
        lista_loot.append(info)


    # 5. Montagem do Objeto Final
    # Nota: 'arcana_total' e 'arcana_atual' foram adicionados para manter compatibilidade com animais arcanos
    demon_npc = {
        "nome": nome_final,
        "forca": attrs.get("Força", 0),
        "vitalidade": attrs.get("Vitalidade", 0),
        "destreza": attrs.get("Destreza", 0),
        "inteligencia": attrs.get("Inteligência", 0),
        "espirito": attrs.get("Espírito", 0),
        "carisma": attrs.get("Carisma", 0),
        "percepcao": attrs.get("Percepção", 0),
        "nível": demon["tier"], 
        "hp_total": demon["hp"],
        "hp_atual": demon["hp"],
        "pericia": cat["pericia"],
        "armadura": cat["armadura_natural"],
        "runas": [f"Essência de {demon['elemento']}"], # Elemento como runa base
        "observacoes": [nome_final],
        "ataques": lista_ataques,
        "loot": lista_loot,
        "dano": f"1d{cat['dado_fisico']}",
        "tipo": demon['elemento'],
        "raça": nome_aleatorio,
    }

    print(f"\n[✅] Demônio '{nome_final}' formatado para o banco com sucesso!")
    return demon_npc


# ═══════════════════════════════════════════════════
#  Execução principal
# ═══════════════════════════════════════════════════

def main():
    db = conectar()

    print("══ Gerador de Demônio ══")

    # Selecionar tier
    opcoes_tier = [
        f"Demônio Inferior  (Base: 2 | Perícia: +2 | HP Bônus: +15)",
        f"Demônio Normal    (Base: 4 | Perícia: +5 | HP Bônus: +40)",
        f"Demônio Superior  (Base: 6 | Perícia: +8 | HP Bônus: +100)",
    ]
    tiers = ["inferior", "normal", "superior"]

    idx_tier = prompt_opcao("Selecione o tier do demônio: ", opcoes_tier)
    tier = tiers[idx_tier]

    cat = CATEGORIAS[tier]
    print(f"\n→ {cat['nome']}")

    # Gerar atributos
    atributos, especializados = gerar_atributos(tier)

    # Calcular HP
    hp = calcular_hp(tier, atributos)

    # Gerar elemento e ataques
    elemento, ataques = gerar_ataques(tier)

    # Gerar loot
    loot = gerar_loot(tier, db)

    demon = {
        "tier": tier,
        "elemento": elemento,
        "atributos": atributos,
        "especializados": especializados,
        "hp": hp,
        "ataques": ataques,
        "loot": loot,
    }

    print(demon)

    exibir_demon(demon)
    # ... código anterior ...
    exibir_demon(demon)

    if deseja_salvar_demon():
        # Converte para o formato do banco
        demon_npc = converter_demon_para_npc_banco(demon)
        
        # Salva no MongoDB
        try:
            db.demon_NPC.insert_one(demon_npc) # Usando a mesma coleção fera_NPC ou db.demon_NPC
            print("[💎] Demônio salvo com sucesso no banco de dados!")
        except Exception as e:
            print(f"[❌] Erro ao salvar no banco: {e}")
    else:
        print("[─] Operação finalizada. O demônio não foi salvo.")


if __name__ == "__main__":
    main()
