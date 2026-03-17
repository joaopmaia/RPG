"""
Busca runas no banco de dados MongoDB por tier e elemento.

Uso:
    python buscar_runa.py
    Selecione o tier, depois o elemento e por fim a runa desejada.
"""

import json
import os
import sys

from pymongo import MongoClient

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DATABASE = "rpg"
COLLECTION = "runas"


def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]


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


def main():
    db = conectar()
    colecao = db[COLLECTION]

    # 1. Listar tiers disponíveis
    while True:
        tiers = colecao.distinct("tier")
        if not tiers:
            print("Nenhuma runa cadastrada.")
            sys.exit(1)

        ordem_tier = {"Básico": 0, "Intermediário": 1, "Superior": 2}
        tiers.sort(key=lambda t: ordem_tier.get(t, 99))

        print("\n── Buscar Runa ──")
        idx_tier = prompt_opcao("Selecione o tier: ", tiers, permitir_cancelar=True)
        if idx_tier == -2:
            print("\nBusca encerrada.")
            break
        tier_selecionado = tiers[idx_tier]

        # 2. Listar elementos / combinações disponíveis para o tier
        while True:
            if tier_selecionado == "Básico":
                # Tier básico: listar elementos individuais
                pipeline = [
                    {"$match": {"tier": tier_selecionado}},
                    {"$unwind": "$elementos"},
                    {"$group": {"_id": "$elementos"}},
                    {"$sort": {"_id": 1}},
                ]
                elementos = [doc["_id"] for doc in colecao.aggregate(pipeline)]
                if not elementos:
                    print(f"Nenhum elemento encontrado para o tier '{tier_selecionado}'.")
                    break

                print(f"\n── Elementos ({tier_selecionado}) ──")
                idx_elem = prompt_opcao(
                    "Selecione o elemento: ",
                    elementos,
                    permitir_voltar=True,
                )
                if idx_elem == -1:
                    break

                filtro = {"tier": tier_selecionado, "elementos": elementos[idx_elem]}
                label_sel = elementos[idx_elem]
            else:
                # Intermediário / Superior: listar combinações de elementos
                pipeline = [
                    {"$match": {"tier": tier_selecionado}},
                    {"$group": {"_id": "$elementos"}},
                    {"$sort": {"_id": 1}},
                ]
                combos_raw = [doc["_id"] for doc in colecao.aggregate(pipeline)]
                # Ordenar por representação textual
                combos_raw.sort(key=lambda c: ", ".join(c))
                if not combos_raw:
                    print(f"Nenhuma combinação encontrada para o tier '{tier_selecionado}'.")
                    break

                labels = [", ".join(c) for c in combos_raw]
                print(f"\n── Combinações de Elementos ({tier_selecionado}) ──")
                idx_combo = prompt_opcao(
                    "Selecione a combinação: ",
                    labels,
                    permitir_voltar=True,
                )
                if idx_combo == -1:
                    break

                filtro = {"tier": tier_selecionado, "elementos": combos_raw[idx_combo]}
                label_sel = labels[idx_combo]

            # 3. Listar runas com o filtro selecionado
            while True:
                runas = list(
                    colecao.find(filtro).sort("nome", 1)
                )

                if not runas:
                    print(f"Nenhuma runa encontrada para {tier_selecionado} / {label_sel}.")
                    break

                print(f"\n── Runas ({tier_selecionado} | {label_sel}) ──")
                nomes = []
                for r in runas:
                    elems = ", ".join(r.get("elementos", []))
                    nomes.append(f"{r['nome']} [{elems}]")

                idx_runa = prompt_opcao(
                    "Selecione a runa para ver detalhes: ",
                    nomes,
                    permitir_voltar=True,
                )
                if idx_runa == -1:
                    break

                runa = runas[idx_runa]
                runa.pop("_id", None)

                print("\n══════════════════════════════════════")
                print(f"  Nome:      {runa['nome']}")
                print(f"  Tier:      {runa['tier']}")
                print(f"  Elementos: {', '.join(runa['elementos'])}")
                print(f"  Efeito:    {runa['efeito']}")
                print(f"  Bônus:     {runa['bonus']}")
                print("──────────────────────────────────────")
                print(f"  {runa['descricao']}")
                print("══════════════════════════════════════")


if __name__ == "__main__":
    main()
