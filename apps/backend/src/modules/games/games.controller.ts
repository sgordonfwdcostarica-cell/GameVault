import type { Request, Response } from 'express'
import * as gamesService from './games.service.js'

export async function getGames(_req: Request, res: Response) {
  const games = await gamesService.listGames()
  res.json(games)
}

export async function postGame(req: Request, res: Response) {
  const { title, description, cover_url, genre, play_route } = req.body
  if (!title || !play_route) {
    return res.status(400).json({ error: 'title y play_route son requeridos' })
  }
  const game = await gamesService.createGame({
    title,
    description: description ?? null,
    cover_url: cover_url ?? null,
    genre: genre ?? null,
    play_route,
  })
  res.status(201).json(game)
}

export async function patchGame(req: Request, res: Response) {
  const { title, description, cover_url, genre, play_route } = req.body
  const game = await gamesService.updateGame(req.params.id, {
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(cover_url !== undefined && { cover_url }),
    ...(genre !== undefined && { genre }),
    ...(play_route !== undefined && { play_route }),
  })
  res.json(game)
}

export async function deleteGame(req: Request, res: Response) {
  await gamesService.deleteGame(req.params.id)
  res.status(204).send()
}
