const API_BASE = 'http://127.0.0.1:5000/api';

function buildQuery(params) {
  const sp = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v != null && v !== '') sp.set(k, v);
  });
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}

export async function list(collection, params) {
  const res = await fetch(`${API_BASE}/${collection}${buildQuery(params)}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function get(collection, id) {
  const res = await fetch(`${API_BASE}/${collection}/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function create(collection, data) {
  const res = await fetch(`${API_BASE}/${collection}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function update(collection, id, data) {
  const res = await fetch(`${API_BASE}/${collection}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function remove(collection, id) {
  const res = await fetch(`${API_BASE}/${collection}/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error(await res.text());
}
