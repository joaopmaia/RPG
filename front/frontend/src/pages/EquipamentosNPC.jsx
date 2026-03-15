import { useState, useEffect } from 'react'
import { list, get, create, update, remove } from '../api'

const COLLECTION = 'equipamentos-npc'

export default function EquipamentosNPC() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dono, setDono] = useState('')
  const [tipo, setTipo] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ personagem_dono: '', nome: '', tipo: '', bônus: '', durabilidade: '', peso: '', preco: '', nome_material: '', rank: '', raridade: '', tipo_material: '', efeito: '' })

  const load = () => {
    setLoading(true)
    setError(null)
    list(COLLECTION, { personagem_dono: dono || undefined, tipo: tipo || undefined })
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [dono, tipo])

  const openCreate = () => {
    setEditing('new')
    setForm({ personagem_dono: dono || '', nome: '', tipo: 'melee', bônus: '', durabilidade: '', peso: '', preco: '', nome_material: '', rank: '', raridade: '', tipo_material: '', efeito: '' })
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
    if (confirm('Remover este equipamento?')) remove(COLLECTION, id).then(load).catch((e) => setError(e.message))
  }

  return (
    <div>
      <h1>Equipamentos NPC</h1>
      <div className="filters">
        <input placeholder="Personagem dono" value={dono} onChange={(e) => setDono(e.target.value)} />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Todos</option>
          <option value="melee">melee</option>
          <option value="ranged">ranged</option>
          <option value="Armadura">Armadura</option>
          <option value="Escudo">Escudo</option>
        </select>
        <button type="button" className="primary" onClick={openCreate}>Novo equipamento</button>
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
                <th>Tipo</th>
                <th>Bônus</th>
                <th>Material</th>
                <th>Rank</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row._id}>
                  <td>{row.personagem_dono}</td>
                  <td>{row.nome}</td>
                  <td><span className="badge">{row.tipo}</span></td>
                  <td>{row.bônus ?? row.bonus}</td>
                  <td>{row.nome_material}</td>
                  <td>{row.rank}</td>
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
          <h3>{editing === 'new' ? 'Novo equipamento' : 'Editar equipamento'}</h3>
          {['personagem_dono', 'nome', 'bônus', 'durabilidade', 'peso', 'preco', 'nome_material', 'rank', 'raridade', 'tipo_material', 'efeito'].map((key) => (
            <div key={key} className="form-row">
              <label>{key}</label>
              <input value={form[key] ?? ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}
          <div className="form-row">
            <label>Tipo</label>
            <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
              <option value="melee">melee</option>
              <option value="ranged">ranged</option>
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
