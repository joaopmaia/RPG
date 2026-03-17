import { Link } from 'react-router-dom'

const ATTR_SLUG = { Força: 'forca', Vitalidade: 'vitalidade', Inteligência: 'inteligencia', Destreza: 'destreza', Espírito: 'espirito', Percepção: 'percepcao', Carisma: 'carisma' }
const PERICIA_SLUG = {
  Cutelaria: 'cutelaria', Acuidade: 'acuidade', Execução: 'execucao', Pontaria: 'pontaria', Briga: 'briga', Esquiva: 'esquiva',
  Resistência: 'resistencia', Arcanum: 'arcanum', 'Rúnico': 'runico', Alquimia: 'alquimia', Artista: 'artista', Furtividade: 'furtividade',
  Ofícios: 'oficios', Atletismo: 'atletismo', Sobrevivência: 'sobrevivencia', Prontidão: 'prontidao', Empatia: 'empatia', Lábia: 'labia',
  Condução: 'conducao', Cultura: 'cultura', Idiomas: 'idiomas', Ladinagem: 'ladinagem', Mentalidade: 'mentalidade', 'Afinidade Animal': 'afinidade-animal',
}

export function AttrLink({ nome }) {
  const slug = ATTR_SLUG[nome]
  return slug ? <Link to={`/regras/atributos/${slug}`}>{nome}</Link> : nome
}

export function PericiaLink({ nome }) {
  const slug = PERICIA_SLUG[nome]
  return slug ? <Link to={`/regras/pericias/${slug}`}>{nome}</Link> : nome
}

export function GuiasAtributosLink() {
  return <Link to="/guias/atributos">Atributos</Link>
}

export function GuiasPericiasLink() {
  return <Link to="/guias/pericias">Perícias</Link>
}
