import type { ReactNode } from 'react'

export function AuthCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center pt-8">
      <div className="mb-6 font-display text-2xl font-semibold tracking-tight text-text">
        Game
        <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
          Vault
        </span>
      </div>

      <div className="w-full rounded-2xl border border-border bg-surface p-6 shadow-[0_0_40px_-20px_var(--color-brand-600)]">
        <h1 className="mb-6 font-display text-xl font-bold text-text">{title}</h1>
        {children}
      </div>
    </div>
  )
}
