import { Link } from 'react-router-dom'
import { AttrLink, PericiaLink } from '../components/RegrasLinks'

export default function RegrasSistemaCombate() {
  return (
    <div className="regras-doc">
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/regras">← Regras</Link>
      </nav>
      <h1>Sistema de Combate</h1>
      <p style={{ color: 'var(--parchment-dark)', marginBottom: '1.5rem' }}>
        O combate em Khonum é uma dança mortal, onde a estratégia, a habilidade e a sorte se entrelaçam em um balé de aço e magia.
      </p>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 id="iniciativa" style={{ marginTop: 0 }}>Iniciativa: O Primeiro Passo na Batalha</h2>
        <p>No início de cada combate, todos os participantes rolam iniciativa para determinar a ordem de ação.</p>
        <p><strong>Rolagem:</strong> 1d10 + <AttrLink nome="Percepção" /> + <PericiaLink nome="Prontidão" />.</p>
        <p style={{ marginBottom: 0 }}><strong>Ordem:</strong> Os participantes agem em ordem decrescente de iniciativa.</p>
      </section>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 id="rodadas-turnos" style={{ marginTop: 0 }}>Rodadas e Turnos: O Fluxo da Batalha</h2>
        <p>O combate é dividido em rodadas, cada uma composta por turnos. Em seu turno, um personagem pode realizar as seguintes ações:</p>
        <ul>
          <li><strong>Ação de Movimento:</strong> Movimentar-se, escalar, nadar, esquivar. (1 por turno; habilidades podem aumentar)</li>
          <li><strong>Ação de Combate:</strong> Atacar, usar habilidades, usar runas, defender, usar elixires. (1 por turno; habilidades podem aumentar)</li>
          <li><strong>Ação de Fala:</strong> Comunicar-se, provocar, intimidar, cantar. (1 por turno; habilidades podem aumentar)</li>
        </ul>
      </section>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 id="acao-movimento" style={{ marginTop: 0 }}>Ação de Movimento</h2>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          <li>Permite ao personagem mover-se pelo campo de batalha.</li>
          <li>A <PericiaLink nome="Esquiva" /> é uma ação de movimento especial que permite evitar ataques.</li>
          <li>Um personagem que esquiva não pode se mover durante o restante do turno.</li>
          <li>Um personagem que se move não pode esquivar durante o restante do turno.</li>
          <li>Habilidades especiais podem alterar essas restrições.</li>
        </ul>
      </section>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 id="acao-combate" style={{ marginTop: 0 }}>Ação de Combate</h2>
        <p><strong>Ataques:</strong> Rolagem de 1d10 + <AttrLink nome="Destreza" /> + Perícia (arma).</p>
        <p><strong>Defesa:</strong></p>
        <ul>
          <li><strong>Aparar:</strong> Rolagem de 1d10 + Destreza + Perícia (arma).</li>
          <li><strong>Escudo:</strong> Rolagem de 1d10 + Destreza + Perícia (escudo) + Defesa do Escudo.</li>
        </ul>
        <p><strong>Acerto:</strong> A rolagem de ataque deve ser maior que a rolagem de defesa. Defender com o escudo ou aparar com sua arma faz com que você não perca sua ação de movimento. Defender com escudo ou aparar não remove sua ação de combate; você só perde a ação de combate ao defender quando defende <em>outra pessoa</em> que não a si mesmo.</p>
        <p>Danos sobressalentes à durabilidade restante do escudo ou armadura são direcionados para o HP do personagem atacado (ex.: escudo com 1 de durabilidade recebendo 10 de dano — quebra e os 9 restantes vão para o HP).</p>
        <p><strong>Dano:</strong> Força do personagem + dano da arma.</p>
        <p><strong>Runas:</strong> Podem ser utilizadas como ação de combate, gastando energia arcana.</p>
        <p><strong>Poções e elixires:</strong> Podem ser usadas como ação de combate; você só pode usar elixires em você mesmo. Entregar o elixir a um aliado também conta como ação de combate.</p>
      </section>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 id="acao-fala" style={{ marginTop: 0 }}>Ação de Fala</h2>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          <li>Permite a comunicação entre os personagens.</li>
          <li>Pode ser usada para provocar inimigos ou intimidá-los.</li>
          <li>Pode ser usada para dar comandos a companheiros (companheiro animal ou ser conjurado por runas).</li>
          <li>Podem ser usadas fora de turno; porém, quando chegar seu turno, você não terá mais uma ação de fala.</li>
          <li><strong>Bardo:</strong> Bardos podem utilizar, a partir de determinado nível de <PericiaLink nome="Artista" />, essa ação para cantar e ativar o efeito da música.</li>
        </ul>
      </section>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 id="defesa-detalhada" style={{ marginTop: 0 }}>Defesa Detalhada</h2>
        <p><strong>Aparar:</strong> Usar a arma para desviar um ataque. Sempre causa dano na arma, equivalente ao dano que o jogador receberia em sua durabilidade.</p>
        <p><strong>Escudo:</strong> Usar um escudo para bloquear um ataque. Fornece bônus de defesa com base no tipo de escudo. Escudos têm um valor de defesa (rolagem similar ao dano de uma arma) que define o máximo de dano mitigado. O escudo recebe apenas 50% do dano recebido em durabilidade.</p>
        <p><strong>Esquiva:</strong> Mover-se rapidamente para evitar um ataque. Requer agilidade e reflexos rápidos.</p>
        <p><strong>Armadura:</strong> Armaduras têm um valor estático de defesa (máximo de dano mitigado). Ex.: armadura de defesa 3 recebendo ataque de 10 — o jogador recebe 7 de dano; a armadura recebe 50% do dano total em sua durabilidade (no exemplo, 5 de dano).</p>
      </section>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 id="dano-pv" style={{ marginTop: 0 }}>Dano e Pontos de Vida</h2>
        <p>O dano é calculado somando a <AttrLink nome="Força" /> do personagem ao dano da arma.</p>
        <p>Os pontos de vida (PV) representam a saúde do personagem. Quando os PV chegam a zero, o personagem fica inconsciente ou morre após 3 turnos inconsciente sem cura.</p>
      </section>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 id="condicoes" style={{ marginTop: 0 }}>Condições de Combate</h2>
        <p style={{ marginBottom: 0 }}>Condições como envenenado, paralisado e cego podem afetar o desempenho do personagem e adicionar modificadores negativos ou positivos a alguns testes. Consulte a regra de <Link to="/regras/status">Status</Link> para detalhes.</p>
      </section>

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/regras">← Voltar a Regras</Link>
      </p>
    </div>
  )
}
