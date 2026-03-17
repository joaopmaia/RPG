import { Link } from 'react-router-dom'

export default function RegrasViagens() {
  return (
    <div className="regras-doc">
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/regras">← Regras</Link>
      </nav>
      <h1>Sistema de Viagens</h1>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p>Em Khonum, as viagens são uma parte essencial da vida, seja para comércio, exploração ou missões perigosas. As estradas são a espinha dorsal do reino, conectando cidades e reinos, enquanto os rios e mares oferecem rotas alternativas para os aventureiros.</p>
      </section>

      <h2 id="tipos" style={{ marginBottom: '0.75rem' }}>Tipos de Viagem</h2>
      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <ul>
          <li><strong>Viagem Terrestre:</strong> A forma mais comum de viagem, realizada a pé, a cavalo ou em carroças. As estradas de Khonum variam de caminhos de terra batida a estradas pavimentadas, influenciando a velocidade e o conforto da viagem.</li>
          <li><strong>Viagem Marítima:</strong> Essencial para alcançar reinos insulares ou explorar costas distantes. Os navios variam de pequenas embarcações de pesca a grandes navios mercantes, cada um com sua própria velocidade e capacidade de carga.</li>
          <li><strong>Viagem Fluvial:</strong> Alternativa às viagens terrestres, utilizando os rios de Khonum para transporte. Barcos e balsas navegam pelos rios, conectando cidades ribeirinhas e oferecendo rotas mais rápidas em algumas regiões.</li>
        </ul>
      </section>

      <h2 id="precos" style={{ marginBottom: '0.75rem' }}>Preços de Viagem (por dia)</h2>
      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <ul>
          <li>Viagem Terrestre: <strong>50 – 200</strong> moedas de bronze</li>
          <li>Viagem Marítima: <strong>100 – 300</strong> moedas de bronze</li>
          <li>Viagem Fluvial: <strong>80 – 250</strong> moedas de bronze</li>
        </ul>
      </section>

      <h2 id="tempo" style={{ marginBottom: '0.75rem' }}>Tempo de Viagem</h2>
      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p>O tempo de viagem entre reinos depende da distância, do meio de transporte e das condições da rota. Esse tempo será ditado pelo Mestre, assim como a distância entre os reinos. Uma base para comparação:</p>
        <ul>
          <li><strong>Reinos vizinhos próximos:</strong> Terrestre 15–30 dias; Marítima/Fluvial 10–20 dias.</li>
          <li><strong>Reinos vizinhos distantes:</strong> Terrestre 40–70 dias; Marítima/Fluvial 30–50 dias.</li>
          <li><strong>Reinos distantes:</strong> Terrestre 80–140+ dias; Marítima 60–120+ dias.</li>
        </ul>
      </section>

      <h2 id="transporte" style={{ marginBottom: '0.75rem' }}>Meios de Transporte</h2>
      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p>Os meios de transporte reduzem o tempo de viagem consideravelmente (o valor indica por quanto o tempo base é <strong>dividido</strong>):</p>
        <h3 style={{ fontSize: '1rem', marginTop: '1rem' }}>Animal terrestre</h3>
        <ul>
          <li>Cavalos: divide o tempo por <strong>2</strong></li>
          <li>Lagartos Gigantes: divide o tempo por <strong>3</strong></li>
          <li>Alce: divide o tempo por <strong>2</strong></li>
          <li>Urso: divide o tempo por <strong>2</strong></li>
          <li>Avestruz: divide o tempo por <strong>4</strong></li>
        </ul>
        <h3 style={{ fontSize: '1rem', marginTop: '1rem' }}>Animal voador</h3>
        <ul>
          <li>Águia Gigante: divide o tempo por <strong>3</strong></li>
          <li>Wyvern: divide o tempo por <strong>3</strong></li>
          <li>Grifo: divide o tempo por <strong>4</strong></li>
        </ul>
        <h3 style={{ fontSize: '1rem', marginTop: '1rem' }}>Veículos</h3>
        <ul>
          <li>Carruagens (puxadas por animais): divide o tempo por <strong>2</strong></li>
          <li>Carruagens rúnicas (movidas a energia arcana): divide o tempo por <strong>3 ou 4</strong></li>
          <li>Barcos (rios): divide o tempo por <strong>3</strong></li>
          <li>Navios (mares): divide o tempo por <strong>3</strong></li>
          <li>Planadores (artefatos voadores a energia arcana): divide o tempo por <strong>3</strong></li>
        </ul>
      </section>

      <h2 id="encontros" style={{ marginBottom: '0.75rem' }}>Encontros e Perigos nas Estradas de Khonum</h2>
      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p>As estradas de Khonum são vias de aventura e perigo, onde cada jornada pode trazer encontros inesperados e desafios mortais.</p>
        <h3 style={{ fontSize: '1rem', marginTop: '1rem' }}>Encontros</h3>
        <ul>
          <li><strong>Viajantes:</strong> Mercadores, peregrinos, outros aventureiros, refugiados, artistas itinerantes.</li>
          <li><strong>Criaturas:</strong> Animais selvagens, monstros errantes, criaturas mágicas, elementais, espíritos da natureza.</li>
          <li><strong>Locais:</strong> Ruínas antigas, templos abandonados, vilarejos isolados, cavernas misteriosas, fontes de energia arcana.</li>
        </ul>
        <h3 style={{ fontSize: '1rem', marginTop: '1rem' }}>Perigos</h3>
        <ul>
          <li><strong>Ataques:</strong> Bandidos, monstros, animais selvagens, cultistas, demônios menores.</li>
          <li><strong>Desastres:</strong> Tempestades, enchentes, deslizamentos de terra, incêndios florestais, tremores de terra.</li>
          <li><strong>Armadilhas:</strong> Armadilhas naturais, armadilhas rúnicas, armadilhas de bandidos, ruínas perigosas.</li>
          <li><strong>Outros:</strong> Doenças, fome, sede, perda de direção, encontros com criaturas perigosas, fenômenos mágicos estranhos.</li>
        </ul>
      </section>

      <h2 id="teste-viagem" style={{ marginBottom: '0.75rem' }}>Testes de Encontros e Perigos</h2>
      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p>A cada dia de viagem, o Mestre deve realizar um teste para determinar se um encontro ou perigo ocorre. A noite na carruagem funciona como um acampamento.</p>
        <p><strong>Teste:</strong> Role 1d20.</p>
        <ul>
          <li><strong>1–5:</strong> Perigo grave.</li>
          <li><strong>6–10:</strong> Perigo menor.</li>
          <li><strong>11–15:</strong> Viagem tranquila.</li>
          <li><strong>16–20:</strong> Encontro interessante.</li>
        </ul>
        <p style={{ marginBottom: 0 }}>O Mestre pode ajustar a dificuldade do teste com base na região, no meio de transporte e nas condições da viagem.</p>
      </section>

      <h2 id="luxo" style={{ marginBottom: '0.75rem' }}>Viagens Rúnicas de Luxo</h2>
      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p>Para aqueles que buscam segurança e conforto, as viagens rúnicas de luxo são a melhor opção. Veículos protegidos por runas poderosas garantem uma jornada tranquila, livre de ataques demoníacos e outros perigos da noite.</p>
        <p><strong>Preço:</strong> no mínimo <strong>10 vezes</strong> o preço da viagem comum.</p>
        <p><strong>Benefícios:</strong></p>
        <ul>
          <li>Proteção contra ataques demoníacos e outros perigos noturnos.</li>
          <li>Cabines confortáveis e luxuosas.</li>
          <li>Serviços exclusivos (refeições gourmet, entretenimento).</li>
          <li>Viagens mais rápidas e seguras.</li>
          <li>Recuperação equivalente à de um Hotel (ver <Link to="/regras/hospedagens">Hospedagens</Link>).</li>
        </ul>
      </section>

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/regras">← Voltar a Regras</Link>
      </p>
    </div>
  )
}
