import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AuthCard } from '../components/ui/AuthCard'

export function RegisterPage() {
  const { signUp } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error } = await signUp(email, password, username)
    setSubmitting(false)
    if (error) setError(error)
    else setDone(true)
  }

  if (done) {
    return (
      <AuthCard title="Revisa tu correo">
        <p className="text-text-muted">
          Te enviamos un enlace de confirmación a <span className="text-text">{email}</span>.
        </p>
        <Link to="/login" className="mt-4 inline-block text-brand-400 hover:underline">
          Ir a iniciar sesión
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Crear cuenta">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="rounded-md border border-border bg-bg-elevated px-3 py-2 text-text placeholder-text-faint outline-none transition focus:border-brand-500"
        />
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
          minLength={6}
          className="rounded-md border border-border bg-bg-elevated px-3 py-2 text-text placeholder-text-faint outline-none transition focus:border-brand-500"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-gradient-to-r from-brand-500 to-brand-600 px-3 py-2 font-medium text-white transition hover:shadow-[0_0_20px_-4px_var(--color-brand-400)] disabled:opacity-50"
        >
          {submitting ? 'Creando cuenta...' : 'Registrarse'}
        </button>
      </form>
      <p className="mt-4 text-sm text-text-muted">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-brand-400 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </AuthCard>
  )
}
