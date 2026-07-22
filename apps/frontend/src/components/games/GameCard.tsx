import { Link } from 'react-router-dom'
import type { Game } from 'shared-types'
import { GameCoverArt } from '../ui/GameCoverArt'
import { Badge } from '../ui/Badge'

interface GameCardProps {
  game: Game
  inLibrary: boolean
  isFavorite: boolean
  onToggleLibrary: () => void
  onToggleFavorite: () => void
}

export function GameCard({ game, inLibrary, isFavorite, onToggleLibrary, onToggleFavorite }: GameCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/60 hover:shadow-[0_12px_32px_-12px_var(--color-brand-600)]">
      <GameCoverArt title={game.title} genre={game.genre} className="aspect-video" />

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-text">{game.title}</h3>
          <button
            onClick={onToggleFavorite}
            aria-label="Favorito"
            className={`text-lg transition-transform hover:scale-110 ${
              isFavorite ? 'text-amber-400' : 'text-text-faint hover:text-amber-400'
            }`}
          >
            ★
          </button>
        </div>
        {game.genre && <Badge>{game.genre}</Badge>}
        {game.description && <p className="line-clamp-2 text-sm text-text-muted">{game.description}</p>}

        <div className="mt-auto flex items-center gap-2 pt-3">
          <Link
            to={`/play/${game.play_route}`}
            className="flex-1 rounded-md bg-gradient-to-r from-brand-500 to-brand-600 px-3 py-1.5 text-center text-sm font-medium text-white transition hover:shadow-[0_0_16px_-2px_var(--color-brand-400)]"
          >
            Jugar
          </Link>
          <button
            onClick={onToggleLibrary}
            className="rounded-md border border-border bg-bg-elevated px-3 py-1.5 text-sm text-text-muted transition hover:border-border-strong hover:text-text"
          >
            {inLibrary ? 'Quitar' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  )
}
