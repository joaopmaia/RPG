"""
Visualizador de NPCs: menu interativo para listar, selecionar e explorar
detalhes de personagens (equipamentos, moedas, runas, elixires).

Uso:
    python -m service.storytelling.custom.visualizador_npc_custom
    ou: python service/storytelling/custom/visualizador_npc_custom.py
"""

import os
import sys
from itertools import combinations
from typing import Any, Dict, List, Optional

_raiz = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
if _raiz not in sys.path:
    sys.path.insert(0, _raiz)

from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"

NIVEIS_NOMES = {
    1: "Charlatão",
    2: "Amador",
    3: "Profissional",
    4: "Mestre",
    5: "Lenda",
}

TIERS_RUNA = ["Básico", "Intermediário", "Superior"]


def conectar():
    return MongoClient(MONGO_URI)[DATABASE]


def formatar_moedas(bronze_total) -> str:
    """Converte valor em ouro/prata/bronze."""
    try:
        bronze_total = int(float(bronze_total))
    except (ValueError, TypeError):
        return str(bronze_total)
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


def _linha(char="─", largura=56):
    print("  " + char * largura)


def _titulo(texto: str, char="═"):
    print()
    print("  " + char * 58)
    print(f"  {texto}")
    print("  " + char * 58)


def _observacoes_str(npc: Dict) -> str:
    obs = npc.get("observacoes")
    if obs is None:
        return ""
    if isinstance(obs, list):
        return " | ".join(str(x) for x in obs) if obs else ""
    return str(obs)


# ═══════════════════════════════════════════════════
#  Listagem e seleção
# ═══════════════════════════════════════════════════

def listar_npcs(db) -> List[Dict]:
    npcs = list(db.NPC.find().sort("nome", 1))
    return npcs


def exibir_lista_npcs(npcs: List[Dict]):
    """Exibe tabela com nome, raça, nível, tipo e observações."""
    _titulo("NPCs DISPONÍVEIS", "═")
    if not npcs:
        print("  Nenhum NPC encontrado no banco.")
        print()
        return
    print()
    for i, npc in enumerate(npcs, 1):
        nome = npc.get("nome", "?")
        raca = npc.get("raça", "?")
        nivel = npc.get("nível", "?")
        tipo = npc.get("tipo", "?")
        obs = _observacoes_str(npc)
        if len(obs) > 35:
            obs = obs[:32] + "..."
        nivel_nome = NIVEIS_NOMES.get(nivel, "") if isinstance(nivel, int) else ""
        nivel_str = f"{nivel} - {nivel_nome}" if nivel_nome else str(nivel)
        print(f"  [{i:>2}] {nome}")
        print(f"       Raça: {raca}  |  Nível: {nivel_str}  |  Tipo: {tipo}")
        if obs:
            print(f"       Obs.: {obs}")
        print()
    _linha()


def prompt_escolher_npc(npcs: List[Dict]) -> Optional[Dict]:
    """Retorna o NPC escolhido pelo índice (1-n) ou None para sair."""
    if not npcs:
        return None
    while True:
        escolha = input("  Digite o número do NPC para visualizar (0 = Voltar): ").strip()
        if escolha == "0":
            return None
        try:
            idx = int(escolha) - 1
            if 0 <= idx < len(npcs):
                return npcs[idx]
        except ValueError:
            pass
        print("  Opção inválida. Use o número da lista ou 0 para voltar.")


# ═══════════════════════════════════════════════════
#  Resumo do personagem
# ═══════════════════════════════════════════════════

def exibir_resumo_npc(npc: Dict):
    """Exibe resumo formatado do NPC."""
    _titulo("FICHA DO PERSONAGEM", "═")
    print(f"  Nome:       {npc.get('nome', '?')}")
    print(f"  Raça:       {npc.get('raça', '?')}")
    print(f"  Tipo:       {npc.get('tipo', '?')}")
    nivel = npc.get("nível", "?")
    nivel_nome = NIVEIS_NOMES.get(nivel, "") if isinstance(nivel, int) else ""
    print(f"  Nível:      {nivel} - {nivel_nome}")
    print(f"  Natureza:   {npc.get('natureza', '?')}")
    _linha()
    print(f"  HP:         {npc.get('hp_atual', '?')} / {npc.get('hp_total', '?')}")
    print(f"  Arcana:     {npc.get('arcana_atual', '?')} / {npc.get('arcana_total', '?')}")
    print(f"  Perícia:    +{npc.get('pericia', '?')}")
    _linha()
    print("  ATRIBUTOS:")
    for label, key in [
        ("Força", "forca"), ("Destreza", "destreza"), ("Vitalidade", "vitalidade"),
        ("Inteligência", "inteligencia"), ("Carisma", "carisma"),
        ("Espírito", "espirito"), ("Percepção", "percepcao"),
    ]:
        print(f"    {label:<14} {npc.get(key, '?')}")
    obs = _observacoes_str(npc)
    if obs:
        _linha()
        print("  Observações:")
        for part in (obs.split(" | ") if " | " in obs else [obs]):
            print(f"    • {part}")
    print()
    _linha("═")


# ═══════════════════════════════════════════════════
#  Detalhes: Equipamentos
# ═══════════════════════════════════════════════════

def exibir_equipamentos_detalhado(db, npc: Dict):
    """Busca equipamentos do NPC e exibe com efeitos, preço, raridade, etc."""
    nome_npc = npc.get("nome", "")
    armas = [npc.get("arma1", ""), npc.get("arma2", "")]
    armadura = npc.get("armadura", "")
    escudo = npc.get("escudo", "")
    slots = [
        ("Arma 1", armas[0]),
        ("Arma 2", armas[1]),
        ("Armadura", armadura),
        ("Escudo", escudo),
    ]
    itens = []
    for label, nome_eq in slots:
        if not nome_eq:
            continue
        eq = db.equipamentos_NPC.find_one({"personagem_dono": nome_npc, "nome": nome_eq})
        if eq:
            eq["_slot"] = label
            itens.append(eq)

    _titulo("EQUIPAMENTOS", "─")
    if not itens:
        print("  Nenhum equipamento registrado.")
        print()
        return

    for i, eq in enumerate(itens, 1):
        slot = eq.get("_slot", "?")
        nome = eq.get("nome", "?")
        tipo = eq.get("tipo", "?")
        bonus = eq.get("bônus", eq.get("bonus", "?"))
        durabilidade = eq.get("durabilidade", "?")
        peso = eq.get("peso", "?")
        peso_mat = eq.get("peso_material", "?")
        preco = eq.get("preco", "?")
        nome_mat = eq.get("nome_material", "?")
        tipo_mat = eq.get("tipo_material", "?")
        raridade = eq.get("raridade", "?")
        rank = eq.get("rank", "?")
        efeito = eq.get("efeito", "")

        print(f"\n  ┌─ {slot}: {nome} ({tipo})")
        print(f"  │  Bônus/Dano/Defesa: {bonus}")
        print(f"  │  Durabilidade:      {durabilidade}")
        print(f"  │  Peso:              {peso}" + (f" (material: {peso_mat})" if peso_mat else ""))
        print(f"  │  Material:          {nome_mat} ({tipo_mat})")
        print(f"  │  Raridade:          {raridade}  |  Rank: {rank}")
        if efeito:
            print(f"  │  Efeito do material: {efeito}")
        try:
            preco_int = int(float(preco))
            print(f"  │  Preço:             {preco_int} moedas ({formatar_moedas(preco_int)})")
        except (ValueError, TypeError):
            print(f"  │  Preço:             {preco}")
        print("  └" + "─" * 56)
    print()


# ═══════════════════════════════════════════════════
#  Detalhes: Moedas
# ═══════════════════════════════════════════════════

def exibir_moedas_detalhado(npc: Dict):
    """Exibe tesouro/moedas formatado."""
    _titulo("TESOURO / MOEDAS", "─")
    moedas = npc.get("moedas", "0")
    try:
        total = int(float(moedas))
        print(f"  Total em moedas: {total}")
        print(f"  Equivalente:     {formatar_moedas(total)}")
    except (ValueError, TypeError):
        print(f"  Valor: {moedas}")
    print()


# ═══════════════════════════════════════════════════
#  Detalhes: Runas
# ═══════════════════════════════════════════════════

def exibir_runas_menu(db, npc: Dict):
    """Menu: escolher tier e essência, depois listar runas do banco com detalhes."""
    elementos_npc = npc.get("runas") or []
    if not elementos_npc:
        _titulo("RUNAS", "─")
        print("  Este personagem não possui essências de runas conhecidas.")
        print()
        return

    _titulo("RUNAS DO PERSONAGEM", "─")
    print(f"  Essências disponíveis: {', '.join(elementos_npc)}")
    print()

    # Escolher tier
    print("  Nível da runa:")
    for i, t in enumerate(TIERS_RUNA, 1):
        print(f"    [{i}] {t}")
    print("    [0] Voltar")
    escolha_tier = input("\n  Escolha o nível (1-3): ").strip()
    if escolha_tier == "0":
        return
    try:
        idx_tier = int(escolha_tier) - 1
        if idx_tier < 0 or idx_tier >= len(TIERS_RUNA):
            print("  Opção inválida.")
            return
        tier = TIERS_RUNA[idx_tier]
    except ValueError:
        print("  Opção inválida.")
        return

    # Para Básico: 1 elemento. Intermediário: 2. Superior: 3.
    colecao = db["runas"]
    if tier == "Básico":
        opcoes_elem = [(elem,) for elem in elementos_npc]
        labels = list(elementos_npc)
    elif tier == "Intermediário":
        if len(elementos_npc) < 2:
            print("  Runas Intermediárias exigem pelo menos 2 essências. Este personagem tem apenas uma.")
            return
        opcoes_elem = list(combinations(elementos_npc, 2))
        opcoes_elem = [list(p) for p in opcoes_elem]
        labels = [" + ".join(p) for p in opcoes_elem]
    else:  # Superior
        if len(elementos_npc) < 3:
            print("  Runas Superiores exigem 3 essências. Este personagem não tem três.")
            return
        opcoes_elem = [list(elementos_npc)]
        labels = [" + ".join(elementos_npc)]

    print(f"\n  Essência(s) para tier {tier}:")
    for i, lb in enumerate(labels, 1):
        print(f"    [{i}] {lb}")
    print("    [0] Voltar")
    escolha_elem = input("\n  Escolha a combinação: ").strip()
    if escolha_elem == "0":
        return
    try:
        idx_elem = int(escolha_elem) - 1
        if idx_elem < 0 or idx_elem >= len(opcoes_elem):
            print("  Opção inválida.")
            return
        elementos_busca = opcoes_elem[idx_elem]
    except ValueError:
        print("  Opção inválida.")
        return

    # Buscar no banco: tier e elementos (ordem pode variar)
    if len(elementos_busca) == 1:
        runas = list(colecao.find({"tier": tier, "elementos": list(elementos_busca)}).sort("nome", 1))
    else:
        runas = list(colecao.find({
            "tier": tier,
            "elementos": {"$all": list(elementos_busca), "$size": len(elementos_busca)},
        }).sort("nome", 1))

    _titulo(f"RUNAS {tier.upper()} — {', '.join(elementos_busca)}", "─")
    if not runas:
        print("  Nenhuma runa encontrada para essa combinação.")
        print()
        return

    for i, r in enumerate(runas, 1):
        nome = r.get("nome", "?")
        efeito = r.get("efeito", "?")
        bonus = r.get("bonus", "?")
        descricao = r.get("descricao", "")
        print(f"\n  ┌─ {i}. {nome}")
        print(f"  │  Efeito:    {efeito}")
        print(f"  │  Bônus:     {bonus}")
        if descricao:
            print(f"  │  Descrição: {descricao}")
        print("  └" + "─" * 56)
    print()


# ═══════════════════════════════════════════════════
#  Detalhes: Elixires
# ═══════════════════════════════════════════════════

def exibir_elixires_detalhado(db, npc: Dict):
    """Lista elixires do NPC com efeito, descrição, matéria-prima e bônus."""
    nome_npc = npc.get("nome", "")
    elixires = list(db.elixir_NPC.find({"personagem_dono": nome_npc}))

    _titulo("ELIXIRES", "─")
    if not elixires:
        print("  Nenhum elixir carregado.")
        print()
        return

    for i, el in enumerate(elixires, 1):
        nome = el.get("nome", "?")
        efeito = el.get("efeito", "?")
        descricao = el.get("descricao", "")
        materia = el.get("materia_prima", "?")
        bonus = el.get("bonus_materia_prima", "?")

        print(f"\n  ┌─ {i}. {nome}")
        print(f"  │  Efeito:         {efeito}")
        print(f"  │  Matéria-prima:  {materia}")
        print(f"  │  Bônus (potência): {bonus}")
        if descricao:
            print(f"  │  Descrição:      {descricao}")
        print("  └" + "─" * 56)
    print()


# ═══════════════════════════════════════════════════
#  Menu de detalhes (submenu)
# ═══════════════════════════════════════════════════

def menu_detalhes(db, npc: Dict) -> bool:
    """Retorna True para continuar no mesmo NPC, False para voltar à lista."""
    opcoes = [
        "Ver equipamentos (detalhes)",
        "Ver moedas / tesouro",
        "Ver runas (por nível e essência)",
        "Ver elixires (detalhes)",
        "Voltar à lista de NPCs",
        "Sair",
    ]
    while True:
        print("\n  O que deseja visualizar?")
        for i, op in enumerate(opcoes, 1):
            print(f"    [{i}] {op}")
        escolha = input("\n  Escolha (1-6): ").strip()
        if escolha == "0":
            return True
        try:
            idx = int(escolha) - 1
            if idx < 0 or idx >= len(opcoes):
                print("  Opção inválida.")
                continue
        except ValueError:
            print("  Opção inválida.")
            continue

        if idx == 0:
            exibir_equipamentos_detalhado(db, npc)
        elif idx == 1:
            exibir_moedas_detalhado(npc)
        elif idx == 2:
            exibir_runas_menu(db, npc)
        elif idx == 3:
            exibir_elixires_detalhado(db, npc)
        elif idx == 4:
            return False  # Voltar à lista
        else:
            # Sair
            print("\n  Até logo.\n")
            sys.exit(0)
    return True


# ═══════════════════════════════════════════════════
#  Main
# ═══════════════════════════════════════════════════

def main():
    db = conectar()

    print()
    print("  ═════════════════════════════════════════════")
    print("         VISUALIZADOR DE NPCs")
    print("  ═════════════════════════════════════════════")
    print("  Selecione um NPC pelo número para ver a ficha e explorar detalhes.")
    print()

    while True:
        npcs = listar_npcs(db)
        exibir_lista_npcs(npcs)
        if not npcs:
            break

        npc = prompt_escolher_npc(npcs)
        if npc is None:
            break

        exibir_resumo_npc(npc)
        while True:
            if not menu_detalhes(db, npc):
                break
            # Continua no mesmo NPC para ver outra seção

    print("\n  Até logo.\n")


if __name__ == "__main__":
    main()
