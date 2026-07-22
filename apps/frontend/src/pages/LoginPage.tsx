import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AuthCard } from '../components/ui/AuthCard'

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) setError(error)
    else navigate('/')
  }

  return (
    <AuthCard title="Iniciar sesión">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-md border border-border bg-bg-elevated px-3 py-2 text-text placeholder-text-faint outline-none transition focus:border-brand-500"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded-md border border-border bg-bg-elevated px-3 py-2 text-text placeholder-text-faint outline-none transition focus:border-brand-500"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-gradient-to-r from-brand-500 to-brand-600 px-3 py-2 font-medium text-white transition hover:shadow-[0_0_20px_-4px_var(--color-brand-400)] disabled:opacity-50"
        >
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p className="mt-4 text-sm text-text-muted">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="text-brand-400 hover:underline">
          Regístrate
        </Link>
      </p>
    </AuthCard>
  )
}
