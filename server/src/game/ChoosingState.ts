import { PlayerPosition } from './Player';

export enum CharacterChoosingStateType {
  INITIAL = 0,
  PUT_ASIDE_FACE_UP,
  PUT_ASIDE_FACE_DOWN,
  CHOOSE_CHARACTER,
  GET_ASIDE_FACE_DOWN,
  DONE,
}

export type CharacterChoosingStateData = {
  type: CharacterChoosingStateType,
  player: PlayerPosition
};

export type CharacterChoosingStateArray = Array<CharacterChoosingStateData>;

export class CharacterChoosingState {
  states: CharacterChoosingStateArray;
  stateNumber: number;

  constructor(playerCount: number) {
    switch (playerCount) {
      case 2:
        this.states = CharacterChoosingState.choosingStates2P;
        break;
      case 3:
        this.states = CharacterChoosingState.choosingStates3P;
        break;
      case 4:
        this.states = CharacterChoosingState.choosingStates4P;
        break;
      case 5:
        this.states = CharacterChoosingState.choosingStates5P;
        break;
      case 6:
        this.states = CharacterChoosingState.choosingStates6P;
        break;
      case 7:
        this.states = CharacterChoosingState.choosingStates7P;
        break;
      default:
        throw new Error('invalid number of players');
    }

    this.stateNumber = 0;
  }

  reset() {
    this.stateNumber = 0;
  }

  step() {
    if (this.getState().type !== CharacterChoosingStateType.DONE
      && this.stateNumber < this.states.length - 1) {
      this.stateNumber += 1;
    } else {
      throw new Error('cannot step further');
    }
  }

  getState() {
    return this.states[this.stateNumber];
  }

  private static choosingStates2P: CharacterChoosingStateArray = [
    { type: CharacterChoosingStateType.INITIAL, player: PlayerPosition.SPECTATOR },
    { type: CharacterChoosingStateType.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.PLAYER_1 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_1 },
    { type: CharacterChoosingStateType.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.PLAYER_2 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_2 },
    { type: CharacterChoosingStateType.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.PLAYER_1 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_1 },
    { type: CharacterChoosingStateType.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.PLAYER_2 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_2 },
    { type: CharacterChoosingStateType.DONE, player: PlayerPosition.SPECTATOR },
  ];

  private static choosingStates3P: CharacterChoosingStateArray = [
    { type: CharacterChoosingStateType.INITIAL, player: PlayerPosition.SPECTATOR },
    { type: CharacterChoosingStateType.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.PLAYER_1 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_1 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_2 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_3 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_1 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_2 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_3 },
    { type: CharacterChoosingStateType.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.SPECTATOR },
    { type: CharacterChoosingStateType.DONE, player: PlayerPosition.SPECTATOR },
  ];

  private static choosingStates4P: CharacterChoosingStateArray = [
    { type: CharacterChoosingStateType.INITIAL, player: PlayerPosition.SPECTATOR },
    { type: CharacterChoosingStateType.PUT_ASIDE_FACE_UP, player: PlayerPosition.PLAYER_1 },
    { type: CharacterChoosingStateType.PUT_ASIDE_FACE_UP, player: PlayerPosition.PLAYER_1 },
    { type: CharacterChoosingStateType.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.PLAYER_1 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_1 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_2 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_3 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_4 },
    { type: CharacterChoosingStateType.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.SPECTATOR },
    { type: CharacterChoosingStateType.DONE, player: PlayerPosition.SPECTATOR },
  ];

  private static choosingStates5P: CharacterChoosingStateArray = [
    { type: CharacterChoosingStateType.INITIAL, player: PlayerPosition.SPECTATOR },
    { type: CharacterChoosingStateType.PUT_ASIDE_FACE_UP, player: PlayerPosition.PLAYER_1 },
    { type: CharacterChoosingStateType.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.PLAYER_1 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_1 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_2 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_3 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_4 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_5 },
    { type: CharacterChoosingStateType.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.SPECTATOR },
    { type: CharacterChoosingStateType.DONE, player: PlayerPosition.SPECTATOR },
  ];

  private static choosingStates6P: CharacterChoosingStateArray = [
    { type: CharacterChoosingStateType.INITIAL, player: PlayerPosition.SPECTATOR },
    { type: CharacterChoosingStateType.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.PLAYER_1 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_1 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_2 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_3 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_4 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_5 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_6 },
    { type: CharacterChoosingStateType.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.SPECTATOR },
    { type: CharacterChoosingStateType.DONE, player: PlayerPosition.SPECTATOR },
  ];

  private static choosingStates7P: CharacterChoosingStateArray = [
    { type: CharacterChoosingStateType.INITIAL, player: PlayerPosition.SPECTATOR },
    { type: CharacterChoosingStateType.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.PLAYER_1 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_1 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_2 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_3 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_4 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_5 },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_6 },
    { type: CharacterChoosingStateType.GET_ASIDE_FACE_DOWN, player: PlayerPosition.SPECTATOR },
    { type: CharacterChoosingStateType.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_7 },
    { type: CharacterChoosingStateType.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.SPECTATOR },
    { type: CharacterChoosingStateType.DONE, player: PlayerPosition.SPECTATOR },
  ];
}
