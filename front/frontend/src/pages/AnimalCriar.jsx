import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gerarAnimal } from '../api'

const TIERS = [
  { value: 'comum', label: 'Animal Pequeno (Base: 3 | Perícia: +2 | HP Bônus: +20)' },
  { value: 'grande', label: 'Animal Grande (Base: 4 | Perícia: +4 | HP Bônus: +60)' },
  { value: 'arcano', label: 'Animal Arcano (Base: 5 | Perícia: +7 | HP Bônus: +100)' },
]
const TIPOS = ['Terrestre', 'Aquático', 'Voador']

export default function AnimalCriar() {
  const navigate = useNavigate()
  const [tier, setTier] = useState('comum')
  const [tipo, setTipo] = useState('Terrestre')
  const [nome, setNome] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    gerarAnimal({ tier, tipo, nome: nome.trim() || undefined })
      .then((res) => {
        if (res._id) navigate(`/animais/${res._id}/interagir`)
        else navigate('/animais')
      })
      .catch((e) => {
        setError(e.message)
        setSaving(false)
      })
  }

  return (
    <div style={{ maxWidth: '480px' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/animais">← Lista de animais</Link>
      </div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Gerar animal / fera</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>
          O animal será gerado de forma semi-aleatória (atributos, HP, ataques e loot) com base no porte e tipo. Opcionalmente defina um nome; caso contrário será sorteado da lista correspondente.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Porte (tier)</label>
            <select value={tier} onChange={(e) => setTier(e.target.value)}>
              {TIERS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label>Tipo</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              {TIPOS.map((t) => (
                <option key={t} value={t}>{t}</option>
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
            <Link to="/animais"><button type="button">Cancelar</button></Link>
          </div>
        </form>
      </div>
    </div>
  )
}
