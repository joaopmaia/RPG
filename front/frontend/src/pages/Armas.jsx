import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { list, remove } from '../api'

const COLLECTION = 'armas'

export default function Armas() {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [q, setQ] = useState('')
  const [tipo, setTipo] = useState('')
  const [peso, setPeso] = useState('')
  const load = () => {
    setLoading(true)
    setError(null)
    list(COLLECTION, { q: q || undefined, tipo: tipo || undefined, peso: peso || undefined })
      .then((data) => {
        const arr = Array.isArray(data) ? data : []
        setItems(Array.from(new Map(arr.map((d) => [d._id, d])).values()))
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [q, tipo, peso])

  const del = (id) => {
    if (confirm('Remover esta arma? Esta ação não pode ser desfeita.')) {
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
        <select value={peso} onChange={(e) => setPeso(e.target.value)}>
          <option value="">Todos os pesos</option>
          <option value="Muito Leve">Muito Leve</option>
          <option value="Leve">Leve</option>
          <option value="Médio">Médio</option>
          <option value="Pesado">Pesado</option>
          <option value="Muito Pesado">Muito Pesado</option>
        </select>
        {isAdmin() && <Link to="/armas/criar" className="button primary">Nova arma</Link>}
        <Link to="/armas/novo-item" className="button">Novo Item</Link>
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
                    {isAdmin() && (
                      <>
                        <Link to={`/armas/${row._id}/editar`} className="button">Editar</Link>
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
    </div>
  )
}
