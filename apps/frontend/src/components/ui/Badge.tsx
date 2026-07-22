import type { ReactNode } from 'react'

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-text-muted">
      {children}
    </span>
  )
}
