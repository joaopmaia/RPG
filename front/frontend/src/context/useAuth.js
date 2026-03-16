import { useContext } from 'react'
import { AuthContext } from './AuthContext'

const defaultAuth = {
  user: null,
  loading: false,
  login: async () => {},
  logout: () => {},
  isAdmin: () => false,
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  return ctx ?? defaultAuth
}
