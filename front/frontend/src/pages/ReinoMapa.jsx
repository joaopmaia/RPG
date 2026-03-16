import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { get, getReinoMapaUrl } from '../api'

export default function ReinoMapa() {
  const { id } = useParams()
  const [reino, setReino] = useState(null)
  const [error, setError] = useState(null)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    if (!id) return
    get('reinos', id)
      .then(setReino)
      .catch((e) => setError(e.message))
  }, [id])

  if (error) {
    return (
      <div>
        <p className="error-msg">{error}</p>
        <Link to="/reinos" className="button">← Voltar aos Reinos</Link>
      </div>
    )
  }

  if (!reino) return <p>Carregando…</p>

  const mapUrl = getReinoMapaUrl(id)
  const nome = reino.nome || 'Reino'

  return (
    <div className="reino-mapa-page">
      <div className="reino-mapa-header">
        <h1>Mapa — {nome}</h1>
        <Link to="/reinos" className="button">← Voltar à lista de reinos</Link>
      </div>
      <div className="reino-mapa-frame">
        {imgError ? (
          <div className="reino-mapa-placeholder card">
            <p>Nenhum mapa disponível para este reino.</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>
              Adicione uma imagem com o nome do reino na pasta <code>front/historias/mapas/</code> (ex.: <code>{nome.replace(/\s+/g, '_')}.png</code>).
            </p>
          </div>
        ) : (
          <img
            src={mapUrl}
            alt={`Mapa de ${nome}`}
            className="reino-mapa-img"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <style>{`
        .reino-mapa-page { padding: 1rem; max-width: 1200px; margin: 0 auto; }
        .reino-mapa-header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; }
        .reino-mapa-header h1 { margin: 0; font-size: 1.5rem; }
        .reino-mapa-frame {
          background: var(--bg-card);
          border: 2px solid var(--border-frame);
          border-radius: 12px;
          padding: 1.5rem;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.2);
        }
        .reino-mapa-img { max-width: 100%; height: auto; max-height: 75vh; object-fit: contain; border-radius: 6px; }
        .reino-mapa-placeholder { text-align: center; padding: 2rem; max-width: 420px; }
        .reino-mapa-placeholder code { background: rgba(0,0,0,0.3); padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.85em; }
      `}</style>
    </div>
  )
}
