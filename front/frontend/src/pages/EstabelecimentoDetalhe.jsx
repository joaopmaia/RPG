import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { get } from '../api'
import { moedasParaOuroPrataBronze } from '../utils/formatMoedas'

const COR_RARIDADE = { Comum: '#8b7355', Incomum: '#6b8e23', Raro: '#4682b4', Épico: '#9370db', Lendário: '#daa520' }
const NIVEL_NOMES = { 1: 'Ambulante', 2: 'Empório Local', 3: 'Loja de Cidade', 4: 'Loja de Luxo', 5: 'Leilão de Nobres' }

export default function EstabelecimentoDetalhe() {
  const { id } = useParams()
  const [estab, setEstab] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    get('estabelecimentos', id)
      .then(setEstab)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p>Carregando…</p>
  if (error || !estab) return <p className="error-msg">{error || 'Estabelecimento não encontrado.'}</p>

  const estoque = estab.estoque || []
  const nivelNome = estab.nivel_nome || (estab.nivel && NIVEL_NOMES[estab.nivel]) || ''

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/estabelecimentos" className="button">← Voltar à lista de estabelecimentos</Link>
      </div>
      <div className="card" style={{ maxWidth: '720px' }}>
        <h1 style={{ marginBottom: '0.25rem' }}>{estab.nome}</h1>
        <p style={{ color: 'var(--parchment-dark)', marginBottom: '1.5rem' }}>
          {nivelNome && `${nivelNome} · `}
          {estab.reino_nome && `Reino: ${estab.reino_nome}`}
          {estab.npc_nome && (
            <> · NPC: {estab.npc_id ? <Link to={`/npcs/${estab.npc_id}/ficha`}>{estab.npc_nome}</Link> : estab.npc_nome}</>
          )}
        </p>

        <h3 style={{ marginBottom: '1rem' }}>Itens à venda</h3>
        <div className="estabelecimento-loja" style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {estoque.map((item, i) => {
            const { ouro, prata, bronze } = moedasParaOuroPrataBronze(item.preco)
            return (
              <div
                key={i}
                className="card bandeja-item"
                style={{
                  padding: '1rem',
                  border: `2px solid ${COR_RARIDADE[item.raridade] || '#8b7355'}`,
                  borderRadius: 12,
                  background: `linear-gradient(180deg, ${COR_RARIDADE[item.raridade] || '#8b7355'}18 0%, var(--bg-card) 40%)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    border: `2px solid ${COR_RARIDADE[item.raridade] || '#8b7355'}`,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    padding: 4,
                    marginBottom: '0.75rem',
                    background: `linear-gradient(135deg, ${COR_RARIDADE[item.raridade] || '#8b7355'}33, transparent)`,
                  }}
                >
                  {(item.nome || '').slice(0, 12)}
                </div>
                <strong style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>{item.nome}</strong>
                {item.tipo_item && <span style={{ fontSize: '0.8rem', color: 'var(--parchment-dark)', marginBottom: '0.25rem' }}>{item.tipo_item}</span>}
                {item.material && <span style={{ fontSize: '0.8rem', color: 'var(--parchment-dark)' }}>{item.material} {item.raridade && `(${item.raridade})`}</span>}
                {item.efeito_material && <div style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>Efeito material: {item.efeito_material}</div>}
                {item.durabilidade != null && item.durabilidade !== undefined && <div style={{ fontSize: '0.8rem' }}>Durabilidade: {item.durabilidade}</div>}
                {(item.runa_nome || item.runas_equipadas?.length > 0) && (
                  <div style={{ fontSize: '0.8rem' }}>
                    Runas: {item.runa_nome || (item.runas_equipadas && item.runas_equipadas.map((r) => (typeof r === 'string' ? r : r.nome)).join(', '))}
                    {item.runa_efeito && <span> — {item.runa_efeito}</span>}
                  </div>
                )}
                {item.dano && <div style={{ fontSize: '0.85rem' }}>Dano: {item.dano}</div>}
                {item.defesa != null && <div style={{ fontSize: '0.85rem' }}>Defesa: {item.defesa}</div>}
                <div className="placa-preco" style={{ marginTop: '0.75rem', padding: '0.4rem 0.5rem', background: 'var(--bg-card-hover)', borderRadius: 8, border: '1px solid var(--border-frame)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--parchment-dark)', marginBottom: '0.15rem' }}>Preço</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                    {ouro > 0 && <span title="Ouro" style={{ color: '#c9a227' }}>● {ouro}</span>}
                    {prata > 0 && <span title="Prata" style={{ color: '#a0a0a0' }}>● {prata}</span>}
                    {bronze > 0 && <span title="Bronze" style={{ color: '#cd7f32' }}>● {bronze}</span>}
                    {(ouro === 0 && prata === 0 && bronze === 0) && <span>—</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {estoque.length === 0 && <p style={{ color: 'var(--parchment-dark)' }}>Nenhum item no estoque.</p>}
      </div>
    </div>
  )
}
