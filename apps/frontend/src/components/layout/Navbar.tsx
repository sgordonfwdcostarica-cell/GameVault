import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function NavItem({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative py-1 text-sm transition-colors ${
          isActive ? 'text-text' : 'text-text-muted hover:text-text'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {children}
          <span
            className={`absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-brand-400 to-accent-400 transition-transform duration-300 group-hover:scale-x-100 ${
              isActive ? 'scale-x-100' : ''
            }`}
          />
        </>
      )}
    </NavLink>
  )
}

export function Navbar() {
  const { user, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink
          to={isAdmin ? '/admin' : '/'}
          className="font-display text-lg font-semibold tracking-tight text-text"
        >
          Game
          <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
            Vault
          </span>
        </NavLink>

        <div className="flex items-center gap-5">
          {isAdmin ? (
            <NavItem to="/admin">Administrar catálogo</NavItem>
          ) : (
            <>
              <NavItem to="/">Catálogo</NavItem>
              {user && <NavItem to="/library">Mi biblioteca</NavItem>}
            </>
          )}

          {user ? (
            <button
              onClick={handleSignOut}
              className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text-muted transition hover:border-border-strong hover:bg-surface-hover hover:text-text"
            >
              Cerrar sesión
            </button>
          ) : (
            <>
              <NavItem to="/login">Iniciar sesión</NavItem>
              <NavLink
                to="/register"
                className="rounded-md bg-gradient-to-r from-brand-500 to-brand-600 px-3 py-1.5 text-sm font-medium text-white shadow-[0_0_20px_-6px_var(--color-brand-500)] transition hover:shadow-[0_0_24px_-4px_var(--color-brand-400)]"
              >
                Registrarse
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
