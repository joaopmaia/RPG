import { useState, useEffect } from 'react'
import { list, get, create, update, remove } from '../api'

const COLLECTION = 'materiais'

export default function Materiais() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [q, setQ] = useState('')
  const [tipo, setTipo] = useState('')
  const [rank, setRank] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ material: '', rank: '', bonus: '', peso: '', raridade: '', durabilidade: '', efeito: '', tipo: 'mineral' })

  const load = () => {
    setLoading(true)
    setError(null)
    list(COLLECTION, { q: q || undefined, tipo: tipo || undefined, rank: rank || undefined })
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [q, tipo, rank])

  const openCreate = () => {
    setEditing('new')
    setForm({ material: '', rank: 'F', bonus: '', peso: '', raridade: 'Comum', durabilidade: '', efeito: '', tipo: 'mineral' })
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
    if (confirm('Remover este material?')) remove(COLLECTION, id).then(load).catch((e) => setError(e.message))
  }

  return (
    <div>
      <h1>Materiais</h1>
      <div className="filters">
        <input placeholder="Buscar" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Todos os tipos</option>
          <option value="mineral">mineral</option>
          <option value="vegetal">vegetal</option>
          <option value="animal">animal</option>
          <option value="demoníaco">demoníaco</option>
        </select>
        <select value={rank} onChange={(e) => setRank(e.target.value)}>
          <option value="">Todos os ranks</option>
          {['F', 'E', 'D', 'C', 'B', 'A', 'S'].map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <button type="button" className="primary" onClick={openCreate}>Novo material</button>
      </div>
      {error && <p className="error-msg">{error}</p>}
      {loading && <p>Carregando…</p>}
      {!loading && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Material</th>
                <th>Rank</th>
                <th>Bônus</th>
                <th>Peso</th>
                <th>Raridade</th>
                <th>Tipo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row._id}>
                  <td>{row.material}</td>
                  <td><span className="badge">{row.rank}</span></td>
                  <td>{row.bonus}</td>
                  <td>{row.peso}</td>
                  <td>{row.raridade}</td>
                  <td>{row.tipo}</td>
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
          <h3>{editing === 'new' ? 'Novo material' : 'Editar material'}</h3>
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
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" className="primary" onClick={save}>Salvar</button>
            <button type="button" onClick={() => setEditing(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}
