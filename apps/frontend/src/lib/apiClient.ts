import { supabase } from './supabaseClient'

async function authHeaders(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method,
    headers: await authHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const payload = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(payload.error ?? 'Error en la petición')
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

export const apiClient = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
}
