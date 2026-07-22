import { useState, type FormEvent } from 'react'
import type { Game } from 'shared-types'
import { useGames } from '../hooks/useGames'
import { apiClient } from '../lib/apiClient'
import { GameCoverArt } from '../components/ui/GameCoverArt'

type GameForm = Omit<Game, 'id' | 'created_at'>

const EMPTY_FORM: GameForm = { title: '', description: '', cover_url: '', genre: '', play_route: '' }

const inputClass =
  'rounded-md border border-border bg-bg-elevated px-3 py-2 text-text placeholder-text-faint outline-none transition focus:border-brand-500'

export function AdminGamesPage() {
  const { games, loading, error: loadError } = useGames()
  const [form, setForm] = useState<GameForm>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function startEdit(game: Game) {
    setEditingId(game.id)
    setForm({
      title: game.title,
      description: game.description ?? '',
      cover_url: game.cover_url ?? '',
      genre: game.genre ?? '',
      play_route: game.play_route,
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      if (editingId) {
        await apiClient.patch(`/games/${editingId}`, form)
      } else {
        await apiClient.post('/games', form)
      }
      cancelEdit()
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Borrar este juego del catálogo?')) return
    try {
      await apiClient.delete(`/games/${id}`)
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al borrar')
    }
  }

  return (
    <div className="animate-fade-in">
      <h1 className="mb-6 font-display text-2xl font-bold text-text">Administrar catálogo</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid grid-cols-1 gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2"
      >
        <h2 className="col-span-full font-display font-semibold text-text">
          {editingId ? 'Editar juego' : 'Nuevo juego'}
        </h2>
        <input
          placeholder="Título"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className={inputClass}
        />
        <input
          placeholder="play_route (ej: snake)"
          value={form.play_route}
          onChange={(e) => setForm({ ...form, play_route: e.target.value })}
          required
          className={inputClass}
        />
        <input
          placeholder="Género"
          value={form.genre ?? ''}
          onChange={(e) => setForm({ ...form, genre: e.target.value })}
          className={inputClass}
        />
        <input
          placeholder="URL de portada (opcional)"
          value={form.cover_url ?? ''}
          onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
          className={inputClass}
        />
        <textarea
          placeholder="Descripción"
          value={form.description ?? ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={`col-span-full ${inputClass}`}
        />

        {error && <p className="col-span-full text-sm text-red-400">{error}</p>}

        <div className="col-span-full flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 font-medium text-white transition hover:shadow-[0_0_16px_-2px_var(--color-brand-400)] disabled:opacity-50"
          >
            {editingId ? 'Guardar cambios' : 'Crear juego'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-md border border-border bg-bg-elevated px-4 py-2 text-text-muted transition hover:text-text"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {loading && <p className="text-text-muted">Cargando...</p>}
      {loadError && <p className="text-red-400">{loadError}</p>}

      <div className="flex flex-col gap-2">
        {games.map((game) => (
          <div
            key={game.id}
            className="flex items-center justify-between rounded-md border border-border bg-surface px-4 py-2"
          >
            <div className="flex items-center gap-3">
              <GameCoverArt title={game.title} genre={game.genre} className="h-10 w-10 rounded-md" />
              <div>
                <p className="font-medium text-text">{game.title}</p>
                <p className="text-xs text-text-muted">
                  {game.genre} · /{game.play_route}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(game)}
                className="rounded-md border border-border bg-bg-elevated px-3 py-1.5 text-sm text-text-muted transition hover:text-text"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(game.id)}
                className="rounded-md bg-red-600/80 px-3 py-1.5 text-sm text-white transition hover:bg-red-600"
              >
                Borrar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
