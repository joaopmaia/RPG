import { Link } from 'react-router-dom'
import './Dashboard.css'

export default function Dashboard() {
  const sections = [
    { to: '/armas', title: 'Armas', desc: 'Catálogo de armas' },
    { to: '/armaduras', title: 'Armaduras', desc: 'Armaduras e escudos' },
    { to: '/alquimia', title: 'Alquimia', desc: 'Receitas e elixires' },
    { to: '/reinos', title: 'Reinos', desc: 'Reinos e preços' },
    { to: '/materiais', title: 'Materiais', desc: 'Materiais por tipo e rank' },
    { to: '/runas', title: 'Runas', desc: 'Runas por tier e elemento' },
    { to: '/npcs', title: 'NPCs', desc: 'Personagens não jogadores' },
    { to: '/equipamentos-npc', title: 'Equipamentos NPC', desc: 'Equipamentos por personagem' },
    { to: '/elixir-npc', title: 'Elixir NPC', desc: 'Elixires por personagem' },
  ]

  return (
    <div className="dashboard">
      <h1>Grimório do Mestre</h1>
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
