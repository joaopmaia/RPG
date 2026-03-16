import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { list, equipamentoPrevia } from '../api'
import { formatMoedas } from '../utils/formatMoedas'

const ELEMENTOS = ['Genia', 'Degila', 'Reetear', 'Arunalt', 'Saltrat', 'Pascalia']
const ELEMENTO_IMAGEM = {
  Degila: '/elementos/degila.png',
  Genia: '/elementos/genia.png',
  Arunalt: '/elementos/arunalt.png',
  Saltrat: '/elementos/saltrat.png',
  Reetear: '/elementos/reetear.png',
  Pascalia: '/elementos/pascalia.png',
}
const COR_MATERIAL = { Comum: '#8b7355', Incomum: '#6b8e23', Raro: '#4682b4', Épico: '#9370db', Lendário: '#daa520' }
const TIER_OPCOES = [
  { value: 'Básico', label: 'Runas básicas (1 elemento)', numElementos: 1 },
  { value: 'Intermediário', label: 'Runas intermediárias (2 elementos)', numElementos: 2 },
  { value: 'Superior', label: 'Runas avançadas (3 elementos)', numElementos: 3 },
]

export default function ArmasNovoItem() {
  const [items, setItems] = useState([])
  const [materiais, setMateriais] = useState([])
  const [reinos, setReinos] = useState([])
  const [runasFiltradas, setRunasFiltradas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ item_id: '', material_id: '', reino_id: '', runa_ids: [] })
  const [temRuna, setTemRuna] = useState(false)
  const [tierRuna, setTierRuna] = useState('')
  const [elementosParaRuna, setElementosParaRuna] = useState([])
  const [runasAdicionadasDetalhe, setRunasAdicionadasDetalhe] = useState([])
  const [previa, setPrevia] = useState(null)
  const [previaLoading, setPreviaLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      list('armas'),
      list('materiais'),
      list('reinos'),
    ])
      .then(([a, m, r]) => {
        setItems(a || [])
        setMateriais(m || [])
        setReinos(r || [])
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const numElementosRequeridos = tierRuna ? (TIER_OPCOES.find((t) => t.value === tierRuna)?.numElementos ?? 1) : 0

  useEffect(() => {
    if (!temRuna || !tierRuna || elementosParaRuna.length !== numElementosRequeridos) {
      setRunasFiltradas([])
      return
    }
    const params = { tier: tierRuna, elemento: elementosParaRuna }
    list('runas', params)
      .then((data) => setRunasFiltradas(Array.isArray(data) ? data : []))
      .catch(() => setRunasFiltradas([]))
  }, [temRuna, tierRuna, elementosParaRuna, numElementosRequeridos])

  const setElementoParaRuna = (index, elem) => {
    setElementosParaRuna((prev) => {
      const next = [...prev]
      next[index] = elem
      return next.slice(0, numElementosRequeridos)
    })
  }

  const toggleElementoImagem = (elem) => {
    setElementosParaRuna((prev) => {
      if (prev.includes(elem)) return prev.filter((e) => e !== elem)
      if (prev.length >= numElementosRequeridos) return prev
      return [...prev, elem].slice(0, numElementosRequeridos)
    })
  }

  const toggleRunaNoEquipamento = (runaId) => {
    const r = runasFiltradas.find((x) => x._id === runaId)
    setForm((prev) => {
      const ids = prev.runa_ids || []
      const has = ids.includes(runaId)
      return { ...prev, runa_ids: has ? ids.filter((x) => x !== runaId) : [...ids, runaId] }
    })
    setRunasAdicionadasDetalhe((prev) => {
      const has = prev.some((x) => x._id === runaId)
      if (has) return prev.filter((x) => x._id !== runaId)
      return r ? [...prev, r] : prev
    })
  }

  const calcularPrevia = () => {
    if (!form.item_id || !form.material_id) {
      setError('Selecione uma arma e um material.')
      return
    }
    setPreviaLoading(true)
    setError(null)
    equipamentoPrevia({
      tipo: 'arma',
      item_id: form.item_id,
      material_id: form.material_id,
      reino_id: form.reino_id || undefined,
      runa_ids: form.runa_ids || [],
    })
      .then(setPrevia)
      .catch((e) => setError(e.message))
      .finally(() => setPreviaLoading(false))
  }

  if (loading) return <p>Carregando…</p>

  return (
    <div>
      <h1>Novo item (arma + material + runas)</h1>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/armas" className="button">← Voltar à lista de armas</Link>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start', marginTop: '1rem' }}>
      <div className="card" style={{ flex: '1 1 320px', maxWidth: '560px', minWidth: 0 }}>
        <div className="form-row">
          <label>Arma</label>
          <select value={form.item_id} onChange={(e) => setForm({ ...form, item_id: e.target.value })}>
            <option value="">Selecione a arma</option>
            {items.map((a) => (
              <option key={a._id} value={a._id}>{a.nome} ({a.tipo})</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>Material</label>
          <select value={form.material_id} onChange={(e) => setForm({ ...form, material_id: e.target.value })}>
            <option value="">Selecione o material</option>
            {materiais.map((m) => (
              <option key={m._id} value={m._id}>{m.material} ({m.raridade})</option>
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

        <div className="card" style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-card-hover)', border: '1px solid var(--border-frame)', borderRadius: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
            <input type="checkbox" checked={temRuna} onChange={(e) => { setTemRuna(e.target.checked); if (!e.target.checked) setForm((f) => ({ ...f, runa_ids: [] })); setRunasAdicionadasDetalhe([]); setTierRuna(''); setElementosParaRuna([]); }} />
            Este equipamento terá runa(s)
          </label>
          {!temRuna && <p style={{ fontSize: '0.85rem', color: 'var(--parchment-dark)', marginTop: '0.35rem', marginLeft: '1.5rem' }}>Marque para adicionar runas ao equipamento.</p>}
        </div>

        {temRuna && (
          <>
            <div className="form-row">
              <label>Tier da runa</label>
              <select value={tierRuna} onChange={(e) => { setTierRuna(e.target.value); setElementosParaRuna([]); }}>
                <option value="">Selecione o tier</option>
                {TIER_OPCOES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {tierRuna && numElementosRequeridos > 0 && (
              <div className="form-row">
                <label>Clique nos elementos ({numElementosRequeridos} {numElementosRequeridos === 1 ? 'elemento' : 'elementos'})</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {ELEMENTOS.map((elem) => (
                    <button
                      key={elem}
                      type="button"
                      onClick={() => toggleElementoImagem(elem)}
                      title={elem}
                      style={{
                        padding: 4,
                        border: elementosParaRuna.includes(elem) ? '2px solid var(--accent)' : '1px solid var(--border-frame)',
                        borderRadius: 8,
                        background: elementosParaRuna.includes(elem) ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                        cursor: 'pointer',
                      }}
                    >
                      <img src={ELEMENTO_IMAGEM[elem]} alt={elem} style={{ width: 40, height: 40, objectFit: 'contain', display: 'block' }} />
                      <span style={{ fontSize: '0.7rem', display: 'block' }}>{elem}</span>
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {Array.from({ length: numElementosRequeridos }, (_, i) => (
                    <select
                      key={i}
                      value={elementosParaRuna[i] || ''}
                      onChange={(e) => setElementoParaRuna(i, e.target.value)}
                      style={{ minWidth: '120px' }}
                    >
                      <option value="">Slot {i + 1}</option>
                      {ELEMENTOS.filter((el) => !elementosParaRuna.includes(el) || elementosParaRuna[i] === el).map((el) => (
                        <option key={el} value={el}>{el}</option>
                      ))}
                    </select>
                  ))}
                </div>
              </div>
            )}

            {runasFiltradas.length > 0 && (
              <div className="form-row">
                <label>Marque as runas que deseja no equipamento (pode marcar e desmarcar)</label>
                <div style={{ maxHeight: '260px', overflowY: 'auto', border: '1px solid var(--border-frame)', borderRadius: 8, padding: '0.5rem', background: 'var(--bg-card)' }}>
                  {runasFiltradas.map((r) => {
                    const checked = (form.runa_ids || []).includes(r._id)
                    return (
                      <label
                        key={r._id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.5rem',
                          padding: '0.5rem',
                          marginBottom: '0.25rem',
                          borderRadius: 6,
                          background: checked ? 'var(--bg-card-hover)' : 'transparent',
                          cursor: 'pointer',
                          border: checked ? '2px solid var(--accent)' : '1px solid transparent',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleRunaNoEquipamento(r._id)}
                          style={{ marginTop: '0.25rem', flexShrink: 0 }}
                        />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{r.nome}</span>
                          <span className="badge" style={{ marginLeft: '0.25rem' }}>{r.tier}</span>
                          {r.efeito && <div style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}><strong>Efeito:</strong> {r.efeito}</div>}
                          {r.descricao && <div style={{ fontSize: '0.8rem', color: 'var(--parchment-dark)', marginTop: '0.1rem' }}>{r.descricao}</div>}
                        </div>
                      </label>
                    )
                  })}
                </div>
                {runasAdicionadasDetalhe.length > 0 && (
                  <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--parchment-dark)' }}>
                    {runasAdicionadasDetalhe.length} runa(s) selecionada(s) — desmarque na lista acima para remover.
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {error && <p className="error-msg">{error}</p>}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button type="button" className="primary" onClick={calcularPrevia} disabled={previaLoading}>
            {previaLoading ? 'Calculando…' : 'Ver estatísticas e preço'}
          </button>
        </div>
      </div>

        {previa && (
          <div className="card" style={{ flex: '0 1 280px', minWidth: 260, background: 'var(--bg-card-hover)', border: `2px solid ${COR_MATERIAL[previa.raridade] || '#8b7355'}` }}>
            <h4 style={{ marginTop: 0 }}>Preço e estatísticas</h4>
            <p><strong>Nome:</strong> {previa.nome}</p>
            <p><strong>Tipo:</strong> {previa.tipo}</p>
            <p><strong>Material:</strong> {previa.material} ({previa.raridade})</p>
            {previa.runas?.length > 0 && (
              <div><strong>Runas equipadas:</strong>
                <ul style={{ margin: '0.25rem 0 0 1rem', paddingLeft: '0.5rem' }}>
                  {previa.runas.map((r, i) => (
                    <li key={i}>
                      {r.nome} <span className="badge">{r.tier}</span>
                      {r.efeito && <><br /><span style={{ fontSize: '0.9rem' }}>• {r.efeito}</span></>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {previa.dano != null && <p><strong>Dano:</strong> {previa.dano}</p>}
            <p><strong>Peso:</strong> {previa.peso}</p>
            <p><strong>Durabilidade:</strong> {previa.durabilidade}</p>
            <p><strong>Preço:</strong> {formatMoedas(previa.preco)} {previa.reino_nome ? `(reino: ${previa.reino_nome})` : ''}</p>
            {previa.dificuldade_criacao != null && <p><strong>Dificuldade de criação:</strong> {previa.dificuldade_criacao}</p>}
            {previa.dificuldade_extracao_material != null && <p><strong>Dificuldade de extração do material:</strong> {previa.dificuldade_extracao_material}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
