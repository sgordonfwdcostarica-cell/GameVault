export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  is_admin: boolean
  created_at: string
}

export interface Game {
  id: string
  title: string
  description: string | null
  cover_url: string | null
  genre: string | null
  play_route: string
  created_at: string
}

export interface LibraryEntry {
  id: string
  user_id: string
  game_id: string
  is_favorite: boolean
  added_at: string
}

export interface LibraryEntryWithGame extends LibraryEntry {
  game: Game
}
