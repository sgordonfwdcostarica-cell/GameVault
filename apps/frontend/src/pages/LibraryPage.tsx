import { Link, Navigate } from 'react-router-dom'
import { useGames } from '../hooks/useGames'
import { useLibrary } from '../hooks/useLibrary'
import { useAuth } from '../context/AuthContext'
import { GameCard } from '../components/games/GameCard'

export function LibraryPage() {
  const { isAdmin } = useAuth()
  const { games, loading } = useGames()
  const { removeFromLibrary, toggleFavorite, isInLibrary, isFavorite } = useLibrary()

  if (isAdmin) return <Navigate to="/admin" replace />

  const myGames = games.filter((g) => isInLibrary(g.id))

  return (
    <div className="animate-fade-in">
      <h1 className="mb-6 font-display text-2xl font-bold text-text">Mi biblioteca</h1>

      {loading && <p className="text-text-muted">Cargando...</p>}

      {!loading && myGames.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <span className="text-4xl">🎮</span>
          <p className="text-text-muted">Todavía no agregas juegos a tu biblioteca.</p>
          <Link
            to="/"
            className="mt-2 rounded-md bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:shadow-[0_0_16px_-2px_var(--color-brand-400)]"
          >
            Explorar catálogo
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {myGames.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            inLibrary
            isFavorite={isFavorite(game.id)}
            onToggleLibrary={() => removeFromLibrary(game.id)}
            onToggleFavorite={() => toggleFavorite(game.id, isFavorite(game.id))}
          />
        ))}
      </div>
    </div>
  )
}
