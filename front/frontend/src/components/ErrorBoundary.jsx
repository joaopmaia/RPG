import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Error Boundary para capturar erros de render e exibir fallback em vez de tela branca.
 */
export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info?.componentStack)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="card" style={{ maxWidth: '560px', margin: '2rem auto', padding: '1.5rem' }}>
          <h2 style={{ color: 'var(--parchment-dark)', marginTop: 0 }}>Algo deu errado</h2>
          <p>Ocorreu um erro ao carregar esta página. Tente voltar e abrir novamente.</p>
          {this.props.showDetails && (
            <pre style={{ fontSize: '0.8rem', overflow: 'auto', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: 8 }}>
              {this.state.error?.message ?? String(this.state.error)}
            </pre>
          )}
          <div style={{ marginTop: '1rem' }}>
            <Link to="/estabelecimentos" className="button">← Ir para estabelecimentos</Link>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
