import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getReinosInfo, gerarNpc } from '../api'

const RACAS = ['Vaelthor', 'Drovenar', 'Sylmari', 'Gorvash', 'Sharusahk']
const LINHAGENS = [
  { value: 'nobre', label: 'Nobre' },
  { value: 'comum', label: 'Comum' },
]
const TIPOS_NPC = ['Mercadores', 'Nobres', 'Guardas', 'Ladinos', 'Assassinos', 'Mensageiros', 'Alquimista', 'Bardo', 'Criminoso', 'Pirata', 'Cidadão']
const CLASSES = ['Arcanista', 'Clérigo', 'Assassino', 'Paladino', 'Shaman', 'Druida', 'Eremita', 'Ocultista']
const NATUREZAS = ['Neutro', 'Bom', 'Mal']
const NIVEIS = [
  { value: 1, label: 'Nível 1 - Charlatão' },
  { value: 2, label: 'Nível 2 - Amador' },
  { value: 3, label: 'Nível 3 - Profissional' },
  { value: 4, label: 'Nível 4 - Mestre' },
  { value: 5, label: 'Nível 5 - Lenda' },
]

const BONUS_TIPO = [
  ['Mercadores', 'Carisma, Inteligência, Percepção, Espírito, Vitalidade'],
  ['Nobres', 'Carisma, Espírito, Inteligência, Percepção, Vitalidade'],
  ['Guardas', 'Força, Vitalidade, Percepção, Destreza, Espírito'],
  ['Ladinos', 'Destreza, Percepção, Inteligência, Carisma, Força'],
  ['Assassinos', 'Destreza, Percepção, Força, Inteligência, Vitalidade'],
  ['Mensageiros', 'Vitalidade, Destreza, Percepção, Força, Espírito'],
  ['Alquimista', 'Inteligência, Percepção, Espírito, Vitalidade, Destreza'],
  ['Bardo', 'Carisma, Espírito, Percepção, Destreza, Inteligência'],
  ['Criminoso', 'Força, Carisma, Vitalidade, Destreza, Percepção'],
  ['Pirata', 'Força, Vitalidade, Destreza, Carisma, Percepção'],
  ['Cidadão', 'Vitalidade, Percepção, Força, Inteligência, Carisma'],
]
const BONUS_CLASSE = [
  ['Arcanista', 'Runas: Genia, Pascalia, Reetear'],
  ['Clérigo', 'Runas: Degila, Arunalt, Saltrat'],
  ['Assassino', 'Runas: Saltrat, Genia, Arunalt'],
  ['Paladino', 'Runas: Degila, Arunalt, Pascalia'],
  ['Shaman', 'Runas: Genia, Saltrat, Reetear'],
  ['Druida', 'Runas: Degila, Reetear, Saltrat'],
  ['Eremita', 'Runas: Genia, Arunalt, Pascalia'],
  ['Ocultista', 'Runas: Saltrat, Degila, Reetear'],
]
const BONUS_NIVEL = [
  [1, 'Charlatão', '0 runas, equip. rank F/E'],
  [2, 'Amador', '1 runa, equip. rank F/E/D'],
  [3, 'Profissional', '2 runas, equip. rank D/C'],
  [4, 'Mestre', '3 runas, equip. rank C/B/A'],
  [5, 'Lenda', '3 runas, equip. rank B/A/S'],
]

export default function NPCCriar() {
  const navigate = useNavigate()
  const [reinosInfo, setReinosInfo] = useState([])
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    raca: '',
    reino_nome: '',
    linhagem: 'comum',
    tipo_npc: '',
    classe: '',
    natureza: 'Neutro',
    nivel: 1,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [created, setCreated] = useState(null)
  const [tooltipAberto, setTooltipAberto] = useState(null)

  useEffect(() => {
    getReinosInfo()
      .then(setReinosInfo)
      .catch((e) => setError(e.message))
  }, [])

  const reinosPorRaca = form.raca ? reinosInfo.filter((r) => r.raça === form.raca) : []

  const canNext = () => {
    if (step === 0) return !!form.raca
    if (step === 1) return !!form.reino_nome
    if (step === 2) return true
    if (step === 3) return !!form.tipo_npc
    if (step === 4) return !!form.classe
    if (step === 5) return !!form.natureza
    if (step === 6) return !!form.nivel
    return true
  }

  const next = () => {
    if (step === 0) setForm((f) => ({ ...f, reino_nome: '' }))
    if (step < 7) setStep(step + 1)
  }

  const back = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleGerar = () => {
    setLoading(true)
    setError(null)
    gerarNpc(form)
      .then((npc) => {
        setCreated(npc)
        setLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }

  if (created) {
    return (
      <div className="card" style={{ maxWidth: '480px' }}>
        <h2>NPC criado com sucesso</h2>
        <p><strong>{created.nome}</strong> foi salvo no banco.</p>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          {created._id && <button type="button" className="primary" onClick={() => navigate(`/npcs/${created._id}/ficha`)}>Ver ficha</button>}
          <button type="button" onClick={() => navigate('/npcs')}>Ir para lista</button>
        </div>
      </div>
    )
  }

  const steps = [
    { title: 'Raça', desc: 'Escolha a raça do personagem.' },
    { title: 'Reino', desc: 'Reino de origem (apenas reinos dessa raça).' },
    { title: 'Linhagem', desc: 'Nobre ou comum (define o sobrenome).' },
    { title: 'Tipo', desc: 'Ocupação do NPC (ex.: Guarda, Mercador).' },
    { title: 'Classe', desc: 'Classe de personagem (ex.: Clérigo, Arcanista).' },
    { title: 'Natureza', desc: 'Alinhamento moral.' },
    { title: 'Nível', desc: 'Nível de poder (1 a 5).' },
    { title: 'Resumo', desc: 'Revise e gere o NPC.' },
  ]

  return (
    <div className="card" style={{ maxWidth: '560px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Criar NPC</h1>
        <Link to="/npcs">← Lista</Link>
      </div>
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {steps.map((s, i) => (
          <span
            key={i}
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              background: step === i ? 'var(--accent)' : (i < step ? 'var(--bg-card-hover)' : 'var(--bg-card)'),
              fontSize: '0.85rem',
            }}
          >
            {i + 1}. {s.title}
          </span>
        ))}
      </div>
      {error && <p className="error-msg">{error}</p>}

      {step === 0 && (
        <>
          <h3>1. Raça do NPC</h3>
          <p style={{ color: 'var(--parchment-dark)', marginBottom: '0.75rem' }}>{steps[0].desc}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {RACAS.map((r) => (
              <button
                key={r}
                type="button"
                className={form.raca === r ? 'primary' : ''}
                onClick={() => setForm({ ...form, raca: r })}
              >
                {r}
              </button>
            ))}
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <h3>2. Reino de origem</h3>
          <p style={{ color: 'var(--parchment-dark)', marginBottom: '0.75rem' }}>{steps[1].desc}</p>
          {reinosPorRaca.length === 0 ? (
            <p>Nenhum reino encontrado para {form.raca}. Volte e escolha outra raça.</p>
          ) : (
            <select
              value={form.reino_nome}
              onChange={(e) => setForm({ ...form, reino_nome: e.target.value })}
              style={{ minWidth: '200px' }}
            >
              <option value="">Selecione o reino</option>
              {reinosPorRaca.map((r) => (
                <option key={r.nome} value={r.nome}>{r.nome}</option>
              ))}
            </select>
          )}
        </>
      )}

      {step === 2 && (
        <>
          <h3>3. Linhagem (sobrenome)</h3>
          <p style={{ color: 'var(--parchment-dark)', marginBottom: '0.75rem' }}>{steps[2].desc}</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {LINHAGENS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                className={form.linhagem === value ? 'primary' : ''}
                onClick={() => setForm({ ...form, linhagem: value })}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h3>4. Tipo do NPC</h3>
          <p style={{ color: 'var(--parchment-dark)', marginBottom: '0.25rem' }}>{steps[3].desc}</p>
          <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              role="img"
              aria-label="Dica"
              onMouseEnter={() => setTooltipAberto('tipo')}
              onMouseLeave={() => setTooltipAberto(null)}
              style={{ cursor: 'help', fontSize: '1.1rem', position: 'relative' }}
            >
              💡
              {tooltipAberto === 'tipo' && (
                <div className="card" style={{ position: 'absolute', left: 0, top: '100%', zIndex: 100, minWidth: '320px', marginTop: '4px', padding: '0.5rem' }}>
                  <strong>Bônus por tipo (atributos priorizados)</strong>
                  <table style={{ width: '100%', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    <thead><tr><th>Tipo</th><th>Atributos</th></tr></thead>
                    <tbody>
                      {BONUS_TIPO.map(([t, att]) => <tr key={t}><td>{t}</td><td>{att}</td></tr>)}
                    </tbody>
                  </table>
                </div>
              )}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--parchment-dark)' }}>Passe o mouse na lâmpada para ver a tabela de bônus.</span>
          </div>
          <select
            value={form.tipo_npc}
            onChange={(e) => setForm({ ...form, tipo_npc: e.target.value })}
            style={{ minWidth: '220px' }}
          >
            <option value="">Selecione o tipo</option>
            {TIPOS_NPC.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </>
      )}

      {step === 4 && (
        <>
          <h3>5. Classe do personagem</h3>
          <p style={{ color: 'var(--parchment-dark)', marginBottom: '0.25rem' }}>{steps[4].desc}</p>
          <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              role="img"
              aria-label="Dica"
              onMouseEnter={() => setTooltipAberto('classe')}
              onMouseLeave={() => setTooltipAberto(null)}
              style={{ cursor: 'help', fontSize: '1.1rem', position: 'relative' }}
            >
              💡
              {tooltipAberto === 'classe' && (
                <div className="card" style={{ position: 'absolute', left: 0, top: '100%', zIndex: 100, minWidth: '280px', marginTop: '4px', padding: '0.5rem' }}>
                  <strong>Runas por classe</strong>
                  <table style={{ width: '100%', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    <thead><tr><th>Classe</th><th>Runas</th></tr></thead>
                    <tbody>
                      {BONUS_CLASSE.map(([c, r]) => <tr key={c}><td>{c}</td><td>{r}</td></tr>)}
                    </tbody>
                  </table>
                </div>
              )}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--parchment-dark)' }}>Passe o mouse na lâmpada para ver runas por classe.</span>
          </div>
          <select
            value={form.classe}
            onChange={(e) => setForm({ ...form, classe: e.target.value })}
            style={{ minWidth: '220px' }}
          >
            <option value="">Selecione a classe</option>
            {CLASSES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </>
      )}

      {step === 5 && (
        <>
          <h3>6. Natureza</h3>
          <p style={{ color: 'var(--parchment-dark)', marginBottom: '0.75rem' }}>{steps[5].desc}</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {NATUREZAS.map((n) => (
              <button
                key={n}
                type="button"
                className={form.natureza === n ? 'primary' : ''}
                onClick={() => setForm({ ...form, natureza: n })}
              >
                {n}
              </button>
            ))}
          </div>
        </>
      )}

      {step === 6 && (
        <>
          <h3>7. Nível do personagem</h3>
          <p style={{ color: 'var(--parchment-dark)', marginBottom: '0.25rem' }}>{steps[6].desc}</p>
          <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              role="img"
              aria-label="Dica"
              onMouseEnter={() => setTooltipAberto('nivel')}
              onMouseLeave={() => setTooltipAberto(null)}
              style={{ cursor: 'help', fontSize: '1.1rem', position: 'relative' }}
            >
              💡
              {tooltipAberto === 'nivel' && (
                <div className="card" style={{ position: 'absolute', left: 0, top: '100%', zIndex: 100, minWidth: '260px', marginTop: '4px', padding: '0.5rem' }}>
                  <strong>Efeitos por nível</strong>
                  <table style={{ width: '100%', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    <thead><tr><th>Nível</th><th>Nome</th><th>Efeito</th></tr></thead>
                    <tbody>
                      {BONUS_NIVEL.map(([n, nome, efeito]) => <tr key={n}><td>{n}</td><td>{nome}</td><td>{efeito}</td></tr>)}
                    </tbody>
                  </table>
                </div>
              )}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--parchment-dark)' }}>Passe o mouse na lâmpada para ver efeitos por nível.</span>
          </div>
          <select
            value={form.nivel}
            onChange={(e) => setForm({ ...form, nivel: Number(e.target.value) })}
            style={{ minWidth: '260px' }}
          >
            {NIVEIS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </>
      )}

      {step === 7 && (
        <>
          <h3>Resumo</h3>
          <p style={{ color: 'var(--parchment-dark)', marginBottom: '0.75rem' }}>Revise as escolhas e clique em Gerar para criar o NPC no banco.</p>
          <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.25rem 1rem', marginBottom: '1rem' }}>
            <dt>Raça:</dt><dd>{form.raca}</dd>
            <dt>Reino:</dt><dd>{form.reino_nome}</dd>
            <dt>Linhagem:</dt><dd>{form.linhagem === 'nobre' ? 'Nobre' : 'Comum'}</dd>
            <dt>Tipo:</dt><dd>{form.tipo_npc}</dd>
            <dt>Classe:</dt><dd>{form.classe}</dd>
            <dt>Natureza:</dt><dd>{form.natureza}</dd>
            <dt>Nível:</dt><dd>{form.nivel} - {NIVEIS.find((n) => n.value === form.nivel)?.label?.replace(/^Nível \d+ - /, '') || ''}</dd>
          </dl>
          <button type="button" className="primary" onClick={handleGerar} disabled={loading}>
            {loading ? 'Gerando…' : 'Gerar e salvar NPC'}
          </button>
        </>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
        {step > 0 && <button type="button" onClick={back}>Voltar</button>}
        {step < 7 && <button type="button" className="primary" onClick={next} disabled={!canNext()}>Próximo</button>}
      </div>
    </div>
  )
}
