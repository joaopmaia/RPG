import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { list, get, create, update, remove } from '../api'

const COLLECTION = 'runas'
const ELEMENTOS = ['Genia', 'Degila', 'Reetear', 'Arunalt', 'Saltrat', 'Pascalia']
const ELEMENTO_IMAGEM = {
  Degila: '/elementos/degila.png',
  Genia: '/elementos/genia.png',
  Arunalt: '/elementos/arunalt.png',
  Saltrat: '/elementos/saltrat.png',
  Reetear: '/elementos/reetear.png',
  Pascalia: '/elementos/pascalia.png',
}

export default function Runas() {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [q, setQ] = useState('')
  const [tier, setTier] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ nome: '', tier: 'Básico', elementos: [], efeito: '', bonus: '', descricao: '' })

  const [elementosSelecionados, setElementosSelecionados] = useState([])

  const load = () => {
    setLoading(true)
    setError(null)
    const params = { q: q || undefined, tier: tier || undefined }
    if (elementosSelecionados.length > 0) params.elemento = [...elementosSelecionados]
    list(COLLECTION, params)
      .then((data) => {
        const arr = Array.isArray(data) ? data : []
        setItems(Array.from(new Map(arr.map((d) => [d._id, d])).values()))
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  const elementosKey = JSON.stringify([...elementosSelecionados].sort())
  useEffect(load, [q, tier, elementosKey])

  const toggleElementoFiltro = (elem) => {
    setElementosSelecionados((prev) =>
      prev.includes(elem) ? prev.filter((e) => e !== elem) : [...prev, elem]
    )
  }

  const openCreate = () => {
    setEditing('new')
    setForm({ nome: '', tier: 'Básico', elementos: [], efeito: '', bonus: '', descricao: '' })
  }

  const openEdit = (id) => {
    get(COLLECTION, id).then((data) => {
      const { _id, ...rest } = data
      setForm({ ...rest, elementos: Array.isArray(rest.elementos) ? rest.elementos : [] })
      setEditing(id)
    }).catch((e) => setError(e.message))
  }

  const toggleElemento = (elem) => {
    const arr = form.elementos.includes(elem) ? form.elementos.filter((e) => e !== elem) : [...form.elementos, elem]
    setForm({ ...form, elementos: arr })
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
    if (confirm('Remover esta runa? Esta ação não pode ser desfeita.')) {
      remove(COLLECTION, id).then(load).catch((e) => setError(e.message))
    }
  }

  return (
    <div>
      <h1>Runas</h1>
      <div className="filters">
        <input placeholder="Buscar por nome ou efeito" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={tier} onChange={(e) => setTier(e.target.value)}>
          <option value="">Todos os tiers</option>
          <option value="Básico">Básico</option>
          <option value="Intermediário">Intermediário</option>
          <option value="Superior">Superior</option>
        </select>
        <span style={{ color: 'var(--parchment-dark)', fontSize: '0.9rem', marginRight: '0.5rem' }}>Filtrar por elementos (todas as runas que contêm os selecionados):</span>
      </div>
      <div className="runas-elementos-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        {ELEMENTOS.map((elem) => (
          <button
            key={elem}
            type="button"
            className={'runas-elemento-card' + (elementosSelecionados.includes(elem) ? ' selected' : '')}
            onClick={() => toggleElementoFiltro(elem)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0.5rem',
              minWidth: '80px',
              border: elementosSelecionados.includes(elem) ? '2px solid var(--accent)' : '1px solid var(--border-frame)',
              borderRadius: '8px',
              background: elementosSelecionados.includes(elem) ? 'var(--bg-card-hover)' : 'var(--bg-card)',
              cursor: 'pointer',
            }}
          >
            <img src={ELEMENTO_IMAGEM[elem]} alt={elem} style={{ width: 48, height: 48, objectFit: 'contain' }} />
            <span style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>{elem}</span>
          </button>
        ))}
      </div>
      <div className="filters">
        {isAdmin() && <button type="button" className="primary" onClick={openCreate}>Nova runa</button>}
      </div>
      {error && <p className="error-msg">{error}</p>}
      {loading && <p>Carregando…</p>}
      {!loading && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tier</th>
                <th>Elementos</th>
                <th>Efeito</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row._id}>
                  <td>{row.nome}</td>
                  <td><span className="badge">{row.tier}</span></td>
                  <td>{(row.elementos || []).join(', ')}</td>
                  <td>{(row.efeito || '').slice(0, 40)}{(row.efeito || '').length > 40 ? '…' : ''}</td>
                  <td>
                    {isAdmin() && (
                      <>
                        <button type="button" onClick={() => openEdit(row._id)}>Editar</button>
                        {' '}
                        <button type="button" onClick={() => del(row._id)}>Remover</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isAdmin() && editing && (
        <div className="card" style={{ marginTop: '1rem', maxWidth: '560px' }}>
          <h3>{editing === 'new' ? 'Nova runa' : 'Editar runa'}</h3>
          <div className="form-row">
            <label>Nome</label>
            <input value={form.nome || ''} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </div>
          <div className="form-row">
            <label>Tier</label>
            <select value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}>
              <option value="Básico">Básico</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Superior">Superior</option>
            </select>
          </div>
          <div className="form-row">
            <label>Elementos (múltiplos)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {ELEMENTOS.map((elem) => (
                <label key={elem} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <input
                    type="checkbox"
                    checked={form.elementos.includes(elem)}
                    onChange={() => toggleElemento(elem)}
                  />
                  {elem}
                </label>
              ))}
            </div>
          </div>
          <div className="form-row">
            <label>Efeito</label>
            <input value={form.efeito || ''} onChange={(e) => setForm({ ...form, efeito: e.target.value })} />
          </div>
          <div className="form-row">
            <label>Bônus</label>
            <input value={form.bonus || ''} onChange={(e) => setForm({ ...form, bonus: e.target.value })} />
          </div>
          <div className="form-row">
            <label>Descrição</label>
            <textarea value={form.descricao || ''} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
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
