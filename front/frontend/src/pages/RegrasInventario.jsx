import { Link } from 'react-router-dom'
import { AttrLink } from '../components/RegrasLinks'

export default function RegrasInventario() {
  return (
    <div className="regras-doc">
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/regras">← Regras</Link>
      </nav>
      <h1>Inventário</h1>
      <p style={{ color: 'var(--parchment-dark)', marginBottom: '1rem' }}>Carregando a Aventura</p>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p>O inventário representa o espaço físico que um personagem possui para carregar seus pertences, desde armas e armaduras até poções e outros itens essenciais. Cada item ocupa um determinado número de espaços no inventário, dependendo de seu tamanho e peso.</p>
      </section>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginTop: 0 }}>Espaços por tipo de item</h2>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          <li><strong>Armamento leve:</strong> 1 espaço</li>
          <li><strong>Armamento médio:</strong> 5 espaços</li>
          <li><strong>Armamento pesado:</strong> 8 espaços</li>
          <li><strong>5 itens muito pequenos</strong> (poções, chaves, utensílios, etc.): 1 espaço</li>
        </ul>
      </section>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginTop: 0 }}>Cálculo do total de espaços</h2>
        <p>O total de espaços no inventário de um personagem é determinado por sua <AttrLink nome="Força" /> e <AttrLink nome="Vitalidade" />, calculado pela seguinte fórmula:</p>
        <p className="regras-formula">5 + Força + Vitalidade</p>
        <p style={{ marginBottom: 0 }}>A ficha de personagem possui um espaço dedicado ao inventário, onde os jogadores podem registrar seus pertences e controlar o espaço disponível.</p>
      </section>

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/regras">← Voltar a Regras</Link>
      </p>
    </div>
  )
}
