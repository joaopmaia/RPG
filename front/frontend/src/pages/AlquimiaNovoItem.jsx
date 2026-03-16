import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { list, elixirPrevia } from '../api'
import { formatMoedas } from '../utils/formatMoedas'

const MATS = ['vegetal', 'animal', 'mineral', 'demoníaco']
const COR_RARIDADE = { Comum: '#8b7355', Incomum: '#6b8e23', Raro: '#4682b4', Épico: '#9370db', Lendário: '#daa520' }

export default function AlquimiaNovoItem() {
  const [items, setItems] = useState([])
  const [reinos, setReinos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ elixir_id: '', tipo_material: 'vegetal', reino_id: '' })
  const [previa, setPrevia] = useState(null)
  const [previaLoading, setPreviaLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([list('alquimia'), list('reinos')])
      .then(([a, r]) => {
        setItems(Array.isArray(a) ? a : [])
        setReinos(Array.isArray(r) ? r : [])
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const calcularPrevia = () => {
    if (!form.elixir_id) {
      setError('Selecione um elixir.')
      return
    }
    setPreviaLoading(true)
    setError(null)
    elixirPrevia({
      elixir_id: form.elixir_id,
      tipo_material: form.tipo_material,
      reino_id: form.reino_id || undefined,
    })
      .then(setPrevia)
      .catch((e) => setError(e.message))
      .finally(() => setPreviaLoading(false))
  }

  if (loading) return <p>Carregando…</p>

  return (
    <div>
      <h1>Novo item (elixir + matéria-prima + reino)</h1>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/alquimia" className="button">← Voltar à lista de alquimia</Link>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start', marginTop: '1rem' }}>
        <div className="card" style={{ flex: '1 1 320px', maxWidth: '480px', minWidth: 0 }}>
          <div className="form-row">
            <label>Elixir</label>
            <select value={form.elixir_id} onChange={(e) => setForm({ ...form, elixir_id: e.target.value })}>
              <option value="">Selecione o elixir</option>
              {items.map((el) => (
                <option key={el._id} value={el._id} title={el.efeito || ''}>
                  {el.nome}{el.efeito ? ` — ${(el.efeito || '').slice(0, 50)}${(el.efeito || '').length > 50 ? '…' : ''}` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label>Tipo de matéria-prima</label>
            <select value={form.tipo_material} onChange={(e) => setForm({ ...form, tipo_material: e.target.value })}>
              {MATS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label>Reino (influencia o preço)</label>
            <select value={form.reino_id} onChange={(e) => setForm({ ...form, reino_id: e.target.value })}>
              <option value="">Nenhum</option>
              {reinos.map((r) => (
                <option key={r._id} value={r._id}>{r.nome}</option>
              ))}
            </select>
          </div>
          {error && <p className="error-msg">{error}</p>}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" className="primary" onClick={calcularPrevia} disabled={previaLoading}>
              {previaLoading ? 'Calculando…' : 'Ver preço e estatísticas'}
            </button>
          </div>
        </div>

        {previa && (
          <div className="card" style={{ flex: '0 1 280px', minWidth: 260, background: 'var(--bg-card-hover)', border: `2px solid ${COR_RARIDADE[previa.raridade] || '#8b7355'}` }}>
            <h4 style={{ marginTop: 0 }}>Preço e estatísticas</h4>
            <p><strong>Nome:</strong> {previa.nome}</p>
            <p><strong>Efeito:</strong> {previa.efeito}</p>
            <p><strong>Matéria-prima:</strong> {previa.material} &nbsp; <strong>Raridade:</strong> {previa.raridade}</p>
            <p><strong>Potência:</strong> {previa.potencia}</p>
            <p><strong>Preço:</strong> {formatMoedas(previa.preco)} {previa.reino_nome ? `(reino: ${previa.reino_nome})` : ''}</p>
            {previa.dificuldade_criacao != null && <p><strong>Dificuldade de criação:</strong> {previa.dificuldade_criacao}</p>}
            {previa.dificuldade_extracao_material != null && <p><strong>Dificuldade de extração do material:</strong> {previa.dificuldade_extracao_material}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
