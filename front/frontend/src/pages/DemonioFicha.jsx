import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { get } from '../api'

export default function DemonioFicha() {
  const { id } = useParams()
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    get('demonios', id)
      .then(setDoc)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p>Carregando…</p>
  if (error) return <p className="error-msg">{error}</p>
  if (!doc) return <p>Demônio não encontrado.</p>

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
        <Link to="/demonios">← Voltar à lista de demônios</Link>
      </div>
      <div className="card">
        <h1>{doc.nome}</h1>
        <p><strong>Categoria/Nível:</strong> {(doc.nível || '—').toString()} &nbsp; <strong>Tipo:</strong> {doc.tipo || '—'} &nbsp; <strong>Raça:</strong> {doc.raça || '—'}</p>
        <p><strong>HP:</strong> {doc.hp_atual} / {doc.hp_total} &nbsp; <strong>Armadura:</strong> {doc.armadura ?? '—'} &nbsp; <strong>Perícia:</strong> +{doc.pericia ?? '—'} &nbsp; <strong>Dano:</strong> {doc.dano ?? '—'}</p>
        <hr style={{ borderColor: 'var(--border-frame)', margin: '1rem 0' }} />
        <h3>Atributos</h3>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          {attrs.map(([nome, val]) => (
            <li key={nome}><strong>{nome}:</strong> {val ?? '—'}</li>
          ))}
        </ul>
        {(doc.runas && doc.runas.length > 0) && (
          <>
            <h3 style={{ marginTop: '1rem' }}>Runas / Elemento</h3>
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>{doc.runas.map((r, i) => <li key={i}>{r}</li>)}</ul>
          </>
        )}
        {(doc.ataques && doc.ataques.length > 0) && (
          <>
            <h3 style={{ marginTop: '1rem' }}>Ataques</h3>
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
              {doc.ataques.map((a, i) => (
                <li key={i} style={{ marginBottom: '0.25rem' }}>{typeof a === 'string' ? a : `${a.nome}: ${a.desc || ''}`}</li>
              ))}
            </ul>
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
