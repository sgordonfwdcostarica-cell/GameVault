import { useState } from 'react'

type Cell = 0 | 1 | 2
type Board = Cell[][]

const ROWS = 6
const COLS = 7
const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
]

function emptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0) as Cell[])
}

function checkWinner(board: Board): Cell {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c]
      if (cell === 0) continue
      for (const [dr, dc] of DIRECTIONS) {
        let count = 1
        for (let k = 1; k < 4; k++) {
          const nr = r + dr * k
          const nc = c + dc * k
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || board[nr][nc] !== cell) break
          count++
        }
        if (count >= 4) return cell
      }
    }
  }
  return 0
}

const COLORS: Record<Cell, string> = {
  0: 'bg-surface',
  1: 'bg-red-500',
  2: 'bg-yellow-400',
}

export function ConnectFour() {
  const [board, setBoard] = useState<Board>(emptyBoard)
  const [turn, setTurn] = useState<1 | 2>(1)

  const winner = checkWinner(board)
  const isDraw = !winner && board.every((row) => row.every((cell) => cell !== 0))

  function handleClick(col: number) {
    if (winner) return
    const rowIndex = [...Array(ROWS).keys()].reverse().find((r) => board[r][col] === 0)
    if (rowIndex === undefined) return

    const next = board.map((row) => [...row])
    next[rowIndex][col] = turn
    setBoard(next)
    setTurn(turn === 1 ? 2 : 1)
  }

  function reset() {
    setBoard(emptyBoard())
    setTurn(1)
  }

  let status: string
  if (winner) status = `¡Gana el jugador ${winner === 1 ? 'Rojo' : 'Amarillo'}!`
  else if (isDraw) status = 'Empate'
  else status = `Turno: ${turn === 1 ? 'Rojo' : 'Amarillo'}`

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4">
      <h1 className="font-display text-2xl font-bold text-text">Conecta 4</h1>
      <p className="text-text-muted">{status}</p>

      <div className="grid grid-cols-7 gap-1 rounded-md bg-bg-elevated p-2">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => handleClick(c)}
              disabled={!!winner}
              className={`h-9 w-9 rounded-full sm:h-10 sm:w-10 ${COLORS[cell]}`}
            />
          )),
        )}
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
