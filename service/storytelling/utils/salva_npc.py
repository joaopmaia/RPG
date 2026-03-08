import pymongo

def salva_npc(db, npc):
    '''Salva um objeto na tabela NPC.'''
    db.NPC.insert_one(npc)
