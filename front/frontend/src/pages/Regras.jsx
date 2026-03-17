import { Link } from 'react-router-dom'

export default function Regras() {
  return (
    <div className="regras-overview">
      <h1>Regras</h1>
      <p style={{ color: 'var(--parchment-dark)', marginBottom: '1.5rem' }}>
        Documentação das regras do jogo para consulta rápida.
      </p>
      <div className="card" style={{ maxWidth: 560 }}>
        <h2 style={{ marginTop: 0 }}>Índice</h2>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          <li style={{ marginBottom: '0.5rem' }}><Link to="/regras/criacao-ficha">Criação de Ficha</Link> — atributos, perícias, antecedentes e vida.</li>
          <li style={{ marginBottom: '0.5rem' }}><Link to="/regras/inventario">Inventário</Link> — espaços, capacidade (Força + Vitalidade) e tipos de item.</li>
          <li style={{ marginBottom: '0.5rem' }}><Link to="/regras/dificuldades-acoes">Dificuldades de Ações</Link> — tabela de dificuldades (7 a 20).</li>
          <li style={{ marginBottom: '0.5rem' }}><Link to="/regras/acerto-critico">Acerto Crítico</Link> — bônus no dado de acerto (não dobra dano).</li>
          <li style={{ marginBottom: '0.5rem' }}><Link to="/regras/ataque-mirado">Ataque Mirado</Link> — teste reduzido à metade, dobro de dano e crítico.</li>
          <li style={{ marginBottom: '0.5rem' }}><Link to="/regras/sistema-combate">Sistema de Combate</Link> — iniciativa, ações (movimento, combate, fala), defesa e dano.</li>
          <li style={{ marginBottom: '0.5rem' }}><Link to="/regras/status">Status</Link> — condições que afetam o personagem.</li>
          <li style={{ marginBottom: '0.5rem' }}><Link to="/regras/alquimia">Alquimia</Link> — elixires e confecção.</li>
          <li style={{ marginBottom: '0.5rem' }}><Link to="/regras/materiais">Materiais</Link> — tipos, raridades e extração.</li>
          <li style={{ marginBottom: '0.5rem' }}><Link to="/regras/equipamentos">Equipamentos</Link> — armas, armaduras e escudos.</li>
          <li style={{ marginBottom: '0.5rem' }}><Link to="/regras/hospedagens">Hospedagens</Link> — descanso e recuperação.</li>
          <li style={{ marginBottom: '0.5rem' }}><Link to="/regras/viagens">Viagens</Link> — deslocamento e condução.</li>
        </ul>
      </div>
    </div>
  )
}
