import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from './context/useAuth'
import LoginModal from './components/LoginModal'
import './Layout.css'

const equipamentosPaths = ['/armas', '/armaduras', '/alquimia', '/materiais']
const regrasPaths = ['/regras']
const guiasPaths = ['/guias']
const roleplayingPaths = ['/npcs', '/animais', '/demonios', '/estabelecimentos', '/roleplaying/viagens']

const navBase = [
  { to: '/', label: 'Início' },
  { to: '/equipamentos', label: 'Equipamentos', sub: [
    { to: '/armas', label: 'Armas' },
    { to: '/armaduras', label: 'Armaduras' },
    { to: '/alquimia', label: 'Alquimia' },
    { to: '/materiais', label: 'Materiais' },
  ], paths: equipamentosPaths },
    { to: '/regras', label: 'Regras', sub: [
    { to: '/regras/criacao-ficha', label: 'Criação de Ficha' },
    { to: '/regras/inventario', label: 'Inventário' },
    { to: '/regras/dificuldades-acoes', label: 'Dificuldades de Ações' },
    { to: '/regras/acerto-critico', label: 'Acerto Crítico' },
    { to: '/regras/ataque-mirado', label: 'Ataque Mirado' },
    { to: '/regras/sistema-combate', label: 'Sistema de Combate' },
    { to: '/regras/status', label: 'Status' },
    { to: '/regras/alquimia', label: 'Alquimia' },
    { to: '/regras/materiais', label: 'Materiais' },
    { to: '/regras/equipamentos', label: 'Equipamentos' },
    { to: '/regras/hospedagens', label: 'Hospedagens' },
    { to: '/regras/viagens', label: 'Viagens' },
    { to: '/regras/musicas', label: 'Músicas' },
    { to: '/regras/runas', label: 'Runas' },
  ], paths: regrasPaths },
  { to: '/guias', label: 'Guias', sub: [
    { to: '/guias/atributos', label: 'Atributos' },
    { to: '/guias/pericias', label: 'Perícias' },
    { to: '/guias/antecedentes', label: 'Antecedentes' },
    { to: '/guias/glossario', label: 'Glossário' },
  ], paths: guiasPaths },
  { to: '/roleplaying', label: 'Roleplaying', sub: [
    { to: '/npcs', label: 'NPCs' },
    { to: '/animais', label: 'Animais' },
    { to: '/demonios', label: 'Demônios' },
    { to: '/estabelecimentos', label: 'Estabelecimentos' },
    { to: '/roleplaying/viagens', label: 'Viagens' },
  ], paths: roleplayingPaths },
  { to: '/reinos', label: 'Reinos' },
  { to: '/runas', label: 'Runas' },
  { to: '/musicas', label: 'Músicas' },
]

export default function Layout() {
  const location = useLocation()
  const { user, loading, isAdmin, logout } = useAuth()
  const [equipOpen, setEquipOpen] = useState(equipamentosPaths.some((p) => location.pathname.startsWith(p)))
  const [regrasOpen, setRegrasOpen] = useState(regrasPaths.some((p) => location.pathname.startsWith(p)))
  const [guiasOpen, setGuiasOpen] = useState(guiasPaths.some((p) => location.pathname.startsWith(p)))
  const [roleplayingOpen, setRoleplayingOpen] = useState(roleplayingPaths.some((p) => location.pathname.startsWith(p)))
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
            const isEquip = to === '/equipamentos'
            const isRegras = to === '/regras'
            const isGuias = to === '/guias'
            const isRole = to === '/roleplaying'
            const isActive = (isEquip && (location.pathname === '/equipamentos' || equipamentosPaths.some((p) => location.pathname.startsWith(p))))
              || (isRegras && (location.pathname === '/regras' || regrasPaths.some((p) => location.pathname.startsWith(p))))
              || (isGuias && (location.pathname === '/guias' || guiasPaths.some((p) => location.pathname.startsWith(p))))
              || (isRole && roleplayingPaths.some((p) => location.pathname.startsWith(p)))
            const open = isEquip ? equipOpen : isRegras ? regrasOpen : isGuias ? guiasOpen : roleplayingOpen
            const setOpen = isEquip ? setEquipOpen : isRegras ? setRegrasOpen : isGuias ? setGuiasOpen : setRoleplayingOpen
            return (
              <div key={to} className="layout-nav-dropdown">
                <button
                  type="button"
                  className={'layout-nav-link' + (isActive ? ' active' : '')}
                  onClick={() => setOpen(!open)}
                >
                  {label} ▾
                </button>
                {open && (
                  <div className="layout-nav-sub">
                    {isEquip && (
                      <NavLink to="/equipamentos" className={({ isActive: a }) => 'layout-nav-link' + (a ? ' active' : '')} onClick={() => { setEquipOpen(false); setNavOpen(false); }}>Visão geral</NavLink>
                    )}
                    {isGuias && (
                      <NavLink to="/guias" className={({ isActive: a }) => 'layout-nav-link' + (a ? ' active' : '')} onClick={() => { setGuiasOpen(false); setNavOpen(false); }}>Visão geral</NavLink>
                    )}
                    {sub.map(({ to: sTo, label: sLabel }) => (
                      <NavLink key={sTo} to={sTo} className={({ isActive: a }) => 'layout-nav-link' + (a ? ' active' : '')} onClick={() => { setOpen(false); setNavOpen(false); }}>{sLabel}</NavLink>
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
