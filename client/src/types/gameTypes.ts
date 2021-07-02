export enum GameProgress {
  IN_LOBBY = 1,
  IN_GAME,
  FINISHED,
}

export enum PlayerRole {
  SPECTATOR = 1,
  PLAYER,
}

export enum TurnPhase {
  CHOOSE_CHARACTERS = 0,
  DO_ACTIONS,
}

export enum CharacterChoosingStateType {
  INITIAL = 0,
  PUT_ASIDE_FACE_UP,
  PUT_ASIDE_FACE_DOWN,
  CHOOSE_CHARACTER,
  GET_ASIDE_FACE_DOWN,
  DONE,
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
  board: {
    players: Map<string, {
      stash: number
      hand: (string | null)[]
      city: string[]
    }>
    turnPhase: TurnPhase
    playerOrder: string[],
    currentPlayer: number,
    crown: string
    characters: {
      state: {
        type: CharacterChoosingStateType
        player: number
      }
      current: number
      callable: {
        id: number
        killed: boolean
        robbed: boolean
      }[]
      aside: {
        id: number
      }[]
    }
  }
}

export type GameSetupData = {
  players: string[]
}

export enum MoveType {
  AUTO = 0,
}

export interface Move {
  type: MoveType
  data?: any
}

export interface Action {
  title: string
  move: Move
}

export type StatusBarMessageType = 'NORMAL' | 'HIGHLIGHTED' | 'ERROR'

export interface StatusBarData {
  type: StatusBarMessageType
  message: string,
  args?: string[]
  actions?: Action[]
}
