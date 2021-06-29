import { CharacterChoosingStateType, CharacterChoosingState } from './ChoosingState';
import { PlayerPosition } from './Player';

export enum CharacterType {
  NONE = -1,
  ASSASSIN,
  THIEF,
  MAGICIAN,
  KING,
  BISHOP,
  MERCHANT,
  ARCHITECT,
  WARLORD,
  CHARACTER_COUNT,
}

export enum CharacterPosition {
  NOT_CHOSEN = 0,
  ASIDE_FACE_UP,
  ASIDE_FACE_DOWN,
  PLAYER_1,
  PLAYER_2,
  PLAYER_3,
  PLAYER_4,
  PLAYER_5,
  PLAYER_6,
  PLAYER_7,
}

export default class CharacterManager {
  // characters position on board, indexed by CharacterType
  characters: Array<CharacterPosition>;

  // choosing state
  choosingState: CharacterChoosingState;

  // turn progress state
  currentCharacter: CharacterType;

  // special character attributes
  killedCharacter: CharacterType;
  robbedCharacter: CharacterType;

  constructor(playerCount: number) {
    this.characters = Array(CharacterType.CHARACTER_COUNT).fill(CharacterPosition.NOT_CHOSEN);
    this.choosingState = new CharacterChoosingState(playerCount);
    this.currentCharacter = CharacterType.NONE;
    this.killedCharacter = CharacterType.NONE;
    this.robbedCharacter = CharacterType.NONE;
  }

  static getAllCharacters() {
    return Array.from(Array(CharacterType.CHARACTER_COUNT).keys()) as CharacterType[];
  }

  private getCharactersAtPosition(pos: CharacterPosition) {
    return this.characters.reduce((characters, position, character) => {
      if (position === pos) characters.push(character);
      return characters;
    }, new Array<CharacterType>());
  }

  exportPlayerCharacters(pos: PlayerPosition, dest: PlayerPosition) {
    // can see cards if player is spectator or if cards are their own
    const canSee = dest === PlayerPosition.SPECTATOR || dest === pos;
    const characterPos = pos + CharacterPosition.PLAYER_1 as CharacterPosition;
    return this.getCharactersAtPosition(characterPos).map((characterType) => ({
      id: canSee ? characterType + 1 : 0,
    }));
  }

  exportCharactersList(dest: PlayerPosition) {
    let characters = {};

    switch (this.choosingState.getState().type) {
      case CharacterChoosingStateType.INITIAL:
        characters = CharacterManager.exportListInitial();
        break;
      case CharacterChoosingStateType.PUT_ASIDE_FACE_UP:
      case CharacterChoosingStateType.PUT_ASIDE_FACE_DOWN:
        characters = this.exportListPutAside();
        break;
      case CharacterChoosingStateType.CHOOSE_CHARACTER:
        characters = this.exportListChooseCard(dest);
        break;
      case CharacterChoosingStateType.DONE:
        characters = this.exportListDone();
        break;
      default:
    }

    return {
      state: this.choosingState.getState(),
      ...characters,
    };
  }

  private getAsideCards() {
    return [
      ...(this.getCharactersAtPosition(CharacterPosition.ASIDE_FACE_DOWN)?.map(() => ({
        id: 0,
      })) || []),
      ...(this.getCharactersAtPosition(CharacterPosition.ASIDE_FACE_UP)?.map((characterType) => ({
        id: characterType + 1,
      })) || [])];
  }

  private static exportListInitial() {
    return {
      current: CharacterType.NONE + 1,
      callable: CharacterManager.getAllCharacters().map((characterType) => ({
        id: characterType + 1,
      })),
      aside: [],

    };
  }

  private exportListPutAside() {
    return this.exportListChooseCard(PlayerPosition.SPECTATOR, false);
  }

  private exportListChooseCard(dest: PlayerPosition, canSee = true) {
    const { player } = this.choosingState.getState();
    const isSpectator = player === PlayerPosition.SPECTATOR;
    const canSeeList = canSee && (isSpectator || dest === player);

    return {
      // current character
      current: this.currentCharacter,
      // callable characters: all characters except those that are aside and face up
      callable: CharacterManager.getAllCharacters().filter(
        (characterType) => !this.getCharactersAtPosition(CharacterPosition.ASIDE_FACE_UP)
          ?.includes(characterType),
      ).map((characterType) => ({
        id: canSeeList ? characterType : 0,
      })),
      // characters that are put aside
      aside: this.getAsideCards(),
    };
  }

  private exportListDone() {
    return {
      // current character
      current: this.currentCharacter,
      // callable characters: all characters except those that are aside and face up
      callable: CharacterManager.getAllCharacters().filter(
        (characterType) => !this.getCharactersAtPosition(CharacterPosition.ASIDE_FACE_UP)
          ?.includes(characterType),
      ).map((characterType) => ({
        id: characterType,
        killed: this.killedCharacter === characterType,
        robbed: this.robbedCharacter === characterType,
      })),
      // characters that are put aside
      aside: this.getAsideCards(),
    };
  }
}
