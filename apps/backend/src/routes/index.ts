import { Router } from 'express'
import { gamesRouter } from '../modules/games/games.routes.js'

export const apiRouter = Router()

apiRouter.use('/games', gamesRouter)
