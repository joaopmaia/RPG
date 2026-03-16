import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from './context/useAuth'
import LoginModal from './components/LoginModal'
import './Layout.css'

const equipamentosPaths = ['/armas', '/armaduras', '/alquimia', '/materiais']

const navBase = [
  { to: '/', label: 'Início' },
  { to: '/equipamentos', label: 'Equipamentos', sub: [
    { to: '/armas', label: 'Armas' },
    { to: '/armaduras', label: 'Armaduras' },
    { to: '/alquimia', label: 'Alquimia' },
    { to: '/materiais', label: 'Materiais' },
  ]},
  { to: '/reinos', label: 'Reinos' },
  { to: '/runas', label: 'Runas' },
  { to: '/npcs', label: 'NPCs', adminOnly: true },
  { to: '/demonios', label: 'Demônios', adminOnly: true },
  { to: '/animais', label: 'Animais', adminOnly: true },
  { to: '/estabelecimentos', label: 'Estabelecimentos' },
]

export default function Layout() {
  const location = useLocation()
  const { user, loading, isAdmin, logout } = useAuth()
  const [equipOpen, setEquipOpen] = useState(equipamentosPaths.some((p) => location.pathname.startsWith(p)))
  const [loginOpen, setLoginOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)

  const nav = [...navBase]
  if (user) {
    if (isAdmin()) nav.push({ to: '/fichas-jogadores', label: 'Fichas dos jogadores' })
    else nav.push({ to: '/minhas-fichas', label: 'Minhas Fichas' })
  }
  const navFiltered = nav.filter((item) => !item.adminOnly || isAdmin())

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="layout-header-inner">
          <button type="button" className="layout-menu-toggle" onClick={() => setNavOpen(!navOpen)} aria-label="Menu">
            <span className="layout-menu-icon">☰</span>
          </button>
          <div className="layout-title-wrap">
            <h1 className="layout-title">Crônicas de Khonum</h1>
            <p className="layout-subtitle">Grimório do Mestre</p>
          </div>
          <div className="layout-header-actions">
            {!loading && (
              user ? (
                <span className="layout-user">
                  <span className="layout-user-name">{user.usuario}</span>
                  <button type="button" className="layout-logout" onClick={logout}>Sair</button>
                </span>
              ) : (
                <button type="button" className="layout-login" onClick={() => setLoginOpen(true)}>Fazer login</button>
              )
            )}
          </div>
        </div>
      </header>

      <nav className={'layout-nav' + (navOpen ? ' open' : '')}>
        {navFiltered.map(({ to, label, sub }) => {
          if (sub) {
            const isActive = to === '/equipamentos' && (location.pathname === '/equipamentos' || equipamentosPaths.some((p) => location.pathname.startsWith(p)))
            return (
              <div key={to} className="layout-nav-dropdown">
                <button
                  type="button"
                  className={'layout-nav-link' + (isActive ? ' active' : '')}
                  onClick={() => setEquipOpen(!equipOpen)}
                >
                  {label} ▾
                </button>
                {equipOpen && (
                  <div className="layout-nav-sub">
                    <NavLink to="/equipamentos" className={({ isActive }) => 'layout-nav-link' + (isActive ? ' active' : '')} onClick={() => { setEquipOpen(false); setNavOpen(false); }}>Visão geral</NavLink>
                    {sub.map(({ to: sTo, label: sLabel }) => (
                      <NavLink key={sTo} to={sTo} className={({ isActive }) => 'layout-nav-link' + (isActive ? ' active' : '')} onClick={() => { setEquipOpen(false); setNavOpen(false); }}>{sLabel}</NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          }
          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => 'layout-nav-link' + (isActive ? ' active' : '')}
              end={to === '/'}
              onClick={() => setNavOpen(false)}
            >
              {label}
            </NavLink>
          )
        })}
      </nav>

      <main className="layout-main">
        <Outlet />
      </main>

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
    </div>
  )
}
