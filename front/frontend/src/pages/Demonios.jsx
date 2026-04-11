import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { list, remove } from '../api'
import { useAuth } from '../context/useAuth'

const COLLECTION = 'demonios'

export default function Demonios() {
  const { podeEditarCampanha, campanhaId } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [q, setQ] = useState('')
  const [nivel, setNivel] = useState('')
  const [estabelecimentosFilter, setEstabelecimentosFilter] = useState('false')
  const [estabelecimentoNome, setEstabelecimentoNome] = useState('')
  const [estabelecimentosLista, setEstabelecimentosLista] = useState([])

  const load = () => {
    setLoading(true)
    setError(null)
    const params = { q: q || undefined, nível: nivel || undefined, estabelecimentos: estabelecimentosFilter }
    if (estabelecimentosFilter === 'true' && estabelecimentoNome) params.estabelecimento_nome = estabelecimentoNome
    list(COLLECTION, params)
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { list('estabelecimentos').then((arr) => setEstabelecimentosLista(Array.isArray(arr) ? arr : [])).catch(() => {}) }, [campanhaId])
  useEffect(load, [q, nivel, estabelecimentosFilter, estabelecimentoNome, campanhaId])

  const del = (id) => {
    if (confirm('Remover este demônio?')) {
      remove(COLLECTION, id).then(load).catch((e) => setError(e.message))
    }
  }

  return (
    <div>
      <h1>Demônios</h1>
      <div className="filters">
        <input placeholder="Buscar por nome, tipo ou raça" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
          <option value="">Todos os níveis</option>
          <option value="inferior">Inferior</option>
          <option value="normal">Normal</option>
          <option value="superior">Superior</option>
        </select>
        <select value={estabelecimentosFilter} onChange={(e) => { setEstabelecimentosFilter(e.target.value); if (e.target.value !== 'true') setEstabelecimentoNome('') }}>
          <option value="false">Excluir de estabelecimentos</option>
          <option value="true">Somente de estabelecimentos</option>
        </select>
        {estabelecimentosFilter === 'true' && (
          <select value={estabelecimentoNome} onChange={(e) => setEstabelecimentoNome(e.target.value)}>
            <option value="">Todos os estabelecimentos</option>
            {estabelecimentosLista.map((e) => (
              <option key={e._id} value={e.nome || ''}>{e.nome || '—'}</option>
            ))}
          </select>
        )}
        {podeEditarCampanha() && (
          <Link to="/demonios/criar"><button type="button" className="primary">Gerar demônio</button></Link>
        )}
      </div>
      {error && <p className="error-msg">{error}</p>}
      {loading && <p>Carregando…</p>}
      {!loading && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Nível</th>
                <th>HP</th>
                <th>Raça</th>
                <th>Observações</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row._id}>
                  <td>{row.nome}</td>
                  <td>{(row.tipo || '—').toString().slice(0, 20)}</td>
                  <td>{(row.nível ?? '—').toString().slice(0, 12)}</td>
                  <td>{row.hp_atual ?? '—'} / {row.hp_total ?? '—'}</td>
                  <td>{(row.raça || '—').toString().slice(0, 15)}</td>
                  <td>{(Array.isArray(row.observacoes) ? row.observacoes.join('; ') : row.observacoes ?? '—').toString().slice(0, 40)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      <button type="button" className="link-like" onClick={() => navigate(`/demonios/${row._id}/ficha`)}>Ficha</button>
                      {podeEditarCampanha() && (
                        <>
                          <button type="button" className="link-like" onClick={() => navigate(`/demonios/${row._id}/interagir`)}>Interagir</button>
                          <button type="button" className="link-like" style={{ color: 'var(--parchment-dark)' }} onClick={() => del(row._id)}>Excluir</button>
                        </>
                      )}
                    </div>
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
