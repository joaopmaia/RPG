import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { create } from '../api'

const COLLECTION = 'armaduras'

export default function ArmadurasCriar() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ nome: '', defesa: '', durabilidade: '', peso: '', preco: '', tipo: 'Armadura' })

  const save = () => {
    setError(null)
    create(COLLECTION, { ...form })
      .then(() => navigate('/armaduras'))
      .catch((e) => setError(e.message))
  }

  return (
    <div>
      <h1>Nova armadura</h1>
      <div className="card" style={{ maxWidth: '480px', marginTop: '1rem' }}>
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
          <button type="button" className="primary" onClick={save}>Salvar</button>
          <Link to="/armaduras" className="button">Voltar</Link>
        </div>
      </div>
    </div>
  )
}
