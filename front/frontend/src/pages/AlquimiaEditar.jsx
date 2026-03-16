import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { get, update } from '../api'

const COLLECTION = 'alquimia'
const MATS = ['vegetal', 'animal', 'mineral', 'demoníaco']

export default function AlquimiaEditar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(() => {
    const o = { nome: '', efeito: '', descrição: '' }
    MATS.forEach((m) => { o[`${m}_rar`] = 'Comum'; o[`${m}_pot`] = '' })
    return o
  })
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
      .then(() => navigate('/alquimia'))
      .catch((e) => setError(e.message))
      .finally(() => setSaving(false))
  }

  if (loading) return <p>Carregando…</p>
  if (error && !form.nome) return <p className="error-msg">{error}</p>

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/alquimia" className="button">← Voltar à lista de alquimia</Link>
      </div>
      <div className="card" style={{ maxWidth: '560px' }}>
        <h2>Editar receita</h2>
        <div className="form-row">
          <label>Nome</label>
          <input value={form.nome || ''} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
        </div>
        <div className="form-row">
          <label>Efeito</label>
          <input value={form.efeito || ''} onChange={(e) => setForm({ ...form, efeito: e.target.value })} />
        </div>
        <div className="form-row">
          <label>Descrição</label>
          <textarea value={form.descrição || ''} onChange={(e) => setForm({ ...form, descrição: e.target.value })} />
        </div>
        {MATS.map((m) => (
          <div key={m} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div className="form-row" style={{ flex: 1 }}>
              <label>{m} raridade</label>
              <select value={form[`${m}_rar`]} onChange={(e) => setForm({ ...form, [`${m}_rar`]: e.target.value })}>
                {['Comum', 'Incomum', 'Raro', 'Épico', 'Lendário'].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="form-row" style={{ flex: 1 }}>
              <label>{m} potência</label>
              <input value={form[`${m}_pot`] || ''} onChange={(e) => setForm({ ...form, [`${m}_pot`]: e.target.value })} />
            </div>
          </div>
        ))}
        {error && <p className="error-msg">{error}</p>}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button type="button" className="primary" onClick={save} disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</button>
          <Link to="/alquimia" className="button">Cancelar</Link>
        </div>
      </div>
    </div>
  )
}
