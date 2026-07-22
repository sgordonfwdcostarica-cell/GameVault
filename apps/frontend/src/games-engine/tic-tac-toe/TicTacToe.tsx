import { useState } from 'react'

type Cell = 'X' | 'O' | null
type Board = Cell[]

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function getWinner(board: Board): Cell {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  return null
}

export function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [turn, setTurn] = useState<'X' | 'O'>('X')

  const winner = getWinner(board)
  const isDraw = !winner && board.every((cell) => cell !== null)

  function handleClick(index: number) {
    if (board[index] || winner) return
    const next = [...board]
    next[index] = turn
    setBoard(next)
    setTurn(turn === 'X' ? 'O' : 'X')
  }

  function reset() {
    setBoard(Array(9).fill(null))
    setTurn('X')
  }

  let status: string
  if (winner) status = `¡Gana ${winner}!`
  else if (isDraw) status = 'Empate'
  else status = `Turno de ${turn}`

  return (
    <div className="mx-auto flex max-w-xs flex-col items-center gap-6">
      <h1 className="font-display text-2xl font-bold text-text">Tic-Tac-Toe</h1>
      <p className="text-text-muted">{status}</p>

      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            disabled={!!cell || !!winner}
            className="flex h-20 w-20 items-center justify-center rounded-md border border-border bg-bg-elevated text-3xl font-bold text-text transition hover:bg-surface-hover disabled:cursor-default"
          >
            {cell}
          </button>
        ))}
      </div>

      <button
        onClick={reset}
        className="rounded-md bg-brand-600 px-4 py-2 font-medium text-white transition hover:bg-brand-500"
      >
        Reiniciar
      </button>
    </div>
  )
}
