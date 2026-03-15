import { Outlet } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import './Layout.css'

const nav = [
  { to: '/', label: 'Início' },
  { to: '/armas', label: 'Armas' },
  { to: '/armaduras', label: 'Armaduras' },
  { to: '/alquimia', label: 'Alquimia' },
  { to: '/reinos', label: 'Reinos' },
  { to: '/materiais', label: 'Materiais' },
  { to: '/runas', label: 'Runas' },
  { to: '/npcs', label: 'NPCs' },
  { to: '/equipamentos-npc', label: 'Equip. NPC' },
  { to: '/elixir-npc', label: 'Elixir NPC' },
]

export default function Layout() {
  return (
    <div className="layout">
      <header className="layout-header">
        <h1 className="layout-title">Crônicas do Reino</h1>
        <p className="layout-subtitle">Grimório do Mestre</p>
      </header>
      <nav className="layout-nav">
        {nav.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => 'layout-nav-link' + (isActive ? ' active' : '')}
            end={to === '/'}
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  )
}
