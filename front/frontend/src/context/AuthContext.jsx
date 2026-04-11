import { createContext, useState, useEffect, useCallback } from 'react'
import { getAuthMe, loginAuth, logoutAuth, getCampanhaId, setCampanhaId as persistCampanhaId } from '../api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [campanhaId, setCampanhaIdState] = useState(() => getCampanhaId())
  const [podeEditarRoleplaying, setPodeEditarRoleplaying] = useState(false)

  const refreshMe = useCallback(async () => {
    const data = await getAuthMe()
    if (data) {
      setUser({
        usuario: data.usuario,
        perfil: data.perfil,
        campanhas: data.campanhas || [],
      })
      setPodeEditarRoleplaying(!!data.pode_editar_roleplaying)
    } else {
      setUser(null)
      setPodeEditarRoleplaying(false)
    }
    return data
  }, [])

  useEffect(() => {
    refreshMe()
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [refreshMe])

  useEffect(() => {
    if (!user || user.perfil === 'admin') return
    const ids = (user.campanhas || []).map((c) => c.campanha_id).filter(Boolean)
    const cur = getCampanhaId()
    if (ids.length && (!cur || !ids.includes(cur))) {
      persistCampanhaId(ids[0])
      setCampanhaIdState(ids[0])
      refreshMe()
    }
  }, [user, refreshMe])

  const setCampanhaId = useCallback((id) => {
    persistCampanhaId(id)
    setCampanhaIdState(id || null)
    refreshMe()
  }, [refreshMe])

  const login = async (usuario, senha) => {
    const data = await loginAuth(usuario, senha)
    if (data.user) {
      setUser({
        usuario: data.user.usuario,
        perfil: data.user.perfil,
        campanhas: data.user.campanhas || [],
      })
      const campanhas = data.user.campanhas || []
      if (campanhas.length && !getCampanhaId()) {
        const first = campanhas[0].campanha_id
        if (first) {
          persistCampanhaId(first)
          setCampanhaIdState(first)
        }
      }
      await refreshMe()
    }
    return data
  }

  const logout = async () => {
    await logoutAuth()
    setUser(null)
    setPodeEditarRoleplaying(false)
  }

  const isAdmin = () => user && user.perfil === 'admin'

  /** Pode criar/editar/excluir NPC, demônios, animais e estabelecimentos na campanha atual. */
  const podeEditarCampanha = () => isAdmin() || podeEditarRoleplaying

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin,
        campanhaId,
        setCampanhaId,
        podeEditarCampanha,
        refreshMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
