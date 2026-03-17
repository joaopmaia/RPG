import { Link, useParams } from 'react-router-dom'
import { pericias } from '../data/regrasPericias'
import { atributoSlugByNome } from '../data/regrasAtributos'

export default function RegrasPericia() {
  const { slug } = useParams()
  const pericia = slug ? pericias[slug] : null

  if (!pericia) {
    return (
      <div>
        <p><Link to="/regras/criacao-ficha">← Criação de Ficha</Link></p>
        <p>Perícia não encontrada.</p>
      </div>
    )
  }

  const attrSlug = atributoSlugByNome[pericia.atributo]

  return (
    <div className="regras-doc">
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/regras">Regras</Link>
        {' → '}
        <Link to="/regras/criacao-ficha">Criação de Ficha</Link>
        {' → Perícia'}
      </nav>
      <h1>{pericia.nome}</h1>
      <p style={{ color: 'var(--parchment-dark)', marginBottom: '1rem' }}>
        Atributo relacionado:{' '}
        {attrSlug ? (
          <Link to={`/regras/atributos/${attrSlug}`}>{pericia.atributo}</Link>
        ) : (
          pericia.atributo
        )}
      </p>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <p>{pericia.descricao}</p>
        {pericia.notas && (
          <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)', marginTop: '0.75rem' }}>
            {pericia.notas}
          </p>
        )}
      </div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Efeitos por nível</h2>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', listStyle: 'none' }}>
          {pericia.efeitos.map((e) => (
            <li key={e.nivel} style={{ marginBottom: '0.5rem' }}>
              <strong>Nível {e.nivel}:</strong> {e.texto}
            </li>
          ))}
        </ul>
      </div>
      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/regras/criacao-ficha#pericias">← Voltar às perícias</Link>
      </p>
    </div>
  )
}
