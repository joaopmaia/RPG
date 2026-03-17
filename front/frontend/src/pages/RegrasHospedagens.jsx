import { Link } from 'react-router-dom'
import { AttrLink } from '../components/RegrasLinks'

const TIPOS_HOSPEDAGEM = [
  {
    nome: 'Acampamento',
    riscos: ['Alto risco de ataques demoníacos.', 'Baixo risco de furtos.'],
    recuperacao: '1d4 de HP.',
    teste: 'Teste de Prontidão: Muito Difícil.',
  },
  {
    nome: 'Taverna',
    riscos: ['Sem risco de ataque demoníaco.', 'Alto risco de ataques de bandidos e furtos.'],
    recuperacao: '1d6 de HP e 1d4 de AP.',
    teste: 'Teste de Prontidão: Difícil.',
  },
  {
    nome: 'Alojamento',
    riscos: ['Sem risco de ataque demoníaco.', 'Alto risco de ataques de bandidos e furtos.'],
    recuperacao: '1d8 de HP e 1d4 de AP.',
    teste: 'Teste de Prontidão: Médio.',
  },
  {
    nome: 'Pousada',
    riscos: ['Sem risco de ataque demoníaco.', 'Risco médio de ataques de bandidos e furtos.'],
    recuperacao: '1d10 de HP e 1d6 de AP.',
    teste: 'Teste de Prontidão: Fácil.',
  },
  {
    nome: 'Hotel',
    riscos: ['Sem risco de ataque demoníaco.', 'Baixo risco de ataques de bandidos e furtos.'],
    recuperacao: '1d20 de HP e 1d10 de AP.',
    teste: 'Teste de Prontidão: Muito fácil.',
  },
  {
    nome: 'Hotel de Luxo',
    riscos: ['Sem risco de ataques de bandidos, furtos e ataques demoníacos.'],
    recuperacao: 'Remove todas as condições negativas (físicas e mentais). Cura 100% de HP.',
    teste: null,
  },
]

export default function RegrasHospedagens() {
  return (
    <div className="regras-doc">
      <nav style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <Link to="/regras">← Regras</Link>
      </nav>
      <h1>Sistema de Hospedagens</h1>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p>Em Khonum, o viajante encontra uma variedade de opções de hospedagem, cada uma com seus próprios riscos e recompensas. Os preços variam de acordo com a região e o tipo de estabelecimento, mas em todas as grandes cidades um teto para descansar a cabeça pode ser encontrado.</p>
      </section>

      <h2 id="riscos" style={{ marginBottom: '0.75rem' }}>Riscos da Noite</h2>
      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p>A noite em Khonum é traiçoeira. Mesmo nas hospedagens mais seguras, perigos espreitam.</p>
        <ul>
          <li><strong>Ataques Demoníacos:</strong> Em áreas selvagens ou em locais com forte presença de energia sombria, ataques demoníacos são um risco constante.</li>
          <li><strong>Ataques de Bandidos:</strong> Ladrões e saqueadores espreitam nas estradas e nas cidades, prontos para atacar viajantes desavisados.</li>
          <li><strong>Furtos:</strong> Mesmo dentro das cidades, carteiristas e ladrões podem roubar pertences valiosos enquanto os viajantes dormem.</li>
        </ul>
      </section>

      <h2 id="testes" style={{ marginBottom: '0.75rem' }}>Testes de Sobrevivência e Percepção</h2>
      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p>Para determinar se um ataque ou furto ocorre, o Mestre deve realizar testes de <AttrLink nome="Percepção" /> com todos os jogadores. A dificuldade do teste varia de acordo com o tipo de hospedagem e a região.</p>
        <ul>
          <li><strong>Falha:</strong> Se um personagem falhar no teste, um ataque ou furto ocorre.</li>
          <li><strong>Sucesso:</strong> Se todos os personagens passarem no teste, a noite transcorre sem incidentes.</li>
        </ul>
      </section>

      <h2 id="vigilia" style={{ marginBottom: '0.75rem' }}>Vigília</h2>
      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p style={{ marginBottom: 0 }}>Os personagens podem optar por montar guarda durante a noite para prevenir ataques e furtos surpresa. No entanto, a <strong>vigília reduz pela metade os benefícios de descanso</strong>.</p>
      </section>

      <h2 id="recuperacao" style={{ marginBottom: '0.75rem' }}>Recuperação</h2>
      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <p>Uma noite de sono reparadora é essencial para os aventureiros. A quantidade de HP recuperados varia de acordo com o tipo de hospedagem:</p>
        <ul>
          <li><strong>Recuperação base:</strong> Todos os personagens recuperam <strong>10 × <AttrLink nome="Vitalidade" /></strong> de HP.</li>
          <li><strong>Bônus de hospedagem:</strong> Alguns tipos de hospedagem oferecem bônus adicionais de recuperação (HP e/ou AP), conforme a tabela abaixo.</li>
        </ul>
      </section>

      <h2 id="tipos" style={{ marginBottom: '0.75rem' }}>Tipos de Hospedagem</h2>
      {TIPOS_HOSPEDAGEM.map((t) => (
        <section key={t.nome} className="card" style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ marginTop: 0 }}>{t.nome}</h3>
          <ul style={{ marginBottom: t.teste ? '0.5rem' : 0 }}>
            {t.riscos.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
          <p style={{ margin: '0.5rem 0' }}><strong>Recuperação:</strong> {t.recuperacao}</p>
          {t.teste && <p style={{ marginBottom: 0 }}><strong>{t.teste}</strong></p>}
        </section>
      ))}

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/regras">← Voltar a Regras</Link>
      </p>
    </div>
  )
}
