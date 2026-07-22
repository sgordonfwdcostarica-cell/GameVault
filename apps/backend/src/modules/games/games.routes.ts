import { Router } from 'express'
import { requireAuth } from '../../middlewares/auth.middleware.js'
import { requireAdmin } from '../../middlewares/requireAdmin.js'
import * as controller from './games.controller.js'

export const gamesRouter = Router()

gamesRouter.get('/', controller.getGames)
gamesRouter.post('/', requireAuth, requireAdmin, controller.postGame)
gamesRouter.patch('/:id', requireAuth, requireAdmin, controller.patchGame)
gamesRouter.delete('/:id', requireAuth, requireAdmin, controller.deleteGame)
