import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getWorldStory } from '../api'
import './Dashboard.css'

export default function Dashboard() {
  const { isAdmin } = useAuth()
  const [historia, setHistoria] = useState('')
  const [loadingStory, setLoadingStory] = useState(true)

  useEffect(() => {
    getWorldStory()
      .then((data) => setHistoria(data?.historia || ''))
      .catch(() => setHistoria('Khonum é um mundo fantasioso fantástico!'))
      .finally(() => setLoadingStory(false))
  }, [])

  const sections = [
    { to: '/equipamentos', title: 'Equipamentos', desc: 'Armas, armaduras, alquimia e materiais' },
    { to: '/reinos', title: 'Reinos', desc: 'Reinos e preços' },
    { to: '/runas', title: 'Runas', desc: 'Runas por tier e elemento' },
    { to: '/npcs', title: 'NPCs', desc: 'Personagens (ficha, equipamentos e elixires)' },
  ]
  if (isAdmin()) {
    sections.push({ to: '/demonios', title: 'Demônios', desc: 'Criar e gerenciar demônios' })
    sections.push({ to: '/animais', title: 'Animais', desc: 'Criar e gerenciar feras/animais' })
  }
  // Rotas /demonios e /animais: ver Layout e App.jsx

  return (
    <div className="dashboard">
      <h1>Grimório do Mestre</h1>
      {!loadingStory && historia && (
        <div className="card dashboard-story" style={{ marginBottom: '1.5rem', maxWidth: '720px', whiteSpace: 'pre-wrap' }}>
          <h2 style={{ marginTop: 0 }}>História do mundo</h2>
          <p style={{ margin: 0, lineHeight: 1.6 }}>{historia}</p>
        </div>
      )}
      <p className="dashboard-intro">
        Navegue pelos registros do reino. Cada seção permite listar, filtrar, criar e editar.
      </p>
      <div className="dashboard-grid">
        {sections.map(({ to, title, desc }) => (
          <Link key={to} to={to} className="dashboard-card card">
            <h3>{title}</h3>
            <p>{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
