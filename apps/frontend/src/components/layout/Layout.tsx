import type { ReactNode } from 'react'
import { Navbar } from './Navbar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-svh bg-bg text-text">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(60rem 30rem at 15% -10%, color-mix(in srgb, var(--color-brand-600) 18%, transparent), transparent), radial-gradient(50rem 25rem at 100% 10%, color-mix(in srgb, var(--color-accent-500) 12%, transparent), transparent)',
        }}
      />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
