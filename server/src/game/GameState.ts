import { Observer, Subject } from '../utils/observerPattern';
import BoardState, { TurnPhase } from './BoardState';
import { CharacterChoosingStateType as CCST } from './ChoosingState';
import GameSetupData from './GameSetupData';
import Move, { MoveType } from './Move';
import Player, { PlayerRole } from './Player';

export enum GameProgress {
  IN_LOBBY = 1,
  IN_GAME,
  FINISHED,
}

export default class GameState implements Subject {
  progress: GameProgress;
  players: Map<string, Player>;
  board: BoardState | undefined;
  observers: Observer[];

  constructor() {
    this.progress = GameProgress.IN_LOBBY;
    this.players = new Map();
    this.board = undefined;
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
          case TurnPhase.CHOOSE_CHARACTERS:
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
                case CCST.PUT_ASIDE_FACE_UP:
                  return move.type === MoveType.CHOOSE_CHARACTER && cm.chooseRandomCharacter();

                case CCST.CHOOSE_CHARACTER:
                  return move.type === MoveType.CHOOSE_CHARACTER && cm.chooseCharacter(move.data);

                default:
                  break;
              }
            }
            break;

          case TurnPhase.DO_ACTIONS:
            break;
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
