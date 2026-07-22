import type { NextFunction, Request, Response } from 'express'
import { supabaseAdmin } from '../config/supabaseAdmin.js'

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('is_admin')
    .eq('id', req.userId)
    .single()

  if (error || !data?.is_admin) {
    return res.status(403).json({ error: 'Se requieren permisos de administrador' })
  }

  next()
}
