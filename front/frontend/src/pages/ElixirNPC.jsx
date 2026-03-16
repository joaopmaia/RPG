import { useState, useEffect } from 'react'
import { list, get, create, update, remove } from '../api'

const COLLECTION = 'elixir-npc'

export default function ElixirNPC() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dono, setDono] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ personagem_dono: '', nome: '', efeito: '', descricao: '', materia_prima: '', bonus_materia_prima: '' })

  const load = () => {
    setLoading(true)
    setError(null)
    list(COLLECTION, { personagem_dono: dono || undefined })
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [dono])

  const openCreate = () => {
    setEditing('new')
    setForm({ personagem_dono: dono || '', nome: '', efeito: '', descricao: '', materia_prima: '', bonus_materia_prima: '' })
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
    if (confirm('Remover este elixir? Esta ação não pode ser desfeita.')) remove(COLLECTION, id).then(load).catch((e) => setError(e.message))
  }

  return (
    <div>
      <h1>Elixir NPC</h1>
      <div className="filters">
        <input placeholder="Personagem dono" value={dono} onChange={(e) => setDono(e.target.value)} />
        <button type="button" className="primary" onClick={openCreate}>Novo elixir</button>
      </div>
      {error && <p className="error-msg">{error}</p>}
      {loading && <p>Carregando…</p>}
      {!loading && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Dono</th>
                <th>Nome</th>
                <th>Efeito</th>
                <th>Matéria-prima</th>
                <th>Bônus</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row._id}>
                  <td>{row.personagem_dono}</td>
                  <td>{row.nome}</td>
                  <td>{row.efeito}</td>
                  <td>{row.materia_prima}</td>
                  <td>{row.bonus_materia_prima}</td>
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
          <h3>{editing === 'new' ? 'Novo elixir' : 'Editar elixir'}</h3>
          {['personagem_dono', 'nome', 'efeito', 'descricao', 'materia_prima', 'bonus_materia_prima'].map((key) => (
            <div key={key} className="form-row">
              <label>{key}</label>
              {key === 'descricao' ? (
                <textarea value={form[key] ?? ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              ) : (
                <input value={form[key] ?? ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              )}
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
