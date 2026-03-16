import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginModal({ onClose }) {
  const { login } = useAuth()
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(usuario, senha)
      onClose()
    } catch (err) {
      setError(err.message || 'Falha no login')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Login">
      <div className="card modal-content login-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Fazer login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="login-usuario">Usuário</label>
            <input
              id="login-usuario"
              type="text"
              autoComplete="username"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Usuário"
            />
          </div>
          <div className="form-row">
            <label htmlFor="login-senha">Senha</label>
            <input
              id="login-senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Senha"
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <div className="login-modal-actions">
            <button type="submit" className="primary" disabled={submitting}>
              {submitting ? 'Entrando…' : 'Entrar'}
            </button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
