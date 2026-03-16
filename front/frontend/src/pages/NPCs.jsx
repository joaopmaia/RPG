import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { list, get, update, create, remove, getNpcCompleto, uploadImagem } from '../api'

const COLLECTION = 'npcs'

export default function NPCs() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [q, setQ] = useState('')
  const [raça, setRaça] = useState('')
  const [natureza, setNatureza] = useState('')
  const [expandido, setExpandido] = useState(null)
  const [detalheCompleto, setDetalheCompleto] = useState(null)
  const [menuAberto, setMenuAberto] = useState(null)
  const [modalObservacoes, setModalObservacoes] = useState(null)
  const [modalObservacao, setModalObservacao] = useState(null)
  const [modalImagem, setModalImagem] = useState(null)
  const [novaObservacao, setNovaObservacao] = useState('')
  const [novaImagemUrl, setNovaImagemUrl] = useState('')
  const [novaImagemFile, setNovaImagemFile] = useState(null)
  const [acaoError, setAcaoError] = useState(null)

  const load = () => {
    setLoading(true)
    setError(null)
    list(COLLECTION, { q: q || undefined, raça: raça || undefined, natureza: natureza || undefined })
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [q, raça, natureza])

  const toggleExpandir = (id) => {
    if (expandido === id) {
      setExpandido(null)
      setDetalheCompleto(null)
      setMenuAberto(null)
      return
    }
    setExpandido(id)
    setDetalheCompleto(null)
    getNpcCompleto(id)
      .then(setDetalheCompleto)
      .catch((e) => setError(e.message))
  }

  const toggleMenu = (id) => {
    setMenuAberto(menuAberto === id ? null : id)
  }

  const del = (id) => {
    if (confirm('Remover este NPC e seus equipamentos/elixires vinculados?')) {
      remove(COLLECTION, id).then(() => { setExpandido(null); setDetalheCompleto(null); setMenuAberto(null); load() }).catch((e) => setError(e.message))
    }
  }

  const salvarObservacao = () => {
    if (!modalObservacao?.npcId || !novaObservacao.trim()) return
    setAcaoError(null)
    get(COLLECTION, modalObservacao.npcId)
      .then((npc) => {
        const obs = Array.isArray(npc.observacoes) ? npc.observacoes : []
        return update(COLLECTION, modalObservacao.npcId, { observacoes: [...obs, novaObservacao.trim()] })
      })
      .then(() => {
        setModalObservacao(null)
        setNovaObservacao('')
        load()
      })
      .catch((e) => setAcaoError(e.message))
  }

  const salvarImagem = () => {
    if (!modalImagem?.npcId) return
    if (!novaImagemFile && !novaImagemUrl.trim()) return
    setAcaoError(null)
    if (novaImagemFile) {
      uploadImagem('npc', modalImagem.npcId, novaImagemFile)
        .then(() => {
          setModalImagem(null)
          setNovaImagemUrl('')
          setNovaImagemFile(null)
          load()
        })
        .catch((e) => setAcaoError(e.message))
      return
    }
    const payload = { tabela: 'npc', identificador: modalImagem.npcId, url: novaImagemUrl.trim() }
    list('imagens', { tabela: 'npc', identificador: modalImagem.npcId })
      .then((arr) => {
        if (arr && arr.length > 0) {
          return update('imagens', arr[0]._id, { url: novaImagemUrl.trim() })
        }
        return create('imagens', payload)
      })
      .then(() => {
        setModalImagem(null)
        setNovaImagemUrl('')
        load()
      })
      .catch((e) => setAcaoError(e.message))
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
        <Link to="/npcs/criar"><button type="button" className="primary">Criar NPC</button></Link>
      </div>
      {error && <p className="error-msg">{error}</p>}
      {loading && <p>Carregando…</p>}
      {!loading && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: '28px' }}></th>
                <th>Nome</th>
                <th>Raça</th>
                <th>Tipo</th>
                <th>Nível</th>
                <th>Natureza</th>
                <th>Observações</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <React.Fragment key={row._id}>
                  <tr>
                    <td>
                      <button type="button" onClick={() => toggleExpandir(row._id)} title={expandido === row._id ? 'Recolher' : 'Expandir'}>
                        {expandido === row._id ? '▼' : '▶'}
                      </button>
                    </td>
                    <td>{row.nome}</td>
                    <td>{row.raça}</td>
                    <td>{(row.tipo || '').slice(0, 25)}</td>
                    <td>{row.nível}</td>
                    <td>{row.natureza}</td>
                    <td>
                      {(() => {
                        const obs = row.observacoes || []
                        const text = Array.isArray(obs) ? obs.join(' • ') : String(obs)
                        const isLong = text.length > 40
                        if (!text) return '—'
                        if (isLong) {
                          return (
                            <>
                              <span>{text.slice(0, 40)}…</span>
                              <button type="button" className="link-like" onClick={() => setModalObservacoes({ nome: row.nome, observacoes: obs })} style={{ marginLeft: '0.25rem' }}>Ver todas</button>
                            </>
                          )
                        }
                        return text
                      })()}
                    </td>
                    <td>
                      <div className="npc-acoes-wrap" style={{ position: 'relative', display: 'inline-block' }}>
                        <button type="button" onClick={() => toggleMenu(menuAberto === row._id ? null : row._id)}>Ações ▾</button>
                        {menuAberto === row._id && (
                          <>
                            <div className="npc-acoes-backdrop" style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuAberto(null)} aria-hidden="true" />
                            <div className="npc-acoes-menu card" style={{ position: 'absolute', right: 0, top: '100%', marginTop: '2px', minWidth: '200px', zIndex: 100, padding: '0.5rem 0' }}>
                              <button type="button" className="npc-acoes-btn" onClick={() => { setMenuAberto(null); navigate(`/npcs/${row._id}/ficha`); }}>Ver ficha completa</button>
                              <button type="button" className="npc-acoes-btn" onClick={() => { setMenuAberto(null); navigate(`/npcs/${row._id}/editar`); }}>Editar NPC</button>
                              <button type="button" className="npc-acoes-btn" onClick={() => { setModalObservacao({ npcId: row._id, nome: row.nome }); setMenuAberto(null); setNovaObservacao(''); setAcaoError(null); }}>Adicionar observação</button>
                              <button type="button" className="npc-acoes-btn" onClick={() => { setModalImagem({ npcId: row._id, nome: row.nome }); setNovaImagemUrl(''); setNovaImagemFile(null); setAcaoError(null); }}>Adicionar imagem</button>
                              <button type="button" className="npc-acoes-btn" onClick={() => { setMenuAberto(null); navigate(`/npcs/${row._id}/interagir`); }}>Interagir com NPC</button>
                              <hr style={{ borderColor: 'var(--border-frame)', margin: '0.25rem 0' }} />
                              <button type="button" className="npc-acoes-btn" style={{ color: 'var(--parchment-dark)' }} onClick={() => { setMenuAberto(null); del(row._id); }}>Excluir NPC</button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandido === row._id && (
                    <tr key={`${row._id}-exp`}>
                      <td colSpan={8} style={{ padding: '0.5rem 0.75rem', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border-frame)' }}>
                        {!detalheCompleto && <span>Carregando…</span>}
                        {detalheCompleto && (
                          <div style={{ fontSize: '0.95rem' }}>
                            <p style={{ margin: '0 0 0.5rem' }}><strong>HP</strong> {detalheCompleto.hp_atual}/{detalheCompleto.hp_total} &nbsp; <strong>Arcana</strong> {detalheCompleto.arcana_atual}/{detalheCompleto.arcana_total} &nbsp; <strong>Perícia</strong> +{detalheCompleto.pericia}</p>
                            <p style={{ margin: '0 0 0.5rem' }}><strong>Equipamentos:</strong> {(detalheCompleto.equipamentos || []).map((e) => e.nome).join(', ') || '—'}</p>
                            <p style={{ margin: 0 }}><strong>Elixires:</strong> {(detalheCompleto.elixires || []).map((e) => e.nome).join(', ') || (detalheCompleto.elixir || []).join(', ') || '—'}</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalObservacoes && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setModalObservacoes(null)}>
          <div className="card modal-content" style={{ maxWidth: '480px', maxHeight: '80vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h3>Observações — {modalObservacoes.nome}</h3>
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
              {(modalObservacoes.observacoes || []).map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
            <button type="button" style={{ marginTop: '1rem' }} onClick={() => setModalObservacoes(null)}>Fechar</button>
          </div>
        </div>
      )}

      {modalObservacao && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => { setModalObservacao(null); setAcaoError(null); }}>
          <div className="card modal-content" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
            <h3>Adicionar observação — {modalObservacao.nome}</h3>
            <div className="form-row">
              <label>Texto</label>
              <textarea value={novaObservacao} onChange={(e) => setNovaObservacao(e.target.value)} placeholder="Nova observação..." rows={3} />
            </div>
            {acaoError && <p className="error-msg">{acaoError}</p>}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="primary" onClick={salvarObservacao} disabled={!novaObservacao.trim()}>Salvar</button>
              <button type="button" onClick={() => { setModalObservacao(null); setAcaoError(null); }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {modalImagem && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => { setModalImagem(null); setAcaoError(null); setNovaImagemFile(null); }}>
          <div className="card modal-content" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
            <h3>Adicionar imagem — {modalImagem.nome}</h3>
            <div className="form-row">
              <label>Enviar arquivo (PNG, JPG, GIF, WebP)</label>
              <input type="file" accept=".png,.jpg,.jpeg,.gif,.webp" onChange={(e) => { setNovaImagemFile(e.target.files?.[0] || null); if (e.target.files?.[0]) setNovaImagemUrl(''); }} />
              {novaImagemFile && <span style={{ fontSize: '0.9rem' }}>{novaImagemFile.name}</span>}
            </div>
            <div className="form-row" style={{ marginTop: '0.5rem' }}>
              <label>Ou URL da imagem</label>
              <input type="url" value={novaImagemUrl} onChange={(e) => { setNovaImagemUrl(e.target.value); if (e.target.value) setNovaImagemFile(null); }} placeholder="https://..." disabled={!!novaImagemFile} />
            </div>
            {acaoError && <p className="error-msg">{acaoError}</p>}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="primary" onClick={salvarImagem} disabled={!novaImagemUrl.trim() && !novaImagemFile}>Salvar</button>
              <button type="button" onClick={() => { setModalImagem(null); setAcaoError(null); setNovaImagemFile(null); }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
