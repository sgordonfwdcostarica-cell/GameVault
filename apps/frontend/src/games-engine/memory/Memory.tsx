import { useState } from 'react'

const SYMBOLS = ['🎮', '👾', '🕹️', '🏆', '⚡', '💎', '🚀', '🎯']

type Card = {
  id: number
  symbol: string
  flipped: boolean
  matched: boolean
}

function shuffledDeck(): Card[] {
  const deck = [...SYMBOLS, ...SYMBOLS]
    .map((symbol, i) => ({ id: i, symbol, flipped: false, matched: false }))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

export function Memory() {
  const [cards, setCards] = useState<Card[]>(shuffledDeck)
  const [flippedIds, setFlippedIds] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [busy, setBusy] = useState(false)

  const won = cards.every((c) => c.matched)

  function handleClick(card: Card) {
    if (busy || card.flipped || card.matched || flippedIds.length === 2) return

    const nextCards = cards.map((c) => (c.id === card.id ? { ...c, flipped: true } : c))
    const nextFlipped = [...flippedIds, card.id]
    setCards(nextCards)
    setFlippedIds(nextFlipped)

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1)
      const [firstId, secondId] = nextFlipped
      const first = nextCards.find((c) => c.id === firstId)!
      const second = nextCards.find((c) => c.id === secondId)!

      if (first.symbol === second.symbol) {
        setCards((prev) =>
          prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, matched: true } : c)),
        )
        setFlippedIds([])
      } else {
        setBusy(true)
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, flipped: false } : c)),
          )
          setFlippedIds([])
          setBusy(false)
        }, 700)
      }
    }
  }

  function reset() {
    setCards(shuffledDeck())
    setFlippedIds([])
    setMoves(0)
    setBusy(false)
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4">
      <h1 className="font-display text-2xl font-bold text-text">Memory Match</h1>
      <p className="text-text-muted">Movimientos: {moves}</p>

      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleClick(card)}
            className={`flex h-16 w-16 items-center justify-center rounded-md border text-2xl transition sm:h-20 sm:w-20 ${
              card.flipped || card.matched
                ? 'border-brand-500/50 bg-brand-500/10'
                : 'border-border bg-bg-elevated hover:bg-surface-hover'
            }`}
          >
            {card.flipped || card.matched ? card.symbol : ''}
          </button>
        ))}
      </div>

      {won && <p className="font-display text-xl font-bold text-text">¡Ganaste en {moves} movimientos!</p>}

      <button
        onClick={reset}
        className="rounded-md bg-brand-600 px-4 py-2 font-medium text-white transition hover:bg-brand-500"
      >
        Reiniciar
      </button>
    </div>
  )
}
