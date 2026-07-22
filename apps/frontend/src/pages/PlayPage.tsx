import { Link, useParams } from 'react-router-dom'
import { gameRegistry } from '../games-engine/registry'

export function PlayPage() {
  const { playRoute } = useParams<{ playRoute: string }>()
  const GameComponent = playRoute ? gameRegistry[playRoute] : undefined

  return (
    <div className="animate-fade-in">
      <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-text-muted hover:text-text">
        ← Volver al catálogo
      </Link>

      {GameComponent ? (
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10">
          <GameComponent />
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-text-muted">
          <h1 className="mb-2 font-display text-2xl font-bold text-text">Próximamente</h1>
          <p>Este juego ("{playRoute}") todavía no está implementado.</p>
        </div>
      )}
    </div>
  )
}
