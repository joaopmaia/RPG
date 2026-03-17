import { Link } from 'react-router-dom'

export default function RegrasAcertoCritico() {
  return (
    <div className="regras-doc">
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/regras">← Regras</Link>
      </nav>
      <h1>Acerto Crítico</h1>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p>O acerto crítico <strong>dobra o dado para acertar um alvo ou realizar uma ação</strong>, porém <strong>não dobra o dano</strong> — não existem acertos críticos para o dano.</p>
        <p>Por exemplo: um ataque com uma adaga que obteve acerto crítico rolará mais 1d10 para somar ao bônus de acertar o alvo. Caso o alvo também tenha um acerto crítico, ambos terão mais 1d10 de bônus para tentar acertar ou esquivar.</p>
        <p>Esse efeito <strong>não é acumulativo</strong>: só um dado bônus extra poderá ser usado.</p>
        <p style={{ marginBottom: 0 }}>Algumas habilidades ou runas têm efeitos especiais em acertos críticos.</p>
      </section>

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/regras">← Voltar a Regras</Link>
      </p>
    </div>
  )
}
