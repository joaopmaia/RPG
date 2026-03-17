import { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { get, update } from '../api'

function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div className="card modal-content" style={{ maxWidth: '360px' }} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  )
}

function rollDice(notation) {
  if (notation == null || notation === '') return 0
  const s = String(notation).trim()
  const withBonus = s.match(/^(\d+)d(\d+)\s*\+\s*(\d+)$/i)
  const simple = s.match(/^(\d+)d(\d+)$/i)
  if (withBonus) {
    const x = parseInt(withBonus[1], 10)
    const y = parseInt(withBonus[2], 10)
    const z = parseInt(withBonus[3], 10)
    let sum = 0
    for (let i = 0; i < x; i++) sum += Math.floor(Math.random() * y) + 1
    return sum + z
  }
  if (simple) {
    const x = parseInt(simple[1], 10)
    const y = parseInt(simple[2], 10)
    let sum = 0
    for (let i = 0; i < x; i++) sum += Math.floor(Math.random() * y) + 1
    return sum
  }
  const num = parseFloat(s.replace(',', '.'))
  return isNaN(num) ? 0 : num
}

function roll1d10Explode() {
  const firstRoll = rollDice('1d10')
  let total = firstRoll
  if (firstRoll === 10) total += rollDice('1d10')
  else if (firstRoll === 1) total -= rollDice('1d10')
  return total
}

const ATRIBUTOS_DEMONIO = [
  { key: 'forca', label: 'Força' },
  { key: 'destreza', label: 'Destreza' },
  { key: 'vitalidade', label: 'Vitalidade' },
  { key: 'inteligencia', label: 'Inteligência' },
  { key: 'espirito', label: 'Espírito' },
  { key: 'carisma', label: 'Carisma' },
  { key: 'percepcao', label: 'Percepção' },
]

const COLLECTION = 'demonios'

export default function InteragirDemonio() {
  const { id } = useParams()
  const location = useLocation()
  const fromPassarNoite = location.state?.fromPassarNoite
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [modalCurar, setModalCurar] = useState(false)
  const [curarVal, setCurarVal] = useState('')
  const [modalDano, setModalDano] = useState(false)
  const [danoVal, setDanoVal] = useState('')
  const [modalDanoDireto, setModalDanoDireto] = useState(false)
  const [danoDiretoVal, setDanoDiretoVal] = useState('')
  const [modalRolarAtributo, setModalRolarAtributo] = useState(false)
  const [atributoSelecionado, setAtributoSelecionado] = useState('')
  const [resultadoRolagem, setResultadoRolagem] = useState(null)
  const [resumoAcao, setResumoAcao] = useState(null)
  const [observacoesOpen, setObservacoesOpen] = useState(true)
  const [ataquesOpen, setAtaquesOpen] = useState(false)
  const [lootOpen, setLootOpen] = useState(false)
  const [novaObservacao, setNovaObservacao] = useState('')
  const [modalAlterarNome, setModalAlterarNome] = useState(false)
  const [novoNome, setNovoNome] = useState('')

  const load = () => {
    setLoading(true)
    setError(null)
    get(COLLECTION, id)
      .then(setDoc)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  const aplicarCurar = () => {
    setError(null)
    const raw = (curarVal || '').trim()
    const v = raw === '' ? NaN : parseInt(raw, 10)
    if (raw === '' || isNaN(v) || v < 0) {
      setError('Digite um valor numérico válido (≥ 0).')
      return
    }
    const hpTotal = parseFloat(doc.hp_total) || 0
    const hpAtual = parseFloat(doc.hp_atual) ?? hpTotal
    const novoHp = Math.min(hpTotal, hpAtual + v)
    const curado = novoHp - hpAtual
    update(COLLECTION, id, { hp_atual: novoHp })
      .then(() => {
        setDoc((p) => (p ? { ...p, hp_atual: novoHp } : null))
        setResumoAcao({ tipo: 'curar', texto: `${doc.nome} foi curado em ${curado} HP. HP atual: ${novoHp} / ${hpTotal}.` })
      })
      .catch((e) => setError(e.message))
  }

  const aplicarDano = () => {
    setError(null)
    const raw = (danoVal || '').trim()
    const val = raw === '' ? NaN : parseFloat(raw.replace(',', '.'))
    if (raw === '' || isNaN(val) || val < 0) {
      setError('Digite um valor numérico válido (≥ 0).')
      return
    }
    const armadura = parseFloat(doc.armadura) || 0
    const danoEfetivo = Math.max(0, val - armadura)
    const hpAtual = parseFloat(doc.hp_atual) ?? 0
    const novoHp = Math.max(0, hpAtual - danoEfetivo)
    update(COLLECTION, id, { hp_atual: novoHp })
      .then(() => {
        setDoc((p) => (p ? { ...p, hp_atual: novoHp } : null))
        setResumoAcao({ tipo: 'dano', texto: `${doc.nome} sofreu ${danoEfetivo} de dano (ataque ${raw} − armadura ${armadura}). HP atual: ${novoHp}.` })
      })
      .catch((e) => setError(e.message))
  }

  const aplicarDanoDireto = () => {
    setError(null)
    const raw = (danoDiretoVal || '').trim()
    const v = raw === '' ? NaN : parseInt(raw, 10)
    if (raw === '' || isNaN(v) || v < 0) {
      setError('Digite um valor numérico válido (≥ 0).')
      return
    }
    const hpAtual = parseFloat(doc.hp_atual) ?? 0
    const novoHp = Math.max(0, hpAtual - v)
    update(COLLECTION, id, { hp_atual: novoHp })
      .then(() => {
        setDoc((p) => (p ? { ...p, hp_atual: novoHp } : null))
        setResumoAcao({ tipo: 'danoDireto', texto: `${doc.nome} sofreu ${v} de dano direto. HP atual: ${novoHp}.` })
      })
      .catch((e) => setError(e.message))
  }

  const pericia = parseFloat(doc?.pericia) || 0
  const aplicarRolarAtributo = () => {
    if (!atributoSelecionado) return
    const val = parseFloat(doc[atributoSelecionado]) || 0
    const d10 = roll1d10Explode()
    const total = val + pericia + d10
    setResultadoRolagem({ valorAtributo: val, d10, total })
  }

  const fecharModalComResumo = () => {
    setResumoAcao(null)
    setModalCurar(false)
    setCurarVal('')
    setModalDano(false)
    setDanoVal('')
    setModalDanoDireto(false)
    setDanoDiretoVal('')
  }

  const adicionarObservacao = () => {
    const txt = novaObservacao.trim()
    if (!txt || !doc) return
    setError(null)
    const obs = Array.isArray(doc.observacoes) ? doc.observacoes : []
    update(COLLECTION, id, { observacoes: [...obs, txt] })
      .then(() => {
        setDoc((p) => (p ? { ...p, observacoes: [...obs, txt] } : null))
        setNovaObservacao('')
      })
      .catch((e) => setError(e.message))
  }

  const removerObservacao = (index) => {
    if (!doc) return
    const obs = Array.isArray(doc.observacoes) ? doc.observacoes : []
    const nova = obs.filter((_, i) => i !== index)
    setError(null)
    update(COLLECTION, id, { observacoes: nova })
      .then(() => setDoc((p) => (p ? { ...p, observacoes: nova } : null)))
      .catch((e) => setError(e.message))
  }

  const aplicarAlterarNome = () => {
    const nome = (novoNome || '').trim()
    if (!nome || !doc) return
    setError(null)
    update(COLLECTION, id, { nome })
      .then(() => {
        setDoc((p) => (p ? { ...p, nome } : null))
        setModalAlterarNome(false)
        setNovoNome('')
      })
      .catch((e) => setError(e.message))
  }

  if (loading) return <p>Carregando…</p>
  if (error && !doc) return <p className="error-msg">{error}</p>
  if (!doc) return <p>Demônio não encontrado.</p>

  const hpAtual = parseFloat(doc.hp_atual) ?? 0
  const estaMorto = hpAtual <= 0

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {fromPassarNoite && (
          <Link to={`/roleplaying/noite/${fromPassarNoite}`}>← Voltar para Passar a Noite</Link>
        )}
        <Link to="/demonios">← Voltar à lista</Link>
        <Link to={`/demonios/${id}/ficha`}><button type="button" className="primary">Visualizar ficha</button></Link>
      </div>

      <div className="card" style={{ marginBottom: '1rem', border: estaMorto ? '2px solid #dc2626' : undefined }}>
        <h2 style={{ marginTop: 0 }}>{doc.nome}</h2>
        {estaMorto && (
          <p style={{ color: '#dc2626', fontWeight: 600, marginBottom: '0.5rem' }}>⚠ Este demônio está morto (HP = 0).</p>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
          <div><strong>HP</strong><br />{doc.hp_atual} / {doc.hp_total}</div>
          <div><strong>Armadura</strong><br />{doc.armadura ?? '—'}</div>
          <div><strong>Perícia</strong><br />+{doc.pericia ?? '—'}</div>
          <div><strong>Tipo / Elemento</strong><br />{doc.tipo ?? '—'}</div>
          <div><strong>Nível</strong><br />{doc.nível ?? '—'}</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
          <button type="button" onClick={() => { setError(null); setModalCurar(true); setCurarVal(''); }}>Curar</button>
          <button type="button" onClick={() => { setError(null); setModalDano(true); setDanoVal(''); }}>Tomar dano</button>
          <button type="button" onClick={() => { setError(null); setModalDanoDireto(true); setDanoDiretoVal(''); }}>Tomar dano direto</button>
          <button type="button" onClick={() => { setError(null); setResultadoRolagem(null); setAtributoSelecionado(''); setModalRolarAtributo(true); }}>Rolar Atributo</button>
          <button type="button" onClick={() => { setModalAlterarNome(true); setNovoNome(doc.nome || ''); }}>Alterar nome</button>
        </div>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {/* Observações */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3 style={{ marginTop: 0, cursor: 'pointer', userSelect: 'none' }} onClick={() => setObservacoesOpen((o) => !o)}>
          {observacoesOpen ? '▼' : '▶'} Observações
        </h3>
        {observacoesOpen && (
          <>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', marginBottom: '0.75rem' }}>
              {(doc.observacoes || []).length === 0 ? (
                <li style={{ color: 'var(--parchment-dark)', fontSize: '0.9rem' }}>Nenhuma observação.</li>
              ) : (
                (doc.observacoes || []).map((obs, idx) => (
                  <li key={idx} style={{ marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ flex: 1, minWidth: 0 }}>{obs}</span>
                    <button type="button" className="link-like" style={{ fontSize: '0.85rem' }} onClick={() => removerObservacao(idx)}>Remover</button>
                  </li>
                ))
              )}
            </ul>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <input type="text" value={novaObservacao} onChange={(e) => setNovaObservacao(e.target.value)} placeholder="Nova observação..." style={{ flex: '1 1 200px', minWidth: 0 }} />
              <button type="button" className="primary" onClick={adicionarObservacao} disabled={!novaObservacao.trim()}>Adicionar</button>
            </div>
          </>
        )}
      </div>

      {/* Ataques */}
      {(doc.ataques && doc.ataques.length > 0) && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3 style={{ marginTop: 0, cursor: 'pointer', userSelect: 'none' }} onClick={() => setAtaquesOpen((o) => !o)}>
            {ataquesOpen ? '▼' : '▶'} Ataques
          </h3>
          {ataquesOpen && (
            <ul style={{ margin: 0, paddingLeft: '1.25rem', listStyle: 'none' }}>
              {doc.ataques.map((a, i) => (
                <li key={i} style={{ marginBottom: '0.75rem', padding: '0.5rem', background: 'var(--bg-card-hover)', borderRadius: 6 }}>
                  {typeof a === 'string' ? (
                    <span>{a}</span>
                  ) : (
                    <>
                      <strong>{a.nome ?? '—'}</strong>
                      {a.desc != null && a.desc !== '' && <div style={{ fontSize: '0.9rem', marginTop: '0.25rem', color: 'var(--parchment-dark)' }}>{a.desc}</div>}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Loot */}
      {(doc.loot && doc.loot.length > 0) && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3 style={{ marginTop: 0, cursor: 'pointer', userSelect: 'none' }} onClick={() => setLootOpen((o) => !o)}>
            {lootOpen ? '▼' : '▶'} Loot
          </h3>
          {lootOpen && (
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
              {doc.loot.map((item, i) => (
                <li key={i} style={{ marginBottom: '0.25rem' }}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Modais */}
      <Modal open={modalCurar} onClose={fecharModalComResumo} title={`Curar — ${doc.nome}`}>
        {resumoAcao?.tipo === 'curar' ? (
          <>
            <p style={{ whiteSpace: 'pre-wrap' }}>{resumoAcao.texto}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="primary" onClick={fecharModalComResumo}>Fechar</button>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>Valor será somado ao HP atual (máx. HP total).</p>
            <div className="form-row">
              <label>Valor de cura</label>
              <input type="text" inputMode="numeric" value={curarVal} onChange={(e) => setCurarVal(e.target.value)} placeholder="0" />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="primary" onClick={aplicarCurar}>Aplicar</button>
              <button type="button" onClick={fecharModalComResumo}>Cancelar</button>
            </div>
          </>
        )}
      </Modal>

      <Modal open={modalDano} onClose={fecharModalComResumo} title={`Tomar dano — ${doc.nome}`}>
        {resumoAcao?.tipo === 'dano' ? (
          <>
            <p style={{ whiteSpace: 'pre-wrap' }}>{resumoAcao.texto}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="primary" onClick={fecharModalComResumo}>Fechar</button>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>Dano efetivo = valor − armadura ({doc.armadura ?? 0}).</p>
            <div className="form-row">
              <label>Valor total de ataque</label>
              <input type="text" inputMode="numeric" value={danoVal} onChange={(e) => setDanoVal(e.target.value)} placeholder="0" />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="primary" onClick={aplicarDano}>Aplicar</button>
              <button type="button" onClick={fecharModalComResumo}>Cancelar</button>
            </div>
          </>
        )}
      </Modal>

      <Modal open={modalDanoDireto} onClose={fecharModalComResumo} title={`Tomar dano direto — ${doc.nome}`}>
        {resumoAcao?.tipo === 'danoDireto' ? (
          <>
            <p style={{ whiteSpace: 'pre-wrap' }}>{resumoAcao.texto}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="primary" onClick={fecharModalComResumo}>Fechar</button>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>Subtrai do HP (ignora armadura).</p>
            <div className="form-row">
              <label>Valor de dano</label>
              <input type="text" inputMode="numeric" value={danoDiretoVal} onChange={(e) => setDanoDiretoVal(e.target.value)} placeholder="0" />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="primary" onClick={aplicarDanoDireto}>Aplicar</button>
              <button type="button" onClick={fecharModalComResumo}>Cancelar</button>
            </div>
          </>
        )}
      </Modal>

      <Modal open={modalRolarAtributo} onClose={() => { setModalRolarAtributo(false); setResultadoRolagem(null); setAtributoSelecionado(''); }} title={`Rolar Atributo — ${doc.nome}`}>
        <div className="form-row">
          <label>Atributo</label>
          <select value={atributoSelecionado} onChange={(e) => setAtributoSelecionado(e.target.value)}>
            <option value="">Selecione</option>
            {ATRIBUTOS_DEMONIO.map((a) => (
              <option key={a.key} value={a.key}>{a.label}: {doc[a.key] ?? '—'}</option>
            ))}
          </select>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>Total = atributo + perícia + 1d10.</p>
        {resultadoRolagem != null && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--bg-card-hover)', borderRadius: 6 }}>
            <strong>Resultado:</strong> {resultadoRolagem.valorAtributo} (atributo) + {pericia} (perícia) + {resultadoRolagem.d10} (1d10) = <strong>{resultadoRolagem.total}</strong>
          </div>
        )}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button type="button" className="primary" onClick={aplicarRolarAtributo} disabled={!atributoSelecionado}>Rolar</button>
          <button type="button" onClick={() => { setModalRolarAtributo(false); setResultadoRolagem(null); setAtributoSelecionado(''); }}>Fechar</button>
        </div>
      </Modal>

      <Modal open={modalAlterarNome} onClose={() => { setModalAlterarNome(false); setNovoNome(''); }} title="Alterar nome">
        <div className="form-row">
          <label>Nome</label>
          <input type="text" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder={doc.nome} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button type="button" className="primary" onClick={aplicarAlterarNome} disabled={!novoNome.trim()}>Salvar</button>
          <button type="button" onClick={() => { setModalAlterarNome(false); setNovoNome(''); }}>Cancelar</button>
        </div>
      </Modal>
    </div>
  )
}
