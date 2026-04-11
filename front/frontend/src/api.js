// URL da API: defina VITE_API_URL no .env do frontend (ex.: VITE_API_URL=http://127.0.0.1:5000).
// Em produção, VITE_API_URL é obrigatória. Em dev, se não estiver definida, usa-se o fallback abaixo (apenas local).
const _envUrl = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL;
const API_ORIGIN = _envUrl
  ? String(_envUrl).replace(/\/$/, '')
  : (import.meta.env?.DEV ? 'http://127.0.0.1:5000' : '');
const API_BASE = API_ORIGIN ? `${API_ORIGIN}/api` : '/api';
export { API_ORIGIN };

const CAMPANHA_STORAGE_KEY = 'khonum_campanha_id';

export function getCampanhaId() {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(CAMPANHA_STORAGE_KEY) || null;
}

export function setCampanhaId(id) {
  if (typeof localStorage === 'undefined') return;
  if (id == null || id === '') localStorage.removeItem(CAMPANHA_STORAGE_KEY);
  else localStorage.setItem(CAMPANHA_STORAGE_KEY, String(id));
}

function campanhaHeaders() {
  const id = getCampanhaId();
  return id ? { 'X-Campanha-Id': id } : {};
}

const DEFAULT_OPTS = { credentials: 'include' };

export function getReinoMapaUrl(id) {
  return `${API_ORIGIN}/api/reinos/${id}/mapa`;
}

/** URL para imagem da pasta mapas (ex.: camping.jpg). */
export function getMapaAssetUrl(filename) {
  return `${API_ORIGIN}/api/mapas/${encodeURIComponent(filename)}`;
}

function buildQuery(params) {
  const sp = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v == null || v === '') return;
    if (Array.isArray(v)) {
      v.forEach((val) => sp.append(k, val));
    } else {
      sp.set(k, v);
    }
  });
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}

async function parseErrorResponse(res) {
  const text = await res.text();
  try {
    const j = JSON.parse(text);
    return j.error || j.message || text || res.statusText;
  } catch {
    return text || res.statusText;
  }
}

async function apiFetch(url, options = {}) {
  const opts = {
    ...DEFAULT_OPTS,
    ...options,
    headers: { 'Content-Type': 'application/json', ...campanhaHeaders(), ...(options.headers || {}) },
  };
  try {
    const res = await fetch(url, opts);
    if (!res.ok) {
      const msg = await parseErrorResponse(res);
      throw new Error(msg);
    }
    return res.status === 204 ? null : res.json();
  } catch (e) {
    if (e.name === 'TypeError' && (e.message === 'Failed to fetch' || e.message.includes('fetch'))) {
      throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando (make front-backend ou make run) e se o MongoDB está ativo.');
    }
    throw e;
  }
}

export async function list(collection, params) {
  return apiFetch(`${API_BASE}/${collection}${buildQuery(params)}`);
}

export async function get(collection, id) {
  return apiFetch(`${API_BASE}/${collection}/${id}`);
}

/** Dados para Passar a Noite: estabelecimento + ladinos, animais e demônios resolvidos por nome. */
export async function getEstabelecimentoNoite(id) {
  return apiFetch(`${API_BASE}/estabelecimentos/${id}/noite`);
}

export async function create(collection, data) {
  return apiFetch(`${API_BASE}/${collection}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function update(collection, id, data) {
  return apiFetch(`${API_BASE}/${collection}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function gerarDemonio(data) {
  return apiFetch(`${API_BASE}/demonios/gerar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function gerarAnimal(data) {
  return apiFetch(`${API_BASE}/animais/gerar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function remove(collection, id) {
  const res = await fetch(`${API_BASE}/${collection}/${id}`, {
    method: 'DELETE',
    ...DEFAULT_OPTS,
    headers: { 'Content-Type': 'application/json', ...campanhaHeaders() },
  }).catch((e) => {
    if (e.name === 'TypeError' && (e.message === 'Failed to fetch' || e.message.includes('fetch'))) {
      throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando (make front-backend ou make run) e se o MongoDB está ativo.');
    }
    throw e;
  });
  if (!res.ok && res.status !== 204) throw new Error(await parseErrorResponse(res));
}

export async function getNpcCompleto(id) {
  return apiFetch(`${API_BASE}/npcs/${id}/completo`);
}

export async function getReinoHistoria(id) {
  return apiFetch(`${API_BASE}/reinos/${id}/historia`);
}

/** Retorna documento de imagem por tabela e identificador, ou null se não existir. */
export async function buscarImagem(tabela, identificador) {
  const q = `?tabela=${encodeURIComponent(tabela)}&identificador=${encodeURIComponent(identificador)}`;
  const res = await fetch(`${API_BASE}/imagens/buscar${q}`, { ...DEFAULT_OPTS, headers: { ...campanhaHeaders() } });
  if (!res.ok) return null;
  const data = await res.json();
  return data || null;
}

/** URL absoluta para exibir imagem (upload local vem como /api/uploads/...). */
export function urlImagem(doc) {
  if (!doc?.url) return null;
  return doc.url.startsWith('/') ? `${API_ORIGIN}${doc.url}` : doc.url;
}

/** Upload de arquivo de imagem: tabela, identificador, File. Retorna documento ou { _id, url }. */
export async function uploadImagem(tabela, identificador, file) {
  const form = new FormData();
  form.append('tabela', tabela);
  form.append('identificador', identificador);
  form.append('file', file);
  const res = await fetch(`${API_BASE}/imagens/upload`, {
    method: 'POST',
    credentials: 'include',
    headers: { ...campanhaHeaders() },
    body: form,
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || await res.text());
  return res.json();
}

export async function getReinosInfo() {
  return apiFetch(`${API_BASE}/reinos-info`);
}

/** Campanhas visíveis ao usuário (admin: todas; demais: só as vinculadas). */
export async function listCampanhas() {
  return apiFetch(`${API_BASE}/campanhas`);
}

/** Catálogo para ingressar (nome, mestre, id). excluirMinhas remove campanhas já no perfil. */
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
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...campanhaHeaders() },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || res.statusText)
  return data
}

export async function deletarCampanha(campanhaId) {
  const res = await fetch(`${API_BASE}/campanhas/${encodeURIComponent(campanhaId)}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...campanhaHeaders() },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || res.statusText)
  return data
}

export async function changePassword(senhaAtual, senhaNova) {
  return apiFetch(`${API_BASE}/auth/senha`, {
    method: 'PATCH',
    body: JSON.stringify({ senha_atual: senhaAtual, senha_nova: senhaNova }),
  })
}

/** Categorias de viagens: Drovenar, Vaelthor, Sylmari, Pontos de Interesse */
export async function getViagensCategorias() {
  return apiFetch(`${API_BASE}/viagens/categorias`);
}

/** Lugares de uma categoria: [{ nome, coords: [x, y] }] */
export async function getViagensCoordenadas(categoria) {
  return apiFetch(`${API_BASE}/viagens/coordenadas/${encodeURIComponent(categoria)}`);
}

export async function getWorldStory() {
  return apiFetch(`${API_BASE}/historias/world-story-for-players`);
}

export async function loginAuth(usuario, senha) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...campanhaHeaders() },
    body: JSON.stringify({ usuario: usuario.trim(), senha }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Falha no login');
  return data;
}

export async function logoutAuth() {
  await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include', headers: { ...campanhaHeaders() } });
}

export async function getAuthMe() {
  const res = await fetch(`${API_BASE}/auth/me`, { credentials: 'include', headers: { ...campanhaHeaders() } });
  if (!res.ok) return null;
  return res.json();
}

export async function gerarNpc(data) {
  try {
    const res = await fetch(`${API_BASE}/npcs/gerar`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...campanhaHeaders() },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || await res.text());
    }
    return res.json();
  } catch (e) {
    if (e.name === 'TypeError' && (e.message === 'Failed to fetch' || e.message.includes('fetch'))) {
      throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando (make front-backend ou make run) e se o MongoDB está ativo.');
    }
    throw e;
  }
}

export async function equipamentoPrevia(data) {
  return apiFetch(`${API_BASE}/equipamento-previa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function elixirPrevia(data) {
  return apiFetch(`${API_BASE}/elixir-previa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function gerarEstabelecimento(data) {
  try {
    const res = await fetch(`${API_BASE}/estabelecimentos/gerar`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...campanhaHeaders() },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || await res.text());
    }
    return res.json();
  } catch (e) {
    if (e.name === 'TypeError' && (e.message === 'Failed to fetch' || e.message.includes('fetch'))) {
      throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando (make front-backend ou make run) e se o MongoDB está ativo.');
    }
    throw e;
  }
}
