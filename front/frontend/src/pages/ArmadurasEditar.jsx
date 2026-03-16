import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { get, update } from '../api'

const COLLECTION = 'armaduras'

export default function ArmadurasEditar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', defesa: '', durabilidade: '', peso: '', preco: '', tipo: 'Armadura' })
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
      .then(() => navigate('/armaduras'))
      .catch((e) => setError(e.message))
      .finally(() => setSaving(false))
  }

  if (loading) return <p>Carregando…</p>
  if (error && !form.nome) return <p className="error-msg">{error}</p>

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/armaduras" className="button">← Voltar à lista de armaduras</Link>
      </div>
      <div className="card" style={{ maxWidth: '480px' }}>
        <h2>Editar armadura</h2>
        {['nome', 'defesa', 'durabilidade', 'peso', 'preco'].map((key) => (
          <div key={key} className="form-row">
            <label>{key}</label>
            <input value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </div>
        ))}
        <div className="form-row">
          <label>Tipo</label>
          <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
            <option value="Armadura">Armadura</option>
            <option value="Escudo">Escudo</option>
          </select>
        </div>
        {error && <p className="error-msg">{error}</p>}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button type="button" className="primary" onClick={save} disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</button>
          <Link to="/armaduras" className="button">Cancelar</Link>
        </div>
      </div>
    </div>
  )
}
