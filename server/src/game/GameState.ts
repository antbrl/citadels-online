import {
  Move,
  MoveType,
  ClientTurnState,
  GameProgress,
  PlayerRole,
  GamePhase,
  CharacterChoosingStateType as CCST,
  PlayerPosition,
  PlayerId,
  DistrictId,
} from 'citadels-common';
import Debug from 'debug';
import { Observer, Subject } from '../utils/observerPattern';
import BoardState from './BoardState';
import { CharacterPosition, CharacterType, TurnState } from './CharacterManager';

import GameSetupData from './GameSetupData';
import Player from './Player';

const debug = Debug('citadels-server');

export default class GameState implements Subject {
  progress: GameProgress;
  players: Map<PlayerId, Player>;
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

  containsPlayer(playerId: PlayerId | undefined) {
    if (playerId === undefined) { return false; }
    return this.players.has(playerId);
  }

  getPlayer(playerId: PlayerId | undefined) {
    if (playerId === undefined) { return undefined; }
    return this.players.get(playerId);
  }

  addPlayer(
    id: PlayerId,
    username: string,
    manager = false,
    online = true,
    role = PlayerRole.PLAYER,
  ) {
    const player = new Player(id, username, manager, online, role);
    this.players.set(id, player);
    return player;
  }

  getStateFromPlayer(playerId: PlayerId | undefined) {
    if (playerId === undefined) { return undefined; }
    return {
      progress: this.progress,
      players: Array.from(this.players),
      self: playerId,
      board: this.board?.exportForPlayer(playerId),
      settings: {
        completeCitySize: this.completeCitySize,
      },
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

    // settings
    if (![7, 8].includes(gameSetupData.completeCitySize)) return false;

    // all checks pass
    return true;
  }

  setupGame(gameSetupData: GameSetupData) {
    // settings
    this.completeCitySize = gameSetupData.completeCitySize;

    // initialize board
    const players: PlayerId[] = [];
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
    debug('------- STEP -------');
    debug('move', MoveType[move.type], move.data);
    debug('progress', GameProgress[this.progress]);
    debug('phase', this.board ? GamePhase[this.board.gamePhase] : undefined);

    switch (this.progress) {
      case GameProgress.IN_LOBBY:
        if (move.type === MoveType.AUTO) {
          this.progress = GameProgress.IN_GAME;
          return this.step(move);
        }
        break;

      case GameProgress.IN_GAME:
        switch (this.board?.gamePhase) {
          case GamePhase.INITIAL:
            if (move.type === MoveType.AUTO) {
              setTimeout(() => {
                if (this.board) {
                  this.board.gamePhase = GamePhase.CHOOSE_CHARACTERS;
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
                case CCST.PUT_ASIDE_FACE_DOWN_UP:
                  return move.type === MoveType.CHOOSE_CHARACTER && cm.chooseCharacter(move.data);

                case CCST.DONE:
                  if (move.type === MoveType.AUTO) {
                    setTimeout(() => {
                      if (this.board) {
                        this.board.gamePhase = GamePhase.DO_ACTIONS;
                        this.step();
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
            switch (move.type) {
              case MoveType.AUTO:
                if (cm.turnState === TurnState.DONE) {
                  setTimeout(() => {
                    this.finishTurnPhase();
                    this.step();
                    this.notify();
                  }, 5000);
                  return true;
                }
                if (!cm.isCharacterPlayable(cm.getCurrentCharacter())) {
                  setTimeout(() => {
                    cm.jumpToNextCharacter();
                    if (cm.getCurrentCharacter() === cm.robbedCharacter) {
                      this.moveRobbedGold();
                    }
                    if (cm.getCurrentCharacter() === CharacterType.KING
                        && cm.killedCharacter !== CharacterType.KING) {
                      this.giveCrownToKing();
                    }
                    this.step();
                    this.notify();
                  }, 3000);
                  return true;
                }
                return false;
              case MoveType.DECLINE:
                return this.decline();
              case MoveType.SMITHY_DRAW_CARDS:
              case MoveType.LABORATORY_DISCARD_CARD:
                return this.doSpecialAction(move);
              case MoveType.FINISH_TURN:
                if (cm.getClientTurnState() !== ClientTurnState.CHOOSE_ACTION) return false;
                cm.jumpToNextCharacter();
                if (cm.getCurrentCharacter() === cm.robbedCharacter) {
                  this.moveRobbedGold();
                }
                if (cm.getCurrentCharacter() === CharacterType.KING
                    && cm.killedCharacter !== CharacterType.KING) {
                  this.giveCrownToKing();
                }
                return true;

              default:
                break;
            }

            // player actions
            switch (cm.getClientTurnState()) {
              case ClientTurnState.TAKE_RESOURCES:
              case ClientTurnState.CHOOSE_ACTION:
                return this.executeAction(move);
              case ClientTurnState.CHOOSE_CARD:
                return this.chooseDistrictCard(move);
              case ClientTurnState.BUILD_DISTRICT:
                return this.buildDistrict(move);
              case ClientTurnState.ASSASSIN_KILL:
                return this.killCharacter(move);
              case ClientTurnState.THIEF_ROB:
                return this.robCharacter(move);
              case ClientTurnState.MAGICIAN_EXCHANGE_HAND:
                return this.exchangeHand(move);
              case ClientTurnState.MAGICIAN_DISCARD_CARDS:
                return this.discardCards(move);
              case ClientTurnState.MERCHANT_TAKE_1_GOLD:
                return this.takeOneGold(move);
              case ClientTurnState.ARCHITECT_DRAW_2_CARDS:
                return this.drawTwoCards(move);
              case ClientTurnState.WARLORD_DESTROY_DISTRICT:
                return this.destroyDistrict(move);
              case ClientTurnState.GRAVEYARD_RECOVER_DISTRICT:
                return this.recoverFromGraveyard(move);
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

  private finishTurnPhase(): boolean {
    if (!this.board) return false;
    const cm = this.board.characterManager;

    this.giveCrownToKing();

    // clean graveyard
    if (this.board.graveyard !== undefined) {
      this.board.districtsDeck.discardCards([this.board.graveyard]);
      this.board.graveyard = undefined;
    }

    const isEndOfGame = Array.from(this.board.players.values()).some(
      (player) => player.city.length >= this.completeCitySize,
    );

    if (isEndOfGame) {
      this.computeScores();
      this.progress = GameProgress.FINISHED;
    } else {
      this.board.gamePhase = GamePhase.CHOOSE_CHARACTERS;
      cm.reset();
    }

    return true;
  }

  private computeScores() {
    this.board?.players.forEach((player) => {
      player.computeScore(this.completeCitySize);
    });
  }

  private decline(): boolean {
    if (!this.board) return false;
    const cm = this.board.characterManager;

    if (cm.isUsingLaboratory) {
      cm.isUsingLaboratory = false;
      return true;
    }

    switch (cm.getClientTurnState()) {
      case ClientTurnState.ASSASSIN_KILL:
      case ClientTurnState.THIEF_ROB:
      case ClientTurnState.MAGICIAN_EXCHANGE_HAND:
      case ClientTurnState.MAGICIAN_DISCARD_CARDS:
      case ClientTurnState.WARLORD_DESTROY_DISTRICT:
      case ClientTurnState.BUILD_DISTRICT:
      case ClientTurnState.GRAVEYARD_RECOVER_DISTRICT:
        break;
      case ClientTurnState.MERCHANT_TAKE_1_GOLD:
        cm.canDoSpecialAction[CharacterType.MERCHANT] = false;
        break;
      case ClientTurnState.ARCHITECT_DRAW_2_CARDS:
        cm.canDoSpecialAction[CharacterType.ARCHITECT] = false;
        break;

      default:
        return false;
    }

    cm.jumpToActionsState();
    return true;
  }

  private doSpecialAction(move: Move): boolean {
    if (!this.board) return false;
    const cm = this.board.characterManager;
    const player = this.board.players.get(this.board.getCurrentPlayerId());
    if (player === undefined) return false;

    switch (cm.getClientTurnState()) {
      case ClientTurnState.TAKE_RESOURCES:
      case ClientTurnState.CHOOSE_ACTION:
        switch (move.type) {
          case MoveType.SMITHY_DRAW_CARDS:
            // check that player has not already used smithy
            if (cm.hasUsedSmithy) {
              return false;
            }

            // check that player has smithy
            if (!player.city.includes('smithy')) {
              return false;
            }

            // check that player has enough gold
            if (player.stash < 2) {
              return false;
            }

            // draw cards
            player.stash -= 2;
            player.addCardsToHand(this.board.districtsDeck.drawCards(3));
            cm.hasUsedSmithy = true;
            break;

          case MoveType.LABORATORY_DISCARD_CARD:
            // check that player can use laboratory
            if (cm.hasUsedLaboratory || !player.city.includes('laboratory')) {
              return false;
            }

            // go into laboratory mode
            cm.isUsingLaboratory = true;
            break;

          default:
            return false;
        }
        break;

      case ClientTurnState.LABORATORY_DISCARD_CARD:
      {
        if (move.type !== MoveType.LABORATORY_DISCARD_CARD) {
          return false;
        }

        if (!cm.isUsingLaboratory) {
          return false;
        }

        const card = move.data;
        if (player.takeCardFromHand(card) === null) {
          return false;
        }
        this.board.districtsDeck.discardCards(card);
        player.stash += 2;
        cm.isUsingLaboratory = false;
        cm.hasUsedLaboratory = true;
        break;
      }

      default:
        return false;
    }

    return true;
  }

  private gatherResources(move: Move): boolean {
    if (!this.board) return false;
    const cm = this.board.characterManager;
    if (cm.hasTakenResources) return false;
    const player = this.board.players.get(this.board.getCurrentPlayerId());
    if (player === undefined) return false;

    switch (move.type) {
      case MoveType.TAKE_GOLD:
        player.stash += 2;
        cm.hasTakenResources = true;
        break;

      case MoveType.DRAW_CARDS:
      {
        const hasObservatory = player.city.includes('observatory');
        const hasLibrary = player.city.includes('library');

        // draw cards
        const cards = this.board.districtsDeck.drawCards(hasObservatory ? 3 : 2);

        if (hasLibrary) {
          // drawn cards go straight to hand
          player.addCardsToHand(cards);
          cm.hasTakenResources = true;
        } else {
          // put drawn cards in selection space
          player.tmpHand = cards;
          // go to card selection step
          cm.turnState += 1;
        }

        break;
      }

      default:
        return false;
    }

    return true;
  }

  private chooseDistrictCard(move: Move): boolean {
    if (move.type !== MoveType.DRAW_CARDS) return false;

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

    cm.hasTakenResources = true;
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

    // mark first complete city
    if (player.city.length >= this.completeCitySize
        && ![...this.board.players.values()].some((p) => p.firstToCompleteCity)) {
      player.firstToCompleteCity = true;
    }

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
      // ================
      // gather resources
      // ================
      case MoveType.TAKE_GOLD:
      case MoveType.DRAW_CARDS:
        if (cm.getClientTurnState() !== ClientTurnState.TAKE_RESOURCES) return false;
        return this.gatherResources(move);

      // ============
      // change state
      // ============
      case MoveType.BUILD_DISTRICT:
        if (cm.getClientTurnState() !== ClientTurnState.CHOOSE_ACTION) return false;
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
    const character = move.data - 1 as CharacterType;

    debug('rob', move.data ? CharacterType[character] : undefined)

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
    const character = move.data - 1 as CharacterType;

    debug('rob', move.data ? CharacterType[character] : undefined)

    switch (character) {
      case CharacterType.MAGICIAN:
      case CharacterType.KING:
      case CharacterType.BISHOP:
      case CharacterType.MERCHANT:
      case CharacterType.ARCHITECT:
      case CharacterType.WARLORD:
        // check that robbed character is not killed
        if (character === cm.killedCharacter) return false;

        cm.robbedCharacter = character;
        cm.canDoSpecialAction[CharacterType.THIEF] = false;
        cm.jumpToActionsState();
        return true;

      default:
        return false;
    }
  }

  private moveRobbedGold() {
    if (!this.board) return false;
    const cm = this.board.characterManager;

    const thiefPlayer = this.board.players.get(
      this.board.playerOrder[cm.characters[CharacterType.THIEF] - CharacterPosition.PLAYER_1],
    );
    if (thiefPlayer === undefined) return false;
    const robbedPlayer = this.board.players.get(this.board.getCurrentPlayerId());
    if (robbedPlayer === undefined) return false;

    if (thiefPlayer !== robbedPlayer) {
      thiefPlayer.stash += robbedPlayer.stash;
      robbedPlayer.stash = 0;
    }

    return true;
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
    const cards: DistrictId[] = [];
    move.data.forEach((card) => {
      if (player.takeCardFromHand(card) !== null) {
        cards.push(card);
      }
    });
    this.board.districtsDeck.discardCards(cards);

    // take new cards
    player.addCardsToHand(this.board.districtsDeck.drawCards(cards.length));

    cm.canDoSpecialAction[CharacterType.MAGICIAN] = false;
    cm.jumpToActionsState();
    return true;
  }

  private takeOneGold(move: Move) {
    if (move.type !== MoveType.MERCHANT_TAKE_1_GOLD) return false;
    if (!this.board) return false;
    const cm = this.board.characterManager;
    const player = this.board.players.get(this.board.getCurrentPlayerId());
    if (player === undefined) return false;

    // check that action is permitted
    if (!cm.canDoSpecialAction[CharacterType.MERCHANT]) {
      return false;
    }

    // add 1 to stash
    player.stash += 1;

    cm.canDoSpecialAction[CharacterType.MERCHANT] = false;
    cm.jumpToActionsState();
    return true;
  }

  private drawTwoCards(move: Move) {
    if (move.type !== MoveType.ARCHITECT_DRAW_2_CARDS) return false;
    if (!this.board) return false;
    const cm = this.board.characterManager;
    const player = this.board.players.get(this.board.getCurrentPlayerId());
    if (player === undefined) return false;

    // check that action is permitted
    if (!cm.canDoSpecialAction[CharacterType.ARCHITECT]) {
      return false;
    }

    // draw 2 cards
    player.addCardsToHand(this.board.districtsDeck.drawCards(2));

    cm.canDoSpecialAction[CharacterType.ARCHITECT] = false;
    cm.jumpToActionsState();
    return true;
  }

  private destroyDistrict(move: Move) {
    if (move.type !== MoveType.WARLORD_DESTROY_DISTRICT) return false;
    const data = {
      player: move.data?.player as PlayerPosition,
      card: move.data?.card as DistrictId,
    };

    if (!this.board) return false;
    const cm = this.board.characterManager;
    const player = this.board.players.get(this.board.getCurrentPlayerId());
    if (player === undefined) return false;
    const otherPlayer = this.board.players.get(this.board.playerOrder[data.player]);
    if (otherPlayer === undefined) return false;

    // check that the current character can destroy
    if (!cm.canDoSpecialAction[CharacterType.WARLORD]) {
      return false;
    }

    // check that card can be destroyed
    if (data.card === 'keep' || !otherPlayer.hasCardInCity(data.card)) {
      return false;
    }

    // check that victim is not an alive bishop
    const isOtherPlayerBishop = (
      cm.characters[CharacterType.BISHOP] === data.player - CharacterPosition.PLAYER_1
    );
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

    // destroy district (move to graveyard)
    player.stash -= cost;
    otherPlayer.destroyDistrict(data.card);
    this.board.graveyard = data.card;

    cm.canDoSpecialAction[CharacterType.WARLORD] = false;

    // special state for graveyard
    if (this.canRecoverFromGraveyard()) {
      cm.turnState = TurnState.GRAVEYARD_RECOVER_DISTRICT;
    } else {
      cm.jumpToActionsState();
    }

    return true;
  }

  private canRecoverFromGraveyard() {
    if (!this.board) return false;
    const cm = this.board.characterManager;

    // get player with graveyard
    const playerBoardEntry = [...this.board.players].find((p) => p[1].city.includes('graveyard'));

    // check that this player exists
    if (playerBoardEntry === undefined) {
      return false;
    }

    const [playerId, playerBoard] = playerBoardEntry;

    // check that this player has at least 1 gold
    if (playerBoard.stash < 1) {
      return false;
    }

    // check that this player is not a warlord
    if (cm.characters[CharacterType.WARLORD]
        === this.board.playerOrder.indexOf(playerId) + CharacterPosition.PLAYER_1) {
      return false;
    }

    return true;
  }

  private recoverFromGraveyard(move: Move) {
    if (move.type !== MoveType.GRAVEYARD_RECOVER_DISTRICT) return false;

    if (!this.board) return false;
    const cm = this.board.characterManager;
    const player = this.board.players.get(this.board.getCurrentPlayerId());
    if (player === undefined) return false;

    // check that graveyard is not empty
    if (this.board.graveyard === undefined) {
      return false;
    }

    // check that player has graveyard
    if (!player.city.includes('graveyard')) {
      return false;
    }

    // check that player has at least 1 gold
    if (player.stash < 1) {
      return false;
    }

    // check that player is not a warlord
    if (cm.characters[CharacterType.WARLORD]
        === this.board.getCurrentPlayerPosition() + CharacterPosition.PLAYER_1) {
      return false;
    }

    // take 1 gold from stash
    player.stash -= 1;

    // take card from graveyard
    player.addCardsToHand([this.board.graveyard]);
    this.board.graveyard = undefined;

    cm.jumpToActionsState();

    return true;
  }

  private giveCrownToKing() {
    if (!this.board) return false;
    const cm = this.board.characterManager;

    // get king position
    const position = cm.characters[CharacterType.KING];
    switch (position) {
      case CharacterPosition.PLAYER_2:
      case CharacterPosition.PLAYER_3:
      case CharacterPosition.PLAYER_4:
      case CharacterPosition.PLAYER_5:
      case CharacterPosition.PLAYER_6:
      case CharacterPosition.PLAYER_7:
      {
        // get player at position
        const playerPos = position - CharacterPosition.PLAYER_1;
        // shift player order
        this.board.playerOrder.push(...this.board.playerOrder.splice(0, playerPos));
        // shift character position
        cm.shiftPlayerPosition(playerPos);
        return true;
      }

      default:
        return false;
    }
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
