import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { get, update } from '../api'

export default function DemonioEditar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    get('demonios', id)
      .then(setDoc)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (field, value) => {
    setDoc((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const handleArrayChange = (field, text) => {
    const arr = text.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
    setDoc((prev) => (prev ? { ...prev, [field]: arr } : null))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!doc) return
    setSaving(true)
    const { _id, ...payload } = doc
    update('demonios', id, payload)
      .then(() => navigate(`/demonios/${id}/ficha`))
      .catch((e) => setError(e.message))
      .finally(() => setSaving(false))
  }

  if (loading) return <p>Carregando…</p>
  if (error && !doc) return <p className="error-msg">{error}</p>
  if (!doc) return <p>Demônio não encontrado.</p>

  return (
    <div style={{ maxWidth: '640px' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/demonios">← Lista</Link>
        {' · '}
        <Link to={`/demonios/${id}/ficha`}>Ver ficha</Link>
      </div>
      <form onSubmit={handleSubmit} className="card">
        <h2>Editar demônio</h2>
        {error && <p className="error-msg">{error}</p>}
        <div className="form-row">
          <label>Nome</label>
          <input type="text" value={doc.nome || ''} onChange={(e) => handleChange('nome', e.target.value)} />
        </div>
        <div className="form-row">
          <label>Tipo / Elemento</label>
          <input type="text" value={doc.tipo || ''} onChange={(e) => handleChange('tipo', e.target.value)} />
        </div>
        <div className="form-row">
          <label>Nível (inferior, normal, superior)</label>
          <input type="text" value={doc.nível ?? ''} onChange={(e) => handleChange('nível', e.target.value)} placeholder="normal" />
        </div>
        <div className="form-row">
          <label>Raça</label>
          <input type="text" value={doc.raça || ''} onChange={(e) => handleChange('raça', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="form-row">
            <label>HP total</label>
            <input type="number" min={0} value={doc.hp_total ?? ''} onChange={(e) => handleChange('hp_total', e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
          <div className="form-row">
            <label>HP atual</label>
            <input type="number" min={0} value={doc.hp_atual ?? ''} onChange={(e) => handleChange('hp_atual', e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="form-row">
            <label>Armadura</label>
            <input type="number" min={0} value={doc.armadura ?? ''} onChange={(e) => handleChange('armadura', e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
          <div className="form-row">
            <label>Perícia</label>
            <input type="number" value={doc.pericia ?? ''} onChange={(e) => handleChange('pericia', e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
        </div>
        <div className="form-row">
          <label>Dano (ex: 1d10)</label>
          <input type="text" value={doc.dano || ''} onChange={(e) => handleChange('dano', e.target.value)} />
        </div>
        <div className="form-row">
          <label>Runas (uma por linha ou separadas por vírgula)</label>
          <textarea value={(doc.runas || []).join('\n')} onChange={(e) => handleArrayChange('runas', e.target.value)} rows={2} />
        </div>
        <div className="form-row">
          <label>Ataques (um por linha)</label>
          <textarea value={(doc.ataques || []).join('\n')} onChange={(e) => handleArrayChange('ataques', e.target.value)} rows={4} />
        </div>
        <div className="form-row">
          <label>Loot (um por linha)</label>
          <textarea value={(doc.loot || []).join('\n')} onChange={(e) => handleArrayChange('loot', e.target.value)} rows={3} />
        </div>
        <div className="form-row">
          <label>Observações (uma por linha)</label>
          <textarea value={(doc.observacoes || []).join('\n')} onChange={(e) => handleArrayChange('observacoes', e.target.value)} rows={2} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button type="submit" className="primary" disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</button>
          <Link to="/demonios"><button type="button">Cancelar</button></Link>
        </div>
      </form>
    </div>
  )
}
