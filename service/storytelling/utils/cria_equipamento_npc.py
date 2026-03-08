import pymongo

def cria_equipamento_npc(db, equipamento):
    '''Salva um objeto na tabela equipamentos_NPC.'''
    db.equipamentos_NPC.insert_one(equipamento)
