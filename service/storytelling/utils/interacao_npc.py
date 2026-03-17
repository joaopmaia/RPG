import os
import re
import random
from pymongo import MongoClient

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DATABASE = "rpg"
ATRIBUTOS = [
    "Força",
    "Destreza",
    "Vitalidade",
    "Inteligência",
    "Carisma",
    "Espírito",
    "Percepção",
]

_client = None
def conectar():
    global _client
    try:
        if _client is not None:
            return _client[DATABASE]
        _client = MongoClient(MONGO_URI)
        return _client[DATABASE]
    except Exception as e:
        print(f"Erro ao conectar ao banco: {e}")
        return None

def rolar_bonus(bonus_str):
    """
    Rola um bônus no formato 'XdY+Z' ou 'XdY-Z'.
    Exemplo: '1d8+2' retorna um valor entre 3 e 10.
    """
    if not bonus_str or not isinstance(bonus_str, str):
        return 0
    match = re.match(r"(\d+)d(\d+)([+-]\d+)?", bonus_str.replace(' ', ''))
    if not match:
        try:
            return float(bonus_str)
        except Exception:
            return 0
    x = int(match.group(1))
    y = int(match.group(2))
    z = int(match.group(3) or 0)
    total = sum(random.randint(1, y) for _ in range(x)) + z
    return total

def adicionar_observacoes(nome, descricao):
    db = conectar()
    # Recupera lista atual
    npc = db.NPC.find_one({"nome": nome})
    observacoes = npc.get("observacoes", [])
    if not isinstance(observacoes, list):
        observacoes = [str(observacoes)] if observacoes else []
    observacoes.append(descricao)
    db.NPC.update_one({"nome": nome}, {"$set": {"observacoes": observacoes}})

def receber_dano(nome, dano):
    db = conectar()
    npc = db.NPC.find_one({"nome": nome})
    # Busca armaduras válidas
    armaduras = list(db.equipamentos_NPC.find({"personagem_dono": nome, "tipo": "Armadura"}))
    total_dano = dano
    armadura = None
    for a in armaduras:
        if float(a.get("durabilidade", 0)) > 0:
            armadura = a
            break
    if not armadura:
        print("Armadura quebrada!")
    else:
        bonus = float(armadura.get("bônus", 0))
        total_dano = max(0, dano - bonus)
        nova_dur = float(armadura.get("durabilidade", 0)) - (dano / 2)
        db.equipamentos_NPC.update_one({"_id": armadura["_id"]}, {"$set": {"durabilidade": nova_dur}})
    hp_atual = float(npc.get("hp_atual", npc.get("hp_total", 0)))
    hp_atual_pos_dano = hp_atual - total_dano
    db.NPC.update_one({"nome": nome}, {"$set": {"hp_atual": max(0, hp_atual_pos_dano)}})
    print(f"NPC {nome} recebeu dano de {total_dano} (Dano original: {dano}, Armadura: {bonus if armadura else 'Nenhuma'}),HP anterior: {max(0, hp_atual)}, HP atual: {max(0, hp_atual_pos_dano)}")

def rolar_esquiva(nome):
    db = conectar()
    npc = db.NPC.find_one({"nome": nome})
    destreza = int(npc.get("destreza", 0))
    pericia = int(npc.get("pericia", 0))
    total = destreza + pericia
    roll = random.randint(1, 10)
    total += roll
    if roll == 1:
        total -= random.randint(1, 10)
    elif roll == 10:
        total += random.randint(1, 10)
    return total

def rolar_prontidao(nome):
    db = conectar()
    npc = db.NPC.find_one({"nome": nome})
    percepcao = int(npc.get("percepcao", 0))
    pericia = int(npc.get("pericia", 0))
    total = percepcao + pericia
    roll = random.randint(1, 10)
    total += roll
    if roll == 1:
        total -= random.randint(1, 10)
    elif roll == 10:
        total += random.randint(1, 10)
    return total

def rolar_atributo(nome):
    db = conectar()
    npc = db.NPC.find_one({"nome": nome})
    print("=====================================================")
    for idx, atr in enumerate(ATRIBUTOS, 1):
        print(f"[{idx}] {atr}")
    print("=====================================================")
    escolha = input("Escolha o atributo para rolagem: ")
    try:
        idx = int(escolha) - 1
        if idx not in range(len(ATRIBUTOS)):
            idx = 0
    except Exception:
        idx = 0
    atributo_nome = ATRIBUTOS[idx]
    depara_atributos = {
    "Força": "forca",
    "Destreza": "destreza",
    "Vitalidade": "vitalidade",
    "Inteligência": "inteligencia",
    "Carisma": "carisma",
    "Espírito": "espirito",
    "Percepção": "percepcao",
    }
    campo_banco = depara_atributos[atributo_nome]
    valor = int(npc.get(campo_banco, 0))
    pericia = int(npc.get("pericia", 0))
    roll = random.randint(1, 10)
    total = valor + pericia + roll
    if roll == 1:
        total -= random.randint(1, 10)
    elif roll == 10:
        total += random.randint(1, 10)
    return {"total": total, "atributo": atributo_nome}

def usar_arcana(nome):
    db = conectar()
    npc = db.NPC.find_one({"nome": nome})
    print("============================================================")
    print("Runas disponíveis:\n\n")
    exibir_runas_npc(nome)
    print("\nQual tier de Runa deseja utilizar?")
    tiers = ["Básica", "Intermediária", "Avançada"]
    for i, tier in enumerate(tiers, 1):
        print(f"[{i}] {tier}")
    escolha_tier = input("Escolha o número do tier: ")
    try:
        idx_tier = int(escolha_tier) - 1
        tier_escolhido = tiers[idx_tier]
    except Exception:
        tier_escolhido = "Básica"
    if tier_escolhido == "Básica":
        gasto_arcana = 3
    elif tier_escolhido == "Intermediária":
        gasto_arcana = 6
    elif tier_escolhido == "Avançada":
        gasto_arcana = 9
    else:
        gasto_arcana = 3
    arcana_atual = int(npc.get("arcana_atual", 0))
    if arcana_atual >= gasto_arcana:
        novo_arcana = arcana_atual - gasto_arcana
        db.NPC.update_one({"nome": nome}, {"$set": {"arcana_atual": novo_arcana}})
        print(f"NPC {nome} usou uma Runa {tier_escolhido} gastando {gasto_arcana} de arcana. Arcana restante: {novo_arcana}")
    else:
        print(f"NPC {nome} não tem arcana suficiente para gastar {gasto_arcana}. arcana_atual: {arcana_atual}")

def recuperar_arcana(nome, arcana_recebido):
    db = conectar()
    npc = db.NPC.find_one({"nome": nome})
    arcana_atual = int(npc.get("arcana_atual", 0))
    novo_arcana = arcana_atual + arcana_recebido
    db.NPC.update_one({"nome": nome}, {"$set": {"arcana_atual": novo_arcana}})

def recuperar_HP(nome, cura):
    db = conectar()
    npc = db.NPC.find_one({"nome": nome})
    hp_atual = int(npc.get("hp_atual", 0))
    hp_total = int(npc.get("hp_total", 0))
    novo_hp = min(hp_atual + cura, hp_total)
    db.NPC.update_one({"nome": nome}, {"$set": {"hp_atual": novo_hp}})

def atacar(nome):
    db = conectar()
    npc = db.NPC.find_one({"nome": nome})
    armas = list(db.equipamentos_NPC.find({
        "personagem_dono": nome,
        "tipo": {"$in": ["ranged", "melee", "arcane"]}
    }))
    # Filtra armas com durabilidade numérica maior que 0
    armas = [arma for arma in armas if float(arma.get("durabilidade", 0)) > 0]
    total = 0
    if len(armas) == 0:
        destreza = int(npc.get("destreza", 0))
        pericia = int(npc.get("pericia", 0))
        total = destreza + pericia
        roll = random.randint(1, 10)
        total += roll
        if roll == 1:
            total -= random.randint(1, 10)
        elif roll == 10:
            total += random.randint(1, 10)
        return {"total": total, "arma": "Sem Armas"}
    elif len(armas) == 1:
        arma = armas[0]
        peso = arma.get("peso", "")
        if peso.lower() == "pesado":
            total += int(npc.get("forca", 0))
        else:
            total += int(npc.get("destreza", 0))
        total += int(npc.get("pericia", 0))
        roll = random.randint(1, 10)
        total += roll
        return {"total": total, "arma": arma.get("nome", "Desconhecida")}
    elif len(armas) == 2:
        print("Escolha a arma para atacar:")
        for idx, arma in enumerate(armas, 1):
            print(f"[{idx}] {arma.get('nome', 'Desconhecida')} (Tipo: {arma.get('tipo', '?')}, Peso: {arma.get('peso', '?')}, Dano: {arma.get('bônus', '?')}, Durabilidade: {arma.get('durabilidade', '?')})")
        escolha = input("Digite o número da arma: ")
        try:
            idx = int(escolha) - 1
            if idx not in [0, 1]:
                idx = 0
        except Exception:
            idx = 0
        arma = armas[idx]
        peso = arma.get("peso", "")
        if peso.lower() == "pesado":
            total += int(npc.get("forca", 0))
        else:
            total += int(npc.get("destreza", 0))
        total += int(npc.get("pericia", 0))
        roll = random.randint(1, 10)
        total += roll
        return {"total": total, "arma": arma.get("nome", "Desconhecida")}
    else:
        destreza = int(npc.get("destreza", 0))
        pericia = int(npc.get("pericia", 0))
        total = destreza + pericia
        roll = random.randint(1, 10)
        total += roll
        if roll == 1:
            total -= random.randint(1, 10)
        elif roll == 10:
            total += random.randint(1, 10)
        return {"total": total, "arma": "Desconhecida"} 

defender_prompt = lambda: int(input("valor de ataque: "))

def defender(nome, rolagem, dano):
    db = conectar()
    npc = db.NPC.find_one({"nome": nome})
    escudo = db.equipamentos_NPC.find_one({"personagem_dono": nome, "tipo": "Escudo"})
    if not escudo:
        print("Personagem não tem um escudo")
        print(f"Personagem {nome} recebeu dano total de {dano} e ficou com HP atual de {max(0, int(npc.get('hp_atual', 0)) - dano)}")
        receber_dano(nome, dano)
        return
    durabilidade = float(escudo.get("durabilidade", 0))
    if durabilidade < 1:
        print("Escudo quebrado!")
        print(f"Personagem {nome} recebeu dano total de {dano} e ficou com HP atual de {max(0, int(npc.get('hp_atual', 0)) - dano)}")
        receber_dano(nome, dano)
        return
    total_defesa = 0
    peso = escudo.get("peso", "")
    if peso.lower() == "pesado":
        total_defesa += int(npc.get("forca", 0))
    else:
        total_defesa += int(npc.get("destreza", 0))
    total_defesa += int(npc.get("pericia", 0))
    
    bonus = rolar_bonus(escudo.get("bônus", "0"))
    bonus_mat = float(escudo.get("bonus_material", 0))
    total_defesa += bonus + bonus_mat
    roll = random.randint(1, 10)
    total_defesa += roll
    if roll == 1:
        total_defesa -= random.randint(1, 10)
    elif roll == 10:
        total_defesa += random.randint(1, 10)
    defesa_sucesso = rolagem < total_defesa
    if defesa_sucesso:
        dano_escudo = int(-(-dano // 2))  # arredonda para cima
        nova_dur = durabilidade - dano_escudo
        db.equipamentos_NPC.update_one({"_id": escudo["_id"]}, {"$set": {"durabilidade": nova_dur}})
        print(f"Personagem {nome} defendeu com escudo {escudo.get('nome', 'Desconhecido')} com uma rolagem de {total_defesa}, durabilidade do escudo {nova_dur}")
    else:
        print(f"Defesa sem sucesso com rolagem = {total_defesa}")
        print(f"Personagem {nome} recebeu dano total de {dano} e ficou com HP atual de {max(0, int(npc.get('hp_atual', 0)) - dano)}")
        receber_dano(nome, dano)
        return

def aparar(nome,rolagem, dano):
    db = conectar()
    npc = db.NPC.find_one({"nome": nome})
    armas = list(db.equipamentos_NPC.find({
        "personagem_dono": nome,
        "tipo": {"$in": ["ranged", "melee", "arcane"]}
    }))
    armas = [arma for arma in armas if float(arma.get("durabilidade", 0)) > 0]
    total = 0
    if len(armas) == 0:
        destreza = int(npc.get("destreza", 0))
        pericia = int(npc.get("pericia", 0))
        total = destreza + pericia
        roll = random.randint(1, 10)
        total += roll
        if roll == 1:
            total -= random.randint(1, 10)
        elif roll == 10:
            total += random.randint(1, 10)
        print(f"Personagem {nome} tentou aparar sem armas e recebeu dano total de {dano}, HP atual: {max(0, int(npc.get('hp_atual', 0)) - dano)}")
        receber_dano(nome, dano)
        return {"total": total, "arma": "Sem Armas"}
    elif len(armas) == 1:
        arma = armas[0]
        peso = arma.get("peso", "")
        if peso.lower() == "pesado":
            total += int(npc.get("forca", 0))
        else:
            total += int(npc.get("destreza", 0))
        total += int(npc.get("pericia", 0))
        bonus = rolar_bonus(arma.get("bônus", "0"))
        bonus_mat = float(arma.get("bonus_material", 0))
        total += bonus + bonus_mat
        roll = random.randint(1, 10)
        total += roll
        if roll == 1:
            total -= random.randint(1, 10)
        elif roll == 10:
            total += random.randint(1, 10)
        defesa_sucesso = rolagem < total
        if defesa_sucesso:
            nova_dur = float(arma.get("durabilidade", 0)) - dano
            db.equipamentos_NPC.update_one({"_id": arma["_id"]}, {"$set": {"durabilidade": nova_dur}})
            print(f"Personagem {nome} aparou com arma {arma.get('nome', 'Desconhecida')} com uma rolagem de {total}, durabilidade da arma {nova_dur}")
        else:
            print(f"Aparo sem sucesso com rolagem = {total}")
            print(f"Personagem {nome} recebeu dano total de {dano}, HP atual: {max(0, int(npc.get('hp_atual', 0)) - dano)}")
            receber_dano(nome, dano)
        return {"total": total, "arma": arma.get("nome", "Desconhecida")}
    elif len(armas) == 2:
        print("Escolha a arma para aparar:")
        for idx, arma in enumerate(armas, 1):
            print(f"[{idx}] {arma.get('nome', 'Desconhecida')} (Tipo: {arma.get('tipo', '?')}, Peso: {arma.get('peso', '?')}, Dano: {arma.get('bônus', '?')}, Durabilidade: {arma.get('durabilidade', '?')})")
        escolha = input("Digite o número da arma: ")
        try:
            idx = int(escolha) - 1
            if idx not in [0, 1]:
                idx = 0
        except Exception:
            idx = 0
        arma = armas[idx]
        peso = arma.get("peso", "")
        if peso.lower() == "pesado":
            total += int(npc.get("forca", 0))
        else:
            total += int(npc.get("destreza", 0))
        total += int(npc.get("pericia", 0))
        bonus = rolar_bonus(arma.get("bônus", "0"))
        bonus_mat = float(arma.get("bonus_material", 0))
        total += bonus + bonus_mat
        roll = random.randint(1, 10)
        total += roll
        if roll == 1:
            total -= random.randint(1, 10)
        elif roll == 10:
            total += random.randint(1, 10)
        defesa_sucesso = rolagem < total
        if defesa_sucesso:
            nova_dur = float(arma.get("durabilidade", 0)) - dano
            db.equipamentos_NPC.update_one({"_id": arma["_id"]}, {"$set": {"durabilidade": nova_dur}})
            print(f"Personagem {nome} aparou com arma {arma.get('nome', 'Desconhecida')} com uma rolagem de {total}, durabilidade da arma {nova_dur}")
        else:
            print(f"Aparo sem sucesso com rolagem = {total}")
            print(f"Personagem {nome} recebeu dano total de {dano}, HP atual: {max(0, int(npc.get('hp_atual', 0)) - dano)}")
            receber_dano(nome, dano)
        return {"total": total, "arma": arma.get("nome", "Desconhecida")}
    else:
        destreza = int(npc.get("destreza", 0))
        pericia = int(npc.get("pericia", 0))
        total = destreza + pericia
        roll = random.randint(1, 10)
        total += roll
        if roll == 1:
            total -= random.randint(1, 10)
        elif roll == 10:
            total += random.randint(1, 10)
        print(f"Personagem {nome} tentou aparar com armas desconhecidas e recebeu dano total de {dano}, HP atual: {max(0, int(npc.get('hp_atual', 0)) - dano)}")
        receber_dano(nome, dano)
        return {"total": total, "arma": "Desconhecida"}

def exibir_runas_npc(nome):
    db = conectar()
    npc = db.NPC.find_one({"nome": nome})
    if not npc:
        print("NPC não encontrado.")
        return
    elementos = npc.get("runas", [])
    print(elementos)
    # Importa a função buscar_e_exibir
    import importlib.util
    import os
    busca_elemento_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../runas/busca_elemento.py'))
    spec = importlib.util.spec_from_file_location("busca_elemento", busca_elemento_path)
    busca_elemento = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(busca_elemento)
    busca_elemento.buscar_e_exibir(db, elementos)
