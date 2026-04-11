import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './Layout'
import { useAuth } from './context/useAuth'
import Dashboard from './pages/Dashboard'
import Equipamentos from './pages/Equipamentos'
import Armas from './pages/Armas'
import ArmasCriar from './pages/ArmasCriar'
import ArmasEditar from './pages/ArmasEditar'
import ArmasNovoItem from './pages/ArmasNovoItem'
import Armaduras from './pages/Armaduras'
import ArmadurasCriar from './pages/ArmadurasCriar'
import ArmadurasEditar from './pages/ArmadurasEditar'
import ArmadurasNovoItem from './pages/ArmadurasNovoItem'
import Alquimia from './pages/Alquimia'
import AlquimiaNovoItem from './pages/AlquimiaNovoItem'
import AlquimiaCriar from './pages/AlquimiaCriar'
import AlquimiaEditar from './pages/AlquimiaEditar'
import MateriaisCriar from './pages/MateriaisCriar'
import MateriaisEditar from './pages/MateriaisEditar'
import Reinos from './pages/Reinos'
import ReinoHistoria from './pages/ReinoHistoria'
import ReinoMapa from './pages/ReinoMapa'
import Materiais from './pages/Materiais'
import Runas from './pages/Runas'
import NPCs from './pages/NPCs'
import NPCCriar from './pages/NPCCriar'
import NPCFicha from './pages/NPCFicha'
import NPCEditar from './pages/NPCEditar'
import InteragirNPC from './pages/InteragirNPC'
import Demonios from './pages/Demonios'
import DemonioFicha from './pages/DemonioFicha'
import DemonioEditar from './pages/DemonioEditar'
import DemonioCriar from './pages/DemonioCriar'
import InteragirDemonio from './pages/InteragirDemonio'
import Animais from './pages/Animais'
import AnimalFicha from './pages/AnimalFicha'
import AnimalEditar from './pages/AnimalEditar'
import AnimalCriar from './pages/AnimalCriar'
import InteragirAnimal from './pages/InteragirAnimal'
import Estabelecimentos from './pages/Estabelecimentos'
import EstabelecimentoCriar from './pages/EstabelecimentoCriar'
import EstabelecimentoDetalhe from './pages/EstabelecimentoDetalhe'
import MinhasFichas from './pages/MinhasFichas'
import FichasJogadores from './pages/FichasJogadores'
import Regras from './pages/Regras'
import RegrasCriacaoFicha from './pages/RegrasCriacaoFicha'
import RegrasAtributo from './pages/RegrasAtributo'
import RegrasPericia from './pages/RegrasPericia'
import RegrasInventario from './pages/RegrasInventario'
import RegrasDificuldades from './pages/RegrasDificuldades'
import RegrasAcertoCritico from './pages/RegrasAcertoCritico'
import RegrasAtaqueMirado from './pages/RegrasAtaqueMirado'
import RegrasSistemaCombate from './pages/RegrasSistemaCombate'
import RegrasStatus from './pages/RegrasStatus'
import RegrasAlquimia from './pages/RegrasAlquimia'
import RegrasMateriais from './pages/RegrasMateriais'
import RegrasEquipamentos from './pages/RegrasEquipamentos'
import RegrasHospedagens from './pages/RegrasHospedagens'
import RegrasViagens from './pages/RegrasViagens'
import RegrasMusicas from './pages/RegrasMusicas'
import RegrasRunas from './pages/RegrasRunas'
import Musicas from './pages/Musicas'
import RoleplayingViagens from './pages/RoleplayingViagens'
import RoleplayingViagemIniciar from './pages/RoleplayingViagemIniciar'
import PassarNoite from './pages/PassarNoite'
import { ErrorBoundary } from './components/ErrorBoundary'
import Guias from './pages/Guias'
import GuiasAtributos from './pages/GuiasAtributos'
import GuiasPericias from './pages/GuiasPericias'
import GuiasAntecedentes from './pages/GuiasAntecedentes'
import GuiasGlossario from './pages/GuiasGlossario'
import PerfilUsuario from './pages/PerfilUsuario'

function AdminRoute({ children }) {
  const { isAdmin } = useAuth()
  return isAdmin() ? children : <Navigate to="/" replace />
}

function AuthRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/" replace />
}

/** NPCs, demônios e animais: exige login; campanha via cabeçalho (localStorage). */
function RoleplayingRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/" replace />
}

/** Criar/editar/excluir/interagir em conteúdo de campanha (mestre/admin global). */
function RoleplayingEditRoute({ children }) {
  const { user, podeEditarCampanha } = useAuth()
  if (!user) return <Navigate to="/" replace />
  return podeEditarCampanha() ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="equipamentos" element={<Equipamentos />} />
          <Route path="armas" element={<Armas />} />
          <Route path="armas/criar" element={<AdminRoute><ArmasCriar /></AdminRoute>} />
          <Route path="armas/:id/editar" element={<AdminRoute><ArmasEditar /></AdminRoute>} />
          <Route path="armas/novo-item" element={<ArmasNovoItem />} />
          <Route path="armaduras" element={<Armaduras />} />
          <Route path="armaduras/criar" element={<AdminRoute><ArmadurasCriar /></AdminRoute>} />
          <Route path="armaduras/:id/editar" element={<AdminRoute><ArmadurasEditar /></AdminRoute>} />
          <Route path="armaduras/novo-item" element={<ArmadurasNovoItem />} />
          <Route path="alquimia" element={<Alquimia />} />
          <Route path="alquimia/criar" element={<AdminRoute><AlquimiaCriar /></AdminRoute>} />
          <Route path="alquimia/:id/editar" element={<AdminRoute><AlquimiaEditar /></AdminRoute>} />
          <Route path="alquimia/novo-item" element={<AlquimiaNovoItem />} />
          <Route path="materiais" element={<Materiais />} />
          <Route path="materiais/criar" element={<AdminRoute><MateriaisCriar /></AdminRoute>} />
          <Route path="materiais/:id/editar" element={<AdminRoute><MateriaisEditar /></AdminRoute>} />
          <Route path="reinos" element={<Reinos />} />
          <Route path="reinos/:id/historia" element={<ReinoHistoria />} />
          <Route path="reinos/:id/mapa" element={<ReinoMapa />} />
          <Route path="runas" element={<Runas />} />
          <Route path="musicas" element={<Musicas />} />
          <Route path="regras" element={<Regras />} />
          <Route path="regras/criacao-ficha" element={<RegrasCriacaoFicha />} />
          <Route path="regras/atributos/:slug" element={<RegrasAtributo />} />
          <Route path="regras/pericias/:slug" element={<RegrasPericia />} />
          <Route path="regras/inventario" element={<RegrasInventario />} />
          <Route path="regras/dificuldades-acoes" element={<RegrasDificuldades />} />
          <Route path="regras/acerto-critico" element={<RegrasAcertoCritico />} />
          <Route path="regras/ataque-mirado" element={<RegrasAtaqueMirado />} />
          <Route path="regras/sistema-combate" element={<RegrasSistemaCombate />} />
          <Route path="regras/status" element={<RegrasStatus />} />
          <Route path="regras/alquimia" element={<RegrasAlquimia />} />
          <Route path="regras/materiais" element={<RegrasMateriais />} />
          <Route path="regras/equipamentos" element={<RegrasEquipamentos />} />
          <Route path="regras/hospedagens" element={<RegrasHospedagens />} />
          <Route path="regras/viagens" element={<RegrasViagens />} />
          <Route path="regras/musicas" element={<RegrasMusicas />} />
          <Route path="regras/runas" element={<RegrasRunas />} />
          <Route path="guias" element={<Guias />} />
          <Route path="guias/atributos" element={<GuiasAtributos />} />
          <Route path="guias/pericias" element={<GuiasPericias />} />
          <Route path="guias/antecedentes" element={<GuiasAntecedentes />} />
          <Route path="guias/glossario" element={<GuiasGlossario />} />
          <Route path="npcs" element={<RoleplayingRoute><NPCs /></RoleplayingRoute>} />
          <Route path="npcs/criar" element={<RoleplayingEditRoute><NPCCriar /></RoleplayingEditRoute>} />
          <Route path="npcs/:id/ficha" element={<RoleplayingRoute><NPCFicha /></RoleplayingRoute>} />
          <Route path="npcs/:id/interagir" element={<RoleplayingEditRoute><InteragirNPC /></RoleplayingEditRoute>} />
          <Route path="npcs/:id/editar" element={<RoleplayingEditRoute><NPCEditar /></RoleplayingEditRoute>} />
          <Route path="demonios" element={<RoleplayingRoute><Demonios /></RoleplayingRoute>} />
          <Route path="demonios/criar" element={<RoleplayingEditRoute><DemonioCriar /></RoleplayingEditRoute>} />
          <Route path="demonios/:id/ficha" element={<RoleplayingRoute><DemonioFicha /></RoleplayingRoute>} />
          <Route path="demonios/:id/editar" element={<RoleplayingEditRoute><DemonioEditar /></RoleplayingEditRoute>} />
          <Route path="demonios/:id/interagir" element={<RoleplayingEditRoute><InteragirDemonio /></RoleplayingEditRoute>} />
          <Route path="animais" element={<RoleplayingRoute><Animais /></RoleplayingRoute>} />
          <Route path="animais/criar" element={<RoleplayingEditRoute><AnimalCriar /></RoleplayingEditRoute>} />
          <Route path="animais/:id/ficha" element={<RoleplayingRoute><AnimalFicha /></RoleplayingRoute>} />
          <Route path="animais/:id/editar" element={<RoleplayingEditRoute><AnimalEditar /></RoleplayingEditRoute>} />
          <Route path="animais/:id/interagir" element={<RoleplayingEditRoute><InteragirAnimal /></RoleplayingEditRoute>} />
          <Route path="estabelecimentos" element={<RoleplayingRoute><Estabelecimentos /></RoleplayingRoute>} />
          <Route path="estabelecimentos/criar" element={<RoleplayingEditRoute><EstabelecimentoCriar /></RoleplayingEditRoute>} />
          <Route path="estabelecimentos/:id" element={<RoleplayingRoute><EstabelecimentoDetalhe /></RoleplayingRoute>} />
          <Route path="roleplaying/viagens" element={<RoleplayingViagens />} />
          <Route path="roleplaying/viagens/iniciar" element={<RoleplayingViagemIniciar />} />
          <Route path="roleplaying/noite/:id" element={<ErrorBoundary showDetails={import.meta.env?.DEV}><RoleplayingRoute><PassarNoite /></RoleplayingRoute></ErrorBoundary>} />
          <Route path="minhas-fichas" element={<AuthRoute><MinhasFichas /></AuthRoute>} />
          <Route path="conta" element={<AuthRoute><PerfilUsuario /></AuthRoute>} />
          <Route path="fichas-jogadores" element={<AdminRoute><FichasJogadores /></AdminRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
