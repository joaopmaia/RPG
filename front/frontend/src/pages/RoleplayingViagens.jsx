import { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getViagensCategorias, getViagensCoordenadas, list } from '../api'

const CATEGORIA_ID_TO_LABEL = { drovenar: 'Drovenar', vaelthor: 'Vaelthor', sylmari: 'Sylmari', points: 'Pontos de Interesse' }

function distanciaKm(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) * 50
}

function diasTerra(km) { return km / 20 }
function diasAgua(km) { return km / 40 }
function diasAr(km) { return km / 100 }

const CUSTO_MIN_MAX = {
  terrestre: [5, 20],
  maritima: [40, 60],
  fluvial: [30, 50],
  aerea: [90, 150],
}

function randomEntre(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1))
}

/** Converte valor total (em bronze) para "X moedas de bronze, Y moedas de prata e Z moedas de ouro"; omite valores zero. */
function formatarMoedas(total) {
  const n = Math.max(0, Math.round(total))
  const ouro = Math.floor(n / 100)
  const prata = Math.floor((n % 100) / 10)
  const bronze = n % 10
  const partes = []
  if (ouro > 0) partes.push(`${ouro} moeda${ouro !== 1 ? 's' : ''} de ouro`)
  if (prata > 0) partes.push(`${prata} moeda${prata !== 1 ? 's' : ''} de prata`)
  if (bronze > 0) partes.push(`${bronze} moeda${bronze !== 1 ? 's' : ''} de bronze`)
  if (partes.length === 0) return '0 moedas de bronze'
  return partes.join(', ').replace(/, ([^,]+)$/, ' e $1')
}

const VEICULOS = {
  terrestre: [
    { id: 'cavalos', label: 'Cavalos', divisor: 2 },
    { id: 'lagartos', label: 'Lagartos Gigantes', divisor: 3 },
    { id: 'alce', label: 'Alce', divisor: 2 },
    { id: 'urso', label: 'Urso', divisor: 2 },
    { id: 'avestruz', label: 'Avestruz', divisor: 4 },
    { id: 'carruagem', label: 'Carruagens (puxadas por animais)', divisor: 2 },
    { id: 'carruagem_runica', label: 'Carruagens rúnicas (energia arcana)', divisor: 4 },
  ],
  fluvial: [
    { id: 'barcos', label: 'Barcos (rios)', divisor: 3 },
  ],
  maritima: [
    { id: 'navios', label: 'Navios (mares)', divisor: 3 },
  ],
  aerea: [
    { id: 'aguia', label: 'Águia Gigante', divisor: 3 },
    { id: 'wyvern', label: 'Wyvern', divisor: 3 },
    { id: 'grifo', label: 'Grifo', divisor: 4 },
    { id: 'planadores', label: 'Planadores (artefatos voadores)', divisor: 3 },
  ],
}

const TIPOS_VIAGEM = [
  { id: 'terrestre', label: 'Terrestre' },
  { id: 'fluvial', label: 'Fluvial' },
  { id: 'maritima', label: 'Marítima' },
  { id: 'aerea', label: 'Aérea' },
]

export default function RoleplayingViagens() {
  const navigate = useNavigate()
  const [categorias, setCategorias] = useState([])
  const [categoriaOrigem, setCategoriaOrigem] = useState('')
  const [categoriaDestino, setCategoriaDestino] = useState('')
  const [lugaresOrigem, setLugaresOrigem] = useState([])
  const [lugaresDestino, setLugaresDestino] = useState([])
  const [loadingOrigem, setLoadingOrigem] = useState(false)
  const [loadingDestino, setLoadingDestino] = useState(false)
  const [reinos, setReinos] = useState([])
  const [lugarOrigem, setLugarOrigem] = useState('')
  const [lugarDestino, setLugarDestino] = useState('')
  const [resultado, setResultado] = useState(null)
  const [tipoViagem, setTipoViagem] = useState('')
  const [veiculo, setVeiculo] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    getViagensCategorias()
      .then(setCategorias)
      .catch(() => setCategorias([]))
    list('reinos').then(setReinos).catch(() => setReinos([]))
  }, [])

  useEffect(() => {
    if (!categoriaOrigem) {
      setLugaresOrigem([])
      setLugarOrigem('')
      return
    }
    setLugarOrigem('')
    setLoadingOrigem(true)
    getViagensCoordenadas(categoriaOrigem)
      .then((lista) => setLugaresOrigem(Array.isArray(lista) ? lista : []))
      .catch(() => setLugaresOrigem([]))
      .finally(() => setLoadingOrigem(false))
  }, [categoriaOrigem])

  useEffect(() => {
    if (!categoriaDestino) {
      setLugaresDestino([])
      setLugarDestino('')
      return
    }
    setLugarDestino('')
    setLoadingDestino(true)
    getViagensCoordenadas(categoriaDestino)
      .then((lista) => setLugaresDestino(Array.isArray(lista) ? lista : []))
      .catch(() => setLugaresDestino([]))
      .finally(() => setLoadingDestino(false))
  }, [categoriaDestino])

  function servicosReino(categoriaId) {
    if (!categoriaId || categoriaId === 'points') return 0
    const nomeBusca = (CATEGORIA_ID_TO_LABEL[categoriaId] || categoriaId).toLowerCase()
    const reino = reinos.find((r) => (r.nome || '').toLowerCase() === nomeBusca)
    if (!reino) return 0
    const v = parseFloat(reino.servicos)
    return Number.isFinite(v) ? v : 0
  }

  function calcular() {
    setErro('')
    const orig = lugaresOrigem.find((l) => l.nome === lugarOrigem)
    const dest = lugaresDestino.find((l) => l.nome === lugarDestino)
    if (!orig || !dest) {
      setErro('Selecione origem e destino.')
      return
    }
    if (orig.nome === dest.nome) {
      setErro('Origem e destino devem ser diferentes.')
      return
    }
    setLoading(true)
    const [x1, y1] = orig.coords
    const [x2, y2] = dest.coords
    const km = distanciaKm(x1, y1, x2, y2)
    const diasT = Math.ceil(diasTerra(km))
    const diasA = Math.ceil(diasAgua(km))
    const diasArD = Math.ceil(diasAr(km))
    const mod = servicosReino(categoriaOrigem)
    setResultado({
      distanciaKm: Math.round(km * 100) / 100,
      diasTerra: diasT,
      diasAgua: diasA,
      diasAr: diasArD,
      custoPorDia: {
        terrestre: randomEntre(...CUSTO_MIN_MAX.terrestre),
        maritima: randomEntre(...CUSTO_MIN_MAX.maritima),
        fluvial: randomEntre(...CUSTO_MIN_MAX.fluvial),
        aerea: randomEntre(...CUSTO_MIN_MAX.aerea),
      },
      servicosModificador: mod,
      lugarOrigem: orig.nome,
      lugarDestino: dest.nome,
    })
    setTipoViagem('')
    setVeiculo('')
    setLoading(false)
  }

  const custoTotal = useMemo(() => {
    if (!resultado || !tipoViagem) return null
    const custoPorDia = resultado.custoPorDia[tipoViagem]
    if (custoPorDia == null) return null

    const isTerrestre = tipoViagem === 'terrestre'
    const isAPe = isTerrestre && (!veiculo || veiculo === 'ape')

    if (isAPe) {
      return { diasReal: resultado.diasTerra, custoPorDia: 0, total: 0, aPe: true }
    }

    if (!isTerrestre && !veiculo) return null

    let dias
    if (tipoViagem === 'terrestre') dias = resultado.diasTerra
    else if (tipoViagem === 'fluvial' || tipoViagem === 'maritima') dias = resultado.diasAgua
    else dias = resultado.diasAr
    const lista = tipoViagem === 'terrestre' ? VEICULOS.terrestre : tipoViagem === 'fluvial' ? VEICULOS.fluvial : tipoViagem === 'maritima' ? VEICULOS.maritima : VEICULOS.aerea
    const v = lista.find((x) => x.id === veiculo)
    if (!v) return null
    const diasReal = Math.ceil(dias / v.divisor)
    const multiplicadorVeiculo = v.divisor === 3 ? 5 : v.divisor === 4 ? 8 : v.divisor
    let total = diasReal * custoPorDia * multiplicadorVeiculo
    const mod = resultado.servicosModificador || 0
    if (mod > 0) total *= 1 + mod
    else if (mod < 0) total *= 1 + mod
    return { diasReal, custoPorDia, total: Math.round(total), multiplicadorVeiculo }
  }, [resultado, tipoViagem, veiculo])

  const veiculosDisponiveis = tipoViagem ? (VEICULOS[tipoViagem] || []) : []
  const exigeVeiculo = tipoViagem && tipoViagem !== 'terrestre'
  const podeIniciar = tipoViagem && (tipoViagem === 'terrestre' || !!veiculo)

  return (
    <div className="regras-doc">
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/">← Início</Link>
      </nav>
      <h1>Viagens</h1>
      <p style={{ color: 'var(--parchment-dark)', marginBottom: '1.5rem' }}>
        Escolha a raça ou Pontos de Interesse para origem e para destino; em seguida selecione o lugar de origem e de destino para calcular a viagem.
      </p>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Onde você está e para onde vai</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div>
            <label htmlFor="filtro-origem" className="block" style={{ marginBottom: '0.35rem', fontWeight: 600 }}>
              Raça / Pontos de Interesse (origem)
            </label>
            <select
              id="filtro-origem"
              value={categoriaOrigem}
              onChange={(e) => setCategoriaOrigem(e.target.value)}
              className="input"
              style={{ width: '100%' }}
            >
              <option value="">— Selecione —</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            {loadingOrigem && <span style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}> Carregando…</span>}
            <label htmlFor="origem" className="block" style={{ marginBottom: '0.35rem', fontWeight: 600, marginTop: '0.75rem' }}>
              Origem
            </label>
            <select
              id="origem"
              value={lugarOrigem}
              onChange={(e) => setLugarOrigem(e.target.value)}
              className="input"
              style={{ width: '100%' }}
              disabled={!categoriaOrigem || loadingOrigem}
            >
              <option value="">— Selecione a origem —</option>
              {lugaresOrigem.map((l) => (
                <option key={l.nome} value={l.nome}>{l.nome}</option>
              ))}
            </select>
            {categoriaOrigem && !loadingOrigem && lugaresOrigem.length === 0 && (
              <p style={{ fontSize: '0.85rem', color: 'var(--parchment-dark)', marginTop: '0.25rem', marginBottom: 0 }}>Nenhuma localização nesta categoria.</p>
            )}
          </div>
          <div>
            <label htmlFor="filtro-destino" className="block" style={{ marginBottom: '0.35rem', fontWeight: 600 }}>
              Raça / Pontos de Interesse (destino)
            </label>
            <select
              id="filtro-destino"
              value={categoriaDestino}
              onChange={(e) => setCategoriaDestino(e.target.value)}
              className="input"
              style={{ width: '100%' }}
            >
              <option value="">— Selecione —</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            {loadingDestino && <span style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}> Carregando…</span>}
            <label htmlFor="destino" className="block" style={{ marginBottom: '0.35rem', fontWeight: 600, marginTop: '0.75rem' }}>
              Destino
            </label>
            <select
              id="destino"
              value={lugarDestino}
              onChange={(e) => setLugarDestino(e.target.value)}
              className="input"
              style={{ width: '100%' }}
              disabled={!categoriaDestino || loadingDestino}
            >
              <option value="">— Selecione o destino —</option>
              {lugaresDestino.map((l) => (
                <option key={l.nome} value={l.nome}>{l.nome}</option>
              ))}
            </select>
            {categoriaDestino && !loadingDestino && lugaresDestino.length === 0 && (
              <p style={{ fontSize: '0.85rem', color: 'var(--parchment-dark)', marginTop: '0.25rem', marginBottom: 0 }}>Nenhuma localização nesta categoria.</p>
            )}
          </div>
        </div>

        {erro && <p style={{ color: 'var(--danger)', marginTop: '0.75rem', marginBottom: 0 }}>{erro}</p>}
        <button
          type="button"
          className="btn btn-primary"
          onClick={calcular}
          disabled={loading || !lugarOrigem || !lugarDestino}
          style={{ marginTop: '1.25rem' }}
        >
          {loading ? 'Calculando…' : 'Calcular distância'}
        </button>
      </div>

      {resultado && (
        <>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginTop: 0 }}>Resultado do cálculo</h3>
            <p><strong>Distância:</strong> {resultado.distanciaKm} km</p>
            <p><strong>Tempo base (dias, arredondado para cima):</strong></p>
            <ul>
              <li>Por terra: {resultado.diasTerra} dias (tempo calculado com base em 20 km/dia)</li>
              <li>Selecione um veículo abaixo para ver tempo e custo com veículo.</li>
            </ul>
            <p><strong>Custo por dia (desta viagem):</strong> Terrestre {formatarMoedas(resultado.custoPorDia.terrestre)} · Marítima {formatarMoedas(resultado.custoPorDia.maritima)} · Fluvial {formatarMoedas(resultado.custoPorDia.fluvial)} · Aérea {formatarMoedas(resultado.custoPorDia.aerea)}</p>
            {resultado.servicosModificador !== 0 && (
              <p><strong>Modificador do reino de origem (serviços):</strong> {resultado.servicosModificador > 0 ? '+' : ''}{(resultado.servicosModificador * 100).toFixed(0)}% no custo total</p>
            )}
          </div>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginTop: 0 }}>Tipo de viagem e veículo</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
              <div>
                <label className="block" style={{ marginBottom: '0.35rem', fontWeight: 600 }}>Tipo</label>
                <select
                  value={tipoViagem}
                  onChange={(e) => { setTipoViagem(e.target.value); setVeiculo('') }}
                  className="input"
                >
                  <option value="">— Selecione —</option>
                  {TIPOS_VIAGEM.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>
              {tipoViagem && (
                <div>
                  <label className="block" style={{ marginBottom: '0.35rem', fontWeight: 600 }}>Veículo</label>
                  <select
                    value={veiculo}
                    onChange={(e) => setVeiculo(e.target.value)}
                    className="input"
                  >
                    <option value="">— Selecione —</option>
                    {tipoViagem === 'terrestre' && <option value="ape">A pé (sem veículo)</option>}
                    {veiculosDisponiveis.map((v) => (
                      <option key={v.id} value={v.id}>{v.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            {exigeVeiculo && !veiculo && (
              <p style={{ marginTop: '1rem', marginBottom: 0, color: 'var(--parchment-dark)' }}>
                Viagem aquática ou aérea exige veículo. Selecione um para ver o tempo e o custo.
              </p>
            )}
            {custoTotal && (
              <p style={{ marginTop: '1rem', marginBottom: 0 }}>
                <strong>Dias de viagem:</strong> {custoTotal.diasReal}
                {!custoTotal.aPe && (
                  <> · <strong>Custo por dia:</strong> {formatarMoedas(custoTotal.custoPorDia)} · <strong>Total:</strong> {custoTotal.total === 0 ? 'Grátis' : formatarMoedas(custoTotal.total)}</>
                )}
                {custoTotal.aPe && <> · <strong>Total:</strong> Grátis (a pé)</>}
              </p>
            )}
          </div>

          <div className="card">
            <button
              type="button"
              className="btn btn-primary"
              disabled={!podeIniciar}
              onClick={() => navigate('/roleplaying/viagens/iniciar', { state: { resultado, tipoViagem, veiculo: tipoViagem === 'terrestre' && !veiculo ? 'ape' : veiculo, custoTotal, lugarOrigem: resultado.lugarOrigem, lugarDestino: resultado.lugarDestino } })}
            >
              Começar viagem
            </button>
          </div>
        </>
      )}
    </div>
  )
}
