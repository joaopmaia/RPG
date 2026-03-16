import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { create } from '../api'

export default function AnimalCriar() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    nome: '',
    tipo: 'Terrestre',
    nível: 'comum',
    raça: '',
    hp_total: 30,
    hp_atual: 30,
    arcana_total: 0,
    arcana_atual: 0,
    armadura: 1,
    pericia: 2,
    dano: '1d6',
    ataque_especial: '',
    efeito_ataque_critico: '',
    runas: [],
    observacoes: [],
    ataques: [],
    loot: [],
  })

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field, text) => {
    const arr = text.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
    setForm((prev) => ({ ...prev, [field]: arr }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    create('animais', form)
      .then((res) => navigate(res._id ? `/animais/${res._id}/ficha` : '/animais'))
      .catch((e) => { setError(e.message); setSaving(false) })
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/animais">← Lista de animais</Link>
      </div>
      <form onSubmit={handleSubmit} className="card">
        <h2>Criar animal / fera</h2>
        {error && <p className="error-msg">{error}</p>}
        <div className="form-row">
          <label>Nome</label>
          <input type="text" value={form.nome} onChange={(e) => handleChange('nome', e.target.value)} required />
        </div>
        <div className="form-row">
          <label>Tipo</label>
          <select value={form.tipo} onChange={(e) => handleChange('tipo', e.target.value)}>
            <option value="Terrestre">Terrestre</option>
            <option value="Aquático">Aquático</option>
            <option value="Voador">Voador</option>
          </select>
        </div>
        <div className="form-row">
          <label>Nível</label>
          <select value={form.nível} onChange={(e) => handleChange('nível', e.target.value)}>
            <option value="comum">Comum (Pequeno)</option>
            <option value="grande">Grande</option>
            <option value="arcano">Arcano</option>
          </select>
        </div>
        <div className="form-row">
          <label>Raça</label>
          <input type="text" value={form.raça} onChange={(e) => handleChange('raça', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="form-row">
            <label>HP total</label>
            <input type="number" min={0} value={form.hp_total} onChange={(e) => handleChange('hp_total', Number(e.target.value) || 0)} />
          </div>
          <div className="form-row">
            <label>HP atual</label>
            <input type="number" min={0} value={form.hp_atual} onChange={(e) => handleChange('hp_atual', Number(e.target.value) || 0)} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="form-row">
            <label>Arcana total</label>
            <input type="number" min={0} value={form.arcana_total} onChange={(e) => handleChange('arcana_total', Number(e.target.value) || 0)} />
          </div>
          <div className="form-row">
            <label>Arcana atual</label>
            <input type="number" min={0} value={form.arcana_atual} onChange={(e) => handleChange('arcana_atual', Number(e.target.value) || 0)} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="form-row">
            <label>Armadura</label>
            <input type="number" min={0} value={form.armadura} onChange={(e) => handleChange('armadura', Number(e.target.value) || 0)} />
          </div>
          <div className="form-row">
            <label>Perícia</label>
            <input type="number" value={form.pericia} onChange={(e) => handleChange('pericia', Number(e.target.value) || 0)} />
          </div>
        </div>
        <div className="form-row">
          <label>Dano</label>
          <input type="text" value={form.dano} onChange={(e) => handleChange('dano', e.target.value)} placeholder="1d6" />
        </div>
        <div className="form-row">
          <label>Ataque especial</label>
          <input type="text" value={form.ataque_especial} onChange={(e) => handleChange('ataque_especial', e.target.value)} />
        </div>
        <div className="form-row">
          <label>Efeito ataque crítico</label>
          <input type="text" value={form.efeito_ataque_critico} onChange={(e) => handleChange('efeito_ataque_critico', e.target.value)} />
        </div>
        <div className="form-row">
          <label>Runas (opcional, uma por linha)</label>
          <textarea value={(form.runas || []).join('\n')} onChange={(e) => handleArrayChange('runas', e.target.value)} rows={2} />
        </div>
        <div className="form-row">
          <label>Ataques (um por linha)</label>
          <textarea value={(form.ataques || []).join('\n')} onChange={(e) => handleArrayChange('ataques', e.target.value)} rows={3} />
        </div>
        <div className="form-row">
          <label>Loot (um por linha)</label>
          <textarea value={(form.loot || []).join('\n')} onChange={(e) => handleArrayChange('loot', e.target.value)} rows={2} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button type="submit" className="primary" disabled={saving}>{saving ? 'Salvando…' : 'Criar'}</button>
          <Link to="/animais"><button type="button">Cancelar</button></Link>
        </div>
      </form>
    </div>
  )
}
