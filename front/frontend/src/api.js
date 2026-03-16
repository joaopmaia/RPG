const API_BASE = 'http://127.0.0.1:5000/api';
export const API_ORIGIN = 'http://127.0.0.1:5000';

const DEFAULT_OPTS = { credentials: 'include' };

export function getReinoMapaUrl(id) {
  return `${API_ORIGIN}/api/reinos/${id}/mapa`;
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

async function apiFetch(url, options = {}) {
  const opts = { ...DEFAULT_OPTS, ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } };
  try {
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error(await res.text());
    return res.status === 204 ? null : res.json();
  } catch (e) {
    if (e.name === 'TypeError' && (e.message === 'Failed to fetch' || e.message.includes('fetch'))) {
      throw new Error('Não foi possível conectar ao servidor. Inicie o backend em outro terminal: make front-backend');
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

export async function remove(collection, id) {
  const res = await fetch(`${API_BASE}/${collection}/${id}`, { method: 'DELETE', ...DEFAULT_OPTS, headers: { 'Content-Type': 'application/json' } }).catch((e) => {
    if (e.name === 'TypeError' && (e.message === 'Failed to fetch' || e.message.includes('fetch'))) {
      throw new Error('Não foi possível conectar ao servidor. Inicie o backend em outro terminal: make front-backend');
    }
    throw e;
  });
  if (!res.ok && res.status !== 204) throw new Error(await res.text());
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
  const res = await fetch(`${API_BASE}/imagens/buscar${q}`, { ...DEFAULT_OPTS });
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
    body: form,
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || await res.text());
  return res.json();
}

export async function getReinosInfo() {
  return apiFetch(`${API_BASE}/reinos-info`);
}

export async function getWorldStory() {
  return apiFetch(`${API_BASE}/historias/world-story-for-players`);
}

export async function loginAuth(usuario, senha) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario: usuario.trim(), senha }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Falha no login');
  return data;
}

export async function logoutAuth() {
  await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
}

export async function getAuthMe() {
  const res = await fetch(`${API_BASE}/auth/me`, { credentials: 'include' });
  if (!res.ok) return null;
  return res.json();
}

export async function gerarNpc(data) {
  try {
    const res = await fetch(`${API_BASE}/npcs/gerar`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || await res.text());
    }
    return res.json();
  } catch (e) {
    if (e.name === 'TypeError' && (e.message === 'Failed to fetch' || e.message.includes('fetch'))) {
      throw new Error('Não foi possível conectar ao servidor. Inicie o backend em outro terminal: make front-backend');
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || await res.text());
    }
    return res.json();
  } catch (e) {
    if (e.name === 'TypeError' && (e.message === 'Failed to fetch' || e.message.includes('fetch'))) {
      throw new Error('Não foi possível conectar ao servidor. Inicie o backend em outro terminal: make front-backend');
    }
    throw e;
  }
}
