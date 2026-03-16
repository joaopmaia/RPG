import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './Layout'
import { useAuth } from './context/AuthContext'
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

function AdminRoute({ children }) {
  const { isAdmin } = useAuth()
  return isAdmin() ? children : <Navigate to="/" replace />
}

function AuthRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/" replace />
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
          <Route path="npcs" element={<AdminRoute><NPCs /></AdminRoute>} />
          <Route path="npcs/criar" element={<AdminRoute><NPCCriar /></AdminRoute>} />
          <Route path="npcs/:id/ficha" element={<AdminRoute><NPCFicha /></AdminRoute>} />
          <Route path="npcs/:id/interagir" element={<AdminRoute><InteragirNPC /></AdminRoute>} />
          <Route path="npcs/:id/editar" element={<AdminRoute><NPCEditar /></AdminRoute>} />
          <Route path="demonios" element={<AdminRoute><Demonios /></AdminRoute>} />
          <Route path="demonios/criar" element={<AdminRoute><DemonioCriar /></AdminRoute>} />
          <Route path="demonios/:id/ficha" element={<AdminRoute><DemonioFicha /></AdminRoute>} />
          <Route path="demonios/:id/editar" element={<AdminRoute><DemonioEditar /></AdminRoute>} />
          <Route path="demonios/:id/interagir" element={<AdminRoute><InteragirDemonio /></AdminRoute>} />
          <Route path="animais" element={<AdminRoute><Animais /></AdminRoute>} />
          <Route path="animais/criar" element={<AdminRoute><AnimalCriar /></AdminRoute>} />
          <Route path="animais/:id/ficha" element={<AdminRoute><AnimalFicha /></AdminRoute>} />
          <Route path="animais/:id/editar" element={<AdminRoute><AnimalEditar /></AdminRoute>} />
          <Route path="animais/:id/interagir" element={<AdminRoute><InteragirAnimal /></AdminRoute>} />
          <Route path="estabelecimentos" element={<Estabelecimentos />} />
          <Route path="estabelecimentos/criar" element={<AdminRoute><EstabelecimentoCriar /></AdminRoute>} />
          <Route path="estabelecimentos/:id" element={<EstabelecimentoDetalhe />} />
          <Route path="minhas-fichas" element={<AuthRoute><MinhasFichas /></AuthRoute>} />
          <Route path="fichas-jogadores" element={<AdminRoute><FichasJogadores /></AdminRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
