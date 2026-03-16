import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getReinoHistoria } from '../api'

export default function ReinoHistoria() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getReinoHistoria(id)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p>Carregando história…</p>
  if (error) return <p className="error-msg">{error}</p>
  if (!data) return <p>Reino não encontrado.</p>

  return (
    <div className="card" style={{ maxWidth: '720px' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/reinos">← Voltar aos Reinos</Link>
      </div>
      <article className="reino-historia" style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)' }}>
        {data.historia || '(Nenhuma história cadastrada.)'}
      </article>
    </div>
  )
}
