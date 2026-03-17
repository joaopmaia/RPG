/**
 * Conteúdo das páginas de atributos (regras do livro).
 * slug -> { nome, sigla, descricao, exemplo, bonus }
 */
export const atributos = {
  forca: {
    nome: 'Força',
    sigla: 'F',
    descricao: 'A Força determina a potência física do seu personagem. Com uma Força alta, você será mais capaz de causar dano com armas físicas (como espadas, machados e martelos), também terá uma vida maior e conseguirá armazenar mais itens em seu inventário.',
    exemplo: 'Se um inimigo estiver tentando empurrar você para fora de um precipício e você precisar resistir, será necessário um teste de Força. Quanto maior sua Força, mais fácil será resistir ou até repelir o ataque.',
    bonus: [
      '+5 HP por nível',
      'Aumenta o dano físico com armas',
      'Aumenta a capacidade de carregamento de inventário em 1 ponto por nível',
    ],
  },
  vitalidade: {
    nome: 'Vitalidade',
    sigla: 'V',
    descricao: 'A Vitalidade representa sua saúde e resistência física. Esse atributo determina a quantidade de dano que seu personagem pode receber antes de cair e também sua capacidade de se recuperar após ferimentos. Quanto mais alta sua Vitalidade, mais forte será sua resistência a doenças, venenos e o cansaço. Em situações de combate, a Vitalidade pode te ajudar a resistir melhor a golpes pesados e a se regenerar mais rápido após ser ferido.',
    exemplo: 'Se você estiver em uma situação onde precisará resistir a um veneno ou a um feitiço que cause dano ao longo do tempo, será necessário um teste de Vitalidade. Personagens com alta Vitalidade têm muito mais chances de sobreviver a esses efeitos.',
    bonus: [
      '+10 HP por nível',
      'Aumenta a regeneração de HP em 10 por noite dormida (ver sessão de Hospedagens)',
      'Aumenta a capacidade de inventário em 1 ponto por nível',
    ],
  },
  inteligencia: {
    nome: 'Inteligência',
    sigla: 'I',
    descricao: 'A Inteligência afeta a capacidade do seu personagem de aprender, resolver problemas complexos e compreender algumas perícias como a alquimia ou outros conhecimentos. Com uma Inteligência alta, você será mais habilidoso em atividades que exigem raciocínio rápido e entendimento lógico, como decifrar enigmas ou resolver quebra-cabeças. Para arcanistas ou alquimistas, esse atributo é essencial, já que sua Inteligência determinará o quão bem você pode controlar e aprimorar suas runas ou criar elixires poderosos.',
    exemplo: 'Um exemplo de teste de Inteligência seria quando você tenta criar uma runa. Quanto maior sua Inteligência, mais fácil será usar essas runas.',
    bonus: ['Influencia perícias como Rúnicos, Alquimia, Cultura, Idiomas e Ofícios'],
  },
  destreza: {
    nome: 'Destreza',
    sigla: 'D',
    descricao: 'A Destreza é o atributo que mede a agilidade e a precisão do seu personagem. É essencial para aqueles que preferem um estilo de combate rápido, como o uso de arcos, flechas, ou até mesmo para se esquivar de ataques inimigos. Com uma Destreza alta, você será mais habilidoso em desviar de ataques, realizar manobras acrobáticas e atacar com armas leves e rápidas.',
    exemplo: 'Se você for surpreendido por um inimigo em um combate e precisar desviar de um ataque, um teste de Destreza determinará se você consegue escapar sem se ferir. Quanto mais alta sua Destreza, melhor será sua capacidade de escapar de situações perigosas.',
    bonus: ['Influencia perícias como Armas Leves, Médias, Pesadas, Atletismo e Esquiva'],
  },
  espirito: {
    nome: 'Espírito',
    sigla: 'S',
    descricao: 'O Espírito reflete a conexão do seu personagem com o mundo espiritual e sua habilidade em runas. Esse atributo é fundamental para arcanistas e qualquer personagem que dependa de energia arcana para lançar runas poderosas. Com um Espírito alto, seu personagem será capaz de lançar runas com mais eficácia, aumentando seu dano. Além disso, Espírito determina sua resistência a efeitos mentais.',
    exemplo: 'Se você estiver em combate e usar uma runa para atacar, o Espírito será o principal responsável por determinar a força desse feitiço. Quanto maior o seu Espírito, maior será o impacto de suas runas.',
    bonus: [
      'Aumenta o dano arcano',
      'Aumenta resistência a efeitos mentais',
    ],
  },
  percepcao: {
    nome: 'Percepção',
    sigla: 'P',
    descricao: 'A Percepção mede a habilidade do seu personagem em perceber o ambiente ao seu redor. Personagens com uma Percepção alta têm vantagem em detectar coisas que os outros não perceberiam, como armadilhas, inimigos escondidos ou detalhes importantes no cenário. A Percepção também é útil para identificar rastros, seguir pistas e ter vantagem em situações furtivas.',
    exemplo: 'Imagine que você está caminhando por uma floresta e precisa perceber se há algum inimigo à espreita. Um teste de Percepção ajudará você a identificar qualquer movimento suspeito, permitindo que você aja com mais inteligência e cautela.',
    bonus: ['Influencia perícias como Prontidão, Furtividade, Sobrevivência e testes de rastros'],
  },
  carisma: {
    nome: 'Carisma',
    sigla: 'C',
    descricao: 'O Carisma está relacionado com o poder de persuasão, liderança e interação social do seu personagem. Um personagem carismático pode convencer outros a seguir suas ordens, influenciar suas decisões e até persuadir inimigos a cooperar. Esse atributo é essencial para aqueles que preferem resolver problemas com palavras e não com a espada, além de ser importante em interações sociais, negociações e para liderar um grupo de aventureiros.',
    exemplo: 'Se você estiver tentando negociar com um mercador ou convencer um NPC a te ajudar em uma missão, o Carisma será a chave. Quanto maior o seu Carisma, mais fácil será influenciar aqueles ao seu redor.',
    bonus: ['Influencia perícias como Lábia, Empatia, Afinidade Animal e Artista'],
  },
}

export const atributoSlugByNome = {
  'Força': 'forca',
  'Vitalidade': 'vitalidade',
  'Inteligência': 'inteligencia',
  'Destreza': 'destreza',
  'Espírito': 'espirito',
  'Percepção': 'percepcao',
  'Carisma': 'carisma',
}
