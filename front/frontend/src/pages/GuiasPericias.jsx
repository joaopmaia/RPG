import { Link } from 'react-router-dom'
import { pericias } from '../data/regrasPericias'

const SLUGS_ORDER = [
  'cutelaria', 'acuidade', 'execucao', 'pontaria', 'briga', 'esquiva', 'resistencia', 'arcanum', 'runico', 'alquimia',
  'artista', 'furtividade', 'oficios', 'atletismo', 'sobrevivencia', 'prontidao', 'empatia', 'labia', 'conducao',
  'cultura', 'idiomas', 'ladinagem', 'mentalidade', 'afinidade-animal',
]

export default function GuiasPericias() {
  return (
    <div>
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/guias">← Guias</Link>
      </nav>
      <h1>Perícias</h1>
      <p style={{ color: 'var(--parchment-dark)', marginBottom: '1.5rem' }}>
        Cada perícia está ligada a um atributo e concede bônus e efeitos especiais em determinados níveis.
      </p>
      <ul style={{ margin: 0, paddingLeft: '1.25rem', listStyle: 'none' }}>
        {SLUGS_ORDER.map((slug) => {
          const p = pericias[slug]
          if (!p) return null
          return (
            <li key={slug} style={{ marginBottom: '0.5rem' }}>
              <Link to={`/regras/pericias/${slug}`}>{p.nome}</Link>
              <span style={{ color: 'var(--parchment-dark)', fontSize: '0.9rem' }}> — {p.atributo}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
