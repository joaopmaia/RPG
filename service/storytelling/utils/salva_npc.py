import pymongo


def salva_npc(db, npc):
    '''Salva um objeto na tabela NPC.'''
    db.NPC.insert_one(npc)

def salva_demon_npc(db, demon_npc):
    '''Salva um objeto na tabela demon_NPC.'''
    db.demon_NPC.insert_one(demon_npc)

def salva_fera_npc(db, fera_npc):
    '''Salva um objeto na tabela fera_NPC.'''
    db.fera_NPC.insert_one(fera_npc)
