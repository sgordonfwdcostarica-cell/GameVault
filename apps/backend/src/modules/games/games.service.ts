import type { Game } from 'shared-types'
import { supabaseAdmin } from '../../config/supabaseAdmin.js'

export async function listGames(): Promise<Game[]> {
  const { data, error } = await supabaseAdmin.from('games').select('*').order('title')
  if (error) throw new Error(error.message)
  return data
}

export async function createGame(input: Omit<Game, 'id' | 'created_at'>): Promise<Game> {
  const { data, error } = await supabaseAdmin.from('games').insert(input).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateGame(id: string, input: Partial<Omit<Game, 'id' | 'created_at'>>): Promise<Game> {
  const { data, error } = await supabaseAdmin.from('games').update(input).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteGame(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from('games').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
