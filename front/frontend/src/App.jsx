import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Layout from './Layout'
import Dashboard from './pages/Dashboard'
import Armas from './pages/Armas'
import Armaduras from './pages/Armaduras'
import Alquimia from './pages/Alquimia'
import Reinos from './pages/Reinos'
import Materiais from './pages/Materiais'
import Runas from './pages/Runas'
import NPCs from './pages/NPCs'
import EquipamentosNPC from './pages/EquipamentosNPC'
import ElixirNPC from './pages/ElixirNPC'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="armas" element={<Armas />} />
          <Route path="armaduras" element={<Armaduras />} />
          <Route path="alquimia" element={<Alquimia />} />
          <Route path="reinos" element={<Reinos />} />
          <Route path="materiais" element={<Materiais />} />
          <Route path="runas" element={<Runas />} />
          <Route path="npcs" element={<NPCs />} />
          <Route path="equipamentos-npc" element={<EquipamentosNPC />} />
          <Route path="elixir-npc" element={<ElixirNPC />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
