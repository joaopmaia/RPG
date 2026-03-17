"""
Gera um estabelecimento aleatório com estoque de itens,
calculando preços com base no reino, material e runas.

Uso:
    python cria_estabelecimento.py
"""

import math
import os
import random
import sys
from typing import List, Dict, Optional

from pymongo import MongoClient

sys.path.insert(0, sys.path[0] + "/../..")
from service.utils.constantes import CHANCES_RANK, CHANCES_RUNA

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DATABASE = "rpg"

# ═══════════════════════════════════════════════════
#  Configuração dos Níveis
# ═══════════════════════════════════════════════════

NIVEIS = {
    0: {
        "nome": "Acampamento",
        "desc": "Acampamento improvisado, sem estrutura de loja ou serviços fixos.",
        "base": 0,
        "dado": 0,
    },
    1: {
        "nome": "Ambulante",
        "desc": "Carroças ou barracas improvisadas em estradas ou vilas pobres",
        "base": 5,
        "dado": 10,
    },
    2: {
        "nome": "Empório Local",
        "desc": "Loja estabelecida em vilas, atendendo às necessidades básicas da população",
        "base": 10,
        "dado": 10,
    },
    3: {
        "nome": "Loja de Cidade",
        "desc": "Estabelecimentos em centros urbanos, focados em mercenários e soldados",
        "base": 10,
        "dado": 20,
    },
    4: {
        "nome": "Loja de Luxo",
        "desc": "Lojas de elite localizadas em bairros nobres ou capitais",
        "base": 20,
        "dado": 10,
    },
    5: {
        "nome": "Leilão de Nobres",
        "desc": "Eventos exclusivos para a alta sociedade com itens únicos",
        "base": 0,
        "dado": 6,
    },
}

# ═══════════════════════════════════════════════════
#  Multiplicadores e mapeamentos
# ═══════════════════════════════════════════════════

MULTIPLICADOR_MATERIAL = {
    "Comum": 1,
    "Incomum": 5,
    "Raro": 15,
    "Épico": 50,
    "Lendário": 100,
}

MULTIPLICADOR_RUNA = {
    "Básico": 5,
    "Intermediário": 20,
    "Superior": 50,
}

CUSTO_BASE_ELIXIR = {
    "Comum": 20,
    "Incomum": 100,
    "Raro": 500,
    "Épico": 2500,
    "Lendário": 10000,
}

CAMPO_REINO_EQUIP = {
    "arcane": "runicos",
    "melee": "armas",
    "ranged": "armas",
    "Armadura": "armaduras",
    "Escudo": "escudos",
}

RANK_PARA_RARIDADE = {
    "F": "Comum",
    "D": "Incomum",
    "C": "Raro",
    "B": "Épico",
    "A": "Épico",
    "S": "Lendário",
}

TIPOS_MATERIAL_EQUIP = ["vegetal", "animal", "mineral", "demon"]
TIPOS_MATERIAL_ELIXIR = ["vegetal", "animal", "mineral", "demoníaco"]

HOSPEDAGENS = [
    {"nome": "Hospedagem 1 Estrela (por noite)", "min": 50, "max": 150},
    {"nome": "Hospedagem 2 Estrelas (por noite)", "min": 150, "max": 300},
    {"nome": "Hospedagem 3 Estrelas (por noite)", "min": 300, "max": 600},
    {"nome": "Hospedagem 4 Estrelas (por noite)", "min": 900, "max": 1200},
    {"nome": "Hospedagem 5 Estrelas (por noite)", "min": 2000, "max": 3000},
]

NOMES_TIPO_ESTAB = {
    0: "Ferreiro",
    1: "Ferreiro Rúnico",
    2: "Alquimista",
    3: "Hospedagem",
    4: "Taverna",
    5: "Acampamento",
}

# Nomes aleatórios por nível: duas listas de 50; nome final = junção de duas partes (ex: "Taverna do Bode", "Coelho Dourado")
# Formato por nível: 1-2 "{a} do {b}", 3-4 "{a} {b}", 5 "{b} {a}"
NOMES_ESTABELECIMENTO = {
    1: {
        "lista_a": [
            "Taverna", "Barraca", "Carroça", "Tenda", "Bar do", "Cantina", "Botequim", "Albergue", "Pousada", "Estalagem",
            "Ferraria", "Forja", "Banca", "Trapézio", "Barraca do", "Toldo", "Rancho", "Cobertura", "Sótão", "Celeiro",
            "Depósito", "Armazém", "Bar", "Taberna", "Hospedaria", "Refúgio", "Recanto", "Esquina", "Porto", "Cais",
            "Caldeira", "Caldeirão", "Pote", "Frasco", "Alambique", "Destilaria", "Bebida", "Cerveja", "Vinho", "Hidromel",
            "Martelo", "Bigorna", "Forja Velha", "Carvão", "Brasa", "Fogo", "Sopapo", "Malho", "Ferramenta", "Prego",
        ],
        "lista_b": [
            "Bode", "Lobo", "Coelho", "Coruja", "Cervo", "Javali", "Rato", "Gato", "Cão", "Cavalo",
            "Urso", "Raposa", "Texugo", "Lontra", "Falcão", "Águia", "Serpente", "Sapo", "Peixe", "Caranguejo",
            "Três", "Sete", "Um", "Dourado", "Prateado", "Bronze", "Ferro", "Ouro", "Prata", "Cobre",
            "Rei", "Rainha", "Príncipe", "Duque", "Conde", "Barão", "Lorde", "Cavaleiro", "Guerreiro", "Mago",
            "Sorte", "Estrela", "Lua", "Sol", "Vento", "Chuva", "Nevoa", "Trilha", "Caminho", "Porta",
        ],
    },
    2: {
        "lista_a": [
            "Empório", "Loja", "Comércio", "Casa", "Oficina", "Ferraria", "Alquimia", "Botica", "Taberna", "Estalagem",
            "Armazém", "Depósito", "Bar", "Cantina", "Pousada", "Albergue", "Hospedaria", "Refúgio", "Recanto", "Porto",
            "Forja", "Bigorna", "Martelo", "Caldeirão", "Alambique", "Destilaria", "Bebedouro", "Fonte", "Poço", "Cisterna",
            "Mercado", "Feira", "Tenda", "Barraca", "Banca", "Balcão", "Balcão do", "Canto do", "Canto", "Esquina",
            "Vila", "Vilarejo", "Aldeia", "Rua", "Praça", "Largo", "Beco", "Travessa", "Avenida", "Caminho",
        ],
        "lista_b": [
            "Bode", "Lobo", "Coelho", "Coruja", "Cervo", "Javali", "Rato", "Gato", "Cão", "Cavalo",
            "Urso", "Raposa", "Texugo", "Lontra", "Falcão", "Águia", "Serpente", "Sapo", "Peixe", "Caranguejo",
            "Dourado", "Prateado", "Bronze", "Ferro", "Ouro", "Prata", "Cobre", "Estanho", "Aço", "Âmbar",
            "Rei", "Rainha", "Príncipe", "Duque", "Conde", "Barão", "Lorde", "Cavaleiro", "Guerreiro", "Mago",
            "Sorte", "Estrela", "Lua", "Sol", "Vento", "Chuva", "Nevoa", "Trilha", "Caminho", "Porta",
        ],
    },
    3: {
        "lista_a": [
            "Loja", "Casa", "Oficina", "Ferraria", "Alquimia", "Botica", "Taberna", "Estalagem", "Armazém", "Empório",
            "Forja", "Bigorna", "Caldeirão", "Alambique", "Destilaria", "Mercado", "Feira", "Salão", "Galeria", "Ateliê",
            "Cidade", "Vila", "Praça", "Rua", "Largo", "Beco", "Travessa", "Avenida", "Porto", "Cais",
            "Martelo", "Espada", "Escudo", "Elmo", "Armadura", "Poção", "Elixir", "Óleo", "Unguento", "Bálsamo",
            "Lâmina", "Cutelo", "Machado", "Lança", "Arco", "Besta", "Adaga", "Mandril", "Ferramenta", "Prego",
        ],
        "lista_b": [
            "Dourado", "Prateado", "Bronze", "Ferro", "Ouro", "Prata", "Cobre", "Aço", "Âmbar", "Jade",
            "Bode", "Lobo", "Coelho", "Coruja", "Cervo", "Javali", "Urso", "Raposa", "Falcão", "Águia",
            "Rei", "Rainha", "Príncipe", "Duque", "Conde", "Barão", "Lorde", "Cavaleiro", "Guerreiro", "Mago",
            "Sorte", "Estrela", "Lua", "Sol", "Vento", "Chuva", "Nevoa", "Trilha", "Caminho", "Porta",
            "Velho", "Novo", "Grande", "Pequeno", "Alto", "Baixo", "Norte", "Sul", "Leste", "Oeste",
        ],
    },
    4: {
        "lista_a": [
            "Coelho", "Raposa", "Coruja", "Cervo", "Águia", "Leão", "Lobo", "Urso", "Falcão", "Serpente",
            "Ouro", "Prata", "Bronze", "Jade", "Âmbar", "Ébano", "Marfim", "Seda", "Veludo", "Linho",
            "Rei", "Rainha", "Príncipe", "Duque", "Conde", "Barão", "Lorde", "Cavaleiro", "Guerreiro", "Mago",
            "Estrela", "Lua", "Sol", "Vento", "Chuva", "Nevoa", "Trilha", "Caminho", "Porta", "Ponte",
            "Loja", "Casa", "Oficina", "Salão", "Galeria", "Ateliê", "Palácio", "Torre", "Mansão", "Solar",
        ],
        "lista_b": [
            "Dourado", "Prateado", "Bronze", "Cobre", "Aço", "Cristal", "Pérola", "Rubi", "Safira", "Esmeralda",
            "Velho", "Novo", "Grande", "Pequeno", "Alto", "Baixo", "Norte", "Sul", "Leste", "Oeste",
            "Real", "Nobre", "Sagrado", "Antigo", "Místico", "Secreto", "Oculto", "Raro", "Único", "Fino",
            "Brilhante", "Lustroso", "Polido", "Refinado", "Distinto", "Elegante", "Soberbo", "Majestoso", "Imperial", "Real",
            "Primeiro", "Último", "Eterno", "Infinito", "Supremo", "Divino", "Celestial", "Abençoado", "Sagrado", "Puro",
        ],
    },
    5: {
        "lista_a": [
            "Leilão", "Galeria", "Salão", "Casa", "Corte", "Palácio", "Torre", "Mansão", "Solar", "Fortaleza",
            "Ouro", "Prata", "Jade", "Âmbar", "Ébano", "Marfim", "Seda", "Veludo", "Cristal", "Pérola",
            "Rei", "Rainha", "Príncipe", "Duque", "Conde", "Barão", "Lorde", "Imperador", "César", "Grão-Duque",
            "Estrela", "Lua", "Sol", "Coroa", "Cetro", "Trono", "Escudo", "Espada", "Cálice", "Relíquia",
            "Nobre", "Real", "Imperial", "Sagrado", "Divino", "Celestial", "Supremo", "Eterno", "Único", "Raro",
        ],
        "lista_b": [
            "Dourado", "Prateado", "Real", "Nobre", "Imperial", "Sagrado", "Divino", "Celestial", "Supremo", "Eterno",
            "Primeiro", "Último", "Majestoso", "Soberbo", "Elegante", "Refinado", "Distinto", "Único", "Raro", "Fino",
            "Brilhante", "Lustroso", "Polido", "Puro", "Abençoado", "Antigo", "Místico", "Secreto", "Oculto", "Supremo",
            "Velho", "Novo", "Grande", "Alto", "Central", "Principal", "Real", "Imperial", "Cortês", "Gentil",
            "Vermelho", "Azul", "Verde", "Branco", "Negro", "Prata", "Ouro", "Bronze", "Cobre", "Âmbar",
        ],
    },
}


def _gerar_nome_estabelecimento(nivel):
    """Gera um nome aleatório para o estabelecimento com base no nível (ex: Taverna do Bode, Coelho Dourado)."""
    cfg = NOMES_ESTABELECIMENTO.get(nivel, NOMES_ESTABELECIMENTO[1])
    a = random.choice(cfg["lista_a"])
    b = random.choice(cfg["lista_b"])
    if nivel in (1, 2):
        return f"{a} do {b}"
    return f"{a} {b}"


# ═══════════════════════════════════════════════════
#  Funções utilitárias
# ═══════════════════════════════════════════════════

def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def prompt_opcao(mensagem, opcoes, permitir_voltar=False, permitir_cancelar=False):
    """Exibe opções numeradas e retorna o índice escolhido, -1 para voltar ou -2 para cancelar."""
    print()
    for i, opcao in enumerate(opcoes, start=1):
        print(f"  [{i}] {opcao}")
    if permitir_voltar:
        print("  [0] Voltar")
    if permitir_cancelar:
        print("  [-1] Cancelar")
    while True:
        escolha = input(f"\n{mensagem}").strip()
        if permitir_voltar and escolha == "0":
            return -1
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
    """Rola 1dN (número aleatório entre 1 e N)."""
    return random.randint(1, lados)


def parse_numero(valor):
    """Converte strings como '+5', '-10.0', '0', 'None' para float."""
    if valor is None:
        return 0.0
    s = str(valor).strip().lstrip('+')
    try:
        return float(s)
    except (ValueError, TypeError):
        return 0.0


def formatar_moedas(bronze_total):
    """Converte bronze em ouro/prata/bronze (100 bronze = 1 prata, 100 prata = 1 ouro)."""
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


def escolha_ponderada(pesos):
    """Retorna uma chave aleatória de um dict {opção: peso}."""
    opcoes = list(pesos.keys())
    valores = list(pesos.values())
    return random.choices(opcoes, weights=valores, k=1)[0]


def rolar_rank(nivel):
    """Rola o rank do material baseado nas chances do nível."""
    return escolha_ponderada(CHANCES_RANK[nivel])


def rolar_runa(nivel):
    """Rola se há runa e qual tier. Retorna o tier ou None."""
    resultado = escolha_ponderada(CHANCES_RUNA[nivel])
    return resultado if resultado != "Nenhuma" else None


def calcular_estoque(nivel):
    """Calcula a quantidade de itens no estoque."""
    cfg = NIVEIS[nivel]
    return cfg["base"] + rolar(cfg["dado"])


# ═══════════════════════════════════════════════════
#  Seleções interativas
# ═══════════════════════════════════════════════════

def selecionar_nivel():
    """Seleciona o nível do estabelecimento."""
    labels = [
        f"Nível {n} - {NIVEIS[n]['nome']}"
        for n in range(1, 6)
    ]
    idx = prompt_opcao("Selecione o nível do estabelecimento: ", labels, permitir_cancelar=True)
    if idx == -2:
        return None
    return idx + 1


def selecionar_reino(db):
    """Lista reinos e retorna o documento selecionado (sem duplicatas)."""
    reinos_raw = list(db["reinos"].find().sort("nome", 1))
    if not reinos_raw:
        print("Nenhum reino cadastrado.")
        sys.exit(1)
    # Deduplica por nome, mantém o primeiro
    vistos = set()  # type: set
    reinos = []  # type: List[Dict]
    for r in reinos_raw:
        if r["nome"] not in vistos:
            vistos.add(r["nome"])
            reinos.append(r)
    nomes = [r["nome"] for r in reinos]
    idx = prompt_opcao("Selecione o reino: ", nomes)
    return reinos[idx]


def selecionar_tipo():
    """Seleciona o tipo de estabelecimento (0-3)."""
    tipos = [NOMES_TIPO_ESTAB[i] for i in range(4)]
    return prompt_opcao("Selecione o tipo de estabelecimento: ", tipos)


def verificar_especializacao(nivel, tipo_estab):
    """Regra de Especialização: Nível 3-4, chance 1 em 6 de ser especializado."""
    if nivel not in (3, 4):
        return None
    if tipo_estab in (3, 4, 5):  # hospedagem / taverna / acampamento não têm especialização
        return None
    if rolar(6) != 6:
        return None

    # Especializado! Sortear um tipo de material
    if tipo_estab in (0, 1):  # ferreiro / ferreiro rúnico
        return random.choice(TIPOS_MATERIAL_EQUIP)
    else:  # alquimista
        return random.choice(TIPOS_MATERIAL_ELIXIR)


# ═══════════════════════════════════════════════════
#  Geração de estoque
# ═══════════════════════════════════════════════════

def gerar_estoque_ferreiro(db, nivel, reino, runico, especializado):
    """Gera estoque de armas e armaduras para um ferreiro."""
    qtd = calcular_estoque(nivel)

    armas = list(db["armas"].find())
    armaduras = list(db["armaduras"].find())
    todos_itens = armas + armaduras

    if not todos_itens:
        print("Nenhum equipamento cadastrado.")
        return []

    tipos_mat = [especializado] if especializado else TIPOS_MATERIAL_EQUIP

    # Cache de materiais por (rank, tipo) para evitar queries repetidas
    cache = {}  # type: Dict[tuple, list]
    for rank in ["F", "D", "C", "B", "A", "S"]:
        for tipo in tipos_mat:
            mats = list(db["materiais"].find({"rank": rank, "tipo": tipo}))
            if mats:
                cache[(rank, tipo)] = mats

    estoque = []  # type: List[Dict]
    for _ in range(qtd):
        item = random.choice(todos_itens)
        rank = rolar_rank(nivel)
        tipo_mat = random.choice(tipos_mat)

        # Buscar material do rank e tipo
        materiais = cache.get((rank, tipo_mat), [])
        if not materiais:
            # Fallback: qualquer tipo do mesmo rank
            for t in tipos_mat:
                materiais = cache.get((rank, t), [])
                if materiais:
                    break
        if not materiais:
            continue

        material = random.choice(materiais)

        # ── Cálculo de preço ──
        preco_base = float(item.get("preco", 0))
        tipo_item = item.get("tipo", "")
        campo = CAMPO_REINO_EQUIP.get(tipo_item, "armas")
        mod_reino = float(reino.get(campo, "0"))

        raridade = material.get("raridade", "Comum")
        mult_mat = MULTIPLICADOR_MATERIAL.get(raridade, 1)

        # Runa (somente ferreiro rúnico)
        runa_tier = None
        mult_runa = 1
        if runico:
            runa_tier = rolar_runa(nivel)
            if runa_tier:
                mult_runa = MULTIPLICADOR_RUNA[runa_tier]

        preco = preco_base * (1 + mod_reino) * mult_mat * mult_runa

        # Item usado (nível 1-2, 30% de chance)
        usado = False
        if nivel <= 2 and rolar(100) <= 30:
            usado = True
            preco *= 0.8

        # Estatísticas do equipamento (base + material)
        dano_base = item.get("dano", None)
        defesa_base = item.get("defesa", None)
        peso = item.get("peso", "?")
        durabilidade_base = float(item.get("durabilidade", 0))
        mat_bonus = parse_numero(material.get("bonus"))
        mat_durabilidade = parse_numero(material.get("durabilidade"))

        durabilidade_total = durabilidade_base + mat_durabilidade
        if usado:
            durabilidade_total = durabilidade_total / 2

        entrada = {
            "nome": item.get("nome", "?"),
            "tipo_item": tipo_item,
            "material": material.get("material", "?"),
            "tipo_material": tipo_mat,
            "rank": rank,
            "raridade": raridade,
            "peso": peso,
            "durabilidade_base": durabilidade_base,
            "mat_durabilidade": mat_durabilidade,
            "durabilidade": durabilidade_total,
            "mat_bonus": mat_bonus,
            "preco": math.ceil(preco),
        }
        if material.get("efeito"):
            entrada["efeito_material"] = material.get("efeito")
        if dano_base is not None:
            entrada["dano_base"] = dano_base
            if mat_bonus >= 0:
                entrada["dano"] = f"{dano_base} +{int(mat_bonus)}"
            else:
                entrada["dano"] = f"{dano_base} {int(mat_bonus)}"
        if defesa_base is not None:
            entrada["defesa_base"] = defesa_base
            try:
                defesa_total = float(defesa_base) + mat_bonus
                entrada["defesa"] = defesa_total
            except (ValueError, TypeError):
                # Defesa baseada em dado (ex: "1d6")
                if mat_bonus >= 0:
                    entrada["defesa"] = f"{defesa_base} +{int(mat_bonus)}"
                else:
                    entrada["defesa"] = f"{defesa_base} {int(mat_bonus)}"
        if runa_tier:
            entrada["runa"] = runa_tier
            # Buscar runa aleatória do tier
            runa_doc = _sortear_runa(db, runa_tier)
            if runa_doc:
                entrada["runa_nome"] = runa_doc.get("nome", "?")
                entrada["runa_efeito"] = runa_doc.get("efeito", "?")
                entrada["runa_bonus"] = runa_doc.get("bonus", "?")
                entrada["runa_descricao"] = runa_doc.get("descricao", "")
        if usado:
            entrada["usado"] = True

        estoque.append(entrada)

    return estoque


def _sortear_runa(db, tier):
    """Busca uma runa aleatória do tier informado no banco."""
    runas = list(db["runas"].find({"tier": tier}))
    if not runas:
        return None
    return random.choice(runas)


def gerar_estoque_alquimista(db, nivel, reino, especializado):
    """Gera estoque de elixires para um alquimista."""
    qtd = calcular_estoque(nivel)

    elixires = list(db["alquimia"].find())
    if not elixires:
        print("Nenhum elixir cadastrado.")
        return []

    mod_reino = float(reino.get("alquimia", "0"))
    tipos_mat = [especializado] if especializado else TIPOS_MATERIAL_ELIXIR

    estoque = []  # type: List[Dict]
    for _ in range(qtd):
        rank = rolar_rank(nivel)
        raridade_alvo = RANK_PARA_RARIDADE[rank]

        tipo_mat = random.choice(tipos_mat)
        campo_rar = f"{tipo_mat}_rar"

        # Filtrar elixires que possuem o ingrediente com a raridade alvo
        candidatos = [e for e in elixires if e.get(campo_rar) == raridade_alvo]

        # Fallback: qualquer elixir compatível com o material
        if not candidatos:
            candidatos = [e for e in elixires if e.get(campo_rar, "-") != "-"]

        if not candidatos:
            continue

        elixir = random.choice(candidatos)
        raridade = elixir.get(campo_rar, "Comum")
        custo_base = CUSTO_BASE_ELIXIR.get(raridade, 0)
        preco = custo_base * (1 + mod_reino)

        campo_pot = f"{tipo_mat}_pot"
        potencia = elixir.get(campo_pot, "-")

        entrada = {
            "nome": elixir.get("nome", "?"),
            "efeito": elixir.get("efeito", "?"),
            "descricao": elixir.get("descrição", ""),
            "material": tipo_mat,
            "raridade": raridade,
            "potencia": potencia,
            "preco": math.ceil(preco),
        }

        estoque.append(entrada)

    return estoque


def gerar_estoque_hospedagem(nivel, reino, tipo_estab):
    """Gera o cardápio de uma hospedagem/taverna/acampamento."""
    # Acampamento: não vende nada (apenas descanso narrativo / visual)
    if tipo_estab == 5:
        return []

    mod_reino = float(reino.get("servicos", "0"))

    estoque: List[Dict] = []

    # Comida — Refeição Completa (1d15)
    preco_comida_base = rolar(15) * (1 + mod_reino)
    if tipo_estab == 3:  # Hospedagem: refeição escala com o nível
        preco_comida = preco_comida_base * max(nivel, 1)
    else:  # Taverna ou outros: valor normal
        preco_comida = preco_comida_base
    estoque.append(
        {
            "nome": "Refeição Completa",
            "preco": math.ceil(preco_comida),
        }
    )

    # Hospedagens
    if tipo_estab == 4:
        # Taverna: apenas Hospedagem 1 Estrela
        h = HOSPEDAGENS[0]
        preco = random.randint(h["min"], h["max"]) * (1 + mod_reino)
        estoque.append(
            {
                "nome": h["nome"],
                "preco": math.ceil(preco),
            }
        )
    elif tipo_estab == 3:
        # Hospedagem: apenas X estrelas, sendo X = nível (1 a 5)
        if nivel > 0:
            idx = min(max(nivel, 1), 5) - 1
            h = HOSPEDAGENS[idx]
            preco = random.randint(h["min"], h["max"]) * (1 + mod_reino)
            estoque.append(
                {
                    "nome": h["nome"],
                    "preco": math.ceil(preco),
                }
            )

    return estoque


# ═══════════════════════════════════════════════════
#  Exibição do resultado
# ═══════════════════════════════════════════════════

def exibir(nivel, tipo_estab, reino, estoque, especializado):
    """Imprime o estabelecimento gerado formatado."""
    print()
    print("══════════════════════════════════════════════════════")
    print("            ESTABELECIMENTO GERADO")
    print("══════════════════════════════════════════════════════")
    print(f"  Nível:  {nivel} - {NIVEIS[nivel]['nome']}")
    print(f"  Tipo:   {NOMES_TIPO_ESTAB[tipo_estab]}")
    print(f"  Reino:  {reino['nome']}")
    if especializado:
        print(f"  ★ Especialização: {especializado.capitalize()}")
    print(f"  Itens:  {len(estoque)}")
    print("══════════════════════════════════════════════════════")

    if tipo_estab in (0, 1):
        _exibir_ferreiro(estoque)
    elif tipo_estab == 2:
        _exibir_alquimista(estoque)
    else:
        _exibir_hospedagem(estoque)

    print()
    print("══════════════════════════════════════════════════════")


def _exibir_ferreiro(estoque):
    """Exibe itens de um ferreiro / ferreiro rúnico."""
    for i, item in enumerate(estoque, 1):
        tag = " [USADO]" if item.get("usado") else ""
        mult_mat = MULTIPLICADOR_MATERIAL.get(item["raridade"], 1)

        print(f"\n  {i:>2}. {item['nome']} ({item['tipo_item']}){tag}")

        # Estatísticas finais do equipamento
        if item.get("dano"):
            print(f"      Dano:     {item['dano']}  (base {item['dano_base']} + material {int(item['mat_bonus']):+d})")
        if item.get("defesa") is not None:
            defesa = item['defesa']
            if isinstance(defesa, float):
                print(f"      Defesa:   {defesa:.1f}  (base {item['defesa_base']} + material {int(item['mat_bonus']):+d})")
            else:
                print(f"      Defesa:   {defesa}  (base {item['defesa_base']} + material {int(item['mat_bonus']):+d})")
        print(f"      Peso:     {item['peso']}")
        dur = item['durabilidade']
        dur_base = item['durabilidade_base']
        mat_dur = item['mat_durabilidade']
        if item.get("usado"):
            print(f"      Durabil.: {dur:.0f}  (base {dur_base:.0f} + material {mat_dur:+.0f} = {dur_base + mat_dur:.0f}, /2 usado)")
        else:
            print(f"      Durabil.: {dur:.0f}  (base {dur_base:.0f} + material {mat_dur:+.0f})")

        print(f"      Material: {item['material']} ({item.get('tipo_material', '?')}) (Rank {item['rank']} | {item['raridade']} → x{mult_mat})")
        if item.get("runa"):
            mult_r = MULTIPLICADOR_RUNA[item["runa"]]
            print(f"      Runa:     {item.get('runa_nome', item['runa'])} ({item['runa']} — x{mult_r})")
            if item.get("runa_bonus"):
                print(f"      Bônus:    {item['runa_bonus']}")
            if item.get("runa_efeito"):
                print(f"      Efeito:   {item['runa_efeito']}")
            if item.get("runa_descricao"):
                print(f"      Desc.:    {item['runa_descricao']}")
        print(f"      Preço:    {item['preco']} moedas ({formatar_moedas(item['preco'])})")
        if item.get("usado"):
            print(f"      ⚠ Usado: preço x0.8 e metade da durabilidade")


def _exibir_alquimista(estoque):
    """Exibe itens de um alquimista."""
    for i, item in enumerate(estoque, 1):
        print(f"\n  {i:>2}. {item['nome']} — {item['efeito']}")
        if item.get("descricao"):
            print(f"      Descrição:   {item['descricao']}")
        print(f"      Ingrediente: {item['material']} ({item['raridade']} | Potência: {item['potencia']})")
        print(f"      Preço:       {item['preco']} moedas ({formatar_moedas(item['preco'])})")


def _exibir_hospedagem(estoque):
    """Exibe cardápio de hospedagem / taverna."""
    for i, item in enumerate(estoque, 1):
        print(f"\n  {i:>2}. {item['nome']}")
        print(f"      Preço: {item['preco']} moedas ({formatar_moedas(item['preco'])})")


# ═══════════════════════════════════════════════════
#  API: geração programática (retorna dict para salvar)
# ═══════════════════════════════════════════════════

def gerar_estabelecimento(db, nivel, reino, tipo_estab):
    """
    Gera um estabelecimento (estoque e metadados) para uso pela API.
    reino: documento do reino (dict com nome, armas, alquimia, etc.)
    tipo_estab: 0=Ferreiro, 1=Ferreiro Rúnico, 2=Alquimista, 3=Hospedagem, 4=Taverna, 5=Acampamento
    Retorna dict com nome, nivel, nivel_nome, reino_nome, tipo, tipo_nome, especializado?, estoque, observacoes.
    """
    # Para Acampamento, forçamos o nível lógico 0 (configuração própria)
    if tipo_estab == 5:
        nivel = 0
    cfg = NIVEIS.get(nivel, NIVEIS[1])
    reino_nome = reino.get("nome", "?")
    tipo_nome = NOMES_TIPO_ESTAB.get(tipo_estab, "?")
    especializado = verificar_especializacao(nivel, tipo_estab)

    if tipo_estab == 0:
        estoque = gerar_estoque_ferreiro(db, nivel, reino, runico=False, especializado=especializado)
    elif tipo_estab == 1:
        estoque = gerar_estoque_ferreiro(db, nivel, reino, runico=True, especializado=especializado)
    elif tipo_estab == 2:
        estoque = gerar_estoque_alquimista(db, nivel, reino, especializado=especializado)
    else:
        estoque = gerar_estoque_hospedagem(nivel, reino, tipo_estab)

    if tipo_estab == 5:
        # Nome único por reino: "Acampamento em {reino}" ou "Acampamento em {reino} 2", "Acampamento em {reino} 3", ...
        base = f"Acampamento em {reino_nome}"
        try:
            count = db["estabelecimentos"].count_documents({"tipo": 5, "reino_nome": reino_nome})
        except Exception:
            count = 0
        nome = base if count == 0 else f"{base} {count + 1}"
        observacoes = [f"Acampamento especial em {reino_nome}."]
    else:
        nome = _gerar_nome_estabelecimento(nivel)
        observacoes = [f"Nível {nivel}: {cfg['nome']}. {cfg['desc']}"]
        if especializado:
            observacoes.append(f"Especializado em: {especializado}.")

    # Inicializa listas de nomes usadas para eventos noturnos
    lista_ladinos: List[str] = []
    lista_animais: List[str] = []
    lista_demonios: List[str] = []
    return {
        "nome": nome,
        "nivel": nivel,
        "nivel_nome": cfg["nome"],
        "reino_nome": reino_nome,
        "tipo": tipo_estab,
        "tipo_nome": tipo_nome,
        "especializado": especializado or "",
        "estoque": estoque,
        "lista_ladinos": lista_ladinos,
        "lista_animais": lista_animais,
        "lista_demonios": lista_demonios,
        "observacoes": observacoes,
    }


# ═══════════════════════════════════════════════════
#  Execução principal
# ═══════════════════════════════════════════════════

def main():
    db = conectar()

    print("══ Gerador de Estabelecimento ══")

    # 1. Nível do estabelecimento
    nivel = selecionar_nivel()
    if nivel is None:
        print("\nOperação cancelada.")
        return
    cfg = NIVEIS[nivel]
    print(f"\n→ {cfg['nome']}: {cfg['desc']}")

    # 2. Reino
    print("\n── Selecione o reino ──")
    reino = selecionar_reino(db)
    print(f"\n→ Reino: {reino['nome']}")

    # 3. Tipo de estabelecimento
    print("\n── Tipo de estabelecimento ──")
    tipo = selecionar_tipo()
    print(f"\n→ Tipo: {NOMES_TIPO_ESTAB[tipo]}")

    # 4. Verificar especialização (nível 3-4, chance 1 em 6)
    especializado = verificar_especializacao(nivel, tipo)
    if especializado:
        print(f"\n★ Este estabelecimento é especializado em: {especializado.capitalize()}")

    # 5. Gerar estoque
    if tipo == 0:
        estoque = gerar_estoque_ferreiro(
            db, nivel, reino, runico=False, especializado=especializado
        )
    elif tipo == 1:
        estoque = gerar_estoque_ferreiro(
            db, nivel, reino, runico=True, especializado=especializado
        )
    elif tipo == 2:
        estoque = gerar_estoque_alquimista(
            db, nivel, reino, especializado=especializado
        )
    else:
        estoque = gerar_estoque_hospedagem(nivel, reino)

    # 6. Exibir resultado
    exibir(nivel, tipo, reino, estoque, especializado)


if __name__ == "__main__":
    main()
