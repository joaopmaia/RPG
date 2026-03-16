import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { list, remove } from '../api'

const COLLECTION = 'alquimia'
const MATS = ['vegetal', 'animal', 'mineral', 'demoníaco']
const CUSTO_BASE_ELIXIR = { Comum: 20, Incomum: 100, Raro: 500, Épico: 2500, Lendário: 10000 }
const COR_RARIDADE = { Comum: '#8b7355', Incomum: '#6b8e23', Raro: '#4682b4', Épico: '#9370db', Lendário: '#daa520' }

export default function Alquimia() {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [q, setQ] = useState('')
  const [modalDescricao, setModalDescricao] = useState(null)

  const load = () => {
    setLoading(true)
    setError(null)
    list(COLLECTION, { q: q || undefined })
      .then((data) => {
        const arr = Array.isArray(data) ? data : []
        setItems(Array.from(new Map(arr.map((d) => [d._id, d])).values()))
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [q])

  const del = (id) => {
    if (confirm('Remover esta receita? Esta ação não pode ser desfeita.')) {
      remove(COLLECTION, id).then(load).catch((e) => setError(e.message))
    }
  }

  return (
    <div>
      <h1>Alquimia</h1>
      <div className="filters">
        <input placeholder="Buscar por nome ou efeito" value={q} onChange={(e) => setQ(e.target.value)} />
        {isAdmin() && <Link to="/alquimia/criar" className="button primary">Nova receita</Link>}
        <Link to="/alquimia/novo-item" className="button">Novo Item</Link>
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
                  <td>
                    {(row.descrição || '').slice(0, 40)}
                    {(row.descrição || '').length > 40 ? '…' : ''}
                    {' '}
                    <button type="button" className="link-like" onClick={() => setModalDescricao(row)}>Descrição</button>
                  </td>
                  <td>
                    {isAdmin() && (
                      <>
                        <Link to={`/alquimia/${row._id}/editar`} className="button">Editar</Link>
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

      {modalDescricao && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setModalDescricao(null)}>
          <div className="card modal-content" style={{ maxWidth: '520px', maxHeight: '85vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h3>{modalDescricao.nome}</h3>
            <p><strong>Efeito:</strong> {modalDescricao.efeito || '—'}</p>
            <p><strong>Descrição completa:</strong></p>
            <p style={{ whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>{modalDescricao.descrição || '—'}</p>
            <h4 style={{ marginTop: '1rem' }}>Raridade e potência por matéria-prima</h4>
            <table style={{ width: '100%', marginBottom: '1rem' }}>
              <thead>
                <tr><th>Matéria-prima</th><th>Raridade</th><th>Potência</th></tr>
              </thead>
              <tbody>
                {MATS.map((m) => (
                  <tr key={m}>
                    <td>{m}</td>
                    <td>{modalDescricao[`${m}_rar`] || '—'}</td>
                    <td>{modalDescricao[`${m}_pot`] || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h4>Preço base do elixir por raridade (moedas)</h4>
            <table style={{ width: '100%' }}>
              <thead>
                <tr><th>Raridade</th><th>Preço base</th></tr>
              </thead>
              <tbody>
                {Object.entries(CUSTO_BASE_ELIXIR).map(([raridade, preco]) => (
                  <tr key={raridade}><td>{raridade}</td><td>{preco}</td></tr>
                ))}
              </tbody>
            </table>
            <button type="button" style={{ marginTop: '1rem' }} onClick={() => setModalDescricao(null)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  )
}
