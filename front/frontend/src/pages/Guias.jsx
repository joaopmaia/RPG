import { Link } from 'react-router-dom'

export default function Guias() {
  return (
    <div>
      <h1>Guias</h1>
      <p style={{ color: 'var(--parchment-dark)', marginBottom: '1.5rem' }}>
        Biblioteca com as páginas informativas do jogo: atributos, perícias e antecedentes.
      </p>
      <div className="card" style={{ maxWidth: 520 }}>
        <h2 style={{ marginTop: 0 }}>Índice</h2>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          <li style={{ marginBottom: '0.75rem' }}>
            <Link to="/guias/atributos">Atributos</Link> — descrição de cada atributo (Força, Vitalidade, Inteligência, Destreza, Espírito, Percepção, Carisma) e bônus por nível.
          </li>
          <li style={{ marginBottom: '0.75rem' }}>
            <Link to="/guias/pericias">Perícias</Link> — descrição de cada perícia, atributo relacionado e efeitos por nível.
          </li>
          <li style={{ marginBottom: '0.75rem' }}>
            <Link to="/guias/antecedentes">Antecedentes</Link> — pontos de background para a criação de ficha: antecedentes positivos e negativos, custos e efeitos.
          </li>
        </ul>
      </div>
    </div>
  )
}
