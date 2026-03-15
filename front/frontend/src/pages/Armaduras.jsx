import { useState, useEffect } from 'react'
import { list, get, create, update, remove } from '../api'

const COLLECTION = 'armaduras'

export default function Armaduras() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [q, setQ] = useState('')
  const [tipo, setTipo] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ nome: '', defesa: '', durabilidade: '', peso: '', preco: '', tipo: 'Armadura' })

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
    setForm({ nome: '', defesa: '', durabilidade: '', peso: '', preco: '', tipo: 'Armadura' })
  }

  const openEdit = (id) => {
    get(COLLECTION, id).then((data) => {
      const { _id, ...rest } = data
      setForm(rest)
      setEditing(id)
    }).catch((e) => setError(e.message))
  }

  const save = () => {
    if (editing === 'new') {
      create(COLLECTION, form).then(() => { setEditing(null); load() }).catch((e) => setError(e.message))
    } else {
      update(COLLECTION, editing, form).then(() => { setEditing(null); load() }).catch((e) => setError(e.message))
    }
  }

  const del = (id) => {
    if (confirm('Remover esta armadura?')) remove(COLLECTION, id).then(load).catch((e) => setError(e.message))
  }

  return (
    <div>
      <h1>Armaduras</h1>
      <div className="filters">
        <input placeholder="Buscar" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Todos</option>
          <option value="Armadura">Armadura</option>
          <option value="Escudo">Escudo</option>
        </select>
        <button type="button" className="primary" onClick={openCreate}>Nova armadura</button>
      </div>
      {error && <p className="error-msg">{error}</p>}
      {loading && <p>Carregando…</p>}
      {!loading && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Defesa</th>
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
                  <td>{row.defesa}</td>
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
          <h3>{editing === 'new' ? 'Nova armadura' : 'Editar armadura'}</h3>
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
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" className="primary" onClick={save}>Salvar</button>
            <button type="button" onClick={() => setEditing(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}
