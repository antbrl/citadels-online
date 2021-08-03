import districtsJson from './districts.json';

export const districts = districtsJson;

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
  PUT_ASIDE_FACE_DOWN_UP,
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
  GRAVEYARD_RECOVER_DISTRICT,
  LABORATORY_DISCARD_CARD,
  BUILD_DISTRICT,
  DONE,
}

export interface PlayerScore {
  base?: number
  extraPointsStash?: number
  extraPointsHand?: number
  extraPointsDistrictTypes?: number
  extraPointsCompleteCity?: number
  total?: number
}

export type PlayerBoard = {
  stash: number
  hand: (string | null)[]
  tmpHand: (string | null)[]
  city: string[]
  score: PlayerScore
  characters: {
    id: number
  }[]
};

export type PlayerExtraData = {
  districtsToBuild: number
  canTakeEarnings: boolean
  canDoSpecialAction: boolean
  hasUsedLaboratory: boolean
  hasUsedSmithy: boolean
  earningsValue: number
};

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
    players: Map<string, PlayerBoard>
    gamePhase: GamePhase
    turnState: ClientTurnState
    playerOrder: string[],
    currentPlayer: number,
    currentPlayerExtraData: PlayerExtraData
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
    graveyard: string | undefined
  }
  settings: {
    completeCitySize: number
  }
};

export type GameSetupData = {
  players: string[]
  completeCitySize: number
};

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

  GRAVEYARD_RECOVER_DISTRICT,
  SMITHY_DRAW_CARDS,
  LABORATORY_DISCARD_CARD,

  DECLINE,
  BUILD_DISTRICT,
  FINISH_TURN,
}

export interface Move {
  type: MoveType
  data?: any
}
