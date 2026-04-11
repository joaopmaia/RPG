/**
 * Cliente HTTP centralizado. Base URL: import.meta.env.VITE_API_URL
 * Em dev, sem VITE_API_URL, usa URLs relativas /api (proxy do Vite → backend).
 */
const _envUrl = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL
const API_ORIGIN = _envUrl ? String(_envUrl).replace(/\/$/, '') : ''
const API_BASE = API_ORIGIN ? `${API_ORIGIN}/api` : '/api'
export { API_ORIGIN }

export const ACCESS_TOKEN_KEY = 'khonum_access_token'

const CAMPANHA_STORAGE_KEY = 'khonum_campanha_id'

export function getCampanhaId() {
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem(CAMPANHA_STORAGE_KEY) || null
}

export function setCampanhaId(id) {
  if (typeof localStorage === 'undefined') return
  if (id == null || id === '') localStorage.removeItem(CAMPANHA_STORAGE_KEY)
  else localStorage.setItem(CAMPANHA_STORAGE_KEY, String(id))
}

export function getAccessToken() {
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem(ACCESS_TOKEN_KEY) || null
}

export function setAccessToken(token) {
  if (typeof localStorage === 'undefined') return
  if (token == null || token === '') localStorage.removeItem(ACCESS_TOKEN_KEY)
  else localStorage.setItem(ACCESS_TOKEN_KEY, String(token))
}

function campanhaHeaders() {
  const id = getCampanhaId()
  return id ? { 'X-Campanha-Id': id } : {}
}

function authBearer() {
  const t = getAccessToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

function defaultHeaders(extra = {}) {
  return {
    ...authBearer(),
    ...campanhaHeaders(),
    ...extra,
  }
}

function jsonHeaders(extra = {}) {
  return { 'Content-Type': 'application/json', ...defaultHeaders(extra) }
}

const DEFAULT_OPTS = {}

export function getReinoMapaUrl(id) {
  return `${API_ORIGIN}/api/reinos/${id}/mapa`
}

export function getMapaAssetUrl(filename) {
  return `${API_ORIGIN}/api/mapas/${encodeURIComponent(filename)}`
}

function buildQuery(params) {
  const sp = new URLSearchParams()
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v == null || v === '') return
    if (Array.isArray(v)) {
      v.forEach((val) => sp.append(k, val))
    } else {
      sp.set(k, v)
    }
  })
  const qs = sp.toString()
  return qs ? `?${qs}` : ''
}

async function parseErrorResponse(res) {
  const text = await res.text()
  try {
    const j = JSON.parse(text)
    if (j.success === false && j.error) {
      if (typeof j.error === 'object' && j.error.message) return j.error.message
      if (typeof j.error === 'string') return j.error
    }
    if (typeof j.error === 'string') return j.error
    if (j.error && typeof j.error === 'object' && j.error.message) return j.error.message
    return j.message || text || res.statusText
  } catch {
    return text || res.statusText
  }
}

async function apiFetch(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData
  const hasJsonBody =
    options.body != null && !isFormData && method !== 'GET' && method !== 'HEAD'
  const opts = {
    ...DEFAULT_OPTS,
    ...options,
    headers: {
      ...defaultHeaders(options.headers || {}),
      ...(hasJsonBody ? { 'Content-Type': 'application/json' } : {}),
    },
  }
  try {
    const res = await fetch(url, opts)
    if (!res.ok) {
      const msg = await parseErrorResponse(res)
      throw new Error(msg)
    }
    return res.status === 204 ? null : res.json()
  } catch (e) {
    if (e.name === 'TypeError' && (e.message === 'Failed to fetch' || e.message.includes('fetch'))) {
      throw new Error(
        'Não foi possível conectar à API. Verifique VITE_API_URL, o proxy de desenvolvimento e se o backend está rodando.',
      )
    }
    throw e
  }
}

export async function list(collection, params) {
  return apiFetch(`${API_BASE}/${collection}${buildQuery(params)}`)
}

export async function get(collection, id) {
  return apiFetch(`${API_BASE}/${collection}/${id}`)
}

export async function getEstabelecimentoNoite(id) {
  return apiFetch(`${API_BASE}/estabelecimentos/${id}/noite`)
}

export async function create(collection, data) {
  return apiFetch(`${API_BASE}/${collection}`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function update(collection, id, data) {
  return apiFetch(`${API_BASE}/${collection}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function gerarDemonio(data) {
  return apiFetch(`${API_BASE}/demonios/gerar`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function gerarAnimal(data) {
  return apiFetch(`${API_BASE}/animais/gerar`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function remove(collection, id) {
  const res = await fetch(`${API_BASE}/${collection}/${id}`, {
    method: 'DELETE',
    headers: defaultHeaders(),
  }).catch((e) => {
    if (e.name === 'TypeError' && (e.message === 'Failed to fetch' || e.message.includes('fetch'))) {
      throw new Error('Não foi possível conectar à API.')
    }
    throw e
  })
  if (!res.ok && res.status !== 204) throw new Error(await parseErrorResponse(res))
}

export async function getNpcCompleto(id) {
  return apiFetch(`${API_BASE}/npcs/${id}/completo`)
}

export async function getReinoHistoria(id) {
  return apiFetch(`${API_BASE}/reinos/${id}/historia`)
}

export async function buscarImagem(tabela, identificador) {
  const q = `?tabela=${encodeURIComponent(tabela)}&identificador=${encodeURIComponent(identificador)}`
  const res = await fetch(`${API_BASE}/imagens/buscar${q}`, { headers: defaultHeaders({ 'Content-Type': undefined }) })
  if (!res.ok) return null
  const data = await res.json()
  return data || null
}

export function urlImagem(doc) {
  if (!doc?.url) return null
  return doc.url.startsWith('/') ? `${API_ORIGIN}${doc.url}` : doc.url
}

export async function uploadImagem(tabela, identificador, file) {
  const form = new FormData()
  form.append('tabela', tabela)
  form.append('identificador', identificador)
  form.append('file', file)
  const headers = { ...authBearer(), ...campanhaHeaders() }
  const res = await fetch(`${API_BASE}/imagens/upload`, {
    method: 'POST',
    body: form,
    headers,
  })
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || (await res.text()))
  return res.json()
}

export async function getReinosInfo() {
  return apiFetch(`${API_BASE}/reinos-info`)
}

export async function listCampanhas() {
  return apiFetch(`${API_BASE}/campanhas`)
}

export async function listCampanhasCatalogo(excluirMinhas = true) {
  const q = excluirMinhas ? '?excluir_minhas=1' : ''
  return apiFetch(`${API_BASE}/campanhas/catalogo${q}`)
}

export async function criarCampanhaUsuario(nome) {
  return apiFetch(`${API_BASE}/campanhas/criar`, {
    method: 'POST',
    body: JSON.stringify({ nome }),
  })
}

export async function ingressarCampanha(campanhaId) {
  return apiFetch(`${API_BASE}/campanhas/ingressar`, {
    method: 'POST',
    body: JSON.stringify({ campanha_id: campanhaId }),
  })
}

export async function sairCampanhaPerfil(campanhaId) {
  const res = await fetch(`${API_BASE}/campanhas/perfil/${encodeURIComponent(campanhaId)}`, {
    method: 'DELETE',
    headers: defaultHeaders(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error?.message || data.error || res.statusText)
  return data
}

export async function deletarCampanha(campanhaId) {
  const res = await fetch(`${API_BASE}/campanhas/${encodeURIComponent(campanhaId)}`, {
    method: 'DELETE',
    headers: defaultHeaders(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error?.message || data.error || res.statusText)
  return data
}

export async function changePassword(senhaAtual, senhaNova) {
  return apiFetch(`${API_BASE}/auth/senha`, {
    method: 'PATCH',
    body: JSON.stringify({ senha_atual: senhaAtual, senha_nova: senhaNova }),
  })
}

export async function getViagensCategorias() {
  return apiFetch(`${API_BASE}/viagens/categorias`)
}

export async function getViagensCoordenadas(categoria) {
  return apiFetch(`${API_BASE}/viagens/coordenadas/${encodeURIComponent(categoria)}`)
}

export async function getWorldStory() {
  return apiFetch(`${API_BASE}/historias/world-story-for-players`)
}

function _messageFromAuthErrorBody(data) {
  if (!data || typeof data !== 'object') return null
  const e = data.error
  if (typeof e === 'string') return e
  if (e && typeof e === 'object' && e.message != null) return String(e.message)
  if (typeof data.message === 'string') return data.message
  if (typeof data.detail === 'string') return data.detail
  return null
}

/** Lê a resposta de /auth/* e lança Error com mensagem legível em qualquer falha. */
async function parseAuthJson(res) {
  const text = await res.text()
  let data = {}
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      const snippet = text.replace(/\s+/g, ' ').trim().slice(0, 180)
      throw new Error(
        res.ok
          ? 'Resposta inválida do servidor (não é JSON).'
          : `Erro ${res.status}${snippet ? `: ${snippet}` : ''}`,
      )
    }
  }
  if (!res.ok) {
    const msg =
      _messageFromAuthErrorBody(data) ||
      (data && data.success === false && typeof data.error === 'string' ? data.error : null) ||
      `Erro ${res.status}${res.statusText ? ` (${res.statusText})` : ''}`
    throw new Error(msg)
  }
  return data
}

function _authFetchError(e) {
  if (e && e.name === 'TypeError' && (e.message === 'Failed to fetch' || String(e.message).includes('fetch'))) {
    return new Error(
      'Não foi possível conectar ao servidor. Confirme se a API está no ar e se a URL está correta (VITE_API_URL ou proxy /api).',
    )
  }
  return e instanceof Error ? e : new Error(String(e))
}

export async function loginAuth(usuario, senha) {
  let res
  try {
    res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ usuario: usuario.trim(), senha }),
    })
  } catch (e) {
    throw _authFetchError(e)
  }
  const data = await parseAuthJson(res)
  if (data.access_token) setAccessToken(data.access_token)
  return data
}

export async function registerAuth(usuario, senha) {
  let res
  try {
    res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ usuario: usuario.trim(), senha }),
    })
  } catch (e) {
    throw _authFetchError(e)
  }
  const data = await parseAuthJson(res)
  if (data.access_token) setAccessToken(data.access_token)
  return data
}

export async function logoutAuth() {
  await fetch(`${API_BASE}/auth/logout`, { method: 'POST', headers: defaultHeaders() }).catch(() => {})
  setAccessToken(null)
}

export async function getAuthMe() {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: defaultHeaders() })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function gerarNpc(data) {
  return apiFetch(`${API_BASE}/npcs/gerar`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function equipamentoPrevia(data) {
  return apiFetch(`${API_BASE}/equipamento-previa`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function elixirPrevia(data) {
  return apiFetch(`${API_BASE}/elixir-previa`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function gerarEstabelecimento(data) {
  return apiFetch(`${API_BASE}/estabelecimentos/gerar`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
