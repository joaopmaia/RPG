import { useState, useEffect, useMemo, useRef } from 'react'
import { list } from '../api'

const COLLECTION = 'runas'

const ELEMENTOS = ['Genia', 'Degila', 'Reetear', 'Arunalt', 'Saltrat', 'Pascalia']

const ELEMENTOS_OPOSTOS = {
  Genia: 'Degila',
  Degila: 'Genia',
  Reetear: 'Arunalt',
  Arunalt: 'Reetear',
  Saltrat: 'Pascalia',
  Pascalia: 'Saltrat',
}

const ELEMENTO_IMAGEM = {
  Genia: '/elementos/genia.png',
  Degila: '/elementos/degila.png',
  Reetear: '/elementos/reetear.png',
  Arunalt: '/elementos/arunalt.png',
  Saltrat: '/elementos/saltrat.png',
  Pascalia: '/elementos/pascalia.png',
}

const TIERS = [
  { value: '', label: 'Todos os tiers' },
  { value: 'Básico', label: 'Básico' },
  { value: 'Intermediário', label: 'Intermediário' },
  { value: 'Superior', label: 'Superior' },
]

function normalizeElementos(arr) {
  if (!Array.isArray(arr)) return []
  return [...arr].filter(Boolean).map((e) => String(e).trim())
}

function runaMatchesSelected(runa, selectedSet) {
  const elem = normalizeElementos(runa.elementos)
  if (elem.length === 0) return false
  return elem.every((e) => selectedSet.has(e))
}

function groupRunasByTier(runas, selectedList) {
  const selectedSet = new Set(selectedList)
  const basicas = runas.filter((r) => {
    const e = normalizeElementos(r.elementos)
    return e.length === 1 && runaMatchesSelected(r, selectedSet)
  })
  const intermediarias = runas.filter((r) => {
    const e = normalizeElementos(r.elementos)
    return e.length === 2 && runaMatchesSelected(r, selectedSet)
  })
  const avancadas = runas.filter((r) => {
    const e = normalizeElementos(r.elementos)
    return e.length === 3 && runaMatchesSelected(r, selectedSet)
  })
  return { basicas, intermediarias, avancadas }
}

function groupBasicasByElemento(runas) {
  const byElem = {}
  runas.forEach((r) => {
    const e = normalizeElementos(r.elementos)
    const key = e[0]
    if (!key) return
    if (!byElem[key]) byElem[key] = []
    byElem[key].push(r)
  })
  return byElem
}

function groupIntermediariasByPar(runas) {
  const byPar = {}
  runas.forEach((r) => {
    const e = normalizeElementos(r.elementos)
    if (e.length !== 2) return
    const key = [e[0], e[1]].sort().join(',')
    if (!byPar[key]) byPar[key] = []
    byPar[key].push(r)
  })
  return byPar
}

export default function Runas() {
  const [runas, setRunas] = useState([])
  const [runeNames, setRuneNames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [q, setQ] = useState('')
  const [tier, setTier] = useState('')
  const [selectedElements, setSelectedElements] = useState([])
  const [openBasicas, setOpenBasicas] = useState(true)
  const [openIntermediarias, setOpenIntermediarias] = useState(true)
  const [openAvancadas, setOpenAvancadas] = useState(true)
  const [openSub, setOpenSub] = useState({})
  const [autocompleteOpen, setAutocompleteOpen] = useState(false)
  const autocompleteRef = useRef(null)

  const loadRunas = (params) => {
    setLoading(true)
    setError(null)
    list(COLLECTION, params)
      .then((data) => {
        const arr = Array.isArray(data) ? data : []
        setRunas(arr)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    list(COLLECTION, {})
      .then((data) => {
        const arr = Array.isArray(data) ? data : []
        const names = [...new Set(arr.map((r) => r.nome).filter(Boolean))].sort()
        setRuneNames(names)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    loadRunas({ q: q || undefined, tier: tier || undefined })
  }, [q, tier])

  const toggleElement = (elem) => {
    const opposite = ELEMENTOS_OPOSTOS[elem]
    setSelectedElements((prev) => {
      if (prev.includes(elem)) return prev.filter((e) => e !== elem)
      if (opposite && prev.includes(opposite)) return prev
      return [...prev, elem]
    })
  }

  const isElementDisabled = (elem) => {
    const opposite = ELEMENTOS_OPOSTOS[elem]
    return opposite != null && selectedElements.includes(opposite)
  }

  const isElementSelected = (elem) => selectedElements.includes(elem)

  const autocompleteOptions = useMemo(() => {
    const term = (q || '').trim().toLowerCase()
    if (!term) return runeNames.slice(0, 50)
    return runeNames.filter((n) => n.toLowerCase().includes(term)).slice(0, 20)
  }, [q, runeNames])

  const { basicas, intermediarias, avancadas } = useMemo(() => {
    if (selectedElements.length === 0) return { basicas: [], intermediarias: [], avancadas: [] }
    return groupRunasByTier(runas, selectedElements)
  }, [runas, selectedElements])

  const basicasByElem = useMemo(() => groupBasicasByElemento(basicas), [basicas])
  const intermediariasByPar = useMemo(() => groupIntermediariasByPar(intermediarias), [intermediarias])

  const toggleSub = (key) => {
    setOpenSub((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const selectedSet = useMemo(() => new Set(selectedElements), [selectedElements])
  const hasAnyRuna = basicas.length > 0 || intermediarias.length > 0 || avancadas.length > 0

  return (
    <div className="runas-page">
      <h1>Runas</h1>

      <div className="filters" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end', marginBottom: '1rem' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0 }}>
          <input
            type="text"
            placeholder="Buscar por nome"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setAutocompleteOpen(true)}
            onBlur={() => setTimeout(() => setAutocompleteOpen(false), 180)}
            aria-autocomplete="list"
            aria-expanded={autocompleteOpen && autocompleteOptions.length > 0}
          />
          {autocompleteOpen && autocompleteOptions.length > 0 && (
            <ul
              ref={autocompleteRef}
              className="autocomplete-list"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                margin: 0,
                padding: '0.25rem 0',
                listStyle: 'none',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-frame)',
                borderRadius: 6,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 100,
                maxHeight: 220,
                overflowY: 'auto',
              }}
            >
              {autocompleteOptions.map((name) => (
                <li
                  key={name}
                  onMouseDown={() => {
                    setQ(name)
                    setAutocompleteOpen(false)
                  }}
                  style={{
                    padding: '0.4rem 0.75rem',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                  className="autocomplete-item"
                >
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <select value={tier} onChange={(e) => setTier(e.target.value)}>
          {TIERS.map((t) => (
            <option key={t.value || 'all'} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <p style={{ color: 'var(--parchment-dark)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
        Selecione um ou mais elementos para filtrar as runas. Elementos opostos não podem ser selecionados juntos.
      </p>

      <div className="runas-elementos-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {ELEMENTOS.map((elem) => {
          const selected = isElementSelected(elem)
          const disabled = isElementDisabled(elem)
          return (
            <div
              key={elem}
              title={disabled ? 'Elementos opostos não podem se misturar' : undefined}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.5rem',
                minWidth: 80,
                border: selected
                  ? '3px solid #e6d84a'
                  : disabled
                    ? '3px solid #dc2626'
                    : '2px solid var(--border-frame)',
                borderRadius: 10,
                background: selected ? 'rgba(230, 216, 74, 0.15)' : disabled ? 'rgba(220, 38, 38, 0.08)' : 'var(--bg-card)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.85 : 1,
              }}
              onClick={() => !disabled && toggleElement(elem)}
            >
              <img
                src={ELEMENTO_IMAGEM[elem]}
                alt={elem}
                style={{ width: 48, height: 48, objectFit: 'contain', pointerEvents: 'none' }}
              />
              <span style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>{elem}</span>
              {selected && (
                <span
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#e6d84a',
                    color: '#1a1a1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                  aria-hidden
                >
                  ✓
                </span>
              )}
              {disabled && (
                <span
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#dc2626',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                  title="Elementos opostos não podem se misturar"
                  aria-hidden
                >
                  ✕
                </span>
              )}
            </div>
          )
        })}
      </div>

      {error && <p className="error-msg">{error}</p>}
      {loading && <p>Carregando…</p>}

      {!loading && selectedElements.length === 0 && (
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--parchment-dark)' }}>
          Selecione um ou mais elementos acima para ver as runas disponíveis.
        </div>
      )}

      {!loading && selectedElements.length > 0 && !hasAnyRuna && (
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--parchment-dark)' }}>
          Nenhuma runa encontrada para os elementos selecionados com os filtros atuais.
        </div>
      )}

      {!loading && selectedElements.length > 0 && hasAnyRuna && (
        <div className="runas-result">
          {/* Runas Básicas */}
          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3
              style={{ marginTop: 0, cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => setOpenBasicas((o) => !o)}
            >
              <span>{openBasicas ? '▼' : '▶'}</span> Runas Básicas
            </h3>
            {openBasicas && (
              <div style={{ marginTop: '0.5rem' }}>
                {Object.entries(basicasByElem).map(([elem, listRunas]) => {
                  const subKey = `basicas-${elem}`
                  const isOpen = openSub[subKey] !== false
                  return (
                    <div key={subKey} style={{ marginBottom: '0.75rem' }}>
                      <h4
                        style={{ cursor: 'pointer', userSelect: 'none', margin: '0.5rem 0', fontSize: '1rem' }}
                        onClick={() => toggleSub(subKey)}
                      >
                        {isOpen ? '▼' : '▶'} Runas Básicas — {elem}
                      </h4>
                      {isOpen && (
                        <ul style={{ margin: 0, paddingLeft: '1.25rem', listStyle: 'none' }}>
                          {listRunas.map((runa) => (
                            <li key={runa._id} style={{ marginBottom: '0.75rem' }}>
                              <RunaCard runa={runa} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Runas Intermediárias */}
          {intermediarias.length > 0 && (
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3
                style={{ marginTop: 0, cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onClick={() => setOpenIntermediarias((o) => !o)}
              >
                <span>{openIntermediarias ? '▼' : '▶'}</span> Runas Intermediárias
              </h3>
              {openIntermediarias && (
                <div style={{ marginTop: '0.5rem' }}>
                  {Object.entries(intermediariasByPar).map(([parKey, listRunas]) => {
                    const label = parKey.split(',').join(' + ')
                    const subKey = `inter-${parKey}`
                    const isOpen = openSub[subKey] !== false
                    return (
                      <div key={subKey} style={{ marginBottom: '0.75rem' }}>
                        <h4
                          style={{ cursor: 'pointer', userSelect: 'none', margin: '0.5rem 0', fontSize: '1rem' }}
                          onClick={() => toggleSub(subKey)}
                        >
                          {isOpen ? '▼' : '▶'} Runas Intermediárias — {label}
                        </h4>
                        {isOpen && (
                          <ul style={{ margin: 0, paddingLeft: '1.25rem', listStyle: 'none' }}>
                            {listRunas.map((runa) => (
                              <li key={runa._id} style={{ marginBottom: '0.75rem' }}>
                                <RunaCard runa={runa} />
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Runas Avançadas */}
          {avancadas.length > 0 && (
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3
                style={{ marginTop: 0, cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onClick={() => setOpenAvancadas((o) => !o)}
              >
                <span>{openAvancadas ? '▼' : '▶'}</span> Runas Avançadas
                {selectedElements.length === 3 && (
                  <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: 'var(--parchment-dark)' }}>
                    ({selectedElements.join(', ')})
                  </span>
                )}
              </h3>
              {openAvancadas && (
                <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem', listStyle: 'none' }}>
                  {avancadas.map((runa) => (
                    <li key={runa._id} style={{ marginBottom: '0.75rem' }}>
                      <RunaCard runa={runa} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function RunaCard({ runa }) {
  return (
    <div
      className="runa-card"
      style={{
        padding: '0.75rem 1rem',
        background: 'var(--bg-card-hover)',
        borderRadius: 8,
        border: '1px solid var(--border-frame)',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: '0.35rem' }}>{runa.nome || '—'}</div>
      {runa.efeito && (
        <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
          <strong>Efeito:</strong> {runa.efeito}
        </p>
      )}
      {runa.bonus && (
        <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
          <strong>Bônus:</strong> {runa.bonus}
        </p>
      )}
      {runa.descricao && (
        <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>
          {runa.descricao}
        </p>
      )}
    </div>
  )
}
