import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { create } from '../api'

const COLLECTION = 'armas'

export default function ArmasCriar() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ nome: '', dano: '', durabilidade: '', peso: '', preco: '', tipo: 'melee' })

  const save = () => {
    setError(null)
    create(COLLECTION, { ...form })
      .then(() => navigate('/armas'))
      .catch((e) => setError(e.message))
  }

  return (
    <div>
      <h1>Nova arma</h1>
      <div className="card" style={{ maxWidth: '480px', marginTop: '1rem' }}>
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
          <button type="button" className="primary" onClick={save}>Salvar</button>
          <Link to="/armas" className="button">Voltar</Link>
        </div>
      </div>
    </div>
  )
}
