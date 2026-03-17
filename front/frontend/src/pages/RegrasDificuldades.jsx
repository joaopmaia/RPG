import { Link } from 'react-router-dom'

const DIFICULDADES = [
  { valor: 7, nome: 'Muito fácil', desc: 'Uma tarefa tão simples que não deve oferecer dificuldades.' },
  { valor: 10, nome: 'Fácil', desc: 'Uma tarefa comum que a maioria dos personagens pode realizar com facilidade. Por exemplo, atravessar um terreno plano sem obstáculos ou segurar uma arma corretamente.' },
  { valor: 12, nome: 'Média', desc: 'A dificuldade padrão para a maioria das ações. Para a maioria das ações, como saltar sobre um obstáculo baixo ou abrir uma porta trancada, a dificuldade será de 12. É o tipo de teste que você vai fazer frequentemente.' },
  { valor: 15, nome: 'Difícil', desc: 'Tarefas complicadas ou que exigem grande habilidade ou um pouco de sorte. Isso pode incluir escalar uma parede íngreme, evitar um ataque surpresa ou desarmar uma armadilha complexa.' },
  { valor: 17, nome: 'Muito difícil', desc: 'Ação realmente desafiadora, como saltar sobre um abismo largo ou forjar uma carta que seja praticamente indistinguível de um original. Essas ações exigem grande especialização ou uma combinação de sorte e habilidades excepcionais.' },
  { valor: 20, nome: 'Quase impossível', desc: 'Uma ação quase sem chance de sucesso. Esses testes só seriam feitos em condições extremamente favoráveis, como com o uso de magia poderosa ou quando o personagem tem uma vantagem imensa. Exemplos podem ser enfrentar um inimigo em desvantagem total ou resolver um enigma complexo sem qualquer pista.' },
]

export default function RegrasDificuldades() {
  return (
    <div className="regras-doc">
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/regras">← Regras</Link>
      </nav>
      <h1>Dificuldades de Ação</h1>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p>No jogo, todas as ações que exigem um teste são definidas por uma <strong>dificuldade</strong>. O mestre do jogo ou a situação específica determinará qual será a dificuldade de uma ação, dependendo do quão fácil ou difícil é realizar determinada tarefa.</p>
        <p>Quando você faz um teste, rola os dados e compara o resultado com a dificuldade estabelecida. Quanto mais difícil a ação, maior será a dificuldade e, portanto, mais difícil será obter sucesso.</p>
      </section>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginTop: 0 }}>Resumo das dificuldades</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Dificuldade</th><th>Classificação</th><th>Descrição</th></tr>
            </thead>
            <tbody>
              {DIFICULDADES.map((d) => (
                <tr key={d.valor}>
                  <td><strong>{d.valor}</strong></td>
                  <td>{d.nome}</td>
                  <td>{d.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/regras">← Voltar a Regras</Link>
      </p>
    </div>
  )
}
