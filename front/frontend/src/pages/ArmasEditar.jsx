import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { get, update } from '../api'

const COLLECTION = 'armas'

export default function ArmasEditar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', dano: '', durabilidade: '', peso: '', preco: '', tipo: 'melee' })
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
      .then(() => navigate('/armas'))
      .catch((e) => setError(e.message))
      .finally(() => setSaving(false))
  }

  if (loading) return <p>Carregando…</p>
  if (error && !form.nome) return <p className="error-msg">{error}</p>

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/armas" className="button">← Voltar à lista de armas</Link>
      </div>
      <div className="card" style={{ maxWidth: '480px' }}>
        <h2>Editar arma</h2>
        <div className="form-row">
          <label>Nome</label>
          <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
        </div>
        <div className="form-row">
          <label>Dano</label>
          <input value={form.dano} onChange={(e) => setForm({ ...form, dano: e.target.value })} placeholder="ex: 1d6" />
        </div>
        <div className="form-row">
          <label>Durabilidade</label>
          <input value={form.durabilidade} onChange={(e) => setForm({ ...form, durabilidade: e.target.value })} />
        </div>
        <div className="form-row">
          <label>Peso</label>
          <input value={form.peso} onChange={(e) => setForm({ ...form, peso: e.target.value })} placeholder="ex: Leve" />
        </div>
        <div className="form-row">
          <label>Preço</label>
          <input value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} />
        </div>
        <div className="form-row">
          <label>Tipo</label>
          <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
            <option value="melee">melee</option>
            <option value="ranged">ranged</option>
            <option value="arcane">arcane</option>
          </select>
        </div>
        {error && <p className="error-msg">{error}</p>}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button type="button" className="primary" onClick={save} disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</button>
          <Link to="/armas" className="button">Cancelar</Link>
        </div>
      </div>
    </div>
  )
}
