import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { get, update } from '../api'

export default function InteragirAnimal() {
  const { id } = useParams()
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalDano, setModalDano] = useState(false)
  const [danoInput, setDanoInput] = useState('')

  const load = () => {
    setLoading(true)
    setError(null)
    get('animais', id)
      .then(setDoc)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  const aplicarDano = () => {
    const raw = parseInt(danoInput, 10)
    if (isNaN(raw) || raw < 0) return
    const armadura = parseFloat(doc.armadura) || 0
    const danoEfetivo = Math.max(0, raw - armadura)
    const hpAtual = parseFloat(doc.hp_atual) ?? parseFloat(doc.hp_total) ?? 0
    const novoHp = Math.max(0, hpAtual - danoEfetivo)
    update('animais', id, { hp_atual: novoHp })
      .then(() => {
        setDoc((prev) => (prev ? { ...prev, hp_atual: novoHp } : null))
        setModalDano(false)
        setDanoInput('')
      })
      .catch((e) => setError(e.message))
  }

  if (loading) return <p>Carregando…</p>
  if (error) return <p className="error-msg">{error}</p>
  if (!doc) return <p>Animal não encontrado.</p>

  return (
    <div style={{ maxWidth: '720px' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/animais">← Voltar à lista</Link>
      </div>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h2 style={{ marginTop: 0 }}>{doc.nome}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.75rem' }}>
          <div><strong>HP</strong><br />{doc.hp_atual} / {doc.hp_total}</div>
          {(doc.arcana_total != null && Number(doc.arcana_total) > 0) && (
            <div><strong>Arcana</strong><br />{doc.arcana_atual} / {doc.arcana_total}</div>
          )}
          <div><strong>Armadura</strong><br />{doc.armadura ?? '—'}</div>
          <div><strong>Perícia</strong><br />+{doc.pericia ?? '—'}</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
          <Link to={`/animais/${id}/ficha`}><button type="button" className="primary">Visualizar ficha</button></Link>
          <button type="button" onClick={() => { setModalDano(true); setDanoInput(''); }}>Tomar dano</button>
        </div>
      </div>

      {modalDano && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setModalDano(false)}>
          <div className="card modal-content" style={{ maxWidth: '320px' }} onClick={(e) => e.stopPropagation()}>
            <h3>Tomar dano — {doc.nome}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>Armadura: {doc.armadura ?? 0}. Dano efetivo = (valor − armadura).</p>
            <div className="form-row">
              <label>Quantidade de dano</label>
              <input type="number" min={0} value={danoInput} onChange={(e) => setDanoInput(e.target.value)} placeholder="0" />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="primary" onClick={aplicarDano}>Aplicar dano</button>
              <button type="button" onClick={() => setModalDano(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
