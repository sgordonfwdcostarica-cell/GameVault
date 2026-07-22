import { useEffect, useRef, useState } from 'react'

const GRID_SIZE = 20
const CELL_SIZE = 20
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE
const TICK_MS = 120

type Point = { x: number; y: number }
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

const OPPOSITE: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
}

function randomFood(snake: Point[]): Point {
  let food: Point
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }
  } while (snake.some((s) => s.x === food.x && s.y === food.y))
  return food
}

const INITIAL_SNAKE: Point[] = [{ x: 10, y: 10 }]

export function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const directionRef = useRef<Direction>('RIGHT')
  const nextDirectionRef = useRef<Direction>('RIGHT')

  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE)
  const [food, setFood] = useState<Point>(() => randomFood(INITIAL_SNAKE))
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const map: Record<string, Direction> = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
      }
      const next = map[e.key]
      if (!next) return
      e.preventDefault()
      if (next !== OPPOSITE[directionRef.current]) {
        nextDirectionRef.current = next
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (gameOver) return

    const interval = setInterval(() => {
      directionRef.current = nextDirectionRef.current

      setSnake((prev) => {
        const head = prev[0]
        const delta: Record<Direction, Point> = {
          UP: { x: 0, y: -1 },
          DOWN: { x: 0, y: 1 },
          LEFT: { x: -1, y: 0 },
          RIGHT: { x: 1, y: 0 },
        }
        const d = delta[directionRef.current]
        const newHead: Point = { x: head.x + d.x, y: head.y + d.y }

        const hitWall =
          newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE
        const hitSelf = prev.some((s) => s.x === newHead.x && s.y === newHead.y)

        if (hitWall || hitSelf) {
          setGameOver(true)
          return prev
        }

        const ateFood = newHead.x === food.x && newHead.y === food.y
        const newSnake = [newHead, ...prev]
        if (ateFood) {
          setScore((s) => s + 1)
          setFood(randomFood(newSnake))
        } else {
          newSnake.pop()
        }
        return newSnake
      })
    }, TICK_MS)

    return () => clearInterval(interval)
  }, [food, gameOver])

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#0f1115'
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    ctx.fillStyle = '#f87171'
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1)

    ctx.fillStyle = '#8b7bff'
    snake.forEach((s) => {
      ctx.fillRect(s.x * CELL_SIZE, s.y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1)
    })
  }, [snake, food])

  function reset() {
    directionRef.current = 'RIGHT'
    nextDirectionRef.current = 'RIGHT'
    setSnake(INITIAL_SNAKE)
    setFood(randomFood(INITIAL_SNAKE))
    setScore(0)
    setGameOver(false)
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4">
      <h1 className="font-display text-2xl font-bold text-text">Snake</h1>
      <p className="text-text-muted">Puntaje: {score}</p>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="rounded-md border border-border"
        />
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70">
            <p className="font-display text-xl font-bold text-text">Game Over</p>
            <button
              onClick={reset}
              className="rounded-md bg-brand-600 px-4 py-2 font-medium text-white transition hover:bg-brand-500"
            >
              Reintentar
            </button>
          </div>
        )}
      </div>

      <p className="text-sm text-text-faint">Usa las flechas del teclado para moverte</p>
    </div>
  )
}
