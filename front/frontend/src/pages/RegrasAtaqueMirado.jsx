import { Link } from 'react-router-dom'
import { AttrLink, PericiaLink } from '../components/RegrasLinks'

export default function RegrasAtaqueMirado() {
  return (
    <div className="regras-doc">
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/regras">← Regras</Link>
      </nav>
      <h1>Ataque Mirado</h1>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p>Você pode realizar um ataque mirado caso deseje; porém ele fará com que seu <strong>teste de ataque seja reduzido pela metade</strong>.</p>
        <p>Exemplo: um ataque mirado com arco e flecha normalmente seria calculado por <AttrLink nome="Destreza" /> + <PericiaLink nome="Pontaria" /> + 1d10. Em um ataque mirado, o teste seria <strong>(Destreza + Pontaria + 1d10) ÷ 2</strong> e causaria <strong>o dobro de dano</strong> caso acertasse.</p>
        <p><strong>Em casos de acerto crítico</strong> em ataque mirado, o HP do alvo é instantaneamente reduzido para 10, independente do quanto ele tenha de HP.</p>
      </section>

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/regras">← Voltar a Regras</Link>
      </p>
    </div>
  )
}
