import { createContext, useState, useEffect } from 'react'
import { getAuthMe, loginAuth, logoutAuth } from '../api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAuthMe()
      .then((data) => data && setUser({ usuario: data.usuario, perfil: data.perfil }))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (usuario, senha) => {
    const data = await loginAuth(usuario, senha)
    if (data.user) setUser(data.user)
    return data
  }

  const logout = async () => {
    await logoutAuth()
    setUser(null)
  }

  const isAdmin = () => user && user.perfil === 'admin'

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}
