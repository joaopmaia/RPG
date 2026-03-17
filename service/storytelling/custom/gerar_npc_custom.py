"""
Gerador de NPC customizado via menu interativo no terminal.
Salva o personagem na coleção NPC do banco local.

Uso:
    python -m service.storytelling.custom.gerar_npc_custom
    ou, a partir da raiz do projeto: python service/storytelling/custom/gerar_npc_custom.py
"""

import json
import os
import random
import sys
from typing import Any, Dict, List, Optional, Tuple

# Garantir que o projeto esteja no path
_raiz = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
if _raiz not in sys.path:
    sys.path.insert(0, _raiz)

from pymongo import MongoClient

from service.utils import names

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DATABASE = "rpg"

# ═══════════════════════════════════════════════════
#  Dados locais (padrões para uso no menu e criação)
# ═══════════════════════════════════════════════════

BONUS_RACIAL = {
    "Vaelthor": "Inteligência",
    "Drovenar": "Vitalidade",
    "Sylmari": "Espírito",
    "Gorvash": "Força",
    "Sharusahk": "Destreza",
}

RACAS = list(BONUS_RACIAL.keys())

NOMES_POR_RACA = {
    "Vaelthor": names.Vaelthor,
    "Drovenar": names.Drovenar,
    "Sylmari": names.Sylmari,
    "Gorvash": names.Gorvash,
    "Sharusahk": names.Sharusahk,
}

ESPECIALIZACAO = {
    "Mercadores": ["Carisma", "Inteligência", "Percepção", "Espírito", "Vitalidade"],
    "Nobres": ["Carisma", "Espírito", "Inteligência", "Percepção", "Vitalidade"],
    "Guardas": ["Força", "Vitalidade", "Percepção", "Destreza", "Espírito"],
    "Ladinos": ["Destreza", "Percepção", "Inteligência", "Carisma", "Força"],
    "Assassinos": ["Destreza", "Percepção", "Força", "Inteligência", "Vitalidade"],
    "Mensageiros": ["Vitalidade", "Destreza", "Percepção", "Força", "Espírito"],
    "Alquimista": ["Inteligência", "Percepção", "Espírito", "Vitalidade", "Destreza"],
    "Bardo": ["Carisma", "Espírito", "Percepção", "Destreza", "Inteligência"],
    "Criminoso": ["Força", "Carisma", "Vitalidade", "Destreza", "Percepção"],
    "Pirata": ["Força", "Vitalidade", "Destreza", "Carisma", "Percepção"],
    "Cidadão": ["Vitalidade", "Percepção", "Força", "Inteligência", "Carisma"],
}

TIPOS_NPC = list(ESPECIALIZACAO.keys())

NIVEIS = {
    1: "Charlatão",
    2: "Amador",
    3: "Profissional",
    4: "Mestre",
    5: "Lenda",
}

OPCOES_NIVEL = [f"Nível {n} - {NIVEIS[n]}" for n in range(1, 6)]

# Classe → (lista de essências de runas)
CLASSES_ESSENCIAS = {
    "Arcanista": ["Genia", "Pascalia", "Reetear"],
    "Clérigo": ["Degila", "Arunalt", "Saltrat"],
    "Assassino": ["Saltrat", "Genia", "Arunalt"],
    "Paladino": ["Degila", "Arunalt", "Pascalia"],
    "Shaman": ["Genia", "Saltrat", "Reetear"],
    "Druida": ["Degila", "Reetear", "Saltrat"],
    "Eremita": ["Genia", "Arunalt", "Pascalia"],
    "Ocultista": ["Saltrat", "Degila", "Reetear"],
}

CLASSES = list(CLASSES_ESSENCIAS.keys())

# Quantidade de essências de runas por nível (Charlatão=0, Amador=1, ...)
ESSENCIAS_POR_NIVEL = {1: 0, 2: 1, 3: 2, 4: 3, 5: 3}

ELIXIRES_POR_CLASSE = {
    "Arcanista": [
        "Cura", "Éter", "Repelente", "Pílula", "Explosivo", "Incendiário",
        "Glacial", "Corrosivo", "Aprimoramento", "Lucidez",
    ],
    "Clérigo": [
        "Cura", "Éter", "Repelente", "Pílula", "Bálsamo", "Antídoto", "Aquecente",
        "Mobilidade", "Alívio", "Vigor", "Amolecente", "Esperança", "Purificação", "Ungüento",
    ],
    "Assassino": [
        "Cura", "Éter", "Repelente", "Pílula", "Fumaça", "Veneno", "Paralisante",
        "Agonia", "Torpor", "Afiação", "Lucidez", "Serenidade",
    ],
    "Paladino": [
        "Cura", "Éter", "Repelente", "Pílula", "Restaurador", "Antigelo", "Antifrio",
        "Afiação", "Mobilidade", "Aprimoramento", "Vigor",
    ],
    "Shaman": [
        "Cura", "Éter", "Repelente", "Pílula", "Sanidade", "Demência", "Fúria",
        "Desespero", "Atraente", "Lucidez", "Serenidade",
    ],
    "Druida": [
        "Cura", "Éter", "Repelente", "Pílula", "Aprimoramento", "Vigor", "Brânquias",
        "Amolecente", "Lucidez", "Serenidade", "Fúria", "Sanidade",
    ],
    "Eremita": [
        "Cura", "Éter", "Repelente", "Pílula", "Fumaça", "Brânquias", "Mobilidade",
        "Sanidade", "Lucidez", "Esperança", "Aprimoramento",
    ],
    "Ocultista": [
        "Cura", "Éter", "Repelente", "Pílula", "Pestilência", "Petrificante", "Agonia",
        "Desespero", "Demência", "Paralisante", "Veneno", "Corrosivo",
    ],
}

NATUREZAS = ["Neutro", "Bom", "Mal"]

# Raridades de elixir por nível (lista para sorteio)
ELIXIR_RARIDADES_POR_NIVEL = {
    1: ["Comum"],
    2: ["Comum", "Incomum"],
    3: ["Comum", "Incomum", "Raro"],
    4: ["Incomum", "Raro", "Épico"],
    5: ["Épico", "Lendário"],
}

# Quantidade de elixires (min, max) por nível
ELIXIR_QUANTIDADE_POR_NIVEL = {
    1: (0, 3),
    2: (1, 4),
    3: (2, 5),
    4: (3, 7),
    5: (5, 10),
}

# Rank de material por nível (distribuição de chance)
# 1: F ou E 50% cada; 2: F/E 40%, D 20%; 3: D ou C 50%; 4: C/B 40%, A 20%; 5: A/B 40%, S 20%
RANK_POR_NIVEL = {
    1: [("F", 50), ("E", 50)],
    2: [("F", 40), ("E", 40), ("D", 20)],
    3: [("D", 50), ("C", 50)],
    4: [("C", 40), ("B", 40), ("A", 20)],
    5: [("B", 40), ("A", 40), ("S", 20)],
}


def _carregar_reinos_info() -> List[Dict]:
    """Carrega reinos-info.json a partir de service/utils."""
    path = os.path.join(os.path.dirname(__file__), "..", "..", "utils", "reinos-info.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _reinos_por_raca(reinos: List[Dict], raca: str) -> List[Dict]:
    """Filtra reinos que têm a raça indicada."""
    return [r for r in reinos if r.get("raça") == raca]


# ═══════════════════════════════════════════════════
#  Menu interativo
# ═══════════════════════════════════════════════════

def _linha():
    print("  " + "─" * 50)


def _titulo(texto: str):
    print()
    print("  ═══ " + texto + " ═══")
    _linha()


def prompt_opcao(
    mensagem: str,
    opcoes: List[Any],
    permitir_voltar: bool = True,
    permitir_sair: bool = True,
) -> Tuple[Optional[int], str]:
    """
    Exibe opções numeradas 1 a n e lê a escolha.
    Retorna (índice 0-based, acao) onde acao é "next", "back" ou "quit".
    """
    for i, opcao in enumerate(opcoes, start=1):
        print(f"    [{i}] {opcao}")
    if permitir_voltar:
        print(f"    [0] Voltar")
    if permitir_sair:
        print(f"    [S] Sair")
    print()
    while True:
        escolha = input(mensagem).strip()
        if permitir_sair and escolha.upper() == "S":
            return (None, "quit")
        if permitir_voltar and escolha == "0":
            return (None, "back")
        try:
            idx = int(escolha) - 1
            if 0 <= idx < len(opcoes):
                return (idx, "next")
        except ValueError:
            pass
        print("    Opção inválida. Digite o número da opção, 0 para Voltar ou S para Sair.")


def rolar(lados: int) -> int:
    return random.randint(1, lados)


def escolher_rank_por_nivel(nivel: int) -> str:
    """Escolhe um rank de material conforme a distribuição do nível."""
    pares = RANK_POR_NIVEL.get(nivel, RANK_POR_NIVEL[1])
    total = sum(p for _, p in pares)
    r = random.randint(1, total)
    acum = 0
    for rank, p in pares:
        acum += p
        if r <= acum:
            return rank
    return pares[-1][0]


# ═══════════════════════════════════════════════════
#  Cálculos do NPC
# ═══════════════════════════════════════════════════

def calcular_hp(nivel: int, atributos: Dict[str, int]) -> int:
    """HP = (Nível x Força x 5) + (Nível x Vitalidade x 10). Nível 1: 10 + 1d10 + Força + Vitalidade."""
    forca = atributos.get("Força", 1)
    vitalidade = atributos.get("Vitalidade", 1)
    if nivel == 1:
        return 10 + rolar(10) + forca + vitalidade
    return (nivel * forca * 5) + (nivel * vitalidade * 10)


ATRIBUTO_PERICIA_MAX = 8


def gerar_atributos(nivel: int, tipo_npc: str, raca: str) -> Dict[str, int]:
    """Atributo base = nível (1-5), 50% chance +1 por atributo; bônus racial; especializados + (1 a 3). Máximo 8 por atributo."""
    from service.utils.constantes import ATRIBUTOS

    base = nivel
    atributos = {a: base for a in ATRIBUTOS}
    # 50% de chance de +1 em cada atributo
    for a in ATRIBUTOS:
        if random.random() < 0.5:
            atributos[a] += 1
    # Bônus racial
    attr_racial = BONUS_RACIAL.get(raca)
    if attr_racial and attr_racial in atributos:
        atributos[attr_racial] += 1
    # Especializados (prioridade do tipo); quantidade = nível; bônus aleatório 1-3
    lista_espec = ESPECIALIZACAO.get(tipo_npc, [])
    qtd_espec = min(nivel, len(lista_espec))
    for i in range(qtd_espec):
        attr = lista_espec[i]
        atributos[attr] += random.randint(1, 3)
    # Limite máximo de 8 por atributo
    for a in ATRIBUTOS:
        atributos[a] = min(ATRIBUTO_PERICIA_MAX, atributos[a])
    return atributos


def _montar_equipamento(item: Dict, material: Dict, parse_numero, calcular_preco_equipamento) -> Dict:
    """Monta um dicionário de equipamento (arma/armadura/escudo) com material."""
    mat_bonus = parse_numero(material.get("bonus"))
    mat_durabilidade = parse_numero(material.get("durabilidade"))
    peso = item.get("peso", "?")
    if material.get("peso") == "Pesado":
        pi = (item.get("peso") or "").lower()
        if pi == "muito leve":
            peso = "Leve"
        elif pi == "leve":
            peso = "Médio"
        elif pi == "médio":
            peso = "Pesado"
        else:
            peso = "Muito Pesado, não carregável"
    durabilidade = float(item.get("durabilidade", 0)) + mat_durabilidade
    preco = calcular_preco_equipamento(item, material)
    entrada = {
        "nome": item.get("nome", "?"),
        "tipo": item.get("tipo", "?"),
        "material": material.get("material", "?"),
        "tipo_material": material.get("tipo", "?"),
        "raridade": material.get("raridade", "?"),
        "peso": peso,
        "peso_material": material.get("peso", "?"),
        "durabilidade": durabilidade,
        "efeito_material": material.get("efeito", ""),
        "preco": preco,
        "rank": material.get("rank", ""),
    }
    dano = item.get("dano")
    defesa = item.get("defesa")
    if dano is not None:
        entrada["dano"] = f"{dano} +{int(mat_bonus)}" if mat_bonus >= 0 else f"{dano} {int(mat_bonus)}"
    if defesa is not None:
        try:
            entrada["defesa"] = float(defesa) + mat_bonus
        except (ValueError, TypeError):
            entrada["defesa"] = f"{defesa} +{int(mat_bonus)}" if mat_bonus >= 0 else f"{defesa} {int(mat_bonus)}"
    return entrada


def gerar_equipamentos_por_rank(db, nivel: int) -> List[Dict]:
    """Gera arma1, arma2, armadura, escudo com material pelo rank definido pelo nível."""
    from service.storytelling.cria_npc import parse_numero, calcular_preco_equipamento

    armas_db = list(db["armas"].find())
    armaduras_db = list(db["armaduras"].find({"tipo": "Armadura"}))
    escudos_db = list(db["armaduras"].find({"tipo": "Escudo"}))

    resultado = []
    slots = [
        ("arma", armas_db),
        ("arma", armas_db),
        ("armadura", armaduras_db),
        ("escudo", escudos_db),
    ]
    for tipo_slot, itens_db in slots:
        if not itens_db:
            continue
        rank = escolher_rank_por_nivel(nivel)
        materiais = list(db["materiais"].find({"rank": rank}))
        if not materiais:
            materiais = list(db["materiais"].find().limit(5))
        material = random.choice(materiais)
        item = random.choice(itens_db)
        resultado.append(_montar_equipamento(item, material, parse_numero, calcular_preco_equipamento))
    return resultado


def gerar_elixires_custom(db, classe: str, nivel: int) -> List[Dict]:
    """Gera lista de elixires conforme classe e nível (quantidade e raridades)."""
    nomes_possiveis = ELIXIRES_POR_CLASSE.get(classe, ["Cura", "Éter", "Repelente", "Pílula"])
    min_el, max_el = ELIXIR_QUANTIDADE_POR_NIVEL.get(nivel, (0, 3))
    qtd = random.randint(min_el, max_el)
    raridades_nivel = ELIXIR_RARIDADES_POR_NIVEL.get(nivel, ["Comum"])
    tipos_mat = ["vegetal", "animal", "mineral", "demoníaco"]
    elixires = []
    alquimia = list(db["alquimia"].find())
    for _ in range(qtd):
        nome_el = random.choice(nomes_possiveis)
        raridade = random.choice(raridades_nivel)
        # Encontrar um registro de alquimia com esse nome e essa raridade em algum material
        candidatos = []
        for e in alquimia:
            if e.get("nome") != nome_el:
                continue
            for t in tipos_mat:
                if e.get(f"{t}_rar") == raridade:
                    candidatos.append((e, t))
                    break
        if not candidatos:
            continue
        el, tipo_mat = random.choice(candidatos)
        campo_pot = f"{tipo_mat}_pot"
        elixires.append({
            "nome": el.get("nome", "?"),
            "efeito": el.get("efeito", "?"),
            "material": tipo_mat,
            "raridade": raridade,
            "potencia": el.get(campo_pot, "?"),
            "descricao": el.get("descrição", ""),
        })
    return elixires


def gerar_runas_custom(classe: str, nivel: int) -> List[str]:
    """Retorna lista de nomes de essências de runas (quantidade conforme nível)."""
    essencias = CLASSES_ESSENCIAS.get(classe, [])
    qtd = ESSENCIAS_POR_NIVEL.get(nivel, 0)
    if qtd <= 0 or not essencias:
        return []
    return list(random.sample(essencias, min(qtd, len(essencias))))


# ═══════════════════════════════════════════════════
#  Persistência
# ═══════════════════════════════════════════════════

def salvar_npc_completo(
    db,
    nome_completo: str,
    atributos: Dict[str, int],
    raca: str,
    tipo: str,
    classe: str,
    nivel: int,
    hp_total: int,
    arcana_total: int,
    pericia: int,
    equipamentos: List[Dict],
    elixires: List[Dict],
    runas: List[str],
    natureza: str,
    observacoes: List[str],
    moedas: str,
):
    """Salva NPC na coleção NPC e equipamentos/elixires nas coleções auxiliares."""
    from service.storytelling.utils.salva_npc import salva_npc
    from service.storytelling.utils.cria_equipamento_npc import cria_equipamento_npc
    from service.storytelling.utils.cria_elixir_npc import cria_elixir_npc

    arma1 = arma2 = armadura = escudo = ""
    for eq in equipamentos:
        t = (eq.get("tipo") or "").lower()
        if t in ("melee", "ranged", "arcane"):
            if not arma1:
                arma1 = eq.get("nome", "")
                _salvar_equipamento(db, nome_completo, eq)
            elif not arma2:
                arma2 = eq.get("nome", "")
                _salvar_equipamento(db, nome_completo, eq)
        elif t == "armadura" and not armadura:
            armadura = eq.get("nome", "")
            _salvar_equipamento(db, nome_completo, eq)
        elif t == "escudo" and not escudo:
            escudo = eq.get("nome", "")
            _salvar_equipamento(db, nome_completo, eq)

    npc_obj = {
        "nome": nome_completo,
        "forca": atributos["Força"],
        "vitalidade": atributos["Vitalidade"],
        "destreza": atributos["Destreza"],
        "inteligencia": atributos["Inteligência"],
        "espirito": atributos["Espírito"],
        "carisma": atributos["Carisma"],
        "percepcao": atributos["Percepção"],
        "raça": raca,
        "tipo": f"{tipo} e {classe}",
        "nível": nivel,
        "hp_total": str(hp_total),
        "hp_atual": str(hp_total),
        "arcana_total": str(arcana_total),
        "arcana_atual": str(arcana_total),
        "pericia": str(pericia),
        "arma1": arma1,
        "arma2": arma2,
        "armadura": armadura,
        "escudo": escudo,
        "elixir": [e.get("nome", "") for e in elixires],
        "runas": runas,
        "moedas": moedas,
        "observacoes": observacoes,
        "natureza": natureza,
    }
    salva_npc(db, npc_obj)

    for el in elixires:
        elixir_obj = {
            "personagem_dono": nome_completo,
            "nome": el.get("nome", ""),
            "efeito": el.get("efeito", ""),
            "descricao": el.get("descricao", ""),
            "materia_prima": el.get("material", ""),
            "bonus_materia_prima": el.get("potencia", ""),
        }
        cria_elixir_npc(db, elixir_obj)


def _salvar_equipamento(db, nome_npc: str, eq: Dict):
    from service.storytelling.utils.cria_equipamento_npc import cria_equipamento_npc

    eq_obj = {
        "personagem_dono": nome_npc,
        "nome": eq.get("nome", ""),
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


# ═══════════════════════════════════════════════════
#  Fluxo principal
# ═══════════════════════════════════════════════════

def main():
    db = MongoClient(MONGO_URI)[DATABASE]
    reinos_lista = _carregar_reinos_info()

    print()
    print("  ═════════════════════════════════════════════")
    print("         GERADOR DE NPC CUSTOMIZADO")
    print("  ═════════════════════════════════════════════")
    print("  Responda às perguntas. Use 0 para Voltar ou S para Sair.")
    print()

    respostas: List[Any] = []
    passo = 0
    reino_info: Optional[Dict] = None

    while passo <= 7:
        if passo == 0:
            _titulo("1. Raça do NPC")
            idx, acao = prompt_opcao(
                "  Digite o número da raça: ",
                RACAS,
                permitir_voltar=False,
                permitir_sair=True,
            )
            if acao == "quit":
                print("\n  Até logo.\n")
                return
            respostas.append(RACAS[idx])
            nome_aleatorio = random.choice(NOMES_POR_RACA[RACAS[idx]])
            respostas.append(nome_aleatorio)
            print(f"\n  → Raça: {respostas[0]} | Nome gerado: {nome_aleatorio}")
            passo = 1
            continue

        if passo == 1:
            raca = respostas[0]
            reinos_raca = _reinos_por_raca(reinos_lista, raca)
            if not reinos_raca:
                print("\n  Nenhum reino encontrado para essa raça. Use outra raça.")
                passo = 0
                respostas.pop()
                respostas.pop()
                continue
            _titulo("2. Reino de origem")
            opcoes_reino = [r["nome"] for r in reinos_raca]
            idx, acao = prompt_opcao("  Digite o número do reino: ", opcoes_reino)
            if acao == "back":
                passo = 0
                respostas.pop()
                respostas.pop()
                continue
            if acao == "quit":
                print("\n  Até logo.\n")
                return
            reino_info = reinos_raca[idx]
            respostas.append(reino_info)
            print(f"\n  → Reino: {reino_info['nome']}")
            passo = 2
            continue

        if passo == 2:
            _titulo("3. Linhagem (sobrenome)")
            opcoes_linhagem = ["Nobre", "Comum"]
            idx, acao = prompt_opcao("  Digite o número da linhagem: ", opcoes_linhagem)
            if acao == "back":
                passo = 1
                respostas.pop()
                reino_info = respostas[-1] if respostas else None
                continue
            if acao == "quit":
                print("\n  Até logo.\n")
                return
            linhagem = "nobre" if idx == 0 else "comum"
            reino_info = respostas[2]
            sobrenomes = reino_info.get("sobrenomes_nobres", []) if linhagem == "nobre" else reino_info.get("sobrenomes_comuns", [])
            sobrenome = random.choice(sobrenomes) if sobrenomes else ""
            nome_completo = f"{respostas[1]} {sobrenome}".strip()
            respostas.append(nome_completo)
            print(f"\n  → Nome completo: {nome_completo}")
            passo = 3
            continue

        if passo == 3:
            _titulo("4. Tipo do NPC")
            idx, acao = prompt_opcao("  Digite o número do tipo: ", TIPOS_NPC)
            if acao == "back":
                passo = 2
                respostas.pop()
                continue
            if acao == "quit":
                print("\n  Até logo.\n")
                return
            respostas.append(TIPOS_NPC[idx])
            print(f"\n  → Tipo: {TIPOS_NPC[idx]}")
            passo = 4
            continue

        if passo == 4:
            _titulo("5. Classe do personagem")
            idx, acao = prompt_opcao("  Digite o número da classe: ", CLASSES)
            if acao == "back":
                passo = 3
                respostas.pop()
                continue
            if acao == "quit":
                print("\n  Até logo.\n")
                return
            respostas.append(CLASSES[idx])
            print(f"\n  → Classe: {CLASSES[idx]}")
            passo = 5
            continue

        if passo == 5:
            _titulo("6. Natureza do personagem")
            idx, acao = prompt_opcao("  Digite o número da natureza: ", NATUREZAS)
            if acao == "back":
                passo = 4
                respostas.pop()
                continue
            if acao == "quit":
                print("\n  Até logo.\n")
                return
            respostas.append(NATUREZAS[idx])
            print(f"\n  → Natureza: {NATUREZAS[idx]}")
            passo = 6
            continue

        if passo == 6:
            _titulo("7. Nível do personagem")
            idx, acao = prompt_opcao("  Digite o número do nível: ", OPCOES_NIVEL)
            if acao == "back":
                passo = 5
                respostas.pop()
                continue
            if acao == "quit":
                print("\n  Até logo.\n")
                return
            nivel = idx + 1
            respostas.append(nivel)
            print(f"\n  → Nível: {nivel} - {NIVEIS[nivel]}")
            passo = 7
            continue

        if passo == 7:
            # Resumo e confirmação
            raca, nome_gerado, reino_info, nome_completo, tipo_npc, classe, natureza, nivel = (
                respostas[0], respostas[1], respostas[2], respostas[3], respostas[4], respostas[5], respostas[6], respostas[7],
            )
            _titulo("Resumo do NPC")
            print(f"    Nome:     {nome_completo}")
            print(f"    Raça:     {raca}")
            print(f"    Reino:    {reino_info['nome']}")
            print(f"    Tipo:     {tipo_npc} e {classe}")
            print(f"    Natureza: {natureza}")
            print(f"    Nível:    {nivel} - {NIVEIS[nivel]}")
            _linha()
            print("    [1] Gerar e salvar NPC no banco")
            print("    [0] Voltar (alterar nível)")
            print("    [S] Sair sem salvar")
            escolha = input("\n  Escolha: ").strip().upper()
            if escolha == "S":
                print("\n  Até logo.\n")
                return
            if escolha == "0":
                passo = 6
                respostas.pop()
                continue
            if escolha != "1":
                print("  Opção inválida.")
                continue

            # Gerar e salvar
            atributos = gerar_atributos(nivel, tipo_npc, raca)
            hp_total = calcular_hp(nivel, atributos)
            arcana_total = random.randint(0, 4) * nivel
            pericia = min(ATRIBUTO_PERICIA_MAX, random.randint(1, 3) + nivel)
            equipamentos = gerar_equipamentos_por_rank(db, nivel)
            elixires = gerar_elixires_custom(db, classe, nivel)
            runas = gerar_runas_custom(classe, nivel)
            observacoes = [f"Este personagem é oriundo de {reino_info['nome']}."]
            # Moedas = base do reino + tesouro por nível (1d10 x 10 x nível)
            base_moedas = int(reino_info.get("moedas", "0") or 0)
            tesouro_nivel = rolar(10) * 10 * nivel
            moedas = str(base_moedas + tesouro_nivel)

            salvar_npc_completo(
                db,
                nome_completo,
                atributos,
                raca,
                tipo_npc,
                classe,
                nivel,
                hp_total,
                arcana_total,
                pericia,
                equipamentos,
                elixires,
                runas,
                natureza,
                observacoes,
                moedas,
            )
            print("\n  NPC criado e salvo com sucesso na coleção NPC.")
            print(f"  Nome: {nome_completo}\n")
            return

    print("\n  Até logo.\n")


def criar_npc_por_escolhas(
    db,
    reinos_lista: List[Dict],
    raca: str,
    reino_nome: str,
    linhagem: str,
    tipo_npc: str,
    classe: str,
    natureza: str,
    nivel: int,
) -> Optional[Dict]:
    """
    Cria e salva um NPC a partir das escolhas (para uso pela API).
    Retorna o documento do NPC salvo (com _id) ou None se reino não for encontrado.
    """
    reinos_raca = _reinos_por_raca(reinos_lista, raca)
    reino_info = next((r for r in reinos_raca if r.get("nome") == reino_nome), None)
    if not reino_info:
        return None
    sobrenomes = reino_info.get("sobrenomes_nobres", []) if linhagem == "nobre" else reino_info.get("sobrenomes_comuns", [])
    sobrenome = random.choice(sobrenomes) if sobrenomes else ""
    nome_gerado = random.choice(NOMES_POR_RACA.get(raca, ["Desconhecido"]))
    nome_completo = f"{nome_gerado} {sobrenome}".strip()
    atributos = gerar_atributos(nivel, tipo_npc, raca)
    hp_total = calcular_hp(nivel, atributos)
    arcana_total = random.randint(0, 4) * nivel
    pericia = min(ATRIBUTO_PERICIA_MAX, random.randint(1, 3) + nivel)
    equipamentos = gerar_equipamentos_por_rank(db, nivel)
    elixires = gerar_elixires_custom(db, classe, nivel)
    runas = gerar_runas_custom(classe, nivel)
    observacoes = [f"Este personagem é oriundo de {reino_info['nome']}."]
    base_moedas = int(reino_info.get("moedas", "0") or 0)
    tesouro_nivel = rolar(10) * 10 * nivel
    moedas = str(base_moedas + tesouro_nivel)
    salvar_npc_completo(
        db,
        nome_completo,
        atributos,
        raca,
        tipo_npc,
        classe,
        nivel,
        hp_total,
        arcana_total,
        pericia,
        equipamentos,
        elixires,
        runas,
        natureza,
        observacoes,
        moedas,
    )
    # Buscar o NPC recém-inserido (por nome)
    from bson import ObjectId
    doc = db["NPC"].find_one({"nome": nome_completo})
    return serialize_doc(doc) if doc else {"nome": nome_completo}


def serialize_doc(doc):
    """Converte ObjectId para string para JSON."""
    if doc is None:
        return None
    out = dict(doc)
    if "_id" in out:
        out["_id"] = str(out["_id"])
    return out


if __name__ == "__main__":
    main()
