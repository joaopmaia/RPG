import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import {
  getAuthMe,
  listCampanhas,
  listCampanhasCatalogo,
  criarCampanhaUsuario,
  ingressarCampanha,
  sairCampanhaPerfil,
  deletarCampanha,
  changePassword,
  getCampanhaId,
} from '../api'
import './PerfilUsuario.css'

function labelFunc(f) {
  const x = (f || '').toLowerCase()
  if (x === 'mestre') return 'Mestre'
  if (x === 'jogador') return 'Jogador'
  if (x === 'admin') return 'Administrador (campanha)'
  return f || '—'
}

export default function PerfilUsuario() {
  const { refreshMe, setCampanhaId } = useAuth()
  const [me, setMe] = useState(null)
  const [campanhaDocs, setCampanhaDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [msg, setMsg] = useState(null)

  const [senhaAtual, setSenhaAtual] = useState('')
  const [senhaNova, setSenhaNova] = useState('')
  const [senhaNova2, setSenhaNova2] = useState('')

  const [addOpen, setAddOpen] = useState(false)
  const [addTab, setAddTab] = useState('criar')
  const [novoNome, setNovoNome] = useState('')
  const [catalogo, setCatalogo] = useState([])
  const [selIngresso, setSelIngresso] = useState('')

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [m, docs] = await Promise.all([getAuthMe(), listCampanhas()])
      setMe(m)
      setCampanhaDocs(Array.isArray(docs) ? docs : [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const linhasCampanha = useMemo(() => {
    const byId = {}
    for (const d of campanhaDocs) {
      if (d.id) byId[d.id] = d
    }
    const rows = []
    for (const c of me?.campanhas || []) {
      const id = c.campanha_id
      const doc = id ? byId[id] : null
      rows.push({
        campanha_id: id,
        function: c.function,
        nome: doc?.nome || '(campanha)',
        mestre: doc?.mestre || '—',
      })
    }
    return rows
  }, [me, campanhaDocs])

  const ajustarCampanhaAtiva = async () => {
    const data = await getAuthMe()
    const ids = (data?.campanhas || []).map((c) => c.campanha_id).filter(Boolean)
    const cur = getCampanhaId()
    if (cur && !ids.includes(cur)) {
      setCampanhaId(ids[0] || null)
    }
    await refreshMe()
  }

  const salvarSenha = async (e) => {
    e.preventDefault()
    setMsg(null)
    setError(null)
    if (senhaNova !== senhaNova2) {
      setError('As novas senhas não coincidem.')
      return
    }
    try {
      await changePassword(senhaAtual, senhaNova)
      setMsg('Senha alterada com sucesso.')
      setSenhaAtual('')
      setSenhaNova('')
      setSenhaNova2('')
    } catch (err) {
      setError(err.message)
    }
  }

  const abrirAdd = async () => {
    setAddOpen(true)
    setAddTab('criar')
    setNovoNome('')
    setSelIngresso('')
    setError(null)
    setMsg(null)
    try {
      const cat = await listCampanhasCatalogo(true)
      const arr = Array.isArray(cat) ? cat : []
      setCatalogo(arr)
      if (arr.length) setSelIngresso(arr[0].id)
    } catch {
      setCatalogo([])
    }
  }

  const submitCriar = async () => {
    const nome = novoNome.trim()
    if (!nome) {
      setError('Informe o nome da campanha.')
      return
    }
    setError(null)
    try {
      await criarCampanhaUsuario(nome)
      setAddOpen(false)
      await load()
      await ajustarCampanhaAtiva()
      setMsg('Campanha criada; você é o mestre.')
    } catch (e) {
      setError(e.message)
    }
  }

  const submitIngressar = async () => {
    if (!selIngresso) {
      setError('Selecione uma campanha.')
      return
    }
    setError(null)
    try {
      await ingressarCampanha(selIngresso)
      setAddOpen(false)
      await load()
      await ajustarCampanhaAtiva()
      setMsg('Campanha adicionada ao perfil como jogador.')
    } catch (e) {
      setError(e.message)
    }
  }

  const sair = async (campanhaId) => {
    if (!confirm('Remover esta campanha do seu perfil?')) return
    setError(null)
    try {
      await sairCampanhaPerfil(campanhaId)
      await load()
      await ajustarCampanhaAtiva()
      setMsg('Campanha removida do seu perfil.')
    } catch (e) {
      setError(e.message)
    }
  }

  const excluirCampanha = async (campanhaId) => {
    if (
      !confirm(
        'Excluir esta campanha para todos os jogadores? Os dados de NPCs e estabelecimentos dessa campanha serão apagados. Esta ação não pode ser desfeita.',
      )
    ) {
      return
    }
    setError(null)
    try {
      await deletarCampanha(campanhaId)
      await load()
      await ajustarCampanhaAtiva()
      setMsg('Campanha excluída.')
    } catch (e) {
      setError(e.message)
    }
  }

  if (loading) {
    return (
      <div className="perfil-usuario">
        <p>Carregando…</p>
      </div>
    )
  }

  if (!me) {
    return (
      <div className="perfil-usuario">
        <p className="error-msg">Não foi possível carregar o perfil. <Link to="/">Voltar ao início</Link></p>
      </div>
    )
  }

  return (
    <div className="perfil-usuario">
      <h1>Minha conta</h1>

      {msg && <p className="perfil-msg ok">{msg}</p>}
      {error && <p className="perfil-msg error">{error}</p>}

      <section className="perfil-card card">
        <h2>Dados da conta</h2>
        <dl className="perfil-dl">
          <dt>Usuário</dt>
          <dd>{me?.usuario}</dd>
          <dt>Perfil global</dt>
          <dd>{me?.perfil === 'admin' ? 'Administrador' : 'Usuário'}</dd>
        </dl>
      </section>

      <section className="perfil-card card">
        <h2>Alterar senha</h2>
        <form onSubmit={salvarSenha} className="perfil-form">
          <div className="form-row">
            <label htmlFor="pu-senha-atual">Senha atual</label>
            <input
              id="pu-senha-atual"
              type="password"
              autoComplete="current-password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
            />
          </div>
          <div className="form-row">
            <label htmlFor="pu-senha-nova">Nova senha</label>
            <input
              id="pu-senha-nova"
              type="password"
              autoComplete="new-password"
              value={senhaNova}
              onChange={(e) => setSenhaNova(e.target.value)}
              minLength={6}
            />
          </div>
          <div className="form-row">
            <label htmlFor="pu-senha-nova2">Confirmar nova senha</label>
            <input
              id="pu-senha-nova2"
              type="password"
              autoComplete="new-password"
              value={senhaNova2}
              onChange={(e) => setSenhaNova2(e.target.value)}
            />
          </div>
          <button type="submit" className="primary" disabled={!senhaAtual || !senhaNova}>
            Salvar nova senha
          </button>
        </form>
      </section>

      <section className="perfil-card card">
        <div className="perfil-campanhas-head">
          <h2>Campanhas</h2>
          <button type="button" className="primary" onClick={abrirAdd}>
            Adicionar campanha
          </button>
        </div>
        {linhasCampanha.length === 0 ? (
          <p className="perfil-empty">Nenhuma campanha no perfil. Use &quot;Adicionar campanha&quot; para criar ou entrar em uma.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Campanha</th>
                  <th>Mestre</th>
                  <th>Sua função</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {linhasCampanha.map((row) => {
                  const fn = (row.function || '').toLowerCase()
                  const podeSair = fn === 'jogador'
                  const podeExcluir = fn === 'mestre'
                  return (
                    <tr key={row.campanha_id}>
                      <td>{row.nome}</td>
                      <td>{row.mestre}</td>
                      <td>{labelFunc(row.function)}</td>
                      <td className="perfil-acoes">
                        {podeSair && (
                          <button type="button" className="link-like" onClick={() => sair(row.campanha_id)}>
                            Sair da campanha
                          </button>
                        )}
                        {podeExcluir && (
                          <button type="button" className="link-like danger" onClick={() => excluirCampanha(row.campanha_id)}>
                            Excluir campanha
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {addOpen && (
        <div className="perfil-modal-overlay" onClick={() => setAddOpen(false)} role="presentation">
          <div className="perfil-modal card" onClick={(e) => e.stopPropagation()}>
            <h3>Adicionar campanha</h3>
            <div className="perfil-tabs">
              <button type="button" className={addTab === 'criar' ? 'active' : ''} onClick={() => { setAddTab('criar'); setError(null) }}>
                Criar nova
              </button>
              <button
                type="button"
                className={addTab === 'ingressar' ? 'active' : ''}
                onClick={() => { setAddTab('ingressar'); setError(null) }}
              >
                Entrar em existente
              </button>
            </div>
            {addTab === 'criar' && (
              <div className="perfil-modal-body">
                <p className="perfil-hint">Você será o mestre da campanha. O nome deve ser único.</p>
                <div className="form-row">
                  <label htmlFor="pu-novo-nome">Nome da campanha</label>
                  <input id="pu-novo-nome" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Ex.: A sombra de Valdris" />
                </div>
                <div className="perfil-modal-actions">
                  <button type="button" className="primary" onClick={submitCriar}>
                    Criar
                  </button>
                  <button type="button" onClick={() => setAddOpen(false)}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}
            {addTab === 'ingressar' && (
              <div className="perfil-modal-body">
                <p className="perfil-hint">Escolha uma campanha para entrar como jogador.</p>
                {catalogo.length === 0 ? (
                  <p>Não há campanhas disponíveis (ou você já está em todas).</p>
                ) : (
                  <div className="form-row">
                    <label htmlFor="pu-ingresso">Campanha</label>
                    <select id="pu-ingresso" value={selIngresso} onChange={(e) => setSelIngresso(e.target.value)}>
                      {catalogo.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nome} — mestre: {c.mestre}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="perfil-modal-actions">
                  <button type="button" className="primary" onClick={submitIngressar} disabled={!catalogo.length}>
                    Adicionar ao perfil
                  </button>
                  <button type="button" onClick={() => setAddOpen(false)}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}
            {error && <p className="error-msg" style={{ marginTop: '0.75rem' }}>{error}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
