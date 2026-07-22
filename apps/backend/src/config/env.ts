import 'dotenv/config'

function required(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Falta la variable de entorno ${name}`)
  return value
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  supabaseUrl: required('SUPABASE_URL'),
  supabaseServiceRoleKey: required('SUPABASE_SERVICE_ROLE_KEY'),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
}
