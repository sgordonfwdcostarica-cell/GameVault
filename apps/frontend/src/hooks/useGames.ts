import { useEffect, useState } from 'react'
import type { Game } from 'shared-types'
import { supabase } from '../lib/supabaseClient'

export function useGames() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    supabase
      .from('games')
      .select('*')
      .order('title')
      .then(({ data, error }) => {
        if (!active) return
        if (error) setError(error.message)
        else setGames(data ?? [])
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return { games, loading, error }
}
