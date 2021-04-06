import BoardState from './BoardState';
import GameSetupData from './GameSetupData';
import Player, { PlayerRole } from './Player';

export enum GameProgress {
  IN_LOBBY = 1,
  IN_GAME,
  FINISHED,
}

export default class GameState {
  progress: GameProgress;
  players: Map<string, Player>;
  board: BoardState | undefined;

  constructor() {
    this.progress = GameProgress.IN_LOBBY;
    this.players = new Map();
    this.board = undefined;
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
      board: this.board?.exportForPlayer(this.getPlayer(playerId)),
    };
  }

  validateGameSetup(gameSetupData: GameSetupData): boolean {
    const roomPlayerIds = Array.from(this.players.keys());
    const validPlayerIds = gameSetupData.players.every(
      (playerId) => roomPlayerIds.includes(playerId),
    );
    return validPlayerIds;
  }

  setupGame(gameSetupData: GameSetupData) {
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
    this.progress = GameProgress.IN_GAME;
  }
}
