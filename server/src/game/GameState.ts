import { Observer, Subject } from '../utils/observerPattern';
import BoardState, { GamePhase } from './BoardState';
import { CharacterType, TurnState } from './CharacterManager';
import { CharacterChoosingStateType as CCST } from './ChoosingState';
import GameSetupData from './GameSetupData';
import Move, { MoveType } from './Move';
import Player, { PlayerPosition, PlayerRole } from './Player';

export enum GameProgress {
  IN_LOBBY = 1,
  IN_GAME,
  FINISHED,
}

export default class GameState implements Subject {
  progress: GameProgress;
  players: Map<string, Player>;
  board: BoardState | undefined;
  completeCitySize: number;
  observers: Observer[];

  constructor(completeCitySize = 7) {
    this.progress = GameProgress.IN_LOBBY;
    this.players = new Map();
    this.board = undefined;
    this.completeCitySize = completeCitySize;
    this.observers = [];
  }

  containsPlayer(playerId: string | undefined) {
    if (playerId === undefined) { return false; }
    return this.players.has(playerId);
  }

  getPlayer(playerId: string | undefined) {
    if (playerId === undefined) { return undefined; }
    return this.players.get(playerId);
  }

  addPlayer(id: string, username: string, manager = false, online = true) {
    const player = new Player(id, username, manager, online);
    this.players.set(id, player);
    return player;
  }

  getStateFromPlayer(playerId: string | undefined) {
    if (playerId === undefined) { return undefined; }
    return {
      progress: this.progress,
      players: Array.from(this.players),
      self: playerId,
      board: this.board?.exportForPlayer(playerId),
    };
  }

  validateGameSetup(gameSetupData: GameSetupData): boolean {
    // check whether all player ids are valid (in the room)
    const roomPlayerIds = Array.from(this.players.keys());
    const validPlayerIds = gameSetupData.players.every(
      (playerId) => roomPlayerIds.includes(playerId),
    );
    if (!validPlayerIds) return false;

    // number of players must be between 2 and 7
    if (gameSetupData.players.length < 2 || gameSetupData.players.length > 7) return false;

    // all checks pass
    return true;
  }

  setupGame(gameSetupData: GameSetupData) {
    // initialize board
    const players: string[] = [];
    Array.from(this.players.keys()).forEach((playerId) => {
      const player = this.players.get(playerId);
      if (player) {
        if (gameSetupData.players.includes(playerId)) {
          player.role = PlayerRole.PLAYER;
          players.push(playerId);
        } else {
          player.role = PlayerRole.SPECTATOR;
        }
      }
    });
    this.board = new BoardState(players);
  }

  // step through the FSM and return whether the action is valid
  step(move = { type: MoveType.AUTO } as Move): boolean {
    switch (this.progress) {
      case GameProgress.IN_LOBBY:
        if (move.type === MoveType.AUTO) {
          this.progress = GameProgress.IN_GAME;
          return this.step(move);
        }
        break;

      case GameProgress.IN_GAME:
        switch (this.board?.turnPhase) {
          case GamePhase.INITIAL:
            if (move.type === MoveType.AUTO) {
              setTimeout(() => {
                if (this.board) {
                  this.board.turnPhase = GamePhase.CHOOSE_CHARACTERS;
                  this.step();
                  this.notify();
                }
              }, 3000);
              return true;
            }
            return false;

          case GamePhase.CHOOSE_CHARACTERS:
            {
              // get character choosing state
              const cm = this.board.characterManager;
              const ccs = cm.choosingState;
              switch (ccs.getState().type) {
                case CCST.INITIAL:
                  if (move.type === MoveType.AUTO) {
                    setTimeout(() => {
                      ccs.step();
                      this.notify();
                    }, 3000);
                    return true;
                  }
                  return false;

                case CCST.PUT_ASIDE_FACE_DOWN:
                  return move.type === MoveType.CHOOSE_CHARACTER && cm.chooseRandomCharacter();

                case CCST.PUT_ASIDE_FACE_UP:
                  return move.type === MoveType.CHOOSE_CHARACTER && cm.chooseRandomCharacter(true);

                case CCST.CHOOSE_CHARACTER:
                  return move.type === MoveType.CHOOSE_CHARACTER && cm.chooseCharacter(move.data);

                case CCST.DONE:
                  if (move.type === MoveType.AUTO) {
                    setTimeout(() => {
                      if (this.board) {
                        this.board.turnPhase = GamePhase.DO_ACTIONS;
                        this.notify();
                      }
                    }, 3000);
                    return true;
                  }
                  return false;

                default:
                  break;
              }
            }
            break;

          case GamePhase.DO_ACTIONS:
          {
            const cm = this.board.characterManager;

            // jump to next character automatically
            if (move.type === MoveType.AUTO && !cm.isCharacterPlayable(cm.getCurrentCharacter())) {
              cm.jumpToNextCharacter();
              setTimeout(() => {
                this.step();
                this.notify();
              }, 3000);
              return true;
            }

            if (move.type === MoveType.FINISH_TURN) {
              cm.jumpToNextCharacter();
              return true;
            }

            // player actions
            switch (cm.turnState) {
              case TurnState.ASSASSIN_RESOURCES:
              case TurnState.THIEF_RESOURCES:
              case TurnState.MAGICIAN_RESOURCES:
              case TurnState.KING_RESOURCES:
              case TurnState.BISHOP_RESOURCES:
              case TurnState.MERCHANT_RESOURCES:
              case TurnState.ARCHITECT_RESOURCES:
              case TurnState.WARLORD_RESOURCES:
                return this.gatherResources(move);

              case TurnState.ASSASSIN_CHOOSE_CARD:
              case TurnState.THIEF_CHOOSE_CARD:
              case TurnState.MAGICIAN_CHOOSE_CARD:
              case TurnState.KING_CHOOSE_CARD:
              case TurnState.BISHOP_CHOOSE_CARD:
              case TurnState.MERCHANT_CHOOSE_CARD:
              case TurnState.ARCHITECT_CHOOSE_CARD:
              case TurnState.WARLORD_CHOOSE_CARD:
                return this.chooseDistrictCard(move);

              case TurnState.ASSASSIN_BUILD:
              case TurnState.THIEF_BUILD:
              case TurnState.MAGICIAN_BUILD:
              case TurnState.KING_BUILD:
              case TurnState.BISHOP_BUILD:
              case TurnState.MERCHANT_BUILD:
              case TurnState.ARCHITECT_BUILD:
              case TurnState.WARLORD_BUILD:
                return this.buildDistrict(move);

              case TurnState.ASSASSIN_ACTIONS:
              case TurnState.THIEF_ACTIONS:
              case TurnState.MAGICIAN_ACTIONS:
              case TurnState.KING_ACTIONS:
              case TurnState.BISHOP_ACTIONS:
              case TurnState.MERCHANT_ACTIONS:
              case TurnState.ARCHITECT_ACTIONS:
              case TurnState.WARLORD_ACTIONS:
                return this.executeAction(move);

              case TurnState.ASSASSIN_KILL:
                return this.killCharacter(move);

              case TurnState.THIEF_ROB:
                return this.robCharacter(move);

              case TurnState.MAGICIAN_EXCHANGE_HAND:
                return this.exchangeHand(move);

              case TurnState.MAGICIAN_DISCARD_CARDS:
                return this.discardCards(move);

              case TurnState.WARLORD_DESTROY_DISTRICT:
                return this.destroyDistrict(move);

              default:
                break;
            }
            break;
          }

          default:
            this.progress = GameProgress.FINISHED;
            break;
        }
        break;

      case GameProgress.FINISHED:
        break;

      default:
    }
    return false;
  }

  private gatherResources(move: Move): boolean {
    if (!this.board) return false;
    const cm = this.board.characterManager;
    const player = this.board.players.get(this.board.getCurrentPlayerId());
    if (player === undefined) return false;

    switch (move.type) {
      case MoveType.TAKE_GOLD:
        player.stash += 2;
        // go to actions step
        cm.turnState += 2;
        break;

      case MoveType.DRAW_CARD:
        player.tmpHand = this.board.districtsDeck.drawCards(2);
        // go to card selection step
        cm.turnState += 1;
        break;

      default:
        return false;
    }

    return true;
  }

  private chooseDistrictCard(move: Move): boolean {
    if (move.type !== MoveType.DRAW_CARD) return false;

    if (!this.board) return false;
    const cm = this.board.characterManager;
    const player = this.board.players.get(this.board.getCurrentPlayerId());
    if (player === undefined) return false;

    // put requested card in player hand
    const index = player.tmpHand.indexOf(move.data);
    if (index !== -1) {
      player.addCardsToHand([move.data]);
      player.tmpHand.splice(index, 1);
    }

    // discard all other cards
    this.board.districtsDeck.discardCards(player.tmpHand);
    player.tmpHand = [];

    // go to actions step
    cm.jumpToActionsState();

    return true;
  }

  private buildDistrict(move: Move) {
    if (move.type !== MoveType.BUILD_DISTRICT) return false;

    if (!this.board) return false;
    const cm = this.board.characterManager;
    const player = this.board.players.get(this.board.getCurrentPlayerId());
    if (player === undefined) return false;

    // check that the current character can build
    if (cm.districtsToBuild[cm.getCurrentCharacter()] < 1) {
      return false;
    }

    // try to build district
    if (!player.buildDistrict(move.data)) {
      return false;
    }

    cm.districtsToBuild[cm.getCurrentCharacter()] -= 1;

    // go to actions step
    cm.jumpToActionsState();

    return true;
  }

  private executeAction(move: Move): boolean {
    if (!this.board) return false;
    const cm = this.board.characterManager;
    const player = this.board.players.get(this.board.getCurrentPlayerId());
    if (player === undefined) return false;

    switch (move.type) {
      // ============
      // change state
      // ============
      case MoveType.BUILD_DISTRICT:
        cm.jumpToBuildState();
        break;
      case MoveType.ASSASSIN_KILL:
        cm.turnState = TurnState.ASSASSIN_KILL;
        break;
      case MoveType.THIEF_ROB:
        cm.turnState = TurnState.THIEF_ROB;
        break;
      case MoveType.MAGICIAN_EXCHANGE_HAND:
        cm.turnState = TurnState.MAGICIAN_EXCHANGE_HAND;
        break;
      case MoveType.MAGICIAN_DISCARD_CARDS:
        cm.turnState = TurnState.MAGICIAN_DISCARD_CARDS;
        break;
      case MoveType.WARLORD_DESTROY_DISTRICT:
        cm.turnState = TurnState.WARLORD_DESTROY_DISTRICT;
        break;

      // ================
      // immediate action
      // ================
      case MoveType.TAKE_GOLD_EARNINGS:
        if (!cm.canTakeEarnings[cm.getCurrentCharacter()]) {
          return false;
        }
        // add coins to player stash
        player.stash += player.computeEarningsForCharacter(cm.getCurrentCharacter());
        // mark that earnings have been taken
        cm.canTakeEarnings[cm.getCurrentCharacter()] = false;
        break;
      case MoveType.MERCHANT_TAKE_1_GOLD:
        if (!cm.canDoSpecialAction[CharacterType.MERCHANT]) {
          return false;
        }
        player.stash += 1;
        cm.canDoSpecialAction[CharacterType.MERCHANT] = false;
        break;
      case MoveType.ARCHITECT_DRAW_2_CARDS:
        if (!cm.canDoSpecialAction[CharacterType.ARCHITECT]) {
          return false;
        }
        player.addCardsToHand(this.board.districtsDeck.drawCards(2));
        cm.canDoSpecialAction[CharacterType.ARCHITECT] = false;
        break;

      default:
        return false;
    }

    return true;
  }

  private killCharacter(move: Move) {
    if (move.type !== MoveType.ASSASSIN_KILL) return false;

    if (!this.board) return false;
    const cm = this.board.characterManager;
    const character = move.data as CharacterType;

    switch (character) {
      case CharacterType.THIEF:
      case CharacterType.MAGICIAN:
      case CharacterType.KING:
      case CharacterType.BISHOP:
      case CharacterType.MERCHANT:
      case CharacterType.ARCHITECT:
      case CharacterType.WARLORD:
        cm.killedCharacter = character;
        cm.canDoSpecialAction[CharacterType.ASSASSIN] = false;
        cm.jumpToActionsState();
        return true;

      default:
        return false;
    }
  }

  private robCharacter(move: Move) {
    if (move.type !== MoveType.THIEF_ROB) return false;

    if (!this.board) return false;
    const cm = this.board.characterManager;
    const character = move.data as CharacterType;

    switch (character) {
      case CharacterType.MAGICIAN:
      case CharacterType.KING:
      case CharacterType.BISHOP:
      case CharacterType.MERCHANT:
      case CharacterType.ARCHITECT:
      case CharacterType.WARLORD:
        cm.robbedCharacter = character;
        cm.canDoSpecialAction[CharacterType.THIEF] = false;
        cm.jumpToActionsState();
        return true;

      default:
        return false;
    }
  }

  private exchangeHand(move: Move) {
    if (move.type !== MoveType.MAGICIAN_EXCHANGE_HAND) return false;

    if (!this.board) return false;
    const cm = this.board.characterManager;
    const player = this.board.players.get(this.board.getCurrentPlayerId());
    if (player === undefined) return false;
    const otherPlayer = this.board.players.get(this.board.playerOrder[move.data]);
    if (otherPlayer === undefined) return false;

    // swap hands
    [player.hand, otherPlayer.hand] = [otherPlayer.hand, player.hand];
    cm.canDoSpecialAction[CharacterType.MAGICIAN] = false;
    cm.jumpToActionsState();
    return true;
  }

  private discardCards(move: Move) {
    if (move.type !== MoveType.MAGICIAN_DISCARD_CARDS) return false;
    if (!Array.isArray(move.data)) {
      return false;
    }

    if (!this.board) return false;
    const cm = this.board.characterManager;
    const player = this.board.players.get(this.board.getCurrentPlayerId());
    if (player === undefined) return false;

    // check that action is permitted
    if (!cm.canDoSpecialAction[CharacterType.MAGICIAN]) {
      return false;
    }

    // discard cards
    const cards: string[] = [];
    move.data.forEach((card) => {
      if (player.takeCardFromHand(`${card}`) !== null) {
        cards.push(`${card}`);
      }
    });
    this.board.districtsDeck.discardCards(cards);

    // take new cards
    player.addCardsToHand(this.board.districtsDeck.drawCards(cards.length));

    cm.canDoSpecialAction[CharacterType.MAGICIAN] = false;
    cm.jumpToActionsState();
    return true;
  }

  private destroyDistrict(move: Move) {
    if (move.type !== MoveType.WARLORD_DESTROY_DISTRICT) return false;
    const data = {
      player: move.data?.player as PlayerPosition,
      card: move.data?.card as string,
    };

    if (!this.board) return false;
    const cm = this.board.characterManager;
    const player = this.board.players.get(this.board.getCurrentPlayerId());
    if (player === undefined) return false;
    const otherPlayer = this.board.players.get(this.board.playerOrder[data.player]);
    if (otherPlayer === undefined) return false;

    // check that the current character can destroy
    if (cm.districtsToBuild[cm.getCurrentCharacter()] < 1) {
      return false;
    }

    // check that card can be destroyed
    if (data.card === 'dungeon' || !otherPlayer.hasCardInCity(data.card)) {
      return false;
    }

    // check that victim is not an alive bishop
    const isOtherPlayerBishop = cm.exportPlayerCharacters(data.player, PlayerPosition.SPECTATOR)
      .some((character) => character.id === CharacterType.BISHOP);
    if (isOtherPlayerBishop && cm.killedCharacter !== CharacterType.BISHOP) {
      return false;
    }

    // check that city is not complete
    if (otherPlayer.city.length >= this.completeCitySize) {
      return false;
    }

    // check cost
    const cost = otherPlayer.computeDestroyCost(data.card);
    if (player.stash < cost) {
      return false;
    }

    // destroy district
    player.stash -= cost;
    otherPlayer.destroyDistrict(data.card);
    this.board.districtsDeck.discardCards([data.card]);

    cm.canDoSpecialAction[CharacterType.WARLORD] = false;
    cm.jumpToActionsState();
    return true;
  }

  attach(observer: Observer): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(): void {
    this.observers.forEach((observer) => {
      observer.update();
    });
  }
}
