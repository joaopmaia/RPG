import { Link, useParams } from 'react-router-dom'
import { atributos } from '../data/regrasAtributos'

export default function RegrasAtributo() {
  const { slug } = useParams()
  const attr = slug ? atributos[slug] : null

  if (!attr) {
    return (
      <div>
        <p><Link to="/regras/criacao-ficha">← Criação de Ficha</Link></p>
        <p>Atributo não encontrado.</p>
      </div>
    )
  }

  return (
    <div className="regras-doc">
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/regras">Regras</Link>
        {' → '}
        <Link to="/regras/criacao-ficha">Criação de Ficha</Link>
        {' → Atributo'}
      </nav>
      <h1>{attr.nome} ({attr.sigla})</h1>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <p>{attr.descricao}</p>
        {attr.exemplo && (
          <p style={{ fontStyle: 'italic', color: 'var(--parchment-dark)' }}>{attr.exemplo}</p>
        )}
      </div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Bônus por nível</h2>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          {attr.bonus.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/regras/criacao-ficha#atributos">← Voltar aos atributos</Link>
      </p>
    </div>
  )
}
