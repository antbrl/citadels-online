import { CharacterChoosingStateType as CCST } from 'citadels-common';
import { PlayerPosition } from './Player';

export type CharacterChoosingStateData = {
  type: CCST,
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
    if (this.getState().type !== CCST.DONE
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
    { type: CCST.INITIAL, player: PlayerPosition.SPECTATOR },
    { type: CCST.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.PLAYER_1 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_1 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_2 },
    { type: CCST.PUT_ASIDE_FACE_DOWN_UP, player: PlayerPosition.PLAYER_2 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_1 },
    { type: CCST.PUT_ASIDE_FACE_DOWN_UP, player: PlayerPosition.PLAYER_1 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_2 },
    { type: CCST.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.SPECTATOR },
    { type: CCST.DONE, player: PlayerPosition.SPECTATOR },
  ];

  private static choosingStates3P: CharacterChoosingStateArray = [
    { type: CCST.INITIAL, player: PlayerPosition.SPECTATOR },
    { type: CCST.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.PLAYER_1 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_1 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_2 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_3 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_1 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_2 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_3 },
    { type: CCST.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.SPECTATOR },
    { type: CCST.DONE, player: PlayerPosition.SPECTATOR },
  ];

  private static choosingStates4P: CharacterChoosingStateArray = [
    { type: CCST.INITIAL, player: PlayerPosition.SPECTATOR },
    { type: CCST.PUT_ASIDE_FACE_UP, player: PlayerPosition.PLAYER_1 },
    { type: CCST.PUT_ASIDE_FACE_UP, player: PlayerPosition.PLAYER_1 },
    { type: CCST.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.PLAYER_1 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_1 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_2 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_3 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_4 },
    { type: CCST.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.SPECTATOR },
    { type: CCST.DONE, player: PlayerPosition.SPECTATOR },
  ];

  private static choosingStates5P: CharacterChoosingStateArray = [
    { type: CCST.INITIAL, player: PlayerPosition.SPECTATOR },
    { type: CCST.PUT_ASIDE_FACE_UP, player: PlayerPosition.PLAYER_1 },
    { type: CCST.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.PLAYER_1 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_1 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_2 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_3 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_4 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_5 },
    { type: CCST.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.SPECTATOR },
    { type: CCST.DONE, player: PlayerPosition.SPECTATOR },
  ];

  private static choosingStates6P: CharacterChoosingStateArray = [
    { type: CCST.INITIAL, player: PlayerPosition.SPECTATOR },
    { type: CCST.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.PLAYER_1 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_1 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_2 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_3 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_4 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_5 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_6 },
    { type: CCST.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.SPECTATOR },
    { type: CCST.DONE, player: PlayerPosition.SPECTATOR },
  ];

  private static choosingStates7P: CharacterChoosingStateArray = [
    { type: CCST.INITIAL, player: PlayerPosition.SPECTATOR },
    { type: CCST.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.PLAYER_1 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_1 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_2 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_3 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_4 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_5 },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_6 },
    { type: CCST.GET_ASIDE_FACE_DOWN, player: PlayerPosition.SPECTATOR },
    { type: CCST.CHOOSE_CHARACTER, player: PlayerPosition.PLAYER_7 },
    { type: CCST.PUT_ASIDE_FACE_DOWN, player: PlayerPosition.SPECTATOR },
    { type: CCST.DONE, player: PlayerPosition.SPECTATOR },
  ];
}
