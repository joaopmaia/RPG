import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { list, gerarEstabelecimento } from '../api'

const TIPOS = [
  { value: 0, label: 'Ferreiro' },
  { value: 1, label: 'Ferreiro Rúnico' },
  { value: 2, label: 'Alquimista' },
  { value: 3, label: 'Hospedagem / Taverna' },
]
const NIVEIS = [
  { value: 1, label: 'Nível 1 - Ambulante' },
  { value: 2, label: 'Nível 2 - Empório Local' },
  { value: 3, label: 'Nível 3 - Loja de Cidade' },
  { value: 4, label: 'Nível 4 - Loja de Luxo' },
  { value: 5, label: 'Nível 5 - Leilão de Nobres' },
]

export default function EstabelecimentoCriar() {
  const navigate = useNavigate()
  const [reinos, setReinos] = useState([])
  const [form, setForm] = useState({ nivel: 1, reino_id: '', tipo: 0 })
  const [gerando, setGerando] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    list('reinos').then(setReinos).catch(() => setReinos([]))
  }, [])

  const handleGerar = () => {
    if (!form.reino_id) {
      setError('Selecione um reino.')
      return
    }
    setGerando(true)
    setError(null)
    gerarEstabelecimento({ nivel: form.nivel, reino_id: form.reino_id, tipo: form.tipo })
      .then((data) => {
        if (data?._id) navigate(`/estabelecimentos/${data._id}`)
        else navigate('/estabelecimentos')
      })
      .catch((e) => setError(e.message))
      .finally(() => setGerando(false))
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/estabelecimentos" className="button">← Voltar à lista de estabelecimentos</Link>
      </div>
      <div className="card" style={{ maxWidth: '420px' }}>
        <h2>Criar estabelecimento</h2>
        <p style={{ color: 'var(--parchment-dark)', marginBottom: '1rem' }}>
          Gera um estabelecimento com estoque: selecione nível, reino e tipo.
        </p>
        <div className="form-row">
          <label>Nível</label>
          <select value={form.nivel} onChange={(e) => setForm({ ...form, nivel: Number(e.target.value) })}>
            {NIVEIS.map((n) => (
              <option key={n.value} value={n.value}>{n.label}</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>Reino</label>
          <select value={form.reino_id} onChange={(e) => setForm({ ...form, reino_id: e.target.value })}>
            <option value="">Selecione o reino</option>
            {reinos.map((r) => (
              <option key={r._id} value={r._id}>{r.nome}</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>Tipo</label>
          <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: Number(e.target.value) })}>
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        {error && <p className="error-msg">{error}</p>}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button type="button" className="primary" onClick={handleGerar} disabled={gerando}>
            {gerando ? 'Gerando…' : 'Gerar e abrir estabelecimento'}
          </button>
          <Link to="/estabelecimentos" className="button">Cancelar</Link>
        </div>
      </div>
    </div>
  )
}
