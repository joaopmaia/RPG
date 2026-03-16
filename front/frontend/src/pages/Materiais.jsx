import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { list, remove } from '../api'

const COLLECTION = 'materiais'
const DIFICULDADE_EXTRACAO = { Comum: 10, Incomum: 12, Raro: 15, Épico: 17, Lendário: 20 }

export default function Materiais() {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [q, setQ] = useState('')
  const [tipo, setTipo] = useState('')
  const [rank, setRank] = useState('')
  const [expandido, setExpandido] = useState(null)
  const load = () => {
    setLoading(true)
    setError(null)
    list(COLLECTION, { q: q || undefined, tipo: tipo || undefined, rank: rank || undefined })
      .then((data) => {
        const arr = Array.isArray(data) ? data : []
        setItems(Array.from(new Map(arr.map((d) => [d._id, d])).values()))
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [q, tipo, rank])

  const del = (id) => {
    if (confirm('Remover este material? Esta ação não pode ser desfeita.')) remove(COLLECTION, id).then(load).catch((e) => setError(e.message))
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
        {isAdmin() && <Link to="/materiais/criar" className="button primary">Novo material</Link>}
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
                <React.Fragment key={row._id}>
                  <tr
                    key={row._id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setExpandido(expandido === row._id ? null : row._id)}
                  >
                    <td>{row.material}</td>
                    <td><span className="badge">{row.rank}</span></td>
                    <td>{row.bonus}</td>
                    <td>{row.peso}</td>
                    <td>{row.raridade}</td>
                    <td>{row.tipo}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      {isAdmin() && (
                        <>
                          <Link to={`/materiais/${row._id}/editar`} className="button">Editar</Link>
                          {' '}
                          <button type="button" onClick={() => del(row._id)}>Remover</button>
                        </>
                      )}
                    </td>
                  </tr>
                  {expandido === row._id && (
                    <tr key={`${row._id}-exp`}>
                      <td colSpan={7} style={{ padding: '0.75rem 1rem', background: 'var(--bg-card-hover)', borderBottom: '1px solid var(--border-frame)', fontSize: '0.9rem' }}>
                        <div><strong>Dificuldade de extração:</strong> {DIFICULDADE_EXTRACAO[row.raridade] ?? 10} (raridade: {row.raridade || 'Comum'})</div>
                        {row.efeito && <div style={{ marginTop: '0.35rem' }}><strong>Efeito:</strong> {row.efeito}</div>}
                        {row.descricao && <div style={{ marginTop: '0.35rem', color: 'var(--parchment-dark)' }}><strong>Descrição:</strong> {row.descricao}</div>}
                        {!row.efeito && !row.descricao && <span style={{ color: 'var(--parchment-dark)' }}>Sem efeito ou descrição cadastrados.</span>}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
