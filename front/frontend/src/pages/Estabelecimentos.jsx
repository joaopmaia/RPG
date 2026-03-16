import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { list, remove } from '../api'

export default function Estabelecimentos() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true)
    setError(null)
    list('estabelecimentos')
      .then((data) => {
        const arr = Array.isArray(data) ? data : []
        setItems(Array.from(new Map(arr.map((d) => [d._id, d])).values()))
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const del = (id, e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    if (confirm('Remover este estabelecimento? Esta ação não pode ser desfeita.')) {
      remove('estabelecimentos', id).then(load).catch((err) => setError(err.message))
    }
  }

  return (
    <div>
      <h1>Estabelecimentos</h1>
      <div className="filters">
        {isAdmin() && <Link to="/estabelecimentos/criar" className="button primary">Novo estabelecimento</Link>}
      </div>
      {error && <p className="error-msg">{error}</p>}
      {loading && <p>Carregando…</p>}
      {!loading && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Nível</th>
                <th>Reino</th>
                <th>NPC</th>
                <th>Observações</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/estabelecimentos/${row._id}`)}>
                  <td>{row.nome}</td>
                  <td>{row.nivel} - {row.nivel_nome || ''}</td>
                  <td>{row.reino_nome}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {row.npc_id && row.npc_nome ? (
                      isAdmin() ? <Link to={`/npcs/${row.npc_id}/ficha`}>{row.npc_nome}</Link> : <span>{row.npc_nome}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>{(row.observacoes || []).join(' ').slice(0, 40)}{(row.observacoes || []).join(' ').length > 40 ? '…' : ''}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {isAdmin() && <button type="button" onClick={(ev) => del(row._id, ev)}>Remover</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
