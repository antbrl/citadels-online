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

export enum TurnState {
  INITIAL = 0,

  ASSASSIN_RESOURCES,
  ASSASSIN_CHOOSE_CARD,
  ASSASSIN_ACTIONS,
  ASSASSIN_KILL,
  ASSASSIN_BUILD,

  THIEF_RESOURCES,
  THIEF_CHOOSE_CARD,
  THIEF_ACTIONS,
  THIEF_ROB,
  THIEF_BUILD,

  MAGICIAN_RESOURCES,
  MAGICIAN_CHOOSE_CARD,
  MAGICIAN_ACTIONS,
  MAGICIAN_EXCHANGE_HAND,
  MAGICIAN_DISCARD_CARDS,
  MAGICIAN_BUILD,

  KING_RESOURCES,
  KING_CHOOSE_CARD,
  KING_ACTIONS,
  KING_BUILD,

  BISHOP_RESOURCES,
  BISHOP_CHOOSE_CARD,
  BISHOP_ACTIONS,
  BISHOP_BUILD,

  MERCHANT_RESOURCES,
  MERCHANT_CHOOSE_CARD,
  MERCHANT_TAKE_1_GOLD,
  MERCHANT_ACTIONS,
  MERCHANT_BUILD,

  ARCHITECT_RESOURCES,
  ARCHITECT_CHOOSE_CARD,
  ARCHITECT_DRAW_2_CARDS,
  ARCHITECT_ACTIONS,
  ARCHITECT_BUILD,

  WARLORD_RESOURCES,
  WARLORD_CHOOSE_CARD,
  WARLORD_ACTIONS,
  WARLORD_DESTROY_DISTRICT,
  WARLORD_BUILD,

  GRAVEYARD_RECOVER_DISTRICT,

  DONE,
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
  BUILD_DISTRICT,
  DONE,
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
  // player count between 2 and 7
  playerCount: number;

  // characters position on board, indexed by CharacterType
  characters!: Array<CharacterPosition>;

  // choosing state
  choosingState: CharacterChoosingState;

  // turn progress state
  turnState!: TurnState;

  // special character attributes
  killedCharacter!: CharacterType;
  robbedCharacter!: CharacterType;

  // action restriction data
  districtsToBuild!: number[];
  canTakeEarnings!: boolean[];
  canDoSpecialAction!: boolean[];

  constructor(playerCount: number) {
    this.playerCount = playerCount;
    this.choosingState = new CharacterChoosingState(playerCount);
    this.reset();
  }

  reset() {
    this.characters = Array(CharacterType.CHARACTER_COUNT).fill(CharacterPosition.NOT_CHOSEN);
    this.choosingState.reset();
    this.turnState = TurnState.INITIAL;
    this.killedCharacter = CharacterType.NONE;
    this.robbedCharacter = CharacterType.NONE;
    this.districtsToBuild = [1, 1, 1, 1, 1, 1, 3, 1];
    this.canTakeEarnings = [false, false, false, true, true, true, false, true];
    this.canDoSpecialAction = [true, true, true, false, false, true, true, true];
  }

  jumpToCharacter(character: CharacterType) {
    this.turnState = [
      TurnState.ASSASSIN_RESOURCES,
      TurnState.THIEF_RESOURCES,
      TurnState.MAGICIAN_RESOURCES,
      TurnState.KING_RESOURCES,
      TurnState.BISHOP_RESOURCES,
      TurnState.MERCHANT_RESOURCES,
      TurnState.ARCHITECT_RESOURCES,
      TurnState.WARLORD_RESOURCES,
    ][character] ?? TurnState.DONE;
  }

  jumpToNextCharacter() {
    const nextCharacter = this.getCurrentCharacter() + 1;
    this.jumpToCharacter(nextCharacter + (this.killedCharacter === nextCharacter ? 1 : 0));
  }

  jumpToBuildState() {
    this.turnState = [
      TurnState.ASSASSIN_BUILD,
      TurnState.THIEF_BUILD,
      TurnState.MAGICIAN_BUILD,
      TurnState.KING_BUILD,
      TurnState.BISHOP_BUILD,
      TurnState.MERCHANT_BUILD,
      TurnState.ARCHITECT_BUILD,
      TurnState.WARLORD_BUILD,
    ][this.getCurrentCharacter()] ?? this.turnState;
  }

  jumpToActionsState() {
    this.turnState = [
      TurnState.ASSASSIN_ACTIONS,
      TurnState.THIEF_ACTIONS,
      TurnState.MAGICIAN_ACTIONS,
      TurnState.KING_ACTIONS,
      TurnState.BISHOP_ACTIONS,
      TurnState.MERCHANT_ACTIONS,
      TurnState.ARCHITECT_ACTIONS,
      TurnState.WARLORD_ACTIONS,
    ][this.getCurrentCharacter()] ?? this.turnState;
  }

  isCharacterPlayable(character: CharacterType): boolean {
    switch (this.characters[character]) {
      case CharacterPosition.PLAYER_1:
      case CharacterPosition.PLAYER_2:
      case CharacterPosition.PLAYER_3:
      case CharacterPosition.PLAYER_4:
      case CharacterPosition.PLAYER_5:
      case CharacterPosition.PLAYER_6:
      case CharacterPosition.PLAYER_7:
        return character !== this.killedCharacter;
      default:
        return false;
    }
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

  getCurrentCharacter(): CharacterType {
    switch (this.turnState) {
      case TurnState.ASSASSIN_RESOURCES:
      case TurnState.ASSASSIN_CHOOSE_CARD:
      case TurnState.ASSASSIN_ACTIONS:
      case TurnState.ASSASSIN_KILL:
      case TurnState.ASSASSIN_BUILD:
        return CharacterType.ASSASSIN;
      case TurnState.THIEF_RESOURCES:
      case TurnState.THIEF_CHOOSE_CARD:
      case TurnState.THIEF_ACTIONS:
      case TurnState.THIEF_ROB:
      case TurnState.THIEF_BUILD:
        return CharacterType.THIEF;
      case TurnState.MAGICIAN_RESOURCES:
      case TurnState.MAGICIAN_CHOOSE_CARD:
      case TurnState.MAGICIAN_ACTIONS:
      case TurnState.MAGICIAN_EXCHANGE_HAND:
      case TurnState.MAGICIAN_DISCARD_CARDS:
      case TurnState.MAGICIAN_BUILD:
        return CharacterType.MAGICIAN;
      case TurnState.KING_RESOURCES:
      case TurnState.KING_CHOOSE_CARD:
      case TurnState.KING_ACTIONS:
      case TurnState.KING_BUILD:
        return CharacterType.KING;
      case TurnState.BISHOP_RESOURCES:
      case TurnState.BISHOP_CHOOSE_CARD:
      case TurnState.BISHOP_ACTIONS:
      case TurnState.BISHOP_BUILD:
        return CharacterType.BISHOP;
      case TurnState.MERCHANT_RESOURCES:
      case TurnState.MERCHANT_CHOOSE_CARD:
      case TurnState.MERCHANT_TAKE_1_GOLD:
      case TurnState.MERCHANT_ACTIONS:
      case TurnState.MERCHANT_BUILD:
        return CharacterType.MERCHANT;
      case TurnState.ARCHITECT_RESOURCES:
      case TurnState.ARCHITECT_CHOOSE_CARD:
      case TurnState.ARCHITECT_DRAW_2_CARDS:
      case TurnState.ARCHITECT_ACTIONS:
      case TurnState.ARCHITECT_BUILD:
        return CharacterType.ARCHITECT;
      case TurnState.WARLORD_RESOURCES:
      case TurnState.WARLORD_CHOOSE_CARD:
      case TurnState.WARLORD_ACTIONS:
      case TurnState.WARLORD_DESTROY_DISTRICT:
      case TurnState.WARLORD_BUILD:
      case TurnState.GRAVEYARD_RECOVER_DISTRICT:
        return CharacterType.WARLORD;
      default:
        return CharacterType.NONE;
    }
  }

  getCurrentPlayerPosition(): PlayerPosition {
    const pos = this.characters[this.getCurrentCharacter()];
    switch (pos) {
      case CharacterPosition.PLAYER_1:
      case CharacterPosition.PLAYER_2:
      case CharacterPosition.PLAYER_3:
      case CharacterPosition.PLAYER_4:
      case CharacterPosition.PLAYER_5:
      case CharacterPosition.PLAYER_6:
      case CharacterPosition.PLAYER_7:
        return pos - CharacterPosition.PLAYER_1;

      default:
        break;
    }

    return PlayerPosition.SPECTATOR;
  }

  getClientTurnState(): ClientTurnState {
    switch (this.turnState) {
      case TurnState.ASSASSIN_RESOURCES:
      case TurnState.THIEF_RESOURCES:
      case TurnState.MAGICIAN_RESOURCES:
      case TurnState.KING_RESOURCES:
      case TurnState.BISHOP_RESOURCES:
      case TurnState.MERCHANT_RESOURCES:
      case TurnState.ARCHITECT_RESOURCES:
      case TurnState.WARLORD_RESOURCES:
        return ClientTurnState.TAKE_RESOURCES;
      case TurnState.ASSASSIN_CHOOSE_CARD:
      case TurnState.THIEF_CHOOSE_CARD:
      case TurnState.MAGICIAN_CHOOSE_CARD:
      case TurnState.KING_CHOOSE_CARD:
      case TurnState.BISHOP_CHOOSE_CARD:
      case TurnState.MERCHANT_CHOOSE_CARD:
      case TurnState.ARCHITECT_CHOOSE_CARD:
      case TurnState.WARLORD_CHOOSE_CARD:
        return ClientTurnState.CHOOSE_CARD;
      case TurnState.ASSASSIN_ACTIONS:
      case TurnState.THIEF_ACTIONS:
      case TurnState.MAGICIAN_ACTIONS:
      case TurnState.KING_ACTIONS:
      case TurnState.BISHOP_ACTIONS:
      case TurnState.MERCHANT_ACTIONS:
      case TurnState.ARCHITECT_ACTIONS:
      case TurnState.WARLORD_ACTIONS:
        return ClientTurnState.CHOOSE_ACTION;
      case TurnState.ASSASSIN_KILL:
        return ClientTurnState.ASSASSIN_KILL;
      case TurnState.THIEF_ROB:
        return ClientTurnState.THIEF_ROB;
      case TurnState.MAGICIAN_EXCHANGE_HAND:
        return ClientTurnState.MAGICIAN_EXCHANGE_HAND;
      case TurnState.MAGICIAN_DISCARD_CARDS:
        return ClientTurnState.MAGICIAN_DISCARD_CARDS;
      case TurnState.MERCHANT_TAKE_1_GOLD:
        return ClientTurnState.MERCHANT_TAKE_1_GOLD;
      case TurnState.ARCHITECT_DRAW_2_CARDS:
        return ClientTurnState.ARCHITECT_DRAW_2_CARDS;
      case TurnState.WARLORD_DESTROY_DISTRICT:
        return ClientTurnState.WARLORD_DESTROY_DISTRICT;
      case TurnState.GRAVEYARD_RECOVER_DISTRICT:
        return ClientTurnState.GRAVEYARD_RECOVER_DISTRICT;
      case TurnState.ASSASSIN_BUILD:
      case TurnState.THIEF_BUILD:
      case TurnState.MAGICIAN_BUILD:
      case TurnState.KING_BUILD:
      case TurnState.BISHOP_BUILD:
      case TurnState.MERCHANT_BUILD:
      case TurnState.ARCHITECT_BUILD:
      case TurnState.WARLORD_BUILD:
        return ClientTurnState.BUILD_DISTRICT;
      case TurnState.DONE:
        return ClientTurnState.DONE;
      default:
        return ClientTurnState.INITIAL;
    }
  }

  exportPlayerCharacters(pos: PlayerPosition, dest: PlayerPosition) {
    // can see all cards if player is spectator, if cards are their own, or if turn phase has ended
    const canSee = dest === PlayerPosition.SPECTATOR
      || dest === pos
      || this.turnState === TurnState.DONE;
    const characterPos = pos + CharacterPosition.PLAYER_1 as CharacterPosition;
    const currentCharacter = this.getCurrentCharacter();

    // characters are sorted so that unknown characters are at the end of the list
    return this.getCharactersAtPosition(characterPos).map((id) => (
      (
        canSee || (id <= currentCharacter && id !== this.killedCharacter)
      ) ? id : CharacterType.CHARACTER_COUNT
    )).sort().map((id) => ({
      id: (id === CharacterType.CHARACTER_COUNT ? CharacterType.NONE : id) + 1,
      killed: id !== CharacterType.NONE && id === this.killedCharacter,
      robbed: id !== CharacterType.NONE && id === this.robbedCharacter,
    }));
  }

  exportCurrentPlayerExtraData() {
    const character = this.getCurrentCharacter();
    return {
      districtsToBuild: this.districtsToBuild[character],
      canTakeEarnings: this.canTakeEarnings[character],
      canDoSpecialAction: this.canDoSpecialAction[character],
    };
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
      current: this.getCurrentCharacter() + 1,
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
      current: this.getCurrentCharacter() + 1,
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
    let characters = this.getCharactersAtPosition(CharacterPosition.NOT_CHOSEN);

    if (index < 0 || index >= characters.length) {
      return false;
    }

    if (this.choosingState.getState().player === PlayerPosition.SPECTATOR) {
      return false;
    }

    switch (this.choosingState.getState().type) {
      case CCST.PUT_ASIDE_FACE_UP:
        this.characters[characters[index]] = CharacterPosition.ASIDE_FACE_UP;
        break;

      case CCST.PUT_ASIDE_FACE_DOWN:
        this.characters[characters[index]] = CharacterPosition.ASIDE_FACE_DOWN;
        break;

      case CCST.CHOOSE_CHARACTER:
        this.characters[characters[index]] = (
          this.choosingState.getState().player + CharacterPosition.PLAYER_1
        );
        break;

      default:
        // invalid state
        return false;
    }

    this.choosingState.step();

    // apply next automatic steps
    while (this.choosingState.getState().player === PlayerPosition.SPECTATOR) {
      characters = this.getCharactersAtPosition(CharacterPosition.NOT_CHOSEN);

      switch (this.choosingState.getState().type) {
        case CCST.GET_ASIDE_FACE_DOWN:
          this.characters[this.getCharactersAtPosition(CharacterPosition.ASIDE_FACE_DOWN)[0]] = (
            CharacterPosition.NOT_CHOSEN
          );
          break;

        case CCST.PUT_ASIDE_FACE_DOWN:
          this.characters[characters[0]] = CharacterPosition.ASIDE_FACE_DOWN;
          break;

        case CCST.DONE:
          return true;

        default:
      }

      this.choosingState.step();
    }

    return true;
  }

  shiftPlayerPosition(amount: number) {
    const offset = CharacterPosition.PLAYER_1;
    this.characters.forEach((character, i) => {
      switch (character) {
        case CharacterPosition.PLAYER_1:
        case CharacterPosition.PLAYER_2:
        case CharacterPosition.PLAYER_3:
        case CharacterPosition.PLAYER_4:
        case CharacterPosition.PLAYER_5:
        case CharacterPosition.PLAYER_6:
        case CharacterPosition.PLAYER_7:
          this.characters[i] = ((character - offset + amount) % this.playerCount) + offset;
          break;

        default:
          break;
      }
    });
  }
}
