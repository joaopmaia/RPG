import { useState } from 'react'
import { useAuth } from '../context/useAuth'

export default function LoginModal({ onClose }) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const u = usuario.trim()
    if (!u) {
      setError('Informe o nome de usuário.')
      return
    }
    if (!senha) {
      setError('Informe a senha.')
      return
    }
    if (mode === 'register') {
      if (u.length < 3 || u.length > 32) {
        setError('Usuário deve ter entre 3 e 32 caracteres.')
        return
      }
      if (!/^[a-zA-Z0-9_]+$/.test(u)) {
        setError('Usuário: apenas letras, números e underscore (_).')
        return
      }
      if (senha.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.')
        return
      }
    }
    setSubmitting(true)
    try {
      if (mode === 'login') {
        await login(u, senha)
      } else {
        await register(u, senha)
      }
      onClose()
    } catch (err) {
      const msg =
        err && typeof err === 'object' && err.message
          ? String(err.message)
          : typeof err === 'string'
            ? err
            : 'Não foi possível concluir. Tente de novo.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Login">
      <div className="card modal-content login-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{mode === 'login' ? 'Fazer login' : 'Criar conta'}</h2>
        <div className="login-modal-tabs" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            type="button"
            className={mode === 'login' ? 'primary' : ''}
            onClick={() => { setMode('login'); setError('') }}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'primary' : ''}
            onClick={() => { setMode('register'); setError('') }}
          >
            Registrar
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="login-usuario">Usuário</label>
            <input
              id="login-usuario"
              type="text"
              autoComplete="username"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="3–32 caracteres: letras, números, _"
            />
          </div>
          <div className="form-row">
            <label htmlFor="login-senha">Senha</label>
            <input
              id="login-senha"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : 'Senha'}
            />
          </div>
          {error && (
            <p className="error-msg" role="alert">
              {error}
            </p>
          )}
          <div className="login-modal-actions">
            <button type="submit" className="primary" disabled={submitting}>
              {submitting ? 'Aguarde…' : mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
