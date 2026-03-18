import { Link, useLocation } from 'react-router-dom'

export default function RoleplayingViagemIniciar() {
  const location = useLocation()
  const state = location.state || {}

  return (
    <div className="regras-doc">
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/roleplaying/viagens">← Voltar a Viagens</Link>
      </nav>
      <h1>Viagem iniciada</h1>
      <div className="card">
        {state.lugarOrigem && state.lugarDestino ? (
          <p>
            Viagem de <strong>{state.lugarOrigem}</strong> até <strong>{state.lugarDestino}</strong>.
            {state.custoTotal && (
              <span> Custo total: {state.custoTotal.total}. Dias: {state.custoTotal.diasReal}.</span>
            )}
          </p>
        ) : (
          <p>Nenhuma viagem em andamento. Volte à página de Viagens para calcular e iniciar uma.</p>
        )}
        <p style={{ color: 'var(--parchment-dark)', marginBottom: 0 }}>
          Esta página será implementada em breve: aqui você poderá acompanhar o progresso da viagem e eventos durante o percurso.
        </p>
      </div>
    </div>
  )
}
