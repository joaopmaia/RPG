import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getNpcCompleto, update } from '../api'

export default function InteragirNPC() {
  const { id } = useParams()
  const [npc, setNpc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalDano, setModalDano] = useState(false)
  const [danoInput, setDanoInput] = useState('')

  const load = () => {
    setLoading(true)
    setError(null)
    getNpcCompleto(id)
      .then(setNpc)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  const aplicarDano = () => {
    const raw = parseInt(danoInput, 10)
    if (isNaN(raw) || raw < 0) return
    const armadura = parseFloat(npc.armadura_val) || 0
    const danoEfetivo = Math.max(0, raw - armadura)
    const hpAtual = parseFloat(npc.hp_atual) ?? parseFloat(npc.hp_total) ?? 0
    const novoHp = Math.max(0, hpAtual - danoEfetivo)
    update('npcs', id, { hp_atual: novoHp })
      .then(() => {
        setNpc((prev) => (prev ? { ...prev, hp_atual: novoHp } : null))
        setModalDano(false)
        setDanoInput('')
      })
      .catch((e) => setError(e.message))
  }

  if (loading) return <p>Carregando…</p>
  if (error) return <p className="error-msg">{error}</p>
  if (!npc) return <p>NPC não encontrado.</p>

  return (
    <div style={{ maxWidth: '720px' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/npcs">← Voltar à lista</Link>
      </div>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h2 style={{ marginTop: 0 }}>{npc.nome}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
          <div><strong>HP</strong><br />{npc.hp_atual} / {npc.hp_total}</div>
          <div><strong>Arcana</strong><br />{npc.arcana_atual} / {npc.arcana_total}</div>
          <div><strong>Perícia</strong><br />+{npc.pericia ?? '—'}</div>
          <div><strong>Armadura</strong><br />{npc.armadura_val ?? '—'}</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
          <Link to={`/npcs/${id}/ficha`}><button type="button" className="primary">Visualizar ficha</button></Link>
          <button type="button" onClick={() => { setModalDano(true); setDanoInput(''); }}>Tomar dano</button>
        </div>
      </div>

      {modalDano && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setModalDano(false)}>
          <div className="card modal-content" style={{ maxWidth: '320px' }} onClick={(e) => e.stopPropagation()}>
            <h3>Tomar dano — {npc.nome}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>Armadura: {npc.armadura_val ?? 0}. O dano efetivo será (valor digitado − armadura), limitado a não negativo.</p>
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
