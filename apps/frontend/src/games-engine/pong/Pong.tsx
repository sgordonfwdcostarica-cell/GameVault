import { useEffect, useRef, useState } from 'react'

const WIDTH = 480
const HEIGHT = 300
const PADDLE_WIDTH = 10
const PADDLE_HEIGHT = 70
const PADDLE_SPEED = 6
const BALL_SIZE = 10
const AI_SPEED = 4

export function Pong() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    playerY: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    aiY: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    ballX: WIDTH / 2,
    ballY: HEIGHT / 2,
    ballVX: 4,
    ballVY: 3,
    upPressed: false,
    downPressed: false,
  })
  const [score, setScore] = useState({ player: 0, cpu: 0 })

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowUp') stateRef.current.upPressed = true
      if (e.key === 'ArrowDown') stateRef.current.downPressed = true
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault()
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === 'ArrowUp') stateRef.current.upPressed = false
      if (e.key === 'ArrowDown') stateRef.current.downPressed = false
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const context: CanvasRenderingContext2D = ctx
    let animationId: number

    function resetBall(direction: number) {
      const s = stateRef.current
      s.ballX = WIDTH / 2
      s.ballY = HEIGHT / 2
      s.ballVX = 4 * direction
      s.ballVY = Math.random() * 4 - 2
    }

    function tick() {
      const s = stateRef.current

      if (s.upPressed) s.playerY = Math.max(0, s.playerY - PADDLE_SPEED)
      if (s.downPressed) s.playerY = Math.min(HEIGHT - PADDLE_HEIGHT, s.playerY + PADDLE_SPEED)

      const aiCenter = s.aiY + PADDLE_HEIGHT / 2
      if (aiCenter < s.ballY - 10) s.aiY = Math.min(HEIGHT - PADDLE_HEIGHT, s.aiY + AI_SPEED)
      else if (aiCenter > s.ballY + 10) s.aiY = Math.max(0, s.aiY - AI_SPEED)

      s.ballX += s.ballVX
      s.ballY += s.ballVY

      if (s.ballY <= 0 || s.ballY >= HEIGHT - BALL_SIZE) s.ballVY *= -1

      if (
        s.ballX <= 20 &&
        s.ballX >= 10 &&
        s.ballY + BALL_SIZE >= s.playerY &&
        s.ballY <= s.playerY + PADDLE_HEIGHT
      ) {
        s.ballVX = Math.abs(s.ballVX)
      }

      if (
        s.ballX + BALL_SIZE >= WIDTH - 20 &&
        s.ballX + BALL_SIZE <= WIDTH - 10 &&
        s.ballY + BALL_SIZE >= s.aiY &&
        s.ballY <= s.aiY + PADDLE_HEIGHT
      ) {
        s.ballVX = -Math.abs(s.ballVX)
      }

      if (s.ballX < 0) {
        setScore((sc) => ({ ...sc, cpu: sc.cpu + 1 }))
        resetBall(1)
      } else if (s.ballX > WIDTH) {
        setScore((sc) => ({ ...sc, player: sc.player + 1 }))
        resetBall(-1)
      }

      context.fillStyle = '#0f1115'
      context.fillRect(0, 0, WIDTH, HEIGHT)
      context.fillStyle = '#8b7bff'
      context.fillRect(10, s.playerY, PADDLE_WIDTH, PADDLE_HEIGHT)
      context.fillRect(WIDTH - 20, s.aiY, PADDLE_WIDTH, PADDLE_HEIGHT)
      context.fillStyle = '#f87171'
      context.fillRect(s.ballX, s.ballY, BALL_SIZE, BALL_SIZE)

      animationId = requestAnimationFrame(tick)
    }

    animationId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4">
      <h1 className="font-display text-2xl font-bold text-text">Pong</h1>
      <p className="text-text-muted">
        Tú {score.player} — {score.cpu} CPU
      </p>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        className="rounded-md border border-border"
      />
      <p className="text-sm text-text-faint">Usa las flechas ↑ ↓ para mover tu paleta</p>
    </div>
  )
}
