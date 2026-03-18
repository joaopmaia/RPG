import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { INSTRUMENTOS, MUSICAS_POR_RACA } from '../data/musicasData'

const INSTRUMENTO_IMAGEM = {
  sopro: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <ellipse cx="32" cy="40" rx="14" ry="8" fill="var(--parchment-dark)" opacity="0.3" />
      <path d="M22 40 L22 20 Q22 12 32 12 Q42 12 42 20 L42 40" stroke="var(--parchment-dark)" strokeWidth="2" fill="none" />
      <circle cx="26" cy="28" r="2" fill="var(--parchment-dark)" />
      <circle cx="32" cy="26" r="2" fill="var(--parchment-dark)" />
      <circle cx="38" cy="28" r="2" fill="var(--parchment-dark)" />
      <title>Instrumentos de Sopro (Ocarina)</title>
    </svg>
  ),
  corda: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <ellipse cx="32" cy="48" rx="20" ry="6" fill="var(--parchment-dark)" opacity="0.3" />
      <path d="M16 16 L32 8 L48 16 L48 48 Q32 56 16 48 Z" stroke="var(--parchment-dark)" strokeWidth="2" fill="none" />
      {[20, 26, 32, 38, 44].map((x, i) => (
        <line key={i} x1={x} y1={12} x2={x + 4} y2={46} stroke="var(--parchment-dark)" strokeWidth="1" opacity="0.8" />
      ))}
      <title>Instrumentos de Corda (Alaúde)</title>
    </svg>
  ),
  percussao: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <ellipse cx="32" cy="36" rx="18" ry="8" fill="var(--parchment-dark)" opacity="0.4" />
      <rect x="14" y="20" width="36" height="12" rx="2" stroke="var(--parchment-dark)" strokeWidth="2" fill="none" />
      <rect x="20" y="28" width="24" height="20" rx="1" stroke="var(--parchment-dark)" strokeWidth="1.5" fill="none" />
      <title>Instrumentos de Percussão (Bongo)</title>
    </svg>
  ),
}

function MusicCard({ nome, efeito }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="card"
      style={{
        marginBottom: '0.5rem',
        padding: '0.6rem 0.75rem',
        cursor: 'pointer',
        border: '1px solid var(--border-frame)',
        borderRadius: 8,
        background: open ? 'var(--bg-card-hover)' : 'var(--bg-card)',
      }}
      onClick={() => setOpen((o) => !o)}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600 }}>
        <span>{nome}</span>
        <span style={{ fontSize: '0.85rem', color: 'var(--parchment-dark)' }}>{open ? '▼' : '▶'}</span>
      </div>
      {open && (
        <p style={{ marginTop: '0.5rem', marginBottom: 0, fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>
          {efeito}
        </p>
      )}
    </div>
  )
}

export default function Musicas() {
  const [instrumento, setInstrumento] = useState('')
  const [raca, setRaca] = useState('')
  const [racasAbertas, setRacasAbertas] = useState({})

  const racasDisponiveis = useMemo(() => {
    if (!instrumento) return Object.keys(MUSICAS_POR_RACA)
    const inst = INSTRUMENTOS.find((i) => i.id === instrumento)
    return inst ? inst.raças : Object.keys(MUSICAS_POR_RACA)
  }, [instrumento])

  const racasFiltradas = useMemo(() => {
    if (raca) return racasDisponiveis.includes(raca) ? [raca] : racasDisponiveis
    return racasDisponiveis
  }, [raca, racasDisponiveis])

  const toggleRaca = (r) => setRacasAbertas((prev) => ({ ...prev, [r]: !prev[r] }))

  return (
    <div className="regras-doc">
      <h1>Músicas</h1>
      <p style={{ color: 'var(--parchment-dark)', marginBottom: '1rem' }}>
        Canções por instrumento e raça. Consulte as <Link to="/regras/musicas">regras de Músicas</Link> para dificuldades, custo de Arcana e uso em combate.
      </p>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Filtros</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
          <div>
            <label className="block" style={{ marginBottom: '0.25rem', fontWeight: 600 }}>Instrumento</label>
            <select
              value={instrumento}
              onChange={(e) => { setInstrumento(e.target.value); setRaca('') }}
              className="input"
              style={{ minWidth: 220 }}
            >
              <option value="">Todos os instrumentos</option>
              {INSTRUMENTOS.map((i) => (
                <option key={i.id} value={i.id}>{i.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block" style={{ marginBottom: '0.25rem', fontWeight: 600 }}>Raça</label>
            <select
              value={raca}
              onChange={(e) => setRaca(e.target.value)}
              className="input"
              style={{ minWidth: 180 }}
            >
              <option value="">Todas as raças</option>
              {racasDisponiveis.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '1rem', alignItems: 'flex-start' }}>
          {!instrumento && (
            <>
              {INSTRUMENTOS.map((i) => (
                <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 64, height: 64, flexShrink: 0 }}>{INSTRUMENTO_IMAGEM[i.id]}</div>
                  <span style={{ fontSize: '0.9rem' }}>{i.label}</span>
                </div>
              ))}
            </>
          )}
          {instrumento && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 64, height: 64, flexShrink: 0 }}>{INSTRUMENTO_IMAGEM[instrumento]}</div>
              <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{INSTRUMENTOS.find((x) => x.id === instrumento)?.label}</span>
            </div>
          )}
        </div>
      </div>

      {racasFiltradas.length === 0 ? (
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--parchment-dark)' }}>
          Nenhuma raça encontrada com os filtros selecionados.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {racasFiltradas.map((r) => {
            const data = MUSICAS_POR_RACA[r]
            if (!data) return null
            const isOpen = racasAbertas[r] !== false
            return (
              <div key={r} className="card" style={{ marginBottom: 0 }}>
                <h3
                  style={{
                    marginTop: 0,
                    cursor: 'pointer',
                    userSelect: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onClick={() => toggleRaca(r)}
                >
                  <span>{r}</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>{isOpen ? '▼ Recolher' : '▶ Expandir'}</span>
                </h3>
                {isOpen && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>Canção do Povo (fora de combate)</h4>
                    <MusicCard nome={data.cancaoDoPovo.nome} efeito={data.cancaoDoPovo.efeito} />

                    <h4 style={{ fontSize: '1rem', marginTop: '1rem', marginBottom: '0.35rem' }}>Canções básicas (combate)</h4>
                    {data.basicas.map((c) => (
                      <MusicCard key={c.nome} nome={c.nome} efeito={c.efeito} />
                    ))}

                    <h4 style={{ fontSize: '1rem', marginTop: '1rem', marginBottom: '0.35rem' }}>Canções avançadas (combate)</h4>
                    {data.avancadas.map((c) => (
                      <MusicCard key={c.nome} nome={c.nome} efeito={c.efeito} />
                    ))}

                    <h4 style={{ fontSize: '1rem', marginTop: '1rem', marginBottom: '0.35rem' }}>Canção especial</h4>
                    <MusicCard nome={data.especial.nome} efeito={data.especial.efeito} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
