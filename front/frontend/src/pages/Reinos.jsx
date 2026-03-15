import { useState, useEffect } from 'react'
import { list, get, create, update, remove } from '../api'

const COLLECTION = 'reinos'

export default function Reinos() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    nome: '', armas: '', armaduras: '', escudos: '', ferramentas: '',
    runicos: '', servicos: '', alquimia: '', materiais: '',
  })

  const load = () => {
    setLoading(true)
    setError(null)
    list(COLLECTION, { q: q || undefined })
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [q])

  const openCreate = () => {
    setEditing('new')
    setForm({ nome: '', armas: '', armaduras: '', escudos: '', ferramentas: '', runicos: '', servicos: '', alquimia: '', materiais: '' })
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
    if (confirm('Remover este reino?')) remove(COLLECTION, id).then(load).catch((e) => setError(e.message))
  }

  const campos = ['armas', 'armaduras', 'escudos', 'ferramentas', 'runicos', 'servicos', 'alquimia', 'materiais']

  return (
    <div>
      <h1>Reinos</h1>
      <div className="filters">
        <input placeholder="Buscar por nome" value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="button" className="primary" onClick={openCreate}>Novo reino</button>
      </div>
      {error && <p className="error-msg">{error}</p>}
      {loading && <p>Carregando…</p>}
      {!loading && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Armas</th>
                <th>Armaduras</th>
                <th>Alquimia</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row._id}>
                  <td>{row.nome}</td>
                  <td>{row.armas}</td>
                  <td>{row.armaduras}</td>
                  <td>{row.alquimia}</td>
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
          <h3>{editing === 'new' ? 'Novo reino' : 'Editar reino'}</h3>
          <div className="form-row">
            <label>Nome</label>
            <input value={form.nome || ''} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </div>
          {campos.map((key) => (
            <div key={key} className="form-row">
              <label>{key}</label>
              <input value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" className="primary" onClick={save}>Salvar</button>
            <button type="button" onClick={() => setEditing(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}
