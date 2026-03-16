import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { get, update } from '../api'

const ATRIBUTOS = ['forca', 'vitalidade', 'destreza', 'inteligencia', 'espirito', 'carisma', 'percepcao']

export default function NPCEditar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [npc, setNpc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    get('npcs', id)
      .then(setNpc)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (field, value) => {
    setNpc((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const handleArrayChange = (field, text) => {
    const arr = text.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
    setNpc((prev) => (prev ? { ...prev, [field]: arr } : null))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!npc) return
    setSaving(true)
    const { _id, equipamentos, elixires, ...payload } = npc
    update('npcs', id, payload)
      .then(() => navigate(`/npcs/${id}/ficha`))
      .catch((e) => setError(e.message))
      .finally(() => setSaving(false))
  }

  if (loading) return <p>Carregando…</p>
  if (error && !npc) return <p className="error-msg">{error}</p>
  if (!npc) return <p>NPC não encontrado.</p>

  return (
    <div style={{ maxWidth: '640px' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/npcs">← Lista de NPCs</Link>
        {' · '}
        <Link to={`/npcs/${id}/ficha`}>Ver ficha</Link>
      </div>
      <form onSubmit={handleSubmit} className="card">
        <h2>Editar NPC</h2>
        {error && <p className="error-msg">{error}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <label>Nome <input type="text" value={npc.nome || ''} onChange={(e) => handleChange('nome', e.target.value)} /></label>
          <label>Raça <input type="text" value={npc.raça || ''} onChange={(e) => handleChange('raça', e.target.value)} /></label>
          <label>Tipo <input type="text" value={npc.tipo || ''} onChange={(e) => handleChange('tipo', e.target.value)} /></label>
          <label>Nível <input type="number" min={1} max={5} value={npc.nível ?? ''} onChange={(e) => handleChange('nível', parseInt(e.target.value, 10) || 1)} /></label>
          <label>Natureza <input type="text" value={npc.natureza || ''} onChange={(e) => handleChange('natureza', e.target.value)} /></label>
          <label>Moedas <input type="text" value={npc.moedas || ''} onChange={(e) => handleChange('moedas', e.target.value)} /></label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
          {ATRIBUTOS.map((a) => (
            <label key={a}>{a} <input type="number" min={1} max={8} value={npc[a] ?? ''} onChange={(e) => handleChange(a, parseInt(e.target.value, 10) || 0)} /></label>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <label>HP total <input type="text" value={npc.hp_total ?? ''} onChange={(e) => handleChange('hp_total', e.target.value)} /></label>
          <label>HP atual <input type="text" value={npc.hp_atual ?? ''} onChange={(e) => handleChange('hp_atual', e.target.value)} /></label>
          <label>Arcana total <input type="text" value={npc.arcana_total ?? ''} onChange={(e) => handleChange('arcana_total', e.target.value)} /></label>
          <label>Arcana atual <input type="text" value={npc.arcana_atual ?? ''} onChange={(e) => handleChange('arcana_atual', e.target.value)} /></label>
          <label>Perícia <input type="text" value={npc.pericia ?? ''} onChange={(e) => handleChange('pericia', e.target.value)} /></label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <label>Arma 1 <input type="text" value={npc.arma1 || ''} onChange={(e) => handleChange('arma1', e.target.value)} /></label>
          <label>Arma 2 <input type="text" value={npc.arma2 || ''} onChange={(e) => handleChange('arma2', e.target.value)} /></label>
          <label>Armadura <input type="text" value={npc.armadura || ''} onChange={(e) => handleChange('armadura', e.target.value)} /></label>
          <label>Escudo <input type="text" value={npc.escudo || ''} onChange={(e) => handleChange('escudo', e.target.value)} /></label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Runas (uma por linha ou separadas por vírgula)<textarea rows={2} value={(npc.runas || []).join('\n')} onChange={(e) => handleArrayChange('runas', e.target.value)} /></label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Elixires (um por linha ou separados por vírgula)<textarea rows={2} value={(npc.elixir || []).join('\n')} onChange={(e) => handleArrayChange('elixir', e.target.value)} /></label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Observações (uma por linha)<textarea rows={3} value={(npc.observacoes || []).join('\n')} onChange={(e) => handleArrayChange('observacoes', e.target.value)} /></label>
        </div>
        <div>
          <button type="submit" disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</button>
          {' '}
          <Link to={`/npcs/${id}/ficha`}><button type="button">Cancelar</button></Link>
        </div>
      </form>
    </div>
  )
}
