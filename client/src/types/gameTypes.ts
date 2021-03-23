export enum GameProgress {
  IN_LOBBY = 1,
  IN_GAME,
  FINISHED,
}

export enum PlayerRole {
  SPECTATOR = 1,
  PLAYER,
}

export type ClientGameState = {
  progress: GameProgress
  players: Map<string, {
    id: string
    username: string
    manager: boolean
    online: boolean
    role: PlayerRole
  }>
  self: string
}
