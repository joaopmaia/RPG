import os
import random
import sys
from pymongo import MongoClient
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../utils')))
import importlib.util
spec = importlib.util.spec_from_file_location("interacao_npc", os.path.abspath(os.path.join(os.path.dirname(__file__), "utils/interacao_npc.py")))
interacao_npc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(interacao_npc)
adicionar_observacoes = interacao_npc.adicionar_observacoes
receber_dano = interacao_npc.receber_dano
rolar_esquiva = interacao_npc.rolar_esquiva
rolar_prontidao = interacao_npc.rolar_prontidao
usar_arcana = interacao_npc.usar_arcana
recuperar_arcana = interacao_npc.recuperar_arcana
recuperar_HP = interacao_npc.recuperar_HP
atacar = interacao_npc.atacar
defender = interacao_npc.defender
aparar = interacao_npc.aparar
rolar_atributo = interacao_npc.rolar_atributo

MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"
LOG_FILE = "interacao_npc.log"

def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]

def log_acao(acao):
    with open(LOG_FILE, "a") as f:
        f.write(acao + "\n")

def busca_npc():
    try:
        import busca_npc
        return busca_npc.main()
    except Exception as e:
        print("[ERRO] Falha ao chamar busca_npc.main():")
        print(f"    {e}")
        return None
def imprimir_npc(npc):
    try:
        import busca_npc
        return busca_npc.exibir_npc_completo(npc)
    except Exception as e:
        print("[ERRO] Falha ao chamar busca_npc.exibir_npc_completo():")
        print(f"    {e}")
        return None
def imprimir_loot(npc):
    try:
        import busca_npc
        return busca_npc.exibir_loot(npc)
    except Exception as e:
        print("[ERRO] Falha ao chamar busca_npc.exibir_loot():")
        print(f"    {e}")
        return None

def main():
    db = conectar()
    npc_name = ""
    npc_name = busca_npc()
    npc = db.NPC.find_one({"nome": npc_name})
    if npc and float(npc.get("hp_atual", 0)) <= 0:
        print("\n══════════════════════════════════════════════════════")
        print(f"                NPC '{npc_name}' está MORTO!")
        imprimir_loot(npc)
        print("══════════════════════════════════════════════════════\n")
        return
    funcoes = [
        ("Adicionar Observação", adicionar_observacoes),
        ("Receber Dano", receber_dano),
        ("Mostrar Loot", None),
        ("Mostrar Ficha", None),
        ("Rolagens", None),
        ("Defesas e Curas", None),
        ("Sair", None)
    ]
    personagem = npc
    while True:
        if personagem and float(personagem.get("hp_atual", 0)) <= 0:
            print("\n══════════════════════════════════════════════════════")
            print(f"                NPC '{npc_name}' está MORTO!")
            imprimir_loot(personagem)
            print("══════════════════════════════════════════════════════\n")
            return
        print("\nO que deseja fazer?")
        for i, (nome, _) in enumerate(funcoes, 1):
            print(f"{i}. {nome}")
        escolha_func = input("Escolha a ação: ")
        try:
            idx = int(escolha_func) - 1
            nome_func, func = funcoes[idx]
        except Exception:
            print("Opção inválida.")
            continue
        if nome_func == "Sair":
            print("Saindo...")
            break
        elif nome_func == "Rolagens":
            rolagens_funcoes = [
                ("Rolar Esquiva", rolar_esquiva),
                ("Rolar Prontidão", rolar_prontidao),
                ("Atacar", atacar),
                ("Rolar Atributo", rolar_atributo),
                ("Usar Arcana", usar_arcana),
                ("Voltar", None)
            ]
            while True:
                print("\nRolagens:")
                for i, (nome, _) in enumerate(rolagens_funcoes, 1):
                    print(f"{i}. {nome}")
                escolha_rolagem = input("Escolha a rolagem: ")
                try:
                    idx_rol = int(escolha_rolagem) - 1
                    nome_rol, func_rol = rolagens_funcoes[idx_rol]
                except Exception:
                    print("Opção inválida.")
                    continue
                if nome_rol == "Voltar":
                    break
                if nome_rol == "Rolar Esquiva":
                    resultado = func_rol(personagem['nome'])
                    print("\n══════════════════════════════════════════════════════")
                    print(f"                Resultado da esquiva: {resultado}")
                    print("══════════════════════════════════════════════════════")
                    log_acao(f"NPC {personagem['nome']} rolou esquiva: {resultado}")
                elif nome_rol == "Rolar Prontidão":
                    resultado = func_rol(personagem['nome'])
                    print("\n══════════════════════════════════════════════════════")
                    print(f"                Resultado da prontidão: {resultado}")
                    print("══════════════════════════════════════════════════════")
                    log_acao(f"NPC {personagem['nome']} rolou prontidão: {resultado}")
                elif nome_rol == "Atacar":
                    resultado = func_rol(personagem['nome'])
                    print("\n══════════════════════════════════════════════════════")
                    print(f"                Resultado do ataque: {resultado}")
                    print("══════════════════════════════════════════════════════")
                    log_acao(f"NPC {personagem['nome']} atacou: {resultado}")
                elif nome_rol == "Usar Arcana":
                    func_rol(personagem['nome'])
                    log_acao(f"NPC {personagem['nome']} usou arcana")
                    personagem = db.NPC.find_one({"nome": personagem['nome']})
                elif nome_rol == "Rolar Atributo":
                    resultado = func_rol(personagem['nome'])
                    print("\n══════════════════════════════════════════════════════")
                    print(f"                Resultado da rolagem de atributo: {resultado}")
                    print("══════════════════════════════════════════════════════")
        elif nome_func == "Defesas e Curas":
            defesas_funcoes = [
                ("Recuperar Arcana", recuperar_arcana),
                ("Recuperar HP", recuperar_HP),
                ("Defender", defender),
                ("Aparar", aparar),
                ("Voltar", None)
            ]
            while True:
                if npc and float(npc.get("hp_atual", 0)) <= 0:
                    print("\n══════════════════════════════════════════════════════")
                    print(f"                NPC '{npc_name}' está MORTO!")
                    imprimir_loot(npc)
                    print("══════════════════════════════════════════════════════\n")
                    return
                print("\nDefesas e Curas:")
                for i, (nome, _) in enumerate(defesas_funcoes, 1):
                    print(f"{i}. {nome}")
                escolha_defesa = input("Escolha a ação: ")
                try:
                    idx_def = int(escolha_defesa) - 1
                    nome_def, func_def = defesas_funcoes[idx_def]
                except Exception:
                    print("Opção inválida.")
                    continue
                if nome_def == "Voltar":
                    break
                if nome_def == "Recuperar Arcana":
                    recebido = int(input("Valor de arcana recebido: "))
                    func_def(personagem['nome'], recebido)
                    log_acao(f"NPC {personagem['nome']} recuperou arcana: {recebido}")
                    personagem = db.NPC.find_one({"nome": personagem['nome']})
                    imprimir_npc(personagem)
                elif nome_def == "Recuperar HP":
                    cura = int(input("Valor de cura: "))
                    func_def(personagem['nome'], cura)
                    log_acao(f"NPC {personagem['nome']} recuperou HP: {cura}")
                    personagem = db.NPC.find_one({"nome": personagem['nome']})
                    imprimir_npc(personagem)
                elif nome_def == "Defender":
                    rolagem = int(input("Rolagem de ataque: "))
                    dano = int(input("Valor de dano: "))
                    func_def(personagem['nome'], rolagem, dano)
                    log_acao(f"NPC {personagem['nome']} defendeu dano: {dano}")
                    personagem = db.NPC.find_one({"nome": personagem['nome']})
                elif nome_def == "Aparar":
                    rolagem = int(input("Rolagem de ataque: "))
                    dano = int(input("Valor de dano: "))
                    func_def(personagem['nome'], rolagem, dano)
                    log_acao(f"NPC {personagem['nome']} aparou dano: {dano}")
                    personagem = db.NPC.find_one({"nome": personagem['nome']})
        elif nome_func == "Adicionar Observação":
            observacao = input("Digite a observação: ")
            func(personagem['nome'], observacao)
            log_acao(f"Observação adicionada ao NPC {personagem['nome']}: {observacao}")
            personagem = db.NPC.find_one({"nome": personagem['nome']})
            imprimir_npc(personagem)
        elif nome_func == "Receber Dano":
            dano = int(input("Valor de dano: "))
            func(personagem['nome'], dano)
            log_acao(f"NPC {personagem['nome']} recebeu dano: {dano}")
            personagem = db.NPC.find_one({"nome": personagem['nome']})
        elif nome_func == "Recuperar HP":
            cura = int(input("Valor de cura: "))
            func(personagem['nome'], cura)
            log_acao(f"NPC {personagem['nome']} recuperou HP: {cura}")
            personagem = db.NPC.find_one({"nome": personagem['nome']})
            imprimir_npc(personagem)
        elif nome_func == "Defender":
            rolagem = int(input("Rolagem de ataque: "))
            dano = int(input("Valor de dano: "))
            func(personagem['nome'], rolagem, dano)
            log_acao(f"NPC {personagem['nome']} defendeu dano: {dano}")
            personagem = db.NPC.find_one({"nome": personagem['nome']})
        elif nome_func == "Aparar":
            rolagem = int(input("Rolagem de ataque: "))
            dano = int(input("Valor de dano: "))
            func(personagem['nome'], rolagem, dano)
            log_acao(f"NPC {personagem['nome']} aparou dano: {dano}")
            personagem = db.NPC.find_one({"nome": personagem['nome']})
        elif nome_func == "Mostrar Ficha":
            imprimir_npc(personagem)
        elif nome_func == "Mostrar Loot":
            imprimir_loot(personagem)
        
if __name__ == "__main__":
    main()
