import { Link } from 'react-router-dom'
import { atributos } from '../data/regrasAtributos'

const SLUGS_ORDER = ['forca', 'vitalidade', 'inteligencia', 'destreza', 'espirito', 'percepcao', 'carisma']

export default function GuiasAtributos() {
  return (
    <div>
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/guias">← Guias</Link>
      </nav>
      <h1>Atributos</h1>
      <p style={{ color: 'var(--parchment-dark)', marginBottom: '1.5rem' }}>
        Os atributos são a base das capacidades físicas e mentais do personagem. Cada um possui descrição, exemplos de uso e bônus por nível.
      </p>
      <ul style={{ margin: 0, paddingLeft: '1.25rem', listStyle: 'none' }}>
        {SLUGS_ORDER.map((slug) => {
          const a = atributos[slug]
          if (!a) return null
          return (
            <li key={slug} style={{ marginBottom: '0.5rem' }}>
              <Link to={`/regras/atributos/${slug}`}>{a.nome} ({a.sigla})</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
