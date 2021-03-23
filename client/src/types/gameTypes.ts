export enum GameProgress {
  IN_LOBBY = 1,
  IN_GAME,
  FINISHED,
}

export type ClientGameState = {
  progress: GameProgress
  players: Map<string, {
    id: string
    username: string
    online: boolean
  }>
  self: string
}
