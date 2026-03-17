import { Link } from 'react-router-dom'

export default function RoleplayingViagens() {
  return (
    <div className="regras-doc">
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/">← Início</Link>
      </nav>
      <h1>Viagens (Roleplaying)</h1>
      <div className="card">
        <p style={{ color: 'var(--parchment-dark)', marginBottom: 0 }}>
          Página em construção. Aqui você poderá registrar viagens específicas, encontros narrativos
          e resultados detalhados de jornadas do grupo, conectando-se aos reinos e estabelecimentos.
        </p>
      </div>
    </div>
  )
}

