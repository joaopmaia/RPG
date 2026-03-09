import sys
from pymongo import MongoClient
from bson.objectid import ObjectId

# Configurações do Banco
MONGO_URI = "mongodb://localhost:27017"
DATABASE = "rpg"

def conectar():
    client = MongoClient(MONGO_URI)
    return client[DATABASE]

def listar_resumo_demons():
    """Busca os demônios cadastrados para listagem."""
    db = conectar()
    # Busca na coleção específica demon_NPC
    return list(db.demon_NPC.find({}, {"nome": 1, "nível": 1, "observacoes": 1}).sort("nome", 1))

def deletar_demon(id_demon, nome_demon):
    """Remove o demônio selecionado após confirmação."""
    db = conectar()
    
    print(f"\n[⚠️] ATENÇÃO: Você tem certeza que deseja banir '{nome_demon}' de volta ao abismo?")
    confirmacao = input("Digite 'sim' para confirmar a exclusão ou qualquer outra tecla para cancelar: ").strip().lower()
    
    if confirmacao == 'sim':
        resultado = db.demon_NPC.delete_one({"_id": ObjectId(id_demon)})
        if resultado.deleted_count > 0:
            print(f"\n[✅] Demônio '{nome_demon}' removido com sucesso.")
        else:
            print("\n[❌] Erro: O demônio não foi encontrado no banco.")
    else:
        print("\n[─] Operação cancelada.")

def menu_delecao_demon():
    """Interface de usuário para exclusão."""
    while True:
        demons = listar_resumo_demons()
        
        if not demons:
            print("\n[!] O banco de dados de demônios está vazio.")
            break

        print("\n" + "═"*54)
        print(f"{'PURGATÓRIO: EXCLUSÃO DE DEMÔNIOS':^54}")
        print("═"*54)
        
        for i, d in enumerate(demons, 1):
            tier = d.get('nível', '???').capitalize()
            # Tenta extrair o elemento das observações para a listagem
            elemento = "???"
            for obs in d.get("observacoes", []):
                if "Elemento:" in obs:
                    elemento = obs.split(": ")[1]
            
            print(f"  {i:>2}. {d['nome']:<20} | {elemento:<10} | {tier}")

        print(f"  {0:>2}. Sair")
        print("─" * 54)

        try:
            escolha = int(input("\nSelecione o número do demônio para DELETAR: "))
            
            if escolha == 0:
                print("Encerrando gerenciador.")
                break
                
            if 1 <= escolha <= len(demons):
                demon_alvo = demons[escolha - 1]
                deletar_demon(demon_alvo["_id"], demon_alvo["nome"])
                input("\nPressione Enter para continuar...")
            else:
                print(f"Número inválido. Escolha entre 1 e {len(demons)}.")
                
        except ValueError:
            print("Por favor, digite um número válido.")
        except Exception as e:
            print(f"Ocorreu um erro inesperado: {e}")

if __name__ == "__main__":
    try:
        menu_delecao_demon()
    except KeyboardInterrupt:
        print("\nOperação interrompida pelo usuário.")