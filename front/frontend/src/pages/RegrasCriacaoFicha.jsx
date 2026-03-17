import { Link } from 'react-router-dom'

const ATRIBUTO_SLUG = { Força: 'forca', Vitalidade: 'vitalidade', Inteligência: 'inteligencia', Destreza: 'destreza', Espírito: 'espirito', Percepção: 'percepcao', Carisma: 'carisma' }
const PERICIA_SLUG = {
  Cutelaria: 'cutelaria', Acuidade: 'acuidade', Execução: 'execucao', Pontaria: 'pontaria', Briga: 'briga', Esquiva: 'esquiva',
  Resistência: 'resistencia', Arcanum: 'arcanum', 'Rúnico': 'runico', Alquimia: 'alquimia', Artista: 'artista', Furtividade: 'furtividade',
  Ofícios: 'oficios', Atletismo: 'atletismo', Sobrevivência: 'sobrevivencia', Prontidão: 'prontidao', Empatia: 'empatia', Lábia: 'labia',
  Condução: 'conducao', Cultura: 'cultura', Idiomas: 'idiomas', Ladinagem: 'ladinagem', Mentalidade: 'mentalidade', 'Afinidade Animal': 'afinidade-animal',
}

function AttrLink({ nome }) {
  const slug = ATRIBUTO_SLUG[nome]
  return slug ? <Link to={`/regras/atributos/${slug}`}>{nome}</Link> : nome
}
function PericiaLink({ nome }) {
  const slug = PERICIA_SLUG[nome]
  return slug ? <Link to={`/regras/pericias/${slug}`}>{nome}</Link> : nome
}

export default function RegrasCriacaoFicha() {
  return (
    <div className="regras-doc">
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/regras">← Regras</Link>
      </nav>
      <h1>Criação de Ficha</h1>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 id="racas">Raças</h2>
        <p>Em Khonum existem 5 raças diferentes, porém apenas 3 delas são possíveis de se escolher: <strong>Sylmari</strong>, <strong>Drovenar</strong> e <strong>Vaelthor</strong>.</p>
      </section>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 id="atributos">Atributos do Jogo</h2>
        <p>Os atributos são a base da personalidade e das capacidades físicas e mentais do seu personagem. Eles representam não só as qualidades físicas, mas também as habilidades mentais e espirituais que definem como o personagem interage com o mundo e enfrenta desafios.</p>
        <p><strong>Cada jogador começará com 10 pontos</strong> para distribuir entre os atributos e poderá ganhar mais pontos ao longo das aventuras com o ganho de experiência. A escolha dos atributos determina o estilo de jogo. <em>Caso você não tenha nenhum ponto em algum atributo, qualquer teste relacionado àquele atributo resultará em falha instantânea, com exceção de acertos críticos.</em></p>
        <p>Cada atributo influencia testes de ação, superação de desafios e concede bônus específicos. Consulte a descrição de cada um:</p>
        <ul>
          <li><AttrLink nome="Força" /> (F)</li>
          <li><AttrLink nome="Vitalidade" /> (V)</li>
          <li><AttrLink nome="Inteligência" /> (I)</li>
          <li><AttrLink nome="Destreza" /> (D)</li>
          <li><AttrLink nome="Espírito" /> (S)</li>
          <li><AttrLink nome="Percepção" /> (P)</li>
          <li><AttrLink nome="Carisma" /> (C)</li>
        </ul>
      </section>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 id="tabela-atributos">Tabela de Atributos Resumidos</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Atributo</th><th>O que afeta</th><th>Bônus por nível</th></tr>
            </thead>
            <tbody>
              <tr><td><AttrLink nome="Força" /> (F)</td><td>Dano físico, capacidade de carregar peso</td><td>+5 HP/nível, dano físico, inventário +1/nível</td></tr>
              <tr><td><AttrLink nome="Vitalidade" /> (V)</td><td>Resistência a danos, veneno, doenças, recuperação de HP</td><td>+10 HP/nível, regeneração de HP, inventário +1/nível</td></tr>
              <tr><td><AttrLink nome="Inteligência" /> (I)</td><td>Uso de runas, aprendizado, reconstrução, alquimia</td><td>Influencia <PericiaLink nome="Rúnico" />, <PericiaLink nome="Alquimia" />, <PericiaLink nome="Cultura" />, <PericiaLink nome="Idiomas" /> e <PericiaLink nome="Ofícios" /></td></tr>
              <tr><td><AttrLink nome="Destreza" /> (D)</td><td>Ataques rápidos, esquivas, furtividade</td><td>Influencia Armas Leves/Médias/Pesadas, <PericiaLink nome="Atletismo" /> e <PericiaLink nome="Esquiva" /></td></tr>
              <tr><td><AttrLink nome="Espírito" /> (S)</td><td>Potência das magias, controle sobre feitiços, resistência mental</td><td>Bônus de dano das runas, resistência mental</td></tr>
              <tr><td><AttrLink nome="Percepção" /> (P)</td><td>Detecção de ameaças, percepção de detalhes, iniciativa</td><td>Influencia <PericiaLink nome="Prontidão" />, <PericiaLink nome="Furtividade" />, <PericiaLink nome="Sobrevivência" /> e testes de rastros</td></tr>
              <tr><td><AttrLink nome="Carisma" /> (C)</td><td>Persuasão, interação social, liderança</td><td>Influencia <PericiaLink nome="Lábia" />, <PericiaLink nome="Empatia" />, <PericiaLink nome="Afinidade Animal" /> e <PericiaLink nome="Artista" /></td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 id="xp-atributos">Experiência para Aumentar Atributos</h2>
        <p>Pontos de experiência necessários para subir o nível de um atributo (1 até 8):</p>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Nível do atributo</th><th>Experiência necessária</th></tr></thead>
            <tbody>
              <tr><td>1 → 2</td><td>50</td></tr>
              <tr><td>2 → 3</td><td>75</td></tr>
              <tr><td>3 → 4</td><td>100</td></tr>
              <tr><td>4 → 5</td><td>125</td></tr>
              <tr><td>5 → 6</td><td>150</td></tr>
              <tr><td>6 → 7</td><td>200</td></tr>
              <tr><td>7 → 8</td><td>250</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 id="vida">Definição de vida máxima</h2>
        <p>A energia vital (HP) representa a força vital que pulsa em cada personagem. Quando o HP chega a zero, o personagem morre.</p>
        <p><strong>Cálculo do HP total:</strong></p>
        <p className="regras-formula">5 × (nível de <AttrLink nome="Força" />) + 10 × (nível de <AttrLink nome="Vitalidade" />) + 1d10 + 10</p>
      </section>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 id="antecedentes">Antecedentes</h2>
        <p>Os antecedentes são pontos de <strong>background</strong> da história do seu personagem e oferecem vantagens (ou desvantagens que concedem pontos extras) para a ficha. Use os antecedentes para dar profundidade à história do personagem e para refletir no jogo as escolhas do passado.</p>
        <p><strong>Você tem 12 pontos no total</strong> para gastar em antecedentes positivos. Cada antecedente positivo tem um custo em pontos. Você pode <strong>aumentar esse total</strong> escolhendo antecedentes negativos: cada um concede pontos extras que podem ser usados para comprar mais antecedentes positivos. Regras importantes:</p>
        <ul>
          <li>É permitido ter <strong>no máximo 3 antecedentes negativos</strong>.</li>
          <li>Cada antecedente (positivo ou negativo) pode ser <strong>comprado apenas uma vez</strong> — não acumula.</li>
        </ul>
        <p>Para a lista completa de antecedentes, com custos, efeitos e descrições, consulte o guia:</p>
        <p><Link to="/guias/antecedentes">Guias → Antecedentes</Link></p>
      </section>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 id="pericias">Perícias</h2>
        <p>As perícias representam o domínio de habilidades específicas. Cada perícia está associada a um <Link to="#atributos">atributo</Link>: o personagem não pode ter mais pontos na perícia do que no atributo relacionado (ex.: para ter 4 de <PericiaLink nome="Esquiva" />, é necessário ter 4 de <AttrLink nome="Destreza" />).</p>
        <p><strong>No início do jogo o jogador tem 15 pontos</strong> para distribuir entre as perícias.</p>
        <p>Em determinados níveis, as perícias concedem efeitos especiais. Lista completa de perícias (com descrição e efeitos por nível):</p>
        <ul>
          <li><PericiaLink nome="Cutelaria" /> — <AttrLink nome="Destreza" /></li>
          <li><PericiaLink nome="Acuidade" /> — <AttrLink nome="Destreza" /></li>
          <li><PericiaLink nome="Execução" /> — <AttrLink nome="Força" /></li>
          <li><PericiaLink nome="Pontaria" /> — <AttrLink nome="Destreza" /></li>
          <li><PericiaLink nome="Briga" /> — <AttrLink nome="Destreza" /></li>
          <li><PericiaLink nome="Esquiva" /> — <AttrLink nome="Destreza" /></li>
          <li><PericiaLink nome="Resistência" /> — <AttrLink nome="Vitalidade" /></li>
          <li><PericiaLink nome="Arcanum" /> — <AttrLink nome="Espírito" /></li>
          <li><PericiaLink nome="Rúnico" /> — <AttrLink nome="Inteligência" /></li>
          <li><PericiaLink nome="Alquimia" /> — <AttrLink nome="Inteligência" /></li>
          <li><PericiaLink nome="Artista" /> — <AttrLink nome="Carisma" /></li>
          <li><PericiaLink nome="Furtividade" /> — <AttrLink nome="Destreza" /></li>
          <li><PericiaLink nome="Ofícios" /> — <AttrLink nome="Inteligência" /></li>
          <li><PericiaLink nome="Atletismo" /> — <AttrLink nome="Destreza" /></li>
          <li><PericiaLink nome="Sobrevivência" /> — <AttrLink nome="Percepção" /></li>
          <li><PericiaLink nome="Prontidão" /> — <AttrLink nome="Percepção" /></li>
          <li><PericiaLink nome="Empatia" /> — <AttrLink nome="Carisma" /></li>
          <li><PericiaLink nome="Lábia" /> — <AttrLink nome="Carisma" /></li>
          <li><PericiaLink nome="Condução" /> — <AttrLink nome="Inteligência" /></li>
          <li><PericiaLink nome="Cultura" /> — <AttrLink nome="Carisma" /></li>
          <li><PericiaLink nome="Idiomas" /> — <AttrLink nome="Inteligência" /></li>
          <li><PericiaLink nome="Ladinagem" /> — <AttrLink nome="Destreza" /></li>
          <li><PericiaLink nome="Mentalidade" /> — <AttrLink nome="Espírito" /></li>
          <li><PericiaLink nome="Afinidade Animal" /> — <AttrLink nome="Carisma" /></li>
        </ul>
      </section>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 id="xp-pericias">Experiência para Aumentar Perícias</h2>
        <p>Pontos de experiência necessários para subir o nível de uma perícia (1 até 8):</p>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Nível da perícia</th><th>Experiência necessária</th></tr></thead>
            <tbody>
              <tr><td>1 → 2</td><td>10</td></tr>
              <tr><td>2 → 3</td><td>20</td></tr>
              <tr><td>3 → 4</td><td>35</td></tr>
              <tr><td>4 → 5</td><td>50</td></tr>
              <tr><td>5 → 6</td><td>70</td></tr>
              <tr><td>6 → 7</td><td>90</td></tr>
              <tr><td>7 → 8</td><td>120</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>
        <Link to="/regras">← Voltar a Regras</Link>
      </p>
    </div>
  )
}
