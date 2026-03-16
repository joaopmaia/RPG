import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { create } from '../api'

const COLLECTION = 'materiais'

export default function MateriaisCriar() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ material: '', rank: 'F', bonus: '', peso: '', raridade: 'Comum', durabilidade: '', efeito: '', tipo: 'mineral' })

  const save = () => {
    setError(null)
    create(COLLECTION, { ...form })
      .then(() => navigate('/materiais'))
      .catch((e) => setError(e.message))
  }

  return (
    <div>
      <h1>Novo material</h1>
      <div className="card" style={{ maxWidth: '480px', marginTop: '1rem' }}>
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
          <button type="button" className="primary" onClick={save}>Salvar</button>
          <Link to="/materiais" className="button">Voltar</Link>
        </div>
      </div>
    </div>
  )
}
