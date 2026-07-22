import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) return <p className="text-center text-text-muted">Cargando...</p>
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  return <>{children}</>
}
