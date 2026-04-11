import { useContext } from 'react'
import { AuthContext } from './AuthContext'

const defaultAuth = {
  user: null,
  loading: false,
  login: async () => {},
  logout: () => {},
  isAdmin: () => false,
  campanhaId: null,
  setCampanhaId: () => {},
  podeEditarCampanha: () => false,
  refreshMe: async () => null,
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  return ctx ?? defaultAuth
}
