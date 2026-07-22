import type { NextFunction, Request, Response } from 'express'
import { supabaseAdmin } from '../config/supabaseAdmin.js'

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Falta el token de autorización' })
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data.user) {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }

  req.userId = data.user.id
  next()
}
