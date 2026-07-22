import { Link } from 'react-router-dom'
import type { Game } from 'shared-types'

export function HeroBanner({ game }: { game: Game }) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-brand-700 via-brand-600 to-accent-500">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(40rem 20rem at 90% 0%, rgba(255,255,255,0.25), transparent)',
        }}
      />
      <div className="relative flex flex-col gap-4 p-8 sm:p-10">
        <span className="w-fit rounded-full bg-black/25 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/80">
          Destacado
        </span>
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">{game.title}</h1>
        {game.description && <p className="max-w-xl text-white/85">{game.description}</p>}
        {game.genre && (
          <span className="w-fit rounded-full border border-white/30 bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/90">
            {game.genre}
          </span>
        )}
        <Link
          to={`/play/${game.play_route}`}
          className="mt-2 w-fit rounded-md bg-white px-5 py-2.5 font-medium text-brand-700 transition hover:bg-white/90"
        >
          Jugar ahora
        </Link>
      </div>
    </div>
  )
}
