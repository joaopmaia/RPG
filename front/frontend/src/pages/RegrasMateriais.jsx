import { Link } from 'react-router-dom'
import { PericiaLink } from '../components/RegrasLinks'

export default function RegrasMateriais() {
  return (
    <div className="regras-doc">
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/regras">← Regras</Link>
      </nav>
      <h1>Materiais</h1>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p>No universo do jogo, os materiais são essenciais para a criação de itens como ferramentas, armas ou aparatos rúnicos. Cada material tem sua origem, sendo animal, vegetal, demoníaco ou mineral, e oferece diferentes bônus ou dificuldades na criação de itens, conforme sua qualidade, classificada de F a S.</p>
        <p style={{ marginBottom: 0 }}>Consulte a <Link to="/materiais">lista de materiais</Link> (catálogo em <Link to="/equipamentos">Equipamentos</Link>) para os materiais disponíveis no jogo.</p>
      </section>

      <h2 id="tipos" style={{ marginBottom: '0.75rem' }}>Tipos de Materiais</h2>
      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <dl style={{ margin: 0 }}>
          <dt><strong>Animal</strong></dt>
          <dd style={{ marginBottom: '1rem' }}>Materiais obtidos de criaturas vivas, como peles curtidas, ossos robustos, penas exóticas, venenos potentes e o próprio sangue de feras ancestrais.</dd>
          <dt><strong>Vegetal</strong></dt>
          <dd style={{ marginBottom: '1rem' }}>Materiais extraídos da flora, como madeira resistente, ervas raras e raízes profundas.</dd>
          <dt><strong>Demoníaco</strong></dt>
          <dd style={{ marginBottom: '1rem' }}>Materiais provenientes do abismo e de criaturas infernais, imbuídos de energias arcanas e efeitos de maldição.</dd>
          <dt><strong>Mineral</strong></dt>
          <dd style={{ marginBottom: 0 }}>Materiais extraídos de metais raros, gemas mágicas e pedras ancestrais, encontrados em cavernas e minas.</dd>
        </dl>
      </section>

      <h2 id="propriedades" style={{ marginBottom: '0.75rem' }}>Entendendo as Propriedades dos Materiais</h2>
      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p>A escolha da matéria-prima é o passo mais crucial na forja de um armamento ou na confecção de uma proteção em Khonum. Cada material, seja ele de origem Animal, Vegetal, Mineral ou Demoníaca, possui propriedades intrínsecas que determinam a eficácia, o peso e a resistência do produto final.</p>
        <ul>
          <li><strong>Rank</strong> — Representa a qualidade absoluta do material, escalonando do F (o mais rudimentar) ao S (o ápice da perfeição).</li>
          <li><strong>Material</strong> — Dá nome à substância utilizada, cada uma com sua própria identidade e origem.</li>
          <li><strong>Bônus Dano/Def</strong> — O quanto aquele material soma ao poder de ataque de uma arma ou à capacidade de proteção de armaduras e escudos. É o valor que diferencia uma simples adaga de ferro de uma lâmina forjada em Mythril.</li>
          <li><strong>Peso</strong> — Materiais classificados como Leves não alteram a categoria de peso original do molde do equipamento. Materiais Pesados aumentam a carga: uma arma leve torna-se média se forjada com material pesado; equipamentos já pesados tornam-se encarregáveis para a maioria dos seres com matérias-primas pesadas.</li>
          <li><strong>Durabilidade (Durab.)</strong> — O valor de vida adicional que o material concede ao item. Se a durabilidade total chegar a zero, o equipamento fica inútil até ser reparado por um artesão.</li>
          <li><strong>Raridade</strong> — Dita a dificuldade de extração (<PericiaLink nome="Sobrevivência" />) ou a chance de encontrar o recurso com mercadores, e estabelece o valor intrínseco do objeto. Em Khonum o valor é uma progressão exponencial: quanto mais pura e rara a matéria-prima, maior sua capacidade de ressonar com a Arcana.</li>
        </ul>
      </section>

      <h2 id="dificuldade" style={{ marginBottom: '0.75rem' }}>Dificuldade de criação</h2>
      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p>A raridade do material define a dificuldade de construção (teste de <PericiaLink nome="Ofícios" /> ou equivalente):</p>
        <div className="table-wrap" style={{ marginTop: '0.75rem' }}>
          <table>
            <thead>
              <tr><th>Raridade</th><th>Dificuldade de construção</th></tr>
            </thead>
            <tbody>
              <tr><td>Comum</td><td>10</td></tr>
              <tr><td>Incomum</td><td>12</td></tr>
              <tr><td>Raro</td><td>15</td></tr>
              <tr><td>Épico</td><td>17</td></tr>
              <tr><td>Lendário</td><td>20</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <h2 id="custo" style={{ marginBottom: '0.75rem' }}>Custo e multiplicadores</h2>
      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p>O custo final de qualquer equipamento é determinado pela multiplicação do seu valor base pela raridade do material. Se o item for um Artefato Rúnico, esse valor é multiplicado novamente pelo nível da runa encrustada.</p>
        <ul>
          <li>Material Comum → Não altera o valor do item</li>
          <li>Material Incomum → Multiplica o valor do item por <strong>5</strong></li>
          <li>Material Raro → Multiplica o valor do item por <strong>15</strong></li>
          <li>Material Épico → Multiplica o valor do item por <strong>50</strong></li>
          <li>Material Lendário → Multiplica o valor do item por <strong>100</strong></li>
        </ul>
      </section>

      <h2 id="arcana" style={{ marginBottom: '0.75rem' }}>Armazenamento de Arcana</h2>
      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p style={{ marginBottom: 0 }}>Alguns materiais têm a propriedade de armazenar Arcana. Esses materiais podem armazenar um total de Arcana equivalente à metade (arredondando para baixo) do total da sua durabilidade.</p>
      </section>

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/regras">← Voltar a Regras</Link>
      </p>
    </div>
  )
}
