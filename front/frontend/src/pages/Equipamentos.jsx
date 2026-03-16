import { Link } from 'react-router-dom'
import './Dashboard.css'

const itens = [
  { to: '/armas', title: 'Armas', desc: 'Catálogo de armas' },
  { to: '/armaduras', title: 'Armaduras', desc: 'Armaduras e escudos' },
  { to: '/alquimia', title: 'Alquimia', desc: 'Receitas e elixires' },
  { to: '/materiais', title: 'Materiais', desc: 'Materiais por tipo e rank' },
]

export default function Equipamentos() {
  return (
    <div className="dashboard">
      <h1>Equipamentos</h1>
      <p className="dashboard-intro">
        Gerencie armas, armaduras, alquimia e materiais.
      </p>
      <div className="dashboard-grid">
        {itens.map(({ to, title, desc }) => (
          <Link key={to} to={to} className="dashboard-card card">
            <h3>{title}</h3>
            <p>{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
