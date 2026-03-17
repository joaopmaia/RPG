import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { getEstabelecimentoNoite } from '../api'

const CACHE_KEY = (estabId) => `passarNoite_${estabId}`

// Carregamento assíncrono do JSON para não quebrar se o módulo falhar no load
const EVENTOS_MAPA_FALLBACK = []

const DOENCAS = [
  'caganeira', 'alergia', 'dor de cabeça', 'febre alta', 'dores musculares', 'vômito', 'enjoo', 'resfriado',
]

function getRecuperacaoTexto(estab) {
  if (!estab) return '10× Vitalidade de HP (base).'
  const tipo = String(estab.tipo_nome ?? '').toLowerCase()
  const nivel = typeof estab.nivel === 'number' ? estab.nivel : Number(estab.nivel) || 0
  if (tipo === 'acampamento') return '1d4 de HP (base: 10× Vitalidade + 5x Resistência).'
  if (tipo === 'taverna') return '1d6 de HP (base: 10× Vitalidade + 5x Resistência).'
  if (nivel >= 5) return 'Remove condições negativas. Cura 100% de HP.'
  if (nivel >= 4) return '1d20 de HP (base: 10× Vitalidade + 5x Resistência).'
  if (nivel >= 3) return '1d10 de HP (base: 10× Vitalidade + 5x Resistência).'
  if (nivel >= 2) return '1d8 de HP (base: 10× Vitalidade + 5x Resistência).'
  return '1d6 de HP (base: 10× Vitalidade + 5x Resistência).'
}

const EVENTOS = [
  'ataque_demonio',
  'doenca',
  'furto_ou_bandidos',
  'ataque_gorvash',
  'ataque_animal',
  'nada',
]

const BASE_CHANCES = {
  acampamento: {
    ataque_demonio: 0.3,
    furto_ou_bandidos: 0.1,
    doenca: 0.2,
    nada: 0.1,
    ataque_animal: 0.3,
    ataque_gorvash: 0,
  },
  taverna_n1: {
    ataque_demonio: 0.1,
    furto_ou_bandidos: 0.5,
    doenca: 0.1,
    nada: 0.1,
    ataque_animal: 0.2,
    ataque_gorvash: 0.1,
  },
  hospedagem_n2: {
    ataque_demonio: 0,
    furto_ou_bandidos: 0.4,
    doenca: 0.1,
    nada: 0.4,
    ataque_animal: 0.1,
    ataque_gorvash: 0,
  },
  hospedagem_n3: {
    ataque_demonio: 0,
    furto_ou_bandidos: 0.3,
    doenca: 0,
    nada: 0.6,
    ataque_animal: 0.1,
    ataque_gorvash: 0,
  },
  hospedagem_n4: {
    ataque_demonio: 0,
    furto_ou_bandidos: 0.2,
    doenca: 0,
    nada: 0.8,
    ataque_animal: 0,
    ataque_gorvash: 0,
  },
  hospedagem_n5: {
    ataque_demonio: 0,
    furto_ou_bandidos: 0,
    doenca: 0,
    nada: 1,
    ataque_animal: 0,
    ataque_gorvash: 0,
  },
}

function pickReinoMultiplicador(nomeReino, eventosMapaData) {
  const arr = Array.isArray(eventosMapaData) ? eventosMapaData : EVENTOS_MAPA_FALLBACK
  const entry = arr.find((e) => e && typeof e === 'object' && Object.prototype.hasOwnProperty.call(e, nomeReino))
  if (!entry || typeof entry !== 'object') return null
  const cfg = entry[nomeReino]
  if (!cfg || typeof cfg !== 'object') return null
  return {
    ataque_demonio: Number(cfg.chance_ataque_demonio ?? 1),
    furto_ou_bandidos: Number(cfg.chance_furto ?? 1),
    ataque_gorvash: Number(cfg.chance_ataque_gorvash ?? 1),
    doenca: Number(cfg.chance_doenca ?? 1),
    ataque_animal: Number(cfg.chance_ataque_animal ?? 1),
  }
}

function rolar(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function sortearEvento(chances, mult, nivel) {
  const pesos = {}
  EVENTOS.forEach((ev) => {
    if (ev === 'nada') {
      pesos[ev] = chances[ev] ?? 0
    } else if (ev === 'ataque_demonio') {
      pesos[ev] = (chances[ev] ?? 0) * (mult.ataque_demonio ?? 1) * Math.max(nivel, 1)
    } else if (ev === 'furto_ou_bandidos') {
      pesos[ev] = (chances[ev] ?? 0) * (mult.furto_ou_bandidos ?? 1) * Math.max(nivel, 1)
    } else if (ev === 'ataque_gorvash') {
      pesos[ev] = (chances[ev] ?? 0) * (mult.ataque_gorvash ?? 1) * Math.max(nivel, 1)
    } else if (ev === 'doenca') {
      pesos[ev] = (chances[ev] ?? 0) * (mult.doenca ?? 1)
    } else if (ev === 'ataque_animal') {
      pesos[ev] = (chances[ev] ?? 0) * (mult.ataque_animal ?? 1)
    }
  })
  const total = Object.values(pesos).reduce((a, b) => a + b, 0)
  if (!total) return 'nada'
  let alvo = Math.random() * total
  for (const ev of EVENTOS) {
    const p = pesos[ev] || 0
    if (alvo <= p) return ev
    alvo -= p
  }
  return 'nada'
}

function parseHP(val) {
  if (val == null) return 0
  const n = Number(val)
  return Number.isFinite(n) ? n : 0
}

export default function PassarNoite() {
  const { id } = useParams()
  const location = useLocation()
  const [estab, setEstab] = useState(null)
  const [entidades, setEntidades] = useState({ ladinos: [], animais: [], demonios: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [eventosMapaData, setEventosMapaData] = useState(EVENTOS_MAPA_FALLBACK)
  const [eventoForcado, setEventoForcado] = useState(null)

  useEffect(() => {
    import('../data/eventosMapa.json')
      .then((m) => setEventosMapaData(Array.isArray(m?.default) ? m.default : Array.isArray(m) ? m : []))
      .catch(() => setEventosMapaData([]))
  }, [])

  useEffect(() => {
    if (!id) {
      setError('ID do estabelecimento não informado.')
      setLoading(false)
      return
    }
    const isNovaNoite = location.state?.novaNoite === true
    if (isNovaNoite) {
      try {
        sessionStorage.removeItem(CACHE_KEY(id))
      } catch (_) {}
      setEventoForcado(null)
    } else {
      try {
        const raw = sessionStorage.getItem(CACHE_KEY(id))
        if (raw) {
          const cached = JSON.parse(raw)
          if (cached && cached.estabId === id && cached.estab && cached.entidades) {
            setEstab(cached.estab)
            setEntidades(cached.entidades)
            setEventoForcado(cached.evento && EVENTOS.includes(cached.evento) ? cached.evento : 'nada')
            setError(null)
            setLoading(false)
            return
          }
        }
      } catch (_) {}
    }

    setLoading(true)
    setError(null)
    getEstabelecimentoNoite(id)
      .then((data) => {
        if (!data || typeof data !== 'object') {
          setError('Resposta inválida do servidor.')
          return
        }
        const est = data.estabelecimento
        if (!est) {
          setError('Estabelecimento não encontrado.')
          return
        }
        setEstab(est)
        setEntidades({
          ladinos: Array.isArray(data.ladinos) ? data.ladinos : [],
          animais: Array.isArray(data.animais) ? data.animais : [],
          demonios: Array.isArray(data.demonios) ? data.demonios : [],
        })
        setEventoForcado(null)
      })
      .catch((e) => setError(e?.message || 'Erro ao carregar Passar a Noite.'))
      .finally(() => setLoading(false))
  }, [id, location.state?.novaNoite])

  const resultado = useMemo(() => {
    if (eventoForcado != null && EVENTOS.includes(eventoForcado)) {
      return { evento: eventoForcado, chances: {}, mult: {} }
    }
    if (!estab || typeof estab !== 'object') return null
    try {
      const tipo = String(estab.tipo_nome ?? '')
      const nivel = typeof estab.nivel === 'number' ? estab.nivel : Number(estab.nivel) || 0
      const chaveBase =
        tipo === 'Acampamento'
          ? 'acampamento'
          : tipo === 'Taverna'
          ? 'taverna_n1'
          : `hospedagem_n${Math.min(Math.max(nivel, 2), 5)}`
      const chances = BASE_CHANCES[chaveBase] || BASE_CHANCES.acampamento
      const mult = pickReinoMultiplicador(String(estab.reino_nome || ''), eventosMapaData) || {
        ataque_demonio: 1,
        furto_ou_bandidos: 1,
        ataque_gorvash: 1,
        doenca: 1,
        ataque_animal: 1,
      }
      const evento = sortearEvento(chances, mult, nivel || 0)
      const ev = EVENTOS.includes(evento) ? evento : 'nada'
      return { evento: ev, chances, mult }
    } catch (_) {
      return { evento: 'nada', chances: BASE_CHANCES.acampamento, mult: {} }
    }
  }, [estab, eventosMapaData, eventoForcado])

  useEffect(() => {
    if (!id || !estab || loading || eventoForcado != null) return
    const res = resultado || { evento: 'nada' }
    if (res.evento && EVENTOS.includes(res.evento)) {
      try {
        sessionStorage.setItem(
          CACHE_KEY(id),
          JSON.stringify({ estabId: id, estab, entidades, evento: res.evento })
        )
      } catch (_) {}
    }
  }, [id, estab, entidades, loading, resultado?.evento, eventoForcado])

  const res = resultado || { evento: 'nada' }
  const evento = typeof res.evento === 'string' && EVENTOS.includes(res.evento) ? res.evento : 'nada'
  const nomeEstab = (estab && (estab.nome ?? estab.nome)) || 'estabelecimento'

  const listaEvento = useMemo(() => {
    const listas = {
      ataque_demonio: entidades.demonios,
      furto_ou_bandidos: entidades.ladinos,
      ataque_animal: entidades.animais,
    }
    const arr = listas[evento]
    return Array.isArray(arr) ? arr : []
  }, [evento, entidades.demonios, entidades.ladinos, entidades.animais])

  const todosMortos = listaEvento.length > 0 && listaEvento.every((ent) => parseHP(ent?.hp_atual) < 1)

  const textoRecuperacao = getRecuperacaoTexto(estab)

  const dificuldadeFurto = useMemo(() => {
    const list = entidades.ladinos
    if (!Array.isArray(list) || list.length === 0) return null
    let maxD = 0
    let maxP = 0
    list.forEach((e) => {
      const d = Number(e?.destreza) || 0
      const p = Number(e?.pericia) || 0
      if (d > maxD) maxD = d
      if (p > maxP) maxP = p
    })
    return maxD + maxP + rolar(1, 10)
  }, [entidades.ladinos])

  const doencaSorteada = useMemo(() => DOENCAS[Math.floor(Math.random() * DOENCAS.length)] || 'mal-estar', [])

  if (loading) return <p>Carregando…</p>
  if (error || !estab) return <p className="error-msg">{error || 'Estabelecimento não encontrado.'}</p>

  let conteudo
  if (evento === 'ataque_demonio') {
    const dificuldadeProntidao = 7
    conteudo = todosMortos ? (
      <>
        <p><strong>Evento:</strong> Ataque Demoníaco</p>
        <p style={{ color: 'var(--success, green)' }}>Os atacantes estão mortos; a noite será tranquila.</p>
        <p>Todos recuperam <strong>{textoRecuperacao}</strong></p>
      </>
    ) : (
      <>
        <p><strong>Evento:</strong> Ataque Demoníaco</p>
        <p>Monstros espreitam nas escuridões sentindo o cheiro de uma nova refeição. Dificuldade do teste de prontidão para não levar um ataque surpresa: <strong>{dificuldadeProntidao}</strong>.</p>
      </>
    )
  } else if (evento === 'furto_ou_bandidos') {
    const dificuldadeTexto = dificuldadeFurto != null ? dificuldadeFurto : '(maior Destreza + maior perícia dos ladinos + 1d10)'
    conteudo = todosMortos ? (
      <>
        <p><strong>Evento:</strong> Furto e/ou Ataque de Bandidos</p>
        <p style={{ color: 'var(--success, green)' }}>Os atacantes estão mortos; a noite será tranquila.</p>
        <p>Todos recuperam <strong>{textoRecuperacao}</strong></p>
      </>
    ) : (
      <>
        <p><strong>Evento:</strong> Furto e/ou Ataque de Bandidos</p>
        <p>Um ladino tenta invadir seus aposentos para roubar seus poucos pertences. Dificuldade de perceber o furto: <strong>{dificuldadeTexto}</strong>.</p>
      </>
    )
  } else if (evento === 'doenca') {
    const base = rolar(10, 15)
    const nivelEstab = estab.nivel || 0
    const dificuldade = base - nivelEstab
    conteudo = (
      <>
        <p><strong>Evento:</strong> Doença</p>
        <p>Todos acordam se sentindo doentes, passando mal com <strong>{doencaSorteada}</strong>. Adicione o status doente na sua ficha caso falhe no teste de Resistência (dificuldade: <strong>{dificuldade}</strong>).</p>
      </>
    )
  } else if (evento === 'ataque_animal') {
    const dificuldadeProntidao = 10
    conteudo = todosMortos ? (
      <>
        <p><strong>Evento:</strong> Ataque de Animais</p>
        <p style={{ color: 'var(--success, green)' }}>Os atacantes estão mortos; a noite será tranquila.</p>
        <p>Todos recuperam <strong>{textoRecuperacao}</strong></p>
      </>
    ) : (
      <>
        <p><strong>Evento:</strong> Ataque de Animais</p>
        <p>Monstros espreitam nas escuridões sentindo o cheiro de uma nova refeição. Dificuldade do teste de prontidão para não levar um ataque surpresa: <strong>{dificuldadeProntidao}</strong>.</p>
      </>
    )
  } else if (evento === 'ataque_gorvash') {
    conteudo = (
      <>
        <p><strong>Evento:</strong> Ataque de Gorvash</p>
        <p>Use as regras de combate apropriadas para Gorvash conforme o tom da sua mesa.</p>
      </>
    )
  } else {
    conteudo = (
      <>
        <p><strong>Evento:</strong> Nada aconteceu</p>
        <p>Todos recuperam <strong>{textoRecuperacao}</strong> — uma noite de sono tranquila!</p>
      </>
    )
  }

  const renderGrupo = (titulo, itens, basePath, noiteEstabId) => {
    const lista = Array.isArray(itens) ? itens : []
    if (!lista.length) return null
    return (
      <section className="card" style={{ marginTop: '1rem' }}>
        <h3 style={{ marginTop: 0 }}>{titulo}</h3>
        {lista.map((ent, idx) => {
          const eid = ent && (ent._id ?? ent.id)
          const hp = parseHP(ent?.hp_atual)
          const morto = hp < 1
          const linkState = noiteEstabId ? { fromPassarNoite: noiteEstabId } : undefined
          return (
            <div key={eid || idx} style={{ marginBottom: '0.5rem' }}>
              <Link to={`${basePath}/${eid}/interagir`} state={linkState} style={morto ? { color: 'red' } : undefined}>
                {ent?.nome ?? '—'}
              </Link>
              {' — HP: '}
              <span style={morto ? { color: 'red' } : undefined}>{ent?.hp_atual ?? '?'}</span>
              {morto && ' (morto)'}
            </div>
          )
        })}
      </section>
    )
  }

  const tituloGrupo =
    evento === 'ataque_demonio'
      ? 'Demônios'
      : evento === 'furto_ou_bandidos'
      ? 'Ladrões'
      : evento === 'ataque_animal'
      ? 'Animais'
      : null
  const basePathGrupo =
    evento === 'ataque_demonio' ? '/demonios' : evento === 'furto_ou_bandidos' ? '/npcs' : evento === 'ataque_animal' ? '/animais' : null

  const estabId = id || (estab && (estab._id ?? estab.id)) || ''
  return (
    <div className="regras-doc">
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to={estabId ? `/estabelecimentos/${estabId}` : '/estabelecimentos'}>← Voltar para {nomeEstab}</Link>
      </nav>
      <h1>Passar a noite em {nomeEstab}</h1>
      <div className="card">
        {conteudo}
      </div>
      {tituloGrupo && basePathGrupo && renderGrupo(tituloGrupo, listaEvento, basePathGrupo, estabId)}
    </div>
  )
}

