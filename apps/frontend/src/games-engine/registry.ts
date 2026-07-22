import type { ComponentType } from 'react'
import { TicTacToe } from './tic-tac-toe/TicTacToe'
import { Snake } from './snake/Snake'
import { Memory } from './memory/Memory'
import { Game2048 } from './2048/Game2048'
import { Pong } from './pong/Pong'
import { ConnectFour } from './connect-four/ConnectFour'

export const gameRegistry: Record<string, ComponentType> = {
  'tic-tac-toe': TicTacToe,
  snake: Snake,
  memory: Memory,
  '2048': Game2048,
  pong: Pong,
  'connect-four': ConnectFour,
}
