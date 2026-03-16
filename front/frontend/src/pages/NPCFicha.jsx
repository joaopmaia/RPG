import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getNpcCompleto, buscarImagem, urlImagem, list } from '../api'

const NIVEIS = { 1: 'Charlatão', 2: 'Amador', 3: 'Profissional', 4: 'Mestre', 5: 'Lenda' }

export default function NPCFicha() {
  const { id } = useParams()
  const [npc, setNpc] = useState(null)
  const [runasCombo, setRunasCombo] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imagem, setImagem] = useState(null)

  useEffect(() => {
    getNpcCompleto(id)
      .then(setNpc)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!id) return
    buscarImagem('npc', id)
      .then(setImagem)
      .catch(() => setImagem(null))
  }, [id])

  useEffect(() => {
    if (!npc?.runas || !Array.isArray(npc.runas) || npc.runas.length === 0) {
      setRunasCombo([])
      return
    }
    list('runas', { elemento: npc.runas })
      .then((data) => setRunasCombo(Array.isArray(data) ? data : []))
      .catch(() => setRunasCombo([]))
  }, [npc?.runas])

  if (loading) return <p>Carregando ficha…</p>
  if (error) return <p className="error-msg">{error}</p>
  if (!npc) return <p>NPC não encontrado.</p>

  const nivelLabel = NIVEIS[npc.nível] || npc.nível
  const armas = (npc.equipamentos || []).filter((e) => (e.tipo || '').toLowerCase() in { melee: 1, ranged: 1, arcane: 1 })
  const efeitosArmas = armas.map((a) => a.efeito).filter(Boolean)

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/npcs">← Voltar à lista de NPCs</Link>
      </div>
      <div className="card">
        {(imagem?.url || urlImagem(imagem)) && (
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <img src={urlImagem(imagem) || imagem.url} alt={npc.nome} style={{ maxWidth: '100%', maxHeight: 280, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--border-frame)' }} />
          </div>
        )}
        <h1>{npc.nome}</h1>
        <p><strong>Raça:</strong> {npc.raça} &nbsp; <strong>Tipo:</strong> {npc.tipo}</p>
        <p><strong>Nível:</strong> {npc.nível} – {nivelLabel} &nbsp; <strong>Natureza:</strong> {npc.natureza}</p>
        <hr style={{ borderColor: 'var(--border-frame)', margin: '1rem 0' }} />
        <p><strong>HP:</strong> {npc.hp_atual} / {npc.hp_total} &nbsp; <strong>Arcana:</strong> {npc.arcana_atual} / {npc.arcana_total} &nbsp; <strong>Perícia:</strong> +{npc.pericia}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.5rem 1rem', marginTop: '0.75rem' }}>
          <div><strong>Arma 1:</strong><br />{npc.arma1 || '—'}<br /><small>Dano: {npc.ataque1 ?? '—'}</small></div>
          <div><strong>Arma 2:</strong><br />{npc.arma2 || '—'}<br /><small>Dano: {npc.ataque2 ?? '—'}</small></div>
          <div><strong>Armadura:</strong><br />{npc.armadura || '—'}<br /><small>Valor: {npc.armadura_val ?? '—'}</small></div>
          <div><strong>Defesa (escudo):</strong><br />{npc.escudo || '—'}<br /><small>Bônus: {npc.defesa_escudo ?? '—'}</small></div>
        </div>

        {efeitosArmas.length > 0 && (
          <div className="card" style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--bg-card-hover)', fontSize: '0.9rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Efeitos das armas</h4>
            {efeitosArmas.map((ef, i) => (
              <p key={i} style={{ margin: '0.25rem 0', lineHeight: 1.4 }}>{ef}</p>
            ))}
          </div>
        )}

        <p style={{ marginTop: '1rem' }}><strong>Moedas:</strong> {npc.moedas}</p>
        <p><strong>Observações:</strong> {Array.isArray(npc.observacoes) ? npc.observacoes.join('; ') : npc.observacoes || '—'}</p>
      </div>

      {(npc.runas && npc.runas.length > 0) && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3>Runas (elementos do NPC)</h3>
          <p style={{ color: 'var(--parchment-dark)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Combinação: {npc.runas.join(', ')}</p>
          {runasCombo.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {runasCombo.map((r) => (
                <div key={r._id} style={{ padding: '0.5rem', background: 'var(--bg-card-hover)', borderRadius: 6, border: '1px solid var(--border-frame)' }}>
                  <strong>{r.nome}</strong> <span className="badge" style={{ marginLeft: '0.25rem' }}>{r.tier}</span>
                  {r.efeito && <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}><strong>Efeito:</strong> {r.efeito}</div>}
                  {r.descricao && <div style={{ fontSize: '0.85rem', color: 'var(--parchment-dark)', marginTop: '0.15rem' }}>{r.descricao}</div>}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>Nenhuma runa cadastrada para esta combinação de elementos.</p>
          )}
        </div>
      )}

      {(npc.equipamentos && npc.equipamentos.length > 0) && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3>Equipamentos (detalhes)</h3>
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
            {npc.equipamentos.map((eq, i) => (
              <li key={i} style={{ marginBottom: '0.75rem', padding: '0.75rem', background: 'var(--bg-card-hover)', borderRadius: 8, border: '1px solid var(--border-frame)' }}>
                <strong>{eq.nome}</strong> ({eq.tipo}) — {eq.nome_material ?? eq.material} | Rank {eq.rank ?? '—'}
                {(eq.bônus != null || eq.bonus != null) && <span> | Bônus: {eq.bônus ?? eq.bonus}</span>}
                {eq.dano != null && <span> | Dano: {eq.dano}</span>}
                {eq.defesa != null && <span> | Defesa: {eq.defesa}</span>}
                {eq.efeito && <div style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}><strong>Efeito:</strong> {eq.efeito}</div>}
                {eq.potencia != null && <div style={{ fontSize: '0.9rem' }}><strong>Potência:</strong> {eq.potencia}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(npc.elixires && npc.elixires.length > 0) && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3>Elixires (detalhes)</h3>
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
            {npc.elixires.map((el, i) => (
              <li key={i} style={{ marginBottom: '0.75rem', padding: '0.75rem', background: 'var(--bg-card-hover)', borderRadius: 8, border: '1px solid var(--border-frame)' }}>
                <strong>{el.nome}</strong>
                {el.efeito && <div style={{ marginTop: '0.25rem' }}><strong>Efeito:</strong> {el.efeito}</div>}
                {(el.potencia != null || el.potência != null) && <div><strong>Potência:</strong> {el.potencia ?? el.potência}</div>}
                {el.materia_prima && <div><strong>Matéria-prima:</strong> {el.materia_prima} {el.bonus_materia_prima != null && `(bônus: ${el.bonus_materia_prima})`}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
