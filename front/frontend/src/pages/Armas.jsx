import { useState, useEffect } from 'react'
import { list, get, create, update, remove } from '../api'

const COLLECTION = 'armas'

export default function Armas() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [q, setQ] = useState('')
  const [tipo, setTipo] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ nome: '', dano: '', durabilidade: '', peso: '', preco: '', tipo: 'melee' })

  const load = () => {
    setLoading(true)
    setError(null)
    list(COLLECTION, { q: q || undefined, tipo: tipo || undefined })
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [q, tipo])

  const openCreate = () => {
    setEditing('new')
    setForm({ nome: '', dano: '', durabilidade: '', peso: '', preco: '', tipo: 'melee' })
  }

  const openEdit = (id) => {
    get(COLLECTION, id).then((data) => {
      const { _id, ...rest } = data
      setForm(rest)
      setEditing(id)
    }).catch((e) => setError(e.message))
  }

  const save = () => {
    const payload = { ...form }
    if (editing === 'new') {
      create(COLLECTION, payload).then(() => { setEditing(null); load() }).catch((e) => setError(e.message))
    } else {
      update(COLLECTION, editing, payload).then(() => { setEditing(null); load() }).catch((e) => setError(e.message))
    }
  }

  const del = (id) => {
    if (confirm('Remover esta arma?')) {
      remove(COLLECTION, id).then(load).catch((e) => setError(e.message))
    }
  }

  return (
    <div>
      <h1>Armas</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar por nome ou tipo"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Todos os tipos</option>
          <option value="melee">Melee</option>
          <option value="ranged">Ranged</option>
          <option value="arcane">Arcane</option>
        </select>
        <button type="button" className="primary" onClick={openCreate}>Nova arma</button>
      </div>
      {error && <p className="error-msg">{error}</p>}
      {loading && <p>Carregando…</p>}
      {!loading && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Dano</th>
                <th>Durabilidade</th>
                <th>Peso</th>
                <th>Preço</th>
                <th>Tipo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row._id}>
                  <td>{row.nome}</td>
                  <td>{row.dano}</td>
                  <td>{row.durabilidade}</td>
                  <td>{row.peso}</td>
                  <td>{row.preco}</td>
                  <td><span className="badge">{row.tipo}</span></td>
                  <td>
                    <button type="button" onClick={() => openEdit(row._id)}>Editar</button>
                    {' '}
                    <button type="button" onClick={() => del(row._id)}>Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="card" style={{ marginTop: '1rem', maxWidth: '480px' }}>
          <h3>{editing === 'new' ? 'Nova arma' : 'Editar arma'}</h3>
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
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" className="primary" onClick={save}>Salvar</button>
            <button type="button" onClick={() => setEditing(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}
