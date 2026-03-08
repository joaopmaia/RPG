import pymongo

def cria_elixir_npc(db, elixir):
    '''Salva um objeto na tabela elixir_NPC.'''
    db.elixir_NPC.insert_one(elixir)
