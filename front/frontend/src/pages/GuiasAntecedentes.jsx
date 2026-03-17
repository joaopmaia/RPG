import { useState } from 'react'
import { Link } from 'react-router-dom'
import { introAntecedentes, positivos, negativos } from '../data/antecedentes'

export default function GuiasAntecedentes() {
  const [openPos, setOpenPos] = useState({})
  const [openNeg, setOpenNeg] = useState({})

  const toggle = (setter, id) => setter((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="regras-doc">
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/guias">← Guias</Link>
      </nav>
      <h1>Antecedentes</h1>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 id="o-que-sao" style={{ marginTop: 0 }}>O que são antecedentes</h2>
        <p style={{ whiteSpace: 'pre-line' }}>{introAntecedentes}</p>
      </section>

      <h2 id="positivos">Antecedentes positivos</h2>
      <p style={{ color: 'var(--parchment-dark)', marginBottom: '1rem' }}>Consomem pontos da sua reserva inicial (12 pontos).</p>
      {positivos.map((a) => {
        const isOpen = openPos[a.id] !== false
        return (
          <div key={a.id} id={a.id} className="card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginTop: 0, cursor: 'pointer', userSelect: 'none' }} onClick={() => toggle(setOpenPos, a.id)}>
              {isOpen ? '▼' : '▶'} {a.nome} <span style={{ fontWeight: 'normal', color: 'var(--parchment-dark)' }}>(Custo: {a.custo} pontos)</span>
            </h3>
            {isOpen && (
              <>
                <p style={{ margin: '0.5rem 0' }}><strong>Efeito:</strong> {a.efeito}</p>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--parchment-dark)' }}>{a.descricao}</p>
              </>
            )}
          </div>
        )
      })}

      <h2 id="negativos" style={{ marginTop: '2rem' }}>Antecedentes negativos</h2>
      <p style={{ color: 'var(--parchment-dark)', marginBottom: '1rem' }}>Concedem pontos extras (máximo 3 antecedentes negativos; cada um pode ser comprado apenas uma vez).</p>
      {negativos.map((a) => {
        const isOpen = openNeg[a.id] !== false
        return (
          <div key={a.id} id={a.id} className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid rgba(220, 80, 80, 0.5)' }}>
            <h3 style={{ marginTop: 0, cursor: 'pointer', userSelect: 'none' }} onClick={() => toggle(setOpenNeg, a.id)}>
              {isOpen ? '▼' : '▶'} {a.nome} <span style={{ fontWeight: 'normal', color: 'var(--parchment-dark)' }}>(+{a.pontosExtras} pontos)</span>
            </h3>
            {isOpen && (
              <>
                <p style={{ margin: '0.5rem 0' }}><strong>Efeito:</strong> {a.efeito}</p>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--parchment-dark)' }}>{a.descricao}</p>
              </>
            )}
          </div>
        )
      })}

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/regras/criacao-ficha#antecedentes">← Voltar à Criação de Ficha</Link>
      </p>
    </div>
  )
}
