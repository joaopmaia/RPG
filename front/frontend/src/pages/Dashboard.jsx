import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import './Dashboard.css'

export default function Dashboard() {
  const { isAdmin } = useAuth()
  const [summaryOpen, setSummaryOpen] = useState(true)
  const [chaptersOpen, setChaptersOpen] = useState({ eraDivinos: true, eraProfetas: true, eraAntigos: true, eraOuro: true })

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const sections = [
    { to: '/equipamentos', title: 'Equipamentos', desc: 'Armas, armaduras, alquimia e materiais' },
    { to: '/reinos', title: 'Reinos', desc: 'Reinos e preços' },
    { to: '/runas', title: 'Runas', desc: 'Runas por tier e elemento' },
    { to: '/npcs', title: 'NPCs', desc: 'Personagens (ficha, equipamentos e elixires)' },
  ]
  if (isAdmin()) {
    sections.push({ to: '/demonios', title: 'Demônios', desc: 'Criar e gerenciar demônios' })
    sections.push({ to: '/animais', title: 'Animais', desc: 'Criar e gerenciar feras/animais' })
  }
  // Rotas /demonios e /animais: ver Layout e App.jsx

  return (
    <div className="dashboard">
      <h1>Grimório do Mestre</h1>
      <div className="card dashboard-story" style={{ marginBottom: '1.5rem', maxWidth: '820px' }}>
        <h2 style={{ marginTop: 0 }}>História do mundo</h2>

        {/* Sumário colapsável */}
        <div className="card" style={{ marginBottom: '1rem', background: 'var(--bg-card-hover)' }}>
          <button
            type="button"
            onClick={() => setSummaryOpen((o) => !o)}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '0.5rem 0.75rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontWeight: 600 }}>Sumário</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>{summaryOpen ? '▼' : '▶'}</span>
          </button>
          {summaryOpen && (
            <div style={{ padding: '0.25rem 0.75rem 0.75rem' }}>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.9rem' }}>
                <li>
                  <button type="button" onClick={() => scrollTo('cap-era-divinos')} className="link-button">
                    Era dos Divinos
                  </button>
                  <ul style={{ marginTop: '0.25rem', paddingLeft: '1.25rem' }}>
                    <li>
                      <button type="button" onClick={() => scrollTo('sub-começo')} className="link-button">
                        O começo
                      </button>
                    </li>
                    <li>
                      <button type="button" onClick={() => scrollTo('sub-caos')} className="link-button">
                        O Caos
                      </button>
                    </li>
                    <li>
                      <button type="button" onClick={() => scrollTo('sub-sirothval')} className="link-button">
                        Siroth&apos;Val, a Tempestade Eterna
                      </button>
                    </li>
                    <li>
                      <button type="button" onClick={() => scrollTo('sub-eldarae')} className="link-button">
                        Eldarae, o Pilar Celeste
                      </button>
                    </li>
                    <li>
                      <button type="button" onClick={() => scrollTo('sub-ithilmar')} className="link-button">
                        Ithilmar, a Fonte Eterna
                      </button>
                    </li>
                    <li>
                      <button type="button" onClick={() => scrollTo('sub-durhmorr')} className="link-button">
                        Durh’Morr, a Guardiã das Montanhas
                      </button>
                    </li>
                  </ul>
                </li>
                <li style={{ marginTop: '0.35rem' }}>
                  <button type="button" onClick={() => scrollTo('cap-era-profetas')} className="link-button">
                    Era dos Profetas
                  </button>
                  <ul style={{ marginTop: '0.25rem', paddingLeft: '1.25rem' }}>
                    <li>
                      <button type="button" onClick={() => scrollTo('sub-sonhos-profeticos')} className="link-button">
                        Sonhos Proféticos
                      </button>
                    </li>
                    <li>
                      <button type="button" onClick={() => scrollTo('sub-viagem-profetas')} className="link-button">
                        A Viagem dos Profetas
                      </button>
                    </li>
                    <li>
                      <button type="button" onClick={() => scrollTo('sub-corrupcao')} className="link-button">
                        A corrupção
                      </button>
                    </li>
                  </ul>
                </li>
                <li style={{ marginTop: '0.35rem' }}>
                  <button type="button" onClick={() => scrollTo('cap-era-antigos')} className="link-button">
                    Era dos Antigos
                  </button>
                  <ul style={{ marginTop: '0.25rem', paddingLeft: '1.25rem' }}>
                    <li>
                      <button type="button" onClick={() => scrollTo('sub-um-breve-momento')} className="link-button">
                        Um breve momento de paz
                      </button>
                    </li>
                    <li>
                      <button type="button" onClick={() => scrollTo('sub-ascensao-gorvashica')} className="link-button">
                        A Ascenção Gorváshica
                      </button>
                    </li>
                    <li>
                      <button type="button" onClick={() => scrollTo('sub-queda-xelgur')} className="link-button">
                        A Queda de Xel&apos;Gur
                      </button>
                    </li>
                  </ul>
                </li>
                <li style={{ marginTop: '0.35rem' }}>
                  <button type="button" onClick={() => scrollTo('cap-era-ouro')} className="link-button">
                    Era de Ouro
                  </button>
                  <ul style={{ marginTop: '0.25rem', paddingLeft: '1.25rem' }}>
                    <li>
                      <button type="button" onClick={() => scrollTo('sub-novos-reis')} className="link-button">
                        Os novos Reis
                      </button>
                    </li>
                    <li>
                      <button type="button" onClick={() => scrollTo('sub-novos-reinos')} className="link-button">
                        Novos Reinos
                      </button>
                    </li>
                    <li>
                      <button type="button" onClick={() => scrollTo('sub-novas-guerras')} className="link-button">
                        Novas Guerras
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Capítulo 3: Era dos Antigos */}
        <div
          id="cap-era-antigos"
          className="card"
          style={{ background: 'var(--bg-card)', marginTop: '1rem', marginBottom: 0 }}
        >
          <button
            type="button"
            onClick={() =>
              setChaptersOpen((prev) => ({ ...prev, eraAntigos: !prev.eraAntigos }))
            }
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '0.75rem 0.75rem 0.5rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontWeight: 700 }}>Capítulo III — Era dos Antigos</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>
              {chaptersOpen.eraAntigos ? '▼' : '▶'}
            </span>
          </button>
          {chaptersOpen.eraAntigos && (
            <div style={{ padding: '0 0.75rem 0.75rem', lineHeight: 1.6 }}>
              <h3 id="sub-um-breve-momento" style={{ marginTop: '0.75rem', fontSize: '1.05rem' }}>Um breve momento de paz</h3>
              <p>
                Com o término da Guerra dos Arcanos, o medo de novas insurgências moldou a estrutura social de Khonum. O
                conhecimento das runas e o manuseio da arcana deixaram de ser patrimônios comuns para se tornarem
                instrumentos de prestígio e autoridade. Em Rushoku, esse movimento consolidou o surgimento das primeiras
                Casas Nobres, linhagens que reivindicaram a tutela sobre os registros rúnicos remanescentes e a
                administração dos recursos arcanos da região.
              </p>
              <p>
                Esse processo de elitização não foi exclusivo do sul. Ao norte, nas terras dos Sylmari, a preservação do
                saber rúnico foi assegurada pelo retorno de Merlyn em seus anos finais. O profeta levou consigo a
                profundidade dos estudos arcanos para sua terra natal, onde o conhecimento foi mantido sob o controle
                estrito das castas superiores. Como resposta à instabilidade do continente e visando proteger a integridade
                de Eldarae, os Sylmari fecharam os portos de suas ilhas setentrionais.
              </p>
              <p>
                Enquanto o acesso ao coração do conhecimento Sylmari era restrito, a ilha de Shientara, ao sul, tornou-se
                o único ponto de intercâmbio permitido. Simultaneamente, o controle administrativo exercido por Rushoku
                sobre Naltra condicionou o desenvolvimento dos Drovenar, cujas capacidades técnicas e rúnicas passaram a
                ser reguladas pelas necessidades da capital. Assim, o saber que antes unira as raças na era dos profetas
                fragmentou-se em domínios fechados, onde a arcana e as runas passaram a definir as fronteiras e as
                hierarquias de Khonum.
              </p>
              <p>
                Sob a égide do controle territorial, surgiram os assentamentos de Suyeki e Deruth. Projetados originalmente
                como bastiões militares, sua função era consolidar o domínio de Rushoku sobre as passagens de Naltra e
                monitorar as fronteiras dos povos das montanhas. No entanto, Deruth guardava um propósito mais profundo e
                sombrio: o solo daquela região foi escolhido para abrigar o repouso final do profeta caído.
              </p>
              <p>
                Ali encontram-se as ruínas de Khorgan-Dûrmak, o túmulo de Lohqi Kronagar. Longe de ser uma sepultura comum,
                o local é um labirinto dimensional, uma obra-prima de engenharia rúnica que reflete a mente de seu
                criador, um mestre artesão cujas habilidades na manipulação da arcana permanecem inigualáveis. Até os dias
                atuais, as profundezas de Khorgan-Dûrmak exercem um magnetismo inevitável sobre os maiores aventureiros de
                Khonum. Eles adentram seus corredores mutáveis em busca de relíquias e fragmentos do conhecimento rúnico
                do passado, tentando decifrar os segredos que o mestre dos Drovenar levou consigo para o além-túmulo.
              </p>
              <p>
                Dentre todos os povos de Khonum, os Sharusahk permaneceram os mais isolados, preservando uma linhagem que
                raramente se misturou às outras raças. O confinamento era imposto por uma geografia impiedosa: de um lado,
                o deserto de clima hostil e infestado por demônios; do outro, o domo de lâminas de sua própria árvore
                divina, que por eras agiu como uma muralha intransponível. Foi a Profeta Melinda quem rompeu esse
                cerceamento ao conceber uma técnica que desafiava as leis da matéria — uma dança marcial rítmica e precisa,
                capaz de encontrar os vãos entre a chuva de navalhas de Siroth’Val.
              </p>
              <p>
                Esse feito tornou-se o pilar central da cultura Sharusahk. Através dos séculos, o povo do deserto
                dedicou-se ao aperfeiçoamento dessa arte de guerra, transformando o movimento em uma disciplina sagrada. O
                domínio da dança de Melinda não apenas permitiu que gerações sucessivas cruzassem o domo de folhas com
                maior segurança, mas forjou combatentes de agilidade e letalidade ímpares. Até os dias atuais, os
                guerreiros Sharusahk são reconhecidos como a força militar mais temível de Khonum, portadores de um estilo
                de combate que nasceu da necessidade de sobreviver à própria proteção divina.
              </p>
              <p>
                Foi durante este mesmo período de consolidação que a Guilda dos Mensageiros estabeleceu sua sede nas terras
                de Rushoku. Sua fundação teve um propósito único e severo: a erradicação dos remanescentes da Ordem dos
                Kronagar, cujas raízes de corrupção ainda ameaçavam a estabilidade dos novos reinos. O que nasceu como uma
                força de inquisição e caça, entretanto, adaptou-se às necessidades de um continente em expansão.
              </p>
              <p>
                Com o passar das eras, a Guilda ressignificou sua atuação em Khonum, tornando-se a espinha dorsal da
                comunicação e segurança entre os povos. Suas funções ramificaram-se para atender às demandas de um mundo
                vasto e hostil: desde a caça sistemática de demônios e a coleta de recursos em territórios inexplorados,
                até a escolta de encomendas diplomáticas e o trânsito de informações entre as cortes. Embora a vigilância
                contra os adoradores de Kronagar permaneça em seu cerne, a Guilda dos Mensageiros transformou-se em uma
                instituição multifacetada, sendo hoje o principal elo que mantém a ordem e a logística entre os reinos
                fragmentados.
              </p>

              <h3 id="sub-ascensao-gorvashica" style={{ marginTop: '0.75rem', fontSize: '1.05rem' }}>A Ascenção Gorváshica</h3>
              <p>
                Enquanto as capitais do ocidente se perdiam em suas próprias tramas de sucessão e comércio, uma força
                silenciosa tomava forma nas extensões inexploradas do Oriente. Ali, entre as sombras de terras onde os pés
                dos Profetas jamais pisaram, surgiram os Gorvash. Antes descritos nas crônicas apenas como feras acéfalas
                e errantes, esses seres encontraram um novo propósito sob a égide de um único nome: Xel’Gur.
              </p>
              <p>
                Xel’Gur não era apenas um colosso de força bruta e musculatura hercúlea, mas o portador de uma astúcia que
                desafiava a natureza de sua espécie. Foi sua inteligência, e não apenas seu punho, que serviu como o
                alicerce para a ascensão Gorvash. Sob seu comando, o que era irracional tornou-se organizado; o que era
                disperso tornou-se uma horda. Eles forjaram sua própria língua para coordenar a guerra e ergueram uma
                bandeira que agora flutua sobre as colunas de marcha. Pela primeira vez na história de Khonum, o Oriente
                não enviava apenas demônios, mas um exército disciplinado que marchava rumo ao ocidente com a precisão de
                conquistadores.
              </p>
              <p>
                O mundo encontra-se partido pela espinha dorsal de Salhazy, uma cadeia de montanhas cujos picos são
                considerados soberanos e completamente intransponíveis. A oeste desta muralha de pedra, estendem-se as
                terras férteis do Ocidente, um domínio de biomas vibrantes, florestas densas e rios de água doce que
                sustentaram o florescer das primeiras civilizações. Contudo, além das cristas orientais, a paisagem
                transfigura-se em um pesadelo de cinzas e fogo. O Oriente é um reino de solo vulcânico e veios de lava
                exposta, onde o ar é pesado com o enxofre e a própria vegetação evoluiu para formas tão predatórias e
                letais quanto as feras que nela habitam.
              </p>
              <p>
                Naquelas terras inabitáveis, a sobrevivência é uma guerra constante contra criaturas que rivalizam com o
                horror dos demônios, os quais infestam o solo oriental com uma densidade sem paralelo. Foi essa hostilidade
                absoluta que forçou a migração da horda sob o comando de Xel’Gur. Incapazes de escalar as muralhas naturais
                de Salhazy, os Gorvash convergiram para a única falha na armadura de pedra do continente: o Vale dos
                Gorvash. Como um funil de terra e sangue, este desfiladeiro permanece como a única passagem possível entre
                o inferno vulcânico e as planícies verdes, tornando-se o portal por onde a marcha oriental agora avança
                inexoravelmente rumo ao Ocidente.
              </p>
              <p>
                Naquela era, a majestade dos grandes reinos era ainda uma promessa distante. O mapa de Khonum era um mosaico
                de pequenas comunidades, aldeias agropastoris e vilarejos isolados que viviam à sombra de sua própria
                autossuficiência. Com exceção das fortificações de Rushoku ao norte
                e do isolamento insular dos Sylmari, o continente era um vasto ponto cego para qualquer defesa coordenada.
                Quando a bandeira de Xel’Gur emergiu do Vale, não encontrou exércitos para barrar seu caminho, mas um mundo
                fragmentado que foi rapidamente consumido e reduzido a cinzas.
              </p>
              <p>
                A marcha Gorvash varreu as terras férteis com uma eficiência brutal, subjugando quase toda a extensão
                continental em um curto período de carnificina. Apenas dois redutos resistiram ao avanço da horda oriental.
                As ilhas dos Sylmari permaneceram intocadas, protegidas pelo mar que os Gorvash, desprovidos de qualquer
                saber náutico ou frotas de guerra, não podiam atravessar. O reino Drovenar de Naltra também se manteve de
                pé; sua localização estratégica nas encostas escarpadas das montanhas transformava o terreno em uma
                armadilha mortal para invasores, forçando os Gorvash a recuar diante de uma geografia que nem mesmo sua
                força bruta podia conquistar.
              </p>

              <h3 id="sub-queda-xelgur" style={{ marginTop: '0.75rem', fontSize: '1.05rem' }}>A Queda de Xel&apos;Gur</h3>
              <p>
                Quando o horizonte de Khonum parecia definitivamente obscurecido pela bandeira de Xel’Gur, o destino do
                continente foi confiado a um grupo singular de sobreviventes. Treze figuras, oriundas de linhagens que o
                isolamento e a política haviam separado, convergiram para o que as crônicas chamariam de a Última
                Resistência. Eram portadores de habilidades distintas, unidos não por tratados, mas pela necessidade
                absoluta de sobrevivência.
              </p>
              <p>
                A composição desse grupo refletia o equilíbrio precário das forças do mundo: sete Vaelthor, cujos
                conhecimentos em elixires e na manipulação da arcana vital seriam o sustento da companhia; três Sylmari,
                mestres das runas mais complexas e da visão estratégica das alturas; um Drovenar, o arquiteto capaz de
                forjar o aço e as defesas em meio à marcha; e um único Sharusahk, a lâmina solitária que personificava a
                dança marcial de Melinda na linha de frente.
              </p>
              <p>
                Contudo, os registros daquela era guardam uma lacuna deliberada. Fala-se de um décimo terceiro herói, uma
                figura cuja raça e nome foram omitidos ou apagados dos pergaminhos originais. Seus feitos foram
                fundamentais para que a maré Gorvash fosse contida, mas sua identidade permanece um enigma, um fantasma nas
                brumas da história de Khonum, cujo paradeiro após a grande contenda jamais foi confirmado por olhos
                mortais.
              </p>
              <p>
                Enquanto o grosso das legiões Gorvash avançava sobre as planícies, os heróis executaram uma manobra de
                infiltração cirúrgica, penetrando no coração do acampamento inimigo. O objetivo era único: a decapitação do
                comando central. Ali, onde Xel’Gur exercia sua autoridade sobre as hordas, a resistência encontrou uma
                força que desafiava a lógica das batalhas anteriores. O embate foi marcado por uma ferocidade que as
                crônicas descrevem como o ápice da tensão entre a força bruta oriental e a maestria rúnica do ocidente.
              </p>
              <p>
                O preço para silenciar o comando de Xel’Gur foi devastador. No auge da luta, cinco dos treze heróis
                tombaram, suas vidas ceifadas enquanto garantiam a abertura necessária para o golpe final. No entanto, com
                a queda do líder Gorvash, a unidade da horda fragmentou-se. Sem a inteligência centralizada que os guiava,
                os invasores perderam a coesão, permitindo que os sobreviventes da companhia forçassem a retirada do
                exército para além das montanhas. O fim do comando Gorvash não foi apenas uma vitória militar, mas o marco
                zero de uma nova cronologia para Khonum — o despertar de uma era onde as cinzas da destruição serviriam de
                base para a fundação dos grandes reinos.
              </p>
            </div>
          )}
        </div>

        {/* Capítulo 4: Era de Ouro */}
        <div
          id="cap-era-ouro"
          className="card"
          style={{ background: 'var(--bg-card)', marginTop: '1rem', marginBottom: 0 }}
        >
          <button
            type="button"
            onClick={() =>
              setChaptersOpen((prev) => ({ ...prev, eraOuro: !prev.eraOuro }))
            }
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '0.75rem 0.75rem 0.5rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontWeight: 700 }}>Capítulo IV — Era de Ouro</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>
              {chaptersOpen.eraOuro ? '▼' : '▶'}
            </span>
          </button>
          {chaptersOpen.eraOuro && (
            <div style={{ padding: '0 0.75rem 0.75rem', lineHeight: 1.6 }}>
              <h3 id="sub-novos-reis" style={{ marginTop: '0.75rem', fontSize: '1.05rem' }}>Os novos Reis</h3>
              <p>
                A expansão territorial por Khonum deu origem a uma nova arquitetura de poder. Com a fundação de novos
                domínios, linhagens de nobreza e casas reais estabeleceram-se em diversas localidades, consolidando
                dinastias que, em sua maioria, preservam sua autoridade até os dias atuais. No entanto, o mapa político
                de Khonum apresenta exceções notáveis a esse modelo monárquico, refletindo as cicatrizes e as conquistas
                das eras anteriores.
              </p>
              <p>
                O povo Sharusahk e as nações surgidas após a Grande Expansão mantiveram estruturas próprias, mas a
                mudança mais significativa ocorreu em Naltra. Diferente da tradição nobiliárquica de Rushoku, as terras
                Drovenar consolidaram-se sob um Conselho Eleito, uma estrutura democrática que representa os interesses
                do povo em questões diplomáticas e internas. Esse modelo de governança tornou-se o pilar da identidade
                política de Naltra, diferenciando-a dos reinos de linhagem de sangue.
              </p>
              <p>
                Essa autonomia foi impulsionada pelo desempenho decisivo dos Drovenar durante a Guerra Gorváshica. O
                reconhecimento de seu valor estratégico e técnico forçou o afrouxamento das antigas leis proibicionistas
                que, por gerações, limitaram o crescimento deste povo. Com a nova liberdade administrativa, foi fundada
                Nehui: uma cidade agrícola Drovenar estrategicamente situada para suprir as carências das comunidades de
                montanha. Nehui tornou-se o pulmão logístico de Naltra, provendo os recursos naturais, madeiras e
                alimentos que o solo árido e rochoso das encostas não podia oferecer, garantindo, pela primeira vez, a
                autossuficiência do povo do martelo.
              </p>
              <p>
                O domínio dos Sharusahk consolidou-se sob uma estrutura de meritocracia marcial absoluta. Diferente das
                linhagens estáveis de Rushoku, o comando deste povo é exercido pelo guerreiro que provar ser o mais letal
                em combate, o que resultou em uma cultura política de alta volatilidade. As trocas de poder são
                frequentes e marcadas por desafios rituais, mantendo a liderança em um estado de constante prontidão e
                renovação, onde a força é o único título de legitimidade reconhecido sob o domo.
              </p>
              <p>
                Contudo, além das fronteiras da tempestade de navalhas de Siroth’Val, uma nova realidade social tomou
                forma. Nas margens das terras mortas, surgiu Volith, uma periferia mercantil erguida por aqueles que o
                domo rejeitou. A população de Volith é composta majoritariamente por Sharusahks que sofreram mutilações
                ao tentar cruzar a árvore divina, ou por descendentes daqueles que já nasceram fora do isolamento do
                deserto. O que começou como um refúgio de excluídos transformou-se no principal pulmão econômico da
                região.
              </p>
              <p>
                Localizada estrategicamente no limiar entre o deserto e as terras áridas, Volith tornou-se o ponto de
                encontro de todas as raças de Khonum. A cidade opera como o mediador necessário entre o isolamento
                marcial do domo e o comércio global, estabelecendo rotas que levam os ativos únicos dos guerreiros para o
                mundo e trazem recursos externos para o deserto. Em Volith, a rigidez da dança marcial dá lugar à
                fluidez do mercado, tornando-a o único solo onde o aço Sharusahk encontra a diplomacia e a moeda
                estrangeira.
              </p>
              <p>
                Enquanto o continente se reconstruía, o arquipélago Sylmari fragmentou-se em reinos de especialidades
                distintas, todos sob a sombra da árvore da vida. Shientara emergiu como a face visível desse povo: um
                porto cosmopolita onde o sangue de todas as raças se mistura, servindo como a principal porta de entrada
                para o comércio e a diplomacia global. Em contraste, Argas foi erguida como um monumento à ambição
                intelectual, uma cidade dedicada à pesquisa em engenharia onde os Sylmari buscam rivalizar com a secular
                maestria rúnica e mecânica dos Drovenar.
              </p>
              <p>
                Nas alturas, o reino de Delendir desafiou a gravidade. Construído inteiramente entre as copas das
                árvores, com uma complexa rede de pontes e casas suspensas, o reino tornou-se o epicentro dos estudos em
                medicina e botânica arcana, utilizando a flora única das ilhas para curas que o resto do mundo desconhece.
                Na ilha ao norte, Karningul estabeleceu-se como o topo da hierarquia; é das ramificações mais altas da
                árvore da vida que a alta nobreza governa, enviando emissários constantes para assegurar que a vontade
                dos soberanos das alturas seja ouvida no continente.
              </p>
              <p>
                O isolamento, contudo, criou abismos de informação. Enquanto Karningul mantém contato, o território de
                Meruem tornou-se um espectro, completamente isolado pelo fechamento das ilhas do norte e pela ausência de
                qualquer representante, permanecendo um mistério para o mundo exterior. Já na ilha central, protegida por
                correntes marítimas de violência letal, repousa Valerien. Conhecida como um paraíso inacessível, a ilha é
                famosa pela produção dos vinhos mais valiosos de Khonum, cultivados em um solo que as lendas afirmam ser
                sagrado e onde, por razões desconhecidas, a manifestação de demônios é inexistente.
              </p>
              <p>
                Das cinzas da invasão oriental, ergueu-se a arquitetura de uma nova ordem. O mapa do Ocidente foi
                redesenhado não por conquistas militares entre as raças, mas por um pacto de gratidão e memória. Sete
                grandes domínios foram formalizados e batizados em homenagem aos heróis que sobreviveram ao cerne da
                guerra, imortalizando seus nomes na própria terra que ajudaram a libertar: Rushoku, Galte, Fangi, Fuchoi,
                Lalmuthros, Khasil e Taytha.
              </p>
              <p>
                Rushoku, outrora o bastião que cambaleou sob o peso da Guerra dos Arcanos e da horda Gorvash, foi
                reconstruída sobre suas próprias ruínas. A capital retomou sua posição como o coração pulsante de Khonum,
                servindo de marco zero para a maior obra de engenharia civil da história: uma rede de estradas de pedra
                que parte de seus portões em direção a cada um dos outros seis reinos.
              </p>
              <p>
                Essas artérias pavimentadas permitiram que a fragmentação do passado fosse substituída por uma
                interdependência vital. O que começou como rotas de suprimento militar transformou-se em uma robusta
                malha comercial, onde os elixires de uns encontram o aço e os tecidos de outros. Pela primeira vez,
                Khonum deixou de ser um aglomerado de aldeias isoladas para se tornar um organismo vivo, onde a
                segurança de um reino é garantida pela prosperidade e pela conexão com os demais.
              </p>
              <p>
                Enquanto os Sete Reinos erguiam torres de marfim e mármore, uma ferida purulenta abria-se nas águas
                esquecidas do sul: o Arquipélago de Swajax. O que começou como um amontoado de vilas precárias e
                cidadelas ocultas entre recifes traiçoeiros tornou-se o refúgio final para aqueles que a lei rúnica de
                Rushoku não pôde dobrar. Piratas, assassinos e espiões convergiram para essas ilhas, trocando a lealdade
                a coroas pela lealdade ao ouro e ao aço.
              </p>
              <p>
                Com o passar das eras, Swajax deixou de ser apenas um esconderijo para se tornar uma potência invisível.
                Suas teias de influência estenderam-se silenciosamente por toda Khonum, infiltrando-se desde os mercados
                de especiarias até os conselhos mais restritos dos reis. Hoje, o arquipélago é o coração pulsante do
                mercado negro e da pirataria, uma rede de segredos e crimes que dita o preço do sangue e da informação em
                cada porto do continente. Em Khonum, diz-se que nenhum segredo é sussurrado sem que um ouvido de Swajax
                receba o vento, e nenhuma transação ilícita ocorre sem que o dízimo das sombras seja cobrado.
              </p>

              <h3 id="sub-novos-reinos" style={{ marginTop: '0.75rem', fontSize: '1.05rem' }}>Novos Reinos</h3>
              <p>
                As décadas transformaram a gratidão em ambição. Onde antes havia o solo virgem da reconstrução,
                ergueram-se as torres de novos domínios, cada um moldado pelas necessidades — ou pelas fraquezas — de
                Khonum.
              </p>
              <p>
                Lhals surgiu como o suspiro sufocado de Rushoku. O que deveria ser a expansão da glória da capital
                tornou-se seu porão de despejo; um reino de luzes artificiais, onde cassinos e prostíbulos operam sob a
                sombra da prisão local. Ali, o vinho flui como água barata — um néctar amargo e grosseiro que, pela
                facilidade do preço, tornou-se o sangue do comércio popular, embriagando as massas que a nobreza prefere
                ignorar.
              </p>
              <p>
                Em contraste, as estradas entre a portuária Taytha e a soberana Rushoku deram vida a Likan. O que começou
                como o descanso de mercadores itinerantes floresceu como o Reino da Música. É uma terra de cores
                vibrantes e notas constantes, que exporta seus menestréis para as cortes mais refinadas e arenas de
                combate. Recentemente, Likan alcançou uma notoriedade sombria e fascinante: o estudo das frequências para
                o controle de demônios, tornando seus mestres musicais figuras indispensáveis nas universidades de Galte.
              </p>
              <p>
                Ao Sul, onde o gelo morde a carne, Tsaicalam permanece como uma sentinela solitária. Erguida apenas para
                vigiar os portões de ferro de Tartso, a cidade é o destino final de nobres caídos em desgraça — um exílio
                gelado financiado pelo ouro de Rushoku, que compra o silêncio e a segurança das prisões rúnicas.
              </p>
              <p>
                Enquanto isso, no coração do comércio, Suyeki consolidou-se como a ponte de ouro entre o vigor dos
                Vaelthor e a técnica dos Drovenar. Sua vizinha, Deruth, floresceu não pelo plantio, mas pelo sangue e
                pela curiosidade; uma terra de Mensageiros ávidos, cujas vidas são gastas tentando decifrar os enigmas
                dimensionais das ruínas de Khorgan-Dûrmak.
              </p>
              <p>
                Onde o lazer encontra a avareza, surgiu Sekung. O antigo resort da nobreza transmutou-se no Banco do
                Mundo, um cofre de opulência que mantém os fios de Fangi e de todos os outros reinos em suas mãos. Em
                Sekung, a coroa não é herdada, mas precificada; as lendas dizem que qualquer homem pode ser rei, desde
                que possua o ouro para comprar o trono — um valor que, até hoje, ninguém foi capaz de acumular.
              </p>
              <p>
                Mas nem tudo foi tocado pelo progresso. Jawyn permanece como uma cicatriz de silêncio, protegida por
                montanhas colossais e um pântano onde a morte espreita em cada bolha de gás. Para a Guilda dos
                Mensageiros, Jawyn é o teste final: cruzar seus domínios e retornar é o único rito que separa um novato
                de um verdadeiro mestre da estrada.
              </p>
              <p>
                Por fim, nas costas salgadas, Tahid ergueu-se do simples anzol para os grandes estaleiros. O que era um
                paraíso de pescadores tornou-se o berço das frotas de Khonum, fornecendo desde o alimento que sustenta as
                mesas até as quilhas que desafiam os oceanos em direção aos Sylmari e além.
              </p>
              <p>
                As eras de paz não trouxeram apenas descanso, mas uma complexa teia de dependências que mantém o mundo em
                equilíbrio. Fangi transmutou o legado de Drakos em ouro puro; ao deter o monopólio da engenharia dos
                Totens Demoníacos, o reino ascendeu como uma potência econômica inescapável. Não há cidade em Khonum que
                durma tranquila sem pagar o tributo de Fangi, transformando a proteção contra o abismo no negócio mais
                lucrativo do continente.
              </p>
              <p>
                No centro de tudo, Rushoku pulsa como o coração administrativo. Sua riqueza não provém da terra, mas do
                movimento. Através da Guilda dos Mensageiros, a capital controla a informação em quase todos os reinos;
                através da Guilda dos Mercantes, ela impõe o &quot;Dízimo das Estradas&quot;. Cada mercadoria que
                atravessa as rotas de pedra de Khonum deixa uma moeda nos cofres de Rushoku, garantindo que a antiga
                capital permaneça como a senhora absoluta da logística mundial.
              </p>
              <p>
                Enquanto isso, o conhecimento e a força dividiram-se por necessidade. Galte tornou-se um bastião de
                torres sombrias, onde o estudo dos demônios deixou de ser um medo para se tornar uma ciência exata. Ao
                sul, Thayta engoliu o horizonte com seus mastros, consolidando-se como o maior porto que o mundo já viu,
                a garganta por onde passa todo o comércio marítimo global.
              </p>
              <p>
                Para que os mercadores e estudiosos possam prosperar, Lalmuthros e Fulchoi aceitaram um destino mais
                rígido. Transformados em reinos puramente militares e financiados pelo ouro das outras nações, eles são a
                muralha de aço de Khonum. Suas populações respiram a guerra, existindo com o único e terrível propósito de
                servirem como o exército permanente contra qualquer sombra que ouse emergir do Oriente.
              </p>
              <p>
                Por fim, em meio à opulência e ao militarismo, repousa Khasil. Embora mais humilde em sua arquitetura e
                modos, o reino permanece como a alma de Khonum. Como a principal potência agrícola, Khasil alimenta os
                exércitos de Fulchoi e os nobres de Sekung. Seu respeito, contudo, emana de algo mais profundo que o
                trigo: a proximidade com a Universidade Arcana de Acris, o santuário de saber onde a próxima geração de
                defensores do mundo é forjada sob o olhar dos mestres.
              </p>

              <h3 id="sub-novas-guerras" style={{ marginTop: '0.75rem', fontSize: '1.05rem' }}>Novas Guerras</h3>
              <p>
                A prosperidade de Khonum revelou-se uma faceta da tirania. Enquanto as capitais brilhavam, o crescimento
                desenfreado pariu periferias esquecidas, onde a criminalidade e a influência demoníaca encontraram solo
                fértil na miséria. Foi neste cenário que a infâmia se institucionalizou: uma rede de escravidão estendeu-se
                pelo continente, visando principalmente o povo Drovenar, cujos corpos robustos foram reduzidos a
                ferramentas de extração e construção por nobrezas decadentes.
              </p>
              <p>
                Thayta, o colosso portuário, tornou-se o epicentro dessa podridão. Superada em riqueza apenas pela
                opulência de Fangi, a nobreza thaytense entregou-se à corrupção absoluta. Firmaram pactos sombrios com os
                senhores de Swajax para o tráfico de entorpecentes e consolidaram um mercado de escravos sob contratos de
                servidão que, por gerações, sugaram a alma dos trabalhadores, transformando cidadãos em meras propriedades.
              </p>
              <p>
                Mas o ferro, quando muito fustigado, acaba por ferir a mão que o golpeia. A opressão gerou a Revolta, e a
                Revolta pariu a Guerra de Libertação. Assim nasceu Fasu.
              </p>
              <p>
                O conflito entre Fasu e Thayta não foi apenas uma batalha de espadas, mas um choque de potências e
                ideologias que durou anos. De um lado, Thayta contava com o apoio financeiro e logístico de Fangi e
                Sekung, cujos cofres dependiam da manutenção da mão de obra escrava. Do outro, a resistência de Fasu
                encontrou aliados improváveis: a generosidade agrícola de Khasil, o apoio tático de Deruth e até mesmo a
                interferência oportunista das sombras de Swajax.
              </p>
              <p>
                A maré da guerra, contudo, só virou com a chegada de um comboio Sharusahk. A dança marcial daquelas lâminas
                do deserto provou ser o pesadelo dos exércitos mercenários de Thayta. Com a vitória conquistada pelo aço
                Sharusahk, Fasu consolidou-se como um reino sem coroas, uma nação majoritariamente Drovenar que acolhe
                todos os que buscam refúgio da tirania. Hoje, Fasu não possui um rei, sendo representada pelo vigor de
                Deegan Gaunt, enquanto a linhagem Sharusahk que decidiu ficar permanece como a espinha dorsal da defesa,
                atuando também no comércio local.
              </p>
              <p>
                As montanhas de Salhazy, outrora a muralha contra o Oriente, tornaram-se o palco de uma guerra fratricida
                movida por boatos e sombras. O reino de Fangi, encravado nas encostas sulistas da cordilheira, viu sua
                hegemonia ameaçada pela crescente autonomia dos Drovenar. Sussurros de que Fangi utilizava mão de obra
                escrava Drovenar para escavar as entranhas de Salhazy espalharam-se como fogo em palha seca — uma acusação
                terrível que, embora jamais comprovada por olhos neutros, serviu como o estopim para o caos.
              </p>
              <p>
                Em uma manobra de retórica magistral e cruel, Fangi inverteu o jogo. Acusou o conselho de Naltra de
                conivência com a Ordem dos Kronagar, alegando que os Drovenar das montanhas estavam permitindo que as
                raízes da corrupção antiga florescessem em solo sagrado. O preconceito, adormecido desde a Grande
                Expansão, despertou com fúria. Fangi convenceu as coroas de Khonum de que Naltra era uma adaga apontada
                para o coração do Ocidente.
              </p>
              <p>
                A coalizão que se formou foi esmagadora. Sob a bandeira da &quot;purificação&quot;, uma aliança
                improvável marchou: o ouro de Sekung, as frotas de Thayta e Tahid, a decadência de Lhals, a autoridade de
                Rushoku, o gelo de Tsaicalam e as legiões profissionais de Lalmuthros e Fulchoi. Contra este maremoto de
                ferro, Naltra ergueu-se com o apoio dos libertos de Fasu, a lealdade agrária de Khasil e a letalidade de
                um único comboio Sharusahk.
              </p>
              <p>
                A resistência foi heroica, mas insuficiente. O ápice da tragédia foi a aniquilação total de Nehui. A
                cidade agrícola, o pulmão de Naltra, foi reduzida a cinzas e escombros, um ato que Fangi celebrou como uma
                vitória santa contra as sombras de Kronagar. Naltra perdeu a guerra, Nehui foi varrida do mapa, e o povo
                Drovenar viu-se novamente empurrado para o isolamento das encostas, enquanto os verdadeiros segredos das
                minas de Fangi permanecem ocultos sob a poeira da montanha.
              </p>
            </div>
          )}
        </div>
        {/* Capítulo 1: Era dos Divinos */}
        <div id="cap-era-divinos" className="card" style={{ background: 'var(--bg-card)', marginBottom: 0 }}>
          <button
            type="button"
            onClick={() =>
              setChaptersOpen((prev) => ({ ...prev, eraDivinos: !prev.eraDivinos }))
            }
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '0.75rem 0.75rem 0.5rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontWeight: 700 }}>Capítulo I — Era dos Divinos</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>
              {chaptersOpen.eraDivinos ? '▼' : '▶'}
            </span>
          </button>
          {chaptersOpen.eraDivinos && (
            <div style={{ padding: '0 0.75rem 0.75rem', lineHeight: 1.6 }}>
              <h3 id="sub-começo" style={{ marginTop: '0.75rem', fontSize: '1.05rem' }}>O começo</h3>
              <p>
                &quot;Antes que as linhagens de reis fossem escritas ou que o aço conhecesse o sangue, Khonum pertencia
                aos Deuses. Eles não apenas observavam; eles caminhavam entre nós. Para selar sua herança no reino dos
                mortais, quatro divindades plantaram o próprio cerne da existência, fazendo brotar árvores cujas raízes
                bebiam da magia pura e cujos galhos sustentavam o mundo material. Foi uma época de mansidão, um longo
                verão de paz que se estendeu por séculos, quando o florescer de uma folha carregava em si toda a
                promessa de um destino sem sombras.&quot;
              </p>
                  <p>
                    Mas nem todo sangue divino carregava a semente da criação. Houve uma Deusa, a mais jovem e amarga entre
                    os irmãos, cujas mãos eram estéreis e incapazes de fazer brotar sequer um ramo de vida. Consumida por
                    uma inveja que queimava mais que o sol, ela voltou seus olhos para as maravilhas que caminhavam sobre
                    Khonum e teceu sua traição no silêncio do abismo. Da essência bruta da Arcana, sem o sopro da alma ou o
                    vínculo com o barro do mundo, ela moldou os Demônios: legiões de pesadelos feitas de puro vazio.
                  </p>
                  <p>
                    Contudo, Khonum rejeitou os filhos da Invejosa. Por serem desprovidos de raízes na terra, a luz do dia
                    os transformava em cinzas e poeira ao menor toque. Foi então que a Deusa dos Demônios desferiu seu
                    golpe final contra o céu. Ela forjou quatro luas de prata pálida para vigiar o mundo e, com dedos de
                    sombra, costurou um véu de escuridão eterna, lançando-o sobre as copas das Árvores da Vida. Sob esse
                    manto de noite perpétua, o sol foi exilado e Khonum tornou-se o banquete dos sem-alma, um reino onde a
                    luz se tornou lenda e o medo passou a ser o único mestre.
                  </p>
                  <p>
                    O céu tornou-se um campo de matança quando o sangue dos deuses e o vazio dos demônios colidiram. Na
                    fúria daquela guerra sem nome, uma das quatro luas foi estilhaçada, seu cadáver de prata explodindo em
                    mil fragmentos que rasgaram o véu da escuridão eterna. Onde a sombra foi ferida, o sol voltou a
                    espreitar; o véu, agora rompido e em constante rotação, deu à luz ao dia e à noite, um ciclo de luz e
                    medo que Khonum nunca conhecera. Cada ponto de luz que hoje chamamos de estrela não é um adorno, mas
                    uma cicatriz — um buraco no manto da Deusa Traidora, prova do esforço desesperado dos Quatro para deter
                    a maré de pesadelos.
                  </p>
              <p>
                Mas a salvação teve um preço que as canções ainda lamentam. Para subjugar a Deusa dos Demônios e
                forçá-la a um sono sem sonhos, os Quatro Deuses tiveram que verter todo o seu poder em correntes de
                pura essência. Eles não apenas venceram; eles se sacrificaram. Enquanto a Deusa dos Sem-Alma dorme nas
                profundezas do abismo, os Quatro permanecem selados em sua própria vitória — carcereiros e
                prisioneiros de uma vigília eterna. Khonum foi deixada aos mortais, órfã de seus criadores, sob um céu
                que sangra luz através das feridas de uma guerra que ninguém pode esquecer.
              </p>

              <h3 id="sub-sirothval">Siroth&apos;Val, a Tempestade Eterna — Árvore da Vida dos Sharusahk</h3>
              <p>
                No coração do deserto setentrional ergue-se Siroth&apos;Val, a Sentinela de Navalhas. Não é uma árvore
                comum, mas um colosso de madeira antiga cujas folhas são finas e cruéis como o aço de uma espada; elas
                caem em uma dança perpétua, uma tempestade eterna que corta a carne de qualquer homem tolo o suficiente
                para se aproximar. Sob esse domo de lâminas vegetais, as raízes de Siroth&apos;Val mergulham nas
                profundezas da areia, bebendo de veios ocultos para transformar a desolação em um oásis de fertilidade
                impossível.
              </p>
              <p>
                Ali, os Sharusahk vivem em um banquete de isolamento. Alimentam-se das próprias folhas que os protegem
                e dos peixes que brilham no lago cristalino que abraça o tronco da Grande Árvore. É um solo sagrado e
                purificado; as águas de Siroth&apos;Val e a terra sob sua sombra recusam a mácula dos demônios,
                tornando a região o santuário mais impenetrável de Khonum. Todavia, toda proteção tem seu preço: o
                escudo que mantém o mundo lá fora é a mesma muralha que condena os Sharusahk ao cárcere. Eles são
                senhores de um paraíso, mas escravos de sua própria segurança, confinados para sempre sob o teto de
                aço caído de sua deusa viva.
              </p>

              <h3 id="sub-eldarae">Eldarae, o Pilar Celeste — Árvore da Vida dos Sylmari</h3>
              <p>
                Há montanhas em Khonum que empalidecem diante de Eldarae, o Pilar Celeste. Seus galhos não apenas tocam
                as nuvens, eles as governam, estendendo-se por léguas como os dedos de um deus colossal. A árvore é um
                mundo em si mesma, dividida por uma hierarquia de madeira e sangue: na plataforma inferior, entre o
                entrelaçar de galhos rudes, vivem os plebeus Sylmari, sob o bater de asas de demônios carniceiros;
                acima, em alturas onde o ar se torna rarefeito e puro, reside a alta nobreza, protegida pela distância
                do mundo profano.
              </p>
              <p>
                O tronco de Eldarae é um banquete vivo, onde cogumelos exóticos e feras raras prosperam, e de onde se
                extrai a seiva dourada — um néctar medicinal que é o orgulho da gastronomia Sylmari. No entanto,
                tamanha majestade projeta um castigo sobre a terra: a sombra eterna de Eldarae é um domínio de trevas
                onde o sol nunca toca o solo. Ali embaixo, no reino do eterno crepúsculo, os demônios caminham
                livremente mesmo ao meio-dia, tornando a base da árvore uma sentença de morte para qualquer um que ouse
                pisar no chão. Eldarae é uma fortaleza divina; sua própria altura é a muralha que mantém os horrores
                rastejantes à distância, oferecendo segurança apenas àqueles que nasceram para olhar o mundo de cima.
              </p>

              <h3 id="sub-ithilmar">Ithilmar, a Fonte Eterna — Árvore da Vida dos Vaelthor</h3>
              <p>
                No umbigo do mundo, onde as águas de Khonum convergem em um abraço eterno, repousa Ithilmar, a Fonte de
                Prata. Suas raízes não se escondem sob o solo; elas irrompem da terra como colinas colossais de madeira
                viva, formando uma muralha natural que encarcera o grande lago. Ao alvorecer de cada dia, a árvore
                exala uma névoa gélida e revigorante, um suspiro divino que alimenta as correntes e faz as águas
                dançarem. É das fissuras de seu tronco que o sangue do continente nasce: riachos que se tornam rios,
                serpenteando por léguas para dar de beber aos homens e às feras.
              </p>
              <p>
                Quando a lua reina, as folhas de Ithilmar brilham com um fulgor argênteo, refletindo-se no espelho
                d&apos;água como estrelas caídas. Entretanto, tamanha beleza é protegida por uma fúria líquida. As
                águas que vertem da Grande Árvore geram correntezas tão violentas e redemoinhos tão famintos que
                Ithilmar permanece um santuário isolado; um trono de pureza que o homem pode observar das margens, mas
                que poucos, ou nenhum, tiveram a glória de tocar. Ela é o coração pulsante de Khonum, e suas batidas
                são o rugido das águas que impedem o mundo de secar.
              </p>

              <h3 id="sub-durhmorr">Durh’Morr, a Guardiã das Montanhas — Árvore da Vida dos Drovenar</h3>
              <p>
                Nas entranhas da Cordilheira de Salhazy, onde os picos arranham o céu como dentes de pedra, repousa
                Durh’Morr, a Guardiã Silenciosa. Diferente das outras sentinelas de Khonum, ela não busca a glória das
                alturas; é uma árvore pequena e discreta, com pouco mais de dois metros, oculta em um oásis que o mundo
                esqueceu. Mas não se engane por sua estatura: suas raízes são os tendões da própria montanha,
                estendendo-se por toda a espinha dorsal do continente, moldando abismos e sustentando um império de
                túneis que nunca dorme.
              </p>
              <p>
                Esse labirinto subterrâneo é uma fera viva, cujas passagens mudam e se retorcem como serpentes,
                tornando qualquer mapa obsoleto antes mesmo da tinta secar. Nas profundezas onde a luz do sol é apenas
                uma lenda, a carne da montanha sangra minérios arcanos e pedras imbuídas de uma energia que faria um
                homem comum enlouquecer. Apenas os Drovenar, os filhos da pedra, conhecem os segredos para caminhar por
                esses corredores mutáveis. Durh’Morr não é apenas uma árvore; é o coração de um labirinto eterno,
                protegida por quilômetros de rocha sólida e pelo próprio fôlego da terra, permanecendo inalcançável
                para todos, exceto para aqueles que chamam a escuridão de lar.
              </p>

              <h3 id="sub-caos" style={{ marginTop: '0.75rem', fontSize: '1.05rem' }}>O Caos</h3>
              <p>
                Mas nem todo sangue divino carregava a semente da criação. Houve uma Deusa, a mais jovem e amarga entre
                os irmãos, cujas mãos eram estéreis e incapazes de fazer brotar sequer um ramo de vida. Consumida por
                uma inveja que queimava mais que o sol, ela voltou seus olhos para as maravilhas que caminhavam sobre
                Khonum e teceu sua traição no silêncio do abismo. Da essência bruta da Arcana, sem o sopro da alma ou o
                vínculo com o barro do mundo, ela moldou os Demônios: legiões de pesadelos feitas de puro vazio.
              </p>
              <p>
                Contudo, Khonum rejeitou os filhos da Invejosa. Por serem desprovidos de raízes na terra, a luz do dia
                os transformava em cinzas e poeira ao menor toque. Foi então que a Deusa dos Demônios desferiu seu
                golpe final contra o céu. Ela forjou quatro luas de prata pálida para vigiar o mundo e, com dedos de
                sombra, costurou um véu de escuridão eterna, lançando-o sobre as copas das Árvores da Vida. Sob esse
                manto de noite perpétua, o sol foi exilado e Khonum tornou-se o banquete dos sem-alma, um reino onde a
                luz se tornou lenda e o medo passou a ser o único mestre.
              </p>
              <p>
                O céu tornou-se um campo de matança quando o sangue dos deuses e o vazio dos demônios colidiram. Na
                fúria daquela guerra sem nome, uma das quatro luas foi estilhaçada, seu cadáver de prata explodindo em
                mil fragmentos que rasgaram o véu da escuridão eterna. Onde a sombra foi ferida, o sol voltou a
                espreitar; o véu, agora rompido e em constante rotação, deu à luz ao dia e à noite, um ciclo de luz e
                medo que Khonum nunca conhecera. Cada ponto de luz que hoje chamamos de estrela não é um adorno, mas
                uma cicatriz — um buraco no manto da Deusa Traidora, prova do esforço desesperado dos Quatro para deter
                a maré de pesadelos.
              </p>
              <p>
                Mas a salvação teve um preço que as canções ainda lamentam. Para subjugar a Deusa dos Demônios e
                forçá-la a um sono sem sonhos, os Quatro Deuses tiveram que verter todo o seu poder em correntes de
                pura essência. Eles não apenas venceram; eles se sacrificaram. Enquanto a Deusa dos Sem-Alma dorme nas
                profundezas do abismo, os Quatro permanecem selados em sua própria vitória — carcereiros e
                prisioneiros de uma vigília eterna. Khonum foi deixada aos mortais, órfã de seus criadores, sob um céu
                que sangra luz através das feridas de uma guerra que ninguém pode esquecer.
              </p>
            </div>
          )}
        </div>

        {/* Capítulo 2: Era dos Profetas */}
        <div
          id="cap-era-profetas"
          className="card"
          style={{ background: 'var(--bg-card)', marginTop: '1rem', marginBottom: 0 }}
        >
          <button
            type="button"
            onClick={() =>
              setChaptersOpen((prev) => ({ ...prev, eraProfetas: !prev.eraProfetas }))
            }
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '0.75rem 0.75rem 0.5rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontWeight: 700 }}>Capítulo II — Era dos Profetas</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>
              {chaptersOpen.eraProfetas ? '▼' : '▶'}
            </span>
          </button>
          {chaptersOpen.eraProfetas && (
            <div style={{ padding: '0 0.75rem 0.75rem', lineHeight: 1.6 }}>
              <h3 id="sub-sonhos-profeticos" style={{ marginTop: '0.75rem' }}>Sonhos Proféticos</h3>
              <p>
                As eras se arrastaram como sombras sobre Khonum, e o silêncio dos Quatro Deuses pesou sobre o mundo como
                uma lápide. Mas o divino, embora enclausurado, não estava mudo. Das fendas de sua prisão eterna, os
                Deuses teceram visões e as sopraram no éter, infiltrando-se no sono dos mortais. Assim despertaram os
                Profetas: homens e mulheres cujas mentes foram incendiadas por sonhos de uma glória esquecida.
              </p>
              <p>
                Foram eles que deram nome ao invisível. Através das imagens rúnicas que bailavam em seus sonhos, os
                Profetas decifraram a linguagem da Arcana, forjando o aço rúnico e as palavras de poder necessárias para
                que os povos de Khonum finalmente revidassem contra a maré de demônios que infestava a noite. Sob o
                cajado desses visionários, o medo deu lugar à fé. Uma língua comum nasceu, unindo raças de desertos,
                águas e montanhas sob um único propósito: a sobrevivência e a adoração.
              </p>
              <p>
                As crônicas dos Profetas tornaram-se o alicerce de lendas e religião. Eles não apenas fundaram credos;
                eles deram a Khonum uma bússola moral e o conhecimento para domar a arcana, incentivando os povos a
                abandonar suas fortalezas isoladas e marchar pelas terras selvagens. O mundo já não era mais apenas um
                campo de caça para os sem-alma, mas o solo sagrado onde os filhos dos Quatro buscariam recuperar o legado
                de seus pais adormecidos.
              </p>
              <p>
                Nas escrituras deixadas pelos Profetas, o destino das raças não é um acaso, mas as engrenagens de um plano
                divino para a libertação. Aos Sylmari, os Primogênitos das Alturas, foi confiado o fardo da sabedoria; a
                eles cabe decifrar os segredos mais profundos do éter e entalhar a Runa Final — a chave rúnica que, um
                dia, quebrará os grilhões da prisão eterna dos Deuses.
              </p>
              <p>
                Enquanto os escribas buscam a chave, os Sharusahk erguem-se como o aço de Khonum. Eles são os Guerreiros
                Divinos, a muralha de escudos e fúria que sustenta a linha de frente contra a maré infinita dos sem-alma.
                Na batalha que decidirá o fim dos tempos, será o sangue Sharusahk que garantirá que o mundo não caia antes
                da alvorada.
              </p>
              <p>
                Nas entranhas da terra, os Drovenar cumprem seu juramento através do fogo e do martelo. Mestres da Forja e
                da Engenharia, eles são os arquitetos da guerra; de suas bigornas nascerão não apenas as lâminas que
                cortam sombras, mas os colossos de ferro e madeira capazes de atravessar as extensões de Khonum até o
                Oriente longínquo, onde o cárcere divino aguarda.
              </p>
              <p>
                Por fim, aos Vaelthor foi dado o domínio sobre a essência e a carne. Alquimistas e curadores, eles buscam
                nos elementos a pureza da Arcana, destilando o elixir sagrado que fornecerá o poder necessário para ativar
                a Runa de Libertação.
              </p>
              <p>
                Sangue, suor e espírito se unem: quatro povos, uma única vontade. Pois somente quando a força Drovenar
                encontrar a fé Sharusahk, e a alquimia Vaelthor se fundir ao saber Sylmari, é que as garras da Deusa dos
                Demônios serão partidas, pondo fim, de uma vez por todas, à agonia dos deuses e ao terror da noite.
              </p>

              <h3 id="sub-viagem-profetas" style={{ marginTop: '0.75rem', fontSize: '1.05rem' }}>A Viagem dos Profetas</h3>
              <p>
                Seguiu-se então a Era da Grande Peregrinação, quando os quatro Profetas cruzaram as fronteiras do mundo
                conhecido. Durante anos sem conta, eles caminharam por desertos de vidro e picos de gelo, deixando em cada
                rastro uma lenda e em cada fogueira uma promessa. Foi sob o cajado desses andarilhos que as línguas
                bárbaras se calaram para dar lugar a um idioma comum, e os dedos rudes dos mortais aprenderam a traçar as
                primeiras runas de poder. Por toda Khonum, vilarejos brotaram como sementes após a chuva, mas nenhum solo
                se provou tão fértil para a ambição dos homens quanto as terras que hoje chamamos de Rushoku.
              </p>
              <p>
                Rushoku, o Reino Primogênito, ergueu-se sobre o local onde os quatro Profetas se encontraram pela primeira
                vez. Enquanto Naltra e Karningul ainda eram meros aglomerados de cabanas e barcos, Rushoku já respirava o
                destino do mundo. Foi ali, naquele solo sagrado, que os quatro grandes visionários uniram suas mãos e
                juraram a Marcha para o Oriente. Rushoku não foi apenas uma cidade; foi o primeiro bastião de esperança, a
                forja onde a vontade das raças foi temperada para a libertação dos Deuses e o ponto de partida para a
                jornada que rasgaria o véu da noite para sempre.
              </p>

              <h3 id="sub-corrupcao" style={{ marginTop: '0.75rem', fontSize: '1.05rem' }}>A corrupção</h3>
              <p>
                Contudo, onde há luz divina, a sombra da Invejosa espreita. Antes que o primeiro passo da Marcha para o
                Oriente fosse dado, a Deusa dos Demônios teceu uma teia de pesadelos e sussurros corruptos, infiltrando-se
                na mente de Lohqi Kronagar, o Profeta dos Drovenar. O que deveria ser o arquiteto da salvação tornou-se o
                mestre da traição. Consumido por uma loucura arcana que não lhe pertencia, Lohqi voltou-se contra seus
                irmãos de fé, mergulhando o Reino Primogênito em um batismo de sangue conhecido como a Guerra dos Arcanos.
              </p>
              <p>
                Naquela carnificina de feitiçaria e aço, o mundo perdeu seus guias: Jawyn, a voz dos Vaelthor, e Melinda, a
                lâmina dos Sharusahk, tombaram sob a traição de Kronagar, que pereceu junto a eles em meio às ruínas de
                sua própria honra. Dessa tragédia, restou uma ferida que nunca cicatrizou: a Ordem Kronagar, um culto
                sombrio que, até os dias de hoje, adora o vazio dos demônios e assombra as estradas de Khonum com o nome
                de seu profeta caído.
              </p>
              <p>
                Restou apenas Merlyn, o Profeta dos Sylmari, para carregar o peso de um mundo partido. Sob sua guarda
                solitária e cansada, Rushoku floresceu, consolidando-se como o trono de pedra de Khonum, uma fortaleza de
                ordem em um continente ferido. Somente quando sentiu que a fundação era sólida o suficiente para resistir
                às tempestades, o último dos visionários retornou ao abraço das alturas de Eldarae, onde o tempo
                finalmente cobrou seu preço e ele entregou sua alma ao descanso em uma cama de velhice, deixando para trás
                um mundo de reinos, mas um futuro de incertezas.
              </p>
            </div>
          )}
        </div>
      </div>
      <p className="dashboard-intro">
        Navegue pelos registros do reino. Cada seção permite listar, filtrar, criar e editar.
      </p>
      <div className="dashboard-grid">
        {sections.map(({ to, title, desc }) => (
          <Link key={to} to={to} className="dashboard-card card">
            <h3>{title}</h3>
            <p>{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
