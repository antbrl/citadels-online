import Player from './Player';

export enum GameProgress {
  IN_LOBBY = 1,
  IN_GAME,
  FINISHED,
}

export default class GameState {
  progress: GameProgress;
  players: Map<string, Player>;

  constructor() {
    this.progress = GameProgress.IN_LOBBY;
    this.players = new Map();
  }

  containsPlayer(playerId: string) {
    return this.players.has(playerId);
  }

  getPlayer(playerId: string) {
    return this.players.get(playerId);
  }

  addPlayer(id: string, username: string, manager = false, online = true) {
    const player = new Player(id, username, manager, online);
    this.players.set(id, player);
    return player;
  }

  getStateFromPlayer(playerId: string) {
    return {
      progress: this.progress,
      players: Array.from(this.players),
      self: playerId,
    };
  }
}
