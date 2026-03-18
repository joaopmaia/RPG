import { Link } from 'react-router-dom'

export default function RegrasMusicas() {
  return (
    <div className="regras-doc">
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/regras">← Regras</Link>
      </nav>
      <h1>Músicas no RPG</h1>

      <p>
        No mundo de Khonum, a música desempenha um papel essencial, como uma das formas de se utilizar a arcana. Nos ditados populares, se as runas são a escrita dos deuses, a música seria sua linguagem. Sendo assim, as músicas podem ser influenciadas pelo fluxo da arcana, influenciando combates, interações e até mesmo a relação com os demônios. Cada raça possui um instrumento musical, que pode evoluir desde canções básicas até poderosas músicas especiais.
      </p>
      <p>
        Quando em combate, existem <strong>3 efeitos possíveis de canções básicas</strong>, <strong>2 efeitos possíveis de canções avançadas</strong> e <strong>1 efeito único das canções especiais</strong> de cada raça. Fora de combate, cada raça tem apenas uma música com um efeito específico que pode ser utilizada — essa canção é chamada de <strong>canção do povo</strong>. <em>Obs.: você pode aprender dezenas de diferentes músicas; porém esses são os únicos efeitos possíveis. Independente de qual música estiver tocando, existir apenas 6 efeitos diferentes não significa que só existam 6 músicas diferentes.</em>
      </p>
      <p>
        O uso da música em combate é feito através de uma <strong>ação de combate</strong>. Para o efeito funcionar, o artista deve rolar um teste de <strong>Carisma + Empatia + 1d10</strong>, com a seguinte dificuldade e custo de Arcana:
      </p>
      <ul>
        <li><strong>Canções básicas:</strong> Dificuldade 12 e 4 de Arcana</li>
        <li><strong>Canções avançadas:</strong> Dificuldade 14 e 7 de Arcana</li>
        <li><strong>Canções especiais:</strong> Dificuldade 17 e 10 de Arcana</li>
      </ul>
      <p>
        O uso da música <strong>fora de combate</strong> sempre funcionará; a rolagem será usada para determinar o efeito (especificado para cada canção). Canções do povo não têm efeito em combate, e canções usadas em combate não têm efeito fora de combate. As canções do povo são aprendidas no momento em que você aprende a tocar um instrumento — por exemplo, ao aprender instrumentos de sopro, você já terá acesso à canção do povo dos Sylmari e Sharusahks.
      </p>
      <p>
        Todas as músicas só têm efeito no turno em que são cantadas e somente funcionam se o artista cantar <strong>antes das ações de quem será afetado</strong>. Se o artista for o último a agir no combate, sua música não terá efeito em ninguém. Ao tocar uma música, o artista deve escolher o <strong>alvo</strong> para o qual aquela música surtirá efeito; o efeito aplica-se apenas ao alvo escolhido.
      </p>

      <h2 id="sopro">Instrumentos de Sopro</h2>

      <h3>Sylmari</h3>
      <p><strong>Canção do Povo:</strong> Um ritmo tocado em locais públicos que sintoniza o artista com os segredos e murmúrios da comunidade. O informante se sentirá compelido a compartilhar o que sabe; o nível de detalhes e a veracidade da informação dependem de sua Empatia. Recebe alguma informação importante. A rolagem de sucesso de Empatia (Carisma + Empatia + 1d10) determina o valor do teste de Empatia do informante que se aproxima para resistir ao efeito.</p>
      <p><strong>Canções básicas:</strong></p>
      <ul>
        <li><strong>Canto da Casca Eterna:</strong> Um ritmo profundo e constante que tece uma proteção arcana, simulando a casca resistente de uma árvore. Reduz o dano de fontes arcanas (armadura natural) no alvo em 1d4 pontos neste turno.</li>
        <li><strong>Harmonia do Entalhe:</strong> Uma melodia precisa que afina o Espírito do alvo, otimizando seu foco. Concede um bônus de 1d6 na próxima rolagem para ativar uma Runa.</li>
        <li><strong>Eco da Tormenta:</strong> Uma sequência tensa que canaliza a fúria da tempestade em um vórtice arcano. Adiciona 1d4 de dano extra à próxima fonte de dano arcano que o alvo infligir.</li>
      </ul>
      <p><strong>Canções Avançadas:</strong></p>
      <ul>
        <li><strong>Balada da Seiva Viva:</strong> Um som leve e doce que inspira o alvo, como uma árvore que armazena sua energia. Reduz o custo de Arcana da próxima Runa do alvo em 1d4 pontos.</li>
        <li><strong>Sinfonia da Raiz Seca:</strong> Um som seco e rachado que cria atrito e resistência no fluxo de energia do alvo. Aumenta o custo de Arcana da próxima Runa do alvo em 1d4 pontos.</li>
      </ul>
      <p><strong>Canção Especial:</strong> Uma melodia vital que invoca a resiliência das florestas primordiais. O alvo regenera 1d6 de arcana (AP) imediatamente.</p>

      <h3>Sharusahk</h3>
      <p><strong>Canção do Povo:</strong> Uma canção vibrante e persuasiva que ressoa com o espírito do comércio justo e da hospitalidade. Comerciantes e donos de pousada se sentirão dispostos a oferecer um desconto generoso de 50%. Recebe 50% de desconto em Serviços de viagem e hospedagens. A rolagem de sucesso de Empatia (Carisma + Empatia + 1d10) determina o valor do teste de Empatia do comerciante para resistir ao efeito.</p>
      <p><strong>Canções básicas:</strong></p>
      <ul>
        <li><strong>Ritmo da Cimitarra:</strong> Um ritmo rápido e marcante que guia os golpes do alvo. Adiciona 1d4 de dano extra à próxima fonte de dano físico que o alvo infligir.</li>
        <li><strong>Marcha do Saqueador:</strong> Uma cadência tensa que foca a agressão do alvo. Adiciona um bônus de 1d4 à próxima rolagem de qualquer Ação de Combate.</li>
        <li><strong>Passo do Caravana:</strong> Uma melodia leve e incessante que energiza os músculos do alvo. Adiciona um bônus de 1d4 à próxima rolagem de qualquer Ação de Movimentação.</li>
      </ul>
      <p><strong>Canções Avançadas:</strong></p>
      <ul>
        <li><strong>Vento de Siroco:</strong> Uma melodia rápida como o vento do deserto. Concede ao alvo 1 Ação de Movimentação Extra para ser usada imediatamente neste turno.</li>
        <li><strong>Grito de Guerra:</strong> Uma canção estridente e breve que explode em adrenalina. Concede ao alvo 1 Ação de Combate Extra para ser usada imediatamente neste turno.</li>
      </ul>
      <p><strong>Canção Especial:</strong> Uma melodia etérea que manipula o tempo e a percepção do campo de batalha. No próximo turno, o artista ordena a ordem das ações no combate e faz com que todos aliados sejam os primeiros a agir. A ordem em que cada aliado agirá segue a ordem de maior para menor prontidão, assim como os inimigos.</p>

      <h2 id="corda">Instrumentos de Corda</h2>

      <h3>Drovenar</h3>
      <p><strong>Canção do Povo:</strong> Uma canção pesada e rítmica que honra o trabalho do artesão e a durabilidade do minério. Em locais públicos, comerciantes se sentirão dispostos a oferecer um desconto de 50% em equipamentos. A rolagem de sucesso de Empatia (Carisma + Empatia + 1d10) determina o valor do teste de Empatia do comerciante para resistir ao efeito.</p>
      <p><strong>Canções básicas:</strong></p>
      <ul>
        <li><strong>Forja de Ânimo:</strong> Uma melodia concentrada que aprimora o foco e a precisão das mãos. Adiciona 1d6 de bônus à próxima rolagem de qualquer teste de armas leves, médias, pesadas ou pontaria.</li>
        <li><strong>Resistência do Minério:</strong> Uma nota baixa e prolongada que infunde o alvo com a solidez da rocha. Reduz o dano de Durabilidade recebido pelo equipamento do alvo em 1d8 pontos neste turno.</li>
        <li><strong>Quebra-Pedra:</strong> Um ritmo agressivo e metálico que encontra as fissuras nos objetos. Aumenta o dano de Durabilidade infligido ao equipamento do alvo em 1d8 pontos.</li>
      </ul>
      <p><strong>Canções Avançadas:</strong></p>
      <ul>
        <li><strong>Toque de Precisão:</strong> Uma melodia de foco intenso que refina o resultado da ação. O próximo teste do alvo utiliza 2d6 ao invés de 1d10 na parte do dado. Uma falha crítica se dá caso você acerte 1 em ambos os dados; caso 1 dado vire 6, esse dado poderá ser rolado novamente (somando 6 ao valor do segundo resultado), como um acerto crítico; caso ambos dados rolem 6, você poderá usar esse efeito duas vezes. Esse efeito só pode acontecer uma única vez (caso você role dois 6 seguidos no mesmo dado, você somará 12 ao resultado da rolagem, sem rodar o dado uma terceira vez).</li>
        <li><strong>Toque de Azar:</strong> Uma sequência dissonante que perturba o cálculo e a sorte. O próximo teste do alvo utiliza 1d6 ao invés de 1d10 na parte do dado.</li>
      </ul>
      <p><strong>Canção Especial:</strong> Uma melodia animada reduz pela metade (arredondado para baixo) qualquer dano de durabilidade infligido aos equipamentos do alvo neste turno. Efeito passivo fora de combate especial: Permite ao artista (ou a quem o acompanha) navegar instintivamente pelos túneis subterrâneos das Montanhas de Salhazy.</p>

      <h3>Vaelthor</h3>
      <p><strong>Canção do Povo:</strong> Uma canção vibrante e cativante, perfeita para entretenimento público. A energia e a gratidão da audiência se manifestam em moedas. O valor da rolagem de Empatia determina o montante recebido em cobres.</p>
      <p><strong>Canções básicas:</strong></p>
      <ul>
        <li><strong>Sopro do Catalisador:</strong> Uma melodia vibrante que ressoa com a composição alquímica de um item. Adiciona 1d4 ao efeito de cura, dano ou bônus do próximo elixir consumido pelo alvo.</li>
        <li><strong>Canto do Fluxo Crescente:</strong> Uma ária suave que acelera a capacidade de recuperação do corpo. Aumenta a próxima cura (de qualquer fonte) recebida pelo alvo em 1d4.</li>
        <li><strong>Canção do Estagnado:</strong> Uma melodia desagradável que dificulta o fluxo de energia regenerativa. Reduz a próxima cura (de qualquer fonte) recebida pelo alvo em 1d4.</li>
      </ul>
      <p><strong>Canções Avançadas:</strong></p>
      <ul>
        <li><strong>Águas da Fortuna:</strong> Uma melodia que evoca a sorte e a fluidez do destino. O alvo alcança um Acerto Crítico em qualquer teste com uma rolagem de 9 (além do 10) no 1d10 neste turno.</li>
        <li><strong>Mares Turbulentos:</strong> Uma canção que força o destino a repensar seu julgamento. O alvo pode rerolar a Falha Crítica (rolagem de 1 no 1d10) em seu próximo teste. O segundo resultado deve ser aceito.</li>
      </ul>
      <p><strong>Canção Especial:</strong> Uma melodia vital e poderosa que invoca o poder regenerativo dos rios primordiais. Dobra o valor de qualquer cura recebida pelo alvo neste turno.</p>

      <h2 id="percussao">Instrumentos de Percussão</h2>

      <h3>Gorvash</h3>
      <p><strong>Canção do Povo:</strong> Um ritmo tribal e caótico que eleva a tensão no ambiente, transformando rixas em confrontos abertos. Dois personagens (geralmente os mais hostis) iniciam uma briga. Os dois instigadores da briga rolam Empatia contra a rolagem de Empatia do artista; se algum tiver sucesso, o artista será arrastado ou envolvido no conflito de alguma forma.</p>
      <p><strong>Canções básicas:</strong></p>
      <ul>
        <li><strong>Ritmo da Carapaça:</strong> Um toque lento e poderoso que simula a espessura da rocha. Reduz o dano de fontes físicas recebido pelo alvo em 1d4 pontos neste turno.</li>
        <li><strong>Batida do Desconcentro:</strong> Uma batida fora do ritmo que quebra a concentração do alvo. Aplica uma penalidade de 1d4 na próxima rolagem de qualquer Ação de Combate.</li>
        <li><strong>Toque da Lentidão:</strong> Um ritmo pesado e arrastado que torna os membros do alvo lentos e hesitantes. Aplica uma penalidade de 1d4 na próxima rolagem de qualquer Ação de Movimentação.</li>
      </ul>
      <p><strong>Canções Avançadas:</strong></p>
      <ul>
        <li><strong>Quebra-Ataque:</strong> Uma interrupção abrupta e ensurdecedora que desestabiliza a ação. O alvo deve fazer um teste de resistência contra a rolagem de Empatia. Se falhar, sua Ação de Combate é cancelada neste turno.</li>
        <li><strong>Toque Imóvel:</strong> Um toque de percussão baixo e vibrante que enraíza o alvo. O alvo deve fazer um teste de resistência contra a rolagem de Empatia. Se falhar, sua Ação de Movimentação é cancelada neste turno.</li>
      </ul>
      <p><strong>Canção Especial:</strong> Um ritmo massivo e inabalável que confere a solidez da montanha. Reduz pela metade (arredondado para baixo) qualquer dano físico recebido pelo alvo durante este turno.</p>

      <h3>Demoníaco</h3>
      <p><strong>Canção do Povo:</strong> Uma canção dissonante e perturbadora que evoca medo e ódio irracional na maioria dos ouvintes; no entanto, ela atrai um informante da Ordem dos Kronagar. A rolagem de Empatia (Carisma + Empatia + 1d10) se torna a dificuldade do teste de Empatia que o informante deve fazer para resistir ao efeito.</p>
      <p><strong>Canções básicas:</strong></p>
      <ul>
        <li><strong>Toque da Calmaria Profana:</strong> Um ritmo lento e hipnótico que impõe submissão ao demônio. O demônio alvo se torna passivo, impedindo-o de realizar qualquer ataque ou ação hostil neste turno.</li>
        <li><strong>Ritmo do Frenesi:</strong> Um ritmo caótico e acelerado que inflama a loucura. O demônio alvo entra em frenesi. Ele deve usar todas as suas ações para atacar o alvo mais próximo, aliado ou inimigo (escolha aleatória), e recebe +1 Ação de Combate.</li>
        <li><strong>Sussurro do Além:</strong> Uma sequência de toques estranhos que se infiltra na mente. O alvo deve fazer um teste de Mentalidade com a dificuldade sendo igual à rolagem de Empatia do cantor. Se falhar, sofre o status de Alucinação.</li>
      </ul>
      <p><strong>Canções Avançadas:</strong></p>
      <ul>
        <li><strong>Chamado do Inferno:</strong> Um ritmo poderoso e ressonante que rasga o véu entre os mundos. Um ou mais demônios são atraídos e chegam ao local.</li>
        <li><strong>Pulsação Fantasma:</strong> Uma batida quase inaudível que confere leveza e invisibilidade temporária. Concede um bônus de 1d8 ao próximo teste de Furtividade do alvo.</li>
      </ul>
      <p><strong>Canção Especial:</strong> Uma canção hipnótica que impõe a vontade do artista sobre um demônio (funciona somente em demônios). O alvo (demônio) deve fazer um teste de Carisma contra a rolagem de Empatia do artista. Se falhar, o demônio fica sob o controle total do artista neste turno.</p>

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/regras">← Voltar a Regras</Link>
        {' · '}
        <Link to="/musicas">Ver Músicas (filtros e lista)</Link>
      </p>
    </div>
  )
}
