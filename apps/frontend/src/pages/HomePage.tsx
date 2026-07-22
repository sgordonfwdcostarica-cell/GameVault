import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useGames } from '../hooks/useGames'
import { useLibrary } from '../hooks/useLibrary'
import { useAuth } from '../context/AuthContext'
import { GameCard } from '../components/games/GameCard'
import { HeroBanner } from '../components/games/HeroBanner'

function GameCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-border bg-surface">
      <div className="aspect-video bg-surface-hover" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-4 w-2/3 rounded bg-surface-hover" />
        <div className="h-3 w-1/3 rounded bg-surface-hover" />
        <div className="h-8 rounded bg-surface-hover" />
      </div>
    </div>
  )
}

export function HomePage() {
  const { games, loading, error } = useGames()
  const { user, isAdmin } = useAuth()
  const { addToLibrary, removeFromLibrary, toggleFavorite, isInLibrary, isFavorite } = useLibrary()
  const [genreFilter, setGenreFilter] = useState<string | null>(null)

  const genres = useMemo(
    () => Array.from(new Set(games.map((g) => g.genre).filter((g): g is string => !!g))),
    [games],
  )
  const visibleGames = genreFilter ? games.filter((g) => g.genre === genreFilter) : games

  if (isAdmin) return <Navigate to="/admin" replace />

  return (
    <div className="animate-fade-in">
      {!loading && games[0] && <HeroBanner game={games[0]} />}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text">Catálogo</h1>

        {genres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setGenreFilter(null)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                genreFilter === null
                  ? 'border-brand-500 bg-brand-500/15 text-brand-300'
                  : 'border-border bg-surface text-text-muted hover:text-text'
              }`}
            >
              Todos
            </button>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setGenreFilter(genre)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  genreFilter === genre
                    ? 'border-brand-500 bg-brand-500/15 text-brand-300'
                    : 'border-border bg-surface text-text-muted hover:text-text'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-red-400">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => <GameCardSkeleton key={i} />)}

        {!loading &&
          visibleGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              inLibrary={isInLibrary(game.id)}
              isFavorite={isFavorite(game.id)}
              onToggleLibrary={() => {
                if (!user) return
                isInLibrary(game.id) ? removeFromLibrary(game.id) : addToLibrary(game.id)
              }}
              onToggleFavorite={() => {
                if (!user) return
                toggleFavorite(game.id, isFavorite(game.id))
              }}
            />
          ))}
      </div>

      {!loading && visibleGames.length === 0 && (
        <p className="text-text-muted">No hay juegos en esta categoría todavía.</p>
      )}
    </div>
  )
}
