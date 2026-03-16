import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { get } from '../api'

export default function AnimalFicha() {
  const { id } = useParams()
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [ataquesOpen, setAtaquesOpen] = useState(true)

  useEffect(() => {
    get('animais', id)
      .then(setDoc)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p>Carregando…</p>
  if (error) return <p className="error-msg">{error}</p>
  if (!doc) return <p>Animal não encontrado.</p>

  const attrs = [
    ['Força', doc.forca],
    ['Destreza', doc.destreza],
    ['Vitalidade', doc.vitalidade],
    ['Inteligência', doc.inteligencia],
    ['Espírito', doc.espirito],
    ['Carisma', doc.carisma],
    ['Percepção', doc.percepcao],
  ]

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/animais">← Voltar à lista de animais</Link>
      </div>
      <div className="card">
        <h1>{doc.nome}</h1>
        <p><strong>Nível/Porte:</strong> {(doc.nível || '—').toString()} &nbsp; <strong>Tipo:</strong> {doc.tipo || '—'} &nbsp; <strong>Raça:</strong> {doc.raça || '—'}</p>
        <p><strong>HP:</strong> {doc.hp_atual} / {doc.hp_total} &nbsp; <strong>Armadura:</strong> {doc.armadura ?? '—'} &nbsp; <strong>Perícia:</strong> +{doc.pericia ?? '—'} &nbsp; <strong>Dano:</strong> {doc.dano ?? '—'}</p>
        {(doc.arcana_total != null && Number(doc.arcana_total) > 0) && (
          <p><strong>Arcana:</strong> {doc.arcana_atual ?? 0} / {doc.arcana_total}</p>
        )}
        <hr style={{ borderColor: 'var(--border-frame)', margin: '1rem 0' }} />
        <h3>Atributos</h3>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          {attrs.map(([nome, val]) => (
            <li key={nome}><strong>{nome}:</strong> {val ?? '—'}</li>
          ))}
        </ul>
        {(doc.runas && doc.runas.length > 0) && (
          <>
            <h3 style={{ marginTop: '1rem' }}>Runas / Essência</h3>
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>{doc.runas.map((r, i) => <li key={i}>{r}</li>)}</ul>
          </>
        )}
        {(doc.ataque_especial || doc.efeito_ataque_critico) && !(doc.ataques && doc.ataques.length > 0) && (
          <>
            <h3 style={{ marginTop: '1rem' }}>Ataque especial / Crítico</h3>
            <p>{doc.ataque_especial || '—'}</p>
            <p><strong>Efeito crítico:</strong> {doc.efeito_ataque_critico ?? '—'}</p>
          </>
        )}
        {(doc.ataques && doc.ataques.length > 0) && (
          <>
            <h3 style={{ marginTop: '1rem', cursor: 'pointer', userSelect: 'none' }} onClick={() => setAtaquesOpen((o) => !o)}>
              {ataquesOpen ? '▼' : '▶'} Ataques
            </h3>
            {ataquesOpen && (
              <ul style={{ margin: 0, paddingLeft: '1.25rem', listStyle: 'none' }}>
                {doc.ataques.map((a, i) => (
                  <li key={i} style={{ marginBottom: '0.75rem', padding: '0.5rem', background: 'var(--bg-card-hover)', borderRadius: 6 }}>
                    {typeof a === 'string' ? (
                      <span>{a}</span>
                    ) : (
                      <>
                        <strong>{a.nome ?? '—'}</strong>
                        {a.desc != null && a.desc !== '' && <div style={{ fontSize: '0.9rem', marginTop: '0.25rem', color: 'var(--parchment-dark)' }}>{a.desc}</div>}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        {(doc.loot && doc.loot.length > 0) && (
          <>
            <h3 style={{ marginTop: '1rem' }}>Loot</h3>
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>{doc.loot.map((l, i) => <li key={i}>{l}</li>)}</ul>
          </>
        )}
        {(doc.observacoes && doc.observacoes.length > 0) && (
          <>
            <h3 style={{ marginTop: '1rem' }}>Observações</h3>
            <p>{doc.observacoes.join('; ')}</p>
          </>
        )}
      </div>
    </div>
  )
}
