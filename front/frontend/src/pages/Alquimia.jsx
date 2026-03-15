import { useState, useEffect } from 'react'
import { list, get, create, update, remove } from '../api'

const COLLECTION = 'alquimia'
const MATS = ['vegetal', 'animal', 'mineral', 'demoníaco']

export default function Alquimia() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(() => {
    const o = { nome: '', efeito: '', descrição: '' }
    MATS.forEach((m) => { o[`${m}_rar`] = 'Comum'; o[`${m}_pot`] = '' })
    return o
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

  const emptyForm = () => {
    const o = { nome: '', efeito: '', descrição: '' }
    MATS.forEach((m) => { o[`${m}_rar`] = 'Comum'; o[`${m}_pot`] = '' })
    return o
  }

  const openCreate = () => { setEditing('new'); setForm(emptyForm()) }

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
    if (confirm('Remover esta receita?')) remove(COLLECTION, id).then(load).catch((e) => setError(e.message))
  }

  return (
    <div>
      <h1>Alquimia</h1>
      <div className="filters">
        <input placeholder="Buscar por nome ou efeito" value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="button" className="primary" onClick={openCreate}>Nova receita</button>
      </div>
      {error && <p className="error-msg">{error}</p>}
      {loading && <p>Carregando…</p>}
      {!loading && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Efeito</th>
                <th>Descrição</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row._id}>
                  <td>{row.nome}</td>
                  <td>{row.efeito}</td>
                  <td>{(row.descrição || '').slice(0, 50)}…</td>
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
        <div className="card" style={{ marginTop: '1rem', maxWidth: '560px' }}>
          <h3>{editing === 'new' ? 'Nova receita' : 'Editar receita'}</h3>
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
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" className="primary" onClick={save}>Salvar</button>
            <button type="button" onClick={() => setEditing(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}
