import { Link } from 'react-router-dom'
import { AttrLink, PericiaLink } from '../components/RegrasLinks'

function StatusCard({ id, nome, tipo, children }) {
  return (
    <section id={id} className="card" style={{ marginBottom: '1.25rem' }}>
      <h2 style={{ marginTop: 0 }}>
        {nome}
        {tipo && <span style={{ fontWeight: 'normal', fontSize: '0.9rem', color: 'var(--parchment-dark)' }}> — {tipo}</span>}
      </h2>
      {children}
    </section>
  )
}

export default function RegrasStatus() {
  return (
    <div className="regras-doc">
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/regras">← Regras</Link>
      </nav>
      <h1>Status</h1>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p>Condições de status são efeitos ruins que podem ser causados tanto nos jogadores quanto nos inimigos. Enquanto as condições persistirem, os seus efeitos continuarão a ser executados no início do turno da pessoa com a condição referida, até que ela consiga superar um teste específico — na maioria das vezes um teste de <PericiaLink nome="Resistência" /> ou <PericiaLink nome="Mentalidade" />.</p>
        <p style={{ marginBottom: 0 }}>Além disso, algumas condições podem ser removidas por meio de itens utilizáveis e/ou runas, ou prevenidas totalmente por alguma habilidade ou equipamento que fornece resistência àquele tipo específico de condição.</p>
      </section>

      <h2 id="fisicos" style={{ marginBottom: '0.75rem' }}>Status físicos</h2>

      <StatusCard id="sangramento" nome="Sangramento" tipo="status físico">
        <p>Quando um personagem está sob esta condição, está sangrando bastante e pode morrer rapidamente se não for revertida. Em termos de jogabilidade, o personagem recebe <strong>1d4 de dano no início de cada turno</strong>, até conseguir estancar o sangramento.</p>
        <p>Múltiplos sangramentos acumulam o dano: 1d4 → 2d4 → 3d4 → 4d4 → 5d4 (máximo 5 acúmulos, total 5d4 por turno).</p>
        <p style={{ marginBottom: 0 }}><strong>Remoção:</strong> estancar o sangramento gasta uma Ação de Combate.</p>
      </StatusCard>

      <StatusCard id="queimaduras" nome="Queimaduras" tipo="status físico">
        <p>O personagem está, literalmente, em chamas (por runa de fogo, explosão, etc.). Recebe <strong>1d4 de dano do elemento fogo no final de cada turno</strong>. É possível acumular até 8 vezes.</p>
        <p style={{ marginBottom: 0 }}><strong>Remoção:</strong> remover 1 acúmulo de queimaduras gasta uma ação de movimentação.</p>
      </StatusCard>

      <StatusCard id="veneno" nome="Veneno" tipo="status físico">
        <p>Condição adversa com diversas origens: armas envenenadas, alimentos podres, gases tóxicos. Dependendo da força e qualidade do veneno, o personagem pode receber de <strong>1d4 até 1d20 de dano</strong> (ver tabela na sessão de <Link to="/regras/alquimia">Alquimia</Link>) e/ou status como Paralisia, Vômito, Irritação de pele, entre outros. O dano do veneno é aplicado no final do turno.</p>
      </StatusCard>

      <StatusCard id="congelamento" nome="Congelamento" tipo="status físico">
        <p>O personagem está congelado (com possibilidade de formação de neve e gelo no corpo). <strong>Perde todas as ações do turno</strong> até descongelar por si próprio ou até que alguém o descongele. Efeitos atmosféricos e de temperatura incidem sobre esta condição.</p>
        <p style={{ marginBottom: 0 }}><strong>Remoção:</strong> teste de <PericiaLink nome="Resistência" />; a dificuldade é definida pela origem do congelamento.</p>
      </StatusCard>

      <StatusCard id="derrubado" nome="Derrubado" tipo="status físico">
        <p>Condição de pouca duração: o personagem ou NPC cambaleou e caiu no chão, ficando brevemente impossibilitado de se movimentar.</p>
        <p style={{ marginBottom: 0 }}>Um personagem ou NPC derrubado <strong>perde sua Ação de Movimento para se levantar</strong>.</p>
      </StatusCard>

      <StatusCard id="atordoado" nome="Atordoado" tipo="status físico">
        <p>O personagem recebeu uma forte pancada na cabeça ou foi alvo de um pulso telecinético. <strong>O jogador perde um turno de combate.</strong> Geralmente o efeito cessa após a passagem de um turno do personagem atordoado; podem existir situações em que o jogador fique atordoado por mais de um turno.</p>
      </StatusCard>

      <StatusCard id="paralisia" nome="Paralisia" tipo="status físico">
        <p>Causada por venenos ou runas. O personagem ou NPC sob paralisia <strong>não pode realizar qualquer tipo de ação</strong>, ficando completamente catatônico.</p>
        <p style={{ marginBottom: 0 }}><strong>Remoção:</strong> teste de <PericiaLink nome="Resistência" />; a dificuldade é definida pela origem da paralisia.</p>
      </StatusCard>

      <StatusCard id="petrificado" nome="Petrificado" tipo="status físico">
        <p>Condição extremamente perigosa, geralmente por runa ou veneno poderoso. O alvo não pode fazer nada até a petrificação ser revertida. Personagens com esta condição <strong>não recebem dano direto</strong>, porém recebem uma <strong>armadura de 100 de HP</strong>: se o HP dessa armadura chegar a 0 antes do alvo ser despetrificado, ele é estilhaçado (morte instantânea). Se a origem não especificar o tempo, o personagem está petrificado por tempo indeterminado.</p>
      </StatusCard>

      <StatusCard id="imobilizacao" nome="Imobilização (parte do corpo)" tipo="status físico">
        <p style={{ marginBottom: 0 }}>O personagem não pode realizar ações com a parte do corpo que está imobilizada.</p>
      </StatusCard>

      <StatusCard id="ferido" nome="Ferido (parte do corpo)" tipo="status físico">
        <p style={{ marginBottom: 0 }}>O personagem perde <strong>10 × nível de machucado de HP total</strong> até remover o ferido. Existem 8 níveis totais de ferido.</p>
      </StatusCard>

      <StatusCard id="doente" nome="Doente" tipo="status físico">
        <p style={{ marginBottom: 0 }}>Personagem doente (vômito, febre, diarreia, alergia) tem uma <strong>penalidade de -1 a -3</strong> (conforme a intensidade da doença) para cada sintoma que estiver sentindo.</p>
      </StatusCard>

      <StatusCard id="fome-sede" nome="Fome e Sede" tipo="status físico">
        <p>Penalidade de <strong>-2 × nível de fome ou sede</strong>. Existem 5 níveis. No nível 5: além da penalidade, todo dia o personagem sofre <strong>50% do seu HP como dano por dia</strong>. Se o HP chegar a 1 nesse estado, o personagem não consegue se curar até saciar fome/sede.</p>
      </StatusCard>

      <h2 id="mentais" style={{ marginTop: '2rem', marginBottom: '0.75rem' }}>Status mentais</h2>

      <StatusCard id="aflição" nome="Aflição" tipo="status mental">
        <p>O personagem está desconfortável ou incomodado (decepção, notícia ruim, maus presságios, etc.). <strong>Penalidade de -1 em todos os testes</strong> até se livrar da causa. Personagens cansados são mais propensos a receber esta condição.</p>
        <p style={{ marginBottom: 0 }}><strong>Remoção:</strong> teste de <PericiaLink nome="Mentalidade" />; a dificuldade é definida pela origem da aflição.</p>
      </StatusCard>

      <StatusCard id="cansado" nome="Cansado" tipo="status mental e físico">
        <p>Esforço físico e/ou mental sem descanso adequado. Quanto mais tempo sem descansar, maior a chance. <strong>Penalidade de -2 em todos os testes.</strong></p>
        <p style={{ marginBottom: 0 }}><strong>Remoção:</strong> elixires, runas ou dormindo.</p>
      </StatusCard>

      <StatusCard id="desolado" nome="Desolado" tipo="status mental">
        <p>Versão aumentada da aflição. <strong>Penalidade de -3 em todos os testes</strong> (em vez de -1).</p>
        <p style={{ marginBottom: 0 }}><strong>Remoção:</strong> teste de <PericiaLink nome="Mentalidade" />; a dificuldade é definida pela origem do desolado.</p>
      </StatusCard>

      <StatusCard id="confusao" nome="Confusão" tipo="status mental">
        <p>O senso crítico do personagem está distorcido. Troca de atributos nos testes: Destreza ↔ Inteligência, Força ↔ Destreza, Inteligência ↔ Força, Vitalidade ↔ Espírito, Espírito ↔ Vitalidade. Além disso, <strong>penalidade de -5 em qualquer teste de Carisma</strong>.</p>
        <p style={{ marginBottom: 0 }}><strong>Remoção:</strong> teste de <PericiaLink nome="Mentalidade" />; a dificuldade é definida pela origem da confusão.</p>
      </StatusCard>

      <StatusCard id="enfurecido" nome="Enfurecido (Berserker)" tipo="status mental">
        <p>O personagem está sob fúria descontrolada, tomando atitudes agressivas com qualquer um que cruzar. <strong>Bônus de +3 em todos os ataques físicos.</strong> Em combate, a cada turno seu deve realizar teste de <PericiaLink nome="Mentalidade" /> para não realizar um ataque descontrolado ao personagem mais próximo.</p>
      </StatusCard>

      <StatusCard id="silenciado" nome="Silenciado" tipo="status mental">
        <p style={{ marginBottom: 0 }}>O personagem é incapaz de falar até perder o status.</p>
      </StatusCard>

      <StatusCard id="alucinacao" nome="Alucinação">
        <p>O personagem não distingue o real do imaginário. Para qualquer ação que realizar, deve rolar um teste de <AttrLink nome="Espírito" /> + <PericiaLink nome="Mentalidade" /> com dificuldade 17 (muito difícil). Se falhar, a ação falhará com um efeito diferente do esperado.</p>
      </StatusCard>

      <h2 id="outros" style={{ marginTop: '2rem', marginBottom: '0.75rem' }}>Outros</h2>

      <StatusCard id="maldicao" nome="Maldição">
        <p style={{ marginBottom: 0 }}>Status específico, com efeito específico; só pode ser removido de forma específica (definida pela origem da maldição).</p>
      </StatusCard>

      <StatusCard id="cegado" nome="Cegado">
        <p>O personagem não enxerga (efeito temporário ou permanente). <strong>Penalidade de -10</strong> em qualquer ação de combate ou movimentação.</p>
      </StatusCard>

      <StatusCard id="queda-livre" nome="Queda Livre">
        <p>O personagem está literalmente caindo. <strong>Não pode usar nenhuma ação de movimento</strong>; é possível usar ações de combate. No final da queda, toma dano conforme a altura (se maior que 3 m), podendo realizar um teste de <PericiaLink nome="Atletismo" /> para diminuir o dano em 50% (para alturas de até 10 m).</p>
        <div className="table-wrap" style={{ marginTop: '0.75rem' }}>
          <table>
            <thead>
              <tr><th>Altura</th><th>Dano</th></tr>
            </thead>
            <tbody>
              <tr><td>≥ 3 m e ≤ 5 m</td><td>2d4</td></tr>
              <tr><td>&gt; 5 m e ≤ 10 m</td><td>2d6</td></tr>
              <tr><td>&gt; 10 m e ≤ 15 m</td><td>5d6</td></tr>
              <tr><td>&gt; 15 m e ≤ 20 m</td><td>5d10</td></tr>
              <tr><td>&gt; 30 m</td><td>Morte</td></tr>
            </tbody>
          </table>
        </div>
      </StatusCard>

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/regras">← Voltar a Regras</Link>
      </p>
    </div>
  )
}
