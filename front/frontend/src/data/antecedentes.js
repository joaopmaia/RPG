/**
 * Antecedentes (background) para criação de ficha.
 * positivos: { id, nome, custo, efeito, descricao }
 * negativos: { id, nome, pontosExtras, efeito, descricao }
 */

export const introAntecedentes = `Os antecedentes são pontos de background da história do seu personagem e oferecem vantagens (ou desvantagens que dão pontos extras) para o seu personagem. Use seus antecedentes para criar a história do seu personagem.

Você tem 12 pontos no total. Você pode aumentar esse número com antecedentes negativos, que dão pontos extras. Você pode ter no máximo 3 antecedentes negativos e pode comprar um antecedente apenas uma vez (não acumula).`

export const positivos = [
  {
    id: 'mentor',
    nome: 'Mentor',
    custo: 4,
    efeito: 'Recebe permanentemente +2 pontos em uma Perícia de sua escolha.',
    descricao: 'Sua jornada não começou solitária. Durante anos, você esteve sob a tutela de alguém que já trilhou os caminhos que você agora começa a explorar. Seja um mestre de armas em uma academia militar, um sábio eremita nas montanhas ou um artesão habilidoso em uma metrópole, essa figura foi fundamental para moldar suas habilidades. Este mentor serviu exclusivamente como seu professor, transmitindo conhecimentos técnicos e segredos práticos que outros levariam décadas para descobrir sozinhos. O mentor não acompanha o personagem em sua jornada, nem interfere em seus objetivos; ele é uma figura do seu passado que lhe concedeu a base necessária para que você possa, hoje, dominar sua área de especialização com maestria superior.',
  },
  {
    id: 'dom-inato',
    nome: 'Dom Inato',
    custo: 10,
    efeito: 'O personagem possui um reservatório interno de Arcana. Seu valor máximo de AP é calculado pela soma: Nível de Espírito + Nível de Arcanum + 1d10. Diferente de indivíduos comuns, o personagem pode armazenar AP por tempo indeterminado em seu corpo.',
    descricao: 'Em Khonum, a maioria dos seres vivos é apenas um condutor temporário para a Arcana; como um cálice furado, eles perdem a energia se não a utilizarem imediatamente. Você, porém, nasceu com uma anomalia espiritual rara: um reservatório interno. Você possui a capacidade única de absorver e manter a Arcana dentro de si. Embora seu corpo não gere essa energia sozinho — sendo ainda necessário o uso de elixires, poções ou alguma outra forma para recarregar —, você não sofre a "evaporação arcana" que aflige os outros. Isso permite que você se prepare com antecedência, estocando energia para ativar runas poderosas em momentos onde outros estariam exaustos.',
  },
  {
    id: 'artefato',
    nome: 'Artefato',
    custo: 3,
    efeito: 'Você inicia o jogo com um Artefato Rúnico (Arma, Armadura, Escudo ou Item) cujo valor total de mercado não ultrapasse 70 Moedas de Prata.',
    descricao: 'Você não entra na aventura de mãos vazias. Em sua posse está um objeto que carrega a marca de uma matriz rúnica, uma peça de equipamento que sobreviveu a gerações ou que lhe foi confiada para uma missão específica. Este item pode ser uma relíquia de família, um presente de despedida ou o resultado de anos de economia.',
  },
  {
    id: 'fundo-monetario',
    nome: 'Fundo Monetário',
    custo: 1,
    efeito: 'O personagem inicia o jogo com 500 moedas de bronze (5 moedas de prata) adicionais.',
    descricao: 'Você guardou uma pequena reserva para sua viagem. Não é o suficiente para viver como um nobre, mas garante que você não passará fome nas primeiras semanas. Ideal para suprimentos, passagens em caravanas ou elixires de Arcana básicos.',
  },
  {
    id: 'reservas-de-prata',
    nome: 'Reservas de Prata',
    custo: 3,
    efeito: 'O personagem inicia o jogo com 5.000 moedas de bronze (50 moedas de prata).',
    descricao: 'Você pertence a uma camada privilegiada da sociedade de Khonum ou teve um sucesso financeiro extraordinário em seu passado. Este montante oferece flexibilidade para equipamentos Incomuns, Runas Intermediárias ou abrir portas que a força bruta não conseguiria.',
  },
  {
    id: 'heranca-familiar',
    nome: 'Herança Familiar',
    custo: 5,
    efeito: 'O personagem inicia o jogo com uma Arma Única de linhagem. Material: Raro (x15). Runa: Inicia com uma Runa Básica (x5). Vínculo de Sangue: +1 em testes de acerto e a arma só pode ser empunhada por você. Reservatório de Herança: A arma possui uma cavidade rúnica especial que armazena 1d10 de Arcana (AP). Esta Arcana deve ser carregada via elixires, mas não "evapora". Este AP só pode ser utilizado para alimentar Runas contidas nesta própria arma.',
    descricao: 'Esta arma é um milagre da engenharia rúnica antiga. Além de forjada em materiais raros, ela possui um núcleo de ressonância capaz de aprisionar a Arcana em seu interior. Sua herança familiar "bebe" a energia de elixires e a mantém latente na lâmina ou guarda.',
  },
  {
    id: 'genio',
    nome: 'Gênio',
    custo: 12,
    efeito: 'Você recebe permanentemente +2 pontos em um Atributo de sua escolha.',
    descricao: 'Você é uma anomalia biológica ou intelectual em Khonum. Enquanto outros precisam de décadas de treinamento e auxílio de runas para superarem seus limites, você nasceu com uma capacidade inata que desafia a média da sua espécie.',
  },
  {
    id: 'talentoso',
    nome: 'Talentoso',
    custo: 6,
    efeito: 'Você recebe permanentemente +1 ponto em um Atributo de sua escolha.',
    descricao: 'Você possui uma facilidade natural que o coloca um passo à frente da maioria. Onde outros precisam de esforço exaustivo apenas para alcançar a competência, você demonstra uma fluidez invejável.',
  },
  {
    id: 'contatos-submundo',
    nome: 'Contatos do Submundo',
    custo: 2,
    efeito: 'O personagem possui acesso garantido ao Mercado Negro em qualquer assentamento civilizado. O Mercado Negro permite encomendar qualquer item ou material específico dos manuais. O custo final é sempre 2x o valor de mercado.',
    descricao: 'Você conhece os sinais nas portas, os apertos de mão cifrados e os becos onde a lei não se atreve a entrar. Você pode conseguir exatamente o que precisa — desde um metal Raro específico até elixires proibidos — pagando o preço da pressa e da ilegalidade.',
  },
  {
    id: 'companheiro-animal',
    nome: 'Companheiro Animal',
    custo: 'Variável (3, 6 ou 9 pontos)',
    efeito: 'Você inicia a jornada com um aliado leal da fauna de Khonum. O animal é controlado narrativamente pelo Mestre e segue suas ordens. Comandar o animal exige uma Ação de Fala em seu turno; as rolagens (1d10) das ações do animal são realizadas pelo Jogador. HP do animal segue a mesma regra dos personagens. Categorias: Animal Pequeno (3 pts): 5 pts atributos, +3 em ação ou +1 e um efeito (1d4, dif. = rolagem do ataque); inventário FOR+VIT. Animal Grande (6 pts): 10 pts atributos, +4 ou +2 e efeito; inventário FOR+VIT+5. Animal Arcano (9 pts): 10 pts atributos, +4 ou +2 e efeito, 1 Runa Intermediária à escolha, AP = Espírito+4+1d10 (recupera naturalmente após noite de sono); inventário FOR+VIT+5.',
    descricao: 'A solidão das estradas de Khonum é mitigada pela presença de um aliado que não conhece a traição. Seja um pequeno predador, uma montaria colossal ou uma besta mística cujas veias brilham com energia Arcana, este animal é seu protetor e ferramenta.',
  },
  {
    id: 'mensageiro',
    nome: 'Mensageiro',
    custo: 2,
    efeito: 'Membro oficial da Guilda dos Mensageiros. Livre Trânsito: acesso livre a qualquer reino ou cidade com filial da guilda. Selo de Identificação: Carteira de Identificação Global reconhecida por autoridades. Contratos da Guilda: acesso ao quadro de missões exclusivo (escoltas, entregas, exploração; valores definidos pelo Mestre, entre 50 e 500 moedas de bronze).',
    descricao: 'A Guilda dos Mensageiros é a espinha dorsal da comunicação e exploração em Khonum. Ser um Mensageiro significa ser um andarilho respeitado; você cruza terras devastadas por demônios para entregar mensagens que podem impedir uma guerra ou salvar uma vila.',
  },
  {
    id: 'repelente-demoniaco',
    nome: 'Repelente Demoníaco Natural',
    custo: 4,
    efeito: 'Sua presença emite uma frequência Arcana ou odor imperceptível para humanos, mas repulsivo para demônios inferiores. Em lutas contra demônios comuns, o personagem será sempre o último a ser atacado, mesmo estando mais próximo. Não possui eficácia contra demônios superiores.',
    descricao: 'Existe algo em sua essência que as feras do abismo detestam. Enquanto seus companheiros são cercados, os demônios parecem hesitar em se aproximar de você. Ter esse dom é uma faca de dois gumes: você terá que carregar o peso de ver seus aliados sendo alvos constantes em seu lugar.',
  },
  {
    id: 'musico',
    nome: 'Músico',
    custo: 1,
    efeito: 'O personagem inicia o jogo com um instrumento musical de sua escolha, fabricado em material comum ou incomum.',
    descricao: 'Em um mundo onde o som das espadas e os rugidos dos demônios dominam o ambiente, você escolheu dominar a harmonia. Você carrega consigo um instrumento que é sua conexão com a civilização e a arte.',
  },
  {
    id: 'sortudo',
    nome: 'Sortudo',
    custo: 3,
    efeito: 'Uma vez por dia (ciclo de 24h no jogo), o personagem pode rolar novamente qualquer teste que tenha resultado em falha. Deve declarar o uso imediatamente após o resultado negativo; assume obrigatoriamente o resultado da nova rolagem. Aplicável a qualquer teste de atributo, perícia ou combate; limitado a uma utilização por dia.',
    descricao: 'Para você, o destino parece ter uma elasticidade incomum. Aquele golpe que deveria ter sido fatal acaba apenas raspando em sua armadura, ou aquela informação crucial surge em sua mente como um estalo de sorte.',
  },
  {
    id: 'influente',
    nome: 'Influente',
    custo: 1,
    efeito: 'O personagem possui livre acesso e trânsito garantido em um reino ou cidade-estado de sua escolha no início da campanha. Permite ignorar burocracias de entrada, circular por áreas restritas e ter facilidade em audiências com figuras de autoridade. Diferente do Mensageiro (identificação global), sua influência é baseada em contatos e reputação, funcionando apenas no território escolhido.',
    descricao: 'Em sua terra natal ou na região onde construiu sua carreira, seu nome carrega peso. As portas que se fecham para outros se abrem para você. No entanto, ser conhecido pelas autoridades significa que suas ações são vigiadas de perto.',
  },
  {
    id: 'abencoado',
    nome: 'Abençoado',
    custo: 7,
    efeito: 'Em qualquer rolagem de teste utilizando 1d10, o resultado 9 passa a ser considerado Acerto Crítico, recebendo todos os bônus e efeitos do 10. Este benefício é permanente e cumulativo com outras vantagens que não envolvam a margem de crítico.',
    descricao: 'Dizem que alguns nascem sob uma estrela guia. Existe uma harmonia visível entre suas ações e o fluxo da Arcana; seus golpes encontram as frestas das armaduras com frequência assustadora. Esse toque do destino atrai olhares de aliados e de entidades sombrias.',
  },
  {
    id: 'saude-de-ferro',
    nome: 'Saúde de Ferro',
    custo: 2,
    efeito: 'O personagem recebe um bônus permanente em HP Máximo de 2d10. A rolagem é feita na criação do personagem e o valor é somado ao total de vida. O bônus é fixo e não se altera com mudanças posteriores de atributos.',
    descricao: 'Enquanto outros adoecem com a friagem ou fraquejam após horas de marcha, você parece ser feito de um material mais resistente. Ferimentos que derrubariam um homem comum parecem apenas irritá-lo.',
  },
  {
    id: 'burro-de-carga',
    nome: 'Burro de Carga',
    custo: 2,
    efeito: 'O personagem recebe um aumento permanente de +5 espaços em seu inventário base, somado à capacidade de Força e Vitalidade.',
    descricao: 'Você possui resistência física e estrutura feitas para o trabalho pesado. Seu corpo se adaptou a suportar fardos que fariam as costas de outros aventureiros fraquejarem.',
  },
  {
    id: 'sentidos-aguçados',
    nome: 'Sentidos Aguçados',
    custo: 1,
    efeito: 'O personagem recebe um bônus de 1d4 em qualquer teste que envolva visão, olfato ou audição (percepção, rastreio, evitar emboscada).',
    descricao: 'Onde outros veem apenas sombras, você distingue formas. Seus olhos captam movimentos periféricos e seu olfato detecta sangue ou o odor de um demônio antes dele se revelar.',
  },
  {
    id: 'sono-leve',
    nome: 'Sono Leve',
    custo: 1,
    efeito: 'O personagem recebe um bônus de 1d4 em testes para perceber ou prevenir ataques, emboscadas ou furtos enquanto descansa em hospedagens, acampamentos ou estalagens.',
    descricao: 'Você nunca dorme verdadeiramente de forma profunda; o repouso é um estado de vigilância mais silencioso. O ranger de uma tábua ou o farfalhar de folhas são o suficiente para colocá-lo em prontidão instantânea.',
  },
  {
    id: 'coletor',
    nome: 'Coletor',
    custo: 1,
    efeito: 'O personagem recebe um bônus de 1d4 em todos os testes de extração de materiais, componentes ou partes de carcaças de animais e demônios.',
    descricao: 'Onde outros veem apenas o cadáver de uma fera, você enxerga uma fonte de recursos. Você possui conhecimento de anatomia e técnicas de corte que permitem extrair glândulas de veneno, couros intactos e fluidos arcanos com precisão.',
  },
  {
    id: 'atento',
    nome: 'Atento',
    custo: 1,
    efeito: 'O personagem recebe um bônus de 1d4 em qualquer teste de Prontidão para determinar a ordem de agir em combate ou para evitar surpresa.',
    descricao: 'Seu foco é como uma corda de arco constantemente retesada. Um deslocamento de ar, uma mudança no tom de voz ou o reflexo de uma lâmina oculta são sinais que você processa instantaneamente.',
  },
  {
    id: 'sono-profundo',
    nome: 'Sono Profundo',
    custo: 2,
    efeito: 'Ao dormir por uma noite, o personagem realiza a rolagem padrão de recuperação de vida e dobra o valor total de HP recebido. Recebe penalidade de -2 em testes para perceber/prevenir ataques, emboscadas ou furtos durante o descanso. Aplica-se apenas à recuperação natural; não influencia curas de elixires, poções ou runas. Não pode ser usado em conjunto com Sono Leve.',
    descricao: 'Quando você decide descansar, seu corpo entra em um estado de dormência tão absoluto que beira a inconsciência total. Uma noite de sono é um processo intensivo de reconstrução física; você acorda renovado e vigoroso.',
  },
]

export const negativos = [
  { id: 'perseguido-demonio', nome: 'Perseguido por Demônio', pontosExtras: 3, efeito: 'O personagem é marcado por uma entidade do abismo que o caça incansavelmente. Todas as noites, um demônio estará à sua espreita ou aguardando o momento em que a guarda for baixada.', descricao: 'Para você, a escuridão não traz repouso, apenas o som de garras arranhando o limite da sua visão. Existe um demônio específico, ou uma linhagem deles, que sente o cheiro da sua alma e nunca desiste da caçada.' },
  { id: 'perseguido-demonio-superior', nome: 'Perseguido por Demônio Superior', pontosExtras: 5, efeito: 'O personagem carrega uma marca de ódio de uma entidade de alto escalão do abismo. Todas as noites um Demônio Superior estará à sua caça. A presença desta entidade anula benefícios de descanso seguro (não é mais possível recuperar HP em acampamentos, mesmo dormindo).', descricao: 'Um senhor das sombras ou um general demoníaco fixou os olhos em você. Onde quer que você vá, a atmosfera se torna pesada quando a noite cai, sinalizando que o seu carrasco pessoal atravessou o véu para confrontá-lo.' },
  { id: 'perseguido-cacador', nome: 'Perseguido por Caçador', pontosExtras: 1, efeito: 'O personagem é alvo de uma busca incessante por parte de um indivíduo ou grupo que guarda rancor por suas ações passadas. O mestre introduz este perseguidor periodicamente através de sabotagens, rastreamento, espionagem ou tentativas de manchar a reputação. O caçador possui recursos e habilidades equivalentes ao personagem.', descricao: 'O maior perigo que você enfrenta não vem do abismo, mas do coração ferido de outro ser humano. Existe alguém lá fora que conhece seu rosto, seus hábitos e suas fraquezas.' },
  { id: 'criminoso', nome: 'Criminoso', pontosExtras: 1, efeito: 'O personagem possui histórico delituoso que o tornou alvo das autoridades em uma região ou reino. Cartazes de "Procurado", guardas que podem reconhecê-lo, dificuldade em interagir com lei ou nobreza. Se capturado: julgamento local, multas, confisco ou prisão. Não pode ser usado com Influente.', descricao: 'Os erros que você cometeu deixaram uma trilha de documentos e memórias amargas para os magistrados. Você é visto como um elemento perturbador da ordem pública.' },
  { id: 'relacoes-kronagar', nome: 'Relações com os Kronagar', pontosExtras: 3, efeito: 'O personagem ou sua linhagem possui vínculo histórico ou espiritual com a seita proibida dos Kronagar. Maior chance de ser identificado por nobreza, clérigos ou inquisidores. Se descoberto: condenação automática à morte em qualquer reino, sem julgamento; aliados podem ser perseguidos como cúmplices.', descricao: 'O sangue que corre em suas veias ou os segredos de seus antepassados carregam o odor acre do abismo. Ter qualquer ligação com os Kronagar é carregar uma sentença de morte silenciosa.' },
  { id: 'morador-de-rua', nome: 'Morador de Rua', pontosExtras: 3, efeito: 'O personagem não possui residência, posses significativas ou acesso a refúgios seguros, ficando vulnerável às ameaças noturnas. Não pode ser usado com Fundo Monetário ou Reservas de Prata.', descricao: 'O céu estrelado é o teto de uma prisão sem muros. Em um mundo onde a escuridão é povoada por pesadelos reais, não ter uma porta para trancar é uma sentença de pavor constante.' },
  { id: 'orfao', nome: 'Órfão', pontosExtras: 1, efeito: 'O personagem inicia sem posses herdadas e em um ambiente de risco: um orfanato precário. Não pode ser usado com Fundo Monetário ou Reservas de Prata.', descricao: 'Em Khonum, a família é a primeira linha de defesa contra o abismo, e você não a tem. Criado em instituições esquecidas, sua infância foi marcada pelo vento uivante e por runas que falhavam quando você mais precisava de silêncio.' },
  { id: 'amaldicoado', nome: 'Amaldiçoado', pontosExtras: 4, efeito: 'No momento da criação da ficha, o Atributo com o maior valor base é reduzido para 1 ponto. A penalidade é aplicada após a distribuição de pontos e permanece até que a maldição seja removida (ritual de purificação, elixir lendário ou missão específica). Somente altera o valor do atributo; bônus de perícia e outras fontes são mantidos.', descricao: 'Você foi tocado por algo que não deveria existir. O que havia de melhor em você foi selado sob sete chaves espirituais. Você caminha pelo mundo como uma sombra do que poderia ser.' },
  { id: 'monstruoso', nome: 'Monstruoso', pontosExtras: 5, efeito: 'O atributo Carisma é fixado permanentemente em 0. Não é possível aumentá-lo por nenhum meio. O personagem falha automaticamente em qualquer teste que exija diplomacia, sedução ou etiqueta social positiva. Interações com NPCs geralmente resultam em pânico, hostilidade ou fuga.', descricao: 'Você é um erro aos olhos da natureza ou uma vítima de experimentos que foram longe demais. Sua fisionomia é tão grotesca ou sua presença tão perturbadora que o mero olhar de um cidadão desperta repulsa.' },
  { id: 'ma-fama', nome: 'Má Fama', pontosExtras: 1, efeito: 'Penalidade constante de -2 em rolagens para persuadir, negociar preços ou pedir favores a NPCs que tenham acesso a fofocas ou notícias. Atitude inicial de desconhecidos que reconheçam seu nome: cautela, desdém ou hostilidade velada.', descricao: 'O seu nome costuma vir acompanhado de um suspiro de reprovação. Limpar uma reputação assim exige atos de heroísmo monumentais.' },
  { id: 'saude-depreciada', nome: 'Saúde Depreciada', pontosExtras: 1, efeito: 'Na criação do personagem (ou ao adquirir este antecedente), role 1d20 e subtraia o resultado do valor total de HP. Redução permanente; mínimo 1 HP. Novos ganhos de HP por nível continuam afetados pela penalidade inicial.', descricao: 'Sua jornada é uma luta constante contra o próprio corpo. Um golpe que para outros seria um arranhão, para você pode ser fatal. Sua sobrevivência depende de astúcia, distância e da proteção dos outros.' },
  { id: 'desatento', nome: 'Desatento', pontosExtras: 1, efeito: 'Penalidade de 1d4 em qualquer teste de Prontidão (iniciativa ou reação). O jogador subtrai o resultado do dado do valor final. Se o resultado cair para 0 ou menos, é falha crítica.', descricao: 'Seu foco é fragmentado e sua mente costuma vagar. O tempo que você leva para levar a mão à arma é o tempo que seus inimigos usam para cercá-lo.' },
  { id: 'azarado', nome: 'Azarado', pontosExtras: 5, efeito: 'O personagem é incapaz de desferir golpes excepcionais pela sorte: sempre que rolar um Acerto Crítico, o resultado é tratado apenas como dado normal. Efeitos aplicados com acertos críticos (como status) ainda são aplicados.', descricao: 'Parece que as estrelas se alinharam contra você no dia do seu nascimento. Você sobrevive pelo esforço puro e pela insistência, pois sabe que o destino nunca lhe dará um presente de mão beijada.' },
  { id: 'fobia-demônios', nome: 'Fobia de Demônios', pontosExtras: 1, efeito: 'Na presença direta de um demônio (ou quando o combate iniciar), o personagem recebe -2 em todas as rolagens de ataque e perícia enquanto o demônio estiver à vista. Incapaz de se aproximar voluntariamente da criatura; age apenas à distância ou na defensiva.', descricao: 'O terror do abismo é um gatilho traumático. Seus braços tremem, sua visão embaça e o instinto de fuga sobrepuja qualquer treinamento de combate.' },
  { id: 'mao-tremula', nome: 'Mão Trêmula', pontosExtras: 2, efeito: 'Penalidade de -2 em qualquer teste que envolva precisão manual: arcos, bestas, armas de arremesso, gazuas, procedimentos médicos delicados. Debuff constante.', descricao: 'Suas mãos nunca estão totalmente paradas. Quando o momento exige delicadeza ou um disparo certeiro sob pressão, sua própria biologia o trai.' },
  { id: 'sangue-ruim', nome: 'Sangue Ruim', pontosExtras: 3, efeito: 'Recebe o dobro de dano de sangramentos.', descricao: 'Seu sangue parece não querer estancar. Uma pequena ferida continua a gotejar em você, drenando suas forças. Você sempre deixa um rastro escarlate para trás após uma batalha.' },
  { id: 'vicio-elixires', nome: 'Vício em Elixires', pontosExtras: 2, efeito: 'Se passar mais de 24h sem ingerir pelo menos um elixir ou poção, recebe -2 em todos os Atributos (crises de abstinência). Poções de cura recuperam 1d4 pontos a menos de HP para ele (tolerância).', descricao: 'Anos de uso constante de misturas alquímicas deixaram uma marca profunda. O que antes era um remédio, hoje é uma necessidade. Seu vício é um fardo caro que consome suas moedas e sua sanidade.' },
  { id: 'presenca-repulsiva-animais', nome: 'Presença Repulsiva aos Animais', pontosExtras: 1, efeito: 'Cavalos, cães de guarda e aves de rapina sentem pavor instintivo de você. -5 em testes para cavalgar, adestrar ou acalmar um animal. Animais domesticados se recusam a carregá-lo ou a permanecer no mesmo ambiente. Em combate com animais ou animais arcanos você sempre será o foco do ataque.', descricao: 'Existe algo em sua essência que os animais reconhecem como "predador" ou "anomalia". Você nunca conheceu a lealdade de um cão ou a facilidade de viajar a cavalo.' },
]
