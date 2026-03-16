import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { get, update } from '../api'

const COLLECTION = 'materiais'

export default function MateriaisEditar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ material: '', rank: '', bonus: '', peso: '', raridade: '', durabilidade: '', efeito: '', tipo: 'mineral' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    get(COLLECTION, id)
      .then((data) => {
        const { _id, ...rest } = data
        setForm(rest)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const save = () => {
    setSaving(true)
    setError(null)
    update(COLLECTION, id, form)
      .then(() => navigate('/materiais'))
      .catch((e) => setError(e.message))
      .finally(() => setSaving(false))
  }

  if (loading) return <p>Carregando…</p>
  if (error && !form.material) return <p className="error-msg">{error}</p>

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/materiais" className="button">← Voltar à lista de materiais</Link>
      </div>
      <div className="card" style={{ maxWidth: '480px' }}>
        <h2>Editar material</h2>
        {['material', 'bonus', 'peso', 'durabilidade', 'efeito'].map((key) => (
          <div key={key} className="form-row">
            <label>{key}</label>
            <input value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </div>
        ))}
        <div className="form-row">
          <label>Rank</label>
          <select value={form.rank} onChange={(e) => setForm({ ...form, rank: e.target.value })}>
            {['F', 'E', 'D', 'C', 'B', 'A', 'S'].map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="form-row">
          <label>Raridade</label>
          <select value={form.raridade} onChange={(e) => setForm({ ...form, raridade: e.target.value })}>
            {['Comum', 'Incomum', 'Raro', 'Épico', 'Lendário'].map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="form-row">
          <label>Tipo</label>
          <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
            <option value="mineral">mineral</option>
            <option value="vegetal">vegetal</option>
            <option value="animal">animal</option>
            <option value="demoníaco">demoníaco</option>
          </select>
        </div>
        {error && <p className="error-msg">{error}</p>}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button type="button" className="primary" onClick={save} disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</button>
          <Link to="/materiais" className="button">Cancelar</Link>
        </div>
      </div>
    </div>
  )
}
