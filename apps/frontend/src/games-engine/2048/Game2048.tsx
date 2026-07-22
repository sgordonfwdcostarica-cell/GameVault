import { useEffect, useState } from 'react'

type Board = number[][]
type Direction = 'LEFT' | 'RIGHT' | 'UP' | 'DOWN'

function emptyBoard(): Board {
  return Array.from({ length: 4 }, () => Array(4).fill(0))
}

function cloneBoard(board: Board): Board {
  return board.map((row) => [...row])
}

function addRandomTile(board: Board): Board {
  const empties: [number, number][] = []
  board.forEach((row, r) => row.forEach((v, c) => v === 0 && empties.push([r, c])))
  if (empties.length === 0) return board
  const [r, c] = empties[Math.floor(Math.random() * empties.length)]
  const next = cloneBoard(board)
  next[r][c] = Math.random() < 0.9 ? 2 : 4
  return next
}

function transpose(board: Board): Board {
  return board[0].map((_, c) => board.map((row) => row[c]))
}

function reverseRows(board: Board): Board {
  return board.map((row) => [...row].reverse())
}

function slideRowLeft(row: number[]) {
  const filtered = row.filter((v) => v !== 0)
  const result: number[] = []
  let scoreGained = 0
  let i = 0
  while (i < filtered.length) {
    if (filtered[i] === filtered[i + 1]) {
      const merged = filtered[i] * 2
      result.push(merged)
      scoreGained += merged
      i += 2
    } else {
      result.push(filtered[i])
      i += 1
    }
  }
  while (result.length < 4) result.push(0)
  const moved = row.some((v, idx) => v !== result[idx])
  return { row: result, moved, scoreGained }
}

function move(board: Board, direction: Direction) {
  let moved = false
  let scoreGained = 0

  function processRows(rows: Board): Board {
    return rows.map((row) => {
      const result = slideRowLeft(row)
      if (result.moved) moved = true
      scoreGained += result.scoreGained
      return result.row
    })
  }

  let working: Board
  if (direction === 'LEFT') working = processRows(board)
  else if (direction === 'RIGHT') working = reverseRows(processRows(reverseRows(board)))
  else if (direction === 'UP') working = transpose(processRows(transpose(board)))
  else working = transpose(reverseRows(processRows(reverseRows(transpose(board)))))

  return { board: working, moved, scoreGained }
}

function canMove(board: Board): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) return true
      if (c < 3 && board[r][c] === board[r][c + 1]) return true
      if (r < 3 && board[r][c] === board[r + 1][c]) return true
    }
  }
  return false
}

const TILE_COLORS: Record<number, string> = {
  2: 'bg-white/10 text-white',
  4: 'bg-white/20 text-white',
  8: 'bg-orange-400/70 text-white',
  16: 'bg-orange-500/70 text-white',
  32: 'bg-red-400/70 text-white',
  64: 'bg-red-500/80 text-white',
  128: 'bg-yellow-400/80 text-black',
  256: 'bg-yellow-300/80 text-black',
  512: 'bg-yellow-200/80 text-black',
  1024: 'bg-brand-400 text-black',
  2048: 'bg-brand-500 text-white',
}

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
}

export function Game2048() {
  const [board, setBoard] = useState<Board>(() => addRandomTile(addRandomTile(emptyBoard())))
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const direction = KEY_TO_DIRECTION[e.key]
      if (!direction || gameOver || won) return
      e.preventDefault()

      setBoard((prev) => {
        const result = move(prev, direction)
        if (!result.moved) return prev
        setScore((s) => s + result.scoreGained)
        const withNewTile = addRandomTile(result.board)
        if (withNewTile.some((row) => row.includes(2048))) setWon(true)
        if (!canMove(withNewTile)) setGameOver(true)
        return withNewTile
      })
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameOver, won])

  function reset() {
    setBoard(addRandomTile(addRandomTile(emptyBoard())))
    setScore(0)
    setGameOver(false)
    setWon(false)
  }

  return (
    <div className="mx-auto flex max-w-xs flex-col items-center gap-4">
      <h1 className="font-display text-2xl font-bold text-text">2048</h1>
      <p className="text-text-muted">Puntaje: {score}</p>

      <div className="relative grid grid-cols-4 gap-2 rounded-md bg-bg-elevated p-2">
        {board.flat().map((value, i) => (
          <div
            key={i}
            className={`flex h-16 w-16 items-center justify-center rounded-md text-xl font-bold ${
              value ? (TILE_COLORS[value] ?? 'bg-brand-600 text-white') : 'bg-surface'
            }`}
          >
            {value || ''}
          </div>
        ))}

        {(gameOver || won) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-md bg-black/70">
            <p className="font-display text-xl font-bold text-text">{won ? '¡Llegaste a 2048!' : 'Game Over'}</p>
            <button
              onClick={reset}
              className="rounded-md bg-brand-600 px-4 py-2 font-medium text-white transition hover:bg-brand-500"
            >
              Reintentar
            </button>
          </div>
        )}
      </div>

      <p className="text-sm text-text-faint">Usa las flechas del teclado para mover las fichas</p>
    </div>
  )
}
