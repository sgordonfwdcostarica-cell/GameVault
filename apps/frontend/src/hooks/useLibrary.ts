import { useCallback, useEffect, useState } from 'react'
import type { LibraryEntry } from 'shared-types'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export function useLibrary() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<LibraryEntry[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!user) {
      setEntries([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data } = await supabase
      .from('library_entries')
      .select('*')
      .eq('user_id', user.id)
    setEntries(data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function addToLibrary(gameId: string) {
    if (!user) return
    await supabase
      .from('library_entries')
      .upsert({ user_id: user.id, game_id: gameId }, { onConflict: 'user_id,game_id' })
    await refresh()
  }

  async function removeFromLibrary(gameId: string) {
    if (!user) return
    await supabase
      .from('library_entries')
      .delete()
      .eq('user_id', user.id)
      .eq('game_id', gameId)
    await refresh()
  }

  async function toggleFavorite(gameId: string, current: boolean) {
    if (!user) return
    await supabase
      .from('library_entries')
      .upsert(
        { user_id: user.id, game_id: gameId, is_favorite: !current },
        { onConflict: 'user_id,game_id' },
      )
    await refresh()
  }

  function isInLibrary(gameId: string) {
    return entries.some((e) => e.game_id === gameId)
  }

  function isFavorite(gameId: string) {
    return entries.some((e) => e.game_id === gameId && e.is_favorite)
  }

  return { entries, loading, addToLibrary, removeFromLibrary, toggleFavorite, isInLibrary, isFavorite }
}
