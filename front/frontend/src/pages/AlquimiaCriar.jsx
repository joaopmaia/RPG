import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { create } from '../api'

const COLLECTION = 'alquimia'
const MATS = ['vegetal', 'animal', 'mineral', 'demoníaco']

function emptyForm() {
  const o = { nome: '', efeito: '', descrição: '' }
  MATS.forEach((m) => { o[`${m}_rar`] = 'Comum'; o[`${m}_pot`] = '' })
  return o
}

export default function AlquimiaCriar() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [form, setForm] = useState(emptyForm())

  const save = () => {
    setError(null)
    create(COLLECTION, { ...form })
      .then(() => navigate('/alquimia'))
      .catch((e) => setError(e.message))
  }

  return (
    <div>
      <h1>Nova receita</h1>
      <div className="card" style={{ maxWidth: '560px', marginTop: '1rem' }}>
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
          <button type="button" className="primary" onClick={save}>Salvar</button>
          <Link to="/alquimia" className="button">Voltar</Link>
        </div>
      </div>
    </div>
  )
}
