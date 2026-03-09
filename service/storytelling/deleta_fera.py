import sys
from pymongo import MongoClient
from bson.objectid import ObjectId

# Configurações do Banco
MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"

def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]

def listar_resumo_feras():
    db = conectar()
    # Busca apenas o necessário para a listagem (Nome e Tipo)
    return list(db.fera_NPC.find({}, {"nome": 1, "tipo": 1, "nível": 1}).sort("nome", 1))

def deletar_fera(id_fera, nome_fera):
    db = conectar()
    
    print(f"\n[⚠️] ATENÇÃO: Você tem certeza que deseja deletar '{nome_fera}'?")
    confirmacao = input("Digite 'sim' para confirmar ou qualquer outra tecla para cancelar: ").strip().lower()
    
    if confirmacao == 'sim':
        resultado = db.fera_NPC.delete_one({"_id": ObjectId(id_fera)})
        if resultado.deleted_count > 0:
            print(f"\n[✅] Fera '{nome_fera}' removida com sucesso do banco de dados.")
        else:
            print("\n[❌] Erro: Não foi possível encontrar a fera para deletar.")
    else:
        print("\n[─] Operação cancelada.")

def menu_delecao():
    while True:
        feras = listar_resumo_feras()
        
        if not feras:
            print("\n[!] O banco de dados está vazio.")
            break

        print("\n" + "═"*54)
        print(f"{'GERENCIADOR DE EXCLUSÃO DE FERAS':^54}")
        print("═"*54)
        
        for i, fera in enumerate(feras, 1):
            tier = fera.get('nível', '???').capitalize()
            tipo = fera.get('tipo', '???')
            print(f"  {i:>2}. {fera['nome']:<20} | {tipo:<10} | {tier}")

        print(f"  {0:>2}. Sair")
        print("─" * 54)

        try:
            escolha = int(input("\nDigite o número da fera que deseja DELETAR: "))
            
            if escolha == 0:
                print("Saindo do gerenciador.")
                break
                
            if 1 <= escolha <= len(feras):
                fera_alvo = feras[escolha - 1]
                deletar_fera(fera_alvo["_id"], fera_alvo["nome"])
                input("\nPressione Enter para continuar...")
            else:
                print(f"Número inválido. Escolha entre 1 e {len(feras)}.")
                
        except ValueError:
            print("Por favor, digite um número válido.")
        except Exception as e:
            print(f"Ocorreu um erro: {e}")

if __name__ == "__main__":
    try:
        menu_delecao()
    except KeyboardInterrupt:
        print("\nOperação encerrada.")