"""
Busca runas por combinação de elementos.

Permite selecionar de 1 a 3 elementos e exibe:
  - Runas Básicas de cada elemento selecionado
  - Runas Intermediárias da combinação de 2 elementos (se houver)
  - Runas Superiores da combinação de 3 elementos (se houver)

Uso:
    python busca_elemento.py
"""

import os
import sys
from itertools import combinations

from pymongo import MongoClient

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DATABASE = "rpg"
COLLECTION = "runas"

ELEMENTOS = ["Arunalt", "Degila", "Genia", "Pascalia", "Reetear", "Saltrat"]


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


def selecionar_elementos():
    """Permite selecionar de 1 a 3 elementos interativamente."""
    print()
    for i, elem in enumerate(ELEMENTOS, start=1):
        print(f"  [{i}] {elem}")
    print(f"  [-1] Cancelar")

    selecionados = []  # type: list
    while len(selecionados) < 3:
        restantes = 3 - len(selecionados)
        if selecionados:
            print(f"\n  Selecionados: {', '.join(selecionados)}")
            prompt = f"Selecione mais um elemento ({restantes} restante{'s' if restantes > 1 else ''}) ou 0 para confirmar: "
        else:
            prompt = "Selecione o 1º elemento: "

        escolha = input(f"\n{prompt}").strip()

        if escolha == "-1":
            return None

        if escolha == "0" and selecionados:
            break

        try:
            idx = int(escolha) - 1
            if 0 <= idx < len(ELEMENTOS):
                elem = ELEMENTOS[idx]
                if elem in selecionados:
                    print(f"  '{elem}' já foi selecionado.")
                else:
                    selecionados.append(elem)
            else:
                print("Opção inválida. Tente novamente.")
        except ValueError:
            print("Opção inválida. Tente novamente.")

    return selecionados


def exibir_runa(runa, indent="    "):
    """Exibe os detalhes de uma runa."""
    print(f"{indent}{runa['nome']}")
    print(f"{indent}  Efeito:    {runa.get('efeito', '?')}")
    print(f"{indent}  Bônus:     {runa.get('bonus', '?')}")
    if runa.get("descricao"):
        print(f"{indent}  Descrição: {runa['descricao']}")


def buscar_e_exibir(db, elementos):
    """Busca e exibe runas para a combinação de elementos."""
    colecao = db[COLLECTION]
    encontrou = False

    # ── Runas Básicas (1 elemento cada) ──
    print("\n══════════════════════════════════════════════════════")
    print("  RUNAS BÁSICAS")
    print("══════════════════════════════════════════════════════")
    for elem in elementos:
        runas = list(colecao.find(
            {"tier": "Básico", "elementos": [elem]}
        ).sort("nome", 1))
        print(f"\n  ── {elem} ({len(runas)} runa{'s' if len(runas) != 1 else ''}) ──")
        if runas:
            encontrou = True
            for r in runas:
                exibir_runa(r)
                print()
        else:
            print("    Nenhuma runa encontrada.")

    # ── Runas Intermediárias (combinações de 2 elementos) ──
    if len(elementos) >= 2:
        print("══════════════════════════════════════════════════════")
        print("  RUNAS INTERMEDIÁRIAS")
        print("══════════════════════════════════════════════════════")
        pares = list(combinations(elementos, 2))
        for par in pares:
            # Buscar em ambas as ordens pois o DB pode ter qualquer ordem
            runas = list(colecao.find({
                "tier": "Intermediário",
                "elementos": {"$all": list(par), "$size": 2}
            }).sort("nome", 1))
            label = ", ".join(par)
            print(f"\n  ── {label} ({len(runas)} runa{'s' if len(runas) != 1 else ''}) ──")
            if runas:
                encontrou = True
                for r in runas:
                    exibir_runa(r)
                    print()
            else:
                print("    Nenhuma combinação encontrada.")

    # ── Runas Superiores (combinação dos 3 elementos) ──
    if len(elementos) == 3:
        print("══════════════════════════════════════════════════════")
        print("  RUNAS SUPERIORES")
        print("══════════════════════════════════════════════════════")
        runas = list(colecao.find({
            "tier": "Superior",
            "elementos": {"$all": elementos, "$size": 3}
        }).sort("nome", 1))
        label = ", ".join(elementos)
        print(f"\n  ── {label} ({len(runas)} runa{'s' if len(runas) != 1 else ''}) ──")
        if runas:
            encontrou = True
            for r in runas:
                exibir_runa(r)
                print()
        else:
            print("    Nenhuma combinação encontrada.")

    if not encontrou:
        print("\nNenhuma runa encontrada para os elementos selecionados.")

    print("══════════════════════════════════════════════════════")


def main():
    db = conectar()

    print("══ Busca por Elementos ══")

    while True:
        elementos = selecionar_elementos()
        if elementos is None:
            print("\nBusca encerrada.")
            break

        if not elementos:
            print("Nenhum elemento selecionado.")
            continue

        print(f"\n→ Elementos selecionados: {', '.join(elementos)}")
        buscar_e_exibir(db, elementos)

        continuar = input("\nDeseja buscar outra combinação? (s/n): ").strip().lower()
        if continuar != "s":
            break


if __name__ == "__main__":
    main()
