import { CharacterChoosingStateType as CCST, CharacterChoosingState } from './ChoosingState';
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
      case CCST.INITIAL:
        characters = CharacterManager.exportListInitial();
        break;
      case CCST.PUT_ASIDE_FACE_UP:
      case CCST.PUT_ASIDE_FACE_DOWN:
        characters = this.exportListPutAside(dest);
        break;
      case CCST.CHOOSE_CHARACTER:
        characters = this.exportListChooseCard(dest);
        break;
      case CCST.DONE:
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

  private exportListPutAside(dest: PlayerPosition) {
    return this.exportListChooseCard(dest, false);
  }

  private exportListChooseCard(dest: PlayerPosition, canSee = true) {
    const { player } = this.choosingState.getState();
    const isSpectator = player === PlayerPosition.SPECTATOR;
    const canSeeList = canSee && (isSpectator || dest === player);

    return {
      // current character
      current: this.currentCharacter,
      // callable characters: characters that have not been chosen
      callable: CharacterManager.getAllCharacters().filter(
        (characterType) => this.getCharactersAtPosition(CharacterPosition.NOT_CHOSEN)
          ?.includes(characterType),
      ).map((characterType) => ({
        id: canSeeList ? characterType + 1 : 0,
        selectable: dest === player,
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
        id: characterType + 1,
        killed: this.killedCharacter === characterType,
        robbed: this.robbedCharacter === characterType,
      })),
      // characters that are put aside
      aside: this.getAsideCards(),
    };
  }

  chooseRandomCharacter(avoidKing = false): boolean {
    const characters = this.getCharactersAtPosition(CharacterPosition.NOT_CHOSEN);
    let index;

    do {
      index = Math.floor(Math.random() * characters.length);
    } while (avoidKing && characters.length > 1 && characters[index] === CharacterType.KING);

    return this.chooseCharacter(index);
  }

  chooseCharacter(index: number): boolean {
    const characters = this.getCharactersAtPosition(CharacterPosition.NOT_CHOSEN);

    if (index < 0 || index >= characters.length) {
      return false;
    }

    if (this.choosingState.getState().player === PlayerPosition.SPECTATOR) {
      return false;
    }

    switch (this.choosingState.getState().type) {
      case CCST.PUT_ASIDE_FACE_UP:
        this.characters[characters[index]] = CharacterPosition.ASIDE_FACE_UP;
        return true;
      case CCST.PUT_ASIDE_FACE_DOWN:
        this.characters[characters[index]] = CharacterPosition.ASIDE_FACE_DOWN;
        return true;
      case CCST.CHOOSE_CHARACTER:
        this.characters[characters[index]] = (
          this.choosingState.getState().player + CharacterPosition.PLAYER_1
        );
        return true;

      default:
    }
    return false;
  }
}
