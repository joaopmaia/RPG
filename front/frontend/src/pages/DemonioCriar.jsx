import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gerarDemonio } from '../api'

const TIERS = [
  { value: 'inferior', label: 'Demônio Inferior (Base: 2 | Perícia: +2 | HP Bônus: +15)' },
  { value: 'normal', label: 'Demônio Normal (Base: 4 | Perícia: +5 | HP Bônus: +40)' },
  { value: 'superior', label: 'Demônio Superior (Base: 6 | Perícia: +8 | HP Bônus: +100)' },
]

const ELEMENTOS = [
  { value: '', label: 'Sortear aleatório' },
  { value: 'Genia', label: 'Genia (Fogo)' },
  { value: 'Degila', label: 'Degila (Gelo)' },
  { value: 'Reetear', label: 'Reetear (Ar/Som)' },
  { value: 'Arunalt', label: 'Arunalt (Terra)' },
  { value: 'Saltrat', label: 'Saltrat (Mente)' },
  { value: 'Pascalia', label: 'Pascalia (Espaço/Vácuo)' },
]

export default function DemonioCriar() {
  const navigate = useNavigate()
  const [tier, setTier] = useState('normal')
  const [elemento, setElemento] = useState('')
  const [nome, setNome] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const body = { tier, nome: nome.trim() || undefined }
    if (elemento) body.elemento = elemento
    gerarDemonio(body)
      .then((res) => {
        if (res._id) navigate(`/demonios/${res._id}/interagir`)
        else navigate('/demonios')
      })
      .catch((e) => {
        setError(e.message)
        setSaving(false)
      })
  }

  return (
    <div style={{ maxWidth: '480px' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/demonios">← Lista de demônios</Link>
      </div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Gerar demônio</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>
          O demônio será gerado de forma semi-aleatória (atributos, elemento, ataques e loot) com base no tier. Opcionalmente defina um nome; caso contrário será sorteado.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Tier</label>
            <select value={tier} onChange={(e) => setTier(e.target.value)}>
              {TIERS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label>Elemento (opcional)</label>
            <select value={elemento} onChange={(e) => setElemento(e.target.value)}>
              {ELEMENTOS.map((el) => (
                <option key={el.value || 'sortear'} value={el.value}>{el.label}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label>Nome (opcional)</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Deixe vazio para nome aleatório" />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="submit" className="primary" disabled={saving}>
              {saving ? 'Gerando…' : 'Gerar e salvar'}
            </button>
            <Link to="/demonios"><button type="button">Cancelar</button></Link>
          </div>
        </form>
      </div>
    </div>
  )
}
