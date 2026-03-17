import { Link } from 'react-router-dom'

export default function RegrasEquipamentos() {
  return (
    <div className="regras-doc">
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/regras">← Regras</Link>
      </nav>
      <h1>Equipamentos e itens</h1>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p>As informações sobre os equipamentos e suas características encontram-se nos catálogos do menu <Link to="/equipamentos">Equipamentos</Link>. Neles você encontra dados como dano, defesa, durabilidade, valor base, modificação do valor base por reino, entre outras informações para:</p>
        <ul>
          <li><Link to="/armas">Armas</Link></li>
          <li><Link to="/armaduras">Armaduras</Link> e Escudos</li>
          <li>Serviços da Cidade</li>
          <li>Compostos Alquímicos (<Link to="/alquimia">Alquimia</Link>)</li>
          <li><Link to="/materiais">Materiais</Link></li>
        </ul>
        <p style={{ marginBottom: 0 }}>Consulte as páginas de <Link to="/armas">Armas</Link> e <Link to="/armaduras">Armaduras</Link> em Equipamentos para as tabelas completas e filtros por reino, raridade e tipo.</p>
      </section>

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/regras">← Voltar a Regras</Link>
      </p>
    </div>
  )
}
