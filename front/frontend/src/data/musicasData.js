/**
 * Dados das músicas por instrumento e raça (para a página Músicas).
 * Instrumentos: sopro, corda, percussão.
 */

export const INSTRUMENTOS = [
  { id: 'sopro', label: 'Instrumentos de Sopro', raças: ['Sylmari', 'Sharusahk'] },
  { id: 'corda', label: 'Instrumentos de Corda', raças: ['Drovenar', 'Vaelthor'] },
  { id: 'percussao', label: 'Instrumentos de Percussão', raças: ['Gorvash', 'Demoníaco'] },
]

export const MUSICAS_POR_RACA = {
  Sylmari: {
    instrumento: 'sopro',
    cancaoDoPovo: {
      nome: 'Canção do Povo',
      efeito: 'Um ritmo tocado em locais públicos que sintoniza o artista com os segredos e murmúrios da comunidade. O informante se sentirá compelido a compartilhar o que sabe; o nível de detalhes e a veracidade da informação dependem de sua Empatia. Recebe alguma informação importante. A rolagem de sucesso de Empatia (Carisma + Empatia + 1d10) determina o valor do teste de Empatia do informante que se aproxima para resistir ao efeito.',
    },
    basicas: [
      { nome: 'Canto da Casca Eterna', efeito: 'Um ritmo profundo e constante que tece uma proteção arcana, simulando a casca resistente de uma árvore. Reduz o dano de fontes arcanas (armadura natural) no alvo em 1d4 pontos neste turno.' },
      { nome: 'Harmonia do Entalhe', efeito: 'Uma melodia precisa que afina o Espírito do alvo, otimizando seu foco. Concede um bônus de 1d6 na próxima rolagem para ativar uma Runa.' },
      { nome: 'Eco da Tormenta', efeito: 'Uma sequência tensa que canaliza a fúria da tempestade em um vórtice arcano. Adiciona 1d4 de dano extra à próxima fonte de dano arcano que o alvo infligir.' },
    ],
    avancadas: [
      { nome: 'Balada da Seiva Viva', efeito: 'Um som leve e doce que inspira o alvo, como uma árvore que armazena sua energia. Reduz o custo de Arcana da próxima Runa do alvo em 1d4 pontos.' },
      { nome: 'Sinfonia da Raiz Seca', efeito: 'Um som seco e rachado que cria atrito e resistência no fluxo de energia do alvo. Aumenta o custo de Arcana da próxima Runa do alvo em 1d4 pontos.' },
    ],
    especial: { nome: 'Canção Especial (Sylmari)', efeito: 'Uma melodia vital que invoca a resiliência das florestas primordiais. O alvo regenera 1d6 de arcana (AP) imediatamente.' },
  },
  Sharusahk: {
    instrumento: 'sopro',
    cancaoDoPovo: {
      nome: 'Canção do Povo',
      efeito: 'Uma canção vibrante e persuasiva que ressoa com o espírito do comércio justo e da hospitalidade. Comerciantes e donos de pousada se sentirão dispostos a oferecer um desconto generoso de 50%. Recebe 50% de desconto em Serviços de viagem e hospedagens. A rolagem de sucesso de Empatia (Carisma + Empatia + 1d10) determina o valor do teste de Empatia do comerciante para resistir ao efeito.',
    },
    basicas: [
      { nome: 'Ritmo da Cimitarra', efeito: 'Um ritmo rápido e marcante que guia os golpes do alvo. Adiciona 1d4 de dano extra à próxima fonte de dano físico que o alvo infligir.' },
      { nome: 'Marcha do Saqueador', efeito: 'Uma cadência tensa que foca a agressão do alvo. Adiciona um bônus de 1d4 à próxima rolagem de qualquer Ação de Combate.' },
      { nome: 'Passo do Caravana', efeito: 'Uma melodia leve e incessante que energiza os músculos do alvo. Adiciona um bônus de 1d4 à próxima rolagem de qualquer Ação de Movimentação.' },
    ],
    avancadas: [
      { nome: 'Vento de Siroco', efeito: 'Uma melodia rápida como o vento do deserto. Concede ao alvo 1 Ação de Movimentação Extra para ser usada imediatamente neste turno.' },
      { nome: 'Grito de Guerra', efeito: 'Uma canção estridente e breve que explode em adrenalina. Concede ao alvo 1 Ação de Combate Extra para ser usada imediatamente neste turno.' },
    ],
    especial: { nome: 'Canção Especial (Sharusahk)', efeito: 'Uma melodia etérea que manipula o tempo e a percepção do campo de batalha. No próximo turno, o artista ordena a ordem das ações no combate e faz com que todos aliados sejam os primeiros a agir. A ordem em que cada aliado agirá segue a ordem de maior para menor prontidão, assim como os inimigos.' },
  },
  Drovenar: {
    instrumento: 'corda',
    cancaoDoPovo: {
      nome: 'Canção do Povo',
      efeito: 'Uma canção pesada e rítmica que honra o trabalho do artesão e a durabilidade do minério. Em locais públicos, comerciantes se sentirão dispostos a oferecer um desconto de 50% em equipamentos. A rolagem de sucesso de Empatia (Carisma + Empatia + 1d10) determina o valor do teste de Empatia do comerciante para resistir ao efeito.',
    },
    basicas: [
      { nome: 'Forja de Ânimo', efeito: 'Uma melodia concentrada que aprimora o foco e a precisão das mãos. Adiciona 1d6 de bônus à próxima rolagem de qualquer teste de armas leves, médias, pesadas ou pontaria.' },
      { nome: 'Resistência do Minério', efeito: 'Uma nota baixa e prolongada que infunde o alvo com a solidez da rocha. Reduz o dano de Durabilidade recebido pelo equipamento do alvo em 1d8 pontos neste turno.' },
      { nome: 'Quebra-Pedra', efeito: 'Um ritmo agressivo e metálico que encontra as fissuras nos objetos. Aumenta o dano de Durabilidade infligido ao equipamento do alvo em 1d8 pontos.' },
    ],
    avancadas: [
      { nome: 'Toque de Precisão', efeito: 'Uma melodia de foco intenso que refina o resultado da ação. O próximo teste do alvo utiliza 2d6 ao invés de 1d10 na parte do dado. Uma falha crítica se dá caso você acerte 1 em ambos os dados; caso 1 dado vire 6, esse dado poderá ser rolado novamente (somando 6 ao valor do segundo resultado), como um acerto crítico; caso ambos dados rolem 6, você poderá usar esse efeito duas vezes. Esse efeito só pode acontecer uma única vez (caso você role dois 6 seguidos no mesmo dado, você somará 12 ao resultado da rolagem, sem rodar o dado uma terceira vez).' },
      { nome: 'Toque de Azar', efeito: 'Uma sequência dissonante que perturba o cálculo e a sorte. O próximo teste do alvo utiliza 1d6 ao invés de 1d10 na parte do dado.' },
    ],
    especial: { nome: 'Canção Especial (Drovenar)', efeito: 'Uma melodia animada reduz pela metade (arredondado para baixo) qualquer dano de durabilidade infligido aos equipamentos do alvo neste turno. Efeito passivo fora de combate especial: Permite ao artista (ou a quem o acompanha) navegar instintivamente pelos túneis subterrâneos das Montanhas de Salhazy.' },
  },
  Vaelthor: {
    instrumento: 'corda',
    cancaoDoPovo: {
      nome: 'Canção do Povo',
      efeito: 'Uma canção vibrante e cativante, perfeita para entretenimento público. A energia e a gratidão da audiência se manifestam em moedas. O valor da rolagem de Empatia determina o montante recebido em cobres.',
    },
    basicas: [
      { nome: 'Sopro do Catalisador', efeito: 'Uma melodia vibrante que ressoa com a composição alquímica de um item. Adiciona 1d4 ao efeito de cura, dano ou bônus do próximo elixir consumido pelo alvo.' },
      { nome: 'Canto do Fluxo Crescente', efeito: 'Uma ária suave que acelera a capacidade de recuperação do corpo. Aumenta a próxima cura (de qualquer fonte) recebida pelo alvo em 1d4.' },
      { nome: 'Canção do Estagnado', efeito: 'Uma melodia desagradável que dificulta o fluxo de energia regenerativa. Reduz a próxima cura (de qualquer fonte) recebida pelo alvo em 1d4.' },
    ],
    avancadas: [
      { nome: 'Águas da Fortuna', efeito: 'Uma melodia que evoca a sorte e a fluidez do destino. O alvo alcança um Acerto Crítico em qualquer teste com uma rolagem de 9 (além do 10) no 1d10 neste turno.' },
      { nome: 'Mares Turbulentos', efeito: 'Uma canção que força o destino a repensar seu julgamento. O alvo pode rerolar a Falha Crítica (rolagem de 1 no 1d10) em seu próximo teste. O segundo resultado deve ser aceito.' },
    ],
    especial: { nome: 'Canção Especial (Vaelthor)', efeito: 'Uma melodia vital e poderosa que invoca o poder regenerativo dos rios primordiais. Dobra o valor de qualquer cura recebida pelo alvo neste turno.' },
  },
  Gorvash: {
    instrumento: 'percussao',
    cancaoDoPovo: {
      nome: 'Canção do Povo',
      efeito: 'Um ritmo tribal e caótico que eleva a tensão no ambiente, transformando rixas em confrontos abertos. Dois personagens (geralmente os mais hostis) iniciam uma briga. Os dois instigadores da briga rolam Empatia contra a rolagem de Empatia do artista; se algum tiver sucesso, o artista será arrastado ou envolvido no conflito de alguma forma.',
    },
    basicas: [
      { nome: 'Ritmo da Carapaça', efeito: 'Um toque lento e poderoso que simula a espessura da rocha. Reduz o dano de fontes físicas recebido pelo alvo em 1d4 pontos neste turno.' },
      { nome: 'Batida do Desconcentro', efeito: 'Uma batida fora do ritmo que quebra a concentração do alvo. Aplica uma penalidade de 1d4 na próxima rolagem de qualquer Ação de Combate.' },
      { nome: 'Toque da Lentidão', efeito: 'Um ritmo pesado e arrastado que torna os membros do alvo lentos e hesitantes. Aplica uma penalidade de 1d4 na próxima rolagem de qualquer Ação de Movimentação.' },
    ],
    avancadas: [
      { nome: 'Quebra-Ataque', efeito: 'Uma interrupção abrupta e ensurdecedora que desestabiliza a ação. O alvo deve fazer um teste de resistência contra a rolagem de Empatia. Se falhar, sua Ação de Combate é cancelada neste turno.' },
      { nome: 'Toque Imóvel', efeito: 'Um toque de percussão baixo e vibrante que enraíza o alvo. O alvo deve fazer um teste de resistência contra a rolagem de Empatia. Se falhar, sua Ação de Movimentação é cancelada neste turno.' },
    ],
    especial: { nome: 'Canção Especial (Gorvash)', efeito: 'Um ritmo massivo e inabalável que confere a solidez da montanha. Reduz pela metade (arredondado para baixo) qualquer dano físico recebido pelo alvo durante este turno.' },
  },
  'Demoníaco': {
    instrumento: 'percussao',
    cancaoDoPovo: {
      nome: 'Canção do Povo',
      efeito: 'Uma canção dissonante e perturbadora que evoca medo e ódio irracional na maioria dos ouvintes; no entanto, ela atrai um informante da Ordem dos Kronagar. A rolagem de Empatia (Carisma + Empatia + 1d10) se torna a dificuldade do teste de Empatia que o informante deve fazer para resistir ao efeito.',
    },
    basicas: [
      { nome: 'Toque da Calmaria Profana', efeito: 'Um ritmo lento e hipnótico que impõe submissão ao demônio. O demônio alvo se torna passivo, impedindo-o de realizar qualquer ataque ou ação hostil neste turno.' },
      { nome: 'Ritmo do Frenesi', efeito: 'Um ritmo caótico e acelerado que inflama a loucura. O demônio alvo entra em frenesi. Ele deve usar todas as suas ações para atacar o alvo mais próximo, aliado ou inimigo (escolha aleatória), e recebe +1 Ação de Combate.' },
      { nome: 'Sussurro do Além', efeito: 'Uma sequência de toques estranhos que se infiltra na mente. O alvo deve fazer um teste de Mentalidade com a dificuldade sendo igual à rolagem de Empatia do cantor. Se falhar, sofre o status de Alucinação.' },
    ],
    avancadas: [
      { nome: 'Chamado do Inferno', efeito: 'Um ritmo poderoso e ressonante que rasga o véu entre os mundos. Um ou mais demônios são atraídos e chegam ao local.' },
      { nome: 'Pulsação Fantasma', efeito: 'Uma batida quase inaudível que confere leveza e invisibilidade temporária. Concede um bônus de 1d8 ao próximo teste de Furtividade do alvo.' },
    ],
    especial: { nome: 'Canção Especial (Demoníaco)', efeito: 'Uma canção hipnótica que impõe a vontade do artista sobre um demônio (funciona somente em demônios). O alvo (demônio) deve fazer um teste de Carisma contra a rolagem de Empatia do artista. Se falhar, o demônio fica sob o controle total do artista neste turno.' },
  },
}
