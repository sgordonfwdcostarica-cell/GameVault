const GRADIENTS = [
  'from-brand-600 via-brand-500 to-accent-500',
  'from-accent-500 via-brand-500 to-brand-700',
  'from-brand-700 via-brand-400 to-accent-400',
  'from-accent-400 via-brand-600 to-brand-400',
]

const GENRE_ICONS: Record<string, string> = {
  Arcade: '🕹️',
  Puzzle: '🧩',
  Estrategia: '♟️',
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  }
  return hash
}

interface GameCoverArtProps {
  title: string
  genre: string | null
  className?: string
}

export function GameCoverArt({ title, genre, className = '' }: GameCoverArtProps) {
  const gradient = GRADIENTS[hashString(title) % GRADIENTS.length]
  const icon = (genre && GENRE_ICONS[genre]) ?? '🎮'

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br ${gradient} ${className}`}
    >
      <span className="text-4xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">{icon}</span>
    </div>
  )
}
