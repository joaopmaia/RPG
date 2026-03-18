import { Link } from 'react-router-dom'

export default function GuiasGlossario() {
  return (
    <div className="regras-doc">
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/guias">← Guias</Link>
      </nav>
      <h1>Glossário de Khonum</h1>
      <p style={{ color: 'var(--parchment-dark)', marginBottom: '1.25rem' }}>
        Termos e nomes próprios que aparecem na história do mundo de Khonum, organizados para consulta rápida.
      </p>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h2 style={{ marginTop: 0 }}>Lugares e Árvores Divinas</h2>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Khonum</strong>: o mundo onde se passam as Crônicas. Continente sustentado pelas Árvores da Vida e permeado pela Arcana.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Siroth&apos;Val</strong>: também chamada de <em>Tempestade Eterna</em> ou <em>Sentinela de Navalhas</em>. Árvore da Vida dos Sharusahk, um colosso em pleno deserto cercado por folhas cortantes e um oásis protegido contra demônios.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Eldarae</strong>: o <em>Pilar Celeste</em>, Árvore da Vida dos Sylmari. Tão alta que ultrapassa montanhas e governa nuvens, com camadas sociais divididas em plataformas de galhos e uma base mergulhada em trevas onde demônios caminham livremente.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Ithilmar</strong>: a <em>Fonte Eterna</em> ou <em>Fonte de Prata</em>, Árvore da Vida dos Vaelthor. Fica no encontro das águas de Khonum, de onde nascem rios que alimentam o continente; é cercada por correntes e redemoinhos quase intransponíveis.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Durh’Morr</strong>: a <em>Guardiã das Montanhas</em>, pequena Árvore da Vida dos Drovenar oculta na Cordilheira de Salhazy. Suas raízes formam um labirinto de túneis mutáveis que só os Drovenar conseguem navegar com segurança.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Cordilheira de Salhazy</strong>: cadeia de montanhas que abriga Durh’Morr e vastos túneis subterrâneos repletos de minérios arcanos e passagens vivas em constante mudança.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Naltra</strong>: um dos reinos Drovenar, ergue-se entre túneis e cavernas sob a influência de Durh’Morr, sustentado pela mineração e pela engenharia subterrânea.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Karningul</strong>: reino Sylmari ligado a Eldarae. Conhecido por suas plataformas elevadas, salões de madeira viva e pelo domínio de runas e seiva dourada.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Rushoku</strong>: o Reino Primogênito dos Vaelthor, erguido onde os quatro Profetas se encontraram. Primeiro bastião de esperança e ponto de partida da Marcha para o Oriente.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Shientara</strong>: ilha ao sul das terras Sylmari, único porto aberto ao mundo exterior em tempos de isolamento de Eldarae. Centro de intercâmbio comercial e cultural controlado pelas castas superiores.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Suyeki</strong>: assentamento fortificado sob domínio de Rushoku, construído para proteger passagens estratégicas de Naltra e servir como bastião militar no controle das rotas montanhosas.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Deruth</strong>: posto avançado militar ligado a Rushoku e Naltra, erguido sobre a região onde repousa o túmulo de Lohqi Kronagar. Guarda as entradas para as ruínas de Khorgan-Dûrmak.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Khorgan-Dûrmak</strong>: complexo rúnico e túmulo de Lohqi Kronagar. Labirinto dimensional de engenharia rúnica avançada que atrai aventureiros em busca de relíquias e segredos do passado.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Vale dos Gorvash</strong>: desfiladeiro que funciona como única passagem entre o Oriente vulcânico e as planícies férteis do Ocidente. Rota usada pela horda de Xel’Gur para invadir Khonum.
          </li>
        </ul>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Povos</h2>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Sharusahk</strong>: esguios e ágeis, com membros alongados e rostos afilados. Pele em tons arenosos, do dourado pálido ao bronze queimado; olhos puxados e felinos, adaptados a tempestades de areia. Vestem tecidos leves e resistentes ao calor e costumam carregar pequenas lâminas curvas para combate próximo. Vivem ligados a Siroth&apos;Val, em um oásis isolado protegido por folhas-lâmina e águas purificadas.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Sylmari</strong>: corpos esguios, traços finos e movimentos graciosos. Pele em tons suaves de dourado ou prateado com nuance esverdeada; olhos intensos em azuis profundos ou verdes luminosos; orelhas alongadas e aguçadas; cabelos longos e sedosos em tons loiros, ruivos, prateados ou levemente rosados. Vestem túnicas leves e ornamentos de fibras vegetais, em harmonia com Eldarae e o ambiente natural.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Vaelthor</strong>: traços equilibrados, corpos proporcionais que variam de esguios a robustos. Pele em ampla gama de tonalidades naturais, adaptadas às planícies e florestas. Olhos de cores variadas, expressando forte carga emocional. Cabelos curtos ou longos, lisos ou ondulados, refletindo a herança dos antepassados. Vestem linho, couro e peles, adequando-se ao clima das regiões que habitam e à proximidade de Ithilmar.</li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Drovenar</strong>: baixos e robustos, com músculos densos e resistência inigualável. Mãos e pés grossos, adaptados a cavar e escalar. Barbas únicas, lembrando filamentos rochosos; pele acinzentada ou terrosa. Suas vestes combinam tecidos reforçados com minérios, apropriados para a vida nas cavernas e túneis de Durh’Morr.</li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Gorvash</strong>: imensos e extremamente musculosos, de pele dura e avermelhada, como se moldados pela lava. Não possuem cabelos ou pêlos corporais; a pele resistente racha com o calor intenso, formando cicatrizes naturais. Mandíbulas largas, caninos afiados e proeminentes; olhos que variam do vermelho ao púrpura ou preto. Muitas vezes associados a rituais de combate e instrumentos de percussão.</li>
        </ul>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h2 style={{ marginTop: 0 }}>Figuras e Ordens</h2>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Lohqi Kronagar</strong>: Profeta dos Drovenar. Corrompido pela Deusa dos Demônios, traiu os demais Profetas e deu início à Guerra dos Arcanos em Rushoku. Seu nome inspira a Ordem Kronagar.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Jawyn</strong>: voz dos Vaelthor entre os Profetas. Morto na Guerra dos Arcanos pela traição de Kronagar.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Melinda</strong>: lâmina dos Sharusahk, Profeta-guerreira que tombou junto a Jawyn e Kronagar nas ruínas de Rushoku.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Merlyn</strong>: Profeta dos Sylmari e último sobrevivente dos quatro. Após consolidar Rushoku como trono de pedra de Khonum, retornou a Eldarae, onde morreu de velhice.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Ordem Kronagar</strong>: culto sombrio que venera o vazio dos demônios e o legado distorcido de Lohqi Kronagar. Conhecido por assombrar estradas e conspirar nas sombras de Khonum.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Guilda dos Mensageiros</strong>: instituição fundada em Rushoku para caçar remanescentes da Ordem Kronagar. Com o tempo, tornou-se responsável por comunicação, escolta, caça a demônios e logística entre os reinos.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Xel’Gur</strong>: líder dos Gorvash, colosso de força e astúcia responsável por unificar as hordas orientais e conduzi-las através do Vale dos Gorvash em direção ao Ocidente.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Última Resistência</strong>: grupo lendário de treze heróis (sete Vaelthor, três Sylmari, um Drovenar, um Sharusahk e um herói de identidade desconhecida) responsável pela queda de Xel’Gur e ruptura da horda Gorvash.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Rushoko Valerius</strong>: herói Vaelthor conhecido como Rushoko, guerreiro de força e determinação inabaláveis que empunhava a espada lendária <em>Luz da Alvorada</em>. Desferiu o golpe final em Xel’Gur, encerrando a ameaça Gorvashica. Após a guerra, herdou o reino dos Vaelthor, tornando-se símbolo de esperança e liderança.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Galte Aethelflaed</strong>: heroína Vaelthor, arcanista de intelecto afiado e vasto conhecimento demoníaco. Suas runas devastadoras foram cruciais contra o exército Gorvash. Após a guerra, consolidou o reino de Galte, famoso por seus poderosos arcanistas e estudos sobre demônios.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Fangi Drakos</strong>: herói Vaelthor, mestre espadachim e líder nato. Tombou segurando sozinho um exército Gorvash para que os demais heróis pudessem enfrentar Xel’Gur. Sua família fundou o reino de Fangi, bastião de força e honra.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Fuchoi Helena</strong>: heroína Vaelthor, arqueira ágil e astuta, uma das três que enfrentaram um dragão inferior servo dos Gorvash. Fundou o reino de Fuchoi, conhecido por seu exército poderoso e defesa implacável. Amiga leal de Fangi, ajudou seus filhos a erguer o reino de Fangi em honra ao guerreiro caído.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Lalmuthros Leon</strong>: herói Vaelthor, guerreiro de força bruta e mestre do machado. Abateu o dragão inferior com o golpe final. Fundou o reino de Lalmuthros, aliado de Fuchoi, formando um cinturão militar que protege o estreito entre o Ocidente e o Oriente.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Khasil Brianna</strong>: heroína Vaelthor, maga de domínio arcano incomparável. Suas magias foram cruciais tanto contra o exército Gorvash quanto na luta contra o dragão inferior. Após a guerra, fundou o reino de Khasil.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Thayta Seawhisper</strong>: heroína Vaelthor, alquimista de coração puro e talento excepcional. Criadora de poções e elixires decisivos na guerra; sacrificou-se para salvar os companheiros. Seus filhos fundaram a cidade marítima de Thayta, importante centro de comércio e navegação.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Morgana Shientara</strong>: heroína Sylmari, maga de poder arcano incomparável especializada em runas de proteção. Defendeu Rushoko da devastação Gorvash. Fundou o reino de Shientara, principal porto Sylmari, famoso por sua beleza, cultura e comércio.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Delendir Silverbow</strong>: heroína Sylmari, arqueira de precisão e agilidade excepcionais, capaz de disparar flechas imbuídas com runas Sylmari. Cegou um dos olhos de Xel’Gur na batalha final, abrindo caminho para o golpe de Rushoko. Fundou a cidade de Delendir, centro avançado de alquimia, inspirada por sua admiração e paixão secreta pela alquimista Vaelthor Thayta.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Valarien Songweaver</strong>: herói Sylmari, bardo que descobriu a arte de controlar demônios através da música. Morto em combate por Gorvashs que tentavam impedir seu domínio sobre as criaturas. A cidade-ilha de Valarien foi fundada em sua homenagem, famosa por seus vinhos raros e difíceis de obter devido às correntes marítimas perigosas.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Naltra Stoneforge</strong>: heroína Drovenar, ferreira lendária capaz de forjar armas e armaduras inigualáveis. Seus equipamentos foram decisivos contra o exército Gorvashico. Morreu defendendo os companheiros em batalha. O reino Drovenar de Naltra leva seu nome e é reconhecido por suas forjas e tecnologia.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Jarakh Sandstalker</strong>: herói Sharusahk, guerreiro de agilidade e ferocidade incomparáveis. Considerado uma vergonha por seu povo por cair em combate, mas reconhecido como o único capaz de enfrentar Xel’Gur sozinho. Seu duelo prolongado permitiu que Thayta curasse os heróis, garantindo a vitória final mesmo à custa de sua própria vida.
          </li>
        </ul>
      </div>

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/">← Voltar ao início</Link>
      </p>
    </div>
  )
}

