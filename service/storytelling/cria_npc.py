"""
Gera um NPC aleatório com atributos, equipamentos, elixires, runas e tesouro.

Uso:
    python cria_npc.py
"""

import math
import random
import sys
from typing import List, Dict, Optional

sys.path.insert(0, sys.path[0] + "/../..")

from pymongo import MongoClient
from service.utils.constantes import ATRIBUTOS, RACAS, TIPOS_NPC
from service.utils import names

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"

# ═══════════════════════════════════════════════════
#  Configuração dos Níveis
# ═══════════════════════════════════════════════════

NIVEIS = {
    1: "Charlatão",
    2: "Amador",
    3: "Profissional",
    4: "Mestre",
    5: "Lenda",
}

ATRIBUTO_BASE = {1: 1, 2: 2, 3: 3, 4: 4, 5: 5}

# Dado para atributos especializados: (lados, base) → 1d(lados) + base
DADO_ESPECIALIZADO = {
    1: (2, 1),   # 1d2+1 → 2-3
    2: (3, 1),   # 1d3+1 → 2-4
    3: (3, 3),   # 1d3+3 → 4-6
    4: (3, 4),   # 1d3+4 → 5-7
    5: (3, 5),   # 1d3+5 → 6-8
}

# ═══════════════════════════════════════════════════
#  Atributos especializados por tipo de NPC (ordem de prioridade)
# ═══════════════════════════════════════════════════

ESPECIALIZACAO = {
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

# ═══════════════════════════════════════════════════
#  Bônus Racial
# ═══════════════════════════════════════════════════

BONUS_RACIAL = {
    "Vaelthor":  "Inteligência",
    "Drovenar":  "Vitalidade",
    "Sylmari":   "Espírito",
    "Gorvash":   "Força",
    "Sharusahk": "Destreza",
}

# ═══════════════════════════════════════════════════
#  Raridade do equipamento/elixir por nível
# ═══════════════════════════════════════════════════

RARIDADE_NIVEL = {
    1: "Comum",
    2: "Incomum",
    3: "Raro",
    4: "Épico",
    5: "Lendário",
}

# ═══════════════════════════════════════════════════
#  Elementos das runas
# ═══════════════════════════════════════════════════

ELEMENTOS = ["Genia", "Degila", "Reetear", "Arunalt", "Saltrat", "Pascalia"]

# ═══════════════════════════════════════════════════
#  Nomes por raça (do arquivo names.py)
# ═══════════════════════════════════════════════════

NOMES_POR_RACA = {
    "Vaelthor":  names.Vaelthor,
    "Drovenar":  names.Drovenar,
    "Sylmari":   names.Sylmari,
    "Gorvash":   names.Gorvash,
    "Sharusahk": names.Sharusahk,
}


# ═══════════════════════════════════════════════════
#  Funções utilitárias
# ═══════════════════════════════════════════════════

def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def prompt_opcao(mensagem, opcoes, permitir_cancelar=False):
    """Exibe opções numeradas e retorna o índice escolhido ou -2 para cancelar."""
    print()
    for i, opcao in enumerate(opcoes, start=1):
        print(f"  [{i}] {opcao}")
    if permitir_cancelar:
        print(f"  [-1] Cancelar")
    while True:
        escolha = input(f"\n{mensagem}").strip()
        if permitir_cancelar and escolha == "-1":
            return -2
        try:
            idx = int(escolha) - 1
            if 0 <= idx < len(opcoes):
                return idx
        except ValueError:
            pass
        print("Opção inválida. Tente novamente.")


def rolar(lados):
    """Rola 1dN."""
    return random.randint(1, lados)


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


def parse_numero(valor):
    """Converte strings como '+5', '-10.0', '0', 'None' para float."""
    if valor is None:
        return 0.0
    s = str(valor).strip().lstrip('+')
    try:
        return float(s)
    except (ValueError, TypeError):
        return 0.0


# ═══════════════════════════════════════════════════
#  Geração de Atributos
# ═══════════════════════════════════════════════════

def gerar_atributos(nivel, tipo_npc, raca):
    """Gera os 7 atributos do NPC."""
    base = ATRIBUTO_BASE[nivel]

    # Inicializar todos com valor base
    atributos = {a: base for a in ATRIBUTOS}

    # Atributos especializados (quantidade = nível do NPC)
    lista_espec = ESPECIALIZACAO.get(tipo_npc, [])
    qtd_espec = min(nivel, len(lista_espec))
    lados, dado_base = DADO_ESPECIALIZADO[nivel]

    for i in range(qtd_espec):
        attr = lista_espec[i]
        valor = rolar(lados) + dado_base
        atributos[attr] = valor

    # Bônus racial
    attr_racial = BONUS_RACIAL.get(raca)
    if attr_racial and attr_racial in atributos:
        atributos[attr_racial] += 1

    return atributos


# ═══════════════════════════════════════════════════
#  Geração de HP
# ═══════════════════════════════════════════════════

def calcular_hp(nivel, atributos):
    """HP = (Nível x Força x 5) + (Nível x Vitalidade x 10).
    Para Nível 1: 10 + 1d10 + Força + Vitalidade."""
    forca = atributos.get("Força", 1)
    vitalidade = atributos.get("Vitalidade", 1)

    if nivel == 1:
        return 10 + rolar(10) + forca + vitalidade

    return (nivel * forca * 5) + (nivel * vitalidade * 10)


# ═══════════════════════════════════════════════════
#  Geração de Equipamentos
# ═══════════════════════════════════════════════════

def gerar_equipamentos(db, nivel):
    """Gera equipamentos aleatórios para o NPC."""
    qtd_max = nivel
    raridade = RARIDADE_NIVEL[nivel]

    # Buscar materiais da raridade
    materiais = list(db["materiais"].find({"raridade": raridade}))
    if not materiais:
        # Fallback para Comum
        materiais = list(db["materiais"].find({"raridade": "Comum"}))

    armas = list(db["armas"].find())
    armaduras_db = list(db["armaduras"].find({"tipo": "Armadura"}))
    escudos_db = list(db["armaduras"].find({"tipo": "Escudo"}))

    equipamentos = []  # type: List[Dict]
    qtd_armaduras = 0
    qtd_escudos = 0
    qtd_armas = 0

    todos = []  # type: List[tuple]
    for a in armas:
        todos.append(("arma", a))
    for a in armaduras_db:
        todos.append(("armadura", a))
    for e in escudos_db:
        todos.append(("escudo", e))

    random.shuffle(todos)

    for cat, item in todos:
        if len(equipamentos) >= qtd_max:
            break

        # Respeitar limites
        if cat == "armadura" and qtd_armaduras >= 1:
            continue
        if cat == "escudo" and qtd_escudos >= 2:
            continue
        if cat == "arma" and qtd_armas >= 3:
            continue

        material = random.choice(materiais)
        mat_bonus = parse_numero(material.get("bonus"))
        mat_durabilidade = parse_numero(material.get("durabilidade"))

        durabilidade = float(item.get("durabilidade", 0)) + mat_durabilidade

        entrada = {
            "nome": item.get("nome", "?"),
            "tipo": item.get("tipo", "?"),
            "material": material.get("material", "?"),
            "tipo_material": material.get("tipo", "?"),
            "raridade": raridade,
            "peso": item.get("peso", "?"),
            "peso_material": material.get("peso", "?"),
            "durabilidade": durabilidade,
            "efeito_material": material.get("efeito", ""),
        }

        # Dano ou Defesa
        dano = item.get("dano")
        defesa = item.get("defesa")
        if dano is not None:
            if mat_bonus >= 0:
                entrada["dano"] = f"{dano} +{int(mat_bonus)}"
            else:
                entrada["dano"] = f"{dano} {int(mat_bonus)}"
        if defesa is not None:
            try:
                entrada["defesa"] = float(defesa) + mat_bonus
            except (ValueError, TypeError):
                if mat_bonus >= 0:
                    entrada["defesa"] = f"{defesa} +{int(mat_bonus)}"
                else:
                    entrada["defesa"] = f"{defesa} {int(mat_bonus)}"

        equipamentos.append(entrada)

        if cat == "armadura":
            qtd_armaduras += 1
        elif cat == "escudo":
            qtd_escudos += 1
        else:
            qtd_armas += 1

    return equipamentos


# ═══════════════════════════════════════════════════
#  Geração de Elixires
# ═══════════════════════════════════════════════════

def gerar_elixires(db, nivel):
    """Gera elixires aleatórios para o NPC."""
    qtd_max = nivel * 2
    raridade = RARIDADE_NIVEL[nivel]

    elixires_db = list(db["alquimia"].find())
    if not elixires_db:
        return []

    tipos_mat = ["vegetal", "animal", "mineral", "demoníaco"]

    elixires = []  # type: List[Dict]
    tentativas = 0
    while len(elixires) < qtd_max and tentativas < qtd_max * 3:
        tentativas += 1
        tipo_mat = random.choice(tipos_mat)
        campo_rar = f"{tipo_mat}_rar"

        candidatos = [e for e in elixires_db if e.get(campo_rar) == raridade]
        if not candidatos:
            continue

        elixir = random.choice(candidatos)
        campo_pot = f"{tipo_mat}_pot"

        elixires.append({
            "nome": elixir.get("nome", "?"),
            "efeito": elixir.get("efeito", "?"),
            "material": tipo_mat,
            "raridade": elixir.get(campo_rar, "?"),
            "potencia": elixir.get(campo_pot, "?"),
        })

    return elixires


# ═══════════════════════════════════════════════════
#  Geração de Runas
# ═══════════════════════════════════════════════════

def gerar_runas(nivel):
    """Verifica se NPC sabe uma runa e gera os detalhes."""
    chance = nivel * 20  # 20%, 40%, 60%, 80%, 100%
    if rolar(100) > chance:
        return None

    # Determinar tier da runa
    if nivel == 1:
        tier = "Básico"
    elif nivel == 2:
        tier = "Básico" if rolar(2) == 1 else "Intermediário"
    elif nivel == 3:
        tier = "Intermediário"
    elif nivel == 4:
        tier = "Intermediário" if rolar(2) == 1 else "Superior"
    else:
        tier = "Superior"

    # Quantidade de elementos por tier
    if tier == "Básico":
        qtd_elem = 1
    elif tier == "Intermediário":
        qtd_elem = 2
    else:
        qtd_elem = 3

    elementos = random.sample(ELEMENTOS, qtd_elem)

    return {
        "tier": tier,
        "elementos": elementos,
    }


# ═══════════════════════════════════════════════════
#  Geração de Tesouro
# ═══════════════════════════════════════════════════

def gerar_tesouro(nivel):
    """Gera ouro base + bônus de moedas em bronze total."""
    # Ouro Base: (1d10 x 10) x Nível (em bronze)
    ouro_base = rolar(10) * 10 * nivel

    # Bônus de Moedas
    if nivel == 1:
        bonus = rolar(4) * 10           # +1d4 x 10 Bronze
    elif nivel == 2:
        bonus = rolar(8) * 10           # +1d8 x 10 Bronze
    elif nivel == 3:
        bonus = rolar(4) * 10 * 100     # +1d4 x 10 Prata (x100 para bronze)
    elif nivel == 4:
        bonus = rolar(8) * 10 * 100     # +1d8 x 10 Prata (x100 para bronze)
    else:
        bonus = rolar(4) * 10 * 10000   # +1d4 x 10 Ouro (x10000 para bronze)

    return ouro_base + bonus


# ═══════════════════════════════════════════════════
#  Exibição do NPC
# ═══════════════════════════════════════════════════

def exibir_npc(npc):
    """Imprime o NPC gerado formatado."""
    print()
    print("══════════════════════════════════════════════════════")
    print("                NPC GERADO")
    print("══════════════════════════════════════════════════════")
    print(f"  Nome:    {npc['nome']}")
    print(f"  Raça:    {npc['raca']}")
    print(f"  Tipo:    {npc['tipo']}")
    print(f"  Nível:   {npc['nivel']} - {NIVEIS[npc['nivel']]}")
    print(f"  HP:      {npc['hp']}")
    print(f"  Perícia: +{npc['pericia']}")
    print("──────────────────────────────────────────────────────")

    # Atributos
    print("  ATRIBUTOS:")
    especializados = set(ESPECIALIZACAO.get(npc['tipo'], [])[:npc['nivel']])
    for attr in ATRIBUTOS:
        valor = npc['atributos'][attr]
        marca = " ★" if attr in especializados else ""
        racial = " (+1 racial)" if BONUS_RACIAL.get(npc['raca']) == attr else ""
        print(f"    {attr:<14} {valor}{marca}{racial}")

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

    # Elixires
    print("──────────────────────────────────────────────────────")
    print(f"  ELIXIRES ({len(npc['elixires'])}):")
    if not npc['elixires']:
        print("    Nenhum")
    for i, el in enumerate(npc['elixires'], 1):
        print(f"    {i}. {el['nome']} — {el['efeito']}")
        print(f"       Ingrediente: {el['material']} ({el['raridade']} | Potência: {el['potencia']})")

    # Runas
    print("──────────────────────────────────────────────────────")
    print("  RUNAS:")
    if npc['runa']:
        runa = npc['runa']
        print(f"    Tier:      {runa['tier']}")
        print(f"    Elementos: {', '.join(runa['elementos'])}")
    else:
        print("    Nenhuma")

    # Tesouro
    print("──────────────────────────────────────────────────────")
    print(f"  TESOURO: {npc['tesouro']} moedas ({formatar_moedas(npc['tesouro'])})")

    print()
    print("══════════════════════════════════════════════════════")


# ═══════════════════════════════════════════════════
#  Execução principal
# ═══════════════════════════════════════════════════

def main():
    db = conectar()

    print("══ Gerador de NPC ══")

    # 1. Nível
    labels_nivel = [f"Nível {n} - {NIVEIS[n]}" for n in range(1, 6)]
    idx_nivel = prompt_opcao("Selecione o nível do NPC: ", labels_nivel, permitir_cancelar=True)
    if idx_nivel == -2:
        print("\nOperação cancelada.")
        return
    nivel = idx_nivel + 1
    print(f"\n→ Nível {nivel} - {NIVEIS[nivel]}")

    # 2. Raça
    print("\n── Raça ──")
    idx_raca = prompt_opcao("Selecione a raça: ", RACAS)
    raca = RACAS[idx_raca]
    print(f"\n→ Raça: {raca}")

    # 3. Tipo de NPC
    print("\n── Tipo de NPC ──")
    idx_tipo = prompt_opcao("Selecione o tipo: ", TIPOS_NPC)
    tipo = TIPOS_NPC[idx_tipo]
    print(f"\n→ Tipo: {tipo}")

    # 4. Nome aleatório
    nome = random.choice(NOMES_POR_RACA[raca])

    # 5. Gerar atributos
    atributos = gerar_atributos(nivel, tipo, raca)

    # 6. HP
    hp = calcular_hp(nivel, atributos)

    # 7. Bônus de perícia
    pericia = 2 * nivel

    # 8. Equipamentos
    equipamentos = gerar_equipamentos(db, nivel)

    # 9. Elixires
    elixires = gerar_elixires(db, nivel)

    # 10. Runas
    runa = gerar_runas(nivel)

    # 11. Tesouro
    tesouro = gerar_tesouro(nivel)

    npc = {
        "nome": nome,
        "raca": raca,
        "tipo": tipo,
        "nivel": nivel,
        "atributos": atributos,
        "hp": hp,
        "pericia": pericia,
        "equipamentos": equipamentos,
        "elixires": elixires,
        "runa": runa,
        "tesouro": tesouro,
    }

    exibir_npc(npc)


if __name__ == "__main__":
    main()
