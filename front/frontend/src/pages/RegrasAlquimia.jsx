import { Link } from 'react-router-dom'
import { PericiaLink } from '../components/RegrasLinks'

const EFETOS = [
  { efeito: 'Cura HP', veg: 'Comum (1d4)', ani: 'Incomum (1d6)', min: 'Raro (1d10)', dem: 'Épico (1d20)', desc: 'Restaura a vida (HP) instantaneamente.' },
  { efeito: 'Cura Arcana', veg: 'Incomum (1d4)', ani: 'Raro (1d6)', min: 'Épico (1d8)', dem: 'Lendário (1d12)', desc: 'Repõe a energia mágica (Arcana) no corpo.' },
  { efeito: 'Cura Queimadura', veg: 'Comum (Fixo)', ani: 'Incomum (Fixo)', min: 'Raro (Fixo)', dem: 'Épico (Fixo)', desc: 'Remove o status Queimadura.' },
  { efeito: 'Cura Envenenamento', veg: 'Comum (Fixo)', ani: 'Incomum (Fixo)', min: 'Raro (Fixo)', dem: 'Épico (Fixo)', desc: 'Remove o status Envenenamento.' },
  { efeito: 'Cura Congelamento', veg: 'Comum (Fixo)', ani: 'Incomum (Fixo)', min: 'Raro (Fixo)', dem: 'Épico (Fixo)', desc: 'Remove o status Congelamento.' },
  { efeito: 'Cura Paralisia', veg: 'Incomum (Fixo)', ani: 'Incomum (Fixo)', min: 'Raro (Fixo)', dem: 'Épico (Fixo)', desc: 'Remove o status Paralisia.' },
  { efeito: 'Cura Aflição', veg: 'Incomum (Fixo)', ani: 'Raro (Fixo)', min: 'Raro (Fixo)', dem: 'Épico (Fixo)', desc: 'Remove o status Aflição.' },
  { efeito: 'Cura Cansado', veg: 'Comum (Fixo)', ani: 'Incomum (Fixo)', min: 'Raro (Fixo)', dem: 'Épico (Fixo)', desc: 'Remove o status Cansado.' },
  { efeito: 'Cura Petrificado', veg: 'Raro (Fixo)', ani: 'Épico (Fixo)', min: 'Raro (Fixo)', dem: 'Lendário (Fixo)', desc: 'Remove o status Petrificado.' },
  { efeito: 'Cura Desolado', veg: 'Incomum (Fixo)', ani: 'Raro (Fixo)', min: 'Épico (Fixo)', dem: 'Lendário (Fixo)', desc: 'Remove o status mental Desolado.' },
  { efeito: 'Cura Confusão', veg: 'Incomum (Fixo)', ani: 'Raro (Fixo)', min: 'Épico (Fixo)', dem: 'Lendário (Fixo)', desc: 'Remove o status mental Confusão.' },
  { efeito: 'Cura Enfurecido', veg: 'Incomum (Fixo)', ani: 'Raro (Fixo)', min: 'Épico (Fixo)', dem: 'Lendário (Fixo)', desc: 'Remove o status mental Enfurecido.' },
  { efeito: 'Cura Doente', veg: 'Raro (Fixo)', ani: 'Raro (Fixo)', min: 'Épico (Fixo)', dem: 'Lendário (Fixo)', desc: 'Remove o status Doente.' },
  { efeito: 'Cura Ferido', veg: 'Raro (Fixo)', ani: 'Raro (Fixo)', min: 'Épico (Fixo)', dem: 'Lendário (Fixo)', desc: 'Trata ferimentos graves (status Ferido).' },
  { efeito: 'Causa Queimaduras', veg: 'Incomum (1)', ani: 'Incomum (2)', min: 'Raro (3)', dem: 'Épico (4)', desc: 'Aplica acúmulos de queimadura no alvo.' },
  { efeito: 'Causa Envenenar', veg: 'Comum (1d4)', ani: 'Incomum (1d6)', min: 'Raro (1d8)', dem: 'Épico (1d10)', desc: 'Causa dano de veneno por turno.' },
  { efeito: 'Causa Congelamento', veg: 'Raro (Dif: 12)', ani: 'Raro (Dif: 15)', min: 'Épico (Dif: 17)', dem: 'Lendário (Dif: 20)', desc: 'Dificuldade para o alvo não congelar.' },
  { efeito: 'Causa Paralisia', veg: 'Raro (Dif: 12)', ani: 'Raro (Dif: 15)', min: 'Épico (Dif: 17)', dem: 'Lendário (Dif: 20)', desc: 'Dificuldade para o alvo não paralisar.' },
  { efeito: 'Causa Aflição', veg: 'Raro (Dif: 12)', ani: 'Raro (Dif: 15)', min: 'Épico (Dif: 17)', dem: 'Lendário (Dif: 20)', desc: 'Dificuldade para o alvo não sofrer Aflição.' },
  { efeito: 'Causa Cansado', veg: 'Incomum (Dif: 10)', ani: 'Raro (Dif: 12)', min: 'Épico (Dif: 15)', dem: 'Lendário (Dif: 17)', desc: 'Dificuldade para o alvo não cansar.' },
  { efeito: 'Causa Petrificado', veg: 'Épico (Dif: 15)', ani: 'Lendário (Dif: 17)', min: 'Épico (Dif: 17)', dem: 'Lendário (Dif: 20)', desc: 'Dificuldade para o alvo não petrificar.' },
  { efeito: 'Causa Desolado', veg: 'Raro (Dif: 12)', ani: 'Raro (Dif: 15)', min: 'Épico (Dif: 17)', dem: 'Lendário (Dif: 20)', desc: 'Dificuldade do teste contra Desolação.' },
  { efeito: 'Causa Confusão', veg: 'Incomum (Dif: 10)', ani: 'Raro (Dif: 12)', min: 'Épico (Dif: 15)', dem: 'Lendário (Dif: 17)', desc: 'Dificuldade do teste contra Confusão.' },
  { efeito: 'Causa Enfurecido', veg: 'Incomum (Dif: 10)', ani: 'Raro (Dif: 12)', min: 'Épico (Dif: 15)', dem: 'Lendário (Dif: 17)', desc: 'Dificuldade do teste contra Fúria.' },
  { efeito: 'Causa Doente', veg: 'Raro (Dif: 12)', ani: 'Raro (Dif: 15)', min: 'Épico (Dif: 17)', dem: 'Lendário (Dif: 20)', desc: 'Dificuldade para o alvo não adoecer.' },
  { efeito: 'Causa Ferido', veg: 'Raro (Dif: 12)', ani: 'Raro (Dif: 15)', min: 'Épico (Dif: 17)', dem: 'Lendário (Dif: 20)', desc: 'Dificuldade para o alvo não ser Ferido.' },
  { efeito: 'Bomba de Fumaça', veg: 'Comum (3m)', ani: '-', min: 'Raro (6m)', dem: '-', desc: 'Área afetada pela cortina de fumaça.' },
  { efeito: 'Explosivo', veg: '-', ani: '-', min: 'Raro (1d10)', dem: 'Lendário (2d10)', desc: 'Dano explosivo causado em área.' },
  { efeito: "Respirar n'água", veg: 'Raro (1 Cena)', ani: 'Incomum (1 Hora)', min: '-', dem: '-', desc: 'Tempo de duração do efeito subaquático.' },
  { efeito: 'Repelir Demônios', veg: 'Épico (5m)', ani: '-', min: '-', dem: 'Raro (10m)', desc: 'Área de afastamento de demônios.' },
  { efeito: 'Atrair Demônios', veg: 'Épico (5m)', ani: '-', min: '-', dem: 'Raro (10m)', desc: 'Área de atração de demônios.' },
  { efeito: 'Dano de Armas', veg: '-', ani: '-', min: 'Raro (+2)', dem: 'Épico (+4)', desc: 'Aumento fixo no dano da arma.' },
  { efeito: 'Resistência Calor', veg: 'Incomum (Fixo)', ani: '-', min: 'Raro (Fixo)', dem: '-', desc: 'Proteção contra calor/fogo.' },
  { efeito: 'Resistência Frio', veg: 'Incomum (Fixo)', ani: '-', min: 'Raro (Fixo)', dem: '-', desc: 'Proteção contra frio/gelo.' },
  { efeito: 'Modificar Atributo', veg: '-', ani: 'Raro (1)', min: '-', dem: 'Lendário (2)', desc: 'Aplica bônus ou penalidade (1 ou 2).' },
  { efeito: 'Restaurar Durab.', veg: '-', ani: '-', min: 'Raro (1d8)', dem: '-', desc: 'Quantidade de durabilidade recuperada.' },
  { efeito: 'Status Mental Aleat.', veg: 'Incomum (1)', ani: 'Raro (2)', min: 'Épico (3)', dem: 'Lendário (4)', desc: 'Quantidade de status mentais curados.' },
  { efeito: 'Pílula Arcana', veg: '-', ani: '-', min: 'Épico (-1)', dem: 'Lendário (-2)', desc: 'Redução no custo de Arcana para Runas.' },
]

export default function RegrasAlquimia() {
  return (
    <div className="regras-doc">
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/regras">← Regras</Link>
      </nav>
      <h1>Alquimia</h1>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p>Em Khonum, a Alquimia não é apenas a mistura de líquidos, mas a estabilização de energias contidas na matéria bruta. Os alquimistas classificam os seus produtos em três categorias principais: <strong>Poções e Elixires</strong> (consumíveis para benefício próprio), <strong>Venenos</strong> (aplicados em lâminas ou ingeridos por inimigos) e <strong>Compostos Voláteis</strong> (bombas e substâncias de suporte ambiental).</p>
        <p>O valor e a eficácia de um composto são determinados pela origem da sua matéria-prima. Cada material impõe uma <strong>Raridade</strong>, que dita o esforço necessário para a sua obtenção (<PericiaLink nome="Sobrevivência" />) e a perícia exigida para a sua manipulação (<PericiaLink nome="Alquimia" />). Além disso, a <strong>Potência</strong> de um efeito varia drasticamente se extraída de uma planta resiliente, de um órgão animal, de um cristal mineral ou da essência instável de um demónio.</p>
        <p style={{ marginBottom: 0 }}>Consulte a <Link to="/alquimia">lista de elixires</Link> (catálogo com filtros em <Link to="/equipamentos">Equipamentos</Link>) para os compostos disponíveis no jogo.</p>
      </section>

      <h2 id="efeitos" style={{ marginBottom: '0.75rem' }}>Efeitos</h2>
      <p style={{ marginBottom: '0.75rem' }}>A tabela abaixo indica, por efeito, a Raridade e a Potência (ou dificuldade) conforme a origem do material: Vegetal, Animal, Mineral ou Demoníaco.</p>
      <div className="card" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table>
          <thead>
            <tr>
              <th>Efeito</th>
              <th>Vegetal (Rar/Pot)</th>
              <th>Animal (Rar/Pot)</th>
              <th>Mineral (Rar/Pot)</th>
              <th>Demoníaco (Rar/Pot)</th>
              <th>Descrição</th>
            </tr>
          </thead>
          <tbody>
            {EFETOS.map((row, i) => (
              <tr key={i}>
                <td>{row.efeito}</td>
                <td>{row.veg}</td>
                <td>{row.ani}</td>
                <td>{row.min}</td>
                <td>{row.dem}</td>
                <td>{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="custo-mercado" style={{ marginBottom: '0.75rem' }}>Regras de Custo e Mercado</h2>
      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p>O valor de um elixir simples (contendo apenas um efeito) é derivado diretamente da categoria do material utilizado em sua fabricação. A unidade padrão de troca para o mercado alquímico é a <strong>Moeda de Bronze</strong>:</p>
        <ul>
          <li>Material Comum → Custo base: <strong>20</strong></li>
          <li>Material Incomum → Custo base: <strong>100</strong></li>
          <li>Material Raro → Custo base: <strong>500</strong></li>
          <li>Material Épico → Custo base: <strong>2500</strong></li>
          <li>Material Lendário → Custo base: <strong>10000</strong></li>
        </ul>
        <p>O <strong>refinamento</strong> é a técnica avançada de fundir múltiplos materiais e efeitos em um único frasco, permitindo que um usuário desfrute de diversas propriedades sem a necessidade de ingerir vários elixires.</p>
        <p>Devido à alta instabilidade de misturar essências distintas — como reagentes minerais com demoníacos —, o processo exige catalisadores caros e um controle absoluto da Arcana pelo alquimista. Consequentemente, o valor de um elixir refinado é substancialmente maior.</p>
        <p style={{ marginBottom: 0 }}><strong>O preço de um Elixir Refinado é a soma do custo base de todos os materiais que o compõem, multiplicada por 2.</strong></p>
      </section>

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/regras">← Voltar a Regras</Link>
      </p>
    </div>
  )
}
