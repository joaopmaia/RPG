import { useState, useEffect } from 'react'
import { list, get, create, update, remove } from '../api'

const COLLECTION = 'npcs'

export default function NPCs() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [q, setQ] = useState('')
  const [raça, setRaça] = useState('')
  const [natureza, setNatureza] = useState('')
  const [viewing, setViewing] = useState(null)
  const [detail, setDetail] = useState(null)

  const load = () => {
    setLoading(true)
    setError(null)
    list(COLLECTION, { q: q || undefined, raça: raça || undefined, natureza: natureza || undefined })
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [q, raça, natureza])

  const openView = (id) => {
    get(COLLECTION, id).then((data) => {
      setDetail(data)
      setViewing(id)
    }).catch((e) => setError(e.message))
  }

  const del = (id) => {
    if (confirm('Remover este NPC?')) remove(COLLECTION, id).then(load).catch((e) => setError(e.message))
  }

  return (
    <div>
      <h1>NPCs</h1>
      <div className="filters">
        <input placeholder="Buscar por nome, tipo ou raça" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={raça} onChange={(e) => setRaça(e.target.value)}>
          <option value="">Todas as raças</option>
          {['Vaelthor', 'Drovenar', 'Sylmari', 'Gorvash', 'Sharusahk'].map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={natureza} onChange={(e) => setNatureza(e.target.value)}>
          <option value="">Todas</option>
          <option value="Neutro">Neutro</option>
          <option value="Bom">Bom</option>
          <option value="Mal">Mal</option>
        </select>
      </div>
      {error && <p className="error-msg">{error}</p>}
      {loading && <p>Carregando…</p>}
      {!loading && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Raça</th>
                <th>Tipo</th>
                <th>Nível</th>
                <th>Natureza</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row._id}>
                  <td>{row.nome}</td>
                  <td>{row.raça}</td>
                  <td>{(row.tipo || '').slice(0, 25)}</td>
                  <td>{row.nível}</td>
                  <td>{row.natureza}</td>
                  <td>
                    <button type="button" onClick={() => openView(row._id)}>Ver</button>
                    {' '}
                    <button type="button" onClick={() => del(row._id)}>Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewing && detail && (
        <div className="card" style={{ marginTop: '1rem', maxWidth: '640px' }}>
          <h3>Ficha: {detail.nome}</h3>
          <p><strong>Raça:</strong> {detail.raça} &nbsp; <strong>Tipo:</strong> {detail.tipo}</p>
          <p><strong>Nível:</strong> {detail.nível} &nbsp; <strong>Natureza:</strong> {detail.natureza}</p>
          <p><strong>HP:</strong> {detail.hp_atual} / {detail.hp_total} &nbsp; <strong>Arcana:</strong> {detail.arcana_atual} / {detail.arcana_total} &nbsp; <strong>Perícia:</strong> +{detail.pericia}</p>
          <p><strong>Atributos:</strong> Força {detail.forca}, Destreza {detail.destreza}, Vitalidade {detail.vitalidade}, Inteligência {detail.inteligencia}, Carisma {detail.carisma}, Espírito {detail.espirito}, Percepção {detail.percepcao}</p>
          <p><strong>Armas:</strong> {detail.arma1 || '-'} / {detail.arma2 || '-'} &nbsp; <strong>Armadura:</strong> {detail.armadura || '-'} &nbsp; <strong>Escudo:</strong> {detail.escudo || '-'}</p>
          <p><strong>Runas:</strong> {(detail.runas || []).join(', ') || '-'}</p>
          <p><strong>Elixires:</strong> {(detail.elixir || []).join(', ') || '-'}</p>
          <p><strong>Moedas:</strong> {detail.moedas}</p>
          <p><strong>Observações:</strong> {Array.isArray(detail.observacoes) ? detail.observacoes.join('; ') : detail.observacoes || '-'}</p>
          <button type="button" onClick={() => { setViewing(null); setDetail(null); }}>Fechar</button>
        </div>
      )}
    </div>
  )
}
