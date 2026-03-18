import { Link } from 'react-router-dom'

export default function RegrasRunas() {
  return (
    <div className="regras-doc">
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/regras">← Regras</Link>
      </nav>

      <h1>Arcana e Runas: O Tecido do Divino</h1>
      <p>
        Enquanto o olho nu percebe montanhas, florestas e cidades, existe uma camada invisível, uma energia fundamental que permeia a realidade: a <strong>Arcana</strong>. Este não é apenas um tipo de energia; é a própria essência do poder divino, uma força latente que molda a existência.
      </p>
      <p>
        A Arcana é a manifestação da vontade divina no mundo material, um poder bruto, puro e, em sua forma original, caótico. No entanto, através do estudo e da arte, as raças de Khonum encontraram uma forma de canalizar e dar propósito a essa energia inata: as <strong>Runas</strong>.
      </p>

      <h2 id="o-que-e-arcana">O que é Arcana?</h2>
      <p>
        Arcana é o motor de quase toda a manifestação sobrenatural. Pode ser entendida como o &quot;combustível&quot; do poder. Sem Arcana, as Runas são meros símbolos inertes. Quando imbuídas de Arcana, elas se tornam veículos para a criação de efeitos que desafiam a lógica e a natureza.
      </p>

      <h2 id="extracao">A Extração da Arcana: Fontes e Filosofias</h2>
      <p>
        A Arcana permeia todo o mundo de Khonum, mas a capacidade de concentrá-la e extraí-la para o uso rúnico não é um processo trivial. Cinco métodos principais foram dominados pelas raças para obter e utilizar esse poder vital:
      </p>
      <ul>
        <li><strong>Arcanita (O Coração da Montanha):</strong> Pedra única e extremamente valiosa, extraída exclusivamente das profundezas das cordilheiras de Salhazy. Estas montanhas são sagradas, pois abrigam a Árvore Divina dos Drovenar.</li>
        <li><strong>Elixires de Animais Arcanos (A Mutação Efêmera):</strong> Certos animais, por viverem em áreas de alta concentração arcana ou sofrerem mutações, adquiriram a capacidade de gerar arcana em seus órgãos. Elixires potentes são destilados de partes específicas desses animais.</li>
        <li><strong>Partes de Demônios (O Caos Concentrado):</strong> Demônios são literalmente seres feitos de Arcana condensada e caótica. Suas partes (como chifres, sangue ou corações) são fontes puras e poderosas dessa energia.</li>
        <li><strong>Partes de Árvores Divinas (O Nexus da Vida):</strong> Existem quatro Árvores Divinas no mundo de Khonum (uma para Sylmari, Drovenar, Vaelthor e Sharusahk), ligadas diretamente à fonte primária de Arcana. Suas partes são imbuídas de um poder arcano ligado à essência da vida.</li>
        <li><strong>Arcanistas Nascidos (O Dom Inato):</strong> O fenômeno mais raro e pessoal. Em casos isolados, um ser nasce com uma conexão tão profunda com a arcana que seu próprio corpo funciona como um gerador de Arcana.</li>
      </ul>

      <h2 id="sistema-runico">O Sistema Rúnico: Linguagem do Poder</h2>
      <p>
        Se a Arcana é a força bruta que flui através das dimensões, as Runas são a gramática sagrada que permite ao mortal ditar como essa energia deve se moldar. Escrever uma Runa não é meramente desenhar um símbolo; é impor uma vontade sobre a realidade, traduzindo o invisível em fenômenos tangíveis.
      </p>
      <p>
        A arquitetura rúnica é sustentada por <strong>Seis Essências Elementares</strong>, fundamentadas em três <strong>Eixos de Oposição</strong>. Estes eixos representam o equilíbrio perfeito e antagônico do universo. Devido à sua natureza de anulação mútua, elementos que habitam o mesmo Eixo jamais podem ser combinados na mesma matriz rúnica; tentar fundi-los é convidar o colapso arcano e a dissipação imediata da energia.
      </p>
      <p><strong>Os Eixos de Oposição e as Essências:</strong></p>
      <ul>
        <li>Eixo 1: <strong>Genia</strong> ↔ <strong>Degila</strong></li>
        <li>Eixo 2: <strong>Reetear</strong> ↔ <strong>Arunalt</strong></li>
        <li>Eixo 3: <strong>Saltrat</strong> ↔ <strong>Pascalia</strong></li>
      </ul>

      <h2 id="categorias">As Três Categorias de Runas</h2>
      <p>
        O domínio rúnico não é apenas uma questão de poder, mas de compreensão gramatical. À medida que o Arcanista avança em seu estudo, ele aprende a combinar as Essências para criar efeitos mais complexos. A progressão rúnica é dividida em três níveis de complexidade, onde o custo de Arcana aumenta conforme mais elementos são tecidos na mesma matriz.
      </p>
      <ol>
        <li><strong>Runas Básicas (Essência Única):</strong> Utilizam apenas uma das seis Essências. Por serem a forma mais pura e simples, <strong>não exigem rolagem de dados para ativação</strong>; o Arcanista gasta <strong>3 pontos de Arcana</strong> e o efeito ocorre automaticamente. Exigem contato direto na maioria dos casos.</li>
        <li><strong>Runas Intermediárias (Harmonia de Eixos):</strong> Combinam duas Essências de Eixos diferentes. Exigem <strong>6 pontos de Arcana</strong>. A rolagem define a eficácia do disparo (acerto), a dificuldade para o inimigo resistir ou a precisão do efeito. A falha no dado não significa que a runa falhou em existir, mas que o resultado prático foi ineficaz ou evitado.</li>
        <li><strong>Runas Avançadas (A Trindade Rúnica):</strong> Combinação de três Essências, uma de cada Eixo. Exigem <strong>9 pontos de Arcana</strong>. Representam milagres ou cataclismos. A rolagem dita a magnitude do sucesso.</li>
      </ol>

      <h2 id="manifestacao">Regras de Manifestação Rúnica</h2>
      <p>
        A execução da runa em Khonum exige conhecimento (Perícia Rúnicos) e poder (Arcana).
      </p>

      <h3>I. Aprendizagem Rúnica (Perícia: Rúnicos)</h3>
      <p>A Perícia Rúnicos representa o conhecimento e a capacidade do Arcanista de traçar, harmonizar e entender os elementos arcanos.</p>
      <ul>
        <li><strong>Cada ponto em Rúnicos:</strong> O jogador aprende um Elemento Base Novo ou uma Combinação (contanto que possua os elementos base necessários para essa combinação).</li>
        <li><strong>Aprendizagem:</strong> Aprender um Elemento Base ou uma Combinação concede acesso a todas as Runas pertencentes a esse Elemento ou Combinação (todas as runas estão descritas na lista em <Link to="/runas">Runas</Link>).</li>
        <li><strong>Nível 8 de Rúnicos (Máximo):</strong> Ao atingir o nível máximo, o jogador pode escolher um Elemento. Automaticamente, ele aprende esse elemento e todas as combinações possíveis com os outros elementos que ele já domina.</li>
      </ul>
      <p><em>Observação:</em> O conhecimento da Runa permite o acesso, mas a Runa deve ser escrita ou encrustada em um equipamento para ser utilizada.</p>

      <h3>II. Ativação Rúnica (Rolagens de Ataque/Efeito)</h3>
      <p>Para manifestar o poder de uma Runa, é necessário ativá-la com Arcana suficiente.</p>

      <h3>Tipos de Efeitos e Contramedidas</h3>
      <p>A natureza da Runa determina a Rolagem de Resistência do alvo ou a Rolagem de Defesa com um Escudo:</p>
      <div className="card" style={{ overflowX: 'auto', marginBottom: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-frame)' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Efeito da Runa</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Rolagem de Resistência (Alvo)</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Rolagem de Dano/Efeito (Conjurador)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-frame)' }}>
              <td style={{ padding: '0.5rem' }}>1. Dano Direto</td>
              <td style={{ padding: '0.5rem' }}>Esquiva: Destreza + Esquiva + 1d10. Escudo: Rolagem de Escudo.</td>
              <td style={{ padding: '0.5rem' }}>Dano Base + Espírito + Arcanum</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-frame)' }}>
              <td style={{ padding: '0.5rem' }}>2. Status Mental</td>
              <td style={{ padding: '0.5rem' }}>Resistência Mental: Espírito + Mentalidade + 1d10. Escudo: Rolagem de Escudo.</td>
              <td style={{ padding: '0.5rem' }}>Status: alucinação, aflição, desolado, confuso, cansado, berserk</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-frame)' }}>
              <td style={{ padding: '0.5rem' }}>3. Status Físico</td>
              <td style={{ padding: '0.5rem' }}>Resistência Física: Vigor + Resistência + 1d10. Escudo: Rolagem de Escudo.</td>
              <td style={{ padding: '0.5rem' }}>Status: sangramento, paralisia, veneno, queimadura, congelamento, petrificado</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-frame)' }}>
              <td style={{ padding: '0.5rem' }}>4. Escudos</td>
              <td style={{ padding: '0.5rem' }}>Contramedida ativa ao ataque inimigo.</td>
              <td style={{ padding: '0.5rem' }}>Rolagem de Escudo: Inteligência + Rúnicos + 1d10</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem' }}>5. Penalidade</td>
              <td style={{ padding: '0.5rem' }}>Teste Específico: Atributo Afetado + 1d10 (para superar a penalidade).</td>
              <td style={{ padding: '0.5rem' }}>Penalidade = Arcanum do conjurador</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="sinergia">A Sinergia entre Matéria e Runa</h2>
      <p>
        Nem todo objeto possui a densidade espiritual necessária para conter a energia vibrante de uma Runa. A estabilidade de uma matriz rúnica depende diretamente da qualidade do material que serve como hospedeiro. Materiais brutos ou de baixa pureza entram em colapso se submetidos a energias muito complexas.
      </p>
      <p>
        Para determinar o valor de um Artefato Rúnico, multiplica-se o valor total do item (após o modificador de material) pelo nível da runa desejada:
      </p>
      <ul>
        <li>Runa Básica: Multiplicador <strong>x5</strong></li>
        <li>Runa Intermediária: Multiplicador <strong>x20</strong></li>
        <li>Runa Avançada: Multiplicador <strong>x50</strong></li>
      </ul>
      <p><strong>Limites de Estabilidade:</strong></p>
      <ul>
        <li><strong>Ranks F e E:</strong> Comportam apenas Runas Básicas. Tentar traçar runas superiores resulta na destruição imediata do objeto.</li>
        <li><strong>Ranks D e C:</strong> Comportam Runas Básicas e Intermediárias.</li>
        <li><strong>Ranks B, A e S:</strong> Únicos capazes de sustentar Runas Avançadas, além de todos os níveis inferiores.</li>
      </ul>

      <h2 id="basicas">Runas Básicas</h2>
      <p>Utilizam uma essência. Custo: 3 de Arcana. Ativação automática, sem rolagem. Operam por toque direto.</p>

      <h3>Essência Genia</h3>
      <p>Representam a energia térmica. Exigem 3 de Arcana, atuam instantaneamente por toque.</p>
      <ul>
        <li><strong>O Toque de Vulcan:</strong> Gera fricção energética que eleva a temperatura. Utilidade: cauterizar, ferver água, acender tochas. Em combate (contato): 1d4 de dano + status Queimadura.</li>
        <li><strong>Fulgor Eterno:</strong> Converte Arcana em luminescência constante. Emite luz estável por 1 hora, sem fumaça nem consumo de oxigênio.</li>
        <li><strong>O Chamado do Abismo:</strong> Vibração térmica &quot;caótica&quot; que atrai demônios. Durante 1 hora atua como isca irresistível para criaturas do Vazio.</li>
        <li><strong>Selo de Repúdio:</strong> Emite calor seco e radiação espectral desconfortável para demônios. Durante 1 hora, criaturas abissais de baixo nível evitam o perímetro.</li>
        <li><strong>Trilhas Incandescentes (Runa de Conjunto):</strong> Duas matrizes entrelaçadas. Ao ativar, um feixe de luz aponta na direção da contraparte. Funciona como bússola mística por 1 hora.</li>
      </ul>

      <h3>Essência Degila</h3>
      <p>Preservação e resfriamento. 3 de Arcana, toque direto, sem rolagem.</p>
      <ul>
        <li><strong>Passo de Lótus:</strong> Torna o objeto hidrofóbico. Permite caminhar sobre líquidos por 1 hora.</li>
        <li><strong>Cristalização de Aluviana:</strong> Purifica líquidos ao toque: decantação de impurezas, anulação de toxinas. Transforma em água potável.</li>
        <li><strong>Destilação Peçonhenta:</strong> Concentra impurezas em toxina fria. Toque: 1d4 de dano + Envenenamento. Causa Doenças (nível 1) em 3 turnos se não curado.</li>
        <li><strong>Selo da Mente Serena:</strong> Estase que desacelera batimentos e adrenalina. Encerra instantaneamente o status Enfurecido (Berserker).</li>
        <li><strong>Sopro da Geada:</strong> Ao tocar líquido (até barril pequeno), congela instantaneamente. Ao tocar criatura queimada, neutraliza um acúmulo de Queimadura.</li>
      </ul>

      <h3>Essência Reetear</h3>
      <p>Ar, som e leveza. 3 de Arcana, toque ou sintonia, sem rolagem.</p>
      <ul>
        <li><strong>Pena de Zephyrus:</strong> Altera interação com a gravidade. 1h: imune a dano de queda, plane suave; reduz peso de equipamento.</li>
        <li><strong>Ressonância de Ecos (Conjunto):</strong> Duas runas: som emitido numa é transmitido à outra. Comunicação verbal a quilômetros.</li>
        <li><strong>Véu de Névoa Cinzenta:</strong> Expele fumaça densa. +1d4 em testes de Furtividade dentro da área.</li>
        <li><strong>Pulso Estilhante:</strong> Toque: descarga de vibração sônica. Causa status Atordoado (Stun) por 1 turno.</li>
        <li><strong>Filtro de Aether (Conjunto):</strong> Uma runa suga ar (fumaça, gases, água); outra expele ar purificado. Respirar em ambientes letais ou debaixo d&apos;água. 1h.</li>
      </ul>

      <h3>Essência Arunalt</h3>
      <p>Substância física, vitalidade orgânica, resiliência. 3 de Arcana, toque direto.</p>
      <ul>
        <li><strong>Alento do Florescer:</strong> Cura: restaura 1d4 de HP instantaneamente ao toque.</li>
        <li><strong>Casca de Ferro:</strong> Invólucro arcano translúcido. Mitiga 1d4 de dano do próximo ataque recebido. Ativa até ser atingido uma vez.</li>
        <li><strong>Restauração Material:</strong> Restaura 1d4 de Durabilidade de equipamento (madeira, couro, osso, metal) ao toque.</li>
        <li><strong>Murmúrios da Clorofila:</strong> Conexão psíquica com plantas. Traduz vibrações do vegetal (sede, calor, intrusos, saúde do solo).</li>
        <li><strong>Selo da Cicatriz:</strong> Remove um acúmulo do status Ferido (devolve Vida Máxima). Não restaura HP.</li>
      </ul>

      <h3>Essência Saltrat</h3>
      <p>Psique e energia vital. 3 de Arcana, toque ou sintonia.</p>
      <ul>
        <li><strong>Claridade de Selene:</strong> Dissipa status Confusão e Alucinação ao tocar a têmpora.</li>
        <li><strong>Estigma de Constelação (Conjunto):</strong> Runa no ser + cópia consigo. Ao se aproximar do marcado, as runas brilham. Uso: identificação por mensageiros.</li>
        <li><strong>Fúria das Plêiades:</strong> Toque: sobrecarga emocional. Alvo recebe status Enfurecido (Berserker).</li>
        <li><strong>Eco Psíquico:</strong> Toque: descarga dissonante na mente. Alvo sofre status Confusão.</li>
        <li><strong>Transcendência Estelar:</strong> Consciência desvincula da carne. Projeção Astral por 1h. Corpo fica inerte e vulnerável.</li>
      </ul>

      <h3>Essência Pascalia</h3>
      <p>Dimensões e ancoragem no espaço-tempo. 3 de Arcana, selamento ou campos de detecção.</p>
      <ul>
        <li><strong>O Tríptico de Ferro (Conjunto):</strong> Três matrizes: duas em partes móveis (ex.: tampa e base do baú) selam com &quot;tranca quântica&quot;; a terceira é a chave. 3 AP para trancar, 3 para destrancar.</li>
        <li><strong>Perímetro Vibrante:</strong> Quatro ou mais runas delimitam área. Qualquer ser/objeto que atravesse faz as runas vibrarem (alerta).</li>
        <li><strong>Espelho do Horizonte:</strong> Registra luz e geometria à frente; depois projeta holograma. &quot;Câmera rúnica&quot;.</li>
        <li><strong>Golpe de Singularidade:</strong> Em arma de curto alcance: distorce espaço no golpe. +1d4 de dano extra.</li>
        <li><strong>Lente do Vácuo:</strong> Dobra trajeto da luz. Observar através = luneta mística, ver detalhes à distância.</li>
      </ul>

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/regras/runas#intermediarias">▼ Runas Intermediárias</Link>
        {' · '}
        <Link to="/runas">Lista de Runas</Link>
      </p>

      <h2 id="intermediarias">Runas Intermediárias</h2>
      <p>Custo: 6 de Arcana. Rolagem define eficácia, dificuldade de resistência ou magnitude.</p>

      <h3>Plano do Vigor Ígneo (Genia + Arunalt)</h3>
      <ul>
        <li><strong>I. Sangue Novo:</strong> Purificação + regeneração. Rolagem de Rúnicos substitui teste de resistência do alvo. Remove um acúmulo de Sangramento/Queimadura ou limpa Envenenamento, Paralisia ou Congelamento.</li>
        <li><strong>II. Semeadura de Fulgor:</strong> Armadilha rúnica latente. Detona quando ser cruza: 1d8 dano ígneo em área. Rolagem de Rúnicos = dificuldade de Percepção para notar.</li>
        <li><strong>III. Oficinas de Vulcan:</strong> Reparo avançado de equipamento por toque. Rolagem de Rúnicos = Durabilidade recuperada.</li>
        <li><strong>IV. Efígie de Barro:</strong> Molda réplica de objeto em argila/solo. Cópia estável 1h. Rolagem de Rúnicos = dificuldade de Percepção para identificar falsidade.</li>
      </ul>

      <h3>Plano do Espectro Ardente (Genia + Saltrat)</h3>
      <ul>
        <li><strong>I. Fenda do Vazio:</strong> Abre fissura que atrai entidade do Vazio (imprevisível). 1d4: 1 Falha, 2 Inferior, 3 Médio, 4 Superior (dano/HP/ações conforme tabela).</li>
        <li><strong>II. Ilusão de Calor:</strong> Clone visual de objeto ou pessoa. Rolagem de Rúnicos = dificuldade de Percepção para não ser enganado.</li>
        <li><strong>III. Queimar a Mente:</strong> Debuff 1d6 em testes de Mentalidade. Rolagem de Rúnicos = dificuldade de Mentalidade para resistir.</li>
        <li><strong>IV. Fogo Espiritual:</strong> Esfera de chamas azuladas: 1d8 dano + status Desolado. Rolagem de Rúnicos = dificuldade de Esquiva e de Mentalidade.</li>
      </ul>

      <h3>Plano do Vácuo Incandescente (Genia + Pascalia)</h3>
      <ul>
        <li><strong>I. Projeção Flamejante:</strong> Coluna de calor projetada. 1d10 dano + 1 acúmulo Queimadura (crítico: 2). Rolagem = dificuldade de esquiva/defesa.</li>
        <li><strong>II. Condenado ao Fogo:</strong> Impede que acúmulos de Queimadura diminuam. Rolagem = Dificuldade para Resistência (Vigor + Resistência + 1d10).</li>
        <li><strong>III. Flechas de Luz:</strong> 2d8 dano exclusivamente contra demônios (zero em outros). Rolagem = dificuldade de Esquiva/Defesa.</li>
        <li><strong>IV. Chuva de Fogos:</strong> 1d6 dano em 1d8 alvos na área. Rolagem = dificuldade de Esquiva/Defesa.</li>
      </ul>

      <h3>Plano do Relâmpago de Éter (Genia + Reetear)</h3>
      <ul>
        <li><strong>I. Descarga Súbita:</strong> 1d6 dano, ignora Escudos e Armaduras (exceto arcanos). Rolagem de Rúnicos +5 = dificuldade de Esquiva.</li>
        <li><strong>II. Tempestade:</strong> 1d8 inimigos, 1d4 dano (ignora armaduras). Rolagem +5 = dificuldade de Esquiva.</li>
        <li><strong>III. Brilho Cegante:</strong> Status Cegueira. Rolagem = Dificuldade para Resistência (Vigor + Resistência + 1d10).</li>
        <li><strong>IV. Estrela Cadente:</strong> 1d8 dano. Rolagem = dificuldade de Esquiva. Crítico: +10 na dificuldade para o inimigo.</li>
      </ul>

      <h3>Plano da Nascente Eterna (Degila + Arunalt)</h3>
      <ul>
        <li><strong>I. Surto de Primavera:</strong> Vegetação envolve o oponente. Rolagem = Dificuldade para Resistência Física (Imobilizado).</li>
        <li><strong>II. Bálsamo do Rio:</strong> Cura qualquer Doença e status Cansado. Sem rolagem, 6 AP + toque.</li>
        <li><strong>III. Essência Renovada:</strong> Alvo recupera HP = resultado da Rolagem de Rúnicos do Arcanista.</li>
        <li><strong>IV. Corrente Arcana:</strong> Corrente translúcida dura 1 dia. Para destruir: um golpe com dano &gt; Rolagem de Rúnicos inicial.</li>
      </ul>

      <h3>Plano do Silêncio Eterno (Degila + Saltrat)</h3>
      <ul>
        <li><strong>I. Cúpula de Krystia:</strong> 3+ runas delimitam área. 5 turnos: runas ativas dormem, novas conjurações resistidas. Arcanista na área deve superar Rolagem de Rúnicos do conjurador em teste resistido.</li>
        <li><strong>II. Juramento de Gelo:</strong> Alvo só pode falar verdade. Teste de Mentalidade vs Rolagem de Rúnicos para resistir.</li>
        <li><strong>III. Proteção Mental:</strong> Barreira psíquica no aliado. Substitui testes de Mentalidade do alvo pelo valor da Rolagem de Rúnicos do Arcanista (usa-se o maior).</li>
        <li><strong>IV. Memórias Cristalizadas:</strong> Armazena fragmento de consciência na runa. Rolagem = tempo em minutos armazenável. Gasto de AP para armazenar e acessar.</li>
      </ul>

      <h3>Plano do Prisma Polar (Degila + Pascalia)</h3>
      <ul>
        <li><strong>I. Fonte Glacial:</strong> Materializa água potável (volume de barril). 6 AP, sem rolagem.</li>
        <li><strong>II. Estilhaço Congelado:</strong> 1d6 dano. Crítico: 1 acúmulo Sangramento. Rolagem = dificuldade de Esquiva.</li>
        <li><strong>III. Congelamento:</strong> Nevasca tenta aplicar Congelado. Rolagem = Dificuldade de resistência.</li>
        <li><strong>IV. Espelho Arcano:</strong> Película reflexiva. Teste de Rúnicos (defensor vs atacante): se defensor vencer, runa inimiga refletida; se perder, defensor recebe efeito total.</li>
      </ul>

      <h3>Plano do Alento Ártico (Degila + Reetear)</h3>
      <ul>
        <li><strong>I. Raio Congelante:</strong> 1d4 dano, ignora armaduras. Crítico: Congelado. Rolagem = dificuldade de Esquiva.</li>
        <li><strong>II. Silêncio Absoluto:</strong> 3+ runas: zona de silêncio total (sala pequena), 5 turnos. 6 AP, sem rolagem.</li>
        <li><strong>III. Manto da Névoa Criogênica:</strong> +4 Esquiva vs projéteis; inimigos corpo a corpo -3 em testes de dano. Rolagem = dificuldade de Resistência do inimigo.</li>
        <li><strong>IV. Ressonância de Cristal:</strong> Ouvir através de barreiras sólidas. Rolagem = distância máxima em metros.</li>
      </ul>

      <h3>Plano da Ressonância Natural (Arunalt + Saltrat)</h3>
      <ul>
        <li><strong>I. Laço de Caça:</strong> Controla animais sem Arcana. Alvo: teste de Carisma vs Rolagem de Rúnicos.</li>
        <li><strong>II. Doação de Essência:</strong> Arcanista transfere HP para o alvo. Valor = dobro da Rolagem de Rúnicos.</li>
        <li><strong>III. Cura Petrificado:</strong> Cura status Petrificado. Toque + 6 AP, sem rolagem.</li>
        <li><strong>IV. Rastrear Maldição:</strong> Fumaça aponta direção da origem de maldição ativa. 6 AP, sem rolagem.</li>
      </ul>

      <h3>Plano da Arquitetura Terrosa (Arunalt + Pascalia)</h3>
      <ul>
        <li><strong>I. Barreira de Pedra:</strong> 1d10 de Armadura (dano físico). Só funciona se Rolagem de Rúnicos &gt; rolagem de ataque do inimigo.</li>
        <li><strong>II. Casca da Forma:</strong> Altera aparência física por 24h. Rolagem = dificuldade de Arcanum para perceber metamorfose.</li>
        <li><strong>III. Lançamento de Pedra:</strong> 1d6 dano. Crítico: Derrubado e Atordoado.</li>
        <li><strong>IV. Geomorfismo:</strong> Abre buraco 2m×2m×2m em superfície sólida. 6 AP, ~1h para completar, sem rolagem.</li>
      </ul>

      <h3>Plano do Eco Mental (Reetear + Saltrat)</h3>
      <ul>
        <li><strong>I. Câmera da Loucura:</strong> Névoa: teste de Mentalidade vs Rolagem de Rúnicos. Falha: 1d4 → 1 Confusão, 2 Aflição, 3 Desolado, 4 Alucinação.</li>
        <li><strong>II. Visão do Vento:</strong> 3 turnos. Alvo pode substituir testes de Destreza por Inteligência. 6 AP, sem rolagem.</li>
        <li><strong>III. Telepatia:</strong> Par de runas: conversa por pensamento. 6 AP por runa ao ativar.</li>
        <li><strong>IV. Ilusão do Amigo:</strong> Toque: aliados parecem inimigos e vice-versa. Rolagem = dificuldade de Mentalidade para resistir.</li>
      </ul>

      <h3>Plano do Vácuo Vibrante (Reetear + Pascalia)</h3>
      <ul>
        <li><strong>I. Barreira de Vácuo:</strong> 1d10 Armadura só contra Dano Arcano. Funciona se Rolagem de Rúnicos &gt; rolagem de ataque.</li>
        <li><strong>II. Mão Invisível:</strong> Par runa-conjurador / runa-objeto: telecinese. Rolagem = distância máxima em metros.</li>
        <li><strong>III. Ondas Sonoras:</strong> 1d6 dano. Crítico: Atordoado. Não pode esquivar; pode Resistência vs Rolagem de Rúnicos para evitar dano.</li>
        <li><strong>IV. Tornado:</strong> Área 3m, 5 turnos. Todo turno: teste de resistência vs Rolagem de Rúnicos ou Derrubado.</li>
      </ul>

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/regras/runas#avancadas">▼ Runas Avançadas</Link>
      </p>

      <h2 id="avancadas">Runas Avançadas</h2>
      <p>Trindade (uma essência de cada Eixo). Custo base: 9 de Arcana. Eficácia definida por rolagem.</p>

      <h3>1. Esfera da Aniquilação (Genia, Pascalia, Reetear)</h3>
      <ul>
        <li><strong>I. Chama do Vazio:</strong> Projétil de singularidade térmica. 1d20 de dano.</li>
        <li><strong>II. Corte Dimensional:</strong> Fenda no espaço, lâmina de vácuo. 1d10 dano, ignora obstáculos e armaduras.</li>
        <li><strong>III. Colapso de Ondas:</strong> Implosão + expansão. 1d20 alvos na área, 1d10 dano cada.</li>
      </ul>

      <h3>2. Esfera da Transcendência Vital (Degila, Arunalt, Saltrat)</h3>
      <ul>
        <li><strong>I. Restauração Plena:</strong> Restaura 100% do HP do alvo.</li>
        <li><strong>II. Sopro do Renascimento:</strong> Até 3 turnos após morte: revive aliado com 50% HP máximo.</li>
        <li><strong>III. Matriz do Elixir:</strong> Gera poção/veneno/elixir. 9 AP por frasco. Rolagem de Rúnicos substitui Alquimia, mesma Dificuldade.</li>
      </ul>

      <h3>3. Esfera do Fluxo Energético (Degila, Pascalia, Reetear)</h3>
      <ul>
        <li><strong>I. Ascensão de Atributo:</strong> Aliado: +1d4 em um Atributo à escolha.</li>
        <li><strong>II. Declínio de Atributo:</strong> Oponente: -1d4 em um Atributo à escolha.</li>
        <li><strong>III. Sifão de Éter:</strong> Drena Arcana de alvo (ex.: demônio) e recarrega Arcanista ou objeto armazenador.</li>
      </ul>

      <h3>4. Esfera das Miragens (Saltrat, Genia, Arunalt)</h3>
      <ul>
        <li><strong>I. Trama Eterna:</strong> Ilusão estática (objeto, paisagem, multidão) que dura para sempre até a matriz ser destruída.</li>
        <li><strong>II. Doppleganger:</strong> Cópia física e funcional de ser vivo, com consciência servil. Se o mestre morrer, o clone ganha livre-arbítrio.</li>
        <li><strong>III. Manto do Esquecimento:</strong> Invisibilidade completa (luz, calor, som, odor). Efeito desfeito se atacar ou for atacado.</li>
      </ul>

      <h3>5. Esfera da Fortaleza Absoluta (Degila, Arunalt, Pascalia)</h3>
      <ul>
        <li><strong>I. Escudo de Espinhos:</strong> Mitiga 1d20 de dano; valor mitigado é refletido como dano ao ofensor.</li>
        <li><strong>II. Égide Corpórea:</strong> Imunidade total a ataques físicos por 1 turno.</li>
        <li><strong>III. Nulificação Arcana:</strong> Por 1 turno: imune a qualquer dano ou efeito mágico.</li>
      </ul>

      <h3>6. Esfera das Dobras Utilitárias (Genia, Arunalt, Pascalia)</h3>
      <ul>
        <li><strong>I. Portal de Passagem:</strong> Par de runas: teletransporte entre elas. 9 AP para 1 pessoa + 20 espaços de inventário.</li>
        <li><strong>II. Santuário Dimensional:</strong> Bolsa extra-dimensional (sala pequena). 9 AP. Pode ser imbuída em recipiente (bolsa rúnica).</li>
        <li><strong>III. Panaceia Rúnica:</strong> Remove 100% de status negativos (físicos e mentais) do alvo.</li>
      </ul>

      <h3>7. Esfera da Subjugação (Genia, Saltrat, Reetear)</h3>
      <ul>
        <li><strong>I. Elo de Marionete:</strong> Runa no Mestre + no Servo. Vontade do servo sufocada. Rolagem de Rúnicos = dificuldade de Mentalidade para resistir.</li>
        <li><strong>II. Grilhão Abissal:</strong> Demônio marcado obedece ao Arcanista. Rolagem de Rúnicos = dificuldade de Mentalidade do demônio para resistir.</li>
        <li><strong>III. Invocação Primordial:</strong> Servo de Arcana moldado do nada. HP = 5 × Rolagem de Rúnicos. Dano = Espírito + Arcanum + 1d10. Defesa/esquiva = Espírito + Arcanum do conjurador.</li>
      </ul>

      <h3>8. Esfera da Cronos-Estase (Saltrat, Degila, Reetear)</h3>
      <ul>
        <li><strong>I. Prisão Temporal:</strong> Alvo em estase (invulnerável, nada afeta). Teste de resistência vs Rolagem de Rúnicos para romper.</li>
        <li><strong>II. Vínculo da Maldição:</strong> Alvo ligado a âncora (objeto). Efeito: Erosão Arcana / Fragilidade (HP máx 1) / Flagelo de Nosferatu / Estase Catatônica.</li>
        <li><strong>III. Aceleração de Chronos (Haste):</strong> Alvo ganha 1 turno extra completo ao final da rodada.</li>
      </ul>

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/regras">← Voltar a Regras</Link>
        {' · '}
        <Link to="/runas">Ver lista de Runas (filtros por elemento e tier)</Link>
      </p>
    </div>
  )
}
