export enum GameProgress {
  IN_LOBBY = 1,
  IN_GAME,
  FINISHED,
}

export enum PlayerRole {
  SPECTATOR = 1,
  PLAYER,
}

export enum GamePhase {
  INITIAL = 0,
  CHOOSE_CHARACTERS,
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

export enum CharacterType {
  NONE = 0,
  ASSASSIN,
  THIEF,
  MAGICIAN,
  KING,
  BISHOP,
  MERCHANT,
  ARCHITECT,
  WARLORD,
}

export enum ClientTurnState {
  INITIAL = 0,
  TAKE_RESOURCES,
  CHOOSE_CARD,
  CHOOSE_ACTION,
  ASSASSIN_KILL,
  THIEF_ROB,
  MAGICIAN_EXCHANGE_HAND,
  MAGICIAN_DISCARD_CARDS,
  MERCHANT_TAKE_1_GOLD,
  ARCHITECT_DRAW_2_CARDS,
  WARLORD_DESTROY_DISTRICT,
  BUILD_DISTRICT,
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
      characters: {
        id: number
      }[]
    }>
    gamePhase: GamePhase
    turnState: ClientTurnState
    playerOrder: string[],
    currentPlayer: number,
    currentPlayerExtraData: {
      districtsToBuild: number
      canTakeEarnings: boolean
      canDoSpecialAction: boolean
    }
    characters: {
      state: {
        type: CharacterChoosingStateType
        player: number
      }
      current: CharacterType
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
  settings: {
    completeCitySize: number
  }
}

export type GameSetupData = {
  players: string[]
}

export enum MoveType {
  AUTO = 0,

  CHOOSE_CHARACTER,

  TAKE_GOLD,
  DRAW_CARDS,

  ASSASSIN_KILL,
  THIEF_ROB,
  MAGICIAN_EXCHANGE_HAND,
  MAGICIAN_DISCARD_CARDS,
  TAKE_GOLD_EARNINGS,
  MERCHANT_TAKE_1_GOLD,
  ARCHITECT_DRAW_2_CARDS,
  WARLORD_DESTROY_DISTRICT,

  DECLINE,
  BUILD_DISTRICT,
  FINISH_TURN,
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
