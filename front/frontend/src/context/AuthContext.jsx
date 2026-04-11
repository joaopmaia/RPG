import { createContext, useState, useEffect, useCallback } from 'react'
import { getAuthMe, loginAuth, logoutAuth, registerAuth, getCampanhaId, setCampanhaId as persistCampanhaId } from '../api'

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

  const setCampanhaId = useCallback(
    (id) => {
      persistCampanhaId(id)
      setCampanhaIdState(id || null)
      refreshMe()
    },
    [refreshMe],
  )

  const applyUserFromAuthPayload = (data) => {
    const u = data.user
    if (u) {
      setUser({
        usuario: u.usuario,
        perfil: u.perfil,
        campanhas: u.campanhas || [],
      })
      const campanhas = u.campanhas || []
      if (campanhas.length && !getCampanhaId()) {
        const first = campanhas[0].campanha_id
        if (first) {
          persistCampanhaId(first)
          setCampanhaIdState(first)
        }
      }
    }
  }

  const mergeMeIntoUser = (me) => {
    if (!me) return
    setUser({
      usuario: me.usuario,
      perfil: me.perfil,
      campanhas: me.campanhas || [],
    })
    setPodeEditarRoleplaying(!!me.pode_editar_roleplaying)
  }

  const login = async (usuario, senha) => {
    const data = await loginAuth(usuario, senha)
    applyUserFromAuthPayload(data)
    try {
      const me = await getAuthMe()
      mergeMeIntoUser(me)
    } catch {
      /* login já devolveu user + token; falha transitória em /me não deve desfazer a sessão */
    }
    return data
  }

  const register = async (usuario, senha) => {
    const data = await registerAuth(usuario, senha)
    applyUserFromAuthPayload(data)
    try {
      const me = await getAuthMe()
      mergeMeIntoUser(me)
    } catch {
      /* idem */
    }
    return data
  }

  const logout = async () => {
    await logoutAuth()
    setUser(null)
    setPodeEditarRoleplaying(false)
  }

  const isAdmin = () => user && user.perfil === 'admin'

  const podeEditarCampanha = () => isAdmin() || podeEditarRoleplaying

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
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
