import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getNpcCompleto, update, list, create, remove, equipamentoPrevia } from '../api'

// Modal estável (fora do componente) para não remontar inputs e perder foco
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

// Rolagem: "1d10" ou "2d6 + 3" -> número
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

function getAtributoByPeso(npc, peso) {
  const p = (peso || '').toLowerCase()
  if (p.includes('pesado') || p.includes('muito')) return parseFloat(npc.forca) || 0
  return parseFloat(npc.destreza) || 0
}

// 1d10: efeito crítico só uma vez — se sair 10 soma mais 1d10; se sair 1 subtrai 1d10 (não encadeia)
function roll1d10Explode() {
  const firstRoll = rollDice('1d10')
  let total = firstRoll
  if (firstRoll === 10) total += rollDice('1d10')
  else if (firstRoll === 1) total -= rollDice('1d10')
  return total
}

// Comparação de listas de elementos (ordem não importa)
function setEqual(a, b) {
  if (!a || !b || !Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false
  const sa = new Set([...a].map((x) => String(x).trim().toLowerCase()))
  const sb = new Set([...b].map((x) => String(x).trim().toLowerCase()))
  return sa.size === sb.size && [...sa].every((x) => sb.has(x))
}

function runaMatchesChar(runa, charElements, size) {
  const el = runa.elementos || []
  if (el.length !== size) return false
  const charSet = new Set([...charElements].map((x) => String(x).trim().toLowerCase()))
  return el.every((e) => charSet.has(String(e).trim().toLowerCase()))
}

const EQUIPAMENTO_NPC = 'equipamentos-npc'
const ELIXIR_NPC = 'elixir-npc'

const CUSTO_RUNA = { Básico: 3, Intermediário: 6, Superior: 9 }

const ATRIBUTOS_NPC = [
  { key: 'forca', label: 'Força' },
  { key: 'destreza', label: 'Destreza' },
  { key: 'vitalidade', label: 'Vitalidade' },
  { key: 'inteligencia', label: 'Inteligência' },
  { key: 'espirito', label: 'Espírito' },
  { key: 'carisma', label: 'Carisma' },
  { key: 'percepcao', label: 'Percepção' },
]

export default function InteragirNPC() {
  const { id } = useParams()
  const [npc, setNpc] = useState(null)
  const [runasList, setRunasList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [modalCurar, setModalCurar] = useState(false)
  const [curarVal, setCurarVal] = useState('')
  const [modalArcana, setModalArcana] = useState(false)
  const [arcanaVal, setArcanaVal] = useState('')
  const [modalGastarArcana, setModalGastarArcana] = useState(false)
  const [gastarArcanaVal, setGastarArcanaVal] = useState('')
  const [modalDefender, setModalDefender] = useState(false)
  const [expandedRunaKey, setExpandedRunaKey] = useState(null)
  const [expandedElixirId, setExpandedElixirId] = useState(null)
  const [ataqueDefender, setAtaqueDefender] = useState('')
  const [modalAparar, setModalAparar] = useState(false)
  const [ataqueAparar, setAtaqueAparar] = useState('')
  const [armaAparar, setArmaAparar] = useState(null)
  const [modalDano, setModalDano] = useState(false)
  const [danoVal, setDanoVal] = useState('')
  const [modalDanoDireto, setModalDanoDireto] = useState(false)
  const [danoDiretoVal, setDanoDiretoVal] = useState('')
  const [modalUsarElixir, setModalUsarElixir] = useState(null)
  const [modalUsarRuna, setModalUsarRuna] = useState(null)
  const [modalRolarAtributo, setModalRolarAtributo] = useState(false)
  const [atributoSelecionado, setAtributoSelecionado] = useState('')
  const [resultadoRolagem, setResultadoRolagem] = useState(null)
  const [modalReparar, setModalReparar] = useState(null)
  const [repararVal, setRepararVal] = useState('')
  const [modalJogarFora, setModalJogarFora] = useState(null)
  const [equipamentosOpen, setEquipamentosOpen] = useState(true)
  const [observacoesOpen, setObservacoesOpen] = useState(true)
  const [novaObservacao, setNovaObservacao] = useState('')
  const [elixiresOpen, setElixiresOpen] = useState(true)
  const [runasOpen, setRunasOpen] = useState(true)
  const [runasBasicasOpen, setRunasBasicasOpen] = useState(true)
  const [runasInterOpen, setRunasInterOpen] = useState(true)
  const [runasAvancOpen, setRunasAvancOpen] = useState(true)
  const [runasByTier, setRunasByTier] = useState({ basico: [], intermediario: [], superior: [] })
  const [resumoAcao, setResumoAcao] = useState(null)

  const [modalEquiparArmamento, setModalEquiparArmamento] = useState(false)
  const [eqArmTipo, setEqArmTipo] = useState('arma')
  const [eqArmSubtipo, setEqArmSubtipo] = useState('melee')
  const [eqArmItemId, setEqArmItemId] = useState('')
  const [eqArmTipoMaterial, setEqArmTipoMaterial] = useState('')
  const [eqArmMaterialId, setEqArmMaterialId] = useState('')
  const [eqArmTemRuna, setEqArmTemRuna] = useState(false)
  const [eqArmTierRuna, setEqArmTierRuna] = useState('')
  const [eqArmElementos, setEqArmElementos] = useState([])
  const [eqArmRunaIds, setEqArmRunaIds] = useState([])
  const [eqArmListArmas, setEqArmListArmas] = useState([])
  const [eqArmListArmaduras, setEqArmListArmaduras] = useState([])
  const [eqArmListMateriais, setEqArmListMateriais] = useState([])
  const [eqArmRunasFiltradas, setEqArmRunasFiltradas] = useState([])
  const [eqArmPrevia, setEqArmPrevia] = useState(null)
  const [eqArmPreviaLoading, setEqArmPreviaLoading] = useState(false)
  const [eqArmSelectedMaterial, setEqArmSelectedMaterial] = useState(null)
  const [eqArmLoading, setEqArmLoading] = useState(false)
  const [eqArmSaving, setEqArmSaving] = useState(false)
  const [eqArmError, setEqArmError] = useState(null)

  const ELEMENTOS_RUNA = ['Genia', 'Degila', 'Reetear', 'Arunalt', 'Saltrat', 'Pascalia']
  const TIER_RUNA_OPCOES = [
    { value: 'Básico', label: 'Básico (1 elemento)', num: 1 },
    { value: 'Intermediário', label: 'Intermediário (2 elementos)', num: 2 },
    { value: 'Superior', label: 'Superior (3 elementos)', num: 3 },
  ]
  const numElementosRuna = eqArmTierRuna ? (TIER_RUNA_OPCOES.find((t) => t.value === eqArmTierRuna)?.num ?? 1) : 0

  const [modalEquiparElixir, setModalEquiparElixir] = useState(false)
  const [elixirLista, setElixirLista] = useState([])
  const [elixirSelecionado, setElixirSelecionado] = useState(null)
  const [elixirMaterialEscolhido, setElixirMaterialEscolhido] = useState('')
  const [elixirLoading, setElixirLoading] = useState(false)
  const [elixirSaving, setElixirSaving] = useState(false)
  const [elixirError, setElixirError] = useState(null)

  const load = () => {
    setLoading(true)
    setError(null)
    getNpcCompleto(id)
      .then(setNpc)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  // Runas: buscar por tier e filtrar por elementos do personagem (Básicas 1 elem, Intermediárias 2, Avançadas 3)
  useEffect(() => {
    const charRunas = npc?.runas && Array.isArray(npc.runas) ? npc.runas : []
    if (charRunas.length === 0) {
      setRunasByTier({ basico: [], intermediario: [], superior: [] })
      setRunasList([])
      return
    }
    Promise.all([
      list('runas', { tier: 'Básico' }),
      list('runas', { tier: 'Intermediário' }),
      list('runas', { tier: 'Superior' }),
    ])
      .then(([basico, inter, superior]) => {
        const b = Array.isArray(basico) ? basico : []
        const i = Array.isArray(inter) ? inter : []
        const s = Array.isArray(superior) ? superior : []
        const charSet = new Set(charRunas.map((x) => String(x).trim().toLowerCase()))
        const basicoFiltrado = b.filter((r) => runaMatchesChar(r, charRunas, 1))
        const interFiltrado = charRunas.length >= 2 ? i.filter((r) => runaMatchesChar(r, charRunas, 2)) : []
        const avancFiltrado = charRunas.length >= 3 ? s.filter((r) => setEqual((r.elementos || []), charRunas)) : []
        setRunasByTier({ basico: basicoFiltrado, intermediario: interFiltrado, superior: avancFiltrado })
        setRunasList([...basicoFiltrado, ...interFiltrado, ...avancFiltrado])
      })
      .catch(() => {
        setRunasByTier({ basico: [], intermediario: [], superior: [] })
        setRunasList([])
      })
  }, [npc?.runas])

  const equipamentos = npc?.equipamentos || []
  const armaduras = equipamentos.filter((e) => (e.tipo || '') === 'Armadura')
  const escudos = equipamentos.filter((e) => (e.tipo || '') === 'Escudo')
  const armas = equipamentos.filter((e) => (e.tipo || '').toLowerCase() in { melee: 1, ranged: 1, arcane: 1 })
  const armaduraAtiva = armaduras.find((e) => (parseFloat(e.durabilidade) || 0) > 0)
  const escudoAtivo = escudos.find((e) => (parseFloat(e.durabilidade) || 0) > 0)
  const armasAtivas = armas.filter((e) => (parseFloat(e.durabilidade) || 0) > 0)
  const temEscudo = escudoAtivo != null
  const temArma = armasAtivas.length > 0

  const pericia = parseFloat(npc?.pericia) || 0
  const armaduraVal = armaduraAtiva
    ? (parseFloat(armaduraAtiva.defesa) || parseFloat(armaduraAtiva.bônus) || parseFloat(armaduraAtiva.bonus) || 0)
    : 0

  const aplicarCurar = () => {
    setError(null)
    const raw = (curarVal || '').trim()
    const v = raw === '' ? NaN : parseInt(raw, 10)
    if (raw === '' || isNaN(v) || v < 0) {
      setError('Digite um valor numérico válido (número inteiro ≥ 0).')
      return
    }
    const hpTotal = parseFloat(npc.hp_total) || 0
    const hpAtual = parseFloat(npc.hp_atual) ?? hpTotal
    const novoHp = Math.min(hpTotal, hpAtual + v)
    const curado = novoHp - hpAtual
    update('npcs', id, { hp_atual: novoHp })
      .then(() => {
        setNpc((p) => (p ? { ...p, hp_atual: novoHp } : null))
        setResumoAcao({ tipo: 'curar', texto: `${npc.nome} foi curado em ${curado} HP. HP atual: ${novoHp} / ${hpTotal}.` })
      })
      .catch((e) => setError(e.message))
  }

  const aplicarRecuperarArcana = () => {
    setError(null)
    const raw = (arcanaVal || '').trim()
    const v = raw === '' ? NaN : parseInt(raw, 10)
    if (raw === '' || isNaN(v) || v < 0) {
      setError('Digite um valor numérico válido (número inteiro ≥ 0).')
      return
    }
    const arcanaAtual = parseFloat(npc.arcana_atual) ?? 0
    const novoArcana = arcanaAtual + v
    update('npcs', id, { arcana_atual: novoArcana })
      .then(() => {
        setNpc((p) => (p ? { ...p, arcana_atual: novoArcana } : null))
        setResumoAcao({ tipo: 'arcana', texto: `${npc.nome} recuperou ${v} de arcana. Arcana atual: ${novoArcana}.` })
      })
      .catch((e) => setError(e.message))
  }

  const aplicarGastarArcana = () => {
    setError(null)
    const raw = (gastarArcanaVal || '').trim()
    const v = raw === '' ? NaN : parseInt(raw, 10)
    if (raw === '' || isNaN(v) || v < 0) {
      setError('Digite um valor numérico válido (número inteiro ≥ 0).')
      return
    }
    const arcanaAtual = parseFloat(npc.arcana_atual) ?? 0
    const novoArcana = Math.max(0, arcanaAtual - v)
    update('npcs', id, { arcana_atual: novoArcana })
      .then(() => {
        setNpc((p) => (p ? { ...p, arcana_atual: novoArcana } : null))
        setModalGastarArcana(false)
        setGastarArcanaVal('')
      })
      .catch((e) => setError(e.message))
  }

  const aplicarDefender = () => {
    setError(null)
    const raw = (ataqueDefender || '').trim()
    const ataqueTotal = raw === '' ? NaN : parseFloat(raw.replace(',', '.'))
    if (raw === '' || isNaN(ataqueTotal) || ataqueTotal < 0 || !escudoAtivo) {
      if (!escudoAtivo) return
      setError('Digite um valor numérico válido (número ≥ 0).')
      return
    }
    const defesaStr = escudoAtivo.defesa || escudoAtivo.bônus || escudoAtivo.bonus || '0'
    const atributo = getAtributoByPeso(npc, escudoAtivo.peso)
    const defesaEscudoRoll = rollDice(defesaStr)
    const d10 = rollDice('1d10')
    const rolagemDefesa = atributo + pericia + defesaEscudoRoll + d10
    const hpAtual = parseFloat(npc.hp_atual) ?? 0
    const hpTotal = parseFloat(npc.hp_total) || 1

    if (ataqueTotal > rolagemDefesa) {
      const danoEfetivo = Math.max(0, ataqueTotal - armaduraVal)
      const novoHp = Math.max(0, hpAtual - danoEfetivo)
      const durabArmadura = armaduraAtiva ? parseFloat(armaduraAtiva.durabilidade) || 0 : 0
      const reducaoArmadura = ataqueTotal * 0.5
      const novaDurabArmadura = armaduraAtiva ? Math.max(0, durabArmadura - reducaoArmadura) : null

      const promises = [update('npcs', id, { hp_atual: novoHp })]
      if (armaduraAtiva && novaDurabArmadura !== null) {
        promises.push(update(EQUIPAMENTO_NPC, armaduraAtiva._id, { ...armaduraAtiva, durabilidade: novaDurabArmadura }))
      }
      Promise.all(promises)
        .then(() => {
          setNpc((p) => (p ? { ...p, hp_atual: novoHp } : null))
          if (armaduraAtiva && novaDurabArmadura !== null) load()
          const msgArmadura = armaduraAtiva ? ` Armadura perdeu ${reducaoArmadura.toFixed(0)} de durabilidade.` : ''
          setResumoAcao({ tipo: 'defender', texto: `${npc.nome} não defendeu (rolagem ${rolagemDefesa} < ataque ${ataqueTotal}). Dano aplicado: ${danoEfetivo}. HP atual: ${novoHp}.${msgArmadura}` })
        })
        .catch((e) => setError(e.message))
    } else {
      const reducaoEscudo = ataqueTotal / 2
      const durabEscudo = parseFloat(escudoAtivo.durabilidade) || 0
      const novaDurabEscudo = Math.max(0, durabEscudo - reducaoEscudo)
      update(EQUIPAMENTO_NPC, escudoAtivo._id, { ...escudoAtivo, durabilidade: novaDurabEscudo })
        .then(() => {
          load()
          setResumoAcao({ tipo: 'defender', texto: `${npc.nome} defendeu com sucesso (rolagem de defesa: ${rolagemDefesa}). Escudo perdeu ${reducaoEscudo.toFixed(0)} de durabilidade e ficou com ${novaDurabEscudo}.` })
        })
        .catch((e) => setError(e.message))
    }
  }

  const aplicarAparar = () => {
    setError(null)
    const raw = (ataqueAparar || '').trim()
    const ataqueTotal = raw === '' ? NaN : parseFloat(raw.replace(',', '.'))
    const arma = armaAparar || armasAtivas[0]
    if (raw === '' || isNaN(ataqueTotal) || ataqueTotal < 0 || !arma) {
      if (!arma) return
      setError('Digite um valor numérico válido (número ≥ 0).')
      return
    }
    const atributo = getAtributoByPeso(npc, arma.peso)
    const d10 = rollDice('1d10')
    const rolagemAparar = atributo + pericia + d10
    const hpAtual = parseFloat(npc.hp_atual) ?? 0

    if (ataqueTotal > rolagemAparar) {
      const danoEfetivo = Math.max(0, ataqueTotal - armaduraVal)
      const novoHp = Math.max(0, hpAtual - danoEfetivo)
      const durabArmadura = armaduraAtiva ? parseFloat(armaduraAtiva.durabilidade) || 0 : 0
      const reducaoArmadura = ataqueTotal * 0.5
      const novaDurabArmadura = armaduraAtiva ? Math.max(0, durabArmadura - reducaoArmadura) : null

      const promises = [update('npcs', id, { hp_atual: novoHp })]
      if (armaduraAtiva && novaDurabArmadura !== null) {
        promises.push(update(EQUIPAMENTO_NPC, armaduraAtiva._id, { ...armaduraAtiva, durabilidade: novaDurabArmadura }))
      }
      Promise.all(promises)
        .then(() => {
          setNpc((p) => (p ? { ...p, hp_atual: novoHp } : null))
          if (armaduraAtiva && novaDurabArmadura !== null) load()
          const msgArmadura = armaduraAtiva ? ` Armadura perdeu durabilidade.` : ''
          setResumoAcao({ tipo: 'aparar', texto: `${npc.nome} não aparou (rolagem ${rolagemAparar} < ataque ${ataqueTotal}). Dano aplicado: ${danoEfetivo}. HP atual: ${novoHp}.${msgArmadura}` })
        })
        .catch((e) => setError(e.message))
    } else {
      const durabArma = parseFloat(arma.durabilidade) || 0
      const novaDurabArma = Math.max(0, durabArma - ataqueTotal)
      update(EQUIPAMENTO_NPC, arma._id, { ...arma, durabilidade: novaDurabArma })
        .then(() => {
          load()
          setResumoAcao({ tipo: 'aparar', texto: `${npc.nome} aparou com sucesso (rolagem: ${rolagemAparar}). A arma ${arma.nome} perdeu ${ataqueTotal} de durabilidade e ficou com ${novaDurabArma}.` })
        })
        .catch((e) => setError(e.message))
    }
  }

  const aplicarDano = () => {
    setError(null)
    const str = (danoVal || '').trim()
    const raw = str === '' ? NaN : parseFloat(str.replace(',', '.'))
    if (str === '' || isNaN(raw) || raw < 0) {
      setError('Digite um valor numérico válido (número ≥ 0).')
      return
    }
    const danoEfetivo = Math.max(0, raw - armaduraVal)
    const hpAtual = parseFloat(npc.hp_atual) ?? 0
    const novoHp = Math.max(0, hpAtual - danoEfetivo)
    const durabArmadura = armaduraAtiva ? parseFloat(armaduraAtiva.durabilidade) || 0 : 0
    const reducaoArmadura = raw * 0.5
    const novaDurabArmadura = armaduraAtiva ? Math.max(0, durabArmadura - reducaoArmadura) : null

    const promises = [update('npcs', id, { hp_atual: novoHp })]
    if (armaduraAtiva && novaDurabArmadura !== null) {
      promises.push(update(EQUIPAMENTO_NPC, armaduraAtiva._id, { ...armaduraAtiva, durabilidade: novaDurabArmadura }))
    }
    Promise.all(promises)
      .then(() => {
        setNpc((p) => (p ? { ...p, hp_atual: novoHp } : null))
        if (armaduraAtiva && novaDurabArmadura !== null) load()
        const msgArmadura = armaduraAtiva ? ` Armadura perdeu ${(raw * 0.5).toFixed(0)} de durabilidade.` : ''
        setResumoAcao({ tipo: 'dano', texto: `${npc.nome} sofreu ${danoEfetivo} de dano (ataque ${raw} − armadura ${armaduraVal}). HP atual: ${novoHp}.${msgArmadura}` })
      })
      .catch((e) => setError(e.message))
  }

  const aplicarDanoDireto = () => {
    setError(null)
    const str = (danoDiretoVal || '').trim()
    const raw = str === '' ? NaN : parseInt(str, 10)
    if (str === '' || isNaN(raw) || raw < 0) {
      setError('Digite um valor numérico válido (número inteiro ≥ 0).')
      return
    }
    const hpAtual = parseFloat(npc.hp_atual) ?? 0
    const novoHp = Math.max(0, hpAtual - raw)
    update('npcs', id, { hp_atual: novoHp })
      .then(() => {
        setNpc((p) => (p ? { ...p, hp_atual: novoHp } : null))
        setResumoAcao({ tipo: 'danoDireto', texto: `${npc.nome} sofreu ${raw} de dano direto (ignora armadura). HP atual: ${novoHp}.` })
      })
      .catch((e) => setError(e.message))
  }

  const fecharModalComResumo = () => {
    setResumoAcao(null)
    setModalCurar(false)
    setCurarVal('')
    setModalArcana(false)
    setArcanaVal('')
    setModalDefender(false)
    setAtaqueDefender('')
    setModalAparar(false)
    setAtaqueAparar('')
    setArmaAparar(null)
    setModalDano(false)
    setDanoVal('')
    setModalDanoDireto(false)
    setDanoDiretoVal('')
  }

  const podeEquiparArmamento = (armas.length < 2 || escudos.length < 1 || armaduras.length < 1)

  const abrirEquiparArmamento = () => {
    setEqArmError(null)
    const equips = npc?.equipamentos || []
    const nArmas = equips.filter((e) => (e.tipo || '').toLowerCase() in { melee: 1, ranged: 1, arcane: 1 }).length
    const nEscudos = equips.filter((e) => (e.tipo || '') === 'Escudo').length
    const nArmaduras = equips.filter((e) => (e.tipo || '') === 'Armadura').length
    const podeArma = nArmas < 2
    const podeEscudo = nEscudos < 1
    const podeArmadura = nArmaduras < 1
    const tipoInicial = podeArma ? 'arma' : 'armadura'
    const subtipoInicial = podeArma ? 'melee' : (podeEscudo ? 'Escudo' : 'Armadura')
    setEqArmTipo(tipoInicial)
    setEqArmSubtipo(subtipoInicial)
    setEqArmItemId('')
    setEqArmTipoMaterial('')
    setEqArmMaterialId('')
    setEqArmTemRuna(false)
    setEqArmTierRuna('')
    setEqArmElementos([])
    setEqArmRunaIds([])
    setEqArmPrevia(null)
    setEqArmSelectedMaterial(null)
    setModalEquiparArmamento(true)
    setEqArmLoading(true)
    Promise.all([list('armas'), list('armaduras')])
      .then(([a, ar]) => {
        setEqArmListArmas(Array.isArray(a) ? a : [])
        setEqArmListArmaduras(Array.isArray(ar) ? ar : [])
      })
      .catch((e) => setEqArmError(e.message))
      .finally(() => setEqArmLoading(false))
  }

  // No banco, materiais demoníacos usam tipo "demon", não "demoníaco"
  const tipoMaterialParaApi = (t) => (t === 'demoníaco' ? 'demon' : t || '')
  useEffect(() => {
    if (!modalEquiparArmamento || !eqArmTipoMaterial) {
      setEqArmListMateriais([])
      return
    }
    list('materiais', { tipo: tipoMaterialParaApi(eqArmTipoMaterial) })
      .then((data) => setEqArmListMateriais(Array.isArray(data) ? data : []))
      .catch(() => setEqArmListMateriais([]))
  }, [modalEquiparArmamento, eqArmTipoMaterial])

  useEffect(() => {
    if (!modalEquiparArmamento || !eqArmTemRuna || !eqArmTierRuna || eqArmElementos.length !== numElementosRuna) {
      setEqArmRunasFiltradas([])
      return
    }
    list('runas', { tier: eqArmTierRuna, elemento: eqArmElementos })
      .then((data) => setEqArmRunasFiltradas(Array.isArray(data) ? data : []))
      .catch(() => setEqArmRunasFiltradas([]))
  }, [modalEquiparArmamento, eqArmTemRuna, eqArmTierRuna, eqArmElementos, numElementosRuna])

  const itensEquipFiltrados = eqArmTipo === 'arma'
    ? eqArmListArmas.filter((i) => (i.tipo || '').toLowerCase() === eqArmSubtipo.toLowerCase())
    : eqArmListArmaduras.filter((i) => (i.tipo || '') === eqArmSubtipo)

  const toggleEqArmRuna = (runaId) => {
    setEqArmRunaIds((prev) => {
      const ids = prev || []
      if (ids.includes(runaId)) return ids.filter((x) => x !== runaId)
      return [...ids, runaId]
    })
  }

  const calcularPreviaEquip = () => {
    if (!eqArmItemId || !eqArmMaterialId) {
      setEqArmError('Selecione o item e o material.')
      return
    }
    setEqArmPreviaLoading(true)
    setEqArmError(null)
    equipamentoPrevia({
      tipo: eqArmTipo,
      item_id: eqArmItemId,
      material_id: eqArmMaterialId,
      runa_ids: eqArmRunaIds || [],
    })
      .then(setEqArmPrevia)
      .catch((e) => setEqArmError(e.message))
      .finally(() => setEqArmPreviaLoading(false))
  }

  const salvarEquipamentoNPC = () => {
    if (!eqArmPrevia || !npc) return
    const mat = eqArmSelectedMaterial
    const payload = {
      personagem_dono: npc.nome,
      nome: eqArmPrevia.nome,
      tipo: eqArmPrevia.tipo,
      bônus: eqArmPrevia.dano != null ? eqArmPrevia.dano : (eqArmPrevia.defesa != null ? String(eqArmPrevia.defesa) : ''),
      durabilidade: eqArmPrevia.durabilidade,
      peso: eqArmPrevia.peso ?? '',
      preco: eqArmPrevia.preco ?? '',
      nome_material: eqArmPrevia.material ?? '',
      rank: mat?.rank ?? '',
      raridade: eqArmPrevia.raridade ?? '',
      tipo_material: mat?.tipo ?? '',
      efeito: (eqArmPrevia.runas || []).map((r) => r.efeito).filter(Boolean).join('; ') || '',
      runas: eqArmPrevia.runas || [],
    }
    setEqArmSaving(true)
    setEqArmError(null)
    create(EQUIPAMENTO_NPC, payload)
      .then(() => {
        setModalEquiparArmamento(false)
        load()
      })
      .catch((e) => setEqArmError(e.message))
      .finally(() => setEqArmSaving(false))
  }

  const abrirEquiparElixir = () => {
    setElixirError(null)
    setElixirSelecionado(null)
    setElixirMaterialEscolhido('')
    setModalEquiparElixir(true)
    setElixirLoading(true)
    list('alquimia')
      .then((data) => setElixirLista(Array.isArray(data) ? data : []))
      .catch((e) => setElixirError(e.message))
      .finally(() => setElixirLoading(false))
  }

  const MATERIAIS_ELIXIR = ['vegetal', 'animal', 'mineral', 'demoníaco']
  const salvarElixirNPC = () => {
    if (!elixirSelecionado || !elixirMaterialEscolhido || !npc) return
    const campoRar = `${elixirMaterialEscolhido}_rar`
    const campoPot = `${elixirMaterialEscolhido}_pot`
    const raridade = elixirSelecionado[campoRar] ?? 'Comum'
    const potencia = elixirSelecionado[campoPot] ?? ''
    const nomeMaterial = elixirMaterialEscolhido.charAt(0).toUpperCase() + elixirMaterialEscolhido.slice(1)
    setElixirSaving(true)
    setElixirError(null)
    create(ELIXIR_NPC, {
      personagem_dono: npc.nome,
      nome: elixirSelecionado.nome ?? '',
      efeito: elixirSelecionado.efeito ?? '',
      materia_prima: nomeMaterial,
      raridade,
      bonus_materia_prima: potencia,
    })
      .then(() => {
        setModalEquiparElixir(false)
        load()
      })
      .catch((e) => setElixirError(e.message))
      .finally(() => setElixirSaving(false))
  }

  const confirmarUsarElixir = () => {
    const el = modalUsarElixir
    if (!el) return
    update(ELIXIR_NPC, el._id, { ...el, usado: true })
      .then(() => {
        setNpc((p) => (p ? { ...p, elixires: (p.elixires || []).map((e) => (e._id === el._id ? { ...e, usado: true } : e)) } : null))
        setModalUsarElixir(null)
      })
      .catch((e) => setError(e.message))
  }

  const aplicarRolarAtributo = () => {
    if (!atributoSelecionado) return
    const val = parseFloat(npc[atributoSelecionado]) || 0
    const d10 = roll1d10Explode()
    const total = val + pericia + d10
    setResultadoRolagem({ atributo: atributoSelecionado, valorAtributo: val, d10, total })
  }

  const abrirModalJogarFora = (eq) => {
    if (eq) setModalJogarFora(eq)
  }

  const confirmarJogarFora = () => {
    const eq = modalJogarFora
    if (!eq) return
    setError(null)
    remove(EQUIPAMENTO_NPC, eq._id)
      .then(() => {
        setModalJogarFora(null)
        load()
      })
      .catch((e) => setError(e.message))
  }

  const adicionarObservacao = () => {
    const txt = novaObservacao.trim()
    if (!txt || !npc) return
    setError(null)
    const obs = Array.isArray(npc.observacoes) ? npc.observacoes : []
    update('npcs', id, { observacoes: [...obs, txt] })
      .then(() => {
        setNpc((p) => (p ? { ...p, observacoes: [...obs, txt] } : null))
        setNovaObservacao('')
      })
      .catch((e) => setError(e.message))
  }

  const removerObservacao = (index) => {
    if (!npc) return
    const obs = Array.isArray(npc.observacoes) ? npc.observacoes : []
    const nova = obs.filter((_, i) => i !== index)
    setError(null)
    update('npcs', id, { observacoes: nova })
      .then(() => setNpc((p) => (p ? { ...p, observacoes: nova } : null)))
      .catch((e) => setError(e.message))
  }

  const confirmarReparar = () => {
    const eq = modalReparar
    if (!eq) return
    setError(null)
    const str = (repararVal || '').trim()
    const v = str === '' ? NaN : parseInt(str, 10)
    if (str === '' || isNaN(v) || v < 0) {
      setError('Digite um valor numérico válido (número inteiro ≥ 0).')
      return
    }
    const durab = parseFloat(eq.durabilidade) || 0
    const novaDurab = durab + v
    update(EQUIPAMENTO_NPC, eq._id, { ...eq, durabilidade: novaDurab })
      .then(() => {
        load()
        setModalReparar(null)
        setRepararVal('')
      })
      .catch((e) => setError(e.message))
  }

  const confirmarUsarRuna = () => {
    const r = modalUsarRuna
    if (!r) return
    const custo = CUSTO_RUNA[r.tier] ?? 0
    const arcanaAtual = parseFloat(npc.arcana_atual) ?? 0
    if (arcanaAtual < custo) {
      setError('Arcana insuficiente para usar a runa')
      return
    }
    const novoArcana = Math.max(0, arcanaAtual - custo)
    update('npcs', id, { arcana_atual: novoArcana })
      .then(() => {
        setNpc((p) => (p ? { ...p, arcana_atual: novoArcana } : null))
        setModalUsarRuna(null)
        setError(null)
      })
      .catch((e) => setError(e.message))
  }

  if (loading) return <p>Carregando…</p>
  if (error && !npc) return <p className="error-msg">{error}</p>
  if (!npc) return <p>NPC não encontrado.</p>

  const hpAtual = parseFloat(npc.hp_atual) ?? 0
  const estaMorto = hpAtual <= 0

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/npcs">← Voltar à lista</Link>
        <Link to={`/npcs/${id}/ficha`}><button type="button" className="primary">Visualizar ficha</button></Link>
      </div>

      <div className="card" style={{ marginBottom: '1rem', border: estaMorto ? '2px solid #dc2626' : undefined }}>
        <h2 style={{ marginTop: 0 }}>{npc.nome}</h2>
        {estaMorto && (
          <p style={{ color: '#dc2626', fontWeight: 600, marginBottom: '0.5rem' }}>⚠ Este personagem está morto (HP = 0).</p>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
          <div><strong>HP</strong><br />{npc.hp_atual} / {npc.hp_total}</div>
          <div><strong>Arcana</strong><br />{npc.arcana_atual} / {npc.arcana_total}</div>
          <div><strong>Perícia</strong><br />+{npc.pericia ?? '—'}</div>
          <div><strong>Armadura</strong><br />{npc.armadura_val ?? '—'}</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
          <button type="button" onClick={() => { setError(null); setModalCurar(true); setCurarVal(''); }}>Curar</button>
          <button type="button" onClick={() => { setError(null); setModalArcana(true); setArcanaVal(''); }}>Recuperar arcana</button>
          <button type="button" onClick={() => { setError(null); setModalGastarArcana(true); setGastarArcanaVal(''); }}>Gastar arcana</button>
          {temEscudo && <button type="button" onClick={() => { setError(null); setModalDefender(true); setAtaqueDefender(''); }}>Defender</button>}
          {temArma && (
            <button type="button" onClick={() => { setError(null); setModalAparar(true); setAtaqueAparar(''); setArmaAparar(armasAtivas.length >= 2 ? null : armasAtivas[0]); }}>
              Aparar
            </button>
          )}
          <button type="button" onClick={() => { setError(null); setModalDano(true); setDanoVal(''); }}>Tomar dano</button>
          <button type="button" onClick={() => { setError(null); setModalDanoDireto(true); setDanoDiretoVal(''); }}>Tomar dano direto</button>
          <button type="button" onClick={() => { setError(null); setResultadoRolagem(null); setAtributoSelecionado(''); setModalRolarAtributo(true); }}>Rolar Atributo</button>
          {podeEquiparArmamento && <button type="button" onClick={abrirEquiparArmamento}>Equipar armamento</button>}
          <button type="button" onClick={abrirEquiparElixir}>Equipar elixir</button>
        </div>
      </div>

      {/* Equipamentos — colapsável */}
      {(armas.length > 0 || escudos.length > 0 || armaduras.length > 0) && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3 style={{ marginTop: 0, cursor: 'pointer', userSelect: 'none' }} onClick={() => setEquipamentosOpen((o) => !o)}>
            {equipamentosOpen ? '▼' : '▶'} Equipamentos
          </h3>
          {equipamentosOpen && (
            <>
              {armas.map((eq) => {
                const durab = parseFloat(eq.durabilidade) || 0
                const quebrado = durab <= 0
                return (
                  <div key={eq._id} style={{ marginBottom: '0.75rem', padding: '0.5rem', background: 'var(--bg-card-hover)', borderRadius: 6, border: quebrado ? '1px solid #dc2626' : '1px solid var(--border-frame)', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong>{eq.nome}</strong> ({eq.tipo}) {quebrado && <span style={{ color: '#dc2626', fontSize: '0.85rem' }}>— Quebrado</span>}
                      {eq.dano != null && <div style={{ fontSize: '0.9rem' }}>Dano: {eq.dano}</div>}
                      {eq.efeito && <div style={{ fontSize: '0.85rem' }}>Efeito: {eq.efeito}</div>}
                      {(eq.runas && eq.runas.length > 0) && (
                        <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                          Runas: {eq.runas.map((r, i) => {
                            const key = `${eq._id}-${i}`
                            const expanded = expandedRunaKey === key
                            return (
                              <span key={i}>
                                <span
                                  className="badge"
                                  style={{ marginRight: '0.25rem', cursor: 'pointer', textDecoration: 'underline' }}
                                  onClick={() => setExpandedRunaKey(expanded ? null : key)}
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedRunaKey(expanded ? null : key); } }}
                                >
                                  {r.nome}{r.tier ? ` (${r.tier})` : ''}
                                </span>
                                {expanded && (
                                  <div style={{ marginTop: '0.35rem', padding: '0.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-frame)', borderRadius: 6, fontSize: '0.9rem' }}>
                                    <strong>Efeito:</strong> {r.efeito ?? '—'}
                                  </div>
                                )}
                              </span>
                            )
                          })}
                        </div>
                      )}
                      <div style={{ fontSize: '0.85rem', color: 'var(--parchment-dark)' }}>Durabilidade: {eq.durabilidade ?? '—'}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button type="button" onClick={() => { setModalReparar(eq); setRepararVal(''); }}>Reparar</button>
                      <button type="button" onClick={() => abrirModalJogarFora(eq)}>Jogar fora</button>
                    </div>
                  </div>
                )
              })}
              {escudos.map((eq) => {
                const durab = parseFloat(eq.durabilidade) || 0
                const quebrado = durab <= 0
                return (
                  <div key={eq._id} style={{ marginBottom: '0.75rem', padding: '0.5rem', background: 'var(--bg-card-hover)', borderRadius: 6, border: quebrado ? '1px solid #dc2626' : '1px solid var(--border-frame)', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong>{eq.nome}</strong> (Escudo) {quebrado && <span style={{ color: '#dc2626', fontSize: '0.85rem' }}>— Quebrado</span>}
                      {(eq.defesa != null || eq.bônus != null || eq.bonus != null) && <div style={{ fontSize: '0.9rem' }}>Defesa: {eq.defesa ?? eq.bônus ?? eq.bonus}</div>}
                      {eq.efeito && <div style={{ fontSize: '0.85rem' }}>Efeito: {eq.efeito}</div>}
                      {(eq.runas && eq.runas.length > 0) && (
                        <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                          Runas: {eq.runas.map((r, i) => {
                            const key = `${eq._id}-${i}`
                            const expanded = expandedRunaKey === key
                            return (
                              <span key={i}>
                                <span
                                  className="badge"
                                  style={{ marginRight: '0.25rem', cursor: 'pointer', textDecoration: 'underline' }}
                                  onClick={() => setExpandedRunaKey(expanded ? null : key)}
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedRunaKey(expanded ? null : key); } }}
                                >
                                  {r.nome}{r.tier ? ` (${r.tier})` : ''}
                                </span>
                                {expanded && (
                                  <div style={{ marginTop: '0.35rem', padding: '0.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-frame)', borderRadius: 6, fontSize: '0.9rem' }}>
                                    <strong>Efeito:</strong> {r.efeito ?? '—'}
                                  </div>
                                )}
                              </span>
                            )
                          })}
                        </div>
                      )}
                      <div style={{ fontSize: '0.85rem', color: 'var(--parchment-dark)' }}>Durabilidade: {eq.durabilidade ?? '—'}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button type="button" onClick={() => { setModalReparar(eq); setRepararVal(''); }}>Reparar</button>
                      <button type="button" onClick={() => abrirModalJogarFora(eq)}>Jogar fora</button>
                    </div>
                  </div>
                )
              })}
              {armaduras.map((eq) => {
                const durab = parseFloat(eq.durabilidade) || 0
                const quebrado = durab <= 0
                return (
                  <div key={eq._id} style={{ marginBottom: '0.75rem', padding: '0.5rem', background: 'var(--bg-card-hover)', borderRadius: 6, border: quebrado ? '1px solid #dc2626' : '1px solid var(--border-frame)', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong>{eq.nome}</strong> (Armadura) {quebrado && <span style={{ color: '#dc2626', fontSize: '0.85rem' }}>— Quebrado</span>}
                      {(eq.defesa != null || eq.bônus != null) && <div style={{ fontSize: '0.9rem' }}>Defesa: {eq.defesa ?? eq.bônus ?? eq.bonus}</div>}
                      {eq.efeito && <div style={{ fontSize: '0.85rem' }}>Efeito: {eq.efeito}</div>}
                      {(eq.runas && eq.runas.length > 0) && (
                        <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                          Runas: {eq.runas.map((r, i) => {
                            const key = `${eq._id}-${i}`
                            const expanded = expandedRunaKey === key
                            return (
                              <span key={i}>
                                <span
                                  className="badge"
                                  style={{ marginRight: '0.25rem', cursor: 'pointer', textDecoration: 'underline' }}
                                  onClick={() => setExpandedRunaKey(expanded ? null : key)}
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedRunaKey(expanded ? null : key); } }}
                                >
                                  {r.nome}{r.tier ? ` (${r.tier})` : ''}
                                </span>
                                {expanded && (
                                  <div style={{ marginTop: '0.35rem', padding: '0.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-frame)', borderRadius: 6, fontSize: '0.9rem' }}>
                                    <strong>Efeito:</strong> {r.efeito ?? '—'}
                                  </div>
                                )}
                              </span>
                            )
                          })}
                        </div>
                      )}
                      <div style={{ fontSize: '0.85rem', color: 'var(--parchment-dark)' }}>Durabilidade: {eq.durabilidade ?? '—'}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button type="button" onClick={() => { setModalReparar(eq); setRepararVal(''); }}>Reparar</button>
                      <button type="button" onClick={() => abrirModalJogarFora(eq)}>Jogar fora</button>
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>
      )}

      {/* Observações — colapsável */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3 style={{ marginTop: 0, cursor: 'pointer', userSelect: 'none' }} onClick={() => setObservacoesOpen((o) => !o)}>
          {observacoesOpen ? '▼' : '▶'} Observações
        </h3>
        {observacoesOpen && (
          <>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', marginBottom: '0.75rem' }}>
              {(npc.observacoes || []).length === 0 ? (
                <li style={{ color: 'var(--parchment-dark)', fontSize: '0.9rem' }}>Nenhuma observação.</li>
              ) : (
                (npc.observacoes || []).map((obs, idx) => (
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

      {/* Elixires — colapsável */}
      {(npc.elixires?.length > 0) && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3 style={{ marginTop: 0, cursor: 'pointer', userSelect: 'none' }} onClick={() => setElixiresOpen((o) => !o)}>
            {elixiresOpen ? '▼' : '▶'} Elixires
          </h3>
          {elixiresOpen && (
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
              {npc.elixires.map((el) => {
                const usado = el.usado === true
                const expanded = expandedElixirId === el._id
                return (
                  <li key={el._id} style={{ marginBottom: '0.5rem', padding: '0.5rem', borderRadius: 6, border: usado ? '1px solid #94a3b8' : '1px solid var(--border-frame)', background: usado ? 'var(--bg-card-hover)' : undefined, opacity: usado ? 0.85 : 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <div
                        style={{ flex: 1, minWidth: 0, cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => setExpandedElixirId(expanded ? null : el._id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedElixirId(expanded ? null : el._id); } }}
                      >
                        <strong>{el.nome}</strong> {usado && <span style={{ color: '#64748b', fontSize: '0.85rem' }}>— Usado</span>}
                        {el.efeito && <div style={{ fontSize: '0.9rem', textDecoration: 'none' }}>Efeito: {el.efeito}</div>}
                      </div>
                      {!usado && <button type="button" onClick={(ev) => { ev.stopPropagation(); setModalUsarElixir(el); }}>Usar Elixir</button>}
                    </div>
                    {expanded && (
                      <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-frame)', borderRadius: 6, fontSize: '0.9rem' }}>
                        <div><strong>Material:</strong> {el.materia_prima ?? '—'}</div>
                        <div><strong>Raridade:</strong> {el.raridade ?? '—'}</div>
                        <div><strong>Potência:</strong> {el.bonus_materia_prima ?? '—'}</div>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      {/* Runas — colapsável e 3 boxes (Básicas, Intermediárias, Avançadas) */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3 style={{ marginTop: 0, cursor: 'pointer', userSelect: 'none' }} onClick={() => setRunasOpen((o) => !o)}>
          {runasOpen ? '▼' : '▶'} Runas
        </h3>
        {runasOpen && (
          <>
            {!(npc.runas && npc.runas.length > 0) ? (
              <p style={{ color: 'var(--parchment-dark)', margin: 0 }}>O {npc.nome} não sabe usar runas.</p>
            ) : (
              <>
                <div style={{ marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: '0.5rem 0', cursor: 'pointer', userSelect: 'none' }} onClick={() => setRunasBasicasOpen((o) => !o)}>
                    {runasBasicasOpen ? '▼' : '▶'} Runas Básicas
                  </h4>
                  {runasBasicasOpen && (
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                      {runasByTier.basico.length === 0 ? <li style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>Nenhuma</li> : runasByTier.basico.map((r) => (
                        <li key={r._id} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <div><strong>{r.nome}</strong> <span className="badge">{r.tier}</span>{r.efeito && <div style={{ fontSize: '0.9rem' }}>Efeito: {r.efeito}</div>}</div>
                          <button type="button" onClick={() => setModalUsarRuna(r)}>Usar Runa</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: '0.5rem 0', cursor: 'pointer', userSelect: 'none' }} onClick={() => setRunasInterOpen((o) => !o)}>
                    {runasInterOpen ? '▼' : '▶'} Runas Intermediárias
                  </h4>
                  {runasInterOpen && (
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                      {runasByTier.intermediario.length === 0 ? <li style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>Nenhuma</li> : runasByTier.intermediario.map((r) => (
                        <li key={r._id} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <div><strong>{r.nome}</strong> <span className="badge">{r.tier}</span>{r.efeito && <div style={{ fontSize: '0.9rem' }}>Efeito: {r.efeito}</div>}</div>
                          <button type="button" onClick={() => setModalUsarRuna(r)}>Usar Runa</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: '0.5rem 0', cursor: 'pointer', userSelect: 'none' }} onClick={() => setRunasAvancOpen((o) => !o)}>
                    {runasAvancOpen ? '▼' : '▶'} Runas Avançadas
                  </h4>
                  {runasAvancOpen && (
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                      {runasByTier.superior.length === 0 ? <li style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>Nenhuma</li> : runasByTier.superior.map((r) => (
                        <li key={r._id} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <div><strong>{r.nome}</strong> <span className="badge">{r.tier}</span>{r.efeito && <div style={{ fontSize: '0.9rem' }}>Efeito: {r.efeito}</div>}</div>
                          <button type="button" onClick={() => setModalUsarRuna(r)}>Usar Runa</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {error && <p className="error-msg">{error}</p>}

      <Modal open={modalCurar} onClose={fecharModalComResumo} title={`Curar — ${npc.nome}`}>
        {resumoAcao?.tipo === 'curar' ? (
          <>
            <p style={{ whiteSpace: 'pre-wrap' }}>{resumoAcao.texto}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="primary" onClick={fecharModalComResumo}>Fechar</button>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>Valor de cura será somado ao HP atual, sem ultrapassar o HP total.</p>
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

      <Modal open={modalArcana} onClose={fecharModalComResumo} title={`Recuperar arcana — ${npc.nome}`}>
        {resumoAcao?.tipo === 'arcana' ? (
          <>
            <p style={{ whiteSpace: 'pre-wrap' }}>{resumoAcao.texto}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="primary" onClick={fecharModalComResumo}>Fechar</button>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>Valor será somado à arcana atual (pode ultrapassar o total).</p>
            <div className="form-row">
              <label>Valor</label>
              <input type="text" inputMode="numeric" value={arcanaVal} onChange={(e) => setArcanaVal(e.target.value)} placeholder="0" />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="primary" onClick={aplicarRecuperarArcana}>Aplicar</button>
              <button type="button" onClick={fecharModalComResumo}>Cancelar</button>
            </div>
          </>
        )}
      </Modal>

      <Modal open={modalGastarArcana} onClose={() => { setModalGastarArcana(false); setGastarArcanaVal(''); }} title={`Gastar arcana — ${npc.nome}`}>
        <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>O valor será deduzido da arcana atual (mínimo 0).</p>
        <div className="form-row">
          <label>Valor a gastar</label>
          <input type="text" inputMode="numeric" value={gastarArcanaVal} onChange={(e) => setGastarArcanaVal(e.target.value)} placeholder="0" />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button type="button" className="primary" onClick={aplicarGastarArcana}>Aplicar</button>
          <button type="button" onClick={() => { setModalGastarArcana(false); setGastarArcanaVal(''); }}>Cancelar</button>
        </div>
      </Modal>

      <Modal open={modalDefender} onClose={fecharModalComResumo} title={`Defender — ${npc.nome}`}>
        {resumoAcao?.tipo === 'defender' ? (
          <>
            <p style={{ whiteSpace: 'pre-wrap' }}>{resumoAcao.texto}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="primary" onClick={fecharModalComResumo}>Fechar</button>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>Rolagem de defesa = atributo (por peso do escudo) + perícia + defesa do escudo (xdy+z) + 1d10. Se ataque &gt; defesa: dano em HP e 50% ataque na armadura. Se defesa ≥ ataque: ataque/2 na durabilidade do escudo.</p>
            <div className="form-row">
              <label>Valor total de ataque</label>
              <input type="text" inputMode="numeric" value={ataqueDefender} onChange={(e) => setAtaqueDefender(e.target.value)} placeholder="0" />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="primary" onClick={aplicarDefender}>Rolar defesa e aplicar</button>
              <button type="button" onClick={fecharModalComResumo}>Cancelar</button>
            </div>
          </>
        )}
      </Modal>

      <Modal open={modalAparar} onClose={fecharModalComResumo} title={`Aparar — ${npc.nome}`}>
        {resumoAcao?.tipo === 'aparar' ? (
          <>
            <p style={{ whiteSpace: 'pre-wrap' }}>{resumoAcao.texto}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="primary" onClick={fecharModalComResumo}>Fechar</button>
            </div>
          </>
        ) : (
          <>
            {armasAtivas.length >= 2 && (
              <div className="form-row">
                <label>Arma para aparar</label>
                <select value={armaAparar?._id || ''} onChange={(e) => setArmaAparar(armasAtivas.find((a) => a._id === e.target.value) || null)}>
                  <option value="">Selecione</option>
                  {armasAtivas.map((a) => (
                    <option key={a._id} value={a._id}>{a.nome}</option>
                  ))}
                </select>
              </div>
            )}
            <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>Rolagem de aparar = atributo (por peso da arma) + perícia + 1d10. Se ataque &gt; aparar: dano em HP e 50% ataque na armadura. Se aparar ≥ ataque: dano na durabilidade da arma.</p>
            <div className="form-row">
              <label>Valor total de ataque</label>
              <input type="text" inputMode="numeric" value={ataqueAparar} onChange={(e) => setAtaqueAparar(e.target.value)} placeholder="0" />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="primary" onClick={aplicarAparar} disabled={armasAtivas.length >= 2 && !armaAparar}>
                Rolar aparar e aplicar
              </button>
              <button type="button" onClick={fecharModalComResumo}>Cancelar</button>
            </div>
          </>
        )}
      </Modal>

      <Modal open={modalDano} onClose={fecharModalComResumo} title={`Tomar dano — ${npc.nome}`}>
        {resumoAcao?.tipo === 'dano' ? (
          <>
            <p style={{ whiteSpace: 'pre-wrap' }}>{resumoAcao.texto}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="primary" onClick={fecharModalComResumo}>Fechar</button>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>Dano efetivo = valor − armadura. Aplica ao HP e 50% do valor na durabilidade da armadura.</p>
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

      <Modal open={modalDanoDireto} onClose={fecharModalComResumo} title={`Tomar dano direto — ${npc.nome}`}>
        {resumoAcao?.tipo === 'danoDireto' ? (
          <>
            <p style={{ whiteSpace: 'pre-wrap' }}>{resumoAcao.texto}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="primary" onClick={fecharModalComResumo}>Fechar</button>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>Subtrai o valor do HP atual. Ignora armadura.</p>
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

      <Modal open={!!modalUsarElixir} onClose={() => setModalUsarElixir(null)} title="Usar Elixir">
        {modalUsarElixir && (
          <>
            <p><strong>{modalUsarElixir.nome}</strong></p>
            {modalUsarElixir.efeito && <p style={{ fontSize: '0.9rem' }}>{modalUsarElixir.efeito}</p>}
            <p style={{ fontSize: '0.85rem', color: 'var(--parchment-dark)' }}>O elixir será marcado como usado (efeito visual na lista).</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="primary" onClick={confirmarUsarElixir}>Confirmar uso</button>
              <button type="button" onClick={() => setModalUsarElixir(null)}>Cancelar</button>
            </div>
          </>
        )}
      </Modal>

      <Modal open={modalRolarAtributo} onClose={() => { setModalRolarAtributo(false); setResultadoRolagem(null); setAtributoSelecionado(''); }} title={`Rolar Atributo — ${npc.nome}`}>
        <div className="form-row">
          <label>Atributo</label>
          <select value={atributoSelecionado} onChange={(e) => setAtributoSelecionado(e.target.value)}>
            <option value="">Selecione</option>
            {ATRIBUTOS_NPC.map((a) => (
              <option key={a.key} value={a.key}>{a.label}: {npc[a.key] ?? '—'}</option>
            ))}
          </select>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>Total = atributo + perícia + 1d10 (se 10 soma outro 1d10, se 1 subtrai 1d10).</p>
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

      <Modal open={!!modalReparar} onClose={() => { setModalReparar(null); setRepararVal(''); }} title="Reparar equipamento">
        {modalReparar && (
          <>
            <p><strong>{modalReparar.nome}</strong></p>
            <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>Durabilidade atual: {modalReparar.durabilidade ?? '—'}. O valor digitado será somado.</p>
            <div className="form-row">
              <label>Valor a somar</label>
              <input type="text" inputMode="numeric" value={repararVal} onChange={(e) => setRepararVal(e.target.value)} placeholder="0" />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="primary" onClick={confirmarReparar}>Aplicar</button>
              <button type="button" onClick={() => { setModalReparar(null); setRepararVal(''); }}>Cancelar</button>
            </div>
          </>
        )}
      </Modal>

      <Modal open={!!modalJogarFora} onClose={() => setModalJogarFora(null)} title="Jogar fora equipamento">
        {modalJogarFora && (
          <>
            <p><strong>{modalJogarFora.nome}</strong> ({modalJogarFora.tipo})</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>
              O equipamento será removido deste personagem. Depois você poderá equipar outro no lugar pelo botão &quot;Equipar armamento&quot;.
            </p>
            <p style={{ fontWeight: 600 }}>Tem certeza?</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="primary" onClick={confirmarJogarFora}>Confirmar</button>
              <button type="button" onClick={() => setModalJogarFora(null)}>Cancelar</button>
            </div>
          </>
        )}
      </Modal>

      <Modal open={!!modalUsarRuna} onClose={() => { setModalUsarRuna(null); setError(null); }} title="Usar Runa">
        {modalUsarRuna && (
          <>
            <p><strong>{modalUsarRuna.nome}</strong> <span className="badge">{modalUsarRuna.tier}</span></p>
            {modalUsarRuna.efeito && <p style={{ fontSize: '0.9rem' }}>{modalUsarRuna.efeito}</p>}
            <p style={{ fontSize: '0.85rem', color: 'var(--parchment-dark)' }}>
              Custo: {CUSTO_RUNA[modalUsarRuna.tier] ?? 0} de arcana. Arcana atual: {npc.arcana_atual ?? 0}.
            </p>
            {(parseFloat(npc.arcana_atual) ?? 0) < (CUSTO_RUNA[modalUsarRuna.tier] ?? 0) && (
              <p className="error-msg">Arcana insuficiente para usar a runa</p>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="primary" onClick={confirmarUsarRuna} disabled={(parseFloat(npc.arcana_atual) ?? 0) < (CUSTO_RUNA[modalUsarRuna.tier] ?? 0)}>
                Confirmar uso
              </button>
              <button type="button" onClick={() => { setModalUsarRuna(null); setError(null); }}>Cancelar</button>
            </div>
          </>
        )}
      </Modal>

      <Modal open={modalEquiparArmamento} onClose={() => setModalEquiparArmamento(false)} title="Equipar armamento">
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {eqArmLoading && <p>Carregando…</p>}
          {!eqArmLoading && (
            <>
              {(armas.length < 2 || escudos.length < 1 || armaduras.length < 1) && (
              <div className="form-row">
                <label>Tipo</label>
                <select value={eqArmTipo} onChange={(e) => { setEqArmTipo(e.target.value); setEqArmItemId(''); setEqArmSubtipo(e.target.value === 'arma' ? 'melee' : (escudos.length < 1 ? 'Escudo' : 'Armadura')); }}>
                  {armas.length < 2 && <option value="arma">Arma</option>}
                  {(escudos.length < 1 || armaduras.length < 1) && <option value="armadura">Armadura / Escudo</option>}
                </select>
              </div>
              )}
              {eqArmTipo === 'arma' && armas.length < 2 && (
                <>
                  <div className="form-row">
                    <label>Subtipo da arma</label>
                    <select value={eqArmSubtipo} onChange={(e) => { setEqArmSubtipo(e.target.value); setEqArmItemId(''); }}>
                      <option value="melee">melee</option>
                      <option value="ranged">ranged</option>
                      <option value="arcane">arcane</option>
                    </select>
                  </div>
                  <div className="form-row">
                    <label>Arma</label>
                    <select value={eqArmItemId} onChange={(e) => setEqArmItemId(e.target.value)}>
                      <option value="">Selecione</option>
                      {itensEquipFiltrados.map((i) => (
                        <option key={i._id} value={i._id}>{i.nome} ({i.tipo})</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              {eqArmTipo === 'armadura' && (escudos.length < 1 || armaduras.length < 1) && (
                <>
                  <div className="form-row">
                    <label>Subtipo</label>
                    <select value={eqArmSubtipo} onChange={(e) => { setEqArmSubtipo(e.target.value); setEqArmItemId(''); }}>
                      {escudos.length < 1 && <option value="Escudo">Escudo</option>}
                      {armaduras.length < 1 && <option value="Armadura">Armadura</option>}
                    </select>
                  </div>
                  <div className="form-row">
                    <label>Item</label>
                    <select value={eqArmItemId} onChange={(e) => setEqArmItemId(e.target.value)}>
                      <option value="">Selecione</option>
                      {itensEquipFiltrados.map((i) => (
                        <option key={i._id} value={i._id}>{i.nome} ({i.tipo})</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <div className="form-row">
                <label>Tipo de material</label>
                <select value={eqArmTipoMaterial} onChange={(e) => { setEqArmTipoMaterial(e.target.value); setEqArmMaterialId(''); setEqArmSelectedMaterial(null); }}>
                  <option value="">Selecione</option>
                  <option value="animal">Animal</option>
                  <option value="vegetal">Vegetal</option>
                  <option value="demoníaco">Demoníaco</option>
                  <option value="mineral">Mineral</option>
                </select>
              </div>
              {eqArmTipoMaterial && (
                <div className="form-row">
                  <label>Material</label>
                  <select
                    value={eqArmMaterialId}
                    onChange={(e) => {
                      const id = e.target.value
                      setEqArmMaterialId(id)
                      setEqArmSelectedMaterial(eqArmListMateriais.find((m) => m._id === id) || null)
                    }}
                  >
                    <option value="">Selecione</option>
                    {eqArmListMateriais.map((m) => (
                      <option key={m._id} value={m._id}>{m.material} ({m.raridade})</option>
                    ))}
                  </select>
                </div>
              )}
              <div style={{ marginTop: '0.75rem', marginBottom: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={eqArmTemRuna} onChange={(e) => { setEqArmTemRuna(e.target.checked); if (!e.target.checked) { setEqArmRunaIds([]); setEqArmTierRuna(''); setEqArmElementos([]); } }} />
                  Equipamento tem runa(s)
                </label>
              </div>
              {eqArmTemRuna && (
                <>
                  <div className="form-row">
                    <label>Tier da runa</label>
                    <select value={eqArmTierRuna} onChange={(e) => { setEqArmTierRuna(e.target.value); setEqArmElementos([]); setEqArmRunaIds([]); }}>
                      <option value="">Selecione</option>
                      {TIER_RUNA_OPCOES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  {eqArmTierRuna && numElementosRuna > 0 && (
                    <div className="form-row">
                      <label>Elementos ({numElementosRuna})</label>
                      {Array.from({ length: numElementosRuna }, (_, i) => (
                        <select
                          key={i}
                          value={eqArmElementos[i] || ''}
                          onChange={(e) => {
                            const v = e.target.value
                            setEqArmElementos((prev) => {
                              const next = [...prev]
                              next[i] = v
                              return next.slice(0, numElementosRuna)
                            })
                          }}
                          style={{ minWidth: '120px', marginTop: '0.25rem' }}
                        >
                          <option value="">Slot {i + 1}</option>
                          {ELEMENTOS_RUNA.filter((el) => !eqArmElementos.includes(el) || eqArmElementos[i] === el).map((el) => (
                            <option key={el} value={el}>{el}</option>
                          ))}
                        </select>
                      ))}
                    </div>
                  )}
                  {eqArmRunasFiltradas.length > 0 && (
                    <div className="form-row">
                      <label>Runas (marque as desejadas)</label>
                      <div style={{ maxHeight: '160px', overflowY: 'auto', border: '1px solid var(--border-frame)', borderRadius: 6, padding: '0.5rem' }}>
                        {eqArmRunasFiltradas.map((r) => (
                          <label key={r._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.25rem' }}>
                            <input type="checkbox" checked={(eqArmRunaIds || []).includes(r._id)} onChange={() => toggleEqArmRuna(r._id)} />
                            <span>{r.nome} <span className="badge">{r.tier}</span></span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
              {eqArmError && <p className="error-msg">{eqArmError}</p>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="primary" onClick={calcularPreviaEquip} disabled={eqArmPreviaLoading || !eqArmItemId || !eqArmMaterialId}>
                  {eqArmPreviaLoading ? 'Calculando…' : 'Ver previsão'}
                </button>
                {eqArmPrevia && (
                  <button type="button" className="primary" onClick={salvarEquipamentoNPC} disabled={eqArmSaving}>
                    {eqArmSaving ? 'Salvando…' : 'Salvar equipamento'}
                  </button>
                )}
                <button type="button" onClick={() => setModalEquiparArmamento(false)}>Cancelar</button>
              </div>
              {eqArmPrevia && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--bg-card-hover)', borderRadius: 6, fontSize: '0.9rem' }}>
                  <p><strong>{eqArmPrevia.nome}</strong> — {eqArmPrevia.tipo}</p>
                  <p>Material: {eqArmPrevia.material} ({eqArmPrevia.raridade})</p>
                  {eqArmPrevia.dano != null && <p>Dano: {eqArmPrevia.dano}</p>}
                  {eqArmPrevia.defesa != null && <p>Defesa: {eqArmPrevia.defesa}</p>}
                  <p>Durabilidade: {eqArmPrevia.durabilidade} — Peso: {eqArmPrevia.peso}</p>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>

      <Modal open={modalEquiparElixir} onClose={() => setModalEquiparElixir(false)} title="Equipar elixir">
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {elixirLoading && <p>Carregando…</p>}
          {!elixirLoading && (
            <>
              <div className="form-row">
                <label>Elixir</label>
                <select value={elixirSelecionado?._id || ''} onChange={(e) => { const id = e.target.value; setElixirSelecionado(elixirLista.find((x) => x._id === id) || null); setElixirMaterialEscolhido(''); }}>
                  <option value="">Selecione um elixir</option>
                  {elixirLista.map((el) => (
                    <option key={el._id} value={el._id}>{el.nome}</option>
                  ))}
                </select>
              </div>
              {elixirSelecionado && (
                <>
                  {elixirSelecionado.efeito && <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}><strong>Efeito:</strong> {elixirSelecionado.efeito}</p>}
                  <p style={{ marginTop: '0.75rem', fontWeight: 600 }}>Raridade e potência por material</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {MATERIAIS_ELIXIR.map((tipo) => {
                      const rar = elixirSelecionado[`${tipo}_rar`] ?? '—'
                      const pot = elixirSelecionado[`${tipo}_pot`] ?? '—'
                      const label = tipo.charAt(0).toUpperCase() + tipo.slice(1)
                      return (
                        <div key={tipo} style={{ padding: '0.5rem', background: 'var(--bg-card-hover)', borderRadius: 6, border: elixirMaterialEscolhido === tipo ? '2px solid var(--accent)' : '1px solid var(--border-frame)' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input type="radio" name="material_elixir" checked={elixirMaterialEscolhido === tipo} onChange={() => setElixirMaterialEscolhido(tipo)} />
                            <strong>{label}</strong> — Raridade: {rar}, Potência: {pot}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                  {elixirError && <p className="error-msg">{elixirError}</p>}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button type="button" className="primary" onClick={salvarElixirNPC} disabled={elixirSaving || !elixirMaterialEscolhido}>
                      {elixirSaving ? 'Salvando…' : 'Salvar elixir'}
                    </button>
                    <button type="button" onClick={() => setModalEquiparElixir(false)}>Cancelar</button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
