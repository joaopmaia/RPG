"""
Calcula o preço de um item (equipamento ou elixir) considerando
o reino e o material utilizado.

Uso:
    python calcula_preco.py
"""

import json
import sys
import unicodedata

from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"

MULTIPLICADOR_MATERIAL = {
    "Comum": 1,
    "Incomum": 5,
    "Raro": 15,
    "Épico": 50,
    "Lendário": 100,
}

CUSTO_BASE_ELIXIR = {
    "Comum": 20,
    "Incomum": 100,
    "Raro": 500,
    "Épico": 2500,
    "Lendário": 10000,
}

MULTIPLICADOR_RUNA = {
    "Básico": 5,
    "Intermediário": 20,
    "Superior": 50,
}

TIPOS_MATERIAL_ELIXIR = ["vegetal", "animal", "mineral", "demoníaco"]

CAMPO_REINO = {
    "melee": "armas",
    "ranged": "armas",
    "Armadura": "armaduras",
    "Escudo": "escudos",
    "elixir": "alquimia",
}


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def remover_acentos(texto):
    nfkd = unicodedata.normalize('NFKD', texto)
    return ''.join(c for c in nfkd if not unicodedata.combining(c))


def prompt_opcao(mensagem, opcoes, permitir_voltar=False, permitir_cancelar=False):
    """Exibe opções numeradas e retorna o índice escolhido, -1 para voltar ou -2 para cancelar."""
    print()
    for i, opcao in enumerate(opcoes, start=1):
        print(f"  [{i}] {opcao}")
    if permitir_voltar:
        print(f"  [0] Voltar")
    if permitir_cancelar:
        print(f"  [-1] Cancelar")

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


def selecionar_reino(db):
    """Lista reinos e retorna o documento do reino selecionado (sem duplicatas)."""
    reinos_raw = list(db["reinos"].find().sort("nome", 1))
    if not reinos_raw:
        print("Nenhum reino cadastrado.")
        sys.exit(1)

    vistos = set()
    reinos = []
    for r in reinos_raw:
        if r["nome"] not in vistos:
            vistos.add(r["nome"])
            reinos.append(r)

    nomes = [r["nome"] for r in reinos]
    idx = prompt_opcao("Selecione o reino: ", nomes)
    print(f"\n→ Reino selecionado: {reinos[idx]['nome']}")
    return reinos[idx]


def listar_e_selecionar_equipamento(db):
    """Menu interativo para navegar e selecionar um equipamento (arma ou armadura)."""
    CATEGORIAS = [
        ("Armas (melee)", "armas", "melee"),
        ("Armas (ranged)", "armas", "ranged"),
        ("Armaduras", "armaduras", "Armadura"),
        ("Escudos", "armaduras", "Escudo"),
    ]

    while True:
        print("\n── Categorias de equipamento ──")
        idx_cat = prompt_opcao(
            "Selecione a categoria (ou 0 para voltar): ",
            [c[0] for c in CATEGORIAS],
            permitir_voltar=True,
        )
        if idx_cat == -1:
            return None

        label, colecao_nome, tipo_filtro = CATEGORIAS[idx_cat]
        itens = list(
            db[colecao_nome].find({"tipo": tipo_filtro}).sort("nome", 1)
        )

        if not itens:
            print(f"Nenhum item encontrado na categoria '{label}'.")
            continue

        print(f"\n── {label} ──")
        nomes = [item["nome"] for item in itens]
        idx_item = prompt_opcao(
            "Selecione o item (ou 0 para voltar): ",
            nomes,
            permitir_voltar=True,
        )
        if idx_item == -1:
            continue

        item = itens[idx_item]
        item.pop("_id", None)
        return item


def selecionar_equipamento(db):
    """Pede o nome ou permite listar equipamentos."""
    while True:
        entrada = input("\nDigite o nome do equipamento (ou 'listar'): ").strip()

        if not entrada:
            print("Nenhum nome informado.")
            continue

        if entrada.lower() == "listar":
            resultado = listar_e_selecionar_equipamento(db)
            if resultado is not None:
                return resultado
            continue

        entrada_norm = remover_acentos(entrada).lower()

        for col in ["armas", "armaduras"]:
            for item in db[col].find():
                if remover_acentos(item.get("nome", "")).lower() == entrada_norm:
                    item.pop("_id", None)
                    return item

        print(f"Equipamento '{entrada}' não encontrado. Tente novamente ou digite 'listar'.")


def listar_e_selecionar_elixir(db):
    """Lista elixires e retorna o selecionado."""
    itens = list(db["alquimia"].find().sort("nome", 1))
    if not itens:
        print("Nenhum elixir cadastrado.")
        return None

    print("\n── Elixires ──")
    nomes = [f"{item['nome']} ({item.get('efeito', '')})" for item in itens]
    idx = prompt_opcao(
        "Selecione o elixir (ou 0 para voltar): ",
        nomes,
        permitir_voltar=True,
    )
    if idx == -1:
        return None

    item = itens[idx]
    item.pop("_id", None)
    return item


def selecionar_elixir(db):
    """Pede o nome ou permite listar elixires."""
    while True:
        entrada = input("\nDigite o nome do elixir (ou 'listar'): ").strip()

        if not entrada:
            print("Nenhum nome informado.")
            continue

        if entrada.lower() == "listar":
            resultado = listar_e_selecionar_elixir(db)
            if resultado is not None:
                return resultado
            continue

        entrada_norm = remover_acentos(entrada).lower()

        for elixir in db["alquimia"].find():
            if remover_acentos(elixir.get("nome", "")).lower() == entrada_norm:
                elixir.pop("_id", None)
                return elixir

        print(f"Elixir '{entrada}' não encontrado. Tente novamente ou digite 'listar'.")


def selecionar_material_equipamento(db):
    """Seleciona um material da tabela de materiais para equipamentos."""
    TIPOS = ["vegetal", "animal", "mineral", "demon"]

    while True:
        print("\n── Tipo de material ──")
        idx_tipo = prompt_opcao(
            "Selecione o tipo de material (ou 0 para voltar): ",
            TIPOS,
            permitir_voltar=True,
        )
        if idx_tipo == -1:
            continue

        tipo = TIPOS[idx_tipo]
        materiais = list(db["materiais"].find({"tipo": tipo}).sort("material", 1))

        if not materiais:
            print(f"Nenhum material do tipo '{tipo}' cadastrado.")
            continue

        nomes = [f"{m['material']} (Rank {m.get('rank', '?')} | {m.get('raridade', '?')})" for m in materiais]
        idx_mat = prompt_opcao(
            "Selecione o material (ou 0 para voltar): ",
            nomes,
            permitir_voltar=True,
        )
        if idx_mat == -1:
            continue

        mat = materiais[idx_mat]
        mat.pop("_id", None)
        return mat


def selecionar_material_elixir():
    """Seleciona o tipo de material para elixir (vegetal, animal, mineral, demoníaco)."""
    idx = prompt_opcao("Selecione o tipo de material: ", TIPOS_MATERIAL_ELIXIR)
    return TIPOS_MATERIAL_ELIXIR[idx]


def perguntar_runa():
    """Pergunta se o equipamento possui runa e retorna (tier, multiplicador) ou (None, 1)."""
    idx = prompt_opcao("O equipamento possui uma runa? ", ["Não", "Sim"])
    if idx == 0:
        return None, 1

    TIERS = ["Básico", "Intermediário", "Superior"]
    idx_tier = prompt_opcao("Qual o tier da runa? ", TIERS)
    tier = TIERS[idx_tier]
    mult = MULTIPLICADOR_RUNA[tier]
    return tier, mult


def calcular_preco_equipamento(item, reino, material, runa_tier, mult_runa):
    """Calcula preço: preco_base * (1 + mod_reino) * mult_material * mult_runa"""
    preco_base = float(item.get("preco", 0))
    tipo_item = item.get("tipo", "")
    campo = CAMPO_REINO.get(tipo_item, "armas")
    mod_reino = float(reino.get(campo, "0"))

    raridade = material.get("raridade", "Comum")
    mult_material = MULTIPLICADOR_MATERIAL.get(raridade, 1)

    preco_final = preco_base * (1 + mod_reino) * mult_material * mult_runa

    print("\n══════════════════════════════════════")
    print("         CÁLCULO DE PREÇO")
    print("══════════════════════════════════════")
    print(f"  Item:       {item['nome']}")
    print(f"  Tipo:       {tipo_item}")
    print(f"  Preço base: {preco_base}")
    print(f"  Reino:      {reino['nome']} ({campo}: {mod_reino:+.0%})")
    print(f"  Material:   {material['material']} ({raridade} → x{mult_material})")
    if runa_tier:
        print(f"  Runa:       {runa_tier} (x{mult_runa})")
    else:
        print(f"  Runa:       Nenhuma")
    print("──────────────────────────────────────")
    print(f"  Preço final: {preco_final:.1f} moedas")
    print("══════════════════════════════════════")


def calcular_preco_elixir(elixir, reino, tipo_material):
    """Calcula preço: custo_base_raridade * (1 + mod_reino_alquimia)"""
    campo_rar = f"{tipo_material}_rar"
    raridade = elixir.get(campo_rar, "-")

    if raridade == "-":
        print(f"\nEsse elixir não pode ser feito com material {tipo_material}.")
        return

    custo_base = CUSTO_BASE_ELIXIR.get(raridade, 0)
    mod_reino = float(reino.get("alquimia", "0"))
    preco_final = custo_base * (1 + mod_reino)

    campo_pot = f"{tipo_material}_pot"
    potencia = elixir.get(campo_pot, "-")

    print("\n══════════════════════════════════════")
    print("         CÁLCULO DE PREÇO")
    print("══════════════════════════════════════")
    print(f"  Elixir:     {elixir['nome']} ({elixir.get('efeito', '')})")
    print(f"  Material:   {tipo_material} ({raridade})")
    print(f"  Potência:   {potencia}")
    print(f"  Custo base: {custo_base} moedas")
    print(f"  Reino:      {reino['nome']} (alquimia: {mod_reino:+.0%})")
    print("──────────────────────────────────────")
    print(f"  Preço final: {preco_final:.1f} moedas")
    print("══════════════════════════════════════")


def main():
    db = conectar()

    # 1. Tipo de item
    print("── Calculadora de Preços ──")
    idx_tipo = prompt_opcao("O item é: ", ["Equipamento (arma/armadura)", "Elixir"], permitir_cancelar=True)
    if idx_tipo == -2:
        print("\nOperação cancelada.")
        return
    eh_elixir = idx_tipo == 1

    # 2. Selecionar reino
    print("\n── Selecione o reino ──")
    reino = selecionar_reino(db)

    if eh_elixir:
        # 3. Selecionar elixir
        elixir = selecionar_elixir(db)

        # 4. Selecionar tipo de material
        print("\n── Tipo de material do elixir ──")
        tipo_material = selecionar_material_elixir()

        # 5. Calcular
        calcular_preco_elixir(elixir, reino, tipo_material)
    else:
        # 3. Selecionar equipamento
        item = selecionar_equipamento(db)
        print(f"\n→ Item selecionado: {item['nome']} (preço base: {item.get('preco', '?')})")

        # 4. Selecionar material
        print("\n── Selecione o material ──")
        material = selecionar_material_equipamento(db)
        print(f"\n→ Material selecionado: {material['material']} ({material.get('raridade', '?')})")

        # 5. Runa
        print("\n── Runa ──")
        runa_tier, mult_runa = perguntar_runa()
        if runa_tier:
            print(f"\n→ Runa: {runa_tier} (x{mult_runa})")

        # 6. Calcular
        calcular_preco_equipamento(item, reino, material, runa_tier, mult_runa)


if __name__ == "__main__":
    main()
